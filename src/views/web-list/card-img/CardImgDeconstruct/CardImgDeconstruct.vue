<template>
  <section ref="sectionRef" class="deconstruct-section">
    <!-- 深空背景 -->
    <div class="bg-stars"></div>
    <div class="bg-grid"></div>

    <!-- 三维空间容器 -->
    <div ref="sceneRef" class="scene-container">
      <!-- 前景层 -->
      <div
        v-for="(item, i) in frontItems"
        :key="`front-${i}`"
        class="layer-card front-layer"
        :ref="el => setRef(el, i, 'front')"
        :style="{ '--delay': `${i * 0.1}s` }"
      >
        <img :src="item.url" :alt="item.title" class="card-image" />
        <div class="card-overlay">
          <span class="card-title">{{ item.title }}</span>
        </div>
      </div>

      <!-- 中景层 -->
      <div
        v-for="(item, i) in middleItems"
        :key="`middle-${i}`"
        class="layer-card middle-layer"
        :ref="el => setRef(el, i, 'middle')"
        :style="{ '--delay': `${i * 0.15}s` }"
      >
        <img :src="item.url" :alt="item.title" class="card-image" />
        <div class="card-overlay">
          <span class="card-title">{{ item.title }}</span>
        </div>
      </div>

      <!-- 远景层 -->
      <div
        v-for="(item, i) in backItems"
        :key="`back-${i}`"
        class="layer-card back-layer"
        :ref="el => setRef(el, i, 'back')"
        :style="{ '--delay': `${i * 0.2}s` }"
      >
        <img :src="item.url" :alt="item.title" class="card-image" />
        <div class="card-overlay">
          <span class="card-title">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <!-- 层叠指示器 -->
    <div class="layer-indicator">
      <span class="indicator-dot front"></span>
      <span class="indicator-dot middle"></span>
      <span class="indicator-dot back"></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ==================== 数据 ====================
const frontItems = reactive([
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: '极光' },
  { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80', title: '峰峦' }
])

const middleItems = reactive([
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80', title: '星河' },
  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80', title: '星球' }
])

const backItems = reactive([
  { url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&q=80', title: '星云' },
  { url: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=600&q=80', title: '尘埃' }
])

// ==================== Refs ====================
const sectionRef = ref<HTMLElement>()
const sceneRef = ref<HTMLElement>()
const frontRefs = ref<(HTMLElement | null)[]>([])
const middleRefs = ref<(HTMLElement | null)[]>([])
const backRefs = ref<(HTMLElement | null)[]>([])

const setRef = (el: Element | ComponentPublicInstance | null, i: number, layer: string) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (!element) return
  if (layer === 'front') frontRefs.value[i] = element
  else if (layer === 'middle') middleRefs.value[i] = element
  else backRefs.value[i] = element
}

// ==================== 动画 ====================
let cleanupFns: Array<() => void> = []

function initAnimation() {
  const section = sectionRef.value
  const scene = sceneRef.value
  if (!section || !scene) return

  const frontEls = frontRefs.value.filter(Boolean) as HTMLElement[]
  const middleEls = middleRefs.value.filter(Boolean) as HTMLElement[]
  const backEls = backRefs.value.filter(Boolean) as HTMLElement[]

  // 初始状态
  gsap.set([...frontEls, ...middleEls, ...backEls], {
    scale: 0,
    opacity: 0,
    y: 50
  })

  // 入场动画
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  // 远景层先出现
  tl.to(backEls, {
    scale: 1,
    opacity: 0.6,
    y: 0,
    stagger: 0.1,
    duration: 0.3
  }, 0)

  // 中景层
  tl.to(middleEls, {
    scale: 1,
    opacity: 0.8,
    y: 0,
    stagger: 0.1,
    duration: 0.3
  }, 0.1)

  // 前景层最后
  tl.to(frontEls, {
    scale: 1,
    opacity: 1,
    y: 0,
    stagger: 0.1,
    duration: 0.3
  }, 0.2)

  // 滚动时前景移动最快
  tl.to(frontEls, {
    y: -100,
    duration: 1,
    ease: 'none'
  }, 0)

  tl.to(middleEls, {
    y: -60,
    duration: 1,
    ease: 'none'
  }, 0)

  tl.to(backEls, {
    y: -30,
    duration: 1,
    ease: 'none'
  }, 0)

  // 鼠标视差
  let mouseTween: gsap.core.Tween | null = null
  let currentRotateX = 0
  let currentRotateY = 0

  const handleMouseMove = (e: MouseEvent) => {
    if (mouseTween) mouseTween.kill()

    const targetRotateY = ((e.clientX / window.innerWidth) - 0.5) * 10
    const targetRotateX = ((e.clientY / window.innerHeight) - 0.5) * -8

    mouseTween = gsap.to({ x: currentRotateY, y: currentRotateX }, {
      x: targetRotateY,
      y: targetRotateX,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate() {
        currentRotateX = (this.targets()[0] as any).y
        currentRotateY = (this.targets()[0] as any).x
        scene.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`
      }
    })
  }

  section.addEventListener('mousemove', handleMouseMove)

  // 清理
  cleanupFns.push(() => {
    tl.kill()
    if (mouseTween) mouseTween.kill()
    section.removeEventListener('mousemove', handleMouseMove)
    ScrollTrigger.getAll().forEach(st => st.kill())
  })
}

// ==================== 生命周期 ====================
onMounted(() => {
  setTimeout(initAnimation, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns = []
  gsap.killTweensOf('*')
})
</script>

<style lang="scss" scoped>
$cyan: #00f0ff;
$gold: #ffd700;
$violet: #9966ff;

.deconstruct-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #050510 0%, #0a0520 100%);
  perspective: 1200px;
}

.bg-stars {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(2px 2px at 20px 30px, white, transparent),
                    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                    radial-gradient(1px 1px at 90px 40px, white, transparent),
                    radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.6), transparent);
  background-size: 150px 100px;
  opacity: 0.4;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba($cyan, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba($cyan, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center 120%;
}

.scene-container {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

.layer-card {
  position: absolute;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    z-index: 100;

    .card-overlay {
      opacity: 1;
    }

    .card-image {
      transform: scale(1.05);
    }
  }
}

.card-image {
  width: 280px;
  height: 200px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%);
  display: flex;
  align-items: flex-end;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: white;
}

// 前景层 - 金色边框
.front-layer {
  left: 10%;
  top: 25%;
  border: 2px solid rgba($gold, 0.5);
  box-shadow: 0 0 40px rgba($gold, 0.3);
}

// 中景层 - 青色边框
.middle-layer {
  left: 40%;
  top: 35%;
  border: 2px solid rgba($cyan, 0.4);
  box-shadow: 0 0 30px rgba($cyan, 0.2);
}

// 远景层 - 紫色边框
.back-layer {
  left: 65%;
  top: 50%;
  border: 2px solid rgba($violet, 0.3);
  box-shadow: 0 0 20px rgba($violet, 0.15);
}

.layer-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 50;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.front {
    background: $gold;
    box-shadow: 0 0 12px $gold;
  }

  &.middle {
    background: $cyan;
    box-shadow: 0 0 12px $cyan;
  }

  &.back {
    background: $violet;
    box-shadow: 0 0 12px $violet;
  }
}

@media (max-width: 900px) {
  .card-image {
    width: 200px;
    height: 140px;
  }

  .front-layer { left: 5%; top: 20%; }
  .middle-layer { left: 35%; top: 30%; }
  .back-layer { left: 60%; top: 45%; }
}
</style>
