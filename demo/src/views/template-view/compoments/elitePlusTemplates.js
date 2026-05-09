/**
 * 精华级动画模板 (V36-V43)
 * 基于优秀模板深度学习：横向、横竖、无限、缩放
 * 提炼核心设计精髓，创作简洁优雅的动画
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 等待DOM准备就绪
function waitForDOM(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback)
  } else {
    setTimeout(callback, 100)
  }
}

// 注册插件
function registerPlugins() {
  if (!gsap.plugins?.registered?.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger)
  }
}

// ============ V36: 平滑横向 ============
/**
 * 基于横向模版，优化过渡曲线
 * 核心：更自然的ease曲线，更流畅的滚动
 */
export const smoothHorizontalAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'top top',
          scrub: 1.5, // 更平滑的scrub
          anticipatePin: 1 // 提前预判
        }
      })

      // 简洁的横向进入
      tl.fromTo(panel,
        {
          x: -100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut' // 更平滑的曲线
        }
      )

      // 添加微妙的垂直浮动
      tl.to(panel, {
        y: -20,
        duration: 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
      }, 0.3)

      cleanupFunctions.push(() => tl.kill())
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V37: 弹性缩放 ============
/**
 * 基于缩放模版，增加弹性效果
 * 核心：back缓动 + 过冲效果，更有活力
 */
export const elasticScaleAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.8
        }
      })

      // 弹性缩放进入
      tl.fromTo(panel,
        {
          scale: 0.3,
          opacity: 0
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'back.out(1.7)' // 强烈的弹性
        }
      )

      // 添加旋转效果
      tl.to(panel, {
        rotation: index % 2 === 0 ? 5 : -5,
        duration: 0.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1
      }, 0.4)

      cleanupFunctions.push(() => tl.kill())
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V38: 无限循环优化 ============
/**
 * 基于无限模版，优化循环体验
 * 核心：无缝衔接 + snap吸附
 */
export const infiniteSmoothAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length || panels.length < 2) return

    // 创建克隆节点
    const clone = panels[0].cloneNode(true)
    panels[0].parentNode.appendChild(clone)

    // Pin所有面板
    panels.forEach(panel => {
      const trigger = ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        pin: true,
        pinSpacing: false
      })
      cleanupFunctions.push(() => trigger.kill())
    })

    // 创建滚动snap
    const scrollTrigger = ScrollTrigger.create({
      trigger: '.animation-layer',
      start: 'top top',
      end: 'bottom bottom',
      snap: {
        snapTo: 1 / (panels.length),
        inertia: false
      }
    })
    cleanupFunctions.push(() => scrollTrigger.kill())

    // 每个面板的动画
    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      })

      // 淡入淡出
      tl.fromTo(panel,
        {
          opacity: 0,
          scale: 0.95
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power1.inOut'
        }
      )

      // 添加轻微的旋转
      tl.to(panel, {
        rotation: (index % 2 === 0 ? 2 : -2),
        duration: 1,
        ease: 'sine.inOut'
      }, 0)

      cleanupFunctions.push(() => tl.kill())
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V39: 淡入上移 ============
/**
 * 基于横竖模版，提炼最简洁的效果
 * 核心：淡入 + 向上移动，经典且优雅
 */
export const fadeUpAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.5
        }
      })

      // 经典的淡入上移
      tl.fromTo(panel,
        {
          y: 80,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out' // 平滑的减速
        }
      )

      // 添加轻微的横向倾斜
      tl.to(panel, {
          skewX: index % 2 === 0 ? 1 : -1,
          duration: 0.5,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1
        }, 0.3
      )

      cleanupFunctions.push(() => tl.kill())
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V40: 交错横向 ============
/**
 * 基于横向模版，添加交错效果
 * 核心：不同面板不同速度，更有层次感
 */
export const staggeredHorizontalAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    // 为每个面板单独创建滚动触发器，确保进入视口时立即开始动画
    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=100', // 提前100px触发
          end: 'center center',
          scrub: 1.2
        }
      })

      // 交错动画
      tl.fromTo(panel,
        {
          x: (index % 2 === 0 ? -100 : 100),
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        }
      )

      // 添加持续的轻微摆动
      gsap.to(panel, {
        rotation: (index % 2 === 0 ? 1 : -1),
        duration: 2 + Math.random(),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
      })

      cleanupFunctions.push(() => gsap.killTweensOf(panel))
      cleanupFunctions.push(() => tl.kill())
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V41: 缩放淡入 ============
/**
 * 基于缩放模版，简化并优化
 * 核心：从中心缩放 + 淡入，简洁大方
 */
export const scaleFadeAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.2
        }
      })

      // 从中心缩放淡入
      tl.fromTo(panel,
        {
          scale: 0.7,
          opacity: 0,
          filter: 'blur(10px)'
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power2.out'
        }
      )

      // 添加轻微的阴影变化
      tl.to(panel, {
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        duration: 0.8,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 1
      }, 0.4)

      cleanupFunctions.push(() => tl.kill())
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V42: 无限旋转 ============
/**
 * 基于无限模版，添加旋转效果
 * 核心：无限滚动 + 持续旋转
 */
export const infiniteRotateAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length || panels.length < 2) return

    // 创建克隆
    const clone = panels[0].cloneNode(true)
    panels[0].parentNode.appendChild(clone)

    // Pin面板
    panels.forEach(panel => {
      const trigger = ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        pin: true,
        pinSpacing: false
      })
      cleanupFunctions.push(() => trigger.kill())
    })

    // 滚动snap
    const scrollTrigger = ScrollTrigger.create({
      trigger: '.animation-layer',
      start: 'top top',
      end: 'bottom bottom',
      snap: {
        snapTo: 1 / (panels.length),
        inertia: false
      }
    })
    cleanupFunctions.push(() => scrollTrigger.kill())

    // 每个面板的动画
    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.3
        }
      })

      // 淡入
      tl.fromTo(panel,
        {
          opacity: 0,
          scale: 0.9
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power1.out'
        }
      )

      // 持续旋转
      gsap.to(panel, {
        rotation: 360,
        duration: 20 + index * 5,
        repeat: -1,
        ease: 'none'
      })

      cleanupFunctions.push(() => gsap.killTweensOf(panel))
      cleanupFunctions.push(() => tl.kill())
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V43: 平滑组合 ============
/**
 * 融合所有优秀模板的核心精髓
 * 核心：横向 + 缩放 + 淡入，三合一
 */
export const smoothComboAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2 // 更平滑
        }
      })

      // 三合一：横向 + 缩放 + 淡入
      tl.fromTo(panel,
        {
          x: index % 2 === 0 ? -80 : 80,
          scale: 0.85,
          opacity: 0
        },
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.inOut' // 最平滑的曲线
        }
      )

      // 添加微妙的3D效果
      tl.to(panel, {
        rotationY: index % 2 === 0 ? 3 : -3,
        duration: 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
      }, 0.5)

      // 添加轻微的模糊到清晰
      tl.fromTo(panel,
        { filter: 'blur(5px)' },
        { filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' },
        0
      )

      cleanupFunctions.push(() => tl.kill())
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}
