<template>
  <section class="morphing-section-20">
    <div class="content-20">
      <h2 class="section-title-20">变形几何</h2>
      <p class="subtitle-20">平滑的形状变形动画</p>

      <div class="shapes-container-20">
        <div class="shape-wrapper-20" v-for="(shape, index) in shapes" :key="index" :ref="el => shapeRefs[index] = el">
          <div class="morphing-shape-20" :class="`shape-${index + 1}`"></div>
        </div>
      </div>

      <div class="shape-description-20">
        <p>✨ 滚动查看形状变换 ✨</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const shapeRefs = ref<(HTMLElement | null)[]>([])

const shapes = [
  { color: '#a78bfa', from: 'circle', to: 'square' },
  { color: '#60a5fa', from: 'triangle', to: 'hexagon' },
  { color: '#f472b6', from: 'square', to: 'circle' },
  { color: '#34d399', from: 'pentagon', to: 'triangle' },
  { color: '#fbbf24', from: 'hexagon', to: 'pentagon' },
  { color: '#f87171', from: 'star', to: 'circle' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    shapeRefs.value.forEach((wrapper, index) => {
      if (!wrapper) return

      const shape = wrapper.querySelector('.morphing-shape-20') as HTMLElement

      // 入场动画
      gsap.from(shape, {
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      })

      // 形状变形动画
      const radiusValues = [
        [50, 50, 50, 50], // circle
        [0, 0, 0, 0],    // square
        [50, 50, 50, 50, 50], // pentagon
        [50, 50, 50, 50, 50, 50] // hexagon
      ]

      // 旋转和缩放动画
      gsap.to(shape, {
        rotation: 360,
        scale: 1.2,
        duration: 2,
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      })

      // 悬停效果
      wrapper.addEventListener('mouseenter', () => {
        gsap.to(shape, {
          scale: 1.5,
          duration: 0.5,
          ease: 'power2.out',
          boxShadow: '0 0 40px currentColor'
        })
      })

      wrapper.addEventListener('mouseleave', () => {
        gsap.to(shape, {
          scale: 1.2,
          duration: 0.5,
          ease: 'power2.out',
          boxShadow: 'none'
        })
      })

      // 持续的脉动效果
      gsap.to(shape, {
        scale: 1.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.morphing-section-20 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, transparent, rgba(167, 139, 250, 0.03), transparent);

  opacity: 1 !important;}

.content-20 {
  text-align: center;

  opacity: 1 !important;}

.section-title-20 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 300% 300%;
  animation: gradientShift 3s ease infinite;

  opacity: 1 !important;}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.subtitle-20 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 80px;

  opacity: 1 !important;}

.shapes-container-20 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 1000px;
  margin: 0 auto 60px;

  opacity: 1 !important;}

.shape-wrapper-20 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;

  opacity: 1 !important;}

.morphing-shape-20 {
  width: 120px;
  height: 120px;
  transition: all 0.5s ease;
  position: relative;

  opacity: 1 !important;}

.shape-1 {
  background: linear-gradient(135deg, #a78bfa, #818cf8);
  border-radius: 50%;
  animation: morph1 4s ease-in-out infinite;

  opacity: 1 !important;}

.shape-2 {
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: morph2 4s ease-in-out infinite;

  opacity: 1 !important;}

.shape-3 {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  border-radius: 10px;
  animation: morph3 4s ease-in-out infinite;

  opacity: 1 !important;}

.shape-4 {
  background: linear-gradient(135deg, #34d399, #10b981);
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  animation: morph4 4s ease-in-out infinite;

  opacity: 1 !important;}

.shape-5 {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  animation: morph5 4s ease-in-out infinite;

  opacity: 1 !important;}

.shape-6 {
  background: linear-gradient(135deg, #f87171, #ef4444);
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: morph6 4s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes morph1 {
  0%, 100% {
    border-radius: 50%;
    transform: rotate(0deg);
  }
  50% {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    transform: rotate(180deg);
  }
}

@keyframes morph2 {
  0%, 100% {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    transform: scale(1);
  }
  50% {
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    transform: scale(1.2);
  }
}

@keyframes morph3 {
  0%, 100% {
    border-radius: 10px;
    transform: rotate(0deg);
  }
  50% {
    border-radius: 50%;
    transform: rotate(45deg);
  }
}

@keyframes morph4 {
  0%, 100% {
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
    transform: rotate(0deg);
  }
  50% {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    transform: rotate(180deg);
  }
}

@keyframes morph5 {
  0%, 100% {
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  }
  50% {
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  }
}

@keyframes morph6 {
  0%, 100% {
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    transform: scale(1);
  }
  50% {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    transform: scale(1.3);
  }
}

.shape-description-20 {
  color: #94a3b8;
  font-size: 0.9rem;
  letter-spacing: 2px;
  animation: pulse 2s infinite;

  opacity: 1 !important;}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .shapes-container-20 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
