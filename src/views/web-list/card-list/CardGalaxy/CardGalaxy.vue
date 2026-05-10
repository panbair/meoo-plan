<template>
  <section class="galaxy-section">
    <!-- 动态星空背景 -->
    <div class="galaxy-bg">
      <canvas ref="bgCanvas" class="bg-stars"></canvas>
    </div>

    <!-- 星云效果层 -->
    <div class="nebula-layer" ref="nebulaLayer"></div>

    <!-- 卡片容器 -->
    <div class="galaxy-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="galaxy-card"
        :ref="(el) => setCardRef(el, index)"
        :style="{ '--card-color': card.color, '--orbit-speed': `${card.orbitSpeed}s` }"
      >
        <!-- 黑洞光环 -->
        <div class="black-hole" :ref="(el) => setBlackHoleRef(el, index)"></div>

        <!-- 轨道环 -->
        <div class="orbit-ring" :ref="(el) => setOrbitRef(el, index)"></div>

        <!-- 行星 -->
        <div
          class="planet"
          :ref="(el) => setPlanetRef(el, index)"
          :style="{ '--planet-color': card.planetColor, '--planet-size': card.planetSize }"
        ></div>

        <!-- 彗星 -->
        <div class="comet" :ref="(el) => setCometRef(el, index)"></div>

        <!-- 卡片内容 -->
        <div class="galaxy-content" :ref="(el) => setContentRef(el, index)">
          <div class="card-icon" :ref="(el) => setIconRef(el, index)">
            {{ card.icon }}
          </div>
          <h3 class="card-title" :ref="(el) => setTitleRef(el, index)">{{ card.title }}</h3>
          <p class="card-desc" :ref="(el) => setDescRef(el, index)">{{ card.desc }}</p>
          <div class="card-stats">
            <div
              v-for="(stat, sIndex) in card.stats"
              :key="sIndex"
              class="stat-item"
              :ref="(el) => setStatRef(el, index, sIndex)"
            >
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <!-- 光芒效果 -->
        <div class="light-rays" :ref="(el) => setRaysRef(el, index)"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardGalaxy - 星系效果卡片组件
 * @description 黑洞、行星、彗星、旋转轨道等宇宙动画效果
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================
interface GalaxyCard {
  id: string
  icon: string
  title: string
  desc: string
  color: string
  planetColor: string
  planetSize: string
  orbitSpeed: string
  stats: { value: string; label: string }[]
}

// ============================================================
// 数据
// ============================================================
const CARDS_DATA: GalaxyCard[] = [
  {
    id: 'galaxy-1',
    icon: '🌌',
    title: 'Andromeda',
    desc: 'A majestic spiral galaxy 2.5 million light-years away',
    color: '#9b59b6',
    planetColor: '#e74c3c',
    planetSize: '40px',
    orbitSpeed: '8',
    stats: [
      { value: '1T', label: 'Stars' },
      { value: '220k', label: 'LY' },
      { value: '3.3B', label: 'Age' }
    ]
  },
  {
    id: 'galaxy-2',
    icon: '🌀',
    title: 'Milky Way',
    desc: 'Our home galaxy with 400 billion stars',
    color: '#3498db',
    planetColor: '#f39c12',
    planetSize: '35px',
    orbitSpeed: '10',
    stats: [
      { value: '400B', label: 'Stars' },
      { value: '100k', label: 'LY' },
      { value: '13.6B', label: 'Age' }
    ]
  },
  {
    id: 'galaxy-3',
    icon: '✨',
    title: 'Nebula X',
    desc: 'Stellar nursery where new stars are born',
    color: '#e91e63',
    planetColor: '#00bcd4',
    planetSize: '45px',
    orbitSpeed: '12',
    stats: [
      { value: '500M', label: 'Stars' },
      { value: '50k', label: 'LY' },
      { value: '2M', label: 'Age' }
    ]
  }
]

