<script setup lang="ts">
/**
 * ════════════ 像素雨重生 · Pixel Rain ════════════
 * pixel + matrix-rain + 重力模拟
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 7; const COLS = 16; const ROWS = 10; const PIXEL_COUNT = COLS * ROWS
let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let mainST: ScrollTrigger | null = null; let pixelGrid: HTMLElement | null = null
let pixels: HTMLElement[] = []; let pixelStates: { hue: number }[] = []

function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'prn-dot' + (i === 0 ? ' prn-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.prn-dot').forEach((d, i) => d.classList.toggle('prn-active', i === index)); const el = document.querySelector('.prn-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function buildPixels() { if (!pixelGrid) return; pixelGrid.innerHTML = ''; pixels = []; pixelStates = []; const pw = 100 / COLS; const ph = 100 / ROWS; for (let r = 0; r < ROWS; r++) { for (let c = 0; c < COLS; c++) { const pixel = document.createElement('div'); pixel.className = 'prn-pixel'; pixel.style.cssText = `position:absolute;left:${c * pw}%;top:${r * ph}%;width:${pw}%;height:${ph}%;`; pixelGrid.appendChild(pixel); pixels.push(pixel); pixelStates.push({ hue: (c / COLS) * 360 }) } } }

function init() {
  scrollArea = document.getElementById('prnArea') as HTMLElement; progressBar = document.getElementById('prnProgress'); navDots = document.getElementById('prnNav'); pixelGrid = document.getElementById('prnGrid') as HTMLElement
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.prn-panel') as HTMLElement[]; buildPixels()

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      panels.forEach((panel, i) => { if (i === idx) panel.style.zIndex = String(TOTAL + 10); else if (i === idx + 1) panel.style.zIndex = String(TOTAL + 5); else panel.style.zIndex = String(i) })
      pixels.forEach((pixel, pi) => { const row = Math.floor(pi / COLS); const col = pi % COLS; const rowFrac = row / ROWS; const trigger = rowFrac * 1.1; const localP = Math.max(0, Math.min(1, (frac - trigger) / 0.3))
        if (localP <= 0) { const hue = (idx * 50 + col * 20) % 360; pixel.style.background = `hsl(${hue}, 80%, ${35 + row * 4}%)`; pixel.style.opacity = '1'; pixel.style.transform = 'translateY(0)'; pixel.style.borderRadius = '1px' }
        else { const fallY = localP * localP * 120; const newHue = ((idx + 1) * 50 + col * 20) % 360; pixel.style.background = `hsl(${newHue}, 80%, ${35 + ((ROWS - 1 - row) / ROWS) * 30}%)`; pixel.style.opacity = String(1 - localP * .3); pixel.style.transform = `translateY(${fallY}vh)`; pixel.style.borderRadius = `${localP * 50}%` }
      })
      if (progressBar) { const hueShift = frac * 360; progressBar.style.background = `linear-gradient(90deg, hsl(${hueShift},80%,50%), hsl(${(hueShift+120)%360},80%,50%), hsl(${(hueShift+240)%360},80%,50%))` }
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0)
}
function destroy() { mainST?.kill(); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="prnArea" class="prn-page">
    <div id="prnProgress" class="prn-progress-bar"></div><nav id="prnNav" class="prn-nav-dots"></nav>
    <div class="prn-indicator"><span class="prn-cur">1</span> / {{ TOTAL }}</div>
    <div class="prn-bg-glow"></div><div class="prn-bg-glow prn-glow-2"></div>
    <section v-for="n in TOTAL" :key="n" class="prn-panel" :class="`prn-panel-${n}`"><span class="prn-bg-num">{{ String(n).padStart(2, '0') }}</span></section>
    <div id="prnGrid" class="prn-grid"></div>
    <div class="prn-rain-overlay"></div>
  </div>
</template>

<style scoped>
.prn-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: linear-gradient(180deg, #060818 0%, #0a0c24 30%, #0c1028 60%, #060818 100%); }
.prn-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.prn-bg-num { font-family: 'Orbitron', monospace; font-size: 18rem; font-weight: 900; color: rgba(255,255,255,.015); position: absolute; user-select: none; pointer-events: none; }
.prn-grid { position: fixed; inset: 0; z-index: 50; pointer-events: none; }
.prn-pixel { will-change: transform, opacity, border-radius, background; transition: background .1s; }
/* 背景光晕 */
.prn-bg-glow { position: fixed; border-radius: 50%; filter: blur(140px); z-index: 1; pointer-events: none; opacity: .2; width: 500px; height: 500px; top: 20%; left: -100px; background: radial-gradient(circle, rgba(79,172,254,.5), transparent); }
.prn-glow-2 { top: auto; bottom: 10%; left: auto; right: -80px; background: radial-gradient(circle, rgba(0,242,254,.4), transparent); }
.prn-rain-overlay { position: fixed; inset: 0; z-index: 40; pointer-events: none; background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(100,180,255,.02) 3px, rgba(100,180,255,.02) 6px); mask: linear-gradient(to bottom, transparent, rgba(0,0,0,.2) 60%, transparent); }
</style>

<style>
.prn-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 1000; }
.prn-nav-dot { width: 10px; height: 10px; border-radius: 2px; background: rgba(255,255,255,.08); border: none; cursor: pointer; transition: all .3s; }
.prn-nav-dot.prn-active { background: linear-gradient(135deg, #4facfe, #00f2fe); box-shadow: 0 0 16px rgba(79,172,254,.5); transform: scale(1.3); border-radius: 50%; }
.prn-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; transition: width .3s, background .5s; }
.prn-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Courier New', monospace; font-size: 14px; color: rgba(255,255,255,.35); z-index: 1002; }
</style>
