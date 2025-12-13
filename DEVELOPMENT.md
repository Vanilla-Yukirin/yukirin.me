# 开发指南

## 环境要求

- **Node.js**: 18.x 或更高版本
- **npm**: 8.x 或更高版本
- **操作系统**: Windows、macOS 或 Linux

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/Vanilla-Yukirin/yukirin.me.git
cd yukirin.me
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构详解

```
yukirin.me/
├── app/                      # Next.js App Router 应用目录
│   ├── api/                 # API 路由
│   │   └── hello/           # 示例 API
│   ├── cv-pink/             # 粉色简历页
│   │   ├── page.tsx         # 页面组件
│   │   └── page.module.css  # 页面样式
│   ├── cv-blue/             # 蓝色简历页
│   │   ├── page.tsx
│   │   └── page.module.css
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局组件
│   ├── page.tsx             # 主页组件
│   └── page.module.css      # 主页样式
├── components/              # 可复用组件
│   ├── BackgroundCanvas.tsx # 背景动画组件
│   ├── ProjectCard.tsx      # 项目卡片组件
│   └── ProjectCard.module.css
├── data/                    # 数据文件
│   ├── about.md            # 关于我内容（Markdown）
│   ├── data.json           # 主页数据
│   ├── cv-pink.json        # 粉色简历数据
│   └── cv-blue.json        # 蓝色简历数据
├── lib/                     # 工具函数和配置
│   ├── colors.ts           # 颜色常量配置
│   ├── data.ts             # 数据加载工具
│   └── types.ts            # TypeScript 类型定义
├── public/                  # 静态资源目录
│   ├── fonts/              # 本地字体文件（预留）
│   ├── images/             # 图片资源
│   └── favicon.png         # 网站图标
├── middleware.ts           # Next.js 中间件
├── next.config.js          # Next.js 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目依赖
```

## 开发工作流

### 修改页面内容

1. **主页内容**
   - 编辑 `data/data.json` 修改个人信息、项目列表
   - 编辑 `data/about.md` 修改关于我部分
   - 支持 Markdown 语法

2. **简历页内容**
   - 粉色版：编辑 `data/cv-pink.json`
   - 蓝色版：编辑 `data/cv-blue.json`

3. **样式修改**
   - 全局样式：`app/globals.css`
   - 颜色常量：`lib/colors.ts`
   - 页面样式：各页面的 `.module.css` 文件

### 添加新页面

1. 在 `app/` 目录下创建新文件夹
2. 创建 `page.tsx` 文件
3. 创建对应的 `.module.css` 文件（可选）

示例：
```typescript
// app/blog/page.tsx
export default function BlogPage() {
  return (
    <div>
      <h1>博客页面</h1>
    </div>
  );
}
```

访问 `/blog` 即可看到新页面。

### 添加 API 路由

1. 在 `app/api/` 目录下创建新文件夹
2. 创建 `route.ts` 文件

示例：
```typescript
// app/api/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  
  // 处理联系表单
  
  return NextResponse.json({ success: true });
}
```

### 添加新组件

1. 在 `components/` 目录下创建新文件
2. 导出 React 组件

示例：
```typescript
// components/Button.tsx
interface ButtonProps {
  text: string;
  onClick: () => void;
}

export default function Button({ text, onClick }: ButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}
```

## 数据格式说明

### 主页数据（data/data.json）

```json
{
  "personal": {
    "name": "用户名",
    "subtitle": "副标题",
    "avatar": "头像路径",
    "info": {
      "身份": "学生",
      "学校": "学校名"
    }
  },
  "about": "关于我的备用文本",
  "links": [],
  "projects": [
    {
      "title": "项目标题",
      "link": "项目链接",
      "image": "项目图片",
      "imagePosition": "left",  // 或 "right"
      "tags": [
        {
          "name": "标签名",
          "index": 0  // 使用预定义颜色索引
        }
      ],
      "description": "项目描述",
      "comment": "项目备注"
    }
  ]
}
```

### 简历数据（data/cv-*.json）

```json
{
  "personal": {
    "name": "姓名",
    "subtitle": "副标题",
    "about": ["关于信息1", "关于信息2"]
  },
  "achievements": ["成就1", "成就2"],
  "projects": [
    {
      "title": "项目名",
      "period": "时间段",
      "description": "描述",
      "tags": ["标签1", "标签2"]
    }
  ],
  "papers": [
    {
      "title": "论文标题",
      "author": "作者信息",
      "venue": "发表会议/期刊"
    }
  ],
  "skills": {
    "分类1": ["技能1", "技能2"],
    "分类2": ["技能3", "技能4"]
  },
  "links": [
    {
      "icon": "图标",
      "name": "链接名",
      "desc": "描述",
      "url": "URL"
    }
  ]
}
```

## 颜色系统

所有颜色定义在 `lib/colors.ts` 中：

### 使用方法

```typescript
import { TECH_COLORS, getTagColorByIndex } from '@/lib/colors';

// 使用预定义颜色
const primaryColor = TECH_COLORS.primary;

// 使用标签颜色（按索引）
const tagColor = getTagColorByIndex(0);
```

### 色板分类

- **TECH_COLORS**: 主页科技风格
- **PINK_COLORS**: 粉色简历风格
- **BLUE_COLORS**: 蓝色简历风格
- **TAG_COLOR_PALETTE**: 项目标签颜色（10色循环）
- **STATUS_COLORS**: 状态颜色（成功、警告、错误等）

## 调试技巧

### 开发模式

开发模式下支持热重载，修改代码后自动刷新页面。

```bash
npm run dev
```

### 类型检查

```bash
npx tsc --noEmit
```

### 代码检查

```bash
npm run lint
```

### 查看构建输出

```bash
npm run build
```

查看 `.next/` 目录了解构建结果。

### 调试服务端代码

在服务端组件中使用 `console.log` 会在终端输出，而不是浏览器控制台。

### 调试客户端代码

在客户端组件中（标记 `'use client'`）使用 `console.log` 会在浏览器控制台输出。

## 常见问题

### Q: 修改数据后页面没有更新？

A: 开发模式下应该自动更新。如果没有，尝试：
1. 保存文件（Ctrl+S）
2. 刷新浏览器（Ctrl+R）
3. 重启开发服务器

### Q: 样式没有生效？

A: 检查：
1. CSS 模块命名是否正确（`.module.css`）
2. 类名是否正确导入（`styles.className`）
3. 浏览器缓存是否需要清除

### Q: TypeScript 报错？

A: 运行 `npm run build` 查看详细错误信息，确保类型定义正确。

### Q: 如何添加新的依赖包？

A: 使用 npm 安装：
```bash
npm install package-name
npm install --save-dev @types/package-name  # 如果需要类型定义
```

## 性能优化建议

1. **图片优化**
   - 使用适当的图片格式（WebP）
   - 压缩图片大小
   - 使用 Next.js Image 组件

2. **代码优化**
   - 避免不必要的重新渲染
   - 使用 React.memo 缓存组件
   - 合理使用 useCallback 和 useMemo

3. **数据加载**
   - 保持 JSON 文件精简
   - 避免加载过大的数据

## 贡献指南

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启 Pull Request

## 参考资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [CSS Modules](https://github.com/css-modules/css-modules)
