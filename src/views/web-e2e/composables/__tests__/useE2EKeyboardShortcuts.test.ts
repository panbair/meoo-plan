// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { createE2EKeyHandler } from '../useE2EKeyboardShortcuts'

describe('createE2EKeyHandler', () => {
  it('fires generate on Ctrl+Enter', () => {
    const onGenerate = vi.fn()
    const onCopy = vi.fn()
    const handler = createE2EKeyHandler({ onGenerate, onCopy })

    const event = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true })
    const preventDefault = vi.spyOn(event, 'preventDefault')

    handler(event)

    expect(onGenerate).toHaveBeenCalledTimes(1)
    expect(onCopy).not.toHaveBeenCalled()
    expect(preventDefault).toHaveBeenCalledTimes(1)
  })

  it('fires copy on Ctrl+S', () => {
    const onGenerate = vi.fn()
    const onCopy = vi.fn()
    const handler = createE2EKeyHandler({ onGenerate, onCopy })

    const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true })
    handler(event)

    expect(onGenerate).not.toHaveBeenCalled()
    expect(onCopy).toHaveBeenCalledTimes(1)
  })
})


