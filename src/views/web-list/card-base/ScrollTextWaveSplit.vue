<template>
  <section class="tws-scroll-text-wave-split-133">
    <div class="tws-container-133">
      <h2 class="tws-title-133">文字波浪分割</h2>
      <p class="tws-subtitle-133">Text Wave Split</p>

      <div class="tws-text-stage-133" ref="stage">
        <div
          v-for="(word, wIndex) in words"
          :key="wIndex"
          class="tws-word-row-133"
          :ref="el => { if (el) wordRefs[wIndex] = el as HTMLElement }"
        >
          <div
            v-for="(char, cIndex) in word.split('')"
            :key="cIndex"
            class="tws-character-133"
            :ref="el => { if (el) charRefs[`${wIndex}-${cIndex}`] = el as HTMLElement }"
          >
            {{ char }}
          </div>
        </div>
      </div>

      <div class="tws-progress-bar-133">
        <div class="tws-progress-133" ref="progressBar"></div>
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
const progressBar = ref<HTMLElement>()
const wordRefs = ref<HTMLElement[]>([])
const charRefs = ref<Record<string, HTMLElement>>({})

const words = ['SCROLL', 'WAVE', 'SPLIT', 'MAGIC']

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.tws-title-133', {
      scrollTrigger: {
        trigger: '.tws-scroll-text-wave-split-133',
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1
      },
      opacity: 0,
      scale: 0.8,
      filter: 'blur(20px)',
      ease: 'power2.out'
    })

    gsap.from('.tws-subtitle-133', {
      scrollTrigger: {
        trigger: '.tws-scroll-text-wave-split-133',
        start: 'top 85%',
        end: 'top 65%',
        scrub: 1
      },
      opacity: 0,
      y: 30,
      ease: 'power2.out'
    })

    // 字符波浪动画
    Object.entries(charRefs.value).forEach(([key, char]) => {
      const [wIndex, cIndex] = key.split('-').map(Number)
      const totalCharsInWord = words[wIndex].length
      const positionInWord = cIndex

      gsap.from(char, {
        scrollTrigger: {
          trigger: wordRefs.value[wIndex],
          start: 'top 80%',
          end: 'top 20%',
          scrub: 2
        },
        opacity: 0.2,
        y: 100,
        rotationX: 90,
        skewX: 30,
        filter: 'blur(8px)',
        ease: 'power3.inOut',
        delay: (positionInWord / totalCharsInWord) * 0.3
      })
    })

    // 单词行波浪效果
    wordRefs.value.forEach((word, index) => {
      gsap.to(word, {
        scrollTrigger: {
          trigger: stage.value,
          start: `top ${80 - index * 10}%`,
          end: `top ${30 - index * 5}%`,
          scrub: 1.5
        },
        x: (index % 2 === 0 ? -1 : 1) * (100 + index * 50),
        ease: 'sine.inOut'
      })
    })

    // 进度条跟随
    gsap.to('.tws-progress-133', {
      scrollTrigger: {
        trigger: stage.value,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true
      },
      scaleX: 1,
      ease: 'none'
    })

    // 字符持续波动
    Object.entries(charRefs.value).forEach(([key, char]) => {
      const [wIndex, cIndex] = key.split('-').map(Number)

      gsap.to(char, {
        y: Math.sin(cIndex * 0.5) * 15,
        duration: 2 + cIndex * 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: wIndex * 0.3
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.tws-scroll-text-wave-split-133 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 30%, #0f0f2a 60%, #1a1a3a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.tws-container-133 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  opacity: 1 !important;}

.tws-title-133 {
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

.tws-subtitle-133 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 150px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.tws-text-stage-133 {
  position: relative;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 80px;
  perspective: 2000px;

  opacity: 1 !important;}

.tws-word-row-133 {
  display: flex;
  gap: 0.15em;
  position: relative;
}

.tws-character-133 {
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  display: inline-block;
  background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(168, 85, 247, 0.4);
  will-change: transform;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.tws-progress-bar-133 {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  z-index: 100;

  opacity: 1 !important;}

.tws-progress-133 {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #3b82f6, #ec4899);
  transform-origin: left;
  transform: scaleX(0);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .tws-character-133 {
    font-size: clamp(2.5rem, 8vw, 5rem);
  
  opacity: 1 !important;}

  .tws-title-133 {
    margin-bottom: 60px;
  }

  .tws-subtitle-133 {
    margin-bottom: 100px;
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .tws-text-stage-133 {
    gap: 50px;
    min-height: 400px;
  
  opacity: 1 !important;}

  .tws-progress-bar-133 {
    width: 200px;
  
  opacity: 1 !important;}
}
</style>
