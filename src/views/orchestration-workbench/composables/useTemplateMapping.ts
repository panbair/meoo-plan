/**
 * useTemplateMapping — 组件与模板面板的映射逻辑
 */

import { computed } from 'vue'
import { useOrchestrationStore } from '../store/orchestrationStore'
import type { ComponentItem } from '../types/orchestration'

export function useTemplateMapping() {
  const store = useOrchestrationStore()

  /** 获取指定面板已分配的组件 */
  function getPanelComponents(panelIndex: number): ComponentItem[] {
    const panel = store.templatePanels.find(p => p.index === panelIndex)
    return panel?.assignedComponents || []
  }

  /** 组件是否已分配到某个面板 */
  function isAssignedToPanel(compName: string, panelIndex: number): boolean {
    const panel = store.templatePanels.find(p => p.index === panelIndex)
    return panel?.assignedComponents.some(c => c.name === compName) || false
  }

  /** 组件是否已分配到任意面板 */
  function isAssignedAnywhere(compName: string): boolean {
    return store.templatePanels.some(p =>
      p.assignedComponents.some(c => c.name === compName)
    )
  }

  /** 获取未被分配的组件列表 */
  const unassignedComponents = computed(() =>
    store.selectedComponents.filter(c => !isAssignedAnywhere(c.name))
  )

  /** 获取分配统计 */
  const assignmentStats = computed(() => {
    const total = store.selectedComponents.length
    const assigned = total - unassignedComponents.value.length
    return {
      total,
      assigned,
      unassigned: total - assigned,
      percentage: total > 0 ? Math.round((assigned / total) * 100) : 0
    }
  })

  /** 面板分配总览（带紧凑格式） */
  const panelOverview = computed(() =>
    store.templatePanels.map(p => ({
      index: p.index,
      name: p.name,
      componentCount: p.assignedComponents.length,
      componentNames: p.assignedComponents.map(c => c.name)
    }))
  )

  return {
    getPanelComponents,
    isAssignedToPanel,
    isAssignedAnywhere,
    unassignedComponents,
    assignmentStats,
    panelOverview
  }
}
