/**
 * Next.js 中间件
 * 用于处理路由重定向等功能
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 中间件函数
 * @param request 请求对象
 * @returns 响应对象
 */
export function middleware(request: NextRequest) {
  // 将 /cv 重定向到 /cv-pink
  if (request.nextUrl.pathname === '/cv') {
    return NextResponse.redirect(new URL('/cv-pink', request.url));
  }

  return NextResponse.next();
}

/**
 * 中间件配置
 * 指定哪些路径需要执行中间件
 */
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (网站图标)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
