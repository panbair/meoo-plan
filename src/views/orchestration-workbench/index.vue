<template>
  <div class="orchestration-workbench">
    <!-- 顶部导航栏 -->
    <header class="workbench-header">
      <div class="header-left">
        <h1 class="header-title">
          <span class="title-icon">🎯</span>
          智能组件编排工作台
        </h1>
        <span class="header-badge">DeepSeek 驱动</span>
      </div>

      <div class="header-center">
        <!-- 步骤指示器 -->
        <div class="steps">
          <div class="step" :class="{ active: store.hasComponents }">
            <span class="step-dot"></span>
            选组件 ({{ store.componentCount }})
          </div>
          <div class="step-arrow">→</div>
          <div class="step" :class="{ active: store.hasTemplate }">
            <span class="step-dot"></span>
            选模板
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <span class="step-dot"></span>
            AI 生成方案
          </div>
        </div>
      </div>

      <div class="header-right">
        <SurpriseDice />
        <button class="header-btn config-btn" @click="showApiConfig = true" :title="store.aiConfigured ? 'AI已配置' : '配置AI'">
          <span class="status-dot" :class="{ on: store.aiConfigured }"></span>
          {{ store.aiConfigured ? 'AI 已连接' : '配置 AI' }}
        </button>
      </div>
    </header>

    <!-- 三栏主体 -->
    <div class="workbench-body">
      <!-- 左栏：组件库 -->
      <div class="panel panel-left">
        <ComponentLibrary />
        <SelectedBar />
      </div>

      <!-- 中栏：模板画布 -->
      <div class="panel panel-center">
        <div class="center-split">
          <div class="center-top">
            <TemplateCanvas />
          </div>
          <div class="center-bottom">
            <PlanViewer />
          </div>
        </div>
      </div>

      <!-- 右栏：AI 顾问 -->
      <div class="panel panel-right">
        <AIConsultant />
      </div>
    </div>

    <!-- API 配置对话框 -->
    <div v-if="showApiConfig" class="modal-overlay" @click.self="showApiConfig = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>⚙️ AI API 配置</h3>
          <button class="modal-close" @click="showApiConfig = false">×</button>
        </div>
        <div class="modal-body">
          <div class="config-info">
            <p>💡 配置 DeepSeek API 后，AI 顾问将提供实时分析和智能方案生成。</p>
          </div>

          <div class="form-group">
            <label class="form-label">AI 提供商</label>
            <select v-model="apiProvider" class="form-select">
              <option value="deepseek">DeepSeek</option>
              <option value="qwen">通义千问 (Qwen)</option>
              <option value="openai">OpenAI (GPT)</option>
              <option value="custom">自定义</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              API 密钥 <span class="required">*</span>
            </label>
            <input
              v-model="apiKey"
              type="password"
              class="form-input"
              placeholder="请输入您的 API 密钥"
            />
            <p class="form-hint">🔒 API 密钥仅存储在浏览器本地，不会上传到服务器</p>
          </div>

          <div class="form-group" v-if="apiProvider === 'custom'">
            <label class="form-label">基础 URL</label>
            <input v-model="apiBaseUrl" type="text" class="form-input" placeholder="https://api.example.com/v1" />
          </div>

          <div class="api-links">
            <h4>📚 获取 API 密钥：</h4>
            <ul>
              <li><a href="https://platform.deepseek.com/" target="_blank">DeepSeek API</a></li>
              <li><a href="https://dashscope.console.aliyun.com/" target="_blank">通义千问 API</a></li>
              <li><a href="https://platform.openai.com/" target="_blank">OpenAI API</a></li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showApiConfig = false">取消</button>
          <button class="btn btn-primary" @click="saveApiConfig">保存配置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrchestrationStore } from './store/orchestrationStore'
import { useOrchestration } from './composables/useOrchestration'
import { aiService } from '@/api/ai'
import { aiConfig } from '@/api/ai/ai.config'

// Components
import ComponentLibrary from './components/ComponentLibrary.vue'
import SelectedBar from './components/SelectedBar.vue'
import TemplateCanvas from './components/TemplateCanvas.vue'
import PlanViewer from './components/PlanViewer.vue'
import AIConsultant from './components/AIConsultant.vue'
import SurpriseDice from './components/SurpriseDice.vue'

