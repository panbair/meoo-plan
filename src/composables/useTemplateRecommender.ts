/**
 * useTemplateRecommender
 * 模板→组件智能关联的响应式 Composable
 *
 * 使用方式：
 *   const { recommend, isRecommending, recommendation, error } = useTemplateRecommender()
 *   await recommend('horizontal-scroll', '横向无限滚动', sourceCode, readme)
 */

import { ref } from 'vue'
import { aiService, type TemplateComponentMapResult } from '@/api/ai'

interface TemplateInfo {
  key: string
  label: string
  source: string
  readme?: string
}

export function useTemplateRecommender() {
  const isRecommending = ref(false)
  const recommendation = ref<TemplateComponentMapResult | null>(null)
  const error = ref<string | null>(null)

  async function recommend(tmpl: TemplateInfo): Promise<TemplateComponentMapResult | null> {
    isRecommending.value = true
    error.value = null
    recommendation.value = null

    try {
      const result = await aiService.analyzeTemplateForComponents({
        templateKey: tmpl.key,
        templateLabel: tmpl.label,
        sourceCode: tmpl.source,
        readme: tmpl.readme,
        componentsPerPanel: 3
      })
      recommendation.value = result
      return result
    } catch (e: any) {
      error.value = e?.message || 'AI 推荐失败'
      console.error('useTemplateRecommender 失败:', e)
      return null
    } finally {
      isRecommending.value = false
    }
  }

  async function batchRecommend(templates: TemplateInfo[], concurrency = 2) {
    isRecommending.value = true
    error.value = null

    try {
      const result = await aiService.analyzeAllTemplates(
        templates.map(t => ({
          key: t.key,
          label: t.label,
          source: t.source,
          readme: t.readme
        })),
        concurrency
      )
      return result
    } catch (e: any) {
      error.value = e?.message || '批量推荐失败'
      return null
    } finally {
      isRecommending.value = false
    }
  }

  function clear() {
    recommendation.value = null
    error.value = null
  }

  return {
    isRecommending,
    recommendation,
    error,
    recommend,
    batchRecommend,
    clear
  }
}
