'use client';

import { useState } from 'react';
import { CONFIG } from './config';
import styles from './page.module.css';

interface ApiResponse {
  question: string;
  k: number;
  stdResponses: string[];
  vsResponses: string[];
  rawStdText: string;
  rawVsText: string;
  prompts: {
    stdSystemPrompt: string;
    vsSystemPrompt: string;
  };
  distances: {
    stdIntra: number;
    vsIntra: number;
    inter: number;
    centroidShift: number;
  };
  visualization: {
    embedding2D: number[][];
    embedding3D: number[][];
    centroids2D: {
      std: [number, number];
      vs: [number, number];
    };
    avgRadius2D: {
      std: number;
      vs: number;
    };
  };
}

// 新增：分步状态接口
interface StepStatus {
  prompts: boolean;
  stdComplete: boolean;
  vsComplete: boolean;
  embeddingComplete: boolean;
  metricsComplete: boolean;
}

export default function VerbalizedSamplingPage() {
  const [question, setQuestion] = useState('');
  const [temperature, setTemperature] = useState(CONFIG.DEFAULT_TEMPERATURE);
  const [k, setK] = useState(CONFIG.DEFAULT_K);
  const [model, setModel] = useState(CONFIG.DEFAULT_MODEL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');
  
  // 新增：分步状态
  const [stepStatus, setStepStatus] = useState<StepStatus>({
    prompts: false,
    stdComplete: false,
    vsComplete: false,
    embeddingComplete: false,
    metricsComplete: false,
  });
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError('请输入问题');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setStepStatus({
      prompts: false,
      stdComplete: false,
      vsComplete: false,
      embeddingComplete: false,
      metricsComplete: false,
    });
    setLoadingStep('正在初始化...');

    try {
      const response = await fetch('/api/verbalized-sampling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, temperature, model, k }),
      });

      if (!response.ok) {
        // Try to extract error message from response body
        let errorMsg = '请求失败';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data && data.error) {
              errorMsg = data.error;
            }
          } else {
            const text = await response.text();
            if (text) {
              errorMsg = text;
            }
          }
        } catch (e) {
          // Ignore parsing errors, use default errorMsg
        }
        throw new Error(errorMsg);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // 保留最后一行（可能不完整）
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            try {
              const { step, data } = JSON.parse(jsonStr);

              switch (step) {
                case 'prompts':
                  setStepStatus(prev => ({ ...prev, prompts: true }));
                  setResult(prev => ({
                    ...(prev || {}),
                    prompts: data,
                  } as ApiResponse));
                  setLoadingStep('正在生成标准方法回答...');
                  break;

                case 'std_complete':
                  setStepStatus(prev => ({ ...prev, stdComplete: true }));
                  setResult(prev => ({
                    ...(prev || {}),
                    stdResponses: data.responses,
                    rawStdText: data.rawText,
                  } as ApiResponse));
                  setLoadingStep('正在生成 Verbalized Sampling 回答...');
                  break;

                case 'vs_complete':
                  setStepStatus(prev => ({ ...prev, vsComplete: true }));
                  setResult(prev => ({
                    ...(prev || {}),
                    vsResponses: data.responses,
                    rawVsText: data.rawText,
                  } as ApiResponse));
                  setLoadingStep('正在计算 Embedding...');
                  break;

                case 'embedding_complete':
                  setStepStatus(prev => ({ ...prev, embeddingComplete: true }));
                  setLoadingStep('正在计算多样性指标...');
                  break;

                case 'metrics_complete':
                  setStepStatus(prev => ({ ...prev, metricsComplete: true }));
                  setResult(prev => ({
                    ...(prev || {}),
                    question: data.question,
                    k: data.k,
                    distances: data.distances,
                    visualization: data.visualization,
                  } as ApiResponse));
                  setLoadingStep('');
                  break;

                case 'error':
                  throw new Error(data.message || '处理失败');
              }
            } catch (parseError) {
              console.error('解析流数据失败:', parseError);
              // If the line is for a critical event, propagate the error to the user and stop processing
              try {
                const maybeStep = JSON.parse(jsonStr)?.step;
                if (maybeStep === 'metrics_complete') {
                  setError('解析关键数据失败，请重试。');
                  setLoading(false);
                  setLoadingStep('');
                  return;
                }
              } catch {
                // If we can't even parse the step, be conservative and check for the string
                if (jsonStr.includes('"step":"metrics_complete"')) {
                  setError('解析关键数据失败，请重试。');
                  setLoading(false);
                  setLoadingStep('');
                  return;
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      setLoadingStep('');
    }
    // After stream is fully processed, reset loading states
    setLoading(false);
    setLoadingStep('');
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= CONFIG.MAX_QUESTION_LENGTH) {
      setQuestion(value);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>一句 Prompt，让大模型不再千篇一律</h1>
      <p className={styles.paperTitle}>
        基于论文《Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity》
      </p>
      <p className={styles.subtitle}>
        通过简单的提示词修改，让 LLM 从分布尾部采样，显著提升回答多样性
      </p>
      {/* 输入区域 */}
      <section className={styles.inputSection}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            问题 ({question.length}/{CONFIG.MAX_QUESTION_LENGTH})
          </label>
          <input
            type="text"
            value={question}
            onChange={handleQuestionChange}
            placeholder="输入你的问题（最多50字符）"
            className={styles.input}
            disabled={loading}
          />
        </div>

        <div className={styles.paramGroup}>
          <div className={styles.param}>
            <label className={styles.label}>
              Temperature: {temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min={CONFIG.MIN_TEMPERATURE}
              max={CONFIG.MAX_TEMPERATURE}
              step={CONFIG.TEMPERATURE_STEP}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className={styles.slider}
              disabled={loading}
            />
            <span className={styles.range}>
              {CONFIG.MIN_TEMPERATURE} - {CONFIG.MAX_TEMPERATURE}
            </span>
          </div>

          <div className={styles.param}>
            <label className={styles.label}>
              回答数量 (k): {k}
            </label>
            <input
              type="range"
              min={CONFIG.MIN_K}
              max={CONFIG.MAX_K}
              step={1}
              value={k}
              onChange={(e) => setK(parseInt(e.target.value))}
              className={styles.slider}
              disabled={loading}
            />
            <span className={styles.range}>
              {CONFIG.MIN_K} - {CONFIG.MAX_K}
            </span>
          </div>

          <div className={styles.param}>
            <label className={styles.label}>模型</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={styles.select}
              disabled={loading}
            >
              {CONFIG.LLM_MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !question.trim()}
          className={styles.button}
        >
          {loading ? '生成中...' : '生成回答'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
        
        {/* 加载进度指示器 */}
        {loading && loadingStep && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
            <span>{loadingStep}</span>
          </div>
        )}
      </section>

      {/* 提示词对比 */}
      {result && result.prompts && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>系统提示词对比</h2>
          <div className={styles.grid}>
            <div className={styles.gridItem}>
              <h3 className={styles.subtitle}>标准方法</h3>
              <pre className={styles.code}>
                {result.prompts.stdSystemPrompt}
              </pre>
            </div>
            <div className={styles.gridItem}>
              <h3 className={styles.subtitle}>Verbalized Sampling</h3>
              <pre className={styles.code}>
                {result.prompts.vsSystemPrompt}
              </pre>
            </div>
          </div>
        </section>
      )}

      {/* 原始响应 */}
      {result && (stepStatus.stdComplete || stepStatus.vsComplete) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>原始响应</h2>
          <div className={styles.grid}>
            <div className={styles.gridItem}>
              <h3 className={styles.subtitle}>标准方法</h3>
              {stepStatus.stdComplete ? (
                <pre className={styles.rawResponse}>{result.rawStdText}</pre>
              ) : (
                <div className={styles.loadingPlaceholder}>
                  <div className={styles.spinner}></div>
                  <span>正在生成...</span>
                </div>
              )}
            </div>
            <div className={styles.gridItem}>
              <h3 className={styles.subtitle}>Verbalized Sampling</h3>
              {stepStatus.vsComplete ? (
                <pre className={styles.rawResponse}>{result.rawVsText}</pre>
              ) : (
                <div className={styles.loadingPlaceholder}>
                  <div className={styles.spinner}></div>
                  <span>正在生成...</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 提取后的回答列表 */}
      {result && (stepStatus.stdComplete || stepStatus.vsComplete) && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>提取的回答</h2>
          <div className={styles.grid}>
            <div className={styles.gridItem}>
              <h3 className={styles.subtitle}>
                标准方法 {stepStatus.stdComplete && result.stdResponses && `(${result.stdResponses.length} 个回答)`}
              </h3>
              {stepStatus.stdComplete && result.stdResponses ? (
                <ol className={styles.list}>
                  {result.stdResponses.map((resp, idx) => (
                    <li key={idx} className={styles.listItem}>
                      {resp}
                    </li>
                  ))}
                </ol>
              ) : (
                <div className={styles.loadingPlaceholder}>
                  <div className={styles.spinner}></div>
                  <span>正在生成...</span>
                </div>
              )}
            </div>
            <div className={styles.gridItem}>
              <h3 className={styles.subtitle}>
                Verbalized Sampling {stepStatus.vsComplete && result.vsResponses && `(${result.vsResponses.length} 个回答)`}
              </h3>
              {stepStatus.vsComplete && result.vsResponses ? (
                <ol className={styles.list}>
                  {result.vsResponses.map((resp, idx) => (
                    <li key={idx} className={styles.listItem}>
                      {resp}
                    </li>
                  ))}
                </ol>
              ) : (
                <div className={styles.loadingPlaceholder}>
                  <div className={styles.spinner}></div>
                  <span>正在生成...</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 指标数据 */}
      {result && stepStatus.metricsComplete && result.distances && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>多样性指标</h2>
          <div className={styles.metricsLayout}>
            <div className={styles.metricsData}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>标准方法类内平均距离(↓):</span>
                <span className={styles.metricValue}>
                  {result.distances.stdIntra.toFixed(4)}
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>VS方法类内平均距离(↑):</span>
                <span className={styles.metricValue}>
                  {result.distances.vsIntra.toFixed(4)}
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>类间平均距离:</span>
                <span className={styles.metricValue}>
                  {result.distances.inter.toFixed(4)}
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>质心间距:</span>
                <span className={styles.metricValue}>
                  {result.distances.centroidShift.toFixed(4)}
                </span>
              </div>
            </div>

            <div className={styles.metricsExplanation}>
              <h3 className={styles.subtitle}>指标说明</h3>
              <ul className={styles.explanationList}>
                <li>
                  <strong>类内平均距离</strong>: 同组内{result.k}个回答之间的平均余弦距离，
                  <span className={styles.highlight}>值越大表示多样性越高</span>
                </li>
                <li>
                  <strong>类间平均距离</strong>: 两组回答之间的平均距离
                </li>
                <li>
                  <strong>质心间距</strong>: 两组回答中心点的距离
                </li>
                <li className={styles.expected}>
                  <strong>预期结果</strong>:
                  {result.distances.vsIntra > result.distances.stdIntra ? (
                    <span className={styles.success}>
                      ✓ VS方法类内平均距离 ({result.distances.vsIntra.toFixed(4)})
                      &gt; 标准方法 ({result.distances.stdIntra.toFixed(4)})，
                      说明 Verbalized Sampling 成功提升了多样性！
                    </span>
                  ) : (
                    <span className={styles.warning}>
                      ✗ VS方法类内平均距离 ({result.distances.vsIntra.toFixed(4)})
                      &lt; 标准方法 ({result.distances.stdIntra.toFixed(4)})，
                      未达到预期效果
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}
      
      {/* 2D可视化 */}
      {result && stepStatus.metricsComplete && result.visualization && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>PCA 降维可视化 (2D)</h2>
          <div className={styles.visualization}>
            <svg width="600" height="400" className={styles.svg}>
              {/* 定义渐变和样式 */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>

              {/* 背景网格 */}
              <rect width="600" height="400" fill="url(#grid)" />

              {/* 坐标轴 */}
              <line x1="0" y1="200" x2="600" y2="200" stroke="#9ca3af" strokeWidth="2" />
              <line x1="300" y1="0" x2="300" y2="400" stroke="#9ca3af" strokeWidth="2" />

              {/* X轴箭头 */}
              <polygon points="595,195 600,200 595,205" fill="#9ca3af" />
              {/* Y轴箭头 */}
              <polygon points="295,5 300,0 305,5" fill="#9ca3af" />

              {/* 坐标轴标签 */}
              <text x="560" y="190" fontSize="12" fill="#6b7280">PC1</text>
              <text x="310" y="15" fontSize="12" fill="#6b7280">PC2</text>

              {/* 原点标记 */}
              <circle cx="300" cy="200" r="3" fill="#6b7280" />
              <text x="310" y="215" fontSize="10" fill="#6b7280">0</text>

              {/* 计算合适的缩放比例 */}
              {(() => {
                const allPoints = result.visualization.embedding2D;
                const xValues = allPoints.map(p => p[0]);
                const yValues = allPoints.map(p => p[1]);
                const maxX = Math.max(...xValues.map(Math.abs));
                const maxY = Math.max(...yValues.map(Math.abs));
                const scale = Math.min(250 / maxX, 180 / maxY);

                return (
                  <>
                    {/* 标准方法的点（蓝色） */}
                    {allPoints.slice(0, result.k).map((point, idx) => (
                      <g key={`std-${idx}`}>
                        <circle
                          cx={point[0] * scale + 300}
                          cy={-point[1] * scale + 200}
                          r="6"
                          fill="#3b82f6"
                          stroke="#1e40af"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        <text
                          x={point[0] * scale + 300}
                          y={-point[1] * scale + 190}
                          fontSize="10"
                          fill="#1e40af"
                          textAnchor="middle"
                        >
                          S{idx + 1}
                        </text>
                      </g>
                    ))}

                    {/* VS方法的点（红色） */}
                    {allPoints.slice(result.k, result.k * 2).map((point, idx) => (
                      <g key={`vs-${idx}`}>
                        <circle
                          cx={point[0] * scale + 300}
                          cy={-point[1] * scale + 200}
                          r="6"
                          fill="#ef4444"
                          stroke="#991b1b"
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        <text
                          x={point[0] * scale + 300}
                          y={-point[1] * scale + 190}
                          fontSize="10"
                          fill="#991b1b"
                          textAnchor="middle"
                        >
                          V{idx + 1}
                        </text>
                      </g>
                    ))}

                    {/* 标准方法的范围圆（虚线） */}
                    <circle
                      cx={result.visualization.centroids2D.std[0] * scale + 300}
                      cy={-result.visualization.centroids2D.std[1] * scale + 200}
                      r={result.visualization.avgRadius2D.std * scale}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.5"
                    />

                    {/* VS方法的范围圆（虚线） */}
                    <circle
                      cx={result.visualization.centroids2D.vs[0] * scale + 300}
                      cy={-result.visualization.centroids2D.vs[1] * scale + 200}
                      r={result.visualization.avgRadius2D.vs * scale}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      opacity="0.5"
                    />

                    {/* 标准方法的质心（空心） */}
                    <circle
                      cx={result.visualization.centroids2D.std[0] * scale + 300}
                      cy={-result.visualization.centroids2D.std[1] * scale + 200}
                      r="8"
                      fill="white"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      opacity="0.9"
                    />
                    <text
                      x={result.visualization.centroids2D.std[0] * scale + 300}
                      y={-result.visualization.centroids2D.std[1] * scale + 200 - 15}
                      fontSize="12"
                      fill="#1e40af"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      标准质心
                    </text>

                    {/* VS方法的质心（空心） */}
                    <circle
                      cx={result.visualization.centroids2D.vs[0] * scale + 300}
                      cy={-result.visualization.centroids2D.vs[1] * scale + 200}
                      r="8"
                      fill="white"
                      stroke="#ef4444"
                      strokeWidth="3"
                      opacity="0.9"
                    />
                    <text
                      x={result.visualization.centroids2D.vs[0] * scale + 300}
                      y={-result.visualization.centroids2D.vs[1] * scale + 200 - 15}
                      fontSize="12"
                      fill="#991b1b"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      VS质心
                    </text>
                  </>
                );
              })()}
            </svg>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#3b82f6' }}></span>
                <span>标准方法 (S1-S{result.k})</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: '#ef4444' }}></span>
                <span>Verbalized Sampling (V1-V{result.k})</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDot} style={{ backgroundColor: 'white', border: '2px solid #64748b' }}></span>
                <span>质心（虚线圆包含50%类内数据点）</span>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
