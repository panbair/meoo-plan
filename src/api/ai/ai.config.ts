/**
 * AI服务配置
 * 
 * 从环境变量读取配置
 */

import type { AIConfig } from './index'

export const aiConfig: AIConfig = {
  provider: (import.meta.env.VITE_AI_PROVIDER as any) || 'qwen',
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  baseUrl: import.meta.env.VITE_AI_BASE_URL || '',
  model: import.meta.env.VITE_AI_MODEL || ''
}
