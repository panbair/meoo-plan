<template>
  <div ref="parentRef" class="neon-sign-227">
    <!-- 背景层 - 湿街雨夜氛围 -->
    <div class="neon-bg-227">
      <div class="neon-rain-227"></div>
      <div class="neon-ground-227"></div>
    </div>

    <!-- 电弧画布 -->
    <canvas ref="arcCanvasRef" class="neon-arc-canvas-227"></canvas>

    <!-- 主招牌框架 -->
    <div class="neon-frame-227">
      <!-- 边框装饰 -->
      <div class="neon-border-top-227"></div>
      <div class="neon-border-bottom-227"></div>
      <div class="neon-border-left-227"></div>
      <div class="neon-border-right-227"></div>

      <!-- 变压器装饰 -->
      <div class="neon-transformer-227 transformer-left-227">
        <div class="transformer-body-227"></div>
        <div class="transformer-coil-227"></div>
      </div>
      <div class="neon-transformer-227 transformer-right-227">
        <div class="transformer-body-227"></div>
        <div class="transformer-coil-227"></div>
      </div>

      <!-- 霓虹文字容器 -->
      <div class="neon-text-container-227">
        <div class="neon-line-1-227">
          <span
            v-for="(char, index) in titleChars"
            :key="'title-' + index"
            class="neon-char-227"
            :data-index="index"
          >{{ char }}</span>
        </div>
        <div class="neon-line-2-227">
          <span
            v-for="(char, index) in subtitleChars"
            :key="'subtitle-' + index"
            class="neon-char-227 neon-char-sub-227"
            :data-index="index"
          >{{ char }}</span>
        </div>
      </div>

      <!-- 地面倒影 -->
      <div class="neon-reflection-227">
        <span class="reflection-text-227">{{ titleText }}</span>
      </div>
    </div>

    <!-- 氛围粒子 -->
    <div class="neon-particles-227">
      <span v-for="i in 20" :key="i" class="neon-particle-227"></span>
    </div>

    <!-- 电压指示器 -->
    <div class="neon-voltage-227">
      <span class="voltage-label-227">VOLTAGE</span>
      <div class="voltage-bar-227">
        <div class="voltage-fill-227" :style="{ width: voltagePercent + '%' }"></div>
      </div>
      <span class="voltage-value-227">{{ voltageValue }}kV</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Refs
const parentRef = ref<HTMLElement | null>(null)
const arcCanvasRef = ref<HTMLCanvasElement | null>(null)

// 数据
const titleText = 'NEON LIGHTS'
const subtitleText = 'OPEN 24 HOURS'
const titleChars = computed(() => titleText.split(''))
const subtitleChars = computed(() => subtitleText.split(''))
const voltagePercent = ref(0)
const voltageValue = ref(0)

// 动画状态
let tl: gsap.core.Timeline | null = null
let cleanupFns: (() => void)[] = []
let arcAnimationId: number | null = null
let flickerIntervals: number[] = []
let breathIntervals: number[] = []

// 电弧数据
interface Arc {
  x: number
  y: number
  endX: number
  endY: number
  life: number
  maxLife: number
  color: string
}

let arcs: Arc[] = []

// 计算电弧路径
function calculateArcPath(x1: number, y1: number, x2: number, y2: number, segments: number = 5): string {
  const points: string[] = []
  points.push(`M ${x1} ${y1}`)

  for (let i = 1; i <= segments; i++) {
    const t = i / segments
    const x = x1 + (x2 - x1) * t
    const y = y1 + (y2 - y1) * t

    const offsetX = (Math.random() - 0.5) * 40
    const offsetY = (Math.random() - 0.5) * 40

    if (i < segments) {
      points.push(`Q ${x + offsetX} ${y + offsetY} ${x} ${y}`)
    } else {
      points.push(`L ${x2} ${y2}`)
    }
  }

  return points.join(' ')
}

