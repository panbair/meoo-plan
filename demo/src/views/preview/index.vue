<template>
  <div ref="wrapperRef" class="page1-wrapper">

    <!-- 返回首页按钮 -->
    <button class="back-home-btn" @click="goHome">
      <span class="back-icon">←</span>
      <span class="back-text">返回首页</span>
    </button>

    <!-- 顶部 Hero -->
    <section class="hero-section">
      <h1 class="hero-title">动画展示</h1>
      <p class="hero-sub">滚动页面，体验 {{ totalCount }}+ 种动画效果</p>
      <div class="hero-scroll-hint">↓ 向下滚动</div>
    </section>

    <!-- 每个动画分组 -->
    <section
      v-for="group in animationOptions"
      :key="group.label"
      class="group-section"
    >
      <div class="group-header" :ref="el => groupHeaders.push(el as HTMLElement)">
        <span class="group-tag">{{ group.label }}</span>
        <span class="group-count">{{ group.options.length }} 个特效</span>
      </div>

      <div class="cards-grid">
        <div
          v-for="item in group.options"
          :key="item.value"
          class="anim-card"
          :ref="el => cardEls.push(el as HTMLElement)"
          :data-anim="item.value"
          @click="replayCard($event.currentTarget as HTMLElement, item.value)"
        >
          <div class="card-icon">{{ item.label.split(' ')[0] }}</div>
          <div class="card-name">{{ item.label.replace(/^[\S]+\s/, '') }}</div>
          <div class="card-value">{{ item.value }}</div>
          <div class="card-replay">点击重播</div>
          <div class="card-anim-type" :class="getAnimTypeClass(item.value)"></div>
        </div>
      </div>
    </section>

    <!-- 返回顶部 -->
    <button class="back-top" ref="backTopBtn" @click="scrollToTop">↑</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { animationOptions } from '../page2/animationOptions'
import { config as animConfig } from '../page2/animation/config'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const router = useRouter()

const wrapperRef  = ref<HTMLElement>()
const backTopBtn  = ref<HTMLElement>()
const cardEls: HTMLElement[]     = []
const groupHeaders: HTMLElement[] = []

const totalCount = computed(() =>
  animationOptions.reduce((sum: number, g: any) => sum + g.options.length, 0)
)

/** 返回首页 */
const goHome = () => {
  router.push('/')
}

/** 获取动画类型的样式类 */
function getAnimTypeClass(animName: string): string {
  const cfg = (animConfig as any)[animName]
  if (!cfg) return ''

  switch (cfg.type) {
    case 'timeline':
      return 'anim-type-timeline'
    case 'fromTo':
      return 'anim-type-fromto'
    case 'to':
      return 'anim-type-to'
    default:
      return ''
  }
}

/** 用 config 里的动画配置播放一次 */
function runAnim(el: HTMLElement, animName: string) {
  const cfg = (animConfig as any)[animName]
  if (!cfg) {
    console.warn(`动画配置不存在: ${animName}`)
    return
  }

  console.log(`播放动画: ${animName}`, cfg)

  // 确保卡片从基础隐藏状态开始
  gsap.set(el, {
    opacity: 0,
    y: 30,
    x: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    skewX: 0,
    skewY: 0,
    z: 0
  })

  if (cfg.type === 'timeline') {
    const tl = gsap.timeline()
    const [first, ...rest] = cfg.animations
    tl.set(el, first)
    rest.forEach((a: gsap.TweenVars) => tl.to(el, a))
  } else if (cfg.type === 'fromTo') {
    const [from, to, ...extra] = cfg.animations
    // 合并 from 状态，确保从隐藏开始
    const mergedFrom = { opacity: 0, y: 30, ...from }
    if (extra.length) {
      const tl = gsap.timeline()
      tl.fromTo(el, mergedFrom, to)
      extra.forEach((a: gsap.TweenVars) => tl.to(el, a))
    } else {
      gsap.fromTo(el, mergedFrom, to)
    }
  } else {
    // 对于 to 类型的动画，先设置初始状态再执行
    const firstAnim = cfg.animations[0]
    gsap.set(el, {
      opacity: 0,
      y: 30,
      x: firstAnim.x || 0,
      scale: firstAnim.scale || 1,
      rotation: firstAnim.rotation || 0,
      rotationX: firstAnim.rotationX || 0,
      rotationY: firstAnim.rotationY || 0,
      skewX: firstAnim.skewX || 0,
      skewY: firstAnim.skewY || 0,
      z: firstAnim.z || 0
    })
    gsap.to(el, firstAnim)
  }
}

/** 点击卡片重播 */
function replayCard(el: HTMLElement | null, animName: string) {
  if (!el) return

  // 检查动画配置是否存在
  const cfg = (animConfig as any)[animName]
  if (!cfg) {
    return
  }

  // 停止当前卡片的所有动画
  gsap.killTweensOf(el)
  // 清除所有内联样式
  gsap.set(el, { clearProps: 'all' })
  // 设置初始隐藏状态
  gsap.set(el, {
    opacity: 0,
    y: 30,
    x: 0,
    scale: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    skewX: 0,
    skewY: 0,
    z: 0
  })
  // 立即播放该卡片配置的动画
  runAnim(el, animName)
}

