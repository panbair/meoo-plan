<template>
  <section class="nv-nebula-section-64">
    <div class="nv-content-64">
      <h2 class="nv-section-title-64">星云漩涡</h2>
      <p class="nv-subtitle-64">宇宙深处的神秘旋转</p>

      <div ref="vortexContainer" class="nv-vortex-container-64">
        <!-- 背景星系 -->
        <div class="nv-galaxy-bg-64">
          <div class="nv-star-field-64">
            <div v-for="n in 200" :key="n" class="nv-star-64" :style="getStarStyle(n)"></div>
          </div>
        </div>

        <!-- 主漩涡 -->
        <div ref="vortexWrapper" class="nv-vortex-wrapper-64">
          <div
            v-for="n in 8"
            :key="`ring-${n}`"
            class="nv-vortex-ring-64"
            :class="`nv-ring-${n}`"
            :style="getRingStyle(n)"
          >
            <div class="nv-ring-particles-64">
              <div
                v-for="p in 12"
                :key="`particle-${p}`"
                class="nv-ring-particle-64"
                :style="getParticleInRingStyle(n, p)"
              ></div>
            </div>
          </div>
        </div>

        <!-- 中心黑洞 -->
        <div ref="blackHole" class="nv-black-hole-64">
          <div class="nv-event-horizon-64"></div>
          <div class="nv-accretion-disk-64"></div>
          <div class="nv-gravity-waves-64">
            <div
              v-for="n in 5"
              :key="`wave-${n}`"
              class="nv-gravity-wave-64"
              :style="getGravityWaveStyle(n)"
            ></div>
          </div>
        </div>

        <!-- 行星轨道 -->
        <div class="nv-orbit-system-64">
          <div
            v-for="n in 4"
            :key="`orbit-${n}`"
            class="nv-orbit-64"
            :class="`nv-orbit-${n}`"
            :style="getOrbitStyle(n)"
          >
            <div class="nv-planet-64" :style="getPlanetStyle(n)"></div>
          </div>
        </div>

        <!-- 流星 -->
        <div class="nv-meteor-system-64">
          <div
            v-for="n in 6"
            :key="`meteor-${n}`"
            class="nv-meteor-64"
            :style="getMeteorStyle(n)"
          ></div>
        </div>

        <!-- 光晕效果 -->
        <div class="nv-nebula-glow-64">
          <div
            v-for="n in 4"
            :key="`glow-${n}`"
            class="nv-glow-layer-64"
            :style="getGlowStyle(n)"
          ></div>
        </div>
      </div>

      <!-- 能量读数 -->
      <div class="nv-energy-readout-64">
        <div class="nv-readout-item-64">
          <span class="nv-readout-label-64">引力</span>
          <div class="nv-readout-bar-64">
            <div class="nv-readout-fill-64" :style="{ width: gravityEnergy + '%' }"></div>
          </div>
        </div>
        <div class="nv-readout-item-64">
          <span class="nv-readout-label-64">旋转</span>
          <div class="nv-readout-bar-64">
            <div class="nv-readout-fill-64" :style="{ width: rotationSpeed + '%' }"></div>
          </div>
        </div>
        <div class="nv-readout-item-64">
          <span class="nv-readout-label-64">能量</span>
          <div class="nv-readout-bar-64">
            <div class="nv-readout-fill-64" :style="{ width: energyLevel + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="nv-controls-64">
        <button class="nv-control-btn-64 nv-btn-primary-64" @click="toggleAnimation">
          {{ isRunning ? '暂停' : '启动' }}
        </button>
        <button class="nv-control-btn-64" @click="changeMode">切换模式</button>
        <button class="nv-control-btn-64" @click="toggleWarpSpace">曲速引擎</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const vortexContainer = ref<HTMLElement | null>(null)
const vortexWrapper = ref<HTMLElement | null>(null)
const blackHole = ref<HTMLElement | null>(null)

const isRunning = ref(true)
const gravityEnergy = ref(75)
const rotationSpeed = ref(60)
const energyLevel = ref(85)
const warpActive = ref(false)
let currentMode = 0
const modes = ['平静', '活跃', '狂暴']

let ctx: gsap.Context
let vortexTimeline: gsap.core.Timeline | null = null

const getStarStyle = (index: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = Math.random() * 3 + 1
  const delay = Math.random() * 3
  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`
  }
}

const getRingStyle = (index: number) => {
  const size = 150 + index * 80
  const hue = 240 + index * 30
  return {
    width: `${size}px`,
    height: `${size}px`,
    borderColor: `hsla(${hue}, 80%, 60%, 0.3)`
  }
}

const getParticleInRingStyle = (ringIndex: number, particleIndex: number) => {
  const angle = (particleIndex / 12) * 360
  const radius = 65 + ringIndex * 30
  return {
    '--angle': `${angle}deg`,
    '--radius': `${radius}px`
  }
}

const getGravityWaveStyle = (index: number) => {
  return {
    animationDelay: `${index * 0.3}s`
  }
}

const getOrbitStyle = (index: number) => {
  const size = 350 + index * 120
  const duration = 20 + index * 10
  return {
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${duration}s`
  }
}

