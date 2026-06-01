// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { useE2EHistory } from '../useE2EHistory'

function createItem(id: number) {
  return {
    description: `desc-${id}`,
    code: `<div>${id}</div>`,
    components: [`c-${id}`],
    reasoning: `r-${id}`,
    time: `t-${id}`
  }
}

describe('useE2EHistory', () => {
  it('adds and persists with max count', () => {
    const key = 'e2e-history-test-1'
    localStorage.removeItem(key)

    const history = useE2EHistory({ storageKey: key, maxCount: 2 })
    history.add(createItem(1))
    history.add(createItem(2))
    history.add(createItem(3))

    expect(history.history.value).toHaveLength(2)
    expect(history.history.value[0].description).toBe('desc-3')
    expect(history.history.value[1].description).toBe('desc-2')
  })

  it('clear removes in-memory and storage data', () => {
    const key = 'e2e-history-test-2'
    localStorage.removeItem(key)

    const history = useE2EHistory({ storageKey: key })
    history.add(createItem(1))
    history.clear()

    expect(history.history.value).toHaveLength(0)
    expect(localStorage.getItem(key)).toBe('[]')
  })
})

