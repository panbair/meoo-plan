<template>
  <section class="firefly-section">
    <!-- 萤火虫粒子背景 -->
    <div class="firefly-container" ref="fireflyContainer">
      <div
        v-for="i in 80"
        :key="i"
        class="firefly"
        :ref="(el) => setFireflyRef(el, i)"
        :style="{
          '--delay': `${Math.random() * 5}s`,
          '--duration': `${3 + Math.random() * 4}s`,
          '--x-start': `${Math.random() * 100}%`,
          '--y-start': `${Math.random() * 100}%`,
          '--x-end': `${Math.random() * 100}%`,
          '--y-end': `${Math.random() * 100}%`,
          '--glow-color': glowColors[i % glowColors.length]
        }"
      ></div>
    </div>

    <!-- 萤火虫轨迹 -->
    <div class="trail-layer" ref="trailLayer"></div>

    <!-- 卡片容器 -->
    <div class="nature-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="nature-card"
        :ref="(el) => setCardRef(el, index)"
        :style="{ '--nature-color': card.color }"
      >
        <!-- 光晕效果 -->
        <div class="aura-glow" :ref="(el) => setAuraRef(el, index)"></div>

        <!-- 浮动光点 -->
        <div class="floating-orbs">
          <div
            v-for="i in 5"
            :key="i"
            class="orb"
            :ref="(el) => setOrbRef(el, index, i)"
            :style="{ '--orb-delay': `${i * 0.3}s`, '--orb-color': card.color }"
          ></div>
        </div>

        <!-- 卡片图标 -->
        <div class="card-visual" :ref="(el) => setVisualRef(el, index)">
          <div class="visual-ring" :ref="(el) => setRingRef(el, index)"></div>
          <div class="visual-icon" :ref="(el) => setIconRef(el, index)">
            {{ card.icon }}
          </div>
          <div class="visual-particles">
            <span
              v-for="i in 8"
              :key="i"
              class="particle"
              :ref="(el) => setParticleRef(el, index, i)"
            ></span>
          </div>
        </div>

        <!-- 内容 -->
        <div class="nature-content" :ref="(el) => setContentRef(el, index)">
          <h3 class="nature-title" :ref="(el) => setTitleRef(el, index)">{{ card.title }}</h3>
          <p class="nature-desc" :ref="(el) => setDescRef(el, index)">{{ card.desc }}</p>
          <div class="nature-features" :ref="(el) => setFeaturesRef(el, index)">
            <span v-for="(feature, fIndex) in card.features" :key="fIndex" class="feature-tag">
              {{ feature }}
            </span>
          </div>
        </div>

        <!-- 发光边框 -->
        <div class="glow-border" :ref="(el) => setBorderRef(el, index)"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardFireflies - 萤火虫效果卡片组件
 * @description 萤火虫、浮动光点、发光效果等自然氛围的动画
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================
interface NatureCard {
  id: string
  icon: string
  title: string
  desc: string
  color: string
  features: string[]
}

// ============================================================
// 数据
// ============================================================
const CARDS_DATA: NatureCard[] = [
  {
    id: 'nature-1',
    icon: '🌿',
    title: 'Forest Glade',
    desc: 'A peaceful sanctuary where fireflies dance among ancient trees',
    color: '#4ade80',
    features: ['Organic', 'Natural', 'Serene']
  },
  {
    id: 'nature-2',
    icon: '🌸',
    title: 'Sakura Night',
    desc: 'Cherry blossoms illuminated by magical glowing creatures',
    color: '#f472b6',
    features: ['Delicate', 'Ethereal', 'Romantic']
  },
  {
    id: 'nature-3',
    icon: '🦋',
    title: 'Meadow Magic',
    desc: 'A wonderland where butterflies leave trails of light',
    color: '#a78bfa',
    features: ['Whimsical', 'Enchanting', 'Free']
  }
]

const glowColors = ['#4ade80', '#f472b6', '#a78bfa', '#fbbf24', '#38bdf8']

