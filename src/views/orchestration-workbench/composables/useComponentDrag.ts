/**
 * useComponentDrag — 组件拖拽逻辑
 *
 * 支持：组件卡片从左侧拖到中间模板面板
 */

import { ref } from 'vue'
import type { ComponentItem } from '../types/orchestration'

export function useComponentDrag() {
  /** 当前拖拽的组件 */
  const draggingComponent = ref<ComponentItem | null>(null)
  /** 拖拽悬停的面板索引 */
  const hoverPanelIndex = ref<number | null>(null)

  /** 开始拖拽 */
  function onDragStart(comp: ComponentItem, event: DragEvent) {
    draggingComponent.value = comp
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy'
      event.dataTransfer.setData('application/component-name', comp.name)
    }
  }

  /** 拖拽结束 */
  function onDragEnd() {
    draggingComponent.value = null
    hoverPanelIndex.value = null
  }

  /** 面板拖拽进入 */
  function onPanelDragOver(event: DragEvent) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy'
    }
  }

  /** 面板拖拽悬停 */
  function onPanelDragEnter(panelIndex: number) {
    hoverPanelIndex.value = panelIndex
  }

  /** 面板拖拽离开 */
  function onPanelDragLeave() {
    hoverPanelIndex.value = null
  }

  /** 面板放置 */
  function onPanelDrop(panelIndex: number, event: DragEvent): string | null {
    event.preventDefault()
    const compName = event.dataTransfer?.getData('application/component-name') || null
    hoverPanelIndex.value = null
    draggingComponent.value = null
    return compName
  }

  return {
    draggingComponent,
    hoverPanelIndex,
    onDragStart,
    onDragEnd,
    onPanelDragOver,
    onPanelDragEnter,
    onPanelDragLeave,
    onPanelDrop
  }
}
