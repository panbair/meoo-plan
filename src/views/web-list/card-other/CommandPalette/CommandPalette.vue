<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { gsap } from 'gsap'

// ==================== 命令定义 ====================
interface Command {
  id: string
  label: string
  group: string
  shortcut?: string
  icon: string
  action: () => void
}

const toastMsg = ref('')
const toastShow = ref(false)

function showToast(msg: string) {
  toastMsg.value = msg
  toastShow.value = true
  setTimeout(() => {
    toastShow.value = false
  }, 2000)
}

const commands: Command[] = [
  { id: 'new-file', label: '新建文件', group: '文件', shortcut: 'Ctrl+N', icon: '📄', action: () => showToast('新建文件') },
  { id: 'open-file', label: '打开文件', group: '文件', shortcut: 'Ctrl+O', icon: '📂', action: () => showToast('打开文件') },
  { id: 'save', label: '保存', group: '文件', shortcut: 'Ctrl+S', icon: '💾', action: () => showToast('已保存') },
  { id: 'save-as', label: '另存为', group: '文件', shortcut: 'Ctrl+Shift+S', icon: '📥', action: () => showToast('另存为') },
  { id: 'export-pdf', label: '导出PDF', group: '文件', icon: '📋', action: () => showToast('导出PDF') },

  { id: 'undo', label: '撤销', group: '编辑', shortcut: 'Ctrl+Z', icon: '↩️', action: () => showToast('撤销') },
  { id: 'redo', label: '重做', group: '编辑', shortcut: 'Ctrl+Shift+Z', icon: '↪️', action: () => showToast('重做') },
  { id: 'find', label: '查找', group: '编辑', shortcut: 'Ctrl+F', icon: '🔍', action: () => showToast('查找') },
  { id: 'replace', label: '替换', group: '编辑', shortcut: 'Ctrl+H', icon: '🔄', action: () => showToast('替换') },
  { id: 'format', label: '格式化代码', group: '编辑', shortcut: 'Alt+Shift+F', icon: '✨', action: () => showToast('格式化') },

  { id: 'toggle-sidebar', label: '切换侧边栏', group: '视图', shortcut: 'Ctrl+B', icon: '📊', action: () => showToast('切换侧边栏') },
  { id: 'toggle-terminal', label: '切换终端', group: '视图', shortcut: 'Ctrl+`', icon: '💻', action: () => showToast('切换终端') },
  { id: 'zoom-in', label: '放大', group: '视图', shortcut: 'Ctrl++', icon: '🔎', action: () => showToast('放大') },
  { id: 'zoom-out', label: '缩小', group: '视图', shortcut: 'Ctrl+-', icon: '🔍', action: () => showToast('缩小') },
  { id: 'fullscreen', label: '全屏', group: '视图', shortcut: 'F11', icon: '🖥️', action: () => showToast('全屏') },

  { id: 'theme-dark', label: '深色主题', group: '设置', icon: '🌙', action: () => showToast('深色主题') },
  { id: 'theme-light', label: '浅色主题', group: '设置', icon: '☀️', action: () => showToast('浅色主题') },
  { id: 'font-size', label: '字体大小', group: '设置', icon: '🔤', action: () => showToast('字体设置') },
  { id: 'keybindings', label: '快捷键设置', group: '设置', shortcut: 'Ctrl+K S', icon: '⌨️', action: () => showToast('快捷键') },

  { id: 'git-commit', label: 'Git: 提交', group: 'Git', icon: '📦', action: () => showToast('Git 提交') },
  { id: 'git-push', label: 'Git: 推送', group: 'Git', icon: '⬆️', action: () => showToast('Git 推送') },
  { id: 'git-pull', label: 'Git: 拉取', group: 'Git', icon: '⬇️', action: () => showToast('Git 拉取') },
  { id: 'git-branch', label: 'Git: 切换分支', group: 'Git', icon: '🔀', action: () => showToast('切换分支') },

  { id: 'run-task', label: '运行任务', group: '终端', shortcut: 'Ctrl+Shift+B', icon: '▶️', action: () => showToast('运行任务') },
  { id: 'new-terminal', label: '新建终端', group: '终端', icon: '➕', action: () => showToast('新建终端') },
  { id: 'debug', label: '启动调试', group: '终端', shortcut: 'F5', icon: '🐛', action: () => showToast('启动调试') },
]

