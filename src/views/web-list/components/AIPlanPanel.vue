<template>
  <!-- 触发按钮 -->
  <button
    class="ai-trigger-btn"
    :class="{ active: visible, pulsing: !visible && hasSelections }"
    @click="handleTriggerClick"
    title="AI 生成详细制作方案"
  >
    <span class="trigger-icon">🤖</span>
    <span class="trigger-text">AI 方案</span>
    <span v-if="hasSelections && !visible" class="trigger-badge">可用</span>
  </button>

  <!-- API Key 配置对话框 -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="showApiDialog" class="api-dialog-overlay" @click.self="showApiDialog = false">
        <div class="api-dialog">
          <!-- 已配置状态 -->
          <template v-if="aiConfigured">
            <div class="api-dialog-icon">✅</div>
            <h3>DeepSeek API 已配置</h3>
            <p style="color:#4ade80;font-size:0.85rem;">AI 方案生成功能已就绪</p>
            <div class="api-dialog-actions">
              <button class="api-dialog-btn skip" @click="showApiDialog = false">取消</button>
              <button class="api-dialog-btn save" @click="openPanel">🚀 打开 AI 面板</button>
            </div>
          </template>
          <!-- 未配置状态 -->
          <template v-else>
            <div class="api-dialog-icon">🔑</div>
            <h3>配置 DeepSeek API Key</h3>
            <p>使用 AI 生成详细方案需要 API Key</p>
            <a href="https://platform.deepseek.com/" target="_blank" class="api-dialog-link">
              免费获取 DeepSeek API Key →
            </a>
            <div class="api-dialog-input-row">
              <input
                ref="apiKeyInputRef"
                v-model="apiKeyInput"
                type="password"
                class="api-dialog-input"
                placeholder="sk-..."
                @keydown.enter="saveApiKeyAndOpen"
              />
            </div>
            <p class="api-dialog-note">🔒 Key 仅存储在浏览器本地</p>
            <div class="api-dialog-actions">
              <button class="api-dialog-btn skip" @click="openPanel">跳过，本地模式</button>
              <button class="api-dialog-btn save" @click="saveApiKeyAndOpen" :disabled="!apiKeyInput.trim() || apiSaving">
                {{ apiSaving ? '验证中...' : '保存并打开' }}
              </button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- 侧边栏 -->
  <Teleport to="body">
    <Transition name="slide">
      <div v-if="visible" class="ai-panel-overlay" @click.self="visible = false">
        <div class="ai-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="title-icon">🤖</span>
              <span>AI 智能方案生成</span>
              <span class="powered-by">DeepSeek</span>
            </div>
            <button class="panel-close" @click="visible = false">✕</button>
          </div>

          <div class="panel-body">
            <!-- 当前选择摘要 -->
            <div class="section">
              <h4 class="section-title">📋 当前选择</h4>
              <div class="summary-grid">
                <div class="summary-item">
                  <span class="s-label">组件</span>
                  <span class="s-value">{{ componentCount }} 个</span>
                </div>
                <div class="summary-item">
                  <span class="s-label">模板</span>
                  <span class="s-value">{{ templateCount }} 个</span>
                </div>
                <div class="summary-item">
                  <span class="s-label">企业信息</span>
                  <span class="s-value" :class="{ ok: hasEnterprise }">
                    {{ hasEnterprise ? '✓ 已填写' : '⚠ 未填写' }}
                  </span>
                </div>
              </div>
              <div v-if="!hasSelections" class="empty-hint">
                请先选择组件和模板，再使用 AI 生成方案
              </div>
            </div>

            <!-- 生成操作 -->
            <div class="section">
              <h4 class="section-title">🚀 生成方案</h4>

              <div class="gen-options">
                <label class="option-row">
                  <span class="option-label">详细程度</span>
                  <select v-model="planDetail" class="option-select">
                    <option value="brief">简要（要点概览）</option>
                    <option value="standard">标准（含配置建议）</option>
                    <option value="detailed">详细（含代码示例）</option>
                  </select>
                </label>
              </div>

              <button
                class="gen-btn"
                :disabled="!canGenerate || isGenerating"
                @click="handleGenerate"
              >
                <span v-if="isGenerating" class="gen-spinner"></span>
                <span v-else>🚀</span>
                {{ isGenerating ? generationStatus : '生成制作方案' }}
              </button>

              <div v-if="genError" class="gen-error">{{ genError }}</div>
            </div>

            <!-- AI 对话 -->
            <div class="section">
              <h4 class="section-title">💬 快速咨询</h4>
              <div class="chat-mini" ref="chatRef">
                <div v-if="chatMessages.length === 0" class="chat-empty">
                  对我的选择有什么疑问？直接问 AI...
                </div>
                <div
                  v-for="(msg, i) in chatMessages"
                  :key="i"
                  class="chat-msg"
                  :class="'msg-' + msg.role"
                >
                  <span class="msg-avatar">{{ msg.role === 'user' ? '👤' : '🤖' }}</span>
                  <span class="msg-text">{{ msg.content }}</span>
                </div>
                <div v-if="chatLoading" class="chat-msg msg-assistant">
                  <span class="msg-avatar">🤖</span>
                  <span class="msg-text typing">思考中...</span>
                </div>
              </div>
              <div class="chat-input-row">
                <input
                  v-model="chatInput"
                  class="chat-input"
                  placeholder="问 AI..."
                  @keydown.enter="sendChat"
                  :disabled="chatLoading"
                />
                <button class="chat-send" @click="sendChat" :disabled="!chatInput.trim() || chatLoading">➤</button>
              </div>
            </div>
          </div>

          <!-- 方案结果区 -->
          <div v-if="planContent" class="panel-result">
            <div class="result-header">
              <span>📄 生成的方案</span>
              <div class="result-actions">
                <button class="r-action-btn" @click="copyPlan">📋 复制</button>
                <button class="r-action-btn" @click="downloadPlan">📥 下载</button>
                <button class="r-action-btn" @click="planContent = ''">🗑️ 清除</button>
              </div>
            </div>
            <div class="result-body">
              <div class="markdown-content" v-html="renderedPlan"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { aiService } from '@/api/ai'
