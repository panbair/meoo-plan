<template>
  <div class="surprise-dice">
    <button class="dice-btn" @click="rollDice" :disabled="isRolling" :title="'惊喜骰子：随机组合组件和模板'">
      <span class="dice-icon" :class="{ rolling: isRolling }">🎲</span>
      <span v-if="!isRolling" class="dice-label">惊喜</span>
      <span v-else class="dice-label">摇骰中...</span>
    </button>

    <!-- 结果弹窗 -->
    <div class="dice-result" v-if="showResult && diceResult" @click="showResult = false">
      <div class="result-overlay" @click="showResult = false"></div>
      <div class="result-card" @click.stop>
        <div class="result-header">
          <span class="result-icon">🎲</span>
          <h3>惊喜组合！</h3>
          <button class="result-close" @click="showResult = false">✕</button>
        </div>

        <div class="result-body">
          <div class="result-section">
            <h4>📋 推荐模板</h4>
            <div class="result-item template-item">
              <span class="rl-name">{{ diceResult.template?.label || '随机模板' }}</span>
              <span class="rl-meta">{{ diceResult.template?.panelCount || '?' }} 面板</span>
            </div>
          </div>

          <div class="result-section">
            <h4>🧩 推荐组件 ({{ diceResult.components?.length || 0 }} 个)</h4>
            <div
              v-for="comp in (diceResult.components || [])"
              :key="comp.name"
              class="result-item"
              :class="getComplexityClass(comp.complexity)"
            >
              <span class="rl-name">{{ comp.name }}</span>
              <span class="rl-cat">{{ comp.categoryLabel }}</span>
            </div>
          </div>

          <div class="result-section">
            <h4>💡 AI 点评</h4>
            <p class="ai-comment">{{ diceResult.comment || '随机组合产生意想不到的创意！' }}</p>
          </div>
        </div>

        <div class="result-footer">
          <button class="footer-btn cancel-btn" @click="showResult = false">再想想</button>
          <button class="footer-btn apply-btn" @click="applyResult">🎯 应用此组合</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOrchestration, CATEGORY_LABELS } from '../composables/useOrchestration'
import { useOrchestrationStore } from '../store/orchestrationStore'
import { aiService } from '@/api/ai'
import type { ComponentItem, TemplateItem } from '../types/orchestration'
import type { ComponentCategory } from '@/api/ai/component-knowledge-builder'

const { getAvailableComponents, getAvailableTemplates, init } = useOrchestration()
const store = useOrchestrationStore()

const isRolling = ref(false)
const showResult = ref(false)
const diceResult = ref<{
  template: TemplateItem | null
  components: ComponentItem[]
  comment: string
} | null>(null)

async function rollDice() {
  isRolling.value = true

  // 动画延迟
  await new Promise(resolve => setTimeout(resolve, 800))

  await init()
  const allComponents = getAvailableComponents()
  const allTemplates = getAvailableTemplates()

  // 随机选模板
  const template = allTemplates[Math.floor(Math.random() * allTemplates.length)] || null

  // 随机选 3-8 个组件
  const count = Math.floor(Math.random() * 6) + 3
  const shuffled = [...allComponents].sort(() => Math.random() - 0.5)
  const components = shuffled.slice(0, Math.min(count, shuffled.length))

  // AI 点评（如果可用）
  let comment = '这是一个充满惊喜的组合！'

  try {
    const savedConfig = localStorage.getItem('ai-api-config')
    if (savedConfig) {
      const response = await aiService.chat({
        messages: [
          { role: 'system', content: '你是创意设计顾问。给出20字以内的简短创意点评。' },
          {
            role: 'user',
            content: `点评这个组合：模板=${template?.label}, 组件=${components.map(c => c.name).join(',')}`
          }
        ],
        temperature: 0.9,
        maxTokens: 100,
        timeout: 15000
      })
      if (response.success && response.data?.content) {
        comment = response.data.content.trim()
      }
    }
  } catch { /* 使用默认点评 */ }

  diceResult.value = { template, components, comment }
  isRolling.value = false
  showResult.value = true
}

function applyResult() {
  if (!diceResult.value) return

  // 清空当前选择
  store.clearComponents()
  store.clearTemplate()

  // 应用模板
  if (diceResult.value.template) {
    store.selectTemplate(diceResult.value.template)
  }

  // 应用组件
  diceResult.value.components.forEach(comp => {
    store.addComponent(comp)
  })

  // 智能分配
  store.autoAssignPanels()

  showResult.value = false
}

function getComplexityClass(complexity: string): string {
  return `comp-${complexity}`
}
</script>

<style scoped lang="scss">
.surprise-dice {
  position: relative;
}

.dice-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(245, 158, 11, 0.25);
  background: rgba(245, 158, 11, 0.08);
  color: #fbbf24;
  cursor: pointer;
  font-size: 0.78rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(245, 158, 11, 0.15);
    border-color: rgba(245, 158, 11, 0.4);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
}

.dice-icon {
  font-size: 1.3rem;
  display: inline-block;

  &.rolling {
    animation: diceRoll 0.8s ease-out;
  }
}

@keyframes diceRoll {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.2); }
  50% { transform: rotate(270deg) scale(1.3); }
  75% { transform: rotate(360deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

.dice-label {
  white-space: nowrap;
}

// 结果弹窗
.dice-result {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.result-card {
  position: relative;
  width: 90vw;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #1e293b, #1a1a2e);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(245, 158, 11, 0.05);

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
}

.result-header {
  padding: 20px 24px 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  .result-icon {
    font-size: 1.5rem;
  }

  h3 {
    flex: 1;
    margin: 0;
    color: #e2e8f0;
    font-size: 1.1rem;
  }
}

.result-close {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.05);
  }
}

.result-body {
  padding: 0 24px 16px;
}

.result-section {
  margin-bottom: 14px;

  h4 {
    font-size: 0.82rem;
    color: #94a3b8;
    margin: 0 0 8px;
    font-weight: 600;
  }
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 4px;
  border: 1px solid rgba(255, 255, 255, 0.04);

  &.comp-low { border-left: 3px solid #22c55e; }
  &.comp-medium { border-left: 3px solid #f59e0b; }
  &.comp-high { border-left: 3px solid #ef4444; }
}

.template-item {
  border-left: 3px solid #a855f7;
}

.rl-name {
  font-size: 0.82rem;
  color: #e2e8f0;
  font-weight: 500;
}

.rl-meta, .rl-cat {
  font-size: 0.7rem;
  color: #64748b;
}

.ai-comment {
  font-size: 0.82rem;
  color: #fbbf24;
  font-style: italic;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.06);
  border: 1px solid rgba(245, 158, 11, 0.1);
  margin: 0;
  line-height: 1.6;
}

.result-footer {
  padding: 12px 24px 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.footer-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.cancel-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &.apply-btn {
    background: linear-gradient(135deg, #f59e0b, #f97316);
    border: none;
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
  }
}
</style>
