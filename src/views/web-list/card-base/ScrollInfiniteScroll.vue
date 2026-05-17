<template>
  <section class="is-scroll-infinite-scroll-138">
    <div class="is-container-138">
      <h2 class="is-title-138">无限滚动</h2>
      <p class="is-subtitle-138">Infinite Scroll</p>

      <div class="is-stage-138" ref="stage">
        <div class="is-scroll-track-138" ref="scrollTrack">
          <div
            v-for="(item, index) in [...infiniteItems, ...infiniteItems]"
            :key="`${item.id}-${index}`"
            :class="`is-scroll-item-${138} is-item-${index}-${138}`"
          >
            <div class="is-item-content-138">
              <div class="is-item-number-138">{{ String(index % infiniteItems.length + 1).padStart(2, '0') }}</div>
              <h3 class="is-item-title-138">{{ item.title }}</h3>
              <p class="is-item-desc-138">{{ item.description }}</p>
              <div class="is-item-icon-138">{{ item.icon }}</div>
            </div>
          </div>
        </div>

        <div class="is-scroll-mask-138"></div>
      </div>

      <div class="is-direction-indicator-138">
        <div class="is-arrow-left-138">←</div>
        <div class="is-direction-text-138">拖拽或滚动查看</div>
        <div class="is-arrow-right-138">→</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stage = ref<HTMLElement>()
const scrollTrack = ref<HTMLElement>()

const infiniteItems = [
  { id: 1, title: '探索', description: '探索未知领域', icon: '🔍' },
  { id: 2, title: '创造', description: '创造无限可能', icon: '🎨' },
  { id: 3, title: '突破', description: '突破极限边界', icon: '🚀' },
  { id: 4, title: '创新', description: '创新未来科技', icon: '💡' },
  { id: 5, title: '引领', description: '引领行业潮流', icon: '⭐' },
  { id: 6, title: '超越', description: '超越期望表现', icon: '🎯' }
]

let ctx: gsap.Context
let animationTimeline: gsap.Timeline | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.is-title-138', {
      scrollTrigger: {
        trigger: '.is-scroll-infinite-scroll-138',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      scale: 0.8,
      filter: 'blur(20px)',
      ease: 'power2.out'
    })

    gsap.from('.is-subtitle-138', {
      scrollTrigger: {
        trigger: '.is-scroll-infinite-scroll-138',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    })

    // 无限滚动动画
    if (scrollTrack.value) {
      const itemWidth = 280
      const gap = 30
      const totalWidth = (itemWidth + gap) * infiniteItems.length

      animationTimeline = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'none' }
      })

      animationTimeline.to(scrollTrack.value, {
        x: -totalWidth,
        duration: 20,
        ease: 'none'
      })

      // 滚动控制动画速度
      gsap.to(animationTimeline, {
        scrollTrigger: {
          trigger: stage.value,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
          onUpdate: (self) => {
            if (animationTimeline) {
              animationTimeline.timeScale(self.progress * 2)
            }
          }
        }
      })
    }

    // 项目悬停效果
    const items = document.querySelectorAll('.is-scroll-item-138')
    items.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          scale: 1.05,
          zIndex: 10,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(item.querySelector('.is-item-icon-138'), {
          scale: 1.3,
          rotation: 10,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          scale: 1,
          zIndex: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

        gsap.to(item.querySelector('.is-item-icon-138'), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    // 遮罩动画
    gsap.from('.is-scroll-mask-138', {
      scrollTrigger: {
        trigger: stage.value,
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      ease: 'power2.out'
    })

    // 方向指示器动画
    gsap.to('.is-arrow-left-138', {
      x: -10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'power1.inOut'
    })

    gsap.to('.is-arrow-right-138', {
      x: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'power1.inOut'
    })
  })
})

onUnmounted(() => {
  if (animationTimeline) {
    animationTimeline.kill()
  }
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.is-scroll-infinite-scroll-138 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1a1a3a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.is-container-138 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  opacity: 1 !important;}

.is-title-138 {
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a855f7, #3b82f6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(168, 85, 247, 0.5);

  opacity: 1 !important;}

.is-subtitle-138 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 120px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.is-stage-138 {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
  perspective: 2000px;

  opacity: 1 !important;}

.is-scroll-track-138 {
  display: flex;
  gap: 30px;
  padding: 0 30px;
  will-change: transform;

  opacity: 1 !important;}

.is-scroll-item-138 {
  flex-shrink: 0;
  width: 280px;
  height: 400px;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
  will-change: transform;

  opacity: 1 !important;}

.is-item-content-138 {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(59, 130, 246, 0.15));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  opacity: 1 !important;}

.is-item-number-138 {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 2.5rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.1);
  font-family: monospace;

  opacity: 1 !important;}

.is-item-title-138 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.is-item-desc-138 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  line-height: 1.6;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.is-item-icon-138 {
  font-size: 4rem;
  filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.5));
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.is-scroll-mask-138 {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(10, 10, 26, 1) 0%,
    transparent 10%,
    transparent 90%,
    rgba(10, 10, 26, 1) 100%
  );
  pointer-events: none;
  z-index: 10;

  opacity: 1 !important;}

.is-direction-indicator-138 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 60px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.is-arrow-left-138,
.is-arrow-right-138 {
  font-size: 1.5rem;
  transition: transform 0.3s ease;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .is-scroll-item-138 {
    width: 220px;
    height: 320px;
  
  opacity: 1 !important;}

  .is-item-title-138 {
    font-size: 1.4rem;
  
  opacity: 1 !important;}

  .is-item-desc-138 {
    font-size: 0.85rem;
  
  opacity: 1 !important;}

  .is-item-icon-138 {
    font-size: 3rem;
  
  opacity: 1 !important;}

  .is-stage-138 {
    height: 450px;
  
  opacity: 1 !important;}

  .is-direction-indicator-138 {
    font-size: 0.75rem;
  
  opacity: 1 !important;}
}
</style>
