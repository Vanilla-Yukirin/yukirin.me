/**
 * 分页导航组件
 * 用于在页面底部显示分页控制
 */

import Link from 'next/link';
import { generatePageNumbers } from '@/lib/pagination';
import { getPageUrl } from '@/lib/utils';
import styles from './Pagination.module.css';

/**
 * 分页组件属性
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

/**
 * 分页导航组件
 * @param currentPage 当前页码
 * @param totalPages 总页数
 */
export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  // 如果只有一页，不显示分页
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="分页导航">
      <div className={styles.paginationInner}>
        {/* 上一页按钮 */}
        {currentPage > 1 ? (
          <Link href={getPageUrl(currentPage - 1)} className={styles.navButton}>
            <i className="ri-arrow-left-s-line"></i>
            <span>上一页</span>
          </Link>
        ) : (
          <span className={`${styles.navButton} ${styles.disabled}`}>
            <i className="ri-arrow-left-s-line"></i>
            <span>上一页</span>
          </span>
        )}

        {/* 页码列表 */}
        <div className={styles.pageNumbers}>
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <Link
                key={page}
                href={getPageUrl(page)}
                className={`${styles.pageNumber} ${isActive ? styles.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {/* 下一页按钮 */}
        {currentPage < totalPages ? (
          <Link href={getPageUrl(currentPage + 1)} className={styles.navButton}>
            <span>下一页</span>
            <i className="ri-arrow-right-s-line"></i>
          </Link>
        ) : (
          <span className={`${styles.navButton} ${styles.disabled}`}>
            <span>下一页</span>
            <i className="ri-arrow-right-s-line"></i>
          </span>
        )}
      </div>

      {/* 回到首页链接（在分页页面显示） */}
      <div className={styles.homeLink}>
        <Link href="/" className={styles.homeLinkButton}>
          <i className="ri-home-line"></i>
          <span>回到首页</span>
        </Link>
      </div>
    </nav>
  );
}
