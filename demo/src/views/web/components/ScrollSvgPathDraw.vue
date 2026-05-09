<template>
  <section class="spd-scroll-svg-path-draw-220">
    <div class="spd-background-effects-220">
      <div class="spd-orb-220 spd-orb-1-220"></div>
      <div class="spd-orb-220 spd-orb-2-220"></div>
      <div class="spd-orb-220 spd-orb-3-220"></div>
    </div>

    <div class="spd-container-220">
      <div class="spd-header-220">
        <h2 class="spd-title-220">SVG路径绘制</h2>
        <p class="spd-subtitle-220">Smooth SVG Path Drawing Animation</p>
        <div class="spd-decoration-line-220"></div>
      </div>

      <div class="spd-svg-wrapper-220">
        <div class="spd-svg-glow-bg-220"></div>
        <div class="spd-svg-container-220">
          <svg viewBox="0 0 400 400" class="spd-svg-220">
            <defs>
              <linearGradient id="gradient-primary-220" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0ea5e9" />
                <stop offset="33%" stop-color="#3b82f6" />
                <stop offset="66%" stop-color="#8b5cf6" />
                <stop offset="100%" stop-color="#ec4899" />
              </linearGradient>
              <linearGradient id="gradient-secondary-220" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="100%" stop-color="#8b5cf6" />
              </linearGradient>
              <filter id="glow-filter-220">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-strong-220">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="grid-pattern-220" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="rgba(14, 165, 233, 0.1)" />
              </pattern>
            </defs>

            <rect width="400" height="400" fill="url(#grid-pattern-220)" />

            <path
              v-for="(path, index) in activePaths"
              :key="index"
              :ref="
                el => {
                  if (el) pathRefs[index] = el
                }
              "
              :d="path.d"
              class="spd-path-220"
              :class="`spd-path-${index}-220`"
              stroke="url(#gradient-primary-220)"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              filter="url(#glow-filter-220)"
            />

            <path
              v-for="(path, index) in activePaths"
              :key="`secondary-${index}`"
              :d="path.d"
              class="spd-path-secondary-220"
              stroke="url(#gradient-secondary-220)"
              stroke-width="1"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.5"
              filter="url(#glow-strong-220)"
            />

            <circle cx="200" cy="200" r="180" class="spd-outer-ring-220" />
            <circle cx="200" cy="200" r="160" class="spd-inner-ring-220" />
            <circle cx="200" cy="200" r="5" class="spd-center-dot-220" />
          </svg>

          <div class="spd-corner-decor-220 spd-corner-tl-220"></div>
          <div class="spd-corner-decor-220 spd-corner-tr-220"></div>
          <div class="spd-corner-decor-220 spd-corner-bl-220"></div>
          <div class="spd-corner-decor-220 spd-corner-br-220"></div>
        </div>

        <div class="spd-indicator-bar-220">
          <div class="spd-indicator-progress-220" ref="indicatorProgress"></div>
          <span class="spd-indicator-text-220">绘制进度</span>
        </div>

        <div class="spd-shape-info-220">
          <div class="spd-shape-label-220">
            <span class="spd-shape-number-220">{{ currentShapeIndex + 1 }}</span>
            <span class="spd-shape-name-220">{{ currentShapeName }}</span>
          </div>
          <div class="spd-shape-dots-220">
            <span
              v-for="(shape, index) in shapes"
              :key="index"
              class="spd-shape-dot-220"
              :class="{ active: currentShape === shape.id }"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const pathRefs = ref([])
const indicatorProgress = ref(null)
let currentShapeIndex = 0

const currentShape = ref('circle')