const store = useOrchestrationStore()
const { init } = useOrchestration()

// ==================== API 配置 ====================
const showApiConfig = ref(false)
const apiProvider = ref('deepseek')
const apiKey = ref('')
const apiBaseUrl = ref('')

// 初始化
onMounted(async () => {
  await init()

  // 加载 API 配置
  const savedConfig = localStorage.getItem('ai-api-config')
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      apiProvider.value = config.provider || 'deepseek'
      apiKey.value = config.apiKey || ''
      apiBaseUrl.value = config.baseUrl || ''

      if (apiKey.value) {
        aiService.configure({
          provider: apiProvider.value as any,
          apiKey: apiKey.value,
          baseUrl: apiBaseUrl.value,
          model: config.model || ''
        })
        store.setAIConfigured(true)
      }
    } catch { /* ignore */ }
  } else if (aiConfig.apiKey) {
    aiService.configure(aiConfig)
    store.setAIConfigured(true)
  }
})

function saveApiConfig() {
  if (!apiKey.value) {
    alert('请输入 API 密钥')
    return
  }

  aiService.configure({
    provider: apiProvider.value as any,
    apiKey: apiKey.value,
    baseUrl: apiBaseUrl.value,
    model: ''
  })

  localStorage.setItem('ai-api-config', JSON.stringify({
    provider: apiProvider.value,
    apiKey: apiKey.value,
    baseUrl: apiBaseUrl.value
  }))

  store.setAIConfigured(true)
  showApiConfig.value = false
  alert('✅ AI API 配置成功！')
}
</script>

<style scoped lang="scss">
.orchestration-workbench {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f172a 0%, #1a1a2e 50%, #0f172a 100%);
  color: #e2e8f0;
  overflow: hidden;
}

// ==================== Header ====================
.workbench-header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: rgba(15, 23, 42, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  z-index: 50;
  flex-shrink: 0;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.header-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  .title-icon {
    font-size: 1.3rem;
  }
}

.header-badge {
  padding: 3px 10px;
  border-radius: 6px;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  font-size: 0.7rem;
  font-weight: 600;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.steps {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #64748b;
}

.step {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;

  &.active {
    color: #a5b4fc;
  }

  .step-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #475569;

    .active & {
      background: #818cf8;
    }
  }
}

.step-arrow {
  color: #334155;
  font-size: 0.7rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.header-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #e2e8f0;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ef4444;

    &.on {
      background: #22c55e;
    }
  }
}

// ==================== Body ====================
.workbench-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-left {
  width: 320px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.04);
}

.panel-center {
  flex: 1;
  min-width: 0;
}

.panel-right {
  width: 360px;
  flex-shrink: 0;
}

.center-split {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.center-top {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-bottom: 2px solid rgba(255, 255, 255, 0.04);
}

.center-bottom {
  height: 45%;
  min-height: 250px;
  overflow: hidden;
}

// ==================== API Modal ====================
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  width: 90vw;
  max-width: 500px;
  background: #1e293b;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 20px 24px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    color: #e2e8f0;
    font-size: 1.1rem;
  }
}

.modal-close {
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;

  &:hover {
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.05);
  }
}

.modal-body {
  padding: 0 24px 16px;
}

.config-info {
  margin-bottom: 16px;
  p {
    font-size: 0.82rem;
    color: #94a3b8;
    margin: 0;
  }
}

.form-group {
  margin-bottom: 14px;
}

.form-label {
  display: block;
  font-size: 0.8rem;
  color: #cbd5e1;
  margin-bottom: 6px;
  font-weight: 500;

  .required {
    color: #ef4444;
  }
}

.form-select, .form-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
}

.form-hint {
  font-size: 0.7rem;
  color: #64748b;
  margin: 4px 0 0;
}

.api-links {
  margin-top: 12px;

  h4 {
    font-size: 0.8rem;
    color: #cbd5e1;
    margin: 0 0 6px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 2px 0;
    }

    a {
      color: #818cf8;
      font-size: 0.78rem;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.modal-footer {
  padding: 12px 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.btn-secondary {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #94a3b8;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &.btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
  }
}
</style>