// ============================================================
// 响应式数据
// ============================================================
const cards = ref<NatureCard[]>(CARDS_DATA)
const cardRefsMap = ref(new Map<number, HTMLElement>())
const fireflyRefsMap = ref(new Map<number, HTMLElement>())
const auraRefsMap = ref(new Map<number, HTMLElement>())
const orbRefsMap = ref(new Map<string, HTMLElement>())
const visualRefsMap = ref(new Map<number, HTMLElement>())
const ringRefsMap = ref(new Map<number, HTMLElement>())
const iconRefsMap = ref(new Map<number, HTMLElement>())
const particleRefsMap = ref(new Map<string, HTMLElement>())
const contentRefsMap = ref(new Map<number, HTMLElement>())
const titleRefsMap = ref(new Map<number, HTMLElement>())
const descRefsMap = ref(new Map<number, HTMLElement>())
const featuresRefsMap = ref(new Map<number, HTMLElement>())
const borderRefsMap = ref(new Map<number, HTMLElement>())
const fireflyContainer = ref<HTMLElement | null>(null)
const cleanupFns: (() => void)[] = []

// ============================================================
// 模板引用
// ============================================================
const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) cardRefsMap.value.set(index, element as HTMLElement)
  else cardRefsMap.value.delete(index)
}

const setFireflyRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) fireflyRefsMap.value.set(index, el)
  else fireflyRefsMap.value.delete(index)
}

const setAuraRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) auraRefsMap.value.set(index, el)
  else auraRefsMap.value.delete(index)
}

const setOrbRef = (el: Element | null, index: number, orbIndex: number) => {
  if (el instanceof HTMLElement) orbRefsMap.value.set(`${index}-${orbIndex}`, el)
  else orbRefsMap.value.delete(`${index}-${orbIndex}`)
}

const setVisualRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) visualRefsMap.value.set(index, element as HTMLElement)
  else visualRefsMap.value.delete(index)
}

const setRingRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) ringRefsMap.value.set(index, element as HTMLElement)
  else ringRefsMap.value.delete(index)
}

const setIconRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) iconRefsMap.value.set(index, element as HTMLElement)
  else iconRefsMap.value.delete(index)
}

const setParticleRef = (el: Element | null, index: number, pIndex: number) => {
  if (el instanceof HTMLElement) particleRefsMap.value.set(`${index}-${pIndex}`, el)
  else particleRefsMap.value.delete(`${index}-${pIndex}`)
}

const setContentRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) contentRefsMap.value.set(index, element as HTMLElement)
  else contentRefsMap.value.delete(index)
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

const setFeaturesRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) featuresRefsMap.value.set(index, element as HTMLElement)
  else featuresRefsMap.value.delete(index)
}

const setBorderRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) borderRefsMap.value.set(index, el)
  else borderRefsMap.value.delete(index)
}

// ============================================================
// 萤火虫动画
// ============================================================
const initFireflies = () => {
  fireflyRefsMap.value.forEach((firefly) => {
    // 随机移动动画 - 添加清理
    const moveTween = gsap.to(firefly, {
      x: `var(--x-end)`,
      y: `var(--y-end)`,
      duration: parseFloat(firefly.style.getPropertyValue('--duration')),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: parseFloat(firefly.style.getPropertyValue('--delay'))
    })
    cleanupFns.push(() => moveTween.kill())

    // 发光闪烁 - 添加清理
    const glowTween = gsap.to(firefly, {
      opacity: 0.2,
      scale: 0.5,
      boxShadow: '0 0 3px var(--glow-color)',
      duration: 0.5 + Math.random() * 1,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 2
    })
    cleanupFns.push(() => glowTween.kill())
  })
}

