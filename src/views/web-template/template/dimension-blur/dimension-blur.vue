<script setup lang="ts">
/**
 * ==================== Dimension Blur ====================
 * 维度模糊 —— blur(渐隐模糊) + zoom-blur(缩放虚化) + fade(淡入淡出) + elastic(弹性还原)
 * 失焦美学：画面逐渐模糊虚化 → 缩放模糊像镜头脱焦 → 完全淡出消失 → 新维度弹性还原归位
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
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button'); dot.className = 'db-nav-dot' + (i === 0 ? ' db-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.db-nav-dot').forEach((d, i) => d.classList.toggle('db-active', i === index))
  const el = document.querySelector('.db-page-indicator .db-current'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}
function goToPanel(index: number) { index = Math.max(0, Math.min(index, totalPanels - 1)); window.scrollTo({ top: (scrollArea?.offsetTop || 0) + index * vh, behavior: 'smooth' }) }
function onKeydown(e: KeyboardEvent) { const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }; if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) } }
let tsY = 0
function onTouchStart(e: TouchEvent) { tsY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) { const d = tsY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })

  for (let i = 0; i < segments; i++) {
    const cur = panels[i]
    const nxt = panels[i + 1]

    // === 阶段1: blur渐隐模糊 ===
    // 画面逐渐失焦，色彩饱和度降低
    tl.to(cur, {
      filter: 'blur(12px) saturate(0.3) brightness(0.5)',
      scale: 1.05,
      duration: 0.35, ease: 'power2.inOut'
    }, i)

    // === 阶段2: zoom-blur 缩放虚化 ===
    // 像镜头猛地拉远，彻底脱焦
    tl.to(cur, {
      filter: 'blur(20px) saturate(0) brightness(0.2)',
      scale: 1.3,
      opacity: 0.4,
      duration: 0.3, ease: 'power2.in'
    }, i + 0.35)

    // === 阶段3: fade 完全淡出 ===
    tl.to(cur, {
      opacity: 0,
      scale: 1.5,
      filter: 'blur(30px) saturate(0) brightness(0)',
      duration: 0.25, ease: 'power3.in'
    }, i + 0.6)

    // === 阶段4: 新维度弹性还原 ===
    // 新画面从模糊中逐步清晰，弹性归位
    tl.set(nxt, {
      filter: 'blur(15px) saturate(0.2) brightness(0.3)',
      scale: 1.2, opacity: 0
    }, i + 0.65)
    tl.to(nxt, { opacity: 0.5, duration: 0.1 }, i + 0.7)
    // 分步对焦：模糊→半模糊→清晰
    tl.to(nxt, {
      filter: 'blur(6px) saturate(0.6) brightness(0.7)',
      scale: 1.08, opacity: 0.8,
      duration: 0.2, ease: 'power2.out'
    }, i + 0.75)
    // 弹性归位到完全清晰
    tl.to(nxt, {
      filter: 'blur(0px) saturate(1) brightness(1)',
      scale: 1, opacity: 1,
      duration: 0.4, ease: 'elastic.out(1, 0.6)'
    }, i + 0.9)

    // 微小过度稳定
    tl.to(nxt, { scale: 0.98, duration: 0.05 }, i + 1.25)
    tl.to(nxt, { scale: 1, duration: 0.12, ease: 'power2.out' }, i + 1.3)
  }
  return tl
}

function startTimeline() {
  const tl = buildTimeline(); mainTL = tl
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.8,
    animation: tl,
    onUpdate: (self) => { const idx = Math.round(self.progress * (totalPanels - 1)); if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) } }
  })
}
function killCurrent() { ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() }); mainTL?.kill(); mainTL = null; gsap.set(panels, { clearProps: 'all' }) }
function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('dbScrollArea') as HTMLElement; stage = document.getElementById('dbStage') as HTMLElement
  progressBar = document.getElementById('dbProgressBar'); navDots = document.getElementById('dbNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.db-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="db-page">
    <div id="dbProgressBar" class="db-progress-bar"></div>
    <nav id="dbNavDots" class="db-nav-dots"></nav>
    <div class="db-page-indicator"><span class="db-current">1</span><span class="db-total"> / {{ totalPanels }}</span></div>
    <div id="dbScrollArea" class="db-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="dbStage" class="db-stage">
        <section class="db-panel db-panel-0">
          <div class="db-content"><h2>01</h2></div>
        </section>
        <section class="db-panel db-panel-1">
          <div class="db-content"><h2>02</h2></div>
        </section>
        <section class="db-panel db-panel-2">
          <div class="db-content"><h2>03</h2></div>
        </section>
        <section class="db-panel db-panel-3">
          <div class="db-content"><h2>04</h2></div>
        </section>
        <section class="db-panel db-panel-4">
          <div class="db-content"><h2>05</h2></div>
        </section>
        <section class="db-panel db-panel-5">
          <div class="db-content"><h2>06</h2></div>
        </section>
        <section class="db-panel db-panel-6">
          <div class="db-content"><h2>07</h2></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.db-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.db-scroll-area { position: relative; }
.db-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.db-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::after { content: ''; position: absolute; inset: 40px; border: 1px solid rgba(255,255,255,.03); border-radius: 50%; pointer-events: none; z-index: 1; }
}
.db-content { text-align: center; z-index: 2; position: relative;
  h2 { font-size: 5rem; font-weight: 300; margin: 0; letter-spacing: 12px; color: rgba(26, 26, 46,.5); text-shadow: 0 0 60px rgba(255,255,255,.08); }
}
.db-panel-0 { background: radial-gradient(ellipse at 40% 40%, #dcdcf0, #060610); }
.db-panel-1 { background: radial-gradient(ellipse at 60% 60%, #3e1a2e, #060610); }
.db-panel-2 { background: radial-gradient(ellipse at 30% 60%, #1a3e2e, #060610); }
.db-panel-3 { background: radial-gradient(ellipse at 70% 30%, #2e1a3e, #060610); }
.db-panel-4 { background: radial-gradient(ellipse at 50% 50%, #3e3e1a, #060610); }
.db-panel-5 { background: radial-gradient(ellipse at 40% 70%, #1a2e3e, #060610); }
.db-panel-6 { background: radial-gradient(ellipse at 50% 40%, #dcdcf0, #060610); }
@media (max-width: 768px) { .db-content { h2 { font-size: 3.5rem; letter-spacing: 6px; } } }
</style>

<style lang="scss">
.db-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.db-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(26, 26, 46,.06); cursor: pointer; border: 1px solid rgba(255,255,255,.08); transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.2); transform: scale(1.3); }
  &.db-active { background: rgba(26, 26, 46,.7); border-color: rgba(26, 26, 46,.3); transform: scale(1.3); box-shadow: 0 0 20px rgba(255,255,255,.15); }
}
.db-progress-bar { position: fixed; top: 0; left: 0; height: 2px; z-index: 1001; width: 0%; background: rgba(26, 26, 46,.3); }
.db-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(6,6,16,.5); backdrop-filter: blur(16px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.06); color: rgba(26, 26, 46,.5); }
@media (max-width: 768px) { .db-nav-dots { gap: 10px; } .db-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
