# 企业官网 GSAP 动画优化实现指南

> 基于组件库分析的最优实践方案

---

## 一、核心问题：Opacity 为 0 解决方案

### 1.1 问题根源

```javascript
// ❌ 错误写法 - opacity 从 0 开始，滚动触发不及时会看不到内容
gsap.from('.element', {
  opacity: 0,
  y: 50,
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
    end: 'top 25%',
    scrub: 1
  }
})
```

### 1.2 解决方案汇总

#### 方案一：使用 fromTo 明确状态（推荐）

```javascript
// ✅ 正确写法 - 使用 fromTo 明确初始和结束状态
gsap.fromTo('.element',
  { opacity: 0, y: 50 },  // 初始状态
  {                       // 结束状态
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: '.element',
      start: 'top 85%',   // 更早触发
      end: 'top 35%',     // 更宽窗口
      scrub: 1.5,
      toggleActions: 'play none none reverse'
    }
  }
)
```

#### 方案二：CSS 强制显示

```css
/* ✅ 全局设置动画元素初始可见 */
.animate-reveal {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* ✅ 仅在动画进行中隐藏 */
.animate-reveal.animating {
  opacity: 0;
  transform: translateY(50px);
}
```

#### 方案三：ScrollTrigger 回调

```javascript
// ✅ 使用 onUpdate 确保内容可见
ScrollTrigger.create({
  trigger: '.element',
  start: 'top 90%',
  end: 'bottom top',
  onUpdate: (self) => {
    // 当滚动进入时强制显示
    if (self.progress > 0) {
      gsap.set('.element', { opacity: 1 })
    }
  }
})
```

---

## 二、全局 GSAP 配置优化

### 2.1 GSAP 初始化配置

```javascript
// gsap-config.js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

// 注册插件
gsap.registerPlugin(ScrollTrigger, Observer)

// ============ 全局默认配置 ============

// GSAP 默认配置
gsap.defaults({
  ease: 'power2.out',
  duration: 0.8
})

// ScrollTrigger 全局配置
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  start: 'top 85%',
  end: 'top 30%',
  scrub: 1.5,
  markers: false, // 生产环境关闭
  // ✅ 关键：确保元素可见
  onEnter: (self) => {
    gsap.set(self.trigger, { opacity: 1 })
  }
})

// ============ 性能优化配置 ============

// 响应式刷新
ScrollTrigger.config({
  limitCallbacks: true,
  ignoreMobileResize: true
})

// ============ 全局滚动进度条 ============

export const initScrollProgress = () => {
  // 创建进度条元素
  const progressBar = document.createElement('div')
  progressBar.className = 'scroll-progress-bar'
  progressBar.innerHTML = '<div class="scroll-progress-fill"></div>'
  document.body.appendChild(progressBar)

  // 滚动触发
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const progress = self.progress * 100
      document.documentElement.style.setProperty('--scroll-progress', progress + '%')
    }
  })
}

// ============ GSAP Context 辅助函数 ============

export const createAnimationContext = (selector, callback) => {
  const ctx = gsap.context(() => {
    callback()
  }, selector)

  return ctx
}

// ============ 性能监控 ============

export const enablePerformanceMonitor = () => {
  if (import.meta.env.DEV) {
    ScrollTrigger.addEventListener('refresh', () => {
      console.log('ScrollTrigger refreshed')
    })

    // FPS 监控
    let lastTime = performance.now()
    let frames = 0

    const checkFPS = () => {
      frames++
      const now = performance.now()
      if (now - lastTime >= 1000) {
        const fps = frames
        if (fps < 30) {
          console.warn('低帧率: ' + fps + ' FPS')
        }
        frames = 0
        lastTime = now
      }
      requestAnimationFrame(checkFPS)
    }

    requestAnimationFrame(checkFPS)
  }
}
```

### 2.2 滚动揭示动画工具函数

