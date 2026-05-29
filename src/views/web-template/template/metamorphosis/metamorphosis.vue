<script setup lang="ts">
/**
 * ==================== Metamorphosis ====================
 * 蜕变 —— clip(形状裁剪突变) + elastic(弹性变形) + liquid(液体融合) + scale(平稳定形)
 * 生物蜕变美学：方形→圆形→菱形→三角形形状突变 → 弹性颤动变形 → 液体融合消融 → 缩放平稳落定
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

const clipShapes = [
  'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  'circle(50% at 50% 50%)',
  'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  'polygon(50% 0%, 100% 100%, 0% 100%)'
]

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'mt-nav-dot' + (i === 0 ? ' mt-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.mt-nav-dot').forEach((dot, i) => dot.classList.toggle('mt-active', i === index))
  const el = document.querySelector('.mt-page-indicator .mt-current')
  if (el) el.textContent = String(index + 1)
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
    const inner = cur.querySelector('.mt-inner') as HTMLElement
    const nxtInner = nxt.querySelector('.mt-inner') as HTMLElement

    // === 阶段1: clip形状突变链 ===
    // 当前面板：方→圆→菱→三角，依次裁剪缩小
    if (inner) {
      tl.to(inner, { clipPath: clipShapes[1], scale: 0.9, duration: 0.2, ease: 'power2.inOut' }, i)
      tl.to(inner, { clipPath: clipShapes[2], scale: 0.7, rotation: 15, duration: 0.2, ease: 'power2.inOut' }, i + 0.2)
      tl.to(inner, { clipPath: clipShapes[3], scale: 0.4, rotation: 30, duration: 0.2, ease: 'power2.in' }, i + 0.4)
      tl.to(inner, { scale: 0, rotation: 45, opacity: 0, duration: 0.3, ease: 'power3.in' }, i + 0.6)
    }

    // === 阶段2: elastic弹性变形 ===
    // 新面板从小弹入，带弹性摆动
    tl.set(nxt, { opacity: 0 }, i + 0.5)
    tl.set(nxt, { opacity: 1, scale: 0, rotation: -20 }, i + 0.7)
    tl.to(nxt, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, i + 0.7)

    // === 阶段3: liquid液体融合 ===
    // 液体波纹效果：圆角变化模拟液体张力
    if (nxtInner) {
      tl.fromTo(nxtInner,
        { borderRadius: '40%', transform: 'scaleX(0.7) scaleY(1.3)', filter: 'blur(4px) contrast(1.5)' },
        { borderRadius: '0%', transform: 'scaleX(1) scaleY(1)', filter: 'blur(0px) contrast(1)', duration: 0.45, ease: 'power3.out' },
        i + 1.0
      )
    }

    // === 阶段4: scale平稳定形 ===
    // 最终从液体状态缩放到标准尺寸稳定
    tl.fromTo(nxt,
      { scale: 1.15, filter: 'brightness(1.3)' },
      { scale: 1, filter: 'brightness(1)', duration: 0.35, ease: 'power2.out' },
      i + 1.4
    )
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
  scrollArea = document.getElementById('mtScrollArea') as HTMLElement; stage = document.getElementById('mtStage') as HTMLElement
  progressBar = document.getElementById('mtProgressBar'); navDots = document.getElementById('mtNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.mt-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="mt-page">
    <div id="mtProgressBar" class="mt-progress-bar"></div>
    <nav id="mtNavDots" class="mt-nav-dots"></nav>
    <div class="mt-page-indicator"><span class="mt-current">1</span><span class="mt-total"> / {{ totalPanels }}</span></div>
    <div id="mtScrollArea" class="mt-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="mtStage" class="mt-stage">
        <section class="mt-panel mt-panel-0">
          <div class="mt-inner mt-inner-0"><div class="mt-content"><h2>01</h2></div></div>
        </section>
        <section class="mt-panel mt-panel-1">
          <div class="mt-inner mt-inner-1"><div class="mt-content"><h2>02</h2></div></div>
        </section>
        <section class="mt-panel mt-panel-2">
          <div class="mt-inner mt-inner-2"><div class="mt-content"><h2>03</h2></div></div>
        </section>
        <section class="mt-panel mt-panel-3">
          <div class="mt-inner mt-inner-3"><div class="mt-content"><h2>04</h2></div></div>
        </section>
        <section class="mt-panel mt-panel-4">
          <div class="mt-inner mt-inner-4"><div class="mt-content"><h2>05</h2></div></div>
        </section>
        <section class="mt-panel mt-panel-5">
          <div class="mt-inner mt-inner-5"><div class="mt-content"><h2>06</h2></div></div>
        </section>
        <section class="mt-panel mt-panel-6">
          <div class="mt-inner mt-inner-6"><div class="mt-content"><h2>07</h2></div></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mt-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.mt-scroll-area { position: relative; }
.mt-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.mt-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.mt-inner {
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::after { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.06); pointer-events: none; z-index: 1; }
}
.mt-content { text-align: center; z-index: 2; position: relative;
  h2 { font-size: 5rem; font-weight: 900; margin: 0; letter-spacing: 6px; opacity: .85; text-shadow: 0 0 30px rgba(180,130,255,.2); }
}
.mt-inner-0 { background: linear-gradient(135deg, #ece8f4, #e0dcf0); }
.mt-inner-1 { background: linear-gradient(135deg, #e8ecf4, #dce0f0); }
.mt-inner-2 { background: linear-gradient(135deg, #f0e8ec, #eedce2); }
.mt-inner-3 { background: linear-gradient(135deg, #eef2e8, #e2eedc); }
.mt-inner-4 { background: linear-gradient(135deg, #f0eae4, #eedad0); }
.mt-inner-5 { background: linear-gradient(135deg, #e8f4ec, #dceee2); }
.mt-inner-6 { background: linear-gradient(135deg, #ece8f4, #e0dcf0); }
@media (max-width: 768px) { .mt-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.mt-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.mt-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(180,130,255,.15); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(180,130,255,.4); transform: scale(1.3); }
  &.mt-active { background: #b482ff; border-color: rgba(180,130,255,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(180,130,255,.5); }
}
.mt-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #b482ff, #7b5ea7, #b482ff); animation: mtPulse 1.5s ease-in-out infinite; }
@keyframes mtPulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
.mt-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(180,130,255,.2); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .mt-nav-dots { gap: 10px; } .mt-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
