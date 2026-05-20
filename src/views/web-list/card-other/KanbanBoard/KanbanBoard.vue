<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 类型定义 ====================
type Priority = 'low' | 'medium' | 'high' | 'urgent'

interface Card {
  id: number
  title: string
  desc: string
  priority: Priority
  assignee: string
  avatar: string
  dueDate: string
  tags: string[]
}

interface Column {
  id: string
  title: string
  icon: string
  wipLimit: number
  cards: Card[]
}

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  low: { label: '低', color: '#64748b' },
  medium: { label: '中', color: '#3b82f6' },
  high: { label: '高', color: '#f59e0b' },
  urgent: { label: '紧急', color: '#ef4444' },
}

// ==================== 初始数据 ====================
let cardId = 100

const columns = reactive<Column[]>([
  {
    id: 'backlog',
    title: '待办',
    icon: '📋',
    wipLimit: 10,
    cards: [
      { id: 1, title: '设计AI客服对话流程', desc: '梳理多轮对话场景', priority: 'high', assignee: '张三', avatar: '👨‍💻', dueDate: '2025-06-15', tags: ['设计', 'AI'] },
      { id: 2, title: '编写API文档', desc: 'RESTful API接口文档', priority: 'medium', assignee: '李四', avatar: '👩‍💼', dueDate: '2025-06-20', tags: ['文档'] },
      { id: 3, title: '数据库迁移方案', desc: '从MySQL迁移到PostgreSQL', priority: 'low', assignee: '王五', avatar: '🧑‍🔬', dueDate: '2025-07-01', tags: ['后端'] },
    ],
  },
  {
    id: 'doing',
    title: '进行中',
    icon: '🔧',
    wipLimit: 3,
    cards: [
      { id: 4, title: '实现NLP意图识别', desc: '基于BERT的意图分类模型', priority: 'urgent', assignee: '张三', avatar: '👨‍💻', dueDate: '2025-06-10', tags: ['AI', '开发'] },
      { id: 5, title: '前端Dashboard开发', desc: '数据可视化仪表盘', priority: 'high', assignee: '赵六', avatar: '👨‍🎨', dueDate: '2025-06-12', tags: ['前端'] },
    ],
  },
  {
    id: 'review',
    title: '审核中',
    icon: '🔍',
    wipLimit: 3,
    cards: [
      { id: 6, title: '用户认证模块', desc: 'JWT + OAuth2.0', priority: 'medium', assignee: '李四', avatar: '👩‍💼', dueDate: '2025-06-08', tags: ['后端', '安全'] },
    ],
  },
  {
    id: 'done',
    title: '已完成',
    icon: '✅',
    wipLimit: 0,
    cards: [
      { id: 7, title: '项目初始化', desc: 'Monorepo + CI/CD配置', priority: 'high', assignee: '王五', avatar: '🧑‍🔬', dueDate: '2025-05-30', tags: ['运维'] },
      { id: 8, title: '需求评审', desc: '第一阶段需求确认', priority: 'medium', assignee: '张三', avatar: '👨‍💻', dueDate: '2025-05-25', tags: ['管理'] },
    ],
  },
])

// ==================== 拖拽状态 ====================
const draggingCard = ref<Card | null>(null)
const draggingFromCol = ref<string | null>(null)
const dragOverCol = ref<string | null>(null)
const dragOverIdx = ref(-1)

// ==================== 新建卡片 ====================
const showAddForm = ref(false)
const addToColumn = ref('')
const newCardTitle = ref('')

function openAddForm(colId: string) {
  addToColumn.value = colId
  newCardTitle.value = ''
  showAddForm.value = true
}

function submitNewCard() {
  if (!newCardTitle.value.trim()) {
    return
  }
  const col = columns.find((c) => c.id === addToColumn.value)
  if (!col) {
    return
  }
  col.cards.push({
    id: cardId++,
    title: newCardTitle.value.trim(),
    desc: '',
    priority: 'medium',
    assignee: '未分配',
    avatar: '👤',
    dueDate: '',
    tags: [],
  })
  showAddForm.value = false
}

