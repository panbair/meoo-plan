<script setup lang="ts">
/**
 * ==================== Pixel Evolution ====================
 * 像素进化 —— pixel(像素聚集) + strips(扫描线条带) + rotate3d(3D翻转) + glitch(数字故障)
 * 致敬游戏画质进化史：8位像素块汇聚 → 16位扫描线渲染 → 3D多边形时代 → 赛博故障未来
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
    const dot = document.createElement('button'); dot.className = 'pe-nav-dot' + (i === 0 ? ' pe-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.pe-nav-dot').forEach((d, i) => d.classList.toggle('pe-active', i === index))
  const el = document.querySelector('.pe-page-indicator .pe-current'); if (el) el.textContent = String(index + 1)
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
    const pixelCanvas = cur.querySelector('.pe-pixel-canvas') as HTMLElement

    // === 阶段1: 像素融化 (pixel) ===
    // 大块像素逐块消失，8-bit风格解体
    if (pixelCanvas) {
      const cells = pixelCanvas.querySelectorAll('.pe-pixel-cell')
      cells.forEach((cell, idx) => {
        const row = Math.floor(idx / 8)
        const col = idx % 8
        tl.to(cell, {
          scale: 0, rotation: (Math.random() - 0.5) * 180,
          opacity: 0, duration: 0.3, ease: 'power2.in'
        }, i + row * 0.02 + col * 0.02)
      })
    }
    tl.to(cur, { opacity: 0, duration: 0.15 }, i + 0.45)

    // === 阶段2: 扫描线条带 (strips) ===
    // 横线扫描线渲染（模拟CRT显示器逐行刷新）
    tl.set(nxt, { opacity: 0, clipPath: 'inset(100% 0 0 0)' }, i + 0.4)
    tl.to(nxt, { opacity: 1, clipPath: 'inset(0% 0 0% 0)', duration: 0.35, ease: 'power2.inOut' }, i + 0.45)
    tl.to(nxt, { filter: 'brightness(1.3) contrast(1.2)', duration: 0.15 }, i + 0.5)
    // 扫描线叠加效果
    const scanLines = nxt.querySelector('.pe-scan-lines') as HTMLElement
    if (scanLines) {
      tl.fromTo(scanLines, { opacity: 0.6 }, { opacity: 0, duration: 0.35 }, i + 0.55)
    }
    tl.call(() => { nxt.style.clipPath = 'none' }, [], i + 0.85)

    // === 阶段3: 3D翻转 (rotate3d) ===
    // 双轴旋转模拟进入3D时代
    tl.to(nxt, {
      perspective: 1200,
      rotationY: 15, rotationX: 10,
      scale: 0.85, filter: 'brightness(0.8)',
      duration: 0.3, ease: 'power2.in'
    }, i + 0.9)
    tl.to(nxt, {
      rotationY: 0, rotationX: 0,
      scale: 1, filter: 'brightness(1)',
      duration: 0.45, ease: 'elastic.out(1, 0.5)'
    }, i + 1.2)

    // === 阶段4: 赛博故障 (glitch) ===
    // 红蓝通道分离 + 随机偏移，模拟数字故障后重启
    for (let g = 0; g < 3; g++) {
      const shiftX = (g % 2 === 0 ? -8 : 8)
      tl.to(nxt, {
        filter: `hue-rotate(${g * 60}deg) brightness(1.5)`,
        x: shiftX * (3 - g), duration: 0.08
      }, i + 1.55 + g * 0.1)
    }
    tl.to(nxt, { filter: 'hue-rotate(0deg) brightness(1)', x: 0, duration: 0.25, ease: 'power2.out' }, i + 1.85)
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
  scrollArea = document.getElementById('peScrollArea') as HTMLElement; stage = document.getElementById('peStage') as HTMLElement
  progressBar = document.getElementById('peProgressBar'); navDots = document.getElementById('peNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.pe-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="pe-page">
    <div id="peProgressBar" class="pe-progress-bar"></div>
    <nav id="peNavDots" class="pe-nav-dots"></nav>
    <div class="pe-page-indicator"><span class="pe-current">1</span><span class="pe-total"> / {{ totalPanels }}</span></div>
    <div id="peScrollArea" class="pe-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="peStage" class="pe-stage">
        <section class="pe-panel pe-panel-0">
          <div class="pe-pixel-canvas">
            <span v-for="n in 64" :key="n" class="pe-pixel-cell" :style="{
              position: 'absolute', width: '10%', height: '10%',
              left: ((n - 1) % 8) * 12.5 + '%', top: Math.floor((n - 1) / 8) * 12.5 + '%',
              background: `hsl(${(n * 5 + 30) % 360}, 60%, 55%)`, borderRadius: '2px'
            }"></span>
          </div>
          <div class="pe-content"><h2>8-bit</h2></div>
        </section>
        <section class="pe-panel pe-panel-1">
          <div class="pe-scan-lines"></div>
          <div class="pe-content"><h2>16-bit</h2></div>
        </section>
        <section class="pe-panel pe-panel-2">
          <div class="pe-scan-lines"></div>
          <div class="pe-content"><h2>3D</h2></div>
        </section>
        <section class="pe-panel pe-panel-3">
          <div class="pe-content"><h2>HD</h2></div>
        </section>
        <section class="pe-panel pe-panel-4">
          <div class="pe-content"><h2>VR</h2></div>
        </section>
        <section class="pe-panel pe-panel-5">
          <div class="pe-content"><h2>4K</h2></div>
        </section>
        <section class="pe-panel pe-panel-6">
          <div class="pe-content"><h2>∞</h2></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pe-page { font-family: 'Courier New', 'Noto Sans SC', monospace; background: #f5f0f8; color: #0f0; }
.pe-scroll-area { position: relative; }
.pe-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.pe-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::after { content: ''; position: absolute; inset: 0; border: 2px solid rgba(0,255,0,.04); pointer-events: none; z-index: 2; }
}
.pe-pixel-canvas { position: absolute; inset: 0; z-index: 1; }
.pe-scan-lines {
  position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,.03) 2px, rgba(0,255,0,.03) 4px);
}
.pe-content { text-align: center; z-index: 2; position: relative;
  h2 { font-size: 5rem; font-weight: 700; margin: 0; letter-spacing: 8px; text-shadow: 0 0 10px rgba(0,255,0,.4), 0 0 40px rgba(0,255,0,.1); color: #0f0; }
}
.pe-panel-0, .pe-panel-6 { background: radial-gradient(ellipse at center, #0a1a0a 0%, #0a0a0a 70%); }
.pe-panel-1 { background: radial-gradient(ellipse at center, #0a1a0a 0%, #0a0a0c 70%); }
.pe-panel-2 { background: radial-gradient(ellipse at center, #0a0a1a 0%, #0a0a0c 70%); }
.pe-panel-3 { background: radial-gradient(ellipse at center, #0a1a1a 0%, #0a0a0c 70%); }
.pe-panel-4 { background: radial-gradient(ellipse at center, #1a0a1a 0%, #0a0a0c 70%); }
.pe-panel-5 { background: radial-gradient(ellipse at center, #1a1a0a 0%, #0a0a0c 70%); }
@media (max-width: 768px) { .pe-content { h2 { font-size: 3rem; } } }
</style>

<style lang="scss">
.pe-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.pe-nav-dot { width: 12px; height: 12px; background: rgba(0,255,0,.1); cursor: pointer; border: 1px solid rgba(0,255,0,.2); transition: all .3s;
  &:hover { background: rgba(0,255,0,.3); transform: scale(1.3); }
  &.pe-active { background: #0f0; border-color: rgba(0,255,0,.5); transform: scale(1.4); box-shadow: 0 0 16px rgba(0,255,0,.5); }
}
.pe-progress-bar { position: fixed; top: 0; left: 0; height: 2px; z-index: 1001; width: 0%; background: #0f0; box-shadow: 0 0 10px rgba(0,255,0,.5); }
.pe-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.7); backdrop-filter: blur(8px); padding: 8px 22px; font-size: .9rem; border: 1px solid rgba(0,255,0,.2); color: rgba(0,255,0,.8); }
@media (max-width: 768px) { .pe-nav-dots { gap: 10px; } .pe-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