const shapes = [
  { id: 'circle', name: '圆形', paths: [{ d: 'M 200,50 m -75,0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0' }] },
  { id: 'star', name: '星形', paths: [{ d: 'M 200,30 L 230,120 L 330,120 L 250,180 L 280,270 L 200,210 L 120,270 L 150,180 L 70,120 L 170,120 Z' }] },
  { id: 'heart', name: '心形', paths: [{ d: 'M 200,80 C 200,80 120,20 80,80 C 40,140 40,200 80,240 C 120,280 200,340 200,340 C 200,340 280,280 320,240 C 360,200 360,140 320,80 C 280,20 200,80 200,80 Z' }] },
  { id: 'infinity', name: '无限', paths: [{ d: 'M 100,200 C 50,200 50,150 100,150 C 140,150 140,200 180,200 C 220,200 220,150 280,150 C 350,150 350,200 300,200 C 260,200 260,250 220,250 C 180,250 180,200 140,200 C 100,200 100,250 60,250 C 30,250 30,200 80,200 L 100,200' }] },
  { id: 'spiral', name: '螺旋', paths: [{ d: 'M 200,200 m 0,0 m 10,0 a 10,10 0 1,0 20,0 a 20,20 0 1,0 40,0 a 40,40 0 1,0 80,0 a 80,80 0 1,0 160,0' }] },
  { id: 'lightning', name: '闪电', paths: [{ d: 'M 230,50 L 150,200 L 200,200 L 160,350 L 280,180 L 220,180 L 260,50 Z' }] },
  { id: 'diamond', name: '钻石', paths: [{ d: 'M 200,40 L 340,150 L 200,360 L 60,150 Z' }] },
  { id: 'flower', name: '花朵', paths: [{ d: 'M 200,200 L 200,80 M 200,200 L 200,320 M 200,200 L 80,200 M 200,200 L 320,200' }] }
]

let mainTimeline = null
let scrollTrigger = null
let shapeInterval = null

const currentShapeName = computed(() => {
  const shape = shapes.find(s => s.id === currentShape.value)
  return shape ? shape.name : ''
})

const activePaths = computed(() => {
  const shape = shapes.find(s => s.id === currentShape.value)
  return shape ? shape.paths : []
})

const initDrawingAnimation = async () => {
  await nextTick()

  if (mainTimeline) mainTimeline.kill()
  if (scrollTrigger) scrollTrigger.kill()

  const paths = gsap.utils.toArray('.spd-path-220')
  const pathsSecondary = gsap.utils.toArray('.spd-path-secondary-220')

  if (paths.length === 0) return

  paths.forEach(path => {
    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
  })

  pathsSecondary.forEach(path => {
    const length = path.getTotalLength()
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
  })

  mainTimeline = gsap.timeline()

  paths.forEach((path, index) => {
    mainTimeline.to(
      path,
      { strokeDashoffset: 0, duration: 2.5, ease: 'power2.inOut' },
      index * 0.3
    )
  })

  pathsSecondary.forEach((path, index) => {
    mainTimeline.to(
      path,
      { strokeDashoffset: 0, duration: 2.5, ease: 'power2.inOut' },
      index * 0.3 + 0.1
    )
  })

  scrollTrigger = ScrollTrigger.create({
    trigger: '.spd-scroll-svg-path-draw-220',
    start: 'top 80%',
    end: 'bottom 20%',
    onUpdate: self => {
      if (mainTimeline) {
        mainTimeline.progress(self.progress)
        if (indicatorProgress.value) {
          indicatorProgress.value.style.width = `${self.progress * 100}%`
        }
      }
    }
  })
}

const switchToNextShape = () => {
  currentShapeIndex = (currentShapeIndex + 1) % shapes.length
  currentShape.value = shapes[currentShapeIndex].id

  gsap.to('.spd-path-220, .spd-path-secondary-220', {
    opacity: 0,
    scale: 0.8,
    rotation: 15,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      initDrawingAnimation()
    }
  })

  gsap.fromTo(
    '.spd-path-220, .spd-path-secondary-220',
    { opacity: 0, scale: 1.2, rotation: -15 },
    { opacity: 1, scale: 1, rotation: 0, duration: 0.6, delay: 0.4, ease: 'elastic.out(1, 0.5)' }
  )
}

const initBackgroundAnimation = () => {
  gsap.to('.spd-orb-1-220', {
    x: '30%',
    y: '-20%',
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.spd-orb-2-220', {
    x: '-25%',
    y: '25%',
    duration: 10,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.spd-orb-3-220', {
    x: '20%',
    y: '15%',
    duration: 12,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })

  gsap.to('.spd-outer-ring-220', {
    rotation: 360,
    duration: 30,
    repeat: -1,
    ease: 'none'
  })

  gsap.to('.spd-inner-ring-220', {
    rotation: -360,
    duration: 25,
    repeat: -1,
    ease: 'none'
  })

  gsap.fromTo('.spd-center-dot-220', { scale: 1 }, { scale: 1.5, duration: 2, repeat: -1, yoyo: true, ease: 'power2.inOut' })
}

