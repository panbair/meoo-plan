// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useE2EGenerationController } from '../useE2EGenerationController'

function buildController() {
  const description = ref('做一个科技感网站，包含首页和产品区')
  const companyName = ref('Acme')
  const companyIndustry = ref('AI')
  const companyDesc = ref('desc')
  const visualStyle = ref('tech')
  const colorPreference = ref('blue')
  const framework = ref<'react' | 'vue'>('react')
  const outputMode = ref<'single-html' | 'multi-file'>('single-html')
  const selectedTemplate = ref('')
  const templateRecommendation = ref<any>(null)

  const setPreviewCode = vi.fn()
  const clearPreview = vi.fn()
  const onSaveHistory = vi.fn()
  const notify = {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn()
  }

  const aiService = {
    generateWebsiteE2E: vi.fn(async (_request: any, onStream?: (chunk: any) => void) => {
      const html = '<!DOCTYPE html><html><body><section class="card">A</section></body></html>'
      onStream?.({ type: 'components', data: { selectedComponents: ['CardA'], reasoning: 'ok' } })
      onStream?.({
        type: 'telemetry',
        data: { kind: 'panel-metric', panelName: 'Hero', panelIndex: 0, outputLength: 1200, durationMs: 480, retries: 0 }
      })
      onStream?.({ type: 'code', content: html })
      onStream?.({
        type: 'telemetry',
        data: { kind: 'validation', score: 91, passed: true, sanitizeFixes: 2, issueCount: 0, warningCount: 1 }
      })
      return {
        mode: 'single-html',
        html,
        selectedComponents: ['CardA'],
        reasoning: 'ok',
        qualityReport: { score: 91, passed: true, issues: [], warnings: [] }
      }
    }),
    modifyCode: vi.fn(async (_request: any, onStream?: (chunk: any) => void) => {
      const html = '<!DOCTYPE html><html><body><section class="card">B</section></body></html>'
      onStream?.({ type: 'text', content: 'updating' })
      onStream?.({ type: 'code', content: html })
      return {
        html,
        explanation: 'updated'
      }
    }),
    validateGeneratedCode: vi.fn(() => ({ score: 80, passed: true, issues: [], warnings: [] }))
  }

  const flow = useE2EGenerationController({
    inputs: {
      description,
      companyName,
      companyIndustry,
      companyDesc,
      visualStyle,
      colorPreference,
      framework,
      outputMode,
      selectedTemplate,
      templateRecommendation
    },
    aiService,
    clearPreview,
    setPreviewCode,
    scrollChatToBottom: async () => {},
    onActivatePreview: () => {},
    onSaveHistory,
    notify
  })

  return { flow, aiService, setPreviewCode, onSaveHistory, notify }
}

describe('useE2EGenerationController', () => {
  it('generates and stores final code with history', async () => {
    const { flow, setPreviewCode, onSaveHistory, notify } = buildController()

    await flow.handleGenerate()

    expect(flow.generatedCode.value).toContain('>A<')
    expect(flow.selectedComponents.value).toEqual(['CardA'])
    expect(setPreviewCode).toHaveBeenCalled()
    expect(onSaveHistory).toHaveBeenCalledTimes(1)
    expect(flow.diagnostics.value.panelMetrics.length).toBe(1)
    expect(flow.diagnostics.value.totalPanelDurationMs).toBe(480)
    expect(flow.diagnostics.value.sanitizeFixes).toBe(2)
    expect(notify.success).toHaveBeenCalled()
  })

  it('modifies and can undo', async () => {
    const { flow } = buildController()

    await flow.handleGenerate()
    flow.chatInput.value = '改成 B 版本'
    await flow.handleModify()

    expect(flow.generatedCode.value).toContain('>B<')
    flow.undoLastModify()
    expect(flow.generatedCode.value).toContain('>A<')
  })
})


