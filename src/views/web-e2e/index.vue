<template>
  <div class="e2e-container">
    <!-- ====== 顶部工具栏 ====== -->
    <header class="e2e-header">
      <div class="e2e-header-left">
        <span class="e2e-logo">🚀 E2E Code Gen</span>
        <span class="e2e-badge">V3.0 重构</span>
      </div>
      <div class="e2e-header-right">
        <label class="e2e-framework-switch">
          <span class="switch-label">框架</span>
          <select v-model="framework" class="e2e-select">
            <option value="react">React</option>
            <option value="vue">Vue</option>
          </select>
        </label>
        <label class="e2e-mode-switch">
          <span class="switch-label">输出</span>
          <select v-model="outputMode" class="e2e-select">
            <option value="single-html">单文件 HTML</option>
            <option value="multi-file">多文件项目</option>
          </select>
        </label>
        <button class="e2e-btn-icon" title="历史记录" @click="showHistory = !showHistory">
          📋
        </button>
      </div>
    </header>

    <!-- ====== 主体区域 ====== -->
    <div class="e2e-main">
      <!-- 左侧：输入区 -->
      <aside class="e2e-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <!-- 收起按钮 -->
        <button class="e2e-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '▶' : '◀' }}
        </button>

        <div v-if="!sidebarCollapsed" class="e2e-sidebar-content">
          <!-- 需求描述 -->
          <div class="e2e-form-group">
            <label class="e2e-label">
              <span class="label-icon">💬</span> 描述你想要的网站
            </label>
            <textarea
              v-model="description"
              class="e2e-textarea"
              placeholder="例如：做一个赛博朋克风格的独立游戏公司官网，Hero要大标题+粒子背景，展示3款游戏产品，要有团队介绍和联系表单..."
              rows="5"
            ></textarea>
          </div>

          <!-- 公司信息（可折叠） -->
          <details class="e2e-details" :open="!!companyName">
            <summary class="e2e-summary">🏢 公司信息（可选）</summary>
            <div class="e2e-details-body">
              <input v-model="companyName" class="e2e-input" placeholder="公司名称" />
              <input v-model="companyIndustry" class="e2e-input" placeholder="行业" />
              <input v-model="companyDesc" class="e2e-input" placeholder="业务描述（一句话）" />
            </div>
          </details>

          <!-- 视觉风格 -->
          <details class="e2e-details">
            <summary class="e2e-summary">🎨 视觉风格（可选）</summary>
            <div class="e2e-details-body">
              <div class="e2e-style-chips">
                <button
                  v-for="s in visualStyles"
                  :key="s.key"
                  class="e2e-chip"
                  :class="{ active: visualStyle === s.key }"
                  @click="visualStyle = visualStyle === s.key ? '' : s.key"
                >
                  {{ s.emoji }} {{ s.label }}
                </button>
              </div>
              <input v-model="colorPreference" class="e2e-input mt-3" placeholder="或自定义配色描述..." />
            </div>
          </details>

          <!-- 模板选择（可选） -->
          <details class="e2e-details" :open="!!selectedTemplate">
            <summary class="e2e-summary">
              🎯 选择模板（可选，AI将按模板结构生成）
            </summary>
            <div class="e2e-details-body">
              <div class="e2e-template-grid">
                <button
                  v-for="t in templates"
                  :key="t.key"
                  class="e2e-template-chip"
                  :class="{ active: selectedTemplate === t.key }"
                  @click="selectTemplate(t.key, t.label)"
                >
                  {{ t.label }}
                </button>
              </div>
              <div v-if="templateRecommendation" class="e2e-template-info">
                <div class="info-row">
                  <span class="info-tag">{{ templateRecommendation.scrollPattern }}</span>
                  <span class="info-tag">{{ templateRecommendation.visualStyle }}</span>
                </div>
                <p class="info-text">{{ templateRecommendation.analysis }}</p>
              </div>
            </div>
          </details>

          <!-- 快捷示例 -->
          <div class="e2e-quick-examples">
            <span class="e2e-example-label">快捷示例：</span>
            <button
              v-for="ex in quickExamples"
              :key="ex.label"
              class="e2e-example-btn"
              @click="description = ex.desc"
            >
              {{ ex.label }}
            </button>
          </div>

          <!-- 生成按钮 -->
          <button
            class="e2e-generate-btn"
            :class="{ loading: isGenerating }"
            :disabled="!description.trim() || isGenerating"
            @click="handleGenerate"
          >
            <span v-if="isGenerating" class="btn-spinner"></span>
            <span>{{ isGenerating ? 'AI 正在生成...' : '🚀 生成网站' }}</span>
          </button>

          <!-- AI 组件选择说明 -->
          <div v-if="selectedComponents.length > 0 && !isGenerating" class="e2e-ai-selection">
            <h4>🤖 AI 自动选用了 {{ selectedComponents.length }} 个组件</h4>
            <p class="ai-reasoning">{{ aiReasoning }}</p>
            <div class="ai-comp-chips">
              <span
                v-for="c in selectedComponents"
                :key="c"
                class="ai-comp-chip"
                :title="c"
              >{{ c }}</span>
            </div>
            <!-- 质量报告 -->
            <div v-if="qualityReport" class="quality-report" :class="{ passed: qualityReport.passed, failed: !qualityReport.passed }">
              <div class="quality-score">
                <span class="score-label">代码质量</span>
                <span class="score-value">{{ qualityReport.score }}/100</span>
              </div>
              <div v-if="qualityReport.issues.length" class="quality-issues">
                <div v-for="issue in qualityReport.issues" :key="issue" class="quality-issue">❌ {{ issue }}</div>
              </div>
              <div v-if="qualityReport.warnings.length" class="quality-warnings">
                <div v-for="w in qualityReport.warnings" :key="w" class="quality-warn">⚡ {{ w }}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧：预览区 + 代码区 -->
      <div class="e2e-content">
        <!-- 预览区控制栏 -->
        <div class="e2e-preview-toolbar">
          <div class="toolbar-left">
            <button
              :class="{ active: activeTab === 'preview' }"
              @click="activeTab = 'preview'"
            >👁️ 预览</button>
            <button
              :class="{ active: activeTab === 'code' }"
              @click="activeTab = 'code'"
            >💻 代码</button>
            <button
              :class="{ active: activeTab === 'split' }"
              @click="activeTab = 'split'"
            >📐 分屏</button>
          </div>
          <div class="toolbar-right">
            <select v-model="previewScale" class="e2e-select-sm">
              <option :value="0.25">25%</option>
              <option :value="0.5">50%</option>
              <option :value="0.75">75%</option>
              <option :value="1">100%</option>
            </select>
            <button
              class="e2e-toolbar-btn"
              :class="{ active: previewDarkMode }"
              @click="previewDarkMode = !previewDarkMode"
              title="切换预览背景"
            >🌓</button>
            <button
              class="e2e-toolbar-btn"
              @click="handleDownload"
              :disabled="!generatedCode"
              title="下载代码"
            >⬇️</button>
            <button
              class="e2e-toolbar-btn"
              @click="handleCopyCode"
              :disabled="!generatedCode"
              title="复制代码"
            >📋</button>
          </div>
        </div>

        <!-- 预览/代码/分屏 -->
        <div class="e2e-viewport" :class="`mode-${activeTab}`">
          <!-- 预览面板 -->
          <div v-show="activeTab === 'preview' || activeTab === 'split'" class="e2e-preview-panel">
            <!-- 加载/空状态 -->
            <div v-if="isGenerating" class="e2e-loading-state">
              <div class="loading-pulse"></div>
              <p>AI 正在分析需求、选择组件、生成代码...</p>
              <p class="loading-sub">这通常需要 15-40 秒，请耐心等待</p>
            </div>
            <div v-else-if="!generatedCode" class="e2e-empty-state">
              <div class="empty-icon">🚀</div>
              <h3>端到端代码生成引擎</h3>
              <p>在左侧描述你想要的网站，AI 将自动：</p>
              <ul>
                <li>📚 分析 276+ GSAP 动画组件</li>
                <li>🎯 智能匹配最佳组件组合</li>
                <li>💻 生成完整可运行的代码</li>
                <li>👁️ 实时预览最终效果</li>
              </ul>
            </div>
            <!-- iframe 预览 -->
            <iframe
              v-show="generatedCode && !isGenerating"
              ref="iframeRef"
              class="e2e-iframe"
              sandbox="allow-scripts allow-same-origin"
              :title="'网站预览'"
            ></iframe>

            <!-- AI 对话修改栏 -->
            <div v-if="generatedCode && !isGenerating" class="e2e-chat-bar">
              <!-- 对话历史 -->
              <div v-if="chatHistory.length > 0" class="e2e-chat-history" ref="chatHistoryRef">
                <div
                  v-for="(msg, idx) in chatHistory"
                  :key="idx"
                  class="e2e-chat-msg"
                  :class="msg.role"
                >
                  <span class="chat-role">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
                  <span class="chat-content">{{ msg.content }}</span>
                </div>

              </div>
              <!-- 输入栏 -->
              <div class="e2e-chat-input-row">
                <input
                  v-model="chatInput"
                  class="e2e-chat-input"
                  placeholder="告诉 AI 你想怎么修改... 如：把 Hero 背景改成深蓝色，标题字号加大"
                  :disabled="isModifying"
                  @keydown.enter="handleModify"
                />
                <button
                  class="e2e-chat-send-btn"
                  :disabled="!chatInput.trim() || isModifying"
                  @click="handleModify"
                  title="发送修改指令"
                >
                  {{ isModifying ? '⏳' : '→' }}
                </button>
                <button
                  v-if="chatHistory.length > 0 && !isModifying"
                  class="e2e-chat-undo-btn"
                  @click="undoLastModify"
                  title="撤销上次修改"
                >
                  ↩
                </button>
              </div>
            </div>
          </div>

          <!-- 分屏分隔线 -->
          <div v-if="activeTab === 'split'" class="e2e-split-divider"></div>

          <!-- 代码面板 -->
          <div v-show="activeTab === 'code' || activeTab === 'split'" class="e2e-code-panel">
            <div v-if="!generatedCode && !isGenerating" class="e2e-empty-state mini">
              <p>生成代码后将在此显示</p>
            </div>
            <pre v-else class="e2e-code-block"><code>{{ generatedCode || '// 等待生成...' }}</code></pre>
          </div>
        </div>

        <!-- 底部状态栏 -->
        <div class="e2e-status-bar">
          <span v-if="generatedCode">
            代码: {{ generatedCode.length.toLocaleString() }} 字符 |
            组件: {{ selectedComponents.length }} 个 |
            <template v-if="qualityReport">质量: <span :style="{ color: qualityReport.score >= 80 ? '#4ade80' : qualityReport.score >= 60 ? '#fbbf24' : '#f87171' }">{{ qualityReport.score }}/100</span> |</template>
            {{ generationTime ? `耗时: ${generationTime}s` : '' }}
          </span>
          <span v-else-if="isGenerating" class="status-generating">
            🌊 流式生成中... {{ generatedCode.length ? `(${generatedCode.length.toLocaleString()} 字符)` : '' }} | {{ generationTime }}s
          </span>
          <span v-else>就绪 — 输入需求后点击"生成网站"</span>
        </div>
      </div>
    </div>

    <!-- 历史记录侧边栏 -->
    <Teleport to="body">
      <transition name="slide-left">
        <div v-if="showHistory" class="e2e-history-overlay" @click.self="showHistory = false">
          <div class="e2e-history-panel">
            <div class="e2e-history-header">
              <h3>📋 生成历史</h3>
              <button class="e2e-btn-icon" @click="showHistory = false">✕</button>
            </div>
            <div v-if="history.length === 0" class="e2e-history-empty">
              暂无历史记录
            </div>
            <div v-else class="e2e-history-list">
              <div
                v-for="(item, idx) in history"
                :key="idx"
                class="e2e-history-item"
                @click="loadHistory(item)"
              >
                <div class="history-desc">{{ item.description.substring(0, 50) }}...</div>
                <div class="history-meta">
                  {{ item.components?.length || 0 }} 组件 · {{ item.time }}
                </div>
              </div>
              <button class="e2e-clear-btn" @click="history = []">清空历史</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import '@/api/ai/ai.config' // 自动配置 AI 服务
