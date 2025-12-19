import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PCA } from 'ml-pca';

// 模型配置接口
interface ModelConfig {
  API: string;
  model: string;
}

// LLM 客户端缓存
const llmClients: Record<string, OpenAI> = {};

// 根据 API 提供商获取 LLM 客户端
function getLLMClient(apiProvider: string): OpenAI {
  // 标准化为大写以确保缓存一致性
  const normalizedProvider = apiProvider.toUpperCase();

  // 如果已缓存，直接返回
  if (llmClients[normalizedProvider]) {
    return llmClients[normalizedProvider];
  }

  // 根据 API 提供商选择对应的环境变量
  let apiKey: string | undefined;
  let baseURL: string | undefined;

  switch (normalizedProvider) {
    case 'SILICONFLOW':
      apiKey = process.env.SILICONFLOW_API_KEY;
      baseURL = process.env.SILICONFLOW_BASE_URL;
      break;
    case 'SHENGSUAN':
      apiKey = process.env.SHENGSUAN_API_KEY;
      baseURL = process.env.SHENGSUAN_BASE_URL;
      break;
    case 'XIAOHUMI':
      apiKey = process.env.XIAOHUMI_API_KEY;
      baseURL = process.env.XIAOHUMI_BASE_URL;
      break;
    case 'OPENAIHK':
      apiKey = process.env.OPENAIHK_API_KEY;
      baseURL = process.env.OPENAIHK_BASE_URL;
      break;
    default:
      throw new Error(
        `Unsupported API provider: ${apiProvider}. ` +
        `Supported providers: SILICONFLOW, SHENGSUAN, XIAOHUMI, OPENAIHK`
      );
  }

  if (!apiKey || !baseURL) {
    throw new Error(`Missing API key or base URL for provider: ${apiProvider}`);
  }

  // 创建并缓存客户端（使用标准化的 key）
  llmClients[normalizedProvider] = new OpenAI({
    apiKey,
    baseURL,
  });

  return llmClients[normalizedProvider];
}

// Embedding 客户端（固定使用 SILICONFLOW）
let emb: OpenAI | null = null;

function getEmbClient() {
  if (!emb) {
    emb = new OpenAI({
      apiKey: process.env.SILICONFLOW_API_KEY,
      baseURL: process.env.SILICONFLOW_BASE_URL,
    });
  }
  return emb;
}

//统一设置模型
// const llmModel = 'gpt-5-mini';
const embModel = 'Qwen/Qwen3-Embedding-0.6B';

function parseResponses(text: string, k: number): string[] {
    // 先移除可能的外层 <responses> 标签
    text = text.replace(/<\/?responses>/g, '');

    // 策略1：严格匹配完整格式
    const strictRegex = /<\s*response\s*>\s*<\s*text\s*>([\s\S]*?)<\s*\/\s*text\s*>\s*<\s*probability\s*>[\s\S]*?<\s*\/\s*probability\s*>\s*<\s*\/\s*response\s*>/gi;

    const responses: string[] = [];
    let match;

    while ((match = strictRegex.exec(text)) !== null) {
        const content = match[1].trim();
        if (content) {
            responses.push(content);
        }
    }

    // 策略2：如果严格匹配失败，使用超级宽松的解析
    if (responses.length !== k) {
        console.log('严格匹配失败，启用宽松解析模式');

        // 找到所有 <xxx> 标签的位置，作为分隔符
        const tagRegex = /<[^>]+>/g;
        const segments: string[] = [];

        let lastIndex = 0;
        while ((match = tagRegex.exec(text)) !== null) {
            // 提取两个标签之间的内容
            const segment = text.slice(lastIndex, match.index).trim();
            if (segment) {
                segments.push(segment);
            }
            lastIndex = match.index + match[0].length;
        }

        // 处理最后一段
        const lastSegment = text.slice(lastIndex).trim();
        if (lastSegment) {
            segments.push(lastSegment);
        }

        console.log('提取到的片段数量:', segments.length);
        console.log('片段内容:', segments);

        // 每两个片段组成一对：第一个是text，第二个是probability
        for (let i = 0; i < segments.length; i += 2) {
            const textContent = segments[i];
            const probContent = segments[i + 1];

            // 验证：text应该是文字，probability应该是数字
            if (textContent && textContent.length > 5) {
                // 如果下一个片段看起来像数字，就跳过；否则保留
                if (!probContent || isNaN(parseFloat(probContent))) {
                    // 没有配对的probability，直接使用text
                    responses.push(textContent);
                } else {
                    // 有配对的probability，也使用text
                    responses.push(textContent);
                }
            }
        }

        console.log('宽松模式解析结果数量:', responses.length);
    }

    // 不截断，返回所有提取到的内容
    return responses;
}


function cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0; // 避免除以零
    }
    return dotProduct / (magnitudeA * magnitudeB);
}

function cosineDistance(vecA: number[], vecB: number[]): number {
    return 1 - cosineSimilarity(vecA, vecB);
}

function average(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function calcCentroid(vectors: number[][]): number[] {
    const length = vectors[0].length;
    const avgVector = new Array(length).fill(0);

    for (const vector of vectors) {
        for (let i = 0; i < length; i++) {
            avgVector[i] += vector[i];
        }
    }

    for (let i = 0; i < length; i++) {
        avgVector[i] /= vectors.length;
    }

    return avgVector;
}

function median(arr: number[]): number {
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
        return sorted[mid];
    }
}

//POST 请求处理函数（流式响应版本）
export async function POST(request: Request) {
    try {
        //这里写后续的步骤
        
        //1. 接受用户的问题和参数
        const body = await request.json();
        const { question, temperature = 1.5, model, k = 5 } = body;

        // 解析模型配置
        const modelConfig: ModelConfig = typeof model === 'string'
            ? JSON.parse(model)
            : model;

        // 验证模型配置
        if (!modelConfig || !modelConfig.API || !modelConfig.model) {
            return NextResponse.json(
                { error: '无效的模型配置' },
                { status: 400 }
            );
        }
        
        //2. 验证输入的长度
        if (!question || typeof question !== 'string') {
            return NextResponse.json(
                { error: '无效的输入格式' },
                { status: 400 }
            );
        }

        // 限制问题长度不超过50字符
        if (question.length > 50) {
            return NextResponse.json(
                { error: '问题过长' },
                { status: 400 }
            );
        }

        // 防御性编程
        const sanitizedQuestion = question.trim().slice(0, 50);

        // 创建流式响应
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    /**
                     * 辅助函数：发送 SSE 事件到客户端
                     * @param step - 事件类型，可选值：
                     *   - 'prompts': 系统提示词已生成
                     *   - 'std_complete': 标准方法回答完成
                     *   - 'vs_complete': Verbalized Sampling 回答完成
                     *   - 'embedding_complete': Embedding 计算完成
                     *   - 'metrics_complete': 指标和可视化数据完成
                     *   - 'error': 错误信息
                     * @param data - 事件相关的数据对象
                     */
                    const sendEvent = (step: string, data: any) => {
                        const message = `data: ${JSON.stringify({ step, data })}\n\n`;
                        controller.enqueue(encoder.encode(message));
                    };
                    
                    //3. 构造2种提示词
                    const stdSystemPromptbase = `你是一个乐于助人的助手。对于每一个提问，请生成一组共${k}个可能的回答，每个回答需包含在一个单独的 <response> 标签内。每个回答都应包含一个 <text> 和一个数值 <probability>。请从 [完整分布] 中进行随机采样。`;
                    const vsSystemPromptbase = `你是一个乐于助人的助手。对于每一个提问，请生成一组共${k}个可能的回答，每个回答需包含在一个单独的 <response> 标签内。每个回答都应包含一个 <text> 和一个数值 <probability>。请从 [分布的尾部，即每个回答的概率需小于 0.10] 中进行随机采样。`;
                    const formatInstruction = `重要格式要求：
1. 每个回答必须严格按照以下格式输出，标签之间不要有空行或换行：
<response><text>你的回答内容</text><probability>X.XX</probability></response>
2. 不要添加任何其他标签（如 <responses>、<title>、<reason> 等）
3. 不要在标签中添加空格（错误示例：< text >、</ response>）
4. 必须生成恰好${k}个完整的 <response> 标签
5. probability 的值应该在 0.00 到 1.00 之间
请立即生成${k}个回答，不要包含任何额外的文字说明。`;
                    // 将格式要求附加到提示词中
                    const stdSystemPrompt = `${stdSystemPromptbase}\n\n${formatInstruction}`;
                    const vsSystemPrompt = `${vsSystemPromptbase}\n\n${formatInstruction}`;

                    // 发送提示词信息(包含系统提示词和用户提示词)
                    sendEvent('prompts', {
                        stdSystemPrompt,
                        vsSystemPrompt,
                        userPrompt: sanitizedQuestion,
                    });

                    //4. 并行调用LLM - 标准方法和VS方法
                    console.log("开始并行生成标准回答和Verbalized Sampling回答...");
                    console.log("使用模型配置:", modelConfig);

                    const llmClient = getLLMClient(modelConfig.API);

                    // 并行执行两个LLM调用以减少总等待时间
                    const [stdCompletion, vsCompletion] = await Promise.all([
                        llmClient.chat.completions.create({
                            model: modelConfig.model,
                            messages: [
                                { role: 'system', content: stdSystemPrompt },
                                { role: 'user', content: sanitizedQuestion }
                            ],
                            temperature: temperature,
                            max_tokens: 4096,
                            enable_thinking: false,
                        } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming),
                        llmClient.chat.completions.create({
                            model: modelConfig.model,
                            messages: [
                                { role: 'system', content: vsSystemPrompt },
                                { role: 'user', content: sanitizedQuestion }
                            ],
                            temperature: temperature,
                            max_tokens: 4096,
                            enable_thinking: false,
                        } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming)
                    ]);

                    // 处理标准方法结果
                    const stdText = stdCompletion.choices[0]?.message?.content || '';
                    console.log("=== 标准方法返回的原始文本 ====");
                    console.log(stdText);

                    const stdResponses = parseResponses(stdText, k);
                    console.log('标准方法解析到的回答数量:', stdResponses.length);

                    if (stdResponses.length < k) {
                        sendEvent('error', {
                            message: `标准方法返回的答案数量不足${k}个，请尝试降低 Temperature 值或切换模型后重试`,
                            stdCount: stdResponses.length,
                        });
                        controller.close();
                        return;
                    }

                    const stdResponsesSliced = stdResponses.slice(0, k);

                    // 发送标准方法完成事件
                    sendEvent('std_complete', {
                        responses: stdResponsesSliced,
                        rawText: stdText,
                    });

                    // 处理VS方法结果
                    const vsText = vsCompletion.choices[0]?.message?.content || '';
                    console.log("=== Verbalized Sampling 返回的原始文本 ====");
                    console.log(vsText);

                    const vsResponses = parseResponses(vsText, k);
                    console.log('VS方法解析到的回答数量:', vsResponses.length);

                    if (vsResponses.length < k) {
                        sendEvent('error', {
                            message: `VS方法返回的答案数量不足${k}个，请尝试降低 Temperature 值或切换模型后重试`,
                            vsCount: vsResponses.length,
                        });
                        controller.close();
                        return;
                    }

                    const vsResponsesSliced = vsResponses.slice(0, k);

                    // 发送VS方法完成事件
                    sendEvent('vs_complete', {
                        responses: vsResponsesSliced,
                        rawText: vsText,
                    });

                    //6. 获取embedding
                    const allResponses = [...stdResponsesSliced, ...vsResponsesSliced];

                    console.log("开始生成Embedding...");
                    const embClient = getEmbClient();
                    const embeddingResponse = await embClient.embeddings.create({
                        model: embModel,
                        input: allResponses,
                    });

                    const embeddings = embeddingResponse.data.map(item => item.embedding);

                    // 发送embedding完成事件
                    sendEvent('embedding_complete', {
                        message: 'Embedding计算完成',
                    });

                    //7. 计算余弦距离（相似度）
                    const stdEmbeddings = embeddings.slice(0, k);
                    const verbalizedEmbeddings = embeddings.slice(k, k * 2);

                    const stdIntraDis: number[] = [];
                    for (let i = 0; i < stdEmbeddings.length; i++) {
                        for (let j = i + 1; j < stdEmbeddings.length; j++) {
                            stdIntraDis.push(
                                cosineDistance(stdEmbeddings[i], stdEmbeddings[j])
                            );
                        }
                    }

                    const vsIntraDis: number[] = [];
                    for (let i = 0; i < verbalizedEmbeddings.length; i++) {
                        for (let j = i + 1; j < verbalizedEmbeddings.length; j++) {
                            vsIntraDis.push(
                                cosineDistance(verbalizedEmbeddings[i], verbalizedEmbeddings[j])
                            );
                        }
                    }

                    const interDis: number[] = [];
                    for (let i = 0; i < stdEmbeddings.length; i++) {
                        for (let j = 0; j < verbalizedEmbeddings.length; j++) {
                            interDis.push(
                                cosineDistance(stdEmbeddings[i], verbalizedEmbeddings[j])
                            );
                        }
                    }

                    //8. 计算指标
                    const stdIntraDistance = average(stdIntraDis);
                    const vsIntraDistance = average(vsIntraDis);
                    const interDistance = average(interDis);
                    const stdCentroid = calcCentroid(stdEmbeddings);
                    const vsCentroid = calcCentroid(verbalizedEmbeddings);
                    const centroidDistance = cosineDistance(stdCentroid, vsCentroid);

                    //9. PCA降维
                    const pca = new PCA(embeddings);
                    const embedding2D = pca.predict(embeddings, { nComponents: 2 }).to2DArray();
                    const embedding3D = pca.predict(embeddings, { nComponents: 3 }).to2DArray();

                    //10. 计算2D空间中的质心和中位半径
                    const std2DPoints = embedding2D.slice(0, k);
                    const vs2DPoints = embedding2D.slice(k, k * 2);

                    const std2DCentroidX = std2DPoints.reduce((sum, p) => sum + p[0], 0) / std2DPoints.length;
                    const std2DCentroidY = std2DPoints.reduce((sum, p) => sum + p[1], 0) / std2DPoints.length;

                    const vs2DCentroidX = vs2DPoints.reduce((sum, p) => sum + p[0], 0) / vs2DPoints.length;
                    const vs2DCentroidY = vs2DPoints.reduce((sum, p) => sum + p[1], 0) / vs2DPoints.length;

                    const std2DDistances = std2DPoints.map(p =>
                        Math.sqrt(Math.pow(p[0] - std2DCentroidX, 2) + Math.pow(p[1] - std2DCentroidY, 2))
                    );
                    const std2DMedRadius = median(std2DDistances);

                    const vs2DDistances = vs2DPoints.map(p =>
                        Math.sqrt(Math.pow(p[0] - vs2DCentroidX, 2) + Math.pow(p[1] - vs2DCentroidY, 2))
                    );
                    const vs2DMedRadius = median(vs2DDistances);

                    //11. 发送最终的指标和可视化数据
                    sendEvent('metrics_complete', {
                        question: sanitizedQuestion,
                        k: k,
                        distances: {
                            stdIntra: stdIntraDistance,
                            vsIntra: vsIntraDistance,
                            inter: interDistance,
                            centroidShift: centroidDistance,
                        },
                        visualization: {
                            embedding2D,
                            embedding3D,
                            centroids2D: {
                                std: [std2DCentroidX, std2DCentroidY],
                                vs: [vs2DCentroidX, vs2DCentroidY],
                            },
                            medRadius2D: {
                                std: std2DMedRadius,
                                vs: vs2DMedRadius,
                            },
                        },
                    });

                    // 关闭流
                    controller.close();
                } catch (error) {
                    console.log('Stream Error:', error);
                    // Include error details in the message for debugging
                    let errorInfo: { message: string; name?: string } = { message: '服务器内部错误' };
                    if (error instanceof Error) {
                        errorInfo = { message: error.message, name: error.name };
                    } else if (typeof error === 'string') {
                        errorInfo = { message: error };
                    }
                    const errorMessage = `data: ${JSON.stringify({ step: 'error', data: errorInfo })}\n\n`;
                    controller.enqueue(encoder.encode(errorMessage));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.log('API Error:', error);
        return NextResponse.json(
            { error: '服务器内部错误' },
            { status: 500 }
        );
    }
}
