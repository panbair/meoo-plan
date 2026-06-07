<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const CARDS = 8; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let mainST: ScrollTrigger | null = null; let cardStrips: HTMLElement[][] = []
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'ms-dot' + (i === 0 ? ' ms-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.ms-dot').forEach((d, i) => d.classList.toggle('ms-active', i === index)); const el = document.querySelector('.ms-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }
function buildCardStrips() { cardStrips = []; const panels = document.querySelectorAll('.ms-panel'); panels.forEach((panel) => { const strips: HTMLElement[] = []; const container = panel.querySelector('.ms-strips-container'); if (!container) { cardStrips.push(strips); return }; container.innerHTML = ''; const sh = 100 / CARDS; for (let s = 0; s < CARDS; s++) { const strip = document.createElement('div'); strip.className = 'ms-strip'; strip.style.cssText = `position:absolute;left:0;width:100%;height:${sh}%;top:${s*sh}%`; const inner = document.createElement('div'); inner.className = 'ms-strip-inner'; inner.style.cssText = 'position:absolute;inset:0'; strip.appendChild(inner); container.appendChild(strip); strips.push(strip) }; cardStrips.push(strips) }) }

function init() {
  scrollArea = document.getElementById('msArea') as HTMLElement; progressBar = document.getElementById('msProgress'); navDots = document.getElementById('msNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.ms-panel') as HTMLElement[]; buildCardStrips()
  panels.forEach((p, i) => { if (i > 0) { const strips = cardStrips[i] || []; strips.forEach(s => { s.style.opacity = '0' }) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      panels.forEach((panel, i) => {
        if (i < idx - 1 || i > idx + 1) { panel.style.opacity = '0' } else if (i === idx) { panel.style.opacity = '1'; panel.style.zIndex = String(TOTAL + 10); const strips = cardStrips[i] || []
          strips.forEach((strip, si) => { const centerOffset = (si - CARDS / 2 + .5) * 1.5
            if (frac < .35) { const p = frac / .35; const dist = p * 160 * (1 + Math.abs(centerOffset) * .5); const angle = (si % 2 === 0 ? 1 : -1) * (25 + si * 5); strip.style.transform = `translateY(${centerOffset * p * 70}vh) translateX(${angle * p * 1.5}vw) rotate(${angle * p}deg) scale(${1 - p * .3})`; strip.style.opacity = String(1 - p * .3); strip.style.filter = `blur(${p * 3}px) brightness(${1 + p * .4})` }
            else if (frac < .5) { const p = (frac - .35) / .15; const angle = (si % 2 === 0 ? 1 : -1) * (25 + si * 5); strip.style.transform = `translateY(${centerOffset * 70 + Math.sin(p * Math.PI * 2) * 8}vh) translateX(${angle * 1.5}vw) rotate(${angle + Math.sin(p * Math.PI * 2) * 4}deg) scale(.7)`; strip.style.opacity = '.7'; strip.style.filter = 'blur(5px) brightness(1.2)' }
            else { const p = (frac - .5) / .5; const easeP = 1 - Math.pow(1 - p, 3); strip.style.transform = `translateY(${centerOffset * 70 * (1 - easeP)}vh) translateX(0) rotate(0deg) scale(${.7 + easeP * .3})`; strip.style.opacity = String(.7 + easeP * .3); strip.style.filter = `blur(${5 * (1 - easeP)}px) brightness(${1.2 - easeP * .2})` } })
        } else if (i === idx + 1) { panel.style.opacity = String(Math.max(0, frac - .6) / .4); panel.style.filter = `blur(${Math.max(0, (1-frac)*8)}px)`; panel.style.zIndex = String(TOTAL + 5) }
      })
      const fieldLines = document.querySelectorAll('.ms-field-line'); fieldLines.forEach((line, li) => { const intensity = Math.abs(Math.sin(frac * Math.PI * 3 + li)); (line as HTMLElement).style.opacity = String(intensity * .2); (line as HTMLElement).style.transform = `scaleX(${.5 + intensity * 1.5})` })
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0)
}
function destroy() { mainST?.kill(); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="msArea" class="ms-page">
    <div id="msProgress" class="ms-progress-bar"></div><nav id="msNav" class="ms-nav-dots"></nav>
    <div class="ms-indicator"><span class="ms-cur">1</span> / {{ TOTAL }}</div>
    <div class="ms-field"><div v-for="i in 6" :key="i" class="ms-field-line" :style="{ top: `${i*15}%` }"></div></div>
    <div class="ms-glow"></div>
    <section v-for="n in TOTAL" :key="n" class="ms-panel" :class="`ms-panel-${n}`"><div class="ms-strips-container"></div><div class="ms-bg-num">{{ String(n).padStart(2, '0') }}</div></section>
    <div class="ms-magnet-core"><div class="ms-core-ring"></div><div class="ms-core-dot"></div></div>
  </div>
</template>

<style scoped>
.ms-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #161028 0%, #0c0a1a 50%, #060410 100%); }
.ms-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter; }
.ms-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 50%, #1e1432 0%, #140e24 50%, #0a0818 100%); }
.ms-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 50%, #142032 0%, #0e1824 50%, #080e18 100%); }
.ms-strips-container { position: absolute; inset: 0; z-index: 5; }
.ms-strip { will-change: transform, opacity, filter; }
.ms-strip-inner { background: inherit; }
.ms-bg-num { font-family: 'Orbitron', monospace; font-size: 20rem; font-weight: 900; color: rgba(255,255,255,.012); position: absolute; z-index: 1; user-select: none; pointer-events: none; }
.ms-field { position: fixed; inset: 0; z-index: 4; pointer-events: none; overflow: hidden; }
.ms-field-line { position: absolute; left: 0; width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(139,92,246,.3) 30%, rgba(236,72,153,.3) 50%, rgba(139,92,246,.3) 70%, transparent); animation: msFieldPulse 3s ease-in-out infinite; }
@keyframes msFieldPulse { 0%,100%{opacity:.03} 50%{opacity:.25} }
.ms-glow { position: fixed; width: 400px; height: 400px; border-radius: 50%; filter: blur(150px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .15; background: radial-gradient(circle, rgba(139,92,246,.3), transparent); }
.ms-magnet-core { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 100; pointer-events: none; }
.ms-core-ring { width: 50px; height: 50px; border-radius: 50%; border: 2px solid rgba(139,92,246,.35); animation: msCorePulse 2s ease-in-out infinite; }
.ms-core-dot { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 8px; height: 8px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 24px rgba(139,92,246,.6), 0 0 48px rgba(236,72,153,.3); }
@keyframes msCorePulse { 0%,100%{transform:scale(1);opacity:.35} 50%{transform:scale(1.6);opacity:.75} }
</style>

<style>
.ms-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 1000; }
.ms-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(139,92,246,.15); cursor: pointer; transition: all .3s; }
.ms-nav-dot.ms-active { background: linear-gradient(135deg, #8b5cf6, #ec4899); border-color: transparent; box-shadow: 0 0 20px rgba(139,92,246,.6); transform: scale(1.4); }
.ms-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #8b5cf6, #a78bfa, #ec4899); z-index: 1001; transition: width .3s; }
.ms-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.35); z-index: 1002; }
</style>
