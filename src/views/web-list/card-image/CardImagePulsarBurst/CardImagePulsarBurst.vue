<template>
  <section ref="parentRef" class="pulsar-container">
    <!-- 深空背景 -->
    <div class="space-bg">
      <div class="nebula"></div>
      <div class="stars"></div>
    </div>

    <!-- 完整图片 -->
    <div class="base-layer">
      <img :src="imageUrl" alt="" class="base-img" />
    </div>

    <!-- 脉冲环 -->
    <div ref="pulseRef" class="pulse-overlay">
      <div class="pulse-ring ring-1"></div>
      <div class="pulse-ring ring-2"></div>
      <div class="pulse-ring ring-3"></div>
    </div>

    <!-- 碎片层 -->
    <div ref="fragLayerRef" class="frag-layer">
      <div
        v-for="(f, i) in frags"
        :key="i"
        :ref="(el) => setFragRef(el, i)"
        class="frag"
        :style="{
          '--fx': `${f.posX}%`,
          '--fy': `${f.posY}%`,
          '--bx': `${-f.col * 100}%`,
          '--by': `${-f.row * 100}%`,
        }"
      >
        <img :src="imageUrl" alt="" class="frag-img" />
        <div class="frag-glow"></div>
      </div>
    </div>

    <!-- 激波 -->
    <div ref="shockRef" class="shockwave">
      <div class="shock-ring"></div>
    </div>

    <!-- 遗迹核心 -->
    <div ref="remnantRef" class="remnant">
      <div class="remnant-core"></div>
      <div class="remnant-beam"></div>
    </div>

    <!-- 光子 -->
    <div ref="photonRef" class="photon-bg"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Cleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const fragLayerRef = ref<HTMLElement | null>(null)
const pulseRef = ref<HTMLElement | null>(null)
const shockRef = ref<HTMLElement | null>(null)
const remnantRef = ref<HTMLElement | null>(null)
const photonRef = ref<HTMLElement | null>(null)

const fragRefs: HTMLElement[] = []
const cleanupFns: Cleanup[] = []

// 配置
const COLS = 5
const ROWS = 4
const CX = (COLS - 1) / 2
const CY = (ROWS - 1) / 2

// 星云图片
const imageUrl = 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1920&q=80'

interface Frag {
  col: number
  row: number
  posX: number
  posY: number
  ex: number
  ey: number
  ez: number
  rx: number
  ry: number
  rz: number
  delay: number
  layer: number
}

const frags = reactive<Frag[]>([])

let seed = 22222
const rnd = () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}
const range = (min: number, max: number) => min + rnd() * (max - min)

