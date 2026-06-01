// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick, ref } from 'vue'
import WebE2EPage from '../../index.vue'

const mocks = vi.hoisted(() => ({
  previewSetCodeMock: vi.fn(),
  previewClearMock: vi.fn(),
  previewDownloadMock: vi.fn(),
  generateWebsiteE2EMock: vi.fn(),
  modifyCodeMock: vi.fn(),
  validateGeneratedCodeMock: vi.fn(() => ({
    score: 88,
    passed: true,
    issues: [],
    warnings: []
  })),
  analyzeTemplateForComponentsMock: vi.fn(),
  messageSuccessMock: vi.fn(),
  messageErrorMock: vi.fn(),
  messageWarningMock: vi.fn()
}))

vi.mock('@/api/ai/ai.config', () => ({}))
vi.mock('@/api/ai', () => ({
  aiService: {
    generateWebsiteE2E: mocks.generateWebsiteE2EMock,
    modifyCode: mocks.modifyCodeMock,
    validateGeneratedCode: mocks.validateGeneratedCodeMock,
    analyzeTemplateForComponents: mocks.analyzeTemplateForComponentsMock
  }
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    success: mocks.messageSuccessMock,
    error: mocks.messageErrorMock,
    warning: mocks.messageWarningMock
  }
}))

vi.mock('@/composables/useCodePreview', () => ({
  useCodePreview: () => ({
    iframeRef: ref<HTMLIFrameElement | null>(null),
    scale: ref(1),
    darkMode: ref(true),
    setCode: mocks.previewSetCodeMock,
    clear: mocks.previewClearMock,
    download: mocks.previewDownloadMock
  })
}))

function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function inputText(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  element.value = value
  element.dispatchEvent(new Event('input', { bubbles: true }))
  await nextTick()
}

async function click(element: Element) {
  ;(element as HTMLButtonElement).click()
  await nextTick()
}

function mountPage() {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const app = createApp(WebE2EPage)
  app.mount(host)
  return {
    host,
    unmount: () => {
      app.unmount()
      host.remove()
    }
  }
}

describe('web-e2e flow integration', () => {
  beforeEach(() => {
    localStorage.clear()
    mocks.previewSetCodeMock.mockReset()
    mocks.previewClearMock.mockReset()
    mocks.previewDownloadMock.mockReset()
    mocks.generateWebsiteE2EMock.mockReset()
    mocks.modifyCodeMock.mockReset()
    mocks.analyzeTemplateForComponentsMock.mockReset()
    mocks.validateGeneratedCodeMock.mockClear()
    mocks.messageSuccessMock.mockReset()
    mocks.messageErrorMock.mockReset()
    mocks.messageWarningMock.mockReset()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('supports generate -> modify -> undo full loop', async () => {
    const htmlA = '<!DOCTYPE html><html><body><section class="card">A</section></body></html>'
    const htmlB = '<!DOCTYPE html><html><body><section class="card">B</section></body></html>'

    mocks.generateWebsiteE2EMock.mockImplementation(async (_request: any, onStream?: (chunk: any) => void) => {
      onStream?.({ type: 'components', data: { selectedComponents: ['CardAlpha'], reasoning: 'matched alpha' } })
      onStream?.({ type: 'code', content: htmlA })
      return {
        mode: 'single-html',
        html: htmlA,
        selectedComponents: ['CardAlpha'],
        reasoning: 'matched alpha',
        qualityReport: { score: 92, passed: true, issues: [], warnings: [] }
      }
    })

    mocks.modifyCodeMock.mockImplementation(async (_request: any, onChunk?: (chunk: any) => void) => {
      onChunk?.({ type: 'text', content: '正在应用修改...' })
      onChunk?.({ type: 'code', content: htmlB })
      return {
        html: htmlB,
        explanation: '已替换为 B 版'
      }
    })

    const { host, unmount } = mountPage()

    const textarea = host.querySelector('.e2e-textarea') as HTMLTextAreaElement
    await inputText(textarea, '做一个科技感官网，包含 Hero 和产品卡片区')

    const generateBtn = host.querySelector('.e2e-generate-btn') as HTMLButtonElement
    await click(generateBtn)

    await wait(400)
    expect(mocks.previewSetCodeMock).toHaveBeenCalled()
    expect(mocks.previewSetCodeMock.mock.calls.at(-1)?.[0]).toContain('>A<')

    const chatInput = host.querySelector('.e2e-chat-input') as HTMLInputElement
    await inputText(chatInput, '把主卡片文案改成 B')

    const sendBtn = host.querySelector('.e2e-chat-send-btn') as HTMLButtonElement
    await click(sendBtn)

    await wait(400)
    expect(mocks.previewSetCodeMock.mock.calls.at(-1)?.[0]).toContain('>B<')

    const undoBtn = host.querySelector('.e2e-chat-undo-btn') as HTMLButtonElement
    await click(undoBtn)

    await wait(120)
    expect(mocks.previewSetCodeMock.mock.calls.at(-1)?.[0]).toContain('>A<')

    unmount()
  })

  it('can restore older generation from history drawer', async () => {
    const htmlFirst = '<!DOCTYPE html><html><body><section class="card">FIRST</section></body></html>'
    const htmlSecond = '<!DOCTYPE html><html><body><section class="card">SECOND</section></body></html>'

    mocks.generateWebsiteE2EMock
      .mockImplementationOnce(async (_request: any, onStream?: (chunk: any) => void) => {
        onStream?.({ type: 'code', content: htmlFirst })
        return {
          mode: 'single-html',
          html: htmlFirst,
          selectedComponents: ['CardFirst'],
          reasoning: 'first',
          qualityReport: { score: 81, passed: true, issues: [], warnings: [] }
        }
      })
      .mockImplementationOnce(async (_request: any, onStream?: (chunk: any) => void) => {
        onStream?.({ type: 'code', content: htmlSecond })
        return {
          mode: 'single-html',
          html: htmlSecond,
          selectedComponents: ['CardSecond'],
          reasoning: 'second',
          qualityReport: { score: 86, passed: true, issues: [], warnings: [] }
        }
      })

    const { host, unmount } = mountPage()

    const textarea = host.querySelector('.e2e-textarea') as HTMLTextAreaElement
    const generateBtn = host.querySelector('.e2e-generate-btn') as HTMLButtonElement

    await inputText(textarea, '第一个版本，包含英雄区与产品卡片')
    await click(generateBtn)
    await wait(350)

    await inputText(textarea, '第二个版本，强调视觉冲击与品牌信息')
    await click(generateBtn)
    await wait(350)

    const historyToggleBtn = host.querySelector('.e2e-btn-icon') as HTMLButtonElement
    await click(historyToggleBtn)
    await wait(80)

    const historyItems = document.querySelectorAll('.e2e-history-item')
    expect(historyItems.length).toBeGreaterThanOrEqual(2)

    // 第 2 条应是更早的记录（FIRST）
    await click(historyItems[1])
    await wait(200)

    const codeBlockAfterRestore = host.querySelector('.e2e-code-block code')
    expect(codeBlockAfterRestore?.textContent || '').toContain('FIRST')

    unmount()
  })
})






