<template>
  <section ref="sectionRef" class="shatter-section">
    <!-- 背景装饰 -->
    <div class="shatter-bg">
      <div class="shatter-particles"></div>
    </div>

    <!-- 主容器 -->
    <div class="shatter-container">
      <!-- 标题区域 -->
      <div ref="titleRef" class="shatter-title-wrapper">
        <h1 class="shatter-title">
          <span class="title-word" v-for="(word, i) in titleWords" :key="i">
            <span class="title-char" v-for="(char, j) in word" :key="j">{{ char }}</span>
          </span>
        </h1>
        <p class="shatter-subtitle">SCROLL TO BREAK</p>
      </div>

      <!-- 破碎卡片 -->
      <div ref="cardsRef" class="shatter-cards">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="shatter-card"
          :ref="el => setCardRef(index, el as HTMLElement)"
        >
          <div class="card-shard-container">
            <div
              v-for="shard in cardShards[index]"
              :key="shard.id"
              class="card-shard"
              :style="shard.style"
            >
              <div class="shard-content">{{ card.title }}</div>
            </div>
          </div>
          <div class="card-info">
            <span class="card-number">0{{ index + 1 }}</span>
            <span class="card-title">{{ card.title }}</span>
          </div>
        </div>
      </div>

      <!-- 滚动进度指示器 -->
      <div class="scroll-progress">
        <div ref="progressRef" class="progress-fill"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Shard {
  id: number
  style: Record<string, string>
}

interface Card {
  id: string
  title: string
  color: string
}

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

const cards: Card[] = [
  { id: 'shatter-1', title: 'DESIGN', color: '#ff6b6b' },
  { id: 'shatter-2', title: 'CREATE', color: '#4ecdc4' },
  { id: 'shatter-3', title: 'INSPIRE', color: '#ffe66d' },
  { id: 'shatter-4', title: 'BREAK', color: '#ff6b9d' }
]

const titleWords = ['SHATTER', 'EFFECT']

const cardShards = computed(() => {
  return cards.map((card, cardIndex) => {
    const shards: Shard[] = []
    const shardCount = 12
    for (let i = 0; i < shardCount; i++) {
      const angle = (360 / shardCount) * i
      const distance = 100 + Math.random() * 200
      const translateX = Math.cos((angle * Math.PI) / 180) * distance
      const translateY = Math.sin((angle * Math.PI) / 180) * distance
      const rotate = Math.random() * 360

      shards.push({
        id: i,
        style: {
          '--translate-x': `${translateX}px`,
          '--translate-y': `${translateY}px`,
          '--rotate': `${rotate}deg`,
          '--delay': `${i * 0.05}s`,
          background: `linear-gradient(${angle}deg, ${card.color}40, ${card.color}80)`
        }
      })
    }
    return shards
  })
})

const setCardRef = (index: number, el: HTMLElement | null) => {
  if (el) cardRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // 标题入场动画
  if (titleRef.value) {
    const chars = titleRef.value.querySelectorAll('.title-char')
    gsap.fromTo(
      chars,
      { opacity: 0, y: 50, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'back.out(1.7)'
      }
    )
  }

  // 卡片滚动破碎动画
  cardRefs.value.forEach((card, index) => {
    const shards = card.querySelectorAll('.card-shard')

    // 初始状态：碎片聚集
    gsap.set(shards, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotation: 0
    })

    // 滚动时碎片爆炸
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      }
    })

    // 卡片旋转
    tl.to(card, {
      rotateY: 360 * (index % 2 === 0 ? 1 : -1),
      rotateX: 15,
      duration: 1
    })

    // 碎片爆炸
    shards.forEach((shard, i) => {
      const progress = 0.3 + (i / shards.length) * 0.7
      tl.to(
        shard,
        {
          x: `var(--translate-x)`,
          y: `var(--translate-y)`,
          rotation: `var(--rotate)`,
          scale: 0,
          opacity: 0,
          ease: 'power2.out'
        },
        progress
      )
    })

    // 卡片缩放
    tl.to(card, {
      scale: 1.2,
      duration: 0.5
    }, 0)

    // 信息区域动画
    const info = card.querySelector('.card-info')
    if (info) {
      tl.fromTo(
        info,
        { opacity: 1, y: 0 },
        { opacity: 0, y: -50, duration: 0.3 },
        0.5
      )
    }
  })

  // 进度条动画
  if (progressRef.value) {
    gsap.to(progressRef.value, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5
      }
    })
  }

  // 背景粒子动画
  const particles = sectionRef.value?.querySelector('.shatter-particles')
  if (particles) {
    gsap.to(particles, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })

    cleanupFns.push(() => gsap.killTweensOf(particles))
  }
}

onMounted(() => {
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.shatter-section {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%);
  position: relative;
  overflow: hidden;
}

.shatter-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shatter-particles {
  position: absolute;
  width: 600px;
  height: 600px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 107, 107, 0.3) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(78, 205, 196, 0.3) 0%, transparent 30%),
    radial-gradient(circle at 50% 50%, rgba(255, 230, 109, 0.2) 0%, transparent 40%);
  filter: blur(60px);
}

.shatter-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
}

.shatter-title-wrapper {
  text-align: center;
  margin-bottom: 60px;
  perspective: 500px;
}

.shatter-title {
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  display: flex;
  gap: 20px;
  justify-content: center;
  text-shadow:
    0 0 20px rgba(255, 107, 107, 0.8),
    0 0 40px rgba(255, 107, 107, 0.6),
    0 0 60px rgba(255, 107, 107, 0.4);
}

.title-word {
  display: inline-flex;
}

.title-char {
  display: inline-block;
  transform-style: preserve-3d;
}

.shatter-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 8px;
  margin-top: 20px;
}

.shatter-cards {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: center;
  perspective: 1000px;
}

.shatter-card {
  width: 220px;
  height: 280px;
  position: relative;
  transform-style: preserve-3d;
}

.card-shard-container {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.card-shard {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.shard-content {
  font-size: 24px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.card-info {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-number {
  font-size: 48px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.1);
  line-height: 1;
}

.card-title {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 4px;
}

.scroll-progress {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #ffe66d);
  transform-origin: left;
  transform: scaleX(0);
}
</style>
