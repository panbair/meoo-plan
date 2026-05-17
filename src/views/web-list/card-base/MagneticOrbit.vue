<template>
  <section class="mo-section-101">
    <div class="mo-container-101">
      <h2 class="mo-title-101">磁力轨道</h2>
      <p class="mo-subtitle-101">基于物理引力的精准运动</p>

      <div ref="orbitContainer" class="mo-orbit-container-101">
        <!-- 中央磁体 -->
        <div ref="magnet" class="mo-magnet-101">
          <div class="mo-magnet-core-101"></div>
          <div class="mo-magnet-field-101"></div>
        </div>

        <!-- 轨道系统 -->
        <div
          v-for="(orbit, index) in orbits"
          :key="`orbit-${index}`"
          class="mo-orbit-101"
          :style="{ width: `${orbit.radius * 2}px`, height: `${orbit.radius * 2}px` }"
        >
          <div class="mo-orbit-path-101"></div>

          <!-- 行星 -->
          <div
            v-for="planet in orbit.planets"
            :key="`planet-${planet.id}`"
            class="mo-planet-101"
            :class="`mo-planet-${planet.id}`"
            :style="{ 
              left: '50%',
              top: '50%',
              '--angle': `${planet.angle}deg`,
              '--orbit-radius': `${orbit.radius}px`
            }"
          >
            <div class="mo-planet-body-101" :style="getPlanetStyle(planet)"></div>
            <div class="mo-planet-glow-101"></div>
            <div class="mo-planet-trail-101" ref="trails">
              <div v-for="n in 20" :key="n" class="mo-trail-segment-101"></div>
            </div>
          </div>
        </div>

        <!-- 重力波 -->
        <div class="mo-gravity-waves-101">
          <div v-for="n in 3" :key="`wave-${n}`" class="mo-gravity-wave-101"></div>
        </div>
      </div>

      <!-- 物理参数面板 -->
      <div class="mo-physics-panel-101">
        <div class="mo-param-101">
          <span class="mo-param-label-101">轨道速度</span>
          <div class="mo-param-bar-101">
            <div class="mo-param-fill-101" ref="velocityBar"></div>
          </div>
        </div>
        <div class="mo-param-101">
          <span class="mo-param-label-101">引力强度</span>
          <div class="mo-param-bar-101">
            <div class="mo-param-fill-101" ref="gravityBar"></div>
          </div>
        </div>
        <div class="mo-param-101">
          <span class="mo-param-label-101">动能</span>
          <div class="mo-param-bar-101">
            <div class="mo-param-fill-101" ref="momentumBar"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const orbitContainer = ref<HTMLElement | null>(null)
const magnet = ref<HTMLElement | null>(null)
const trails = ref<HTMLElement[]>([])
const velocityBar = ref<HTMLElement | null>(null)
const gravityBar = ref<HTMLElement | null>(null)
const momentumBar = ref<HTMLElement | null>(null)

interface Planet {
  id: number
  angle: number
  speed: number
  size: number
  color: string
  mass: number
}

interface Orbit {
  radius: number
  planets: Planet[]
}

// 基于开普勒定律的轨道参数
const orbits = ref<Orbit[]>([
  {
    radius: 120,
    planets: [
      { id: 1, angle: 0, speed: 1.8, size: 16, color: '#ff6b6b', mass: 1 }
    ]
  },
  {
    radius: 180,
    planets: [
      { id: 2, angle: 60, speed: 1.2, size: 24, color: '#4ecdc4', mass: 2 }
    ]
  },
  {
    radius: 260,
    planets: [
      { id: 3, angle: 120, speed: 0.8, size: 32, color: '#ffe66d', mass: 3 },
      { id: 4, angle: 240, speed: 0.9, size: 20, color: '#95e1d3', mass: 1.5 }
    ]
  },
  {
    radius: 360,
    planets: [
      { id: 5, angle: 180, speed: 0.5, size: 40, color: '#dda0dd', mass: 4 }
    ]
  }
])

