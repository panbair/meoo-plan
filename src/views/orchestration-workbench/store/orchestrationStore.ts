/**
 * 组件编排工作台 — Pinia Store
 *
 * 管理整个编排流程的状态，支持 localStorage 持久化
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ComponentItem,
  TemplateItem,
  TemplatePanel,
  AIAnalysis,
  OrchestrationPlan,
  PlanHistoryItem,
  WorkbenchStep,
  PlanDetail
} from '../types/orchestration'

export const useOrchestrationStore = defineStore(
  'orchestration-workbench',
  () => {
    // ==================== 核心状态 ====================

    const currentStep = ref<WorkbenchStep>('select-components')
    const selectedComponents = ref<ComponentItem[]>([])
    const selectedTemplate = ref<TemplateItem | null>(null)
    const templatePanels = ref<TemplatePanel[]>([])
    const aiAnalysis = ref<AIAnalysis | null>(null)
    const isAnalyzing = ref(false)
    const generatedPlans = ref<OrchestrationPlan[]>([])
    const activePlanIndex = ref(0)
    const planHistory = ref<PlanHistoryItem[]>([])
    const planDetail = ref<PlanDetail>('standard')
    const aiConfigured = ref(false)

    // ==================== 计算属性 ====================

    /** 是否已选组件 */
    const hasComponents = computed(() => selectedComponents.value.length > 0)

    /** 是否已选模板 */
    const hasTemplate = computed(() => selectedTemplate.value !== null)

    /** 组件总数 */
    const componentCount = computed(() => selectedComponents.value.length)

    /** 当前的激活方案 */
    const activePlan = computed(() => {
      if (generatedPlans.value.length === 0) return null
      return generatedPlans.value[activePlanIndex.value] || null
    })

    /** 按类别分组的已选组件 */
    const componentsByCategory = computed(() => {
      const map = new Map<string, ComponentItem[]>()
      selectedComponents.value.forEach(c => {
        const arr = map.get(c.category) || []
        arr.push(c)
        map.set(c.category, arr)
      })
      return map
    })

    /** 所有已选组件的名称 */
    const selectedComponentNames = computed(() =>
      selectedComponents.value.map(c => c.name)
    )

    // ==================== 组件操作 ====================

    /** 添加组件到选择列表 */
    function addComponent(comp: ComponentItem) {
      if (!selectedComponents.value.find(c => c.name === comp.name)) {
        selectedComponents.value.push(comp)
      }
    }

    /** 从选择列表移除组件 */
    function removeComponent(compName: string) {
      const idx = selectedComponents.value.findIndex(c => c.name === compName)
      if (idx > -1) {
        selectedComponents.value.splice(idx, 1)
        // 同时从面板映射中移除
        templatePanels.value.forEach(panel => {
          const assignIdx = panel.assignedComponents.findIndex(c => c.name === compName)
          if (assignIdx > -1) {
            panel.assignedComponents.splice(assignIdx, 1)
          }
        })
      }
    }

    /** 切换组件选中状态 */
    function toggleComponent(comp: ComponentItem) {
      const exists = selectedComponents.value.find(c => c.name === comp.name)
      if (exists) {
        removeComponent(comp.name)
      } else {
        addComponent(comp)
      }
    }

    /** 清空所有已选组件 */
    function clearComponents() {
      selectedComponents.value = []
      templatePanels.value.forEach(p => (p.assignedComponents = []))
    }

    // ==================== 模板操作 ====================

    /** 选择模板 */
    function selectTemplate(template: TemplateItem) {
      selectedTemplate.value = template
      // 初始化面板结构
      templatePanels.value = generateDefaultPanels(template)
    }

    /** 清除模板选择 */
    function clearTemplate() {
      selectedTemplate.value = null
      templatePanels.value = []
    }

    /** 根据模板生成默认面板结构 */
    function generateDefaultPanels(template: TemplateItem): TemplatePanel[] {
      const defaultPanelNames = [
        { name: 'Hero 首页英雄区', purpose: '首屏视觉焦点，品牌核心价值展示' },
        { name: 'About 关于我们', purpose: '企业介绍、发展历程、团队实力' },
        { name: 'Products 产品服务', purpose: '产品展示、服务特色、优势对比' },
        { name: 'Features 核心特性', purpose: '技术优势、功能亮点' },
        { name: 'Cases 成功案例', purpose: '客户案例、成果展示' },
        { name: 'Stats 数据见证', purpose: '关键数据统计、信任背书' },
        { name: 'Contact 联系我们', purpose: '联系表单、地图位置' }
      ]

      const count = Math.min(template.panelCount || 5, defaultPanelNames.length)
      return defaultPanelNames.slice(0, count).map((p, i) => ({
        index: i,
        name: p.name,
        purpose: p.purpose,
        assignedComponents: []
      }))
    }

    /** 将组件分配到指定面板 */
    function assignToPanel(compName: string, panelIndex: number) {
      const comp = selectedComponents.value.find(c => c.name === compName)
      if (!comp) return

      const panel = templatePanels.value.find(p => p.index === panelIndex)
      if (!panel) return

      if (!panel.assignedComponents.find(c => c.name === compName)) {
        panel.assignedComponents.push(comp)
      }
    }

    /** 从面板移除组件 */
    function removeFromPanel(compName: string, panelIndex: number) {
      const panel = templatePanels.value.find(p => p.index === panelIndex)
      if (!panel) return
      const idx = panel.assignedComponents.findIndex(c => c.name === compName)
      if (idx > -1) {
        panel.assignedComponents.splice(idx, 1)
      }
    }

    /** AI 智能分配：将已选组件均匀分配到面板 */
    function autoAssignPanels() {
      if (!hasTemplate.value || !hasComponents.value) return

      // 重置所有面板分配
      templatePanels.value.forEach(p => (p.assignedComponents = []))

      // 按顺序均匀分配
      selectedComponents.value.forEach((comp, i) => {
        const panelIndex = i % templatePanels.value.length
        const panel = templatePanels.value[panelIndex]
        panel.assignedComponents.push(comp)
      })
    }

    // ==================== AI 分析 ====================

    function setAIAnalysis(analysis: AIAnalysis | null) {
      aiAnalysis.value = analysis
    }

    function setAnalyzing(val: boolean) {
      isAnalyzing.value = val
    }

    // ==================== 方案操作 ====================

    function addPlan(plan: OrchestrationPlan) {
      generatedPlans.value.push(plan)
      activePlanIndex.value = generatedPlans.value.length - 1

      // 添加到方案历史
      planHistory.value.push({
        id: `history-${Date.now()}`,
        planId: plan.id,
        planName: plan.name,
        createdAt: plan.createdAt,
        componentNames: selectedComponents.value.map(c => c.name),
        templateKey: selectedTemplate.value?.key || '',
        templateLabel: selectedTemplate.value?.label || ''
      })
    }

    function setActivePlan(index: number) {
      if (index >= 0 && index < generatedPlans.value.length) {
        activePlanIndex.value = index
      }
    }

    function clearPlans() {
      generatedPlans.value = []
      activePlanIndex.value = 0
    }

    function removePlanHistory(historyId: string) {
      const idx = planHistory.value.findIndex(h => h.id === historyId)
      if (idx > -1) {
        planHistory.value.splice(idx, 1)
      }
    }

    // ==================== 步骤导航 ====================

    function setStep(step: WorkbenchStep) {
      currentStep.value = step
    }

    function setPlanDetail(detail: PlanDetail) {
      planDetail.value = detail
    }

    function setAIConfigured(val: boolean) {
      aiConfigured.value = val
    }

    // ==================== 重置 ====================

    function resetAll() {
      selectedComponents.value = []
      selectedTemplate.value = null
      templatePanels.value = []
      aiAnalysis.value = null
      isAnalyzing.value = false
      generatedPlans.value = []
      activePlanIndex.value = 0
      currentStep.value = 'select-components'
    }

    return {
      // 状态
      currentStep,
      selectedComponents,
      selectedTemplate,
      templatePanels,
      aiAnalysis,
      isAnalyzing,
      generatedPlans,
      activePlanIndex,
      planHistory,
      planDetail,
      aiConfigured,
      // 计算属性
      hasComponents,
      hasTemplate,
      componentCount,
      activePlan,
      componentsByCategory,
      selectedComponentNames,
      // 方法
      addComponent,
      removeComponent,
      toggleComponent,
      clearComponents,
      selectTemplate,
      clearTemplate,
      assignToPanel,
      removeFromPanel,
      autoAssignPanels,
      setAIAnalysis,
      setAnalyzing,
      addPlan,
      setActivePlan,
      clearPlans,
      removePlanHistory,
      setStep,
      setPlanDetail,
      setAIConfigured,
      resetAll
    }
  },
  {
    persist: {
      key: 'orchestration-workbench',
      storage: localStorage,
      // 只持久化选择和配置，不持久化分析/方案（太大）
      pick: [
        'selectedComponents',
        'selectedTemplate',
        'templatePanels',
        'planHistory',
        'planDetail',
        'aiConfigured'
      ]
    }
  }
)
