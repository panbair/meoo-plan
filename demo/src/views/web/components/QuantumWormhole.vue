<template>
  <section class="qw-section-100">
    <div class="qw-container-100">
      <h2 class="qw-title-100">量子虫洞</h2>
      <p class="qw-subtitle-100">穿越时空的无限维度</p>

      <div ref="wormholeContainer" class="qw-wormhole-container-100">
        <!-- 粒子系统 -->
        <div class="qw-particle-system-100">
          <div
            v-for="n in 300"
            :key="`particle-${n}`"
            class="qw-particle-100"
            :style="getParticleStyle(n)"
            :data-index="n"
          ></div>
        </div>

        <!-- 能量环 -->
        <div class="qw-energy-rings-100">
          <div
            v-for="n in 12"
            :key="`ring-${n}`"
            class="qw-energy-ring-100"
            :class="`qw-ring-${n}`"
            :style="getRingStyle(n)"
          ></div>
        </div>

        <!-- 量子核心 -->
        <div ref="quantumCore" class="qw-quantum-core-100">
          <div class="qw-core-glow-100"></div>
          <div class="qw-core-pulse-100"></div>
          <div class="qw-core-inner-100"></div>
          <div class="qw-nucleus-100"></div>
        </div>

        <!-- 维度裂缝 -->
        <div class="qw-dimensional-cracks-100">
          <div
            v-for="n in 8"
            :key="`crack-${n}`"
            class="qw-crack-100"
            :style="getCrackStyle(n)"
          ></div>
        </div>

        <!-- 时空涟漪 -->
        <div class="qw-spacetime-ripples-100">
          <div
            v-for="n in 5"
            :key="`ripple-${n}`"
            class="qw-ripple-100"
            :style="getRippleStyle(n)"
          ></div>
        </div>

        <!-- 光束效果 -->
        <div class="qw-light-beams-100">
          <div
            v-for="n in 6"
            :key="`beam-${n}`"
            class="qw-light-beam-100"
            :style="getBeamStyle(n)"
          ></div>
        </div>

        <!-- HUD 界面 -->
        <div class="qw-hud-100">
          <div class="qw-hud-item-100">
            <span class="qw-hud-label-100">量子态</span>
            <span class="qw-hud-value-100">{{ quantumState }}%</span>
          </div>
          <div class="qw-hud-item-100">
            <span class="qw-hud-label-100">能量波动</span>
            <span class="qw-hud-value-100">{{ energyFluctuation }}</span>
          </div>
          <div class="qw-hud-item-100">
            <span class="qw-hud-label-100">时空曲率</span>
            <span class="qw-hud-value-100">{{ spacetimeCurvature }}</span>
          </div>
        </div>
      </div>

      <!-- 交互提示 -->
      <div class="qw-interaction-hint-100">
        <span class="qw-hint-text-100">拖拽旋转虫洞 · 滚动穿越维度</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const wormholeContainer = ref<HTMLElement | null>(null)
const quantumCore = ref<HTMLElement | null>(null)
const quantumState = ref(0)
const energyFluctuation = ref(0)
const spacetimeCurvature = ref(0)

let ctx: gsap.Context
let isDragging = false
let startX = 0
let currentRotation = 0

const getParticleStyle = (index: number) => {
  const angle = Math.random() * 360
  const radius = 100 + Math.random() * 400
  const size = 1 + Math.random() * 3
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 3
  const hue = 200 + Math.random() * 60
  return {
    left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * radius}px)`,
    top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * radius}px)`,
    width: `${size}px`,
    height: `${size}px`,
    background: `hsla(${hue}, 100%, 70%, 0.8)`,
    boxShadow: `0 0 ${size * 2}px hsla(${hue}, 100%, 70%, 0.5)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const getRingStyle = (index: number) => {
  const size = 150 + index * 30
  const hue = 240 + index * 10
  return {
    width: `${size}px`,
    height: `${size}px`,
    borderColor: `hsla(${hue}, 100%, 60%, ${0.3 + index * 0.05})`,
    borderWidth: `${1 + index * 0.5}px`
  }
}

const getCrackStyle = (index: number) => {
  const angle = index * 45
  const length = 100 + Math.random() * 150
  return {
    transform: `rotate(${angle}deg) translateY(-${length}px)`,
    width: `${2 + Math.random() * 3}px`,
    height: `${length}px`
  }
}

const getRippleStyle = (index: number) => {
  const delay = index * 0.3
  const size = 200 + index * 100
  return {
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`
  }
}

const getBeamStyle = (index: number) => {
  const angle = index * 60
  const hue = 180 + index * 30
  return {
    transform: `rotate(${angle}deg)`,
    background: `linear-gradient(to bottom, transparent, hsla(${hue}, 100%, 70%, 0.6), transparent)`
  }
}

