/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用静态导出（如果需要）
  // output: 'export',
  
  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  
  // 严格模式
  reactStrictMode: true,
  
  // 性能优化
  swcMinify: true,
}

module.exports = nextConfig
