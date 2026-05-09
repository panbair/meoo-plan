<template>
  <section ref="typewriterSection" class="section-5 tt-typewriter-section-5">
    <h2 class="tt-section-title-5">文字动画</h2>
    <div class="tt-typewriter-container-5" ref="typewriterContainer">
      <div class="tt-typewriter-text-5" ref="typewriterText">
        <span v-for="(char, index) in textChars" :key="index" class="tt-char-5">{{ char }}</span>
      </div>
      <div class="tt-cursor-5"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const typewriterSection = ref<HTMLElement>()
const typewriterContainer = ref<HTMLElement>()
const typewriterText = ref<HTMLElement>()

const textChars = ref('滚动控制动画效果'.split(''))

onMounted(() => {
  setTimeout(() => {
    initAnimations()
  }, 100)
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('*')
})

const initAnimations = () => {
  if (!typewriterText.value) return

  const chars = typewriterText.value.querySelectorAll('.tt-char-5')
  gsap.fromTo(chars,
    {
      opacity: 0,
      y: 20
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.05,
      stagger: 0.08,
      scrollTrigger: {
        trigger: typewriterSection.value,
        start: 'top 60%',
        end: 'top 40%',
        scrub: 1
      }
    }
  )

  gsap.to(chars,
    {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      stagger: 0.05,
      ease: 'sine.inOut',
      scrollTrigger: {
        trigger: typewriterSection.value,
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 1
      }
    }
  )
}
</script>

<style scoped lang="scss">
.section-5 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.tt-section-title-5 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.tt-typewriter-section-5 {
  background: linear-gradient(180deg, transparent, rgba(79, 172, 254, 0.1), transparent);

  opacity: 1 !important;}

.tt-typewriter-container-5 {
  position: relative;
  padding: 60px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.tt-typewriter-text-5 {
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  letter-spacing: 5px;

  opacity: 1 !important;}

.tt-char-5 {
  display: inline-block;
}

.tt-cursor-5 {
  position: absolute;
  width: 3px;
  height: 60px;
  background: #fff;
  animation: tt-blink 1s infinite;

  opacity: 1 !important;}

@keyframes tt-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 768px) {
  .tt-typewriter-text-5 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}
}
</style>
