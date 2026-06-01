import { describe, expect, it } from 'vitest'
import { useE2ERunState } from '../useE2ERunState'

describe('useE2ERunState', () => {
  it('transitions through generating and idle', () => {
    const state = useE2ERunState()

    state.startGenerating()
    expect(state.phase.value).toBe('generating')
    expect(state.isBusy.value).toBe(true)

    state.finishSuccess()
    expect(state.phase.value).toBe('idle')
    expect(state.isBusy.value).toBe(false)
  })

  it('keeps error message when failed', () => {
    const state = useE2ERunState()

    state.finishError('failed')
    expect(state.phase.value).toBe('error')
    expect(state.errorMessage.value).toBe('failed')

    state.clearError()
    expect(state.phase.value).toBe('idle')
    expect(state.errorMessage.value).toBe('')
  })
})

