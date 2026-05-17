<template>
  <section class="text-reveal-section-11">
    <div class="content-11">
      <h2 class="tr-section-title-11">文字揭示动画</h2>
      <div class="tr-reveal-container-11">
        <p class="tr-reveal-text-11" ref="text1">滚动页面，文字逐字显现</p>
        <p class="tr-reveal-text-11" ref="text2">每个字母都有独特的入场效果</p>
        <p class="tr-reveal-text-11" ref="text3">GSAP ScrollTrigger 控制动画时间</p>
        <p class="tr-reveal-text-11" ref="text4">创造流畅的视觉体验</p>
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
const text4 = ref<HTMLElement | null>(null)

let ctx: gsap.Context

const splitText = (element: HTMLElement) => {
  const text = element.textContent || ''
  element.innerHTML = text.split('').map(char => {
    return char === ' ' ? ' ' : `<span class="tr-char-11">${char}</span>`
  }).join('')
}

onMounted(() => {
  ctx = gsap.context(() => {
    const texts = [text1.value, text2.value, text3.value, text4.value].filter(Boolean) as HTMLElement[]
    
    texts.forEach((text, index) => {
      splitText(text)
      
      gsap.from(text.querySelectorAll('.tr-char-11'), {
        y: 100,
        opacity: 0,
        rotationX: -90,
        duration: 0.8,
        stagger: 0.05,
        scrollTrigger: {
          trigger: text,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1
        }
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.text-reveal-section-11 {
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
    background: radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.15), transparent 50%),
                radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.15), transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.content-11 {
  max-width: 800px;
  text-align: center;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.tr-section-title-11 {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #f0abfc, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.tr-reveal-container-11 {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.tr-reveal-text-11 {
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  color: #e2e8f0;
  font-weight: 500;
  line-height: 1.8;

  .tr-char-11 {
    display: inline-block;
    transform-style: preserve-3d;
  
  opacity: 1 !important;}
}
</style>
