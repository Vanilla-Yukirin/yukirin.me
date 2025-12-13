/**
 * 项目卡片组件
 * 展示单个项目的信息
 */

import type { Project } from '@/lib/types';
import { getTagColorByIndex } from '@/lib/colors';
import styles from './ProjectCard.module.css';

/**
 * 项目卡片组件属性
 */
interface ProjectCardProps {
  project: Project;
}

/**
 * 项目卡片组件
 * @param project 项目数据
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  const isImageLeft = project.imagePosition === 'left';

  return (
    <a
      href={project.link}
      className={styles.projectCard}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* 图片部分 */}
      {isImageLeft && (
        <div
          className={styles.cardImage}
          style={{ backgroundImage: `url('${project.image}')` }}
        />
      )}

      {/* 内容部分 */}
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{project.title}</h3>
          <svg
            className={styles.cardLinkIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </div>

        <div className={styles.cardTags}>
          {project.tags.map((tag, index) => {
            const color =
              typeof tag.index === 'number'
                ? getTagColorByIndex(tag.index)
                : tag.color || '#33ccff';
            return (
              <span
                key={index}
                className={styles.cardTag}
                style={{ backgroundColor: color }}
              >
                {tag.name}
              </span>
            );
          })}
        </div>

        <p className={styles.cardDescription}>{project.description}</p>
        <p className={styles.cardComment}>{project.comment}</p>
      </div>

      {/* 图片部分（右侧） */}
      {!isImageLeft && (
        <div
          className={styles.cardImage}
          style={{ backgroundImage: `url('${project.image}')` }}
        />
      )}
    </a>
  );
}

