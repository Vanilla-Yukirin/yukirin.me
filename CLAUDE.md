# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

完整开发规范、数据格式说明、颜色系统等，参阅 [DEVELOPMENT.md](./DEVELOPMENT.md)。

## 常用命令

```bash
npm run dev      # 启动开发服务器（localhost:3000）
npm run build    # 生产构建
npm run lint     # ESLint 检查（构建时已跳过，手动运行）
npm start        # 启动生产服务器
```

## 架构概览

**数据驱动、无数据库**。所有内容存储在 `data/` 目录的 JSON/Markdown 文件中，服务端通过 `lib/data.ts`（`fs.readFileSync`）读取，无客户端 fetch。

**页面全为 Server Components**（Next.js 14 App Router 默认），没有 `'use client'` 的组件均在服务端渲染。

**双色 CV 设计**：`app/cv-pink/` 和 `app/cv-blue/` 读取各自的 JSON 数据文件（目前内容相同），通过独立的 `page.module.css` 实现配色差异。`/cv` 路由经 `middleware.ts` 自动重定向至 `/cv-pink`。

**颜色系统集中管理**：所有颜色常量定义在 `lib/colors.ts`，禁止在组件中硬编码颜色值（CV 页面 CSS Modules 除外，它们直接使用十六进制值以保持主题独立性）。

**类型系统**：所有数据结构的 TypeScript 类型定义在 `lib/types.ts`，修改 JSON 数据结构时必须同步更新类型。

## 关键约定

- 外部图片域名需在 `next.config.js` 的 `images.remotePatterns` 中白名单，当前仅配置了 `images.unsplash.com`
- 生产部署使用 PM2，配置文件为项目根目录的 `ecosystem.config.js`
- `app/layout.tsx` 统一加载字体（JetBrains Mono、Noto Sans SC）和 RemixIcon，新页面无需重复引入
