import { ref } from 'vue'

/**
 * Protects async flows from stale responses overwriting current UI state.
 */
export function useRunGuard() {
  const currentRunId = ref(0)

  function start() {
    currentRunId.value += 1
    return currentRunId.value
  }

  function isCurrent(runId: number) {
    return runId === currentRunId.value
  }

  return {
    start,
    isCurrent,
    currentRunId
  }
}

