/**
 * 分页工具函数
 * 用于处理项目卡片的分页逻辑
 */

import type { Project } from './types';

/**
 * 每页显示的项目数量
 */
export const ITEMS_PER_PAGE = 6;

/**
 * 分页数据接口
 */
export interface PaginationData<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * 对项目列表进行分页
 * @param projects 项目列表
 * @param page 当前页码（从1开始）
 * @returns 分页后的数据
 */
export function paginateProjects(
  projects: Project[],
  page: number
): PaginationData<Project> {
  const currentPage = Math.max(1, Math.floor(page));
  const totalItems = projects.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // 确保页码在有效范围内
  const validPage = Math.min(currentPage, Math.max(1, totalPages));

  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const items = projects.slice(startIndex, endIndex);

  return {
    items,
    currentPage: validPage,
    totalPages,
    totalItems,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
  };
}

/**
 * 生成页码数组（用于页码导航）
 * @param currentPage 当前页码
 * @param totalPages 总页数
 * @param maxVisible 最多显示的页码数量
 * @returns 页码数组
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | '...')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  // 调整起始和结束页码
  if (currentPage <= halfVisible) {
    endPage = maxVisible;
  } else if (currentPage >= totalPages - halfVisible) {
    startPage = totalPages - maxVisible + 1;
  }

  // 添加第一页和省略号
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push('...');
    }
  }

  // 添加中间的页码
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // 添加省略号和最后一页
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    pages.push(totalPages);
  }

  return pages;
}
