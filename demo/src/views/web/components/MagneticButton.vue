<template>
  <section class="magnetic-button-section-12" ref="section">
    <div class="content-12">
      <h2 class="section-title-12">磁性按钮</h2>
      <p class="subtitle-12">鼠标移动时按钮跟随磁性效果</p>
      
      <div class="buttons-container-12">
        <button class="magnetic-btn-12" ref="btn1">探索更多</button>
        <button class="magnetic-btn-12" ref="btn2">立即开始</button>
        <button class="magnetic-btn-12" ref="btn3">联系我们</button>
      </div>

      <div class="scroll-hint-12">
        <p>滚动查看效果</p>
        <div class="arrow-12"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const btn1 = ref<HTMLElement | null>(null)
const btn2 = ref<HTMLElement | null>(null)
const btn3 = ref<HTMLElement | null>(null)
const section = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const buttons = [btn1.value, btn2.value, btn3.value].filter(Boolean) as HTMLElement[]

    // 标题入场动画
    gsap.from('.section-title-12', {
      y: 100,
      opacity: 0,
      scale: 0.8,
      rotationX: -20,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: section.value,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 副标题入场动画
    gsap.from('.subtitle-12', {
      y: 80,
      opacity: 0,
      scale: 0.8,
      duration: 1.2,
      delay: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: section.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 按钮入场动画 - 更明显的效果
    gsap.from(buttons, {
      y: 200,
      opacity: 0,
      scale: 0.5,
      rotation: -15,
      duration: 1.5,
      stagger: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: section.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 滚动提示入场
    gsap.from('.scroll-hint-12', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })

    // 磁性效果
    buttons.forEach(btn => {
      const rect = btn.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      btn.addEventListener('mousemove', (e: MouseEvent) => {
        const offsetX = e.offsetX - centerX
        const offsetY = e.offsetY - centerY

        gsap.to(btn, {
          x: offsetX * 0.3,
          y: offsetY * 0.3,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        })
      })

      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.magnetic-button-section-12 {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.1), transparent 60%);
    pointer-events: none;
  }
}

.content-12 {
  text-align: center;
  position: relative;
  z-index: 1;
}

.section-title-12 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #c084fc, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle-12 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 60px;
}

.buttons-container-12 {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 60px;
}

.magnetic-btn-12 {
  position: relative;
  padding: 16px 40px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    box-shadow: 0 6px 30px rgba(124, 58, 237, 0.5);

    &::before {
      left: 100%;
    }
  }

  &:nth-child(2) {
    background: linear-gradient(135deg, #06b6d4, #3b82f6);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);

    &:hover {
      box-shadow: 0 6px 30px rgba(59, 130, 246, 0.5);
    }
  }

  &:nth-child(3) {
    background: linear-gradient(135deg, #ec4899, #f43f5e);
    box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);

    &:hover {
      box-shadow: 0 6px 30px rgba(236, 72, 153, 0.5);
    }
  }
}

.scroll-hint-12 {
  margin-top: 60px;
  color: #94a3b8;
  animation: bounce 2s infinite;

  .arrow-12 {
    width: 20px;
    height: 20px;
    margin: 10px auto 0;
    border-right: 2px solid white;
    border-bottom: 2px solid white;
    border-left: 2px solid transparent;
    border-top: 2px solid transparent;
    transform: rotate(45deg);
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}
</style>
