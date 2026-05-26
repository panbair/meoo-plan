<template>
  <div class="tc-wrapper">
    <!-- 进度条 -->
    <div id="tcProgress" class="tc-progress"></div>

    <!-- 导航点 -->
    <nav id="tcNavDots" class="tc-nav-dots"></nav>

    <!-- 页面指示器 -->
    <div class="tc-page-indicator">
      <span class="tc-current">1</span><span class="tc-total"> / {{ PANELS }}</span>
    </div>

    <!-- 裁剪类型标签 -->
    <div class="tc-type-label" id="tcTypeLabel">circle()</div>

    <!-- 滚动空间 -->
    <div id="tcScrollArea" class="tc-scroll-area">

      <!-- 画布窗口 -->
      <div class="tc-canvas-sticky">
        <div id="tcCanvas" class="tc-canvas">

          <div
            v-for="(panel, pi) in panels"
            :key="pi"
            class="tc-panel"
            :class="'tc-panel-' + pi"
            :style="{ zIndex: PANELS - pi }"
          >
            <div class="tc-panel-bg"></div>
            <div class="tc-panel-shape" v-if="panel.shape">
              <div v-for="n in panel.shapeCount" :key="n" class="tc-float-geo"></div>
            </div>
            <div class="tc-panel-content">
              <span class="tc-panel-num">{{ String(pi + 1).padStart(2, '0') }}</span>
              <div class="tc-panel-icon">{{ panel.icon }}</div>
              <h2 class="tc-panel-title">{{ panel.title }}</h2>
              <p class="tc-panel-desc">{{ panel.desc }}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const PANELS = 6

const panels = [
  { icon: '●', title: '圆形裁剪', desc: 'circular mask reveals content', shape: true, shapeCount: 3 },
  { icon: '■', title: '方形裁剪', desc: 'rectangular inset sliding from center', shape: true, shapeCount: 4 },
  { icon: '▲', title: '多边形裁剪', desc: 'multi-point polygon unveils the scene', shape: true, shapeCount: 5 },
  { icon: '◆', title: '菱形裁剪', desc: 'diamond-shaped clip reveals from center', shape: true, shapeCount: 6 },
  { icon: '⬡', title: '六边形裁剪', desc: 'hexagonal mask expands outward', shape: true, shapeCount: 7 },
  { icon: '★', title: '星形裁剪', desc: 'star-shaped clip-path transitions', shape: true, shapeCount: 8 }
]

let gsap, ScrollTrigger
let ctx = null

const clipDefs = [
  { name: 'circle()', getValue: (t) => `circle(${t * 80}%)` },
  { name: 'inset()', getValue: (t) => `inset(${(1 - t) * 50}%)` },
  { name: 'polygon()', getValue: (t) => {
    const r = t * 50
    return `polygon(50% ${50 - r}%, ${50 + r}% 50%, 50% ${50 + r}%, ${50 - r}% 50%)`
  }},
  { name: 'diamond()', getValue: (t) => {
    const r = t * 70
    return `polygon(50% ${50 - r}%, ${50 + r}% 50%, 50% ${50 + r}%, ${50 - r}% 50%)`
  }},
  { name: 'hexagon()', getValue: (t) => {
    const r = t * 60
    const h = r * 0.866
    return `polygon(50% ${50 - r}%, ${50 + h}% ${50 - r/2}%, ${50 + h}% ${50 + r/2}%, 50% ${50 + r}%, ${50 - h}% ${50 + r/2}%, ${50 - h}% ${50 - r/2}%)`
  }},
  { name: 'star()', getValue: (t) => {
    const outer = t * 60
    const inner = outer * 0.4
    const pts = []
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2
      const r = i % 2 === 0 ? outer : inner
      const cx = 50 + r * Math.cos(angle)
      const cy = 50 + r * Math.sin(angle)
      pts.push(`${cx}% ${cy}%`)
    }
    return `polygon(${pts.join(', ')})`
  }}
]

onMounted(async () => {
  const gsapMod = await import('gsap')
  gsap = gsapMod.default
  const stMod = await import('gsap/ScrollTrigger')
  ScrollTrigger = stMod.ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)
  init()
})

