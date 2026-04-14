/**
 * 简历页共用组件
 * 通过 theme 属性切换粉色 / 蓝色风格
 */

import type { CVData } from '@/lib/types';
import styles from './CVPage.module.css';

interface CVPageProps {
  data: CVData;
  theme: 'pink' | 'blue';
}

export default function CVPage({ data, theme }: CVPageProps) {
  return (
    <div className={styles.container} data-theme={theme}>
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
