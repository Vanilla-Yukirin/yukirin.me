/**
 * 主页组件
 * 展示个人介绍、置顶项目等信息
 */

import Link from 'next/link';
import { getHomeData, getAboutContent } from '@/lib/data';
import { getPinnedProjects } from '@/lib/pagination';
import { getCommitInfo, getLinkIcon } from '@/lib/utils';
import ProjectCard from '@/components/ProjectCard';
import styles from './page.module.css';

/**
 * 主页组件（服务端渲染）
 * 只展示置顶（pin=true）的项目
 */
export default async function HomePage() {
  // 服务端获取数据，无需客户端 fetch
  const data = await getHomeData();
  const aboutHtml = await getAboutContent();
  const { commitSha, commitUrl } = getCommitInfo();

  // 获取置顶项目（pin=true的项目，已按sortId降序排序）
  const pinnedProjects = getPinnedProjects(data.projects);

  return (
    <div className={styles.container}>
        {/* 头部区域 */}
        <header className={styles.hero}>
          <div className={styles.avatarWrapper}>
            <img
              src={data.personal.avatar}
              alt="Avatar"
              className={styles.avatar}
            />
          </div>
          <h1 className={styles.mainTitle}>{data.personal.name}</h1>
          <p className={styles.subtitle}>{data.personal.subtitle}</p>
        </header>

        {/* 主内容区域 */}
        <div className={styles.mainContent}>
          {/* 侧边栏 */}
          <aside className={styles.sidebar}>
            {/* 联系方式 */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>联系方式</h3>
              <div className={styles.contactLinks}>
                {data.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className={styles.contactItem}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <i className={getLinkIcon(link.icon)} aria-hidden="true"></i>
                    <span>{link.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* 个人信息 */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>个人信息</h3>
              <div className={styles.infoList}>
                {Object.entries(data.personal.info).map(([label, value]) => (
                  <div key={label} className={styles.infoItem}>
                    <span className={styles.infoLabel}>{label}:</span>
                    <span className={styles.infoValue}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* 中间内容区 */}
          <div className={styles.contentArea}>
            {/* 关于我 - Markdown 内容 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>[ 关于我 ]</h2>
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: aboutHtml }}
              />
            </section>

            {/* 项目/作品卡片区域 - 仅显示置顶项目 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>[ 精选项目 ]</h2>
              <div className={styles.cardsGrid}>
                {pinnedProjects.map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))}
              </div>

              {/* 查看更多按钮 - 跳转到完整项目列表的第1页 */}
              <div className={styles.viewMoreWrapper}>
                <Link href="/page/1" className={styles.viewMoreButton}>
                  <span>查看更多项目</span>
                  <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
            </section>
          </div>
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
          <p className={styles.quote}>&quot;Stay hungry, stay foolish.&quot;</p>
        </footer>
    </div>
  );
}
