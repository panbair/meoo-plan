import { describe, expect, it } from 'vitest'
import { createE2EGenerator, type ChatFunction, type StreamFunction } from '../e2e-generator'

const noopChat: ChatFunction = async () => ({
  success: true,
  data: { content: '{}' }
})

const noopStream: StreamFunction = async () => ({
  success: true,
  data: { content: '' }
})

function getGenerator() {
  return createE2EGenerator({
    chatFn: noopChat,
    streamFn: noopStream,
    knowledgeBase: []
  })
}

describe('E2EGenerator sanitize/validate', () => {
  it('applies sanitization rules and reports them in quality warnings', () => {
    const generator = getGenerator() as any

    const dirtyHtml = `<!DOCTYPE html><html><head></head><body>
<style>
body{background:var(--bg-primary)}
</style>
<div style=":rgba(255,255,255,0.1)">x</div>
<span classicon">📍</span>
<div style="margin-top:px">a</div>
<script>gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)</script>
</body></html>`

    const context = {
      style: {
        cssVariables: ':root {\n  --bg-primary: #111;\n  --text-primary: #fff;\n}'
      }
    }

    const sanitized = generator.sanitizeFinalHtml(dirtyHtml, context)

    expect(sanitized.html).toContain('class="icon">')
    expect(sanitized.html).toContain('style="background:rgba(255,255,255,0.1)')
    expect(sanitized.html).toContain('margin-top:4px')
    expect(sanitized.report.totalFixes).toBeGreaterThan(0)

    const quality = generator.phaseValidate(sanitized.html, sanitized.report)
    expect(quality.warnings.some((w: string) => w.includes('自动修复输出问题'))).toBe(true)
  })
})

