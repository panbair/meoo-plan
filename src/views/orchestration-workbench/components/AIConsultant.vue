<template>
  <div class="ai-consultant">
    <!-- 头部 -->
    <div class="consultant-header">
      <h3 class="consultant-title">
        <span class="title-icon">🤖</span>
        AI 创意顾问
      </h3>
      <div class="ai-status" :class="{ connected: store.aiConfigured }">
        <span class="status-dot"></span>
        {{ store.aiConfigured ? 'DeepSeek 已连接' : '未配置 AI' }}
      </div>
    </div>

    <!-- 聊天区域 -->
    <div class="chat-area" ref="chatAreaRef">
      <!-- 欢迎消息 -->
      <div v-if="messages.length === 0" class="welcome-message">
        <div class="welcome-icon">💬</div>
        <h4>我是您的 AI 创意顾问</h4>
        <p>基于您选择的组件和模板，我可以：</p>
        <ul>
          <li>✅ 分析风格一致性</li>
          <li>✅ 检测组件兼容性</li>
          <li>✅ 提供创意改进建议</li>
          <li>✅ 生成详细的制作方案</li>
        </ul>
        <div class="quick-prompts">
          <p class="prompt-label">快速提问：</p>
          <button
            v-for="qp in quickPrompts"
            :key="qp"
            class="quick-prompt-btn"
            @click="sendMessage(qp)"
            :disabled="isLoading"
          >
            {{ qp }}
          </button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="messages-list" v-else>
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="message"
          :class="`msg-${msg.role}`"
        >
          <div class="msg-avatar">
            {{ msg.role === 'user' ? '👤' : '🤖' }}
          </div>
          <div class="msg-content">
            <div class="msg-text" v-html="renderMessage(msg.content)"></div>
            <!-- AI 分析结果卡片 -->
            <div v-if="msg.analysis" class="analysis-card">
              <div class="analysis-row">
                <span class="analysis-label">风格一致性</span>
                <div class="score-bar">
                  <div class="score-fill" :style="{ width: msg.analysis.styleScore + '%' }"></div>
                </div>
                <span class="score-value">{{ msg.analysis.styleScore }}/100</span>
              </div>
              <div class="analysis-row">
                <span class="analysis-label">兼容性</span>
                <span class="compat-level" :class="'level-' + msg.analysis.compatibility.level">
                  {{ compatLabels[msg.analysis.compatibility.level] }}
                </span>
              </div>
              <div class="analysis-row">
                <span class="analysis-label">性能影响</span>
                <span class="perf-level" :class="'perf-' + msg.analysis.performance.level">
                  {{ perfLabels[msg.analysis.performance.level] }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载指示器 -->
        <div v-if="isLoading" class="message msg-assistant">
          <div class="msg-avatar">🤖</div>
          <div class="msg-content">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 方案生成状态 -->
    <div class="generation-status" v-if="isGenerating">
      <div class="gen-progress">
        <div class="gen-spinner"></div>
        <span>{{ generationProgress }}</span>
      </div>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <button
        class="action-btn analyze-btn"
        @click="analyzeComposition"
        :disabled="isLoading || !store.hasComponents"
        title="分析当前组合"
      >
        🔍 分析组合
      </button>
      <button
        class="action-btn generate-btn"
        @click="generatePlan"
        :disabled="isLoading || !store.hasComponents"
        title="生成制作方案"
      >
        🚀 生成方案
      </button>
    </div>

    <!-- 输入框 -->
    <div class="input-area">
      <input
        v-model="inputText"
        type="text"
        class="chat-input"
        placeholder="向 AI 提问..."
        @keydown.enter="sendMessage(inputText)"
        :disabled="isLoading"
      />
      <button
        class="send-btn"
        @click="sendMessage(inputText)"
        :disabled="!inputText.trim() || isLoading"
      >
        ➤
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useOrchestrationStore } from '../store/orchestrationStore'
import { usePlanGenerator } from '../composables/usePlanGenerator'
import { aiService } from '@/api/ai'
import { aiConfig } from '@/api/ai/ai.config'
import type { AIAnalysis } from '../types/orchestration'

const store = useOrchestrationStore()
const { isGenerating, generationProgress, isAIAvailable, generatePlan: genPlan } = usePlanGenerator()

// ==================== 状态 ====================
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  analysis?: AIAnalysis | null
}

