<template>
  <section ref="sectionRef" class="solar-section">
    <!-- 星空背景 -->
    <div class="starfield">
      <div
        class="star"
        v-for="i in 200"
        :key="i"
        :style="{
          top: `${(i * 0.5) % 100}%`,
          left: `${((i * 1.3 + 17) % 100)}%`
        }"
      ></div>
    </div>

    <!-- 轨道 -->
    <div class="orbits">
      <div class="orbit orbit-1"></div>
      <div class="orbit orbit-2"></div>
      <div class="orbit orbit-3"></div>
      <div class="orbit orbit-4"></div>
      <div class="orbit orbit-5"></div>
    </div>

    <!-- 主容器 -->
    <div class="solar-container">
      <!-- 标题 -->
      <div ref="titleRef" class="solar-title-wrapper">
        <h1 class="solar-title">SOLAR</h1>
        <p class="solar-subtitle">COSMIC ORBITAL SYSTEM</p>
      </div>

      <!-- 行星卡片 -->
      <div class="solar-system">
        <!-- 太阳 -->
        <div ref="sunRef" class="sun">
          <div class="sun-core"></div>
          <div class="sun-corona"></div>
          <div class="sun-flare" v-for="i in 8" :key="i" :style="{ '--flare-index': i }"></div>
        </div>

        <!-- 行星 -->
        <div
          v-for="(planet, index) in planets"
          :key="planet.id"
          class="planet-orbit"
          :style="{ '--orbit-size': planet.orbitSize }"
        >
          <div
            class="planet-wrapper"
            :ref="el => setPlanetRef(index, el as HTMLElement)"
            :style="{ '--planet-color': planet.color }"
          >
            <div class="planet-card" :style="{ '--card-color': planet.color }">
              <div class="planet-surface">
                <div class="surface-layer" v-for="i in 3" :key="i" :style="{ '--layer-index': i }"></div>
              </div>
              <div class="planet-info">
                <span class="planet-icon">{{ planet.icon }}</span>
                <span class="planet-name">{{ planet.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动指示 -->
      <div class="scroll-hint">
        <div ref="scrollRingRef" class="hint-ring"></div>
        <span class="hint-text">SCROLL TO ORBIT</span>
      </div>
    </div>

    <!-- 流星 -->
    <div class="meteors">
      <div class="meteor" v-for="i in 5" :key="i" :style="{ '--meteor-index': i }"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Planet {
  id: string
  name: string
  icon: string
  color: string
  orbitSize: string
  speed: number
  size: number
}

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const sunRef = ref<HTMLElement | null>(null)
const scrollRingRef = ref<HTMLElement | null>(null)
const planetRefs = ref<HTMLElement[]>([])

const planets: Planet[] = [
  { id: 'mercury', name: 'MERCURY', icon: '☿️', color: '#b5b5b5', orbitSize: '180px', speed: 4, size: 20 },
  { id: 'venus', name: 'VENUS', icon: '♀️', color: '#e6c87a', orbitSize: '240px', speed: 6, size: 28 },
  { id: 'earth', name: 'EARTH', icon: '🌍', color: '#6b93d6', orbitSize: '320px', speed: 8, size: 30 },
  { id: 'mars', name: 'MARS', icon: '♂️', color: '#c1440e', orbitSize: '400px', speed: 10, size: 24 },
  { id: 'jupiter', name: 'JUPITER', icon: '♃', color: '#d8ca9d', orbitSize: '500px', speed: 14, size: 50 }
]

const setPlanetRef = (index: number, el: HTMLElement | null) => {
  if (el) planetRefs.value[index] = el
}

let cleanupFns: (() => void)[] = []

const initAnimations = () => {
  if (!sectionRef.value) return

  // 标题入场
  if (titleRef.value) {
    gsap.fromTo(
      titleRef.value,
      { opacity: 0, y: 80, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out'
      }
    )
  }

  // 太阳动画
  if (sunRef.value) {
    // 太阳脉冲
    gsap.to(sunRef.value.querySelector('.sun-core'), {
      scale: 1.1,
      boxShadow: '0 0 100px rgba(255, 200, 50, 0.8)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 日冕旋转
    gsap.to(sunRef.value.querySelector('.sun-corona'), {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none'
    })

    // 太阳耀斑
    const flares = sunRef.value.querySelectorAll('.sun-flare')
    flares.forEach((flare, i) => {
      gsap.to(flare, {
        scale: 1.5,
        opacity: 0.3,
        duration: 1 + Math.random(),
        repeat: -1,
        yoyo: true,
        delay: i * 0.2,
        ease: 'sine.inOut'
      })
    })

    cleanupFns.push(() => {
      gsap.killTweensOf(sunRef.value?.querySelector('.sun-core'))
      gsap.killTweensOf(sunRef.value?.querySelector('.sun-corona'))
      gsap.killTweensOf(flares)
    })
  }

  // 行星轨道旋转
  const orbits = sectionRef.value?.querySelectorAll('.orbit')
  if (orbits) {
    orbits.forEach((orbit, i) => {
      gsap.to(orbit, {
        rotation: 360,
        duration: 30 + i * 10,
        repeat: -1,
        ease: 'none'
      })
    })
    cleanupFns.push(() => gsap.killTweensOf(orbits))
  }

  // 行星卡片滚动动画
  planetRefs.value.forEach((planet, index) => {
    const planetData = planets[index]

    // 初始隐藏
    gsap.set(planet, {
      opacity: 0,
      scale: 0,
      rotation: -180
    })

    // 滚动入场
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1.5
      }
    })

    // 从轨道外飞入
    tl.to(planet, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 1
    })

    // 自转
    tl.to(planet, {
      rotation: 360,
      duration: 2,
      ease: 'none'
    }, 0)

    // 公转轨道动画
    const wrapper = planet.parentElement
    if (wrapper) {
      gsap.to(wrapper, {
        rotation: 360,
        duration: planetData.speed,
        repeat: -1,
        ease: 'none'
      })

      cleanupFns.push(() => gsap.killTweensOf(wrapper))
    }

    // 行星表面动画
    const surface = planet.querySelector('.planet-surface')
    if (surface) {
      gsap.to(surface, {
        backgroundPosition: '200% 200%',
        duration: 5 + index,
        repeat: -1,
        ease: 'none'
      })
      cleanupFns.push(() => gsap.killTweensOf(surface))
    }
  })

  // 星空闪烁
  const stars = sectionRef.value?.querySelectorAll('.star')
  if (stars) {
    stars.forEach((star, i) => {
      gsap.to(star, {
        opacity: Math.random() * 0.5 + 0.3,
        scale: Math.random() * 0.5 + 0.5,
        duration: 1 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
        ease: 'sine.inOut'
      })
    })
    cleanupFns.push(() => gsap.killTweensOf(stars))
  }

  // 流星动画
  const meteors = sectionRef.value?.querySelectorAll('.meteor')
  if (meteors) {
    meteors.forEach((meteor, i) => {
      gsap.fromTo(
        meteor,
        {
          x: -200,
          y: -200,
          opacity: 1
        },
        {
          x: window.innerWidth + 200,
          y: window.innerHeight + 200,
          opacity: 0,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          delay: i * 3 + Math.random() * 5,
          ease: 'none'
        }
      )
    })
    cleanupFns.push(() => gsap.killTweensOf(meteors))
  }

  // 滚动环指示
  if (scrollRingRef.value) {
    gsap.to(scrollRingRef.value, {
      scale: 1.5,
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: 'power2.out'
    })
    cleanupFns.push(() => gsap.killTweensOf(scrollRingRef.value))
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
.solar-section {
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at center, #0a0a1a 0%, #000005 100%);
  position: relative;
  overflow: hidden;
}

.starfield {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
}

.orbits {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.orbit-1 { width: 360px; height: 360px; }
.orbit-2 { width: 480px; height: 480px; }
.orbit-3 { width: 640px; height: 640px; }
.orbit-4 { width: 800px; height: 800px; }
.orbit-5 { width: 1000px; height: 1000px; }

.solar-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 60px 40px 40px;
  position: relative;
  z-index: 1;
}

.solar-title-wrapper {
  text-align: center;
  margin-bottom: 40px;
}

.solar-title {
  font-size: clamp(40px, 8vw, 80px);
  font-weight: 900;
  color: #fff;
  margin: 0;
  text-shadow:
    0 0 20px rgba(255, 200, 50, 0.8),
    0 0 40px rgba(255, 150, 0, 0.6);
  letter-spacing: 20px;
}

.solar-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 6px;
  margin-top: 16px;
}

.solar-system {
  position: relative;
  width: 100%;
  height: calc(100% - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sun {
  position: absolute;
  width: 100px;
  height: 100px;
  z-index: 10;
}

.sun-core {
  position: absolute;
  inset: 20px;
  background: radial-gradient(circle, #fff 0%, #ffd700 30%, #ff8c00 100%);
  border-radius: 50%;
  box-shadow: 0 0 60px rgba(255, 200, 50, 0.6);
}

.sun-corona {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(255, 200, 50, 0.3) 0%, transparent 70%);
  border-radius: 50%;
}

.sun-flare {
  position: absolute;
  width: 4px;
  height: 20px;
  background: linear-gradient(to top, transparent, #ffd700);
  top: 50%;
  left: 50%;
  transform-origin: center bottom;
  transform: translateX(-50%) rotate(calc(var(--flare-index) * 45deg)) translateY(-60px);
  opacity: 0.6;
}

.planet-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--orbit-size);
  height: var(--orbit-size);
  margin-top: calc(var(--orbit-size) / -2);
  margin-left: calc(var(--orbit-size) / -2);
}

.planet-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-right: 0;
}

.planet-card {
  width: calc(var(--size, 30px) * 2.5);
  height: calc(var(--size, 30px) * 3);
  position: relative;
  transform-origin: center bottom;
}

.planet-surface {
  width: 100%;
  height: calc(var(--size, 30px) * 2);
  background: linear-gradient(
    135deg,
    var(--planet-color) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    var(--planet-color) 100%
  );
  background-size: 200% 200%;
  border-radius: 50% 50% 40% 40%;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 0 30px var(--planet-color),
    inset 0 -20px 40px rgba(0, 0, 0, 0.3);
}

.surface-layer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, calc(0.1 / var(--layer-index))) 50%,
    transparent 100%
  );
}

.planet-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-top: 8px;
}

.planet-icon {
  font-size: 20px;
}

.planet-name {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 2px;
  font-weight: 600;
}

.scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.hint-ring {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 200, 50, 0.5);
  border-radius: 50%;
}

.hint-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 4px;
}

.meteors {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.meteor {
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(to right, transparent, #fff, #ffd700);
  opacity: 0;
  transform: rotate(45deg);
}
</style>
