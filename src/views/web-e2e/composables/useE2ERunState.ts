import { computed, ref } from 'vue'

export type E2EPhase = 'idle' | 'generating' | 'modifying' | 'error'

/**
 * Centralized state machine for the generate/modify lifecycle.
 */
export function useE2ERunState() {
  const phase = ref<E2EPhase>('idle')
  const errorMessage = ref('')

  const isBusy = computed(() => phase.value === 'generating' || phase.value === 'modifying')

  function startGenerating() {
    phase.value = 'generating'
    errorMessage.value = ''
  }

  function startModifying() {
    phase.value = 'modifying'
    errorMessage.value = ''
  }

  function finishSuccess() {
    phase.value = 'idle'
    errorMessage.value = ''
  }

  function finishError(message: string) {
    phase.value = 'error'
    errorMessage.value = message
  }

  function clearError() {
    if (phase.value === 'error') {
      phase.value = 'idle'
    }
    errorMessage.value = ''
  }

  return {
    phase,
    errorMessage,
    isBusy,
    startGenerating,
    startModifying,
    finishSuccess,
    finishError,
    clearError
  }
}

