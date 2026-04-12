/**
 * 简历页面 - 蓝色科技风格
 * 展示详细的个人简历信息
 */

import { getCVBlueData } from '@/lib/data';
import styles from './page.module.css';

/**
 * 简历页面组件（服务端渲染）
 */
export default async function CVBluePage() {
  // 服务端获取数据
  const data = await getCVBlueData();

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        {/* 头部 */}
        <header className={styles.header}>
          <h1 className={styles.title}>{data.personal.name}</h1>
          <p className={styles.subtitle}>{data.personal.subtitle}</p>
        </header>

        {/* 关于我 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>📋 关于我</h2>
          <div className={styles.aboutContent}>
            {data.personal.about.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </section>

        {/* 竞赛成就 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>🏆 竞赛成就</h2>
          <ul className={styles.achievementList}>
            {data.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </section>

        {/* 项目经历 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>🔬 项目经历</h2>
          <div className={styles.projectList}>
            {data.projects.map((project, index) => (
              <div key={index} className={styles.projectItem}>
                <h3>{project.title}</h3>
                <p className={styles.projectPeriod}>{project.period}</p>
                <p className={styles.projectDesc}>{project.description}</p>
                <div className={styles.projectTags}>
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 发表论文 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>📝 发表论文</h2>
          <ul className={styles.paperList}>
            {data.papers.map((paper, index) => (
              <li key={index}>
                {paper.link ? (
                  <a href={paper.link} target="_blank" rel="noopener noreferrer">
                    <strong>{paper.title}</strong>
                  </a>
                ) : (
                  <strong>{paper.title}</strong>
                )}
                <br />
                {paper.author} · {paper.venue}
              </li>
            ))}
          </ul>
        </section>

        {/* 技能特长 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>💡 技能特长</h2>
          <div className={styles.skillsGrid}>
            {Object.entries(data.skills).map(([category, skills]) => (
              <div key={category} className={styles.skillCategory}>
                <h4>{category}</h4>
                <div className={styles.skillTags}>
                  {skills.map((skill, index) => (
                    <span key={index} className={styles.tag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 传送门 */}
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>🔗 传送门</h2>
          <div className={styles.linksGrid}>
            {data.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className={styles.linkItem}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <span className={styles.linkIcon}>{link.icon}</span>
                <div className={styles.linkText}>
                  <div className={styles.linkName}>{link.name}</div>
                  <div className={styles.linkDesc}>{link.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 页脚 */}
        <footer className={styles.footer}>
          <p>© 2024 Vanilla Yukirin</p>
          <p className={styles.footerQuote}>持续学习中 ✨</p>
        </footer>
      </main>
    </div>
  );
}
