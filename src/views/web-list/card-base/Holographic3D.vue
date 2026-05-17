<template>
  <section class="holographic-section-18" ref="section">
    <div class="content-18">
      <h2 class="section-title-18">全息3D</h2>
      <p class="subtitle-18">交互式3D全息效果</p>

      <div class="hologram-container-18" ref="container">
        <div class="hologram-base-18"></div>
        <div class="hologram-ring-18 ring-1" ref="ring1"></div>
        <div class="hologram-ring-18 ring-2" ref="ring2"></div>
        <div class="hologram-ring-18 ring-3" ref="ring3"></div>
        <div class="hologram-core-18" ref="core">
          <div class="core-inner-18"></div>
          <div class="core-glow-18"></div>
        </div>
    <div class="hologram-particles-18">
      <div class="particle-18" v-for="n in 24" :key="n" :style="getParticleStyle(n)"></div>
    </div>
      </div>

      <div class="interaction-hint-18">
        <p>💫 鼠标悬停触发全息效果</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const container = ref<HTMLElement | null>(null)
const ring1 = ref<HTMLElement | null>(null)
const ring2 = ref<HTMLElement | null>(null)
const ring3 = ref<HTMLElement | null>(null)
const core = ref<HTMLElement | null>(null)
const section = ref<HTMLElement | null>(null)

const getParticleStyle = (index: number) => {
  const angle = (index - 1) * 15
  const distance = 120 + Math.random() * 50
  const radians = angle * (Math.PI / 180)
  const x = distance * Math.cos(radians)
  const y = distance * Math.sin(radians)
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`
  }
}

let ctx: gsap.Context
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null
let mouseLeaveHandler: ((e: MouseEvent) => void) | null = null
let mouseEnterHandler: ((e: MouseEvent) => void) | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始化动画
    if (container.value) {
      gsap.from(container.value, {
        y: 150,
        opacity: 0,
        scale: 0.5,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: section.value,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 环的旋转动画
    const rings = [ring1.value, ring2.value, ring3.value].filter(Boolean) as HTMLElement[]
    gsap.to(rings, {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: 'none',
      stagger: 0.5
    })

    // 核心脉动
    const coreGlows = gsap.utils.toArray('.core-glow-18')
    gsap.to(coreGlows, {
      scale: 1.5,
      opacity: 0.5,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    // 粒子动画
    const particles = gsap.utils.toArray('.particle-18')
    gsap.to(particles, {
      y: -100,
      opacity: 0,
      duration: 2,
      stagger: 0.1,
      repeat: -1,
      ease: 'power1.out'
    })

    // 滚动效果
    gsap.to('.hologram-container-18', {
      y: -50,
      rotationY: 30,
      rotationX: -15,
      duration: 1,
      scrollTrigger: {
        trigger: '.holographic-section-18',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    // 鼠标交互
    if (container.value) {
      mouseEnterHandler = () => {
        gsap.to('.hologram-core-18', {
          scale: 1.3,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to('.hologram-ring-18', {
          borderColor: '#a78bfa',
          boxShadow: '0 0 30px rgba(167, 139, 250, 0.5)',
          duration: 0.5,
          ease: 'power2.out'
        })
      }

      mouseLeaveHandler = () => {
        gsap.to('.hologram-core-18', {
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })

        gsap.to('.hologram-ring-18', {
          borderColor: 'rgba(167, 139, 250, 0.3)',
          boxShadow: 'none',
          duration: 0.5,
          ease: 'power2.out'
        })
      }

      mouseMoveHandler = (e: MouseEvent) => {
        const rect = container.value!.getBoundingClientRect()
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const mouseX = e.clientX - rect.left - centerX
        const mouseY = e.clientY - rect.top - centerY

        gsap.to('.hologram-container-18', {
          rotationY: mouseX * 0.1,
          rotationX: -mouseY * 0.1,
          duration: 0.5,
          ease: 'power2.out'
        })
      }

      container.value.addEventListener('mouseenter', mouseEnterHandler)
      container.value.addEventListener('mouseleave', mouseLeaveHandler)
      container.value.addEventListener('mousemove', mouseMoveHandler)
    }
  })
})

onUnmounted(() => {
  if (container.value) {
    mouseMoveHandler && container.value.removeEventListener('mousemove', mouseMoveHandler)
    mouseLeaveHandler && container.value.removeEventListener('mouseleave', mouseLeaveHandler)
    mouseEnterHandler && container.value.removeEventListener('mouseenter', mouseEnterHandler)
  }
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.holographic-section-18 {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.12), transparent 60%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.content-18 {
  text-align: center;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.section-title-18 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #d8b4fe, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.subtitle-18 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 80px;

  opacity: 1 !important;}

.hologram-container-18 {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto 60px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.hologram-base-18 {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%) rotateX(80deg);
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%);
  border-radius: 50%;

  opacity: 1 !important;}

.hologram-ring-18 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid rgba(139, 92, 246, 0.3);
  transform-style: preserve-3d;

  opacity: 1 !important;}

.ring-1 {
  width: 280px;
  height: 280px;

  opacity: 1 !important;}

.ring-2 {
  width: 220px;
  height: 220px;

  opacity: 1 !important;}

.ring-3 {
  width: 160px;
  height: 160px;

  opacity: 1 !important;}

.hologram-core-18 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.core-inner-18 {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(167, 139, 250, 0.6),
              inset 0 0 20px rgba(255, 255, 255, 0.3);

  opacity: 1 !important;}

.core-glow-18 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.4), transparent 70%);
  border-radius: 50%;

  opacity: 1 !important;}

.hologram-particles-18 {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle-18 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #a78bfa;
  border-radius: 50%;
  box-shadow: 0 0 10px #a78bfa;

  opacity: 1 !important;}

@for $i from 1 through 24 {
  .particle-18:nth-child(#{$i}) {
    animation: particleFloat #{2 + random(2)}s infinite ease-in-out;
    animation-delay: #{random(2)}s;
  }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.interaction-hint-18 {
  color: #94a3b8;
  font-size: 0.9rem;
  animation: blink 3s infinite;

  opacity: 1 !important;}
</style>
