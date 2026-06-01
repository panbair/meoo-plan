import { describe, expect, it } from 'vitest'
import { useRunGuard } from '../useRunGuard'

describe('useRunGuard', () => {
  it('marks only latest run as current', () => {
    const guard = useRunGuard()

    const first = guard.start()
    const second = guard.start()

    expect(guard.isCurrent(first)).toBe(false)
    expect(guard.isCurrent(second)).toBe(true)
  })
})

