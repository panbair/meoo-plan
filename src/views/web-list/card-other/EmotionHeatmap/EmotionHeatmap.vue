<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 情感词典 ====================
const positiveWords = ['好', '棒', '优秀', '出色', '成功', '创新', '高效', '智能', '领先', '突破', '增长', '提升', '喜欢', '满意', '推荐', '进步', '强大', '赞', '完美', '精彩', 'excellent', 'great', 'good', 'amazing', 'wonderful', 'love', 'best', 'happy', 'success', 'innovative', 'powerful', 'efficient', 'brilliant', 'outstanding']
const negativeWords = ['差', '糟糕', '失败', '问题', '错误', '慢', '难', '复杂', '困难', '不足', '缺陷', '风险', '担忧', '下降', '延迟', 'bug', '崩溃', '卡顿', 'bad', 'terrible', 'poor', 'fail', 'error', 'slow', 'difficult', 'complex', 'risk', 'issue', 'problem', 'crash', 'lag', 'ugly', 'worst']

function analyzeSentiment(text: string): number {
  const lower = text.toLowerCase()
  let score = 0
  positiveWords.forEach((w) => {
    if (lower.includes(w)) {
      score += 1
    }
  })
  negativeWords.forEach((w) => {
    if (lower.includes(w)) {
      score -= 1
    }
  })
  return Math.max(-1, Math.min(1, score / 3))
}

function sentimentColor(score: number): string {
  if (score > 0.3) {
    return `rgba(74, 222, 128, ${0.3 + score * 0.7})`
  }
  if (score < -0.3) {
    return `rgba(248, 113, 113, ${0.3 + Math.abs(score) * 0.7})`
  }
  return `rgba(148, 163, 184, 0.3)`
}

function sentimentLabel(score: number): string {
  if (score > 0.3) {
    return '😊 积极'
  }
  if (score < -0.3) {
    return '😟 消极'
  }
  return '😐 中性'
}

// ==================== 状态 ====================
const inputText = ref(`我们的AI平台取得了巨大的成功，用户反馈非常好。
系统性能优秀，响应速度快，体验棒极了。
但是最近遇到了一些问题，部分功能出现了bug。
数据库偶尔崩溃，导致服务延迟，用户不太满意。
团队正在积极修复，相信很快就能解决这些困难。
新版本增加了创新功能，让产品更加强大和智能。
客户对我们的服务非常满意，纷纷推荐给朋友。
但竞争对手也在不断进步，我们需要保持领先。
未来我们将继续突破，实现更大的增长和提升。
总体来说，虽然有一些不足，但整体趋势是向好的。`)

interface SentenceResult {
  text: string
  score: number
  color: string
  label: string
}

