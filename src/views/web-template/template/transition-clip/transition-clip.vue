<script setup lang="ts">
/**
 * ==================== Transition Clip ====================
 * clip-path 裁剪切换，6 面版叠加布局，滚动驱动。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 6
let vh = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let stage: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let typeLabel: HTMLElement | null = null
let panels: HTMLElement[] = []
let mainTL: gsap.core.Timeline | null = null

// ==================== 裁剪定义 ====================
const clipDefs = [
  { name: 'circle()',    getValue: (t: number) => `circle(${t * 80}%)` },
  { name: 'inset()',     getValue: (t: number) => `inset(${(1 - t) * 50}%)` },
  {
    name: 'polygon()', getValue: (t: number) => {
      const r = t * 50
      return `polygon(50% ${50 - r}%, ${50 + r}% 50%, 50% ${50 + r}%, ${50 - r}% 50%)`
    }
  },
  {
    name: 'diamond()', getValue: (t: number) => {
      const r = t * 70
      return `polygon(50% ${50 - r}%, ${50 + r}% 50%, 50% ${50 + r}%, ${50 - r}% 50%)`
    }
  },
  {
    name: 'hexagon()', getValue: (t: number) => {
      const r = t * 60
      const h = r * 0.866
      return `polygon(50% ${50 - r}%, ${50 + h}% ${50 - r / 2}%, ${50 + h}% ${50 + r / 2}%, 50% ${50 + r}%, ${50 - h}% ${50 + r / 2}%, ${50 - h}% ${50 - r / 2}%)`
    }
  },
  {
    name: 'star()', getValue: (t: number) => {
      const outer = t * 60
      const inner = outer * 0.4
      const pts: string[] = []
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2
        const r = i % 2 === 0 ? outer : inner
        const cx = 50 + r * Math.cos(angle)
        const cy = 50 + r * Math.sin(angle)
        pts.push(`${cx}% ${cy}%`)
      }
      return `polygon(${pts.join(', ')})`
    }
  }
]

// ==================== UI 辅助 ====================
function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tc-nav-dot' + (i === 0 ? ' tc-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tc-nav-dot').forEach((dot, i) => {
    dot.classList.toggle('tc-active', i === index)
  })
  const el = document.querySelector('.tc-page-indicator .tc-current')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
  if (typeLabel) typeLabel.textContent = clipDefs[index].name
}

function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const targetTop = (scrollArea?.offsetTop || 0) + index * vh
  window.scrollTo({ top: targetTop, behavior: 'smooth' })
}

// ==================== 键盘 / 触摸 ====================
function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = {
    ArrowDown: 1, ArrowRight: 1,
    ArrowUp: -1, ArrowLeft: -1,
    Home: 0, End: totalPanels - 1
  }
  if (keyMap[e.key] !== undefined) {
    e.preventDefault()
    e.key === 'Home' || e.key === 'End'
      ? goToPanel(keyMap[e.key])
      : goToPanel(currentIndex + keyMap[e.key])
  }
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1))
}

// ==================== 时间线构建 ====================
function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })

  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1

  // 初始状态：所有面板隐藏，第一个面板可见且裁剪为 0（缩到最小）
  gsap.set(panels, { opacity: 0, clipPath: clipDefs[0].getValue(0) })
  gsap.set(panels[0], { opacity: 1, clipPath: clipDefs[0].getValue(1) })

  for (let i = 0; i < segments; i++) {
    // 当前面板淡出
    tl.to(panels[i], { opacity: 0, duration: 0.8, ease: 'power2.in' }, i)

    // 下一个面板：opacity 淡入 + clip-path 从 0 展开到 1
    const clipObj = { progress: 0 }
    tl.fromTo(panels[i + 1],
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out' },
      i
    )
    tl.fromTo(clipObj,
      { progress: 0 },
      {
        progress: 1,
        duration: 1,
        ease: 'power3.out',
        onUpdate: () => {
          const def = clipDefs[i + 1]
          panels[i + 1].style.clipPath = def.getValue(Math.min(clipObj.progress, 1))
        }
      },
      i
    )
  }

  return tl
}

function startTimeline() {
  const tl = buildTimeline()
  mainTL = tl

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.8,
    animation: tl,
    onUpdate: (self) => {
      const idx = Math.round(self.progress * (totalPanels - 1))
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }
    }
  })
}

function killCurrent() {
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === scrollArea) st.kill()
  })
  mainTL?.kill()
  mainTL = null
  gsap.set(panels, { clearProps: 'all' })
}

// ==================== 生命周期 ====================
function init() {
  vh = window.innerHeight

  scrollArea = document.getElementById('tcScrollArea') as HTMLElement
  stage = document.getElementById('tcStage') as HTMLElement
  progressBar = document.getElementById('tcProgressBar')
  navDots = document.getElementById('tcNavDots')
  typeLabel = document.getElementById('tcTypeLabel')
  if (!scrollArea || !stage) return

  panels = gsap.utils.toArray('.tc-panel') as HTMLElement[]

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots()
  updateUI(0)
  startTimeline()
}

function destroy() {
  killCurrent()
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTouchStart)
  document.removeEventListener('touchend', onTouchEnd)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tc-page">
    <div id="tcProgressBar" class="tc-progress-bar"></div>
    <nav id="tcNavDots" class="tc-nav-dots"></nav>
    <div class="tc-page-indicator">
      <span class="tc-current">1</span>
      <span class="tc-total"> / {{ totalPanels }}</span>
    </div>
    <div id="tcTypeLabel" class="tc-type-label">circle()</div>

    <div id="tcScrollArea" class="tc-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tcStage" class="tc-stage">
        <section class="tc-panel tc-panel-0">
          <div class="tc-shape-layer">
            <div v-for="n in 3" :key="n" class="tc-float-geo"></div>
          </div>
          <div class="tc-content">
            <div class="tc-badge">01</div>
            <h2>圆形裁剪</h2>
            <p>circular mask reveals content</p>
          </div>
        </section>
        <section class="tc-panel tc-panel-1">
          <div class="tc-shape-layer">
            <div v-for="n in 4" :key="n" class="tc-float-geo"></div>
          </div>
          <div class="tc-content">
            <div class="tc-badge">02</div>
            <h2>方形裁剪</h2>
            <p>rectangular inset sliding from center</p>
          </div>
        </section>
        <section class="tc-panel tc-panel-2">
          <div class="tc-shape-layer">
            <div v-for="n in 5" :key="n" class="tc-float-geo"></div>
          </div>
          <div class="tc-content">
            <div class="tc-badge">03</div>
            <h2>多边形裁剪</h2>
            <p>multi-point polygon unveils the scene</p>
          </div>
        </section>
        <section class="tc-panel tc-panel-3">
          <div class="tc-shape-layer">
            <div v-for="n in 6" :key="n" class="tc-float-geo"></div>
          </div>
          <div class="tc-content">
            <div class="tc-badge">04</div>
            <h2>菱形裁剪</h2>
            <p>diamond-shaped clip reveals from center</p>
          </div>
        </section>
        <section class="tc-panel tc-panel-4">
          <div class="tc-shape-layer">
            <div v-for="n in 7" :key="n" class="tc-float-geo"></div>
          </div>
          <div class="tc-content">
            <div class="tc-badge">05</div>
            <h2>六边形裁剪</h2>
            <p>hexagonal mask expands outward</p>
          </div>
        </section>
        <section class="tc-panel tc-panel-5">
          <div class="tc-shape-layer">
            <div v-for="n in 8" :key="n" class="tc-float-geo"></div>
          </div>
          <div class="tc-content">
            <div class="tc-badge">06</div>
            <h2>星形裁剪</h2>
            <p>star-shaped clip-path transitions</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tc-page { font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.tc-scroll-area { position: relative; }
.tc-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.tc-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::after { content: ''; position: absolute; inset: 0; background: rgba(0, 0, 0, .15); pointer-events: none; }
}

.tc-content { text-align: center; z-index: 1; h2 { font-size: 3.5rem; font-weight: 900; margin: 0 0 16px; } p { font-size: 1.2rem; opacity: .6; margin: 0; max-width: 400px; } }
.tc-badge { display: inline-block; padding: 6px 20px; border: 1px solid rgba(255, 255, 255, .25); border-radius: 20px; font-size: .75rem; letter-spacing: 3px; margin-bottom: 24px; }

.tc-panel-0 { background: linear-gradient(135deg, #667eea, #764ba2); }
.tc-panel-1 { background: linear-gradient(135deg, #f093fb, #f5576c); }
.tc-panel-2 { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.tc-panel-3 { background: linear-gradient(135deg, #43e97b, #38f9d7); }
.tc-panel-4 { background: linear-gradient(135deg, #fa709a, #fee140); }
.tc-panel-5 { background: linear-gradient(135deg, #a18cd1, #fbc2eb); }

/* 浮动装饰 */
.tc-shape-layer { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.tc-float-geo {
  position: absolute; border: 1px solid rgba(255, 255, 255, .06); border-radius: 50%;
  animation: tc-float 8s ease-in-out infinite;
  &:nth-child(1) { width: 120px; height: 120px; top: 10%; left: 8%; }
  &:nth-child(2) { width: 80px; height: 80px; top: 60%; left: 75%; }
  &:nth-child(3) { width: 60px; height: 60px; top: 70%; left: 15%; }
  &:nth-child(4) { width: 100px; height: 100px; top: 20%; left: 80%; }
  &:nth-child(5) { width: 50px; height: 50px; top: 40%; left: 40%; }
  &:nth-child(6) { width: 70px; height: 70px; top: 80%; left: 60%; }
  &:nth-child(7) { width: 90px; height: 90px; top: 50%; left: 25%; }
  &:nth-child(8) { width: 40px; height: 40px; top: 15%; left: 50%; }
}

@keyframes tc-float {
  0%, 100% { transform: translateY(0) translateX(0) scale(1); }
  25% { transform: translateY(-20px) translateX(10px) scale(1.05); }
  50% { transform: translateY(10px) translateX(-10px) scale(.95); }
  75% { transform: translateY(-10px) translateX(15px) scale(1.02); }
}

@media (max-width: 768px) {
  .tc-content { h2 { font-size: 2.2rem; } p { font-size: 1rem; } }
}
</style>

<style lang="scss">
.tc-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tc-nav-dot {
  width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46, .2);
  cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(26, 26, 46, .5); transform: scale(1.3); }
  &.tc-active { background: #6c8cff; border-color: rgba(26, 26, 46, .4); transform: scale(1.4); box-shadow: 0 0 20px rgba(108, 140, 255, .5); }
}

.tc-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%;
  background: linear-gradient(90deg, #667eea, #f093fb, #4facfe, #43e97b, #fa709a, #a18cd1);
  box-shadow: 0 0 10px rgba(108, 140, 255, .4);
}

.tc-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0, 0, 0, .4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255, 255, 255, .1); color: rgba(26, 26, 46, .8); }

.tc-type-label { position: fixed; top: 30px; right: 145px; z-index: 1000; background: rgba(0, 0, 0, .4); backdrop-filter: blur(12px); padding: 8px 18px; border-radius: 25px; font-size: .75rem; font-family: 'Courier New', monospace; font-weight: 700; letter-spacing: .1em; border: 1px solid rgba(255, 255, 255, .1); color: rgba(26, 26, 46, .5); }

@media (max-width: 768px) {
  .tc-nav-dots { gap: 10px; }
  .tc-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; }
  .tc-type-label { top: 16px; right: 100px; font-size: .65rem; padding: 6px 12px; }
}
</style>