function init() {
  ctx = gsap.context((self) => {
    const scrollArea = document.getElementById('tcScrollArea')
    const canvas = document.getElementById('tcCanvas')
    const progress = document.getElementById('tcProgress')
    const navDots = document.getElementById('tcNavDots')
    const typeLabel = document.getElementById('tcTypeLabel')
    const total = PANELS
    const currentEl = document.querySelector('.tc-current')

    if (!scrollArea || !canvas) return

    // 导航点
    if (navDots) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('div')
        dot.className = 'tc-dot'
        dot.dataset.index = i
        dot.addEventListener('click', () => {
          window.scrollTo({ top: (i / (total - 1)) * (scrollArea.scrollHeight - window.innerHeight), behavior: 'smooth' })
        })
        navDots.appendChild(dot)
      }
    }

    const dotEls = document.querySelectorAll('.tc-dot')
    const panelEls = canvas.querySelectorAll(':scope > .tc-panel')

    function updateUI(idx) {
      if (currentEl) currentEl.textContent = idx + 1
      dotEls.forEach((d, i) => d.classList.toggle('active', i === idx))
      if (typeLabel) typeLabel.textContent = clipDefs[idx].name
    }

    // 每个面板做 clip-path + opacity 双动画
    panelEls.forEach((el, i) => {
      const panelT = i / (total - 1)
      const duration = 1 / (total - 1)

      // opacity 动画：自己的区间内淡出
      gsap.to(el, {
        opacity: 0,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: scrollArea,
          start: () => `${(panelT + duration * 0.6) * 100}% top`,
          end: () => `${(panelT + duration) * 100}% top`,
          scrub: true
        }
      })

      // clip-path 动画：自己的区间内展开
      const clipObj = { progress: 0 }
      gsap.to(clipObj, {
        progress: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: scrollArea,
          start: () => `${panelT * 100}% top`,
          end: () => `${(panelT + duration * 0.7) * 100}% top`,
          scrub: 0.6,
          onUpdate: () => {
            const { name, getValue } = clipDefs[i]
            el.style.clipPath = getValue(Math.min(clipObj.progress, 1))
          }
        }
      })
    })

    // 进度条
    gsap.to({ p: 0 }, {
      p: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: scrollArea,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          if (progress) progress.style.width = (self.progress * 100) + '%'
          const raw = self.progress * (total - 1)
          updateUI(Math.min(Math.round(raw), total - 1))
        }
      }
    })

    // 键盘
    const onKey = (e) => {
      const st = ScrollTrigger.getAll().find(s => s.trigger === scrollArea)
      if (!st) return
      let idx = Math.round(st.progress * (total - 1))
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') idx = Math.min(idx + 1, total - 1)
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') idx = Math.max(idx - 1, 0)
      else return
      e.preventDefault()
      window.scrollTo({ top: (idx / (total - 1)) * (scrollArea.scrollHeight - window.innerHeight), behavior: 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    self._onKey = onKey

    // 触摸
    let touchY = 0
    const onTouch = (e) => { touchY = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) < 40) return
      const st = ScrollTrigger.getAll().find(s => s.trigger === scrollArea)
      if (!st) return
      let idx = Math.round(st.progress * (total - 1))
      idx = dy > 0 ? Math.min(idx + 1, total - 1) : Math.max(idx - 1, 0)
      window.scrollTo({ top: (idx / (total - 1)) * (scrollArea.scrollHeight - window.innerHeight), behavior: 'smooth' })
    }
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    self._onTouch = onTouch
    self._onTouchEnd = onTouchEnd

    // 初始设置首个面板 clip
    panelEls[0].style.clipPath = 'circle(0%)'
    updateUI(0)
  })
}

function destroy() {
  if (ctx) {
    if (ctx._onKey) window.removeEventListener('keydown', ctx._onKey)
    if (ctx._onTouch) window.removeEventListener('touchstart', ctx._onTouch)
    if (ctx._onTouchEnd) window.removeEventListener('touchend', ctx._onTouchEnd)
    ctx.revert()
    ctx = null
  }
}

onUnmounted(destroy)
</script>

<style scoped>
.tc-wrapper {
  --tc-bg: #0a0a0f;
  width: 100vw;
  overflow: hidden;
  background: var(--tc-bg);
  color: #fff;
  position: relative;
}

.tc-scroll-area {
  height: calc(var(--vh, 1vh) * 100 * 6);
  position: relative;
}

