<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

// ==================== Diff 算法 (LCS-based) ====================
interface DiffLine {
  type: 'same' | 'add' | 'remove'
  content: string
  oldLineNum: number | null
  newLineNum: number | null
}

function computeDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const m = oldLines.length
  const n = newLines.length

  // LCS DP table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to get diff
  const result: DiffLine[] = []
  let i = m
  let j = n

  const temp: DiffLine[] = []
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      temp.push({ type: 'same', content: oldLines[i - 1], oldLineNum: i, newLineNum: j })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.push({ type: 'add', content: newLines[j - 1], oldLineNum: null, newLineNum: j })
      j--
    } else {
      temp.push({ type: 'remove', content: oldLines[i - 1], oldLineNum: i, newLineNum: null })
      i--
    }
  }

  temp.reverse()
  return temp
}

// ==================== 简单语法高亮 ====================
function highlightSyntax(line: string): string {
  return line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Keywords
    .replace(
      /\b(const|let|var|function|return|if|else|for|while|import|export|from|class|new|this|async|await|try|catch)\b/g,
      '<span class="kw">$1</span>',
    )
    // Strings
    .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, '<span class="str">$1</span>')
    // Comments
    .replace(/(\/\/.*$)/gm, '<span class="cmt">$1</span>')
    // Numbers
    .replace(/\b(\d+)\b/g, '<span class="num">$1</span>')
}

// ==================== 状态 ====================
const viewMode = ref<'side' | 'inline'>('side')
const showUnchanged = ref(true)

const oldCode = ref(`import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <div className="counter">
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>
        Increment
      </button>
    </div>
  )
}

export default Counter`)

const newCode = ref(`import { useState, useCallback } from 'react'

function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount)

  const handleClick = useCallback(() => {
    setCount(prev => prev + 1)
  }, [])

  const handleReset = useCallback(() => {
    setCount(initialCount)
  }, [initialCount])

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <div className="buttons">
        <button onClick={handleClick}>
          Increment
        </button>
        <button onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default Counter`)

const diffResult = computed(() => computeDiff(oldCode.value, newCode.value))

const stats = computed(() => {
  let added = 0
  let removed = 0
  let same = 0
  diffResult.value.forEach((d) => {
    if (d.type === 'add') {
      added++
    } else if (d.type === 'remove') {
      removed++
    } else {
      same++
    }
  })
  return { added, removed, same }
})

// Collapsed regions for unchanged lines
const filteredDiff = computed(() => {
  if (showUnchanged.value) {
    return diffResult.value
  }
  const result: (DiffLine | { type: 'collapsed'; count: number })[] = []
  let unchangedCount = 0
  diffResult.value.forEach((line, idx) => {
    if (line.type === 'same') {
      unchangedCount++
    } else {
      if (unchangedCount > 3) {
        result.push({ type: 'collapsed', count: unchangedCount - 2 })
      }
      unchangedCount = 0
      result.push(line)
    }
  })
  return result
})

onMounted(() => {
  gsap.fromTo('.code-diff-viewer', { opacity: 0 }, { opacity: 1, duration: 0.4 })
})
</script>