// ==================== 拖拽处理 ====================
function handleDragStart(e: DragEvent, card: Card, colId: string) {
  draggingCard.value = card
  draggingFromCol.value = colId
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
  }
}

function handleDragOver(e: DragEvent, colId: string, idx: number) {
  e.preventDefault()
  dragOverCol.value = colId
  dragOverIdx.value = idx
}

function handleDragOverCol(e: DragEvent, colId: string) {
  e.preventDefault()
  dragOverCol.value = colId
}

function handleDrop(e: DragEvent, targetColId: string, targetIdx: number) {
  e.preventDefault()
  if (!draggingCard.value || !draggingFromCol.value) {
    return
  }

  const sourceCol = columns.find((c) => c.id === draggingFromCol.value)
  const targetCol = columns.find((c) => c.id === targetColId)
  if (!sourceCol || !targetCol) {
    return
  }

  // Check WIP limit
  if (targetCol.wipLimit > 0 && targetCol.cards.length >= targetCol.wipLimit && targetColId !== draggingFromCol.value) {
    dragOverCol.value = null
    dragOverIdx.value = -1
    draggingCard.value = null
    draggingFromCol.value = null
    return
  }

  // Remove from source
  const srcIdx = sourceCol.cards.findIndex((c) => c.id === draggingCard.value!.id)
  if (srcIdx > -1) {
    sourceCol.cards.splice(srcIdx, 1)
  }

  // Insert to target
  const insertIdx = Math.min(targetIdx, targetCol.cards.length)
  targetCol.cards.splice(insertIdx, 0, draggingCard.value)

  // Reset
  dragOverCol.value = null
  dragOverIdx.value = -1
  draggingCard.value = null
  draggingFromCol.value = null
}

function handleDropOnCol(e: DragEvent, colId: string) {
  const col = columns.find((c) => c.id === colId)
  if (col) {
    handleDrop(e, colId, col.cards.length)
  }
}

function handleDragEnd() {
  dragOverCol.value = null
  dragOverIdx.value = -1
  draggingCard.value = null
  draggingFromCol.value = null
}

function isOverWip(col: Column): boolean {
  return col.wipLimit > 0 && col.cards.length >= col.wipLimit
}

// ==================== 日期格式化 ====================
function isOverdue(date: string): boolean {
  if (!date) {
    return false
  }
  return new Date(date) < new Date()
}

onMounted(() => {
  gsap.fromTo(
    '.kanban-col',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' },
  )
})
</script>

