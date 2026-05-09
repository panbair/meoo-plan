<template>
  <div class="s3dt-tunnel-section-154" ref="componentRoot">
    <div class="s3dt-container-154">
      <h2 class="s3dt-title-154">3D隧道</h2>
      <p class="s3dt-subtitle-154">3D Tunnel Effect</p>

      <div class="s3dt-tunnel-154">
        <div
          v-for="(ring, index) in rings"
          :key="index"
          class="s3dt-ring-154"
          :style="{
            '--depth': index,
            '--speed': 10 + index * 2
          }"
        >
          <div class="s3dt-ring-inner-154"></div>
        </div>

        <div class="s3dt-center-content-154">
          <h3 class="s3dt-center-title-154">穿越时空</h3>
          <p class="s3dt-center-desc-154">体验无限深度的3D效果</p>
        </div>
      </div>

      <div class="s3dt-stars-154">
        <div v-for="i in 50" :key="i" class="s3dt-star-154" :style="{
          '--x': random(0, 100),
          '--y': random(0, 100),
          '--size': random(1, 4),
          '--speed': random(3, 8),
          '--delay': random(0, 2)
        }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const rings = ref(12)

const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.s3dt-title-154', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.s3dt-subtitle-154', componentRoot.value)
      const rings = gsap.utils.toArray<HTMLElement>('.s3dt-ring-154', componentRoot.value)
      const tunnel = gsap.utils.toArray<HTMLElement>('.s3dt-tunnel-154', componentRoot.value)
      const centerContent = gsap.utils.toArray<HTMLElement>('.s3dt-center-content-154', componentRoot.value)
      const centerTitle = gsap.utils.toArray<HTMLElement>('.s3dt-center-title-154', componentRoot.value)
      const centerDesc = gsap.utils.toArray<HTMLElement>('.s3dt-center-desc-154', componentRoot.value)
      const stars = gsap.utils.toArray<HTMLElement>('.s3dt-star-154', componentRoot.value)
      const starsContainer = gsap.utils.toArray<HTMLElement>('.s3dt-stars-154', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 隧道环动画 - 设置初始深度
      if (rings.length) {
        gsap.set(rings, {
          z: (i) => i * -50
        })

        gsap.from(rings, {
          scrollTrigger: {
            trigger: tunnel[0] || componentRoot.value,
            start: 'top 85%'
          },
          scale: 0,
          opacity: 0,
          duration: 1,
          ease: 'back.out(1.5)',
          stagger: 0.1
        })

        // 环的旋转和缩放
        gsap.to(rings, {
          rotationZ: 360,
          scale: (i) => 1 + i * 0.1,
          duration: (i) => 10 + i * 2,
          repeat: -1,
          ease: 'none',
          stagger: 0.5
        })

        // 滚动控制环的缩放
        gsap.to(rings, {
          scale: (i) => 0.8 + i * 0.05,
          scrollTrigger: {
            trigger: tunnel[0] || componentRoot.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })

        // 隧道深度效果
        gsap.to(rings, {
          z: (i) => -i * 100,
          opacity: (i) => 1 - i * 0.08,
          duration: 2,
          scrollTrigger: {
            trigger: tunnel[0] || componentRoot.value,
            start: 'top center',
            end: 'bottom center',
            scrub: 1
          }
        })
      }

      // 中心内容动画
      if (centerContent.length) {
        gsap.from(centerContent, {
          scrollTrigger: {
            trigger: tunnel[0] || componentRoot.value,
            start: 'top 70%'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        })
      }

      if (centerTitle.length) {
        gsap.from(centerTitle, {
          scrollTrigger: {
            trigger: tunnel[0] || componentRoot.value,
            start: 'top 70%'
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.3
        })
      }

      if (centerDesc.length) {
        gsap.from(centerDesc, {
          scrollTrigger: {
            trigger: tunnel[0] || componentRoot.value,
            start: 'top 70%'
          },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.5
        })
      }

      // 星星动画
      if (stars.length && starsContainer.length) {
        gsap.from(stars, {
          scrollTrigger: {
            trigger: starsContainer[0],
            start: 'top 90%'
          },
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: 0.02
        })

        // 星星持续动画
        gsap.to(stars, {
          opacity: (i) => 0.3 + Math.random() * 0.7,
          duration: (i) => random(3, 8),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.05
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.s3dt-tunnel-section-154 {
  min-height: 100vh;
  padding: 100px 20px;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0d0d1a 50%, #000 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.s3dt-container-154 {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.s3dt-title-154 {
  text-align: center;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.s3dt-subtitle-154 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.s3dt-tunnel-154 {
  position: relative;
  width: 100%;
  height: 600px;
  perspective: 1500px;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.s3dt-ring-154 {
  position: absolute;
  width: 600px;
  height: 600px;
  border: 2px solid rgba(236, 72, 153, 0.3);
  border-radius: 50%;
  pointer-events: none;

  opacity: 1 !important;}

.s3dt-ring-inner-154 {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 50%;
  animation: rotate var(--speed) linear infinite;

  opacity: 1 !important;}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.s3dt-center-content-154 {
  position: relative;
  z-index: 100;
  text-align: center;
  padding: 60px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  border-radius: 50%;
  border: 2px solid rgba(236, 72, 153, 0.3);
  box-shadow:
    0 0 60px rgba(236, 72, 153, 0.3),
    inset 0 0 60px rgba(168, 85, 247, 0.2);

  opacity: 1 !important;}

.s3dt-center-title-154 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 0 0 30px rgba(236, 72, 153, 0.8);

  opacity: 1 !important;}

.s3dt-center-desc-154 {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.s3dt-stars-154 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.s3dt-star-154 {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent);
  border-radius: 50%;
  left: var(--x);
  top: var(--y);
  animation: twinkle var(--speed) ease-in-out infinite;
  animation-delay: var(--delay);

  opacity: 1 !important;}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

@media (max-width: 768px) {
  .s3dt-tunnel-154 {
    height: 500px;
  
  opacity: 1 !important;}

  .s3dt-ring-154 {
    width: 400px;
    height: 400px;
  
  opacity: 1 !important;}

  .s3dt-center-content-154 {
    padding: 40px;
  
  opacity: 1 !important;}

  .s3dt-center-title-154 {
    font-size: clamp(2rem, 4vw, 3rem);
  
  opacity: 1 !important;}

  .s3dt-center-desc-154 {
    font-size: 1rem;
  
  opacity: 1 !important;}
}
</style>
