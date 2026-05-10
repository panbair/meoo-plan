<template>
  <section class="mosaic-section">
    <!-- 动态碎片背景 -->
    <div class="fragments-bg">
      <canvas ref="fragCanvas" class="fragments-canvas"></canvas>
    </div>

    <!-- 网格层 -->
    <div class="grid-layer" ref="gridLayer"></div>

    <!-- 卡片容器 -->
    <div class="mosaic-container">
      <div
        v-for="(card, index) in cards"
        :key="card.id"
        class="mosaic-card"
        :ref="(el) => setCardRef(el, index)"
        :style="{ '--mosaic-color': card.color }"
      >
        <!-- 碎片效果层 -->
        <div class="shards-layer" :ref="(el) => setShardsRef(el, index)">
          <div
            v-for="i in 12"
            :key="i"
            class="shard"
            :ref="(el) => setShardRef(el, index, i)"
            :style="{ '--shard-index': i }"
          ></div>
        </div>

        <!-- 破裂效果 -->
        <div class="crack-overlay" :ref="(el) => setCrackRef(el, index)">
          <svg viewBox="0 0 100 100" class="crack-svg">
            <path
              v-for="(path, pIndex) in crackPaths"
              :key="pIndex"
              :d="path"
              class="crack-line"
            />
          </svg>
        </div>

        <!-- 主视觉 -->
        <div class="mosaic-visual" :ref="(el) => setVisualRef(el, index)">
          <div class="visual-mosaic" :ref="(el) => setMosaicRef(el, index)">
            <div
              v-for="i in 16"
              :key="i"
              class="mosaic-tile"
              :ref="(el) => setTileRef(el, index, i)"
              :style="{ '--tile-index': i }"
            >
              <span class="tile-icon">{{ card.icon }}</span>
            </div>
          </div>
        </div>

        <!-- 内容 -->
        <div class="mosaic-content" :ref="(el) => setContentRef(el, index)">
          <div class="content-cracks">
            <span v-for="i in 3" :key="i" class="crack-line-content"></span>
          </div>
          <h3 class="mosaic-title" :ref="(el) => setTitleRef(el, index)">{{ card.title }}</h3>
          <p class="mosaic-desc" :ref="(el) => setDescRef(el, index)">{{ card.desc }}</p>
          <div class="mosaic-tags" :ref="(el) => setTagsRef(el, index)">
            <span v-for="(tag, tIndex) in card.tags" :key="tIndex" class="mosaic-tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 边框 -->
        <div class="mosaic-border" :ref="(el) => setBorderRef(el, index)">
          <span v-for="i in 4" :key="i" class="border-segment"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CardMosaic - 马赛克效果卡片组件
 * @description 碎片重组、破裂效果、网格动画等马赛克风格的动画
 */

import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// 类型定义
// ============================================================
interface MosaicCard {
  id: string
  icon: string
  title: string
  desc: string
  color: string
  tags: string[]
}

const crackPaths = [
  'M50,0 L48,30 L55,50 L45,80 L50,100',
  'M0,50 L30,48 L50,55 L80,45 L100,50',
  'M20,20 L40,45 L60,40 L80,60',
  'M80,80 L60,55 L40,60 L20,40'
]

// ============================================================
// 数据
// ============================================================
const CARDS_DATA: MosaicCard[] = [
  {
    id: 'mosaic-1',
    icon: '🎯',
    title: 'Fragmented',
    desc: 'Broken pieces come together to form something beautiful',
    color: '#e74c3c',
    tags: ['Rebuild', 'Unity', 'Pattern']
  },
  {
    id: 'mosaic-2',
    icon: '🧩',
    title: 'Puzzle',
    desc: 'Every piece has its place in the grand design',
    color: '#3498db',
    tags: ['Connect', 'Solve', 'Complete']
  },
  {
    id: 'mosaic-3',
    icon: '💠',
    title: 'Tessellation',
    desc: 'Infinite patterns repeating across dimensions',
    color: '#9b59b6',
    tags: ['Repeat', 'Symmetry', 'Infinite']
  }
]

