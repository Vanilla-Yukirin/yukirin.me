# TODO - 后续优化建议

## 优先级：中

### 1. 图片优化
**位置**: `app/page.tsx` (lines 28-32)
**问题**: 使用了标准 `<img>` 标签而不是 Next.js Image 组件
**建议**: 
```typescript
import Image from 'next/image';

// 替换
<img src={data.personal.avatar} alt="Avatar" className={styles.avatar} />

// 为
<Image 
  src={data.personal.avatar} 
  alt="Avatar" 
  width={150} 
  height={150}
  className={styles.avatar}
  priority
/>
```
**收益**: 
- 自动图片优化
- 懒加载
- 响应式图片
- 更好的性能

### 2. 背景动画边界检测优化
**位置**: `components/BackgroundCanvas.tsx` (lines 53-54)
**问题**: 粒子边界碰撞逻辑可能导致粒子卡在边界
**建议**:
```typescript
update() {
  this.x += this.vx;
  this.y += this.vy;

  // 改进的边界检测
  if (this.x < 0) {
    this.x = 0;
    this.vx = Math.abs(this.vx);
  } else if (this.x > canvas.width) {
    this.x = canvas.width;
    this.vx = -Math.abs(this.vx);
  }
  
  if (this.y < 0) {
    this.y = 0;
    this.vy = Math.abs(this.vy);
  } else if (this.y > canvas.height) {
    this.y = canvas.height;
    this.vy = -Math.abs(this.vy);
  }
}
```
**收益**: 
- 更流畅的粒子运动
- 避免边界卡顿

### 3. 外部脚本安全性
**位置**: `app/layout.tsx` (lines 49-53)
**问题**: 加载外部脚本没有完整性检查
**建议**: 
```typescript
// 选项 1: 添加 integrity 属性（需要获取脚本的 hash）
<script
  defer
  src="https://was.arisumika.top/script.js"
  data-website-id="38b7f262-a375-4e89-a600-68f654ad249e"
  integrity="sha384-..."
  crossOrigin="anonymous"
></script>

// 选项 2: 实现 CSP（Content Security Policy）
// 在 next.config.js 中配置
```
**收益**: 
- 防止脚本被篡改
- 提高安全性

## 优先级：低

### 4. 本地字体优化
使用 `next/font/local` 加载本地字体文件。

**步骤**:
1. 将字体文件放到 `public/fonts/`
2. 在 `app/layout.tsx` 中配置
3. 应用字体到全局样式

### 5. 添加 Loading 状态
为页面添加 loading.tsx 文件，提供加载状态。

### 6. 添加 Error 边界
为页面添加 error.tsx 文件，处理错误情况。

### 7. 性能监控
集成 Vercel Analytics 或 Google Analytics。

### 8. 单元测试
添加 Jest + React Testing Library 进行单元测试。

### 9. E2E 测试
使用 Playwright 或 Cypress 进行端到端测试。

### 10. CI/CD 流程
配置 GitHub Actions 自动化测试和部署。

## 完成的优化

✅ Next.js 14 + TypeScript 初始化
✅ 服务端渲染（SSR/SSG）
✅ 统一颜色管理系统
✅ CSS Modules 样式隔离
✅ API 路由预留
✅ 中文注释完整
✅ 文档完善

## 说明

以上优化建议不影响当前功能的正常使用。项目已经可以部署到生产环境。
这些优化可以在后续迭代中逐步实现，以进一步提升用户体验和代码质量。
