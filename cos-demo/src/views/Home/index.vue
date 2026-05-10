<template>
  <div class="home-container" ref="container">
    <div style="width: 100%; height: 100vh; background-color: #f00;"></div>
    <div class="scroll-counter">Scroll: {{ scrollY }}px</div>
    <div class="aos-all">
      <!-- Fade Animations -->
      <div class="aos-item" data-aos="fade-up">
        <div class="aos-content">Fade Up</div>
      </div>
      <div class="aos-item" data-aos="fade-down">
        <div class="aos-content">Fade Down</div>
      </div>
      <div class="aos-item" data-aos="fade-left">
        <div class="aos-content">Fade Left</div>
      </div>
      <div class="aos-item" data-aos="fade-right">
        <div class="aos-content">Fade Right</div>
      </div>
      <div class="aos-item" data-aos="fade-up-right">
        <div class="aos-content">Fade Up Right</div>
      </div>
      <div class="aos-item" data-aos="fade-up-left">
        <div class="aos-content">Fade Up Left</div>
      </div>
      <div class="aos-item" data-aos="fade-down-right">
        <div class="aos-content">Fade Down Right</div>
      </div>
      <div class="aos-item" data-aos="fade-down-left">
        <div class="aos-content">Fade Down Left</div>
      </div>

      <!-- Zoom Animations -->
      <div class="aos-item" data-aos="zoom-in">
        <div class="aos-content">Zoom In</div>
      </div>
      <div class="aos-item" data-aos="zoom-in-up">
        <div class="aos-content">Zoom In Up</div>
      </div>
      <div class="aos-item" data-aos="zoom-in-down">
        <div class="aos-content">Zoom In Down</div>
      </div>
      <div class="aos-item" data-aos="zoom-in-right">
        <div class="aos-content">Zoom In Right</div>
      </div>
      <div class="aos-item" data-aos="zoom-in-left">
        <div class="aos-content">Zoom In Left</div>
      </div>
      <div class="aos-item" data-aos="zoom-out">
        <div class="aos-content">Zoom Out</div>
      </div>
      <div class="aos-item" data-aos="zoom-out-up">
        <div class="aos-content">Zoom Out Up</div>
      </div>
      <div class="aos-item" data-aos="zoom-out-down">
        <div class="aos-content">Zoom Out Down</div>
      </div>
      <div class="aos-item" data-aos="zoom-out-right">
        <div class="aos-content">Zoom Out Right</div>
      </div>
      <div class="aos-item" data-aos="zoom-out-left">
        <div class="aos-content">Zoom Out Left</div>
      </div>

      <!-- Slide Animations -->
      <div class="aos-item" data-aos="slide-up">
        <div class="aos-content">Slide Up</div>
      </div>
      <div class="aos-item" data-aos="slide-down">
        <div class="aos-content">Slide Down</div>
      </div>
      <div class="aos-item" data-aos="slide-left">
        <div class="aos-content">Slide Left</div>
      </div>
      <div class="aos-item" data-aos="slide-right">
        <div class="aos-content">Slide Right</div>
      </div>

      <!-- Flip Animations -->
      <div class="aos-item" data-aos="flip-up">
        <div class="aos-content">Flip Up</div>
      </div>
      <div class="aos-item" data-aos="flip-down">
        <div class="aos-content">Flip Down</div>
      </div>
      <div class="aos-item" data-aos="flip-left">
        <div class="aos-content">Flip Left</div>
      </div>
      <div class="aos-item" data-aos="flip-right">
        <div class="aos-content">Flip Right</div>
      </div>

      <!-- With Delay -->
      <div class="aos-item" data-aos="fade-up" data-aos-delay="100">
        <div class="aos-content">Fade Up (Delay 100)</div>
      </div>
      <div class="aos-item" data-aos="fade-up" data-aos-delay="200">
        <div class="aos-content">Fade Up (Delay 200)</div>
      </div>
      <div class="aos-item" data-aos="fade-up" data-aos-delay="300">
        <div class="aos-content">Fade Up (Delay 300)</div>
      </div>

      <!-- With Duration -->
      <div class="aos-item" data-aos="zoom-in" data-aos-duration="800">
        <div class="aos-content">Zoom In (Duration 800)</div>
      </div>
      <div class="aos-item" data-aos="zoom-in" data-aos-duration="1200">
        <div class="aos-content">Zoom In (Duration 1200)</div>
      </div>
      <div class="aos-item" data-aos="zoom-in" data-aos-duration="2000">
        <div class="aos-content">Zoom In (Duration 2000)</div>
      </div>

      <!-- With Easing -->
      <div class="aos-item" data-aos="flip-right" data-aos-easing="ease-in-back">
        <div class="aos-content">Flip Right (Ease In Back)</div>
      </div>
      <div class="aos-item" data-aos="flip-right" data-aos-easing="ease-out-back">
        <div class="aos-content">Flip Right (Ease Out Back)</div>
      </div>
      <div class="aos-item" data-aos="flip-right" data-aos-easing="elastic">
        <div class="aos-content">Flip Right (Elastic)</div>
      </div>

      <!-- With Offset -->
      <div class="aos-item" data-aos="fade-up" data-aos-offset="200">
        <div class="aos-content">Fade Up (Offset 200)</div>
      </div>
      <div class="aos-item" data-aos="fade-up" data-aos-offset="300">
        <div class="aos-content">Fade Up (Offset 300)</div>
      </div>
      <div class="aos-item" data-aos="fade-up" data-aos-offset="400">
        <div class="aos-content">Fade Up (Offset 400)</div>
      </div>

      <!-- Once - Will only animate once -->
      <div class="aos-item" data-aos="zoom-out-down" data-aos-once>
        <div class="aos-content">Zoom Out Down (Once)</div>
      </div>
      <div class="aos-item" data-aos="zoom-out-down" data-aos-once>
        <div class="aos-content">Zoom Out Down (Once)</div>
      </div>

      <!-- Mirror - Will animate out when scrolling up -->
      <div class="aos-item" data-aos="flip-left" data-aos-mirror>
        <div class="aos-content">Flip Left (Mirror)</div>
      </div>
      <div class="aos-item" data-aos="flip-left" data-aos-mirror>
        <div class="aos-content">Flip Left (Mirror)</div>
      </div>

      <!-- Negative Offset Examples -->
      <div class="aos-item" data-aos="fade-up" data-aos-offset="-150">
        <div class="aos-content">Fade Up (Offset -150)</div>
      </div>
      <div class="aos-item" data-aos="fade-up" data-aos-offset="-150">
        <div class="aos-content">Fade Up (Offset -150)</div>
      </div>
      <div class="aos-item" data-aos="fade-up" data-aos-offset="-150">
        <div class="aos-content">Fade Up (Offset -150)</div>
      </div>

      <!-- Anchor Placement Examples -->
      <div class="aos-item" data-aos="zoom-in" data-aos-anchor-placement="top-bottom">
        <div class="aos-content">Zoom In (top-bottom)</div>
      </div>
      <div class="aos-item" data-aos="zoom-in" data-aos-anchor-placement="center-center">
        <div class="aos-content">Zoom In (center-center)</div>
      </div>
      <div class="aos-item" data-aos="zoom-in" data-aos-anchor-placement="bottom-top">
        <div class="aos-content">Zoom In (bottom-top)</div>
      </div>
      <div class="aos-item" data-aos="zoom-in" data-aos-anchor-placement="top-center">
        <div class="aos-content">Zoom In (top-center)</div>
      </div>
      <div class="aos-item" data-aos="zoom-in" data-aos-anchor-placement="center-top">
        <div class="aos-content">Zoom In (center-top)</div>
      </div>
      <div class="aos-item" data-aos="zoom-in" data-aos-anchor-placement="bottom-center">
        <div class="aos-content">Zoom In (bottom-center)</div>
      </div>

      <!-- More animations for scrolling -->
      <div class="aos-item" data-aos="fade-right">
        <div class="aos-content">Fade Right</div>
      </div>
      <div class="aos-item" data-aos="fade-left">
        <div class="aos-content">Fade Left</div>
      </div>
      <div class="aos-item" data-aos="zoom-out">
        <div class="aos-content">Zoom Out</div>
      </div>
      <div class="aos-item" data-aos="zoom-in">
        <div class="aos-content">Zoom In</div>
      </div>
      <div class="aos-item" data-aos="slide-up">
        <div class="aos-content">Slide Up</div>
      </div>
      <div class="aos-item" data-aos="slide-down">
        <div class="aos-content">Slide Down</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 响应式状态
