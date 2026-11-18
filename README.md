# Vanilla Yukirin 个人网站

> 基于 Next.js 14 (App Router) + TypeScript 构建的现代化个人网站

送给自己的礼物 🎁

## 🚀 项目特点

- **Next.js 14 App Router**: 使用最新的 App Router 架构
- **TypeScript**: 完整的类型安全支持
- **服务端渲染 (SSR/SSG)**: 所有数据在服务端读取，消除客户端 fetch 闪烁
- **模块化设计**: 清晰的项目结构，易于维护和扩展
- 响应式设计，适配各种设备尺寸

## 📁 项目结构

```
yukirin.me/
├── app/                     # Next.js App Router 目录
│   ├── api/                 # API 路由
│   ├── cv-pink/             # 粉色简历页
│   │   └── page.tsx         # 简历页面组件
│   ├── cv-blue/             # 蓝色简历页
│   │   └── page.tsx         # 简历页面组件
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 主页
├── components/              # 可复用组件
│   ├── BackgroundCanvas.tsx # 背景动画组件
│   └── ProjectCard.tsx      # 项目卡片组件
├── data/                    # 数据文件
│   ├── about.md             # 关于我
│   ├── data.json            # 主页数据
│   ├── cv-pink.json         # 粉色简历数据
│   └── cv-blue.json         # 蓝色简历数据
├── lib/                     # 工具函数和配置
│   ├── colors.ts            # 颜色常量配置
│   ├── data.ts              # 数据加载工具
│   └── types.ts             # TypeScript 类型定义
├── public/                  # 静态资源
│   ├── fonts/               # 字体放这
│   └── images/              # 图片放这
├── next.config.js           # Next.js 配置
├── tsconfig.json            # TS 配置
├── .env.local               # 环境变量
└── package.json             # 项目依赖

```

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: CSS Modules
- **Markdown**: marked
- **运行时**: Node.js 18+
- **包管理**: npm

## 📦 安装与运行

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 生产构建

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

### 代码检查

```bash
# 运行 ESLint
npm run lint
```

## 📝 数据管理

所有数据都存储在 `data/` 目录中，方便管理和更新：

### 主页数据

编辑 `data/data.json` 和 `data/about.md` 来更新主页内容。

### 简历页数据

- 粉色版：编辑 `data/cv-pink.json`
- 蓝色版：编辑 `data/cv-blue.json`

数据会在服务端读取并渲染，无需重启服务器（开发模式下自动更新）。

## 📚 文档

### 访问统计

`components/GoatCounter.tsx` 接入 [cnt.yukirin.me](https://cnt.yukirin.me/)（xcy 的主页 Site 3），与博客 `blog-cnt.yukirin.me` 分开统计。Umami 的现有脚本和网站 ID 保持原样，前端没有管理员或 API 凭据。

仅生产构建的 `https://yukirin.me` 和 `https://www.yukirin.me` 启用采集，本地预览及其他域名不发送请求。客户端在页面加载后异步载入，最多等待 4 秒；App Router 的路径变化会记录新的页面，查询参数和锚点不拆成独立页面。沿用 GoatCounter 默认会话去重，重复刷新不一定增加计数。后续 Hanami 可使用本侧只读 API 获取主页统计。

- [开发指南](./DEVELOPMENT.md) - 详细的开发文档
- [部署指南](./DEPLOYMENT.md) - 部署和运维文档

---

Powered by [Next.js](https://nextjs.org/) · [TypeScript](https://www.typescriptlang.org/) · [Marked](https://marked.js.org/) · [RemixIcon](https://remixicon.com/)

© 2026 Vanilla Yukirin · 永远可爱 · 永远善良
