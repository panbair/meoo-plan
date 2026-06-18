<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  defineAsyncComponent,
  watch,
  nextTick,
  reactive
} from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NProgress from 'nprogress'
import { componentsList, goodComponentsList, homePageComponentsList } from '@/views/web-list/config.ts'
import { templates as templateList } from '@/views/web-template/template/registry'
import AIPlanPanel from './components/AIPlanPanel.vue'

gsap.registerPlugin(ScrollTrigger)

// ==================== 源码和README导入（供 AI 方案使用，按需加载）====================
const vueModules = import.meta.glob('./card-{image,img,text,3d,time,list,other,video}/*/*.vue', {
  query: '?raw',
  import: 'default'
})

// 动态导入所有模板源码（eager 确保生成方案时能直接获取源码字符串）
const templateRawModules = import.meta.glob('../web-template/template/*/*.vue', {
  query: '?raw',
  import: 'default',
  eager: true
})

// 动态导入所有README
const readmeModules = import.meta.glob('./card-{image,img,text,3d,time,list,other,video}/*/README.md', {
  query: '?raw',
  import: 'default'
})

// 获取 router 实例
const router = useRouter()

// ==================== Loading 状态 ====================
const isLoading = ref(true)
const loadingProgress = ref(0)
const loadingText = ref('正在初始化...')

// ==================== 延迟加载配置 ====================
const LAZY_LOAD_DELAY = 1500 // 首屏延迟加载时间（毫秒）
const BATCH_SIZE = 5 // 每批加载的组件数量
const BATCH_DELAY = 300 // 批次间延迟（毫秒）

// ==================== 预加载数量控制 ====================
const PRELOAD_COUNT = 2 // 视口上方预加载数量
const VISIBLE_BUFFER = 2 // 视口下方预加载数量

// ==================== 懒加载模式 ====================
const LAZY_MODE = true // 设为 false 可关闭懒加载

// ==================== 分页加载配置 ====================
const PAGE_SIZE = 5 // 每页加载组件数
const currentPage = ref(1) // 当前页码
const isLoadingMore = ref(false) // 加载更多中
const hasMoreComponents = computed(() => currentPage.value * PAGE_SIZE < filteredComponents.value.length)
const totalPages = computed(() => Math.ceil(filteredComponents.value.length / PAGE_SIZE) || 1)
const jumpPageInput = ref('')

// 同步输入框：当页码通过其他方式改变时（← → 加载更多），更新输入框显示
watch(currentPage, (p) => { jumpPageInput.value = String(p) }, { immediate: true })

// 滚动到指定页的第一项
const scrollToPage = (page: number) => {
  const targetIndex = (page - 1) * PAGE_SIZE
  // 激活目标页所有卡片的可见性（懒加载）
  const endIndex = page * PAGE_SIZE
  for (let i = targetIndex; i < endIndex && i < filteredComponents.value.length; i++) {
    visibleCards.value.add(i)
  }
  nextTick(() => {
    const el = pageRefs.value.get(targetIndex)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    observeNewPages()
  })
}

// 跳转到指定页
const jumpToPage = () => {
  const page = Number(jumpPageInput.value)
  if (!Number.isInteger(page) || page < 1 || page > totalPages.value) {
    jumpPageInput.value = ''
    return
  }
  currentPage.value = page
  jumpPageInput.value = ''
  isLoadingMore.value = false
  scrollToPage(page)
}

// 上一页 / 下一页
const prevPage = () => {
  if (currentPage.value <= 1) return
  currentPage.value--
  scrollToPage(currentPage.value)
}
const nextPage = () => { if (hasMoreComponents.value) { loadMore() } }

// 当前显示的组件列表（分页切片）
const paginatedComponents = computed(() => {
  return filteredComponents.value.slice(0, currentPage.value * PAGE_SIZE)
})

// 加载更多
const loadMore = () => {
  if (isLoadingMore.value || !hasMoreComponents.value) return
  isLoadingMore.value = true
  // 短暂延迟让加载动画可见，同时给浏览器喘息时间
  setTimeout(() => {
    currentPage.value++
    isLoadingMore.value = false
    // 等待DOM更新后初始化新组件的Observer
    nextTick(() => {
      observeNewPages()
    })
  }, 300)
}

// 重置分页（分类切换时调用）
const resetPagination = () => {
  currentPage.value = 1
  isLoadingMore.value = false
  jumpPageInput.value = ''
}

// ==================== 分类筛选 ====================
// 当前选中的分类（默认全部）
const activeCategory = ref('good')

// ==================== 本地搜索 ====================
const searchQuery = ref('')
function clearSearch() { searchQuery.value = '' }

/** 搜索下拉显示 */
const showSearchDropdown = ref(false)

/** 获取类别中文标签 */
const getCategoryLabel = (cat: string) => {
  const found = categories.find(c => c.key === cat)
  return found?.label || cat
}

/** 滚动到指定组件 */
const scrollToComponent = (dirName: string) => {
  nextTick(() => {
    // 找到目标组件的 page 索引
    const index = filteredComponents.value.findIndex(c => c.dirName === dirName)
    if (index >= 0) {
      const el = pageRefs.value.get(index)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  })
}

// ==================== GSAP 动画管理 ====================
// 存储所有 GSAP 动画上下文，用于批量清理
let gsapContext: gsap.Context | null = null

/**
 * 清理所有组件内 GSAP 动画和 ScrollTrigger 实例（不影响 page1 装饰动画）
 * 在切换分类时调用，防止内存泄漏和性能问题
 */
const cleanupAllAnimations = () => {
  try {
    // 1. 杀死所有 ScrollTrigger 实例（每个子组件的 ScrollTrigger）
    const allTriggers = ScrollTrigger.getAll()
    allTriggers.forEach((trigger) => {
      try {
        trigger.kill(false) // false 表示不刷新，避免触发额外动画
      } catch (e) {
        /* 忽略单个 trigger 清理异常 */
      }
    })
    ScrollTrigger.clearScrollMemory()

    // 2. 杀死所有针对 .page 卡片内元素的 tweens（不影响 page1 装饰）
    try {
      const cardEls = document.querySelectorAll('.page:not(.page1):not(.page-footer)')
      cardEls.forEach((el) => {
        gsap.killTweensOf(el) // 杀死该元素上的所有 tween
        // 递归清理子元素上的 tween
        const children = el.querySelectorAll('*')
        children.forEach((child) => {
          gsap.killTweensOf(child)
        })
      })
    } catch (e) {
      /* 忽略元素查找异常 */
    }

    // 3. 清理卡片内 Canvas 上下文（释放 GPU 内存）
    try {
      const cardCanvases = document.querySelectorAll('.page:not(.page1):not(.page-footer) canvas')
      cardCanvases.forEach((canvas) => {
        const ctx = (canvas as HTMLCanvasElement).getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        // 强制缩小 canvas 尺寸以释放显存
        const c = canvas as HTMLCanvasElement
        c.width = 0
        c.height = 0
      })
    } catch (e) {
      /* 忽略 Canvas 清理异常 */
    }

    // 4. 强制刷新 ScrollTrigger，清除所有对已移除 DOM 的引用
    try {
      ScrollTrigger.refresh()
    } catch (e) {
      /* 忽略刷新异常 */
    }
  } catch (error) {
    console.error('清理 GSAP 动画时出错:', error)
  }
}

// ==================== 分类切换控制 ====================
let isCategorySwitching = false // 防止重复切换
let categorySwitchTimer: ReturnType<typeof setTimeout> | null = null

// 监听分类变化，滚动到顶部并清理动画
watch(activeCategory, () => {
  if (isCategorySwitching) return
  isCategorySwitching = true

  // 清理所有组件动画
  cleanupAllAnimations()

  // 清空可见卡片 + 页面引用
  visibleCards.value.clear()
  pageRefs.value.clear()

  // 断开旧 observer
  if (observer) { observer.disconnect(); observer = null }

  // 重置分页
  resetPagination()

  // 强制滚回顶部
  document.documentElement.scrollTop = 0
  window.scrollTo(0, 0)

  nextTick(() => {
    document.documentElement.scrollTop = 0
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })

    setTimeout(() => {
      // 简化：只加载首屏 PAGE_SIZE 个
      for (let i = 0; i < Math.min(PAGE_SIZE, filteredComponents.value.length); i++) {
        visibleCards.value.add(i)
      }
      // 初始化新 Observer
      initIntersectionObserver()
      isCategorySwitching = false
    }, 200)
  })
})

// ==================== 收藏功能 ====================
// 从 localStorage 加载收藏的组件名列表
const loadFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem('cardFavorites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// 收藏的组件名列表
const favorites = ref<string[]>(loadFavorites())

// 保存收藏到 localStorage
const saveFavorites = () => {
  localStorage.setItem('cardFavorites', JSON.stringify(favorites.value))
}

// 切换收藏状态
const toggleFavorite = (dirName: string) => {
  const index = favorites.value.indexOf(dirName)
  if (index === -1) {
    favorites.value.push(dirName)
  } else {
    favorites.value.splice(index, 1)
  }
  saveFavorites()
}

// 检查组件是否已收藏
const isFavorite = (dirName: string) => favorites.value.includes(dirName)

// ==================== 兼容性复制工具函数 ====================
/**
 * 兼容性复制文本到剪贴板
 * 优先使用传统方法（兼容性更好），现代 API 作为备选
 */
const copyToClipboard = async (text: string): Promise<boolean> => {
  // 方法1: 使用 document.execCommand（兼容性最好，支持 HTTP/HTTPS）
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // 确保元素不可见但可以被选中
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '-9999px'
    textArea.style.opacity = '0'
    textArea.setAttribute('readonly', '')

    document.body.appendChild(textArea)

    // 选中并复制
    textArea.select()
    textArea.setSelectionRange(0, textArea.value.length)

    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)

    if (successful) {
      console.log('✅ 使用 execCommand 复制成功')
      return true
    } else {
      console.warn('⚠️ execCommand 返回 false，尝试 Clipboard API')
    }
  } catch (err) {
    console.warn('⚠️ execCommand 失败，尝试 Clipboard API:', err)
  }

  // 方法2: 尝试使用现代 Clipboard API（需要 HTTPS）
  try {
    // 更严格的检查
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(text)
      console.log('✅ 使用 Clipboard API 复制成功')
      return true
    } else {
      console.warn('⚠️ Clipboard API 不可用')
    }
  } catch (err) {
    console.error('❌ Clipboard API 也失败:', err)
  }

  // 所有方法都失败
  console.error('❌ 所有复制方法都失败')
  return false
}

// 复制组件代码
const copyComponentCode = async (cardInfo: any) => {
  try {
    // 获取组件源码
    let sourceCode = ''

    // 从已选组件中查找是否有源码
    const selectedComp = selectedComponents.value.find((c) => c.dirName === cardInfo.dirName)
    if (selectedComp && selectedComp.sourceCode) {
      sourceCode = selectedComp.sourceCode as string
    } else {
      // 如果没有源码，尝试动态加载（带 fallback）
      let moduleLoader = vueModules[cardInfo.path]
      if (!moduleLoader) {
        // fallback: 模糊匹配
        const vueModuleKeys = Object.keys(vueModules)
        const fuzzyKey = vueModuleKeys.find(k => k.includes(cardInfo.dirName) && k.endsWith('.vue'))
        if (fuzzyKey) {
          moduleLoader = vueModules[fuzzyKey]
          console.warn(`[copyCode] 精确路径未找到 "${cardInfo.path}"，使用模糊匹配 "${fuzzyKey}"`)
        }
      }
      if (moduleLoader && typeof moduleLoader === 'function') {
        try {
          const module = await moduleLoader()
          sourceCode = (module as any).default || module
        } catch (error) {
          console.error(`Failed to load source code for ${cardInfo.path}:`, error)
        }
      } else {
        console.error(
          `[copyCode] 无法找到组件源码: ${cardInfo.dirName}`,
          `\n  路径: ${cardInfo.path}`,
          `\n  vueModules 中匹配的 key:`,
          Object.keys(vueModules).filter(k => k.includes(cardInfo.dirName))
        )
      }
    }

    if (sourceCode) {
      // 使用兼容性复制函数
      const success = await copyToClipboard(sourceCode)

      if (success) {
        showCopyErrorModal('✅ 复制成功', `组件 ${cardInfo.name} 的代码已复制到剪贴板`)
      } else {
        showCopyErrorModal('❌ 复制失败', '浏览器不支持自动复制，请手动选择代码复制')
      }
    } else {
      showCopyErrorModal('❌ 复制失败', '无法获取组件源码')
    }
  } catch (err) {
    console.error('复制失败:', err)
    showCopyErrorModal('❌ 复制失败', '请手动复制代码')
  }
}

// ==================== 组件选择功能（从 web-ai 迁移） ====================
// 模块位置配置
interface ModulePosition {
  key: string
  label: string
  icon: string
  desc: string
}

const defaultModulePositions: ModulePosition[] = [
  {
    key: 'hero',
    label: '首屏 Hero',
    icon: '🎯',
    desc: '全屏首图/视频开场'
  },
  {
    key: 'feature',
    label: '特色模块',
    icon: '⭐',
    desc: '产品特点/服务优势'
  },
  {
    key: 'product',
    label: '产品/案例',
    icon: '🎨',
    desc: '作品展示/产品列表'
  },
  {
    key: 'about',
    label: '关于我们',
    icon: '👥',
    desc: '团队/品牌故事'
  },
  {
    key: 'contact',
    label: '联系/CTA',
    icon: '📧',
    desc: '表单/联系方式'
  },
  {
    key: 'footer',
    label: '页脚',
    icon: '📋',
    desc: '链接/版权信息'
  }
]

const MODULE_CONFIG_KEY = 'web-ai-module-positions'