import { aiConfig } from '@/api/ai/ai.config'
import { marked } from 'marked'

interface Props {
  componentCount: number
  templateCount: number
  hasEnterprise: boolean
  selectedComponents: Array<{ name: string; dirName: string; category?: string; path?: string }>
  selectedTemplateKeys: string[]
  templateLabels: Record<string, string>
  enterpriseInfo: { name?: string; industry?: string; description?: string }
  modulePositions: Array<{ key: string; label: string; icon: string }>
  getComponentsByPosition: (pos: string) => any[]
}

const props = defineProps<Props>()

// ==================== 状态 ====================
const visible = ref(false)
const isGenerating = ref(false)
const generationStatus = ref('')
const genError = ref('')
const planDetail = ref<'brief' | 'standard' | 'detailed'>('standard')
const planContent = ref('')

// API Key 对话框
const showApiDialog = ref(false)
const apiKeyInput = ref('')
const apiSaving = ref(false)
const apiKeyInputRef = ref<HTMLInputElement | null>(null)
const aiConfigured = ref(false)

// 聊天
const chatInput = ref('')
const chatLoading = ref(false)
const chatMessages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([])
const chatRef = ref<HTMLElement | null>(null)

// ==================== 计算 ====================
const hasSelections = computed(() => props.componentCount > 0 && props.templateCount > 0)
const canGenerate = computed(() => hasSelections.value && !isGenerating.value)

const renderedPlan = computed(() => {
  if (!planContent.value) return ''
  try { return marked.parse(planContent.value) as string }
  catch { return planContent.value.replace(/\n/g, '<br>') }
})

// ==================== API Key 管理 ====================
function checkAIConfig(): boolean {
  const saved = localStorage.getItem('ai-api-config')
  if (saved) {
    try {
      const config = JSON.parse(saved)
      if (config.apiKey) {
        aiService.configure({ provider: config.provider || 'deepseek', apiKey: config.apiKey, baseUrl: config.baseUrl || '' })
        aiConfigured.value = true
        return true
      }
    } catch { /* ignore */ }
  }
  if (aiConfig.apiKey) {
    aiService.configure(aiConfig)
    aiConfigured.value = true
    return true
  }
  aiConfigured.value = false
  return false
}

function isAIAvailable(): boolean {
  return aiConfigured.value
}

// ==================== 触发流程 ====================
function handleTriggerClick() {
  apiKeyInput.value = ''
  checkAIConfig()
  // 始终弹出对话框，让用户看到 API 配置状态
  showApiDialog.value = true
  if (!aiConfigured.value) {
    nextTick(() => apiKeyInputRef.value?.focus())
  }
}

function openPanel() {
  showApiDialog.value = false
  visible.value = true
}

