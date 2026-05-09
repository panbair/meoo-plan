<template>
  <div class="ssr-stardust-reveal-section-184" ref="componentRoot">
    <div class="ssr-container-184">
      <h2 class="ssr-title-184">星尘揭示</h2>
      <p class="ssr-subtitle-184">Stardust Reveal Effect</p>

      <div class="ssr-reveal-stage-184">
        <canvas ref="stardustCanvas" class="ssr-canvas-184"></canvas>

        <div class="ssr-content-layer-184">
          <div class="ssr-image-reveal-184" ref="imageReveal">
            <div class="ssr-image-wrapper-184">
              <img :src="mainImage" alt="Stardust" class="ssr-main-image-184" />
              <div class="ssr-dust-overlay-184"></div>
            </div>
          </div>

          <div class="ssr-star-particles-184">
            <div
              v-for="n in 40"
              :key="n"
              class="ssr-star-184"
              :ref="el => { if (el) starRefs[n] = el as HTMLElement }"
              :style="getStarStyle(n)"
            ></div>
          </div>
        </div>
      </div>

      <div class="ssr-text-content-184">
        <div
          v-for="(text, index) in textContents"
          :key="index"
          class="ssr-text-item-184"
          :ref="el => { if (el) textRefs[index] = el as HTMLElement }"
        >
          <span class="ssr-text-number-184">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="ssr-text-inner-184">
            <h3 class="ssr-text-title-184">{{ text.title }}</h3>
            <p class="ssr-text-desc-184">{{ text.description }}</p>
          </div>
        </div>
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
const stardustCanvas = ref<HTMLCanvasElement>()
const imageReveal = ref<HTMLElement>()
const starRefs = ref<Record<number, HTMLElement>>({})
const textRefs = ref<HTMLElement[]>([])

const mainImage = new URL('@/assets/image/1.png', import.meta.url).href

interface TextContent {
  title: string
  description: string
}

const textContents: TextContent[] = [
  { title: '宇宙起源', description: 'The Origin of Universe' },
  { title: '星尘飘散', description: 'Dust in the Wind' },
  { title: '永恒之光', description: 'Eternal Light' }
]

