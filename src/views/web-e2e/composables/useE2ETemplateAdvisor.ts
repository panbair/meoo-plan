import { ref } from 'vue'
import type { TemplateComponentMapResult } from '@/api/ai'

export interface TemplateOption {
  key: string
  label: string
}

interface AnalyzeRequest {
  templateKey: string
  templateLabel: string
  sourceCode: string
  readme: string
  componentsPerPanel: number
}

interface UseE2ETemplateAdvisorOptions {
  templates: TemplateOption[]
  analyzeTemplate: (request: AnalyzeRequest) => Promise<TemplateComponentMapResult>
  /** Optional: called with an error when analysis fails */
  onAnalysisError?: (key: string, error: unknown) => void
}

/**
 * Encapsulates template selection and AI-driven component recommendation.
 *
 * Responsibilities:
 *  - Toggle template selection
 *  - Lazy-load template source + README
 *  - Run AI analysis and expose the recommendation result
 */
export function useE2ETemplateAdvisor(options: UseE2ETemplateAdvisorOptions) {
  const selectedTemplate = ref('')
  const selectedTemplateLabel = ref('')
  const templateRecommendation = ref<TemplateComponentMapResult | null>(null)
  const isAnalyzing = ref(false)

  async function selectTemplate(
    key: string,
    label: string,
    sourceLoader: () => Promise<string>,
    readmeLoader: () => Promise<string>
  ) {
    // Toggle off
    if (selectedTemplate.value === key) {
      selectedTemplate.value = ''
      selectedTemplateLabel.value = ''
      templateRecommendation.value = null
      return
    }

    selectedTemplate.value = key
    selectedTemplateLabel.value = label
    templateRecommendation.value = null
    isAnalyzing.value = true

    try {
      const source = await sourceLoader()
      let readme = ''
      try {
        readme = await readmeLoader()
      } catch {
        // README is optional
      }

      templateRecommendation.value = await options.analyzeTemplate({
        templateKey: key,
        templateLabel: label,
        sourceCode: source,
        readme,
        componentsPerPanel: 3
      })
    } catch (e) {
      options.onAnalysisError?.(key, e)
    } finally {
      isAnalyzing.value = false
    }
  }

  function clearTemplate() {
    selectedTemplate.value = ''
    selectedTemplateLabel.value = ''
    templateRecommendation.value = null
    isAnalyzing.value = false
  }

  return {
    selectedTemplate,
    selectedTemplateLabel,
    templateRecommendation,
    isAnalyzing,
    selectTemplate,
    clearTemplate
  }
}