async function saveApiKeyAndOpen() {
  const key = apiKeyInput.value.trim()
  if (!key) return

  apiSaving.value = true
  try {
    aiService.configure({ provider: 'deepseek', apiKey: key, baseUrl: 'https://api.deepseek.com/v1' })
    localStorage.setItem('ai-api-config', JSON.stringify({ provider: 'deepseek', apiKey: key }))
    aiConfigured.value = true
    openPanel()
  } catch (e: any) {
    genError.value = '配置失败: ' + (e.message || '未知错误')
  } finally {
    apiSaving.value = false
  }
}

// ==================== 方案生成 ====================
async function handleGenerate() {
  if (!canGenerate.value) return
  isGenerating.value = true
  genError.value = ''
  planContent.value = ''

  try {
    if (!isAIAvailable()) {
      generationStatus.value = '使用本地模式...'
      planContent.value = buildLocalPlan()
      return
    }

    generationStatus.value = '正在连接 DeepSeek...'

    const comps = props.selectedComponents.map(c => ({
      name: c.name, category: c.category || '', complexity: 'medium' as const, summary: ''
    }))

    const panelMappings = props.modulePositions.map(pos => ({
      name: pos.label, purpose: `网站${pos.label}模块`,
      components: props.getComponentsByPosition(pos.key).map((c: any) => c.name)
    }))

    const tplInfo = props.selectedTemplateKeys.length > 0
      ? { key: props.selectedTemplateKeys[0], label: props.templateLabels[props.selectedTemplateKeys[0]] || props.selectedTemplateKeys[0], panelCount: props.modulePositions.length, architecture: 'unknown' as const }
      : null

    generationStatus.value = 'AI 分析中...'
    planContent.value = await aiService.generateOrchestrationPlan({
      selectedComponents: comps, selectedTemplate: tplInfo, panelMappings,
      userNotes: props.hasEnterprise
        ? `企业: ${props.enterpriseInfo.name || ''}, 行业: ${props.enterpriseInfo.industry || ''}, 业务: ${props.enterpriseInfo.description || ''}`
        : undefined
    })
    generationStatus.value = '完成！'
  } catch (e: any) {
    genError.value = e.message || '生成失败'
    planContent.value = buildLocalPlan()
  } finally {
    isGenerating.value = false
  }
}

function buildLocalPlan(): string {
  const panels = props.modulePositions
  const panelList = panels.map(p => {
    const cs = props.getComponentsByPosition(p.key)
    return `- **${p.icon} ${p.label}**: ${cs.length > 0 ? cs.map((c: any) => c.name).join(', ') : '(待分配)'}`
  }).join('\n')

  return `# 🌐 企业网站制作方案

## 📋 项目概览
- **选择组件**: ${props.componentCount} 个
- **选择模板**: ${props.selectedTemplateKeys.map(k => props.templateLabels[k] || k).join(', ') || '未选择'}
- **企业**: ${props.enterpriseInfo.name || '未填写'}
${props.enterpriseInfo.industry ? `- **行业**: ${props.enterpriseInfo.industry}` : ''}

## 🏗️ 页面结构
${panelList}

## 📦 组件清单
${props.selectedComponents.map(c => `- **${c.name}**`).join('\n')}

## 🎨 设计建议
- 配色使用品牌主色 + 深色背景
- 组件间动画通过 GSAP Timeline 协调
- Hero 区使用最高视觉冲击力的组件

## ⚡ 性能提示
- 使用 Vue 3 defineAsyncComponent 懒加载
- Canvas 粒子组件限制移动端 <= 30 个
- 首屏 LCP < 2.5s

---
> 📝 本地模式生成 | ${new Date().toLocaleString('zh-CN')}
> 💡 配置 DeepSeek API Key 可获得更详细的 AI 定制方案`
}

// ==================== 聊天 ====================
async function sendChat() {
  const text = chatInput.value.trim()
  if (!text || chatLoading.value) return
  chatInput.value = ''
  chatMessages.value.push({ role: 'user', content: text })
  chatLoading.value = true

  try {
    if (!isAIAvailable()) {
      chatMessages.value.push({ role: 'assistant', content: '⚠️ 未配置 API Key，请在面板中配置后重试。' })
      chatLoading.value = false; scrollChat(); return
    }

    const response = await aiService.chat({
      messages: [
        { role: 'system', content: `你是组件选择顾问。当前选择: 组件=[${props.selectedComponents.map(c => c.name).join(', ')}], 模板=[${props.selectedTemplateKeys.map(k => props.templateLabels[k] || k).join(', ')}]。简洁专业回答，不超过200字。` },
        { role: 'user', content: text }
      ],
      temperature: 0.7, maxTokens: 500, timeout: 30000
    })

    chatMessages.value.push({ role: 'assistant', content: response.success && response.data?.content ? response.data.content : '请求失败，请重试。' })
  } catch (e: any) {
    chatMessages.value.push({ role: 'assistant', content: `请求失败: ${e.message}` })
  } finally {
    chatLoading.value = false; scrollChat()
  }
}

