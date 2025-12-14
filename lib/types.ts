/**
 * 类型定义文件
 * 定义整个应用使用的 TypeScript 类型
 */

/**
 * 个人信息类型
 */
export interface PersonalInfo {
  name: string;
  subtitle: string;
  avatar: string;
  info: Record<string, string>;
}

/**
 * 项目标签类型
 */
export interface ProjectTag {
  name: string;
  index?: number;
  color?: string;
}

/**
 * 项目信息类型
 */
export interface Project {
  title: string;
  link: string;
  image: string;
  imagePosition: 'left' | 'right';
  tags: ProjectTag[];
  description: string;
  comment: string;
  pin?: boolean;        // 是否在首页置顶显示（类似GitHub的pin功能）
  sortId?: number;      // 排序编号，数字越大越靠前，允许负数
}

/**
 * 链接信息类型
 */
export interface Link {
  name: string;
  url: string;
  icon: string;
}

/**
 * 主页数据类型
 */
export interface HomeData {
  personal: PersonalInfo;
  about: string;
  links: Link[];
  projects: Project[];
}

/**
 * 简历页个人信息类型
 */
export interface CVPersonalInfo {
  name: string;
  subtitle: string;
  about: string[];
}

/**
 * 简历页项目类型
 */
export interface CVProject {
  title: string;
  period: string;
  description: string;
  tags: string[];
}

/**
 * 论文类型
 */
export interface Paper {
  title: string;
  author: string;
  venue: string;
}

/**
 * 简历页链接类型
 */
export interface CVLink {
  icon: string;
  name: string;
  desc: string;
  url: string;
}

/**
 * 简历页数据类型
 */
export interface CVData {
  personal: CVPersonalInfo;
  achievements: string[];
  projects: CVProject[];
  papers: Paper[];
  skills: Record<string, string[]>;
  links: CVLink[];
}
