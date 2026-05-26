<script setup lang="ts">
/**
 * ==================== 模糊过渡 (Blur Transition) ====================
 * filter: blur() 滤镜过渡，面板之间模糊淡入淡出
 * 7 面板叠加布局，GSAP ScrollTrigger scrub 驱动
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
let vh = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let stage: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let panels: HTMLElement[] = []
let mainTL: gsap.core.Timeline | null = null

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'tb-nav-dot' + (i === 0 ? ' tb-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.tb-nav-dot').forEach((dot, i) =>
    dot.classList.toggle('tb-active', i === index)
  )
  const el = document.querySelector('.tb-page-indicator .tb-current')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = (index / (totalPanels - 1) * 100) + '%'
}

function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const targetTop = (scrollArea?.offsetTop || 0) + index * vh
  window.scrollTo({ top: targetTop, behavior: 'smooth' })
}

function onKeydown(e: KeyboardEvent) {
  const map: Record<string, number> = {
    ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1,
    Home: 0, End: totalPanels - 1,
  }
  if (map[e.key] !== undefined) {
    e.preventDefault()
    goToPanel(e.key === 'Home' || e.key === 'End' ? map[e.key] : currentIndex + map[e.key])
  }
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) {
  const diff = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1))
}

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })

  const tl = gsap.timeline({ paused: true })
  const segs = totalPanels - 1
  const blurMax = 16 // max blur in px

  // 初始：第一面板清晰
  gsap.set(panels, { opacity: 0, filter: `blur(${blurMax}px)` })
  gsap.set(panels[0], { opacity: 1, filter: 'blur(0px)' })

  for (let i = 0; i < segs; i++) {
    // 当前面板：淡出 + 模糊
    tl.to(panels[i], {
      opacity: 0,
      filter: `blur(${blurMax}px)`,
      duration: 1.2,
      ease: 'power2.inOut',
    }, i)
    // 下一面板：淡入 + 去模糊
    tl.fromTo(panels[i + 1],
      { opacity: 0, filter: `blur(${blurMax}px)` },
      { opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.inOut' },
      i,
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
    },
  })
}

function killCurrent() {
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() })
  mainTL?.kill()
  mainTL = null
  gsap.set(panels, { clearProps: 'all' })
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('tbScrollArea') as HTMLElement
  stage = document.getElementById('tbStage') as HTMLElement
  progressBar = document.getElementById('tbProgressBar')
  navDots = document.getElementById('tbNavDots')
  if (!scrollArea || !stage) return

  panels = gsap.utils.toArray('.tb-panel') as HTMLElement[]

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
  <div class="tb-page">
    <div id="tbProgressBar" class="tb-progress-bar"></div>
    <nav id="tbNavDots" class="tb-nav-dots"></nav>
    <div class="tb-page-indicator">
      <span class="tb-current">1</span><span class="tb-total"> / {{ totalPanels }}</span>
    </div>

    <div id="tbScrollArea" class="tb-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tbStage" class="tb-stage">
        <section class="tb-panel tb-panel-0">
          <div class="tb-content">
            <div class="tb-badge">INTRO</div>
            <h2>模糊过渡 第一屏</h2>
            <p>filter: blur() + opacity 渐变切换</p>
          </div>
          <div class="tb-deco tb-deco-0"></div>
        </section>
        <section class="tb-panel tb-panel-1">
          <div class="tb-content">
            <div class="tb-badge">DESIGN</div>
            <h2>第二屏</h2>
            <p>设计理念与视觉语言</p>
          </div>
          <div class="tb-deco tb-deco-1"></div>
        </section>
        <section class="tb-panel tb-panel-2">
          <div class="tb-content">
            <div class="tb-badge">DEVELOP</div>
            <h2>第三屏</h2>
            <p>开发效率与工程实践</p>
          </div>
          <div class="tb-deco tb-deco-2"></div>
        </section>
        <section class="tb-panel tb-panel-3">
          <div class="tb-content">
            <div class="tb-badge">PERFORM</div>
            <h2>第四屏</h2>
            <p>高性能架构与优化</p>
          </div>
          <div class="tb-deco tb-deco-3"></div>
        </section>
        <section class="tb-panel tb-panel-4">
          <div class="tb-content">
            <div class="tb-badge">LAUNCH</div>
            <h2>第五屏</h2>
            <p>产品发布与运营策略</p>
          </div>
          <div class="tb-deco tb-deco-4"></div>
        </section>
        <section class="tb-panel tb-panel-5">
          <div class="tb-content">
            <div class="tb-badge">GROWTH</div>
            <h2>第六屏</h2>
            <p>用户增长与数据分析</p>
          </div>
          <div class="tb-deco tb-deco-5"></div>
        </section>
        <section class="tb-panel tb-panel-6">
          <div class="tb-content">
            <div class="tb-badge">FUTURE</div>
            <h2>第七屏</h2>
            <p>展望未来与持续创新</p>
          </div>
          <div class="tb-deco tb-deco-6"></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tb-page {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #0a0a0f;
  color: #fff;
}
.tb-scroll-area { position: relative; }
.tb-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

/* ═══════ 面板 ═══════ */
.tb-panel {
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 20px;
    pointer-events: none;
    z-index: 2;
  }
}