const container = ref<HTMLElement | null>(null)
const scrollY = ref(0)
const scrollTriggers = ref<ScrollTrigger[]>([])

// 常量配置
const ANIMATION_DISTANCE = 100
const DEFAULT_OFFSET = 120
const DEFAULT_DURATION = 400
const DEFAULT_DELAY = 0

// Easing 函数映射表
const easingMap: Record<string, string> = {
  linear: 'none',
  ease: 'power2.out',
  'ease-in': 'power2.in',
  'ease-out': 'power2.out',
  'ease-in-out': 'power2.inOut',
  'ease-in-back': 'back.in(1.7)',
  'ease-out-back': 'back.out(1.7)',
  'ease-in-out-back': 'back.inOut(1.7)',
  'ease-in-sine': 'sine.in',
  'ease-out-sine': 'sine.out',
  'ease-in-out-sine': 'sine.inOut',
  'ease-in-quad': 'power1.in',
  'ease-out-quad': 'power1.out',
  'ease-in-out-quad': 'power1.inOut',
  'ease-in-cubic': 'power3.in',
  'ease-out-cubic': 'power3.out',
  'ease-in-out-cubic': 'power3.inOut',
  'ease-in-quart': 'power4.in',
  'ease-out-quart': 'power4.out',
  'ease-in-out-quart': 'power4.inOut',
  elastic: 'elastic.out(1, 0.3)',
  bounce: 'bounce.out'
}

