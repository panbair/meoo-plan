<template>
  <section class="neon-section">
    <!-- 星空背景 -->
    <div class="neon-stars">
      <span
        v-for="i in 50"
        :key="i"
        class="star"
        :ref="(el) => setStarRef(el, i)"
        :style="{
          '--x': `${Math.random() * 100}%`,
          '--y': `${Math.random() * 100}%`,
          '--size': `${1 + Math.random() * 2}px`,
          '--duration': `${2 + Math.random() * 4}s`
        }"
      ></span>
    </div>

    <!-- 扫描线 -->
    <div class="neon-scanlines"></div>

    <div class="neon-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="neon-card"
        :ref="(el) => setCardRef(el, index)"
        :style="{ '--neon-color': card.color, '--neon-glow': card.glow }"
        @mousemove="(e) => handleMouseMove(e, index)"
        @mouseleave="(e) => handleMouseLeave(e, index)"
      >
        <div class="neon-border" :ref="(el) => setBorderRef(el, index)"></div>
        <div class="neon-bg"></div>
        <div class="neon-laser" :ref="(el) => setLaserRef(el, index)"></div>
        <div class="neon-content">
          <div class="neon-icon" :ref="(el) => setIconRef(el, index)">
            {{ card.icon }}
          </div>
          <h3 class="neon-title" :ref="(el) => setTitleRef(el, index)">{{ card.title }}</h3>
          <p class="neon-desc" :ref="(el) => setDescRef(el, index)">{{ card.desc }}</p>
          <div class="neon-tags">
            <span
              v-for="(tag, tagIndex) in card.tags"
              :key="tagIndex"
              class="neon-tag"
              :ref="(el) => setTagRef(el, index, tagIndex)"
            >
              {{ tag }}
            </span>
          </div>
          <div class="neon-button">
            <span>Explore</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="neon-corners">
          <span class="corner top-left"></span>
          <span class="corner top-right"></span>
          <span class="corner bottom-left"></span>
          <span class="corner bottom-right"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardNeon - 霓虹灯效果卡片组件
 * @description 丰富的滚动动画：发光、扫描线、激光、星空效果
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================
interface NeonCard {
  id: string
  icon: string
  title: string
  desc: string
  color: string
  glow: string
  tags: string[]
}

// ============================================================
// 数据
// ============================================================
const CARDS_DATA: NeonCard[] = [
  {
    id: 'neon-1',
    icon: '🎮',
    title: 'Game Dev',
    desc: 'Immersive gaming experiences with cutting-edge graphics and physics',
    color: '#ff00ff',
    glow: '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
    tags: ['Unity', 'Unreal', 'WebGL']
  },
  {
    id: 'neon-2',
    icon: '🎨',
    title: 'Digital Art',
    desc: 'Creating visual masterpieces with code and creativity combined',
    color: '#00ffff',
    glow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
    tags: ['Canvas', 'SVG', 'GSAP']
  },
  {
    id: 'neon-3',
    icon: '🚀',
    title: 'Space Tech',
    desc: 'Pushing boundaries of what is possible in web development',
    color: '#ffff00',
    glow: '0 0 20px #ffff00, 0 0 40px #ffff00, 0 0 60px #ffff00',
    tags: ['Vue', 'TypeScript', 'Vite']
  }
]

// ============================================================
// 响应式数据
// ============================================================
const cards = ref<NeonCard[]>(CARDS_DATA)
const cardRefsMap = ref(new Map<number, HTMLElement>())
const starRefsMap = ref(new Map<number, HTMLElement>())
const borderRefsMap = ref(new Map<number, HTMLElement>())
const laserRefsMap = ref(new Map<number, HTMLElement>())
const iconRefsMap = ref(new Map<number, HTMLElement>())
const titleRefsMap = ref(new Map<number, HTMLElement>())
const descRefsMap = ref(new Map<number, HTMLElement>())
const tagRefsMap = ref(new Map<string, HTMLElement>())
const cleanupFns: (() => void)[] = []

// ============================================================
// 模板引用
// ============================================================
const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    cardRefsMap.value.set(index, element as HTMLElement)
  } else {
    cardRefsMap.value.delete(index)
  }
}

const setStarRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    starRefsMap.value.set(index, el)
  } else {
    starRefsMap.value.delete(index)
  }
}

const setBorderRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    borderRefsMap.value.set(index, el)
  } else {
    borderRefsMap.value.delete(index)
  }
}

const setLaserRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    laserRefsMap.value.set(index, el)
  } else {
    laserRefsMap.value.delete(index)
  }
}

const setIconRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    iconRefsMap.value.set(index, element as HTMLElement)
  } else {
    iconRefsMap.value.delete(index)
  }
}

const setTitleRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    titleRefsMap.value.set(index, element as HTMLElement)
  } else {
    titleRefsMap.value.delete(index)
  }
}

const setDescRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    descRefsMap.value.set(index, element as HTMLElement)
  } else {
    descRefsMap.value.delete(index)
  }
}

