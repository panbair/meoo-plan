/**
 * AI服务配置
 * 
 * 使用方法：
 * 1. 复制此文件为 ai.config.ts
 * 2. 填入您的API密钥
 * 3. 不要将此文件提交到版本控制系统
 */

import type { AIConfig } from './index'

// ⚠️ 重要：请在 .env 文件中存储API密钥，不要硬编码在这里！

// 从环境变量读取配置（推荐方式）
export const aiConfig: AIConfig = {
  // AI提供商: 'qwen' | 'deepseek' | 'openai' | 'custom'
  provider: (import.meta.env.VITE_AI_PROVIDER as any) || 'qwen',
  
  // API密钥 - 请在 .env 文件中设置 VITE_AI_API_KEY
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  
  // 基础URL（可选）
  baseUrl: import.meta.env.VITE_AI_BASE_URL || '',
  
  // 模型名称（可选）
  model: import.meta.env.VITE_AI_MODEL || ''
}

// 手动配置示例（仅用于测试，生产环境请使用环境变量）
/*
export const aiConfig: AIConfig = {
  provider: 'qwen',  // 通义千问
  apiKey: 'your-api-key-here',  // ⚠️ 不要提交到Git
  baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
  model: 'qwen-max'
}
*/

/*
export const aiConfig: AIConfig = {
  provider: 'deepseek',  // DeepSeek
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat'
}
*/

/*
export const aiConfig: AIConfig = {
  provider: 'openai',  // OpenAI
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4'
}
*/