// ============================================================
// 响应式数据
// ============================================================
const cards = ref<MosaicCard[]>(CARDS_DATA)
const cardRefsMap = ref(new Map<number, HTMLElement>())
const shardsRefsMap = ref(new Map<string, HTMLElement>())
const crackRefsMap = ref(new Map<number, HTMLElement>())
const visualRefsMap = ref(new Map<number, HTMLElement>())
const mosaicRefsMap = ref(new Map<number, HTMLElement>())
const tileRefsMap = ref(new Map<string, HTMLElement>())
const contentRefsMap = ref(new Map<number, HTMLElement>())
const titleRefsMap = ref(new Map<number, HTMLElement>())
const descRefsMap = ref(new Map<number, HTMLElement>())
const tagsRefsMap = ref(new Map<number, HTMLElement>())
const borderRefsMap = ref(new Map<number, HTMLElement>())
const fragCanvas = ref<HTMLCanvasElement | null>(null)
const cleanupFns: (() => void)[] = []
let fragCtx: CanvasRenderingContext2D | null = null
let animationFrame: number

// ============================================================
// 模板引用
// ============================================================
const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) cardRefsMap.value.set(index, element as HTMLElement)
  else cardRefsMap.value.delete(index)
}

const setShardsRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) shardsRefsMap.value.set(`container-${index}`, el)
  else shardsRefsMap.value.delete(`container-${index}`)
}

const setShardRef = (el: Element | null, index: number, shardIndex: number) => {
  if (el instanceof HTMLElement) shardsRefsMap.value.set(`${index}-${shardIndex}`, el)
  else shardsRefsMap.value.delete(`${index}-${shardIndex}`)
}

const setCrackRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) crackRefsMap.value.set(index, el)
  else crackRefsMap.value.delete(index)
}

const setVisualRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) visualRefsMap.value.set(index, element as HTMLElement)
  else visualRefsMap.value.delete(index)
}

const setMosaicRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) mosaicRefsMap.value.set(index, element as HTMLElement)
  else mosaicRefsMap.value.delete(index)
}

const setTileRef = (el: Element | null, index: number, tileIndex: number) => {
  if (el instanceof HTMLElement) tileRefsMap.value.set(`${index}-${tileIndex}`, el)
  else tileRefsMap.value.delete(`${index}-${tileIndex}`)
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

const setTagsRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) tagsRefsMap.value.set(index, element as HTMLElement)
  else tagsRefsMap.value.delete(index)
}

const setBorderRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) borderRefsMap.value.set(index, el)
  else borderRefsMap.value.delete(index)
}

// ============================================================
// 碎片背景动画
// ============================================================
const initFragmentsBackground = () => {
  const canvas = fragCanvas.value
  if (!canvas) return

  fragCtx = canvas.getContext('2d')
  if (!fragCtx) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const fragments: {
    x: number; y: number; size: number; rotation: number;
    speedX: number; speedY: number; rotationSpeed: number;
    color: string; opacity: number
  }[] = []

  const colors = ['#e74c3c', '#3498db', '#9b59b6', '#2ecc71', '#f39c12']

  for (let i = 0; i < 50; i++) {
    fragments.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 5 + Math.random() * 15,
      rotation: Math.random() * Math.PI * 2,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.1 + Math.random() * 0.2
    })
  }

  const animate = () => {
    if (!fragCtx || !canvas) return

    fragCtx.fillStyle = 'rgba(10, 10, 20, 0.1)'
    fragCtx.fillRect(0, 0, canvas.width, canvas.height)

    fragments.forEach(frag => {
      frag.x += frag.speedX
      frag.y += frag.speedY
      frag.rotation += frag.rotationSpeed

      if (frag.x < -50) frag.x = canvas.width + 50
      if (frag.x > canvas.width + 50) frag.x = -50
      if (frag.y < -50) frag.y = canvas.height + 50
      if (frag.y > canvas.height + 50) frag.y = -50

      fragCtx.save()
      fragCtx.translate(frag.x, frag.y)
      fragCtx.rotate(frag.rotation)
      fragCtx.fillStyle = frag.color
      fragCtx.globalAlpha = frag.opacity
      fragCtx.fillRect(-frag.size / 2, -frag.size / 2, frag.size, frag.size)
      fragCtx.restore()
    })

    animationFrame = requestAnimationFrame(animate)
  }
  animate()
}

