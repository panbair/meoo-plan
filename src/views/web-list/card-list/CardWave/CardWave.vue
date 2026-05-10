<template>
  <section class="wave-section">
    <!-- 动态波浪背景 -->
    <div class="wave-bg">
      <svg class="wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.6" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f093fb;stop-opacity:0.5" />
            <stop offset="100%" style="stop-color:#f5576c;stop-opacity:0.7" />
          </linearGradient>
        </defs>
        <path
          v-for="(wave, index) in waves"
          :key="index"
          class="wave-path"
          :ref="(el) => setWaveRef(el, index)"
          :d="wave.path"
          :fill="`url(#waveGrad${index + 1})`"
          :style="{ '--delay': `${index * 0.5}s` }"
        />
      </svg>
    </div>

    <!-- 散点装饰 -->
    <div class="wave-dots">
      <span
        v-for="i in 20"
        :key="i"
        class="dot"
        :ref="(el) => setDotRef(el, i)"
        :style="{
          '--x': `${10 + Math.random() * 80}%`,
          '--y': `${10 + Math.random() * 80}%`,
          '--size': `${2 + Math.random() * 4}px`,
          '--duration': `${3 + Math.random() * 5}s`
        }"
      ></span>
    </div>

    <div class="wave-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="wave-card"
        :ref="(el) => setCardRef(el, index)"
        :style="{ '--card-color': card.color }"
      >
        <div class="card-wave-effect" :ref="(el) => setEffectRef(el, index)"></div>
        <div class="card-liquid" :ref="(el) => setLiquidRef(el, index)"></div>
        <div class="card-content">
          <div class="card-icon" :ref="(el) => setIconRef(el, index)">{{ card.icon }}</div>
          <h3 class="card-title" :ref="(el) => setTitleRef(el, index)">{{ card.title }}</h3>
          <p class="card-desc" :ref="(el) => setDescRef(el, index)">{{ card.desc }}</p>
          <div class="card-meter">
            <div
              class="meter-fill"
              :ref="(el) => setMeterRef(el, index)"
              :style="{ '--fill-percent': `${card.progress}%` }"
            >
              <span class="meter-shine"></span>
            </div>
          </div>
          <span class="card-progress" :ref="(el) => setProgressRef(el, index)">{{ card.progress }}%</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardWave - 波动效果卡片组件
 * @description 丰富的滚动动画：波浪、旋转、散开、液滴效果
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================
interface WaveConfig {
  path: string
  fill: string
}

interface WaveCard {
  id: string
  icon: string
  title: string
  desc: string
  color: string
  progress: number
}

// ============================================================
// 波浪数据
// ============================================================
const waves: WaveConfig[] = [
  {
    path: 'M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,208C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
    fill: 'rgba(102, 126, 234, 0.3)'
  },
  {
    path: 'M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,245.3C672,288,768,352,864,352C960,352,1056,288,1152,266.7C1248,245,1344,267,1392,277.3L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
    fill: 'rgba(118, 75, 162, 0.4)'
  },
  {
    path: 'M0,288L48,266.7C96,245,192,203,288,197.3C384,192,480,224,576,245.3C672,267,768,277,864,266.7C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
    fill: 'rgba(240, 147, 251, 0.2)'
  }
]

// ============================================================
// 卡片数据
// ============================================================
const CARDS_DATA: WaveCard[] = [
  {
    id: 'wave-1',
    icon: '🌊',
    title: 'Ocean Flow',
    desc: 'Smooth water-like animations that captivate',
    color: '#667eea',
    progress: 85
  },
  {
    id: 'wave-2',
    icon: '⚡',
    title: 'Power Surge',
    desc: 'High energy performance on demand',
    color: '#f5576c',
    progress: 92
  },
  {
    id: 'wave-3',
    icon: '🎨',
    title: 'Color Splash',
    desc: 'Vibrant visual experience every time',
    color: '#4facfe',
    progress: 78
  },
  {
    id: 'wave-4',
    icon: '🚀',
    title: 'Blast Off',
    desc: 'Lightning fast delivery guaranteed',
    color: '#43e97b',
    progress: 95
  }
]

// ============================================================
// 响应式数据
// ============================================================
const cards = ref<WaveCard[]>(CARDS_DATA)
const cardRefsMap = ref(new Map<number, HTMLElement>())
const waveRefsMap = ref(new Map<number, SVGPathElement>())
const dotRefsMap = ref(new Map<number, HTMLElement>())
const iconRefsMap = ref(new Map<number, HTMLElement>())
const titleRefsMap = ref(new Map<number, HTMLElement>())
const descRefsMap = ref(new Map<number, HTMLElement>())
const meterRefsMap = ref(new Map<number, HTMLElement>())
const progressRefsMap = ref(new Map<number, HTMLElement>())
const effectRefsMap = ref(new Map<number, HTMLElement>())
const liquidRefsMap = ref(new Map<number, HTMLElement>())
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

