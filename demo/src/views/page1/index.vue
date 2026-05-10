<template>
  <div ref="wrapperRef" class="page1-wrapper">

    <!-- 顶部 Hero -->
    <section class="hero-section">
      <h1 class="hero-title">JS 动画展示</h1>
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
        </div>
      </div>
    </section>

    <!-- 返回顶部 -->
    <button class="back-top" ref="backTopBtn" @click="scrollToTop">↑</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { animationOptions } from '../page2/animationOptions'
import { config as animConfig } from '../page2/animation/config'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const wrapperRef  = ref<HTMLElement>()
const backTopBtn  = ref<HTMLElement>()
const cardEls: HTMLElement[]     = []
const groupHeaders: HTMLElement[] = []

const totalCount = computed(() =>
  animationOptions.reduce((sum: number, g: any) => sum + g.options.length, 0)
)

/** 用 config 里的动画配置播放一次 */
function runAnim(el: HTMLElement, animName: string) {
  const cfg = (animConfig as any)[animName]
  if (!cfg) return

  if (cfg.type === 'timeline') {
    const tl = gsap.timeline()
    const [first, ...rest] = cfg.animations
    tl.set(el, first)
    rest.forEach((a: gsap.TweenVars) => tl.to(el, a))
  } else if (cfg.type === 'fromTo') {
    const [from, to, ...extra] = cfg.animations
    if (extra.length) {
      const tl = gsap.timeline()
      tl.fromTo(el, from, to)
      extra.forEach((a: gsap.TweenVars) => tl.to(el, a))
    } else {
      gsap.fromTo(el, from, to)
    }
  } else {
    gsap.to(el, cfg.animations[0])
  }
}

/** 点击卡片重播 */
function replayCard(el: HTMLElement | null, animName: string) {
  if (!el) return
  gsap.killTweensOf(el)
  gsap.set(el, { clearProps: 'all' })
  runAnim(el, animName)
}

const scrollToTop = () => {
  gsap.to(window, { duration: 1.2, scrollTo: { y: 0, autoKill: false }, ease: 'power3.inOut' })
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {

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
      const animName = el.dataset.anim || 'fadeIn'

      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: false,
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.killTweensOf(el)
          gsap.set(el, { clearProps: 'all' })
          // 交错延迟：同排卡片依次飞入
          gsap.delayedCall((i % 4) * 0.08, () => runAnim(el, animName))
        },
        onLeaveBack: () => {
          gsap.killTweensOf(el)
          gsap.set(el, { opacity: 0, y: 30 })
        }
      })
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
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 6%;
  background: radial-gradient(ellipse at 50% 60%, rgba(124,58,237,0.18) 0%, transparent 70%);
}

.hero-title {
  font-size: clamp(2.4rem, 6vw, 5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 16px;
}

.hero-sub {
  font-size: 1.1rem;
  color: #94a3b8;
  margin: 0 0 40px;
}

.hero-scroll-hint {
  font-size: 0.85rem;
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
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.anim-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 20px 16px;
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: hidden;
  will-change: transform, opacity;
  transition: border-color 0.25s, background 0.25s;
  // 初始隐藏，等 ScrollTrigger 触发后显示
  opacity: 0;
  transform: translateY(30px);

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
    border-color: rgba(167,139,250,0.4);
    background: rgba(255,255,255,0.06);
    &::before { opacity: 1; }
    .card-replay { opacity: 1; }
  }
}

.card-icon {
  font-size: 1.8rem;
  margin-bottom: 8px;
  line-height: 1;
}

.card-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 4px;
  line-height: 1.3;
}

.card-value {
  font-size: 0.68rem;
  color: #475569;
  font-family: 'Courier New', monospace;
}

.card-replay {
  position: absolute;
  bottom: 6px;
  right: 10px;
  font-size: 0.62rem;
  color: #a78bfa;
  opacity: 0;
  transition: opacity 0.2s;
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

@media (max-width: 768px) {
  .cards-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
  .group-section { padding: 40px 4%; }
}
</style>
