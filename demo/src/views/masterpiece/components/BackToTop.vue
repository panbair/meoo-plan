<template>
  <button ref="btnRef" class="back-top" @click="scrollToTop">
    <span>↑</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const btnRef = ref<HTMLElement>()

function scrollToTop() {
  gsap.to(window, {
    duration: 1.5,
    scrollTo: { y: 0, autoKill: false },
    ease: 'power3.inOut'
  })
}

onMounted(() => {
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top+=500 top',
    onEnter: () => gsap.to(btnRef.value!, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }),
    onLeaveBack: () => gsap.to(btnRef.value!, {
      opacity: 0,
      scale: 0.5,
      duration: 0.3
    })
  })
})
</script>

<style scoped lang="scss">
.back-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 999;
  opacity: 0;
  transform: scale(0.5);
  box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4);
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 15px 40px rgba(124, 58, 237, 0.5);
  }
}
</style>
