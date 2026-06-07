<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'twg-dot' + (i === 0 ? ' twg-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.twg-dot').forEach((d, i) => d.classList.toggle('twg-active', i === index)); const el = document.querySelector('.twg-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('twgArea') as HTMLElement; progressBar = document.getElementById('twgProgress'); navDots = document.getElementById('twgNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.twg-panel') as HTMLElement[]; const glitchBars = document.querySelectorAll('.twg-glitch-bar') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { if (i === 0) { p.style.clipPath = 'inset(0 0 0 0)'; p.style.opacity = '1'; p.style.filter = 'none'; p.style.transform = ''; p.style.zIndex = String(TOTAL + 10) } else { p.style.clipPath = 'inset(0 0 100% 0)'; p.style.opacity = '0'; p.style.filter = 'none'; p.style.transform = ''; p.style.zIndex = String(TOTAL - i) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      glitchBars.forEach((bar, gi) => { const barP = Math.sin(frac * Math.PI * 8 + gi * 1.7); const isOn = Math.abs(barP) > .85; (bar as HTMLElement).style.opacity = isOn ? '.5' : '0'; (bar as HTMLElement).style.transform = `translateY(${Math.sin(frac * 20 + gi) * 3}px)` })
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.clipPath = 'inset(100% 0 0 0)'; panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.clipPath = 'inset(0 0 100% 0)'; panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) {
          if (frac < .3) { const p = frac / .3; panel.style.clipPath = `inset(0 0 ${100 - p * 100}% 0)`; panel.style.opacity = '1'; panel.style.filter = 'none'; panel.style.transform = ''; panel.style.zIndex = String(TOTAL + 10) }
          else if (frac < .55) { const p = (frac - .3) / .25; const glitchX = (Math.random() - .5) * p * 25; panel.style.clipPath = 'inset(0 0 0 0)'; panel.style.opacity = '1'; panel.style.filter = `contrast(${1 + p * 2}) brightness(${1 + p}) hue-rotate(${p * 90}deg)`; panel.style.transform = `translateX(${glitchX}px)`; panel.style.zIndex = String(TOTAL + 10) }
          else { const p = (frac - .55) / .45; panel.style.clipPath = `inset(0 ${p*50}% 0 ${p*50}%)`; panel.style.opacity = String(1 - p); panel.style.filter = `contrast(${1 + (1-p) * 3}) brightness(${1 + (1-p)}) saturate(${1 + (1-p) * 3})`; panel.style.transform = `scale(${1 + p * .15})`; panel.style.zIndex = String(TOTAL + 10) }
        } else if (i === idx + 1) { const revealP = Math.max(0, frac - .5) / .5; panel.style.clipPath = `inset(0 ${(1-revealP)*50}% 0 ${(1-revealP)*50}%)`; panel.style.opacity = String(revealP); panel.style.filter = `brightness(${.3 + revealP * .7})`; panel.style.transform = `scale(${1 + (1-revealP) * .1})`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="twgArea" class="twg-page">
    <div id="twgProgress" class="twg-progress-bar"></div><nav id="twgNav" class="twg-nav-dots"></nav>
    <div class="twg-indicator"><span class="twg-cur">1</span> / {{ TOTAL }}</div>
    <div class="twg-glitch-bars"><div v-for="i in 8" :key="i" class="twg-glitch-bar" :style="{ top: `${i*12}%` }"></div></div>
    <div class="twg-neon-top"></div><div class="twg-neon-bottom"></div>
    <div class="twg-scanline"></div>
    <section v-for="n in TOTAL" :key="n" class="twg-panel" :class="`twg-panel-${n}`"><div class="twg-content"><span class="twg-num">{{ String(n).padStart(2, '0') }}</span><span class="twg-cursor">▌</span></div></section>
  </div>
</template>

<style scoped>
.twg-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #0c0e18 0%, #06080e 40%, #020408 100%); }
.twg-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter, transform; }
.twg-panel:nth-child(odd) { background: linear-gradient(180deg, #0d0f20 0%, #141630 50%, #0a0c18 100%); }
.twg-panel:nth-child(even) { background: linear-gradient(180deg, #0a0c18 0%, #1c0e20 50%, #0d0f20 100%); }
.twg-content { text-align: center; position: relative; z-index: 2; display: flex; align-items: center; gap: 6px; }
.twg-num { font-family: 'Courier New', monospace; font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(240,255,255,.9); text-shadow: 0 0 20px rgba(0,255,136,.5), 0 0 40px rgba(255,0,255,.3), 0 0 80px rgba(0,255,136,.15); }
.twg-cursor { font-size: clamp(4rem, 14vw, 10rem); color: rgba(0,255,136,.8); animation: twgBlink 1s step-end infinite; }
@keyframes twgBlink { 0%,100%{opacity:1} 50%{opacity:0} }
.twg-glitch-bars { position: fixed; inset: 0; z-index: 55; pointer-events: none; }
.twg-glitch-bar { position: absolute; left: 0; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, rgba(0,255,136,.3), rgba(255,0,255,.3), transparent); opacity: 0; will-change: transform, opacity; }
.twg-neon-top { position: fixed; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #00ff88, #ff00ff, #00ff88, transparent); z-index: 56; pointer-events: none; opacity: .3; box-shadow: 0 0 20px rgba(0,255,136,.4); }
.twg-neon-bottom { position: fixed; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #ff00ff, #00ff88, #ff00ff, transparent); z-index: 56; pointer-events: none; opacity: .3; box-shadow: 0 0 20px rgba(255,0,255,.4); }
.twg-scanline { position: fixed; inset: 0; z-index: 40; pointer-events: none; background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,136,.01) 3px, rgba(0,255,136,.01) 6px); }
</style>

<style>
.twg-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.twg-nav-dot { width: 8px; height: 8px; border-radius: 1px; background: rgba(255,255,255,.08); border: 1px solid rgba(0,255,136,.15); cursor: pointer; transition: all .3s; }
.twg-nav-dot.twg-active { background: #00ff88; border-color: #00ff88; box-shadow: 0 0 18px rgba(0,255,136,.6), 0 0 36px rgba(255,0,255,.3); transform: scale(1.3); }
.twg-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #00ff88, #00cc66, #ff00ff, #cc00cc); z-index: 1001; transition: width .3s; }
.twg-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Courier New', monospace; font-size: 14px; color: rgba(0,255,136,.4); z-index: 1002; }
</style>