function loadModulePositions(): ModulePosition[] {
  try {
    const saved = localStorage.getItem(MODULE_CONFIG_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load module positions:', e)
  }
  return defaultModulePositions
}

function saveModulePositions(positions: ModulePosition[]) {
  localStorage.setItem(MODULE_CONFIG_KEY, JSON.stringify(positions))
}

// 模块位置配置（响应式）
const modulePositions = ref<ModulePosition[]>(loadModulePositions())

// 已选择组件的模块位置
interface ComponentSelectInfo {
  dirName: string
  name: string
  path: string
  type: string
  selected: boolean
  modulePosition: string
  sourceCode?: string // 组件源码
  readme?: string | null // README内容
}

const selectedComponents = ref<ComponentSelectInfo[]>([])

// 从 localStorage 加载已选组件
const loadSelectedComponents = (): ComponentSelectInfo[] => {
  try {
    const saved = localStorage.getItem('cardSelectedComponents')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// 保存已选组件到 localStorage
const saveSelectedComponents = () => {
  localStorage.setItem('cardSelectedComponents', JSON.stringify(selectedComponents.value))
}

// 重置已选组件（清空）
const resetSelectedComponents = () => {
  if (selectedComponents.value.length === 0) {
    return
  }
  if (confirm('确定要清空所有已选组件吗？')) {
    selectedComponents.value = []
    saveSelectedComponents()
  }
}

// 检查组件是否已选中
const isSelected = (dirName: string) => {
  return selectedComponents.value.some((c) => c.dirName === dirName)
}

// 检查组件的模块位置
const getComponentModulePosition = (dirName: string) => {
  const comp = selectedComponents.value.find((c) => c.dirName === dirName)
  return comp?.modulePosition || ''
}

// 切换组件选择状态
const toggleSelect = (dirName: string, name: string, path: string, type: string) => {
  const index = selectedComponents.value.findIndex((c) => c.dirName === dirName)
  if (index === -1) {
    // 未选中，添加到列表
    selectedComponents.value.push({
      dirName,
      name,
      path,
      type,
      selected: true,
      modulePosition: ''
    })
  } else {
    // 已选中，从列表移除
    selectedComponents.value.splice(index, 1)
  }
  saveSelectedComponents()
}

// 模块选择器状态
const showModuleSelector = ref(false)
const currentSelectingComp = ref<ComponentSelectInfo | null>(null)

// 打开模块选择器
const openModuleSelector = (comp: ComponentSelectInfo) => {
  currentSelectingComp.value = comp
  showModuleSelector.value = true
}

// 选择模块位置
const selectModulePosition = (position: string) => {
  if (currentSelectingComp.value) {
    const index = selectedComponents.value.findIndex(
      (c) => c.dirName === currentSelectingComp.value!.dirName
    )
    if (index !== -1) {
      selectedComponents.value[index].modulePosition = position
      saveSelectedComponents()
    }
  }
  showModuleSelector.value = false
  currentSelectingComp.value = null
}

// 取消选择模块
const cancelModuleSelection = () => {
  showModuleSelector.value = false
  currentSelectingComp.value = null
  isConfigMode.value = false
}

// ==================== 模块配置功能（从 web-ai 迁移） ====================
// 配置编辑状态
const showModuleEditor = ref(false)
const editingPositions = ref<ModulePosition[]>([...modulePositions.value])
// 标记是否为模块配置模式（而非为组件选择模块）
const isConfigMode = ref(false)

function openModuleEditor() {
  editingPositions.value = modulePositions.value.map((p) => ({ ...p }))
  showModuleEditor.value = true
}

// 打开模块选择器（配置模式）
function openModuleSelectorForConfig() {
  isConfigMode.value = true
  showModuleSelector.value = true
}

function closeModuleEditor() {
  showModuleEditor.value = false
}

function saveModuleConfig() {
  modulePositions.value = [...editingPositions.value]
  saveModulePositions(modulePositions.value)
  showModuleEditor.value = false
}

function resetModuleConfig() {
  editingPositions.value = [...defaultModulePositions]
}

function addModulePosition() {
  const maxIndex = editingPositions.value.reduce((max, p) => {
    const match = p.key.match(/^custom(\d+)$/)
    return match ? Math.max(max, parseInt(match[1])) : max
  }, 0)
  editingPositions.value.push({
    key: `custom${maxIndex + 1}`,
    label: `自定义模块${maxIndex + 1}`,
    icon: '🔧',
    desc: '自定义描述'
  })
}

function removeModulePosition(index: number) {
  editingPositions.value.splice(index, 1)
}

// 获取某模块位置下的组件数量
const getComponentsByPosition = (position: string): ComponentSelectInfo[] => {
  return selectedComponents.value.filter((c) => c.modulePosition === position)
}

// 折叠/展开已选列表
const selectionListCollapsed = ref(false)
function toggleSelectionList() {
  selectionListCollapsed.value = !selectionListCollapsed.value
}

// 隐藏/显示整个选择面板
const selectionPanelVisible = ref(true)
function toggleSelectionPanel() {
  selectionPanelVisible.value = !selectionPanelVisible.value
}

// ==================== 模板选择功能 ====================
const TEMPLATE_STORAGE_KEY = 'web-list-selected-template'

const loadSelectedTemplate = (): string[] => {
  try {
    const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY)
    if (saved) {
      const arr = JSON.parse(saved)
      if (Array.isArray(arr)) return arr
    }
  } catch {
    // 兼容旧版单字符串格式
    try {
      const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY)
      if (saved && saved.length > 0 && !saved.startsWith('[')) return [saved]
    } catch { /* ignore */ }
  }
  return []
}

const saveSelectedTemplate = (keys: string[]) => {
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(keys))
}

const selectedTemplateKey = ref<string[]>(loadSelectedTemplate())
const showTemplateModal = ref(false)
const templateSearchQuery = ref('')
const templateShowFavoritesOnly = ref(false)

// 过滤后的模板列表（搜索 label 和 key，收藏置顶，支持仅看收藏）
const filteredTemplateList = computed(() => {
  let list = sortedTemplateList.value
  // 仅看收藏
  if (templateShowFavoritesOnly.value) {
    list = list.filter(t => favoriteKeys.value.has(t.key))
  }
  const q = templateSearchQuery.value.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    (t) => t.label.toLowerCase().includes(q) || t.key.toLowerCase().includes(q)
  )
})

// 获取当前选中模板的信息
// 获取当前选中的模板信息列表
const selectedTemplateInfo = computed(() => {
  return selectedTemplateKey.value
    .map((key) => templateList.find((t) => t.key === key))
    .filter(Boolean) as typeof templateList
})

// 模板选择（多选 toggle）
const toggleTemplate = (key: string) => {
  const idx = selectedTemplateKey.value.indexOf(key)
  if (idx >= 0) {
    selectedTemplateKey.value.splice(idx, 1)
  } else {
    selectedTemplateKey.value.push(key)
  }
  saveSelectedTemplate([...selectedTemplateKey.value])
}

// 清空模板选择
const clearTemplates = () => {
  selectedTemplateKey.value = []
  saveSelectedTemplate([])
}

// 打开模板选择弹窗
const openTemplateModal = () => {
  templateSearchQuery.value = ''
  templateShowFavoritesOnly.value = false
  showTemplateModal.value = true
}

// 关闭模板选择弹窗
const closeTemplateModal = () => {
  templateSearchQuery.value = ''
  templateShowFavoritesOnly.value = false
  showTemplateModal.value = false
}

const openTemplatePage = () => {
  const url = router.resolve({ path: '/web-template' }).href
  window.open(url, '_blank')
}

// ── 收藏系统（与 web-template 共享同一 localStorage key）──
const TEMPLATE_FAV_STORAGE_KEY = 'template-favorites'
const favoriteKeys = ref<Set<string>>(loadTemplateFavorites())

function loadTemplateFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(TEMPLATE_FAV_STORAGE_KEY)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return new Set(arr)
    }
  } catch { /* ignore corrupt data */ }
  return new Set()
}

function saveTemplateFavorites() {
  localStorage.setItem(TEMPLATE_FAV_STORAGE_KEY, JSON.stringify([...favoriteKeys.value]))
}

function toggleTemplateFavorite(key: string) {
  const s = favoriteKeys.value
  if (s.has(key)) { s.delete(key) } else { s.add(key) }
  favoriteKeys.value = new Set(s)
  saveTemplateFavorites()
}

function isTemplateFavorite(key: string) {
  return favoriteKeys.value.has(key)
}

// 排序的模板列表：选中排最前 → 收藏 → 其他
const sortedTemplateList = computed(() => {
  const selected = selectedTemplateKey.value
  const selectedSet = new Set(selected)
  const selectedTemplates = templateList.filter(t => selectedSet.has(t.key))
  const favTemplates = templateList.filter(t => !selectedSet.has(t.key) && favoriteKeys.value.has(t.key))
  const otherTemplates = templateList.filter(t => !selectedSet.has(t.key) && !favoriteKeys.value.has(t.key))
  return [...selectedTemplates, ...favTemplates, ...otherTemplates]
})





// 确保所有已选组件的源码已加载（带 fallback 查找）
async function ensureAllSourcesLoaded(): Promise<boolean> {
  const missingComps = selectedComponents.value.filter(c => !c.sourceCode)
  if (missingComps.length === 0) return true

  // 预构建 vueModules key 的快速查找 Map（用于 fallback 路径匹配）
  const vueModuleKeys = Object.keys(vueModules)

  for (const comp of missingComps) {
    // 先尝试精确匹配
    let moduleLoader = vueModules[comp.path]

    // 如果精确匹配失败，尝试多种 fallback 路径格式
    if (!moduleLoader) {
      const altPaths = [
        comp.path,
        './' + comp.path.replace(/^\.\//, ''),
        comp.path.replace(/^\.\//, './'),
        // 尝试从 dirName 和 type 重建路径
        `./${comp.type}/${comp.dirName}/${comp.dirName}.vue`,
      ]

      for (const altPath of altPaths) {
        moduleLoader = vueModules[altPath]
        if (moduleLoader) {
          console.warn(`[ensureSources] 精确路径未找到 "${comp.path}"，使用 fallback 路径 "${altPath}"`)
          break
        }
      }

      // 最后尝试模糊匹配：从所有 vueModules key 中找包含 dirName 的
      if (!moduleLoader) {
        const fuzzyKey = vueModuleKeys.find(k => k.includes(comp.dirName) && k.endsWith('.vue'))
        if (fuzzyKey) {
          moduleLoader = vueModules[fuzzyKey]
          console.warn(`[ensureSources] 使用模糊匹配找到 "${comp.dirName}" → "${fuzzyKey}"`)
        }
      }
    }

    if (!moduleLoader) {
      console.error(
        `[ensureSources] 无法找到组件源码: ${comp.dirName}`,
        `\n  尝试路径: ${comp.path}`,
        `\n  vueModules 中匹配的 key:`,
        vueModuleKeys.filter(k => k.includes(comp.dirName))
      )
      continue
    }

    try {
      const module = await moduleLoader()
      comp.sourceCode = (module as any).default || module
    } catch (error) {
      console.error(`[ensureSources] 加载源码失败 ${comp.dirName}:`, error)
    }
  }

  const stillMissing = selectedComponents.value.filter(c => !c.sourceCode)
  if (stillMissing.length > 0) {
    console.warn(`[ensureSources] ${stillMissing.length} 个组件源码仍缺失:`, stillMissing.map(c => c.dirName))
  }
  return stillMissing.length === 0
}

// 打开 meoo AI
function OpenMeoo() {
  window.open('https://meoo.com/', '_blank')
}

// 错误弹窗
const showErrorModal = ref(false)
const errorModalTitle = ref('')
const errorModalMessage = ref('')

function showCopyErrorModal(title: string, message: string) {
  errorModalTitle.value = title
  errorModalMessage.value = message
  showErrorModal.value = true
  setTimeout(() => {
    showErrorModal.value = false
  }, 2500)
}

// ==================== 统一生命周期初始化 ====================
onMounted(async () => {
  // 加载已选组件
  selectedComponents.value = loadSelectedComponents()

  // 加载企业信息
  const savedInfo = loadEnterpriseInfo()
  Object.assign(enterpriseInfo, savedInfo)

  // 初始化 GSAP 动画
  initPage1Animations()

  // 创建气泡粒子
  createExtraBubbles()

  // 初始化 Intersection Observer
  initIntersectionObserver()

  // 先显示页面，延迟加载源码
  setTimeout(() => {
    isLoading.value = false
    NProgress.done()

    // 延迟后再预加载源码（不阻塞首屏）
    if (selectedComponents.value.length > 0) {
      preloadComponentSourcesBatch(selectedComponents.value)
    }
  }, LAZY_LOAD_DELAY)
})

// 组件卸载时清理所有动画和资源
onUnmounted(() => {
  // 标记正在切换中，阻止滚动回调和 Observer 继续触发
  isCategorySwitching = true

  // 清理页面1的鼠标事件监听器
  const titleEl = document.querySelector('.page-title')
  if (titleEl) {
    if (page1MouseHandler) {
      titleEl.removeEventListener('mousemove', page1MouseHandler)
      page1MouseHandler = null
    }
    if (page1MouseLeaveHandler) {
      titleEl.removeEventListener('mouseleave', page1MouseLeaveHandler)
      page1MouseLeaveHandler = null
    }
  }

  // 清理所有 GSAP 动画
  cleanupAllAnimations()

  // 清除 gsapContext
  if (gsapContext) {
    gsapContext.revert()
    gsapContext = null
  }

  // 清除分类切换定时器
  if (categorySwitchTimer !== null) {
    clearTimeout(categorySwitchTimer)
    categorySwitchTimer = null
  }

  // 清理 Intersection Observer
  if (observer) {
    observer.disconnect()
    observer = null
  }

  // 清空可见卡片集合
  visibleCards.value.clear()

  console.log('✅ 组件已卸载，所有资源已清理')
})

// 分批预加载组件源码（非阻塞）
const preloadComponentSourcesBatch = async (components: ComponentSelectInfo[]) => {
  const total = components.length
  let loaded = 0

  // 分批处理，避免一次性加载过多
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = components.slice(i, i + BATCH_SIZE)

    // 批次间延迟，让浏览器有时间响应
    if (i > 0) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY))
    }

    // 并行加载当前批次
    await Promise.all(
      batch.map(async (comp) => {
        if (!comp.sourceCode) {
          try {
            const moduleLoader = vueModules[comp.path]
            if (moduleLoader && typeof moduleLoader === 'function') {
              const module = await moduleLoader()
              comp.sourceCode = module.default || module
            } else if (!moduleLoader) {
              console.warn(
                `[preloadSources] vueModules 中未找到: "${comp.path}" (组件: ${comp.dirName})`,
                `\n  可用的 vueModules key 示例:`,
                Object.keys(vueModules).filter(k => k.includes(comp.dirName) || k.includes(comp.type)).slice(0, 5)
              )
            }
          } catch (error) {
            console.error(`Failed to load source code for ${comp.path}:`, error)
          }
        }

        if (!comp.readme) {
          try {
            const readmePath = comp.path.replace(/\.vue$/, '/README.md')
            const readmeLoader = readmeModules[readmePath]
            if (readmeLoader && typeof readmeLoader === 'function') {
              const module = await readmeLoader()
              comp.readme = module.default || module
            } else if (!readmeLoader) {
              // README 缺失不是严重问题，仅 debug 级别
              console.debug(`[preloadSources] README 未找到: "${readmePath}"`)
            }
          } catch (error) {
            console.error(`Failed to load README for ${comp.path}:`, error)
            comp.readme = null
          }
        }

        loaded++
        loadingProgress.value = Math.round((loaded / total) * 100)
      })
    )
  }

  console.log(`✅ 所有组件源码加载完成 (${total}个)`)
}

