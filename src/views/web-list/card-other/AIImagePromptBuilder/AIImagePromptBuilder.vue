<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 标签分类 ====================
interface TagItem {
  text: string
  weight: number
  active: boolean
}

interface TagCategory {
  name: string
  icon: string
  tags: TagItem[]
}

const categories = reactive<TagCategory[]>([
  {
    name: '主题',
    icon: '🎯',
    tags: [
      { text: 'portrait', weight: 1, active: false },
      { text: 'landscape', weight: 1, active: false },
      { text: 'cyberpunk city', weight: 1, active: false },
      { text: 'fantasy world', weight: 1, active: false },
      { text: 'sci-fi spaceship', weight: 1, active: false },
      { text: 'underwater scene', weight: 1, active: false },
      { text: 'ancient temple', weight: 1, active: false },
      { text: 'futuristic robot', weight: 1, active: false },
    ],
  },
  {
    name: '风格',
    icon: '🎨',
    tags: [
      { text: 'photorealistic', weight: 1, active: false },
      { text: 'anime style', weight: 1, active: false },
      { text: 'oil painting', weight: 1, active: false },
      { text: 'watercolor', weight: 1, active: false },
      { text: 'digital art', weight: 1, active: false },
      { text: 'concept art', weight: 1, active: false },
      { text: 'pixel art', weight: 1, active: false },
      { text: 'minimalist', weight: 1, active: false },
      { text: '3D render', weight: 1, active: false },
    ],
  },
  {
    name: '光影',
    icon: '💡',
    tags: [
      { text: 'cinematic lighting', weight: 1, active: false },
      { text: 'golden hour', weight: 1, active: false },
      { text: 'neon lights', weight: 1, active: false },
      { text: 'volumetric fog', weight: 1, active: false },
      { text: 'dramatic shadows', weight: 1, active: false },
      { text: 'soft ambient light', weight: 1, active: false },
      { text: 'backlit', weight: 1, active: false },
      { text: 'rim lighting', weight: 1, active: false },
    ],
  },
  {
    name: '色彩',
    icon: '🌈',
    tags: [
      { text: 'vibrant colors', weight: 1, active: false },
      { text: 'pastel palette', weight: 1, active: false },
      { text: 'monochrome', weight: 1, active: false },
      { text: 'warm tones', weight: 1, active: false },
      { text: 'cool blue tones', weight: 1, active: false },
      { text: 'neon color scheme', weight: 1, active: false },
      { text: 'earth tones', weight: 1, active: false },
    ],
  },
  {
    name: '构图',
    icon: '📐',
    tags: [
      { text: 'rule of thirds', weight: 1, active: false },
      { text: 'symmetrical', weight: 1, active: false },
      { text: 'close-up', weight: 1, active: false },
      { text: 'wide angle', weight: 1, active: false },
      { text: 'bird eye view', weight: 1, active: false },
      { text: 'low angle shot', weight: 1, active: false },
      { text: 'depth of field', weight: 1, active: false },
    ],
  },
  {
    name: '质量',
    icon: '⭐',
    tags: [
      { text: 'masterpiece', weight: 1.3, active: false },
      { text: 'best quality', weight: 1.2, active: false },
      { text: 'highly detailed', weight: 1, active: false },
      { text: '8K resolution', weight: 1, active: false },
      { text: 'ultra sharp', weight: 1, active: false },
      { text: 'trending on artstation', weight: 1, active: false },
      { text: 'award winning', weight: 1, active: false },
    ],
  },
])

const negativeDefaults = [
  'low quality',
  'blurry',
  'deformed',
  'ugly',
  'bad anatomy',
  'extra limbs',
  'watermark',
  'text',
  'signature',
  'cropped',
]

// ==================== 状态 ====================
const activeCategoryIdx = ref(0)
const customTag = ref('')
const negativePrompt = reactive<string[]>([...negativeDefaults])
const customNegative = ref('')
const copiedPositive = ref(false)
const copiedNegative = ref(false)
const platform = ref<'sd' | 'mj'>('sd')

// ==================== 计算 ====================
const selectedTags = computed(() => {
  const result: TagItem[] = []
  categories.forEach((cat) => {
    cat.tags.forEach((tag) => {
      if (tag.active) {
        result.push(tag)
      }
    })
  })
  return result
})

const positivePromptText = computed(() => {
  return selectedTags.value
    .map((t) => {
      if (platform.value === 'sd' && t.weight !== 1) {
        return `(${t.text}:${t.weight.toFixed(1)})`
      }
      if (platform.value === 'mj' && t.weight !== 1) {
        return `${t.text}::${t.weight.toFixed(1)}`
      }
      return t.text
    })
    .join(', ')
})

