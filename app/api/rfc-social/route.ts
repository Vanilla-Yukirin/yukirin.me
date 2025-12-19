import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import { join } from 'path';

// 模型配置接口
interface ModelConfig {
  API: string;
  model: string;
}

// LLM 客户端缓存
const llmClients: Record<string, OpenAI> = {};

// 根据 API 提供商获取 LLM 客户端
function getLLMClient(apiProvider: string): OpenAI {
  const normalizedProvider = apiProvider.toUpperCase();

  if (llmClients[normalizedProvider]) {
    return llmClients[normalizedProvider];
  }

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

  llmClients[normalizedProvider] = new OpenAI({
    apiKey,
    baseURL,
  });

  return llmClients[normalizedProvider];
}

// RFC Social 提示词内容（缓存）
let rfcSocialContent: string | null = null;

async function getRfcSocialContent(): Promise<string> {
  if (rfcSocialContent) {
    return rfcSocialContent;
  }

  const filePath = join(process.cwd(), 'app', 'api', 'rfc-social', 'rfc-social-sfw.md');
  rfcSocialContent = await readFile(filePath, 'utf-8');
  return rfcSocialContent;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userInput, model } = body;

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

    // 验证输入
    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { error: '无效的输入格式' },
        { status: 400 }
      );
    }

    // 限制输入长度
    if (userInput.length > 200) {
      return NextResponse.json(
        { error: '输入过长，请不要超过200字符' },
        { status: 400 }
      );
    }

    const sanitizedInput = userInput.trim().slice(0, 200);

    // 获取 RFC Social 提示词内容
    const rfcContent = await getRfcSocialContent();

    // 构造系统提示词
    const systemPrompt = `你是一个幽默风趣的社交助手。你掌握了以下"HTTP社交辞令"知识：

${rfcContent}

用户会告诉你他们遇到的情况或想要表达的意思。你需要：
1. 分析用户的情况
2. 从上述HTTP响应码中推荐1-3个最适合的响应
3. 每个推荐需要包含：
   - HTTP响应码和名称
   - 推荐理由（简短说明为什么适合）
   - 推荐指数（1-5星，用⭐表示）

请以JSON格式返回结果，格式如下：
{
  "suggestions": [
    {
      "code": "200",
      "name": "OK",
      "reason": "这里写推荐理由",
      "stars": 5
    }
  ]
}

注意：
- 只返回JSON，不要有其他文字
- stars必须是1-5之间的整数
- 推荐理由要简洁幽默
- 优先推荐最贴切的响应码`;

    const userPrompt = `我的情况是：${sanitizedInput}

请帮我推荐合适的HTTP响应码来回复。`;

    // 调用 LLM
    const llmClient = getLLMClient(modelConfig.API);
    const completion = await llmClient.chat.completions.create({
      model: modelConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1000,
      // enable_thinking: false,
    } as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming);

    const responseText = completion.choices[0]?.message?.content || '';

    // 解析 JSON 响应
    try {
      // 首先尝试去除 markdown 代码块标记
      let cleanedText = responseText.trim();

      // 移除 ```json 和 ``` 标记
      cleanedText = cleanedText.replace(/^```json\s*/i, '').replace(/\s*```$/, '');

      // 尝试提取JSON对象
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('无法提取JSON，原始响应为:', responseText);
        throw new Error('无法从响应中提取JSON');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      // 验证响应格式
      if (!result.suggestions || !Array.isArray(result.suggestions)) {
        throw new Error('响应格式不正确');
      }

      return NextResponse.json({
        suggestions: result.suggestions,
        rawResponse: responseText
      });

    } catch (parseError) {
      console.error('解析LLM响应失败:', parseError);
      console.error('原始响应:', responseText);
      
      return NextResponse.json(
        { 
          error: 'LLM返回格式有误，请重试',
          rawResponse: responseText 
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    );
  }
}
