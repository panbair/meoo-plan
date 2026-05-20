<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { gsap } from 'gsap'

// ==================== Markdown 解析 ====================
function parseMd(md: string): string {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
      return `<pre class="code-block"><code class="lang-${lang}">${escapeHtml(code.trim())}</code></pre>`
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
    // Headers
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Blockquote
    .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    // HR
    .replace(/^---$/gm, '<hr />')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" style="max-width:100%"/>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Unordered list
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    // Ordered list
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // Paragraphs (simple: wrap non-tag lines)
    .replace(/^(?!<[a-z/])(.*\S.*)$/gm, '<p>$1</p>')

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)+/g, (match) => `<ul>${match}</ul>`)

  return html
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ==================== 工具栏操作 ====================
const toolbarActions = [
  { icon: 'H1', label: '标题1', insert: '# ' },
  { icon: 'H2', label: '标题2', insert: '## ' },
  { icon: 'B', label: '粗体', wrap: '**' },
  { icon: 'I', label: '斜体', wrap: '*' },
  { icon: '~', label: '删除线', wrap: '~~' },
  { icon: '``', label: '行内代码', wrap: '`' },
  { icon: '[]', label: '链接', insert: '[文字](url)' },
  { icon: '📷', label: '图片', insert: '![描述](url)' },
  { icon: '—', label: '分隔线', insert: '\n---\n' },
  { icon: '•', label: '无序列表', insert: '- ' },
  { icon: '1.', label: '有序列表', insert: '1. ' },
  { icon: '>', label: '引用', insert: '> ' },
  { icon: '```', label: '代码块', insert: '```js\n\n```' },
]

// ==================== 状态 ====================
const editorRef = ref<HTMLTextAreaElement | null>(null)
const previewRef = ref<HTMLElement | null>(null)

const defaultMd = `# Markdown 实时编辑器

欢迎使用 **Markdown 实时编辑器**！这是一个功能丰富的编辑器组件。

## 功能特性

- ✏️ 实时编辑与预览
- 🎨 语法高亮代码块
- 📊 支持表格、列表、引用
- 🔗 链接与图片插入

## 代码示例

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`)
  return { message: 'Welcome to AI Platform' }
}

greet('Developer')
\`\`\`

## 引用

> 技术改变世界，AI 赋能未来。

## 列表

1. 智能客服系统
2. 数据分析平台
3. 自动化办公引擎

---

*由深圳未来AI科技提供技术支持*`

const content = ref(defaultMd)
const syncScroll = ref(true)
const previewHtml = computed(() => parseMd(content.value))

// ==================== 工具栏插入 ====================
function insertText(action: (typeof toolbarActions)[0]) {
  if (!editorRef.value) {
    return
  }
  const el = editorRef.value
  const start = el.selectionStart
  const end = el.selectionEnd
  const text = content.value

  if ('wrap' in action && action.wrap) {
    const selected = text.substring(start, end) || '文字'
    const newText = text.substring(0, start) + action.wrap + selected + action.wrap + text.substring(end)
    content.value = newText
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + action.wrap!.length, start + action.wrap!.length + selected.length)
    }, 0)
  } else if ('insert' in action && action.insert) {
    const newText = text.substring(0, start) + action.insert + text.substring(end)
    content.value = newText
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + action.insert!.length, start + action.insert!.length)
    }, 0)
  }
}

// ==================== 同步滚动 ====================
function handleEditorScroll() {
  if (!syncScroll.value || !editorRef.value || !previewRef.value) {
    return
  }
  const ratio = editorRef.value.scrollTop / (editorRef.value.scrollHeight - editorRef.value.clientHeight || 1)
  previewRef.value.scrollTop = ratio * (previewRef.value.scrollHeight - previewRef.value.clientHeight)
}

// ==================== 统计 ====================
const stats = computed(() => {
  const chars = content.value.length
  const words = content.value.trim().split(/\s+/).filter(Boolean).length
  const lines = content.value.split('\n').length
  return { chars, words, lines }
})

