/**
 * 主页组件
 * 展示个人介绍、项目作品等信息
 */

import { getHomeData, getAboutContent } from '@/lib/data';
import BackgroundCanvas from '@/components/BackgroundCanvas';
import ProjectCard from '@/components/ProjectCard';
import styles from './page.module.css';

/**
 * 主页组件（服务端渲染）
 */
export default async function HomePage() {
  // 服务端获取数据，无需客户端 fetch
  const data = await getHomeData();
  const aboutHtml = await getAboutContent();

  return (
    <>
      {/* 背景动画画布 */}
      <BackgroundCanvas />

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
                <a
                  href="https://github.com/Vanilla-Yukirin"
                  className={styles.contactItem}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="ri-github-fill" aria-hidden="true"></i>
                  <span>GitHub</span>
                </a>
                <a href="mailto:contact@yukirin.me" className={styles.contactItem}>
                  <i className="ri-mail-line" aria-hidden="true"></i>
                  <span>Email</span>
                </a>
                <a href="/cv-pink" className={styles.contactItem}>
                  <i className="ri-file-text-line" aria-hidden="true"></i>
                  <span>简历 CV</span>
                </a>
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

            {/* 项目/作品卡片区域 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>[ 项目与作品 ]</h2>
              <div className={styles.cardsGrid}>
                {data.projects.map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* 页脚 */}
        <footer className={styles.footer}>
          <p>© 2025 Vanilla Yukirin · 永远可爱 · 永远善良</p>
          <p className={styles.quote}>&quot;Stay hungry, stay foolish.&quot;</p>
        </footer>
      </div>
    </>
  );
}
