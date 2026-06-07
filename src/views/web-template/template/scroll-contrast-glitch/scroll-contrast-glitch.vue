<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'ctg-dot' + (i === 0 ? ' ctg-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.ctg-dot').forEach((d, i) => d.classList.toggle('ctg-active', i === index)); const el = document.querySelector('.ctg-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('ctgArea') as HTMLElement; progressBar = document.getElementById('ctgProgress'); navDots = document.getElementById('ctgNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.ctg-panel') as HTMLElement[]; const splitLine = document.querySelector('.ctg-split-line') as HTMLElement; const rGhost = document.querySelector('.ctg-rghost') as HTMLElement; const bGhost = document.querySelector('.ctg-bghost') as HTMLElement
  panels.forEach((p, i) => { if (i === 0) { p.style.clipPath = 'inset(0 0 0 0)'; p.style.opacity = '1'; p.style.zIndex = String(TOTAL + 10) } else { p.style.clipPath = 'inset(0 0 0 100%)'; p.style.opacity = '0'; p.style.zIndex = String(TOTAL - i) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx; const splitPos = 100 - frac * 100; const ga = (Math.sin(frac * 50) * 8 + Math.sin(frac * 37) * 6) * Math.min(1, frac * 2) * Math.min(1, (1 - frac) * 2)
      if (splitLine) { splitLine.style.left = `${splitPos + ga}%`; splitLine.style.opacity = String(.6 + Math.abs(ga) * .06) }
      if (rGhost) { rGhost.style.clipPath = `inset(0 0 0 ${splitPos}%)`; rGhost.style.transform = `translateX(${ga * 1.8}px)` }
      if (bGhost) { bGhost.style.clipPath = `inset(0 0 0 ${splitPos}%)`; bGhost.style.transform = `translateX(${-ga * 1.8}px)` }
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.clipPath = 'inset(0 100% 0 0)'; panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.clipPath = 'inset(0 0 0 100%)'; panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) { panel.style.clipPath = `inset(0 ${100 - splitPos + ga * .5}% 0 0)`; panel.style.opacity = '1'; panel.style.filter = `brightness(${1 - frac * .25}) hue-rotate(${frac * 20}deg)`; panel.style.zIndex = String(TOTAL + 10) }
        else if (i === idx + 1) { panel.style.clipPath = `inset(0 0 0 ${splitPos - ga * .5}%)`; panel.style.opacity = '1'; panel.style.filter = `brightness(${.7 + frac * .3}) hue-rotate(${(1 - frac) * 15}deg)`; panel.style.zIndex = String(TOTAL + 5) }
      })
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0)
}
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="ctgArea" class="ctg-page">
    <div id="ctgProgress" class="ctg-progress-bar"></div><nav id="ctgNav" class="ctg-nav-dots"></nav>
    <div class="ctg-indicator"><span class="ctg-cur">1</span> / {{ TOTAL }}</div>
    <div class="ctg-rghost"></div><div class="ctg-bghost"></div>
    <div class="ctg-split-line"></div>
    <div class="ctg-glow-l"></div><div class="ctg-glow-r"></div>
    <section v-for="n in TOTAL" :key="n" class="ctg-panel" :class="`ctg-panel-${n}`">
      <div class="ctg-content"><span class="ctg-label" :style="{ color: n % 2 === 0 ? 'rgba(255,0,255,.5)' : 'rgba(0,255,136,.5)' }">{{ n % 2 === 0 ? 'RIGHT' : 'LEFT' }}</span><span class="ctg-num">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.ctg-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #0e1020 0%, #080a14 40%, #020408 100%); }
.ctg-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter; }
.ctg-panel:nth-child(odd) { background: linear-gradient(135deg, #0d0f22 0%, #161838 50%, #0d0f22 100%); }
.ctg-panel:nth-child(even) { background: linear-gradient(135deg, #1a0f22 0%, #1a0d22 50%, #1a0f22 100%); }
.ctg-content { text-align: center; display: flex; flex-direction: column; gap: 8px; }
.ctg-label { font-family: 'Courier New', monospace; font-size: .75rem; letter-spacing: .5em; }
.ctg-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 14vw, 10rem); font-weight: 900; color: rgba(255,255,255,.9); text-shadow: 0 0 25px rgba(0,255,136,.4), 0 0 50px rgba(255,0,255,.3); }
.ctg-rghost, .ctg-bghost { position: fixed; inset: 0; z-index: 48; pointer-events: none; mix-blend-mode: screen; }
.ctg-rghost { background: rgba(255,0,0,.04); } .ctg-bghost { background: rgba(0,0,255,.04); }
.ctg-split-line { position: fixed; top: 0; left: 100%; width: 3px; height: 100vh; background: linear-gradient(to bottom, transparent, #00ff88, #ff00ff, #00ff88, transparent); z-index: 55; pointer-events: none; opacity: 0; box-shadow: 0 0 24px rgba(0,255,136,.5), 0 0 48px rgba(255,0,255,.3); }
.ctg-glow-l { position: fixed; width: 300px; height: 100vh; top: 0; left: 0; z-index: 1; pointer-events: none; opacity: .08; background: linear-gradient(90deg, rgba(0,255,136,.3), transparent); }
.ctg-glow-r { position: fixed; width: 300px; height: 100vh; top: 0; right: 0; z-index: 1; pointer-events: none; opacity: .08; background: linear-gradient(270deg, rgba(255,0,255,.3), transparent); }
</style>

<style>
.ctg-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.ctg-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(0,255,136,.15); cursor: pointer; transition: all .3s; }
.ctg-nav-dot.ctg-active { background: #00ff88; box-shadow: 0 0 20px rgba(0,255,136,.5), 0 0 40px rgba(255,0,255,.2); transform: scale(1.4); }
.ctg-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #00ff88, #ff00ff); z-index: 1001; transition: width .3s; }
.ctg-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Courier New', monospace; font-size: 14px; color: rgba(0,255,136,.4); z-index: 1002; }
</style>