<template>
  <div class="code-diff-viewer">
    <div class="top-bar">
      <h2>📝 代码差异对比器</h2>
      <div class="top-controls">
        <div class="view-toggle">
          <button class="vt-btn" :class="{ active: viewMode === 'side' }" @click="viewMode = 'side'">并排</button>
          <button class="vt-btn" :class="{ active: viewMode === 'inline' }" @click="viewMode = 'inline'">行内</button>
        </div>
        <label class="unchanged-toggle">
          <input v-model="showUnchanged" type="checkbox" />
          <span>显示未更改</span>
        </label>
        <div class="diff-stats">
          <span class="stat-add">+{{ stats.added }}</span>
          <span class="stat-del">-{{ stats.removed }}</span>
          <span class="stat-same">={{ stats.same }}</span>
        </div>
      </div>
    </div>

    <div class="editor-row">
      <div class="editor-col">
        <div class="editor-label">旧代码</div>
        <textarea v-model="oldCode" class="code-input" spellcheck="false"></textarea>
      </div>
      <div class="editor-col">
        <div class="editor-label">新代码</div>
        <textarea v-model="newCode" class="code-input" spellcheck="false"></textarea>
      </div>
    </div>

    <!-- Diff view -->
    <div class="diff-area">
      <!-- Side by side -->
      <template v-if="viewMode === 'side'">
        <div class="side-view">
          <div class="side-col old-col">
            <div
              v-for="(line, idx) in diffResult"
              :key="'old' + idx"
              class="diff-line"
              :class="{ remove: line.type === 'remove', same: line.type === 'same', empty: line.type === 'add' }"
            >
              <span class="line-num">{{ line.oldLineNum || '' }}</span>
              <span class="line-sign">{{ line.type === 'remove' ? '-' : ' ' }}</span>
              <span
                class="line-code"
                v-html="line.type !== 'add' ? highlightSyntax(line.content) : ''"
              ></span>
            </div>
          </div>
          <div class="side-col new-col">
            <div
              v-for="(line, idx) in diffResult"
              :key="'new' + idx"
              class="diff-line"
              :class="{ add: line.type === 'add', same: line.type === 'same', empty: line.type === 'remove' }"
            >
              <span class="line-num">{{ line.newLineNum || '' }}</span>
              <span class="line-sign">{{ line.type === 'add' ? '+' : ' ' }}</span>
              <span
                class="line-code"
                v-html="line.type !== 'remove' ? highlightSyntax(line.content) : ''"
              ></span>
            </div>
          </div>
        </div>
      </template>

      <!-- Inline -->
      <template v-else>
        <div class="inline-view">
          <div
            v-for="(line, idx) in diffResult"
            :key="'in' + idx"
            class="diff-line"
            :class="{ add: line.type === 'add', remove: line.type === 'remove', same: line.type === 'same' }"
          >
            <span class="line-num old-num">{{ line.oldLineNum || '' }}</span>
            <span class="line-num new-num">{{ line.newLineNum || '' }}</span>
            <span class="line-sign">{{ line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' ' }}</span>
            <span class="line-code" v-html="highlightSyntax(line.content)"></span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.code-diff-viewer {
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

.top-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-toggle {
  display: flex;
  gap: 2px;
}

.vt-btn {
  padding: 4px 14px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.vt-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.unchanged-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;
}

.diff-stats {
  display: flex;
  gap: 10px;
  font-size: 13px;
  font-family: 'Consolas', monospace;
}

.stat-add {
  color: #4ade80;
}

.stat-del {
  color: #f87171;
}

.stat-same {
  color: #64748b;
}

.editor-row {
  display: flex;
  flex-shrink: 0;
  height: 120px;
  border-bottom: 1px solid #1e293b;
}

.editor-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.editor-col + .editor-col {
  border-left: 1px solid #1e293b;
}

.editor-label {
  color: #475569;
  font-size: 11px;
  padding: 4px 12px;
  border-bottom: 1px solid #1e293b;
}

.code-input {
  flex: 1;
  background: #0f172a;
  color: #cbd5e1;
  border: none;
  padding: 8px 12px;
  font-family: 'Consolas', monospace;
  font-size: 12px;
  line-height: 1.5;
  resize: none;
  outline: none;
}

.diff-area {
  flex: 1;
  overflow: auto;
}

.side-view {
  display: flex;
  min-height: 100%;
}

.side-col {
  flex: 1;
  overflow: visible;
}

.side-col + .side-col {
  border-left: 1px solid #1e293b;
}

.diff-line {
  display: flex;
  font-family: 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.7;
  padding: 0 8px;
  min-height: 22px;
}

.diff-line.add {
  background: rgba(74, 222, 128, 0.08);
}

.diff-line.remove {
  background: rgba(248, 113, 113, 0.08);
}

.diff-line.empty {
  background: rgba(30, 41, 59, 0.3);
}

.line-num {
  width: 36px;
  text-align: right;
  padding-right: 8px;
  color: #334155;
  flex-shrink: 0;
  user-select: none;
}

.line-sign {
  width: 16px;
  text-align: center;
  flex-shrink: 0;
  font-weight: bold;
}

.add .line-sign {
  color: #4ade80;
}

.remove .line-sign {
  color: #f87171;
}

.same .line-sign {
  color: #334155;
}

.line-code {
  flex: 1;
  white-space: pre;
  color: #cbd5e1;
}

.inline-view {
  min-height: 100%;
}

.inline-view .old-num {
  width: 36px;
}

.inline-view .new-num {
  width: 36px;
}

/* Syntax highlight classes */
.line-code :deep(.kw) {
  color: #c084fc;
}

.line-code :deep(.str) {
  color: #a5f3fc;
}

.line-code :deep(.cmt) {
  color: #475569;
  font-style: italic;
}

.line-code :deep(.num) {
  color: #fbbf24;
}
</style>

