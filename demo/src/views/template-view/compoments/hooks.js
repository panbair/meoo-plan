/*
 * @Author: panboren
 * @Date: 2024/11/5$
 * @LastModifiedBy: Administrator$
 * @QQ: 3248874747
 * @Description: 核心动画控制器 - 优化版
 */
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap/dist/gsap.js'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin.js'
import _ from 'lodash'
import { isTrue, isTrueObject } from './utils.ts'
import { getId } from './right/config.js'
import { computedStyle } from './config-form.js'
import { getOriginalStyles } from './directives.ts'

// 导入新模板 (V4-V11)
import {
  threeDCardFlipAnimation,
  particleWaveAnimation,
  wormholeAnimation,
  glassShatterAnimation,
  liquidFlowAnimation,
  fractalGrowAnimation,
  quantumEntanglementAnimation,
  magneticDistortionAnimation
} from './newTemplates.js'

// 导入专业级模板 (V12-V19)
import {
  origamiFoldAnimation,
  moebiusTransformAnimation,
  auroraFlowAnimation,
  particleConvergeAnimation,
  dnaHelixAnimation,
  honeycombUnfoldAnimation,
  hologramScanAnimation,
  kaleidoscopeMirrorAnimation
} from './proTemplates.js'

// 导入精英级模板 (V20-V27)
import {
  liquidSurfaceTensionAnimation,
  electromagneticWaveAnimation,
  fragmentReassembleAnimation,
  parallaxDepthAnimation,
  matrixRainAnimation,
  galaxyRotationAnimation,
  fluidVortexAnimation,
  panoramaUnfoldAnimation
} from './eliteTemplates.js'

// 导入传奇级模板 (V28-V35)
import {
  interstellarPortalAnimation,
  quantumTunnelAnimation,
  cyberspaceAnimation,
  liquidMetalAnimation,
  timeFoldAnimation,
  nebulaBirthAnimation,
  neonCityAnimation,
  ultimateParallaxAnimation
} from './legendTemplates.js'

// 导入精华级模板 (V36-V43)
import {
  smoothHorizontalAnimation,
  elasticScaleAnimation,
  infiniteSmoothAnimation,
  fadeUpAnimation,
  staggeredHorizontalAnimation,
  scaleFadeAnimation,
  infiniteRotateAnimation,
  smoothComboAnimation
} from './elitePlusTemplates.js'

// 导入大师级模板 (V44-V51)
import {
  particleExplosionAnimation,
  liquidMorphAnimation,
  holographicDataflowAnimation,
  magneticAttractionAnimation,
  origamiUnfoldAnimation,
  auroraRippleAnimation,
  neonGlitchAnimation,
  wormholeTravelAnimation
} from './masterTemplates.js'

// ==================== GSAP插件单例管理 ====================
let pluginsRegistered = false
const registerPlugins = () => {
  if (!pluginsRegistered && typeof gsap.registerPlugin === 'function') {
    try {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
      pluginsRegistered = true
      console.log('[GSAP] 插件注册成功')
    } catch (error) {
      console.error('[GSAP] 插件注册失败:', error)
    }
  }
}

// ==================== 样式映射和转换 ====================
const STYLE_MAP = {
  w: 'width',
  h: 'height',
  x: 'x',
  y: 'y',
  rotate: 'rotation',
  scaleX: 'scaleX',
  scaleY: 'scaleY',
  skewX: 'skewX',
  skewY: 'skewY',
  opacity: 'opacity',
  background: 'backgroundColor',
  color: 'color',
  fontSize: 'fontSize',
  fontWeight: 'fontWeight',
  textShadow: 'textShadow'
}

/**
 * 转换样式对象
 * @param {Object} styleObj - 原始样式对象
 * @returns {Object} 转换后的GSAP样式对象
 */
const transformStyle = (styleObj) => {
  if (!styleObj || typeof styleObj !== 'object') return {}

  const result = {}
  Object.entries(styleObj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const mappedKey = STYLE_MAP[key] || key
      result[mappedKey] = value
    }
  })
  return result
}

// ==================== 动画实例管理器（优化版）====================
class AnimationManager {
  constructor() {
    this.instances = new Map()       // 动画实例
    this.scrollTriggers = new Map()  // ScrollTrigger实例
    this.timelines = new Map()       // Timeline实例
    this.cleanupFns = new Map()      // 清理函数
  }

  /**
   * 添加动画实例
   */
  add(key, animation, type = 'animation') {
    try {
      switch (type) {
        case 'animation':
          this.instances.set(key, animation)
          break
        case 'scrollTrigger':
          this.scrollTriggers.set(key, animation)
          break
        case 'timeline':
          this.timelines.set(key, animation)
          break
        case 'cleanup':
          this.cleanupFns.set(key, animation)
          break
        default:
          console.warn(`[AnimationManager] 未知的类型: ${type}`)
      }
    } catch (error) {
      console.error(`[AnimationManager] 添加实例失败 (${type}):`, error)
    }
  }

  /**
   * 获取动画实例
   */
  get(key, type = 'animation') {
    switch (type) {
      case 'animation': return this.instances.get(key)
      case 'scrollTrigger': return this.scrollTriggers.get(key)
      case 'timeline': return this.timelines.get(key)
      case 'cleanup': return this.cleanupFns.get(key)
      default: return null
    }
  }

