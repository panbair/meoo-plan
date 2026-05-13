<template>
  <div class="card-image-glacier-crevasse" ref="parentRef">
    <div class="scene-container" ref="sceneRef">
      <!-- 远景冰穹 -->
      <div class="ice-dome-layer" ref="iceDomeRef">
        <div class="dome-gradient"></div>
        <div class="dome-particles">
          <div v-for="i in 20" :key="i" class="dome-particle" :style="getDomeParticleStyle(i)"></div>
        </div>
      </div>

      <!-- 中远景冰层 -->
      <div class="ice-layer" ref="iceLayerRef">
        <div class="ice-cracks">
          <div class="crack crack-1"></div>
          <div class="crack crack-2"></div>
          <div class="crack crack-3"></div>
        </div>
        <div class="ice-bubbles">
          <div v-for="i in 15" :key="i" class="bubble" :style="getBubbleStyle(i)"></div>
        </div>
      </div>

      <!-- 中近景冰裂隙主体 -->
      <div class="crevasse-container" ref="crevasseRef">
        <div class="crevasse-frame">
          <div class="crevasse-body">
            <!-- 冰裂隙边框效果 -->
            <div class="crevasse-border"></div>
            
            <!-- 主图 -->
            <div class="crevasse-image-wrapper" ref="imageWrapperRef">
              <img
                ref="imageRef"
                :src="imageUrl"
                :alt="title"
                class="crevasse-image"
              />
            </div>

            <!-- 冰霜覆盖层 -->
            <div class="frost-overlay" ref="frostRef"></div>

            <!-- 蓝冰纹理 -->
            <div class="ice-texture" ref="iceTextureRef"></div>

            <!-- 极光效果 -->
            <div class="aurora-effect" ref="auroraRef"></div>
          </div>
        </div>
      </div>

      <!-- 近景冰晶 -->
      <div class="crystal-layer" ref="crystalLayerRef">
        <div
          v-for="i in 60"
          :key="i"
          class="ice-crystal"
          :ref="el => { if (el) crystalRefs[i - 1] = el as HTMLElement }"
          :style="getCrystalStyle(i)"
        ></div>
      </div>

      <!-- 光柱效果 -->
      <div class="light-column" ref="lightColumnRef"></div>
    </div>

    <!-- 内容 -->
    <div class="content-overlay" ref="contentRef">
      <h2 class="title">{{ title }}</h2>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = { revert: () => void }

const props = withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  imageUrl: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80',
  title: '冰渊裂隙',
  subtitle: '极地冰川三维视差'
})

const parentRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const iceDomeRef = ref<HTMLElement | null>(null)
const iceLayerRef = ref<HTMLElement | null>(null)
const crevasseRef = ref<HTMLElement | null>(null)
const imageWrapperRef = ref<HTMLElement | null>(null)
const frostRef = ref<HTMLElement | null>(null)
const iceTextureRef = ref<HTMLElement | null>(null)
const auroraRef = ref<HTMLElement | null>(null)
const crystalLayerRef = ref<HTMLElement | null>(null)
const lightColumnRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)

const crystalRefs = ref<(HTMLElement | null)[]>([])

let cleanupFns: TweenCleanup[] = []

const getDomeParticleStyle = (i: number) => ({
  left: `${(i * 5.3) % 100}%`,
  top: `${(i * 7.1) % 100}%`,
  animationDelay: `${(i * 0.3) % 3}s`,
  width: `${Math.random() * 3 + 1}px`,
  height: `${Math.random() * 3 + 1}px`
})

const getBubbleStyle = (i: number) => ({
  left: `${10 + (i * 6.2) % 80}%`,
  top: `${10 + (i * 8.3) % 70}%`,
  width: `${Math.random() * 8 + 4}px`,
  height: `${Math.random() * 8 + 4}px`,
  animationDelay: `${(i * 0.4) % 4}s`
})