import { aiService } from '@/api/ai'
import type { TemplateComponentMapResult } from '@/api/ai'
import { useCodePreview } from '@/composables/useCodePreview'
import { templates as allTemplates } from '@/views/web-template/template/registry'

// ====== 输入状态 ======
const description = ref('')
const companyName = ref('')
const companyIndustry = ref('')
const companyDesc = ref('')
const visualStyle = ref('')
const colorPreference = ref('')
const framework = ref<'react' | 'vue'>('react')
const outputMode = ref<'single-html' | 'multi-file'>('single-html')
const selectedTemplate = ref('')
const selectedTemplateLabel = ref('')
const templateRecommendation = ref<TemplateComponentMapResult | null>(null)

// ====== UI 状态 ======
const sidebarCollapsed = ref(false)
const activeTab = ref<'preview' | 'code' | 'split'>('preview')
const previewScale = ref(1)
const previewDarkMode = ref(true)
const isGenerating = ref(false)
const isModifying = ref(false)
const showHistory = ref(false)
const generationTime = ref(0)

// ====== AI 对话修改 ======
const chatInput = ref('')
const chatHistoryRef = ref<HTMLElement | null>(null)
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  /** 此轮修改前的代码快照（仅 user 消息携带，用于构建 AI 上下文） */
  codeSnapshot?: string
}
const chatHistory = ref<ChatMessage[]>([])
// 保存历史快照用于撤销（每次修改前的代码）
const codeSnapshots = ref<string[]>([])

