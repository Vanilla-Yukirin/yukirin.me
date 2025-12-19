/**
 * 安全检测测试脚本
 * 验证误伤率和拦截准确率
 */

import { detectMaliciousInput, TEST_CASES } from './security-config';

console.log('=== 安全检测测试 ===\n');

// 测试恶意输入
console.log('📛 测试恶意输入（应该全部拦截）:');
TEST_CASES.malicious.forEach((input, index) => {
  const result = detectMaliciousInput(input);
  const status = result.safe ? '❌ 漏过' : '✅ 拦截';
  console.log(`${index + 1}. ${status} - "${input}"`);
  if (!result.safe) {
    console.log(`   原因: ${result.reason}`);
    console.log(`   置信度: ${result.confidence}`);
  }
  console.log('');
});

// 测试正常输入
console.log('\n✅ 测试正常输入（应该全部放行）:');
TEST_CASES.safe.forEach((input, index) => {
  const result = detectMaliciousInput(input);
  const status = result.safe ? '✅ 放行' : '❌ 误伤';
  console.log(`${index + 1}. ${status} - "${input}"`);
  if (!result.safe) {
    console.log(`   ⚠️  误判原因: ${result.reason}`);
    console.log(`   匹配信号:`, result.matchedSignals);
  }
  console.log('');
});

// 统计
const maliciousResults = TEST_CASES.malicious.map(detectMaliciousInput);
const safeResults = TEST_CASES.safe.map(detectMaliciousInput);

const blockedMalicious = maliciousResults.filter(r => !r.safe).length;
const allowedSafe = safeResults.filter(r => r.safe).length;

console.log('\n=== 测试统计 ===');
console.log(`恶意输入拦截率: ${blockedMalicious}/${TEST_CASES.malicious.length} (${(blockedMalicious / TEST_CASES.malicious.length * 100).toFixed(1)}%)`);
console.log(`正常输入放行率: ${allowedSafe}/${TEST_CASES.safe.length} (${(allowedSafe / TEST_CASES.safe.length * 100).toFixed(1)}%)`);
console.log(`误伤数量: ${TEST_CASES.safe.length - allowedSafe}`);

if (blockedMalicious === TEST_CASES.malicious.length && allowedSafe === TEST_CASES.safe.length) {
  console.log('\n🎉 所有测试通过！');
} else {
  console.log('\n⚠️  部分测试未通过，需要调整规则');
}