<template>
  <div class="kanban-board">
    <div class="top-bar">
      <h2>📌 任务看板</h2>
      <div class="board-stats">
        <span v-for="col in columns" :key="col.id" class="col-stat">
          {{ col.icon }} {{ col.cards.length }}
        </span>
      </div>
    </div>

    <div class="board-body">
      <div
        v-for="col in columns"
        :key="col.id"
        class="kanban-col"
        :class="{ 'over-wip': isOverWip(col), 'drag-target': dragOverCol === col.id }"
        @dragover="handleDragOverCol($event, col.id)"
        @drop="handleDropOnCol($event, col.id)"
      >
        <!-- Column header -->
        <div class="col-header">
          <div class="col-title">
            <span>{{ col.icon }} {{ col.title }}</span>
            <span class="col-count" :class="{ warn: isOverWip(col) }">
              {{ col.cards.length }}{{ col.wipLimit ? `/${col.wipLimit}` : '' }}
            </span>
          </div>
          <button class="add-btn" @click="openAddForm(col.id)">＋</button>
        </div>

        <!-- Cards -->
        <div class="col-cards">
          <div
            v-for="(card, idx) in col.cards"
            :key="card.id"
            class="kanban-card"
            :class="{ dragging: draggingCard?.id === card.id, 'drag-before': dragOverCol === col.id && dragOverIdx === idx }"
            draggable="true"
            @dragstart="handleDragStart($event, card, col.id)"
            @dragover="handleDragOver($event, col.id, idx)"
            @dragend="handleDragEnd"
          >
            <!-- Tags -->
            <div v-if="card.tags.length" class="card-tags">
              <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>

            <!-- Title -->
            <div class="card-title">{{ card.title }}</div>
            <div v-if="card.desc" class="card-desc">{{ card.desc }}</div>

            <!-- Footer -->
            <div class="card-footer">
              <div class="card-assignee">
                <span class="assignee-avatar">{{ card.avatar }}</span>
                <span class="assignee-name">{{ card.assignee }}</span>
              </div>
              <div class="card-meta">
                <span
                  class="card-priority"
                  :style="{ color: priorityConfig[card.priority].color }"
                >
                  {{ priorityConfig[card.priority].label }}
                </span>
                <span
                  v-if="card.dueDate"
                  class="card-due"
                  :class="{ overdue: isOverdue(card.dueDate) }"
                >
                  {{ card.dueDate }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add card modal -->
    <div v-if="showAddForm" class="modal-overlay" @click.self="showAddForm = false">
      <div class="add-modal">
        <h3>新建任务</h3>
        <input
          v-model="newCardTitle"
          class="modal-input"
          placeholder="输入任务标题..."
          autofocus
          @keyup.enter="submitNewCard"
        />
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showAddForm = false">取消</button>
          <button class="modal-btn submit" @click="submitNewCard">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-board {
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
  padding: 12px 24px;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}

.top-bar h2 {
  color: #e2e8f0;
  font-size: 18px;
  margin: 0;
}

.board-stats {
  display: flex;
  gap: 16px;
  color: #64748b;
  font-size: 13px;
}

.board-body {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 16px;
  overflow-x: auto;
}

.kanban-col {
  min-width: 280px;
  max-width: 320px;
  flex: 1;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s;
}

.kanban-col.drag-target {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.03);
}

.kanban-col.over-wip {
  border-color: rgba(239, 68, 68, 0.3);
}

.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid #1e293b;
}

.col-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
}

.col-count {
  background: #1e293b;
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
  color: #64748b;
  font-weight: normal;
}

.col-count.warn {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.add-btn {
  width: 26px;
  height: 26px;
  background: transparent;
  border: 1px solid #334155;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.add-btn:hover {
  background: #1e293b;
  color: #e2e8f0;
}

.col-cards {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kanban-card {
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: grab;
  transition: all 0.15s;
}

.kanban-card:hover {
  border-color: #334155;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.kanban-card.dragging {
  opacity: 0.4;
}

.kanban-card.drag-before {
  border-top: 2px solid #3b82f6;
}

.kanban-card:active {
  cursor: grabbing;
}

.card-tags {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
}

.card-title {
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.card-desc {
  color: #64748b;
  font-size: 11px;
  margin-bottom: 8px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-assignee {
  display: flex;
  align-items: center;
  gap: 4px;
}

.assignee-avatar {
  font-size: 14px;
}

.assignee-name {
  color: #94a3b8;
  font-size: 11px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-priority {
  font-size: 10px;
  font-weight: bold;
}

.card-due {
  color: #475569;
  font-size: 10px;
}

.card-due.overdue {
  color: #ef4444;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.add-modal {
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 24px;
  width: 360px;
}

.add-modal h3 {
  color: #e2e8f0;
  font-size: 16px;
  margin: 0 0 14px;
}

.modal-input {
  width: 100%;
  background: #0f172a;
  border: 1px solid #334155;
  color: #e2e8f0;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 14px;
}

.modal-input:focus {
  border-color: #3b82f6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-btn {
  padding: 6px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.modal-btn.cancel {
  background: transparent;
  border: 1px solid #334155;
  color: #94a3b8;
}

.modal-btn.submit {
  background: #3b82f6;
  border: none;
  color: #fff;
}

.modal-btn.submit:hover {
  background: #2563eb;
}
</style>