/** 从代码中提取紧凑摘要信息，注入历史消息中给 AI 参考 */
function extractCodeSummary(code: string): string {
  const lines = code.split('\n').length
  const panels = (code.match(/<section\b/gi) || []).length
  const cards = (code.match(/class="[^"]*card[^"]*"/gi) || []).length
  const rootMatch = code.match(/:root\s*\{([^}]+)\}/)
  let theme = ''
  if (rootMatch) {
    const vars = rootMatch[1]
    const bg = vars.match(/--bg[^:]*:\s*([^;]+)/)
    const primary = vars.match(/--primary[^:]*:\s*([^;]+)/)
    if (bg || primary) theme = `配色:${bg ? bg[1].trim() : '?'}/${primary ? primary[1].trim() : '?'}`
  }
  return `[代码 ${lines}行, ${panels}面板, ${cards}卡片${theme ? ', ' + theme : ''}]`
}

/** 构建发送给 AI 的修改历史（注入代码上下文） */
function buildModifyHistory(chats: ChatMessage[]): Array<{ role: 'user' | 'assistant'; content: string }> {
  const result: Array<{ role: 'user' | 'assistant'; content: string }> = []
  for (const msg of chats) {
    if (msg.role === 'user' && msg.codeSnapshot) {
      result.push({
        role: 'user',
        content: `${extractCodeSummary(msg.codeSnapshot)}\n用户指令：${msg.content}`
      })
    } else {
      result.push({ role: msg.role, content: msg.content })
    }
  }
  return result
}

