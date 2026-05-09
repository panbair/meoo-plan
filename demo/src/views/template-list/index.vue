<template>
  <div class="project-list-container">
    <!-- 页面头部 -->
    <div class="header">
      <div class="header-content">
        <h1 class="title">
          <el-icon class="title-icon"><FolderOpened /></el-icon>
          我的项目
        </h1>
        <div class="header-actions">
          <el-button type="primary" class="btn-create" @click="goToComponent">
            <el-icon><Plus /></el-icon>
            创建组件
          </el-button>

          <el-button type="primary" class="btn-create" @click="goToCreate">
            <el-icon><Plus /></el-icon>
            创建新项目
          </el-button>
          <el-button :loading="loading" class="btn-refresh" @click="refreshList">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
    </div>

    <!-- 项目列表 -->
    <div class="content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 空状态 -->
      <el-empty
        v-else-if="projectList.length === 0"
        description="暂无项目，点击下方按钮创建第一个项目吧"
      >
        <el-button type="primary" @click="goToCreate">创建项目</el-button>
      </el-empty>

      <!-- 项目列表卡片 -->
      <div v-else class="project-grid">
        <div
          v-for="project in projectList"
          :key="project.id"
          class="project-card"
          @click="viewProject(project)"
        >
          <!-- 项目预览图 -->
          <div class="card-preview">
            <div class="preview-placeholder">
              <el-icon class="preview-icon"><Picture /></el-icon>
              <span class="preview-text">{{ project.templateView || '默认模板' }}</span>
            </div>
          </div>

          <!-- 项目信息 -->
          <div class="card-info">
            <h3 class="project-name" :title="project.projectName || project.name">
              {{ project.projectName || project.name || '未命名项目' }}
            </h3>
            <div class="project-meta">
              <div class="meta-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ formatDate(project.createTime) }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Document /></el-icon>
                <span>{{ getPageCount(project.list) }} 页</span>
              </div>
              <!--              复制-->
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions">
            <el-button
              type="primary"
              size="small"
              class="btn-edit"
              @click.stop="editProject(project)"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              type="success"
              size="small"
              class="btn-copy"
              @click.stop="handleCopy(project)"
            >
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
            <el-button
              type="danger"
              size="small"
              class="btn-delete"
              @click.stop="handleDelete(project)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认删除对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="delete-content">
        <el-icon class="warning-icon"><WarningFilled /></el-icon>
        <p>确定要删除项目 "{{ deleteTarget?.projectName || deleteTarget?.name }}" 吗？</p>
        <p class="warning-text">此操作不可恢复，请谨慎操作！</p>
      </div>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="deleting" @click="confirmDelete">确认删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  FolderOpened,
  Plus,
  Refresh,
  Picture,
  Calendar,
  Document,
  Edit,
  Delete,
  WarningFilled,
  CopyDocument
} from '@element-plus/icons-vue'
import IndexedDBHelper from '../template-view/compoments/indexDb'

const router = useRouter()

// 状态管理
const loading = ref(false)
const projectList = ref([])
const deleteDialogVisible = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

// IndexedDB 配置
const dbName = 'oiommAppDB'
const storeName = 'oioData'
let dbHelper = null

// 初始化数据库
const initDB = async () => {
  try {
    dbHelper = new IndexedDBHelper(dbName, 1)

    // 打开数据库并创建仓库
    await dbHelper.openDB([
      {
        name: storeName,
        keyPath: 'id',
        autoIncrement: true,
        indexes: [
          { name: 'list', keyPath: 'list', unique: true },
          { name: 'name', keyPath: 'name', unique: false },
          { name: 'templateView', keyPath: 'templateView', unique: false }
        ]
      }
    ])

    console.log('数据库初始化成功')
  } catch (error) {
    console.error('数据库初始化失败:', error)
    throw error
  }
}

// 获取项目列表
const loadProjectList = async () => {
  try {
    loading.value = true

    // 确保数据库已初始化
    if (!dbHelper || !dbHelper.isConnected()) {
      await initDB()
    }

    const data = await dbHelper.getAllData(storeName)
    projectList.value = data || []
    console.log('项目列表:', projectList.value)
  } catch (error) {
    console.error('获取项目列表失败:', error)
    ElMessage({
      message: '获取项目列表失败: ' + (error.message || '未知错误'),
      type: 'error',
      duration: 3000,
      showClose: true,
      offset: 100
    })
  } finally {
    loading.value = false
  }
}

// 刷新列表
const refreshList = () => {
  loadProjectList()
}

// 跳转到创建页面
const goToCreate = () => {
  router.push({
    path: '/template',
    query: {
      state: 'create'
    }
  })
}

