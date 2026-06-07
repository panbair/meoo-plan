<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T = 7; let c = 0; let sa: HTMLElement | null = null; let pb: HTMLElement | null = null; let nd: HTMLElement | null = null
function cd() { if (!nd) return; nd.innerHTML = ''; for (let i = 0; i < T; i++) { const d = document.createElement('button'); d.className = 'lmm-dot' + (i === 0 ? ' lmm-active' : ''); d.addEventListener('click', () => go(i)); nd.appendChild(d) } }
function uu(i: number) { document.querySelectorAll('.lmm-dot').forEach((d, j) => d.classList.toggle('lmm-active', j === i)); const el = document.querySelector('.lmm-cur'); if (el) el.textContent = String(i + 1); if (pb) pb.style.width = ((i + 1) / T) * 100 + '%' }
function go(i: number) { i = Math.max(0, Math.min(i, T - 1)); gsap.to(window, { scrollTo: { y: i * innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function kd(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(c + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(c - 1) } }
function init() { sa = document.getElementById('lmmArea') as HTMLElement; pb = document.getElementById('lmmProgress'); nd = document.getElementById('lmmNav'); if (!sa) return; sa.style.height = T * 100 + 'vh'; const panels = gsap.utils.toArray('.lmm-panel') as HTMLElement[]; const turb = document.querySelector('.lmm-turbulence feTurbulence') as SVGFETurbulenceElement; const disp = document.querySelector('.lmm-displacement feDisplacementMap') as SVGFEDisplacementMapElement
  panels.forEach((p, i) => { if (i === 0) { p.style.filter = ''; p.style.opacity = '1'; p.style.transform = ''; p.style.clipPath = 'none'; p.style.zIndex = String(T + 10) } else { p.style.filter = 'url(#lmm-f)'; p.style.opacity = '0'; p.style.transform = 'scale(0.6)'; p.style.clipPath = 'circle(0% at 50% 50%)'; p.style.zIndex = String(T - i) } })
  ScrollTrigger.create({ trigger: sa, start: 'top top', end: 'bottom bottom', scrub: 0.4, onUpdate: (self) => { const f = self.progress * (T - 1); const idx = Math.floor(f); const frac = f - idx
      if (turb) turb.setAttribute('baseFrequency', `0.01 ${.001+Math.sin(frac*Math.PI)*.04}`)
      if (disp) disp.setAttribute('scale', String(Math.abs(Math.sin(frac*Math.PI)*45)))
      panels.forEach((p, i) => { if (i < idx) { p.style.opacity = '0'; p.style.zIndex = String(i) } else if (i > idx + 1) { p.style.opacity = '0'; p.style.zIndex = String(T - i) } else if (i === idx) { if (frac < .4) { const pp = frac / .4; p.style.filter = 'url(#lmm-f)'; p.style.clipPath = 'none'; p.style.opacity = '1'; p.style.transform = `rotateY(0deg) scale(${1-pp*.1})`; p.style.zIndex = String(T + 10) } else if (frac < .55) { const pp = (frac - .4) / .15; p.style.filter = 'url(#lmm-f)'; p.style.clipPath = 'none'; p.style.opacity = String(1 - pp * .3); p.style.transform = `rotateY(${pp*180}deg) scale(${.9-pp*.3})`; p.style.zIndex = String(T + 10) } else { const pp = (frac - .55) / .45; p.style.filter = `url(#lmm-f) blur(${pp*pp*8}px)`; p.style.clipPath = `circle(${(1-pp*pp)*100}% at 50% 50%)`; p.style.opacity = String(1 - pp * pp); p.style.transform = `rotateY(180deg) rotate(${pp*pp*360}deg) scale(${.6-pp*pp*.5})`; p.style.zIndex = String(T + 10) } } else if (i === idx + 1) { const rp = Math.max(0, frac - .3) / .7; p.style.filter = 'url(#lmm-f)'; p.style.clipPath = `circle(${rp*150}% at 50% 50%)`; p.style.opacity = String(Math.min(1, rp * 1.2)); p.style.transform = `scale(${.8+rp*.2})`; p.style.zIndex = String(T + 5) } }); if (idx !== c) { c = idx; uu(idx) } } }); document.addEventListener('keydown', kd); cd(); uu(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', kd) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="lmmArea" class="lmm-page"><svg class="lmm-svg"><filter id="lmm-f" class="lmm-displacement"><feTurbulence class="lmm-turbulence" type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></svg>
    <div id="lmmProgress" class="lmm-progress-bar"></div><nav id="lmmNav" class="lmm-nav-dots"></nav>
    <div class="lmm-indicator"><span class="lmm-cur">1</span> / {{ T }}</div>
    <section v-for="n in T" :key="n" class="lmm-panel" :style="{ background: `linear-gradient(135deg, hsl(${(n-1)*52}, 52%,82%), hsl(${(n-1)*52}, 52%,90%))` }">
      <div class="lmm-content"><span class="lmm-num">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.lmm-page { font-family: system-ui, -apple-system, sans-serif; background: #f3f2f8; color: #1a1a2e; }
.lmm-svg { position: absolute; width: 0; height: 0; }
.lmm-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter, clip-path; perspective: 1200px; }
.lmm-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.lmm-content { text-align: center; position: relative; z-index: 2; }
.lmm-num { font-size: clamp(5rem, 15vw, 11rem); font-weight: 900; color: rgba(26,26,46,.03); user-select: none; background: linear-gradient(135deg, rgba(26,26,46,.15), rgba(26,26,46,.06)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
</style>

<style>
.lmm-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.lmm-nav-dot { width: 10px; height: 10px; border-radius: 2px; background: rgba(26,26,46,.1); cursor: pointer; border: 1px solid rgba(26,26,46,.06); padding: 0; transition: all .3s; }
.lmm-nav-dot.lmm-active { background: #94a3b8; border-color: rgba(26,26,46,.2); transform: scale(1.3); box-shadow: 0 0 12px rgba(148,163,184,.4); }
.lmm-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #94a3b8, #cbd5e1, #e2e8f0); z-index: 1001; }
.lmm-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>