// ====== 生成结果 ======
const generatedCode = ref('')
const selectedComponents = ref<string[]>([])
const aiReasoning = ref('')
const qualityReport = ref<{ score: number; passed: boolean; issues: string[]; warnings: string[] } | null>(null)

// ====== 模板列表 ======
const templates = allTemplates.map(t => ({ key: t.key, label: t.label }))

// ====== 视觉风格选项 ======
const visualStyles = [
  { key: 'cyber', label: '赛博朋克', emoji: '🤖' },
  { key: 'neon', label: '霓虹', emoji: '💜' },
  { key: 'luxury', label: '奢华', emoji: '👑' },
  { key: 'minimal', label: '极简', emoji: '✨' },
  { key: 'tech', label: '科技', emoji: '🔬' },
  { key: 'nature', label: '自然', emoji: '🌿' },
  { key: 'cosmic', label: '宇宙', emoji: '🌌' },
  { key: 'dark', label: '暗黑', emoji: '🖤' },
  { key: 'playful', label: '活力', emoji: '🎉' },
]

// ====== 快捷示例 ======
const quickExamples = [
  { label: '游戏公司', desc: '做一个赛博朋克风格的独立游戏公司官网，Hero要霓虹大标题+粒子背景，展示3款游戏产品，团队介绍，联系表单' },
  { label: 'AI 公司', desc: '做一个AI科技公司官网，科技蓝紫色系，Hero全屏3D动效，展示产品能力矩阵、客户案例、数据统计，CTA联系' },
  { label: '设计工作室', desc: '做一个创意设计工作室官网，极简白+黑色字体，Hero大图+标语，展示作品集画廊，服务介绍，联系我们' },
  { label: '咖啡品牌', desc: '做一个精品咖啡品牌官网，暖色系自然风格，Hero大图+品牌故事，产品展示，门店地图，订阅CTA' },
]

// ====== 历史记录 ======
interface HistoryItem {
  description: string
  code: string
  components: string[]
  reasoning: string
  time: string
}
const history = ref<HistoryItem[]>([])
try {
  const saved = localStorage.getItem('e2e-history')
  if (saved) history.value = JSON.parse(saved)
} catch { /* ignore */ }

// ====== 预览引擎 ======
const {
  iframeRef,
  setCode,
  clear: clearPreview,
  download: downloadPreview
} = useCodePreview({ darkMode: previewDarkMode })

// ====== 模板选择 ======
async function selectTemplate(key: string, label: string) {
  if (selectedTemplate.value === key) {
    selectedTemplate.value = ''
    selectedTemplateLabel.value = ''
    templateRecommendation.value = null
    return
  }
  selectedTemplate.value = key
  selectedTemplateLabel.value = label

  // 尝试加载模板推荐（方案五的结果）
  try {
    const t = allTemplates.find(t => t.key === key)
    if (!t) return

    const srcModule = await import(/* @vite-ignore */ `../web-template/template/${key}/${key}.vue?raw`)
    const source = (srcModule as any).default || ''

    let readme = ''
    try {
      const readmeModule = await import(/* @vite-ignore */ `../web-template/template/${key}/README.md?raw`)
      readme = (readmeModule as any).default || ''
    } catch { /* no README */ }

    const result = await aiService.analyzeTemplateForComponents({
      templateKey: key,
      templateLabel: label,
      sourceCode: source,
      readme,
      componentsPerPanel: 3
    })
    templateRecommendation.value = result
  } catch (e) {
    console.warn('模板分析失败，将跳过:', e)
  }
}

// ====== 生成 ======
let generationTimer: ReturnType<typeof setInterval> | null = null
let _lastStreamRender = 0 // 流式渲染节流

