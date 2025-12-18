import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PCA } from 'ml-pca';

//初始化 llm & emb客户端
const llm = new OpenAI({
  apiKey: process.env.XIAOHUMI_API_KEY,
  baseURL: process.env.XIAOHUMI_BASE_URL,
});

const emb = new OpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: process.env.SILICONFLOW_BASE_URL,
});

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

//POST 请求处理函数
export async function POST(request: Request) {
    try {
        //这里写后续的步骤
        
        //1. 接受用户的问题和参数
        const body = await request.json();
        const { question, temperature = 1.5, model, k = 5 } = body;
        
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

        //4. 调用LLM两次
        console.log("开始生成标准回答...");
        console.log("请求参数:", {
          model,
          temperature,
          question: sanitizedQuestion,
          max_tokens: 4096,
        });

        const stdCompletion = await llm.chat.completions.create({
          model: model,  // 使用前端传入的模型
          messages: [
            { role: 'system', content: stdSystemPrompt },
            { role: 'user', content: sanitizedQuestion }
          ],
          temperature: temperature,  // 使用前端传入的温度
          max_tokens: 4096,
          enable_thinking: false,
        } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming);

        console.log("开始生成Verbalized Sampling回答...");
        const vsCompletion = await llm.chat.completions.create({
          model: model,  // 使用前端传入的模型
          messages: [
            { role: 'system', content: vsSystemPrompt },
            { role: 'user', content: sanitizedQuestion }
          ],
          temperature: temperature,  // 使用前端传入的温度
          max_tokens: 4096,
          enable_thinking: false,
        } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming);

        //5. 解析返回的结果
        const stdText = stdCompletion.choices[0]?.message?.content || '';
        const vsText = vsCompletion.choices[0]?.message?.content || '';

        // debug: 输出 LLM 原始返回内容
        console.log("=== 标准方法返回的原始文本 ====");
        console.log(stdText);
        console.log("=== Verbalized Sampling 返回的原始文本 ====");
        console.log(vsText);

        const stdResponses = parseResponses(stdText, k);
        const vsResponses = parseResponses(vsText, k);

        console.log('标准方法解析到的回答数量:', stdResponses.length);
        console.log('VS方法解析到的回答数量:', vsResponses.length);

        if (stdResponses.length < k || vsResponses.length < k) {
            return NextResponse.json(
                {
                    error: `LLM 返回的答案数量不足${k}个，请尝试降低 Temperature 值或切换模型后重试`,
                    stdCount: stdResponses.length,
                    vsCount: vsResponses.length,
                    stdResponses,
                    vsResponses
                },
                { status: 500 }
            );
        }

        // 只取前k个用于计算
        const stdResponsesSliced = stdResponses.slice(0, k);
        const vsResponsesSliced = vsResponses.slice(0, k);

        //6. 获取embedding
        const allResponses = [...stdResponsesSliced, ...vsResponsesSliced]; //合并两个数组（只用前k个）

        console.log("开始生成Embedding...");
        const embeddingResponse = await emb.embeddings.create({
          model: embModel,
          input: allResponses,
        });

        const embeddings = embeddingResponse.data.map(item => item.embedding);

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
        //内部距离
        const stdIntraDistance = average(stdIntraDis);
        const vsIntraDistance = average(vsIntraDis);
        //类间距离
        const interDistance = average(interDis);
        //质心距离
        const stdCentroid = calcCentroid(stdEmbeddings);
        const vsCentroid = calcCentroid(verbalizedEmbeddings);
        const centroidDistance = cosineDistance(stdCentroid, vsCentroid);

        //9. PCA降维
        const pca = new PCA(embeddings);
        const embedding2D = pca.predict(embeddings, { nComponents: 2 }).to2DArray();
        const embedding3D = pca.predict(embeddings, { nComponents: 3 }).to2DArray();

        //10. 计算2D空间中的质心和中位半径
        // 标准方法的2D点
        const std2DPoints = embedding2D.slice(0, k);
        // VS方法的2D点
        const vs2DPoints = embedding2D.slice(k, k * 2);

        // 计算标准方法的2D质心
        const std2DCentroidX = std2DPoints.reduce((sum, p) => sum + p[0], 0) / std2DPoints.length;
        const std2DCentroidY = std2DPoints.reduce((sum, p) => sum + p[1], 0) / std2DPoints.length;

        // 计算VS方法的2D质心
        const vs2DCentroidX = vs2DPoints.reduce((sum, p) => sum + p[0], 0) / vs2DPoints.length;
        const vs2DCentroidY = vs2DPoints.reduce((sum, p) => sum + p[1], 0) / vs2DPoints.length;

        // 计算标准方法到质心的中位距离（2D欧氏距离）
        const std2DDistances = std2DPoints.map(p =>
        Math.sqrt(Math.pow(p[0] - std2DCentroidX, 2) + Math.pow(p[1] - std2DCentroidY, 2))
        );
        const std2DMedRadius = median(std2DDistances);

        // 计算VS方法到质心的中位距离（2D欧氏距离）
        const vs2DDistances = vs2DPoints.map(p =>
            Math.sqrt(Math.pow(p[0] - vs2DCentroidX, 2) + Math.pow(p[1] - vs2DCentroidY, 2))
        );
        const vs2DMedRadius = median(vs2DDistances);
        //11. 返回结果
        return NextResponse.json({
            question: sanitizedQuestion,
            k: k,                              // 返回k值
            stdResponses: stdResponsesSliced,  // 只返回用于计算的前k个
            vsResponses: vsResponsesSliced,    // 只返回用于计算的前k个
            rawStdText: stdText,               // 标准方法的原始响应
            rawVsText: vsText,                 // VS方法的原始响应
            prompts: {
                stdSystemPrompt: stdSystemPrompt,  // 标准方法的完整系统提示词
                vsSystemPrompt: vsSystemPrompt,    // VS方法的完整系统提示词
            },
            distances: {
                stdIntra: stdIntraDistance,      //标准方法的内部距离
                vsIntra: vsIntraDistance,        //VS的内部距离
                inter: interDistance,            //类间距离
                centroidShift: centroidDistance, //质心距离
            },
            visualization: {
                embedding2D,
                embedding3D,
                // 2D质心和半径信息
                centroids2D: {
                    std: [std2DCentroidX, std2DCentroidY],
                    vs: [vs2DCentroidX, vs2DCentroidY],
                },
                avgRadius2D: {
                    std: std2DMedRadius,
                    vs: vs2DMedRadius,
                },
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