const goToComponent = () => {
  router.push({
    path: '/web'
  })
}

// 查看项目
const viewProject = project => {
  router.push({
    path: '/template-view',
    query: {
      id: project.id,
      state: 'read',
      templateView: project.templateView
    }
  })
}

// 编辑项目
const editProject = project => {
  router.push({
    path: '/template-view',
    query: {
      state: 'edit',
      id: project.id
    }
  })
}

// 处理删除
const handleDelete = project => {
  deleteTarget.value = project
  deleteDialogVisible.value = true
}

// 确认删除
const confirmDelete = async () => {
  if (!deleteTarget.value) return

  try {
    deleting.value = true

    // 确保数据库已初始化
    if (!dbHelper || !dbHelper.isConnected()) {
      await initDB()
    }

    await dbHelper.deleteData(storeName, deleteTarget.value.id)

    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 2000
    })

    deleteDialogVisible.value = false
    deleteTarget.value = null

    // 刷新列表
    await loadProjectList()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage({
      message: '删除失败: ' + (error.message || '未知错误'),
      type: 'error',
      duration: 3000,
      showClose: true,
      offset: 100
    })
  } finally {
    deleting.value = false
  }
}

// 处理复制 - 兼容大多数浏览器
const handleCopy = async project => {
  // 将项目数据转换为格式化的 JSON 字符串
  const copyData = {
    id: project.id,
    projectName: project.projectName || project.name,
    templateView: project.templateView || '默认模板',
    createTime: project.createTime || '无',
    updateTime: project.updateTime || '无',
    list: project.list || '无'
  }

  const copyText = JSON.stringify(copyData, null, 2)

  try {
    // 优先使用现代 Clipboard API（支持 Chrome 66+, Firefox 63+, Safari 13.1+, Edge 79+）
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(copyText)
      ElMessage({
        message: '项目数据已复制到剪贴板',
        type: 'success',
        duration: 2000
      })
      return
    }

    // 回退到传统方法 - 使用 document.execCommand（支持所有浏览器）
    const textArea = document.createElement('textarea')
    textArea.value = copyText

    // 设置文本域样式，使其不可见
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '-9999px'
    textArea.style.opacity = '0'
    textArea.style.pointerEvents = 'none'

    // 添加到 DOM
    document.body.appendChild(textArea)

    // 选中文本
    textArea.focus()
    textArea.select()

    // 执行复制命令
    const successful = document.execCommand('copy')

    // 移除文本域
    document.body.removeChild(textArea)

    if (successful) {
      ElMessage({
        message: '项目数据已复制到剪贴板',
        type: 'success',
        duration: 2000
      })
    } else {
      throw new Error('复制命令执行失败')
    }
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage({
      message: '复制失败: ' + (error.message || '您的浏览器可能不支持自动复制'),
      type: 'error',
      duration: 3000,
      showClose: true,
      offset: 100
    })
  }
}