// 鼠标拖拽旋转
const handleMouseDown = (e: MouseEvent) => {
  isDragging = true
  startX = e.clientX
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging) return
  const deltaX = e.clientX - startX
  currentRotation += deltaX * 0.5
  startX = e.clientX
  gsap.to(wormholeContainer.value, {
    rotation: currentRotation,
    duration: 0.1
  })
}

const handleMouseUp = () => {
  isDragging = false
}

// 触摸支持
const handleTouchStart = (e: TouchEvent) => {
  isDragging = true
  startX = e.touches[0].clientX
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging) return
  // 检测是否在虫洞容器内
  const rect = wormholeContainer.value?.getBoundingClientRect()
  if (!rect) return

  // 只在容器范围内处理触摸，不阻止页面滚动
  const touchX = e.touches[0].clientX
  const touchY = e.touches[0].clientY

  if (touchX >= rect.left && touchX <= rect.right && touchY >= rect.top && touchY <= rect.bottom) {
    const deltaX = touchX - startX
    currentRotation += deltaX * 0.5
    startX = touchX
    gsap.to(wormholeContainer.value, {
      rotation: currentRotation,
      duration: 0.1
    })
  }
}

const handleTouchEnd = () => {
  isDragging = false
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场
    gsap.from('.qw-title-100', {
      scrollTrigger: {
        trigger: '.qw-section-100',
        start: 'top 90%'
      },
      y: -80,
      opacity: 0,
      scale: 1.5,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)'
    })

    // 副标题淡入
    gsap.from('.qw-subtitle-100', {
      scrollTrigger: {
        trigger: '.qw-section-100',
        start: 'top 85%'
      },
      y: -40,
      opacity: 0,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out'
    })

    // 虫洞容器 3D 效果
    gsap.from('.qw-wormhole-container-100', {
      scrollTrigger: {
        trigger: '.qw-wormhole-container-100',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      scale: 0.3,
      rotateX: 60,
      duration: 1,
      ease: 'power2.inOut'
    })

    // 能量环扩散
    gsap.from('.qw-energy-ring-100', {
      scrollTrigger: {
        trigger: '.qw-wormhole-container-100',
        start: 'top 75%'
      },
      scale: 0,
      opacity: 0,
      stagger: 0.08,
      duration: 1.5,
      ease: 'back.out(1.7)'
    })

    // 能量环持续旋转
    gsap.to('.qw-energy-ring-100', {
      rotation: 360,
      duration: 10 + Math.random() * 5,
      repeat: -1,
      ease: 'none',
      stagger: {
        each: 0.5,
        from: 'random'
      }
    })

    // 量子核心脉冲
    gsap.to('.qw-quantum-core-100', {
      scale: 1.2,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 核心光晕
    gsap.to('.qw-core-glow-100', {
      opacity: 0.3,
      scale: 1.5,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 粒子吸虫效果
    gsap.to('.qw-particle-100', {
      scale: 0,
      opacity: 0,
      duration: 3 + Math.random() * 2,
      repeat: -1,
      ease: 'power2.in',
      delay: Math.random() * 2
    })

    // 维度裂缝闪烁
    gsap.to('.qw-crack-100', {
      opacity: 1,
      scaleY: 1.2,
      duration: 0.3 + Math.random() * 0.4,
      repeat: -1,
      yoyo: true,
      ease: 'steps(1)',
      stagger: {
        each: 0.2,
        from: 'random'
      }
    })

    // 时空涟漪扩散
    gsap.to('.qw-ripple-100', {
      scale: 2,
      opacity: 0,
      duration: 2,
      repeat: -1,
      ease: 'power1.out',
      stagger: 0.4
    })

    // 光束闪烁
    gsap.to('.qw-light-beam-100', {
      opacity: 0.2,
      scaleY: 0.5,
      duration: 1 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.3,
        from: 'random'
      }
    })

    // HUD 数据动画
    gsap.to({}, {
      scrollTrigger: {
        trigger: '.qw-wormhole-container-100',
        start: 'top 70%',
        end: 'bottom 20%',
        scrub: true
      },
      onUpdate: () => {
        quantumState.value = Math.floor(70 + Math.random() * 30)
        energyFluctuation.value = (Math.random() * 10).toFixed(2)
        spacetimeCurvature.value = (Math.random() * 5).toFixed(3)
      }
    })

    // 滚动时粒子加速
    gsap.to('.qw-particle-100', {
      scrollTrigger: {
        trigger: '.qw-wormhole-container-100',
        start: 'top 60%',
        end: 'bottom 20%',
        scrub: true
      },
      scale: 0.3,
      duration: 1
    })

    // 交互提示淡入
    gsap.from('.qw-interaction-hint-100', {
      scrollTrigger: {
        trigger: '.qw-interaction-hint-100',
        start: 'top 95%'
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    })

    // 悬停时增强效果
    wormholeContainer.value?.addEventListener('mouseenter', () => {
      gsap.to('.qw-energy-ring-100', {
        scale: 1.1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out'
      })
    })

    wormholeContainer.value?.addEventListener('mouseleave', () => {
      gsap.to('.qw-energy-ring-100', {
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out'
      })
    })
  })

  // 添加鼠标事件监听
  wormholeContainer.value?.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  // 添加触摸事件监听（使用passive提高滚动性能）
  wormholeContainer.value?.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })
})

