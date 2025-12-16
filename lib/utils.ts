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
    `https://github.com/Vanilla-Yukirin/yukirin.me/`;

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

/**
 * 获取链接图标的 RemixIcon 类名
 * @param icon 图标标识符
 * @returns RemixIcon 类名
 */
export function getLinkIcon(icon: string): string {
  const iconMap: Record<string, string> = {
    // 基础联系方式
    github: 'ri-github-fill',
    email: 'ri-mail-line',
    cv: 'ri-file-text-line',
    
    // 社交媒体
    twitter: 'ri-twitter-x-line',
    linkedin: 'ri-linkedin-box-fill',
    bilibili: 'ri-play-line', // 或 ri-video-line
    xiaohongshu: 'ri-bookmark-line',
    wechat: 'ri-wechat-fill',
    qq: 'ri-qq-line',
    douyin: 'ri-video-chat-line',
    zhihu: 'ri-message-2-line',
    discord: 'ri-discord-line',
    
    // 开发平台
    gitlab: 'ri-gitlab-line',
    gitee: 'ri-git-line',
    codepen: 'ri-code-s-slash-line',
    juejin: 'ri-star-line',
    medium: 'ri-article-line',
    
    // 博客网站
    blog: 'ri-global-line',
    website: 'ri-earth-line',
    portfolio: 'ri-folder-open-line',
    
    // 其他
    phone: 'ri-phone-line',
    location: 'ri-map-pin-line',
    link: 'ri-link',
    default: 'ri-link',
  };
  
  return iconMap[icon.toLowerCase()] || iconMap['default'];
}
