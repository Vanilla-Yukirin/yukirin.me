# 部署指南

## 部署到 Vercel（推荐）

Vercel 是 Next.js 的官方推荐部署平台，部署过程简单快捷。

### 步骤：

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择 GitHub 仓库 `Vanilla-Yukirin/yukirin.me`
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 1-2 分钟）
   - 获取部署 URL

5. **配置自定义域名**（可选）
   - 在项目设置中添加自定义域名
   - 更新 DNS 记录

### 环境变量

目前项目不需要任何环境变量，所有数据都存储在 `data/` 目录中。

如果未来需要添加环境变量（如数据库连接、API 密钥等），可以在 Vercel 项目设置中添加。

## 部署到其他平台

### Netlify

1. 连接 GitHub 仓库
2. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `.next`
   - 添加环境变量：`NODE_VERSION=20`

### AWS Amplify

1. 连接 GitHub 仓库
2. 使用默认的 Next.js 构建设置
3. 部署

### 自建服务器

1. **安装依赖**
   ```bash
   npm install
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **启动生产服务器**
   ```bash
   npm start
   ```

4. **使用 PM2 保持运行**（推荐）
   ```bash
   npm install -g pm2
   pm2 start npm --name "yukirin-site" -- start
   pm2 save
   pm2 startup
   ```

5. **配置 Nginx 反向代理**
   ```nginx
   server {
       listen 80;
       server_name yukirin.me www.yukirin.me;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 静态导出（可选）

如果需要完全静态的网站（不使用 Node.js 服务器），可以使用静态导出：

1. **修改 `next.config.js`**
   ```javascript
   const nextConfig = {
     output: 'export',
     // ... 其他配置
   }
   ```

2. **构建静态文件**
   ```bash
   npm run build
   ```

3. **输出目录**
   - 静态文件将生成在 `out/` 目录
   - 可以直接部署到任何静态托管服务（GitHub Pages、Cloudflare Pages 等）

**注意**：静态导出会失去服务端功能（如 API 路由），但所有页面仍然会在构建时预渲染。

## 持续部署

### GitHub Actions（自动部署）

如果使用 Vercel 或 Netlify，它们会自动监听 GitHub 仓库的变更并自动部署。

每次推送代码到 `main` 分支时，新版本会自动构建和部署。

### 手动部署

如果需要手动触发部署：

1. 在 Vercel 项目页面点击 "Redeploy"
2. 或使用 Vercel CLI：
   ```bash
   npm install -g vercel
   vercel --prod
   ```

## 性能优化建议

1. **图片优化**
   - 使用 Next.js Image 组件
   - 压缩图片文件
   - 使用 WebP 格式

2. **代码分割**
   - Next.js 自动进行代码分割
   - 确保组件按需加载

3. **CDN 加速**
   - Vercel 自动提供全球 CDN
   - 静态资源会被缓存

4. **缓存策略**
   - 合理设置 HTTP 缓存头
   - 使用 SWR 或 React Query 进行数据缓存

## 监控与日志

### Vercel Analytics

1. 在 Vercel 项目设置中启用 Analytics
2. 查看页面性能、访问量等数据

### 自定义分析

项目已集成 `was.arisumika.top` 统计分析服务。

## 故障排查

### 构建失败

1. 检查 Node.js 版本（需要 18+）
2. 清除缓存：`rm -rf .next node_modules`
3. 重新安装依赖：`npm install`
4. 重新构建：`npm run build`

### 页面显示异常

1. 检查浏览器控制台错误
2. 确认数据文件格式正确
3. 查看服务器日志

### 性能问题

1. 使用 Lighthouse 分析性能
2. 优化图片和资源加载
3. 检查是否有不必要的客户端渲染

## 备份与恢复

### 数据备份

定期备份 `data/` 目录中的所有文件：
- `data/about.md`
- `data/data.json`
- `data/cv-pink.json`
- `data/cv-blue.json`

### 代码备份

使用 Git 进行版本控制，定期推送到 GitHub。

## 更新数据

更新网站内容非常简单：

1. 编辑 `data/` 目录中的相应文件
2. 提交并推送到 GitHub
3. 自动触发重新部署（Vercel/Netlify）
4. 或手动触发部署

无需重启服务器或重新构建（在开发模式下会自动热重载）。