const getPlanetStyle = (index: number) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3']
  const sizes = [20, 25, 18, 22]
  return {
    backgroundColor: colors[index],
    width: `${sizes[index]}px`,
    height: `${sizes[index]}px`
  }
}

const getMeteorStyle = (index: number) => {
  const top = Math.random() * 60
  const delay = Math.random() * 5
  return {
    top: `${top}%`,
    animationDelay: `${delay}s`
  }
}

const getGlowStyle = (index: number) => {
  const hue = 260 + index * 20
  const opacity = 0.3 - index * 0.05
  return {
    background: `radial-gradient(circle, hsla(${hue}, 80%, 60%, ${opacity}), transparent 70%)`,
    animationDelay: `${index * 0.5}s`
  }
}

const toggleAnimation = () => {
  isRunning.value = !isRunning.value
  if (isRunning.value) {
    vortexTimeline?.play()
    gsap.globalTimeline.play()
  } else {
    vortexTimeline?.pause()
    gsap.globalTimeline.pause()
  }
}

const changeMode = () => {
  currentMode = (currentMode + 1) % modes.length
  const mode = modes[currentMode]

  // 根据模式调整动画速度和强度
  const speeds = [1, 2, 4]
  const energyValues = [75, 60, 40]
  const rotationValues = [60, 80, 95]

  gsap.to([gravityEnergy, rotationSpeed, energyLevel], {
    value: [energyValues[currentMode], rotationValues[currentMode], energyValues[currentMode]],
    duration: 1
  })

  vortexTimeline?.timeScale(speeds[currentMode])
}

