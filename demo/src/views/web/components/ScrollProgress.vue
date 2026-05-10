<template>
  <div class="scroll-progress" ref="scrollProgress"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scrollProgress = ref<HTMLElement>()

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
  gsap.to(scrollProgress.value, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  })
}
</script>

<style scoped lang="scss">
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f472b6);
  transform-origin: left center;
  transform: scaleX(0);
  z-index: 1000;

  opacity: 1 !important;}
</style>
