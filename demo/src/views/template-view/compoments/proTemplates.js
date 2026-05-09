/*
 * 专业级高级动画模板 V8-V15
 * 深度运用GSAP核心特性：MotionPath、自定义缓动、时间轴控制、物理模拟
 * @Author: AI Professional Designer
 * @Date: 2026-02-03
 */

import gsap from 'gsap/dist/gsap.js'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js'
import { MotionPathPlugin } from 'gsap/dist/MotionPathPlugin.js'

// 注册插件
let pluginsRegistered = false
const registerPlugins = () => {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
    pluginsRegistered = true
  }
}

// DOM等待辅助
const waitForDOM = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback)
  } else {
    setTimeout(callback, 0)
  }
}

// ============ V8: 纸张折叠动画 ============
export const origamiFoldAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建折叠层
      const foldLayers = []
      const numLayers = 4

      for (let i = 0; i < numLayers; i++) {
        const layer = document.createElement('div')
        layer.className = `origami-layer-${i}`
        layer.style.cssText = `
          position: absolute;
          top: ${i * 25}%;
          left: 0;
          width: 100%;
          height: 25%;
          background: inherit;
          transform-origin: ${index % 2 === 0 ? 'top' : 'bottom'} center;
          transform-style: preserve-3d;
          backface-visibility: visible;
          z-index: ${numLayers - i};
        `
        panel.style.transformStyle = 'preserve-3d'
        panel.style.perspective = '1000px'
        panel.appendChild(layer)
        foldLayers.push(layer)
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.5,
          toggleActions: 'play reverse play reverse'
        }
      })

      // 折叠展开动画
      foldLayers.forEach((layer, i) => {
        const direction = index % 2 === 0 ? 1 : -1
        const delay = i * 0.1

        tl.fromTo(layer,
          {
            rotationX: -90 * direction,
            opacity: 0,
            scale: 0.8
          },
          {
            rotationX: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power2.inOut'
          },
          delay
        )
      })

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        foldLayers.forEach(layer => {
          if (layer.parentNode) layer.parentNode.removeChild(layer)
        })
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V9: 莫比乌斯环变形 ============
export const moebiusTransformAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '1500px'

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      })

      // 多阶段变形
      tl.fromTo(panel,
        {
          rotationX: 0,
          rotationY: 0,
          rotationZ: 0,
          scale: 0.5,
          opacity: 0,
          borderRadius: '50%'
        },
        {
          rotationX: 180,
          rotationY: 360,
          rotationZ: 90,
          scale: 0.8,
          opacity: 0.5,
          borderRadius: '0%',
          duration: 1,
          ease: 'power1.inOut'
        },
        0
      )
        .to(panel,
          {
            rotationX: 360,
            rotationY: 720,
            rotationZ: 180,
            scale: 1,
            opacity: 1,
            borderRadius: '10%',
            duration: 1,
            ease: 'power2.out'
          },
          1
        )

      // 添加环绕线条
      const ringContainer = document.createElement('div')
      ringContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
      `
      panel.appendChild(ringContainer)

      for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div')
        const size = 120 + i * 40
        ring.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          border: 2px solid rgba(255,255,255,${0.3 - i * 0.1});
          border-radius: 50%;
          transform: translate(-50%, -50%) rotateX(${i * 20}deg);
        `
        ringContainer.appendChild(ring)

        gsap.to(ring, {
          rotation: `+=${360 * (i + 1)}`,
          duration: 3 + i,
          repeat: -1,
          ease: 'none'
        })

        cleanupFunctions.push(() => gsap.killTweensOf(ring))
      }

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (ringContainer.parentNode) ringContainer.parentNode.removeChild(ringContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V10: 极光光效流淌 ============
export const auroraFlowAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建极光层
      const auroraContainer = document.createElement('div')
      auroraContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        mix-blend-mode: screen;
      `
      panel.appendChild(auroraContainer)

      const numBands = 5
      const bands = []

      for (let i = 0; i < numBands; i++) {
        const band = document.createElement('div')
        const hue = (index * 60 + i * 30) % 360
        band.style.cssText = `
          position: absolute;
          width: 200%;
          height: ${80 + i * 20}px;
          background: linear-gradient(90deg, 
            transparent,
            hsla(${hue}, 80%, 60%, 0.4),
            hsla(${hue + 30}, 80%, 60%, 0.6),
            hsla(${hue + 60}, 80%, 60%, 0.4),
            transparent
          );
          top: ${20 + i * 15}%;
          left: -50%;
          filter: blur(${20 + i * 5}px);
          opacity: 0.5;
        `
        auroraContainer.appendChild(band)
        bands.push(band)
      }

      // 极光动画
      bands.forEach((band, i) => {
        gsap.to(band, {
          x: '100%',
          duration: 8 + i * 2,
          repeat: -1,
          ease: 'none',
          delay: i * 0.5
        })
        gsap.to(band, {
          opacity: 0.8,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.8
        })
        cleanupFunctions.push(() => gsap.killTweensOf(band))
      })

      // 面板进入动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'top center',
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
          filter: 'blur(10px)'
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out'
        }
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (auroraContainer.parentNode) auroraContainer.parentNode.removeChild(auroraContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V11: 粒子汇聚成形 ============
export const particleConvergeAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const particleContainer = document.createElement('div')
      particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
      `
      document.body.appendChild(particleContainer)

      const numParticles = 60
      const particles = []
      const panelRect = panel.getBoundingClientRect()

      for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div')
        const size = Math.random() * 4 + 2
        const hue = (index * 40 + Math.random() * 60) % 360

        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: hsla(${hue}, 70%, 60%, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 ${size * 2}px hsla(${hue}, 70%, 60%, 0.5);
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `
        particleContainer.appendChild(particle)
        particles.push({
          element: particle,
          startX: parseFloat(particle.style.left),
          startY: parseFloat(particle.style.top),
          targetX: panelRect.left + panelRect.width / 2,
          targetY: panelRect.top + panelRect.height / 2,
          delay: Math.random() * 0.5
        })
      }

      // 粒子汇聚动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
          once: true
        }
      })

      particles.forEach((p) => {
        tl.to(p.element, {
          left: p.targetX + 'px',
          top: p.targetY + 'px',
          scale: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut'
        }, p.delay)
      })

      // 面板显现
      tl.fromTo(panel,
        { opacity: 0, scale: 1.2 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        },
        0.4
      )

      // 粒子爆炸离开
      particles.forEach((p) => {
        gsap.to(p.element, {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          scale: 1.5,
          opacity: 0,
          duration: 1,
          delay: 1.2 + p.delay,
          ease: 'power2.out'
        })
        cleanupFunctions.push(() => gsap.killTweensOf(p.element))
      })

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        setTimeout(() => {
          if (particleContainer.parentNode) {
            particleContainer.parentNode.removeChild(particleContainer)
          }
        }, 3000)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V12: DNA双螺旋流动 ============
export const dnaHelixAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const helixContainer = document.createElement('div')
      helixContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(helixContainer)

      const numPairs = 20
      const strands = []

      for (let i = 0; i < numPairs; i++) {
        const pair = document.createElement('div')
        pair.style.cssText = `
          position: absolute;
          top: ${(i / numPairs) * 100}%;
          left: 50%;
          width: 80%;
          height: 2px;
          transform: translateX(-50%);
        `

        const dot1 = document.createElement('div')
        const dot2 = document.createElement('div')
        const baseSize = 6 + Math.random() * 4
        const hue1 = (index * 30 + i * 10) % 360
        const hue2 = (hue1 + 180) % 360

        dot1.style.cssText = `
          position: absolute;
          width: ${baseSize}px;
          height: ${baseSize}px;
          background: radial-gradient(circle, hsla(${hue1}, 80%, 60%, 0.9), hsla(${hue1}, 80%, 60%, 0));
          border-radius: 50%;
          left: ${Math.sin(i * 0.3) * 40 + 50}%;
          transform: translateX(-50%);
          box-shadow: 0 0 ${baseSize * 2}px hsla(${hue1}, 80%, 60%, 0.5);
        `

        dot2.style.cssText = `
          position: absolute;
          width: ${baseSize}px;
          height: ${baseSize}px;
          background: radial-gradient(circle, hsla(${hue2}, 80%, 60%, 0.9), hsla(${hue2}, 80%, 60%, 0));
          border-radius: 50%;
          left: ${Math.sin(i * 0.3 + Math.PI) * 40 + 50}%;
          transform: translateX(-50%);
          box-shadow: 0 0 ${baseSize * 2}px hsla(${hue2}, 80%, 60%, 0.5);
        `

        pair.appendChild(dot1)
        pair.appendChild(dot2)
        helixContainer.appendChild(pair)

        strands.push({ dot1, dot2, index: i })
      }

      // 双螺旋旋转动画
      strands.forEach((strand, i) => {
        gsap.to(strand.dot1, {
          left: `${Math.sin(i * 0.3 + Math.PI) * 40 + 50}%`,
          duration: 2,
          repeat: -1,
          ease: 'none',
          delay: i * 0.05
        })
        gsap.to(strand.dot2, {
          left: `${Math.sin(i * 0.3) * 40 + 50}%`,
          duration: 2,
          repeat: -1,
          ease: 'none',
          delay: i * 0.05
        })
        cleanupFunctions.push(() => gsap.killTweensOf(strand.dot1))
        cleanupFunctions.push(() => gsap.killTweensOf(strand.dot2))
      })

      // 面板动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          scale: 0.8,
          opacity: 0,
          rotationZ: 5
        },
        {
          scale: 1,
          opacity: 1,
          rotationZ: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)'
        }
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (helixContainer.parentNode) helixContainer.parentNode.removeChild(helixContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V13: 蜂巢六边形展开 ============
export const honeycombUnfoldAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const hexContainer = document.createElement('div')
      hexContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(hexContainer)

      const hexagons = []
      const rows = 5
      const cols = 6
      const hexSize = 40

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const hex = document.createElement('div')
          const offsetX = (row % 2) * (hexSize * 0.75)
          const x = col * (hexSize * 1.5) + offsetX - hexSize
          const y = row * (hexSize * 0.866) - hexSize * 0.5
          const hue = (index * 20 + row * 20 + col * 10) % 360
          const delay = (row * cols + col) * 0.02

          hex.style.cssText = `
            position: absolute;
            width: ${hexSize}px;
            height: ${hexSize * 0.866}px;
            background: linear-gradient(135deg, 
              hsla(${hue}, 60%, 50%, 0.6), 
              hsla(${hue + 30}, 60%, 40%, 0.6)
            );
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            left: ${x + 50}%;
            top: ${y + 50}%;
            transform: translate(-50%, -50%) scale(0);
            transform-origin: center center;
            border: 1px solid rgba(255,255,255,0.3);
            opacity: 0;
          `

          hexContainer.appendChild(hex)
          hexagons.push({ element: hex, delay })
        }
      }

      // 六边形展开动画
      hexagons.forEach((h) => {
        gsap.to(h.element, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
          delay: h.delay
        })

        gsap.to(h.element, {
          rotation: 60,
          duration: 10,
          repeat: -1,
          ease: 'none',
          delay: h.delay + 0.5
        })

        cleanupFunctions.push(() => gsap.killTweensOf(h.element))
      })

      // 面板动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          scale: 0.7,
          opacity: 0,
          rotation: -10
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 1,
          ease: 'power2.out'
        }
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (hexContainer.parentNode) hexContainer.parentNode.removeChild(hexContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V14: 全息投影扫描 ============
export const hologramScanAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建全息层
      const hologramContainer = document.createElement('div')
      hologramContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(hologramContainer)

      // 扫描线
      const scanLine = document.createElement('div')
      scanLine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(0, 255, 255, 0.8), 
          transparent
        );
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.8),
                    0 0 40px rgba(0, 255, 255, 0.4);
        transform: translateY(-100%);
      `
      hologramContainer.appendChild(scanLine)

      // 全息网格
      const gridOverlay = document.createElement('div')
      gridOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
        background-size: 20px 20px;
        opacity: 0;
        transform: perspective(500px) rotateX(60deg);
        transform-origin: top center;
      `
      hologramContainer.appendChild(gridOverlay)

      // 扫描动画
      gsap.to(scanLine, {
        y: '100%',
        duration: 2,
        repeat: -1,
        ease: 'none'
      })

      gsap.to(gridOverlay, {
        opacity: 1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // 全息闪烁效果
      const glitch = document.createElement('div')
      glitch.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 255, 255, 0.1);
        opacity: 0;
      `
      hologramContainer.appendChild(glitch)

      gsap.to(glitch, {
        opacity: 0.3,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
        ease: 'none'
      })

      // 面板动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.5
        }
      })

      tl.fromTo(panel,
        {
          scale: 0.5,
          opacity: 0,
          filter: 'blur(20px)',
          borderColor: 'rgba(0, 255, 255, 0)'
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          borderColor: 'rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), inset 0 0 30px rgba(0, 255, 255, 0.1)',
          duration: 1.5,
          ease: 'power2.out'
        }
      )

      cleanupFunctions.push(() => {
        gsap.killTweensOf(scanLine)
        gsap.killTweensOf(gridOverlay)
        gsap.killTweensOf(glitch)
      })
      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (hologramContainer.parentNode) hologramContainer.parentNode.removeChild(hologramContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V15: 万花筒镜像对称 ============
export const kaleidoscopeMirrorAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const mirrorContainer = document.createElement('div')
      mirrorContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(mirrorContainer)

      const segments = 8
      const mirrors = []

      for (let i = 0; i < segments; i++) {
        const mirror = document.createElement('div')
        const hue = (index * 30 + i * 45) % 360
        const angle = (360 / segments) * i

        mirror.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 60%;
          height: 4px;
          background: linear-gradient(90deg,
            transparent,
            hsla(${hue}, 80%, 60%, 0.8),
            transparent
          );
          transform-origin: left center;
          transform: rotate(${angle}deg) translateX(50px) scaleX(0);
          box-shadow: 0 0 10px hsla(${hue}, 80%, 60%, 0.5);
        `
        mirrorContainer.appendChild(mirror)
        mirrors.push({ element: mirror, angle, delay: i * 0.1 })
      }

      // 镜像展开动画
      mirrors.forEach((m) => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })

        tl.to(m.element, {
          scaleX: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
          .to(m.element, {
            rotation: m.angle + 45,
            duration: 1,
            ease: 'sine.inOut'
          })
          .to(m.element, {
            scaleX: 0,
            duration: 0.5,
            ease: 'power2.in'
          })
          .to(m.element, {
            rotation: m.angle,
            duration: 0,
            ease: 'none'
          })

        tl.delay(m.delay)
        cleanupFunctions.push(() => tl.kill())
      })

      // 面板动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1
        }
      })

      tl.fromTo(panel,
        {
          scale: 0.6,
          opacity: 0,
          rotation: 0
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 360,
          duration: 1.5,
          ease: 'power2.inOut'
        }
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (mirrorContainer.parentNode) mirrorContainer.parentNode.removeChild(mirrorContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// 导出所有模板
export const proTemplates = {
  origamiFoldAnimation,
  moebiusTransformAnimation,
  auroraFlowAnimation,
  particleConvergeAnimation,
  dnaHelixAnimation,
  honeycombUnfoldAnimation,
  hologramScanAnimation,
  kaleidoscopeMirrorAnimation
}

// 模板配置
export const proTemplateConfig = {
  origamiFoldAnimation: {
    name: '纸张折叠',
    description: '3D纸张逐层折叠展开效果',
    horizontalDisable: true,
    verticalDisable: false
  },
  moebiusTransformAnimation: {
    name: '莫比乌斯环',
    description: '无限循环拓扑变换',
    horizontalDisable: true,
    verticalDisable: false
  },
  auroraFlowAnimation: {
    name: '极光流淌',
    description: '自然极光光效流动',
    horizontalDisable: false,
    verticalDisable: false
  },
  particleConvergeAnimation: {
    name: '粒子汇聚',
    description: '粒子从四周汇聚成形',
    horizontalDisable: true,
    verticalDisable: false
  },
  dnaHelixAnimation: {
    name: 'DNA双螺旋',
    description: '生物双螺旋旋转结构',
    horizontalDisable: false,
    verticalDisable: false
  },
  honeycombUnfoldAnimation: {
    name: '蜂巢展开',
    description: '六边形网格有序展开',
    horizontalDisable: true,
    verticalDisable: false
  },
  hologramScanAnimation: {
    name: '全息扫描',
    description: '未来感全息投影扫描',
    horizontalDisable: false,
    verticalDisable: false
  },
  kaleidoscopeMirrorAnimation: {
    name: '万花筒镜像',
    description: '对称镜像几何变换',
    horizontalDisable: false,
    verticalDisable: false
  }
}
