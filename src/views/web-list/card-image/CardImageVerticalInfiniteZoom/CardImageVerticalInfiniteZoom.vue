<template>
  <section ref="rootRef" class="viz-root" :style="{ '--viz-frames': String(slides.length + 1) }">
    <div class="viz-bg-orb viz-bg-orb-a"></div>
    <div class="viz-bg-orb viz-bg-orb-b"></div>

    <div ref="scrollRef" class="viz-scroll">
      <div ref="trackRef" class="viz-track">
        <div class="viz-sticky">
          <header ref="headerRef" class="viz-header">
            <p class="viz-kicker">Infinite Vertical Zoom</p>
            <h2 class="viz-title">镜头推拉 · 纵向无限滚动</h2>
            <p class="viz-subtitle">在当前区域继续滚动，镜头持续拉近，上一帧退场，下一帧接力冲击。</p>
          </header>

          <div class="viz-stage" aria-live="polite">
            <article
              v-for="(slide, index) in slides"
              :key="slide.id"
              :ref="(el) => setCardRef(el, index)"
              class="viz-card"
            >
              <img
                :ref="(el) => setImageRef(el, index)"
                class="viz-image"
                :src="slide.image"
                :alt="slide.alt"
                loading="lazy"
              />
              <div :ref="(el) => setOverlayRef(el, index)" class="viz-overlay"></div>
              <div :ref="(el) => setCaptionRef(el, index)" class="viz-caption">
                <span class="viz-label">{{ slide.label }}</span>
                <h3>{{ slide.title }}</h3>
                <p>{{ slide.description }}</p>
              </div>
            </article>
          </div>

          <div class="viz-progress-wrap">
            <div ref="progressRef" class="viz-progress"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

interface ZoomSlide {
  id: string
  label: string
  title: string
  description: string
  image: string
  alt: string
}

const slides: ZoomSlide[] = [
  {
    id: 'solar-rise',
    label: 'Frame 01',
    title: '炽光起势',
    description: '高饱和暖色云海先入场，建立第一段镜头冲击。',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1920&q=80',
    alt: '夕阳下层层山脊与炽热天空形成强烈视觉对比',
  },
  {
    id: 'ocean-wave',
    label: 'Frame 02',
    title: '浪峰穿屏',
    description: '滚动触发后镜头继续推进，海浪纹理被放大到贴近视野。',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    alt: '近距离海浪浪尖与蓝绿色海面',
  },
  {
    id: 'neon-flower',
    label: 'Frame 03',
    title: '荧彩脉冲',
    description: '色彩从冷暖撞色切换，形成下一段节奏峰值。',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80',
    alt: '高饱和紫粉色花朵特写，背景散景柔和',
  },
  {
    id: 'desert-line',
    label: 'Frame 04',
    title: '地貌切线',
    description: '最后一帧保持层次与锐度，滚动尾段依旧维持视觉张力。',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
    alt: '蜿蜒河道与红色山谷地貌在俯视视角下呈现几何线条',
  },
]

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

const cardRefs = ref<HTMLElement[]>([])
const imageRefs = ref<HTMLImageElement[]>([])
const overlayRefs = ref<HTMLElement[]>([])
const captionRefs = ref<HTMLElement[]>([])

const cleanupFns: TweenCleanup[] = []

const setCardRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    cardRefs.value[index] = el
  }
}

const setImageRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLImageElement) {
    imageRefs.value[index] = el
  }
}

const setOverlayRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    overlayRefs.value[index] = el
  }
}

const setCaptionRef = (el: Element | null, index: number) => {
  if (el instanceof HTMLElement) {
    captionRefs.value[index] = el
  }
}

const setupEntrance = () => {
  if (!scrollRef.value || !headerRef.value) {
    return
  }

  const entranceTween = gsap.fromTo(
    headerRef.value,
    { autoAlpha: 0, y: 44 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.95,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: scrollRef.value,
        scroller: scrollRef.value,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    },
  )

  cleanupFns.push(() => {
    entranceTween.scrollTrigger?.kill()
    entranceTween.kill()
  })
}

