'use client';

import { useState } from 'react';
import { CONFIG } from './config';
import styles from './page.module.css';

interface Suggestion {
  code: string;
  name: string;
  reason: string;
  stars: number;
}

interface ApiResponse {
  suggestions: Suggestion[];
  rawResponse?: string;
}

export default function RfcSocialPage() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, name: string, index: number) => {
    const textToCopy = `${code} ${name}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setError('请输入你的情况或想要表达的意思');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/rfc-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userInput: userInput,
          model: CONFIG.DEFAULT_MODEL 
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '请求失败');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      // Ctrl+Enter 或 Shift+Enter 允许换行
      if (e.ctrlKey || e.shiftKey) {
        return;
      }

      // 单独按 Enter 键时提交
      if (!loading && userInput.trim()) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const renderStars = (stars: number) => {
    return '⭐'.repeat(Math.min(5, Math.max(1, stars)));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>不知道如何回复消息？用HTTP状态码的方式言简意赅地回答对方</h1>
      <p className={styles.subtitle}>
        基于 RFC 7231、WebDAV 和 Cloudflare 的 HTTP 社交辞令，让你的回复更加简洁有趣
      </p>

      {/* 输入区域 */}
      <section className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            你的情况或想表达的意思 ({userInput.length}/{CONFIG.MAX_INPUT_LENGTH})
          </label>
          <textarea
            value={userInput}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= CONFIG.MAX_INPUT_LENGTH) {
                setUserInput(value);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="例如：朋友让我帮忙但我太忙了、老板让我加班、对方发消息太频繁了..."
            className={styles.input}
            disabled={loading}
            rows={4}
          />
        </div>

        {/* 预设示例按钮 */}
        <div className={styles.presetButtons}>
          <button
            className={styles.presetButton}
            onClick={() => setUserInput('朋友让我帮忙但我太忙了')}
            disabled={loading}
          >
            朋友让我帮忙但我太忙了
          </button>
          <button
            className={styles.presetButton}
            onClick={() => setUserInput('导师让我读文献')}
            disabled={loading}
          >
            导师让我读文献
          </button>
          <button
            className={styles.presetButton}
            onClick={() => setUserInput('对方发消息太频繁了')}
            disabled={loading}
          >
            对方发消息太频繁了
          </button>
          <button
            className={styles.presetButton}
            onClick={() => setUserInput('我已经把任务做完了')}
            disabled={loading}
          >
            我已经把任务做完了
          </button>
          <button
            className={styles.presetButton}
            onClick={() => setUserInput('对方说的我听不太懂')}
            disabled={loading}
          >
            对方说的我听不太懂
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !userInput.trim()}
          className={styles.button}
        >
          {loading ? '翻译中...' : '翻译'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </section>

      {/* 结果展示 */}
      {result && result.suggestions && result.suggestions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>推荐的HTTP响应</h2>
          <div className={styles.suggestions}>
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className={styles.suggestionCard}>
                <div className={styles.suggestionHeader}>
                  <div className={styles.httpCode}>
                    <span className={styles.code}>{suggestion.code}</span>
                    <span className={styles.name}>{suggestion.name}</span>
                  </div>
                  <div className={styles.stars}>
                    {renderStars(suggestion.stars)}
                  </div>
                </div>
                <div className={styles.reason}>
                  <strong>推荐理由：</strong>
                  {suggestion.reason}
                </div>
                <div className={styles.usage}>
                  <div className={styles.usageContent}>
                    <div>
                      <strong>回复示例：</strong>
                      「{suggestion.code} {suggestion.name}」
                    </div>
                    <button
                      className={styles.copyButton}
                      onClick={() => handleCopy(suggestion.code, suggestion.name, index)}
                      title="复制到剪贴板"
                    >
                      {copiedIndex === index ? '已复制' : '复制'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 使用说明 */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>使用说明</h2>
        <div className={styles.instructions}>
          <p>1. 在输入框中描述你遇到的情况或想要表达的意思</p>
          <p>2. 点击"翻译"按钮，LLM 会帮你找到最合适的 HTTP 响应码</p>
          <p>3. 每个推荐响应码都会显示推荐理由和星级评分</p>
          <p>4. 你可以选择最适合的响应码回复对方，十分简洁</p>
          {/* <p className={styles.tip}>
            💡 小提示：HTTP 状态码本来是用于网络通信的，但用在日常对话中会让交流变得更加简洁幽默！
          </p> */}
        </div>
      </section>
    </div>
  );
}