const initScrollAnimations = () => {
  // 标题和副标题滚动绑定动画
  gsap.from('.spd-title-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 85%',
      end: 'top 70%',
      scrub: 1
    },
    y: -100,
    opacity: 0,
    scale: 0.8,
    ease: 'power4.out'
  })

  gsap.from('.spd-subtitle-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 80%',
      end: 'top 65%',
      scrub: 1
    },
    y: 60,
    opacity: 0,
    ease: 'power4.out'
  })

  gsap.from('.spd-decoration-line-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 75%',
      end: 'top 60%',
      scrub: 1
    },
    width: 0,
    scaleX: 0,
    ease: 'power4.out'
  })

  // SVG容器3D入场动画
  gsap.from('.spd-svg-container-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1
    },
    y: 150,
    opacity: 0,
    scale: 0.7,
    rotateX: 25,
    rotateZ: -5,
    ease: 'power4.out'
  })

  // 装饰角入场动画
  gsap.from('.spd-corner-decor-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 75%',
      end: 'top 55%',
      scrub: 1
    },
    scale: 0,
    opacity: 0,
    rotate: -45,
    stagger: 0.1,
    ease: 'back.out(2)'
  })

  // 形状信息入场动画
  gsap.from('.spd-shape-info-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'top 50%',
      scrub: 1
    },
    y: 80,
    opacity: 0,
    scale: 0.9,
    ease: 'elastic.out(1, 0.6)'
  })

  // 进度条入场动画
  gsap.from('.spd-indicator-bar-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'top 55%',
      scrub: 1
    },
    scaleX: 0,
    opacity: 0,
    ease: 'power3.out'
  })

  // 滚动控制路径绘制进度
  gsap.to({}, {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5,
      onUpdate: (self) => {
        if (mainTimeline) {
          mainTimeline.progress(self.progress)
          if (indicatorProgress.value) {
            indicatorProgress.value.style.width = `${self.progress * 100}%`
          }
        }
      }
    }
  })

  // 滚动控制形状切换 - 第一阶段：圆形（0-12.5%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'top 62%',
      scrub: 0.3,
      onUpdate: (self) => {
        if (currentShapeIndex !== 0) {
          currentShapeIndex = 0
          currentShape.value = shapes[0].id
          initDrawingAnimation()
        }
      }
    }
  })

  // 滚动控制形状切换 - 第二阶段：星形（12.5-25%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 62%',
      end: 'top 55%',
      scrub: 0.3,
      onUpdate: (self) => {
        if (currentShapeIndex !== 1) {
          currentShapeIndex = 1
          currentShape.value = shapes[1].id
          initDrawingAnimation()
        }
      }
    }
  })

  // 滚动控制形状切换 - 第三阶段：心形（25-37.5%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 55%',
      end: 'top 47%',
      scrub: 0.3,
      onUpdate: (self) => {
        if (currentShapeIndex !== 2) {
          currentShapeIndex = 2
          currentShape.value = shapes[2].id
          initDrawingAnimation()
        }
      }
    }
  })

  // 滚动控制形状切换 - 第四阶段：无限（37.5-50%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 47%',
      end: 'center',
      scrub: 0.3,
      onUpdate: (self) => {
        if (currentShapeIndex !== 3) {
          currentShapeIndex = 3
          currentShape.value = shapes[3].id
          initDrawingAnimation()
        }
      }
    }
  })

  // 滚动控制形状切换 - 第五阶段：螺旋（50-62.5%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'center',
      end: 'center 40%',
      scrub: 0.3,
      onUpdate: (self) => {
        if (currentShapeIndex !== 4) {
          currentShapeIndex = 4
          currentShape.value = shapes[4].id
          initDrawingAnimation()
        }
      }
    }
  })

  // 滚动控制形状切换 - 第六阶段：闪电（62.5-75%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'center 40%',
      end: 'center 32%',
      scrub: 0.3,
      onUpdate: (self) => {
        if (currentShapeIndex !== 5) {
          currentShapeIndex = 5
          currentShape.value = shapes[5].id
          initDrawingAnimation()
        }
      }
    }
  })

  // 滚动控制形状切换 - 第七阶段：钻石（75-87.5%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'center 32%',
      end: 'center 24%',
      scrub: 0.3,
      onUpdate: (self) => {
        if (currentShapeIndex !== 6) {
          currentShapeIndex = 6
          currentShape.value = shapes[6].id
          initDrawingAnimation()
        }
      }
    }
  })

  // 滚动控制形状切换 - 第八阶段：花朵（87.5-100%）
  gsap.timeline({
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'center 24%',
      end: 'bottom 30%',
      scrub: 0.3,
      onUpdate: (self) => {
        if (currentShapeIndex !== 7) {
          currentShapeIndex = 7
          currentShape.value = shapes[7].id
          initDrawingAnimation()
        }
      }
    }
  })

  // SVG容器视差效果
  gsap.to('.spd-svg-container-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5
    },
    y: -60,
    rotateZ: 3,
    ease: 'none'
  })

  // SVG容器缩放脉冲
  gsap.to('.spd-svg-container-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    scale: 1.05,
    ease: 'none'
  })

  // 外环旋转动画
  gsap.to('.spd-outer-ring-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    rotation: 180,
    ease: 'none'
  })

  // 内环反向旋转动画
  gsap.to('.spd-inner-ring-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    rotation: -180,
    ease: 'none'
  })

  // 中心点缩放动画
  gsap.to('.spd-center-dot-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    scale: 2,
    ease: 'power2.inOut'
  })

  // 路径发光强度变化
  gsap.to('.spd-path-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    filter: 'drop-shadow(0 0 20px currentColor)',
    ease: 'none'
  })

  // 装饰角旋转动画
  gsap.to('.spd-corner-tl-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    rotation: 15,
    scale: 1.2,
    ease: 'none'
  })

  gsap.to('.spd-corner-tr-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    rotation: -15,
    scale: 1.2,
    ease: 'none'
  })

  gsap.to('.spd-corner-bl-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    rotation: -15,
    scale: 1.2,
    ease: 'none'
  })

  gsap.to('.spd-corner-br-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    rotation: 15,
    scale: 1.2,
    ease: 'none'
  })

  // 背景光球视差效果
  gsap.to('.spd-orb-1-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    y: -100,
    ease: 'none'
  })

  gsap.to('.spd-orb-2-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    y: 80,
    ease: 'none'
  })

  gsap.to('.spd-orb-3-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    },
    y: -60,
    ease: 'none'
  })

  // SVG发光背景脉动
  gsap.to('.spd-svg-glow-bg-220', {
    scrollTrigger: {
      trigger: '.spd-scroll-svg-path-draw-220',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5
    },
    scale: 1.3,
    opacity: 1,
    ease: 'power2.inOut'
  })
}