const setupInfiniteZoom = () => {
  if (!scrollRef.value || !trackRef.value || !progressRef.value) {
    return
  }

  const scroller = scrollRef.value
  const track = trackRef.value
  const cards = cardRefs.value
  const images = imageRefs.value
  const overlays = overlayRefs.value
  const captions = captionRefs.value

  if (!cards.length || !images.length || !overlays.length || !captions.length) {
    return
  }

  cards.forEach((card, index) => {
    gsap.set(card, {
      autoAlpha: index === 0 ? 1 : 0,
      scale: index === 0 ? 1 : 0.84,
      zIndex: cards.length - index,
    })

    gsap.set(images[index], {
      scale: index === 0 ? 1.06 : 1,
      filter: index === 0 ? 'saturate(1.1) contrast(1.02)' : 'saturate(0.95) contrast(0.98)',
    })

    gsap.set(overlays[index], {
      opacity: index === 0 ? 0.16 : 0.22,
    })

    gsap.set(captions[index], {
      autoAlpha: index === 0 ? 1 : 0,
      y: index === 0 ? 0 : 34,
    })
  })

  const masterTimeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track,
      scroller,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.15,
    },
  })

  cards.forEach((card, index) => {
    const currentImage = images[index]
    const currentOverlay = overlays[index]
    const currentCaption = captions[index]
    const nextCard = cards[index + 1]
    const nextCaption = captions[index + 1]
    const offset = index

    masterTimeline
      .to(currentImage, { scale: 1.36, duration: 1 }, offset)
      .to(currentOverlay, { opacity: 0.4, duration: 1 }, offset)
      .to(
        currentCaption,
        {
          y: -26,
          autoAlpha: index === cards.length - 1 ? 1 : 0,
          duration: 1,
        },
        offset,
      )

    if (nextCard && nextCaption) {
      masterTimeline
        .to(nextCard, { autoAlpha: 1, scale: 1, duration: 0.62 }, offset + 0.4)
        .to(nextCaption, { autoAlpha: 1, y: 0, duration: 0.55 }, offset + 0.46)
        .to(card, { autoAlpha: 0, scale: 1.2, duration: 0.48 }, offset + 0.52)
    }
  })

  masterTimeline.to(progressRef.value, { width: '100%', duration: slides.length }, 0)

  cleanupFns.push(() => {
    masterTimeline.scrollTrigger?.kill()
    masterTimeline.kill()
  })
}

const handleResize = () => {
  ScrollTrigger.refresh(true)
}

onMounted(() => {
  setupEntrance()
  setupInfiniteZoom()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  cleanupFns.forEach((fn) => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.viz-root {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at 16% 20%, #ff8f3f 0%, #ff5f6d 28%, #6a41ff 62%, #1a2ad8 100%);
}

.viz-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: auto;
}

.viz-scroll::-webkit-scrollbar {
  width: 8px;
}

.viz-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.24);
}

.viz-track {
  position: relative;
  width: 100%;
  height: calc(var(--viz-frames) * 100vh);
}

.viz-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.viz-bg-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(60px);
  opacity: 0.48;
  pointer-events: none;
}

.viz-bg-orb-a {
  width: 36vw;
  height: 36vw;
  left: -8vw;
  top: -10vw;
  background: #ffcc4d;
}

.viz-bg-orb-b {
  width: 32vw;
  height: 32vw;
  right: -6vw;
  bottom: -9vw;
  background: #2ef0ff;
}

.viz-header {
  position: absolute;
  top: 4vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  width: min(92vw, 940px);
  text-align: center;
  color: #fff;
}

.viz-kicker {
  margin: 0 0 0.8rem;
  letter-spacing: 0.2em;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.viz-title {
  margin: 0;
  font-size: clamp(1.7rem, 4vw, 3.1rem);
  font-weight: 900;
  letter-spacing: 0.02em;
  text-shadow: 0 10px 30px rgba(20, 10, 80, 0.35);
}

.viz-subtitle {
  margin: 0.75rem auto 0;
  max-width: 720px;
  line-height: 1.6;
  font-size: clamp(0.9rem, 1.5vw, 1.08rem);
  color: rgba(255, 255, 255, 0.86);
}

.viz-stage {
  position: absolute;
  inset: 0;
  perspective: 1200px;
}

.viz-card {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
}

.viz-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform-origin: center center;
  will-change: transform, filter;
}

.viz-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(140deg, rgba(255, 155, 40, 0.3) 0%, rgba(255, 36, 158, 0.22) 45%, rgba(22, 226, 255, 0.26) 100%),
    radial-gradient(circle at 15% 70%, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0) 40%);
  mix-blend-mode: screen;
  pointer-events: none;
  will-change: opacity;
}

.viz-caption {
  position: absolute;
  left: 6vw;
  bottom: 9vh;
  z-index: 4;
  width: min(84vw, 700px);
  color: #fff;
  text-shadow: 0 10px 24px rgba(22, 8, 66, 0.38);
  will-change: transform, opacity;
}

.viz-label {
  display: inline-flex;
  align-items: center;
  height: 1.9rem;
  padding: 0 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(12px);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.viz-caption h3 {
  margin: 0.9rem 0 0;
  font-size: clamp(1.8rem, 4.3vw, 3.5rem);
  line-height: 1.15;
}

.viz-caption p {
  margin: 0.8rem 0 0;
  font-size: clamp(0.92rem, 1.55vw, 1.15rem);
  line-height: 1.6;
  max-width: 44ch;
  color: rgba(255, 255, 255, 0.9);
}

.viz-progress-wrap {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 16;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.18);
}

.viz-progress {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #ffef5f 0%, #ff4f8b 45%, #40f6ff 100%);
  box-shadow: 0 0 18px rgba(255, 94, 156, 0.5);
}

@media (max-width: 900px) {
  .viz-caption {
    left: 5vw;
    right: 5vw;
    width: auto;
    bottom: 8vh;
  }
}

@media (max-width: 640px) {
  .viz-header {
    top: 3vh;
  }

  .viz-kicker {
    font-size: 0.68rem;
  }

  .viz-caption {
    bottom: 7vh;
  }

  .viz-label {
    height: 1.65rem;
    font-size: 0.66rem;
  }
}
</style>



