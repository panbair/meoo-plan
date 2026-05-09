<template>
  <section class="text-distortion-section-15">
    <div class="content-15">
      <h2 class="td-section-title-15">文字扭曲</h2>
      <p class="td-subtitle-15">滚动时文字产生波浪形扭曲效果</p>

      <div class="td-distortion-container-15">
        <div class="td-distortion-text-15" ref="text1">
          <span v-for="(char, index) in text1Content" :key="index" :data-index="index">{{ char }}</span>
        </div>
        <div class="td-distortion-text-15" ref="text2">
          <span v-for="(char, index) in text2Content" :key="index" :data-index="index">{{ char }}</span>
        </div>
        <div class="td-distortion-text-15" ref="text3">
          <span v-for="(char, index) in text3Content" :key="index" :data-index="index">{{ char }}</span>
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

const text1 = ref<HTMLElement | null>(null)
const text2 = ref<HTMLElement | null>(null)
const text3 = ref<HTMLElement | null>(null)

const text1Content = 'CREATIVE'
const text2Content = 'ANIMATION'
const text3Content = 'EXPERIENCE'

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const texts = [
      { el: text1.value, content: text1Content },
      { el: text2.value, content: text2Content },
      { el: text3.value, content: text3Content }
    ]

    texts.forEach(({ el, content }, textIndex) => {
      if (!el) return

      const spans = el.querySelectorAll('span')

      // 入场动画
      gsap.from(spans, {
        y: 150,
        opacity: 0,
        rotationX: 180,
        duration: 1.2,
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      })

      // 扭曲滚动效果
      spans.forEach((span, index) => {
        const offset = index - content.length / 2

        gsap.to(span, {
          y: offset * 10,
          rotationX: offset * 5,
          rotationY: offset * 3,
          scale: 1.2,
          color: index % 2 === 0 ? '#a78bfa' : '#60a5fa',
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          }
        })
      })

      // 悬停效果
      el.addEventListener('mouseenter', () => {
        gsap.to(spans, {
          scale: 1.3,
          y: -10,
          duration: 0.4,
          stagger: 0.02,
          ease: 'power2.out'
        })
      })

      el.addEventListener('mouseleave', () => {
        gsap.to(spans, {
          scale: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.02,
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
.text-distortion-section-15 {
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
    background: radial-gradient(ellipse at 30% 50%, rgba(236, 72, 153, 0.1), transparent 50%),
                radial-gradient(ellipse at 70% 50%, rgba(59, 130, 246, 0.1), transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.content-15 {
  text-align: center;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.td-section-title-15 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #f472b6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.td-subtitle-15 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 80px;

  opacity: 1 !important;}

.td-distortion-container-15 {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.td-distortion-text-15 {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  letter-spacing: 0.1em;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  perspective: 1000px;

  span {
    display: inline-block;
    transition: color 0.3s ease;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    text-shadow: 0 0 20px rgba(167, 139, 250, 0.3);
  
  opacity: 1 !important;}
}

@media (max-width: 768px) {
  .td-distortion-text-15 {
    font-size: clamp(2rem, 10vw, 3rem);
  
  opacity: 1 !important;}
}
</style>