async function handleGenerate() {
  if (!description.value.trim() || isGenerating.value) return

  isGenerating.value = true
  generatedCode.value = ''
  selectedComponents.value = []
  aiReasoning.value = ''
  qualityReport.value = null
  clearPreview()
  activeTab.value = 'preview'

  const startTime = Date.now()
  generationTimer = setInterval(() => {
    generationTime.value = Math.round((Date.now() - startTime) / 1000)
  }, 1000)

  try {
    // 🚀 流式生成：实时显示代码写入过程
    let streamedCode = ''

    const result = await aiService.generateWebsiteE2E(
      {
        description: description.value,
        companyInfo: {
          name: companyName.value || undefined,
          industry: companyIndustry.value || undefined,
          description: companyDesc.value || undefined
        },
        visualStyle: visualStyle.value || undefined,
        colorPreference: colorPreference.value || undefined,
        templateKey: selectedTemplate.value || undefined,
        templatePanels: templateRecommendation.value?.panels?.map(p => ({
          index: p.panelIndex,
          name: p.panelName,
          purpose: p.panelPurpose
        })),
        recommendedComponents: templateRecommendation.value || undefined,
        framework: framework.value,
        mode: outputMode.value
      },
      // 🌊 流式回调：实时推送进度
      (chunk) => {
        if (chunk.type === 'components' && chunk.data) {
          selectedComponents.value = chunk.data.selectedComponents || []
          aiReasoning.value = chunk.data.reasoning || ''
        }
        if (chunk.type === 'code' && chunk.content) {
          streamedCode = chunk.content
          generatedCode.value = streamedCode
          // 节流渲染：每 300ms 更新一次 iframe 预览
          const now = Date.now()
          if (!_lastStreamRender || now - _lastStreamRender > 300) {
            _lastStreamRender = now
            setCode(streamedCode)
          }
        }
      }
    )

    // 最终赋值
    generatedCode.value = result.html || result.files?.[0]?.content || ''
    selectedComponents.value = result.selectedComponents || selectedComponents.value
    aiReasoning.value = result.reasoning || aiReasoning.value

    // 完成时做最终渲染（V3.0 引擎自带质量报告，无需重复计算）
    if (result.html) {
      await nextTick()
      setCode(result.html)
      qualityReport.value = result.qualityReport || aiService.validateGeneratedCode(result.html)
    } else {
      qualityReport.value = null
    }

    // 保存历史
    const historyItem: HistoryItem = {
      description: description.value,
      code: result.html || '',
      components: result.selectedComponents,
      reasoning: result.reasoning,
      time: new Date().toLocaleString()
    }
    history.value.unshift(historyItem)
    if (history.value.length > 20) history.value = history.value.slice(0, 20)
    localStorage.setItem('e2e-history', JSON.stringify(history.value))

  } catch (e: any) {
    alert('生成失败: ' + (e.message || '未知错误'))
  } finally {
    isGenerating.value = false
    if (generationTimer) clearInterval(generationTimer)
    generationTime.value = Math.round((Date.now() - startTime) / 1000)
  }
}

// ====== AI 对话修改（流式 + 代码上下文） ======
async function handleModify() {
  const instruction = chatInput.value.trim()
  if (!instruction || isModifying.value || !generatedCode.value) return

  // 保存快照（用于撤销）
  codeSnapshots.value.push(generatedCode.value)

  // 用户消息携带修改前的代码快照（用于构建 AI 上下文）
  chatHistory.value.push({
    role: 'user',
    content: instruction,
    codeSnapshot: generatedCode.value
  })
  chatInput.value = ''
  isModifying.value = true

  // 添加流式占位消息（后续实时更新内容）
  chatHistory.value.push({ role: 'assistant', content: '⏳ 正在思考...' })
  const streamingIdx = chatHistory.value.length - 1

  // 滚动到底部
  await nextTick()
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
  }

  try {
    let streamText = ''

    const historyForAI = buildModifyHistory(chatHistory.value.slice(0, -2)) // 不含刚发的 user + streaming placeholder

    const result = await aiService.modifyCode(
      {
        currentCode: generatedCode.value,
        instruction,
        history: historyForAI,
        mode: outputMode.value
      },
      // 🌊 流式回调
      (chunk) => {
        if (chunk.type === 'text' && chunk.content) {
          streamText += chunk.content
          chatHistory.value[streamingIdx].content = streamText.length > 500
            ? streamText.substring(0, 500) + '...'
            : streamText
        }
        if (chunk.type === 'code' && chunk.content) {
          generatedCode.value = chunk.content
          const now = Date.now()
          if (!_lastStreamRender || now - _lastStreamRender > 300) {
            _lastStreamRender = now
            setCode(chunk.content)
          }
        }
        if (chatHistoryRef.value) {
          chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
        }
      }
    )

    // 最终代码赋值 + 预览
    if (result.html) {
      generatedCode.value = result.html
      await nextTick()
      setCode(result.html)
    }

    // 替换流式占位消息为最终结果
    chatHistory.value[streamingIdx].content = result.explanation
      ? `✅ ${result.explanation}`
      : '✅ 已按要求修改代码'

  } catch (e: any) {
    codeSnapshots.value.pop()
    chatHistory.value[streamingIdx].content = '❌ 修改失败: ' + (e.message || '未知错误')
  } finally {
    isModifying.value = false
    await nextTick()
    if (chatHistoryRef.value) {
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
    }
  }
}