// Anchor Placement 映射表
const anchorPlacementMap: Record<string, string> = {
  'top-bottom': `top bottom-=${DEFAULT_OFFSET}`,
  'top-center': `top center-=${DEFAULT_OFFSET}`,
  'top-top': `top top-=${DEFAULT_OFFSET}`,
  'center-bottom': `center bottom-=${DEFAULT_OFFSET}`,
  'center-center': `center center-=${DEFAULT_OFFSET}`,
  'center-top': `center top-=${DEFAULT_OFFSET}`,
  'bottom-bottom': `bottom bottom-=${DEFAULT_OFFSET}`,
  'bottom-center': `bottom center-=${DEFAULT_OFFSET}`,
  'bottom-top': `bottom top-=${DEFAULT_OFFSET}`
}

// 动画配置映射表
const animationConfigs: Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  // Fade 动画系列
  'fade-up': {
    from: { opacity: 0, y: ANIMATION_DISTANCE },
    to: { opacity: 1, y: 0 }
  },
  'fade-down': {
    from: { opacity: 0, y: -ANIMATION_DISTANCE },
    to: { opacity: 1, y: 0 }
  },
  'fade-left': {
    from: { opacity: 0, x: ANIMATION_DISTANCE },
    to: { opacity: 1, x: 0 }
  },
  'fade-right': {
    from: { opacity: 0, x: -ANIMATION_DISTANCE },
    to: { opacity: 1, x: 0 }
  },
  'fade-up-right': {
    from: { opacity: 0, x: -ANIMATION_DISTANCE, y: ANIMATION_DISTANCE },
    to: { opacity: 1, x: 0, y: 0 }
  },
  'fade-up-left': {
    from: { opacity: 0, x: ANIMATION_DISTANCE, y: ANIMATION_DISTANCE },
    to: { opacity: 1, x: 0, y: 0 }
  },
  'fade-down-right': {
    from: { opacity: 0, x: -ANIMATION_DISTANCE, y: -ANIMATION_DISTANCE },
    to: { opacity: 1, x: 0, y: 0 }
  },
  'fade-down-left': {
    from: { opacity: 0, x: ANIMATION_DISTANCE, y: -ANIMATION_DISTANCE },
    to: { opacity: 1, x: 0, y: 0 }
  },

  // Zoom 动画系列
  'zoom-in': {
    from: { opacity: 0, scale: 0.6 },
    to: { opacity: 1, scale: 1 }
  },
  'zoom-in-up': {
    from: { opacity: 0, y: ANIMATION_DISTANCE, scale: 0.6 },
    to: { opacity: 1, y: 0, scale: 1 }
  },
  'zoom-in-down': {
    from: { opacity: 0, y: -ANIMATION_DISTANCE, scale: 0.6 },
    to: { opacity: 1, y: 0, scale: 1 }
  },
  'zoom-in-right': {
    from: { opacity: 0, x: -ANIMATION_DISTANCE, scale: 0.6 },
    to: { opacity: 1, x: 0, scale: 1 }
  },
  'zoom-in-left': {
    from: { opacity: 0, x: ANIMATION_DISTANCE, scale: 0.6 },
    to: { opacity: 1, x: 0, scale: 1 }
  },
  'zoom-out': {
    from: { opacity: 0, scale: 1.2 },
    to: { opacity: 1, scale: 1 }
  },
  'zoom-out-up': {
    from: { opacity: 0, y: ANIMATION_DISTANCE, scale: 1.2 },
    to: { opacity: 1, y: 0, scale: 1 }
  },
  'zoom-out-down': {
    from: { opacity: 0, y: -ANIMATION_DISTANCE, scale: 1.2 },
    to: { opacity: 1, y: 0, scale: 1 }
  },
  'zoom-out-right': {
    from: { opacity: 0, x: -ANIMATION_DISTANCE, scale: 1.2 },
    to: { opacity: 1, x: 0, scale: 1 }
  },
  'zoom-out-left': {
    from: { opacity: 0, x: ANIMATION_DISTANCE, scale: 1.2 },
    to: { opacity: 1, x: 0, scale: 1 }
  },

  // Slide 动画系列
  'slide-up': {
    from: { y: '100%', visibility: 'hidden' },
    to: { y: 0, visibility: 'visible' }
  },
  'slide-down': {
    from: { y: '-100%', visibility: 'hidden' },
    to: { y: 0, visibility: 'visible' }
  },
  'slide-left': {
    from: { x: '100%', visibility: 'hidden' },
    to: { x: 0, visibility: 'visible' }
  },
  'slide-right': {
    from: { x: '-100%', visibility: 'hidden' },
    to: { x: 0, visibility: 'visible' }
  },

  // Flip 动画系列
  'flip-up': {
    from: { opacity: 0, rotationX: -100 },
    to: { opacity: 1, rotationX: 0 }
  },
  'flip-down': {
    from: { opacity: 0, rotationX: 100 },
    to: { opacity: 1, rotationX: 0 }
  },
  'flip-left': {
    from: { opacity: 0, rotationY: -100 },
    to: { opacity: 1, rotationY: 0 }
  },
  'flip-right': {
    from: { opacity: 0, rotationY: 100 },
    to: { opacity: 1, rotationY: 0 }
  }
}