const scrollToTop = () => {
  gsap.to(window, { duration: 1.2, scrollTo: { y: 0, autoKill: false }, ease: 'power3.inOut' })
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {

    // Hero 标题进入动画
    const heroTitle = wrapperRef.value?.querySelector('.hero-title')
    const heroSub = wrapperRef.value?.querySelector('.hero-sub')
    const scrollHint = wrapperRef.value?.querySelector('.hero-scroll-hint')

    if (heroTitle) {
      gsap.fromTo(heroTitle,
        {
          y: 80,
          opacity: 0,
          scale: 0.8,
          filter: 'blur(10px)'
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'elastic.out(1, 0.5)'
        }
      )
    }

    if (heroSub) {
      gsap.fromTo(heroSub,
        {
          y: 40,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: 'power3.out'
        }
      )
    }

    if (scrollHint) {
      gsap.fromTo(scrollHint,
        {
          opacity: 0,
          y: -20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.8,
          ease: 'power2.out'
        }
      )
    }

    // 分组标题滚动进入动画
    groupHeaders.forEach(el => {
      if (!el) return
      gsap.from(el, {
        x: -60, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      })
    })

    // 每张卡片进入视窗时播放对应动画
    cardEls.forEach((el, i) => {
      if (!el) return
      // 获取该卡片配置的动画名称
      const animName = el.dataset.anim

      if (!animName) {
        console.warn('卡片缺少 data-anim 属性', el)
        return
      }

      // 检查动画配置是否存在
      const cfg = (animConfig as any)[animName]
      if (!cfg) {
        console.warn(`动画配置不存在: ${animName}`, el)
        return
      }

      // 先设置初始状态为隐藏
      gsap.set(el, {
        opacity: 0,
        y: 30
      })

      // 创建独立的 ScrollTrigger，确保每张卡片每次进入视窗时都触发动画
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: false,  // 每次都触发
        toggleActions: 'play none none reverse',
        onEnter: () => {
          // 停止当前卡片的所有动画
          gsap.killTweensOf(el)
          // 清除所有内联样式，恢复到 CSS 初始状态
          gsap.set(el, { clearProps: 'all' })
          // 立即重新设置初始隐藏状态
          gsap.set(el, {
            opacity: 0,
            y: 30,
            x: 0,
            scale: 1,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            skewX: 0,
            skewY: 0,
            z: 0
          })
          // 交错延迟：同一行的卡片依次播放
          const delay = (i % 4) * 0.08
          // 执行该卡片配置的动画
          setTimeout(() => {
            runAnim(el, animName)
          }, delay * 1000)
        },
        onLeave: () => {
          // 离开视窗时停止动画
          gsap.killTweensOf(el)
          gsap.set(el, { clearProps: 'all' })
        },
        onEnterBack: () => {
          // 从底部返回时重新触发
          gsap.killTweensOf(el)
          gsap.set(el, { clearProps: 'all' })
          gsap.set(el, {
            opacity: 0,
            y: 30,
            x: 0,
            scale: 1,
            rotation: 0,
            rotationX: 0,
            rotationY: 0,
            skewX: 0,
            skewY: 0,
            z: 0
          })
          const delay = (i % 4) * 0.08
          setTimeout(() => {
            runAnim(el, animName)
          }, delay * 1000)
        },
        onLeaveBack: () => {
          // 向上离开时停止动画并隐藏
          gsap.killTweensOf(el)
          gsap.set(el, { clearProps: 'all' })
          gsap.set(el, { opacity: 0, y: 30 })
        }
      })

      // 保存 trigger 引用，方便后续清理
      const triggerId = (trigger as any).id
      el.dataset.triggerId = triggerId
    })

    // 返回顶部按钮
    ScrollTrigger.create({
      trigger: 'body',
      start: `top+=${window.innerHeight} top`,
      onEnter:     () => gsap.to(backTopBtn.value!, { opacity: 1, scale: 1,   duration: 0.4, ease: 'back.out(1.7)' }),
      onLeaveBack: () => gsap.to(backTopBtn.value!, { opacity: 0, scale: 0.5, duration: 0.3 })
    })

    ScrollTrigger.refresh()
  }, wrapperRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.page1-wrapper {
  width: 100%;
  background: #0a0a14;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
}

// ── Hero ──────────────────────────────────────────────────
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 6%;
  background: radial-gradient(ellipse at 50% 60%, rgba(124,58,237,0.18) 0%, transparent 70%);
}

.hero-title {
  font-size: 150px;
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 16px;
}

.hero-sub {
  font-size: 35px;
  color: #94a3b8;
  margin: 0 0 24px;
}