```javascript
// scroll-reveal.js

/**
 * 创建标准滚动揭示动画
 */
export const createReveal = (selector, options = {}) => {
  const {
    y = 50,
    x = 0,
    scale = 1,
    duration = 1,
    delay = 0,
    stagger = 0.1,
    ease = 'power3.out',
    start = 'top 85%',
    end = 'top 35%',
    scrub = false,
    markers = false
  } = options

  const config = {
    scrollTrigger: {
      trigger: selector,
      start,
      end,
      scrub,
      markers,
      toggleActions: 'play none none reverse',
      // ✅ 确保元素可见
      onEnter: () => gsap.set(selector, { opacity: 1 })
    }
  }

  if (scrub) {
    return gsap.fromTo(selector,
      { opacity: 0, y, x, scale: scale - 0.1 },
      { opacity: 1, y: 0, x: 0, scale, duration, ease, ...config }
    )
  }

  return gsap.fromTo(selector,
    { opacity: 0, y, x, scale: scale - 0.1 },
    { opacity: 1, y: 0, x: 0, scale, duration, delay, stagger, ease, ...config }
  )
}

/**
 * 创建交错入场动画
 */
export const createStaggerReveal = (container, itemSelector, options = {}) => {
  const {
    y = 80,
    duration = 0.8,
    stagger = 0.15,
    ease = 'back.out(1.4)'
  } = options

  return gsap.fromTo(itemSelector,
    { opacity: 0, y, scale: 0.9 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
        onEnter: () => gsap.set(container, { opacity: 1 })
      }
    }
  )
}

/**
 * 创建视差滚动效果
 */
export const createParallax = (element, options = {}) => {
  const {
    speed = 0.5,
    direction = 'y'
  } = options

  const movement = direction === 'y'
    ? { y: () => window.innerHeight * speed }
    : { x: () => window.innerWidth * speed }

  return gsap.to(element, {
    ...movement,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      // ✅ 确保元素可见
      onEnter: () => gsap.set(element, { opacity: 1 })
    }
  })
}

/**
 * 创建图片揭示效果
 */
export const createImageReveal = (imageWrapper, options = {}) => {
  const { scale = 1.3, blur = 20 } = options

  const image = imageWrapper.querySelector('img')
  const overlay = imageWrapper.querySelector('.overlay')

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: imageWrapper,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1,
      toggleActions: 'play none none reverse'
    }
  })

  // 图片缩放和模糊揭示
  tl.fromTo(image,
    { scale, filter: 'blur(' + blur + 'px)' },
    { scale: 1, filter: 'blur(0px)' }
  )

  // 遮罩滑出
  if (overlay) {
    tl.fromTo(overlay,
      { x: '0%' },
      { x: '100%' },
      0
    )
  }

  return tl
}
```

---

## 三、组件级优化模板

### 3.1 卡片组件优化模板

```javascript
// CardAnimation.vue
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useCardAnimation = () => {
  const cards = ref([])
  let ctx

  const initAnimations = () => {
    ctx = gsap.context(() => {
      // ✅ 标题动画
      gsap.fromTo('.card-title',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.card-section',
            start: 'top 85%'
          }
        }
      )

      // ✅ 卡片交错入场
      cards.value.forEach((card, index) => {
        // 入场动画
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 50%',
              toggleActions: 'play none none reverse'
            }
          }
        )

        // ✅ 悬停效果
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            duration: 0.3,
            ease: 'power2.out'
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            duration: 0.3,
            ease: 'power2.out'
          })
        })
      })
    })
  }

  onMounted(() => {
    initAnimations()
  })

  onUnmounted(() => {
    ctx?.revert()
  })

  return { cards }
}
```

### 3.2 Hero 区域优化模板

```javascript
// HeroAnimation.vue
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useHeroAnimation = () => {
  let ctx

  const initAnimations = () => {
    ctx = gsap.context(() => {
      // ✅ 主标题字符动画
      const titleChars = document.querySelectorAll('.hero-char')
      gsap.fromTo(titleChars,
        { y: 100, opacity: 0, rotationY: -90 },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.03,
          ease: 'back.out(1.7)',
          delay: 0.5
        }
      )

      // ✅ 副标题淡入
      gsap.fromTo('.hero-subtitle',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 1.2,
          ease: 'power3.out'
        }
      )

      // ✅ CTA 按钮组
      gsap.fromTo('.hero-cta',
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 1.5,
          ease: 'back.out(2)'
        }
      )

      // ✅ 背景粒子
      gsap.fromTo('.hero-particle',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: {
            amount: 2,
            from: 'random'
          },
          ease: 'power2.out'
        }
      )

      // ✅ 鼠标移动视差
      const handleMouseMove = (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2

        gsap.to('.hero-title', {
          x: mouseX * 20,
          y: mouseY * 10,
          duration: 1,
          ease: 'power2.out'
        })

        gsap.to('.hero-bg-element', {
          x: mouseX * 50,
          y: mouseY * 30,
          duration: 2,
          ease: 'power2.out'
        })
      }

      document.addEventListener('mousemove', handleMouseMove)
    })
  }

  onMounted(() => {
    initAnimations()
  })

  onUnmounted(() => {
    ctx?.revert()
  })
}
```

### 3.3 数字计数器优化模板

