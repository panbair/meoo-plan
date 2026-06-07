<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const RIPPLE_COUNT = 6; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'rm-dot' + (i === 0 ? ' rm-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.rm-dot').forEach((d, i) => d.classList.toggle('rm-active', i === index)); const el = document.querySelector('.rm-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('rmArea') as HTMLElement; progressBar = document.getElementById('rmProgress'); navDots = document.getElementById('rmNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.rm-panel') as HTMLElement[]; const rippleRings = document.querySelectorAll('.rm-ripple-ring') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { if (i === 0) { p.style.clipPath = 'circle(150% at 50% 50%)'; p.style.opacity = '1'; p.style.zIndex = String(TOTAL + 10) } else { p.style.clipPath = 'circle(0% at 50% 50%)'; p.style.opacity = '0'; p.style.zIndex = String(TOTAL - i) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      rippleRings.forEach((ring, ri) => { const delay = ri * .12; const ringP = Math.max(0, Math.min(1, (frac - delay) / .6)); const bounceAmp = Math.sin(ringP * Math.PI * 3); const ringScale = ringP * 3 + Math.abs(bounceAmp) * .5; (ring as HTMLElement).style.transform = `translate(-50%,-50%) scale(${ringScale})`; (ring as HTMLElement).style.opacity = String(Math.abs(Math.sin(ringP * Math.PI * 2)) * .25); (ring as HTMLElement).style.borderColor = `hsla(${200 + ringP * 160}, 70%, ${50 + bounceAmp * 30}%, ${.15 + Math.abs(bounceAmp) * .35})` })
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.clipPath = 'circle(0% at 50% 50%)'; panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.clipPath = 'circle(0% at 50% 50%)'; panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) { const r = frac * 150; panel.style.clipPath = `circle(${r}% at 50% 50%)`; panel.style.opacity = '1'; panel.style.filter = `brightness(${1 - frac * .25})`; panel.style.zIndex = String(TOTAL + 10) }
        else if (i === idx + 1) { const revealP = Math.max(0, frac - .2) / .8; const r = revealP * 150; panel.style.clipPath = `circle(${r}% at 50% 50%)`; panel.style.opacity = String(Math.min(1, revealP * 1.3)); panel.style.filter = `brightness(${.5 + revealP * .5}) blur(${(1-revealP)*6}px)`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="rmArea" class="rm-page">
    <div id="rmProgress" class="rm-progress-bar"></div><nav id="rmNav" class="rm-nav-dots"></nav>
    <div class="rm-indicator"><span class="rm-cur">1</span> / {{ TOTAL }}</div>
    <div class="rm-ripples"><div v-for="r in RIPPLE_COUNT" :key="r" class="rm-ripple-ring" :style="{ width: `${r*60}px`, height: `${r*60}px` }"></div></div>
    <div class="rm-droplet"></div>
    <div class="rm-glow"></div>
    <section v-for="n in TOTAL" :key="n" class="rm-panel" :class="`rm-panel-${n}`"><div class="rm-content"><span class="rm-num">{{ String(n).padStart(2, '0') }}</span><span class="rm-wave-icon">◉</span></div></section>
  </div>
</template>

<style scoped>
.rm-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #0c1a2e 0%, #061020 40%, #020810 100%); }
.rm-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter; }
.rm-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 50%, #0a1e38 0%, #061428 50%, #020c18 100%); }
.rm-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 50%, #0a2438 0%, #061828 50%, #020c18 100%); }
.rm-content { text-align: center; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.rm-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 14vw, 10rem); font-weight: 900; color: rgba(255,255,255,.88); text-shadow: 0 0 30px rgba(80,180,255,.5), 0 0 60px rgba(40,140,220,.3), 0 0 100px rgba(20,100,200,.15); }
.rm-wave-icon { font-size: 2rem; color: rgba(100,200,255,.25); }
.rm-ripples { position: fixed; top: 50%; left: 50%; z-index: 50; pointer-events: none; }
.rm-ripple-ring { position: absolute; border-radius: 50%; border: 2px solid rgba(100,200,255,.15); transform: translate(-50%,-50%) scale(0); will-change: transform, opacity, border-color; }
.rm-droplet { position: fixed; top: 50%; left: 50%; width: 12px; height: 12px; background: rgba(120,210,255,.7); border-radius: 50%; z-index: 51; pointer-events: none; transform: translate(-50%,-50%); box-shadow: 0 0 28px rgba(100,200,255,.5); }
.rm-glow { position: fixed; width: 400px; height: 400px; border-radius: 50%; filter: blur(140px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .15; background: radial-gradient(circle, rgba(60,180,240,.35), transparent); }
</style>

<style>
.rm-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.rm-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(100,200,255,.15); cursor: pointer; transition: all .3s; }
.rm-nav-dot.rm-active { background: #60a5fa; box-shadow: 0 0 22px rgba(96,165,250,.6), 0 0 44px rgba(96,165,250,.2); transform: scale(1.4); }
.rm-progress-bar { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd); z-index: 1001; transition: width .3s; }
.rm-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.3); z-index: 1002; }
</style>