const negativePromptText = computed(() => negativePrompt.join(', '))

// ==================== 操作 ====================
function toggleTag(tag: TagItem) {
  tag.active = !tag.active
}

function adjustWeight(tag: TagItem, delta: number) {
  tag.weight = Math.max(0.1, Math.min(2.0, +(tag.weight + delta).toFixed(1)))
}

function removeSelectedTag(tag: TagItem) {
  tag.active = false
}

function addCustomTag() {
  if (!customTag.value.trim()) {
    return
  }
  const cat = categories[activeCategoryIdx.value]
  cat.tags.push({ text: customTag.value.trim(), weight: 1, active: true })
  customTag.value = ''
}

function addCustomNegative() {
  if (!customNegative.value.trim()) {
    return
  }
  negativePrompt.push(customNegative.value.trim())
  customNegative.value = ''
}

function removeNegative(idx: number) {
  negativePrompt.splice(idx, 1)
}

function copyText(text: string, type: 'pos' | 'neg') {
  navigator.clipboard.writeText(text)
  if (type === 'pos') {
    copiedPositive.value = true
    setTimeout(() => {
      copiedPositive.value = false
    }, 1500)
  } else {
    copiedNegative.value = true
    setTimeout(() => {
      copiedNegative.value = false
    }, 1500)
  }
}

function clearAll() {
  categories.forEach((cat) => cat.tags.forEach((t) => { t.active = false; t.weight = 1 }))
}

// Presets
const presets = [
  { name: '赛博朋克人像', tags: ['portrait', 'cyberpunk city', 'neon lights', 'cinematic lighting', 'photorealistic', 'masterpiece', '8K resolution'] },
  { name: '水彩风景', tags: ['landscape', 'watercolor', 'golden hour', 'pastel palette', 'soft ambient light', 'best quality'] },
  { name: '科幻概念图', tags: ['sci-fi spaceship', 'concept art', 'volumetric fog', 'cool blue tones', 'wide angle', 'highly detailed', 'trending on artstation'] },
]

function applyPreset(preset: typeof presets[0]) {
  clearAll()
  categories.forEach((cat) => {
    cat.tags.forEach((tag) => {
      if (preset.tags.includes(tag.text)) {
        tag.active = true
      }
    })
  })
}

onMounted(() => {
  gsap.fromTo('.prompt-builder', { opacity: 0 }, { opacity: 1, duration: 0.4 })
})
</script>