// ==================== 状态 ====================
const isOpen = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const recentIds = reactive<string[]>([])

// ==================== 模糊搜索 ====================
function fuzzyMatch(text: string, query: string): { match: boolean; score: number; indices: number[] } {
  if (!query) {
    return { match: true, score: 0, indices: [] }
  }
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const indices: number[] = []
  let qi = 0
  let score = 0

  for (let ti = 0; ti < lowerText.length && qi < lowerQuery.length; ti++) {
    if (lowerText[ti] === lowerQuery[qi]) {
      indices.push(ti)
      score += ti === 0 || lowerText[ti - 1] === ' ' ? 10 : 1
      qi++
    }
  }

  return { match: qi === lowerQuery.length, score, indices }
}

const filteredCommands = computed(() => {
  const q = searchQuery.value.trim()
  const results: { cmd: Command; score: number; indices: number[] }[] = []

  for (const cmd of commands) {
    const m = fuzzyMatch(cmd.label, q)
    if (m.match) {
      // Boost recent commands
      const recentBoost = recentIds.includes(cmd.id) ? 100 : 0
      results.push({ cmd, score: m.score + recentBoost, indices: m.indices })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results
})

// Group filtered results
const groupedResults = computed(() => {
  const groups: Record<string, { cmd: Command; indices: number[] }[]> = {}
  for (const r of filteredCommands.value) {
    if (!groups[r.cmd.group]) {
      groups[r.cmd.group] = []
    }
    groups[r.cmd.group].push({ cmd: r.cmd, indices: r.indices })
  }
  return groups
})

const flatList = computed(() => filteredCommands.value.map((r) => r.cmd))

// ==================== 交互 ====================
function openPalette() {
  isOpen.value = true
  searchQuery.value = ''
  selectedIndex.value = 0
  nextTick(() => {
    inputRef.value?.focus()
    if (panelRef.value) {
      gsap.fromTo(
        panelRef.value,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' },
      )
    }
  })
}

function closePalette() {
  if (panelRef.value) {
    gsap.to(panelRef.value, {
      opacity: 0,
      y: -10,
      scale: 0.95,
      duration: 0.15,
      onComplete: () => {
        isOpen.value = false
      },
    })
  } else {
    isOpen.value = false
  }
}

function executeCommand(cmd: Command) {
  // Add to recent
  const idx = recentIds.indexOf(cmd.id)
  if (idx > -1) {
    recentIds.splice(idx, 1)
  }
  recentIds.unshift(cmd.id)
  if (recentIds.length > 5) {
    recentIds.pop()
  }

  cmd.action()
  closePalette()
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, flatList.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const cmd = flatList.value[selectedIndex.value]
    if (cmd) {
      executeCommand(cmd)
    }
  } else if (e.key === 'Escape') {
    closePalette()
  }
}

watch(searchQuery, () => {
  selectedIndex.value = 0
})

function handleGlobalKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
    e.preventDefault()
    if (isOpen.value) {
      closePalette()
    } else {
      openPalette()
    }
  }
}

// ==================== 高亮文字 ====================
function highlightText(text: string, indices: number[]): string {
  if (indices.length === 0) {
    return text
  }
  let result = ''
  for (let i = 0; i < text.length; i++) {
    if (indices.includes(i)) {
      result += `<span class="hl">${text[i]}</span>`
    } else {
      result += text[i]
    }
  }
  return result
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeyDown)
  // Auto open on mount for demo
  setTimeout(() => openPalette(), 500)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown)
})
</script>

