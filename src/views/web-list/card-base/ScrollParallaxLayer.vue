<template>
  <div class="spl-section-107">
    <div class="spl-content-107">
      <div class="spl-text-107">
        <h2 class="spl-title-107">视差滚动效果</h2>
        <p class="spl-desc-107">不同层级的元素以不同速度移动</p>
      </div>
      <div class="spl-layers-107">
        <div class="spl-layer-107 spl-layer-1-107"></div>
        <div class="spl-layer-107 spl-layer-2-107"></div>
        <div class="spl-layer-107 spl-layer-3-107"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
})

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.fromTo('.spl-title-107, .spl-desc-107',
      { x: -200, opacity: 0, scale: 0.7 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.spl-section-107',
          start: 'top 90%'
        }
      }
    )

    gsap.utils.toArray('.spl-layer-107').forEach((el, index) => {
      const depth = (index + 1) * 0.5
      gsap.fromTo(el as HTMLElement,
        { opacity: 0, y: 200, scale: 0.5 },
        {
          opacity: 0.8,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          stagger: 0.25,
          scrollTrigger: {
            trigger: '.spl-section-107',
            start: 'top 85%',
            end: 'bottom 20%',
            scrub: true
          }
        }
      )
      gsap.to(el as HTMLElement, {
        y: -200 * depth,
        scrollTrigger: {
          trigger: '.spl-section-107',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.spl-section-107 {
  min-height: 100vh;
  background: linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%);
  overflow: hidden;
  padding: 100px 20px;

  opacity: 1 !important;}

.spl-content-107 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  opacity: 1 !important;}

.spl-text-107 {
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.spl-title-107 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.spl-desc-107 {
  font-size: 1.3rem;
  color: #a0aec0;

  opacity: 1 !important;}

.spl-layers-107 {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.spl-layer-107 {
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  opacity: 0.8;
}

.spl-layer-1-107 {
  width: 300px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  opacity: 1 !important;}

.spl-layer-2-107 {
  width: 250px;
  height: 350px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

  opacity: 1 !important;}

.spl-layer-3-107 {
  width: 200px;
  height: 300px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .spl-layer-107 {
    width: 100%;
    max-width: 280px;
    height: 350px;
  
  opacity: 1 !important;}
}
</style>
