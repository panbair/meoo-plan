<template>
  <section ref="waveSection" class="section-2 wave-section-2">
    <h2 class="section-title-2">流体波浪</h2>
    <div class="wave-container-2" ref="waveContainer">
      <div class="wave-layer-2" ref="wave1"></div>
      <div class="wave-layer-2" ref="wave2"></div>
      <div class="wave-layer-2" ref="wave3"></div>
      <div class="wave-content-2" ref="waveContent">
        <div class="wave-text-2">
          <span>FLOW</span>
          <span>WAVE</span>
        </div>
        <div class="wave-particles-2" ref="waveParticles">
          <div v-for="i in 10" :key="i" class="particle-2"></div>
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

const waveSection = ref<HTMLElement>()
const waveContainer = ref<HTMLElement>()
const wave1 = ref<HTMLElement>()
const wave2 = ref<HTMLElement>()
const wave3 = ref<HTMLElement>()
const waveContent = ref<HTMLElement>()
const waveParticles = ref<HTMLElement>()

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
  if (!waveContainer.value) return

  const waves = [wave1.value, wave2.value, wave3.value]
  waves.forEach((wave, index) => {
    gsap.fromTo(wave,
      {
        y: 300,
        scale: 0.5
      },
      {
        y: -50,
        scale: 1.2,
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: waveSection.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          id: `wave${index}`
        }
      }
    )
  })

  if (waveContent.value) {
    gsap.fromTo(waveContent.value,
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: waveSection.value,
          start: 'top 50%',
          end: 'top 20%',
          scrub: 1
        }
      }
    )
  }

  const particles = waveParticles.value?.children
  if (particles) {
    Array.from(particles).forEach((particle, index) => {
      const angle = (index / 10) * Math.PI * 2
      const x = Math.cos(angle) * 200
      const y = Math.sin(angle) * 150

      gsap.fromTo(particle as HTMLElement,
        {
          x: 0,
          y: 0,
          opacity: 0,
          scale: 0
        },
        {
          x,
          y,
          opacity: 0.6,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: waveSection.value,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1
          }
        }
      )
    })
  }
}
</script>

<style scoped lang="scss">
.section-2 {
  min-height: 100vh;
  padding: 100px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.section-title-2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;

  opacity: 1 !important;}

.wave-section-2 {
  background: linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  overflow: hidden;

  opacity: 1 !important;}

.wave-container-2 {
  position: relative;
  width: 100%;
  height: 500px;
  max-width: 1000px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 60px rgba(102, 126, 234, 0.4);

  opacity: 1 !important;}

.wave-layer-2 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50% 50% 0 0;
  filter: blur(20px);

  opacity: 1 !important;}

.wave-content-2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;

  opacity: 1 !important;}

.wave-text-2 {
  text-align: center;
  font-size: 4rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: 10px;
  text-transform: uppercase;

  opacity: 1 !important;}

.wave-text-2 span {
  display: block;
  margin: 10px 0;
}

.wave-particles-2 {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.particle-2 {
  position: absolute;
  width: 15px;
  height: 15px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  filter: blur(4px);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .wave-text-2 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}
}
</style>