.hero-legend {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  padding: 12px 24px;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.08);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0.8;

  &.anim-type-timeline {
    background: #10b981;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
  }

  &.anim-type-fromto {
    background: #f59e0b;
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
  }

  &.anim-type-to {
    background: #3b82f6;
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
  }
}

.legend-text {
  font-size: 0.8rem;
  color: #a78bfa;
  font-weight: 500;
}

.hero-scroll-hint {
  font-size: 30px;
  color: #475569;
  letter-spacing: 2px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(8px); }
}

// ── Group Section ─────────────────────────────────────────
.group-section {
  padding: 60px 5%;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.group-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 36px;
}

.group-tag {
  font-size: 1.1rem;
  font-weight: 700;
  color: #a78bfa;
  letter-spacing: 1px;
}

.group-count {
  font-size: 0.78rem;
  color: #475569;
  background: rgba(167,139,250,0.1);
  border: 1px solid rgba(167,139,250,0.2);
  border-radius: 20px;
  padding: 2px 10px;
}

// ── Cards Grid ────────────────────────────────────────────
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));  // 从 160px 增加到 280px，约1.75倍
  gap: 20px;  // 从 16px 增加到 20px
}

.anim-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;  // 从 16px 增加到 20px
  padding: 32px 24px;  // 从 20px 16px 增加到 32px 24px
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: hidden;
  will-change: transform, opacity;
  transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
  min-height: 220px;  // 添加最小高度，确保卡片大小一致
  // 初始状态由 GSAP 通过 onEnter 设置，这里不需要 CSS 初始值

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(79,70,229,0.06));
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: inherit;
  }

  &:hover {
    border-color: rgba(167,139,250,0.6);
    background: rgba(255,255,255,0.08);
    box-shadow: 0 12px 40px rgba(124,58,237,0.4);  // 增强阴影效果
    transform: translateY(-6px);  // 增加上移距离
    &::before { opacity: 1; }
    .card-replay { opacity: 1; }
  }

  &:active {
    transform: translateY(-3px);  // 增加上移距离
    box-shadow: 0 6px 20px rgba(124,58,237,0.3);  // 增强阴影效果
  }
}

.card-icon {
  font-size: 3rem;  // 从 1.8rem 增加到 3rem
  margin-bottom: 16px;  // 从 8px 增加到 16px
  line-height: 1;
}

.card-name {
  font-size: 1.1rem;  // 从 0.82rem 增加到 1.1rem
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 8px;  // 从 4px 增加到 8px
  line-height: 1.3;
}

.card-value {
  font-size: 0.9rem;  // 从 0.68rem 增加到 0.9rem
  color: #fff;
  font-family: 'Courier New', monospace;
  margin-top: 10px;  // 从 6px 增加到 10px
  word-break: break-all;
  padding: 6px 12px;
  background: rgb(43 105 143 / 20%);
  border-radius: 8px;
}

.card-replay {
  position: absolute;
  bottom: 10px;  // 从 6px 增加到 10px
  right: 14px;  // 从 10px 增加到 14px
  font-size: 0.75rem;  // 从 0.62rem 增加到 0.75rem
  color: #a78bfa;
  opacity: 0;
  transition: opacity 0.2s;
  font-weight: 500;
}

.card-anim-type {
  position: absolute;
  top: 12px;  // 从 8px 增加到 12px
  right: 12px;  // 从 8px 增加到 12px
  width: 10px;  // 从 8px 增加到 10px
  height: 10px;  // 从 8px 增加到 10px
  border-radius: 50%;
  opacity: 0.6;

  &.anim-type-timeline {
    background: #10b981;  // 绿色
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);  // 增强阴影
  }

  &.anim-type-fromto {
    background: #f59e0b;  // 橙色
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
  }

  &.anim-type-to {
    background: #3b82f6;  // 蓝色
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
  }
}

// ── Back Home ─────────────────────────────────────────────
.back-home-btn {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(124,58,237,0.9), rgba(79,70,229,0.9));
  color: #fff;
  border: 1px solid rgba(167,139,250,0.3);
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(124,58,237,0.3);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(124,58,237,1), rgba(79,70,229,1));
    transform: translateX(-4px);
    box-shadow: 0 6px 24px rgba(124,58,237,0.5);
    border-color: rgba(167,139,250,0.6);
  }

  &:active {
    transform: translateX(-2px);
  }
}

.back-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.back-text {
  white-space: nowrap;
}

// ── Back Top ──────────────────────────────────────────────
.back-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 999;
  opacity: 0;
  transform: scale(0.5);
  will-change: transform, opacity;
  box-shadow: 0 4px 20px rgba(124,58,237,0.4);
}

@media (max-width: 1200px) {
  .cards-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));  // 移动端适当缩小
    gap: 12px;
  }
  .group-section { padding: 40px 4%; }
  .anim-card {
    padding: 24px 18px;
    min-height: 180px;
  }
  .card-icon { font-size: 2.2rem; margin-bottom: 12px; }
  .card-name { font-size: 0.95rem; }
  .card-value { font-size: 0.8rem; padding: 4px 10px; }
}
</style>
