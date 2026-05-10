import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * GSAP ScrollTrigger 优化工具
 * 用于解决懒加载场景下的 ScrollTrigger 冲突问题
 */

// 全局 ScrollTrigger 刷新锁,防止频繁刷新
let refreshLock = false
let refreshScheduled = false

/**
 * 安全刷新 ScrollTrigger
 * 使用防抖和锁机制避免频繁刷新
 */
export const safeRefreshScrollTrigger = () => {
  if (refreshLock) {
    refreshScheduled = true
    return
  }

  refreshLock = true

  // 使用 requestAnimationFrame 确保在下一帧刷新
  requestAnimationFrame(() => {
    try {
      ScrollTrigger.refresh()
    } catch (error) {
      console.warn('ScrollTrigger refresh failed:', error)
    } finally {
      refreshLock = false

      // 如果有挂起的刷新请求,执行它
      if (refreshScheduled) {
        refreshScheduled = false
        safeRefreshScrollTrigger()
      }
    }
  })
}

/**
 * 等待元素存在后执行回调
 * 用于懒加载组件中确保 DOM 准备就绪
 */
export const waitForElement = (
  selector: string,
  root: HTMLElement | Document = document,
  timeout: number = 5000
): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const element = root.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver(() => {
      const element = root.querySelector(selector)
      if (element) {
        observer.disconnect()
        resolve(element)
      }
    })

    observer.observe(root, {
      childList: true,
      subtree: true
    })

    // 超时处理
    setTimeout(() => {
      observer.disconnect()
      reject(new Error(`Element ${selector} not found within ${timeout}ms`))
    }, timeout)
  })
}

/**
 * 批量清理 ScrollTrigger
 * 用于组件卸载时清理动画
 */
export const cleanupScrollTriggers = (scope?: Element) => {
  const triggers = ScrollTrigger.getAll()

  if (scope) {
    // 只清理特定作用域内的 trigger
    triggers.forEach(trigger => {
      if (scope.contains(trigger.trigger as Element)) {
        trigger.kill()
      }
    })
  } else {
    // 清理所有 trigger
    triggers.forEach(trigger => trigger.kill())
  }
}

/**
 * 安全创建 ScrollTrigger
 * 确保元素存在后再创建
 */
export const safeCreateScrollTrigger = (config: any): ScrollTrigger | null => {
  try {
    const { trigger, ...rest } = config

    if (typeof trigger === 'string') {
      // 如果是选择器,尝试获取元素
      const element = document.querySelector(trigger)
      if (!element) {
        console.warn(`ScrollTrigger trigger not found: ${trigger}`)
        return null
      }
    }

    return ScrollTrigger.create({ trigger, ...rest })
  } catch (error) {
    console.warn('Failed to create ScrollTrigger:', error)
    return null
  }
}

/**
 * 懒加载组件的 GSAP 上下文管理
 */
export class LazyGSAPContext {
  private mounted = false
  private readyPromise: Promise<void>
  private readyResolve!: () => void

  constructor() {
    this.readyPromise = new Promise(resolve => {
      this.readyResolve = resolve
    })
  }

  markMounted() {
    if (!this.mounted) {
      this.mounted = true
      this.readyResolve()
    }
  }

  async waitReady(): Promise<void> {
    return this.readyPromise
  }

  isComponentReady() {
    return this.mounted
  }
}

/**
 * 导出默认实例
 */
export default {
  safeRefreshScrollTrigger,
  waitForElement,
  cleanupScrollTriggers,
  safeCreateScrollTrigger,
  LazyGSAPContext
}
