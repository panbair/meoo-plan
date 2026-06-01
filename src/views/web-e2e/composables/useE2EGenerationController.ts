import { computed, nextTick, ref, type Ref } from 'vue'
import { useRunGuard } from './useRunGuard'
import { useE2ERunState } from './useE2ERunState'
import type { TemplateComponentMapResult } from '@/api/ai'
import type { E2EHistoryItem } from './useE2EHistory'

interface QualityReport {
  score: number
  passed: boolean
  issues: string[]
  warnings: string[]
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  codeSnapshot?: string
}

interface PanelMetric {
  panelName: string
  panelIndex: number
  outputLength: number
  durationMs: number
  retries: number
}

interface GenerationDiagnostics {
  panelMetrics: PanelMetric[]
  totalPanelDurationMs: number
  sanitizeFixes: number
  sanitizeRuleHits: Array<{ ruleId: string; replacements: number }>
  qualityScore: number | null
  qualityPassed: boolean | null
  issueCount: number
  warningCount: number
}

interface GenerateRequestInput {
  description: Ref<string>
  companyName: Ref<string>
  companyIndustry: Ref<string>
  companyDesc: Ref<string>
  visualStyle: Ref<string>
  colorPreference: Ref<string>
  framework: Ref<'react' | 'vue'>
  outputMode: Ref<'single-html' | 'multi-file'>
  selectedTemplate: Ref<string>
  templateRecommendation: Ref<TemplateComponentMapResult | null>
}

interface UseE2EGenerationControllerOptions {
  inputs: GenerateRequestInput
  aiService: {
    generateWebsiteE2E: (request: Record<string, unknown>, onStream?: (chunk: any) => void) => Promise<any>
    modifyCode: (request: Record<string, unknown>, onStream?: (chunk: any) => void) => Promise<any>
    validateGeneratedCode: (code: string) => QualityReport
  }
  clearPreview: () => void
  setPreviewCode: (code: string) => void
  scrollChatToBottom: () => Promise<void>
  onActivatePreview: () => void
  onSaveHistory: (item: E2EHistoryItem) => void
  notify: {
    success: (msg: string) => void
    error: (msg: string) => void
    warning: (msg: string) => void
  }
}

const STREAM_PREVIEW_INTERVAL = 300
const PREVIEW_RENDER_DELAY = 120
const MAX_CHAT_HISTORY = 30
const MAX_CODE_SNAPSHOTS = 20

