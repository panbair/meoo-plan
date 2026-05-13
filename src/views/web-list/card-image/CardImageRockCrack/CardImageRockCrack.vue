<template>
  <section ref="parentRef" class="rock-crack-container">
    <!-- 深色背景 -->
    <div class="dark-bg"></div>

    <!-- 完整图片 -->
    <div class="base-layer">
      <img :src="imageUrl" alt="" class="base-img" />
    </div>

    <!-- 裂纹效果 -->
    <div ref="crackOverlayRef" class="crack-overlay">
      <svg class="crack-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path v-for="(path, i) in crackPaths" :key="i" :d="path" class="crack-path" />
      </svg>
    </div>

    <!-- 碎片层 -->
    <div ref="fragmentLayerRef" class="fragment-layer">
      <div
        v-for="(frag, idx) in fragments"
        :key="idx"
        :ref="(el) => setFragRef(el, idx)"
        class="fragment"
        :style="{
          '--fx': `${frag.gridX}%`,
          '--fy': `${frag.gridY}%`,
          '--sx': `${-frag.gridX * 100}%`,
          '--sy': `${-frag.gridY * 100}%`,
        }"
      >
        <img :src="imageUrl" alt="" class="frag-img" />
        <div class="frag-glow"></div>
      </div>
    </div>

    <!-- 冲击波 -->
    <div ref="shockRef" class="shockwave">
      <div class="shock-ring"></div>
    </div>

    <!-- 中心余烬 -->
    <div ref="emberRef" class="ember">
      <div class="ember-core"></div>
      <div class="ember-ring"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Cleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const fragmentLayerRef = ref<HTMLElement | null>(null)
const crackOverlayRef = ref<HTMLElement | null>(null)
const shockRef = ref<HTMLElement | null>(null)
const emberRef = ref<HTMLElement | null>(null)

const fragRefs: HTMLElement[] = []
const cleanupFns: Cleanup[] = []

// 配置
const COLS = 5
const ROWS = 4
const CENTER_X = (COLS - 1) / 2
const CENTER_Y = (ROWS - 1) / 2

// 火山岩浆图片
const imageUrl = 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1920&q=80'

interface Frag {
  gridX: number
  gridY: number
  explodeX: number
  explodeY: number
  explodeZ: number
  rotX: number
  rotY: number
  rotZ: number
  delay: number
  layer: number
}

const fragments = reactive<Frag[]>([])
const crackPaths: string[] = []

let seed = 99999
const rnd = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const range = (min: number, max: number) => min + rnd() * (max - min)

// 生成裂纹 SVG 路径
const generateCracks = () => {
  crackPaths.length = 0
  const cx = 50, cy = 50
  
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + range(-0.3, 0.3)
    const length = range(25, 45)
    let path = `M ${cx} ${cy}`
    let x = cx, y = cy
    
    for (let j = 0; j < 4; j++) {
      const segLen = length / 4
      x += Math.cos(angle + range(-0.4, 0.4)) * segLen
      y += Math.sin(angle + range(-0.4, 0.4)) * segLen
      path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
    }
    
    crackPaths.push(path)
  }
}

const initFrags = () => {
  fragments.length = 0
  seed = 99999
  generateCracks()

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const dx = col - CENTER_X + 0.5
      const dy = row - CENTER_Y + 0.5
      const dist = Math.sqrt(dx * dx + dy * dy)
      const layer = Math.ceil(dist)
      const angle = Math.atan2(dy, dx)

      const force = 200 + layer * 100

      fragments.push({
        gridX: col * (100 / COLS),
        gridY: row * (100 / ROWS),
        explodeX: Math.cos(angle) * force + range(-100, 100),
        explodeY: Math.sin(angle) * force + range(80, 150),
        explodeZ: range(-80, 100),
        rotX: range(-360, 360),
        rotY: range(-360, 360),
        rotZ: range(-720, 720),
        delay: layer * 0.1,
        layer,
      })
    }
  }
}

const setFragRef = (el: Element | null, idx: number) => {
  if (el) fragRefs[idx] = el
}

onMounted(() => {
  if (!parentRef.value) return
  initFrags()
  requestAnimationFrame(() => setupAnimations())
})