onUnmounted(() => {
  ctx?.revert()
  wormholeContainer.value?.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  wormholeContainer.value?.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<style scoped lang="scss">
.qw-section-100 {
  min-height: 100vh;
  padding: 100px 20px;
  background: radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 20%, rgba(0, 255, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(128, 0, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.qw-container-100 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.qw-title-100 {
  text-align: center;
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #00ffff 0%, #ff00ff 50%, #00ffff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;
  text-shadow: 0 0 50px rgba(0, 255, 255, 0.5);

  opacity: 1 !important;}

.qw-subtitle-100 {
  text-align: center;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 8px;
  text-transform: uppercase;

  opacity: 1 !important;}

.qw-wormhole-container-100 {
  position: relative;
  width: 100%;
  height: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1500px;
  cursor: grab;
  transform-style: preserve-3d;

  &:active {
    cursor: grabbing;
  
  opacity: 1 !important;}
}

.qw-particle-system-100 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.qw-particle-100 {
  position: absolute;
  border-radius: 50%;
  animation: particleFloat 3s ease-in-out infinite;
}

.qw-energy-rings-100 {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  opacity: 1 !important;}

.qw-energy-ring-100 {
  position: absolute;
  border-radius: 50%;
  border-style: solid;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.1);
}

.qw-quantum-core-100 {
  position: absolute;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  opacity: 1 !important;}

.qw-core-glow-100 {
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: corePulse 2s ease-in-out infinite;

  opacity: 1 !important;}

.qw-core-pulse-100 {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid rgba(0, 255, 255, 0.5);
  animation: pulseRing 1.5s ease-out infinite;

  opacity: 1 !important;}

.qw-core-inner-100 {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #00ffff 0%, #0088ff 100%);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.4);
  animation: innerGlow 1s ease-in-out infinite;

  opacity: 1 !important;}

.qw-nucleus-100 {
  position: absolute;
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #ffffff 0%, #00ffff 100%);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(0, 255, 255, 0.6);
  animation: nucleusPulse 0.5s ease-in-out infinite;

  opacity: 1 !important;}

.qw-dimensional-cracks-100 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.qw-crack-100 {
  position: absolute;
  top: 50%;
  left: 50%;
  background: linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.8), transparent);
  opacity: 0;
  animation: crackPulse 0.5s steps(1) infinite;
  transform-origin: top center;
}

.qw-spacetime-ripples-100 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.qw-ripple-100 {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(0, 255, 255, 0.3);
  opacity: 1;
  animation: rippleExpand 2s ease-out infinite;
}

.qw-light-beams-100 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.qw-light-beam-100 {
  position: absolute;
  top: 0;
  left: 50%;
  width: 4px;
  height: 100%;
  transform-origin: top center;
  opacity: 0.5;
  animation: beamPulse 2s ease-in-out infinite;
}

.qw-hud-100 {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 10;
}

.qw-hud-item-100 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  min-width: 200px;

  opacity: 1 !important;}

.qw-hud-label-100 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 2px;

  opacity: 1 !important;}

.qw-hud-value-100 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);

  opacity: 1 !important;}

.qw-interaction-hint-100 {
  text-align: center;
  margin-top: 60px;
  padding: 15px 30px;

  opacity: 1 !important;}

.qw-hint-text-100 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 4px;
  text-transform: uppercase;

  opacity: 1 !important;}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.2); }
}

@keyframes corePulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.5; }
}

@keyframes pulseRing {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes innerGlow {
  0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(0, 255, 255, 0.8); }
  50% { transform: scale(1.1); box-shadow: 0 0 50px rgba(0, 255, 255, 1); }
}

@keyframes nucleusPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

@keyframes crackPulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

@keyframes rippleExpand {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

@keyframes beamPulse {
  0%, 100% { opacity: 0.5; transform: scaleY(1); }
  50% { opacity: 0.8; transform: scaleY(0.5); }
}

@media (max-width: 768px) {
  .qw-title-100 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .qw-subtitle-100 {
    font-size: 1rem;
    letter-spacing: 4px;
  
  opacity: 1 !important;}

  .qw-wormhole-container-100 {
    height: 600px;
  
  opacity: 1 !important;}

  .qw-hud-100 {
    bottom: 10px;
    left: 10px;
    right: 10px;
  }

  .qw-hud-item-100 {
    padding: 8px 15px;
    min-width: auto;
  
  opacity: 1 !important;}

  .qw-hud-value-100 {
    font-size: 0.9rem;
  
  opacity: 1 !important;}
}
</style>