const getCrystalStyle = (i: number) => {
  const size = Math.random() * 4 + 1
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 4 + 4}s`
  }
}

onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    // ========== 远景冰穹下沉 ==========
    if (iceDomeRef.value) {
      const domeTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({ revert: () => domeTl.kill() })

      domeTl.fromTo(iceDomeRef.value,
        { y: -100, opacity: 0.4 },
        { y: 50, opacity: 0.8, ease: 'none' },
        0
      )
    }

    // ========== 中远景冰层旋转 ==========
    if (iceLayerRef.value) {
      const iceTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({ revert: () => iceTl.kill() })

      iceTl.fromTo(iceLayerRef.value,
        { y: -60, rotateY: -2 },
        { y: 80, rotateY: 2, ease: 'sine.inOut' },
        0
      )
    }

    // ========== 冰裂隙主体动画 ==========
    if (crevasseRef.value && imageRef.value) {
      const crevasseTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({ revert: () => crevasseTl.kill() })

      // 冰裂隙下沉 + 倾摆
      crevasseTl.fromTo(crevasseRef.value,
        { y: -40, rotateX: -1, rotateY: -0.5 },
        { y: 60, rotateX: 1, rotateY: 0.5, ease: 'sine.inOut' },
        0
      )

      // 图片清晰度变化
      crevasseTl.fromTo(imageRef.value,
        { filter: 'brightness(1.0) contrast(1.0) saturate(1.0)' },
        { filter: 'brightness(0.85) contrast(1.1) saturate(0.8)', ease: 'sine.inOut' },
        0
      )
    }

    // ========== 冰霜层融化 ==========
    if (frostRef.value) {
      const frostTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({ revert: () => frostTl.kill() })

      frostTl.fromTo(frostRef.value,
        { opacity: 0.5, scale: 1 },
        { opacity: 0, scale: 1.1, ease: 'power2.out' },
        0
      )
    }

    // ========== 蓝冰纹理显现 ==========
    if (iceTextureRef.value) {
      const textureTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({ revert: () => textureTl.kill() })

      textureTl.fromTo(iceTextureRef.value,
        { opacity: 0 },
        { opacity: 0.15, ease: 'sine.inOut' },
        0
      )
    }

    // ========== 极光效果 ==========
    if (auroraRef.value) {
      const auroraTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({ revert: () => auroraTl.kill() })

      auroraTl.fromTo(auroraRef.value,
        { opacity: 0, x: -50 },
        { opacity: 0.4, x: 50, ease: 'sine.inOut' },
        0
      )
    }

    // ========== 光柱扫描 ==========
    if (lightColumnRef.value) {
      const lightTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({ revert: () => lightTl.kill() })

      lightTl.fromTo(lightColumnRef.value,
        { x: 300, y: -100, opacity: 0.1, rotate: -20 },
        { x: -300, y: 100, opacity: 0.3, rotate: -20, ease: 'sine.inOut' },
        0
      )
    }

    // ========== 近景冰晶上浮 ==========
    if (crystalLayerRef.value) {
      const crystalTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({ revert: () => crystalTl.kill() })

      crystalTl.fromTo(crystalLayerRef.value,
        { y: 50 },
        { y: -300, ease: 'none' },
        0
      )
    }

    // 冰晶独立闪烁
    crystalRefs.value.forEach((crystal) => {
      if (!crystal) return

      const flickerTl = gsap.timeline({ repeat: -1 })
      flickerTl
        .to(crystal, { opacity: 0.8, duration: 0.5 + Math.random() * 0.5, ease: 'power2.in' })
        .to(crystal, { opacity: 0.2, duration: 0.5 + Math.random() * 0.5, ease: 'power2.out' })

      cleanupFns.push({ revert: () => flickerTl.kill() })
    })

    // ========== 内容入场 ==========
    if (contentRef.value) {
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1
        }
      })

      cleanupFns.push({ revert: () => contentTl.kill() })

      contentTl.fromTo(contentRef.value,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, ease: 'power3.out' },
        0
      )
    }

  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert?.())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.card-image-glacier-crevasse {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg,
    #020810 0%,
    #051525 20%,
    #0a2840 40%,
    #051525 60%,
    #020810 100%
  );
}

.scene-container {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 2000px;
  overflow: hidden;
}

// ========== 远景冰穹 ==========
.ice-dome-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.4;
  overflow: hidden;

  .dome-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 120% 60% at 50% -20%, rgba(30, 80, 140, 0.5) 0%, transparent 70%),
      radial-gradient(ellipse 80% 40% at 30% 10%, rgba(20, 60, 120, 0.4) 0%, transparent 50%),
      radial-gradient(ellipse 80% 40% at 70% 20%, rgba(25, 70, 130, 0.35) 0%, transparent 50%);
  }
}

.dome-particles {
  position: absolute;
  inset: 0;
}

.dome-particle {
  position: absolute;
  background: radial-gradient(circle, rgba(100, 180, 255, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: domeFloat 6s ease-in-out infinite;
}

@keyframes domeFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
}

// ========== 中远景冰层 ==========
.ice-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
  transform-style: preserve-3d;
}

.ice-cracks {
  position: absolute;
  inset: 0;
}

.crack {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.3), transparent);
  height: 1px;
  transform-origin: left center;

  &-1 {
    top: 20%;
    left: 10%;
    width: 40%;
    transform: rotate(-5deg);
  }

  &-2 {
    top: 45%;
    left: 50%;
    width: 35%;
    transform: rotate(8deg);
  }

  &-3 {
    top: 70%;
    left: 15%;
    width: 50%;
    transform: rotate(-3deg);
  }
}

.ice-bubbles {
  position: absolute;
  inset: 0;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(150, 220, 255, 0.4) 0%, transparent 60%);
  border: 1px solid rgba(100, 180, 255, 0.2);
  animation: bubbleGlow 5s ease-in-out infinite;
}

@keyframes bubbleGlow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

// ========== 冰裂隙主体 ==========
.crevasse-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  perspective: 1500px;
}

.crevasse-frame {
  position: relative;
  width: 80vw;
  max-width: 1000px;
  aspect-ratio: 16 / 10;
  transform-style: preserve-3d;
}

.crevasse-body {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg,
    #0a2035 0%,
    #061525 30%,
    #0a2840 50%,
    #061525 70%,
    #0a2035 100%
  );
  border-radius: 8px;
  box-shadow:
    0 0 100px rgba(20, 80, 140, 0.6),
    inset 0 0 60px rgba(0, 40, 80, 0.5),
    0 0 200px rgba(30, 100, 160, 0.3);
  overflow: hidden;
}

.crevasse-border {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 3px solid transparent;
  border-image: linear-gradient(
    160deg,
    rgba(80, 180, 255, 0.6) 0%,
    rgba(40, 120, 200, 0.3) 30%,
    rgba(80, 180, 255, 0.5) 70%,
    rgba(40, 120, 200, 0.3) 100%
  ) 1;

  &::after {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 4px;
    border: 1px solid rgba(100, 200, 255, 0.2);
  }
}

.crevasse-image-wrapper {
  position: absolute;
  inset: 16px;
  border-radius: 4px;
  overflow: hidden;
  background: #000;
}

.crevasse-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.0) contrast(1.0) saturate(1.0);
}

// 冰霜覆盖层
.frost-overlay {
  position: absolute;
  inset: 16px;
  border-radius: 4px;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(200, 240, 255, 0.3) 0%, transparent 40%),
    radial-gradient(ellipse at 70% 60%, rgba(180, 230, 255, 0.25) 0%, transparent 35%),
    radial-gradient(ellipse at 50% 80%, rgba(200, 240, 255, 0.2) 0%, transparent 30%),
    linear-gradient(180deg, rgba(200, 240, 255, 0.15) 0%, transparent 20%);
  opacity: 0.5;
  pointer-events: none;
  mix-blend-mode: screen;
}

// 蓝冰纹理
.ice-texture {
  position: absolute;
  inset: 16px;
  border-radius: 4px;
  background:
    radial-gradient(ellipse at 25% 25%, rgba(60, 160, 220, 0.2) 0%, transparent 30%),
    radial-gradient(ellipse at 75% 35%, rgba(40, 140, 200, 0.15) 0%, transparent 25%),
    radial-gradient(ellipse at 50% 60%, rgba(80, 180, 240, 0.18) 0%, transparent 35%),
    radial-gradient(ellipse at 30% 75%, rgba(50, 150, 210, 0.12) 0%, transparent 28%),
    radial-gradient(ellipse at 65% 70%, rgba(60, 160, 220, 0.15) 0%, transparent 32%);
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: color-dodge;
}

// 极光效果
.aurora-effect {
  position: absolute;
  inset: 16px;
  border-radius: 4px;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(100, 255, 200, 0.1) 30%,
    rgba(80, 200, 255, 0.15) 50%,
    rgba(60, 180, 240, 0.1) 70%,
    transparent 100%
  );
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

// ========== 近景冰晶 ==========
.crystal-layer {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.ice-crystal {
  position: absolute;
  background: radial-gradient(circle, rgba(200, 250, 255, 0.9) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  animation: crystalFloat 6s ease-in-out infinite;
}

@keyframes crystalFloat {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0.8);
  }
  20% { opacity: 0.9; }
  50% {
    opacity: 0.4;
    transform: translateY(-50px) translateX(15px) scale(1);
  }
  80% { opacity: 0.7; }
}

// ========== 光柱 ==========
.light-column {
  position: absolute;
  width: 300px;
  height: 150%;
  top: -25%;
  left: 50%;
  background: linear-gradient(
    160deg,
    rgba(150, 230, 255, 0.15) 0%,
    rgba(100, 200, 255, 0.08) 40%,
    transparent 100%
  );
  opacity: 0.1;
  pointer-events: none;
  transform-origin: top center;
  filter: blur(20px);
}

// ========== 内容层 ==========
.content-overlay {
  position: absolute;
  bottom: 15vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  opacity: 0;
}

.title {
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: transparent;
  background: linear-gradient(135deg,
    #e0f4ff 0%,
    #a8e0ff 25%,
    #70c8ff 50%,
    #a8e0ff 75%,
    #e0f4ff 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  letter-spacing: 0.5em;
  text-shadow: 0 0 60px rgba(100, 200, 255, 0.5);
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 0 30px rgba(100, 200, 255, 0.4));
}

.subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  color: rgba(160, 220, 255, 0.8);
  letter-spacing: 0.6em;
  font-weight: 300;
  text-shadow: 0 0 20px rgba(100, 200, 255, 0.3);
}
</style>