// ============================================================
// 入场动画
// ============================================================
const initEntryAnimation = () => {
  // 卡片入场 - 碎片重组效果
  cardRefsMap.value.forEach((card, index) => {
    gsap.fromTo(card,
      {
        scale: 0.3,
        opacity: 0,
        rotateZ: -10,
        skewX: 5,
        filter: 'blur(20px)'
      },
      {
        scale: 1,
        opacity: 1,
        rotateZ: 0,
        skewX: 0,
        filter: 'blur(0px)',
        duration: 1.4,
        delay: index * 0.25,
        ease: 'elastic.out(1, 0.5)'
      }
    )
  })

  // 马赛克瓦片入场
  tileRefsMap.value.forEach((tile, key) => {
    const [index] = key.split('-').map(Number)
    const tileIndex = parseInt(key.split('-')[1])
    gsap.fromTo(tile,
      {
        scale: 0,
        opacity: 0,
        rotateZ: Math.random() * 180 - 90
      },
      {
        scale: 1,
        opacity: 1,
        rotateZ: 0,
        duration: 0.6,
        delay: 0.4 + index * 0.25 + tileIndex * 0.03,
        ease: 'back.out(1.5)'
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
        delay: 0.5 + index * 0.25,
        ease: 'power3.out'
      }
    )
  })

  // 标题入场
  titleRefsMap.value.forEach((title, index) => {
    gsap.fromTo(title,
      { x: -40, opacity: 0, letterSpacing: '0.3em' },
      {
        x: 0,
        opacity: 1,
        letterSpacing: 'normal',
        duration: 0.8,
        delay: 0.7 + index * 0.25,
        ease: 'power2.out'
      }
    )
  })

  // 标签入场
  tagsRefsMap.value.forEach((container) => {
    const tags = container.querySelectorAll('.mosaic-tag')
    tags.forEach((tag, i) => {
      gsap.fromTo(tag,
        { scale: 0, opacity: 0, y: 20 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          delay: 0.8 + i * 0.1,
          ease: 'back.out(1.8)'
        }
      )
    })
  })
}

