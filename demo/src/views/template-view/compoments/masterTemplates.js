/**
 * 大师级动画模板 (V44-V51)
 * 基于前沿视觉趋势：粒子系统、物理模拟、AI生成艺术
 * 融合：WebGL、Canvas、SVG、GSAP 高级特性
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

// ==================== V44: 粒子爆炸 ====================
/**
 * 粒子爆炸效果
 * 核心：粒子从中心爆炸散开，形成冲击波
 */
export const particleExplosionAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建粒子容器
      const particleContainer = document.createElement('div')
      particleContainer.className = 'particle-explosion-container'
      particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(particleContainer)

      // 创建粒子
      const particles = []
      const particleCount = 30
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        const size = Math.random() * 8 + 2
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: hsl(${Math.random() * 360}, 70%, 60%);
          border-radius: 50%;
          opacity: 0;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        `
        particleContainer.appendChild(particle)
        particles.push(particle)
      }

      // 爆炸动画时间轴
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=150',
          end: 'center center-=100',
          scrub: 1.5
        }
      })

      // 粒子爆炸
      particles.forEach((particle, i) => {
        const angle = (i / particleCount) * Math.PI * 2
        const distance = Math.random() * 200 + 100
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance

        tl.to(particle, {
          opacity: 1,
          duration: 0.1
        }, 0)
        tl.to(particle, {
          x: x,
          y: y,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        }, 0.1)
      })

      // 面板冲击波
      tl.fromTo(panel,
        { scale: 1, filter: 'brightness(1)' },
        {
          scale: 1.05,
          filter: 'brightness(1.5)',
          duration: 0.3,
          ease: 'power1.out'
        }, 0
      )
      tl.to(panel,
        {
          scale: 1,
          filter: 'brightness(1)',
          duration: 0.5,
          ease: 'power2.out'
        }, 0.3
      )

      cleanupFunctions.push(() => {
        tl.kill()
        particleContainer.remove()
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ==================== V45: 液态变形 ====================
/**
 * 液态变形效果
 * 核心：使用CSS border-radius模拟液态流动
 */
export const liquidMorphAnimation = () => {
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
          start: 'top bottom-=100',
          end: 'bottom center',
          scrub: 2
        }
      })

      // 液态流动 - 不断变化的border-radius
      const morphDuration = 2
      for (let i = 0; i < 4; i++) {
        tl.to(panel, {
          borderRadius: `${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% / ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}% ${Math.random() * 50 + 20}%`,
          duration: morphDuration,
          ease: 'sine.inOut'
        }, i * morphDuration)
      }

      // 最终稳定状态
      tl.to(panel, {
        borderRadius: '12px',
        duration: 1,
        ease: 'power3.out'
      })

      // 同时进行透明度和缩放
      tl.fromTo(panel,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' },
        0
      )

      // 添加内部液体波浪效果
      const innerWave = document.createElement('div')
      innerWave.style.cssText = `
        position: absolute;
        inset: -20px;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%);
        border-radius: inherit;
        pointer-events: none;
      `
      panel.appendChild(innerWave)

      gsap.to(innerWave, {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=100',
          end: 'center center',
          scrub: 1.5
        }
      })

      cleanupFunctions.push(() => {
        tl.kill()
        innerWave.remove()
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ==================== V46: 全息数据流 ====================
/**
 * 全息数据流效果
 * 核心：SVG线条绘制 + 霓虹光效
 */
export const holographicDataflowAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建SVG容器
      const svgSize = 200
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('width', svgSize)
      svg.setAttribute('height', svgSize)
      svg.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 10;
      `
      panel.appendChild(svg)

      // 创建数据流线条
      const lines = []
      const lineCount = 12
      for (let i = 0; i < lineCount; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        const angle = (i / lineCount) * Math.PI * 2
        const innerRadius = 30
        const outerRadius = 80

        line.setAttribute('x1', svgSize / 2 + Math.cos(angle) * innerRadius)
        line.setAttribute('y1', svgSize / 2 + Math.sin(angle) * innerRadius)
        line.setAttribute('x2', svgSize / 2 + Math.cos(angle) * outerRadius)
        line.setAttribute('y2', svgSize / 2 + Math.sin(angle) * outerRadius)
        line.setAttribute('stroke', 'rgba(0, 255, 255, 0.8)')
        line.setAttribute('stroke-width', '2')
        line.setAttribute('stroke-dasharray', '50')
        line.setAttribute('stroke-dashoffset', '50')
        line.style.filter = 'drop-shadow(0 0 3px rgba(0, 255, 255, 0.8))'

        svg.appendChild(line)
        lines.push(line)
      }

      // 创建中心圆
      const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      centerCircle.setAttribute('cx', svgSize / 2)
      centerCircle.setAttribute('cy', svgSize / 2)
      centerCircle.setAttribute('r', '20')
      centerCircle.setAttribute('fill', 'none')
      centerCircle.setAttribute('stroke', 'rgba(0, 255, 255, 0.8)')
      centerCircle.setAttribute('stroke-width', '2')
      centerCircle.style.filter = 'drop-shadow(0 0 5px rgba(0, 255, 255, 1))'
      svg.appendChild(centerCircle)

      // 动画时间轴
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=200',
          end: 'center center',
          scrub: 2
        }
      })

      // 线条绘制动画
      lines.forEach((line, i) => {
        tl.to(line, {
          strokeDashoffset: 0,
          duration: 0.5,
          ease: 'power1.inOut'
        }, i * 0.1)
      })

      // 圆环绘制
      tl.fromTo(centerCircle,
        { strokeDasharray: '0 126' },
        { strokeDasharray: '126 126', duration: 0.8, ease: 'power2.out' },
        0.5
      )

      // 面板淡入
      tl.fromTo(panel,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
        0
      )

      // 全息扫描线
      const scanLine = document.createElement('div')
      scanLine.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
        pointer-events: none;
        z-index: 20;
      `
      panel.appendChild(scanLine)

      gsap.to(scanLine, {
        top: '100%',
        duration: 1,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=150',
          end: 'center center',
          scrub: 1.5
        }
      })

      // SVG旋转
      gsap.to(svg, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      })

      cleanupFunctions.push(() => {
        tl.kill()
        svg.remove()
        scanLine.remove()
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ==================== V47: 磁力吸引 ====================
/**
 * 磁力吸引效果
 * 核心：元素被磁力吸入，形成漩涡
 */
export const magneticAttractionAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建轨道粒子
      const particleCount = 8
      const particles = []

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        particle.style.cssText = `
          position: absolute;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
        `
        panel.appendChild(particle)
        particles.push(particle)
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=100',
          end: 'center center',
          scrub: 2
        }
      })

      // 粒子螺旋吸入
      particles.forEach((particle, i) => {
        const startAngle = (i / particleCount) * Math.PI * 2
        const startRadius = 150
        const endRadius = 30

        const startX = Math.cos(startAngle) * startRadius
        const startY = Math.sin(startAngle) * startRadius

        tl.fromTo(particle,
          {
            x: startX,
            y: startY,
            opacity: 0,
            scale: 0.5
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'power3.inOut',
            rotation: 720
          }, i * 0.1
        )
      })

      // 面板脉冲
      tl.fromTo(panel,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
        0
      )

      // 中心能量爆发
      const energyCore = document.createElement('div')
      energyCore.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(102,126,234,0.8) 50%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 5;
      `
      panel.appendChild(energyCore)

      gsap.to(energyCore, {
        scale: 3,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=100',
          end: 'center center',
          scrub: 1.5
        }
      })

      cleanupFunctions.push(() => {
        tl.kill()
        particles.forEach(p => p.remove())
        energyCore.remove()
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ==================== V48: 折纸展开 ====================
/**
 * 折纸展开效果
 * 核心：3D旋转 + 边缘折痕
 */
export const origamiUnfoldAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建折痕线
      const creaseLines = []
      const creasePositions = [
        { x: 0, rotation: 45 },
        { x: '100%', rotation: -45 },
        { y: 0, rotation: -45 },
        { y: '100%', rotation: 45 }
      ]

      creasePositions.forEach(pos => {
        const line = document.createElement('div')
        const isHorizontal = pos.x !== undefined
        line.style.cssText = `
          position: absolute;
          ${isHorizontal ? `left: ${pos.x}` : `top: ${pos.y}`};
          ${isHorizontal ? 'top: 0' : 'left: 0'};
          width: ${isHorizontal ? '2px' : '100%'};
          height: ${isHorizontal ? '100%' : '2px'};
          background: linear-gradient(${isHorizontal ? 'to bottom' : 'to right'},
            transparent,
            rgba(255,255,255,0.3),
            transparent);
          transform-origin: ${isHorizontal ? 'top center' : 'left center'};
          transform: ${isHorizontal ? `rotate(${pos.rotation}deg)` : `rotate(${pos.rotation}deg)`};
          opacity: 0;
          pointer-events: none;
        `
        panel.appendChild(line)
        creaseLines.push(line)
      })

      // 设置初始状态
      gsap.set(panel, {
        perspective: 1000,
        transformStyle: 'preserve-3d'
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=150',
          end: 'center center',
          scrub: 2
        }
      })

      // 折痕线出现
      creaseLines.forEach((line, i) => {
        tl.to(line, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, i * 0.1)
      })

      // 3D翻转展开
      tl.fromTo(panel,
        {
          rotateX: -180,
          rotateY: -90,
          opacity: 0,
          scale: 0.7
        },
        {
          rotateX: 0,
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power3.inOut'
        }, 0.2
      )

      // 展开后折痕线消失
      tl.to(creaseLines, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, 1.5)

      // 添加纸张质感纹理
      const texture = document.createElement('div')
      texture.style.cssText = `
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.03) 2px,
          rgba(255,255,255,0.03) 4px
        );
        pointer-events: none;
        border-radius: inherit;
      `
      panel.appendChild(texture)

      cleanupFunctions.push(() => {
        tl.kill()
        creaseLines.forEach(line => line.remove())
        texture.remove()
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ==================== V49: 极光波纹 ====================
/**
 * 极光波纹效果
 * 核心：CSS渐变 + 混合模式
 */
export const auroraRippleAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建极光层
      const auroraLayers = []
      const colors = [
        'rgba(0, 255, 136, 0.3)',
        'rgba(0, 212, 255, 0.3)',
        'rgba(138, 43, 226, 0.3)',
        'rgba(255, 0, 128, 0.3)'
      ]

      for (let i = 0; i < 4; i++) {
        const layer = document.createElement('div')
        layer.style.cssText = `
          position: absolute;
          inset: -50%;
          background: radial-gradient(ellipse at center, ${colors[i]} 0%, transparent 70%);
          mix-blend-mode: screen;
          opacity: 0;
          pointer-events: none;
          border-radius: 50%;
        `
        panel.appendChild(layer)
        auroraLayers.push(layer)
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=100',
          end: 'bottom center',
          scrub: 2.5
        }
      })

      // 极光波纹扩散
      auroraLayers.forEach((layer, i) => {
        tl.to(layer, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
        }, i * 0.2)

        tl.to(layer, {
          scale: 1.5 + i * 0.3,
          rotation: 90 + i * 45,
          duration: 2,
          ease: 'power1.inOut'
        }, i * 0.2)

        tl.to(layer, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in'
        }, 1.5 + i * 0.1)
      })

      // 面板出现
      tl.fromTo(panel,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
        0
      )

      // 添加闪烁星星
      const stars = []
      for (let i = 0; i < 20; i++) {
        const star = document.createElement('div')
        const size = Math.random() * 3 + 1
        star.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: white;
          border-radius: 50%;
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          opacity: 0;
          pointer-events: none;
        `
        panel.appendChild(star)
        stars.push(star)
      }

      stars.forEach((star, i) => {
        gsap.to(star, {
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 1 + 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 2
        })
      })

      cleanupFunctions.push(() => {
        tl.kill()
        auroraLayers.forEach(layer => layer.remove())
        stars.forEach(star => star.remove())
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ==================== V50: 霓虹故障 ====================
/**
 * 霓虹故障效果
 * 核心：RGB分离 + 随机故障
 */
export const neonGlitchAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建RGB分离层
      const layers = []
      const colors = ['rgba(255, 0, 0, 0.7)', 'rgba(0, 255, 0, 0.7)', 'rgba(0, 0, 255, 0.7)']

      colors.forEach((color, i) => {
        const layer = panel.cloneNode(true)
        layer.style.cssText = `
          position: absolute;
          inset: 0;
          mix-blend-mode: screen;
          opacity: 0;
          pointer-events: none;
          z-index: ${10 + i};
        `
        layer.style.color = color
        layer.style.filter = `drop-shadow(0 0 2px ${color})`
        panel.parentNode.appendChild(layer)
        layers.push(layer)
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=200',
          end: 'center center',
          scrub: 2
        }
      })

      // 故障闪烁
      const glitchCount = 8
      for (let i = 0; i < glitchCount; i++) {
        layers.forEach((layer, j) => {
          tl.to(layer, {
            opacity: 1,
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 5,
            duration: 0.1,
            ease: 'steps(2)'
          }, i * 0.15 + j * 0.02)

          tl.to(layer, {
            opacity: 0,
            x: 0,
            y: 0,
            duration: 0.05,
            ease: 'steps(2)'
          }, i * 0.15 + 0.1 + j * 0.02)
        })
      }

      // 主面板出现
      tl.fromTo(panel,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
        0.5
      )

      // 添加霓虹光晕
      const glow = document.createElement('div')
      glow.style.cssText = `
        position: absolute;
        inset: -10px;
        border: 2px solid rgba(255, 0, 255, 0.5);
        border-radius: inherit;
        pointer-events: none;
        z-index: 15;
        opacity: 0;
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.5), inset 0 0 20px rgba(255, 0, 255, 0.3);
      `
      panel.appendChild(glow)

      gsap.to(glow, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=150',
          end: 'center center',
          scrub: 1.5
        }
      })

      cleanupFunctions.push(() => {
        tl.kill()
        layers.forEach(layer => layer.remove())
        glow.remove()
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ==================== V51: 虫洞穿越 ====================
/**
 * 虫洞穿越效果
 * 核心：3D旋转 + 虫洞吸力
 */
export const wormholeTravelAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      // 创建虫洞环
      const rings = []
      const ringCount = 6

      for (let i = 0; i < ringCount; i++) {
        const ring = document.createElement('div')
        const size = 50 + i * 40
        ring.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          border: 2px solid rgba(138, 43, 226, ${0.8 - i * 0.1});
          border-radius: 50%;
          transform: translate(-50%, -50%) rotateX(70deg);
          opacity: 0;
          pointer-events: none;
          box-shadow: 0 0 10px rgba(138, 43, 226, 0.5);
        `
        panel.appendChild(ring)
        rings.push(ring)
      }

      // 创建星尘粒子
      const particles = []
      const particleCount = 40

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        const size = Math.random() * 4 + 1
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * 100 + 50

        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
        `
        panel.appendChild(particle)

        // 初始位置
        const startX = Math.cos(angle) * radius
        const startY = Math.sin(angle) * radius
        gsap.set(particle, { x: startX, y: startY })

        particles.push({ el: particle, angle, radius })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom-=200',
          end: 'center center',
          scrub: 2.5
        }
      })

      // 虫洞环收缩旋转
      rings.forEach((ring, i) => {
        tl.to(ring, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, i * 0.1)

        tl.to(ring, {
          rotation: 360,
          scale: 0.1,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.in'
        }, i * 0.1 + 0.2)
      })

      // 星尘粒子吸入
      particles.forEach((p, i) => {
        tl.to(p.el, {
          opacity: 1,
          duration: 0.2,
          ease: 'power2.out'
        }, 0.3 + i * 0.01)

        tl.to(p.el, {
          x: 0,
          y: 0,
          opacity: 0,
          rotation: p.angle * 2,
          duration: 1.2,
          ease: 'power3.in'
        }, 0.3 + i * 0.01 + 0.2)
      })

      // 面板从虫洞中出现
      tl.fromTo(panel,
        {
          scale: 0,
          rotateX: 45,
          opacity: 0
        },
        {
          scale: 1,
          rotateX: 0,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.6)'
        }, 1.3
      )

      cleanupFunctions.push(() => {
        tl.kill()
        rings.forEach(ring => ring.remove())
        particles.forEach(p => p.el.remove())
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}
