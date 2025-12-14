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
 * 注意：所有分页页面都使用 /page/X 格式，根目录(/)只显示置顶项目
 */
export function getPageUrl(page: number): string {
  return `/page/${page}`;
}
