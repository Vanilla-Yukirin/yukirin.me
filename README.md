# yukirin.me

Vanilla Yukirin 的个人主页 - 简洁可爱的平坦化设计风格

## ✨ 特点

- 🎨 简洁可爱的平坦化设计
- 💗 轻微二次元风格（粉色系配色）
- 📱 完全响应式布局
- 🔗 传送门链接（GitHub、邮箱等）
- 📊 集成流量统计
- 🚀 纯静态网站，无需构建工具
- 📦 模块化设计，易于扩展

## 🚀 快速开始

这是一个纯静态网站，无需任何构建工具！

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

然后在浏览器中打开 http://localhost:8080

### 部署

将整个仓库部署到任何静态托管服务：

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- 任何Web服务器 (nginx, Apache等)

所有文件 (`index.html`, `style.css`, `script.js`) 都应放在Web服务器的根目录。

## 📝 自定义配置

### 更新个人信息

编辑 `index.html` 来更新：
- 个人详情（姓名、学历、专业）
- 竞赛成就
- 项目经历
- 发表论文
- 技术技能
- 联系链接

### 添加文章列表

在 `index.html` 中找到文章列表部分（已注释），取消注释即可启用：

```html
<!-- 取消注释以启用文章列表功能
<section class="card">
    <h2 class="section-title">📚 最新文章</h2>
    <div class="articles-list">
        <article class="article-item">
            <h3 class="article-title">文章标题</h3>
            <p class="article-meta">2024-12-12 · 技术分享</p>
            <p class="article-excerpt">文章摘要...</p>
        </article>
    </div>
</section>
-->
```

### 添加更多链接

在 `index.html` 的传送门区域添加新链接：

```html
<a href="你的链接" class="link-item" target="_blank">
    <span class="link-icon">🔗</span>
    <div class="link-text">
        <div class="link-name">链接名称</div>
        <div class="link-desc">链接描述</div>
    </div>
</a>
```

### 修改配色

编辑 `style.css` 中的CSS变量：

```css
:root {
    --primary-color: #ff9ec7;        /* 主色调（粉色） */
    --secondary-color: #b4a7f5;      /* 次色调（淡紫色） */
    --accent-color: #a7d8ff;         /* 强调色（浅蓝色） */
    --background: #fef9ff;           /* 背景色 */
    /* ... */
}
```

## 🎯 可扩展区域

网站设计了多个可扩展区域，方便后续添加内容：

1. **文章列表** - 已在HTML中预留（注释状态）
2. **传送门** - 可以添加更多社交媒体链接
3. **项目经历** - 可以添加更多项目
4. **技能标签** - 可以添加更多技术栈

所有区域都采用统一的卡片样式，添加新内容只需复制现有结构即可。

## 🌐 浏览器支持

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- 移动浏览器 (iOS Safari, Chrome Mobile)

## 📄 许可证

个人网站 - 保留所有权利