<template>
  <section class="infinite-scroll-section-17">
    <div class="content-17">
      <h2 class="section-title-17">无限滚动文字</h2>
      <p class="subtitle-17">循环滚动的动态文字效果</p>

      <div class="scroll-container-17">
        <div class="scroll-track-17" ref="track1">
          <div class="scroll-text-17" v-for="n in 10" :key="n">CREATIVE DESIGN ✦ </div>
        </div>
        <div class="scroll-track-17 reverse-17" ref="track2">
          <div class="scroll-text-17" v-for="n in 10" :key="n">ANIMATION STUDIO ✦ </div>
        </div>
        <div class="scroll-track-17" ref="track3">
          <div class="scroll-text-17" v-for="n in 10" :key="n">VISUAL EXPERIENCE ✦ </div>
        </div>
      </div>

      <div class="scroll-indicator-17">
        <p>↓ 继续滚动探索更多 ↓</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const track1 = ref<HTMLElement | null>(null)
const track2 = ref<HTMLElement | null>(null)
const track3 = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const tracks = [track1.value, track2.value, track3.value].filter(Boolean) as HTMLElement[]
    const scrollTweens: gsap.core.Tween[] = []

    // 标题入场动画
    gsap.from('.section-title-17', {
      y: 120,
      opacity: 0,
      scale: 0.7,
      rotationX: -30,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.infinite-scroll-section-17',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 副标题入场
    gsap.from('.subtitle-17', {
      y: 100,
      opacity: 0,
      scale: 0.7,
      duration: 1.2,
      delay: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.infinite-scroll-section-17',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // 无限滚动动画
    tracks.forEach((track, index) => {
      const direction = index % 2 === 0 ? 1 : -1
      const duration = 15 + index * 5

      // 创建无缝循环
      const text = track.querySelector('.scroll-text-17') as HTMLElement
      const textWidth = text?.offsetWidth || 0

      const tween = gsap.to(track, {
        x: direction * -textWidth / 2,
        duration: duration,
        repeat: -1,
        ease: 'none'
      })

      scrollTweens.push(tween)
    })

    // 滚动时加速 - 修改时间轴的速度
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.infinite-scroll-section-17',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          scrollTweens.forEach(tween => {
            tween.timeScale(1 + self.progress * 3)
          })
        }
      }
    })

    // 文字入场效果 - 增强
    gsap.from('.scroll-text-17', {
      y: 200,
      opacity: 0,
      scale: 0.5,
      rotationX: 90,
      stagger: 0.05,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.scroll-container-17',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 滚动指示器入场
    gsap.from('.scroll-indicator-17', {
      y: 60,
      opacity: 0,
      scale: 0.8,
      duration: 1,
      delay: 0.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.infinite-scroll-section-17',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.infinite-scroll-section-17 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
    background: radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.08), transparent 60%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.content-17 {
  text-align: center;
  position: relative;
  z-index: 1;
  width: 100%;

  opacity: 1 !important;}

.section-title-17 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f0abfc, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.subtitle-17 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 60px;

  opacity: 1 !important;}

.scroll-container-17 {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 60px;
  overflow: hidden;
}

.scroll-track-17 {
  display: flex;
  gap: 20px;
  width: max-content;

  &.reverse-17 {
    flex-direction: row-reverse;
  
  opacity: 1 !important;}
}

.scroll-text-17 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: transparent;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  text-shadow: 0 0 40px rgba(167, 139, 250, 0.3);

  opacity: 1 !important;}

.scroll-indicator-17 {
  color: #94a3b8;
  animation: pulse 2s infinite;

  p {
    font-size: 0.9rem;
    letter-spacing: 2px;
  
  opacity: 1 !important;}
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .scroll-text-17 {
    font-size: clamp(1.5rem, 8vw, 2.5rem);
  
  opacity: 1 !important;}
}
</style>