onMounted(() => {
  initBackgroundAnimation()
  initScrollAnimations()
  setTimeout(() => initDrawingAnimation(), 500)

  shapeInterval = setInterval(() => {
    switchToNextShape()
  }, 5000)
})

onUnmounted(() => {
  if (scrollTrigger) scrollTrigger.kill()
  if (mainTimeline) mainTimeline.kill()
  if (shapeInterval) clearInterval(shapeInterval)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.spd-scroll-svg-path-draw-220 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #0f172a 50%, #1e1b4b 75%, #0f0f23 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.spd-background-effects-220 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  opacity: 1 !important;}

.spd-orb-220 {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.spd-orb-1-220 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #0ea5e9 0%, transparent 70%);
  top: 10%;
  left: 5%;

  opacity: 1 !important;}

.spd-orb-2-220 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  bottom: 20%;
  right: 10%;

  opacity: 1 !important;}

.spd-orb-3-220 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #ec4899 0%, transparent 70%);
  top: 50%;
  right: 30%;
  transform: translate(50%, -50%);

  opacity: 1 !important;}

.spd-container-220 {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.spd-header-220 {
  text-align: center;
  margin-bottom: 50px;

  opacity: 1 !important;}

.spd-title-220 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 25%, #8b5cf6 50%, #ec4899 75%, #0ea5e9 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  animation: gradient-shift 8s ease infinite;
  text-shadow: 0 0 80px rgba(14, 165, 233, 0.5);

  opacity: 1 !important;}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.spd-subtitle-220 {
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: #94a3b8;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 300;

  opacity: 1 !important;}

