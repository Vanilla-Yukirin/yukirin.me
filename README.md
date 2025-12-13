# yukirin.me

Yukirin 的个人网站

## 特点

- **双页面设计**：主页+简历页
- **完全响应式布局**：移动端&桌面端适配
- **侧边栏导航**：快速展示联系方式和个人信息
- **Markdown支持**：“关于我”部分支持Markdown渲染
- **项目卡片系统**：灵活展示项目、论文、作品
- **集成流量统计**：感谢 Arisu 的支持

## 项目结构

```
yukirin.me/
├── index.html          # 主页页面
├── style.css           # 主页样式
├── script.js           # 主页脚本
├── data.json           # 数据文件（个人信息、项目列表）
├── about.md            # “关于我”Markdown 文件
├── images/             # 图片资源
│   └── avatar.png      # 头像图片
├── assets/             # 静态资源
│   └── fonts/          # 自定义字体
├── cv-blue/            # 简历页（蓝色主题）
├── cv-pink/            # 简历页（粉色主题）
├── favicon.png         # 网站图标
└── README.md           # README
```

## 快速开始

### 本地开发

对于 vscode，可以使用Live Server插件；或者使用任意HTTP服务器即可：

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

### 1. 修改头像和网站图标

将你的头像图片放到 `images/avatar.png`，网站图标放到根目录 `favicon.png`。

`data.json` 会自动引用本地头像：
```json
"avatar": "images/avatar.png"
```

### 2. 修改"关于我"内容 ⭐

**直接编辑 `about.md` 文件**，使用 Markdown 语法编写你的自我介绍。

这是一个独立的 Markdown 文件，方便编辑和版本控制。页面会自动加载并渲染该文件。

示例内容：
```markdown
我是一名数据科学与大数据技术专业的在读学生...

## 研究方向
- 深度学习
- 自然语言处理

## 技能
- **编程语言**: Python, C++
- **深度学习**: PyTorch, TensorFlow
```

支持的 Markdown 特性：
- 标题（`##`）
- 列表（`-`、`1.`）
- 粗体（`**文本**`）、斜体（`*文本*`）
- 超链接（`[文字](URL)`）会显示为**粉色加粗下划线**
- 代码块（`` `code` ``）

### 3. 修改个人信息

编辑 `data.json`：

```json
{
  "personal": {
    "name": "你的名字",
    "subtitle": "你的标签 | 你的专业",
    "avatar": "images/avatar.png",
    "info": {
      "身份": "本科在读",
      "学校": "某大学",
      "专业": "某专业",
      "状态": "持续学习中"
    }
  }
}
```

### 4. 添加/修改项目卡片

编辑 `data.json` 中的 `projects` 数组：

```json
{
  "title": "项目名称",
  "link": "https://github.com/...",
  "image": "https://example.com/image.jpg",
  "imagePosition": "left",
  "tags": [
    { "name": "深度学习", "index": 0 },
    { "name": "PyTorch", "index": 2 }
  ],
  "description": "项目详细描述",
  "comment": "一句话评价"
}
```

**属性说明：**
- `title`: 项目标题
- `link`: 点击卡片跳转的链接
- `image`: 项目配图 URL
- `imagePosition`: 图片位置，`"left"` 或 `"right"`
- `tags`: 标签数组
  - `name`: 标签文字
  - `index`: 颜色索引（0-9），使用预定义的 10 色色板
- `description`: 项目详细描述
- `comment`: 补充说明（斜体显示）

**标签颜色索引（0-9）：**
- 0: 活力青 `#33CCFF`
- 1: 天空蓝 `#3399FF`
- 2: 靛青色 `#5C7CFA`
- 3: 罗兰紫 `#845EF7`
- 4: 葡萄紫 `#BE4BDB`
- 5: 甜心粉 `#F06595`
- 6: 珊瑚红 `#FF6B6B`
- 7: 青绿色 `#20C997`
- 8: 湖蓝色 `#3BC9DB`
- 9: 矢车菊蓝 `#4DABF7`

索引会循环使用，例如 `index: 10` 等价于 `index: 0`。

### 5. 修改联系方式

联系方式已使用 [Remix Icon](https://remixicon.com/)，无需手动编写 SVG。

编辑 `index.html` 中的侧边栏：

```html
<a href="你的链接" class="contact-item">
    <i class="ri-github-fill" aria-hidden="true"></i>
    <span>GitHub</span>
</a>
```

常用图标类名：
- GitHub: `ri-github-fill`
- Email: `ri-mail-line`
- 简历: `ri-file-text-line`
- Twitter: `ri-twitter-fill`
- LinkedIn: `ri-linkedin-fill`

### 6. 修改配色

#### 主页配色（蓝色系）

编辑 `style.css` 中的 CSS 变量：

```css
:root {
    --primary-color: #33ccff;        /* 主色调（青蓝色） */
    --secondary-color: #66b3ff;      /* 次色调（浅蓝色） */
    --background: #f0f8ff;           /* 背景色（浅蓝白） */
    --card-bg: #ffffff;              /* 卡片背景 */
    --text-primary: #2d2d2d;         /* 主文字颜色 */
    --text-secondary: #666666;       /* 次文字颜色 */
    /* ... */
}
```

#### 简历页配色

- `cv-blue/`: 蓝色主题
- `cv-pink/`: 粉色主题

可编辑对应目录下的 `style.css`。

### 7. 自定义字体

项目已配置中英文双字体：
- **英文**: JetBrains Mono（等宽，适合代码风格）
- **中文**: Sarasa Mono Slab SC（更纱黑体，等宽）

字体文件位于 `assets/fonts/`，通过 `unicode-range` 自动按字符集分配。

如需更换字体，编辑 `style.css` 的 `@font-face` 规则。

## 🎯 核心特性

### 数据驱动架构

- **数据与代码分离**：个人信息、项目列表存储在 `data.json`
- **Markdown 独立编辑**：自我介绍写在 `about.md`，支持版本控制
- **静态色板系统**：10 色预定义色板，标签使用 0-9 索引，无需手写色值
- **自动字体分配**：中英文通过 `unicode-range` 自动使用不同字体

### 样式系统

- **响应式布局**：移动端&桌面端自适应
- **等宽字体组合**：标题和标签使用 JetBrains Mono + Sarasa Mono，统一科技感
- **Remix Icon 集成**：图标使用 CSS 类名，无需内联 SVG
- **Markdown 渲染**：自动渲染 `about.md`，支持粗体、斜体、列表、链接等

## 🎨 设计说明

### 主页（蓝色系）
- 浅色背景 + 青蓝色主题
- 侧边栏布局
- 项目卡片左右交替展示
- Markdown 自我介绍区域
- 统一的等宽字体（标题、标签）

### 简历页（双主题）
- **cv-blue/**: 蓝色主题
- **cv-pink/**: 粉色主题
- 卡片式信息展示
- 详细的项目和论文信息

### 超链接样式
- 浅粉色 `#FF8FAB`
- 加粗 + 下划线
- hover 时变深粉 `#FF6B9D`

## 🌐 浏览器支持

- 现代浏览器 (Chrome, Firefox, Safari, Edge)
- 移动浏览器 (iOS Safari, Chrome Mobile)
- 需要支持ES6+和Canvas API

## 📄 许可证

个人网站 - 保留所有权利