// 工具函数：获取元素动画选项
const getElementOptions = (element: HTMLElement) => {
  const animation = element.getAttribute('data-aos') || 'fade-up'
  const offset = parseInt(element.getAttribute('data-aos-offset') || String(DEFAULT_OFFSET), 10)
  const delay = parseInt(element.getAttribute('data-aos-delay') || String(DEFAULT_DELAY), 10)
  const duration = parseInt(element.getAttribute('data-aos-duration') || String(DEFAULT_DURATION), 10) / 1000
  const easing = easingMap[element.getAttribute('data-aos-easing')] || 'power2.out'
  const once = element.hasAttribute('data-aos-once')
  const mirror = element.hasAttribute('data-aos-mirror')
  const anchorPlacement = element.getAttribute('data-aos-anchor-placement') || 'top-bottom'

  return {
    animation,
    offset,
    delay,
    duration,
    easing,
    once,
    mirror,
    anchorPlacement
  }
}

// 工具函数：计算触发点
const calculateTriggerPoint = (offset: number, anchorPlacement: string): string => {
  const placement = anchorPlacementMap[anchorPlacement] || anchorPlacementMap['top-bottom']
  return placement.replace(DEFAULT_OFFSET.toString(), String(offset))
}

// 工具函数：获取动画配置
const getAnimationConfig = (animationType: string) => {
  return animationConfigs[animationType] || animationConfigs['fade-up']
}