  /**
   * 销毁单个动画实例
   */
  kill(key, type = 'animation') {
    const instance = this.get(key, type)
    if (!instance) return false

    try {
      // 根据类型执行不同的清理逻辑
      if (type === 'animation' || type === 'timeline') {
        if (typeof instance.kill === 'function') {
          instance.kill(true)
        }
        if (instance.scrollTrigger && typeof instance.scrollTrigger.kill === 'function') {
          instance.scrollTrigger.kill()
        }
      } else if (type === 'scrollTrigger') {
        if (typeof instance.kill === 'function') {
          instance.kill()
        }
      } else if (type === 'cleanup') {
        if (typeof instance === 'function') {
          instance()
        }
      }

      this.delete(key, type)
      return true
    } catch (error) {
      console.error(`[AnimationManager] 销毁实例失败 (${key}, ${type}):`, error)
      return false
    }
  }

  /**
   * 删除实例引用
   */
  delete(key, type = 'animation') {
    switch (type) {
      case 'animation': this.instances.delete(key); break
      case 'scrollTrigger': this.scrollTriggers.delete(key); break
      case 'timeline': this.timelines.delete(key); break
      case 'cleanup': this.cleanupFns.delete(key); break
    }
  }

  /**
   * 检查实例是否存在
   */
  has(key, type = 'animation') {
    switch (type) {
      case 'animation': return this.instances.has(key)
      case 'scrollTrigger': return this.scrollTriggers.has(key)
      case 'timeline': return this.timelines.has(key)
      case 'cleanup': return this.cleanupFns.has(key)
      default: return false
    }
  }

  /**
   * 获取所有实例的数量
   */
  size(type = 'all') {
    switch (type) {
      case 'animation': return this.instances.size
      case 'scrollTrigger': return this.scrollTriggers.size
      case 'timeline': return this.timelines.size
      case 'cleanup': return this.cleanupFns.size
      case 'all':
        return this.instances.size + this.scrollTriggers.size +
               this.timelines.size + this.cleanupFns.size
      default: return 0
    }
  }

  /**
   * 销毁所有实例
   */
  killAll() {
    let successCount = 0
    let failCount = 0

    // 清理Timelines（先清理，因为可能包含其他动画）
    this.timelines.forEach((tl, key) => {
      try {
        if (typeof tl.kill === 'function') {
          tl.kill(true)
        }
        successCount++
      } catch (e) {
        failCount++
        console.warn('[AnimationManager] 清理Timeline失败:', key, e)
      }
    })

    // 清理Animations
    this.instances.forEach((anim, key) => {
      try {
        if (typeof anim.kill === 'function') {
          anim.kill(true)
        }
        if (anim.scrollTrigger && typeof anim.scrollTrigger.kill === 'function') {
          anim.scrollTrigger.kill()
        }
        successCount++
      } catch (e) {
        failCount++
        console.warn('[AnimationManager] 清理Animation失败:', key, e)
      }
    })

    // 清理ScrollTriggers
    this.scrollTriggers.forEach((st, key) => {
      try {
        if (typeof st.kill === 'function') {
          st.kill()
        }
        successCount++
      } catch (e) {
        failCount++
        console.warn('[AnimationManager] 清理ScrollTrigger失败:', key, e)
      }
    })

    // 执行清理函数
    this.cleanupFns.forEach((fn, key) => {
      try {
        if (typeof fn === 'function') {
          fn()
        }
        successCount++
      } catch (e) {
        failCount++
        console.warn('[AnimationManager] 执行清理函数失败:', key, e)
      }
    })

    console.log(`[AnimationManager] 清理完成: 成功${successCount}个, 失败${failCount}个`)
    this.clear()
  }

  /**
   * 清空所有数据
   */
  clear() {
    this.instances.clear()
    this.scrollTriggers.clear()
    this.timelines.clear()
    this.cleanupFns.clear()
  }
}

// ==================== 防抖管理器（优化版）====================
class DebounceManager {
  constructor() {
    this.debounceMap = new Map()
  }

  /**
   * 创建防抖函数
   */
  create(fn, delay = 100, key) {
    if (!key) {
      key = `debounce_${Date.now()}_${Math.random()}`
    }

    if (this.debounceMap.has(key)) {
      const debounced = this.debounceMap.get(key)
      if (debounced.timer) {
        clearTimeout(debounced.timer)
      }
    }

    const debounced = { fn, delay, timer: null }
    this.debounceMap.set(key, debounced)

    return (...args) => {
      if (debounced.timer) {
        clearTimeout(debounced.timer)
      }
      debounced.timer = setTimeout(() => {
        fn(...args)
        debounced.timer = null
      }, delay)
    }
  }

  /**
   * 清除指定防抖函数
   */
  clear(key) {
    if (key && this.debounceMap.has(key)) {
      const debounced = this.debounceMap.get(key)
      if (debounced.timer) {
        clearTimeout(debounced.timer)
      }
      this.debounceMap.delete(key)
    } else if (!key) {
      // 清除所有
      this.debounceMap.forEach((debounced) => {
        if (debounced.timer) {
          clearTimeout(debounced.timer)
        }
      })
      this.debounceMap.clear()
    }
  }
}

// ==================== 动画状态管理 ====================
class AnimationStateManager {
  constructor() {
    this.state = {
      isPlaying: false,
      currentAnimation: null,
      animations: new Map()
    }
  }

  setState(key, value) {
    this.state[key] = value
  }

  getState(key) {
    return this.state[key]
  }

  setAnimation(key, value) {
    this.state.animations.set(key, value)
  }