const setWaveRef = (el: Element | null, index: number) => {
  if (el instanceof SVGPathElement) {
    waveRefsMap.value.set(index, el)
  } else {
    waveRefsMap.value.delete(index)
  }
}

const setDotRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    dotRefsMap.value.set(index, el)
  } else {
    dotRefsMap.value.delete(index)
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

const setMeterRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    meterRefsMap.value.set(index, element as HTMLElement)
  } else {
    meterRefsMap.value.delete(index)
  }
}

const setProgressRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    progressRefsMap.value.set(index, element as HTMLElement)
  } else {
    progressRefsMap.value.delete(index)
  }
}

const setEffectRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    effectRefsMap.value.set(index, el)
  } else {
    effectRefsMap.value.delete(index)
  }
}

const setLiquidRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    liquidRefsMap.value.set(index, el)
  } else {
    liquidRefsMap.value.delete(index)
  }
}

// ============================================================
// 动画初始化
// ============================================================
const initEntryAnimation = () => {
  // 卡片入场
  cardRefsMap.value.forEach((card, index) => {
    gsap.fromTo(card,
      {
        y: 100,
        opacity: 0,
        scale: 0.7,
        rotateY: -30,
        rotateZ: -5
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        rotateZ: 0,
        duration: 1,
        delay: index * 0.15,
        ease: 'back.out(1.4)'
      }
    )
  })

  // 图标入场弹跳
  iconRefsMap.value.forEach((icon, index) => {
    gsap.fromTo(icon,
      { scale: 0, rotate: -180 },
      {
        scale: 1,
        rotate: 0,
        duration: 0.8,
        delay: 0.3 + index * 0.1,
        ease: 'elastic.out(1, 0.5)'
      }
    )
  })

  // 标题入场
  titleRefsMap.value.forEach((title, index) => {
    gsap.fromTo(title,
      { y: 30, opacity: 0, skewX: -8 },
      {
        y: 0,
        opacity: 1,
        skewX: 0,
        duration: 0.6,
        delay: 0.4 + index * 0.1,
        ease: 'power3.out'
      }
    )
  })

  // 进度条动画
  meterRefsMap.value.forEach((meter, index) => {
    const targetWidth = meter.style.getPropertyValue('--fill-percent')
    gsap.fromTo(meter,
      { width: '0%' },
      {
        width: targetWidth,
        duration: 1.5,
        delay: 0.6 + index * 0.1,
        ease: 'power2.out'
      }
    )
  })

  // 数字跳动
  progressRefsMap.value.forEach((progress, index) => {
    gsap.fromTo(progress,
      { scale: 0 },
      {
        scale: 1,
        duration: 0.5,
        delay: 0.8 + index * 0.1,
        ease: 'back.out(2)'
      }
    )
  })
}

