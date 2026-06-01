// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useE2EDraft, type E2EDraftState } from '../useE2EDraft'

describe('useE2EDraft', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loads valid draft and applies it', () => {
    localStorage.setItem('test-draft', JSON.stringify({ description: 'hello', framework: 'vue' }))

    const applied: Array<Partial<E2EDraftState>> = []
    const draft = useE2EDraft({
      storageKey: 'test-draft',
      getState: () => ({
        description: '',
        companyName: '',
        companyIndustry: '',
        companyDesc: '',
        visualStyle: '',
        colorPreference: '',
        framework: 'react',
        outputMode: 'single-html',
        selectedTemplate: ''
      }),
      applyState: (state) => applied.push(state)
    })

    draft.loadDraft()
    expect(applied).toHaveLength(1)
    expect(applied[0].description).toBe('hello')
    expect(applied[0].framework).toBe('vue')
  })

  it('debounces scheduleSave and persists latest state', () => {
    let current = 'v1'
    const draft = useE2EDraft({
      storageKey: 'test-draft',
      debounceMs: 200,
      getState: () => ({
        description: current,
        companyName: '',
        companyIndustry: '',
        companyDesc: '',
        visualStyle: '',
        colorPreference: '',
        framework: 'react',
        outputMode: 'single-html',
        selectedTemplate: ''
      }),
      applyState: () => {}
    })

    draft.scheduleSave()
    current = 'v2'
    draft.scheduleSave()

    vi.advanceTimersByTime(199)
    expect(localStorage.getItem('test-draft')).toBeNull()

    vi.advanceTimersByTime(1)
    const raw = localStorage.getItem('test-draft')
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw || '{}').description).toBe('v2')
  })
})

