// RFC Social 配置
export interface ModelConfig {
  API: string;
  model: string;
}

// 共享配置常量
export const CONFIG = {
  MAX_INPUT_LENGTH: 200,              // 用户输入最大长度
  
  // 默认使用的 LLM 模型（写死，不让用户选择）
  DEFAULT_MODEL: {"API": "OPENAIHK", "model": "gpt-5-nano"} as ModelConfig,
};