const toggleWarpSpace = () => {
  warpActive.value = !warpActive.value

  if (warpActive.value) {
    gsap.to('.nv-vortex-wrapper-64', {
      scale: 0.3,
      duration: 2,
      ease: 'power4.in'
    })
    gsap.to('.nv-star-64', {
      scale: 0,
      duration: 0.5,
      stagger: {
        each: 0.001,
        from: 'center'
      }
    })
  } else {
    gsap.to('.nv-vortex-wrapper-64', {
      scale: 1,
      duration: 2,
      ease: 'power4.out'
    })
    gsap.to('.nv-star-64', {
      scale: 1,
      duration: 0.5,
      stagger: {
        each: 0.001,
        from: 'edges'
      }
    })
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场
    gsap.from('.nv-section-title-64', {
      scrollTrigger: {
        trigger: '.nv-nebula-section-64',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 80,
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      ease: 'power3.out'
    })

    // 副标题
    gsap.from('.nv-subtitle-64', {
      scrollTrigger: {
        trigger: '.nv-nebula-section-64',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 漩涡环旋转
    gsap.utils.toArray('.nv-vortex-ring-64').forEach((ring: Element, index: number) => {
      gsap.to(ring, {
        rotation: 360,
        duration: 15 + index * 3,
        repeat: -1,
        ease: 'none',
        rotation: index % 2 === 0 ? 360 : -360
      })
    })

    // 环中粒子
    gsap.to('.nv-ring-particle-64', {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: 'none',
      stagger: 0.1
    })

    // 黑洞脉冲
    gsap.to('.nv-event-horizon-64', {
      scale: 1.1,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 吸积盘旋转
    gsap.to('.nv-accretion-disk-64', {
      rotation: 360,
      duration: 8,
      repeat: -1,
      ease: 'none'
    })

    // 引力波
    gsap.to('.nv-gravity-wave-64', {
      scale: 2,
      opacity: 0,
      duration: 2,
      repeat: -1,
      stagger: 0.4,
      ease: 'power2.out'
    })

    // 星星闪烁
    gsap.to('.nv-star-64', {
      opacity: 0.3,
      scale: 0.5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.1,
        from: 'random'
      }
    })

    // 行星轨道
    gsap.utils.toArray('.nv-orbit-64').forEach((orbit, index) => {
      gsap.to(orbit, {
        rotation: index % 2 === 0 ? 360 : -360,
        duration: 20 + index * 10,
        repeat: -1,
        ease: 'none'
      })
    })

    // 行星自转
    gsap.to('.nv-planet-64', {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: 'none'
    })

    // 流星
    gsap.utils.toArray('.nv-meteor-64').forEach((meteor, index) => {
      // 重置初始状态
      gsap.set(meteor, { opacity: 0, x: -100, y: Math.random() * 300 })

      // 流星动画
      gsap.timeline({ repeat: -1, delay: index * 0.8 })
        .to(meteor, {
          opacity: 1,
          duration: 0.1
        })
        .to(meteor, {
          x: 1200,
          y: () => 300 + Math.random() * 200,
          opacity: 0,
          duration: 3,
          ease: 'power1.in'
        })
    })

    // 光晕效果
    gsap.to('.nv-glow-layer-64', {
      scale: 1.3,
      opacity: 0.1,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 1
    })

    // 能量读数
    gsap.from('.nv-readout-item-64', {
      scrollTrigger: {
        trigger: '.nv-energy-readout-64',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      x: -50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out'
    })

    // 控制按钮
    gsap.from('.nv-control-btn-64', {
      scrollTrigger: {
        trigger: '.nv-controls-64',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    })

    // 滚动时整体缩放
    gsap.fromTo(
      '.nv-vortex-container-64',
      { scale: 0.5 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: '.nv-vortex-container-64',
          start: 'top bottom',
          end: 'center center',
          scrub: 1
        },
        ease: 'power1.inOut'
      }
    )
  })
})

onUnmounted(() => {
  ctx?.revert()
  vortexTimeline?.kill()
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped lang="scss">
.nv-nebula-section-64 {
  min-height: 100vh;
  padding: 80px 20px 100px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0a0a2a 70%, #050510 100%);

  opacity: 1 !important;}

.nv-content-64 {
  text-align: center;

  opacity: 1 !important;}

.nv-section-title-64 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

.nv-subtitle-64 {
  font-size: 1.2rem;
  color: #94a3b8;
  margin-bottom: 60px;
  letter-spacing: 3px;
  text-transform: uppercase;

  opacity: 1 !important;}

.nv-vortex-container-64 {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 700px;
  margin: 0 auto 60px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow:
    0 0 100px rgba(139, 92, 246, 0.2),
    inset 0 0 100px rgba(6, 182, 212, 0.1);

  opacity: 1 !important;}

.nv-galaxy-bg-64 {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, #0a0a1a 0%, #1a1a3a 100%);

  opacity: 1 !important;}

.nv-star-field-64 {
  position: absolute;
  inset: 0;
}

.nv-star-64 {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  animation: starTwinkle 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes starTwinkle {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(0.5);
  }
}

.nv-vortex-wrapper-64 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.nv-vortex-ring-64 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid;
  border-radius: 50%;
  transition: border-color 0.3s ease;

  opacity: 1 !important;}

.nv-ring-particles-64 {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.nv-ring-particle-64 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  transform: rotate(var(--angle)) translate(var(--radius));
  box-shadow: 0 0 10px currentColor;

  opacity: 1 !important;}

.nv-black-hole-64 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  z-index: 10;

  opacity: 1 !important;}

.nv-event-horizon-64 {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #000 0%, #0a0a1a 60%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.8);

  opacity: 1 !important;}

.nv-accretion-disk-64 {
  position: absolute;
  inset: -20px;
  background: conic-gradient(from 0deg, #8b5cf6, #06b6d4, #3b82f6, #8b5cf6);
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(5px);
}

.nv-gravity-waves-64 {
  position: absolute;
  inset: -40px;
}

.nv-gravity-wave-64 {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(139, 92, 246, 0.5);
  border-radius: 50%;
  animation: gravityWave 2s ease-out infinite;

  opacity: 1 !important;}

@keyframes gravityWave {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.nv-orbit-system-64 {
  position: absolute;
  inset: 0;
}

.nv-orbit-64 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;

  opacity: 1 !important;}

.nv-planet-64 {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  box-shadow: 0 0 20px currentColor;
  animation: planetRotate 3s linear infinite;
}

@keyframes planetRotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.nv-meteor-system-64 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nv-meteor-64 {
  position: absolute;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #fff);
  animation: meteorFly 3s ease-in infinite;
  transform-origin: left center;

  opacity: 1 !important;}

@keyframes meteorFly {
  0% {
    transform: translateX(-100px) translateY(0) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: translateX(1200px) translateY(300px) rotate(45deg);
    opacity: 0;
  }
}

.nv-nebula-glow-64 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.nv-glow-layer-64 {
  position: absolute;
  inset: -50px;
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes glowPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.1;
  }
}

.nv-energy-readout-64 {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 40px 0;
  flex-wrap: wrap;

  opacity: 1 !important;}

.nv-readout-item-64 {
  width: 200px;
  text-align: left;

  opacity: 1 !important;}

.nv-readout-label-64 {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;

  opacity: 1 !important;}

.nv-readout-bar-64 {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;

  opacity: 1 !important;}

.nv-readout-fill-64 {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  border-radius: 3px;
  transition: width 0.3s ease;

  opacity: 1 !important;}

.nv-controls-64 {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.nv-control-btn-64 {
  padding: 16px 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;

  opacity: 1 !important;}

.nv-control-btn-64:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  border-color: rgba(139, 92, 246, 0.5);
}

.nv-btn-primary-64 {
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  border-color: transparent;
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

.nv-btn-primary-64:hover {
  box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .nv-vortex-container-64 {
    height: 500px;
  
  opacity: 1 !important;}

  .nv-energy-readout-64 {
    gap: 20px;
  }

  .nv-readout-item-64 {
    width: 150px;
  
  opacity: 1 !important;}
}
</style>