  getAnimation(key) {
    return this.state.animations.get(key)
  }

  hasAnimation(key) {
    return this.state.animations.has(key)
  }

  removeAnimation(key) {
    this.state.animations.delete(key)
  }

  clearAll() {
    this.state.animations.clear()
    this.state.isPlaying = false
    this.state.currentAnimation = null
  }
}

// ==================== GSAP工具函数 ====================
/**
 * 安全销毁GSAP对象
 */
const safeKillGSAP = (gsapObj, label = '') => {
  if (!gsapObj) return false

  try {
    // Timeline有clear方法
    if (gsapObj.clear && typeof gsapObj.clear === 'function') {
      gsapObj.clear(true)
    }

    // 所有GSAP对象都有kill方法
    if (gsapObj.kill && typeof gsapObj.kill === 'function') {
      gsapObj.kill(true)
    }

    return true
  } catch (error) {
    console.warn(`[GSAP] 安全销毁失败 (${label}):`, error)
    return false
  }
}

/**
 * 安全销毁ScrollTrigger
 */
const safeKillScrollTrigger = (scrollTrigger, label = '') => {
  if (!scrollTrigger) return false

  try {
    // 清理pin状态
    if (scrollTrigger.pin) {
      scrollTrigger.pin.style.position = ''
      scrollTrigger.pin.style.transform = ''
    }

    if (scrollTrigger.kill && typeof scrollTrigger.kill === 'function') {
      scrollTrigger.kill()
    }

    return true
  } catch (error) {
    console.warn(`[ScrollTrigger] 安全销毁失败 (${label}):`, error)
    return false
  }
}

/**
 * 批量安全销毁
 */
const batchSafeKill = (items, type = 'gsap') => {
  if (!Array.isArray(items)) return 0

  let successCount = 0
  items.forEach((item, index) => {
    const label = `${type}[${index}]`
    const success = type === 'scrollTrigger'
      ? safeKillScrollTrigger(item, label)
      : safeKillGSAP(item, label)
    if (success) successCount++
  })

  return successCount
}

