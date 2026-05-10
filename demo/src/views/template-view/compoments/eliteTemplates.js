/*
 * 精英级超高级动画模板 V16-V23
 * 深度运用：物理模拟、复杂时间轴、自定义缓动函数、多维度变换
 * @Author: AI Elite Designer
 * @Date: 2026-02-03
 */

import gsap from 'gsap/dist/gsap.js'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger.js'

// 注册插件
let pluginsRegistered = false
const registerPlugins = () => {
  if (!pluginsRegistered) {
    gsap.registerPlugin(ScrollTrigger)
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

// 自定义弹性缓动
const customElastic = (config) => {
  const { amplitude = 1, period = 0.5 } = config
  return (p) => {
    if (p === 0 || p === 1) return p
    const s = period / (2 * Math.PI) * Math.asin(1 / amplitude)
    return -(amplitude * Math.pow(2, 10 * (p - 1)) * Math.sin((p - 1 - s) * (2 * Math.PI) / period))
  }
}

// 自定义贝塞尔曲线
const bezierPath = (points) => {
  return (t) => {
    const n = points.length - 1
    let result = { x: 0, y: 0 }
    for (let i = 0; i <= n; i++) {
      const binomial = (n, k) => {
        if (k === 0 || k === n) return 1
        let res = 1
        for (let j = 0; j < k; j++) res = res * (n - j) / (j + 1)
        return res
      }
      const b = binomial(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i)
      result.x += points[i].x * b
      result.y += points[i].y * b
    }
    return result
  }
}

// ============ V16: 液体表面张力 ============
export const liquidSurfaceTensionAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const surfaceContainer = document.createElement('div')
      surfaceContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(surfaceContainer)

      // 创建液滴
      const droplets = []
      const numDroplets = 40

      for (let i = 0; i < numDroplets; i++) {
        const droplet = document.createElement('div')
        const size = Math.random() * 20 + 10
        const hue = (index * 25 + Math.random() * 50) % 360
        
        droplet.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle at 30% 30%, 
            hsla(${hue}, 70%, 70%, 0.9),
            hsla(${hue}, 70%, 50%, 0.7),
            hsla(${hue}, 70%, 30%, 0.5)
          );
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: 0;
          filter: blur(1px);
        `
        surfaceContainer.appendChild(droplet)
        droplets.push({
          element: droplet,
          targetX: parseFloat(droplet.style.left),
          targetY: parseFloat(droplet.style.top),
          startX: parseFloat(droplet.style.left) + (Math.random() - 0.5) * 100,
          startY: parseFloat(droplet.style.top) + (Math.random() - 0.5) * 100,
          delay: Math.random() * 2
        })
      }

      // 液滴汇聚动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.5
        }
      })

      droplets.forEach((d) => {
        tl.fromTo(d.element,
          {
            left: d.startX + '%',
            top: d.startY + '%',
            opacity: 0,
            scale: 0.5,
            borderRadius: '50%'
          },
          {
            left: d.targetX + '%',
            top: d.targetY + '%',
            opacity: 1,
            scale: 1,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)'
          },
          d.delay
        )
      })

      // 液滴持续流动
      droplets.forEach((d) => {
        const flowTl = gsap.timeline({ repeat: -1, yoyo: true })
        flowTl.to(d.element, {
          scale: 1.2,
          duration: 1.5 + Math.random(),
          ease: 'sine.inOut'
        })
        .to(d.element, {
          x: Math.random() * 30 - 15,
          y: Math.random() * 30 - 15,
          duration: 2 + Math.random(),
          ease: 'sine.inOut'
        }, 0)
        flowTl.delay(d.delay + 1.5)
        cleanupFunctions.push(() => flowTl.kill())
      })

      // 面板动画
      tl.fromTo(panel,
        {
          y: 80,
          opacity: 0,
          scale: 0.85,
          filter: 'blur(8px)'
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out'
        },
        0
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (surfaceContainer.parentNode) surfaceContainer.parentNode.removeChild(surfaceContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V17: 电磁场波动 ============
export const electromagneticWaveAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const waveContainer = document.createElement('div')
      waveContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(waveContainer)

      // 创建电磁波
      const waveLines = []
      const numWaves = 5

      for (let w = 0; w < numWaves; w++) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('viewBox', '0 0 100 100')
        svg.setAttribute('preserveAspectRatio', 'none')
        svg.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: ${0.3 + w * 0.15};
        `
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        const hue = (index * 30 + w * 40) % 360
        path.setAttribute('stroke', `hsla(${hue}, 70%, 60%, 0.8)`)
        path.setAttribute('stroke-width', '0.5')
        path.setAttribute('fill', 'none')
        path.setAttribute('d', 'M0,50 Q25,50 50,50 T100,50')
        
        svg.appendChild(path)
        waveContainer.appendChild(svg)
        waveLines.push({ svg, path, wave: w, phase: w * Math.PI / numWaves })
      }

      // 波动动画
      waveLines.forEach((w) => {
        gsap.to(w.path, {
          attr: {
            d: (i) => {
              const t = i
              const amplitude = 20 + w.wave * 5
              const frequency = 2 + w.wave * 0.5
              const phase = w.phase + t * 3
              let d = 'M0,50'
              for (let x = 0; x <= 100; x += 2) {
                const y = 50 + Math.sin((x * frequency + phase) * Math.PI / 50) * amplitude
                d += ` L${x},${y}`
              }
              return d
            }
          },
          duration: 2,
          repeat: -1,
          ease: 'none'
        })
        cleanupFunctions.push(() => gsap.killTweensOf(w.path))
      })

      // 面板动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.2
        }
      })

      tl.fromTo(panel,
        {
          scale: 0.9,
          opacity: 0,
          filter: 'blur(10px)',
          borderColor: 'rgba(255,255,255,0)'
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          borderColor: 'rgba(255,255,255,0.3)',
          boxShadow: '0 0 50px rgba(100, 150, 255, 0.3)',
          duration: 1.3,
          ease: 'power2.out'
        }
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (waveContainer.parentNode) waveContainer.parentNode.removeChild(waveContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V18: 碎片重组 ============
export const fragmentReassembleAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const fragmentContainer = document.createElement('div')
      fragmentContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
      `
      panel.appendChild(fragmentContainer)

      // 创建碎片
      const fragments = []
      const gridSize = 8
      const fragSize = 100 / gridSize

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const fragment = document.createElement('div')
          const hue = (index * 20 + row * 20 + col * 10) % 360
          const delay = (row * gridSize + col) * 0.03
          
          fragment.style.cssText = `
            position: absolute;
            width: ${fragSize}%;
            height: ${fragSize}%;
            left: ${col * fragSize}%;
            top: ${row * fragSize}%;
            background: hsla(${hue}, 60%, 50%, 0.7);
            border: 1px solid rgba(255,255,255,0.2);
            transform: translate(0, 0) rotate(0deg) scale(1);
            transform-origin: center center;
            opacity: 0;
            box-shadow: 0 0 10px hsla(${hue}, 60%, 50%, 0.5);
          `
          fragmentContainer.appendChild(fragment)
          
          fragments.push({
            element: fragment,
            startX: (Math.random() - 0.5) * window.innerWidth,
            startY: (Math.random() - 0.5) * window.innerHeight,
            startRotation: Math.random() * 360 - 180,
            startScale: 0.2 + Math.random() * 0.3,
            delay
          })
        }
      }

      // 碎片重组动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2
        }
      })

      fragments.forEach((f) => {
        tl.fromTo(f.element,
          {
            x: f.startX,
            y: f.startY,
            rotation: f.startRotation,
            scale: f.startScale,
            opacity: 0
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.6)'
          },
          f.delay
        )
      })

      // 碎片脉动
      fragments.forEach((f) => {
        gsap.to(f.element, {
          opacity: 0.5,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: f.delay + 1.5
        })
        cleanupFunctions.push(() => gsap.killTweensOf(f.element))
      })

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (fragmentContainer.parentNode) fragmentContainer.parentNode.removeChild(fragmentContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V19: 多层视差深度 ============
export const parallaxDepthAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '1000px'

      const depthContainer = document.createElement('div')
      depthContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transform-style: preserve-3d;
      `
      panel.appendChild(depthContainer)

      // 创建多层深度
      const layers = []
      const numLayers = 6

      for (let l = 0; l < numLayers; l++) {
        const layer = document.createElement('div')
        const depth = l * 50 - (numLayers * 50) / 2
        const hue = (index * 40 + l * 30) % 360
        const size = 60 + l * 8
        const delay = l * 0.15
        
        layer.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}%;
          height: ${size}%;
          background: radial-gradient(circle, 
            hsla(${hue}, 60%, ${40 + l * 5}%, ${0.5 - l * 0.05}),
            transparent
          );
          border: 2px solid hsla(${hue}, 60%, 60%, ${0.4 - l * 0.05});
          border-radius: ${l % 2 === 0 ? '10%' : '50%'};
          transform: translate(-50%, -50%) translateZ(${depth}px) scale(0);
          transform-origin: center center;
          opacity: 0;
        `
        depthContainer.appendChild(layer)
        layers.push({ element: layer, depth, delay })
      }

      // 视差进入动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.8
        }
      })

      layers.forEach((l) => {
        tl.fromTo(l.element,
          {
            scale: 0,
            opacity: 0,
            rotationZ: (Math.random() - 0.5) * 60,
            translateZ: l.depth - 200
          },
          {
            scale: 1,
            opacity: 1,
            rotationZ: 0,
            translateZ: l.depth,
            duration: 1.2,
            ease: 'power2.out'
          },
          l.delay
        )
      })

      // 持续深度移动
      layers.forEach((l) => {
        gsap.to(l.element, {
          rotationZ: (Math.random() - 0.5) * 30,
          translateZ: l.depth + Math.sin(l.depth) * 30,
          duration: 4 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: l.delay + 1
        })
        cleanupFunctions.push(() => gsap.killTweensOf(l.element))
      })

      // 面板动画
      tl.fromTo(panel,
        {
          scale: 0.8,
          opacity: 0,
          rotationX: 10
        },
        {
          scale: 1,
          opacity: 1,
          rotationX: 0,
          duration: 1.5,
          ease: 'power2.out'
        },
        0
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (depthContainer.parentNode) depthContainer.parentNode.removeChild(depthContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V20: 矩阵代码雨 ============
export const matrixRainAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const matrixContainer = document.createElement('div')
      matrixContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.3);
      `
      panel.appendChild(matrixContainer)

      // 创建代码列
      const columns = []
      const numColumns = 20
      const columnWidth = 100 / numColumns
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'

      for (let c = 0; c < numColumns; c++) {
        const column = document.createElement('div')
        const charsCount = 10 + Math.floor(Math.random() * 10)
        
        column.style.cssText = `
          position: absolute;
          top: -100%;
          left: ${c * columnWidth}%;
          width: ${columnWidth}%;
          height: 100%;
          font-family: monospace;
          font-size: ${12 + Math.random() * 4}px;
          color: rgba(0, 255, 100, 0.8);
          text-align: center;
          text-shadow: 0 0 10px rgba(0, 255, 100, 0.5);
          opacity: 0;
        `
        
        let text = ''
        for (let i = 0; i < charsCount; i++) {
          text += chars[Math.floor(Math.random() * chars.length)] + '<br>'
        }
        column.innerHTML = text
        
        matrixContainer.appendChild(column)
        columns.push({
          element: column,
          delay: c * 0.1,
          duration: 3 + Math.random() * 2
        })
      }

      // 代码雨动画
      columns.forEach((col) => {
        const rainTl = gsap.timeline({ repeat: -1, repeatDelay: 2 })
        
        rainTl.to(col.element, {
          top: '100%',
          opacity: 1,
          duration: col.duration,
          ease: 'none'
        })
        .set(col.element, { top: '-100%', opacity: 0 })
        
        rainTl.delay(col.delay)
        cleanupFunctions.push(() => rainTl.kill())
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
          scale: 0.9,
          opacity: 0,
          borderColor: 'rgba(0, 255, 100, 0)'
        },
        {
          scale: 1,
          opacity: 1,
          borderColor: 'rgba(0, 255, 100, 0.5)',
          boxShadow: '0 0 30px rgba(0, 255, 100, 0.3), inset 0 0 30px rgba(0, 255, 100, 0.1)',
          duration: 1.5,
          ease: 'power2.out'
        }
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (matrixContainer.parentNode) matrixContainer.parentNode.removeChild(matrixContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V21: 星系旋转 ============
export const galaxyRotationAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const galaxyContainer = document.createElement('div')
      galaxyContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(galaxyContainer)

      // 创建星系
      const stars = []
      const numArms = 5
      const starsPerArm = 30

      for (let arm = 0; arm < numArms; arm++) {
        for (let i = 0; i < starsPerArm; i++) {
          const star = document.createElement('div')
          const distance = 20 + (i / starsPerArm) * 80
          const angle = (arm / numArms) * Math.PI * 2 + (i / starsPerArm) * Math.PI * 0.5
          const x = 50 + Math.cos(angle) * distance
          const y = 50 + Math.sin(angle) * distance
          const size = 2 + Math.random() * 3
          const hue = (index * 30 + arm * 20 + i) % 360
          
          star.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, hsla(${hue}, 80%, 70%, 1), hsla(${hue}, 80%, 50%, 0.5), transparent);
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            opacity: 0;
            box-shadow: 0 0 ${size * 2}px hsla(${hue}, 80%, 60%, 0.8);
          `
          galaxyContainer.appendChild(star)
          stars.push({
            element: star,
            centerX: 50,
            centerY: 50,
            distance,
            angle,
            rotationSpeed: 0.5 + Math.random() * 0.5,
            delay: (arm * starsPerArm + i) * 0.01
          })
        }
      }

      // 星系旋转动画
      stars.forEach((star) => {
        const rotateTl = gsap.timeline({ repeat: -1, ease: 'none' })
        
        rotateTl.to(star.element, {
          left: `${star.centerX + Math.cos(star.angle + Math.PI * 2) * star.distance}%`,
          top: `${star.centerY + Math.sin(star.angle + Math.PI * 2) * star.distance}%`,
          duration: star.rotationSpeed * 10
        })
        
        rotateTl.delay(star.delay)
        cleanupFunctions.push(() => rotateTl.kill())

        // 星星闪烁
        gsap.to(star.element, {
          opacity: 1,
          duration: 0.5,
          delay: star.delay
        })
        gsap.to(star.element, {
          opacity: 0.4,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: star.delay + 0.5
        })
      })

      // 面板动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2
        }
      })

      tl.fromTo(panel,
        {
          scale: 0.7,
          opacity: 0,
          rotation: 0
        },
        {
          scale: 1,
          opacity: 1,
          rotation: 360,
          duration: 2,
          ease: 'power2.inOut'
        }
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (galaxyContainer.parentNode) galaxyContainer.parentNode.removeChild(galaxyContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V22: 流体涡旋 ============
export const fluidVortexAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      const vortexContainer = document.createElement('div')
      vortexContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(vortexContainer)

      // 创建流体层
      const fluidLayers = []
      const numLayers = 8

      for (let l = 0; l < numLayers; l++) {
        const layer = document.createElement('div')
        const hue = (index * 30 + l * 25) % 360
        const size = 120 - l * 10
        
        layer.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}%;
          height: ${size}%;
          background: radial-gradient(circle at 30% 30%,
            hsla(${hue}, 70%, 60%, 0.6),
            hsla(${hue + 30}, 70%, 50%, 0.4),
            transparent
          );
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(0deg) scale(0);
          opacity: 0;
          filter: blur(${l * 2}px);
        `
        vortexContainer.appendChild(layer)
        fluidLayers.push({
          element: layer,
          direction: l % 2 === 0 ? 1 : -1,
          delay: l * 0.15,
          rotationSpeed: 3 + l * 0.5
        })
      }

      // 涡旋动画
      fluidLayers.forEach((layer) => {
        const vortexTl = gsap.timeline({ repeat: -1, ease: 'none' })
        
        vortexTl.to(layer.element, {
          rotation: 360 * layer.direction,
          scale: 1.2,
          opacity: 0.6,
          duration: layer.rotationSpeed
        })
        .to(layer.element, {
          rotation: 720 * layer.direction,
          scale: 1,
          opacity: 0.3,
          duration: layer.rotationSpeed
        })
        
        vortexTl.delay(layer.delay)
        cleanupFunctions.push(() => vortexTl.kill())
      })

      // 面板动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.8
        }
      })

      tl.fromTo(panel,
        {
          scale: 0.6,
          opacity: 0,
          filter: 'blur(15px)'
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out'
        }
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (vortexContainer.parentNode) vortexContainer.parentNode.removeChild(vortexContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V23: 全景展开 ============
export const panoramaUnfoldAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '2000px'

      const panoramaContainer = document.createElement('div')
      panoramaContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transform-style: preserve-3d;
      `
      panel.appendChild(panoramaContainer)

      // 创建全景层
      const segments = []
      const numSegments = 12
      const segmentAngle = 360 / numSegments

      for (let s = 0; s < numSegments; s++) {
        const segment = document.createElement('div')
        const hue = (index * 20 + s * 15) % 360
        const angle = s * segmentAngle
        
        segment.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 80%;
          background: linear-gradient(90deg,
            hsla(${hue}, 60%, 40%, 0.7),
            hsla(${hue + 20}, 60%, 50%, 0.8),
            hsla(${hue + 40}, 60%, 40%, 0.7)
          );
          border: 1px solid rgba(255,255,255,0.2);
          transform-origin: center center;
          transform: translate(-50%, -50%) rotateY(${angle}deg) translateZ(150px) scale(0);
          opacity: 0;
        `
        panoramaContainer.appendChild(segment)
        segments.push({
          element: segment,
          angle,
          delay: s * 0.1
        })
      }

      // 全景展开动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2.5
        }
      })

      segments.forEach((seg) => {
        tl.fromTo(seg.element,
          {
            rotateY: seg.angle - 90,
            translateZ: 50,
            scale: 0,
            opacity: 0
          },
          {
            rotateY: seg.angle,
            translateZ: 150,
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out'
          },
          seg.delay
        )
      })

      // 持续旋转
      segments.forEach((seg) => {
        gsap.to(seg.element, {
          rotateY: seg.angle + 30,
          duration: 4 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: seg.delay + 1.5
        })
        cleanupFunctions.push(() => gsap.killTweensOf(seg.element))
      })

      // 面板动画
      tl.fromTo(panel,
        {
          scale: 0.8,
          opacity: 0,
          rotateY: -30
        },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          duration: 2,
          ease: 'power2.out'
        },
        0
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (panoramaContainer.parentNode) panoramaContainer.parentNode.removeChild(panoramaContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// 导出所有模板
export const eliteTemplates = {
  liquidSurfaceTensionAnimation,
  electromagneticWaveAnimation,
  fragmentReassembleAnimation,
  parallaxDepthAnimation,
  matrixRainAnimation,
  galaxyRotationAnimation,
  fluidVortexAnimation,
  panoramaUnfoldAnimation
}

// 模板配置
export const eliteTemplateConfig = {
  liquidSurfaceTensionAnimation: {
    name: '液体张力',
    description: '物理表面张力液滴效果',
    horizontalDisable: true,
    verticalDisable: false
  },
  electromagneticWaveAnimation: {
    name: '电磁波动',
    description: 'SVG正弦波电磁场',
    horizontalDisable: false,
    verticalDisable: false
  },
  fragmentReassembleAnimation: {
    name: '碎片重组',
    description: '碎片从四面八方汇聚',
    horizontalDisable: true,
    verticalDisable: false
  },
  parallaxDepthAnimation: {
    name: '多层视差',
    description: '多层3D深度视差效果',
    horizontalDisable: false,
    verticalDisable: false
  },
  matrixRainAnimation: {
    name: '矩阵代码雨',
    description: '赛博朋克风格代码雨',
    horizontalDisable: false,
    verticalDisable: false
  },
  galaxyRotationAnimation: {
    name: '星系旋转',
    description: '宇宙星系螺旋旋转',
    horizontalDisable: true,
    verticalDisable: false
  },
  fluidVortexAnimation: {
    name: '流体涡旋',
    description: '多层流体涡旋流动',
    horizontalDisable: true,
    verticalDisable: false
  },
  panoramaUnfoldAnimation: {
    name: '全景展开',
    description: '360度全景柱状展开',
    horizontalDisable: true,
    verticalDisable: false
  }
}
