/**
 * 全局加载器组件
 * 在页面加载时显示加载动画，等待字体和资源加载完成后淡出
 */

'use client';

import { useEffect, useState } from 'react';
import styles from './GlobalLoader.module.css';

// 常量配置
const FADE_OUT_DURATION_MS = 500; // 淡出动画时长（需与 CSS transition 保持一致）
const MAX_LOADING_TIME_MS = 5000; // 最大加载时间（超时保护）
const RENDER_STABILIZATION_DELAY_MS = 100; // 渲染稳定等待时间

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let mounted = true;
    let fadeTimeout: NodeJS.Timeout | null = null;
    
    // 安全地触发淡出效果
    const triggerFadeOut = () => {
      if (!mounted) return;
      setFadeOut(true);
      fadeTimeout = setTimeout(() => {
        if (mounted) {
          setLoading(false);
        }
      }, FADE_OUT_DURATION_MS);
    };

    // 检查字体是否加载完成
    const checkFontsLoaded = async () => {
      try {
        // 检查浏览器是否支持 Font Loading API
        if (typeof document !== 'undefined' && 'fonts' in document) {
          // 等待所有字体加载完成
          await document.fonts.ready;
          
          // 额外等待一小段时间确保渲染稳定
          await new Promise((resolve) => setTimeout(resolve, RENDER_STABILIZATION_DELAY_MS));
          
          // 开始淡出动画
          triggerFadeOut();
        } else {
          // 不支持 Font Loading API，使用较短的固定延迟后淡出
          await new Promise((resolve) => setTimeout(resolve, 1000));
          triggerFadeOut();
        }
      } catch (error) {
        // 如果字体加载失败，也要移除加载器
        console.error('Font loading detection failed:', error);
        triggerFadeOut();
      }
    };

    // 设置超时保护，防止加载器永久显示
    const maxTimeout = setTimeout(() => {
      triggerFadeOut();
    }, MAX_LOADING_TIME_MS);

    checkFontsLoaded();

    return () => {
      mounted = false;
      clearTimeout(maxTimeout);
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }
    };
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
