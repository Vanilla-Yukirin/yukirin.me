/**
 * 通用工具函数
 */

/**
 * 获取当前版本提交信息
 * @returns 包含提交 SHA 和 URL 的对象
 */
export function getCommitInfo() {
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || 'unknown';
  const commitUrl =
    process.env.NEXT_PUBLIC_COMMIT_URL ||
    `https://github.com/Vanilla-Yukirin/yukirin.me/commit/${commitSha}`;

  return { commitSha, commitUrl };
}

/**
 * 生成页面 URL
 * @param page 页码
 * @returns 页面 URL
 */
export function getPageUrl(page: number): string {
  if (page === 1) {
    return '/';
  }
  return `/page/${page}`;
}
