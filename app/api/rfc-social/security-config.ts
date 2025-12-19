/**
 * 安全配置：用户输入内容检测
 * 防止提示词注入、越狱攻击等恶意输入
 */

// 违禁词：出现1个就判定为恶意
export const BANNED_WORDS = [
  // 英文越狱指令
  'ignore previous',
  'ignore all previous',
  'disregard previous',
  'forget previous',
  'ignore above',
  'disregard above',
  'system prompt',
  'system message',
  'developer message',
  'developer mode',
  'reveal prompt',
  'show prompt',
  'output prompt',
  'print prompt',
  'dump prompt',
  'bypass',
  'jailbreak',
  'sudo mode',
  'admin mode',
  'root access',

  // 中文越狱指令
  '忘记之前',
  '忽略之前',
  '忽略以上',
  '无视之前',
  '无视以上',
  '忘记以前',
  '系统提示',
  '系统指令',
  '开发者模式',
  '管理员模式',
  '你现在是',
  '你是一个',
  '你将扮演',
  '角色扮演',
  '扮演角色',
  '复述',
  '重复',
  '泄露',
  '透露',
  '输出下面',
  '只需要输出',
  '只需回复',
  '只回复',
  '只输出',
  '仅输出',
  '仅回复',

  // XML/HTML 标签注入
  '<system>',
  '</system>',
  '<prompt>',
  '</prompt>',
  '<instruction>',
  '</instruction>',
  '<admin>',
  '</admin>',
  '<override>',
  '</override>',
];

// 敏感词：出现2个或以上判定为可疑
export const SENSITIVE_WORDS = [
  // 英文
  'prompt',
  'instruction',
  'system',
  'developer',
  'reveal',
  'output',
  'print',
  'ignore',
  'disregard',
  'forget',
  'bypass',
  'override',
  'jailbreak',
  'pretend',
  'act as',
  'role play',
  'now you are',
  'you are now',
  'unauthorized',
  'privilege',
  'escalation',
  'injection',

  // 中文
  '指令',
  '提示词',
  '提示符',
  '角色',
  '扮演',
  '权限',
  '越权',
  '注入',
  '绕过',
  '无视',
  '忽略',
  '忘记',
  '泄露',
  '透露',
  '输出',
  '打印',
  '显示',
  '假装',
  '现在你',
  '你现在',
];

/**
 * 检测用户输入是否包含恶意内容
 * @param input 用户输入
 * @returns { safe: boolean, reason?: string, matchedWords?: string[] }
 */
export function detectMaliciousInput(input: string): {
  safe: boolean;
  reason?: string;
  matchedWords?: string[];
} {
  const lowerInput = input.toLowerCase();

  // 检查违禁词（出现1个即判定为恶意）
  const matchedBannedWords: string[] = [];
  for (const word of BANNED_WORDS) {
    if (lowerInput.includes(word.toLowerCase())) {
      matchedBannedWords.push(word);
    }
  }

  if (matchedBannedWords.length > 0) {
    return {
      safe: false,
      reason: '检测到疑似越狱指令或恶意输入',
      matchedWords: matchedBannedWords,
    };
  }

  // 检查敏感词（出现2个或以上判定为可疑）
  const matchedSensitiveWords: string[] = [];
  for (const word of SENSITIVE_WORDS) {
    if (lowerInput.includes(word.toLowerCase())) {
      matchedSensitiveWords.push(word);
    }
  }

  if (matchedSensitiveWords.length >= 2) {
    return {
      safe: false,
      reason: '检测到多个敏感词，疑似越狱尝试',
      matchedWords: matchedSensitiveWords,
    };
  }

  return { safe: true };
}