const results = computed<SentenceResult[]>(() => {
  const sentences = inputText.value
    .split(/[。！？\n.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  return sentences.map((text) => {
    const score = analyzeSentiment(text)
    return {
      text,
      score,
      color: sentimentColor(score),
      label: sentimentLabel(score),
    }
  })
})

const overallScore = computed(() => {
  if (results.value.length === 0) {
    return 0
  }
  const total = results.value.reduce((sum, r) => sum + r.score, 0)
  return total / results.value.length
})

const distribution = computed(() => {
  let pos = 0
  let neg = 0
  let neu = 0
  results.value.forEach((r) => {
    if (r.score > 0.3) {
      pos++
    } else if (r.score < -0.3) {
      neg++
    } else {
      neu++
    }
  })
  const total = results.value.length || 1
  return {
    pos,
    neg,
    neu,
    posPercent: Math.round((pos / total) * 100),
    negPercent: Math.round((neg / total) * 100),
    neuPercent: Math.round((neu / total) * 100),
  }
})

const hoveredIdx = ref(-1)

onMounted(() => {
  gsap.fromTo('.emotion-heatmap', { opacity: 0 }, { opacity: 1, duration: 0.4 })
  // Animate heatmap cells
  gsap.fromTo(
    '.heat-cell',
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.3, stagger: 0.04, ease: 'back.out(1.2)', delay: 0.2 },
  )
})
</script>

<template>
  <div class="emotion-heatmap">
    <div class="top-bar">
      <h2>🌡️ 情感热力图</h2>
      <div class="overall">
        整体情感: <span :style="{ color: overallScore > 0.1 ? '#4ade80' : overallScore < -0.1 ? '#f87171' : '#94a3b8' }">
          {{ sentimentLabel(overallScore) }} ({{ (overallScore * 100).toFixed(0) }}%)
        </span>
      </div>
    </div>

    <div class="main-layout">
      <!-- Left: Input -->
      <div class="input-panel">
        <div class="panel-label">输入文本</div>
        <textarea v-model="inputText" class="text-input" placeholder="输入要分析的文本..."></textarea>

        <!-- Distribution stats -->
        <div class="stats">
          <div class="stat-item">
            <span class="stat-dot pos"></span>
            <span>积极 {{ distribution.pos }} ({{ distribution.posPercent }}%)</span>
          </div>
          <div class="stat-item">
            <span class="stat-dot neu"></span>
            <span>中性 {{ distribution.neu }} ({{ distribution.neuPercent }}%)</span>
          </div>
          <div class="stat-item">
            <span class="stat-dot neg"></span>
            <span>消极 {{ distribution.neg }} ({{ distribution.negPercent }}%)</span>
          </div>
        </div>

        <!-- Distribution bar -->
        <div class="dist-bar">
          <div class="dist-seg pos" :style="{ width: distribution.posPercent + '%' }"></div>
          <div class="dist-seg neu" :style="{ width: distribution.neuPercent + '%' }"></div>
          <div class="dist-seg neg" :style="{ width: distribution.negPercent + '%' }"></div>
        </div>
      </div>

      <!-- Right: Heatmap -->
      <div class="heatmap-panel">
        <div class="panel-label">情感热力图</div>

        <!-- Heatmap grid -->
        <div class="heatmap-grid">
          <div
            v-for="(r, i) in results"
            :key="i"
            class="heat-cell"
            :style="{ backgroundColor: r.color }"
            @mouseenter="hoveredIdx = i"
            @mouseleave="hoveredIdx = -1"
          >
            <span class="cell-idx">{{ i + 1 }}</span>
          </div>
        </div>

        <!-- Sentence detail list -->
        <div class="sentence-list">
          <div
            v-for="(r, i) in results"
            :key="'s' + i"
            class="sentence-item"
            :class="{ active: hoveredIdx === i }"
            @mouseenter="hoveredIdx = i"
            @mouseleave="hoveredIdx = -1"
          >
            <div class="si-bar" :style="{ backgroundColor: r.color }"></div>
            <div class="si-content">
              <div class="si-text">{{ r.text }}</div>
              <div class="si-meta">
                <span class="si-label">{{ r.label }}</span>
                <span class="si-score">{{ (r.score * 100).toFixed(0) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Trend line -->
        <div class="panel-label" style="margin-top: 16px">情感趋势</div>
        <svg class="trend-chart" viewBox="0 0 500 100" preserveAspectRatio="none">
          <!-- Zero line -->
          <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" stroke-width="1" />
          <!-- Trend polyline -->
          <polyline
            :points="
              results
                .map((r, i) => {
                  const x = (i / Math.max(results.length - 1, 1)) * 500
                  const y = 50 - r.score * 45
                  return `${x},${y}`
                })
                .join(' ')
            "
            fill="none"
            stroke="#3b82f6"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <circle
            v-for="(r, i) in results"
            :key="'c' + i"
            :cx="(i / Math.max(results.length - 1, 1)) * 500"
            :cy="50 - r.score * 45"
            r="3"
            :fill="r.score > 0.3 ? '#4ade80' : r.score < -0.3 ? '#f87171' : '#94a3b8'"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emotion-heatmap {
  width: 100vw;
  height: 100vh;
  background: #0b1120;
  display: flex;
  flex-direction: column;
  font-family: 'Microsoft YaHei', sans-serif;
  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}

.top-bar h2 {
  color: #e2e8f0;
  font-size: 18px;
  margin: 0;
}

.overall {
  color: #94a3b8;
  font-size: 14px;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.input-panel {
  width: 320px;
  border-right: 1px solid #1e293b;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}

.panel-label {
  color: #64748b;
  font-size: 11px;
  text-transform: uppercase;
}

.text-input {
  flex: 1;
  background: #0f172a;
  border: 1px solid #1e293b;
  color: #cbd5e1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.8;
  resize: none;
  outline: none;
  font-family: 'Microsoft YaHei', sans-serif;
}

.text-input:focus {
  border-color: #3b82f6;
}

.stats {
  display: flex;
  gap: 14px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #94a3b8;
  font-size: 12px;
}

.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stat-dot.pos {
  background: #4ade80;
}

.stat-dot.neu {
  background: #94a3b8;
}

.stat-dot.neg {
  background: #f87171;
}

.dist-bar {
  display: flex;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

.dist-seg {
  transition: width 0.3s;
}

.dist-seg.pos {
  background: #4ade80;
}

.dist-seg.neu {
  background: #64748b;
}

.dist-seg.neg {
  background: #f87171;
}

.heatmap-panel {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
}

.heatmap-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
}

.heat-cell {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}

.heat-cell:hover {
  transform: scale(1.15);
  border-color: #e2e8f0;
  z-index: 2;
}

.cell-idx {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: bold;
}

.sentence-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sentence-item {
  display: flex;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}

.sentence-item.active {
  background: #111827;
}

.si-bar {
  width: 4px;
  border-radius: 2px;
  flex-shrink: 0;
}

.si-content {
  flex: 1;
}

.si-text {
  color: #cbd5e1;
  font-size: 13px;
  line-height: 1.4;
}

.si-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
}

.si-label {
  font-size: 11px;
  color: #64748b;
}

.si-score {
  font-size: 11px;
  color: #475569;
  font-family: monospace;
}

.trend-chart {
  width: 100%;
  height: 80px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
}
</style>