const initFrags = () => {
  frags.length = 0
  seed = 22222

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const dx = col - CX + 0.5
      const dy = row - CY + 0.5
      const dist = Math.sqrt(dx * dx + dy * dy)
      const layer = Math.ceil(dist)
      const angle = Math.atan2(dy, dx)

      const force = 200 + layer * 120

      frags.push({
        col,
        row,
        posX: col * (100 / COLS),
        posY: row * (100 / ROWS),
        ex: Math.cos(angle) * force + range(-100, 100),
        ey: Math.sin(angle) * force + range(-100, 100),
        ez: range(-100, 120),
        rx: range(-360, 360),
        ry: range(-360, 360),
        rz: range(-720, 720),
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
  if (!parentRef.value || !fragLayerRef.value) return

  // ========== 阶段1: 脉冲预震 ==========
  const pulseTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 85%',
      end: 'top 60%',
      scrub: 1,
    },
  })

  // 脉冲环
  if (pulseRef.value) {
    gsap.set(pulseRef.value, { opacity: 0 })
    pulseTl.to(pulseRef.value, { opacity: 1, duration: 0.4 }, 0)

    pulseRef.value.querySelectorAll('.pulse-ring').forEach((ring, i) => {
      gsap.set(ring, { scale: 0.6, opacity: 0 })
      pulseTl.to(ring, {
        scale: 1.2 + i * 0.2,
        opacity: 0.7 - i * 0.15,
        duration: 0.25,
        repeat: 4,
        ease: 'sine.inOut',
      }, i * 0.08)
    })
  }

  // 震动
  const shakeFns: Cleanup[] = []
  fragRefs.forEach((frag) => {
    if (!frag) return
    const shake = () => {
      gsap.to(frag, {
        x: range(-3, 3),
        y: range(-2, 2),
        duration: 0.04,
        ease: 'none',
        onComplete: shake,
      })
    }
    shake()
    shakeFns.push(() => gsap.killTweensOf(frag))
  })

  const stopShake = () => shakeFns.forEach(fn => fn())
  setTimeout(stopShake, 2000)
  cleanupFns.push(stopShake)

  cleanupFns.push(() => pulseTl.kill())
  cleanupFns.push(() => pulseTl.scrollTrigger?.kill())

  // ========== 阶段2: 光子溅射 ==========
  const burstTl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 55%',
      end: 'top 5%',
      scrub: 1.5,
    },
  })

  // 激波
  if (shockRef.value) {
    gsap.set(shockRef.value, { scale: 0, opacity: 0 })
    burstTl.fromTo(shockRef.value,
      { scale: 0, opacity: 1 },
      { scale: 7, opacity: 0, duration: 0.7, ease: 'power2.out' },
      0
    )
  }

  // 光子爆发
  if (photonRef.value) {
    gsap.set(photonRef.value, { opacity: 0 })
    burstTl.to(photonRef.value, { opacity: 1, duration: 0.2 }, 0)
    burstTl.to(photonRef.value, { opacity: 0, duration: 1 }, 0.3)
  }

  // 碎片溅射
  fragRefs.forEach((frag, idx) => {
    if (!frag) return
    const f = frags[idx]
    if (!f) return

    gsap.set(frag, { x: 0, y: 0, z: 0, opacity: 1, scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0 })

    burstTl.to(frag, {
      x: f.ex,
      y: f.ey,
      z: f.ez,
      rotationX: f.rx,
      rotationY: f.ry,
      rotationZ: f.rz,
      scale: 0.5,
      opacity: 0,
      duration: 1.5,
      ease: 'power5.in',
    }, f.delay)

    // 蓝紫辉光
    const glow = frag.querySelector('.frag-glow') as HTMLElement
    if (glow) {
      gsap.set(glow, { opacity: 0 })
      burstTl.fromTo(glow,
        { opacity: 0 },
        { opacity: 1, duration: 0.1 },
        f.delay
      )
      burstTl.to(glow,
        {
          opacity: 0,
          boxShadow: '0 0 15px rgba(255, 100, 100, 0.5), 0 0 30px rgba(200, 60, 60, 0.3)',
        },
        f.delay + 0.2
      )
      burstTl.to(glow, { opacity: 0, duration: 0.6 }, f.delay + 0.3)
    }
  })

  cleanupFns.push(() => burstTl.kill())
  cleanupFns.push(() => burstTl.scrollTrigger?.kill())

  // ========== 阶段3: 遗迹 ==========
  if (remnantRef.value) {
    gsap.set(remnantRef.value, { scale: 0, opacity: 0 })

    const remTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 10%',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    remTl.to(remnantRef.value, { scale: 1, opacity: 1, duration: 0.5 }, 0)

    // 核心脉动
    const core = remnantRef.value.querySelector('.remnant-core') as HTMLElement
    if (core) {
      const coreAnim = gsap.to(core, {
        scale: 1.4,
        opacity: 0.7,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      cleanupFns.push(() => coreAnim.kill())
    }

    // 光束旋转
    const beam = remnantRef.value.querySelector('.remnant-beam') as HTMLElement
    if (beam) {
      const beamAnim = gsap.to(beam, {
        rotation: 360,
        duration: 5,
        repeat: -1,
        ease: 'none',
      })
      cleanupFns.push(() => beamAnim.kill())
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
.pulsar-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #030308;
}

// 深空背景
.space-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, #0a0a25 0%, #050512 50%, #020208 100%);

  .nebula {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 35% 40%, rgba(100, 80, 180, 0.2) 0%, transparent 45%),
      radial-gradient(ellipse at 65% 65%, rgba(80, 100, 200, 0.15) 0%, transparent 40%);
  }

  .stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1.5px 1.5px at 20% 30%, rgba(255, 255, 255, 0.8), transparent),
      radial-gradient(1px 1px at 45% 70%, rgba(200, 210, 255, 0.6), transparent),
      radial-gradient(1.5px 1.5px at 70% 20%, rgba(255, 255, 255, 0.7), transparent),
      radial-gradient(1px 1px at 85% 80%, rgba(180, 200, 255, 0.5), transparent),
      radial-gradient(1px 1px at 30% 85%, rgba(255, 255, 255, 0.5), transparent);
  }
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
    filter: brightness(1) contrast(1.1);
  }
}

