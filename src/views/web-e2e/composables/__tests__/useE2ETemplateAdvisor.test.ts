import { describe, expect, it, vi } from 'vitest'
import { useE2ETemplateAdvisor } from '../useE2ETemplateAdvisor'

const TEMPLATES = [
  { key: 'dark-hero', label: '暗色英雄' },
  { key: 'tech-corp', label: '科技企业' }
]

function buildAdvisor() {
  const analyzeTemplate = vi.fn(async ({ templateKey }: { templateKey: string }) => ({
    templateKey,
    scrollPattern: 'full-page',
    visualStyle: 'dark',
    targetScenes: ['hero'],
    panels: [],
    analysis: 'looks good'
  }))
  const onAnalysisError = vi.fn()

  const advisor = useE2ETemplateAdvisor({
    templates: TEMPLATES,
    analyzeTemplate,
    onAnalysisError
  })

  const sourceLoader = vi.fn(async () => '<template>mock-source</template>')
  const readmeLoader = vi.fn(async () => '# Mock README')

  return { advisor, analyzeTemplate, onAnalysisError, sourceLoader, readmeLoader }
}

describe('useE2ETemplateAdvisor', () => {
  it('selects template and invokes analysis', async () => {
    const { advisor, analyzeTemplate, sourceLoader, readmeLoader } = buildAdvisor()

    await advisor.selectTemplate('dark-hero', '暗色英雄', sourceLoader, readmeLoader)

    expect(advisor.selectedTemplate.value).toBe('dark-hero')
    expect(advisor.selectedTemplateLabel.value).toBe('暗色英雄')
    expect(analyzeTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ templateKey: 'dark-hero', componentsPerPanel: 3 })
    )
    expect(advisor.templateRecommendation.value?.templateKey).toBe('dark-hero')
    expect(advisor.isAnalyzing.value).toBe(false)
  })

  it('toggles off when same template is selected again', async () => {
    const { advisor, analyzeTemplate, sourceLoader, readmeLoader } = buildAdvisor()

    await advisor.selectTemplate('dark-hero', '暗色英雄', sourceLoader, readmeLoader)
    expect(advisor.selectedTemplate.value).toBe('dark-hero')

    // selecting same key again should deselect
    await advisor.selectTemplate('dark-hero', '暗色英雄', sourceLoader, readmeLoader)
    expect(advisor.selectedTemplate.value).toBe('')
    expect(advisor.templateRecommendation.value).toBeNull()
    // second call should NOT trigger a new analysis
    expect(analyzeTemplate).toHaveBeenCalledTimes(1)
  })

  it('reports error and clears analysis flag when AI fails', async () => {
    const analyzeTemplate = vi.fn(async () => {
      throw new Error('AI unavailable')
    })
    const onAnalysisError = vi.fn()
    const advisor = useE2ETemplateAdvisor({
      templates: TEMPLATES,
      analyzeTemplate,
      onAnalysisError
    })

    await advisor.selectTemplate('tech-corp', '科技企业', async () => 'src', async () => 'readme')

    expect(advisor.selectedTemplate.value).toBe('tech-corp')
    expect(advisor.templateRecommendation.value).toBeNull()
    expect(advisor.isAnalyzing.value).toBe(false)
    expect(onAnalysisError).toHaveBeenCalledWith('tech-corp', expect.any(Error))
  })

  it('clearTemplate resets all state', async () => {
    const { advisor, sourceLoader, readmeLoader } = buildAdvisor()

    await advisor.selectTemplate('dark-hero', '暗色英雄', sourceLoader, readmeLoader)
    advisor.clearTemplate()

    expect(advisor.selectedTemplate.value).toBe('')
    expect(advisor.selectedTemplateLabel.value).toBe('')
    expect(advisor.templateRecommendation.value).toBeNull()
    expect(advisor.isAnalyzing.value).toBe(false)
  })
})

