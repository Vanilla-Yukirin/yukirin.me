/**
 * 数据加载工具函数
 * 用于服务端读取和解析数据文件
 */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import type { HomeData, CVData } from './types';

/**
 * 获取数据文件路径
 * @param filename 文件名
 * @returns 完整文件路径
 */
function getDataPath(filename: string): string {
  return path.join(process.cwd(), 'data', filename);
}

/**
 * 获取公共资源路径
 * @param filename 文件名
 * @returns 完整文件路径
 */
function getPublicPath(filename: string): string {
  return path.join(process.cwd(), 'public', filename);
}

/**
 * 读取主页数据（服务端）
 * @returns 主页数据对象
 */
export async function getHomeData(): Promise<HomeData> {
  const dataPath = getDataPath('data.json');
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(fileContent) as HomeData;
}

/**
 * 读取 About 页面的 Markdown 内容（服务端）
 * @returns HTML 格式的关于内容
 */
export async function getAboutContent(): Promise<string> {
  try {
    const aboutPath = getDataPath('about.md');
    const markdown = fs.readFileSync(aboutPath, 'utf-8');
    return marked.parse(markdown) as string;
  } catch (error) {
    console.error('读取 about.md 失败:', error);
    // 降级到 data.json 中的 about 字段
    const data = await getHomeData();
    return marked.parse(data.about || '') as string;
  }
}

/**
 * 读取简历页数据（粉色版）（服务端）
 * @returns 简历数据对象
 */
export async function getCVPinkData(): Promise<CVData> {
  const dataPath = getDataPath('cv-pink.json');
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(fileContent) as CVData;
}

/**
 * 读取简历页数据（蓝色版）（服务端）
 * @returns 简历数据对象
 */
export async function getCVBlueData(): Promise<CVData> {
  const dataPath = getDataPath('cv-blue.json');
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(fileContent) as CVData;
}

/**
 * HTML 转义工具函数（防止 XSS）
 * @param text 原始文本
 * @returns 转义后的文本
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