<template>
  <div class="command-palette-wrapper">
    <!-- Background scene -->
    <div class="bg-scene">
      <div class="bg-title">
        <h1>⌨️ 命令面板</h1>
        <p>按 <kbd>Ctrl+Shift+P</kbd> 打开命令面板</p>
        <button class="open-btn" @click="openPalette">打开命令面板</button>
      </div>
    </div>

    <!-- Palette overlay -->
    <div v-if="isOpen" class="overlay" @click.self="closePalette">
      <div ref="panelRef" class="palette-panel">
        <!-- Search input -->
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            ref="inputRef"
            v-model="searchQuery"
            class="search-input"
            placeholder="输入命令名称..."
            @keydown="handleKeyDown"
          />
          <kbd class="esc-hint">ESC</kbd>
        </div>

        <!-- Results -->
        <div class="results">
          <template v-if="flatList.length === 0">
            <div class="no-results">没有匹配的命令</div>
          </template>
          <template v-else>
            <template v-for="(items, group) in groupedResults" :key="group">
              <div class="group-header">{{ group }}</div>
              <div
                v-for="item in items"
                :key="item.cmd.id"
                class="result-item"
                :class="{ selected: flatList[selectedIndex]?.id === item.cmd.id }"
                @click="executeCommand(item.cmd)"
                @mouseenter="selectedIndex = flatList.findIndex((c) => c.id === item.cmd.id)"
              >
                <span class="item-icon">{{ item.cmd.icon }}</span>
                <span class="item-label" v-html="highlightText(item.cmd.label, item.indices)"></span>
                <span v-if="recentIds.includes(item.cmd.id)" class="recent-badge">最近</span>
                <kbd v-if="item.cmd.shortcut" class="item-shortcut">{{ item.cmd.shortcut }}</kbd>
              </div>
            </template>
          </template>
        </div>

        <!-- Footer -->
        <div class="palette-footer">
          <span>↑↓ 导航</span>
          <span>↵ 执行</span>
          <span>esc 关闭</span>
          <span class="result-count">{{ flatList.length }} 个命令</span>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toastShow" class="toast">
      {{ toastMsg }}
    </div>
  </div>
</template>

<style scoped>
.command-palette-wrapper {
  width: 100vw;
  height: 100vh;
  background: #0b1120;
  position: relative;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

.bg-scene {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse at 30% 40%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 60%, rgba(139, 92, 246, 0.06) 0%, transparent 60%);
}

.bg-title {
  text-align: center;
}

.bg-title h1 {
  color: #e2e8f0;
  font-size: 32px;
  margin: 0 0 8px;
}

.bg-title p {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 20px;
}

.bg-title kbd {
  background: #1e293b;
  border: 1px solid #334155;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.open-btn {
  padding: 10px 28px;
  background: #3b82f6;
  border: none;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.open-btn:hover {
  background: #2563eb;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  padding-top: 15vh;
  z-index: 50;
}

.palette-panel {
  width: 560px;
  max-height: 480px;
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 12px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 10px;
  border-bottom: 1px solid #1e293b;
}

.search-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 15px;
  outline: none;
}

.search-input::placeholder {
  color: #475569;
}

.esc-hint {
  background: #1e293b;
  border: 1px solid #334155;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #64748b;
}

.results {
  flex: 1;
  overflow-y: auto;
  padding: 6px;
}

.group-header {
  color: #475569;
  font-size: 11px;
  padding: 8px 12px 4px;
  text-transform: uppercase;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s;
}

.result-item:hover,
.result-item.selected {
  background: #1e293b;
}

.item-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.item-label {
  flex: 1;
  color: #cbd5e1;
  font-size: 14px;
}

.item-label :deep(.hl) {
  color: #3b82f6;
  font-weight: bold;
}

.recent-badge {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
}

.item-shortcut {
  background: #1e293b;
  border: 1px solid #334155;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #64748b;
  flex-shrink: 0;
}

.no-results {
  text-align: center;
  color: #475569;
  padding: 24px;
  font-size: 14px;
}

.palette-footer {
  display: flex;
  gap: 16px;
  padding: 8px 16px;
  border-top: 1px solid #1e293b;
  color: #475569;
  font-size: 11px;
}

.result-count {
  margin-left: auto;
}

.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 60;
  animation: toast-in 0.3s ease;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>

