# Vanilla Yukirin 个人网站

> 基于 Next.js 14 (App Router) + TypeScript 构建的现代化个人网站

送给自己的礼物 🎁

## 🚀 项目特点

- **Next.js 14 App Router**: 使用最新的 App Router 架构
- **TypeScript**: 完整的类型安全支持
- **服务端渲染 (SSR/SSG)**: 所有数据在服务端读取，消除客户端 fetch 闪烁
- **模块化设计**: 清晰的项目结构，易于维护和扩展
- 预留 API 路由，为未来功能（登录、数据库、上传）预留接口
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

## 🎨 颜色配置

所有颜色常量都定义在 `lib/colors.ts` 中：

- `TECH_COLORS`: 主页科技风格色板
- `PINK_COLORS`: 粉色简历页色板
- `BLUE_COLORS`: 蓝色简历页色板
- `TAG_COLOR_PALETTE`: 项目标签色板（10色）
- `STATUS_COLORS`: 状态色（成功、警告、错误等）

## 🔌 API 路由

API 路由位于 `app/api/` 目录，已预留以下功能接口：

- `/api/hello`: 示例 API（已实现）
- `/api/auth/*`: 认证接口（待实现）
- `/api/db/*`: 数据库操作接口（待实现）
- `/api/upload/*`: 文件上传接口（待实现）

### 使用示例

```typescript
// GET 请求
const response = await fetch('/api/hello');
const data = await response.json();

// POST 请求
const response = await fetch('/api/hello', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello!' }),
});
```

## 🚀 部署

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### 其他平台

项目可以部署到任何支持 Next.js 的平台：

- Netlify
- AWS Amplify
- Railway
- 自建服务器

## 📚 文档

- [开发指南](./DEVELOPMENT.md) - 详细的开发文档
- [部署指南](./DEPLOYMENT.md) - 部署和运维文档

## 🔧 扩展功能

项目已预留以下功能接口：

- **认证系统**: `app/api/auth/*`
- **数据库操作**: `app/api/db/*`
- **文件上传**: `app/api/upload/*`

可根据需求自行实现。

## 📄 许可证

ISC License

## 👤 作者

**Vanilla Yukirin**

- GitHub: [@Vanilla-Yukirin](https://github.com/Vanilla-Yukirin)
- Email: contact@yukirin.me

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [TypeScript](https://www.typescriptlang.org/) - 类型系统
- [Marked](https://marked.js.org/) - Markdown 解析器
- [RemixIcon](https://remixicon.com/) - 图标库

---

© 2025 Vanilla Yukirin · 永远可爱 · 永远善良
