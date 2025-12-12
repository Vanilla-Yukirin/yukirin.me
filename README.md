# yukirin.me

Vanilla Yukirin 的个人网站 - 科技风格主页 + 可爱简历

## ✨ 特点

- 🎨 **双页面设计**：科技风格主页 + 可爱简历页
- 🌌 **粒子动画背景**：科技感十足的动态背景
- 📱 **完全响应式布局**：移动端和桌面端完美适配
- 🔗 **侧边栏导航**：便捷的联系方式和个人信息
- 📝 **Markdown支持**：关于我部分支持Markdown渲染
- 🎴 **项目卡片系统**：灵活展示项目、论文、作品
- 📊 **集成流量统计**
- 🚀 **纯静态网站**：无需构建工具

## 📂 项目结构

```
yukirin.me/
├── index.html          # 主页（科技风格）
├── style.css           # 主页样式
├── script.js           # 主页脚本（包含项目数据）
├── cv/                 # 简历目录
│   ├── index.html      # 简历页面（可爱风格）
│   ├── style.css       # 简历样式
│   └── script.js       # 简历脚本
└── README.md           # 本文件
```

## 🚀 快速开始

### 本地开发

使用任意HTTP服务器即可：

```bash
# 使用 Python 3
python3 -m http.server 8080

# 使用 Node.js (http-server)
npx http-server -p 8080

# 使用 PHP
php -S localhost:8080
```

然后在浏览器中打开：
- 主页：http://localhost:8080
- 简历：http://localhost:8080/cv

### 部署

将整个仓库部署到任何静态托管服务：

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- 任何Web服务器 (nginx, Apache等)

## 📝 自定义配置

### 1. 修改头像

编辑 `index.html` 第16行：

```html
<img src="你的头像URL" alt="Avatar" class="avatar" id="avatar">
```

### 2. 修改个人简介（Markdown）

编辑 `script.js` 中的 `aboutMarkdown` 变量（约第75行）：

```javascript
const aboutMarkdown = `
你的Markdown内容...
`;
```

### 3. 添加/修改项目卡片

编辑 `script.js` 中的 `projects` 数组（约第95行）：

```javascript
const projects = [
    {
        title: '项目名称',
        link: '项目链接',
        background: '背景图片URL',  // 可选
        tags: [
            { name: '标签1', color: '#颜色1' },
            { name: '标签2', color: '#颜色2' }
        ],
        description: '项目描述',
        comment: '一句话评价'
    },
    // 继续添加更多项目...
];
```

**卡片属性说明：**
- `title`: 项目标题
- `link`: 点击卡片跳转的链接
- `background`: 背景图片URL（可选，留空则显示纯色）
- `tags`: 标签数组，每个标签包含名称和颜色
- `description`: 项目详细描述
- `comment`: 一句话评价或补充说明（斜体显示）

### 4. 修改联系方式

编辑 `index.html` 中的侧边栏联系方式（约第25-48行）：

```html
<a href="你的链接" class="contact-item">
    <svg>...</svg>
    <span>链接名称</span>
</a>
```

### 5. 修改配色

#### 主页配色（科技风格）

编辑 `style.css` 中的CSS变量：

```css
:root {
    --primary-color: #00ff9f;        /* 主色调（青绿色） */
    --secondary-color: #00d4ff;      /* 次色调（蓝色） */
    --background: #0a0e27;           /* 背景色（深蓝） */
    /* ... */
}
```

#### 简历页配色（可爱风格）

编辑 `cv/style.css` 中的CSS变量。

## 🎯 扩展功能

### 添加更多卡片

只需在 `script.js` 的 `projects` 数组中添加新对象即可：

```javascript
{
    title: '新项目',
    link: 'https://example.com',
    background: 'https://example.com/image.jpg',
    tags: [
        { name: 'React', color: '#61dafb' },
        { name: 'TypeScript', color: '#3178c6' }
    ],
    description: '这是一个新项目',
    comment: '正在开发中...'
}
```

### 修改粒子数量

编辑 `script.js` 中的粒子数量（约第50行）：

```javascript
const particleCount = 80;  // 修改这个数字
```

### 禁用粒子动画

如果不需要粒子动画，可以注释掉 `script.js` 中的整个粒子动画部分（第1-88行）。

## 🎨 设计说明

### 主页（科技风格）
- 深色背景 + 青绿色强调
- 粒子动画背景
- 侧边栏布局
- 项目卡片网格展示

### 简历页（可爱风格）
- 浅色背景 + 粉色系配色
- 平坦化设计
- 卡片式信息展示
- 详细的项目和论文信息

## 🌐 浏览器支持

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- 移动浏览器 (iOS Safari, Chrome Mobile)
- 需要支持ES6+和Canvas API

## 📄 许可证

个人网站 - 保留所有权利