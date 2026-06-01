import { ref } from 'vue'

export interface E2EHistoryItem {
  description: string
  code: string
  components: string[]
  reasoning: string
  time: string
}

export interface UseE2EHistoryOptions {
  storageKey?: string
  maxCount?: number
}

const DEFAULT_STORAGE_KEY = 'e2e-history'
const DEFAULT_MAX_COUNT = 20

/**
 * Encapsulates history persistence so the page component can focus on generation flow.
 */
export function useE2EHistory(options: UseE2EHistoryOptions = {}) {
  const storageKey = options.storageKey || DEFAULT_STORAGE_KEY
  const maxCount = options.maxCount || DEFAULT_MAX_COUNT
  const history = ref<E2EHistoryItem[]>([])

  function load() {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) {
        history.value = []
        return
      }

      const parsed = JSON.parse(saved)
      if (!Array.isArray(parsed)) {
        history.value = []
        return
      }

      history.value = parsed.slice(0, maxCount)
    } catch {
      history.value = []
    }
  }

  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history.value))
    } catch {
      // ignore write errors (quota/private mode)
    }
  }

  function add(item: E2EHistoryItem) {
    history.value.unshift(item)
    if (history.value.length > maxCount) {
      history.value = history.value.slice(0, maxCount)
    }
    persist()
  }

  function clear() {
    history.value = []
    persist()
  }

  if (typeof window !== 'undefined') {
    load()
  }

  return {
    history,
    load,
    persist,
    add,
    clear,
    storageKey,
    maxCount
  }
}

