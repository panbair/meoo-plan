/**
 * 组件语义搜索 Composable
 *
 * V2.0 方案四：useComponentSearch
 * 为 web-list 页面提供搜索状态管理、防抖、模式切换
 *
 * @example
 * const { query, results, isSearching, searchMode, search, clear, toggleMode } = useComponentSearch()
 *
 * // 绑定到搜索框
 * <input v-model="query" @input="search" />
 *
 * // 展示结果
 * <div v-for="r in results" :key="r.name">{{ r.name }} ({{ r.score }}分)</div>
 */

import { ref, computed, watch } from 'vue'
import { searchComponents, type SearchResult } from '@/api/ai/component-search'

export type SearchMode = 'auto' | 'local' | 'ai'

export function useComponentSearch() {
  // ==================== 状态 ====================

  /** 搜索关键词 */
  const query = ref('')
  /** 搜索结果 */
  const results = ref<SearchResult[]>([])
  /** 是否正在搜索 */
  const isSearching = ref(false)
  /** 当前搜索模式 */
  const searchMode = ref<SearchMode>('local')
  /** AI 推理说明 */
  const reasoning = ref('')
  /** 建议标签 */
  const suggestedTags = ref<string[]>([])
  /** 已激活的模式（实际使用的） */
  const activeMode = ref<'local' | 'ai'>('local')
  /** 错误信息 */
  const error = ref('')
  /** 总组件数 */
  const totalComponents = ref(0)
  /** 已完成搜索标记 */
  const hasSearched = ref(false)

  // ==================== 计算属性 ====================

  /** 是否有结果 */
  const hasResults = computed(() => results.value.length > 0)
  /** 结果数量 */
  const resultCount = computed(() => results.value.length)
  /** 是否为 AI 深度搜索 */
  const isAIMode = computed(() => activeMode.value === 'ai')

  /** 按类别分组的结果 */
  const groupedResults = computed(() => {
    const groups: Record<string, SearchResult[]> = {}
    for (const r of results.value) {
      if (!groups[r.category]) groups[r.category] = []
      groups[r.category].push(r)
    }
    return groups
  })

  /** 按分数分层的 Top 结果 */
  const topResults = computed(() => {
    return results.value
      .filter(r => r.score >= 50)
      .slice(0, 10)
  })

  // ==================== 方法 ====================

  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  const DEBOUNCE_DELAY = 300 // 毫秒

  /**
   * 执行搜索（带防抖）
   */
  const search = () => {
    // 清除之前的防抖
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    const q = query.value.trim()

    // 空查询：清空结果
    if (!q) {
      results.value = []
      hasSearched.value = false
      error.value = ''
      reasoning.value = ''
      suggestedTags.value = []
      activeMode.value = 'local'
      return
    }

    // 少于2字符不触发搜索
    if (q.length < 2) return

    // 防抖
    debounceTimer = setTimeout(async () => {
      await doSearch()
    }, DEBOUNCE_DELAY)
  }

  /**
   * 立即搜索（不防抖）
   */
  const searchImmediate = async () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    await doSearch()
  }

  /**
   * 实际搜索逻辑
   */
  const doSearch = async () => {
    const q = query.value.trim()
    if (!q) return

    isSearching.value = true
    error.value = ''
    hasSearched.value = true

    try {
      const response = await searchComponents({
        query: q,
        mode: searchMode.value
      })

      results.value = response.results
      activeMode.value = response.mode
      reasoning.value = response.reasoning || ''
      suggestedTags.value = response.suggestedTags || []
      totalComponents.value = response.totalComponents

      if (response.mode === 'ai') {
        console.log(`🤖 AI 语义搜索完成: ${response.results.length} 个结果`)
        console.log('💭 AI 分析:', response.reasoning)
      } else {
        console.log(`🔍 本地搜索完成: ${response.results.length} 个结果`)
      }
    } catch (err: any) {
      error.value = err.message || '搜索失败'
      results.value = []
      console.error('搜索出错:', err)
    } finally {
      isSearching.value = false
    }
  }

  /**
   * 切换搜索模式
   */
  const toggleMode = (mode: SearchMode) => {
    searchMode.value = mode
    // 如果有查询词，重新搜索
    if (query.value.trim().length >= 2) {
      searchImmediate()
    }
  }

  /**
   * 设置搜索模式（AI/本地/自动）
   */
  const setMode = (mode: SearchMode) => {
    toggleMode(mode)
  }

  /**
   * 用标签快速搜索
   */
  const searchByTag = (tag: string) => {
    query.value = query.value ? `${query.value} ${tag}` : tag
    searchImmediate()
  }

  /**
   * 清空搜索
   */
  const clear = () => {
    query.value = ''
    results.value = []
    hasSearched.value = false
    error.value = ''
    reasoning.value = ''
    suggestedTags.value = []
    activeMode.value = 'local'
  }

  /**
   * 用组件名找到对应的搜索结果
   */
  const findByComponentName = (name: string): SearchResult | undefined => {
    return results.value.find(r => r.name === name)
  }

  // ==================== 生命周期 ====================

  // 监听查询变化（外部直接修改 query 时也能触发搜索）
  watch(query, (newVal) => {
    if (!newVal.trim()) {
      results.value = []
      hasSearched.value = false
      error.value = ''
    }
  })

  return {
    // 状态
    query,
    results,
    isSearching,
    searchMode,
    reasoning,
    suggestedTags,
    activeMode,
    error,
    totalComponents,
    hasSearched,

    // 计算属性
    hasResults,
    resultCount,
    isAIMode,
    groupedResults,
    topResults,

    // 方法
    search,
    searchImmediate,
    toggleMode,
    setMode,
    searchByTag,
    clear,
    findByComponentName
  }
}
