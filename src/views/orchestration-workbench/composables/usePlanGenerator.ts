/**
 * usePlanGenerator — 方案生成逻辑
 *
 * 调用 DeepSeek AI 生成企业网站制作方案
 */

import { ref } from 'vue'
import { useOrchestrationStore } from '../store/orchestrationStore'
import { aiService } from '@/api/ai'
import { aiConfig } from '@/api/ai/ai.config'
import type { OrchestrationPlan, PlanDetail } from '../types/orchestration'

export function usePlanGenerator() {
  const store = useOrchestrationStore()
  const isGenerating = ref(false)
  const generationProgress = ref('')
  const generationError = ref<string | null>(null)

  /** 检查 AI 是否可用 */
  function isAIAvailable(): boolean {
    const savedConfig = localStorage.getItem('ai-api-config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        return !!config.apiKey
      } catch { /* ignore */ }
    }
    return !!aiConfig.apiKey
  }

  /**
   * 生成方案（调用 DeepSeek AI）
   */
  async function generatePlan(detail: PlanDetail = 'standard'): Promise<OrchestrationPlan[]> {
    isGenerating.value = true
    generationError.value = null
    generationProgress.value = '正在分析您的组件和模板选择...'

    try {
      if (!isAIAvailable()) {
        // 无 AI 配置时使用本地模拟生成
        return await generateLocalPlan(detail)
      }

      // 使用专用编排方案生成方法
      generationProgress.value = '正在连接 DeepSeek AI...'

      const markdownContent = await aiService.generateOrchestrationPlan({
        selectedComponents: store.selectedComponents.map(c => ({
          name: c.name,
          category: c.categoryLabel,
          complexity: c.complexity,
          summary: c.summary
        })),
        selectedTemplate: store.selectedTemplate ? {
          key: store.selectedTemplate.key,
          label: store.selectedTemplate.label,
          panelCount: store.selectedTemplate.panelCount,
          architecture: store.selectedTemplate.architecture
        } : null,
        panelMappings: store.templatePanels.map(p => ({
          name: p.name,
          purpose: p.purpose,
          components: p.assignedComponents.map(c => c.name)
        })),
        userNotes: detail === 'detailed' ? '请生成最详细的方案，包含代码示例和具体配置参数' : undefined
      })

      generationProgress.value = '正在解析方案...'

      // 生成 3 套方案
      const plans: OrchestrationPlan[] = [
        createPlan('aggressive', markdownContent, detail),
        createPlan('balanced', markdownContent, detail),
        createPlan('conservative', markdownContent, detail)
      ]

      generationProgress.value = '方案生成完成！'
      return plans

    } catch (error: any) {
      console.error('方案生成失败:', error)
      generationError.value = error.message || '生成失败'
      // 降级到本地模拟
      return await generateLocalPlan(detail)
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * 本地模拟生成（无 AI 时的降级方案）
   */
  async function generateLocalPlan(detail: PlanDetail): Promise<OrchestrationPlan[]> {
    generationProgress.value = '使用本地模式生成方案...'

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    const content = buildLocalPlanContent()
    const plans: OrchestrationPlan[] = [
      createPlan('aggressive', content, detail),
      createPlan('balanced', content, detail),
      createPlan('conservative', content, detail)
    ]

    store.generatedPlans = plans
    store.activePlanIndex = 0
    return plans
  }

  /**
   * 构建 AI System Prompt
   */
  function buildSystemPrompt(): string {
    const template = store.selectedTemplate
    const components = store.selectedComponents
    const panels = store.templatePanels

    const componentList = components.map(c =>
      `- **${c.name}** (${c.categoryLabel}) — ${c.summary || '动画组件'} [${c.complexity}复杂度]`
    ).join('\n')

    const panelMapping = panels.map(p =>
      `- **面板${p.index + 1}: ${p.name}** → 组件: ${p.assignedComponents.map(c => c.name).join(', ') || '(未分配)'}\n  用途: ${p.purpose}`
    ).join('\n')

    return `你是一位资深的企业网站架构师和 GSAP 动画专家。你的任务是基于用户手动挑选的组件和模板，生成详尽的企业网站制作方案。

## 用户的选择

### 选择的模板
- 模板: **${template?.label || '未选择'}** (key: ${template?.key || 'N/A'})
- 面板数量: ${template?.panelCount || 'N/A'}
- 架构类型: ${template?.architecture || 'N/A'}

### 选择的组件 (${components.length} 个)
${componentList}

### 组件-面板映射
${panelMapping}

## 输出要求

请生成一份结构化的 Markdown 方案文档，包含以下章节：

1. **📋 项目概览** — 基于组件风格推断行业定位、设计风格、目标用户、技术栈建议
2. **🎨 视觉设计系统** — 配色方案(CSS变量)、字体层次、间距系统、图标风格
3. **🏗️ 页面结构** — 面板布局图、每个面板的内容策略（基于分配的组件）
4. **📦 组件集成方案** — 每个组件的配置参数、数据模型、复用方式
5. **🎬 动画编排计划** — GSAP Timeline 时序图、ScrollTrigger 配置、组件间动画协调
6. **📱 响应式适配** — 移动端降级策略、断点设置、触摸交互优化
7. **⚡ 性能优化** — 懒加载策略、Canvas/WebGL 使用建议、首屏优化
8. **📅 开发排期** — 各阶段工时估算、里程碑规划
9. **💰 资源需求** — 所需图片素材规格（Unsplash）、第三方库版本、浏览器兼容

请用专业、详细但不冗长的语言输出。每个部分都要给出具体可执行的建议，而非泛泛而谈。

${
  store.selectedComponents.length === 0
    ? '\n⚠️ 注意：用户尚未选择组件，请基于模板结构给出通用的方案建议。'
    : ''
}`
  }

  /**
   * 构建用户 Prompt
   */
  function buildGenerationPrompt(detail: PlanDetail): string {
    const detailMap: Record<PlanDetail, string> = {
      brief: '请生成简要方案（每章节2-3句话即可）',
      standard: '请生成标准详情的方案',
      detailed: '请生成最详细的方案，包含代码示例和具体配置参数'
    }
    return detailMap[detail]
  }

  /**
   * 创建方案对象
   */
  function createPlan(
    type: 'aggressive' | 'balanced' | 'conservative',
    baseContent: string,
    detail: PlanDetail
  ): OrchestrationPlan {
    const meta = {
      aggressive: { name: '方案A — 视觉冲击版', icon: '🎨', badge: '炫酷' },
      balanced: { name: '方案B — 平衡优化版', icon: '⚖️', badge: '推荐' },
      conservative: { name: '方案C — 稳健交付版', icon: '🛡️', badge: '高效' }
    }[type]

    const typePrefix = {
      aggressive: '\n\n> 💡 **策略**: 最大化视觉冲击力，使用高级动画效果，适合追求品牌形象的项目。\n',
      balanced: '\n\n> 💡 **策略**: 在视觉效果与性能间取得平衡，适合大多数企业网站。\n',
      conservative: '\n\n> 💡 **策略**: 稳健可靠，快速交付，注重兼容性和可维护性。\n'
    }[type]

    return {
      id: `plan-${type}-${Date.now()}`,
      name: meta.name,
      icon: meta.icon,
      createdAt: new Date().toISOString(),
      type,
      detail,
      content: `${typePrefix}${baseContent}`,
      metadata: {
        componentCount: store.selectedComponents.length,
        templateKey: store.selectedTemplate?.key || '',
        panelCount: store.templatePanels.length,
        estimatedHours: type === 'aggressive' ? 160 : type === 'balanced' ? 120 : 80,
        complexityLevel: type === 'aggressive' ? 'high' : type === 'balanced' ? 'medium' : 'low'
      }
    }
  }

  /**
   * 本地模拟方案内容
   */
  function buildLocalPlanContent(): string {
    const template = store.selectedTemplate
    const components = store.selectedComponents
    const panels = store.templatePanels

    return `# 🌐 企业网站制作方案

## 📋 项目概览

基于您选择的 **${template?.label || '自定义模板'}** 页面结构和 **${components.length}** 个 GSAP 动画组件，本方案为您提供完整的网站制作指导。

- **设计风格**: ${inferStyleFromComponents(components)}
- **技术栈**: Vue 3 + GSAP + ScrollTrigger + Tailwind CSS
- **目标设备**: 响应式全平台

## 🎨 视觉设计系统

| 角色 | 色值 | 用途 |
|------|------|------|
| 主色 | #667eea | 按钮、链接、强调 |
| 辅色 | #764ba2 | 渐变、装饰 |
| 背景 | #0f172a | 页面背景 |
| 文字 | #f1f5f9 | 正文 |

## 🏗️ 页面结构

${panels.map(p => `### 面板${p.index + 1}: ${p.name}
- **用途**: ${p.purpose}
- **分配组件**: ${p.assignedComponents.map(c => c.name).join(', ') || '(待分配)'}
- **布局建议**: ${getLayoutSuggestion(p.index)}
`).join('\n')}

## 📦 组件集成方案

${components.map(c => `### ${c.name}
- **类别**: ${c.categoryLabel}
- **复杂度**: ${c.complexity}
- **集成要点**: 使用 Vue 3 \`defineAsyncComponent\` 懒加载，通过 Props 传递数据
- **GSAP 配置**: 注册 ScrollTrigger，在 \`onMounted\` 中初始化动画
`).join('\n')}

## 🎬 动画编排计划

1. **Hero 入场**: 页面加载时立即执行，无 ScrollTrigger 绑定
2. **面板滚动动画**: 使用 ScrollTrigger + toggleActions 控制
3. **组件间协调**: 使用 GSAP Timeline 编排多条动画轨道

## 📱 响应式适配

- Mobile (< 768px): 简化动画，减少粒子数量
- Tablet (768-1024px): 保留核心动画
- Desktop (> 1024px): 完整动画体验

## ⚡ 性能优化

- 组件懒加载 (defineAsyncComponent)
- 图片使用 WebP 格式 + 懒加载
- Canvas 粒子限制在 30 个以下
- 不使用动画的属性用 will-change 优化

## 📅 开发排期

| 阶段 | 工时 | 产出 |
|------|------|------|
| 环境搭建 | 8h | 项目脚手架 |
| 模板集成 | 16h | 页面框架 |
| 组件集成 | 24h | 动画效果 |
| 联调优化 | 16h | 性能调优 |
| 测试部署 | 8h | 上线 |

## 💰 资源需求

- 图片素材: Unsplash 高质量图片 10-15 张
- GSAP 3.12.5 + ScrollTrigger + ScrollToPlugin
- Tailwind CSS CDN 或构建版本

---
> 📝 本方案由 Meoo Plan 智能编排工作台生成 | ${new Date().toLocaleString('zh-CN')}
`
  }

  /** 从组件推断设计风格 */
  function inferStyleFromComponents(components: any[]): string {
    const tags = components.flatMap((c: any) => c.visualTags || [])
    if (tags.some((t: string) => t.includes('cyber') || t.includes('neon'))) return '赛博科技风'
    if (tags.some((t: string) => t.includes('nature') || t.includes('organic'))) return '自然生态风'
    if (tags.some((t: string) => t.includes('luxury') || t.includes('gold'))) return '高端奢华风'
    return '现代简约风'
  }

  /** 布局建议 */
  function getLayoutSuggestion(index: number): string {
    const suggestions = [
      '全屏居中布局，大标题 + CTA 按钮，背景使用 Canvas 粒子',
      '左右分栏布局，左侧文字介绍，右侧图片/视频',
      '网格布局（3-4列），卡片式设计',
      '时间轴或流程图形式',
      '瀑布流或轮播图',
      '数字统计 + 卡片展示',
      '两栏布局，左侧信息右侧表单'
    ]
    return suggestions[index] || '标准模块化布局'
  }

  return {
    isGenerating,
    generationProgress,
    generationError,
    isAIAvailable,
    generatePlan
  }
}