// 监听已选组件变化，自动保存并预加载源码
watch(
  selectedComponents,
  async (newVal, oldVal) => {
    saveSelectedComponents()

    // 找出新增的组件并预加载
    const newComps = newVal.filter(
      (newComp) => !oldVal.some((oldComp) => oldComp.dirName === newComp.dirName)
    )

    if (newComps.length > 0) {
      // 新增组件也使用分批加载
      preloadComponentSourcesBatch(newComps)
    }
  },
  { deep: true }
)

// ==================== 企业信息功能（从 web-ai 迁移） ====================
interface EnterpriseInfo {
  name: string
  industry: string
  description: string
  targetAudience: string
  mainColors: string
  websiteType: string
  designPhilosophy: string
}

// 企业信息
const enterpriseInfo = reactive<EnterpriseInfo>({
  name: '',
  industry: '',
  description: '',
  targetAudience: '',
  mainColors: '',
  websiteType: '企业官网', // 默认企业官网，不可修改
  designPhilosophy: ''
})

// 加载保存的企业信息
const loadEnterpriseInfo = (): EnterpriseInfo => {
  try {
    const saved = localStorage.getItem('cardEnterpriseInfo')
    return saved ?
      JSON.parse(saved) :
      {
          name: '',
          industry: '',
          description: '',
          targetAudience: '',
          mainColors: '',
          websiteType: '',
          designPhilosophy: ''
        }
  } catch {
    return {
      name: '',
      industry: '',
      description: '',
      targetAudience: '',
      mainColors: '',
      websiteType: '',
      designPhilosophy: ''
    }
  }
}

// 保存企业信息到 localStorage
const saveEnterpriseInfo = () => {
  localStorage.setItem('cardEnterpriseInfo', JSON.stringify(enterpriseInfo))
}

// 监听企业信息变化，自动保存
watch(
  enterpriseInfo,
  () => {
    saveEnterpriseInfo()
  },
  { deep: true }
)

// 颜色选择器相关
const showColorPicker = ref(false)
const colorMode = ref<'solid' | 'gradient'>('solid')
const singleColor = ref('#667eea')
const gradientStart = ref('#667eea')
const gradientEnd = ref('#764ba2')
const gradientAngle = ref(135)

// 预设单色
const solidColorPresets = [
  { name: '科技蓝', value: '#0066FF' },
  { name: '活力橙', value: '#FF6600' },
  { name: '清新绿', value: '#00C851' },
  { name: '浪漫粉', value: '#FF2D55' },
  { name: '贵族紫', value: '#7C3AED' },
  { name: '阳光黄', value: '#FFD700' },
  { name: '深海蓝', value: '#0F172A' },
  { name: '薄荷绿', value: '#00D4AA' },
  { name: '玫瑰金', value: '#E91E63' },
  { name: '雾霾蓝', value: '#607D8B' },
  { name: '珊瑚色', value: '#FF7F50' },
  { name: '电光紫', value: '#9D4EDD' }
]

// 预设渐变
const gradientPresets = [
  { name: '极光渐变', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '日落渐变', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '森林渐变', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: '海洋渐变', value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { name: '火焰渐变', value: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)' },
  { name: '银河渐变', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }
]

// 切换颜色选择器
const toggleColorPicker = () => {
  showColorPicker.value = !showColorPicker.value
}

// 选择预设单色
const selectSolidPreset = (color: string) => {
  singleColor.value = color
  enterpriseInfo.mainColors = color
}

// 从颜色选择器更新
const updateColorFromPicker = () => {
  enterpriseInfo.mainColors = singleColor.value
}

// 应用自定义渐变
const applyGradient = () => {
  const gradient = `linear-gradient(${gradientAngle.value}deg, ${gradientStart.value} 0%, ${gradientEnd.value} 100%)`
  enterpriseInfo.mainColors = gradient
  colorMode.value = 'gradient'
}

// 企业信息弹窗状态
const showEnterpriseModal = ref(false)

// 打开企业信息弹窗
const openEnterpriseModal = () => {
  // 加载保存的企业信息
  const saved = loadEnterpriseInfo()
  Object.assign(enterpriseInfo, saved)
  showEnterpriseModal.value = true
}

// 关闭企业信息弹窗
const closeEnterpriseModal = () => {
  showEnterpriseModal.value = false
}

// 企业信息是否已填写
const hasEnterpriseInfo = computed(() => {
  return enterpriseInfo.name.trim().length > 0
})

// 模板标签映射（供 AI 面板使用）
const templateLabels = computed(() => {
  const map: Record<string, string> = {}
  templateList.forEach(t => { map[t.key] = t.label })
  return map
})

// 参考示例展开状态
const showReferenceExample = ref(false)

// 添加收藏和已选分类
const categories = [
  { key: 'all', label: '全部' },
  { key: 'home', label: '首屏' },
  { key: 'good', label: '精品' },
  { key: 'card-image', label: '图片' },
  { key: 'card-video', label: '视频' },
  { key: 'card-img', label: '图像' },
  { key: 'card-text', label: '文字' },
  { key: 'card-3d', label: '3D' },
  { key: 'card-time', label: '时间' },
  { key: 'card-list', label: '基础' },
  { key: 'card-other', label: '其他' },
  { key: 'favorite', label: '我的收藏' },
  { key: 'selected', label: '已选组件' }
]

// ==================== 响应式数据 ====================
const visibleCards = ref(new Set<number>())
const pageRefs = ref<Map<number, HTMLElement>>(new Map())
const particlesContainerRef = ref<HTMLElement | null>(null)
const bubblesContainerRef = ref<HTMLElement | null>(null)
const propsMap = ref<Map<number, Record<string, unknown>>>(new Map())
let observer: IntersectionObserver | null = null

// ==================== 动态导入组件（按需加载）===================
// card-list 目录组件
const modules = import.meta.glob('./card-list/*/[^/]*.vue')
// card-time 目录组件（精确匹配主文件）
const modulesTime = import.meta.glob('./card-time/*/CardTime*.vue')
// card-3d 目录组件
const modules3d = import.meta.glob('./card-3d/*/[^/]*.vue')
// card-img 目录组件
const modulesImg = import.meta.glob('./card-img/*/[^/]*.vue')
// card-image 目录组件
const modulesImage = import.meta.glob('./card-image/*/[^/]*.vue')
// card-video 目录组件
const modulesVideo = import.meta.glob('./card-video/*/[^/]*.vue')
// card-text 目录组件
const modulesText = import.meta.glob('./card-text/*/[^/]*.vue')
// card-other 目录组件
const modulesOther = import.meta.glob('./card-other/*/*.vue')

/**
 * 自动化构建组件列表
 */
const dirNameList = componentsList
// dirNameList = []

const cardComponents = computed(() => {
  // 处理 card-list 目录组件
  const listComponents = Object.entries(modules)
    .map(([path, module]) => {
      const match = path.match(/\/card-list\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：直接使用 import.meta.glob 返回的函数
        component: LAZY_MODE ?
          defineAsyncComponent(module as any) :
          (module as any)?.default || null,
        type: 'card-list'
      }
    })
    .filter((item) => !dirNameList.includes(item.dirName) && item.component !== null)

  // 处理 card-time 目录组件
  const timeComponents = Object.entries(modulesTime)
    .map(([path, module]) => {
      const match = path.match(/\/card-time\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Time/g, ' Time')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：直接使用 import.meta.glob 返回的函数
        component: LAZY_MODE ?
          defineAsyncComponent(module as any) :
          (module as any)?.default || null,
        type: 'card-time'
      }
    })
    .filter((item) => !dirNameList.includes(item.dirName) && item.component !== null)

  // 处理 card-text 目录组件
  const textComponents = Object.entries(modulesText)
    .map(([path, module]) => {
      const match = path.match(/\/card-text\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/CardText/g, '文字')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：直接使用 import.meta.glob 返回的函数
        component: LAZY_MODE ?
          defineAsyncComponent(module as any) :
          (module as any)?.default || null,
        type: 'card-text'
      }
    })
    .filter((item) => !dirNameList.includes(item.dirName) && item.component !== null)

  // 处理 card-3d 目录组件
  const d3dComponents = Object.entries(modules3d)
    .map(([path, module]) => {
      const match = path.match(/\/card-3d\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/3d/g, ' 3D')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：直接使用 import.meta.glob 返回的函数
        component: LAZY_MODE ?
          defineAsyncComponent(module as any) :
          (module as any)?.default || null,
        type: 'card-3d'
      }
    })
    .filter((item) => !dirNameList.includes(item.dirName) && item.component !== null)

  // 处理 card-img 目录组件
  const imgComponents = Object.entries(modulesImg)
    .map(([path, module]) => {
      const match = path.match(/\/card-img\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Img/g, ' Image')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：直接使用 import.meta.glob 返回的函数
        component: LAZY_MODE ?
          defineAsyncComponent(module as any) :
          (module as any)?.default || null,
        type: 'card-img'
      }
    })
    .filter((item) => !dirNameList.includes(item.dirName) && item.component !== null)

  // 处理 card-image 目录组件
  const imageComponents = Object.entries(modulesImage)
    .map(([path, module]) => {
      const match = path.match(/\/card-image\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Image/g, ' Image')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：直接使用 import.meta.glob 返回的函数
        component: LAZY_MODE ?
          defineAsyncComponent(module as any) :
          (module as any)?.default || null,
        type: 'card-image'
      }
    })
    .filter((item) => !dirNameList.includes(item.dirName) && item.component !== null)

  // 处理 card-video 目录组件
  const videoComponents = Object.entries(modulesVideo)
    .map(([path, module]) => {
      const match = path.match(/\/card-video\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Video/g, ' Video')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        component: LAZY_MODE ?
          defineAsyncComponent(module as any) :
          (module as any)?.default || null,
        type: 'card-video'
      }
    })
    .filter((item) => !dirNameList.includes(item.dirName) && item.component !== null)

  // 处理 card-other 目录组件
  const otherComponents = Object.entries(modulesOther)
    .map(([path, module]) => {
      const match = path.match(/\/card-other\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：直接使用 import.meta.glob 返回的函数
        component: LAZY_MODE ?
          defineAsyncComponent(module as any) :
          (module as any)?.default || null,
        type: 'card-other'
      }
    })
    .filter((item) => !dirNameList.includes(item.dirName) && item.component !== null)

  console.log(imageComponents.map((item) => item.dirName))
  console.log(imgComponents.map((item) => item.dirName))
  console.log(textComponents.map((item) => item.dirName))
  console.log(d3dComponents.map((item) => item.dirName))
  console.log(timeComponents.map((item) => item.dirName))
  console.log(listComponents.map((item) => item.dirName))
  console.log(otherComponents.map((item) => item.dirName))
  console.log(videoComponents.map((item) => item.dirName))
  // 合并数组：card-image > card-video > card-img > card-text > card-3d > card-time > card-list > card-other
  return [
    ...imageComponents,
    ...videoComponents,
    ...imgComponents,
    ...textComponents,
    ...d3dComponents,
    ...timeComponents,
    ...listComponents,
    ...otherComponents
  ]
})

// ==================== 分类筛选后的组件列表 ====================
const filteredComponents = computed(() => {
  // 先按分类筛选
  let list: typeof cardComponents.value = []

  if (activeCategory.value === 'all') {
    list = cardComponents.value
  } else if (activeCategory.value === 'favorite') {
    list = cardComponents.value.filter((comp) => isFavorite(comp.dirName))
  } else if (activeCategory.value === 'good') {
    const goodSet = new Set(goodComponentsList)
    list = cardComponents.value.filter((comp) => goodSet.has(comp.dirName))
  } else if (activeCategory.value === 'home') {
    const homeSet = new Set(homePageComponentsList)
    list = cardComponents.value.filter((comp) => homeSet.has(comp.dirName))
  } else if (activeCategory.value === 'selected') {
    const selectedNames = new Set(selectedComponents.value.map((c) => c.dirName))
    list = cardComponents.value.filter((comp) => selectedNames.has(comp.dirName))
  } else {
    list = cardComponents.value.filter((comp) => comp.type === activeCategory.value)
  }

  // 本地搜索过滤
  const query = searchQuery.value.trim().toLowerCase()
  if (query.length >= 1) {
    return list.filter(comp =>
      comp.name.toLowerCase().includes(query) ||
      comp.dirName.toLowerCase().includes(query) ||
      comp.type.toLowerCase().includes(query) ||
      comp.path.toLowerCase().includes(query)
    )
  }

  return list
})

// 搜索时重置分页并预加载首屏
watch(searchQuery, () => {
  currentPage.value = 1
  visibleCards.value.clear()
  // 预填充首屏可见卡片，避免 Observer 的鸡生蛋问题
  nextTick(() => {
    const count = Math.min(PAGE_SIZE, filteredComponents.value.length)
    for (let i = 0; i < count; i++) {
      visibleCards.value.add(i)
    }
    observeNewPages()
  })
})

// ==================== 模板引用 ====================
const setPageRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    pageRefs.value.set(index, element as HTMLElement)
  } else {
    pageRefs.value.delete(index)
  }
}

// ==================== Intersection Observer (轻量化) ====================
const initIntersectionObserver = () => {
  if (!LAZY_MODE) {
    paginatedComponents.value.forEach((_, i) => visibleCards.value.add(i))
    return
  }

  if (observer) { observer.disconnect(); observer = null }

  observer = new IntersectionObserver(
    (entries) => {
      if (!visibleCards.value || isCategorySwitching) return
      entries.forEach((entry) => {
        const index = parseInt((entry.target as HTMLElement).dataset.index || '0')
        if (entry.isIntersecting) {
          visibleCards.value.add(index)
        }
      })
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0 }
  )

  observeNewPages()
}

// 观察新加载的页面元素
const observeNewPages = () => {
  if (!observer) return
  setTimeout(() => {
    const pageEls = document.querySelectorAll('.page:not(.page1):not(.page-footer)')
    pageEls.forEach((el, index) => {
      el.setAttribute('data-index', String(index))
      observer?.observe(el)
    })
  }, 100)
}

// 滚动监听已由 IntersectionObserver 接管，无需额外 scroll handler

