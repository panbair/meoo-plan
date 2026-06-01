export interface E2EDraftState {
  description: string
  companyName: string
  companyIndustry: string
  companyDesc: string
  visualStyle: string
  colorPreference: string
  framework: 'react' | 'vue'
  outputMode: 'single-html' | 'multi-file'
  selectedTemplate: string
}

export interface UseE2EDraftOptions {
  storageKey?: string
  debounceMs?: number
  getState: () => E2EDraftState
  applyState: (draft: Partial<E2EDraftState>) => void
}

const DEFAULT_STORAGE_KEY = 'web-e2e-draft-v1'
const DEFAULT_DEBOUNCE_MS = 300

/**
 * Encapsulates draft persistence for the web-e2e page.
 */
export function useE2EDraft(options: UseE2EDraftOptions) {
  const storageKey = options.storageKey || DEFAULT_STORAGE_KEY
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS
  let saveTimer: ReturnType<typeof setTimeout> | null = null

  function saveNow() {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(storageKey, JSON.stringify(options.getState()))
    } catch {
      // ignore private mode/quota errors
    }
  }

  function scheduleSave() {
    if (saveTimer) {
      clearTimeout(saveTimer)
    }
    saveTimer = setTimeout(() => {
      saveNow()
      saveTimer = null
    }, debounceMs)
  }

  function loadDraft() {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return
      const parsed = JSON.parse(raw) as Partial<E2EDraftState>
      options.applyState(parsed)
    } catch {
      // ignore malformed draft payload
    }
  }

  function cleanup() {
    if (saveTimer) {
      clearTimeout(saveTimer)
      saveTimer = null
    }
  }

  return {
    storageKey,
    saveNow,
    scheduleSave,
    loadDraft,
    cleanup
  }
}