// ============================================================
// 滚动动画
// ============================================================
const initScrollAnimations = () => {
  // 1. 卡片 3D 效果
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
        const skewX = Math.sin(p * Math.PI) * 3 * direction
        const scale = 1 + Math.sin(p * Math.PI) * 0.08

        gsap.to(card, {
          y: translateY,
          x: translateX,
          rotateY: rotateY,
          skewX: skewX,
          scale: scale,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 2. 碎片动画
  shardsRefsMap.value.forEach((shard, key) => {
    if (key.includes('-')) {
      const shardIndex = parseInt(key.split('-')[1])
      gsap.to(shard, {
        x: 'random(-20, 20)',
        y: 'random(-20, 20)',
        rotation: 'random(-15, 15)',
        duration: 2 + Math.random() * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: shardIndex * 0.1
      })
    }
  })

  // 3. 裂纹动画
  crackRefsMap.value.forEach((crack) => {
    const paths = crack.querySelectorAll('.crack-line')
    paths.forEach((path, i) => {
      gsap.fromTo(path,
        { strokeDashoffset: 200 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          delay: i * 0.2,
          ease: 'power2.out'
        }
      )

      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: 0.3 + Math.random() * 0.4,
        duration: 1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.3
      })
    })
  })

  // 4. 马赛克瓦片动画
  tileRefsMap.value.forEach((tile, key) => {
    const color = CARDS_DATA[parseInt(key.split('-')[0])].color
    gsap.to(tile, {
      borderColor: color,
      boxShadow: `0 0 8px ${color}`,
      duration: 0.5 + Math.random() * 0.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 2
    })
  })

  // 5. 边框动画
  borderRefsMap.value.forEach((border, index) => {
    const color = CARDS_DATA[index].color
    const segments = border.querySelectorAll('.border-segment')
    segments.forEach((segment, i) => {
      gsap.to(segment, {
        width: '60%',
        opacity: 0.8,
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}`,
        duration: 1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.25
      })
    })
  })

  // 6. 标题发光
  titleRefsMap.value.forEach((title, index) => {
    const color = CARDS_DATA[index].color
    const trigger = ScrollTrigger.create({
      trigger: title,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1,
      onUpdate: (self) => {
        const glow = 5 + self.progress * 20
        gsap.to(title, {
          textShadow: `0 0 ${glow}px ${color}, 0 0 ${glow * 2}px ${color}`,
          duration: 0.1
        })
      }
    })
    cleanupFns.push(() => trigger.kill())
  })

  // 7. 卡片间距
  const container = document.querySelector('.mosaic-container') as HTMLElement
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
    initFragmentsBackground()
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
.mosaic-section {
  width: 100vw;
  height: 100vh;
  padding: 60px 40px;
  background: linear-gradient(135deg, #0a0a15 0%, #151525 50%, #0a0a15 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

// ============================================================
// 碎片背景
// ============================================================
.fragments-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.fragments-canvas {
  width: 100%;
  height: 100%;
}

// ============================================================
// 网格层
// ============================================================
.grid-layer {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 25px 25px;
  z-index: 1;
  pointer-events: none;
}

// ============================================================
// 容器
// ============================================================
.mosaic-container {
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
.mosaic-card {
  position: relative;
  width: 300px;
  height: 420px;
  background: linear-gradient(180deg, rgba(15, 15, 30, 0.95) 0%, rgba(8, 8, 20, 0.98) 100%);
  border-radius: 20px;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

// ============================================================
// 碎片层
// ============================================================
.shards-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.shard {
  position: absolute;
  width: 30px;
  height: 30px;
  background: var(--mosaic-color);
  opacity: 0.1;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);

  @for $i from 1 through 12 {
    &:nth-child(#{$i}) {
      left: random(80) + 10%;
      top: random(80) + 10%;
      transform: rotate(#{$i * 30}deg);
    }
  }
}

// ============================================================
// 裂纹覆盖层
// ============================================================
.crack-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
}

.crack-svg {
  width: 100%;
  height: 100%;
}

.crack-line {
  fill: none;
  stroke: var(--mosaic-color);
  stroke-width: 1;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  opacity: 0.4;
}

// ============================================================
// 视觉区域
// ============================================================
.mosaic-visual {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
}

.visual-mosaic {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.mosaic-tile {
  width: 50px;
  height: 50px;
  background: rgba(20, 20, 40, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.tile-icon {
  font-size: 1.5rem;
  opacity: 0.5;
}

// ============================================================
// 内容
// ============================================================
.mosaic-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px;
  background: linear-gradient(to top, rgba(5, 5, 15, 0.98) 0%, transparent 100%);
  z-index: 10;
}

.content-cracks {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  overflow: hidden;
}

.crack-line-content {
  position: absolute;
  height: 100%;
  background: var(--mosaic-color);
  opacity: 0.3;

  &:nth-child(1) { left: 0; width: 30%; }
  &:nth-child(2) { left: 50%; width: 40%; }
  &:nth-child(3) { right: 0; width: 25%; }
}

.mosaic-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 20px 0 10px 0;
  text-shadow: 0 0 10px var(--mosaic-color);
}

.mosaic-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.mosaic-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.mosaic-tag {
  padding: 5px 12px;
  font-size: 0.7rem;
  color: var(--mosaic-color);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--mosaic-color);
  border-radius: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

// ============================================================
// 边框
// ============================================================
.mosaic-border {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.border-segment {
  position: absolute;
  height: 3px;
  background: transparent;
  opacity: 0.5;

  &:nth-child(1) {
    top: 10px;
    left: 10px;
    transform-origin: left center;
  }
  &:nth-child(2) {
    bottom: 10px;
    right: 10px;
    transform-origin: right center;
  }
  &:nth-child(3) {
    top: 10px;
    right: 10px;
    width: 3px;
    height: 50px;
    transform-origin: top center;
  }
  &:nth-child(4) {
    bottom: 10px;
    left: 10px;
    width: 3px;
    height: 50px;
    transform-origin: bottom center;
  }
}
</style>
