<template>
  <section ref="explosionSection" class="section-4 explosion-section-4">
    <h2 class="section-title-4">粒子爆炸</h2>
    <div class="explosion-container-4" ref="explosionContainer">
      <div class="explosion-center-4" ref="explosionCenter">
        <div class="explosion-core-4"></div>
      </div>
      <div class="explosion-particles-4" ref="explosionParticles">
        <div v-for="i in 50" :key="i" class="explosion-particle-4" :data-index="i"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const explosionSection = ref<HTMLElement>()
const explosionContainer = ref<HTMLElement>()
const explosionCenter = ref<HTMLElement>()
const explosionParticles = ref<HTMLElement>()

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
  if (!explosionContainer.value) return

  const particles = explosionParticles.value?.children
  if (particles) {
    Array.from(particles).forEach((particle, index) => {
      const angle = (index / 50) * Math.PI * 2
      const distance = 200 + Math.random() * 100
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance

      gsap.fromTo(particle as HTMLElement,
        {
          x: 0,
          y: 0,
          scale: 0,
          opacity: 1
        },
        {
          x,
          y,
          scale: 1,
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: explosionSection.value,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 1
          }
        }
      )
    })
  }

  if (explosionCenter.value) {
    gsap.fromTo(explosionCenter.value,
      {
        scale: 0.5,
        opacity: 0
      },
      {
        scale: 2,
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: explosionSection.value,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        }
      }
    )
  }
}
</script>

<style scoped lang="scss">
.section-4 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.section-title-4 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.explosion-section-4 {
  background: linear-gradient(180deg, transparent, rgba(240, 147, 251, 0.1), transparent);

  opacity: 1 !important;}

.explosion-container-4 {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.explosion-center-4 {
  position: absolute;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.explosion-core-4 {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);

  opacity: 1 !important;}

.explosion-particles-4 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.explosion-particle-4 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);

  opacity: 1 !important;}
</style>