/* ═══════ 内容 ═══════ */
.tb-content {
  text-align: center;
  z-index: 3;

  h2 {
    font-size: 3.5rem;
    font-weight: 900;
    margin: 0 0 14px;
  }
  p {
    font-size: 1.15rem;
    opacity: 0.55;
    margin: 0;
  }
}

.tb-badge {
  display: inline-block;
  padding: 5px 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  font-size: 0.7rem;
  letter-spacing: 4px;
  margin-bottom: 20px;
}

/* ═══════ 装饰元素 ═══════ */
.tb-deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
}
.tb-deco-0 { width: 400px; height: 400px; top: -100px; right: -120px; background: radial-gradient(circle, rgba(108,140,255,0.08), transparent 65%); }
.tb-deco-1 { width: 300px; height: 300px; bottom: -80px; left: -60px; background: radial-gradient(circle, rgba(167,139,250,0.08), transparent 65%); }
.tb-deco-2 { width: 500px; height: 500px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(244,114,182,0.06), transparent 60%); }
.tb-deco-3 { width: 350px; height: 350px; top: -120px; left: 30%; background: radial-gradient(circle, rgba(76,172,254,0.08), transparent 65%); }
.tb-deco-4 { width: 280px; height: 280px; bottom: -100px; right: 20%; background: radial-gradient(circle, rgba(67,233,123,0.08), transparent 65%); }
.tb-deco-5 { width: 450px; height: 450px; top: 20%; right: -150px; background: radial-gradient(circle, rgba(249,168,212,0.07), transparent 60%); }
.tb-deco-6 { width: 380px; height: 380px; bottom: -130px; left: 40%; background: radial-gradient(circle, rgba(108,140,255,0.08), transparent 60%); }

/* ═══════ 各面板背景 ═══════ */
.tb-panel-0 { background: linear-gradient(135deg, #0a0f24, #1a1a5e); }
.tb-panel-1 { background: linear-gradient(135deg, #0f2027, #2c5364); }
.tb-panel-2 { background: linear-gradient(135deg, #141e30, #243b55); }
.tb-panel-3 { background: linear-gradient(135deg, #1a1a2e, #0f3460); }
.tb-panel-4 { background: linear-gradient(135deg, #1a0f24, #3a1540); }
.tb-panel-5 { background: linear-gradient(135deg, #0a1a2e, #1a3e5e); }
.tb-panel-6 { background: linear-gradient(135deg, #0b1331, #1c2856); }

@media (max-width: 768px) {
  .tb-content {
    h2 { font-size: 2.2rem; }
    p { font-size: 0.95rem; }
  }
}
</style>

<style lang="scss">
/* ═══════ 全局 UI ═══════ */
.tb-nav-dots {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 14px;
}
.tb-nav-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover { background: rgba(255, 255, 255, 0.5); transform: scale(1.3); }

  &.tb-active {
    background: #6c8cff;
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.4);
    box-shadow: 0 0 20px rgba(108, 140, 255, 0.5);
  }
}
.tb-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #6c8cff, #a78bfa, #f472b6);
  z-index: 1001;
  width: 0%;
  box-shadow: 0 0 10px rgba(108, 140, 255, 0.4);
  transition: width 0.4s ease;
}
.tb-page-indicator {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  padding: 8px 22px;
  border-radius: 25px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
@media (max-width: 768px) {
  .tb-nav-dots { gap: 10px; }
}
</style>
