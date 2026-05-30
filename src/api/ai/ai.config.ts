/**
 * AI服务配置
 * 
 * 从环境变量读取配置，并自动初始化 aiService
 */

import type { AIConfig } from './index'
import { aiService } from './index'

export const aiConfig: AIConfig = {
  provider: (import.meta.env.VITE_AI_PROVIDER as any) || 'qwen',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  baseUrl: import.meta.env.VITE_AI_BASE_URL || '',
  model: import.meta.env.VITE_AI_MODEL || '',
  e2eModel: import.meta.env.VITE_AI_E2E_MODEL || ''
}

// 自动配置 AI 服务
if (aiConfig.apiKey) {
  aiService.configure(aiConfig)
  console.log(`✅ AI 已初始化: ${aiConfig.provider} / ${aiConfig.model || 'default'}`)
} else {
  console.warn('⚠️ AI API Key 未配置，请在 .env 中设置 VITE_AI_API_KEY')
}
