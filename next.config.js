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

  // 构建期配置
  eslint: {
    // 在构建时跳过 ESLint（避免因 ESLint 版本或规则导致构建报警/阻塞）
    ignoreDuringBuilds: true,
  },

  // 注意：telemetry 配置已在 Next.js 14+ 中移除
  // 如需禁用遥测，请设置环境变量：NEXT_TELEMETRY_DISABLED=1
}

module.exports = nextConfig