// ==================== 主动画控制器 ====================
export const UseAnimation = () => {
  // 注册插件
  registerPlugins()

  // 实例化管理器
  const animationManager = new AnimationManager()
  const debounceManager = new DebounceManager()
  const stateManager = new AnimationStateManager()

  // 响应式引用
  const pageRef = ref(null)
  const panelRef = ref(null)
  const scrollTween = ref({})

  // ==================== 动画创建和初始化 ====================

  /**
   * 创建编辑动画
   */
  const createAnimation = (pageList) => {
    if (!pageList?.value?.length) {
      console.warn('[CreateAnimation] pageList为空')
      return
    }

    pageList.value.forEach(item => {
      const containerAnimation = scrollTween.value[item.uuid]
      if (!containerAnimation) return

      item?.panels?.forEach?.(panelItem => {
        panelItem?.children?.forEach?.(animationItem => {
          playAnimation(panelItem, animationItem, containerAnimation)
        })
      })
    })
  }

  /**
   * 初始化页面动画
   */
  const initAnimation = (pageList) => {
    return nextTick(() => {
      const horizontalSections = pageRef.value || []
      if (!horizontalSections.length) return

      horizontalSections.forEach(container => {
        const sections = container.querySelectorAll('.panel')
        if (!sections.length) return

        const uuid = container.getAttribute('uuid')
        if (!uuid) return

        const tween = gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => '+=' + (container.offsetWidth - window.innerWidth),
            anticipatePin: 1
          }
        })

        scrollTween.value[uuid] = tween
        animationManager.add(`scroll-${uuid}`, tween, 'animation')

        console.log(`[InitAnimation] 页面${uuid}动画初始化完成`)
      })

      ScrollTrigger.refresh()
    })
  }

  /**
   * 播放动画
   */
  const playAnimation = (panelItem, itemData, containerAnimation) => {
    if (!itemData) {
      console.warn('[PlayAnimation] itemData为空')
      return
    }

    if (panelItem.horizontal) {
      horizontalAnimation(itemData, containerAnimation)
    } else {
      verticalAnimation(itemData)
    }
  }

  /**
   * 停止单个动画
   */
  const killAnimation = (itemData) => {
    if (!itemData) return

    const gs = itemData.gsap
    if (gs) {
      safeKillGSAP(gs, `killAnimation(${itemData.className})`)
      safeKillScrollTrigger(gs.scrollTrigger, `killAnimation(${itemData.className})`)
      itemData.gsap = null

      // 从管理器中移除
      animationManager.delete(itemData.className, 'animation')
    }
  }

  /**
   * 停止所有动画（优化版）
   */
  const killAllAnimation = (options = {}) => {
    const { keepScrollPosition = false, silent = false } = options

    if (!silent) {
      console.log('[KillAllAnimation] 开始清理所有动画...')
    }

    try {
      // 1. 清理GSAP全局动画
      if (typeof gsap.killAll === 'function') {
        gsap.killAll(false, true, true, false)
      }

      // 2. 清理所有ScrollTrigger实例
      const triggers = ScrollTrigger.getAll?.()
      if (triggers?.length) {
        triggers.forEach((st, index) => {
          try {
            // 清理pin状态
            if (st.pin) {
              st.pin.style.position = ''
              st.pin.style.transform = ''
              st.pin.style.zIndex = ''
            }
            safeKillScrollTrigger(st, `Global[${index}]`)
          } catch (e) {
            console.warn(`[KillAllAnimation] 清理ScrollTrigger[${index}]失败:`, e)
          }
        })
      }

      // 3. 再次确保ScrollTrigger完全清理
      if (typeof ScrollTrigger.killAll === 'function') {
        ScrollTrigger.killAll()
      }

      // 4. 清理动画管理器中的实例
      animationManager.killAll()

      // 5. 清理状态管理器
      stateManager.clearAll()

      // 6. 刷新ScrollTrigger以重新计算
      if (!keepScrollPosition) {
        setTimeout(() => {
          ScrollTrigger.refresh(true)
        }, 10)
      }

      if (!silent) {
        console.log('[KillAllAnimation] 所有动画已清理完成')
      }
    } catch (error) {
      console.error('[KillAllAnimation] 清理失败:', error)
    }
  }

  /**
   * 清理页面级动画（保留子元素动画）
   */
  const cleanupPageAnimations = (pageList) => {
    if (!pageList?.length) return

    console.log('[CleanupPageAnimations] 开始清理页面动画...')

    try {
      pageList.forEach(item => {
        // 清理页面的tween
        if (item.tween) {
          safeKillGSAP(item.tween, `page-${item.uuid}`)
          safeKillScrollTrigger(item.tween.scrollTrigger, `page-${item.uuid}`)
          item.tween = null

          // 从scrollTween中移除引用
          if (scrollTween.value[item.uuid]) {
            delete scrollTween.value[item.uuid]
          }
        }

        // 清理子元素的动画
        item?.panels?.forEach?.(panelItem => {
          panelItem?.children?.forEach?.(childItem => {
            killAnimation(childItem)
          })
        })
      })

      ScrollTrigger.refresh()
      console.log('[CleanupPageAnimations] 页面动画清理完成')
    } catch (error) {
      console.error('[CleanupPageAnimations] 清理失败:', error)
    }
  }

  /**
   * 重置动画状态
   */
  const resetAnimationState = () => {
    console.log('[ResetAnimationState] 开始重置动画状态...')

    try {
      killAllAnimation({ keepScrollPosition: false })

      // 清理scrollTween
      scrollTween.value = {}

      // 清理DOM上的动画相关样式
      const animatedElements = document.querySelectorAll('[gsap-instance]')
      animatedElements.forEach(el => {
        el.removeAttribute('gsap-instance')
        el.style.transform = ''
        el.style.opacity = ''
      })

      console.log('[ResetAnimationState] 动画状态已重置')
    } catch (error) {
      console.error('[ResetAnimationState] 重置失败:', error)
    }
  }

  /**
   * 暂停动画
   */
  const pauseAnimation = (itemData) => {
    if (itemData?.gsap?.pause) {
      itemData.gsap.pause()
    }
  }

  /**
   * 恢复动画
   */
  const resumeAnimation = (itemData) => {
    if (itemData?.gsap?.play) {
      itemData.gsap.play()
    }
  }

  // ==================== 横向和纵向动画 ====================

  /**
   * 创建横向动画
   */
  const horizontalAnimation = async (itemData, containerAnimation) => {
    return nextTick(() => {
      if (itemData?.formData?.animationTab !== 3 || !itemData?.className) return

      const className = `.${itemData.className}`
      let runStyle = itemData?.formData?.runStyle || {}

      if (!isTrueObject(runStyle)) return

      runStyle = _.cloneDeep(runStyle) || {}
      runStyle = transformStyle(runStyle)

      const toKey = runStyle.toKey || 'from'
      delete runStyle.toKey

      // 清理旧动画
      killAnimation(itemData)

      const gs = gsap[toKey](className, {
        ...runStyle,
        scrollTrigger: {
          trigger: className,
          containerAnimation: containerAnimation,
          markers: false,
          scrub: 1,
          start: 'left 90%',
          end: 'left 100%'
        }
      })

      itemData.gsap = gs
      animationManager.add(itemData.className, gs, 'animation')
    })
  }

  /**
   * 创建纵向动画
   */
  const verticalAnimation = async (itemData) => {
    return nextTick(() => {
      if (itemData?.formData?.animationTab !== 3 || !itemData?.className) return

      try {
        const className = `.${itemData.className}`
        let runStyle = itemData?.formData?.runStyle || {}

        if (!isTrueObject(runStyle)) return

        runStyle = _.cloneDeep(runStyle) || {}
        runStyle = transformStyle(runStyle)

        const toKey = runStyle.toKey || 'from'
        delete runStyle.toKey

        // 清理旧动画
        killAnimation(itemData)

        const gs = gsap[toKey](className, {
          ...runStyle,
          scrollTrigger: {
            trigger: className,
            scrub: 1,
            markers: false,
            start: 'top 100%',
            end: 'bottom 100%'
          }
        })

        itemData.gsap = gs
        animationManager.add(itemData.className, gs, 'animation')
      } catch (error) {
        console.error('[VerticalAnimation] 创建失败:', error)
      }
    })
  }

  /**
   * 自控动画（出现屏幕动画）
   */
  const selfAnimation = async (itemData, styleKey = 'animationStyle') => {
    return nextTick(() => {
      try {
        if (itemData?.formData?.animationTab !== 1 || !itemData?.className) return

        // 清理旧动画
        if (itemData.gsap) {
          safeKillGSAP(itemData.gsap, `self-${itemData.className}`)
          itemData.gsap = null
        }

        const className = `.${itemData.className}`
        const animation = itemData?.formData?.animation || []
        if (!animation.length) return

        const gs = gsap.timeline({
          onComplete: () => {
            console.log('[SelfAnimation] 动画完成:', className)
          },
          onReverseComplete: () => {
            console.log('[SelfAnimation] 动画反向完成:', className)
          }
        })

        animation.forEach(item => {
          const animationStyle = item[styleKey] || {}
          if (!isTrueObject(animationStyle)) return

          const style = _.cloneDeep(animationStyle) || {}
          const toKey = style.toKey || 'from'

          const cleanedStyle = transformStyle(style)
          gs[toKey](className, cleanedStyle)
        })

        itemData.gsap = gs
        animationManager.add(`self-${itemData.className}`, gs, 'timeline')
      } catch (error) {
        console.error('[SelfAnimation] 创建失败:', error)
      }
    })
  }

  // ==================== 添加动画项 ====================

  /**
   * 创建动画项
   */
  const addAnimation = ($event) => {
    const { id, uuid } = getId()
    return {
      type: 'animation',
      uuid,
      level: 3,
      name: '模块',
      id,
      linkName: 'AN' + id,
      dialogVisible: false,
      animationVisible: false,
      className: 'animation' + id,
      animationRef: null,
      gsap: null,
      formData: {
        type: 'img',
        content: '',
        imgUrl: '',
        imgUrlName: '',
        swiperOptions: {
          imgList: [{ imgUrl: '', animationType: 'Swipe' }],
          autoplay: true,
          delay: 2000,
          infinite: true,
          controls: true,
          pagination: true,
          fluxIndex: true
        },
        keys: [
          'w',
          'h',
          'x',
          'y',
          'background',
          'rotate',
          'scaleX',
          'scaleY',
          'skewX',
          'skewY',
          'color',
          'fontSize',
          'fontWeight',
          'textShadow'
        ],
        style: {
          x: $event.offsetX,
          y: $event.offsetY,
          w: 200,
          h: 200
        },
        runKeys: ['toKey', 'ease', 'w', 'h', 'x', 'y', 'background'],
        runStyle: {},
        hoverClass: [],
        hoverKeys: [],
        hoverStyle: {},
        animation: [
          {
            animationKeys: [
              'duration',
              'w',
              'h',
              'x',
              'y',
              'background',
              'rotate',
              'scaleX',
              'scaleY',
              'skewX',
              'skewY',
              'color',
              'fontSize',
              'fontWeight',
              'textShadow',
              'repeat',
              'delay',
              'yoyo',
              'toKey',
              'ease'
            ],
            animationStyle: {}
          }
        ],
        animationTab: 1,
        animationType: 'scroll'
      }
    }
  }

  // ==================== 滚动动画 ====================

  /**
   * 跳转滚动到具体那页
   */
  const scrollAnimation = (item, className) => {
    const scrollFunc = ScrollTrigger.getScrollFunc(window)
    const targetElem = document.querySelector(`.${className}`)

    if (!targetElem) {
      console.warn('[ScrollAnimation] 目标元素不存在:', className)
      return
    }

    let y = targetElem
    const panels = item.children || []

    if (targetElem && item.horizontal && item?.tween) {
      const totalScroll = item.tween.scrollTrigger.end - item.tween.scrollTrigger.start
      const totalMovement = (panels.length - 1) * targetElem.offsetWidth
      y = Math.round(
        item.tween.scrollTrigger.start + (targetElem.offsetLeft / totalMovement) * totalScroll
      )
    }

    gsap.to(window, {
      scrollTo: {
        y,
        autoKill: false
      },
      onStart: () => {
        if (scrollFunc) scrollFunc.cacheID = Math.random()
      },
      onUpdate: ScrollTrigger.update,
      duration: 1,
      ease: 'power2.inOut'
    })
  }

  /**
   * 单页无限滚动（优化版）
   */
  const infinitePanelScrollAnimation = (classNane = 'vertical') => {
    ScrollTrigger.refresh()

    let panels = []
    let clonedNode = null
    let maxScroll = 0
    let pageScrollTrigger = null
    let onResize = null
    let onScroll = null
    let panelTriggers = []

    const cleanup = () => {
      console.log('[InfinitePanelScroll] 开始清理...')

      // 移除事件监听器
      if (onResize) {
        window.removeEventListener('resize', onResize)
        onResize = null
      }
      if (onScroll) {
        window.removeEventListener('scroll', onScroll, { passive: false })
        onScroll = null
      }

      // 清理ScrollTrigger
      safeKillScrollTrigger(pageScrollTrigger, 'pageScrollTrigger')
      pageScrollTrigger = null

      // 清理所有panel的ScrollTrigger
      panelTriggers.forEach((st, index) => {
        safeKillScrollTrigger(st, `panelTrigger[${index}]`)
      })
      panelTriggers = []

      // 移除克隆的节点
      if (clonedNode && clonedNode.parentNode) {
        clonedNode.parentNode.removeChild(clonedNode)
        clonedNode = null
      }

      // 恢复panels的pin样式
      panels.forEach((panel, index) => {
        try {
          panel.style.position = ''
          panel.style.transform = ''
          panel.style.zIndex = ''
        } catch (e) {
          console.warn(`[InfinitePanelScroll] 恢复panel[${index}]样式失败:`, e)
        }
      })

      // 清理所有动画
      killAllAnimation({ keepScrollPosition: true, silent: true })

      console.log('[InfinitePanelScroll] 清理完成')
    }

    nextTick(() => {
      panels = gsap.utils.toArray(`.${classNane}`) || []
      if (panels.length <= 0) {
        console.warn('[InfinitePanelScroll] 未找到panels')
        return
      }

      // 克隆第一个节点（用于无限滚动效果）
      clonedNode = panels[0].cloneNode(true)
      clonedNode.setAttribute('data-cloned', 'true')
      panels[0].parentNode.appendChild(clonedNode)

      panels.forEach(panel => {
        const trigger = ScrollTrigger.create({
          trigger: panel,
          start: 'top top',
          pin: true,
          pinSpacing: false
        })
        panelTriggers.push(trigger)
      })

      pageScrollTrigger = ScrollTrigger.create({
        snap(value) {
          const snappedValue = gsap.utils.snap(1 / panels.length, value)
          if (snappedValue <= 0) return 1.05 / maxScroll
          if (snappedValue >= 1) return maxScroll / (maxScroll + 1.05)
          return snappedValue
        }
      })

      onResize = debounceManager.create(
        () => {
          maxScroll = ScrollTrigger.maxScroll(window) - 1
        },
        100,
        'infinite-resize'
      )

      onScroll = e => {
        const scroll = pageScrollTrigger.scroll()
        if (scroll > maxScroll) {
          pageScrollTrigger.scroll(1)
          e.preventDefault()
        } else if (scroll < 1) {
          pageScrollTrigger.scroll(maxScroll - 1)
          e.preventDefault()
        }
      }

      onResize()
      window.addEventListener('resize', onResize)
      window.addEventListener('scroll', onScroll, { passive: false })

      // 注册清理函数到管理器
      animationManager.add('infinitePanelScroll', cleanup, 'cleanup')

      console.log('[InfinitePanelScroll] 初始化完成')
    })

    return cleanup
  }

  /**
   * 单页缩放滚动（优化版）
   */
  const scalePanelScrollAnimation = (classNane = 'vertical') => {
    ScrollTrigger.refresh()

    let panels = []
    let tl = null
    let scrollTriggerInstance = null
    let layerRef = null
    let layerOptions = {}
    let panelOptions = {}

    const cleanup = () => {
      console.log('[ScalePanelScroll] 开始清理...')

      // 恢复layer原始样式
      if (layerRef && Object.keys(layerOptions).length) {
        Object.entries(layerOptions).forEach(([key, value]) => {
          layerRef.style[key] = value
        })
      }

      // 恢复panels原始样式
      panels.forEach((panel) => {
        const panelStyleId = panel.getAttribute('uuid')
        if (panelStyleId && panelOptions[panelStyleId]) {
          Object.entries(panelOptions[panelStyleId]).forEach(([key, value]) => {
            panel.style[key] = value
          })
        }
        panel.style.transform = ''
        panel.style.opacity = ''
      })

      // 清理ScrollTrigger
      safeKillScrollTrigger(scrollTriggerInstance, 'scalePanelScroll')
      scrollTriggerInstance = null

      // 清理timeline
      if (tl) {
        safeKillGSAP(tl, 'scalePanelTimeline')
        tl = null
      }

      killAllAnimation({ keepScrollPosition: true, silent: true })

      console.log('[ScalePanelScroll] 清理完成')
    }

    nextTick(() => {
      const layerStyle = {
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }

      const panelStyle = {
        width: '100vw',
        height: '100vh',
        position: 'absolute'
      }

      panels = gsap.utils.toArray(`.${classNane}`) || []
      if (panels.length <= 1) {
        console.warn('[ScalePanelScroll] panels数量不足')
        return
      }

      layerRef = document.querySelector('.animation-layer')
      if (!layerRef) {
        console.warn('[ScalePanelScroll] 未找到animation-layer')
        return
      }

      // 保存并应用layer样式
      layerOptions = getOriginalStyles(layerRef, layerStyle)
      Object.entries(layerStyle).forEach(([key, value]) => {
        layerRef.style[key] = value
      })

      // 保存并应用panels样式
      panels.forEach(panel => {
        const uuid = panel.getAttribute('uuid')
        if (uuid) {
          panelOptions[uuid] = getOriginalStyles(panel, panelStyle)
          Object.entries(panelStyle).forEach(([key, value]) => {
            panel.style[key] = value
          })
        }
      })

      tl = gsap.timeline()

      const createAnimatedTimeline = (selectors, scrollTriggerConfig) => {
        selectors.forEach((selector, index) => {
          const props = {
            opacity: 0,
            scale: 0.5,
            duration: 1,
            force3D: true
          }

          if (index % 2 === 0) {
            props.xPercent = 100
          } else {
            props.yPercent = 100
          }

          tl.from(selector, props)
        })

        scrollTriggerInstance = ScrollTrigger.create({
          ...scrollTriggerConfig,
          animation: tl
        })
      }

      const list = panels.slice(1)
      createAnimatedTimeline(list, {
        trigger: '.animation-layer',
        start: 'top top',
        end: '+=' + window.innerWidth,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1
      })

      // 注册清理函数到管理器
      animationManager.add('scalePanelScroll', cleanup, 'cleanup')

      console.log('[ScalePanelScroll] 初始化完成')
    })

    return cleanup
  }

  /**
   * 横纵向页面动画（优化版）
   */
  const initHorizontalAnimation = (pageList) => {
    ScrollTrigger.refresh()

    let allTweens = []
    let tweenTriggers = []

    const cleanup = () => {
      console.log('[InitHorizontal] 开始清理...')

      // 清理所有tweens
      allTweens.forEach((tween, index) => {
        safeKillGSAP(tween, `horizontalTween[${index}]`)
        safeKillScrollTrigger(tween.scrollTrigger, `horizontalTrigger[${index}]`)
      })
      allTweens = []

      // 清理tweenTriggers
      tweenTriggers.forEach((st, index) => {
        safeKillScrollTrigger(st, `tweenTrigger[${index}]`)
      })
      tweenTriggers = []

      killAllAnimation({ keepScrollPosition: true, silent: true })

      console.log('[InitHorizontal] 清理完成')
    }

    nextTick(() => {
      pageList.forEach(item => {
        if (!item.horizontal) return

        const container = document.querySelector(`.${item.className}`)
        if (!container) return

        const panels = container.querySelectorAll('.panel')
        if (!panels.length) return

        const tween = gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            start: 'top top',
            scrub: 1,
            anticipatePin: 1,
            snap: {
              snapTo: 1 / (panels.length - 1),
              inertia: false,
              duration: { min: 0.1, max: 0.1 }
            },
            end: () => '+=' + (container.offsetWidth - window.innerWidth)
          }
        })

        item.tween = tween
        allTweens.push(tween)
        tweenTriggers.push(tween.scrollTrigger)
        animationManager.add(`horizontal-${item.className}`, tween, 'animation')
      })

      // 注册清理函数到管理器
      animationManager.add('horizontalAnimation', cleanup, 'cleanup')

      console.log('[InitHorizontal] 初始化完成')
    })

    return cleanup
  }

  /**
   * 自定义横向滚动（优化版）
   */
  const customizeAnimation = (pageList = [], classNane = 'vertical') => {
    ScrollTrigger.refresh()

    let newPanels = []
    let tl = null
    let scrollTriggerInstance = null
    let layerRef = null
    let layerOptions = {}
    let panelOptions = {}

    const cleanup = () => {
      console.log('[CustomizeAnimation] 开始清理...')

      // 恢复layer原始样式
      if (layerRef && Object.keys(layerOptions).length) {
        Object.entries(layerOptions).forEach(([key, value]) => {
          layerRef.style[key] = value
        })
      }

      // 恢复panels原始样式
      newPanels.forEach(panel => {
        const panelStyleId = panel.el.getAttribute('uuid')
        if (panelStyleId && panelOptions[panelStyleId]) {
          Object.entries(panelOptions[panelStyleId]).forEach(([key, value]) => {
            panel.el.style[key] = value
          })
        }
        panel.el.style.transform = ''
        panel.el.style.opacity = ''
      })

      // 清理ScrollTrigger
      safeKillScrollTrigger(scrollTriggerInstance, 'customizeScrollTrigger')
      scrollTriggerInstance = null

      // 清理timeline
      if (tl) {
        safeKillGSAP(tl, 'customizeTimeline')
        tl = null
      }

      killAllAnimation({ keepScrollPosition: true, silent: true })

      console.log('[CustomizeAnimation] 清理完成')
    }

    nextTick(() => {
      const layerStyle = {
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }

      const panelStyle = {
        width: '100vw',
        height: '100vh',
        position: 'absolute'
      }

      const panels = gsap.utils.toArray(`.${classNane}`) || []
      if (panels.length <= 1) {
        console.warn('[CustomizeAnimation] panels数量不足')
        return
      }

      const panelMap = new Map()
      pageList.forEach(item => {
        if (item.uuid) panelMap.set(item.uuid, item)
      })

      panels.forEach(panel => {
        const uuid = panel.getAttribute('uuid')
        const item = panelMap.get(uuid)
        if (item) {
          newPanels.push({
            ...item,
            el: panel
          })
        }
      })

      layerRef = document.querySelector('.animation-layer')
      if (!layerRef) {
        console.warn('[CustomizeAnimation] 未找到animation-layer')
        return
      }

      // 保存并应用layer样式
      layerOptions = getOriginalStyles(layerRef, layerStyle)
      Object.entries(layerStyle).forEach(([key, value]) => {
        layerRef.style[key] = value
      })

      // 保存并应用panels样式
      newPanels.forEach(panel => {
        const uuid = panel.el.getAttribute('uuid')
        if (uuid) {
          panelOptions[uuid] = getOriginalStyles(panel.el, panelStyle)
          Object.entries(panelStyle).forEach(([key, value]) => {
            panel.el.style[key] = value
          })
        }
      })

      tl = gsap.timeline()

      const createAnimatedTimeline = (selectors, scrollTriggerConfig) => {
        selectors.forEach(selector => {
          const animationStyle = selector?.formData?.animationStyle || {}
          const props = {
            ...animationStyle,
            opacity: 0,
            duration: animationStyle.duration || 1,
            force3D: true
          }

          const cleanedProps = Object.fromEntries(
            Object.entries(props).filter(([key, value]) => value !== undefined)
          )

          tl.from(selector.el, cleanedProps)
        })

        scrollTriggerInstance = ScrollTrigger.create({
          ...scrollTriggerConfig,
          animation: tl
        })
      }

      const list = newPanels.slice(1)
      createAnimatedTimeline(list, {
        trigger: '.animation-layer',
        start: 'top top',
        end: '+=' + window.innerWidth,
        scrub: 0.5,
        pin: true,
        anticipatePin: 1
      })

      // 注册清理函数到管理器
      animationManager.add('customizeAnimation', cleanup, 'cleanup')

      console.log('[CustomizeAnimation] 初始化完成')
    })

    return cleanup
  }

  // ==================== 导出API ====================
  return {
    // 引用
    pageRef,
    panelRef,
    scrollTween,

    // 动画管理
    addAnimation,
    initAnimation,
    killAnimation,
    killAllAnimation,
    cleanupPageAnimations,
    resetAnimationState,
    pauseAnimation,
    resumeAnimation,
    playAnimation,

    // 基础动画
    horizontalAnimation,
    verticalAnimation,
    selfAnimation,
    scrollAnimation,

    // 页面动画
    initHorizontalAnimation,
    infinitePanelScrollAnimation,
    scalePanelScrollAnimation,
    customizeAnimation,

    // 新模板 V4-V11
    threeDCardFlipAnimation,
    particleWaveAnimation,
    wormholeAnimation,
    glassShatterAnimation,
    liquidFlowAnimation,
    fractalGrowAnimation,
    quantumEntanglementAnimation,
    magneticDistortionAnimation,

    // 专业级模板 V12-V19
    origamiFoldAnimation,
    moebiusTransformAnimation,
    auroraFlowAnimation,
    particleConvergeAnimation,
    dnaHelixAnimation,
    honeycombUnfoldAnimation,
    hologramScanAnimation,
    kaleidoscopeMirrorAnimation,

    // 精英级模板 V20-V27
    liquidSurfaceTensionAnimation,
    electromagneticWaveAnimation,
    fragmentReassembleAnimation,
    parallaxDepthAnimation,
    matrixRainAnimation,
    galaxyRotationAnimation,
    fluidVortexAnimation,
    panoramaUnfoldAnimation,

    // 传奇级模板 V28-V35
    interstellarPortalAnimation,
    quantumTunnelAnimation,
    cyberspaceAnimation,
    liquidMetalAnimation,
    timeFoldAnimation,
    nebulaBirthAnimation,
    neonCityAnimation,
    ultimateParallaxAnimation,

    // 精华级模板 V36-V43
    smoothHorizontalAnimation,
    elasticScaleAnimation,
    infiniteSmoothAnimation,
    fadeUpAnimation,
    staggeredHorizontalAnimation,
    scaleFadeAnimation,
    infiniteRotateAnimation,
    smoothComboAnimation,

    // 大师级模板 V44-V51
    particleExplosionAnimation,
    liquidMorphAnimation,
    holographicDataflowAnimation,
    magneticAttractionAnimation,
    origamiUnfoldAnimation,
    auroraRippleAnimation,
    neonGlitchAnimation,
    wormholeTravelAnimation,

    // 管理器实例（用于调试和高级操作）
    _animationManager: animationManager,
    _debounceManager: debounceManager,
    _stateManager: stateManager
  }
}

