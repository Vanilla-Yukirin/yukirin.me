// 共享配置常量
export const CONFIG = {
  MAX_QUESTION_LENGTH: 50,           // 问题最大长度
  DEFAULT_TEMPERATURE: 1.0,          // 默认温度
  MIN_TEMPERATURE: 0.0,              // 最小温度
  MAX_TEMPERATURE: 2.0,              // 最大温度
  TEMPERATURE_STEP: 0.1,             // 温度调整步长

  DEFAULT_K: 5,                      // 默认回答数量
  MIN_K: 3,                          // 最小回答数量
  MAX_K: 10,                         // 最大回答数量

  // 可用的 LLM 模型
  LLM_MODELS: [
    { value: 'openai/gpt-5-nano', label: 'GPT-5 Nano' },
    { value: 'openai/gpt-5-mini', label: 'GPT-5 Mini' },
  ],
  DEFAULT_MODEL: 'openai/gpt-5-nano',
};
