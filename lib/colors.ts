/**
 * 颜色常量配置文件
 * 定义整个应用的静态色板，确保颜色使用的一致性
 */

/**
 * 主页科技风格色板（蓝-青色系）
 */
export const TECH_COLORS = {
  // 主色调
  primary: '#33CCFF',      // 活力青
  secondary: '#00d4ff',    // 天空蓝
  accent: '#00ff9f',       // 荧光绿（强调色）
  
  // 背景色
  bgDark: '#0a0e27',       // 深色背景
  bgCard: '#1a1f3a',       // 卡片背景
  bgHover: '#252b47',      // 悬停背景
  
  // 文字色
  textPrimary: '#ffffff',  // 主文字
  textSecondary: '#a0aec0', // 次要文字
  textMuted: '#718096',    // 弱化文字
  
  // 边框
  border: '#2d3748',       // 边框色
  borderLight: '#374151',  // 浅边框
} as const;

/**
 * 简历页粉色可爱风格色板
 */
export const PINK_COLORS = {
  // 主色调
  primary: '#ff9ec7',      // 甜心粉
  secondary: '#b4a7f5',    // 淡紫色
  accent: '#ffd6e7',       // 浅粉色
  
  // 背景色
  bgLight: '#fff5f9',      // 浅粉背景
  bgCard: '#ffffff',       // 卡片背景
  bgHover: '#ffe8f4',      // 悬停背景
  
  // 文字色
  textPrimary: '#2d3748',  // 主文字
  textSecondary: '#4a5568', // 次要文字
  textMuted: '#718096',    // 弱化文字
  
  // 边框
  border: '#ffd6e7',       // 边框色
  borderLight: '#ffe8f4',  // 浅边框
} as const;

/**
 * 简历页蓝色科技风格色板
 */
export const BLUE_COLORS = {
  // 主色调
  primary: '#3399FF',      // 天空蓝
  secondary: '#5C7CFA',    // 靛青色
  accent: '#4DABF7',       // 矢车菊蓝
  
  // 背景色
  bgLight: '#f0f7ff',      // 浅蓝背景
  bgCard: '#ffffff',       // 卡片背景
  bgHover: '#e6f3ff',      // 悬停背景
  
  // 文字色
  textPrimary: '#2d3748',  // 主文字
  textSecondary: '#4a5568', // 次要文字
  textMuted: '#718096',    // 弱化文字
  
  // 边框
  border: '#bee3f8',       // 边框色
  borderLight: '#e6f3ff',  // 浅边框
} as const;

/**
 * 项目卡片标签色板（10色）
 * 涵盖 蓝-紫-粉 色系，保持饱和度一致
 */
export const TAG_COLOR_PALETTE = [
  '#33CCFF', // 0: 活力青 (Primary)
  '#3399FF', // 1: 天空蓝
  '#5C7CFA', // 2: 靛青色
  '#845EF7', // 3: 罗兰紫
  '#BE4BDB', // 4: 葡萄紫
  '#F06595', // 5: 甜心粉
  '#FF6B6B', // 6: 珊瑚红
  '#20C997', // 7: 青绿色 (对比色)
  '#3BC9DB', // 8: 湖蓝色
  '#4DABF7', // 9: 矢车菊蓝
] as const;

/**
 * 根据索引获取标签颜色
 * @param index 颜色索引
 * @returns 十六进制颜色值
 */
export function getTagColorByIndex(index: number): string {
  // 确保 index 为整数，并循环使用色板
  const idx = Math.round(index) % TAG_COLOR_PALETTE.length;
  // 处理负数情况
  const safeIdx = idx < 0 ? idx + TAG_COLOR_PALETTE.length : idx;
  return TAG_COLOR_PALETTE[safeIdx];
}

/**
 * 状态色（语义化颜色）
 */
export const STATUS_COLORS = {
  success: '#20C997',      // 成功（绿色）
  warning: '#FFB020',      // 警告（橙色）
  error: '#FF6B6B',        // 错误（红色）
  info: '#33CCFF',         // 信息（青色）
} as const;

/**
 * 颜色工具函数
 */
export const colorUtils = {
  /**
   * 验证颜色格式是否有效
   * @param color 颜色字符串
   * @returns 是否为有效颜色
   */
  isValidColor(color: string): boolean {
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;
    return hexPattern.test(color) || rgbPattern.test(color) || rgbaPattern.test(color);
  },
  
  /**
   * 为颜色添加透明度
   * @param color 十六进制颜色
   * @param alpha 透明度 (0-1)
   * @returns RGBA 颜色字符串
   */
  addAlpha(color: string, alpha: number): string {
    if (!color.startsWith('#')) return color;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
};