function scrollChat() { nextTick(() => { if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight }) }

// ==================== 导出 ====================
async function copyPlan() {
  try { await navigator.clipboard.writeText(planContent.value); alert('✅ 已复制') }
  catch { alert('❌ 复制失败') }
}
function downloadPlan() {
  const blob = new Blob([planContent.value], { type: 'text/markdown;charset=utf-8' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
  a.download = `website-plan-${Date.now()}.md`; document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(a.href)
}
</script>

<style scoped lang="scss">
// ==================== 触发按钮 ====================
.ai-trigger-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 16px; border-radius: 10px;
  border: 1px solid rgba(99,102,241,0.25);
  background: rgba(99,102,241,0.08);
  color: #a5b4fc; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all 0.3s; position: relative;

  &:hover { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.4); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(99,102,241,0.15); }
  &.active { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); box-shadow: 0 0 20px rgba(99,102,241,0.2); }
  &.pulsing { animation: pulse-btn 2s infinite; }

  .trigger-icon { font-size: 1.1rem; }
  .trigger-text { white-space: nowrap; }
  .trigger-badge { padding: 2px 8px; border-radius: 6px; background: rgba(34,197,94,0.2); color: #4ade80; font-size: 0.65rem; font-weight: 700; }
}
@keyframes pulse-btn {
  0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
  50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
}