const getStarStyle = (index: number) => {
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = 1 + Math.random() * 3
  const hue = 220 + Math.random() * 40 // 蓝紫色系
  const delay = Math.random() * 3
  const duration = 2 + Math.random() * 2

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: `hsl(${hue}, 80%, 70%)`,
    boxShadow: `0 0 ${size * 3}px hsl(${hue}, 80%, 70%)`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

let ctx: gsap.Context
let animationFrame: number | null = null
let resizeCanvas: () => void = () => {}

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return

    // Canvas 星尘动画
    const canvas = stardustCanvas.value
    if (!canvas) return

    resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 0.8
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) return

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      hue: 220 + Math.random() * 40
    }))

    const animateStardust = () => {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        star.x += star.speedX
        star.y += star.speedY

        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        canvasCtx.beginPath()
        canvasCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        canvasCtx.fillStyle = `hsla(${star.hue}, 80%, 70%, ${star.opacity})`
        canvasCtx.fill()
      })

      animationFrame = requestAnimationFrame(animateStardust)
    }

    animateStardust()

    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.ssr-title-184', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.ssr-subtitle-184', componentRoot.value)
      const imageRevealEl = gsap.utils.toArray<HTMLElement>('.ssr-image-reveal-184', componentRoot.value)
      const dustOverlay = gsap.utils.toArray<HTMLElement>('.ssr-dust-overlay-184', componentRoot.value)
      const mainImage = gsap.utils.toArray<HTMLElement>('.ssr-main-image-184', componentRoot.value)
      const starElements = gsap.utils.toArray<HTMLElement>('.ssr-star-184', componentRoot.value)
      const textItems = gsap.utils.toArray<HTMLElement>('.ssr-text-item-184', componentRoot.value)
      const textNumbers = gsap.utils.toArray<HTMLElement>('.ssr-text-number-184', componentRoot.value)
      const textTitles = gsap.utils.toArray<HTMLElement>('.ssr-text-title-184', componentRoot.value)
      const textDescs = gsap.utils.toArray<HTMLElement>('.ssr-text-desc-184', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          filter: 'blur(10px)',
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.15,
          ease: 'power3.out'
        })
      }

      // 图像星尘揭示动画
      if (imageRevealEl.length) {
        gsap.from(imageRevealEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 0.6,
          opacity: 0,
          rotation: -10,
          duration: 1.2,
          ease: 'power3.out'
        })
      }

      if (dustOverlay.length && mainImage.length) {
        // 滚动控制星尘覆盖层透明度和图像缩放 - 使用scrub
        const revealTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 60%',
            end: 'bottom 30%',
            scrub: 0.5
          }
        })

        revealTimeline.to(dustOverlay[0], {
          opacity: 0,
          filter: 'blur(0px)',
          ease: 'none'
        }, 0)

        revealTimeline.to(mainImage[0], {
          scale: 1.15,
          ease: 'none'
        }, 0)
      }

      // 星星粒子动画
      if (starElements.length) {
        gsap.from(starElements, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 65%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: {
            each: 0.02,
            from: 'random'
          },
          ease: 'back.out(1.7)'
        })

        // 星星持续闪烁
        starElements.forEach((star: HTMLElement, index: number) => {
          const delay = Math.random() * 2
          const duration = 1 + Math.random()

          gsap.to(star, {
            opacity: 0.3 + Math.random() * 0.7,
            scale: 0.5 + Math.random() * 1,
            duration,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay
          })
        })
      }

      // 文字内容动画
      if (textItems.length) {
        gsap.from(textItems, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 40%',
            toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.2,
          delay: 0.4,
          ease: 'power3.out'
        })
      }

      if (textNumbers.length) {
        gsap.from(textNumbers, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 40%',
            toggleActions: 'play none none reverse'
          },
          scale: 0,
          rotation: -90,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.5,
          ease: 'back.out(1.5)'
        })
      }

      if (textTitles.length) {
        gsap.from(textTitles, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 35%',
            toggleActions: 'play none none reverse'
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.6,
          ease: 'power3.out'
        })
      }

      if (textDescs.length) {
        gsap.from(textDescs, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 35%',
            toggleActions: 'play none none reverse'
          },
          y: 15,
          opacity: 0,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.7,
          ease: 'power3.out'
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<style scoped lang="scss">
.ssr-stardust-reveal-section-184 {
  min-height: 100vh;
  padding: 60px 20px;
  background: radial-gradient(ellipse at center, #0a0a2a 0%, #050515 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.ssr-container-184 {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;

  opacity: 1 !important;}

.ssr-title-184 {
  text-align: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 80px rgba(167, 139, 250, 0.5);

  opacity: 1 !important;}

.ssr-subtitle-184 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(167, 139, 250, 0.6);
  margin-bottom: 100px;
  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 1 !important;}

.ssr-reveal-stage-184 {
  position: relative;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.ssr-canvas-184 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.ssr-content-layer-184 {
  position: relative;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  z-index: 10;

  opacity: 1 !important;}

.ssr-image-reveal-184 {
  position: relative;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(167, 139, 250, 0.3);

  opacity: 1 !important;}

.ssr-image-wrapper-184 {
  position: relative;
  width: 100%;
  aspect-ratio: 1;

  opacity: 1 !important;}

.ssr-main-image-184 {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.1s ease;

  opacity: 1 !important;}

.ssr-dust-overlay-184 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, transparent 0%, rgba(167, 139, 250, 0.3) 100%);
  opacity: 0.7;
  transition: all 0.3s ease;
  pointer-events: none;
}

.ssr-star-particles-184 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;

  opacity: 1 !important;}

.ssr-star-184 {
  position: absolute;
  border-radius: 50%;
  animation: star-twinkle 3s ease-in-out infinite;
}

@keyframes star-twinkle {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

.ssr-text-content-184 {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 800px;

  opacity: 1 !important;}

.ssr-text-item-184 {
  display: flex;
  gap: 20px;
  background: rgba(167, 139, 250, 0.05);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(167, 139, 250, 0.2);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.ssr-text-item-184:hover {
  background: rgba(167, 139, 250, 0.1);
  border-color: rgba(167, 139, 250, 0.4);
  transform: translateX(10px);
}

.ssr-text-number-184 {
  font-size: 2rem;
  font-weight: 900;
  color: rgba(167, 139, 250, 0.5);
  min-width: 60px;
  font-family: 'Courier New', monospace;

  opacity: 1 !important;}

.ssr-text-inner-184 {
  flex: 1;
}

.ssr-text-title-184 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  opacity: 1 !important;}

.ssr-text-desc-184 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .ssr-image-reveal-184 {
    max-width: 100%;
  
  opacity: 1 !important;}

  .ssr-text-item-184 {
    flex-direction: column;
    gap: 15px;
    padding: 20px;
  
  opacity: 1 !important;}

  .ssr-text-number-184 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .ssr-text-title-184 {
    font-size: 1.2rem;
  
  opacity: 1 !important;}
}
</style>