// 绘制电弧
function drawArcs(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height)

  arcs = arcs.filter(arc => {
    arc.life--
    if (arc.life <= 0) return false

    const alpha = arc.life / arc.maxLife

    // 绘制主电弧
    ctx.beginPath()
    ctx.strokeStyle = arc.color
    ctx.lineWidth = 2 * alpha
    ctx.shadowBlur = 15
    ctx.shadowColor = arc.color

    const segments = 8
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = arc.x + (arc.endX - arc.x) * t
      const y = arc.y + (arc.endY - arc.y) * t

      const offsetX = (Math.random() - 0.5) * 30
      const offsetY = (Math.random() - 0.5) * 30

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x + offsetX, y + offsetY)
      }
    }
    ctx.stroke()

    // 绘制电弧分支
    if (Math.random() > 0.7) {
      ctx.beginPath()
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`
      ctx.lineWidth = 1

      const branchX = arc.x + (arc.endX - arc.x) * 0.3
      const branchY = arc.y + (arc.endY - arc.y) * 0.3
      ctx.moveTo(branchX, branchY)
      ctx.lineTo(branchX + (Math.random() - 0.5) * 60, branchY + (Math.random() - 0.5) * 60)
      ctx.stroke()
    }

    return true
  })
}

// 生成随机电弧
function generateArc(width: number, height: number, intensity: number = 1) {
  const colors = [
    'rgba(100, 180, 255, 0.8)',
    'rgba(150, 100, 255, 0.8)',
    'rgba(200, 150, 255, 0.8)',
    'rgba(255, 255, 255, 0.9)'
  ]

  const x1 = Math.random() * width
  const y1 = Math.random() * height * 0.4
  const x2 = Math.random() * width
  const y2 = Math.random() * height * 0.4

  arcs.push({
    x: x1,
    y: y1,
    endX: x2,
    endY: y2,
    life: Math.floor(10 + Math.random() * 20),
    maxLife: 30,
    color: colors[Math.floor(Math.random() * colors.length)]
  })
}

// 创建SVG电弧元素
function createSvgArc(container: HTMLElement, x1: number, y1: number, x2: number, y2: number): SVGPathElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'neon-svg-arc-227')
  svg.style.position = 'absolute'
  svg.style.left = '0'
  svg.style.top = '0'
  svg.style.width = '100%'
  svg.style.height = '100%'
  svg.style.pointerEvents = 'none'
  svg.style.zIndex = '15'

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  const d = calculateArcPath(x1, y1, x2, y2, 6)
  path.setAttribute('d', d)
  path.setAttribute('stroke', 'rgba(150, 200, 255, 0.8)')
  path.setAttribute('stroke-width', '2')
  path.setAttribute('fill', 'none')
  path.setAttribute('filter', 'blur(1px)')

  svg.appendChild(path)
  container.appendChild(svg)

  return path
}

// 电弧动画循环
function startArcAnimation() {
  const canvas = arcCanvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const animate = () => {
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    if (Math.random() > 0.85) {
      generateArc(canvas.width, canvas.height)
    }

    drawArcs(ctx, canvas.width, canvas.height)
    arcAnimationId = requestAnimationFrame(animate)
  }

  animate()
}

// 霓虹字符闪烁效果
function flickerNeonChar(char: Element, times: number = 3) {
  const flicker = () => {
    gsap.to(char, {
      opacity: 0.1,
      duration: 0.03,
      ease: 'none',
      onComplete: () => {
        gsap.to(char, {
          opacity: 1,
          duration: 0.03,
          ease: 'none',
          onComplete: () => {
            times--
            if (times > 0) {
              setTimeout(flicker, 50)
            }
          }
        })
      }
    })
  }
  flicker()
}

// 设置呼吸效果
function setupBreathingEffect(chars: NodeListOf<Element>) {
  chars.forEach((char, index) => {
    const interval = window.setInterval(() => {
      if (Math.random() > 0.95) {
        gsap.to(char, {
          opacity: 0.6,
          duration: 0.05,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(char, {
              opacity: 1,
              duration: 0.1,
              ease: 'power2.in'
            })
          }
        })
      }
    }, 2000 + index * 100)

    breathIntervals.push(interval)
  })
}

// 鼠标悬停效果
function setupHoverEffects(titleChars: NodeListOf<Element>) {
  titleChars.forEach(char => {
    char.addEventListener('mouseenter', () => {
      gsap.to(char, {
        opacity: () => Math.random() * 0.3 + 0.2,
        duration: 0.05,
        ease: 'none'
      })
    })

    char.addEventListener('mouseleave', () => {
      gsap.to(char, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })
}

// 主入场动画
function createEntryAnimation() {
  if (!parentRef.value) return

  const parent = parentRef.value
  const titleCharsEls = parent.querySelectorAll('.neon-char-227:not(.neon-char-sub-227)')
  const subtitleCharsEls = parent.querySelectorAll('.neon-char-sub-227')
  const borders = parent.querySelectorAll('.neon-border-top-227, .neon-border-bottom-227, .neon-border-left-227, .neon-border-right-227')
  const transformers = parent.querySelectorAll('.neon-transformer-227')
  const reflection = parent.querySelector('.neon-reflection-227')
  const particles = parent.querySelectorAll('.neon-particle-227')
  const rain = parent.querySelector('.neon-rain-227')

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        voltagePercent.value = Math.round(self.progress * 100)
        voltageValue.value = Math.round(220 * self.progress)
      }
    }
  })

  // 保存 ScrollTrigger 清理函数
  const scrollTriggerInstance = ScrollTrigger.getById('neon-sign-trigger')
  if (scrollTriggerInstance) {
    cleanupFns.push(() => scrollTriggerInstance.kill())
  }

  // 阶段1：背景和边框准备
  tl.fromTo(rain, {
    opacity: 0,
    y: -100
  }, {
    opacity: 1,
    y: 0,
    duration: 0.3
  }, 0)

  tl.fromTo(borders, {
    scaleX: 0,
    opacity: 0
  }, {
    scaleX: 1,
    opacity: 1,
    duration: 0.4,
    stagger: 0.1
  }, 0.1)

  // 阶段2：变压器出现
  tl.fromTo(transformers, {
    scale: 0,
    opacity: 0
  }, {
    scale: 1,
    opacity: 1,
    duration: 0.3,
    stagger: 0.1
  }, 0.2)

  // 阶段3：粒子出现
  tl.fromTo(particles, {
    opacity: 0,
    scale: 0
  }, {
    opacity: 0.6,
    scale: 1,
    duration: 0.3,
    stagger: {
      each: 0.05,
      from: 'random'
    }
  }, 0.3)

  // 阶段4：文字通电动画 - 每个字符依次点亮
  titleCharsEls.forEach((char, index) => {
    const delay = 0.4 + index * 0.08

    // 初始状态 - 黑色灯管轮廓
    gsap.set(char, {
      opacity: 0,
      '--char-color': '#1a1a1a',
      textShadow: 'none'
    })

    tl.fromTo(char, {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.15,
      ease: 'power2.out'
    }, delay)

    // 击穿闪烁效果
    tl.call(() => {
      flickerNeonChar(char, 3)

      // 闪烁后变成霓虹色
      setTimeout(() => {
        gsap.to(char, {
          '--char-color': '#ff6b9d',
          textShadow: `
            0 0 5px #ff6b9d,
            0 0 10px #ff6b9d,
            0 0 20px #ff6b9d,
            0 0 40px #ff1493
          `,
          duration: 0.3,
          ease: 'power2.out'
        })
      }, 200)
    }, [], delay)

    // 电弧效果
    tl.call(() => {
      const rect = char.getBoundingClientRect()
      const parentRect = parent.getBoundingClientRect()
      const svg = createSvgArc(
        parent,
        rect.left - parentRect.left + rect.width / 2,
        rect.top - parentRect.top + rect.height / 2,
        rect.left - parentRect.left + rect.width / 2 + (Math.random() - 0.5) * 80,
        rect.top - parentRect.top + rect.height / 2 - 20
      )

      // 电弧出现动画
      gsap.fromTo(svg, {
        opacity: 0,
        strokeDashoffset: 100
      }, {
        opacity: 1,
        strokeDashoffset: 0,
        duration: 0.2,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(svg, {
            opacity: 0,
            duration: 0.3,
            delay: 0.1,
            onComplete: () => svg.remove()
          })
        }
      })
    }, [], delay + 0.1)
  })

  // 阶段5：副标题动画
  subtitleCharsEls.forEach((char, index) => {
    const delay = 0.8 + index * 0.06

    gsap.set(char, {
      opacity: 0
    })

    tl.fromTo(char, {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      duration: 0.15,
      ease: 'back.out(1.5)'
    }, delay)

    tl.call(() => {
      flickerNeonChar(char, 2)

      setTimeout(() => {
        gsap.to(char, {
          '--char-color': '#00d4ff',
          textShadow: `
            0 0 5px #00d4ff,
            0 0 10px #00d4ff,
            0 0 20px #00d4ff
          `,
          duration: 0.3,
          ease: 'power2.out'
        })
      }, 150)
    }, [], delay)

    tl.call(() => {
      const rect = char.getBoundingClientRect()
      const parentRect = parent.getBoundingClientRect()
      createSvgArc(
        parent,
        rect.left - parentRect.left + rect.width / 2,
        rect.top - parentRect.top,
        rect.left - parentRect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
        rect.top - parentRect.top - 15
      )
    }, [], delay + 0.05)
  })

  // 阶段6：地面倒影
  tl.fromTo(reflection, {
    opacity: 0,
    y: 50,
    filter: 'blur(10px)'
  }, {
    opacity: 0.4,
    y: 0,
    filter: 'blur(8px)',
    duration: 0.4,
    ease: 'power2.out'
  }, 1.2)

  // 阶段7：稳定呼吸效果
  tl.call(() => {
    setupBreathingEffect(titleCharsEls)
    setupHoverEffects(titleCharsEls)
  }, [], 1.3)

  // 阶段8：倒影微晃
  tl.to(reflection, {
    y: '+=3',
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  }, 1.4)

  return tl
}

// 初始化
onMounted(() => {
  if (!parentRef.value) return

  const parent = parentRef.value

  // 启动电弧动画
  startArcAnimation()
  cleanupFns.push(() => {
    if (arcAnimationId !== null) {
      cancelAnimationFrame(arcAnimationId)
    }
  })

  // 创建入场动画
  createEntryAnimation()

  // 添加额外的随机电弧效果
  const arcInterval = window.setInterval(() => {
    if (!arcCanvasRef.value) return
    const rect = arcCanvasRef.value.getBoundingClientRect()
    if (Math.random() > 0.7) {
      generateArc(rect.width, rect.height, 0.5)
    }
  }, 300)

  cleanupFns.push(() => clearInterval(arcInterval))
})

// 清理
onUnmounted(() => {
  // 清理 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id?.includes('neon-sign')) {
      st.kill()
    }
  })

  // 清理 Timeline
  if (tl) {
    tl.kill()
  }

  // 清理定时器
  flickerIntervals.forEach(id => clearInterval(id))
  breathIntervals.forEach(id => clearInterval(id))

  // 执行所有清理函数
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
})
</script>

<style scoped lang="scss">
.neon-sign-227 {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    180deg,
    #0a0a12 0%,
    #12121f 30%,
    #1a1a2e 60%,
    #0f0f1a 100%
  );
  overflow: hidden;
  font-family: 'Playfair Display', 'Georgia', serif;
}

// 背景层
.neon-bg-227 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// 雨效果
.neon-rain-227 {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    180deg,
    transparent 0px,
    rgba(150, 180, 255, 0.03) 1px,
    transparent 2px,
    transparent 20px
  );
  animation: rain-fall 0.5s linear infinite;
  opacity: 0;
}

@keyframes rain-fall {
  from { transform: translateY(-20px); }
  to { transform: translateY(20px); }
}

// 地面
.neon-ground-227 {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(100, 120, 180, 0.05) 30%,
    rgba(80, 100, 150, 0.08) 60%,
    rgba(60, 80, 120, 0.1) 100%
  );
}

// 电弧画布
.neon-arc-canvas-227 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

// 主招牌框架
.neon-frame-227 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 1000px;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

// 边框装饰
.neon-border-top-227,
.neon-border-bottom-227 {
  position: absolute;
  left: 5%;
  right: 5%;
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 107, 157, 0.3),
    rgba(0, 212, 255, 0.3),
    rgba(255, 107, 157, 0.3),
    transparent
  );
  border-radius: 2px;
}

.neon-border-top-227 {
  top: 0;
  box-shadow: 0 0 10px rgba(255, 107, 157, 0.3);
}

.neon-border-bottom-227 {
  bottom: 0;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.neon-border-left-227,
.neon-border-right-227 {
  position: absolute;
  top: 5%;
  bottom: 5%;
  width: 4px;
  background: linear-gradient(
    180deg,
    rgba(0, 212, 255, 0.3),
    rgba(255, 107, 157, 0.3),
    rgba(0, 212, 255, 0.3)
  );
  border-radius: 2px;
}

.neon-border-left-227 {
  left: 0;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.neon-border-right-227 {
  right: 0;
  box-shadow: 0 0 10px rgba(255, 107, 157, 0.3);
}

// 变压器
.neon-transformer-227 {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.transformer-left-227 {
  left: -80px;
}

.transformer-right-227 {
  right: -80px;
}

.transformer-body-227 {
  width: 40px;
  height: 60px;
  background: linear-gradient(
    135deg,
    #2a2a3a,
    #1a1a2a
  );
  border: 2px solid #3a3a4a;
  border-radius: 4px;
  box-shadow:
    inset 0 0 10px rgba(0, 0, 0, 0.5),
    0 0 5px rgba(100, 150, 255, 0.2);
}

.transformer-coil-227 {
  width: 30px;
  height: 20px;
  margin-top: 5px;
  background: repeating-linear-gradient(
    0deg,
    #4a4a5a,
    #4a4a5a 3px,
    #3a3a4a 3px,
    #3a3a4a 6px
  );
  border-radius: 3px;
  animation: coil-hum-227 0.1s linear infinite;
}

@keyframes coil-hum-227 {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

// 霓虹文字
.neon-text-container-227 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.neon-line-1-227,
.neon-line-2-227 {
  display: flex;
  gap: 8px;
}

.neon-char-227 {
  font-size: clamp(48px, 8vw, 100px);
  font-weight: 700;
  color: var(--char-color, #1a1a1a);
  text-shadow: var(--char-shadow, none);
  cursor: pointer;
  transition: text-shadow 0.3s ease;
  position: relative;

  &::before {
    content: attr(data-index);
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: rgba(255, 255, 255, 0.3);
  }
}

.neon-char-sub-227 {
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 400;
  letter-spacing: 4px;
}

// 地面倒影
.neon-reflection-227 {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 700;
  color: rgba(255, 107, 157, 0.15);
  white-space: nowrap;
  letter-spacing: 8px;
  text-transform: uppercase;
  pointer-events: none;
}

.reflection-text-227 {
  display: block;
  transform: scaleY(-1);
  opacity: 0.3;
  filter: blur(8px);
}

// 氛围粒子
.neon-particles-227 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.neon-particle-227 {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  animation: particle-float-227 4s ease-in-out infinite;

  @for $i from 1 through 20 {
    &:nth-child(#{$i}) {
      left: random(100) * 1%;
      top: random(100) * 1%;
      animation-delay: random(4) * 1s;
      animation-duration: (3 + random(3)) * 1s;
    }
  }
}

@keyframes particle-float-227 {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.6;
  }
}

// 电压指示器
.neon-voltage-227 {
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 107, 157, 0.3);
  border-radius: 4px;
  z-index: 20;
}

.voltage-label-227 {
  font-size: 10px;
  color: rgba(255, 107, 157, 0.7);
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.voltage-bar-227 {
  width: 100px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.voltage-fill-227 {
  height: 100%;
  background: linear-gradient(
    90deg,
    #00d4ff,
    #ff6b9d
  );
  transition: width 0.1s ease;
  box-shadow: 0 0 10px rgba(255, 107, 157, 0.5);
}

.voltage-value-227 {
  font-size: 12px;
  color: #ff6b9d;
  font-family: 'Courier New', monospace;
  min-width: 50px;
}

// 响应式
@media (max-width: 768px) {
  .neon-frame-227 {
    width: 90%;
  }

  .neon-char-227 {
    gap: 4px;
  }

  .neon-transformer-227 {
    display: none;
  }

  .neon-voltage-227 {
    bottom: 15px;
    right: 15px;
    padding: 8px 10px;
  }

  .voltage-bar-227 {
    width: 60px;
  }
}
</style>