// 格式化日期
const formatDate = timestamp => {
  if (!timestamp) {
    return '暂无时间'
  }

  // 尝试转换数字时间戳
  let date
  if (typeof timestamp === 'number') {
    date = new Date(timestamp)
  } else if (typeof timestamp === 'string') {
    // 尝试解析ISO格式或其他字符串格式
    date = new Date(timestamp)
  } else {
    return '无效时间'
  }

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '无效时间'
  }

  const now = new Date()
  const diff = now - date

  // 如果时间在未来，显示具体日期
  if (diff < 0) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  }
  // 小于24小时
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  }
  // 小于7天
  if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  }

  // 超过7天显示具体日期
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hour}:${minute}`
}

// 计算页面数量
const getPageCount = listStr => {
  if (!listStr) return 0
  try {
    const list = JSON.parse(listStr)
    return Array.isArray(list) ? list.length : 0
  } catch {
    return 0
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadProjectList()
})
</script>

<style scoped lang="scss">
.project-list-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }
}

/* 头部样式 */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 28px 32px;
  margin-bottom: 24px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 0;
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;

    .title-icon {
      font-size: 36px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .header-actions {
    display: flex;
    gap: 14px;
  }
}

/* 内容区域 */
.content {
  padding: 0 8px;
  position: relative;
  z-index: 1;
}

/* 加载容器 */
.loading-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 项目网格 */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* 项目卡片 */
.project-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.2),
      0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .card-preview {
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.1) 0%,
        rgba(118, 75, 162, 0.1) 100%
      );
      z-index: 1;
    }

    .preview-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      color: white;
      z-index: 2;
      position: relative;

      .preview-icon {
        font-size: 56px;
        opacity: 0.95;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      }

      .preview-text {
        font-size: 18px;
        font-weight: 600;
        opacity: 0.95;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .card-info {
    padding: 20px;

    .project-name {
      margin: 0 0 14px 0;
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      letter-spacing: -0.3px;
    }

    .project-meta {
      display: flex;
      gap: 18px;
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          transform: translateY(-2px);
        }
      }
    }
  }

  .card-actions {
    display: flex;
    gap: 10px;
    padding: 0 20px 20px 20px;

    .btn-edit,
    .btn-copy,
    .btn-delete {
      flex: 1;
      font-weight: 600;
      height: 42px;
      border-radius: 12px;
      font-size: 14px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      letter-spacing: 0.3px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

/* 删除对话框样式 */
.delete-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  padding: 20px;

  .warning-icon {
    font-size: 56px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: pulse 2s ease-in-out infinite;
  }

  p {
    margin: 0;
    font-size: 17px;
    color: #1a1a2e;
    font-weight: 500;
    line-height: 1.6;

    &.warning-text {
      color: #f59e0b;
      font-size: 14px;
      font-weight: 600;
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 全局按钮样式优化 */
:deep(.el-button) {
  border-radius: 12px !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;

  &:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  }

  &:active {
    transform: translateY(0) !important;
  }

  .el-icon {
    margin-right: 6px !important;
  }
}

/* 主要按钮样式 */
.btn-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  padding: 12px 28px !important;
  font-size: 15px !important;
  box-shadow:
    0 4px 16px rgba(102, 126, 234, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.1) !important;

  &:hover {
    background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%) !important;
    opacity: 1 !important;
    box-shadow:
      0 8px 24px rgba(102, 126, 234, 0.5),
      0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }

  &:active {
    transform: translateY(0) !important;
  }
}

/* 刷新按钮样式 */
.btn-refresh {
  background: rgba(255, 255, 255, 0.95) !important;
  color: #667eea !important;
  padding: 12px 20px !important;
  font-size: 15px !important;
  backdrop-filter: blur(20px);

  &:hover {
    background: rgba(255, 255, 255, 1) !important;
    color: #764ba2 !important;
    transform: translateY(-2px) rotate(180deg) !important;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
}

/* 编辑按钮样式 */
.btn-edit {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4) !important;
  }
}

/* 复制按钮样式 */
.btn-copy {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4) !important;
  }
}

/* 删除按钮样式 */
.btn-delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4) !important;
  }
}

/* 对话框按钮样式 */
:deep(.el-dialog__footer) {
  .el-button {
    padding: 12px 28px !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    border-radius: 12px !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

    &:hover {
      transform: translateY(-2px) !important;
    }

    &.el-button--danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      border: none !important;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;

      &:hover {
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4) !important;
      }
    }

    &:not(.el-button--danger) {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%) !important;
      border: 1px solid rgba(0, 0, 0, 0.1) !important;
      color: #374151 !important;

      &:hover {
        background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%) !important;
        color: #1f2937 !important;
      }
    }
  }
}

/* 对话框样式优化 */
:deep(.el-dialog) {
  border-radius: 20px !important;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.98) !important;
  border: 1px solid rgba(255, 255, 255, 0.5);

  .el-dialog__header {
    padding: 24px 28px 16px !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);

    .el-dialog__title {
      font-size: 20px !important;
      font-weight: 700 !important;
      color: #1a1a2e !important;
    }

    .el-dialog__close {
      font-size: 22px !important;
      color: #9ca3af !important;
      transition: all 0.3s ease !important;

      &:hover {
        color: #ef4444 !important;
        transform: rotate(90deg) !important;
      }
    }
  }

  .el-dialog__body {
    padding: 24px 28px !important;
  }

  .el-dialog__footer {
    padding: 16px 28px 24px !important;
    border-top: 1px solid rgba(0, 0, 0, 0.06);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .project-list-container {
    padding: 16px;
  }

  .header {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 16px;

    .header-content {
      flex-direction: column;
      gap: 18px;
      align-items: stretch;
    }

    .title {
      font-size: 24px;
      justify-content: center;

      .title-icon {
        font-size: 28px;
      }
    }

    .header-actions {
      flex-direction: column;
      gap: 12px;

      .el-button {
        width: 100%;
        padding: 14px 24px !important;
      }
    }
  }

  .project-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .project-card {
    .card-preview {
      height: 180px;

      .preview-icon {
        font-size: 48px;
      }

      .preview-text {
        font-size: 16px;
      }
    }

    .card-info {
      padding: 18px;

      .project-name {
        font-size: 18px;
      }
    }

    .card-actions {
      padding: 0 18px 18px 18px;

      .btn-edit,
      .btn-copy,
      .btn-delete {
        height: 40px;
      }
    }
  }
}
</style>
