/**
 * 组件编排工作台 — 类型定义
 *
 * 核心概念：
 *   ComponentItem  = 组件库中的可选项（来自 web-list）
 *   TemplateItem   = 页面模板（来自 web-template）
 *   PanelMapping   = 将组件分配到模板的各个面板
 *   OrchestrationPlan = DeepSeek 生成的完整制作方案
 */

import type { ComponentCategory, ComponentKnowledge } from '@/api/ai/component-knowledge-builder'

// ==================== 组件相关 ====================

/** 用户可选择的组件项（扩展自知识库条目） */
export interface ComponentItem {
  /** 组件文件名（如 ScrollModernCards） */
  name: string
  /** 组件目录名（如 card-base/ScrollModernCards） */
  dirName: string
  /** 类别 */
  category: ComponentCategory
  /** 类别中文名 */
  categoryLabel: string
  /** 一行描述 */
  summary: string
  /** 视觉风格标签 */
  visualTags: string[]
  /** 适用场景标签 */
  sceneTags: string[]
  /** 复杂度 */
  complexity: 'low' | 'medium' | 'high'
  /** 是否有 Canvas */
  hasCanvas: boolean
  /** 是否有 3D */
  has3D: boolean
  /** 是否有 ScrollTrigger */
  hasScrollTrigger: boolean
  /** 源码路径（用于动态加载） */
  sourcePath: string
}

// ==================== 模板相关 ====================

/** 模板类别 */
export type TemplateCategory = 'scroll-basic' | 'scroll-effect' | 'transition' | 'creative'

/** 模板项 */
export interface TemplateItem {
  /** 模板 key（文件夹名） */
  key: string
  /** 中文标签 */
  label: string
  /** 模板类别 */
  category: TemplateCategory
  /** 类别中文名 */
  categoryLabel: string
  /** 源码路径 */
  sourcePath: string
  /** 面板数量（从模板源码解析） */
  panelCount: number
  /** 架构类型（A=onUpdate, B=timeline） */
  architecture: 'A' | 'B' | 'unknown'
}

// ==================== 映射与编排 ====================

/** 模板面板定义（从模板结构解析） */
export interface TemplatePanel {
  /** 面板序号 (0-based) */
  index: number
  /** 面板名称（业务语义） */
  name: string
  /** 面板用途描述 */
  purpose: string
  /** 分配到此面板的组件 */
  assignedComponents: ComponentItem[]
}

/** 组件-面板映射 */
export interface PanelMapping {
  panelIndex: number
  componentNames: string[]
}

// ==================== AI 分析 ====================

/** AI 实时分析结果 */
export interface AIAnalysis {
  /** 风格一致性评分 (0-100) */
  styleScore: number
  /** 组件兼容性 */
  compatibility: {
    level: 'excellent' | 'good' | 'fair' | 'poor'
    issues: string[]
    suggestions: string[]
  }
  /** 性能影响评估 */
  performance: {
    level: 'light' | 'moderate' | 'heavy'
    estimatedLoadTime: string
    mobileFriendly: boolean
    warnings: string[]
  }
  /** 创意建议 */
  creativeSuggestions: string[]
}

// ==================== 方案 ====================

/** 方案详细程度 */
export type PlanDetail = 'brief' | 'standard' | 'detailed'

/** 生成的制作方案 */
export interface OrchestrationPlan {
  /** 方案 ID */
  id: string
  /** 方案名称 */
  name: string
  /** 方案图标 */
  icon: string
  /** 生成时间 */
  createdAt: string
  /** 方案类型 */
  type: 'aggressive' | 'balanced' | 'conservative'
  /** 详细程度 */
  detail: PlanDetail
  /** 方案内容（Markdown） */
  content: string
  /** 元数据 */
  metadata: {
    componentCount: number
    templateKey: string
    panelCount: number
    estimatedHours: number
    complexityLevel: string
  }
}

/** 方案历史项 */
export interface PlanHistoryItem {
  id: string
  planId: string
  planName: string
  createdAt: string
  componentNames: string[]
  templateKey: string
  templateLabel: string
}

// ==================== 编排状态 ====================

/** 工作台步骤 */
export type WorkbenchStep = 'select-components' | 'select-template' | 'map-panels' | 'ai-chat' | 'view-plan'

/** 编排状态 */
export interface OrchestrationState {
  /** 当前步骤 */
  currentStep: WorkbenchStep
  /** 选中的组件列表 */
  selectedComponents: ComponentItem[]
  /** 选中的模板 */
  selectedTemplate: TemplateItem | null
  /** 模板面板列表 */
  templatePanels: TemplatePanel[]
  /** AI 分析结果 */
  aiAnalysis: AIAnalysis | null
  /** 是否正在 AI 分析 */
  isAnalyzing: boolean
  /** 生成的方案列表 */
  generatedPlans: OrchestrationPlan[]
  /** 当前查看的方案索引 */
  activePlanIndex: number
  /** 方案历史 */
  planHistory: PlanHistoryItem[]
  /** 当前方案详细程度 */
  planDetail: PlanDetail
  /** AI 是否已配置 */
  aiConfigured: boolean
}

// ==================== 组件库展示配置 ====================

/** 类别筛选配置 */
export interface CategoryFilter {
  key: string
  label: string
  count: number
  icon: string
}