// ==================== 气泡粒子系统 ====================
const createExtraBubbles = () => {
  if (!bubblesContainerRef.value) {
    return
  }

  const container = bubblesContainerRef.value
  const colors = [
    'rgba(255, 105, 180, 0.6)', // 粉红
    'rgba(138, 43, 226, 0.5)', // 紫罗兰
    'rgba(0, 191, 255, 0.5)', // 电光蓝
    'rgba(100, 255, 218, 0.5)', // 青色
    'rgba(255, 182, 193, 0.6)', // 浅粉
    'rgba(173, 216, 230, 0.5)' // 天蓝
  ]

  // 创建 50 个气泡
  for (let i = 0; i < 50; i++) {
    const bubble = document.createElement('div')
    bubble.className = 'bubble-particle'

    const size = 4 + Math.random() * 8
    const x = Math.random() * 100
    const duration = 15 + Math.random() * 20
    const delay = Math.random() * -30
    const color = colors[Math.floor(Math.random() * colors.length)]

    bubble.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      background: radial-gradient(circle at 30% 30%, white, ${color});
      box-shadow: 0 0 ${size}px ${color}, inset 0 0 ${size / 2}px rgba(255,255,255,0.3);
      animation: bubbleFloat ${duration}s linear infinite;
      animation-delay: ${delay}s;
      opacity: 0;
    `
    container.appendChild(bubble)
  }
}

// ==================== GSAP 动画 ====================
// 存储页面1的鼠标事件处理器，用于清理
let page1MouseHandler: ((e: MouseEvent) => void) | null = null
let page1MouseLeaveHandler: (() => void) | null = null

const initPage1Animations = () => {
  // 先清理之前的动画上下文
  if (gsapContext) {
    gsapContext.revert()
  }

  // 清除之前的事件监听器
  const titleEl = document.querySelector('.page-title')
  if (titleEl && page1MouseHandler) {
    titleEl.removeEventListener('mousemove', page1MouseHandler)
    titleEl.removeEventListener('mouseleave', page1MouseLeaveHandler!)
    page1MouseHandler = null
    page1MouseLeaveHandler = null
  }

  // 创建新的动画上下文
  gsapContext = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 入场动画序列
    tl.fromTo('.page1-bg-effects', { opacity: 0 }, { opacity: 1, duration: 1 })
      .fromTo(
        '.floating-orb',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.6,
          duration: 1.5,
          stagger: 0.2
        },
        '-=0.5'
      )
      .fromTo(
        '.hero-badge',
        { y: -50, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)'
        },
        '-=1'
      )
      // 标题字符 3D 立体入场动画
      .fromTo(
        '.page-title .title-line',
        {
          y: 80,
          opacity: 0,
          scale: 0.8,
          rotateX: -45
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'expo.out'
        },
        '-=0.5'
      )
      // 每个字符单独 3D 旋转入场
      .fromTo(
        '.page-title .char',
        {
          y: 60,
          opacity: 0,
          rotateX: -90,
          rotateY: 45,
          scale: 0.5
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.8,
          stagger: { each: 0.06, from: 'start' },
          ease: 'elastic.out(1, 0.6)'
        },
        '-=0.8'
      )
      // 副标题词语动画
      .fromTo(
        '.page-desc .desc-word',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08
        },
        '-=0.5'
      )
      // 功能标签动画
      .fromTo(
        '.feature-tags .tag',
        { scale: 0, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.5)'
        },
        '-=0.3'
      )
      // 中文信息块动画
      .fromTo(
        '.chinese-info .info-block',
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out'
        },
        '-=0.5'
      )
      // 统计数字动画
      .fromTo(
        '.component-stats',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(
        '.stat-number',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15
        },
        '-=0.6'
      )
      // 滚动指示器动画
      .fromTo(
        '.scroll-indicator',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      )

    // 持续动画 - 浮动光球呼吸效果
    gsap.to('.orb-1', {
      y: -30,
      scale: 1.1,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    gsap.to('.orb-2', {
      y: 20,
      x: 15,
      scale: 0.95,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
    gsap.to('.orb-3', {
      y: -20,
      x: -10,
      scale: 1.05,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 标题 3D 悬浮视差效果（鼠标跟随）
    const titleEl = document.querySelector('.page-title')
    if (titleEl) {
      // 创建鼠标移动处理器
      page1MouseHandler = (e: MouseEvent) => {
        const rect = titleEl.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        gsap.to('.page-title .char', {
          rotateY: (i) => x * 20 * (i % 2 === 0 ? 1 : -1),
          rotateX: (i) => -y * 15 * (i % 2 === 0 ? 1 : -1),
          duration: 0.5,
          ease: 'power2.out'
        })
      }

      // 创建鼠标离开处理器
      page1MouseLeaveHandler = () => {
        gsap.to('.page-title .char', {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)'
        })
      }

      titleEl.addEventListener('mousemove', page1MouseHandler)
      titleEl.addEventListener('mouseleave', page1MouseLeaveHandler)
    }

    // 渐变色字符持续光泽动画
    gsap.to('.page-title .char.accent', {
      backgroundPosition: '200% 50%',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 网格动画 - 淡入
    gsap.fromTo('.grid-lines', { opacity: 0 }, { opacity: 1, duration: 2, delay: 0.5 })
    gsap.fromTo('.grid-dots', { opacity: 0 }, { opacity: 1, duration: 2, delay: 0.8 })

    // 脉冲圆环动画
    gsap.fromTo(
      '.pulse-ring',
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        stagger: 0.3,
        ease: 'power2.out'
      }
    )
  })
}


/**
 * 构建复制内容 - 供 meoo AI 使用的完整信息
 */

</script>

<template>
  <!-- Loading 遮罩层 -->
  <Teleport to="body">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <div class="loading-text">{{ loadingText }}</div>
        <div v-if="selectedComponents.length > 0" class="loading-progress-bar">
          <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
        </div>
        <div v-if="selectedComponents.length > 0" class="loading-progress-text">
          {{ loadingProgress }}%
        </div>
      </div>
    </div>
  </Teleport>

  <div class="web-list">
    <!-- 本地搜索框 -->
    <div class="search-bar" :class="{ active: searchQuery.length > 0 }">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索组件名称..."
        />
        <button
          v-if="searchQuery"
          class="search-clear-btn"
          @click="clearSearch()"
          title="清除搜索"
        >✕</button>
      </div>
    </div>

    <!-- 顶部悬浮分类选项卡 -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="['tab-btn', { active: activeCategory === cat.key }]"
        @click="activeCategory = cat.key"
      >
        {{ cat.label }}
      </button>
      <!--
            <button class="tab-btn generate-btn" @click="router.push('/web-ai')">去生成方案</button>
      -->
    </div>

    <div class="page page1">
      <!-- 背景装饰层 -->
      <div class="page1-bg-effects">
        <!-- JS 动态粒子效果 -->
        <div ref="particlesContainerRef" class="particles"></div>
        <!-- 额外气泡粒子 -->
        <div ref="bubblesContainerRef" class="extra-bubbles"></div>
        <!-- 动态光束 -->
        <div class="light-beam beam-1"></div>
        <div class="light-beam beam-2"></div>
        <div class="light-beam beam-3"></div>
        <div class="light-beam beam-4"></div>
        <!-- 扫描线 -->
        <div class="scanline"></div>
        <!-- 脉冲圆环 -->
        <div class="pulse-ring ring-1"></div>
        <div class="pulse-ring ring-2"></div>
        <div class="pulse-ring ring-3"></div>
        <!-- 浮动光球 -->
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
        <!-- 网格层 -->
        <div class="grid-lines"></div>
        <div class="grid-dots"></div>
      </div>

      <!-- 主内容区 -->
      <div class="page1-content">
        <!-- 顶部标签 -->
        <div class="hero-badge">
          <span class="badge-icon">✨</span>
          <span class="badge-text">AI-Powered</span>
        </div>

        <!-- 主标题 - 3D 立体字符动画 -->
        <h1 class="page-title">
          <span class="title-line" data-text="Creative">
            <span v-for="(char, i) in 'Creative'" :key="'c1-' + i" class="char" :data-char="char">{{
              char
            }}</span>
          </span>
          <span class="title-line" data-text="Cards">
            <span
              v-for="(char, i) in 'Cards'"
              :key="'c2-' + i"
              class="char accent"
              :data-char="char"
              >{{ char }}</span
            >
          </span>
          <span class="title-line" data-text="Gallery">
            <span v-for="(char, i) in 'Gallery'" :key="'c3-' + i" class="char" :data-char="char">{{
              char
            }}</span>
          </span>
        </h1>

        <!-- 副标题 -->
        <p class="page-desc">
          <span
            v-for="(word, i) in [
              'Scroll',
              'down',
              'to',
              'explore',
              'interactive',
              'card',
              'animations'
            ]"
            :key="i"
            class="desc-word"
            >{{ word }}</span
          >
        </p>

        <!-- 功能标签组 -->
        <div class="feature-tags">
          <div class="tag tag-primary">
            <span class="tag-icon">🚀</span>
            <span class="tag-text">快速构建</span>
          </div>
          <div class="tag tag-gradient">
            <span class="tag-icon">💎</span>
            <span class="tag-text">丰富动画</span>
          </div>
          <div class="tag tag-success">
            <span class="tag-icon">🎯</span>
            <span class="tag-text">AI生成</span>
          </div>
        </div>

        <!-- 中文说明区 -->
        <div class="chinese-info">
          <div class="info-block">
            <span class="info-icon">🏢</span>
            <span class="info-text">企业官网</span>
          </div>
          <div class="info-block">
            <span class="info-icon">🎨</span>
            <span class="info-text">产品展示</span>
          </div>
          <div class="info-block">
            <span class="info-icon">📈</span>
            <span class="info-text">营销落地</span>
          </div>
          <div class="info-block highlight">
            <span class="info-icon">🤖</span>
            <span class="info-text">AI生成</span>
          </div>
        </div>

        <!-- 组件数量统计 -->
        <div class="component-stats">
          <div class="stat-number">
            <span class="stat-value">{{ filteredComponents.length }}</span>
            <span class="stat-label">精选组件</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-number">
            <span class="stat-value">7</span>
            <span class="stat-label">分类</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-number">
            <span class="stat-value">∞</span>
            <span class="stat-label">可能</span>
          </div>
        </div>
      </div>

      <!-- 底部滚动指示器 -->
      <div class="scroll-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div
      v-for="(cardInfo, index) in paginatedComponents"
      :key="cardInfo.dirName"
      :ref="(el) => setPageRef(el, index)"
      :class="['page', `page-card-${index + 1}`]"
    >
      <!-- 懒加载：只在进入视口时渲染组件 -->
      <component :is="cardInfo.component" v-if="visibleCards.has(index)" v-bind="propsMap[index]" />
      <div class="card-info position-absolute top-10px left-100px z-99999">
        <span class="card-name">{{ cardInfo.dirName }}</span>
        <!-- 选择按钮 -->
        <button
          :class="['select-btn', { active: isSelected(cardInfo.dirName) }]"
          :title="isSelected(cardInfo.dirName) ? '已选中，点击取消' : '点击选择组件'"
          @click="toggleSelect(cardInfo.dirName, cardInfo.name, cardInfo.path, cardInfo.type)"
        >
          {{ isSelected(cardInfo.dirName) ? '☑️' : '⬜' }}
        </button>
        <!-- 已选择时显示模块标签 -->
        <span
          v-if="isSelected(cardInfo.dirName) && getComponentModulePosition(cardInfo.dirName)"
          class="module-tag"
        >
          {{
            modulePositions.find((m) => m.key === getComponentModulePosition(cardInfo.dirName))
              ?.icon
          }}
          {{
            modulePositions.find((m) => m.key === getComponentModulePosition(cardInfo.dirName))
              ?.label
          }}
        </span>
        <!-- 收藏按钮 -->
        <button
          :class="['favorite-btn', { active: isFavorite(cardInfo.dirName) }]"
          @click="toggleFavorite(cardInfo.dirName)"
        >
          {{ isFavorite(cardInfo.dirName) ? '❤️' : '🤍' }}
        </button>
        <!-- 复制按钮 -->
        <button class="copy-code-btn" title="复制组件代码" @click="copyComponentCode(cardInfo)">
          📋
        </button>
        <!-- 为已选组件选择模块位置 -->
        <button
          v-if="isSelected(cardInfo.dirName)"
          class="module-btn"
          title="选择模块位置"
          @click="
            openModuleSelector({
              dirName: cardInfo.dirName,
              name: cardInfo.name,
              path: cardInfo.path,
              type: cardInfo.type,
              selected: true,
              modulePosition: getComponentModulePosition(cardInfo.dirName)
            })
          "
        >
          📦
        </button>
      </div>
    </div>

    <!-- 🔑 分页控件 + 加载更多 -->
    <div v-if="filteredComponents.length > 0" class="load-more-container">
      <div class="pagination-row">
        <!-- 上一页 -->
        <button
          class="page-nav-btn"
          :disabled="currentPage <= 1"
          @click="prevPage"
          title="上一页"
        >←</button>

        <!-- 页码显示 + 跳转 -->
        <span class="page-info">第</span>
        <input
          v-model="jumpPageInput"
          class="page-jump-input"
          type="number"
          :min="1"
          :max="totalPages"
          placeholder="1"
          @keyup.enter="jumpToPage"
          @blur="jumpToPage"
        />
        <span class="page-info">/ {{ totalPages }} 页</span>

        <!-- 下一页 -->
        <button
          class="page-nav-btn"
          :disabled="!hasMoreComponents"
          @click="nextPage"
          title="下一页"
        >→</button>

        <!-- 加载更多 -->
        <button
          v-if="hasMoreComponents"
          class="load-more-btn"
          :class="{ loading: isLoadingMore }"
          :disabled="isLoadingMore"
          @click="loadMore"
        >
          <span v-if="isLoadingMore" class="load-more-spinner"></span>
          <span v-else>↓ 加载更多</span>
        </button>
      </div>
    </div>

    <div class="page page-footer">
      <h1 class="page-title">That's All</h1>
      <p class="page-desc">Thanks for watching</p>
    </div>

    <!-- 已选组件预览面板 -->
    <div v-if="selectedComponents.length > 0 && selectionPanelVisible" class="selection-panel">
      <div class="selection-header">
        <div class="header-actions">
          <!-- 模板选择按钮 -->
          <button
            :class="['selection-template-btn', { active: selectedTemplateKey.length > 0 }]"
            title="选择页面模板"
            @click="openTemplateModal"
          >
            {{ selectedTemplateKey.length > 0 ? `🎭 模板(${selectedTemplateKey.length})` : '🎭 选择模板' }}
          </button>
          <!-- 模块设置按钮 -->
          <button
            class="selection-module-btn"
            title="配置模块位置"
            @click="openModuleSelectorForConfig"
          >
            ⚙️ 模块配置
          </button>
          <!-- 企业信息按钮 -->
          <button
            :class="['selection-enterprise-btn', { active: hasEnterpriseInfo }]"
            :title="hasEnterpriseInfo ? '已填写企业信息' : '填写企业信息'"
            @click="openEnterpriseModal"
          >
            {{ hasEnterpriseInfo ? '🏢 已填写' : '🏢 企业信息' }}
          </button>
        </div>
        <!-- 关闭面板按钮 -->
        <button class="selection-panel-close" @click="toggleSelectionPanel" title="关闭面板">
          ✕
        </button>
        <!-- AI 方案面板（触发按钮 + 侧边栏） -->
        <AIPlanPanel
          :component-count="selectedComponents.length"
          :template-count="selectedTemplateKey.length"
          :has-enterprise="hasEnterpriseInfo"
          :selected-components="selectedComponents"
          :selected-template-keys="selectedTemplateKey"
          :template-labels="templateLabels"
          :enterprise-info="enterpriseInfo"
          :module-positions="modulePositions"
          :get-components-by-position="getComponentsByPosition"
          :selected-components-raw="selectedComponents"
          :vue-modules="vueModules"
          :readme-modules="readmeModules"
          :template-raw-modules="templateRawModules"
        />
      </div>
      <!-- 已选组件标题 -->
      <div class="selection-title">
        <div class="title-content">
          <span class="title-icon">📋</span>
          <span class="title-text">已选组件</span>
          <span class="title-count">{{ selectedComponents.length }}</span>
        </div>
        <div class="title-actions">
          <button class="title-reset" title="清空已选组件" @click="resetSelectedComponents">
            🔄
          </button>
          <button
            class="title-collapse"
            :title="selectionListCollapsed ? '展开' : '收起'"
            @click="toggleSelectionList"
          >
            {{ selectionListCollapsed ? '▼' : '▲' }}
          </button>
        </div>
      </div>
      <div class="selection-list" :class="{ collapsed: selectionListCollapsed }">
        <div
          v-for="pos in modulePositions.filter((p) => getComponentsByPosition(p.key).length > 0)"
          :key="pos.key"
          class="selection-module-group"
        >
          <div class="selection-module-header">
            <span>{{ pos.icon }}</span>
            <span>{{ pos.label }}</span>
            <span class="count">({{ getComponentsByPosition(pos.key).length }})</span>
          </div>
          <div class="selection-module-items">
            <div
              v-for="comp in getComponentsByPosition(pos.key)"
              :key="comp.dirName"
              class="selection-item"
            >
              <span class="item-name">{{ comp.name }}</span>
              <button
                class="item-remove"
                @click="toggleSelect(comp.dirName, comp.name, comp.path, comp.type)"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        <!-- 未分配模块的组件 -->
        <div
          v-if="selectedComponents.filter((c) => !c.modulePosition).length > 0"
          class="selection-module-group unassigned"
        >
          <div class="selection-module-header">
            <span>⚠️</span>
            <span>未分配模块</span>
            <span class="count"
              >({{ selectedComponents.filter((c) => !c.modulePosition).length }})</span
            >
          </div>
          <div class="selection-module-items">
            <div
              v-for="comp in selectedComponents.filter((c) => !c.modulePosition)"
              :key="comp.dirName"
              class="selection-item"
              @click="openModuleSelector(comp)"
            >
              <span class="item-name">{{ comp.name }}</span>
              <button class="item-add" @click.stop="openModuleSelector(comp)">+</button>
              <button
                class="item-remove"
                @click.stop="toggleSelect(comp.dirName, comp.name, comp.path, comp.type)"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 面板关闭时的浮动恢复按钮 -->
    <button
      v-if="selectedComponents.length > 0 && !selectionPanelVisible"
      class="selection-panel-float-btn"
      @click="toggleSelectionPanel"
      title="展开选择面板"
    >
      <span class="float-icon">📋</span>
      <span class="float-badge">{{ selectedComponents.length }}</span>
    </button>

    <!-- 模块选择器弹窗 -->
    <Teleport to="body">
      <div
        v-if="showModuleSelector"
        class="module-selector-overlay"
        @click.self="cancelModuleSelection"
      >
        <div class="module-selector">
          <div class="module-selector-header">
            <h4>{{ isConfigMode ? '⚙️ 模块配置' : '选择模块位置' }}</h4>
            <p>
              {{
                isConfigMode
                  ? '管理模块位置，点击模块可查看已分配的组件'
                  : '为「' + currentSelectingComp?.name + '」选择放置位置'
              }}
            </p>
            <button class="close-btn" @click="cancelModuleSelection">×</button>
          </div>
          <div class="module-position-grid">
            <button
              v-for="pos in modulePositions"
              :key="pos.key"
              :class="['module-pos-btn', { selected: getComponentsByPosition(pos.key).length > 0 }]"
              @click="isConfigMode ? null : selectModulePosition(pos.key)"
            >
              <span class="pos-icon">{{ pos.icon }}</span>
              <span class="pos-label">{{ pos.label }}</span>
              <span class="pos-desc">{{ pos.desc }}</span>
              <span v-if="getComponentsByPosition(pos.key).length > 0" class="pos-used-by">
                {{ getComponentsByPosition(pos.key).length }}个组件
              </span>
              <span v-else class="pos-empty">暂无组件</span>
            </button>
            <button class="module-pos-btn add-new" @click="openModuleEditor">
              <span class="pos-icon">➕</span>
              <span class="pos-label">添加新模块</span>
            </button>
          </div>
          <div class="module-selector-footer">
            <button class="btn btn-ghost" @click="openModuleEditor">⚙️ 设置模块</button>
            <button class="btn btn-primary" @click="cancelModuleSelection">✓ 关闭</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 全屏模块配置编辑器 -->
    <Teleport to="body">
      <div v-if="showModuleEditor" class="fullscreen-modal-overlay" @click.self="closeModuleEditor">
        <div class="fullscreen-modal">
          <div class="modal-header">
            <div class="modal-title">
              <h3>⚙️ 模块配置</h3>
              <p>配置模块位置，可增删改。修改后自动保存到浏览器。</p>
            </div>
            <button class="modal-close" @click="closeModuleEditor">×</button>
          </div>

          <div class="modal-body">
            <div class="module-editor-list">
              <div
                v-for="(pos, index) in editingPositions"
                :key="pos.key + index"
                class="module-editor-row"
              >
                <input v-model="pos.icon" class="edit-input" placeholder="图标" />
                <input v-model="pos.key" class="edit-input" placeholder="key" />
                <input v-model="pos.label" class="edit-input" placeholder="名称" />
                <input v-model="pos.desc" class="edit-input edit-input-wide" placeholder="描述" />
                <button class="remove-btn" @click="removeModulePosition(index)">🗑️</button>
              </div>
            </div>
            <button class="btn btn-ghost mt-4" @click="addModulePosition">+ 添加模块</button>
          </div>

          <div class="modal-footer">
            <button class="btn btn-ghost" @click="resetModuleConfig">恢复默认</button>
            <button class="btn btn-primary" @click="saveModuleConfig">💾 保存配置</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 企业信息弹窗 -->
    <Teleport to="body">
      <div
        v-if="showEnterpriseModal"
        class="enterprise-modal-overlay"
        @click.self="closeEnterpriseModal"
      >
        <div class="enterprise-modal">
          <div class="enterprise-modal-header">
            <div class="modal-title">
              <h3>🏢 企业信息</h3>
              <p>填写企业信息，生成更精准的网站方案</p>
            </div>
            <button class="close-btn" @click="closeEnterpriseModal">×</button>
          </div>
          <div class="enterprise-modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label>企业名称 *</label>
                <input
                  v-model="enterpriseInfo.name"
                  type="text"
                  placeholder="例如：深圳市科技创新有限公司"
                />
              </div>

              <div class="form-group">
                <label>所属行业</label>
                <select v-model="enterpriseInfo.industry">
                  <option value="">请选择</option>
                  <option value="科技/互联网">科技/互联网</option>
                  <option value="金融/投资">金融/投资</option>
                  <option value="教育/培训">教育/培训</option>
                  <option value="医疗/健康">医疗/健康</option>
                  <option value="零售/电商">零售/电商</option>
                  <option value="制造业">制造业</option>
                  <option value="房地产/建筑">房地产/建筑</option>
                  <option value="文化/娱乐">文化/娱乐</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <div class="form-group form-group-full">
                <label>企业简介</label>
                <textarea
                  v-model="enterpriseInfo.description"
                  rows="3"
                  placeholder="简单描述企业的核心业务、产品或服务..."
                ></textarea>
              </div>

              <div class="form-group">
                <label>目标受众</label>
                <input
                  v-model="enterpriseInfo.targetAudience"
                  type="text"
                  placeholder="例如：25-40岁白领群体、B2B企业客户"
                />
              </div>

              <div class="form-group">
                <label>品牌主色</label>
                <div class="color-picker-wrapper">
                  <div class="color-input-row">
                    <input
                      v-model="enterpriseInfo.mainColors"
                      type="text"
                      class="color-text-input"
                      placeholder="输入颜色值或选择预设"
                    />
                    <button
                      class="color-picker-btn"
                      :style="{ background: enterpriseInfo.mainColors || '#667eea' }"
                      @click="toggleColorPicker"
                    >
                      <span class="picker-icon">🎨</span>
                    </button>
                  </div>

                  <!-- 颜色选择器弹出层 -->
                  <div v-if="showColorPicker" class="color-picker-popup">
                    <div class="mode-tabs">
                      <button
                        :class="['mode-tab', { active: colorMode === 'solid' }]"
                        @click="colorMode = 'solid'"
                      >
                        <span class="mode-icon">●</span>
                        单色
                      </button>
                      <button
                        :class="['mode-tab', { active: colorMode === 'gradient' }]"
                        @click="colorMode = 'gradient'"
                      >
                        <span class="mode-icon gradient-icon"></span>
                        渐变
                      </button>
                    </div>

                    <!-- 单色模式 -->
                    <div v-if="colorMode === 'solid'" class="mode-content">
                      <div class="color-preset-grid">
                        <button
                          v-for="preset in solidColorPresets"
                          :key="preset.value"
                          :class="['color-preset-btn', { active: singleColor === preset.value }]"
                          :style="{ background: preset.value }"
                          :title="preset.name"
                          @click="selectSolidPreset(preset.value)"
                        ></button>
                      </div>
                      <div class="custom-color-row">
                        <span class="section-label">自定义</span>
                        <input
                          v-model="singleColor"
                          type="color"
                          class="color-input"
                          @input="updateColorFromPicker"
                        />
                        <input
                          v-model="singleColor"
                          type="text"
                          class="color-text-input-sm"
                          placeholder="#0066FF"
                          @input="updateColorFromPicker"
                        />
                      </div>
                    </div>

                    <!-- 渐变模式 -->
                    <div v-if="colorMode === 'gradient'" class="mode-content">
                      <div class="gradient-presets">
                        <button
                          v-for="preset in gradientPresets"
                          :key="preset.value"
                          :class="[
                            'gradient-preset-btn',
                            { active: enterpriseInfo.mainColors === preset.value }
                          ]"
                          :style="{ background: preset.value }"
                          :title="preset.name"
                          @click="enterpriseInfo.mainColors = preset.value"
                        ></button>
                      </div>
                      <div class="gradient-editor">
                        <div class="gradient-editor-row">
                          <span class="gradient-label">起始色</span>
                          <input
                            v-model="gradientStart"
                            type="color"
                            class="color-input-sm"
                            @input="applyGradient"
                          />
                          <input
                            v-model="gradientStart"
                            type="text"
                            class="color-text-sm"
                            @input="applyGradient"
                          />
                        </div>
                        <div class="gradient-editor-row">
                          <span class="gradient-label">结束色</span>
                          <input
                            v-model="gradientEnd"
                            type="color"
                            class="color-input-sm"
                            @input="applyGradient"
                          />
                          <input
                            v-model="gradientEnd"
                            type="text"
                            class="color-text-sm"
                            @input="applyGradient"
                          />
                        </div>
                        <div class="gradient-editor-row">
                          <span class="gradient-label">角度</span>
                          <input
                            v-model.number="gradientAngle"
                            type="range"
                            min="0"
                            max="360"
                            class="angle-slider"
                            @input="applyGradient"
                          />
                          <span class="angle-value">{{ gradientAngle }}°</span>
                        </div>
                      </div>
                    </div>

                    <button class="close-picker-btn" @click="showColorPicker = false">×</button>
                  </div>
                </div>
              </div>

              <div class="form-group form-group-full">
                <label>网站类型</label>
                <select v-model="enterpriseInfo.websiteType">
                  <option value="">请选择</option>
                  <option value="企业官网">企业官网</option>
                  <option value="品牌展示站">品牌展示站</option>
                  <option value="产品介绍站">产品介绍站</option>
                  <option value="营销落地页">营销落地页</option>
                  <option value="个人作品集">个人作品集</option>
                </select>
              </div>

              <div class="form-group form-group-full">
                <label>网站设计理念</label>
                <textarea
                  v-model="enterpriseInfo.designPhilosophy"
                  rows="3"
                  placeholder="描述网站的设计风格、核心特色、用户体验追求等..."
                ></textarea>
              </div>
            </div>

            <!-- 参考示例 -->
            <div class="form-group form-group-full">
              <div class="reference-header" @click="showReferenceExample = !showReferenceExample">
                <label class="reference-title">
                  <span class="expand-icon" :class="{ expanded: showReferenceExample }">▶</span>
                  参考示例
                </label>
                <span class="expand-hint">{{
                  showReferenceExample ? '点击收起' : '点击展开'
                }}</span>
              </div>
              <div v-show="showReferenceExample" class="reference-example">
                <div class="ref-item">
                  <span class="ref-label">企业名称:</span>
                  <span class="ref-value">深圳AI网络有限公司</span>
                </div>
                <div class="ref-item">
                  <span class="ref-label">所属行业:</span>
                  <span class="ref-value">科技/互联网</span>
                </div>
                <div class="ref-item">
                  <span class="ref-label">企业简介:</span>
                  <span class="ref-value"
                    >深圳AI网络有限公司是一家专注于前沿人工智能技术研发与商业应用的高科技企业。公司致力于为全球企业提供高效、智能的数字化转型方案，核心业务涵盖智能客服系统、企业级大数据分析平台及自动化营销工具。</span
                  >
                </div>
                <div class="ref-item">
                  <span class="ref-label">目标受众:</span>
                  <span class="ref-value"
                    >寻求数字化转型的中大型企业管理者（CEO/CTO）、互联网科技公司、电商品牌方</span
                  >
                </div>
                <div class="ref-item">
                  <span class="ref-label">品牌主色:</span>
                  <span class="ref-value">深空蓝（#0F172A）搭配 电光紫（#7C3AED）</span>
                </div>
                <div class="ref-item">
                  <span class="ref-label">网站类型:</span>
                  <span class="ref-value">企业官网</span>
                </div>
                <div class="ref-item">
                  <span class="ref-label">网站设计理念:</span>
                  <span class="ref-value">
                    采用"未来极简主义"风格。在深空蓝的沉浸式背景下，运用电光紫的线性渐变与微发光效果勾勒核心元素，营造高端、神秘的科技氛围。布局上强调"呼吸感"与逻辑层级，大量留白以突出核心数据与业务价值。</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="enterprise-modal-footer">
            <button class="btn btn-ghost" @click="closeEnterpriseModal">取消</button>
            <button class="btn btn-primary" @click="closeEnterpriseModal">💾 保存</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 模板选择全屏弹窗 -->
    <Teleport to="body">
      <div
        v-if="showTemplateModal"
        class="template-modal-overlay"
        @click.self="closeTemplateModal"
      >
        <div class="template-modal">
          <div class="template-modal-header">
            <div class="modal-title">
              <h3>🎭 选择页面模板</h3>
              <p>选择一个模板作为网站的滚动/布局框架，组件将嵌入此框架内展示</p>
            </div>
            <div class="header-actions">
              <button class="template-nav-btn" @click="openTemplatePage">查看模板页面</button>
              <button class="close-btn" @click="closeTemplateModal">×</button>
            </div>
          </div>
          <div class="template-modal-body">
            <!-- 模板搜索框 -->
            <div class="template-search-row">
              <div class="template-search-wrapper">
                <span class="template-search-icon">🔍</span>
                <input
                  v-model="templateSearchQuery"
                  type="text"
                  class="template-search-input"
                  placeholder="搜索模板名称或 key，如：无限滚动、parallax..."
                />
                <button
                  v-if="templateSearchQuery"
                  class="template-search-clear"
                  @click="templateSearchQuery = ''"
                >✕</button>
              </div>
              <button
                :class="['template-filter-btn', { active: templateShowFavoritesOnly }]"
                :title="templateShowFavoritesOnly ? '显示全部' : '仅看收藏'"
                @click="templateShowFavoritesOnly = !templateShowFavoritesOnly"
              >
                <svg viewBox="0 0 24 24" :fill="templateShowFavoritesOnly ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>收藏</span>
              </button>
            </div>
            <div class="template-grid">
              <!-- 无模板选项（始终显示，不参与过滤） -->
              <button
                :class="['template-card', { active: selectedTemplateKey.length === 0 }]"
                @click="clearTemplates"
              >
                <div class="template-card-icon">🚫</div>
                <div class="template-card-label">不使用模板</div>
                <div class="template-card-desc">生成无框架基础页面</div>
                <div class="template-card-check">{{ selectedTemplateKey.length === 0 ? '✓' : '' }}</div>
              </button>
              <!-- 过滤后的模板列表 -->
              <button
                v-for="tpl in filteredTemplateList"
                :key="tpl.key"
                :class="['template-card', { active: selectedTemplateKey.includes(tpl.key), favorited: isTemplateFavorite(tpl.key) }]"
                @click="toggleTemplate(tpl.key)"
              >
                <div class="template-card-icon">📄</div>
                <div class="template-card-label">{{ tpl.label }}</div>
                <div class="template-card-key">{{ tpl.key }}</div>
                <button
                  class="template-fav-btn"
                  :class="{ favorited: isTemplateFavorite(tpl.key) }"
                  :title="isTemplateFavorite(tpl.key) ? '取消收藏' : '收藏'"
                  @click.stop="toggleTemplateFavorite(tpl.key)"
                >
                  <svg viewBox="0 0 24 24" :fill="isTemplateFavorite(tpl.key) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
                <div class="template-card-check">{{ selectedTemplateKey.includes(tpl.key) ? '✓' : '' }}</div>
              </button>
              <!-- 无搜索结果 -->
              <div v-if="filteredTemplateList.length === 0" class="template-empty">
                <span class="empty-icon">🔍</span>
                <span>没有找到匹配的模板，试试其他关键词</span>
              </div>
            </div>
          </div>
          <div class="template-modal-footer">
            <button class="btn btn-primary" @click="closeTemplateModal">✓ 确认</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 错误提示弹窗 -->
    <Teleport to="body">
      <Transition name="error-fade">
        <div v-if="showErrorModal" class="error-toast">
          <div class="error-toast-content">
            <span class="error-icon">{{ errorModalTitle.includes('❌') ? '❌' : '⚠️' }}</span>
            <div class="error-text">
              <strong>{{ errorModalTitle }}</strong>
              <p>{{ errorModalMessage }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
// ==================== 布局样式 ====================
.web-list {
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;

  // ==================== 顶部悬浮分类选项卡 ====================
  .category-tabs {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    z-index: 999999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

    .tab-btn {
      padding: 8px 18px;
      background: transparent;
      border: none;
      border-radius: 25px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      &.active {
        color: #fff;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      &.generate-btn {
        color: #fff;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        font-weight: 600;

        &:hover {
          background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
          transform: scale(1.05);
        }
      }
    }
  }

  // ==================== V2.0 语义搜索框 (方案四) ====================
  .search-bar {
    position: fixed;
    top: 85px; // 在 category-tabs 下方
    left: 50%;
    transform: translateX(-50%);
    z-index: 999998;
    width: 410px;
    max-width: 90vw;

    .search-input-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 50px;
      padding: 6px 14px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

      .search-icon {
        font-size: 1.1rem;
        flex-shrink: 0;
      }

      .search-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #fff;
        font-size: 0.95rem;
        padding: 8px 0;
        min-width: 0;
        letter-spacing: 0.3px;

        &::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.9rem;
        }
      }

      .search-clear-btn {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.7);
        cursor: pointer;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.2s;

        &:hover {
          background: rgba(255, 80, 80, 0.3);
          color: #ff6b6b;
        }
      }

      .search-spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
        flex-shrink: 0;
      }
    }

    &.active .search-input-wrapper {
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 4px 24px rgba(102, 126, 234, 0.25);
    }

    // 搜索结果下拉面板
    .search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: rgba(15, 23, 42, 0.97);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      max-height: 420px;
      overflow-y: auto;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
      padding: 12px;
      animation: dropdownSlideIn 0.2s ease;

      .search-results-list {
        .results-header {
          padding: 6px 8px 10px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 6px;
        }

        .search-result-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;

          &:hover {
            background: rgba(102, 126, 234, 0.15);
          }

          .result-score {
            width: 32px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            font-size: 0.72rem;
            font-weight: 700;
            flex-shrink: 0;

            &.score-high {
              background: rgba(67, 233, 123, 0.25);
              color: #43e97b;
            }
            &.score-mid {
              background: rgba(250, 176, 5, 0.25);
              color: #fab005;
            }
            &.score-low {
              background: rgba(255, 255, 255, 0.1);
              color: rgba(255, 255, 255, 0.5);
            }
          }

          .result-name {
            flex: 1;
            font-size: 0.85rem;
            font-weight: 500;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .result-category {
            font-size: 0.7rem;
            color: rgba(255, 255, 255, 0.45);
            background: rgba(255, 255, 255, 0.06);
            padding: 2px 8px;
            border-radius: 8px;
            flex-shrink: 0;
          }
        }
      }

      .search-empty {
        padding: 24px;
        text-align: center;
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.85rem;
      }
    }
  }

  // ==================== 卡片信息 ====================
  .card-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);

    .card-name {
      font-size: 0.9rem;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.4);
      padding: 4px 12px;
      border-radius: 20px;
      backdrop-filter: blur(4px);
    }

    .select-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.15);
        background: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: rgba(102, 126, 234, 0.4);
        box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
      }
    }

    .module-tag {
      font-size: 0.75rem;
      background: rgba(67, 233, 123, 0.3);
      padding: 4px 10px;
      border-radius: 20px;
      white-space: nowrap;
    }

    .module-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(67, 233, 123, 0.3);
      backdrop-filter: blur(4px);
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.15);
        background: rgba(67, 233, 123, 0.5);
      }
    }

    .favorite-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.15);
        background: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: rgba(255, 0, 0, 0.3);
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
      }
    }

    .copy-code-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(67, 233, 123, 0.3);
      backdrop-filter: blur(4px);
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.15);
        background: rgba(67, 233, 123, 0.5);
      }
    }
  }

  .page {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
  }

  .page-header {
    text-align: center;
    margin-bottom: 60px;

    .page-index {
      display: inline-block;
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.1);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      margin: 0 0 12px 0;
    }

    .page-desc {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      max-width: 500px;
    }
  }
}

// ==================== Page1 主页面样式 ====================
.page1 {
  background: linear-gradient(
    135deg,
    #0c0c1e 0%,
    #1a0a2e 15%,
    #2d1b4a 30%,
    #1e3a5f 50%,
    #0d3b4a 70%,
    #0a2a3a 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;
  position: relative;
  overflow: hidden;

  // 背景特效层
  .page1-bg-effects {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;

    // CSS 粒子层 - 极光幻彩
    .particles {
      position: absolute;
      inset: 0;
      overflow: hidden;

      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(255, 105, 180, 0.6);
        box-shadow:
          calc(var(--x1, 10) * 1px) calc(var(--y1, 20) * 1px) 0 rgba(255, 105, 180, 0.8),
          calc(var(--x2, 30) * 1px) calc(var(--y2, 40) * 1px) 0 rgba(138, 43, 226, 0.7),
          calc(var(--x3, 50) * 1px) calc(var(--y3, 60) * 1px) 0 rgba(0, 191, 255, 0.6),
          calc(var(--x4, 70) * 1px) calc(var(--y4, 80) * 1px) 0 rgba(100, 255, 218, 0.5);
        animation: particleFloat 20s linear infinite;
      }

      &::after {
        width: 2px;
        height: 2px;
        animation-delay: -10s;
        animation-duration: 25s;
        background: rgba(255, 255, 255, 0.5);
        box-shadow:
          calc(var(--x5, 15) * 1px) calc(var(--y5, 25) * 1px) 0 rgba(255, 182, 193, 0.7),
          calc(var(--x6, 45) * 1px) calc(var(--y6, 55) * 1px) 0 rgba(173, 216, 230, 0.6),
          calc(var(--x7, 85) * 1px) calc(var(--y7, 95) * 1px) 0 rgba(221, 160, 221, 0.5);
      }
    }

    @keyframes particleFloat {
      0% {
        transform: translateY(100vh) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) translateX(100px);
        opacity: 0;
      }
    }

    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    // 额外气泡粒子容器
    .extra-bubbles {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;

      .bubble-particle {
        position: absolute;
        border-radius: 50%;
        animation: bubbleFloat 20s linear infinite;

        &::before {
          content: '';
          position: absolute;
          top: 15%;
          left: 20%;
          width: 30%;
          height: 30%;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          filter: blur(1px);
        }
      }
    }

    @keyframes bubbleFloat {
      0% {
        transform: translateY(100vh) translateX(0) scale(0);
        opacity: 0;
      }
      5% {
        transform: translateY(95vh) translateX(10px) scale(1);
        opacity: 0.8;
      }
      25% {
        transform: translateY(75vh) translateX(-15px) scale(1.1);
        opacity: 0.9;
      }
      50% {
        transform: translateY(50vh) translateX(20px) scale(1);
        opacity: 0.8;
      }
      75% {
        transform: translateY(25vh) translateX(-10px) scale(0.95);
        opacity: 0.7;
      }
      95% {
        opacity: 0.4;
      }
      100% {
        transform: translateY(-10vh) translateX(15px) scale(0.8);
        opacity: 0;
      }
    }

    // 浮动光球 - 极光幻彩
    .floating-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(70px);
      opacity: 0.7;
      animation: orbFloat 10s ease-in-out infinite;

      &.orb-1 {
        width: 450px;
        height: 450px;
        background: radial-gradient(
          circle,
          rgba(138, 43, 226, 0.5) 0%,
          rgba(75, 0, 130, 0.3) 40%,
          transparent 70%
        );
        top: -120px;
        right: -100px;
        animation-delay: 0s;
      }

      &.orb-2 {
        width: 380px;
        height: 380px;
        background: radial-gradient(
          circle,
          rgba(0, 191, 255, 0.45) 0%,
          rgba(138, 43, 226, 0.25) 40%,
          transparent 70%
        );
        bottom: 20%;
        left: -80px;
        animation-delay: -3s;
      }

      &.orb-3 {
        width: 320px;
        height: 320px;
        background: radial-gradient(
          circle,
          rgba(255, 105, 180, 0.4) 0%,
          rgba(0, 191, 255, 0.2) 40%,
          transparent 70%
        );
        bottom: -50px;
        right: 20%;
        animation-delay: -6s;
      }
    }

    @keyframes orbFloat {
      0%,
      100% {
        transform: translate(0, 0) scale(1);
        opacity: 0.7;
      }
      33% {
        transform: translate(30px, -40px) scale(1.1);
        opacity: 0.9;
      }
      66% {
        transform: translate(-20px, 20px) scale(0.95);
        opacity: 0.6;
      }
    }

    // 光束效果 - 极光幻彩
    .light-beam {
      position: absolute;
      width: 2px;
      height: 100%;
      background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(255, 105, 180, 0.15) 30%,
        rgba(138, 43, 226, 0.2) 50%,
        rgba(0, 191, 255, 0.15) 70%,
        transparent 100%
      );
      animation: beamPulse 4s ease-in-out infinite;

      &.beam-1 {
        left: 15%;
        animation-delay: 0s;
      }
      &.beam-2 {
        left: 35%;
        animation-delay: -1s;
      }
      &.beam-3 {
        left: 65%;
        animation-delay: -2s;
      }
      &.beam-4 {
        left: 85%;
        animation-delay: -3s;
      }
    }

    @keyframes beamPulse {
      0%,
      100% {
        opacity: 0.3;
        transform: scaleY(1);
      }
      50% {
        opacity: 0.6;
        transform: scaleY(1.1);
      }
    }

    // 酷炫网格层 - 多层效果
    .grid-lines {
      position: absolute;
      inset: 0;

      // 底层：透视网格（模拟地平线）
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60%;
        background:
          linear-gradient(to bottom, transparent 0%, rgba(138, 43, 226, 0.05) 100%),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 49px,
            rgba(138, 43, 226, 0.2) 49px,
            rgba(138, 43, 226, 0.2) 50px
          ),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 49px,
            rgba(0, 191, 255, 0.15) 49px,
            rgba(0, 191, 255, 0.15) 50px
          );
        transform: perspective(500px) rotateX(60deg);
        transform-origin: bottom;
        animation: perspectiveGrid 8s linear infinite;
      }

      // 中层：三角形网格图案
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(
            30deg,
            rgba(0, 180, 216, 0.1) 12%,
            transparent 12.5%,
            transparent 87%,
            rgba(0, 180, 216, 0.1) 87.5%
          ),
          linear-gradient(
            150deg,
            rgba(0, 180, 216, 0.1) 12%,
            transparent 12.5%,
            transparent 87%,
            rgba(0, 180, 216, 0.1) 87.5%
          ),
          linear-gradient(
            30deg,
            rgba(0, 180, 216, 0.1) 12%,
            transparent 12.5%,
            transparent 87%,
            rgba(0, 180, 216, 0.1) 87.5%
          ),
          linear-gradient(
            150deg,
            rgba(0, 180, 216, 0.1) 12%,
            transparent 12.5%,
            transparent 87%,
            rgba(0, 180, 216, 0.1) 87.5%
          ),
          linear-gradient(
            60deg,
            rgba(0, 212, 170, 0.08) 25%,
            transparent 25.5%,
            transparent 75%,
            rgba(0, 212, 170, 0.08) 75%
          ),
          linear-gradient(
            60deg,
            rgba(0, 212, 170, 0.08) 25%,
            transparent 25.5%,
            transparent 75%,
            rgba(0, 212, 170, 0.08) 75%
          );
        background-size: 80px 140px;
        background-position:
          0 0,
          0 0,
          40px 70px,
          40px 70px,
          0 0,
          40px 70px;
        opacity: 0.6;
        animation: triangleGrid 15s linear infinite;
      }
    }

    @keyframes perspectiveGrid {
      0% {
        background-position:
          0 0,
          0 0,
          0 0;
      }
      100% {
        background-position:
          0 50px,
          0 50px,
          0 50px;
      }
    }

    @keyframes triangleGrid {
      0% {
        background-position:
          0 0,
          0 0,
          40px 70px,
          40px 70px,
          0 0,
          40px 70px;
      }
      100% {
        background-position:
          0 -140px,
          0 -140px,
          40px -70px,
          40px -70px,
          0 -140px,
          40px -70px;
      }
    }

    // 网格节点高光点 - 极光幻彩
    .grid-dots {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255, 105, 180, 0.5) 1px, transparent 1px);
      background-size: 100px 100px;
      animation: dotPulse 3s ease-in-out infinite;
    }

    @keyframes dotPulse {
      0%,
      100% {
        opacity: 0.3;
      }
      50% {
        opacity: 0.7;
      }
    }

    // 脉冲圆环效果 - 极光幻彩
    .pulse-ring {
      position: absolute;
      border: 1px solid rgba(255, 105, 180, 0.4);
      border-radius: 50%;
      animation: ringExpand 4s ease-out infinite;

      &.ring-1 {
        width: 200px;
        height: 200px;
        top: 20%;
        right: 15%;
        animation-delay: 0s;
      }

      &.ring-2 {
        width: 300px;
        height: 300px;
        bottom: 30%;
        left: 10%;
        animation-delay: -1.5s;
      }

      &.ring-3 {
        width: 150px;
        height: 150px;
        top: 60%;
        right: 30%;
        animation-delay: -3s;
      }
    }

    @keyframes ringExpand {
      0% {
        transform: scale(0.5);
        opacity: 0.8;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }

    // 扫描线效果 - 极光幻彩
    .scanline {
      position: absolute;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 105, 180, 0.4),
        rgba(0, 191, 255, 0.3),
        transparent
      );
      animation: scanDown 6s linear infinite;
      opacity: 0.6;
    }

    @keyframes scanDown {
      0% {
        top: -5%;
        opacity: 0;
      }
      10% {
        opacity: 0.5;
      }
      90% {
        opacity: 0.5;
      }
      100% {
        top: 105%;
        opacity: 0;
      }
    }
  }

  // 主内容区 - 宽松布局
  .page1-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 120px 20px 100px;
    text-align: center;
  }

  // Hero 标签
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    margin-bottom: 32px;

    .badge-icon {
      font-size: 1rem;
      animation: sparkle 1.5s ease-in-out infinite;
    }

    .badge-text {
      font-size: 0.8rem;
      font-weight: 600;
      color: #fff;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  @keyframes sparkle {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }

  // 主标题 - 3D 立体效果
  .page-title {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 900;
    line-height: 1.1;
    margin: 0 0 40px 0;
    transform-style: preserve-3d;
    position: relative;

    .title-line {
      display: block;
      position: relative;
      transform-style: preserve-3d;

      // 3D 透视容器 - 精致阴影
      &::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        top: 0;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.8) 0%,
          rgba(200, 200, 255, 0.5) 50%,
          transparent 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        transform: translateY(2px) translateZ(-5px);
        filter: blur(1px);
        opacity: 0.4;
        z-index: -1;
      }
    }

    .char {
      display: inline-block;
      position: relative;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-style: preserve-3d;
      animation: float3d 3s ease-in-out infinite;

      // 立体多层阴影 - 极光青配色
      text-shadow:
          // 青色柔和发光
        0 0 15px rgba(0, 245, 212, 0.5),
        0 0 30px rgba(0, 245, 212, 0.3),
        // 2层凸起
        1px 1px 0 #0a3d3d,
        2px 2px 0 #082828,
        // 柔和底部阴影
        0 4px 8px rgba(0, 0, 0, 0.3);

      // 内发光效果
      &::before {
        content: attr(data-char);
        position: absolute;
        left: 0;
        top: 0;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.7) 0%,
          rgba(200, 255, 250, 0.4) 50%,
          transparent 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        transform: translateZ(1px);
      }

      &.accent {
        background: linear-gradient(
          135deg,
          #00d4aa 0%,
          #00b4d8 25%,
          #0077b6 50%,
          #023e8a 75%,
          #03045e 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        background-size: 200% 200%;
        animation:
          gradientShift 4s ease infinite,
          float3d 3s ease-in-out infinite;

        // 极光蓝字符的精致阴影
        text-shadow:
          0 0 20px rgba(0, 180, 216, 0.6),
          0 0 40px rgba(0, 119, 182, 0.4),
          2px 2px 0 #012a4a,
          0 4px 8px rgba(0, 0, 0, 0.3);

        &::before {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(200, 250, 255, 0.4) 40%,
            transparent 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }

      &:hover {
        transform: translateY(-6px) scale(1.1) rotateX(8deg);
        text-shadow:
          0 0 25px rgba(255, 200, 87, 0.9),
          0 0 50px rgba(255, 180, 50, 0.6),
          1px 1px 0 #3d2a00,
          2px 2px 0 #2a1d00,
          0 6px 12px rgba(0, 0, 0, 0.4);
      }
    }

    // 字符交错动画延迟
    .char:nth-child(1) {
      animation-delay: 0s;
    }
    .char:nth-child(2) {
      animation-delay: 0.1s;
    }
    .char:nth-child(3) {
      animation-delay: 0.2s;
    }
    .char:nth-child(4) {
      animation-delay: 0.3s;
    }
    .char:nth-child(5) {
      animation-delay: 0.4s;
    }
    .char:nth-child(6) {
      animation-delay: 0.5s;
    }
    .char:nth-child(7) {
      animation-delay: 0.6s;
    }
  }

  @keyframes float3d {
    0%,
    100% {
      transform: translateY(0) rotateX(0deg) rotateY(0deg);
    }
    25% {
      transform: translateY(-3px) rotateX(2deg) rotateY(1deg);
    }
    50% {
      transform: translateY(-6px) rotateX(0deg) rotateY(0deg);
    }
    75% {
      transform: translateY(-3px) rotateX(-2deg) rotateY(-1deg);
    }
  }

  @keyframes gradientShift {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  // 副标题
  .page-desc {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 32px;
    max-width: 600px;
    line-height: 1.6;

    .desc-word {
      display: inline-block;
      margin-right: 10px;
      transition: all 0.3s ease;

      &:hover {
        color: #00d9ff;
        transform: translateY(-2px);
      }
    }
  }

  // 功能标签组
  .feature-tags {
    display: flex;
    gap: 16px;
    margin-bottom: 36px;
    flex-wrap: wrap;
    justify-content: center;

    .tag {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-3px) scale(1.05);
      }

      .tag-icon {
        font-size: 1rem;
      }

      &.tag-primary {
        background: linear-gradient(
          135deg,
          rgba(99, 102, 241, 0.3) 0%,
          rgba(168, 85, 247, 0.3) 100%
        );
        border: 1px solid rgba(99, 102, 241, 0.5);
        color: #fff;
      }

      &.tag-gradient {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        border: none;
        color: #fff;
        box-shadow: 0 4px 20px rgba(240, 147, 251, 0.4);
      }

      &.tag-success {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        border: none;
        color: #1a1a2e;
        box-shadow: 0 4px 20px rgba(67, 233, 123, 0.4);
      }
    }
  }

  // 中文信息区 - 宽松布局
  .chinese-info {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 800px;

    @media (max-width: 640px) {
      gap: 8px;
    }

    .info-block {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      transition: all 0.3s ease;
      cursor: default;

      &:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(0, 180, 216, 0.5);
        transform: translateY(-2px);
      }

      &.highlight {
        background: linear-gradient(
          135deg,
          rgba(0, 180, 216, 0.25) 0%,
          rgba(0, 119, 182, 0.2) 100%
        );
        border-color: rgba(0, 180, 216, 0.6);
      }

      .info-icon {
        font-size: 1rem;
      }

      .info-text {
        font-size: 0.85rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  // 组件统计 - 宽松
  .component-stats {
    display: flex;
    align-items: center;
    gap: 32px;
    padding: 12px 28px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;

    .stat-number {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;

      .stat-value {
        font-family: 'Poppins', sans-serif;
        font-size: 1.8rem;
        font-weight: 800;
        background: linear-gradient(135deg, #00d4aa 0%, #00b4d8 50%, #0077b6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-label {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }

    .stat-divider {
      width: 1px;
      height: 36px;
      background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent);
    }
  }

  // 滚动指示器 - 宽松
  .scroll-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    span {
      width: 20px;
      height: 20px;
      border-right: 2px solid rgba(255, 255, 255, 0.5);
      border-bottom: 2px solid rgba(255, 255, 255, 0.5);
      transform: rotate(45deg);
      animation: scrollBounce 1.5s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.2s;
        opacity: 0.6;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
        opacity: 0.3;
      }
    }
  }

  @keyframes scrollBounce {
    0%,
    100% {
      transform: rotate(45deg) translateY(0);
      opacity: 1;
    }
    50% {
      transform: rotate(45deg) translateY(8px);
      opacity: 0.5;
    }
  }
}

.page-card-1 {
  background: linear-gradient(135deg, #77b3e3 0%, #4a90d9 100%);
}

.page-card-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.page-card-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.page-card-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.page-card-5 {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

/* ═══════════════ 🔑 分页控件 + 加载更多按钮 ═══════════════ */
.load-more-container {
  display: flex;
  justify-content: center;
  padding: 40px 0 20px;
  z-index: 30;
  position: relative;
  // 与页面深色背景融合
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.pagination-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  color: rgba(200, 210, 230, 0.85);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:hover:not(:disabled) {
    background: rgba(20, 30, 50, 0.9);
    border-color: rgba(255, 255, 255, 0.18);
    color: rgba(220, 235, 255, 0.95);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.page-info {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(180, 195, 220, 0.55);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.page-jump-input {
  width: 52px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  color: rgba(210, 225, 250, 0.9);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  // 隐藏 number 输入框的上下箭头
  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    border-color: rgba(130, 170, 220, 0.5);
    box-shadow: 0 0 12px rgba(100, 150, 220, 0.15);
  }

  &::placeholder {
    color: rgba(150, 165, 190, 0.35);
    font-weight: 400;
  }
}

.load-more-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 40px;
  border-radius: 50px;
  // 🔑 与 category-tabs 主题一致
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  color: rgba(200, 210, 230, 0.85);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  &:hover:not(:disabled) {
    background: rgba(20, 30, 50, 0.9);
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(100, 150, 220, 0.1);
    color: rgba(220, 235, 255, 0.95);
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    transition: transform 0.1s ease;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.load-more-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-top-color: rgba(180, 200, 230, 0.7);
  border-radius: 50%;
  animation: loadMoreSpin 0.6s linear infinite;
}

@keyframes loadMoreSpin {
  to { transform: rotate(360deg); }
}

.load-more-count {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(180, 195, 220, 0.45);
  font-family: 'Courier New', monospace;
}

.page-footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  .page-title {
    color: #fff;
  }

  .page-desc {
    color: rgba(255, 255, 255, 0.6);
  }
}

// ==================== 滚动指示器 ====================
.scroll-indicator {
  position: absolute;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  span {
    width: 30px;
    height: 30px;
    border-right: 3px solid #fff;
    border-bottom: 3px solid #fff;
    transform: rotate(45deg);
    animation: scrollBounce 1.5s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
      opacity: 0.7;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
      opacity: 0.4;
    }
  }
}

@keyframes scrollBounce {
  0%,
  100% {
    transform: rotate(45deg) translateY(0);
    opacity: 1;
  }
  50% {
    transform: rotate(45deg) translateY(15px);
    opacity: 0.5;
  }
}

// ==================== 已选组件面板 ====================
.selection-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 500px;
  //max-height: 60vh;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  z-index: 9998;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(102, 126, 234, 0.1);
  overflow: hidden;
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(102, 126, 234, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}

// 关闭面板按钮
.selection-panel-close {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: #94a3b8;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
  line-height: 1;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.4);
    color: #f87171;
  }
}

// 面板关闭时的浮动恢复按钮
.selection-panel-float-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.3);
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95));
  backdrop-filter: blur(12px);
  box-shadow:
    0 6px 24px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(102, 126, 234, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 9997;
  animation: float-btn-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  .float-icon {
    font-size: 1.3rem;
  }

  .float-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 10px;
    background: #ef4444;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    transform: scale(1.12);
    border-color: rgba(102, 126, 234, 0.6);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.5),
      0 0 30px rgba(102, 126, 234, 0.3);
  }
}

@keyframes float-btn-in {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

// 模板选择按钮 + 全屏弹窗
.selection-template-btn {
  padding: 8px 14px;
  background: rgba(255, 193, 7, 0.12);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  color: #ffc107;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    transform: scale(1.05);
    background: rgba(255, 193, 7, 0.2);
    border-color: rgba(255, 193, 7, 0.5);
  }

  &.active {
    background: rgba(255, 193, 7, 0.25);
    box-shadow: 0 0 12px rgba(255, 193, 7, 0.3);
    border-color: rgba(255, 193, 7, 0.6);
    color: #ffe082;
  }
}

.template-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999999;
  backdrop-filter: blur(12px);
  animation: fadeIn 0.2s ease-out;
}

.template-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 24px;
  width: 95%;
  max-width: 860px;
  max-height: 86vh;
  min-height: 520px;
  height: 800px;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.template-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px;
  background: rgba(255, 193, 7, 0.08);
  border-bottom: 1px solid rgba(255, 193, 7, 0.15);

  .modal-title {
    h3 {
      color: #ffc107;
      font-size: 1.4rem;
      margin: 0 0 8px;
    }
    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .template-nav-btn {
    padding: 8px 20px;
    background: linear-gradient(135deg, #ffc107, #ff9800);
    border: none;
    border-radius: 10px;
    color: #1a1a2e;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.3s;
    flex-shrink: 0;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(255, 193, 7, 0.4);
    }
  }

  .close-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s;
    flex-shrink: 0;

    &:hover {
      background: rgba(255, 100, 100, 0.3);
      color: #ff6b6b;
      transform: rotate(90deg);
    }
  }
}

.template-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  min-height: 400px;
}

.template-search-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.template-search-wrapper {
  position: relative;
  flex: 1;

  .template-search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.4);
    pointer-events: none;
  }

  .template-search-input {
    width: 100%;
    padding: 12px 44px 12px 40px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    color: #e8eaff;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.3s;

    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }

    &:focus {
      border-color: rgba(255, 193, 7, 0.4);
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 16px rgba(255, 193, 7, 0.1);
    }
  }

  .template-search-clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 6px;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 100, 100, 0.3);
      color: #ff6b6b;
    }
  }
}

.template-filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  white-space: nowrap;
  transition: all 0.3s;
  flex-shrink: 0;

  svg {
    flex-shrink: 0;
    transition: all 0.3s;
  }

  &:hover {
    background: rgba(255, 213, 79, 0.1);
    border-color: rgba(255, 213, 79, 0.25);
    color: rgba(255, 213, 79, 0.7);
  }

  &.active {
    background: rgba(255, 213, 79, 0.15);
    border-color: rgba(255, 213, 79, 0.4);
    color: #FFD54F;
    box-shadow: 0 0 16px rgba(255, 213, 79, 0.15);
  }
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.template-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 140px;
  padding: 20px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  position: relative;

  &:hover {
    border-color: rgba(255, 193, 7, 0.4);
    background: rgba(255, 193, 7, 0.06);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(255, 193, 7, 0.12);
  }

  &.active {
    border-color: rgba(255, 193, 7, 0.6);
    background: rgba(255, 193, 7, 0.12);
    box-shadow: 0 0 20px rgba(255, 193, 7, 0.15);

    .template-card-label {
      color: #ffc107;
    }
  }

  &:hover .template-fav-btn:not(.favorited) {
    opacity: 1;
    transform: scale(1);
  }

  &.favorited {
    border-color: rgba(255, 193, 7, 0.25);
  }

  .template-card-icon {
    font-size: 2rem;
    margin-bottom: 4px;
  }

  .template-card-label {
    color: #e8eaff;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .template-card-key {
    color: rgba(255, 255, 255, 0.35);
    font-size: 0.7rem;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    word-break: break-all;
  }

  .template-card-desc {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.75rem;
  }

  .template-card-check {
    position: absolute;
    top: 10px;
    right: 12px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 193, 7, 0.15);
    border-radius: 50%;
    color: #ffc107;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .template-fav-btn {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    opacity: 0;
    transform: scale(0.7);
    z-index: 1;

    &:hover {
      background: rgba(255, 213, 79, 0.25);
      color: #FFD54F;
      transform: scale(1.18) !important;
    }

    &:active {
      transform: scale(0.85) !important;
      transition: all 0.08s;
    }

    &.favorited {
      opacity: 1;
      transform: scale(1);
      color: #FFD54F;
      background: rgba(255, 213, 79, 0.15);
      box-shadow: 0 0 12px rgba(255, 213, 79, 0.2);
    }

    &.favorited:hover {
      background: rgba(255, 107, 157, 0.18);
      color: #FF6B9D;
      box-shadow: 0 0 14px rgba(255, 107, 157, 0.25);
    }
  }
}

.template-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;

  .empty-icon {
    font-size: 2.5rem;
    opacity: 0.5;
  }
}

.template-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 32px;
  background: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

// 模板弹窗响应式
@media (max-width: 768px) {
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .template-card {
    height: 120px;
    padding: 16px 8px;
  }
}

@media (max-width: 480px) {
  .template-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}

.selection-enterprise-btn {
  padding: 2px 5px;
  background: rgba(67, 233, 123, 0.15);
  border: 1px solid rgba(67, 233, 123, 0.3);
  border-radius: 8px;
  color: #43e97b;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    background: rgba(67, 233, 123, 0.25);
    border-color: rgba(67, 233, 123, 0.5);
  }

  &.active {
    background: rgba(67, 233, 123, 0.25);
    box-shadow: 0 0 10px rgba(67, 233, 123, 0.3);
  }
}

.selection-module-btn {
  padding: 8px 14px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.05);
    background: rgba(102, 126, 234, 0.25);
    border-color: rgba(102, 126, 234, 0.5);
  }
}

// 已选组件标题栏
.selection-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.15);

  .title-content {
    display: flex;
    align-items: center;
    gap: 10px;

    .title-icon {
      font-size: 1.2rem;
      animation: pulse-subtle 2s ease-in-out infinite;
    }

    .title-text {
      color: #e8eaff;
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .title-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 26px;
      height: 26px;
      padding: 0 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 13px;
      color: #fff;
      font-size: 0.8rem;
      font-weight: 700;
      box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
    }
  }

  .title-actions {
    display: flex;
    gap: 8px;
  }

  .title-reset {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.2);
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 107, 107, 0.2);
      border-color: rgba(255, 107, 107, 0.4);
      transform: rotate(180deg);
    }
  }

  .title-collapse {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: rgba(102, 126, 234, 0.2);
      border-color: rgba(102, 126, 234, 0.3);
      color: #667eea;
    }
  }
}

@keyframes pulse-subtle {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.selection-list {
  max-height: 500px;
  overflow-y: auto;
  padding: 12px;
  transition: all 0.3s ease;

  &.collapsed {
    max-height: 0;
    padding: 0 12px;
    overflow: hidden;
    opacity: 0;
  }
}

.selection-module-group {
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  overflow: hidden;

  &.unassigned {
    border: 1px dashed rgba(255, 200, 100, 0.4);
  }
}

.selection-module-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);

  span {
    color: #a8b8ff;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .count {
    margin-left: auto;
    color: rgba(255, 255, 255, 0.5);
    font-weight: normal;
    font-size: 0.8rem;
  }
}

.selection-module-items {
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selection-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .item-name {
    color: #fff;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-add {
    padding: 2px 6px;
    background: rgba(67, 233, 123, 0.2);
    border: none;
    border-radius: 4px;
    color: #43e97b;
    font-size: 0.75rem;
    cursor: pointer;

    &:hover {
      background: rgba(67, 233, 123, 0.4);
    }
  }

  .item-remove {
    padding: 2px 6px;
    background: rgba(255, 100, 100, 0.2);
    border: none;
    border-radius: 4px;
    color: #ff6b6b;
    font-size: 0.75rem;
    cursor: pointer;

    &:hover {
      background: rgba(255, 100, 100, 0.4);
    }
  }
}

// ==================== 模块选择器弹窗 ====================
.module-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  backdrop-filter: blur(8px);
}

.module-selector {
  background: linear-gradient(135deg, #1a1a2e 0%, #302b63 100%);
  border-radius: 20px;
  padding: 28px;
  max-width: 650px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.module-selector-header {
  margin-bottom: 20px;
  position: relative;

  h4 {
    color: #fff;
    font-size: 1.2rem;
    margin-bottom: 8px;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }

  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.module-position-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.module-pos-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;

  &:hover {
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  }

  .pos-icon {
    font-size: 2rem;
  }

  .pos-label {
    color: #fff;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .pos-desc {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .pos-used-by {
    margin-top: 6px;
    padding: 4px 8px;
    background: rgba(255, 100, 100, 0.15);
    border-radius: 6px;
    font-size: 0.7rem;
    color: #ff8888;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &.add-new {
    border: 2px dashed rgba(102, 126, 234, 0.4);
    background: rgba(102, 126, 234, 0.05);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    &::before {
      display: none;
    }

    &:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.15);
      transform: translateY(-4px);

      .pos-icon {
        animation: pulse 1s infinite;
      }
    }

    .pos-icon {
      font-size: 2rem;
    }
  }

  .pos-empty {
    margin-top: 6px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.4);
  }

  &.selected {
    border-color: rgba(67, 233, 123, 0.5);
    background: rgba(67, 233, 123, 0.08);
  }
}

.module-selector-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

// ==================== 企业信息弹窗 ====================
.enterprise-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  backdrop-filter: blur(8px);
}

.enterprise-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #302b63 100%);
  border-radius: 20px;
  max-width: 700px;
  width: 90%;
  max-height: 86vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.enterprise-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 28px;
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .modal-title {
    h3 {
      margin: 0 0 8px;
      color: #fff;
      font-size: 1.3rem;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.enterprise-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
}

.enterprise-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 28px;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

// ==================== 错误提示弹窗 ====================
.error-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999999;
  background: linear-gradient(135deg, rgba(255, 80, 80, 0.95) 0%, rgba(220, 50, 50, 0.95) 100%);
  border-radius: 16px;
  padding: 16px 24px;
  box-shadow:
    0 10px 40px rgba(255, 80, 80, 0.4),
    0 0 20px rgba(255, 80, 80, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  animation: toast-shake 0.5s ease-in-out;
}

.error-toast-content {
  display: flex;
  align-items: center;
  gap: 12px;

  .error-icon {
    font-size: 1.8rem;
    animation: shake 0.5s ease-in-out;
  }

  .error-text {
    color: #fff;

    strong {
      display: block;
      font-size: 1rem;
      margin-bottom: 4px;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
  }
}

@keyframes toast-shake {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  20% {
    transform: translateX(-50%) translateY(-10px);
  }
  40% {
    transform: translateX(-50%) translateY(10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
  80% {
    transform: translateX(-50%) translateY(5px);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(-15deg);
  }
  40% {
    transform: rotate(15deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  80% {
    transform: rotate(10deg);
  }
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

// 表单样式
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  &-full {
    grid-column: span 2;
  }

  label {
    display: block;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 500;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: #fff;
    font-size: 0.95rem;
    transition: all 0.3s;

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    &:focus {
      outline: none;
      border-color: rgba(102, 126, 234, 0.6);
      background: rgba(102, 126, 234, 0.06);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    option {
      background: #1a1a2e;
      color: #fff;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' fill-opacity='0.5' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 40px;
  }
}

// 颜色选择器
.color-picker-wrapper {
  position: relative;
}

.color-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-text-input {
  flex: 1;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
}

.color-picker-btn {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  .picker-icon {
    font-size: 1.1rem;
    filter: grayscale(1) brightness(2);
  }

  &:hover {
    transform: scale(1.05);
    border-color: rgba(255, 255, 255, 0.4);
  }
}

.color-picker-popup {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
  padding: 16px;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;

  .close-picker-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }
  }
}

.mode-tabs {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 12px;
}

.mode-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;

  .mode-icon {
    font-size: 0.9rem;

    &.gradient-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.8);
  }

  &.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
    color: #fff;
  }
}

.mode-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.color-preset-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.color-preset-btn {
  aspect-ratio: 1;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  &.active {
    border-color: #fff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5);
    transform: scale(1.1);
  }
}

.custom-color-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 8px;

  .section-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
  }

  .color-text-input-sm {
    width: 80px;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #fff;
    font-size: 0.85rem;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
}

.color-input {
  width: 36px;
  height: 32px;
  padding: 2px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
}

.gradient-presets {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.gradient-preset-btn {
  aspect-ratio: 1;
  border-radius: 6px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  &.active {
    border-color: #fff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5);
    transform: scale(1.1);
  }
}

.gradient-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.gradient-editor-row {
  display: flex;
  align-items: center;
  gap: 10px;

  .gradient-label {
    width: 50px;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .color-input-sm {
    width: 32px;
    height: 28px;
    padding: 2px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 3px;
    }
  }

  .color-text-sm {
    width: 80px;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    color: #fff;
    font-size: 0.8rem;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }

  .angle-slider {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: #667eea;
      border-radius: 50%;
      cursor: pointer;
    }
  }

  .angle-value {
    width: 40px;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
  }
}

// 参考示例
.reference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(102, 126, 234, 0.12);
  }

  .reference-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    color: #667eea;
    font-weight: 500;
  }

  .expand-icon {
    font-size: 0.75rem;
    color: #667eea;
    transition: transform 0.3s;

    &.expanded {
      transform: rotate(90deg);
    }
  }

  .expand-hint {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
  }
}

.reference-example {
  margin-top: 12px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .ref-item {
    display: flex;
    gap: 12px;

    .ref-label {
      flex-shrink: 0;
      width: 100px;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.85rem;
    }

    .ref-value {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.85rem;
      line-height: 1.5;
    }
  }
}

// 按钮样式
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;

  &-ghost {
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
  }

  &-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
  }
}

// ==================== 全屏弹窗 ====================
.fullscreen-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  backdrop-filter: blur(12px);
  animation: fadeIn 0.2s ease-out;
}

.fullscreen-modal {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 24px;
  width: 95%;
  max-width: 950px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .modal-title {
    h3 {
      color: #fff;
      font-size: 1.4rem;
      margin: 0 0 6px;
    }
    p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.95rem;
      margin: 0;
    }
  }

  .modal-close {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 100, 100, 0.3);
      color: #ff6b6b;
      transform: rotate(90deg);
    }
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 32px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

// 编辑输入框样式
.edit-input {
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.5);
    background: rgba(102, 126, 234, 0.1);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  &.edit-input-full {
    flex: 1;
  }

  &.edit-input-wide {
    flex: 2;
    min-width: 200px;
  }
}

.mt-4 {
  margin-top: 16px;
}

// 模块编辑器列表
.module-editor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-editor-row {
  display: flex;
  gap: 10px;
  align-items: center;

  .edit-input {
    flex: 1;
  }

  .remove-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 100, 100, 0.15);
    border: 1px solid rgba(255, 100, 100, 0.3);
    border-radius: 8px;
    color: #ff6b6b;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;

    &:hover {
      background: rgba(255, 100, 100, 0.3);
      transform: scale(1.1);
    }
  }
}

// ==================== Loading 界面样式 ====================
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  backdrop-filter: blur(10px);
}

.loading-content {
  text-align: center;
  color: #fff;
}

.loading-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;

  &:nth-child(1) {
    border-top-color: #667eea;
    animation: spin 1.5s linear infinite;
  }

  &:nth-child(2) {
    border-right-color: #764ba2;
    animation: spin 2s linear infinite reverse;
  }

  &:nth-child(3) {
    border-bottom-color: #f093fb;
    animation: spin 2.5s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse-badge {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes dropdownSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
}

.loading-progress-bar {
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin: 0 auto 10px;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
}

.loading-progress-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}
</style>