const setupAnimations = () => {
  if (!parentRef.value || !fragmentLayerRef.value) return

  // ========== 阶段1: 震动预兆 ==========
  const tremorTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 85%',
      end: 'top 60%',
      scrub: 1,
    },
  })

  // 裂纹显现
  if (crackOverlayRef.value) {
    gsap.set(crackOverlayRef.value, { opacity: 0 })
    tremorTl.to(crackOverlayRef.value, { opacity: 1, duration: 0.4 }, 0)
  }

  // 震动 - 每个碎片独立抖动
  const shakeFns: Cleanup[] = []
  fragRefs.forEach((frag) => {
    if (!frag) return
    const shake = () => {
      gsap.to(frag, {
        x: range(-4, 4),
        y: range(-3, 3),
        duration: 0.06,
        ease: 'none',
        onComplete: shake,
      })
    }
    shake()
    shakeFns.push(() => gsap.killTweensOf(frag))
  })

  // 2.5秒后停止震动
  const stopShake = () => shakeFns.forEach(fn => fn())
  setTimeout(stopShake, 2500)
  cleanupFns.push(stopShake)

  cleanupFns.push(() => tremorTl.kill())
  cleanupFns.push(() => tremorTl.scrollTrigger?.kill())

  // ========== 阶段2: 岩层炸裂 ==========
  const burstTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 55%',
      end: 'top 10%',
      scrub: 1.5,
    },
  })

  // 冲击波
  if (shockRef.value) {
    gsap.set(shockRef.value, { scale: 0, opacity: 0 })
    burstTl.fromTo(shockRef.value,
      { scale: 0, opacity: 1 },
      { scale: 6, opacity: 0, duration: 0.8, ease: 'power2.out' },
      0
    )
  }

  // 碎片炸裂 - 从中心向外
  fragRefs.forEach((frag, idx) => {
    if (!frag) return
    const data = fragments[idx]
    if (!data) return

    // 初始状态
    gsap.set(frag, { x: 0, y: 0, z: 0, opacity: 1, scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0 })

    // 炸裂
    burstTl.to(frag, {
      x: data.explodeX,
      y: data.explodeY,
      z: data.explodeZ,
      rotationX: data.rotX,
      rotationY: data.rotY,
      rotationZ: data.rotZ,
      scale: 0.6,
      opacity: 0,
      duration: 1.8,
      ease: 'power4.in',
    }, data.delay)

    // 炽热光效
    const glow = frag.querySelector('.frag-glow') as HTMLElement
    if (glow) {
      gsap.set(glow, { opacity: 0 })
      burstTl.fromTo(glow,
        { opacity: 0 },
        { opacity: 1, duration: 0.15 },
        data.delay
      )
      burstTl.to(glow,
        { opacity: 0, duration: 0.8 },
        data.delay + 0.2
      )
    }
  })

  cleanupFns.push(() => burstTl.kill())
  cleanupFns.push(() => burstTl.scrollTrigger?.kill())

  // ========== 阶段3: 余烬 ==========
  if (emberRef.value) {
    gsap.set(emberRef.value, { scale: 0, opacity: 0 })

    const emberTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 15%',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    emberTl.to(emberRef.value, { scale: 1, opacity: 1, duration: 0.5 }, 0)

    // 脉冲
    const pulseAnim = gsap.to(emberRef.value, {
      scale: 1.3,
      opacity: 0.8,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    cleanupFns.push(() => pulseAnim.kill())

    // 旋转环
    const ring = emberRef.value.querySelector('.ember-ring') as HTMLElement
    if (ring) {
      const ringAnim = gsap.to(ring, {
        rotation: 360,
        duration: 6,
        repeat: -1,
        ease: 'none',
      })
      cleanupFns.push(() => ringAnim.kill())
    }
  }
}

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
  gsap.killTweensOf('*')
})
</script>

<style scoped lang="scss">
.rock-crack-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #080404;
}

// 深色背景
.dark-bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 50% 50%, #1a0f0a 0%, #0d0605 40%, #050202 100%);
}

// 完整图片
.base-layer {
  position: absolute;
  inset: 0;
  z-index: 1;

  .base-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.95) contrast(1.1);
  }
}

// 裂纹叠加
.crack-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  opacity: 0;
  mix-blend-mode: overlay;

  .crack-svg {
    width: 100%;
    height: 100%;
  }

  .crack-path {
    fill: none;
    stroke: rgba(255, 120, 50, 0.6);
    stroke-width: 0.3;
    filter: blur(0.3px);
  }
}

// 碎片层
.fragment-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  perspective: 2500px;
  transform-style: preserve-3d;
}

// 单个碎片
.fragment {
  position: absolute;
  width: calc(100% / 5);
  height: calc(100% / 4);
  left: var(--fx);
  top: var(--fy);
  transform-style: preserve-3d;
  will-change: transform, opacity;

  .frag-img {
    position: absolute;
    width: calc(100% * 5);
    height: calc(100% * 4);
    left: var(--sx);
    top: var(--sy);
    object-fit: cover;
    filter: brightness(1.15) contrast(1.2) saturate(1.3);
  }

  .frag-glow {
    position: absolute;
    inset: -6px;
    background: linear-gradient(
      135deg,
      rgba(255, 180, 80, 0.8) 0%,
      rgba(255, 100, 30, 0.6) 50%,
      rgba(200, 60, 10, 0.4) 100%
    );
    box-shadow: 
      0 0 25px rgba(255, 140, 60, 0.9),
      0 0 50px rgba(255, 100, 30, 0.6);
    mix-blend-mode: screen;
  }
}

// 冲击波
.shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  z-index: 15;
  pointer-events: none;

  .shock-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 8px solid rgba(255, 160, 80, 0.95);
    box-shadow: 
      0 0 60px rgba(255, 130, 50, 0.8),
      0 0 120px rgba(255, 100, 30, 0.5),
      inset 0 0 60px rgba(255, 120, 60, 0.4);
  }
}

// 余烬
.ember {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 150px;
  transform: translate(-50%, -50%);
  z-index: 20;
  pointer-events: none;

  .ember-core {
    position: absolute;
    inset: 20%;
    background: radial-gradient(
      circle,
      rgba(255, 230, 180, 1) 0%,
      rgba(255, 170, 80, 0.9) 35%,
      rgba(255, 100, 30, 0.6) 65%,
      transparent 85%
    );
    border-radius: 50%;
    filter: blur(10px);
    box-shadow: 
      0 0 80px rgba(255, 150, 60, 0.9),
      0 0 160px rgba(255, 120, 40, 0.6);
  }

  .ember-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 4px solid rgba(255, 180, 100, 0.5);
    background: radial-gradient(
      circle,
      transparent 25%,
      rgba(255, 140, 60, 0.3) 50%,
      transparent 75%
    );
  }
}
</style>