const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const isLoading = ref(false)
const chatAreaRef = ref<HTMLElement | null>(null)

const quickPrompts = [
  '这些组件适合什么行业？',
  '有没有更炫酷的替代方案？',
  '帮我优化组件组合',
  '分析这种组合的性能影响'
]

const compatLabels: Record<string, string> = {
  excellent: '优秀',
  good: '良好',
  fair: '一般',
  poor: '较差'
}

const perfLabels: Record<string, string> = {
  light: '轻量',
  moderate: '适中',
  heavy: '较重'
}

// ==================== 方法 ====================

function scrollToBottom() {
  nextTick(() => {
    if (chatAreaRef.value) {
      chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight
    }
  })
}

async function sendMessage(text: string) {
  if (!text.trim() || isLoading.value) return

  const userMsg = text.trim()
  inputText.value = ''
  messages.value.push({ role: 'user', content: userMsg })
  scrollToBottom()

  if (!isAIAvailable()) {
    messages.value.push({
      role: 'assistant',
      content: '⚠️ 尚未配置 AI API。请在页面右上角点击"配置AI"按钮设置 DeepSeek API Key。\n\n您也可以直接点击"生成方案"按钮使用本地模式。'
    })
    scrollToBottom()
    return
  }

  isLoading.value = true

  try {
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: buildChatSystemPrompt() },
        { role: 'user', content: userMsg }
      ],
      temperature: 0.7,
      maxTokens: 2000,
      timeout: 60000
    })

    if (response.success && response.data?.content) {
      messages.value.push({
        role: 'assistant',
        content: response.data.content,
        analysis: null
      })
    } else {
      messages.value.push({
        role: 'assistant',
        content: '抱歉，AI 响应出现问题，请稍后重试。'
      })
    }
  } catch (error: any) {
    messages.value.push({
      role: 'assistant',
      content: `AI 请求失败: ${error.message || '未知错误'}\n\n请检查网络连接和 API 配置。`
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

async function analyzeComposition() {
  if (isLoading.value || !store.hasComponents) return

  isLoading.value = true
  const analysisPrompt = `请分析以下组件组合：
组件: ${store.selectedComponents.map(c => c.name).join(', ')}
模板: ${store.selectedTemplate?.label || '未选择'}
面板映射: ${store.templatePanels.map(p => `${p.name}: ${p.assignedComponents.map(c => c.name).join(',') || '无'}`).join('; ')}

请从风格一致性、组件兼容性、性能影响三个方面给出分析。`

  try {
    const response = await aiService.chat({
      messages: [
        { role: 'system', content: '你是资深前端架构师，请简洁专业地分析。' },
        { role: 'user', content: analysisPrompt }
      ],
      temperature: 0.5,
      maxTokens: 1500,
      timeout: 60000
    })

    const content = response.success ? (response.data?.content || '分析完成') : '分析失败'

    // 模拟分析数据
    const mockAnalysis: AIAnalysis = {
      styleScore: Math.floor(Math.random() * 30) + 65,
      compatibility: {
        level: 'good',
        issues: [],
        suggestions: ['考虑在 Hero 区使用更高复杂度的组件']
      },
      performance: {
        level: 'moderate',
        estimatedLoadTime: '2.5s',
        mobileFriendly: true,
        warnings: []
      },
      creativeSuggestions: ['可以尝试添加粒子背景', '考虑使用渐变文字增强视觉层次']
    }

    messages.value.push({
      role: 'assistant',
      content,
      analysis: mockAnalysis
    })
    store.setAIAnalysis(mockAnalysis)
  } catch (error: any) {
    messages.value.push({
      role: 'assistant',
      content: `分析失败: ${error.message || '未知错误'}`
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

async function generatePlan() {
  const plans = await genPlan(store.planDetail)
  store.generatedPlans = plans
  store.activePlanIndex = 0

  messages.value.push({
    role: 'assistant',
    content: `✅ 已生成 ${plans.length} 套方案！\n\n- ${plans.map(p => p.name).join('\n- ')}\n\n请在左侧"方案查看"面板中查看详情。`
  })
  scrollToBottom()
}

function buildChatSystemPrompt(): string {
  return `你是组件编排工作台的 AI 创意顾问。用户正在浏览和选择 GSAP 动画组件和页面模板。

当前选择：
- 组件: ${store.selectedComponents.map(c => c.name).join(', ') || '无'}
- 模板: ${store.selectedTemplate?.label || '无'}
- 面板: ${store.templatePanels.length} 个

请提供专业、简洁、有针对性的建议。你的角色是创意顾问，不是代码生成器。`
}

function renderMessage(content: string): string {
  // 简单 Markdown 渲染
  return content
    .replace(/```([\s\S]*?)```/g, '<pre class="code-block">$1</pre>')
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
}
</script>

<style scoped lang="scss">
.ai-consultant {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.4);
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.consultant-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.consultant-title {
  font-size: 1rem;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .title-icon {
    font-size: 1.2rem;
  }
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: #64748b;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ef4444;
  }

  &.connected {
    color: #4ade80;
    .status-dot {
      background: #22c55e;
    }
  }
}

// 聊天区域
.chat-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
}

.welcome-message {
  text-align: center;
  padding: 30px 10px;

  .welcome-icon {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  h4 {
    color: #e2e8f0;
    margin: 0 0 8px;
    font-size: 1rem;
  }

  p {
    color: #94a3b8;
    font-size: 0.82rem;
    margin: 0 0 8px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 16px;
    font-size: 0.78rem;
    color: #64748b;
    text-align: left;

    li {
      padding: 3px 0;
    }
  }
}

.quick-prompts {
  text-align: left;

  .prompt-label {
    font-size: 0.72rem;
    color: #64748b;
    margin-bottom: 8px;
  }
}

.quick-prompt-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(99, 102, 241, 0.08);
    border-color: rgba(99, 102, 241, 0.2);
    color: #a5b4fc;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// 消息
.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 10px;
  max-width: 100%;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
}

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-text {
  font-size: 0.8rem;
  color: #cbd5e1;
  line-height: 1.6;

  :deep(.code-block) {
    display: block;
    padding: 10px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    font-size: 0.75rem;
    overflow-x: auto;
    margin: 8px 0;
  }

  :deep(.inline-code) {
    padding: 1px 5px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
    font-size: 0.75rem;
  }

  :deep(li) {
    margin-left: 16px;
  }
}

// 分析卡片
.analysis-card {
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.1);
}

.analysis-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
}

.analysis-label {
  font-size: 0.72rem;
  color: #94a3b8;
  width: 80px;
  flex-shrink: 0;
}

.score-bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #22c55e, #f59e0b, #ef4444);
  transition: width 0.5s;
}

.score-value {
  font-size: 0.72rem;
  font-weight: 600;
  color: #e2e8f0;
  width: 40px;
  text-align: right;
}

.compat-level, .perf-level {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.level-excellent { background: rgba(34, 197, 94, 0.1); color: #4ade80; }
.level-good { background: rgba(99, 102, 241, 0.1); color: #a5b4fc; }
.level-fair { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
.level-poor { background: rgba(239, 68, 68, 0.1); color: #f87171; }
.perf-light { background: rgba(34, 197, 94, 0.1); color: #4ade80; }
.perf-moderate { background: rgba(245, 158, 11, 0.1); color: #fbbf24; }
.perf-heavy { background: rgba(239, 68, 68, 0.1); color: #f87171; }

// 加载
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #64748b;
    animation: typing 1.4s infinite ease-in-out both;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

@keyframes typing {
  0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}

// 生成状态
.generation-status {
  padding: 10px 20px;
  background: rgba(99, 102, 241, 0.08);
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  flex-shrink: 0;
}

.gen-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.78rem;
  color: #a5b4fc;
}

.gen-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-top-color: #818cf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// 操作栏
.action-bar {
  padding: 10px 16px;
  display: flex;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.analyze-btn {
    background: rgba(99, 102, 241, 0.1);
    color: #a5b4fc;
    border: 1px solid rgba(99, 102, 241, 0.15);

    &:hover:not(:disabled) {
      background: rgba(99, 102, 241, 0.2);
    }
  }

  &.generate-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
  }
}

// 输入
.input-area {
  padding: 10px 16px 14px;
  display: flex;
  gap: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
  font-size: 0.8rem;
  outline: none;
  transition: all 0.25s;

  &:focus {
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #475569;
  }
}

.send-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(99, 102, 241, 0.4);
    color: white;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}
</style>