function undoLastModify() {
  if (isModifying.value || codeSnapshots.value.length === 0) return

  const prevCode = codeSnapshots.value.pop()!
  generatedCode.value = prevCode
  nextTick(() => setCode(prevCode))

  // 移除最后两条对话（用户指令 + AI 回复）
  chatHistory.value = chatHistory.value.slice(0, -2)
}

// ====== 下载 ======
function handleDownload() {
  if (outputMode.value === 'single-html' && generatedCode.value) {
    downloadPreview('website.html')
  } else {
    // 多文件模式：打包单个 HTML 下载
    const blob = new Blob([generatedCode.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `website-code-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// ====== 复制代码 ======
async function handleCopyCode() {
  if (!generatedCode.value) return
  try {
    await navigator.clipboard.writeText(generatedCode.value)
    // 短暂显示提示
  } catch {
    const ta = document.createElement('textarea')
    ta.value = generatedCode.value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
}

// ====== 历史加载 ======
function loadHistory(item: HistoryItem) {
  generatedCode.value = item.code
  selectedComponents.value = item.components
  aiReasoning.value = item.reasoning
  description.value = item.description
  activeTab.value = 'preview'
  showHistory.value = false
  nextTick(() => {
    if (item.code) setCode(item.code)
  })
}

// ====== 监听 ======
watch(previewScale, (v) => { // update iframe scale
  if (iframeRef.value && generatedCode.value) {
    setCode(generatedCode.value)
  }
})

watch(previewDarkMode, () => {
  if (generatedCode.value) setCode(generatedCode.value)
})

// ====== 键盘快捷键 ======
function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    handleGenerate()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
  if (generationTimer) clearInterval(generationTimer)
  clearPreview()
})
</script>

<style scoped>
/* ═══════════ 全局容器 ═══════════ */
.e2e-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0f;
  color: #e5e7eb;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

/* ═══════════ 顶部工具栏 ═══════════ */
.e2e-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 52px;
  background: rgba(15, 15, 25, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  z-index: 10;
}

.e2e-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.e2e-logo {
  font-size: 1.05rem;
  font-weight: 700;
  color: #a78bfa;
  letter-spacing: -0.2px;
}

.e2e-badge {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  font-weight: 600;
}

.e2e-header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.e2e-framework-switch,
.e2e-mode-switch {
  display: flex;
  align-items: center;
  gap: 6px;
}

.switch-label {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.e2e-select {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e5e7eb;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.75rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}
.e2e-select:focus { border-color: #a78bfa; }
.e2e-select-sm { font-size: 0.7rem; padding: 3px 8px; }

.e2e-btn-icon {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}
.e2e-btn-icon:hover {
  background: rgba(167, 139, 250, 0.1);
  color: #a78bfa;
}

/* ═══════════ 主体 ═══════════ */
.e2e-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ═══════════ 左侧边栏 ═══════════ */
.e2e-sidebar {
  width: 380px;
  min-width: 380px;
  background: rgba(12, 12, 20, 0.98);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s ease, min-width 0.3s ease;
  flex-shrink: 0;
}

.e2e-sidebar.collapsed {
  width: 36px;
  min-width: 36px;
}

.e2e-toggle {
  position: absolute;
  top: 12px;
  right: -10px;
  z-index: 20;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1a1a2e;
  border: 2px solid rgba(167, 139, 250, 0.3);
  color: #a78bfa;
  font-size: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.e2e-toggle:hover {
  background: rgba(167, 139, 250, 0.15);
  border-color: #a78bfa;
}

.e2e-sidebar-content {
  padding: 16px 20px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 表单元素 */
.e2e-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.e2e-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon { font-size: 0.85rem; }

.e2e-textarea {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #e5e7eb;
  padding: 12px;
  font-size: 0.8rem;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.e2e-textarea:focus {
  border-color: rgba(167, 139, 250, 0.4);
  background: rgba(255, 255, 255, 0.06);
}
.e2e-textarea::placeholder { color: rgba(255, 255, 255, 0.2); }

.e2e-input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: #e5e7eb;
  padding: 8px 12px;
  font-size: 0.78rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.e2e-input:focus { border-color: rgba(167, 139, 250, 0.4); }
.e2e-input::placeholder { color: rgba(255, 255, 255, 0.2); }
.mt-3 { margin-top: 8px; }

/* 可折叠 */
.e2e-details {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  overflow: hidden;
}

.e2e-summary {
  padding: 10px 14px;
  font-size: 0.76rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}
.e2e-summary:hover { color: rgba(255, 255, 255, 0.75); }

.e2e-details-body {
  padding: 0 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 风格选择 */
.e2e-style-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.e2e-chip {
  padding: 4px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}
.e2e-chip:hover {
  border-color: rgba(167, 139, 250, 0.3);
  color: rgba(255, 255, 255, 0.8);
}
.e2e-chip.active {
  background: rgba(167, 139, 250, 0.2);
  border-color: #a78bfa;
  color: #a78bfa;
  font-weight: 600;
}

/* 模板选择 */
.e2e-template-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.e2e-template-chip {
  padding: 4px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}
.e2e-template-chip:hover {
  border-color: rgba(79, 195, 247, 0.3);
  color: rgba(255, 255, 255, 0.8);
}
.e2e-template-chip.active {
  background: rgba(79, 195, 247, 0.2);
  border-color: #4fc3f7;
  color: #4fc3f7;
  font-weight: 600;
}

.e2e-template-info {
  margin-top: 8px;
  padding: 10px;
  background: rgba(79, 195, 247, 0.06);
  border: 1px solid rgba(79, 195, 247, 0.12);
  border-radius: 8px;
}

.info-row {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
}

.info-tag {
  font-size: 0.63rem;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(79, 195, 247, 0.12);
  color: #4fc3f7;
}

.info-text {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
  line-height: 1.4;
}

/* 快捷示例 */
.e2e-quick-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.e2e-example-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.25);
  margin-right: 2px;
}

.e2e-example-btn {
  padding: 3px 10px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.68rem;
  cursor: pointer;
  transition: all 0.2s;
}
.e2e-example-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.75);
}

/* 生成按钮 */
.e2e-generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 4px;
}
.e2e-generate-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
}
.e2e-generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.e2e-generate-btn.loading {
  background: linear-gradient(135deg, #5b21b6, #7c3aed);
  animation: btn-pulse 2s ease-in-out infinite;
}

@keyframes btn-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* AI 组件选择 */
.e2e-ai-selection {
  padding: 12px;
  background: rgba(167, 139, 250, 0.06);
  border: 1px solid rgba(167, 139, 250, 0.12);
  border-radius: 10px;
}

.e2e-ai-selection h4 {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 4px;
}

.ai-reasoning {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 8px;
  line-height: 1.4;
}

.ai-comp-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ai-comp-chip {
  font-size: 0.62rem;
  padding: 2px 7px;
  border-radius: 8px;
  background: rgba(167, 139, 250, 0.12);
  color: #a78bfa;
  letter-spacing: 0.2px;
}

/* 质量报告 */
.quality-report {
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  font-size: 0.65rem;
}
.quality-report.passed {
  background: rgba(74, 222, 128, 0.06);
  border: 1px solid rgba(74, 222, 128, 0.15);
}
.quality-report.failed {
  background: rgba(248, 113, 113, 0.06);
  border: 1px solid rgba(248, 113, 113, 0.15);
}
.quality-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.score-label {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}
.score-value {
  font-weight: 700;
  font-size: 0.75rem;
}
.quality-report.passed .score-value { color: #4ade80; }
.quality-report.failed .score-value { color: #f87171; }
.quality-issues, .quality-warnings {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.quality-issue { color: #f87171; }
.quality-warn { color: #fbbf24; }

/* ═══════════ 右侧内容 ═══════════ */
.e2e-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #08080d;
}

/* 预览工具栏 */
.e2e-preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 40px;
  background: rgba(15, 15, 28, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-left button,
.e2e-toolbar-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.72rem;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.toolbar-left button:hover,
.e2e-toolbar-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
}
.toolbar-left button.active {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
  font-weight: 600;
}
.e2e-toolbar-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.e2e-toolbar-btn.active {
  color: #a78bfa;
}

/* 视图区域 */
.e2e-viewport {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.e2e-viewport.mode-preview .e2e-code-panel { display: none; }
.e2e-viewport.mode-code .e2e-preview-panel { display: none; }

.e2e-preview-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.e2e-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #111827;
}

.e2e-split-divider {
  width: 4px;
  background: rgba(255, 255, 255, 0.06);
  cursor: col-resize;
  flex-shrink: 0;
}

.e2e-code-panel {
  flex: 1;
  overflow: auto;
}

.e2e-code-block {
  margin: 0;
  padding: 16px;
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  font-size: 0.72rem;
  line-height: 1.5;
  color: #d4d4d8;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 100%;
  background: #0a0a12;
}

/* ═══════════ AI 对话修改栏 ═══════════ */
.e2e-chat-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  border-top: 1px solid rgba(167, 139, 250, 0.12);
}

.e2e-chat-history {
  max-height: 180px;
  overflow-y: auto;
  padding: 8px 12px;
  background: rgba(12, 12, 24, 0.92);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.e2e-chat-msg {
  display: flex;
  gap: 6px;
  font-size: 0.7rem;
  line-height: 1.45;
  animation: msg-in 0.25s ease;
}

@keyframes msg-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.e2e-chat-msg.user .chat-content {
  color: rgba(167, 139, 250, 0.9);
}

.e2e-chat-msg.assistant .chat-content {
  color: rgba(79, 195, 247, 0.85);
}

.chat-role {
  font-size: 0.75rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.chat-content {
  word-break: break-word;
}

.typing-dots span {
  animation: dot-blink 1.3s infinite;
  opacity: 0;
}
.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-blink {
  0%, 60%, 100% { opacity: 0; }
  30% { opacity: 1; }
}

.e2e-chat-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(15, 15, 28, 0.96);
}

.e2e-chat-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  color: #e5e7eb;
  padding: 7px 12px;
  font-size: 0.73rem;
  outline: none;
  transition: border-color 0.2s;
}
.e2e-chat-input:focus {
  border-color: rgba(167, 139, 250, 0.4);
}
.e2e-chat-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

.e2e-chat-send-btn,
.e2e-chat-undo-btn {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.e2e-chat-send-btn:hover:not(:disabled),
.e2e-chat-undo-btn:hover {
  background: rgba(167, 139, 250, 0.12);
  border-color: rgba(167, 139, 250, 0.3);
  color: #a78bfa;
}
.e2e-chat-send-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 状态面板 */
.e2e-loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.loading-pulse {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
  animation: pulse-ring 1.5s ease-out infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 0.3; }
  100% { transform: scale(0.8); opacity: 0.6; }
}

.loading-sub {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.2);
}

.e2e-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  color: rgba(255, 255, 255, 0.25);
  text-align: center;
  padding: 20px;
}

.e2e-empty-state.mini { gap: 4px; }

.empty-icon { font-size: 2.5rem; }

.e2e-empty-state h3 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
}

.e2e-empty-state p {
  font-size: 0.78rem;
  margin: 0;
}

.e2e-empty-state ul {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  text-align: left;
}

.e2e-empty-state ul li {
  font-size: 0.72rem;
  padding: 4px 0;
  color: rgba(255, 255, 255, 0.2);
}

/* 底部状态栏 */
.e2e-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 28px;
  background: rgba(15, 15, 28, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.status-generating {
  color: #a78bfa;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ═══════════ 历史记录面板 ═══════════ */
.e2e-history-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.e2e-history-panel {
  width: 340px;
  height: 100vh;
  background: rgba(15, 15, 28, 0.98);
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
}

.e2e-history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.e2e-history-header h3 {
  margin: 0;
  font-size: 0.95rem;
  color: #e5e7eb;
}

.e2e-history-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
}

.e2e-history-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.e2e-history-item {
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 4px;
}
.e2e-history-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.history-desc {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
  margin-bottom: 4px;
}

.history-meta {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.25);
}

.e2e-clear-btn {
  width: 100%;
  padding: 8px;
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 107, 157, 0.2);
  background: rgba(255, 107, 157, 0.05);
  color: #ff6b9d;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}
.e2e-clear-btn:hover {
  background: rgba(255, 107, 157, 0.12);
}

/* ═══════════ 滑入动画 ═══════════ */
.slide-left-enter-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.slide-left-leave-active {
  transition: transform 0.2s ease, opacity 0.15s ease;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(60%);
  opacity: 0;
}

/* ═══════════ 滚动条 ═══════════ */
.e2e-sidebar-content::-webkit-scrollbar,
.e2e-code-panel::-webkit-scrollbar,
.e2e-history-list::-webkit-scrollbar {
  width: 4px;
}

.e2e-sidebar-content::-webkit-scrollbar-track,
.e2e-code-panel::-webkit-scrollbar-track,
.e2e-history-list::-webkit-scrollbar-track {
  background: transparent;
}

.e2e-sidebar-content::-webkit-scrollbar-thumb,
.e2e-code-panel::-webkit-scrollbar-thumb,
.e2e-history-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

/* ═══════════ 响应式 ═══════════ */
@media (max-width: 900px) {
  .e2e-sidebar {
    width: 320px;
    min-width: 320px;
  }
}

@media (max-width: 700px) {
  .e2e-main {
    flex-direction: column;
  }
  .e2e-sidebar {
    width: 100%;
    min-width: 100%;
    max-height: 45vh;
  }
  .e2e-sidebar.collapsed {
    max-height: 40px;
  }
  .e2e-content {
    flex: 1;
  }
}
</style>