.tc-canvas-sticky {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.tc-canvas {
  width: 100%;
  height: 100%;
  position: relative;
}

.tc-panel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: circle(0%);
  will-change: clip-path, opacity;
}

.tc-panel-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.tc-panel-0 .tc-panel-bg { background: linear-gradient(135deg, #667eea, #764ba2); }
.tc-panel-1 .tc-panel-bg { background: linear-gradient(135deg, #f093fb, #f5576c); }
.tc-panel-2 .tc-panel-bg { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.tc-panel-3 .tc-panel-bg { background: linear-gradient(135deg, #43e97b, #38f9d7); }
.tc-panel-4 .tc-panel-bg { background: linear-gradient(135deg, #fa709a, #fee140); }
.tc-panel-5 .tc-panel-bg { background: linear-gradient(135deg, #a18cd1, #fbc2eb); }

.tc-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.15);
  z-index: 1;
  pointer-events: none;
}

.tc-panel-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
}

.tc-panel-num {
  position: absolute;
  top: -4rem;
  right: -2rem;
  font-size: 6rem;
  font-weight: 900;
  opacity: 0.06;
  color: #fff;
  line-height: 1;
  pointer-events: none;
}

.tc-panel-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.tc-panel-title {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0.5rem 0;
}

.tc-panel-desc {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  opacity: 0.6;
  max-width: 400px;
}

.tc-type-label {
  position: fixed;
  top: 1.5rem;
  right: 6rem;
  z-index: 1000;
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.05);
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.06);
}

.tc-panel-shape {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.tc-float-geo {
  position: absolute;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 50%;
  animation: tc-float 8s ease-in-out infinite;
}

.tc-panel-0 .tc-float-geo { animation-delay: 0s; }
.tc-panel-1 .tc-float-geo { animation-delay: -1s; }
.tc-panel-2 .tc-float-geo { animation-delay: -2s; }
.tc-panel-3 .tc-float-geo { animation-delay: -3s; }
.tc-panel-4 .tc-float-geo { animation-delay: -4s; }
.tc-panel-5 .tc-float-geo { animation-delay: -5s; }

.tc-float-geo:nth-child(1) { width: 120px; height: 120px; top: 10%; left: 8%; }
.tc-float-geo:nth-child(2) { width: 80px; height: 80px; top: 60%; left: 75%; }
.tc-float-geo:nth-child(3) { width: 60px; height: 60px; top: 70%; left: 15%; }
.tc-float-geo:nth-child(4) { width: 100px; height: 100px; top: 20%; left: 80%; }
.tc-float-geo:nth-child(5) { width: 50px; height: 50px; top: 40%; left: 40%; }
.tc-float-geo:nth-child(6) { width: 70px; height: 70px; top: 80%; left: 60%; }
.tc-float-geo:nth-child(7) { width: 90px; height: 90px; top: 50%; left: 25%; }
.tc-float-geo:nth-child(8) { width: 40px; height: 40px; top: 15%; left: 50%; }

@keyframes tc-float {
  0%, 100% { transform: translateY(0) translateX(0) scale(1); }
  25% { transform: translateY(-20px) translateX(10px) scale(1.05); }
  50% { transform: translateY(10px) translateX(-10px) scale(0.95); }
  75% { transform: translateY(-10px) translateX(15px) scale(1.02); }
}
</style>

<style>
.tc-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #f093fb, #4facfe, #43e97b, #fa709a, #a18cd1);
  z-index: 1000;
  width: 0%;
  transition: width 0.1s linear;
}

.tc-nav-dots {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.tc-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  cursor: pointer;
  transition: all 0.3s;
}

.tc-dot.active {
  background: #fff;
  box-shadow: 0 0 12px rgba(255,255,255,0.6);
  transform: scale(1.3);
}

.tc-page-indicator {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 1000;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
}
.tc-current { color: #fff; font-weight: 700; }

@media (max-width: 768px) {
  .tc-nav-dots { right: 0.8rem; gap: 0.6rem; }
  .tc-page-indicator { left: 1rem; bottom: 1rem; }
  .tc-type-label { right: 4.5rem; top: 1rem; font-size: 0.65rem; padding: 0.2rem 0.6rem; }
}
</style>