// ============================================================
// 响应式数据
// ============================================================
const cards = ref<GalaxyCard[]>(CARDS_DATA)
const cardRefsMap = ref(new Map<number, HTMLElement>())
const blackHoleRefsMap = ref(new Map<number, HTMLElement>())
const orbitRefsMap = ref(new Map<number, HTMLElement>())
const planetRefsMap = ref(new Map<number, HTMLElement>())
const cometRefsMap = ref(new Map<number, HTMLElement>())
const contentRefsMap = ref(new Map<number, HTMLElement>())
const iconRefsMap = ref(new Map<number, HTMLElement>())
const titleRefsMap = ref(new Map<number, HTMLElement>())
const descRefsMap = ref(new Map<number, HTMLElement>())
const statRefsMap = ref(new Map<string, HTMLElement>())
const raysRefsMap = ref(new Map<number, HTMLElement>())
const nebulaLayer = ref<HTMLElement | null>(null)
const bgCanvas = ref<HTMLCanvasElement | null>(null)
const cleanupFns: (() => void)[] = []
let bgCtx: CanvasRenderingContext2D | null = null
let animationFrame: number

// ============================================================
// 模板引用
// ============================================================
const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) cardRefsMap.value.set(index, element as HTMLElement)
  else cardRefsMap.value.delete(index)
}

const setBlackHoleRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) blackHoleRefsMap.value.set(index, el)
  else blackHoleRefsMap.value.delete(index)
}

const setOrbitRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) orbitRefsMap.value.set(index, el)
  else orbitRefsMap.value.delete(index)
}

const setPlanetRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) planetRefsMap.value.set(index, el)
  else planetRefsMap.value.delete(index)
}

const setCometRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) cometRefsMap.value.set(index, el)
  else cometRefsMap.value.delete(index)
}

const setContentRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) contentRefsMap.value.set(index, element as HTMLElement)
  else contentRefsMap.value.delete(index)
}

const setIconRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) iconRefsMap.value.set(index, element as HTMLElement)
  else iconRefsMap.value.delete(index)
}

const setTitleRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) titleRefsMap.value.set(index, element as HTMLElement)
  else titleRefsMap.value.delete(index)
}

const setDescRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) descRefsMap.value.set(index, element as HTMLElement)
  else descRefsMap.value.delete(index)
}

const setStatRef = (el: Element | ComponentPublicInstance | null, index: number, sIndex: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  const key = `${index}-${sIndex}`
  if (element) statRefsMap.value.set(key, element as HTMLElement)
  else statRefsMap.value.delete(key)
}

const setRaysRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) raysRefsMap.value.set(index, el)
  else raysRefsMap.value.delete(index)
}

// ============================================================
// 背景星空动画
// ============================================================
const initBackgroundStars = () => {
  const canvas = bgCanvas.value
  if (!canvas) return

  bgCtx = canvas.getContext('2d')
  if (!bgCtx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = []
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: 0.1 + Math.random() * 0.3,
      opacity: Math.random()
    })
  }

  const animate = () => {
    if (!bgCtx || !canvas) return
    bgCtx.fillStyle = 'rgba(5, 5, 15, 0.2)'
    bgCtx.fillRect(0, 0, canvas.width, canvas.height)

    stars.forEach(star => {
      star.x -= star.speed
      if (star.x < 0) {
        star.x = canvas.width
        star.y = Math.random() * canvas.height
      }
      star.opacity = 0.3 + Math.sin(Date.now() * 0.001 + star.x) * 0.5

      bgCtx.beginPath()
      bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      bgCtx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
      bgCtx.fill()
    })

    animationFrame = requestAnimationFrame(animate)
  }
  animate()
}

// ============================================================
// 入场动画
// ============================================================
const initEntryAnimation = () => {
  // 卡片入场
  cardRefsMap.value.forEach((card, index) => {
    gsap.fromTo(card,
      {
        scale: 0,
        opacity: 0,
        rotateY: 90,
        rotateZ: -10
      },
      {
        scale: 1,
        opacity: 1,
        rotateY: 0,
        rotateZ: 0,
        duration: 1.5,
        delay: index * 0.3,
        ease: 'elastic.out(1, 0.5)'
      }
    )
  })

  // 内容入场
  contentRefsMap.value.forEach((content, index) => {
    gsap.fromTo(content,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5 + index * 0.3,
        ease: 'power3.out'
      }
    )
  })

  // 图标入场
  iconRefsMap.value.forEach((icon, index) => {
    gsap.fromTo(icon,
      { scale: 0, rotate: 360 },
      {
        scale: 1,
        rotate: 0,
        duration: 1,
        delay: 0.6 + index * 0.3,
        ease: 'back.out(2)'
      }
    )
  })

  // 标题入场
  titleRefsMap.value.forEach((title, index) => {
    gsap.fromTo(title,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.7 + index * 0.3,
        ease: 'power2.out'
      }
    )
  })

  // 统计数据入场
  statRefsMap.value.forEach((stat, key) => {
    gsap.fromTo(stat,
      { scale: 0, y: 20 },
      {
        scale: 1,
        y: 0,
        duration: 0.5,
        delay: 0.8 + Math.random() * 0.3,
        ease: 'back.out(1.5)'
      }
    )
  })
}

