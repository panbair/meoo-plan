<template>
  <div class="holo-text-wrapper-177">
    <div class="ht-stage-177" ref="stageRef">
      <div class="ht-hologram-bg-177">
        <div class="ht-grid-177"></div>
        <div class="ht-scan-vertical-177"></div>
        <div class="ht-scan-horizontal-177"></div>
      </div>
      <div class="ht-holo-container-177" ref="containerRef">
        <div class="ht-base-ring-177"></div>
        <div class="ht-rotating-ring-177" ref="ringRef"></div>
        <h2 class="ht-title-177">HOLOGRAPHIC</h2>
        <div class="ht-holo-text-177">
          <span class="ht-char-177" v-for="(char, i) in text.split('')" :key="i">{{ char }}</span>
        </div>
        <div class="ht-data-dots-177">
          <div class="ht-dot-177" v-for="i in 20" :key="i"></div>
        </div>
      </div>
      <div class="ht-light-rays-177">
        <div class="ht-ray-177" v-for="i in 8" :key="i"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stageRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()
const ringRef = ref<HTMLElement>()
const text = 'FUTURE VISION'

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const stage = stageRef.value
    const container = containerRef.value
    const ring = ringRef.value
    if (!stage || !container) return

    const chars = gsap.utils.toArray('.ht-char-177') as HTMLElement[]
    const dots = gsap.utils.toArray('.ht-dot-177') as HTMLElement[]
    const rays = gsap.utils.toArray('.ht-ray-177') as HTMLElement[]
    const title = stage.querySelector('.ht-title-177')
    const scanV = stage.querySelector('.ht-scan-vertical-177')
    const scanH = stage.querySelector('.ht-scan-horizontal-177')

    if (ring) {
      gsap.to(ring, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: 'linear'
      })
    }

    if (scanV) {
      gsap.fromTo(scanV,
        { top: '-100%' },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          top: '100%'
        }
      )
    }

    if (scanH) {
      gsap.fromTo(scanH,
        { left: '-100%' },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
          },
          left: '100%'
        }
      )
    }

    if (title) {
      gsap.fromTo(title,
        { opacity: 0, scale: 0.5, filter: 'blur(10px)' },
        {
          scrollTrigger: {
            trigger: stage,
            start: 'top 80%',
            end: 'top 60%',
            scrub: 1
          },
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)'
        }
      )

      gsap.to(title, {
        textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)',
        duration: 1.5,
        repeat: -1,
        yoyo: true
      })
    }

    gsap.fromTo(chars,
      {
        color: 'rgba(0, 255, 255, 0.3)',
        textShadow: 'none',
        opacity: 0,
        transformStyle: 'preserve-3d',
        rotateY: 90
      },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 60%',
          end: 'center 50%',
          scrub: 1
        },
        color: 'rgba(0, 255, 255, 1)',
        textShadow: '0 0 10px #0ff, 0 0 20px #0ff',
        opacity: 1,
        rotateY: 0,
        stagger: 0.08
      }
    )

    chars.forEach((char) => {
      char.addEventListener('mouseenter', () => {
        gsap.to(char, {
          rotateY: 15,
          scale: 1.2,
          textShadow: '0 0 30px #0ff, 0 0 60px #0ff',
          duration: 0.3
        })
      })
      char.addEventListener('mouseleave', () => {
        gsap.to(char, {
          rotateY: 0,
          scale: 1,
          textShadow: '0 0 10px #0ff, 0 0 20px #0ff',
          duration: 0.3
        })
      })
    })

    gsap.fromTo(dots,
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 50%',
          end: 'bottom 30%',
          scrub: 1
        },
        scale: 1,
        opacity: 1,
        stagger: 0.05
      }
    )

    dots.forEach((dot, i) => {
      gsap.to(dot, {
        opacity: 0.3 + Math.random() * 0.7,
        duration: 0.5 + Math.random() * 1,
        repeat: -1,
        yoyo: true,
        delay: i * 0.1
      })
    })

    gsap.fromTo(rays,
      { scaleY: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: stage,
          start: 'top 40%',
          end: 'bottom 20%',
          scrub: 1
        },
        scaleY: 1,
        opacity: 0.6,
        stagger: 0.1
      }
    )

    rays.forEach((ray, i) => {
      gsap.to(ray, {
        rotation: 360,
        duration: 10 + i * 2,
        repeat: -1,
        ease: 'linear',
        transformOrigin: 'center center'
      })
    })

    gsap.to(container, {
      boxShadow: '0 0 50px rgba(0, 255, 255, 0.4), 0 0 100px rgba(0, 255, 255, 0.2), inset 0 0 50px rgba(0, 255, 255, 0.1)',
      scrollTrigger: {
        trigger: stage,
        start: 'top 30%',
        end: 'bottom 10%',
        scrub: 1
      }
    })

  }, stageRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.holo-text-wrapper-177 {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, #0a1a2a 0%, #050a10 100%);
  overflow: hidden;

  opacity: 1 !important;}

.ht-stage-177 {
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.ht-hologram-bg-177 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.ht-grid-177 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.ht-scan-vertical-177 {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.5), transparent);

  opacity: 1 !important;}

.ht-scan-horizontal-177 {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.5), transparent);

  opacity: 1 !important;}

.ht-holo-container-177 {
  position: relative;
  text-align: center;
  padding: 100px 80px;
  background: rgba(0, 20, 30, 0.6);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 50%;
  overflow: hidden;
  backdrop-filter: blur(10px);

  opacity: 1 !important;}

.ht-base-ring-177 {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid rgba(0, 255, 255, 0.2);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;

  opacity: 1 !important;}

.ht-rotating-ring-177 {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border: 2px dashed rgba(0, 255, 255, 0.4);
  border-radius: 50%;

  opacity: 1 !important;}

.ht-title-177 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 900;
  color: #0ff;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin-bottom: 30px;
  position: relative;

  opacity: 1 !important;}

.ht-holo-text-177 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 40px 0;
  perspective: 1000px;

  opacity: 1 !important;}

.ht-char-177 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  color: #0ff;
  transition: all 0.3s ease;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.ht-data-dots-177 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.ht-dot-177 {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #0ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #0ff;

  opacity: 1 !important;}

.ht-light-rays-177 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 800px;
  transform: translate(-50%, -50%);
  pointer-events: none;

  opacity: 1 !important;}

.ht-ray-177 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 50%;
  background: linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.3));
  transform-origin: top center;

  opacity: 1 !important;}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.02);
  }
}
</style>
