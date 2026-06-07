<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const CARDS = 8; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let cardStrips: HTMLElement[][] = []
function cd() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const d = document.createElement('button'); d.className = 'ms-dot' + (i === 0 ? ' ms-active' : ''); d.addEventListener('click', () => go(i)); navDots.appendChild(d) } }
function uu(i: number) { document.querySelectorAll('.ms-dot').forEach((d, j) => d.classList.toggle('ms-active', j === i)); const el = document.querySelector('.ms-cur'); if (el) el.textContent = String(i + 1); if (progressBar) progressBar.style.width = ((i + 1) / TOTAL) * 100 + '%' }
function go(i: number) { i = Math.max(0, Math.min(i, TOTAL - 1)); gsap.to(window, { scrollTo: { y: i * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function kd(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(currentIndex - 1) } }
function bc() { cardStrips = []; document.querySelectorAll('.ms-panel').forEach((p) => { const s: HTMLElement[] = []; const c = p.querySelector('.ms-sc'); if (!c) { cardStrips.push(s); return }; c.innerHTML = ''; const sh = 100 / CARDS; for (let i = 0; i < CARDS; i++) { const st = document.createElement('div'); st.style.cssText = `position:absolute;left:0;width:100%;height:${sh}%;top:${i*sh}%`; const inn = document.createElement('div'); inn.style.cssText = 'position:absolute;inset:0'; st.appendChild(inn); c.appendChild(st); s.push(st) }; cardStrips.push(s) }) }
function init() { scrollArea = document.getElementById('msArea') as HTMLElement; progressBar = document.getElementById('msProgress'); navDots = document.getElementById('msNav'); if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.ms-panel') as HTMLElement[]; bc(); panels.forEach((p, i) => { if (i > 0) { const s = cardStrips[i] || []; s.forEach(st => { st.style.opacity = '0' }) } })
  ScrollTrigger.create({ trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4, onUpdate: (self) => { const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      panels.forEach((panel, i) => { if (i < idx - 1 || i > idx + 1) { panel.style.opacity = '0' } else if (i === idx) { panel.style.opacity = '1'; panel.style.zIndex = String(TOTAL + 10); const ss = cardStrips[i] || []
          ss.forEach((st, si) => { const co = (si - CARDS / 2 + .5) * 1.5
            if (frac < .35) { const p = frac / .35; const d = p * 140 * (1 + Math.abs(co) * .4); const ang = (si % 2 === 0 ? 1 : -1) * (22 + si * 5); st.style.transform = `translateY(${co*p*60}vh) translateX(${ang*p*1.5}vw) rotate(${ang*p}deg) scale(${1-p*.25})`; st.style.opacity = String(1 - p * .25); st.style.filter = `blur(${p*3}px) brightness(${1+p*.3})` }
            else if (frac < .5) { const p = (frac - .35) / .15; const ang = (si % 2 === 0 ? 1 : -1) * (22 + si * 5); st.style.transform = `translateY(${co*60+Math.sin(p*Math.PI*2)*8}vh) translateX(${ang*1.5}vw) rotate(${ang+Math.sin(p*Math.PI*2)*4}deg) scale(.7)`; st.style.opacity = '.7'; st.style.filter = 'blur(4px) brightness(1.1)' }
            else { const p = (frac - .5) / .5; const ep = 1 - Math.pow(1 - p, 3); st.style.transform = `translateY(${co*60*(1-ep)}vh) translateX(0) rotate(0deg) scale(${.7+ep*.3})`; st.style.opacity = String(.7 + ep * .3); st.style.filter = `blur(${4*(1-ep)}px) brightness(${1.1-ep*.2})` } }) } else if (i === idx + 1) { panel.style.opacity = String(Math.max(0, frac - .6) / .4); panel.style.filter = `blur(${Math.max(0,(1-frac)*6)}px)`; panel.style.zIndex = String(TOTAL + 5) } }); if (idx !== currentIndex) { currentIndex = idx; uu(idx) } } }); document.addEventListener('keydown', kd); cd(); uu(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', kd) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="msArea" class="ms-page"><div id="msProgress" class="ms-progress-bar"></div><nav id="msNav" class="ms-nav-dots"></nav>
    <div class="ms-indicator"><span class="ms-cur">1</span> / {{ TOTAL }}</div>
    <div class="ms-core"></div>
    <section v-for="n in TOTAL" :key="n" class="ms-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${n*50+260},45%,78%), hsl(${(n-1)*52}, 52%,88%))` }">
      <div class="ms-sc"></div><span class="ms-bg">{{ String(n).padStart(2, '0') }}</span>
    </section>
  </div>
</template>

<style scoped>
.ms-page { font-family: system-ui, -apple-system, sans-serif; background: #f4f3fa; color: #1a1a2e; }
.ms-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter; }
.ms-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.ms-sc { position: absolute; inset: 0; z-index: 5; }
.ms-bg { font-size: 20rem; font-weight: 900; color: rgba(26,26,46,.015); position: absolute; z-index: 1; user-select: none; }
.ms-core { position: fixed; top: 50%; left: 50%; width: 12px; height: 12px; border-radius: 50%; background: rgba(26,26,46,.3); z-index: 100; pointer-events: none; transform: translate(-50%,-50%); box-shadow: 0 0 20px rgba(26,26,46,.15); }
</style>

<style>
.ms-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.ms-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26,26,46,.12); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.ms-nav-dot.ms-active { background: #8b5cf6; border-color: rgba(26,26,46,.25); transform: scale(1.5); box-shadow: 0 0 14px rgba(139,92,246,.4); }
.ms-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd); z-index: 1001; }
.ms-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>