// ============================================================
// 入场动画
// ============================================================
const initEntryAnimation = () => {
  // 卡片入场
  cardRefsMap.value.forEach((card, index) => {
    gsap.fromTo(card,
      {
        y: 80,
        opacity: 0,
        scale: 0.6,
        rotateY: -20,
        filter: 'blur(10px)'
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        filter: 'blur(0px)',
        duration: 1.4,
        delay: index * 0.25,
        ease: 'back.out(1.2)'
      }
    )
  })

  // 光晕入场
  auraRefsMap.value.forEach((aura, index) => {
    gsap.fromTo(aura,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        delay: 0.3 + index * 0.25,
        ease: 'power2.out'
      }
    )
  })

  // 图标入场
  iconRefsMap.value.forEach((icon, index) => {
    gsap.fromTo(icon,
      { scale: 0, rotate: -180, filter: 'blur(8px)' },
      {
        scale: 1,
        rotate: 0,
        filter: 'blur(0px)',
        duration: 1,
        delay: 0.5 + index * 0.25,
        ease: 'elastic.out(1, 0.4)'
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
        delay: 0.6 + index * 0.25,
        ease: 'power3.out'
      }
    )
  })

  // 标题入场
  titleRefsMap.value.forEach((title, index) => {
    gsap.fromTo(title,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.7 + index * 0.25,
        ease: 'power2.out'
      }
    )
  })

  // 特性标签入场
  featuresRefsMap.value.forEach((container) => {
    const tags = container.querySelectorAll('.feature-tag')
    tags.forEach((tag, i) => {
      gsap.fromTo(tag,
        { scale: 0, opacity: 0, y: 15 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.8 + i * 0.1,
          ease: 'back.out(1.5)'
        }
      )
    })
  })
}