// ==================== 丰富的滚动动画 ====================
const initScrollAnimations = () => {
  // 1. 卡片旋转 + 浮动
  cardRefsMap.value.forEach((card, index) => {
    const direction = index % 2 === 0 ? 1 : -1
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress
        const rotate = Math.sin(p * Math.PI * 2) * 6 * direction
        const translateY = Math.sin(p * Math.PI) * -50
        const scale = 1 + Math.sin(p * Math.PI * 2) * 0.03

        gsap.to(card, {
          rotateZ: rotate,
          y: translateY,
          scale: scale,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 2. 波浪幅度变化
  waveRefsMap.value.forEach((wave, index) => {
    const trigger = ScrollTrigger.create({
      trigger: wave,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        const amplitude = 20 + self.progress * 30
        gsap.to(wave, {
          attr: { d: generateWavePath(index, self.progress) },
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 3. 卡片散开效果
  const container = document.querySelector('.wave-container') as HTMLElement
  if (container) {
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 2,
      onUpdate: (self) => {
        const spread = self.progress * 40
        gsap.to(container, {
          gap: `${30 + spread}px`,
          paddingLeft: `${spread}px`,
          paddingRight: `${spread}px`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  }

  // 4. 背景波浪动画
  waveRefsMap.value.forEach((wave, index) => {
    const duration = 4 + index * 2
    const direction = index % 2 === 0 ? 1 : -1
    const waveTween = gsap.to(wave, {
      attr: { d: generateWavePath(index, 0.5) },
      duration: duration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    cleanupFns.push(() => waveTween.kill())
  })

  // 5. 散点漂浮 - 添加清理
  dotRefsMap.value.forEach((dot) => {
    const dotTween = gsap.to(dot, {
      y: 'random(-30, 30)',
      x: 'random(-20, 20)',
      scale: 'random(0.5, 1.5)',
      opacity: 'random(0.3, 1)',
      duration: 'random(2, 4)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    cleanupFns.push(() => dotTween.kill())
  })

  // 6. 图标脉冲
  iconRefsMap.value.forEach((icon, index) => {
    const trigger = ScrollTrigger.create({
      trigger: icon,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onUpdate: (self) => {
        const scale = 1 + Math.sin(self.progress * Math.PI) * 0.2
        const rotate = self.progress * 15
        gsap.to(icon, {
          scale: scale,
          rotate: rotate,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 7. 液滴效果 - 添加清理
  liquidRefsMap.value.forEach((liquid, index) => {
    const liquidTween = gsap.to(liquid, {
      y: -10,
      borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
      duration: 2 + index * 0.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    cleanupFns.push(() => liquidTween.kill())
  })

  // 8. 进度条闪光 - 添加清理
  meterRefsMap.value.forEach((meter) => {
    const shine = meter.querySelector('.meter-shine') as HTMLElement
    if (shine) {
      const shineTween = gsap.to(shine, {
        x: '200%',
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        delay: 1
      })
      cleanupFns.push(() => shineTween.kill())
    }
  })

  // 9. 波动效果增强
  effectRefsMap.value.forEach((effect, index) => {
    const trigger = ScrollTrigger.create({
      trigger: effect,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
      onUpdate: (self) => {
        gsap.to(effect, {
          opacity: 0.1 + self.progress * 0.3,
          scale: 1 + self.progress * 0.5,
          rotate: self.progress * 360,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })
}

const generateWavePath = (index: number, progress: number): string => {
  const basePaths = waves[index].path
  const amplitude = 20 + progress * 40
  const offset = Math.floor(amplitude)

  if (progress < 0.3) {
    return basePaths.replace(/M0,\d+/g, `M0,${160 + offset}`)
  } else if (progress < 0.7) {
    return basePaths.replace(/M0,\d+/g, `M0,${140 + offset}`)
  }
  return basePaths.replace(/M0,\d+/g, `M0,${180 - offset}`)
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
})
</script>

<style scoped lang="scss">
// ============================================================
// 主体
// ============================================================
.wave-section {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f1a 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ============================================================
// 波浪背景
// ============================================================
.wave-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  z-index: 0;
}

.wave-svg {
  width: 100%;
  height: 100%;
}

.wave-path {
  animation: waveFloat 4s ease-in-out infinite;
  animation-delay: var(--delay);

  &:nth-child(1) { animation-duration: 5s; }
  &:nth-child(2) { animation-duration: 7s; animation-direction: reverse; }
  &:nth-child(3) { animation-duration: 6s; }
}

@keyframes waveFloat {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-30px) translateY(15px); }
}

// ============================================================
// 散点
// ============================================================
.wave-dots {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.dot {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: dotPulse var(--duration) ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.5); opacity: 1; }
}

// ============================================================
// 卡片容器
// ============================================================
.wave-container {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1;
}

// ============================================================
// 卡片
// ============================================================
.wave-card {
  position: relative;
  width: 220px;
  height: 300px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  padding: 30px 25px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(135deg, var(--card-color), transparent 60%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
    transition: opacity 0.3s;
  }

  &:hover {
    transform: translateY(-15px) scale(1.02);

    &::before { opacity: 1; }
  }
}

.card-wave-effect {
  position: absolute;
  bottom: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, var(--card-color) 0%, transparent 50%);
  opacity: 0.15;
  pointer-events: none;
  animation: wavePulse 4s ease-in-out infinite;
}

@keyframes wavePulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
}

.card-liquid {
  position: absolute;
  bottom: -30%;
  left: 10%;
  width: 80%;
  height: 80%;
  background: linear-gradient(180deg, var(--card-color), transparent);
  opacity: 0.1;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  pointer-events: none;
}

// ============================================================
// 内容
// ============================================================
.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  display: inline-block;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
}

.card-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.card-meter {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.meter-fill {
  width: var(--fill-percent);
  height: 100%;
  background: linear-gradient(90deg, var(--card-color), rgba(255,255,255,0.8));
  border-radius: 3px;
  position: relative;
  overflow: hidden;

  .meter-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  }
}

.card-progress {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--card-color);
}
</style>
