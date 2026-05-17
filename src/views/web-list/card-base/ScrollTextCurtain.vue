<template>
  <section class="stc-scroll-text-curtain-125">
    <div class="stc-container-125">
      <h2 class="stc-section-title-125">滚动文字幕帘</h2>
      <p class="stc-section-subtitle-125">Scroll Text Curtain Animation</p>

      <div class="stc-curtain-125">
        <div
          v-for="(text, index) in texts"
          :key="index"
          class="stc-curtain-panel-125"
          :ref="el => { if (el) panels[index] = el as HTMLElement }"
        >
          <div class="stc-curtain-left-125">
            <span class="stc-line-125"></span>
            <h3 class="stc-text-title-125">{{ text.title }}</h3>
            <p class="stc-text-desc-125">{{ text.description }}</p>
          </div>
          <div class="stc-curtain-right-125">
            <div class="stc-decor-circle-125"></div>
            <div class="stc-decor-ring-125"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const panels = ref<HTMLElement[]>([])

const texts = [
  {
    title: '创新的勇气',
    description: '在未知中探索，在挑战中成长，每一个想法都是一次突破的机会。'
  },
  {
    title: '设计的力量',
    description: '好的设计不仅是视觉的享受，更是思想的传递，情感的共鸣。'
  },
  {
    title: '技术的革新',
    description: '用代码编织梦想，用算法创造未来，技术与艺术完美融合。'
  },
  {
    title: '用户体验',
    description: '关注每一个细节，理解每一个需求，让技术服务于人性。'
  },
  {
    title: '持续进化',
    description: '在变化中保持初心，在学习中不断进步，永不止步。'
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画 - 幕帘拉开效果
    gsap.from('.stc-section-title-125', {
      scrollTrigger: {
        trigger: '.stc-scroll-text-curtain-125',
        start: 'top 90%'
      },
      clipPath: 'inset(0 100% 0 0)',
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    })

    // 副标题淡入
    gsap.from('.stc-section-subtitle-125', {
      scrollTrigger: {
        trigger: '.stc-scroll-text-curtain-125',
        start: 'top 85%'
      },
      x: -100,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    })

    // 延迟执行面板动画，确保refs已填充
    setTimeout(() => {
      panels.value.forEach((panel, index) => {
        if (!panel) return

        const leftPanel = panel.querySelector('.stc-curtain-left-125') as HTMLElement
        const rightPanel = panel.querySelector('.stc-curtain-right-125') as HTMLElement
        const line = panel.querySelector('.stc-line-125') as HTMLElement
        const title = panel.querySelector('.stc-text-title-125') as HTMLElement
        const desc = panel.querySelector('.stc-text-desc-125') as HTMLElement
        const circle = panel.querySelector('.stc-decor-circle-125') as HTMLElement
        const ring = panel.querySelector('.stc-decor-ring-125') as HTMLElement

        // 初始状态 - 左右面板像幕帘一样闭合
        gsap.set(leftPanel, { x: -100, opacity: 0 })
        gsap.set(rightPanel, { x: 100, opacity: 0 })
        gsap.set(line, { width: 0 })
        gsap.set(title, { y: 80, opacity: 0, rotationX: 90 })
        gsap.set(desc, { y: 60, opacity: 0 })
        gsap.set(circle, { scale: 0, opacity: 0 })
        gsap.set(ring, { scale: 0, rotation: 180, opacity: 0 })

        // 幕帘拉开效果
        gsap.to(leftPanel, {
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1
          },
          x: 0,
          opacity: 1,
          ease: 'power3.out'
        })

        gsap.to(rightPanel, {
          scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1
          },
          x: 0,
          opacity: 1,
          ease: 'power3.out'
        })

        // 线条展开
        if (line) {
          gsap.to(line, {
            scrollTrigger: {
              trigger: panel,
              start: 'top 70%',
              end: 'top 50%',
              scrub: 1
            },
            width: '100%',
            ease: 'power2.inOut'
          })
        }

        // 标题3D翻转入场
        if (title) {
          gsap.to(title, {
            scrollTrigger: {
              trigger: panel,
              start: 'top 65%',
              end: 'top 45%',
              scrub: 1
            },
            y: 0,
            opacity: 1,
            rotationX: 0,
            ease: 'back.out(1.7)'
          })
        }

        // 描述淡入
        if (desc) {
          gsap.to(desc, {
            scrollTrigger: {
              trigger: panel,
              start: 'top 60%',
              end: 'top 40%',
              scrub: 1
            },
            y: 0,
            opacity: 1,
            ease: 'power2.out'
          })
        }

        // 装饰圆圈展开
        if (circle) {
          gsap.to(circle, {
            scrollTrigger: {
              trigger: panel,
              start: 'top 55%',
              end: 'top 35%',
              scrub: 1
            },
            scale: 1,
            opacity: 0.3,
            ease: 'elastic.out(1, 0.5)'
          })
        }

        // 装饰环旋转展开
        if (ring) {
          gsap.to(ring, {
            scrollTrigger: {
              trigger: panel,
              start: 'top 55%',
              end: 'top 35%',
              scrub: 1
            },
            scale: 1,
            rotation: 0,
            opacity: 0.5,
            ease: 'back.out(2)'
          })
        }

        // 持续动画
        if (circle) {
          gsap.to(circle, {
            scale: 1.2,
            opacity: 0.5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.2
          })
        }

        if (ring) {
          gsap.to(ring, {
            rotation: 360,
            duration: 20 + index * 2,
            repeat: -1,
            ease: 'none',
            delay: index * 0.3
          })
        }

        // 悬停效果
        panel.addEventListener('mouseenter', () => {
          if (leftPanel) gsap.to(leftPanel, { x: -10, duration: 0.3, ease: 'power2.out' })
          if (rightPanel) gsap.to(rightPanel, { x: 10, duration: 0.3, ease: 'power2.out' })
          if (title) gsap.to(title, { scale: 1.05, duration: 0.3, ease: 'back.out(1.7)' })
          if (circle) gsap.to(circle, { scale: 1.5, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
        })

        panel.addEventListener('mouseleave', () => {
          if (leftPanel) gsap.to(leftPanel, { x: 0, duration: 0.3, ease: 'power2.out' })
          if (rightPanel) gsap.to(rightPanel, { x: 0, duration: 0.3, ease: 'power2.out' })
          if (title) gsap.to(title, { scale: 1, duration: 0.3, ease: 'power2.out' })
          if (circle) gsap.to(circle, { scale: 1, duration: 0.3, ease: 'power2.out' })
        })
      })
    }, 100)
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.stc-scroll-text-curtain-125 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1e1e3f 50%, #0a0a1a 100%);
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
      radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 50% 100%, rgba(168, 85, 247, 0.05) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.stc-container-125 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.stc-section-title-125 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ec4899, #a855f7, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 60px rgba(236, 72, 153, 0.4);

  opacity: 1 !important;}

.stc-section-subtitle-125 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.stc-curtain-125 {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.stc-curtain-panel-125 {
  position: relative;
  min-height: 280px;
  background: linear-gradient(135deg, rgba(30, 30, 63, 0.6) 0%, rgba(15, 15, 47, 0.6) 100%);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 60px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: rgba(236, 72, 153, 0.3);
  
  opacity: 1 !important;}
}

.stc-curtain-left-125 {
  flex: 1;
  position: relative;
  z-index: 2;
  padding-right: 40px;
}

.stc-line-125 {
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ec4899, #a855f7, #3b82f6);
  margin-bottom: 30px;
  border-radius: 2px;

  opacity: 1 !important;}

.stc-text-title-125 {
  font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.3;
  perspective: 1000px;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.stc-text-desc-125 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  max-width: 600px;

  opacity: 1 !important;}

.stc-curtain-right-125 {
  flex: 0 0 200px;
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.stc-decor-circle-125 {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
  border-radius: 50%;

  opacity: 1 !important;}

.stc-decor-ring-125 {
  position: absolute;
  width: 180px;
  height: 180px;
  border: 2px solid rgba(168, 85, 247, 0.3);
  border-radius: 50%;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .stc-curtain-panel-125 {
    min-height: auto;
    padding: 40px 30px;
    flex-direction: column;
    gap: 30px;
  
  opacity: 1 !important;}

  .stc-curtain-left-125 {
    padding-right: 0;
  }

  .stc-curtain-right-125 {
    flex: none;
    width: 100%;
    height: 150px;
  
  opacity: 1 !important;}

  .stc-decor-circle-125 {
    width: 120px;
    height: 120px;
  
  opacity: 1 !important;}

  .stc-decor-ring-125 {
    width: 140px;
    height: 140px;
  
  opacity: 1 !important;}

  .stc-text-title-125 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .stc-text-desc-125 {
    font-size: 0.95rem;
  
  opacity: 1 !important;}

  .stc-section-title-125 {
    margin-bottom: 80px;
  }

  .stc-section-subtitle-125 {
    margin-bottom: 60px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .stc-container-125 {
    padding: 0 20px;
  
  opacity: 1 !important;}
}
</style>