export function useE2EGenerationController(options: UseE2EGenerationControllerOptions) {
  const generatedCode = ref('')
  const selectedComponents = ref<string[]>([])
  const aiReasoning = ref('')
  const qualityReport = ref<QualityReport | null>(null)
  const generationTime = ref(0)
  const diagnostics = ref<GenerationDiagnostics>({
    panelMetrics: [],
    totalPanelDurationMs: 0,
    sanitizeFixes: 0,
    sanitizeRuleHits: [],
    qualityScore: null,
    qualityPassed: null,
    issueCount: 0,
    warningCount: 0
  })

  const chatInput = ref('')
  const chatHistory = ref<ChatMessage[]>([])
  const codeSnapshots = ref<string[]>([])

  const runState = useE2ERunState()
  const generationGuard = useRunGuard()
  const modifyGuard = useRunGuard()

  const isGenerating = computed(() => runState.phase.value === 'generating')
  const isModifying = computed(() => runState.phase.value === 'modifying')

  let generationTimer: ReturnType<typeof setInterval> | null = null
  let previewRenderTimer: ReturnType<typeof setTimeout> | null = null
  let lastPreviewCode = ''
  let lastStreamRender = 0

  function trimChatHistory() {
    if (chatHistory.value.length > MAX_CHAT_HISTORY) {
      chatHistory.value = chatHistory.value.slice(-MAX_CHAT_HISTORY)
    }
  }

  function updateStreamingMessage(index: number, content: string) {
    if (index >= 0 && index < chatHistory.value.length) {
      chatHistory.value[index].content = content
    }
  }

  function schedulePreviewRender(code: string, optionsLocal: { force?: boolean; immediate?: boolean } = {}) {
    const { force = false, immediate = false } = optionsLocal
    if (!force && code === lastPreviewCode) {
      return
    }

    const render = () => {
      options.setPreviewCode(code)
      lastPreviewCode = code
    }

    if (immediate) {
      if (previewRenderTimer) {
        clearTimeout(previewRenderTimer)
        previewRenderTimer = null
      }
      render()
      return
    }

    if (previewRenderTimer) {
      clearTimeout(previewRenderTimer)
    }
    previewRenderTimer = setTimeout(() => {
      render()
      previewRenderTimer = null
    }, PREVIEW_RENDER_DELAY)
  }

  function resetPreviewSchedulingState() {
    if (previewRenderTimer) {
      clearTimeout(previewRenderTimer)
      previewRenderTimer = null
    }
    lastPreviewCode = ''
  }

  function pushCodeSnapshot(code: string) {
    codeSnapshots.value.push(code)
    if (codeSnapshots.value.length > MAX_CODE_SNAPSHOTS) {
      codeSnapshots.value = codeSnapshots.value.slice(-MAX_CODE_SNAPSHOTS)
    }
  }

  function extractCodeSummary(code: string): string {
    const lines = code.split('\n').length
    const panels = (code.match(/<section\b/gi) || []).length
    const cards = (code.match(/class="[^"]*card[^"]*"/gi) || []).length
    const rootMatch = code.match(/:root\s*\{([^}]+)\}/)
    let theme = ''
    if (rootMatch) {
      const vars = rootMatch[1]
      const bg = vars.match(/--bg[^:]*:\s*([^;]+)/)
      const primary = vars.match(/--primary[^:]*:\s*([^;]+)/)
      if (bg || primary) {
        theme = `配色:${bg ? bg[1].trim() : '?'}/${primary ? primary[1].trim() : '?'}`
      }
    }
    return `[代码 ${lines}行, ${panels}面板, ${cards}卡片${theme ? ', ' + theme : ''}]`
  }

  function buildModifyHistory(chats: ChatMessage[]): Array<{ role: 'user' | 'assistant'; content: string }> {
    const result: Array<{ role: 'user' | 'assistant'; content: string }> = []
    for (const msg of chats) {
      if (msg.role === 'user' && msg.codeSnapshot) {
        result.push({
          role: 'user',
          content: `${extractCodeSummary(msg.codeSnapshot)}\n用户指令：${msg.content}`
        })
      } else {
        result.push({ role: msg.role, content: msg.content })
      }
    }
    return result
  }

  function getPrimaryCode(result: { html?: string; files?: Array<{ content?: string }> }): string {
    if (result.html && result.html.trim()) {
      return result.html
    }
    const fileCode = result.files?.[0]?.content
    return fileCode && fileCode.trim() ? fileCode : ''
  }

  async function handleGenerate() {
    const { description, companyName, companyIndustry, companyDesc, visualStyle, colorPreference, framework, outputMode, selectedTemplate, templateRecommendation } = options.inputs

    if (!description.value.trim() || isGenerating.value) {
      return
    }
    if (description.value.trim().length < 8) {
      options.notify.warning('需求描述过短，请补充目标、风格和页面结构后再生成')
      return
    }

    const runId = generationGuard.start()
    lastStreamRender = 0

    runState.startGenerating()
    generatedCode.value = ''
    selectedComponents.value = []
    aiReasoning.value = ''
    qualityReport.value = null
    diagnostics.value = {
      panelMetrics: [],
      totalPanelDurationMs: 0,
      sanitizeFixes: 0,
      sanitizeRuleHits: [],
      qualityScore: null,
      qualityPassed: null,
      issueCount: 0,
      warningCount: 0
    }
    resetPreviewSchedulingState()
    options.clearPreview()
    options.onActivatePreview()

    const startTime = Date.now()
    generationTimer = setInterval(() => {
      generationTime.value = Math.round((Date.now() - startTime) / 1000)
    }, 1000)

    try {
      let streamedCode = ''

      const result = await options.aiService.generateWebsiteE2E(
        {
          description: description.value,
          companyInfo: {
            name: companyName.value || undefined,
            industry: companyIndustry.value || undefined,
            description: companyDesc.value || undefined
          },
          visualStyle: visualStyle.value || undefined,
          colorPreference: colorPreference.value || undefined,
          templateKey: selectedTemplate.value || undefined,
          templatePanels: templateRecommendation.value?.panels?.map((p) => ({
            index: p.panelIndex,
            name: p.panelName,
            purpose: p.panelPurpose
          })),
          recommendedComponents: templateRecommendation.value || undefined,
          framework: framework.value,
          mode: outputMode.value
        },
        (chunk) => {
          if (!generationGuard.isCurrent(runId)) {
            return
          }
          if (chunk.type === 'components' && chunk.data) {
            selectedComponents.value = chunk.data.selectedComponents || []
            aiReasoning.value = chunk.data.reasoning || ''
          }
          if (chunk.type === 'code' && chunk.content) {
            streamedCode = chunk.content
            generatedCode.value = streamedCode
            const now = Date.now()
            if (!lastStreamRender || now - lastStreamRender > STREAM_PREVIEW_INTERVAL) {
              lastStreamRender = now
              schedulePreviewRender(streamedCode)
            }
          }
          if (chunk.type === 'reasoning' && chunk.content) {
            aiReasoning.value = chunk.content
          }
          if (chunk.type === 'telemetry' && chunk.data) {
            if (chunk.data.kind === 'panel-metric') {
              const metric: PanelMetric = {
                panelName: chunk.data.panelName || `Panel-${chunk.data.panelIndex ?? 0}`,
                panelIndex: Number(chunk.data.panelIndex || 0),
                outputLength: Number(chunk.data.outputLength || 0),
                durationMs: Number(chunk.data.durationMs || 0),
                retries: Number(chunk.data.retries || 0)
              }
              const existingIndex = diagnostics.value.panelMetrics.findIndex((m) => m.panelIndex === metric.panelIndex)
              if (existingIndex >= 0) {
                diagnostics.value.panelMetrics[existingIndex] = metric
              } else {
                diagnostics.value.panelMetrics.push(metric)
              }
              diagnostics.value.totalPanelDurationMs = diagnostics.value.panelMetrics.reduce((sum, m) => sum + m.durationMs, 0)
            }
            if (chunk.data.kind === 'validation') {
              diagnostics.value.sanitizeFixes = Number(chunk.data.sanitizeFixes || 0)
              diagnostics.value.sanitizeRuleHits = Array.isArray(chunk.data.sanitizeRules)
                ? chunk.data.sanitizeRules.map((r: any) => ({
                    ruleId: String(r.ruleId || 'unknown'),
                    replacements: Number(r.replacements || 0)
                  }))
                : []
              diagnostics.value.qualityScore = typeof chunk.data.score === 'number' ? chunk.data.score : null
              diagnostics.value.qualityPassed = typeof chunk.data.passed === 'boolean' ? chunk.data.passed : null
              diagnostics.value.issueCount = Number(chunk.data.issueCount || 0)
              diagnostics.value.warningCount = Number(chunk.data.warningCount || 0)
            }
          }
        }
      )

      if (!generationGuard.isCurrent(runId)) {
        return
      }

      const finalCode = getPrimaryCode(result)
      if (!finalCode) {
        throw new Error('AI 返回了空代码，请重试或调整需求描述')
      }

      generatedCode.value = finalCode
      selectedComponents.value = result.selectedComponents || selectedComponents.value
      aiReasoning.value = result.reasoning || aiReasoning.value

      await nextTick()
      schedulePreviewRender(generatedCode.value, { immediate: true, force: true })
      qualityReport.value = result.qualityReport || options.aiService.validateGeneratedCode(generatedCode.value)

      options.onSaveHistory({
        description: description.value,
        code: generatedCode.value,
        components: result.selectedComponents || selectedComponents.value,
        reasoning: result.reasoning || aiReasoning.value,
        time: new Date().toLocaleString()
      })

      const duration = Math.round((Date.now() - startTime) / 1000)
      runState.finishSuccess()
      options.notify.success(`生成完成（${duration}s）`)
    } catch (e: unknown) {
      if (generationGuard.isCurrent(runId)) {
        const message = e instanceof Error ? e.message : '未知错误'
        runState.finishError(message)
        options.notify.error('生成失败: ' + message)
      }
    } finally {
      if (generationGuard.isCurrent(runId)) {
        if (runState.phase.value === 'generating') {
          runState.finishSuccess()
        }
        generationTime.value = Math.round((Date.now() - startTime) / 1000)
      }
      if (generationTimer) {
        clearInterval(generationTimer)
        generationTimer = null
      }
    }
  }

  async function handleModify() {
    const instruction = chatInput.value.trim()
    if (!instruction || isModifying.value || !generatedCode.value) {
      return
    }

    const runId = modifyGuard.start()
    lastStreamRender = 0
    runState.startModifying()

    pushCodeSnapshot(generatedCode.value)

    chatHistory.value.push({
      role: 'user',
      content: instruction,
      codeSnapshot: generatedCode.value
    })
    chatInput.value = ''
    chatHistory.value.push({ role: 'assistant', content: '⏳ 正在思考...' })
    const streamingIdx = chatHistory.value.length - 1
    trimChatHistory()

    await options.scrollChatToBottom()

    try {
      let streamText = ''
      const historyForAI = buildModifyHistory(chatHistory.value.slice(0, -2))

      const result = await options.aiService.modifyCode(
        {
          currentCode: generatedCode.value,
          instruction,
          history: historyForAI,
          mode: options.inputs.outputMode.value
        },
        (chunk) => {
          if (!modifyGuard.isCurrent(runId)) {
            return
          }

          if (chunk.type === 'text' && chunk.content) {
            streamText += chunk.content
            updateStreamingMessage(
              streamingIdx,
              streamText.length > 500 ? streamText.substring(0, 500) + '...' : streamText
            )
          }

          if (chunk.type === 'code' && chunk.content) {
            generatedCode.value = chunk.content
            const now = Date.now()
            if (!lastStreamRender || now - lastStreamRender > STREAM_PREVIEW_INTERVAL) {
              lastStreamRender = now
              schedulePreviewRender(chunk.content)
            }
          }

          void options.scrollChatToBottom()
        }
      )

      if (!modifyGuard.isCurrent(runId)) {
        return
      }

      if (result.html) {
        generatedCode.value = result.html
        await nextTick()
        schedulePreviewRender(result.html, { immediate: true, force: true })
      }

      updateStreamingMessage(
        streamingIdx,
        result.explanation ? `✅ ${result.explanation}` : '✅ 已按要求修改代码'
      )
      trimChatHistory()
      runState.finishSuccess()
      options.notify.success('代码已更新')
    } catch (e: unknown) {
      if (modifyGuard.isCurrent(runId)) {
        codeSnapshots.value.pop()
        const message = e instanceof Error ? e.message : '未知错误'
        updateStreamingMessage(streamingIdx, '❌ 修改失败: ' + message)
        runState.finishError(message)
        options.notify.error('修改失败: ' + message)
      }
    } finally {
      if (modifyGuard.isCurrent(runId) && runState.phase.value === 'modifying') {
        runState.finishSuccess()
      }
      await options.scrollChatToBottom()
    }
  }

  function undoLastModify() {
    if (isModifying.value || codeSnapshots.value.length === 0) {
      return
    }

    const prevCode = codeSnapshots.value.pop()!
    generatedCode.value = prevCode
    nextTick(() => schedulePreviewRender(prevCode, { immediate: true, force: true }))
    chatHistory.value = chatHistory.value.slice(0, -2)
  }

  function applyHistory(item: E2EHistoryItem) {
    generatedCode.value = item.code
    selectedComponents.value = item.components
    aiReasoning.value = item.reasoning
    qualityReport.value = null
    nextTick(() => {
      if (item.code) {
        schedulePreviewRender(item.code, { immediate: true, force: true })
      }
    })
  }

  function refreshPreview(force = true) {
    if (generatedCode.value) {
      schedulePreviewRender(generatedCode.value, { force })
    }
  }

  function cleanup() {
    if (generationTimer) {
      clearInterval(generationTimer)
      generationTimer = null
    }
    resetPreviewSchedulingState()
  }

  return {
    runState,
    isGenerating,
    isModifying,
    generatedCode,
    selectedComponents,
    aiReasoning,
    qualityReport,
    diagnostics,
    generationTime,
    chatInput,
    chatHistory,
    handleGenerate,
    handleModify,
    undoLastModify,
    applyHistory,
    refreshPreview,
    cleanup
  }
}