<template>
  <div class="prompt-builder">
    <div class="top-bar">
      <h2>🎨 AI 图像提示词构建器</h2>
      <div class="top-actions">
        <div class="platform-toggle">
          <button :class="{ active: platform === 'sd' }" @click="platform = 'sd'">Stable Diffusion</button>
          <button :class="{ active: platform === 'mj' }" @click="platform = 'mj'">MidJourney</button>
        </div>
      </div>
    </div>

    <div class="main-layout">
      <!-- Left: Tag categories -->
      <div class="tag-panel">
        <!-- Presets -->
        <div class="preset-section">
          <div class="section-label">快速预设</div>
          <div class="preset-list">
            <button v-for="p in presets" :key="p.name" class="preset-btn" @click="applyPreset(p)">
              {{ p.name }}
            </button>
          </div>
        </div>

        <!-- Category tabs -->
        <div class="cat-tabs">
          <button
            v-for="(cat, i) in categories"
            :key="cat.name"
            class="cat-tab"
            :class="{ active: activeCategoryIdx === i }"
            @click="activeCategoryIdx = i"
          >
            {{ cat.icon }} {{ cat.name }}
          </button>
        </div>

        <!-- Tags grid -->
        <div class="tag-grid">
          <div
            v-for="tag in categories[activeCategoryIdx].tags"
            :key="tag.text"
            class="tag-chip"
            :class="{ active: tag.active }"
            @click="toggleTag(tag)"
          >
            {{ tag.text }}
          </div>
        </div>

        <!-- Custom tag input -->
        <div class="custom-input-row">
          <input
            v-model="customTag"
            class="custom-input"
            placeholder="自定义标签..."
            @keyup.enter="addCustomTag"
          />
          <button class="add-custom-btn" @click="addCustomTag">添加</button>
        </div>
      </div>

      <!-- Right: Prompt output -->
      <div class="output-panel">
        <!-- Selected tags with weight control -->
        <div class="section">
          <div class="section-header">
            <span>✅ 已选标签 ({{ selectedTags.length }})</span>
            <button class="clear-btn" @click="clearAll">清空</button>
          </div>
          <div class="selected-tags">
            <div v-for="tag in selectedTags" :key="tag.text" class="selected-tag">
              <span class="st-text">{{ tag.text }}</span>
              <div class="weight-ctrl">
                <button class="w-btn" @click="adjustWeight(tag, -0.1)">−</button>
                <span class="w-val">{{ tag.weight.toFixed(1) }}</span>
                <button class="w-btn" @click="adjustWeight(tag, 0.1)">+</button>
              </div>
              <button class="st-remove" @click="removeSelectedTag(tag)">✕</button>
            </div>
            <div v-if="selectedTags.length === 0" class="empty-msg">点击左侧标签添加关键词</div>
          </div>
        </div>

        <!-- Positive prompt -->
        <div class="section">
          <div class="section-header">
            <span>📝 正面提示词</span>
            <button class="copy-btn" @click="copyText(positivePromptText, 'pos')">
              {{ copiedPositive ? '✅ 已复制' : '📋 复制' }}
            </button>
          </div>
          <div class="prompt-output">{{ positivePromptText || '(空)' }}</div>
        </div>

        <!-- Negative prompt -->
        <div class="section">
          <div class="section-header">
            <span>🚫 负面提示词</span>
            <button class="copy-btn" @click="copyText(negativePromptText, 'neg')">
              {{ copiedNegative ? '✅ 已复制' : '📋 复制' }}
            </button>
          </div>
          <div class="neg-tags">
            <span v-for="(n, i) in negativePrompt" :key="i" class="neg-chip">
              {{ n }}
              <button class="neg-remove" @click="removeNegative(i)">✕</button>
            </span>
          </div>
          <div class="custom-input-row">
            <input
              v-model="customNegative"
              class="custom-input"
              placeholder="添加负面词..."
              @keyup.enter="addCustomNegative"
            />
            <button class="add-custom-btn" @click="addCustomNegative">添加</button>
          </div>
          <div class="prompt-output neg">{{ negativePromptText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prompt-builder {
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

.platform-toggle {
  display: flex;
  gap: 2px;
}

.platform-toggle button {
  padding: 4px 14px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.platform-toggle button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.tag-panel {
  width: 380px;
  border-right: 1px solid #1e293b;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  flex-shrink: 0;
}

.section-label {
  color: #64748b;
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.preset-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 4px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.preset-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.cat-tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.cat-tab {
  padding: 4px 10px;
  background: transparent;
  border: 1px solid transparent;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.cat-tab.active {
  background: #1e293b;
  border-color: #334155;
  color: #e2e8f0;
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  padding: 4px 12px;
  background: #111827;
  border: 1px solid #1e293b;
  color: #94a3b8;
  border-radius: 16px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.tag-chip:hover {
  border-color: #3b82f6;
  color: #e2e8f0;
}

.tag-chip.active {
  background: rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
  color: #60a5fa;
}

.custom-input-row {
  display: flex;
  gap: 6px;
}

.custom-input {
  flex: 1;
  background: #111827;
  border: 1px solid #1e293b;
  color: #e2e8f0;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  outline: none;
}

.custom-input:focus {
  border-color: #3b82f6;
}

.add-custom-btn {
  padding: 4px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}

.output-panel {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #94a3b8;
  font-size: 13px;
}

.clear-btn,
.copy-btn {
  padding: 2px 10px;
  background: transparent;
  border: 1px solid #334155;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.15s;
}

.clear-btn:hover,
.copy-btn:hover {
  color: #e2e8f0;
  border-color: #3b82f6;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 6px;
  padding: 4px 8px;
}

.st-text {
  color: #cbd5e1;
  font-size: 12px;
}

.weight-ctrl {
  display: flex;
  align-items: center;
  gap: 2px;
}

.w-btn {
  width: 18px;
  height: 18px;
  background: #1e293b;
  border: none;
  color: #94a3b8;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.w-val {
  color: #3b82f6;
  font-size: 11px;
  min-width: 24px;
  text-align: center;
  font-family: monospace;
}

.st-remove {
  background: transparent;
  border: none;
  color: #475569;
  cursor: pointer;
  font-size: 10px;
  padding: 0 2px;
}

.st-remove:hover {
  color: #ef4444;
}

.empty-msg {
  color: #334155;
  font-size: 13px;
}

.prompt-output {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 12px;
  color: #a5f3fc;
  font-family: 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-all;
  min-height: 40px;
}

.prompt-output.neg {
  color: #fca5a5;
}

.neg-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.neg-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
}

.neg-remove {
  background: transparent;
  border: none;
  color: #f87171;
  cursor: pointer;
  font-size: 10px;
  padding: 0;
}
</style>