// 脉冲环
.pulse-overlay {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  mix-blend-mode: screen;

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    border: 2px solid rgba(120, 160, 255, 0.5);
    transform: translate(-50%, -50%);
  }

  .ring-1 {
    width: 250px;
    height: 250px;
    border-color: rgba(160, 190, 255, 0.6);
    box-shadow: 0 0 40px rgba(120, 160, 255, 0.4), 0 0 80px rgba(150, 120, 255, 0.3);
  }

  .ring-2 {
    width: 380px;
    height: 380px;
    border-color: rgba(140, 170, 255, 0.4);
    box-shadow: 0 0 60px rgba(120, 150, 255, 0.3);
  }

  .ring-3 {
    width: 510px;
    height: 510px;
    border-color: rgba(130, 160, 255, 0.25);
    box-shadow: 0 0 80px rgba(120, 140, 255, 0.2);
  }
}

// 碎片层
.frag-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  perspective: 2500px;
  transform-style: preserve-3d;
}

// 单个碎片
.frag {
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
    left: var(--bx);
    top: var(--by);
    object-fit: cover;
    filter: brightness(1.2) contrast(1.2) saturate(1.2);
  }

  .frag-glow {
    position: absolute;
    inset: -8px;
    background: linear-gradient(
      135deg,
      rgba(100, 150, 255, 0.9) 0%,
      rgba(150, 100, 255, 0.6) 50%,
      rgba(200, 80, 150, 0.4) 100%
    );
    box-shadow:
      0 0 30px rgba(100, 150, 255, 0.9),
      0 0 60px rgba(150, 100, 255, 0.6);
    mix-blend-mode: screen;
  }
}

// 激波
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
    border: 6px solid rgba(150, 190, 255, 0.95);
    box-shadow:
      0 0 80px rgba(120, 160, 255, 0.8),
      0 0 160px rgba(150, 120, 255, 0.5),
      inset 0 0 80px rgba(120, 160, 255, 0.4);
  }
}

// 遗迹核心
.remnant {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 180px;
  height: 180px;
  transform: translate(-50%, -50%);
  z-index: 20;
  pointer-events: none;

  .remnant-core {
    position: absolute;
    inset: 20%;
    background: radial-gradient(
      circle,
      rgba(220, 240, 255, 1) 0%,
      rgba(170, 200, 255, 0.9) 30%,
      rgba(120, 150, 255, 0.6) 60%,
      transparent 80%
    );
    border-radius: 50%;
    filter: blur(8px);
    box-shadow:
      0 0 100px rgba(120, 160, 255, 0.9),
      0 0 200px rgba(150, 120, 255, 0.6);
  }

  .remnant-beam {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(0deg, transparent 42%, rgba(150, 180, 255, 0.4) 48%, rgba(150, 180, 255, 0.6) 50%, rgba(150, 180, 255, 0.4) 52%, transparent 58%),
      linear-gradient(90deg, transparent 42%, rgba(150, 180, 255, 0.4) 48%, rgba(150, 180, 255, 0.6) 50%, rgba(150, 180, 255, 0.4) 52%, transparent 58%);
    border-radius: 50%;
    filter: blur(4px);
  }
}

// 光子背景
.photon-bg {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(150, 180, 255, 0.25) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, rgba(200, 150, 255, 0.2) 0%, transparent 35%);
}
</style>
