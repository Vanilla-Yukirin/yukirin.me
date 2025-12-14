/**
 * PM2 生态系统配置文件
 * 用于在服务器上管理 Next.js 应用进程
 */

module.exports = {
  apps: [
    {
      // 应用名称
      name: 'yukirin-site',
      // 启动脚本：使用 Next.js 的 start 命令
      script: 'npm',
      args: 'start',
      // 应用运行目录
      cwd: '/var/www/yukirin.me',
      // 进程实例数
      instances: 1,
      // 执行模式：fork 或 cluster
      exec_mode: 'fork',
      // 是否监视文件变化（生产环境设为 false）
      watch: false,
      // 最大内存限制（超过则自动重启）
      max_memory_restart: '500M',
      // 环境变量
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // 统一 Node/PM2 日志的时区显示（不影响系统时区）
        TZ: 'Asia/Shanghai',
      },
      // 日志文件路径
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      // 日志时间戳格式
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // 应用崩溃时自动重启
      autorestart: true,
      // 最大重启次数（在 min_uptime 内）
      max_restarts: 10,
      // 多少时间内的重启次数算作崩溃
      min_uptime: '10s',
    },
  ],
};