.spd-decoration-line-220 {
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #0ea5e9, #8b5cf6, transparent);
  margin: 20px auto 0;
  border-radius: 2px;

  opacity: 1 !important;}

.spd-svg-wrapper-220 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.spd-svg-glow-bg-220 {
  position: absolute;
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
  animation: pulse-glow 4s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.spd-svg-container-220 {
  width: 100%;
  max-width: 550px;
  height: 550px;
  position: relative;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 30px;
  border: 2px solid rgba(14, 165, 233, 0.2);
  backdrop-filter: blur(20px);
  overflow: visible;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
              0 0 100px rgba(14, 165, 233, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.spd-svg-container-220:hover {
  border-color: rgba(14, 165, 233, 0.4);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
              0 0 120px rgba(14, 165, 233, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.spd-corner-decor-220 {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid #0ea5e9;
  opacity: 0.8;
}

.spd-corner-tl-220 {
  top: -5px;
  left: -5px;
  border-right: none;
  border-bottom: none;
  border-radius: 10px 0 0 0;
}

.spd-corner-tr-220 {
  top: -5px;
  right: -5px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 10px 0 0;
}

.spd-corner-bl-220 {
  bottom: -5px;
  left: -5px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 10px;
}

.spd-corner-br-220 {
  bottom: -5px;
  right: -5px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 10px 0;
}

.spd-svg-220 {
  width: 100%;
  height: 100%;

  opacity: 1 !important;}

.spd-path-220 {
  filter: drop-shadow(0 0 8px currentColor);
  transition: filter 0.3s ease;
}

.spd-path-220:hover {
  filter: drop-shadow(0 0 20px currentColor);
}

.spd-path-secondary-220 {
  pointer-events: none;
}

.spd-outer-ring-220,
.spd-inner-ring-220 {
  fill: none;
  stroke: rgba(14, 165, 233, 0.2);
  stroke-width: 1;
  stroke-dasharray: 10 5;
  transform-origin: center;

  opacity: 1 !important;}

.spd-center-dot-220 {
  fill: #0ea5e9;
  filter: drop-shadow(0 0 10px #0ea5e9);
}

.spd-indicator-bar-220 {
  width: 100%;
  max-width: 550px;
  height: 6px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(148, 163, 184, 0.2);

  opacity: 1 !important;}

.spd-indicator-progress-220 {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #3b82f6, #8b5cf6, #ec4899);
  background-size: 200% 100%;
  animation: progress-gradient 3s linear infinite;
  width: 0%;
  border-radius: 10px;
  transition: width 0.1s ease;

  opacity: 1 !important;}

@keyframes progress-gradient {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.spd-indicator-text-220 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  color: #e2e8f0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);

  opacity: 1 !important;}

.spd-shape-info-220 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 550px;
  padding: 20px 25px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(20px);

  opacity: 1 !important;}

.spd-shape-label-220 {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spd-shape-number-220 {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);

  opacity: 1 !important;}

.spd-shape-name-220 {
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.spd-shape-dots-220 {
  display: flex;
  gap: 8px;
}

.spd-shape-dot-220 {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;

  opacity: 1 !important;}

.spd-shape-dot-220:hover {
  background: rgba(14, 165, 233, 0.5);
  transform: scale(1.3);
}

.spd-shape-dot-220.active {
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.5);
  transform: scale(1.3);

  opacity: 1 !important;}

@media (max-width: 768px) {
  .spd-title-220 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .spd-subtitle-220 {
    font-size: 0.9rem;
  
  opacity: 1 !important;}

  .spd-svg-container-220,
  .spd-indicator-bar-220,
  .spd-shape-info-220 {
    max-width: 100%;
  
  opacity: 1 !important;}

  .spd-svg-container-220 {
    height: 350px;
  
  opacity: 1 !important;}

  .spd-svg-glow-bg-220 {
    width: 100%;
    height: 350px;
  
  opacity: 1 !important;}

  .spd-shape-info-220 {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  
  opacity: 1 !important;}
}
</style>
