/**
 * Next.js 路由切换加载状态
 * 使用与 GlobalLoader 相同的样式以保持一致性
 */

import styles from '@/components/GlobalLoader.module.css';

export default function Loading() {
  return (
    <div className={styles.loader} aria-busy="true" aria-live="polite">
      <div className={styles.wrap}>
        <div className={styles.ring}></div>
        <img src="/images/load.png" alt="loading" className={styles.image} />
      </div>
    </div>
  );
}
