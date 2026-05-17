<template>
  <section class="ngt-neon-glow-section-19">
    <div class="ngt-content-19">
      <h2 class="ngt-section-title-19">霓虹光辉</h2>
      <p class="ngt-subtitle-19">动态霓虹灯光文字效果</p>

      <div class="ngt-neon-container-19">
        <div class="ngt-neon-text-19" ref="neon1">
          <span class="ngt-letter-19 ngt-active-19" v-for="(char, index) in 'NEON'" :key="index">{{ char }}</span>
        </div>
        <div class="ngt-neon-text-19" ref="neon2">
          <span class="ngt-letter-19 ngt-active-19" v-for="(char, index) in 'LIGHT'" :key="index">{{ char }}</span>
        </div>
        <div class="ngt-neon-text-19" ref="neon3">
          <span class="ngt-letter-19 ngt-active-19" v-for="(char, index) in 'EFFECT'" :key="index">{{ char }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const neon1 = ref<HTMLElement | null>(null)
const neon2 = ref<HTMLElement | null>(null)
const neon3 = ref<HTMLElement | null>(null)

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const neonTexts = [neon1.value, neon2.value, neon3.value].filter(Boolean) as HTMLElement[]

    // 标题入场动画
    gsap.from('.ngt-section-title-19', {
      y: 120,
      opacity: 0,
      scale: 0.7,
      rotationX: -30,
      duration: 1.5,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.ngt-neon-glow-section-19',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // 副标题入场
    gsap.from('.ngt-subtitle-19', {
      y: 100,
      opacity: 0,
      scale: 0.7,
      duration: 1.2,
      delay: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.ngt-neon-glow-section-19',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    neonTexts.forEach((text, textIndex) => {
      const letters = gsap.utils.toArray('.ngt-letter-19', text) as HTMLElement[]

      // 入场动画 - 增强效果
      gsap.from(letters, {
        y: 150,
        opacity: 0,
        scale: 0,
        rotationY: -180,
        rotationX: 45,
        duration: 1.5,
        stagger: 0.12,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: text,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      })

      // 滚动时控制霓虹光辉效果 - 从弱到强
      gsap.fromTo(
        letters,
        {
          textShadow: '0 0 5px rgba(255, 0, 255, 0.3), 0 0 10px rgba(255, 0, 255, 0.2)',
          color: '#ff00ff',
          scale: 1
        },
        {
          textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 50px #ff00ff',
          color: '#ffffff',
          scale: 1.2,
          duration: 1.5,
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.ngt-neon-container-19',
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1.5
          }
        }
      )

      // 滚动时的闪烁效果
      gsap.to(letters, {
        opacity: 0.7,
        duration: 0.4,
        repeat: 2,
        yoyo: true,
        stagger: 0.04,
        scrollTrigger: {
          trigger: text,
          start: 'top 60%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    // 滚动时的颜色变换
    gsap.to('.ngt-neon-text-19', {
      filter: 'hue-rotate(180deg)',
      duration: 2.5,
      scrollTrigger: {
        trigger: '.ngt-neon-container-19',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.ngt-neon-glow-section-19 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0a1a, #1a0a1a, #0a0a1a);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.05), transparent 70%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.ngt-content-19 {
  text-align: center;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.ngt-section-title-19 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  color: #ff00ff;
  text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff;

  opacity: 1 !important;}

.ngt-subtitle-19 {
  font-size: 1.1rem;
  color: #c084fc;
  margin-bottom: 60px;
  text-shadow: 0 0 10px rgba(192, 132, 252, 0.5);

  opacity: 1 !important;}

.ngt-neon-container-19 {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 60px;
}

.ngt-neon-text-19 {
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 900;
  display: flex;
  justify-content: center;
  gap: 0.1em;

  opacity: 1 !important;}

.ngt-letter-19 {
  display: inline-block;
  color: #ff00ff;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.3),
               0 0 10px rgba(255, 0, 255, 0.2);
  transition: all 0.3s ease;
  transform-style: preserve-3d;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .ngt-neon-text-19 {
    font-size: clamp(2rem, 12vw, 3rem);
  
  opacity: 1 !important;}
}
</style>
