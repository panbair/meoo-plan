<template>
  <div v-if="visible" class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>📚 我的收藏集</h2>
        <button class="modal-close-btn" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <div v-if="collections.length === 0" class="empty-collections">
          <div class="empty-icon">📭</div>
          <p>暂无收藏集</p>
          <p class="empty-hint">选中组件后点击"保存到数据库"创建收藏集</p>
        </div>
        <div v-else class="collections-list">
          <div
            v-for="collection in collections"
            :key="collection.id"
            class="collection-item"
            title="点击加载此收藏集"
            @click="handleLoad(collection)"
          >
            <div class="collection-info">
              <h3 class="collection-name">{{ collection.name }}</h3>
              <p class="collection-meta">
                <span class="collection-count">
                  {{ getComponentCount(collection.data) }} 个组件
                </span>
                <span class="collection-date">{{ formatDate(collection.createdAt) }}</span>
                <span class="collection-id">ID: {{ collection.id }}</span>
              </p>
            </div>
            <div class="collection-actions">
              <button
                class="action-btn copy-btn"
                title="复制收藏集数据"
                @click.stop="handleCopy(collection)"
              >
                复制
              </button>
              <button
                class="action-btn load-btn"
                title="加载此收藏集"
                @click.stop="handleLoad(collection)"
              >
                加载
              </button>
              <button
                class="action-btn delete-btn"
                title="删除此收藏集"
                @click.stop="handleDelete(collection.id)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props
interface Props {
  visible: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'load', selections: string[]): void
  (e: 'delete'): void
}>()

// 数据类型
interface Collection {
  id: number
  name: string
  data: string
  createdAt: string
}

// 收藏集列表
const collections = ref<Collection[]>([])

// IndexedDB 数据库初始化
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AnimationGalleryDB', 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('collections')) {
        const store = db.createObjectStore('collections', { keyPath: 'id', autoIncrement: true })
        store.createIndex('name', 'name', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }
  })
}

// 加载所有收藏集
const loadCollections = async () => {
  try {
    const db = await initDB()
    const transaction = db.transaction('collections', 'readonly')
    const store = transaction.objectStore('collections')
    const request = store.getAll()

    request.onsuccess = () => {
      collections.value = request.result as Collection[]
      db.close()
    }

    request.onerror = () => {
      console.error('[IndexedDB] 加载收藏集失败:', request.error)
      db.close()
    }
  } catch (error) {
    console.error('[IndexedDB] 加载收藏集失败:', error)
  }
}

// 获取组件数量
const getComponentCount = (data: string): number => {
  try {
    const selections = JSON.parse(data)
    return Array.isArray(selections) ? selections.length : 0
  } catch {
    return 0
  }
}

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 关闭弹窗
const handleClose = () => {
  emit('close')
}

// 加载收藏集
const handleLoad = (collection: Collection) => {
  const selections = JSON.parse(collection.data)
  console.log(selections)
  emit('load', selections)
}

// 复制收藏集数据
const handleCopy = async (collection: Collection) => {
  try {
    // 尝试解析 data 字段
    let data
    try {
      data = JSON.parse(collection.data)
    } catch {
      // 如果解析失败，使用原始字符串
      data = collection.data
    }

    // 如果是数组，提取组件名称用逗号分隔
    let copyText = ''
    if (Array.isArray(data)) {
      copyText = data.join(',')
    } else {
      // 如果不是数组，尝试提取 name 字段或直接使用数据
      copyText = typeof data === 'object' ? JSON.stringify(data) : String(data)
    }

    console.log('[Clipboard] 准备复制的内容:', copyText)
    console.log('[Clipboard] 复制数据长度:', copyText.length)

    // 方法1: 使用 Clipboard API (现代浏览器)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(copyText)
        const componentCount = Array.isArray(data) ? data.length : '未知'
        alert(`✅ 已复制收藏集：${collection.name}\n共 ${componentCount} 个组件`)
        return
      } catch (clipboardErr) {
        console.error('[Clipboard API] 失败:', clipboardErr)
        // 继续尝试方法2
      }
    }

    // 方法2: 使用 execCommand (兼容旧浏览器)
    const textArea = document.createElement('textarea')
    textArea.value = copyText
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand('copy')
      if (successful) {
        const componentCount = Array.isArray(data) ? data.length : '未知'
        alert(`✅ 已复制收藏集：${collection.name}\n共 ${componentCount} 个组件`)
      } else {
        throw new Error('execCommand failed')
      }
    } catch (err) {
      console.error('[execCommand] 复制失败:', err)
      alert('❌ 复制失败，请手动复制')
    } finally {
      document.body.removeChild(textArea)
    }
  } catch (error) {
    console.error('[Clipboard] 整体复制失败:', error)
    alert('❌ 复制失败，请手动复制')
  }
}

// 删除收藏集
const handleDelete = async (id: number) => {
  if (!confirm('确定要删除这个收藏集吗？')) {
    return
  }

  try {
    const db = await initDB()
    const transaction = db.transaction('collections', 'readwrite')
    const store = transaction.objectStore('collections')
    const request = store.delete(id)

    request.onsuccess = () => {
      alert('✅ 删除成功')
      db.close()
      emit('delete')
    }

    request.onerror = () => {
      alert(`❌ 删除失败：${request.error?.message}`)
      db.close()
    }
  } catch (error) {
    console.error('[IndexedDB] 删除收藏集失败:', error)
    alert(`❌ 删除失败：${error}`)
  }
}

// 监听弹窗打开，加载收藏集列表
const onVisibleChange = () => {
  if (props.visible) {
    loadCollections()
  }
}

// 监听 visible 变化
import { watch } from 'vue'
watch(() => props.visible, onVisibleChange)
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 28px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  line-height: 1;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    transform: rotate(90deg);
  }
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.empty-collections {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-collections .empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-collections p {
  font-size: 16px;
  margin: 10px 0;
}

.empty-hint {
  font-size: 13px !important;
  color: #64748b !important;
}

.collections-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.collection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(167, 139, 250, 0.3);
    transform: translateX(4px);
    box-shadow: 0 4px 15px rgba(167, 139, 250, 0.2);
  }

  &:active {
    transform: translateX(2px);
  }
}

.collection-info {
  flex: 1;
  min-width: 0;
}

.collection-name {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 8px 0;
  word-break: break-word;
}

.collection-meta {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.collection-count {
  color: #22c55e;
  font-weight: 600;
}

.collection-date {
  color: #60a5fa;
}

.collection-id {
  color: #a78bfa;
  font-family: monospace;
}

.collection-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
}

.action-btn.load-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;

  &:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
}

.action-btn.delete-btn {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
}

.action-btn.copy-btn {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);

  &:hover {
    background: rgba(245, 158, 11, 0.3);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }
}
</style>