onMounted(() => {
  gsap.fromTo('.editor-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
})
</script>

<template>
  <div class="markdown-live-editor">
    <div class="top-bar">
      <h2>📝 Markdown 实时编辑器</h2>
      <div class="top-actions">
        <label class="sync-toggle">
          <input v-model="syncScroll" type="checkbox" />
          <span>同步滚动</span>
        </label>
        <span class="stat">{{ stats.lines }} 行 · {{ stats.words }} 词 · {{ stats.chars }} 字</span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <button
        v-for="(a, i) in toolbarActions"
        :key="i"
        class="tb-btn"
        :title="a.label"
        @click="insertText(a)"
      >
        {{ a.icon }}
      </button>
    </div>

    <!-- Editor + Preview -->
    <div class="editor-container">
      <div class="pane editor-pane">
        <div class="pane-header">编辑</div>
        <textarea
          ref="editorRef"
          v-model="content"
          class="editor-textarea"
          spellcheck="false"
          @scroll="handleEditorScroll"
        ></textarea>
      </div>

      <div class="divider"></div>

      <div class="pane preview-pane">
        <div class="pane-header">预览</div>
        <div ref="previewRef" class="preview-content" v-html="previewHtml"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown-live-editor {
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

.top-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sync-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
}

.stat {
  color: #475569;
  font-size: 12px;
}

.toolbar {
  display: flex;
  gap: 2px;
  padding: 6px 20px;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.tb-btn {
  padding: 4px 10px;
  background: transparent;
  border: 1px solid transparent;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-family: 'Consolas', monospace;
  transition: all 0.15s;
}

.tb-btn:hover {
  background: #1e293b;
  color: #e2e8f0;
  border-color: #334155;
}

.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pane-header {
  padding: 6px 16px;
  color: #475569;
  font-size: 11px;
  text-transform: uppercase;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}

.divider {
  width: 1px;
  background: #1e293b;
  flex-shrink: 0;
}

.editor-textarea {
  flex: 1;
  background: #0f172a;
  color: #e2e8f0;
  border: none;
  padding: 16px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.7;
  resize: none;
  outline: none;
  overflow-y: auto;
  tab-size: 2;
}

.preview-content {
  flex: 1;
  padding: 16px 24px;
  overflow-y: auto;
  color: #cbd5e1;
  font-size: 15px;
  line-height: 1.8;
}

/* Preview styles */
.preview-content :deep(h1) {
  color: #e2e8f0;
  font-size: 28px;
  border-bottom: 1px solid #1e293b;
  padding-bottom: 8px;
  margin: 20px 0 12px;
}

.preview-content :deep(h2) {
  color: #e2e8f0;
  font-size: 22px;
  margin: 18px 0 10px;
}

.preview-content :deep(h3) {
  color: #e2e8f0;
  font-size: 18px;
  margin: 14px 0 8px;
}

.preview-content :deep(p) {
  margin: 8px 0;
}

.preview-content :deep(strong) {
  color: #f1f5f9;
}

.preview-content :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.preview-content :deep(a:hover) {
  text-decoration: underline;
}

.preview-content :deep(blockquote) {
  border-left: 3px solid #3b82f6;
  padding: 8px 16px;
  margin: 10px 0;
  color: #94a3b8;
  background: rgba(59, 130, 246, 0.06);
  border-radius: 0 6px 6px 0;
}

.preview-content :deep(hr) {
  border: none;
  border-top: 1px solid #1e293b;
  margin: 16px 0;
}

.preview-content :deep(ul) {
  padding-left: 20px;
  margin: 8px 0;
}

.preview-content :deep(li) {
  margin: 4px 0;
}

.preview-content :deep(.code-block) {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 14px 18px;
  overflow-x: auto;
  margin: 10px 0;
}

.preview-content :deep(.code-block code) {
  font-family: 'Consolas', monospace;
  font-size: 13px;
  color: #a5f3fc;
  line-height: 1.6;
}

.preview-content :deep(.inline-code) {
  background: #1e293b;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 13px;
  color: #f472b6;
}

.preview-content :deep(del) {
  color: #64748b;
}
</style>