// ============================================================
// 滚动动画
// ============================================================
const initScrollAnimations = () => {
  // 1. 卡片浮动和旋转
  cardRefsMap.value.forEach((card, index) => {
    const direction = index % 2 === 0 ? 1 : -1
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const translateY = Math.sin(p * Math.PI * 2) * 50 * direction
        const translateX = Math.sin(p * Math.PI) * 30 * direction
        const rotateY = Math.sin(p * Math.PI) * 12 * direction
        const scale = 1 + Math.sin(p * Math.PI) * 0.08

        gsap.to(card, {
          y: translateY,
          x: translateX,
          rotateY: rotateY,
          scale: scale,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 2. 光晕脉冲 - 添加清理
  auraRefsMap.value.forEach((aura, index) => {
    const color = CARDS_DATA[index].color
    const auraTween = gsap.to(aura, {
      scale: 1.3,
      opacity: 0.6,
      boxShadow: `0 0 60px ${color}, 0 0 100px ${color}`,
      duration: 2.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    cleanupFns.push(() => auraTween.kill())
  })

  // 3. 浮动光点动画 - 添加清理
  orbRefsMap.value.forEach((orb, key) => {
    const color = orb.style.getPropertyValue('--orb-color')
    const delay = parseFloat(orb.style.getPropertyValue('--orb-delay'))

    const orbMoveTween = gsap.to(orb, {
      y: -40,
      x: 'random(-30, 30)',
      opacity: 0.8,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: delay
    })
    cleanupFns.push(() => orbMoveTween.kill())

    const orbGlowTween = gsap.to(orb, {
      boxShadow: `0 0 15px ${color}, 0 0 30px ${color}`,
      duration: 1.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    cleanupFns.push(() => orbGlowTween.kill())
  })

  // 4. 环形旋转 - 添加清理
  ringRefsMap.value.forEach((ring, index) => {
    const color = CARDS_DATA[index].color
    const ringRotateTween = gsap.to(ring, {
      rotation: 360,
      duration: 8,
      ease: 'none',
      repeat: -1,
      transformOrigin: 'center center'
    })
    cleanupFns.push(() => ringRotateTween.kill())

    const ringColorTween = gsap.to(ring, {
      borderColor: color,
      opacity: 0.6,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    cleanupFns.push(() => ringColorTween.kill())
  })

  // 5. 图标脉冲
  iconRefsMap.value.forEach((icon, index) => {
    const color = CARDS_DATA[index].color
    const trigger = ScrollTrigger.create({
      trigger: icon,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1,
      onUpdate: (self) => {
        const scale = 1 + Math.sin(self.progress * Math.PI) * 0.15
        const glow = 10 + self.progress * 25
        gsap.to(icon, {
          scale: scale,
          filter: `drop-shadow(0 0 ${glow}px ${color})`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 6. 粒子动画 - 添加清理
  particleRefsMap.value.forEach((particle, key) => {
    const [index] = key.split('-').map(Number)
    const pIndex = parseInt(key.split('-')[1])
    const color = CARDS_DATA[index].color
    const angle = (pIndex - 1) * 45

    const particleMoveTween = gsap.to(particle, {
      x: Math.cos(angle * Math.PI / 180) * 60,
      y: Math.sin(angle * Math.PI / 180) * 60,
      opacity: 0,
      scale: 0,
      duration: 2,
      ease: 'power1.out',
      repeat: -1,
      delay: pIndex * 0.2
    })
    cleanupFns.push(() => particleMoveTween.kill())

    const particleColorTween = gsap.to(particle, {
      backgroundColor: color,
      boxShadow: `0 0 6px ${color}`,
      duration: 1,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    cleanupFns.push(() => particleColorTween.kill())
  })

  // 7. 发光边框动画 - 添加清理
  borderRefsMap.value.forEach((border, index) => {
    const color = CARDS_DATA[index].color
    const borderTween = gsap.to(border, {
      opacity: 0.8,
      boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}`,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    cleanupFns.push(() => borderTween.kill())
  })

  // 8. 卡片间距
  const container = document.querySelector('.nature-container') as HTMLElement
  if (container) {
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 2,
      onUpdate: (self) => {
        const spread = Math.sin(self.progress * Math.PI) * 70
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
    initFireflies()
    initEntryAnimation()
    initScrollAnimations()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
// ============================================================
// 主体
// ============================================================
.firefly-section {
  width: 100vw;
  height: 100vh;
  padding: 60px 40px;
  background: linear-gradient(135deg, #0a1628 0%, #0d1f12 50%, #1a0a28 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

// ============================================================
// 萤火虫容器
// ============================================================
.firefly-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.firefly {
  position: absolute;
  left: var(--x-start);
  top: var(--y-start);
  width: 4px;
  height: 4px;
  background: var(--glow-color);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--glow-color), 0 0 20px var(--glow-color);
}

// ============================================================
// 轨迹层
// ============================================================
.trail-layer {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(74, 222, 128, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(168, 139, 250, 0.08) 0%, transparent 50%);
  z-index: 1;
}

// ============================================================
// 容器
// ============================================================
.nature-container {
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
.nature-card {
  position: relative;
  width: 300px;
  height: 420px;
  background: linear-gradient(180deg, rgba(15, 25, 20, 0.95) 0%, rgba(10, 20, 15, 0.98) 100%);
  border-radius: 25px;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

// ============================================================
// 光晕效果
// ============================================================
.aura-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, var(--nature-color) 0%, transparent 70%);
  opacity: 0.3;
  z-index: 1;
  filter: blur(40px);
}

// ============================================================
// 浮动光点
// ============================================================
.floating-orbs {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.orb {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--orb-color);
  border-radius: 50%;
  opacity: 0.6;
  box-shadow: 0 0 10px var(--orb-color);
  left: 50%;
  top: 50%;

  &:nth-child(1) { transform: translate(-50%, -50%) translateX(-60px); }
  &:nth-child(2) { transform: translate(-50%, -50%) translateX(60px); }
  &:nth-child(3) { transform: translate(-50%, -50%) translateY(-60px); }
  &:nth-child(4) { transform: translate(-50%, -50%) translateY(60px); }
  &:nth-child(5) { transform: translate(-50%, -50%); }
}

// ============================================================
// 卡片视觉区域
// ============================================================
.card-visual {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.visual-ring {
  position: absolute;
  width: 140px;
  height: 140px;
  border: 2px solid var(--nature-color);
  border-radius: 50%;
  opacity: 0.5;
}

.visual-icon {
  font-size: 4rem;
  filter: drop-shadow(0 0 15px var(--nature-color));
  z-index: 2;
}

.visual-particles {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  opacity: 0;
}

// ============================================================
// 内容
// ============================================================
.nature-content {
  position: relative;
  padding: 25px;
  z-index: 4;
}

.nature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 0;
  text-shadow: 0 0 15px var(--nature-color);
}

.nature-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.nature-features {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 5px 12px;
  font-size: 0.7rem;
  color: var(--nature-color);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--nature-color);
  border-radius: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

// ============================================================
// 发光边框
// ============================================================
.glow-border {
  position: absolute;
  inset: 0;
  border-radius: 25px;
  border: 2px solid transparent;
  opacity: 0.4;
  z-index: 5;
  pointer-events: none;
}
</style>
