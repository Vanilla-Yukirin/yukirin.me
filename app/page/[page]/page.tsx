/**
 * 分页页面组件
 * 展示指定页码的项目卡片
 */

import { notFound } from 'next/navigation';
import { getHomeData } from '@/lib/data';
import { paginateProjects } from '@/lib/pagination';
import { getCommitInfo } from '@/lib/utils';
import ProjectCard from '@/components/ProjectCard';
import Pagination from '@/components/Pagination';
import styles from './page.module.css';

/**
 * 页面参数类型
 */
interface PageProps {
  params: {
    page: string;
  };
}

/**
 * 生成静态路径（用于静态生成）
 */
export async function generateStaticParams() {
  const data = await getHomeData();
  const paginationData = paginateProjects(data.projects, 1);
  const totalPages = paginationData.totalPages;

  // 生成所有页码路径
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

/**
 * 分页页面组件（服务端渲染）
 */
export default async function PaginatedPage({ params }: PageProps) {
  const pageNum = parseInt(params.page, 10);

  // 验证页码
  if (isNaN(pageNum) || pageNum < 1) {
    notFound();
  }

  // 服务端获取数据
  const data = await getHomeData();
  const { commitSha, commitUrl } = getCommitInfo();

  // 分页处理
  const paginationData = paginateProjects(data.projects, pageNum);

  // 如果页码超出范围，返回404
  if (pageNum > paginationData.totalPages) {
    notFound();
  }

  return (
    <div className={styles.container}>
        {/* 主内容区域 - 不显示侧边栏，给项目列表更多空间 */}
        <div className={styles.mainContent}>
          {/* 项目/作品卡片区域 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              [ 项目与作品 - 第 {paginationData.currentPage} 页 ]
            </h2>
            <div className={styles.cardsGrid}>
              {paginationData.items.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>

            {/* 分页导航 */}
            <Pagination
              currentPage={paginationData.currentPage}
              totalPages={paginationData.totalPages}
            />
          </section>
        </div>

        {/* 页脚 */}
        <footer className={styles.footer}>
          <p>© 2025 Vanilla Yukirin · 永远可爱 · 永远善良</p>
          <p className={styles.quote}>
            当前版本：
            <a href={commitUrl} target="_blank" rel="noopener noreferrer">
              {commitSha}
            </a>
          </p>
          {/* 暂时隐去quote */}
          {/*<p className={styles.quote}>&quot;Stay hungry, stay foolish.&quot;</p>*/}
        </footer>
    </div>
  );
}
