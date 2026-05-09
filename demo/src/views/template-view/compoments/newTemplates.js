/*
 * 新增酷炫模板动画
 * @Author: AI Assistant
 * @Date: 2026-02-03
 */

import gsap from 'gsap/dist/gsap.js'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js'

// 单例注册插件
let pluginsRegistered = false
const registerPlugins = () => {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    pluginsRegistered = true
  }
}

// 等待DOM准备好的辅助函数
const waitForDOM = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback)
  } else {
    setTimeout(callback, 0)
  }
}

/**
 * 模板1: 3D卡片翻转滚动
 * 面板随着滚动进行3D翻转效果
 */
export const threeDCardFlipAnimation = () => {
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
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          rotationY: 90 * (index % 2 === 0 ? 1 : -1),
          rotationX: 0,
          opacity: 0,
          scale: 0.8,
          transformOrigin: 'center center'
        },
        {
          rotationY: 0,
          rotationX: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        }
      )

      cleanupFunctions.push(() => tl.kill())
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

/**
 * 模板2: 粒子波浪滚动
 * 面板以波浪形式进入，带有粒子效果
 */
export const particleWaveAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const container = document.querySelector('.animation-layer')
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    const particlesContainer = document.createElement('div')
    particlesContainer.className = 'particles-overlay'
    particlesContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 100;
    `
    container.appendChild(particlesContainer)

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `
      particlesContainer.appendChild(particle)

      gsap.to(particle, {
        y: '-=100',
        x: `+=${Math.random() * 100 - 50}`,
        opacity: 0,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        delay: Math.random() * 2,
        ease: 'none'
      })

      cleanupFunctions.push(() => gsap.killTweensOf(particle))
    }

    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
          rotation: index % 2 === 0 ? -5 : 5
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: 'power2.out'
        }
      )

      cleanupFunctions.push(() => tl.kill())
    })

    cleanupFunctions.push(() => {
      if (particlesContainer.parentNode) {
        particlesContainer.parentNode.removeChild(particlesContainer)
      }
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

/**
 * 模板3: 虫洞穿梭效果
 * 面板以虫洞效果缩放穿梭
 */
export const wormholeAnimation = () => {
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
          start: 'top center',
          end: 'center center',
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          scale: 3,
          opacity: 0,
          rotation: 180,
          filter: 'blur(20px)'
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power4.inOut'
        }
      )

      const starsContainer = document.createElement('div')
      starsContainer.className = 'wormhole-stars'
      starsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(starsContainer)

      for (let i = 0; i < 30; i++) {
        const star = document.createElement('div')
        star.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 1}px;
          height: ${Math.random() * 4 + 1}px;
          background: white;
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: 0;
        `
        starsContainer.appendChild(star)

        gsap.to(star, {
          opacity: Math.random() * 0.8 + 0.2,
          scale: Math.random() * 2 + 1,
          duration: Math.random() * 1 + 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        })

        cleanupFunctions.push(() => gsap.killTweensOf(star))
      }

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (starsContainer.parentNode) {
          starsContainer.parentNode.removeChild(starsContainer)
        }
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

/**
 * 模板4: 玻璃破碎效果
 * 面板以玻璃破碎的方式进入
 */
export const glassShatterAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'top top',
          scrub: 1
        }
      })

      const shards = document.createElement('div')
      shards.className = 'glass-shards'
      shards.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      `
      panel.appendChild(shards)

      for (let i = 0; i < 12; i++) {
        const shard = document.createElement('div')
        const angle = (i / 12) * 360
        const distance = Math.random() * 200 + 100

        shard.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${Math.random() * 50 + 30}px;
          height: ${Math.random() * 50 + 30}px;
          background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
          clip-path: polygon(${Math.random() * 100}% ${Math.random() * 100}%, ${Math.random() * 100}% ${Math.random() * 100}%, ${Math.random() * 100}% ${Math.random() * 100}%);
          transform: translate(-50%, -50%) rotate(${angle}deg);
          opacity: 0;
        `
        shards.appendChild(shard)

        gsap.to(shard, {
          x: Math.cos(angle * Math.PI / 180) * distance,
          y: Math.sin(angle * Math.PI / 180) * distance,
          opacity: 1,
          rotation: `+=${Math.random() * 360}`,
          duration: 0.5,
          delay: i * 0.05,
          ease: 'power2.out'
        })

        cleanupFunctions.push(() => gsap.killTweensOf(shard))
      }

      tl.fromTo(panel.querySelector('.glass-shards'),
        {
          scale: 2,
          opacity: 0,
          filter: 'blur(10px)'
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        }
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (shards.parentNode) {
          shards.parentNode.removeChild(shards)
        }
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

/**
 * 模板5: 液体流动效果
 * 面板以液体流动的方式变换
 */
export const liquidFlowAnimation = () => {
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
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          scaleY: 0.3,
          scaleX: 1.5,
          skewY: 30,
          opacity: 0,
          borderRadius: '50%',
          filter: 'blur(5px)'
        },
        {
          scaleY: 1,
          scaleX: 1,
          skewY: 0,
          opacity: 1,
          borderRadius: '0',
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power2.inOut'
        }
      )

      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
      `
      panel.appendChild(ripple)

      for (let i = 0; i < 5; i++) {
        const wave = document.createElement('div')
        wave.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          pointer-events: none;
        `
        ripple.appendChild(wave)

        gsap.to(wave, {
          width: 500,
          height: 500,
          opacity: 0,
          duration: 2,
          repeat: -1,
          delay: i * 0.4,
          ease: 'none'
        })

        cleanupFunctions.push(() => gsap.killTweensOf(wave))
      }

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple)
        }
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

/**
 * 模板6: 分形生长效果
 * 面板以分形模式生长展开
 */
export const fractalGrowAnimation = () => {
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
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          scale: 0,
          rotation: -180,
          opacity: 0,
          transformOrigin: 'center center'
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'elastic.out(1, 0.7)'
        }
      )

      const geometry = document.createElement('div')
      geometry.className = 'fractal-geometry'
      geometry.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(geometry)

      for (let i = 0; i < 6; i++) {
        const shape = document.createElement('div')
        const size = Math.random() * 100 + 50
        shape.style.cssText = `
          position: absolute;
          top: ${Math.random() * 80}%;
          left: ${Math.random() * 80}%;
          width: ${size}px;
          height: ${size}px;
          border: 2px solid rgba(255,255,255,${Math.random() * 0.3 + 0.1});
          transform: rotate(${Math.random() * 360}deg) scale(0);
          transform-origin: center center;
          transition: transform 0.5s ease;
        `
        geometry.appendChild(shape)

        gsap.to(shape, {
          scale: Math.random() * 2 + 1,
          rotation: `+=${Math.random() * 360}`,
          duration: Math.random() * 2 + 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2
        })

        cleanupFunctions.push(() => gsap.killTweensOf(shape))
      }

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (geometry.parentNode) {
          geometry.parentNode.removeChild(geometry)
        }
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

/**
 * 模板7: 量子纠缠效果
 * 多个面板同时进行量子纠缠动画
 */
export const quantumEntanglementAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    const connectionLines = document.createElement('div')
    connectionLines.className = 'quantum-connections'
    connectionLines.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99;
    `
    document.querySelector('.animation-layer').appendChild(connectionLines)

    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          scale: 0.5,
          opacity: 0,
          filter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)'
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)',
          duration: 1,
          ease: 'power3.inOut'
        }
      )

      const line = document.createElement('div')
      line.className = 'quantum-line'
      line.style.cssText = `
        position: absolute;
        width: 2px;
        height: 100px;
        background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), transparent);
        transform-origin: top center;
        opacity: 0;
      `
      connectionLines.appendChild(line)

      gsap.to(line, {
        opacity: 1,
        duration: 0.5,
        delay: index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      cleanupFunctions.push(() => gsap.killTweensOf(line))
      cleanupFunctions.push(() => tl.kill())
    })

    cleanupFunctions.push(() => {
      if (connectionLines.parentNode) {
        connectionLines.parentNode.removeChild(connectionLines)
      }
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

/**
 * 模板8: 磁场扭曲效果
 * 面板在磁场中扭曲变形
 */
export const magneticDistortionAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    const magneticField = document.createElement('div')
    magneticField.className = 'magnetic-field'
    magneticField.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 98;
    `
    document.querySelector('.animation-layer').appendChild(magneticField)

    for (let i = 0; i < 8; i++) {
      const line = document.createElement('div')
      line.className = 'magnetic-line'
      line.style.cssText = `
        position: absolute;
        width: 100%;
        height: 2px;
        top: ${(i / 8) * 100}%;
        left: 0;
        background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
        transform: scaleX(0);
        transform-origin: center center;
      `
      magneticField.appendChild(line)

      gsap.to(line, {
        scaleX: 1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.1
      })

      cleanupFunctions.push(() => gsap.killTweensOf(line))
    }

    panels.forEach((panel, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'top top',
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          skewX: 45,
          skewY: 0,
          scaleX: 0.8,
          scaleY: 1.2,
          opacity: 0,
          filter: 'hue-rotate(180deg)'
        },
        {
          skewX: 0,
          skewY: 0,
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          filter: 'hue-rotate(0deg)',
          duration: 1.5,
          ease: 'elastic.out(1, 0.6)'
        }
      )

      cleanupFunctions.push(() => tl.kill())
    })

    cleanupFunctions.push(() => {
      if (magneticField.parentNode) {
        magneticField.parentNode.removeChild(magneticField)
      }
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// 导出所有模板
export const templates = {
  threeDCardFlipAnimation,
  particleWaveAnimation,
  wormholeAnimation,
  glassShatterAnimation,
  liquidFlowAnimation,
  fractalGrowAnimation,
  quantumEntanglementAnimation,
  magneticDistortionAnimation
}

// 模板配置
export const templateConfig = {
  threeDCardFlipAnimation: {
    name: '3D卡片翻转',
    description: '面板进行3D翻转效果',
    horizontalDisable: false,
    verticalDisable: false
  },
  particleWaveAnimation: {
    name: '粒子波浪',
    description: '面板以波浪形式进入，带粒子效果',
    horizontalDisable: true,
    verticalDisable: false
  },
  wormholeAnimation: {
    name: '虫洞穿梭',
    description: '面板以虫洞效果缩放穿梭',
    horizontalDisable: true,
    verticalDisable: false
  },
  glassShatterAnimation: {
    name: '玻璃破碎',
    description: '面板以玻璃破碎方式进入',
    horizontalDisable: true,
    verticalDisable: false
  },
  liquidFlowAnimation: {
    name: '液体流动',
    description: '面板以液体流动方式变换',
    horizontalDisable: true,
    verticalDisable: false
  },
  fractalGrowAnimation: {
    name: '分形生长',
    description: '面板以分形模式生长展开',
    horizontalDisable: true,
    verticalDisable: false
  },
  quantumEntanglementAnimation: {
    name: '量子纠缠',
    description: '多面板同步量子纠缠动画',
    horizontalDisable: false,
    verticalDisable: false
  },
  magneticDistortionAnimation: {
    name: '磁场扭曲',
    description: '面板在磁场中扭曲变形',
    horizontalDisable: true,
    verticalDisable: false
  }
}
