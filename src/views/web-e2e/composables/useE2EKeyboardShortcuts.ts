import { onUnmounted } from 'vue'

export interface E2EKeyboardActions {
  onGenerate: () => void
  onCopy: () => void
}

export function createE2EKeyHandler(actions: E2EKeyboardActions) {
  return (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      actions.onGenerate()
      return
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault()
      actions.onCopy()
    }
  }
}

export function useE2EKeyboardShortcuts(actions: E2EKeyboardActions) {
  const handler = createE2EKeyHandler(actions)

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handler)
  }

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handler)
    }
  })
}