// ============================================================
// 滚动动画
// ============================================================
const initScrollAnimations = () => {
  // 1. 卡片旋转和浮动
  cardRefsMap.value.forEach((card, index) => {
    const direction = index % 2 === 0 ? 1 : -1
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const rotateY = Math.sin(p * Math.PI * 2) * 15 * direction
        const rotateX = Math.cos(p * Math.PI) * 10
        const translateY = Math.sin(p * Math.PI) * -80
        const translateZ = Math.sin(p * Math.PI) * 100
        const scale = 1 + Math.sin(p * Math.PI) * 0.1

        gsap.to(card, {
          rotateY: rotateY,
          rotateX: rotateX,
          y: translateY,
          z: translateZ,
          scale: scale,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 2. 黑洞脉冲
  blackHoleRefsMap.value.forEach((hole, index) => {
    gsap.to(hole, {
      scale: 1.1,
      boxShadow: `inset 0 0 60px rgba(0,0,0,1), 0 0 30px var(--card-color), 0 0 60px var(--card-color)`,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
  })

  // 3. 轨道旋转
  orbitRefsMap.value.forEach((orbit, index) => {
    gsap.to(orbit, {
      rotation: 360,
      duration: parseFloat(CARDS_DATA[index].orbitSpeed),
      ease: 'none',
      repeat: -1,
      transformOrigin: 'center center'
    })
  })

  // 4. 行星自转
  planetRefsMap.value.forEach((planet, index) => {
    gsap.to(planet, {
      rotation: 360,
      duration: 4,
      ease: 'none',
      repeat: -1,
      transformOrigin: 'center center'
    })

    // 行星悬浮
    gsap.to(planet, {
      y: -10,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
  })

  // 5. 彗星动画 - 环绕运动
  cometRefsMap.value.forEach((comet, index) => {
    // 使用时间线创建环绕运动
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(comet, {
      x: 60,
      y: -40,
      rotation: 45,
      opacity: 0.8,
      duration: 1.5,
      ease: 'power1.inOut'
    })
    .to(comet, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0.5,
      duration: 1.5,
      ease: 'power1.inOut'
    })
    .to(comet, {
      x: -60,
      y: 40,
      rotation: -45,
      opacity: 0.8,
      duration: 1.5,
      ease: 'power1.inOut'
    })
    .to(comet, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 0.5,
      duration: 1.5,
      ease: 'power1.inOut'
    })
    cleanupFns.push(() => tl.kill())
  })

  // 6. 光芒旋转
  raysRefsMap.value.forEach((rays, index) => {
    gsap.to(rays, {
      rotation: 360,
      duration: 20,
      ease: 'none',
      repeat: -1,
      transformOrigin: 'center center'
    })
  })

  // 7. 图标脉冲
  iconRefsMap.value.forEach((icon, index) => {
    const trigger = ScrollTrigger.create({
      trigger: icon,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1,
      onUpdate: (self) => {
        const scale = 1 + Math.sin(self.progress * Math.PI) * 0.2
        const glow = 10 + self.progress * 30
        gsap.to(icon, {
          scale: scale,
          filter: `drop-shadow(0 0 ${glow}px var(--card-color))`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 8. 标题发光
  titleRefsMap.value.forEach((title) => {
    const trigger = ScrollTrigger.create({
      trigger: title,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1,
      onUpdate: (self) => {
        const glow = 5 + self.progress * 20
        gsap.to(title, {
          textShadow: `0 0 ${glow}px var(--card-color), 0 0 ${glow * 2}px var(--card-color)`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 9. 卡片间距
  const container = document.querySelector('.galaxy-container') as HTMLElement
  if (container) {
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 2,
      onUpdate: (self) => {
        const spread = Math.sin(self.progress * Math.PI) * 80
        gsap.to(container, {
          gap: `${50 + spread}px`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  }
}

// ============================================================
// 生命周期
// ============================================================
onMounted(() => {
  requestAnimationFrame(() => {
    initBackgroundStars()
    initEntryAnimation()
    initScrollAnimations()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(t => t.kill())
  cancelAnimationFrame(animationFrame)
})
</script>

<style scoped lang="scss">
// ============================================================
// 主体
// ============================================================
.galaxy-section {
  width: 100vw;
  height: 100vh;
  padding: 60px 40px;
  background: #050510;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

// ============================================================
// 背景星空
// ============================================================
.galaxy-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bg-stars {
  width: 100%;
  height: 100%;
}

// ============================================================
// 星云层
// ============================================================
.nebula-layer {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(155, 89, 182, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(52, 152, 219, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(233, 30, 99, 0.08) 0%, transparent 60%);
  z-index: 1;
  animation: nebulaPulse 10s ease-in-out infinite;
}

@keyframes nebulaPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

// ============================================================
// 容器
// ============================================================
.galaxy-container {
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

// ============================================================
// 卡片
// ============================================================
.galaxy-card {
  position: relative;
  width: 320px;
  height: 450px;
  background: linear-gradient(135deg, rgba(10, 10, 30, 0.95) 0%, rgba(20, 20, 50, 0.9) 100%);
  border-radius: 25px;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--card-color) 0%, transparent 50%, var(--card-color) 100%);
    opacity: 0.1;
    z-index: 0;
  }
}

// ============================================================
// 黑洞
// ============================================================
.black-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #000 0%, #000 50%, transparent 70%);
  border-radius: 50%;
  box-shadow:
    inset 0 0 40px rgba(0, 0, 0, 1),
    0 0 20px var(--card-color),
    0 0 40px var(--card-color);
  z-index: 5;
}

// ============================================================
// 轨道环
// ============================================================
.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  transform: translate(-50%, -50%) rotateX(75deg);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  z-index: 4;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: linear-gradient(90deg, transparent, var(--card-color), transparent);
    animation: orbitGlow 3s linear infinite;
  }
}

@keyframes orbitGlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// ============================================================
// 行星
// ============================================================
.planet {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--planet-size);
  height: var(--planet-size);
  margin: calc(var(--planet-size) / -2) 0 0 calc(var(--planet-size) / -2);
  background: radial-gradient(circle at 30% 30%, var(--planet-color) 0%, color-mix(in srgb, var(--planet-color) 40%, #000) 100%);
  border-radius: 50%;
  box-shadow:
    inset -10px -10px 20px rgba(0, 0, 0, 0.5),
    0 0 20px var(--planet-color),
    0 0 40px var(--planet-color);
  z-index: 6;
  transform-origin: center center;
}

// ============================================================
// 彗星
// ============================================================
.comet {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 6px;
  margin: -3px 0 0 -30px;
  background: linear-gradient(90deg, transparent 0%, var(--card-color) 50%, #fff 100%);
  border-radius: 3px;
  filter: blur(1px);
  box-shadow: 0 0 15px var(--card-color);
  z-index: 7;
  transform-origin: center center;
}

// ============================================================
// 内容
// ============================================================
.galaxy-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(to top, rgba(5, 5, 20, 0.98) 0%, transparent 100%);
  z-index: 10;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 15px var(--card-color));
}

.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 0;
  text-shadow: 0 0 10px var(--card-color);
}

.card-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.card-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--card-color);
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

// ============================================================
// 光芒
// ============================================================
.light-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(255, 255, 255, 0.03) 10deg,
    transparent 20deg,
    transparent 30deg,
    rgba(255, 255, 255, 0.03) 40deg,
    transparent 50deg,
    transparent 60deg,
    rgba(255, 255, 255, 0.03) 70deg,
    transparent 80deg
  );
  z-index: 3;
  pointer-events: none;
}
</style>