// ==================== API Key 对话框 ====================
.api-dialog-overlay {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
}
.api-dialog {
  width: 420px; max-width: 92vw;
  background: linear-gradient(135deg, #1e293b, #1a1a2e);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 20px; padding: 32px 28px 24px;
  box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(245,158,11,0.05);
  text-align: center;
}
.api-dialog-icon { font-size: 2.5rem; margin-bottom: 12px; }
.api-dialog h3 { color: #e2e8f0; margin: 0 0 6px; font-size: 1.1rem; }
.api-dialog p { color: #94a3b8; font-size: 0.82rem; margin: 0 0 8px; }
.api-dialog-link { display: inline-block; color: #fbbf24; font-size: 0.8rem; margin-bottom: 16px; &:hover { color: #f59e0b; } }
.api-dialog-input-row { margin-bottom: 8px; }
.api-dialog-input {
  width: 100%; padding: 12px 16px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.4);
  color: #e2e8f0; font-size: 0.85rem; font-family: monospace;
  outline: none; text-align: center;
  &:focus { border-color: rgba(245,158,11,0.5); box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
  &::placeholder { color: #475569; }
}
.api-dialog-note { font-size: 0.7rem; color: #64748b; margin: 0 0 16px; }
.api-dialog-actions { display: flex; gap: 10px; justify-content: center; }
.api-dialog-btn {
  padding: 10px 20px; border-radius: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  &.skip { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #64748b; &:hover { color: #94a3b8; background: rgba(255,255,255,0.03); } }
  &.save { border: none; background: linear-gradient(135deg,#f59e0b,#d97706); color: #fff; &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245,158,11,0.3); } &:disabled { opacity: 0.4; cursor: not-allowed; } }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

// ==================== 侧边栏 ====================
.ai-panel-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.3); display: flex; justify-content: flex-end; }
.ai-panel { width: 440px; max-width: 95vw; height: 100vh; background: linear-gradient(180deg,#0f172a 0%,#1a1a2e 100%); border-left: 1px solid rgba(255,255,255,0.08); box-shadow: -10px 0 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; }
.panel-header { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.panel-title { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 700; color: #e2e8f0;
  .title-icon { font-size: 1.2rem; }
  .powered-by { padding: 2px 8px; border-radius: 4px; background: rgba(99,102,241,0.15); color: #818cf8; font-size: 0.65rem; font-weight: 600; }
}
.panel-close { background: none; border: none; color: #64748b; font-size: 1.2rem; cursor: pointer; padding: 4px 8px; border-radius: 6px; &:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); } }
.panel-body { flex: 1; overflow-y: auto; padding: 16px 20px; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; } }
.section { margin-bottom: 20px; }
.section-title { font-size: 0.82rem; color: #94a3b8; margin: 0 0 10px; font-weight: 600; }
.summary-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.summary-item { padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04); text-align: center;
  .s-label { display: block; font-size: 0.65rem; color: #64748b; margin-bottom: 4px; }
  .s-value { font-size: 0.85rem; font-weight: 600; color: #e2e8f0; &.ok { color: #4ade80; } }
}
.empty-hint { margin-top: 8px; font-size: 0.75rem; color: #fbbf24; text-align: center; }

.gen-options { margin-bottom: 12px; }
.option-row { display: flex; align-items: center; gap: 10px; }
.option-label { font-size: 0.75rem; color: #94a3b8; flex-shrink: 0; }
.option-select {
  flex: 1; padding: 7px 10px; border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
  color: #e2e8f0; color-scheme: dark; font-size: 0.78rem; outline: none; cursor: pointer;
  &:focus { border-color: rgba(99,102,241,0.4); }
  option { background: #1e293b; color: #e2e8f0; }
}
.gen-btn { width: 100%; padding: 12px; border-radius: 10px; border: none; background: linear-gradient(135deg,#667eea,#764ba2); color: #fff; font-size: 0.9rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s;
  &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}
.gen-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.gen-error { margin-top: 8px; padding: 8px 12px; border-radius: 6px; background: rgba(239,68,68,0.1); color: #f87171; font-size: 0.75rem; }

// 聊天
.chat-mini { max-height: 180px; overflow-y: auto; margin-bottom: 8px; padding: 8px; border-radius: 8px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); &::-webkit-scrollbar { width: 3px; } &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; } }
.chat-empty { font-size: 0.72rem; color: #475569; text-align: center; padding: 12px; }
.chat-msg { display: flex; gap: 8px; margin-bottom: 8px; font-size: 0.75rem;
  &.msg-assistant .msg-text { color: #cbd5e1; }
  &.msg-user { flex-direction: row-reverse; .msg-text { background: rgba(99,102,241,0.1); color: #a5b4fc; } }
}
.msg-avatar { flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; background: rgba(255,255,255,0.05); }
.msg-text { padding: 6px 10px; border-radius: 8px; line-height: 1.5; max-width: 85%; &.typing { color: #64748b; font-style: italic; } }
.chat-input-row { display: flex; gap: 6px; }
.chat-input { flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: #e2e8f0; font-size: 0.78rem; outline: none; &:focus { border-color: rgba(99,102,241,0.4); } &::placeholder { color: #475569; } }
.chat-send { width: 32px; height: 32px; border-radius: 8px; border: none; background: rgba(99,102,241,0.2); color: #818cf8; cursor: pointer; display: flex; align-items: center; justify-content: center; &:hover:not(:disabled) { background: rgba(99,102,241,0.4); color: #fff; } &:disabled { opacity: 0.3; cursor: not-allowed; } }

// 方案结果
.panel-result { border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0; max-height: 50vh; display: flex; flex-direction: column; }
.result-header { padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: #e2e8f0; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.04); }
.result-actions { display: flex; gap: 4px; }
.r-action-btn { padding: 4px 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #94a3b8; font-size: 0.68rem; cursor: pointer; &:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; } }
.result-body { flex: 1; overflow-y: auto; padding: 12px 20px; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; } }
.markdown-content { font-size: 0.78rem; color: #cbd5e1; line-height: 1.6;
  :deep(h1) { font-size: 1.2rem; color: #e2e8f0; }
  :deep(h2) { font-size: 1rem; color: #e2e8f0; margin-top: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 4px; }
  :deep(h3) { font-size: 0.85rem; color: #e2e8f0; margin-top: 12px; }
  :deep(p) { margin: 4px 0; }
  :deep(ul),:deep(ol) { padding-left: 16px; }
  :deep(li) { padding: 1px 0; }
  :deep(strong) { color: #e2e8f0; }
  :deep(code) { padding: 1px 4px; border-radius: 3px; background: rgba(0,0,0,0.3); font-size: 0.72rem; }
  :deep(pre) { padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.3); overflow-x: auto; font-size: 0.72rem; }
  :deep(blockquote) { border-left: 3px solid rgba(99,102,241,0.4); padding: 4px 12px; margin: 6px 0; background: rgba(99,102,241,0.04); border-radius: 0 6px 6px 0; color: #a5b4fc; }
  :deep(hr) { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 12px 0; }
}

.slide-enter-active,.slide-leave-active { transition: all 0.3s ease; .ai-panel { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); } }
.slide-enter-from,.slide-leave-to { background: rgba(0,0,0,0); .ai-panel { transform: translateX(100%); } }
</style>