// 工具函数：获取 toggleActions
const getToggleActions = (once: boolean, mirror: boolean): string => {
  if (once && !mirror) {
    return 'play none none none'
  }
  return 'play reverse play reverse'
}

// 核心：创建单个元素的滚动动画
const createElementAnimation = (element: HTMLElement): ScrollTrigger | null => {
  const options = getElementOptions(element)
  const config = getAnimationConfig(options.animation)

  // 设置初始状态
  gsap.set(element, config.from)

  // 计算触发点
  const startTrigger = calculateTriggerPoint(options.offset, options.anchorPlacement)

  // 创建 ScrollTrigger
  const trigger = ScrollTrigger.create({
    trigger: element,
    start: startTrigger,
    end: 'bottom top',
    toggleActions: getToggleActions(options.once, options.mirror),
    onEnter: () => {
      gsap.to(element, {
        ...config.to,
        duration: options.duration,
        ease: options.easing,
        delay: options.delay / 1000,
        overwrite: 'auto'
      })
    },
    onLeave: () => {
      if (options.mirror && !options.once) {
        gsap.to(element, {
          ...config.from,
          duration: options.duration,
          ease: options.easing,
          overwrite: 'auto'
        })
      }
    },
    onEnterBack: () => {
      if (options.mirror && !options.once) {
        gsap.to(element, {
          ...config.to,
          duration: options.duration,
          ease: options.easing,
          delay: options.delay / 1000,
          overwrite: 'auto'
        })
      }
    },
    onLeaveBack: () => {
      if (!options.once) {
        gsap.to(element, {
          ...config.from,
          duration: options.duration,
          ease: options.easing,
          overwrite: 'auto'
        })
      }
    }
  })

  return trigger
}

// 核心：初始化所有动画
const initAllAnimations = (): void => {
  const aosElements = document.querySelectorAll<HTMLElement>('[data-aos]')

  aosElements.forEach((element) => {
    const trigger = createElementAnimation(element)
    if (trigger) {
      scrollTriggers.value.push(trigger)
    }
  })
}

// 核心：清理所有动画
const cleanupAllAnimations = (): void => {
  scrollTriggers.value.forEach((trigger) => {
    trigger.kill()
  })
  scrollTriggers.value = []
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
}

// 核心：刷新动画（窗口大小改变时）
const refreshAnimations = (): void => {
  ScrollTrigger.refresh()
}

// 核心：重新初始化动画（DOM 变化时）
const reinitializeAnimations = (): void => {
  cleanupAllAnimations()
  initAllAnimations()
}

// 滚动处理函数
const handleScroll = (): void => {
  scrollY.value = window.scrollY
}

// 窗口大小改变处理函数
const handleResize = (): void => {
  refreshAnimations()
}

// 生命周期钩子
onMounted(() => {
  // 初始化动画
  initAllAnimations()

  // 监听滚动事件
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 监听窗口大小改变事件
  window.addEventListener('resize', handleResize)

  // 初始化滚动位置
  handleScroll()
})

onBeforeUnmount(() => {
  // 清理事件监听
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)

  // 清理动画
  cleanupAllAnimations()
})
</script>

<style lang="scss" scoped>
.home-container {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 100px;
}

.scroll-counter {
  position: fixed;
  top: 0;
  right: 0;
  padding: 15px 25px;
  color: white;
  background-color: rgba(0, 0, 0, 0.4);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  z-index: 1000;
  border-bottom-left-radius: 10px;
  backdrop-filter: blur(10px);
}

.aos-all {
  width: 1000px;
  max-width: 98%;
  margin: 50px auto;
}

.aos-item {
  display: inline-block;
  float: left;
  width: 100%;
  height: 300px;
  padding: 20px;
  perspective: 1000px;
  backface-visibility: hidden;
}

.aos-content {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1da4e2 0%, #0d6e99 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
}

@media screen and (min-width: 420px) {
  .aos-item {
    width: 50%;
  }
}

@media screen and (min-width: 768px) {
  .aos-item {
    width: 50%;
  }
}

@media screen and (min-width: 1024px) {
  .aos-item {
    width: 33.333%;
  }
}

@media screen and (min-width: 1400px) {
  .aos-item {
    width: 25%;
  }
}
</style>