const setTagRef = (el: Element | ComponentPublicInstance | null, index: number, tagIndex: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  const key = `${index}-${tagIndex}`
  if (element) {
    tagRefsMap.value.set(key, element as HTMLElement)
  } else {
    tagRefsMap.value.delete(key)
  }
}

// ============================================================
// 鼠标交互
// ============================================================
const handleMouseMove = (e: MouseEvent, index: number) => {
  const card = cardRefsMap.value.get(index)
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100

  gsap.to(card, {
    '--mouse-x': `${x}%`,
    '--mouse-y': `${y}%`,
    duration: 0.2
  })
}

const handleMouseLeave = (e: MouseEvent, index: number) => {
  const card = cardRefsMap.value.get(index)
  if (!card) return

  gsap.to(card, {
    '--mouse-x': '50%',
    '--mouse-y': '50%',
    duration: 0.5,
    ease: 'power2.out'
  })
}

// ============================================================
// 动画初始化
// ============================================================
const initEntryAnimation = () => {
  // 星空入场
  starRefsMap.value.forEach((star) => {
    gsap.fromTo(star,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      }
    )
  })

  // 卡片入场
  cardRefsMap.value.forEach((card, index) => {
    gsap.fromTo(card,
      {
        y: 100,
        opacity: 0,
        scale: 0.5,
        rotateX: 30,
        rotateY: -30
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 1.2,
        delay: index * 0.2,
        ease: 'back.out(1.4)'
      }
    )
  })

  // 图标入场
  iconRefsMap.value.forEach((icon, index) => {
    gsap.fromTo(icon,
      { scale: 0, rotate: -180, filter: 'blur(10px)' },
      {
        scale: 1,
        rotate: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        delay: 0.4 + index * 0.2,
        ease: 'elastic.out(1, 0.5)'
      }
    )
  })

  // 标题入场
  titleRefsMap.value.forEach((title, index) => {
    gsap.fromTo(title,
      { y: 40, opacity: 0, letterSpacing: '0.5em' },
      {
        y: 0,
        opacity: 1,
        letterSpacing: 'normal',
        duration: 0.8,
        delay: 0.5 + index * 0.2,
        ease: 'power3.out'
      }
    )
  })

  // 描述入场
  descRefsMap.value.forEach((desc, index) => {
    gsap.fromTo(desc,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: 0.6 + index * 0.2,
        ease: 'power2.out'
      }
    )
  })

  // 标签入场
  tagRefsMap.value.forEach((tag, index) => {
    gsap.fromTo(tag,
      { scale: 0, opacity: 0, y: 10 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: 0.7 + index * 0.05,
        ease: 'back.out(2)'
      }
    )
  })
}

