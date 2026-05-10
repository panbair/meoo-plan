<template>
  <section class="sts-scroll-text-split-119">
    <div class="sts-container-119">
      <h2 class="sts-section-title-119">滚动文字拆分动画</h2>
      <p class="sts-section-subtitle-119">Scroll Text Split Animation</p>

      <div class="sts-content-119">
        <div v-for="(text, index) in textBlocks" :key="index" class="sts-text-block-119" ref="blocks">
          <div class="sts-text-content-119">
            <h3 class="sts-text-title-119">{{ text.title }}</h3>
            <p class="sts-text-description-119">{{ text.description }}</p>
          </div>
        </div>
      </div>

      <!-- 视觉装饰元素 -->
      <div class="sts-decoration-119">
        <div class="sts-circle-1"></div>
        <div class="sts-circle-2"></div>
        <div class="sts-circle-3"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const blocks = ref<HTMLElement[]>([])
const textBlocks = [
  {
    title: '创意无限',
    description: '打破常规思维，探索无限可能。每一帧都是艺术的展现，每一次滚动都是故事的延续。'
  },
  {
    title: '技术革新',
    description: '运用最前沿的动画技术，打造流畅自然的视觉体验。GSAP 让动画变得简单而强大。'
  },
  {
    title: '极致体验',
    description: '注重每一个细节，追求完美的用户体验。让用户在滚动中感受设计的温度与力量。'
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画 - 文字拆分效果
    const titleText = document.querySelector('.sts-section-title-119') as HTMLElement
    if (titleText) {
      const titleChars = titleText.textContent!.split('').map(char => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char
        span.style.display = 'inline-block'
        return span
      })

      titleText.innerHTML = ''
      titleChars.forEach(char => titleText.appendChild(char))

      gsap.fromTo(titleChars,
        { y: 100, opacity: 0, rotationX: -90 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.03,
          scrollTrigger: {
            trigger: '.sts-scroll-text-split-119',
            start: 'top 85%'
          }
        }
      )
    }

    // 副标题动画
    gsap.from('.sts-section-subtitle-119', {
      scrollTrigger: {
        trigger: '.sts-scroll-text-split-119',
        start: 'top 80%'
      },
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 文字块动画
    blocks.value.forEach((block, index) => {
      const title = block.querySelector('.sts-text-title-119') as HTMLElement
      const desc = block.querySelector('.sts-text-description-119') as HTMLElement

      // 设置初始状态
      gsap.set(block, { opacity: 0, y: 100, scale: 0.9, boxShadow: '0 0 0 rgba(167, 139, 250, 0)' })
      gsap.set(title, { y: 50, opacity: 0 })

      // 整体块容器入场
      gsap.to(block, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      })

      // 标题动画
      gsap.to(title, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: block,
          start: 'top 85%'
        }
      })

      // 描述文字渐入
      gsap.to(desc, {
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 75%'
        }
      })

      // 边框发光效果
      gsap.to(block, {
        boxShadow: '0 0 40px rgba(167, 139, 250, 0.3)',
        scrollTrigger: {
          trigger: block,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: true
        }
      })
    })

    // 装饰圆圈动画
    const circles = [
      document.querySelector('.sts-circle-1'),
      document.querySelector('.sts-circle-2'),
      document.querySelector('.sts-circle-3')
    ]

    circles.forEach((circle, index) => {
      if (circle) {
        gsap.set(circle, { scale: 0, opacity: 0 })
        gsap.to(circle, {
          scale: 1,
          opacity: 0.5,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.sts-content-119',
            start: 'top 90%'
          }
        })

        // 持续旋转
        gsap.to(circle, {
          rotation: 360,
          duration: 20 + index * 5,
          repeat: -1,
          ease: 'none'
        })
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.sts-scroll-text-split-119 {
  min-height: 100vh;
  padding: 80px 0;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
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
      radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(96, 165, 250, 0.06) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.sts-container-119 {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 30px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.sts-section-title-119 {
  text-align: center;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(240, 147, 251, 0.4);
  perspective: 1000px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.sts-section-subtitle-119 {
  text-align: center;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  opacity: 1 !important;}

.sts-content-119 {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.sts-text-block-119 {
  padding: 48px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(100px) scale(0.9);
  box-shadow: 0 0 0 rgba(167, 139, 250, 0);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #a78bfa, #60a5fa, #f472b6);
  }

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(167, 139, 250, 0.25);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }
}

.sts-text-title-119 {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.3;

  opacity: 1 !important;}

.sts-text-description-119 {
  font-size: 1rem;
  color: rgba(203, 213, 225, 0.9);
  line-height: 1.8;
  letter-spacing: 0.01em;

  opacity: 1 !important;}

.sts-decoration-119 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.sts-circle-1,
.sts-circle-2,
.sts-circle-3 {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(167, 139, 250, 0.25);

  opacity: 1 !important;}

.sts-circle-1 {
  width: 250px;
  height: 250px;
  top: 15%;
  right: -125px;

  opacity: 1 !important;}

.sts-circle-2 {
  width: 180px;
  height: 180px;
  top: 55%;
  left: -90px;

  opacity: 1 !important;}

.sts-circle-3 {
  width: 120px;
  height: 120px;
  top: 35%;
  right: 15%;
  border-color: rgba(96, 165, 250, 0.25);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .sts-text-block-119 {
    padding: 36px 24px;
  
  opacity: 1 !important;}

  .sts-section-title-119 {
    margin-bottom: 12px;
  }

  .sts-section-subtitle-119 {
    margin-bottom: 50px;
  }

  .sts-content-119 {
    gap: 40px;
  }

  .sts-container-119 {
    padding: 0 20px;
  
  opacity: 1 !important;}
}
</style>
