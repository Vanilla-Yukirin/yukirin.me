/**
 * 根布局组件
 * 定义整个应用的通用布局结构
 */

import type { Metadata } from 'next';
import './globals.css';

/**
 * 网站元数据配置
 */
export const metadata: Metadata = {
  title: 'Vanilla Yukirin',
  description: 'Vanilla Yukirin - 数据科学与大数据技术 | 深度学习研究者',
  keywords: ['Vanilla Yukirin', '数据科学', '深度学习', '算法竞赛', 'ICPC', '数学建模'],
  authors: [{ name: 'Vanilla Yukirin' }],
  creator: 'Vanilla Yukirin',
  icons: {
    icon: '/favicon.png',
  },
};

/**
 * Viewport 配置
 */
export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

/**
 * 根布局组件
 * @param children 子组件
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {/* RemixIcon 图标库 */}
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        {/* 统计分析脚本 */}
        <script
          defer
          src="https://was.arisumika.top/script.js"
          data-website-id="38b7f262-a375-4e89-a600-68f654ad249e"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