// ==================== 丰富的滚动动画 ====================
const initScrollAnimations = () => {
  // 1. 卡片旋转 + 缩放
  cardRefsMap.value.forEach((card, index) => {
    const direction = index % 2 === 0 ? 1 : -1
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const rotateX = Math.sin(p * Math.PI) * 10
        const rotateY = Math.sin(p * Math.PI * 2) * 8 * direction
        const translateY = Math.sin(p * Math.PI) * -60
        const scale = 1 + Math.sin(p * Math.PI) * 0.08

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          y: translateY,
          scale: scale,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 2. 霓虹边框发光
  borderRefsMap.value.forEach((border, index) => {
    const trigger = ScrollTrigger.create({
      trigger: border,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onUpdate: (self) => {
        const intensity = 0.3 + self.progress * 0.7
        gsap.to(border, {
          opacity: intensity,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 3. 激光扫描效果
  laserRefsMap.value.forEach((laser, index) => {
    const trigger = ScrollTrigger.create({
      trigger: laser,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onUpdate: (self) => {
        const y = self.progress * 100
        const opacity = 0.3 + self.progress * 0.4
        gsap.to(laser, {
          top: `${y}%`,
          opacity: opacity,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 4. 星空闪烁
  starRefsMap.value.forEach((star) => {
    gsap.to(star, {
      opacity: 'random(0.2, 1)',
      scale: 'random(0.5, 1.5)',
      duration: 'random(1, 3)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
  })

  // 5. 图标脉冲
  iconRefsMap.value.forEach((icon, index) => {
    const trigger = ScrollTrigger.create({
      trigger: icon,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onUpdate: (self) => {
        const scale = 1 + Math.sin(self.progress * Math.PI) * 0.3
        const rotate = self.progress * 20
        const blur = (1 - self.progress) * 5
        gsap.to(icon, {
          scale: scale,
          rotate: rotate,
          filter: `drop-shadow(0 0 ${10 + self.progress * 20}px var(--neon-color)) blur(${blur}px)`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 6. 标题发光效果
  titleRefsMap.value.forEach((title, index) => {
    const trigger = ScrollTrigger.create({
      trigger: title,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1,
      onUpdate: (self) => {
        const glow = 5 + self.progress * 25
        gsap.to(title, {
          textShadow: `0 0 ${glow}px var(--neon-color), 0 0 ${glow * 2}px var(--neon-color), 0 0 ${glow * 3}px var(--neon-color)`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 7. 卡片间距变化
  const container = document.querySelector('.neon-container') as HTMLElement
  if (container) {
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 2,
      onUpdate: (self) => {
        const spread = Math.sin(self.progress * Math.PI) * 50
        gsap.to(container, {
          gap: `${40 + spread}px`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  }

  // 8. 角落装饰动画
  cardRefsMap.value.forEach((card) => {
    const corners = card.querySelectorAll('.corner')
    corners.forEach((corner, i) => {
      gsap.to(corner, {
        borderColor: 'var(--neon-color)',
        boxShadow: `0 0 10px var(--neon-color)`,
        duration: 1 + i * 0.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
    })
  })
}

// ============================================================
// 生命周期
// ============================================================
onMounted(() => {
  requestAnimationFrame(() => {
    initEntryAnimation()
    initScrollAnimations()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped lang="scss">
// ============================================================
// 主体
// ============================================================
.neon-section {
  width: 100vw;
  height: 100vh;
  padding: 80px 40px;
  background: #0a0a0f;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

// ============================================================
// 星空背景
// ============================================================
.neon-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  background: #fff;
  border-radius: 50%;
  animation: starTwinkle var(--duration) ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: inherit;
    border-radius: 50%;
    filter: blur(2px);
    opacity: 0.5;
  }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
}

// ============================================================
// 扫描线
// ============================================================
.neon-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.03) 2px,
    rgba(255, 255, 255, 0.03) 4px
  );
  pointer-events: none;
  z-index: 1;
  animation: scanMove 8s linear infinite;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--neon-color), transparent);
    animation: scanLine 3s ease-in-out infinite;
  }
}

@keyframes scanMove {
  from { background-position: 0 0; }
  to { background-position: 0 100px; }
}

@keyframes scanLine {
  0%, 100% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.neon-container {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

// ============================================================
// 卡片
// ============================================================
.neon-card {
  position: relative;
  width: 300px;
  height: 400px;
  background: rgba(10, 10, 15, 0.9);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;

  --mouse-x: 50%;
  --mouse-y: 50%;
}

// ============================================================
// 霓虹边框
// ============================================================
.neon-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(
    135deg,
    var(--neon-color) 0%,
    transparent 30%,
    transparent 70%,
    var(--neon-color) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.6;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, var(--neon-color), transparent, var(--neon-color));
    filter: blur(15px);
    opacity: 0.5;
    animation: borderGlow 2s ease-in-out infinite;
  }
}

@keyframes borderGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

// ============================================================
// 背景光效
// ============================================================
.neon-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mouse-x) var(--mouse-y),
    rgba(255, 255, 255, 0.08) 0%,
    transparent 50%
  );
  z-index: 1;
}

// ============================================================
// 激光扫描
// ============================================================
.neon-laser {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-color), transparent);
  opacity: 0.5;
  z-index: 3;
  pointer-events: none;
  box-shadow: 0 0 20px var(--neon-color), 0 0 40px var(--neon-color);
}

// ============================================================
// 内容
// ============================================================
.neon-content {
  position: relative;
  z-index: 4;
  height: 100%;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.neon-icon {
  font-size: 4rem;
  margin-bottom: 25px;
  filter: drop-shadow(0 0 15px var(--neon-color));
}

.neon-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 15px 0;
  text-shadow: 0 0 10px var(--neon-color);
}

.neon-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 25px 0;
  line-height: 1.6;
}

.neon-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 30px;
}

.neon-tag {
  padding: 6px 14px;
  font-size: 0.75rem;
  color: var(--neon-color);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--neon-color);
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.neon-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  color: #fff;
  background: transparent;
  border: 1px solid var(--neon-color);
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--neon-color);
    box-shadow: var(--neon-glow);

    svg { transform: translateX(5px); }
  }

  svg { transition: transform 0.3s ease; }
}

// ============================================================
// 四角装饰
// ============================================================
.neon-corners {
  position: absolute;
  inset: 10px;
  pointer-events: none;
  z-index: 5;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--neon-color);
  border-style: solid;
  transition: all 0.3s;

  &.top-left {
    top: 0; left: 0;
    border-width: 3px 0 0 3px;
    border-radius: 5px 0 0 0;
  }
  &.top-right {
    top: 0; right: 0;
    border-width: 3px 3px 0 0;
    border-radius: 0 5px 0 0;
  }
  &.bottom-left {
    bottom: 0; left: 0;
    border-width: 0 0 3px 3px;
    border-radius: 0 0 0 5px;
  }
  &.bottom-right {
    bottom: 0; right: 0;
    border-width: 0 3px 3px 0;
    border-radius: 0 0 5px 0;
  }
}
</style>
