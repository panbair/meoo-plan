<template>
  <div class="pretext-demo-container">
    <h1 class="demo-title">Pretext 文本测量与布局演示</h1>
    <p class="demo-subtitle">纯 JavaScript 实现的多行文本测量，无需 DOM 回流</p>

    <div class="demo-controls">
      <div class="control-group">
        <label>输入文本：</label>
        <textarea
          v-model="inputText"
          class="text-input"
          placeholder="输入要测量的文本..."
          rows="4"
        ></textarea>
      </div>

      <div class="control-group">
        <label>字体：</label>
        <input
          v-model="font"
          class="font-input"
          placeholder="例如: 16px Inter"
        />
      </div>

      <div class="control-group">
        <label>最大宽度 (px)：</label>
        <input
          v-model.number="maxWidth"
          type="number"
          class="number-input"
          min="100"
          max="800"
          step="10"
        />
      </div>

      <div class="control-group">
        <label>行高 (px)：</label>
        <input
          v-model.number="lineHeight"
          type="number"
          class="number-input"
          min="12"
          max="72"
          step="1"
        />
      </div>

      <div class="control-group">
        <label>预设文本：</label>
        <div class="preset-buttons">
          <button @click="loadPreset('chinese')" class="preset-btn">中文</button>
          <button @click="loadPreset('mixed')" class="preset-btn">混合</button>
          <button @click="loadPreset('emoji')" class="preset-btn">Emoji</button>
          <button @click="loadPreset('long')" class="preset-btn">长文本</button>
        </div>
      </div>

      <button @click="measureText" class="measure-btn">测量文本</button>
    </div>

    <div v-if="result" class="demo-results">
      <h2 class="results-title">测量结果</h2>

      <div class="result-cards">
        <div class="result-card">
          <div class="card-label">行数</div>
          <div class="card-value">{{ result.lineCount }}</div>
        </div>
        <div class="result-card">
          <div class="card-label">总高度</div>
          <div class="card-value">{{ result.height.toFixed(1) }} px</div>
        </div>
        <div class="result-card">
          <div class="card-label">字符数</div>
          <div class="card-value">{{ inputText.length }}</div>
        </div>
        <div class="result-card">
          <div class="card-label">耗时</div>
          <div class="card-value">{{ measureTime }} ms</div>
        </div>
      </div>

      <div class="preview-section">
        <h3 class="preview-title">文本预览</h3>
        <div class="preview-box" :style="{ width: maxWidth + 'px' }">
          <div
            v-if="linesResult && linesResult.lines"
            class="preview-lines"
            :style="{ lineHeight: lineHeight + 'px', fontSize: parseInt(font) + 'px' }"
          >
            <div v-for="(line, index) in linesResult.lines" :key="index" class="preview-line">
              <span class="line-number">{{ index + 1 }}.</span>
              <span class="line-text">{{ line.text }}</span>
              <span class="line-width">{{ line.width.toFixed(1) }}px</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="linesResult" class="lines-detail">
        <h3 class="detail-title">每行详情</h3>
        <div class="lines-table">
          <div class="table-header">
            <div>行号</div>
            <div>文本</div>
            <div>宽度</div>
            <div>起始位置</div>
            <div>结束位置</div>
          </div>
          <div v-for="(line, index) in linesResult.lines" :key="index" class="table-row">
            <div>{{ index + 1 }}</div>
            <div class="line-text-cell">{{ line.text }}</div>
            <div>{{ line.width.toFixed(2) }}px</div>
            <div>s{{ line.start.segmentIndex }}:g{{ line.start.graphemeIndex }}</div>
            <div>s{{ line.end.segmentIndex }}:g{{ line.end.graphemeIndex }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { prepare, layout, prepareWithSegments, layoutWithLines, type PreparedText, type PreparedTextWithSegments } from '@chenglou/pretext'

// 状态
const inputText = ref('欢迎使用 Pretext 文本测量库！这是一个纯 JavaScript 实现的多行文本测量工具，无需 DOM 操作即可准确计算文本高度和布局。')
const font = ref('16px Inter')
const maxWidth = ref(400)
const lineHeight = ref(24)
const result = ref<{ lineCount: number; height: number } | null>(null)
const linesResult = ref<{ lineCount: number; height: number; lines: any[] } | null>(null)
const measureTime = ref(0)
const error = ref('')
const preparedCache = ref<PreparedText | PreparedTextWithSegments | null>(null)

// 预设文本
const presets = {
  chinese: '欢迎使用 Pretext 文本测量库！这是一个纯 JavaScript 实现的多行文本测量工具，无需 DOM 操作即可准确计算文本高度和布局。支持中文、日文、韩文等多种语言。',
  mixed: 'Hello 世界！欢迎使用 Pretext text measurement library. 这是一个支持多语言混合的文本测量工具。Bonjour le monde! مرحبا بالعالم 🚀',
  emoji: '🎉 庆祝活动开始啦！🎊 这是一个包含多种 Emoji 的文本测试：😀 😃 😄 😁 😆 😅 🤣 😂 🍎 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝',
  long: '这是一个非常长的文本测试，用于演示 Pretext 在处理大量文本时的性能表现。当文本很长时，浏览器原生的 DOM 测量方法（如 getBoundingClientRect）会触发布局回流，这是浏览器中最昂贵的操作之一。Pretext 通过两阶段设计巧妙地避免了这个问题：prepare() 阶段进行一次性文本分析和测量，layout() 阶段则是纯算术计算，可以频繁调用。这种设计使得 Pretext 在性能上远超传统的 DOM 测量方法，特别适合用于虚拟滚动、Masonry 布局等需要频繁计算文本高度的场景。'
}

// 加载预设文本
function loadPreset(type: keyof typeof presets) {
  inputText.value = presets[type]
  result.value = null
  linesResult.value = null
  error.value = ''
}

// 测量文本
function measureText() {
  error.value = ''
  const startTime = performance.now()

  try {
    // 准备文本
    preparedCache.value = prepare(inputText.value, font.value)

    // 测量基础信息
    result.value = layout(preparedCache.value, maxWidth.value, lineHeight.value)

    // 准备详细分行信息
    const preparedWithLines = prepareWithSegments(inputText.value, font.value)
    linesResult.value = layoutWithLines(preparedWithLines, maxWidth.value, lineHeight.value)

    const endTime = performance.now()
    measureTime.value = (endTime - startTime).toFixed(3)
  } catch (e: any) {
    error.value = `测量出错: ${e.message}`
    console.error(e)
  }
}

// 组件挂载时自动测量一次
onMounted(() => {
  measureText()
})
</script>

<style lang="scss" scoped>
.pretext-demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.demo-title {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.demo-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 40px;
}

.demo-controls {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;

  .control-group {
    margin-bottom: 20px;

    label {
      display: block;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .text-input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }
    }

    .font-input,
    .number-input {
      width: 100%;
      max-width: 200px;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;

      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }
    }

    .preset-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .preset-btn {
      padding: 8px 16px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;

      &:hover {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }
    }
  }

  .measure-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.demo-results {
  .results-title {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 20px;
  }

  .result-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .result-card {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    transition: all 0.2s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .card-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .card-value {
      font-size: 28px;
      font-weight: 700;
      color: #007bff;
    }
  }

  .preview-section {
    margin-bottom: 32px;

    .preview-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .preview-box {
      background: white;
      border: 2px solid #007bff;
      border-radius: 8px;
      padding: 20px;
      margin: 0 auto;
      overflow: hidden;

      .preview-lines {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #333;

        .preview-line {
          display: flex;
          align-items: center;
          padding: 4px 0;
          border-bottom: 1px dashed #e0e0e0;

          &:last-child {
            border-bottom: none;
          }

          .line-number {
            color: #999;
            font-size: 12px;
            margin-right: 8px;
            min-width: 30px;
          }

          .line-text {
            flex: 1;
            word-break: break-all;
          }

          .line-width {
            color: #007bff;
            font-size: 12px;
            margin-left: 12px;
            min-width: 50px;
            text-align: right;
          }
        }
      }
    }
  }

  .lines-detail {
    .detail-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
    }

    .lines-table {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 60px 1fr 80px 100px 100px;
      background: #f8f9fa;
      padding: 12px 16px;
      font-weight: 600;
      font-size: 13px;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
    }

    .table-row {
      display: grid;
      grid-template-columns: 60px 1fr 80px 100px 100px;
      padding: 12px 16px;
      font-size: 13px;
      border-bottom: 1px solid #e0e0e0;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f8f9fa;
      }

      .line-text-cell {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #fcc;
  font-size: 14px;
}
</style>