```javascript
// NumberCounter.vue
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const useNumberCounter = () => {
  const counters = ref([])
  let ctx

  const animateCounter = (element, target, options = {}) => {
    const { prefix = '', suffix = '', duration = 2 } = options
    const obj = { value: 0 }

    gsap.to(obj, {
      value: target,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: function() {
        element.textContent = prefix + Math.round(obj.value) + suffix
      }
    })
  }

  const initAnimations = () => {
    ctx = gsap.context(() => {
      counters.value.forEach((counter, index) => {
        const target = parseInt(counter.dataset.target || '0', 10)
        const prefix = counter.dataset.prefix || ''
        const suffix = counter.dataset.suffix || ''

        // ✅ 卡片入场
        gsap.fromTo(counter.closest('.stat-card'),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: counter.closest('.stats-grid'),
              start: 'top 80%'
            }
          }
        )

        // ✅ 数字递增
        animateCounter(counter, target, { prefix, suffix, duration: 2 + index * 0.2 })
      })
    })
  }

  onMounted(() => {
    initAnimations()
  })

  onUnmounted(() => {
    ctx?.revert()
  })

  return { counters }
}
```

---

## 四、性能优化最佳实践

### 4.1 GPU 加速配置

```css
/* GPU 加速 */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
  backface-visibility: hidden;
}

/* 动画元素 */
.animated-element {
  transform: translate3d(0, 0, 0);
  perspective: 1000px;
}
```

### 4.2 动画性能检查清单

```javascript
// performance-check.js
export const checkAnimationPerformance = () => {
  // 1. 检查是否使用 transform/opacity
  const hasNonOptimizedProps = (element, props) => {
    const badProps = ['left', 'top', 'width', 'height', 'margin', 'padding']
    return props.some(prop => badProps.includes(prop))
  }

  // 2. 性能监控
  let lastFrameTime = performance.now()
  let frameCount = 0
  let fps = 60

  const measureFPS = () => {
    frameCount++
    const currentTime = performance.now()

    if (currentTime - lastFrameTime >= 1000) {
      fps = Math.round(frameCount * 1000 / (currentTime - lastFrameTime))
      frameCount = 0
      lastFrameTime = currentTime

      if (fps < 30) {
        console.warn('低帧率: ' + fps + ' FPS')
      }
    }

    requestAnimationFrame(measureFPS)
  }

  requestAnimationFrame(measureFPS)

  return { getFPS: () => fps }
}
```

---

## 五、响应式动画适配

### 5.1 响应式动画断点

```javascript
// responsive-animations.js
import { ref, onMounted, onUnmounted } from 'vue'

export const useResponsiveAnimations = () => {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(true)

  const checkDevice = () => {
    const width = window.innerWidth
    isMobile.value = width < 768
    isTablet.value = width >= 768 && width < 1024
    isDesktop.value = width >= 1024
  }

  // 响应式动画配置
  const getAnimationConfig = () => {
    if (isMobile.value) {
      return {
        duration: 0.5,
        stagger: 0.05,
        start: 'top 95%',
        end: 'top 50%',
        scrub: 0.5
      }
    }

    if (isTablet.value) {
      return {
        duration: 0.7,
        stagger: 0.1,
        start: 'top 90%',
        end: 'top 40%',
        scrub: 1
      }
    }

    return {
      duration: 1,
      stagger: 0.15,
      start: 'top 85%',
      end: 'top 35%',
      scrub: 1.5
    }
  }

  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', checkDevice)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkDevice)
  })

  return {
    isMobile,
    isTablet,
    isDesktop,
    getAnimationConfig
  }
}
```

---

## 六、常见问题与解决方案

### 6.1 问题：动画元素不显示

**原因：**
- opacity 初始为 0
- 滚动触发位置不对
- CSS 覆盖

**解决方案：**
```javascript
// 方案1：使用 fromTo
gsap.fromTo('.element',
  { opacity: 0, y: 50 },
  { opacity: 1, y: 0, scrollTrigger: { ... } }
)

// 方案2：CSS 强制显示
.element {
  opacity: 1 !important;
}

// 方案3：设置初始状态
gsap.set('.element', { opacity: 1 })
```

### 6.2 问题：动画卡顿

**原因：**
- 动画属性不是 transform/opacity
- 同时动画元素过多
- 未使用 GPU 加速

**解决方案：**
```javascript
// 使用 transform
gsap.to('.element', {
  x: 100,  // ✅ 好
  left: '100px'  // ❌ 差
})

// 减少同时动画
gsap.globalTimeline.timeScale(0.5)

// GPU 加速
gsap.set('.element', { willChange: 'transform' })
```

### 6.3 问题：内存泄漏

**原因：**
- 未清理 ScrollTrigger
- 未清理 requestAnimationFrame
- 未清理定时器

**解决方案：**
```javascript
let ctx
let rafId

onMounted(() => {
  ctx = gsap.context(() => { ... })
})

onUnmounted(() => {
  ctx?.revert()
  if (rafId) cancelAnimationFrame(rafId)
  clearInterval(timerId)
})
```

---

## 七、验收测试清单

- [ ] 所有内容在正常滚动时可见
- [ ] 动画流畅，无明显卡顿
- [ ] 移动端动画正常播放
- [ ] 控制台无错误
- [ ] FPS 保持在 30+
- [ ] 页面加载时间 < 3秒

---

*文档版本：v2.0*
*更新时间：2024*