const getPlanetStyle = (planet: Planet) => ({
  width: `${planet.size}px`,
  height: `${planet.size}px`,
  background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${darkenColor(planet.color, 0.4)})`,
  boxShadow: `0 0 ${planet.size}px ${planet.color}66`
})

const darkenColor = (color: string, factor: number) => {
  // 简单的颜色变暗处理
  return color
}

let ctx: gsap.Context
let planetTimelines: gsap.core.Timeline[] = []
let isPaused = false

// 基于物理定律的轨道运动
const createOrbitAnimation = (planet: Planet, orbitRadius: number, planetElement: HTMLElement) => {
  const timeline = gsap.timeline({ repeat: -1, paused: isPaused })
  const duration = 10 / planet.speed // 基于速度计算周期

  // 椭圆轨道模拟
  timeline.to(planetElement, {
    rotation: 360,
    duration: duration,
    ease: 'none'
  })

  return timeline
}

// 基于开普勒第二定律：近快远慢
const calculateVelocity = (distance: number) => {
  const baseVelocity = 100
  return baseVelocity / Math.sqrt(distance / 100)
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画 - 简洁有力
    gsap.from('.mo-title-101', {
      scrollTrigger: {
        trigger: '.mo-section-101',
        start: 'top 90%'
      },
      y: -60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from('.mo-subtitle-101', {
      scrollTrigger: {
        trigger: '.mo-section-101',
        start: 'top 85%'
      },
      y: -30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 中央磁体脉冲 - 模拟引力场
    gsap.to('.mo-magnet-101', {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    gsap.to('.mo-magnet-field-101', {
      scale: 1.2,
      opacity: 0.5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 轨道路径动画
    gsap.from('.mo-orbit-path-101', {
      scrollTrigger: {
        trigger: '.mo-orbit-container-101',
        start: 'top 80%'
      },
      scale: 0,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'back.out(1.2)'
    })

    // 行星入场动画 - 基于轨道半径的延迟
    orbits.value.forEach((orbit, orbitIndex) => {
      orbit.planets.forEach((planet, planetIndex) => {
        const planetElement = document.querySelector(`.mo-planet-${planet.id}`)
        if (!planetElement) return

        const totalDelay = orbitIndex * 0.3 + planetIndex * 0.1

        gsap.from(planetElement, {
          scrollTrigger: {
            trigger: '.mo-orbit-container-101',
            start: 'top 70%'
          },
          x: 0,
          y: 0,
          scale: 0,
          opacity: 0,
          duration: 1.5,
          delay: totalDelay,
          ease: 'elastic.out(1, 0.5)'
        })

        // 轨道运动
        const timeline = createOrbitAnimation(planet, orbit.radius, planetElement)
        planetTimelines.push(timeline)

        // 滚动时改变轨道速度
        gsap.to(timeline, {
          scrollTrigger: {
            trigger: '.mo-orbit-container-101',
            start: 'top 60%',
            end: 'bottom 20%',
            scrub: true
          },
          timeScale: 3,
          ease: 'power2.out'
        })
      })
    })

    // 重力波扩散 - 模拟引力波传播
    gsap.fromTo('.mo-gravity-wave-101',
      { scale: 0.5, opacity: 0.6 },
      {
        scale: 2.5,
        opacity: 0,
        duration: 3,
        repeat: -1,
        stagger: 1,
        ease: 'power1.out'
      }
    )

    // 轨迹拖尾效果
    const trailSegments = document.querySelectorAll('.mo-trail-segment-101')
    gsap.to(trailSegments, {
      opacity: 0,
      duration: 0.5,
      stagger: {
        each: 0.05,
        from: 'end',
        repeat: -1,
        repeatDelay: 0.1
      }
    })

    // 物理参数可视化 - 滚动驱动
    gsap.to(velocityBar.value, {
      scrollTrigger: {
        trigger: '.mo-orbit-container-101',
        start: 'top 60%',
        end: 'bottom 20%',
        scrub: true
      },
      width: '85%',
      ease: 'power2.out'
    })

    gsap.to(gravityBar.value, {
      scrollTrigger: {
        trigger: '.mo-orbit-container-101',
        start: 'top 60%',
        end: 'bottom 20%',
        scrub: true
      },
      width: '72%',
      ease: 'power2.out'
    })

    gsap.to(momentumBar.value, {
      scrollTrigger: {
        trigger: '.mo-orbit-container-101',
        start: 'top 60%',
        end: 'bottom 20%',
        scrub: true
      },
      width: '90%',
      ease: 'power2.out'
    })

    // 悬停暂停 - 交互设计
    orbitContainer.value?.addEventListener('mouseenter', () => {
      planetTimelines.forEach(t => t.timeScale(0.3))
    })

    orbitContainer.value?.addEventListener('mouseleave', () => {
      planetTimelines.forEach(t => t.timeScale(1))
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.mo-section-101 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0e27 0%, #1a1f3a 100%);
  position: relative;

  opacity: 1 !important;}

.mo-container-101 {
  max-width: 1000px;
  margin: 0 auto;

  opacity: 1 !important;}

.mo-title-101 {
  text-align: center;
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 15px;
  color: #fff;

  opacity: 1 !important;}

.mo-subtitle-101 {
  text-align: center;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 80px;
  letter-spacing: 6px;
  text-transform: uppercase;

  opacity: 1 !important;}

.mo-orbit-container-101 {
  position: relative;
  width: 100%;
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.mo-magnet-101 {
  position: absolute;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;

  opacity: 1 !important;}

.mo-magnet-core-101 {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #ffffff 0%, #e0e7ff 100%);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.mo-magnet-field-101 {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);

  opacity: 1 !important;}

.mo-orbit-101 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
}

.mo-orbit-path-101 {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.02);

  opacity: 1 !important;}

.mo-planet-101 {
  position: absolute;
  width: 0;
  height: 0;
  transform: rotate(var(--angle)) translate(var(--orbit-radius)) rotate(calc(-1 * var(--angle)));

  opacity: 1 !important;}

.mo-planet-body-101 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.mo-planet-glow-101 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;

  opacity: 1 !important;}

.mo-planet-trail-101 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 2px;
  transform-origin: right center;
  pointer-events: none;

  opacity: 1 !important;}

.mo-trail-segment-101 {
  position: absolute;
  right: 0;
  top: 0;
  width: 10px;
  height: 100%;
  background: linear-gradient(to left, rgba(255, 255, 255, 0.3), transparent);

  opacity: 1 !important;}

.mo-gravity-waves-101 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.mo-gravity-wave-101 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);

  opacity: 1 !important;}

.mo-physics-panel-101 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  opacity: 1 !important;}

.mo-param-101 {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mo-param-label-101 {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;

  opacity: 1 !important;}

.mo-param-bar-101 {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.mo-param-fill-101 {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.3s ease;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .mo-title-101 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .mo-subtitle-101 {
    font-size: 0.85rem;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .mo-orbit-container-101 {
    height: 500px;
  
  opacity: 1 !important;}

  .mo-physics-panel-101 {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
