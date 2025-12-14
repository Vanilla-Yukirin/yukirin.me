/**
 * 全局加载器组件
 * 在页面加载时显示加载动画，等待字体和资源加载完成后淡出
 */

'use client';

import { useEffect, useState } from 'react';
import styles from './GlobalLoader.module.css';

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 检查字体是否加载完成
    const checkFontsLoaded = async () => {
      try {
        // 等待所有字体加载完成
        await document.fonts.ready;
        
        // 额外等待一小段时间确保渲染稳定
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        // 开始淡出动画
        setFadeOut(true);
        
        // 淡出完成后移除加载器
        setTimeout(() => {
          setLoading(false);
        }, 500); // 与 CSS transition 时间匹配
      } catch (error) {
        // 如果字体加载失败，也要移除加载器
        console.error('字体加载检测失败:', error);
        setFadeOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    // 设置超时保护，防止加载器永久显示
    const timeout = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }, 5000); // 5秒后强制移除

    checkFontsLoaded();

    return () => clearTimeout(timeout);
  }, []);

  // 加载完成后不渲染
  if (!loading) {
    return null;
  }

  return (
    <div className={`${styles.loader} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        {/* 简单的旋转加载动画 */}
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
        <p className={styles.text}>加载中...</p>
      </div>
    </div>
  );
}
