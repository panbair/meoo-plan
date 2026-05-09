/**
 * 传奇级动画模板 (V28-V35)
 * 基于优秀模板深度学习，融合多种GSAP高级特性
 * 目标：创造超越想象力的视觉盛宴
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

// ============ V28: 星际传送门 ============
/**
 * 融合3D卡片翻转 + 莫比乌斯环 + 星系旋转
 * 创建一个穿越时空的传送门效果
 */
export const interstellarPortalAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '2000px'

      // 创建传送门中心
      const portalCenter = document.createElement('div')
      portalCenter.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120px;
        height: 120px;
        transform: translate(-50%, -50%);
        pointer-events: none;
      `
      panel.appendChild(portalCenter)

      // 创建旋转的能量环
      const rings = []
      for (let i = 0; i < 5; i++) {
        const ring = document.createElement('div')
        const size = 150 + i * 60
        const hue = (index * 40 + i * 30) % 360
        ring.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          border: ${3 + i}px solid hsla(${hue}, 80%, 60%, ${0.8 - i * 0.12});
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(${i * 30}deg);
          transform-style: preserve-3d;
          box-shadow: 0 0 ${20 + i * 10}px hsla(${hue}, 80%, 50%, 0.6),
                      inset 0 0 ${10 + i * 5}px hsla(${hue}, 80%, 50%, 0.4);
        `
        portalCenter.appendChild(ring)
        rings.push({
          element: ring,
          rotationSpeed: 2 + i * 0.5,
          startRotation: i * 30
        })
      }

      // 创建穿越粒子
      const particlesContainer = document.createElement('div')
      particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
      `
      panel.appendChild(particlesContainer)

      const particles = []
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div')
        const size = 2 + Math.random() * 4
        const hue = (index * 30 + i * 10) % 360
        particle.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, 
            hsla(${hue}, 80%, 70%, 1), 
            hsla(${hue}, 80%, 50%, 0.5),
            transparent
          );
          border-radius: 50%;
          box-shadow: 0 0 ${size * 3}px hsla(${hue}, 80%, 60%, 0.8);
          transform: translate(-50%, -50%);
          opacity: 0;
        `
        particlesContainer.appendChild(particle)

        const angle = (i / 40) * Math.PI * 2
        particles.push({
          element: particle,
          angle,
          distance: 10 + Math.random() * 30,
          speed: 0.5 + Math.random() * 1,
          delay: i * 0.03
        })
      }

      // 环的旋转动画
      rings.forEach(ring => {
        const ringTl = gsap.timeline({ repeat: -1, ease: 'none' })
        ringTl.to(ring.element, {
          rotation: ring.startRotation + 360,
          duration: ring.rotationSpeed,
          onComplete: () => {
            gsap.set(ring.element, { rotation: ring.startRotation })
          }
        })
        cleanupFunctions.push(() => ringTl.kill())
      })

      // 粒子穿越动画
      particles.forEach(p => {
        const particleTl = gsap.timeline({ repeat: -1, delay: p.delay })

        particleTl
          .to(p.element, {
            width: 8,
            height: 8,
            opacity: 1,
            duration: 0.3
          })
          .to(p.element, {
            x: Math.cos(p.angle) * 300,
            y: Math.sin(p.angle) * 300,
            scale: 0,
            opacity: 0,
            duration: p.speed,
            ease: 'power2.in'
          })

        cleanupFunctions.push(() => particleTl.kill())
      })

      // 面板传送门展开动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2
        }
      })

      tl.fromTo(
        panel,
        {
          rotationY: -90,
          rotationX: -30,
          scale: 0.6,
          opacity: 0,
          filter: 'blur(10px) brightness(0.5)'
        },
        {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px) brightness(1)',
          duration: 2,
          ease: 'power3.out'
        }
      )

      // 莫比乌斯式的连续旋转
      tl.to(
        panel,
        {
          rotationY: 360,
          rotationZ: 180,
          duration: 1.5,
          ease: 'power1.inOut'
        },
        0.5
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (portalCenter.parentNode) portalCenter.parentNode.removeChild(portalCenter)
        if (particlesContainer.parentNode)
          particlesContainer.parentNode.removeChild(particlesContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V29: 量子时空穿越 ============
/**
 * 融合碎片重组 + 3D变换 + 粒子波浪
 * 模拟量子隧穿效应，面板从粒子态重组
 */
export const quantumTunnelAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    const container = document.querySelector('.animation-layer')
    const globalParticles = document.createElement('div')
    globalParticles.className = 'quantum-particles'
    globalParticles.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 100;
    `
    container.appendChild(globalParticles)

    // 创建量子涨落粒子
    const quantumParticles = []
    for (let i = 0; i < 80; i++) {
      const particle = document.createElement('div')
      const size = 3 + Math.random() * 5
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, 
          rgba(0, 255, 255, 1), 
          rgba(0, 255, 255, 0.3),
          transparent
        );
        border-radius: 50%;
        box-shadow: 0 0 ${size * 4}px rgba(0, 255, 255, 0.8),
                    0 0 ${size * 8}px rgba(0, 255, 255, 0.4);
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0;
      `
      globalParticles.appendChild(particle)

      quantumParticles.push({
        element: particle,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        delay: Math.random() * 3
      })
    }

    // 量子涨落动画
    quantumParticles.forEach(p => {
      const tl = gsap.timeline({ repeat: -1, delay: p.delay })

      tl.to(p.element, {
        opacity: 1,
        scale: 1.5,
        duration: 0.3,
        ease: 'back.out(2)'
      })
        .to(p.element, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          opacity: 0.3,
          duration: 1.5,
          ease: 'power1.inOut'
        })
        .to(p.element, {
          opacity: 0,
          scale: 0.5,
          duration: 0.5,
          ease: 'power2.in'
        })

      cleanupFunctions.push(() => tl.kill())
    })

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '1500px'

      // 创建量子碎片层
      const quantumLayer = document.createElement('div')
      quantumLayer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transform-style: preserve-3d;
      `
      panel.appendChild(quantumLayer)

      // 创建碎片化的量子态
      const fragments = []
      const gridSize = 6
      const fragSize = 100 / gridSize

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const fragment = document.createElement('div')
          const hue = (index * 20 + row * 25 + col * 15) % 360
          const delay = (row * gridSize + col) * 0.02

          fragment.style.cssText = `
            position: absolute;
            width: ${fragSize}%;
            height: ${fragSize}%;
            left: ${col * fragSize}%;
            top: ${row * fragSize}%;
            background: hsla(${hue}, 80%, 60%, 0.6);
            border: 1px solid hsla(${hue}, 80%, 70%, 0.8);
            transform: translate(0, 0) rotate(0deg) scale(1);
            transform-origin: center center;
            opacity: 0;
            box-shadow: 0 0 15px hsla(${hue}, 80%, 50%, 0.7),
                        inset 0 0 10px hsla(${hue}, 80%, 50%, 0.3);
            backdrop-filter: blur(2px);
          `
          quantumLayer.appendChild(fragment)

          fragments.push({
            element: fragment,
            targetX: 0,
            targetY: 0,
            targetRotation: 0,
            targetScale: 1,
            startX: (Math.random() - 0.5) * window.innerWidth,
            startY: (Math.random() - 0.5) * window.innerHeight,
            startRotation: Math.random() * 720 - 360,
            startScale: 0.1 + Math.random() * 0.3,
            delay
          })
        }
      }

      // 量子隧穿动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2.5
        }
      })

      // 面板波动进入
      tl.fromTo(
        panel,
        {
          y: 150,
          opacity: 0,
          filter: 'blur(20px) hue-rotate(180deg)',
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px) hue-rotate(0deg)',
          scale: 1,
          duration: 1.5,
          ease: 'power3.out'
        }
      )

      // 碎片量子隧穿
      fragments.forEach(f => {
        tl.fromTo(
          f.element,
          {
            x: f.startX,
            y: f.startY,
            rotation: f.startRotation,
            scale: f.startScale,
            opacity: 0,
            filter: 'blur(8px)'
          },
          {
            x: f.targetX,
            y: f.targetY,
            rotation: f.targetRotation,
            scale: f.targetScale,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.8,
            delay: f.delay,
            ease: 'elastic.out(0.8, 0.6)'
          },
          0
        )
      })

      // 量子态叠加（3D效果）
      tl.to(
        panel,
        {
          rotationY: 15,
          rotationX: -10,
          duration: 1,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1
        },
        1
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (quantumLayer.parentNode) quantumLayer.parentNode.removeChild(quantumLayer)
      })
    })

    cleanupFunctions.push(() => {
      if (globalParticles.parentNode) globalParticles.parentNode.removeChild(globalParticles)
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V30: 赛博空间 ============
/**
 * 融合全息扫描 + 矩阵代码雨 + 粒子系统
 * 创建沉浸式赛博朋克空间
 */
export const cyberspaceAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '1800px'

      // 赛博网格
      const cyberGrid = document.createElement('div')
      cyberGrid.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(rgba(255, 0, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 0, 255, 0.03) 1px, transparent 1px);
        background-size: 30px 30px, 30px 30px, 60px 60px, 60px 60px;
        transform: perspective(800px) rotateX(70deg) translateZ(-100px);
        transform-origin: center top;
        opacity: 0;
        pointer-events: none;
      `
      panel.appendChild(cyberGrid)

      // 全息扫描线
      const scanLines = []
      for (let i = 0; i < 3; i++) {
        const scanLine = document.createElement('div')
        const hue = (index * 30 + i * 40) % 360
        scanLine.style.cssText = `
          position: absolute;
          top: -100px;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, 
            transparent,
            hsla(${hue}, 80%, 60%, 0.9),
            hsla(${hue}, 80%, 50%, 1),
            hsla(${hue}, 80%, 60%, 0.9),
            transparent
          );
          box-shadow: 0 0 20px hsla(${hue}, 80%, 60%, 0.8),
                      0 0 40px hsla(${hue}, 80%, 50%, 0.5),
                      0 0 80px hsla(${hue}, 80%, 40%, 0.3);
          opacity: 0;
        `
        panel.appendChild(scanLine)
        scanLines.push({
          element: scanLine,
          delay: i * 0.7,
          speed: 2 + i * 0.5
        })
      }

      // 数据流粒子
      const dataParticles = document.createElement('div')
      dataParticles.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      `
      panel.appendChild(dataParticles)

      const dataStreams = []
      for (let i = 0; i < 20; i++) {
        const stream = document.createElement('div')
        stream.style.cssText = `
          position: absolute;
          top: -100%;
          left: ${Math.random() * 100}%;
          width: 2px;
          height: ${20 + Math.random() * 30}%;
          background: linear-gradient(to bottom,
            transparent,
            rgba(0, 255, 255, 0.8),
            rgba(255, 0, 255, 0.8),
            transparent
          );
          opacity: 0;
        `
        dataParticles.appendChild(stream)

        dataStreams.push({
          element: stream,
          speed: 3 + Math.random() * 4,
          delay: Math.random() * 2
        })
      }

      // 赛博格（Cyber-glyph）浮动元素
      const glyphsContainer = document.createElement('div')
      glyphsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      `
      panel.appendChild(glyphsContainer)

      const glyphs = []
      for (let i = 0; i < 12; i++) {
        const glyph = document.createElement('div')
        const size = 20 + Math.random() * 30
        const hue = (index * 25 + i * 20) % 360
        glyph.innerHTML = ['◆', '◇', '○', '●', '▲', '▼', '◼', '◻'][i % 8]
        glyph.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          font-size: ${size}px;
          color: hsla(${hue}, 80%, 60%, 0.8);
          text-shadow: 0 0 10px hsla(${hue}, 80%, 50%, 0.8),
                       0 0 20px hsla(${hue}, 80%, 50%, 0.5);
          opacity: 0;
          transform: rotate(${Math.random() * 360}deg);
        `
        glyphsContainer.appendChild(glyph)

        glyphs.push({
          element: glyph,
          floatSpeed: 1 + Math.random() * 2,
          delay: i * 0.1
        })
      }

      // 动画时间轴
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2
        }
      })

      // 面板进入 - 科技感缩放
      tl.fromTo(
        panel,
        {
          scale: 0.5,
          opacity: 0,
          filter: 'blur(15px) brightness(1.5)',
          rotationY: -45
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px) brightness(1)',
          rotationY: 0,
          duration: 1.8,
          ease: 'power2.out'
        }
      )

      // 网格展开
      tl.to(
        cyberGrid,
        {
          opacity: 0.7,
          duration: 1,
          ease: 'power2.out'
        },
        0
      )

      // 扫描线动画
      scanLines.forEach(sl => {
        const scanTl = gsap.timeline({ repeat: -1, delay: sl.delay })

        scanTl
          .to(sl.element, {
            opacity: 1,
            duration: 0.2
          })
          .to(sl.element, {
            top: '120%',
            opacity: 0,
            duration: sl.speed,
            ease: 'none'
          })
          .to(sl.element, {
            top: '-100px',
            duration: 0,
            ease: 'none'
          })

        cleanupFunctions.push(() => scanTl.kill())
      })

      // 数据流动画
      dataStreams.forEach(ds => {
        const streamTl = gsap.timeline({ repeat: -1, delay: ds.delay })

        streamTl
          .to(ds.element, {
            opacity: 1,
            duration: 0.3
          })
          .to(ds.element, {
            top: '150%',
            opacity: 0,
            duration: ds.speed,
            ease: 'power1.in'
          })
          .to(ds.element, {
            top: '-100%',
            duration: 0,
            ease: 'none'
          })

        cleanupFunctions.push(() => streamTl.kill())
      })

      // 图符浮动
      glyphs.forEach(g => {
        gsap.to(g.element, {
          opacity: 1,
          duration: 0.5,
          delay: g.delay
        })

        const glyphTl = gsap.timeline({ repeat: -1, yoyo: true, delay: g.delay })

        glyphTl.to(g.element, {
          y: '-=20',
          rotation: `+=90`,
          duration: g.floatSpeed,
          ease: 'sine.inOut'
        })

        cleanupFunctions.push(() => glyphTl.kill())
      })

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (cyberGrid.parentNode) cyberGrid.parentNode.removeChild(cyberGrid)
        if (dataParticles.parentNode) dataParticles.parentNode.removeChild(dataParticles)
        if (glyphsContainer.parentNode) glyphsContainer.parentNode.removeChild(glyphsContainer)
        scanLines.forEach(sl => {
          if (sl.element.parentNode) sl.element.parentNode.removeChild(sl.element)
        })
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V31: 液态金属 ============
/**
 * 融合液体张力 + 多层视差 + 流体涡旋
 * 创建仿真的液态金属变形效果
 */
export const liquidMetalAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '1600px'

      // 液态金属层
      const metalLayer = document.createElement('div')
      metalLayer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transform-style: preserve-3d;
      `
      panel.appendChild(metalLayer)

      // 创建金属液滴
      const droplets = []
      const numDroplets = 8

      for (let i = 0; i < numDroplets; i++) {
        const droplet = document.createElement('div')
        const size = 60 + Math.random() * 80
        const angle = (i / numDroplets) * Math.PI * 2
        const hue = (index * 20 + i * 25) % 360

        droplet.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle at 30% 30%,
            hsla(${hue}, 20%, 80%, 1),
            hsla(${hue}, 30%, 60%, 0.9),
            hsla(${hue}, 40%, 40%, 0.8),
            hsla(${hue}, 50%, 20%, 0.7)
          );
          border-radius: 50%;
          transform: translate(-50%, -50%) 
                     translateX(${Math.cos(angle) * 200}px) 
                     translateY(${Math.sin(angle) * 200}px) 
                     scale(0);
          opacity: 0;
          box-shadow: 
            inset -10px -10px 20px rgba(0,0,0,0.5),
            inset 10px 10px 20px rgba(255,255,255,0.3),
            0 0 30px hsla(${hue}, 50%, 50%, 0.5),
            0 0 60px hsla(${hue}, 50%, 40%, 0.3);
        `
        metalLayer.appendChild(droplet)

        droplets.push({
          element: droplet,
          targetX: Math.cos(angle) * 80,
          targetY: Math.sin(angle) * 80,
          targetScale: 0.8 + Math.random() * 0.4,
          delay: i * 0.15,
          morphSpeed: 2 + Math.random()
        })
      }

      // 金属表面波纹
      const ripplesContainer = document.createElement('div')
      ripplesContainer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        pointer-events: none;
        overflow: visible;
      `
      panel.appendChild(ripplesContainer)

      const ripples = []
      for (let i = 0; i < 4; i++) {
        const ripple = document.createElement('div')
        const hue = (index * 30 + i * 20) % 360
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          border: 2px solid hsla(${hue}, 30%, 60%, 0.6);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          box-shadow: 0 0 20px hsla(${hue}, 30%, 50%, 0.4);
        `
        ripplesContainer.appendChild(ripple)

        ripples.push({
          element: ripple,
          delay: i * 0.8,
          expansionSpeed: 2 + i * 0.3
        })
      }

      // 波纹扩散动画
      ripples.forEach(r => {
        const rippleTl = gsap.timeline({ repeat: -1, delay: r.delay })

        rippleTl
          .to(r.element, {
            opacity: 0.8,
            scale: 1,
            duration: 0.3,
            ease: 'back.out(2)'
          })
          .to(r.element, {
            opacity: 0,
            scale: 6,
            borderWidth: '1px',
            duration: r.expansionSpeed,
            ease: 'power2.out'
          })

        cleanupFunctions.push(() => rippleTl.kill())
      })

      // 液态变形动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2.5
        }
      })

      // 面板液化进入
      tl.fromTo(
        panel,
        {
          scale: 0.7,
          opacity: 0,
          filter: 'blur(25px) contrast(1.3)',
          borderRadius: '50%'
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px) contrast(1)',
          borderRadius: '10%',
          duration: 2,
          ease: 'elastic.out(0.6, 0.8)'
        }
      )

      // 液滴汇聚
      droplets.forEach(d => {
        tl.fromTo(
          d.element,
          {
            scale: 0,
            opacity: 0,
            x: d.targetX * 3,
            y: d.targetY * 3
          },
          {
            scale: d.targetScale,
            opacity: 1,
            x: d.targetX,
            y: d.targetY,
            duration: 1.5,
            delay: d.delay,
            ease: 'elastic.out(0.7, 0.5)'
          },
          0
        )

        // 持续变形
        const morphTl = gsap.timeline({ repeat: -1, yoyo: true, delay: d.delay + 1 })
        morphTl
          .to(d.element, {
            scaleX: 1.3,
            scaleY: 0.7,
            borderRadius: '40%',
            duration: d.morphSpeed * 0.5,
            ease: 'sine.inOut'
          })
          .to(d.element, {
            scaleX: 0.7,
            scaleY: 1.3,
            borderRadius: '60%',
            duration: d.morphSpeed * 0.5,
            ease: 'sine.inOut'
          })

        cleanupFunctions.push(() => morphTl.kill())
      })

      // 金属光泽闪烁
      tl.to(
        panel,
        {
          filter: 'brightness(1.3) saturate(1.2)',
          duration: 0.5,
          ease: 'power1.out',
          yoyo: true,
          repeat: 1
        },
        1
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (metalLayer.parentNode) metalLayer.parentNode.removeChild(metalLayer)
        if (ripplesContainer.parentNode) ripplesContainer.parentNode.removeChild(ripplesContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V32: 时间折叠 ============
/**
 * 融合莫比乌斯环 + 粒子汇聚 + 3D变换
 * 创造时间循环和空间折叠的神秘效果
 */
export const timeFoldAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '2000px'

      // 时间环
      const timeRings = document.createElement('div')
      timeRings.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        pointer-events: none;
        transform-style: preserve-3d;
      `
      panel.appendChild(timeRings)

      // 创建时间环
      const rings = []
      for (let i = 0; i < 6; i++) {
        const ring = document.createElement('div')
        const size = 100 + i * 50
        const hue = (index * 40 + i * 25) % 360

        ring.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          border: ${2 + i}px solid hsla(${hue}, 70%, 60%, ${0.8 - i * 0.1});
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(${i * 15}deg);
          opacity: 0;
          box-shadow: 0 0 ${15 + i * 5}px hsla(${hue}, 70%, 50%, 0.6),
                      inset 0 0 ${10 + i * 3}px hsla(${hue}, 70%, 50%, 0.3);
        `
        timeRings.appendChild(ring)

        rings.push({
          element: ring,
          speed: 3 + i * 0.5,
          delay: i * 0.1,
          direction: i % 2 === 0 ? 1 : -1
        })
      }

      // 时间粒子
      const timeParticles = document.createElement('div')
      timeParticles.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
      `
      panel.appendChild(timeParticles)

      const particles = []
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div')
        const size = 3 + Math.random() * 5
        const hue = (index * 30 + i * 12) % 360

        particle.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle,
            hsla(${hue}, 80%, 70%, 1),
            hsla(${hue}, 80%, 50%, 0.5),
            transparent
          );
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          box-shadow: 0 0 ${size * 3}px hsla(${hue}, 80%, 60%, 0.8);
        `
        timeParticles.appendChild(particle)

        const angle = (i / 30) * Math.PI * 2
        particles.push({
          element: particle,
          angle,
          distance: 80 + Math.random() * 100,
          speed: 0.8 + Math.random() * 0.8,
          delay: i * 0.05
        })
      }

      // 环旋转动画
      rings.forEach(r => {
        const ringTl = gsap.timeline({ repeat: -1, ease: 'none', delay: r.delay })

        ringTl
          .to(r.element, {
            opacity: 1,
            duration: 0.3
          })
          .to(r.element, {
            rotation: r.direction * 360,
            duration: r.speed,
            ease: 'none'
          })

        cleanupFunctions.push(() => ringTl.kill())
      })

      // 粒子螺旋时间旅行
      particles.forEach(p => {
        const particleTl = gsap.timeline({ repeat: -1, delay: p.delay })

        particleTl
          .to(p.element, {
            opacity: 1,
            scale: 1.5,
            duration: 0.2
          })
          .to(p.element, {
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            opacity: 0,
            scale: 0.3,
            duration: p.speed,
            ease: 'power2.in'
          })
          .set(p.element, {
            x: Math.cos(p.angle + Math.PI) * p.distance,
            y: Math.sin(p.angle + Math.PI) * p.distance
          })
          .to(p.element, {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            duration: p.speed * 0.5,
            ease: 'power2.out'
          })

        cleanupFunctions.push(() => particleTl.kill())
      })

      // 时间折叠动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2.2
        }
      })

      // 面板从时间裂缝中展开
      tl.fromTo(
        panel,
        {
          rotationY: -180,
          rotationX: -60,
          scale: 0.3,
          opacity: 0,
          filter: 'blur(20px) hue-rotate(120deg)'
        },
        {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px) hue-rotate(0deg)',
          duration: 2,
          ease: 'power3.out'
        }
      )

      // 莫比乌斯式无限循环（时间环）
      tl.to(
        timeRings,
        {
          rotationZ: 180,
          scale: 1.2,
          duration: 1,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1
        },
        0.5
      )

      // 时间扭曲效果
      tl.to(
        panel,
        {
          rotationZ: 360,
          scale: 0.95,
          duration: 1.5,
          ease: 'sine.inOut'
        },
        1
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (timeRings.parentNode) timeRings.parentNode.removeChild(timeRings)
        if (timeParticles.parentNode) timeParticles.parentNode.removeChild(timeParticles)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V33: 星云诞生 ============
/**
 * 融合星系旋转 + 粒子汇聚 + 液体流动
 * 模拟星云从混沌到有序的演化过程
 */
export const nebulaBirthAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '1800px'

      // 星云容器
      const nebulaContainer = document.createElement('div')
      nebulaContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: visible;
      `
      panel.appendChild(nebulaContainer)

      // 创建星云气体云团
      const nebulaClouds = []
      const numClouds = 12

      for (let i = 0; i < numClouds; i++) {
        const cloud = document.createElement('div')
        const size = 80 + Math.random() * 120
        const hue = (index * 25 + i * 20) % 360
        const startAngle = (i / numClouds) * Math.PI * 2

        cloud.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle,
            hsla(${hue}, 70%, 70%, 0.4),
            hsla(${hue + 20}, 70%, 50%, 0.3),
            hsla(${hue + 40}, 70%, 30%, 0.1),
            transparent
          );
          border-radius: 50%;
          transform: translate(-50%, -50%) 
                     rotate(${(startAngle * 180) / Math.PI}deg) 
                     translateX(${150 + Math.random() * 100}px)
                     scale(0);
          opacity: 0;
          filter: blur(20px);
        `
        nebulaContainer.appendChild(cloud)

        nebulaClouds.push({
          element: cloud,
          angle: startAngle,
          targetDistance: 50 + Math.random() * 80,
          targetScale: 0.8 + Math.random() * 0.6,
          rotationSpeed: 0.3 + Math.random() * 0.5,
          delay: i * 0.12
        })
      }

      // 恒星粒子
      const stars = []
      const numStars = 50

      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div')
        const size = 1 + Math.random() * 3
        const hue = (index * 20 + Math.random() * 60) % 360

        star.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle,
            hsla(${hue}, 80%, 80%, 1),
            hsla(${hue}, 80%, 60%, 0.5),
            transparent
          );
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          box-shadow: 0 0 ${size * 4}px hsla(${hue}, 80%, 70%, 0.8);
        `
        nebulaContainer.appendChild(star)

        const angle = (i / numStars) * Math.PI * 2
        const distance = 30 + Math.random() * 200
        stars.push({
          element: star,
          angle,
          distance,
          delay: i * 0.02,
          orbitSpeed: 0.5 + Math.random() * 1
        })
      }

      // 星云旋转动画
      nebulaClouds.forEach(cloud => {
        // 进入动画
        gsap.to(cloud.element, {
          scale: cloud.targetScale,
          opacity: 0.7,
          duration: 1.5,
          delay: cloud.delay,
          ease: 'power2.out'
        })

        // 持续旋转
        const cloudTl = gsap.timeline({ repeat: -1, ease: 'none', delay: cloud.delay })

        cloudTl.to(cloud.element, {
          rotation: `+=360`,
          duration: 10 / cloud.rotationSpeed,
          ease: 'none'
        })

        cleanupFunctions.push(() => cloudTl.kill())
      })

      // 恒星轨道动画
      stars.forEach(star => {
        const starTl = gsap.timeline({ repeat: -1, ease: 'none', delay: star.delay })

        starTl
          .to(star.element, {
            opacity: 1,
            duration: 0.3
          })
          .to(star.element, {
            motionPath: {
              path: `M50,50 m-${star.distance},0 a${star.distance},${star.distance} 0 1,0 ${star.distance * 2},0 a${star.distance},${star.distance} 0 1,0 -${star.distance * 2},0`,
              align: 'none',
              alignOrigin: [0.5, 0.5]
            },
            duration: (2 / star.orbitSpeed) * Math.PI,
            ease: 'none'
          })

        cleanupFunctions.push(() => starTl.kill())
      })

      // 星云诞生动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2
        }
      })

      // 从混沌到有序
      tl.fromTo(
        panel,
        {
          scale: 0.5,
          opacity: 0,
          filter: 'blur(30px) brightness(0.5)',
          rotationZ: 720
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px) brightness(1)',
          rotationZ: 0,
          duration: 2.5,
          ease: 'power3.out'
        }
      )

      // 云团汇聚
      nebulaClouds.forEach((cloud, i) => {
        tl.to(
          cloud.element,
          {
            transform: `translate(-50%, -50%) rotate(${(cloud.angle * 180) / Math.PI}deg) translateX(${cloud.targetDistance}px) scale(${cloud.targetScale})`,
            duration: 2,
            delay: i * 0.05,
            ease: 'elastic.out(0.6, 0.7)'
          },
          0
        )
      })

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (nebulaContainer.parentNode) nebulaContainer.parentNode.removeChild(nebulaContainer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V34: 霓虹城市 ============
/**
 * 融合全息扫描 + 粒子系统 + 多层视差
 * 创建赛博朋克霓虹城市夜景
 */
export const neonCityAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '2000px'

      // 城市层
      const cityLayer = document.createElement('div')
      cityLayer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        transform-style: preserve-3d;
      `
      panel.appendChild(cityLayer)

      // 建筑群
      const buildings = []
      const numBuildings = 10

      for (let i = 0; i < numBuildings; i++) {
        const building = document.createElement('div')
        const height = 30 + Math.random() * 50
        const width = 8 + Math.random() * 15
        const hue = (index * 30 + i * 15) % 360

        building.style.cssText = `
          position: absolute;
          bottom: 0;
          left: ${i * 10}%;
          width: ${width}%;
          height: ${height}%;
          background: linear-gradient(to top,
            hsla(${hue}, 60%, 30%, 0.9),
            hsla(${hue}, 60%, 40%, 0.8),
            hsla(${hue}, 60%, 50%, 0.6)
          );
          border: 1px solid hsla(${hue}, 60%, 70%, 0.6);
          transform: translateZ(${i * 30}px) scaleY(0);
          transform-origin: bottom;
          opacity: 0;
          box-shadow: 0 0 20px hsla(${hue}, 60%, 50%, 0.5),
                      inset 0 0 30px rgba(0,0,0,0.5);
        `
        cityLayer.appendChild(building)

        buildings.push({
          element: building,
          delay: i * 0.1,
          targetHeight: height,
          zDepth: i * 30
        })
      }

      // 霓虹灯
      const neonLights = []
      for (let i = 0; i < 15; i++) {
        const neon = document.createElement('div')
        const hue = (index * 25 + i * 20) % 360
        const height = 2 + Math.random() * 8

        neon.style.cssText = `
          position: absolute;
          left: ${Math.random() * 100}%;
          top: ${20 + Math.random() * 60}%;
          width: 2px;
          height: ${height}px;
          background: hsla(${hue}, 80%, 60%, 1);
          box-shadow: 0 0 10px hsla(${hue}, 80%, 60%, 1),
                      0 0 20px hsla(${hue}, 80%, 60%, 0.8),
                      0 0 40px hsla(${hue}, 80%, 60%, 0.6);
          opacity: 0;
          transform: rotate(${Math.random() * 360}deg);
        `
        cityLayer.appendChild(neon)

        neonLights.push({
          element: neon,
          delay: Math.random() * 2,
          blinkSpeed: 0.5 + Math.random() * 1
        })
      }

      // 赛博飞行器
      const flyers = []
      for (let i = 0; i < 5; i++) {
        const flyer = document.createElement('div')
        const hue = (index * 20 + i * 30) % 360

        flyer.style.cssText = `
          position: absolute;
          left: -50px;
          top: ${20 + Math.random() * 50}%;
          width: 30px;
          height: 8px;
          background: linear-gradient(to right,
            transparent,
            hsla(${hue}, 80%, 60%, 1),
            transparent
          );
          box-shadow: 0 0 15px hsla(${hue}, 80%, 60%, 0.8);
          opacity: 0;
          transform: translateZ(${50 + i * 20}px);
        `
        cityLayer.appendChild(flyer)

        flyers.push({
          element: flyer,
          delay: Math.random() * 3,
          speed: 2 + Math.random() * 2
        })
      }

      // 建筑升起动画
      buildings.forEach(b => {
        const buildingTl = gsap.timeline({ delay: b.delay })

        buildingTl.to(b.element, {
          opacity: 1,
          scaleY: b.targetHeight / 100,
          duration: 1.2,
          ease: 'back.out(1.5)'
        })

        cleanupFunctions.push(() => buildingTl.kill())
      })

      // 霓虹闪烁动画
      neonLights.forEach(nl => {
        const neonTl = gsap.timeline({ repeat: -1, delay: nl.delay })

        neonTl
          .to(nl.element, {
            opacity: 1,
            duration: 0.1
          })
          .to(nl.element, {
            opacity: 0.3,
            duration: nl.blinkSpeed * 0.5,
            ease: 'power1.inOut'
          })
          .to(nl.element, {
            opacity: 1,
            duration: 0.1
          })
          .to(nl.element, {
            opacity: 0.5,
            duration: nl.blinkSpeed,
            ease: 'power1.inOut'
          })

        cleanupFunctions.push(() => neonTl.kill())
      })

      // 飞行器穿梭动画
      flyers.forEach(f => {
        const flyerTl = gsap.timeline({ repeat: -1, delay: f.delay })

        flyerTl
          .to(f.element, {
            opacity: 1,
            duration: 0.2
          })
          .to(f.element, {
            left: '120%',
            duration: f.speed,
            ease: 'none'
          })
          .to(f.element, {
            left: '-50px',
            duration: 0,
            ease: 'none'
          })

        cleanupFunctions.push(() => flyerTl.kill())
      })

      // 面板城市展开动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2
        }
      })

      tl.fromTo(
        panel,
        {
          scale: 0.8,
          opacity: 0,
          filter: 'blur(15px) brightness(0.7) contrast(1.3)',
          rotationY: -30
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px) brightness(1) contrast(1)',
          rotationY: 0,
          duration: 1.8,
          ease: 'power2.out'
        }
      )

      // 霓虹城市整体脉动
      tl.to(
        cityLayer,
        {
          brightness: 1.3,
          saturation: 1.2,
          duration: 1,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1
        },
        0.5
      )

      cleanupFunctions.push(() => tl.kill())
      cleanupFunctions.push(() => {
        if (cityLayer.parentNode) cityLayer.parentNode.removeChild(cityLayer)
      })
    })
  })

  return () => {
    cleanupFunctions.forEach(fn => fn())
    cleanupFunctions = []
  }
}

// ============ V35: 极限视差 ============
/**
 * 融合多层视差 + 3D卡片翻转 + 流体涡旋
 * 创造极致深度的3D空间体验
 */
export const ultimateParallaxAnimation = () => {
  registerPlugins()
  ScrollTrigger.refresh()

  let cleanupFunctions = []

  waitForDOM(() => {
    const panels = document.querySelectorAll('.panel')
    if (!panels.length) return

    panels.forEach((panel, index) => {
      panel.style.transformStyle = 'preserve-3d'
      panel.style.perspective = '2500px'

      // 深度容器
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

      // 创建多层深度层
      const depthLayers = []
      const numLayers = 8
      const layerSpacing = 100

      for (let l = 0; l < numLayers; l++) {
        const layer = document.createElement('div')
        const depth = l * layerSpacing - (numLayers * layerSpacing) / 2
        const hue = (index * 30 + l * 20) % 360
        const size = 40 + l * 7
        const delay = l * 0.1

        layer.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}%;
          height: ${size}%;
          background: radial-gradient(circle,
            hsla(${hue}, 60%, ${50 + l * 3}%, 0.6),
            hsla(${hue + 20}, 60%, ${40 + l * 3}%, 0.4),
            hsla(${hue + 40}, 60%, ${30 + l * 3}%, 0.2),
            transparent
          );
          border: 2px solid hsla(${hue}, 60%, 60%, ${0.7 - l * 0.08});
          border-radius: ${l % 2 === 0 ? '15%' : '50%'};
          transform: translate(-50%, -50%) translateZ(${depth}px) rotateZ(${(Math.random() - 0.5) * 40}deg) scale(0);
          transform-origin: center center;
          opacity: 0;
          box-shadow: 0 0 ${20 + l * 5}px hsla(${hue}, 60%, 50%, ${0.5 - l * 0.05}),
                      inset 0 0 ${15 + l * 3}px hsla(${hue}, 60%, 50%, 0.3);
        `
        depthContainer.appendChild(layer)
        depthLayers.push({ element: layer, depth, delay })
      }

      // 流体涡旋粒子
      const vortexParticles = document.createElement('div')
      vortexParticles.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        pointer-events: none;
        transform-style: preserve-3d;
      `
      depthContainer.appendChild(vortexParticles)

      const particles = []
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div')
        const size = 3 + Math.random() * 5
        const hue = (index * 20 + i * 8) % 360

        particle.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle,
            hsla(${hue}, 80%, 70%, 1),
            hsla(${hue}, 80%, 50%, 0.5),
            transparent
          );
          border-radius: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          box-shadow: 0 0 ${size * 3}px hsla(${hue}, 80%, 60%, 0.8);
        `
        vortexParticles.appendChild(particle)

        const angle = (i / 40) * Math.PI * 2
        particles.push({
          element: particle,
          angle,
          distance: 80 + Math.random() * 120,
          speed: 1 + Math.random() * 1.5,
          zDepth: -200 + Math.random() * 400,
          delay: i * 0.03
        })
      }

      // 粒子涡旋动画
      particles.forEach(p => {
        const particleTl = gsap.timeline({ repeat: -1, delay: p.delay })

        particleTl
          .to(p.element, {
            opacity: 1,
            scale: 1.2,
            duration: 0.3
          })
          .to(p.element, {
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            z: p.zDepth,
            opacity: 0.5,
            duration: p.speed,
            ease: 'power1.out'
          })
          .to(
            p.element,
            {
              rotationZ: (p.angle * 180) / Math.PI + 360,
              duration: p.speed * 0.5,
              ease: 'none'
            },
            0
          )

        cleanupFunctions.push(() => particleTl.kill())
      })

      // 极限视差展开动画
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'center center',
          scrub: 2.5
        }
      })

      // 面板3D翻转进入
      tl.fromTo(
        panel,
        {
          rotationY: -90,
          rotationX: -20,
          scale: 0.7,
          opacity: 0,
          filter: 'blur(20px)'
        },
        {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 2,
          ease: 'power3.out'
        }
      )

      // 多层深度展开
      depthLayers.forEach((l, i) => {
        tl.fromTo(
          l.element,
          {
            scale: 0,
            opacity: 0,
            translateZ: l.depth - 200
          },
          {
            scale: 1,
            opacity: 1,
            translateZ: l.depth,
            rotationZ: (Math.random() - 0.5) * 20,
            duration: 1.5,
            delay: l.delay,
            ease: 'back.out(1.2)'
          },
          0
        )
      })

      // 涡旋旋转
      tl.to(
        vortexParticles,
        {
          rotationZ: 360,
          duration: 2,
          ease: 'power1.inOut'
        },
        0.5
      )

      // 极限视差效果（随滚动变化）
      tl.to(
        depthContainer,
        {
          rotationY: 15,
          rotationX: 10,
          duration: 1.5,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1
        },
        1
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
