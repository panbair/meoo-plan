<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const FRAGS = 12; let cur = 0; let sa: HTMLElement | null = null; let pb: HTMLElement | null = null; let nd: HTMLElement | null = null; let frags: HTMLElement[][] = []
function cd() { if (!nd) return; nd.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const d = document.createElement('button'); d.className = 'ds-dot' + (i === 0 ? ' ds-active' : ''); d.addEventListener('click', () => go(i)); nd.appendChild(d) } }
function uu(i: number) { document.querySelectorAll('.ds-dot').forEach((d, j) => d.classList.toggle('ds-active', j === i)); const el = document.querySelector('.ds-cur'); if (el) el.textContent = String(i + 1); if (pb) pb.style.width = ((i + 1) / TOTAL) * 100 + '%' }
function go(i: number) { i = Math.max(0, Math.min(i, TOTAL - 1)); gsap.to(window, { scrollTo: { y: i * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function kd(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1) } }
function bf() { frags = []; document.querySelectorAll('.ds-panel').forEach((p) => { const c = p.querySelector('.ds-fc'); if (!c) { frags.push([]); return }; c.innerHTML = ''; const fs: HTMLElement[] = []; for (let f = 0; f < FRAGS; f++) { const a1 = (f / FRAGS) * 360; const a2 = ((f + 1) / FRAGS) * 360; const r1 = (a1 - 90) * Math.PI / 180; const r2 = (a2 - 90) * Math.PI / 180; const R = 85; const fr = document.createElement('div'); fr.style.cssText = `position:absolute;inset:0;clip-path:polygon(50% 50%,${50+Math.cos(r1)*R}% ${50+Math.sin(r1)*R}%,${50+Math.cos(r2)*R}% ${50+Math.sin(r2)*R}%);transform-origin:50% 50%`; c.appendChild(fr); fs.push(fr) }; frags.push(fs) }) }
function init() { sa = document.getElementById('dsArea') as HTMLElement; pb = document.getElementById('dsProgress'); nd = document.getElementById('dsNav'); if (!sa) return; sa.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.ds-panel') as HTMLElement[]; bf()
  ScrollTrigger.create({ trigger: sa, start: 'top top', end: 'bottom bottom', scrub: 0.4, onUpdate: (self) => { const f = self.progress * (TOTAL - 1); const idx = Math.floor(f); const frac = f - idx
      panels.forEach((p, i) => { if (i < idx - 1 || i > idx + 1) { p.style.opacity = '0' } else if (i === idx) { p.style.opacity = '1'; p.style.zIndex = String(TOTAL + 10); const fs = frags[i] || []
          fs.forEach((fr, fi) => { const fa = (fi / FRAGS) * 360; const rad = (fa - 90) * Math.PI / 180; const dx = Math.cos(rad); const dy = Math.sin(rad)
            if (frac < .45) { const pp = frac / .45; const ep = pp * pp; const d = ep * 180; fr.style.transform = `translate(${dx*d}px,${dy*d}px) rotate(${fa*ep}deg) scale(${1-ep*.35})`; fr.style.opacity = String(1 - ep * .35); fr.style.filter = `brightness(${1+ep*1.2}) hue-rotate(${ep*100}deg)` }
            else if (frac < .55) { const pp = (frac - .45) / .1; const d = 180; const hx = Math.sin(pp * Math.PI * 2) * 10; fr.style.transform = `translate(${dx*d+hx}px,${dy*d+Math.cos(pp*Math.PI*2)*8}px) rotate(${fa+hx*.3}deg) scale(.65)`; fr.style.opacity = '.65'; fr.style.filter = 'brightness(1.8) hue-rotate(150deg) saturate(1.5)' }
            else { const pp = (frac - .55) / .45; const ep = 1 - Math.pow(1 - pp, 4); const d = 180 * (1 - ep); fr.style.transform = `translate(${dx*d}px,${dy*d}px) rotate(${fa*(1-ep)}deg) scale(${.65+ep*.35})`; fr.style.opacity = String(.65 + ep * .35); fr.style.filter = `brightness(${1.8-ep*.8}) hue-rotate(${150*(1-ep)}deg)` } }) } else if (i === idx + 1) { const rp = Math.max(0, frac - .55) / .45; p.style.opacity = String(rp); p.style.filter = `blur(${(1-rp)*5}px)`; p.style.zIndex = String(TOTAL + 5) } }); if (idx !== cur) { cur = idx; uu(idx) } } }); document.addEventListener('keydown', kd); cd(); uu(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', kd) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="dsArea" class="ds-page"><div id="dsProgress" class="ds-progress-bar"></div><nav id="dsNav" class="ds-nav-dots"></nav>
    <div class="ds-indicator"><span class="ds-cur">1</span> / {{ TOTAL }}</div>
    <section v-for="n in TOTAL" :key="n" class="ds-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${n*50+220},40%,82%), hsl(${(n-1)*52}, 52%,90%))` }">
      <div class="ds-fc"></div><div class="ds-bc"><span class="ds-num">{{ String(n).padStart(2, '0') }}</span><span class="ds-icon">◆</span></div>
    </section>
  </div>
</template>

<style scoped>
.ds-page { font-family: system-ui, -apple-system, sans-serif; background: #f4f2f8; color: #1a1a2e; }
.ds-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter; }
.ds-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.ds-fc { position: absolute; inset: 0; z-index: 5; }
.ds-bc { text-align: center; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.ds-num { font-size: clamp(4rem, 14vw, 10rem); font-weight: 900; color: rgba(26,26,46,.03); user-select: none; }
.ds-icon { font-size: 2rem; color: rgba(26,26,46,.08); animation: dsS 4s linear infinite; }
@keyframes dsS { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
</style>

<style>
.ds-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.ds-nav-dot { width: 8px; height: 8px; border-radius: 1px; background: rgba(26,26,46,.1); cursor: pointer; border: 1px solid rgba(26,26,46,.08); padding: 0; transition: all .3s; transform: rotate(45deg); }
.ds-nav-dot.ds-active { background: #818cf8; border-color: rgba(26,26,46,.2); transform: rotate(45deg) scale(1.5); box-shadow: 0 0 14px rgba(129,140,248,.4); }
.ds-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #818cf8, #a5b4fc, #c7d2fe); z-index: 1001; }
.ds-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>