// ==================== 视口检测Hook（优化版）====================
export const UseInViewportMiddle = ({ threshold = 0.5, data = {} }) => {
  const { selfAnimation } = UseAnimation()
  const isVisible = ref(false)
  let observer = null
  const targetRef = ref(null)

  const callback = (entries) => {
    const entry = entries[0]
    if (!entry) return

    const wasVisible = isVisible.value
    isVisible.value = entry.intersectionRatio >= threshold

    if (isVisible.value && !wasVisible) {
      // 进入视口
      selfAnimation(data)
    } else if (!isVisible.value && wasVisible) {
      // 离开视口
      data?.gsap?.reverse?.()
    }
  }

  const startObserving = (target) => {
    if (!target) {
      console.warn('[UseInViewportMiddle] 目标元素为空')
      return
    }

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(callback, {
        root: null,
        rootMargin: '0px',
        threshold: [0, threshold, 1]
      })
      observer.observe(target)
      console.log('[UseInViewportMiddle] 开始观察')
    } else {
      console.warn('[UseInViewportMiddle] IntersectionObserver 不支持')
    }
  }

  const stopObserving = () => {
    if (observer) {
      observer.disconnect()
      observer = null
      console.log('[UseInViewportMiddle] 停止观察')
    }
  }

  onMounted(() => {
    nextTick(() => {
      const targetElement = targetRef.value
      if (targetElement) {
        startObserving(targetElement)
      } else {
        console.error('[UseInViewportMiddle] 目标元素未找到')
      }
    })
  })

  onBeforeUnmount(() => {
    stopObserving()
  })

  return {
    targetRef,
    isVisible,
    startObserving,
    stopObserving
  }
}

// ==================== 悬停动画Hook（优化版）====================
export const UserHoverAnimation = () => {
  const hoverStyle = ref({})
  const currentElement = ref(null)

  const handleMouseEnter = (itemData) => {
    if (!itemData?.formData?.hoverStyle) {
      console.warn('[UserHoverAnimation] hoverStyle为空')
      return
    }

    const sty = computedStyle(itemData.formData.hoverStyle, itemData.formData.hoverKeys)

    const duration = itemData.formData.hoverStyle.duration || 0.3
    sty.transition = `all ${duration}s ease`

    hoverStyle.value = sty
  }

  const handleMouseLeave = () => {
    hoverStyle.value = {}
  }

  return {
    hoverStyle,
    currentElement,
    handleMouseEnter,
    handleMouseLeave
  }
}
