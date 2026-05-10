<template>
  <div class="blob-container" ref="containerRef">
    <div class="blob" ref="blobRef">
      <div class="blob-content">
        <span class="blob-icon">{{ icon }}</span>
        <span class="blob-text">{{ text }}</span>
      </div>
    </div>
    <div class="blob-particles" id="blobParticles"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Props {
  icon?: string
  text?: string
  morphSpeed?: number
  particleCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  icon: '🌊',
  text: 'Liquid',
  morphSpeed: 3,
  particleCount: 20
})

const containerRef = ref<HTMLElement>()
const blobRef = ref<HTMLElement>()
let ctx: gsap.Context

// 形状变换关键帧
const morphShapes = [
  { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
  { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
  { borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%' },
  { borderRadius: '60% 40% 60% 30% / 70% 30% 50% 60%' }
]

function createParticles() {
  const container = document.getElementById('blobParticles')
  if (!container) return

  for (let i = 0; i < props.particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'blob-particle'
    particle.style.left = Math.random() * 100 + '%'
    particle.style.top = Math.random() * 100 + '%'
    particle.style.animationDelay = Math.random() * 2 + 's'
    container.appendChild(particle)

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 50,
      y: (Math.random() - 0.5) * 50,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 形态变换动画
    const morphTl = gsap.timeline({ repeat: -1 })

    morphShapes.forEach((shape) => {
      morphTl.to(blobRef.value, {
        ...shape,
        duration: props.morphSpeed,
        ease: 'sine.inOut'
      })
    })

    // 颜色渐变
    gsap.to(blobRef.value, {
      background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #3b82f6)',
      backgroundSize: '300% 300%',
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 内部元素浮动
    gsap.to('.blob-content', {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 图标旋转
    gsap.to('.blob-icon', {
      rotate: 20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 创建粒子
    createParticles()

    // 鼠标交互
    containerRef.value?.addEventListener('mouseenter', () => {
      gsap.to(blobRef.value, {
        scale: 1.1,
        filter: 'brightness(1.2)',
        duration: 0.5,
        ease: 'back.out(1.7)'
      })
    })

    containerRef.value?.addEventListener('mouseleave', () => {
      gsap.to(blobRef.value, {
        scale: 1,
        filter: 'brightness(1)',
        duration: 0.5
      })
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.blob-container {
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.blob {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow:
    0 0 60px rgba(139, 92, 246, 0.4),
    inset 0 0 40px rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
  transition: all 0.5s;
}

.blob-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.blob-icon {
  font-size: 4rem;
  margin-bottom: 10px;
}

.blob-text {
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.blob-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.blob-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}
</style>
