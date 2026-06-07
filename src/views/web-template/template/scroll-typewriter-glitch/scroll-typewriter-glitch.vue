<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T = 7; let c = 0; let sa: HTMLElement | null = null; let pb: HTMLElement | null = null; let nd: HTMLElement | null = null
function cd() { if (!nd) return; nd.innerHTML = ''; for (let i = 0; i < T; i++) { const d = document.createElement('button'); d.className = 'twg-dot' + (i === 0 ? ' twg-active' : ''); d.addEventListener('click', () => go(i)); nd.appendChild(d) } }
function uu(i: number) { document.querySelectorAll('.twg-dot').forEach((d, j) => d.classList.toggle('twg-active', j === i)); const el = document.querySelector('.twg-cur'); if (el) el.textContent = String(i + 1); if (pb) pb.style.width = ((i + 1) / T) * 100 + '%' }
function go(i: number) { i = Math.max(0, Math.min(i, T - 1)); gsap.to(window, { scrollTo: { y: i * innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function kd(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(c + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(c - 1) } }
function init() { sa = document.getElementById('twgArea') as HTMLElement; pb = document.getElementById('twgProgress'); nd = document.getElementById('twgNav'); if (!sa) return; sa.style.height = T * 100 + 'vh'; const panels = gsap.utils.toArray('.twg-panel') as HTMLElement[]
  panels.forEach((p, i) => { if (i === 0) { p.style.clipPath = 'inset(0 0 0 0)'; p.style.opacity = '1'; p.style.zIndex = String(T + 10) } else { p.style.clipPath = 'inset(0 0 100% 0)'; p.style.opacity = '0'; p.style.zIndex = String(T - i) } })
  ScrollTrigger.create({ trigger: sa, start: 'top top', end: 'bottom bottom', scrub: 0.4, onUpdate: (self) => { const f = self.progress * (T - 1); const idx = Math.floor(f); const frac = f - idx
      panels.forEach((p, i) => { if (i < idx) { p.style.clipPath = 'inset(100% 0 0 0)'; p.style.opacity = '0'; p.style.zIndex = String(i) } else if (i > idx + 1) { p.style.clipPath = 'inset(0 0 100% 0)'; p.style.opacity = '0'; p.style.zIndex = String(T - i) } else if (i === idx) { if (frac < .3) { const pp = frac / .3; p.style.clipPath = `inset(0 0 ${100-pp*100}% 0)`; p.style.opacity = '1'; p.style.filter = ''; p.style.transform = ''; p.style.zIndex = String(T + 10) } else if (frac < .55) { const pp = (frac - .3) / .25; const gx = (Math.random() - .5) * pp * 20; p.style.clipPath = 'inset(0 0 0 0)'; p.style.opacity = '1'; p.style.filter = `contrast(${1+pp*1.5}) brightness(${1+pp*.8})`; p.style.transform = `translateX(${gx}px)`; p.style.zIndex = String(T + 10) } else { const pp = (frac - .55) / .45; p.style.clipPath = `inset(0 ${pp*45}% 0 ${pp*45}%)`; p.style.opacity = String(1 - pp); p.style.filter = `contrast(${1+(1-pp)*2}) brightness(${1+(1-pp)})`; p.style.zIndex = String(T + 10) } } else if (i === idx + 1) { const rp = Math.max(0, frac - .5) / .5; p.style.clipPath = `inset(0 ${(1-rp)*45}% 0 ${(1-rp)*45}%)`; p.style.opacity = String(rp); p.style.filter = `brightness(${.4+rp*.6})`; p.style.zIndex = String(T + 5) } }); if (idx !== c) { c = idx; uu(idx) } } }); document.addEventListener('keydown', kd); cd(); uu(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', kd) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="twgArea" class="twg-page"><div id="twgProgress" class="twg-progress-bar"></div><nav id="twgNav" class="twg-nav-dots"></nav>
    <div class="twg-indicator"><span class="twg-cur">1</span> / {{ T }}</div>
    <section v-for="n in T" :key="n" class="twg-panel" :style="{ background: `linear-gradient(180deg, hsl(${n*50+160},40%,78%), hsl(${(n-1)*52}, 52%,88%))` }">
      <div class="twg-content"><span class="twg-num">{{ String(n).padStart(2, '0') }}</span><span class="twg-cursor">▌</span></div>
    </section>
  </div>
</template>

<style scoped>
.twg-page { font-family: 'Courier New', monospace; background: #f4f2f6; color: #1a1a2e; }
.twg-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter, transform; }
.twg-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.twg-content { text-align: center; position: relative; z-index: 2; display: flex; align-items: center; gap: 4px; }
.twg-num { font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(26,26,46,.03); user-select: none; }
.twg-cursor { font-size: clamp(4rem, 14vw, 10rem); color: rgba(26,26,46,.1); animation: twgB 1s step-end infinite; }
@keyframes twgB { 0%,100%{opacity:1} 50%{opacity:0} }
</style>

<style>
.twg-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.twg-nav-dot { width: 8px; height: 8px; border-radius: 1px; background: rgba(26,26,46,.1); cursor: pointer; border: 1px solid rgba(26,26,46,.08); padding: 0; transition: all .3s; }
.twg-nav-dot.twg-active { background: #34d399; border-color: rgba(26,26,46,.2); transform: scale(1.3); box-shadow: 0 0 12px rgba(52,211,153,.4); }
.twg-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #34d399, #6ee7b7, #a7f3d0); z-index: 1001; }
.twg-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); font-family: 'Courier New', monospace; }
</style>
