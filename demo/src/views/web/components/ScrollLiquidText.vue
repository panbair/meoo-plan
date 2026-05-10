<template>
  <div class="lt-container-186">
    <h2 class="lt-title-186">流体文字滚动动画</h2>
    <div class="lt-stage-186">
      <div class="lt-text-186" ref="textContainer">
        <span v-for="(char, index) in text" :key="index" class="lt-char-186">{{ char }}</span>
      </div>
      <div class="lt-wave-186" ref="waveContainer"></div>
      <div class="lt-info-186">
        <p class="lt-subtitle-186">滚动触发流体波动</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const textContainer = ref<HTMLElement | null>(null)
const waveContainer = ref<HTMLElement | null>(null)
const text = "FLUID TEXT ANIMATION • LIQUID MOTION • WAVE EFFECT •"

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.lt-title-186', {
      scrollTrigger: {
        trigger: '.lt-title-186',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 字符波动动画
    if (textContainer.value) {
      const chars = gsap.utils.toArray('.lt-char-186')
      
      chars.forEach((char: any, index: number) => {
        gsap.to(char, {
          scrollTrigger: {
            trigger: textContainer.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          },
          y: Math.sin(index * 0.3) * 50,
          scale: 1.2,
          rotate: Math.sin(index * 0.2) * 15,
          color: index % 2 === 0 ? '#00ffff' : '#ff00ff',
          ease: 'none'
        })
      })

      // 入场动画
      gsap.from(chars, {
        scrollTrigger: {
          trigger: textContainer.value,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        scale: 0,
        rotate: -180,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.05
      })
    }

    // 波浪效果
    if (waveContainer.value) {
      const waves = 20
      for (let i = 0; i < waves; i++) {
        const wave = document.createElement('div')
        wave.className = 'lt-wave-line-186'
        wave.style.top = `${(i / waves) * 100}%`
        wave.style.animationDelay = `${i * 0.1}s`
        waveContainer.value.appendChild(wave)
      }

      gsap.utils.toArray<HTMLElement>('.lt-wave-line-186').forEach((wave, index) => {
        gsap.to(wave, {
          scrollTrigger: {
            trigger: waveContainer.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          },
          scaleX: Math.sin(index * 0.3) * 1 + 1,
          opacity: 0.8,
          ease: 'none'
        })
      })
    }

    // 副标题动画
    gsap.from('.lt-subtitle-186', {
      scrollTrigger: {
        trigger: '.lt-subtitle-186',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 鼠标交互
    if (textContainer.value) {
      textContainer.value.addEventListener('mousemove', (e) => {
        const rect = textContainer.value!.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5

        gsap.to(textContainer.value, {
          rotateX: y * -20,
          rotateY: x * 20,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      textContainer.value.addEventListener('mouseleave', () => {
        gsap.to(textContainer.value, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
      })
    }
  })
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.lt-container-186 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a5e 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.lt-container-186::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.03) 0%, transparent 70%);
  pointer-events: none;
}

.lt-title-186 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 80px;
  text-align: center;
  background: linear-gradient(90deg, #00ffff, #ff00ff, #00ffff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: lt-glow-186 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes lt-glow-186 {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.lt-stage-186 {
  max-width: 1400px;
  width: 100%;
  position: relative;
  perspective: 1000px;

  opacity: 1 !important;}

.lt-text-186 {
  position: relative;
  font-size: 4rem;
  font-weight: bold;
  color: #fff;
  text-align: center;
  padding: 60px 20px;
  transform-style: preserve-3d;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;

  opacity: 1 !important;}

.lt-char-186 {
  display: inline-block;
  transition: color 0.3s ease;
}

.lt-char-186:hover {
  color: #ffff00 !important;
  text-shadow: 0 0 20px rgba(255, 255, 0, 0.8);
  cursor: pointer;
}

.lt-wave-186 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 20px;
}

.lt-wave-line-186 {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent);
  transform-origin: center;
  animation: lt-wave-anim-186 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes lt-wave-anim-186 {
  0%, 100% { transform: scaleX(0.5); opacity: 0.3; }
  50% { transform: scaleX(1); opacity: 0.8; }
}

.lt-info-186 {
  text-align: center;
  margin-top: 60px;

  opacity: 1 !important;}

.lt-subtitle-186 {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 5px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .lt-title-186 {
    font-size: 1.8rem;
    margin-bottom: 60px;
  
  opacity: 1 !important;}
  
  .lt-text-186 {
    font-size: 2rem;
    padding: 40px 15px;
  
  opacity: 1 !important;}
  
  .lt-subtitle-186 {
    font-size: 1.1rem;
    letter-spacing: 3px;
  
  opacity: 1 !important;}
}
</style>
