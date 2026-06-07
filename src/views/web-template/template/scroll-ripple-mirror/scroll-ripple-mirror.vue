<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const RC = 6; let cur = 0; let sa: HTMLElement | null = null; let pb: HTMLElement | null = null; let nd: HTMLElement | null = null
function cd() { if (!nd) return; nd.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const d = document.createElement('button'); d.className = 'rm-dot' + (i === 0 ? ' rm-active' : ''); d.addEventListener('click', () => go(i)); nd.appendChild(d) } }
function uu(i: number) { document.querySelectorAll('.rm-dot').forEach((d, j) => d.classList.toggle('rm-active', j === i)); const el = document.querySelector('.rm-cur'); if (el) el.textContent = String(i + 1); if (pb) pb.style.width = ((i + 1) / TOTAL) * 100 + '%' }
function go(i: number) { i = Math.max(0, Math.min(i, TOTAL - 1)); gsap.to(window, { scrollTo: { y: i * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function kd(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1) } }
function init() { sa = document.getElementById('rmArea') as HTMLElement; pb = document.getElementById('rmProgress'); nd = document.getElementById('rmNav'); if (!sa) return; sa.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.rm-panel') as HTMLElement[]; const rr = document.querySelectorAll('.rm-ripple-ring') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { if (i === 0) { p.style.clipPath = 'circle(150% at 50% 50%)'; p.style.opacity = '1'; p.style.zIndex = String(TOTAL + 10) } else { p.style.clipPath = 'circle(0% at 50% 50%)'; p.style.opacity = '0'; p.style.zIndex = String(TOTAL - i) } })
  ScrollTrigger.create({ trigger: sa, start: 'top top', end: 'bottom bottom', scrub: 0.5, onUpdate: (self) => { const f = self.progress * (TOTAL - 1); const idx = Math.floor(f); const frac = f - idx
      rr.forEach((r, ri) => { const rp = Math.max(0, Math.min(1, (frac - ri * .12) / .6)); const ba = Math.sin(rp * Math.PI * 3); (r as HTMLElement).style.transform = `translate(-50%,-50%) scale(${rp*3+Math.abs(ba)*.5})`; (r as HTMLElement).style.opacity = String(Math.abs(Math.sin(rp * Math.PI * 2)) * .2) })
      panels.forEach((p, i) => { if (i < idx) { p.style.clipPath = 'circle(0% at 50% 50%)'; p.style.opacity = '0'; p.style.zIndex = String(i) } else if (i > idx + 1) { p.style.clipPath = 'circle(0% at 50% 50%)'; p.style.opacity = '0'; p.style.zIndex = String(TOTAL - i) } else if (i === idx) { p.style.clipPath = `circle(${frac*150}% at 50% 50%)`; p.style.opacity = '1'; p.style.zIndex = String(TOTAL + 10) } else if (i === idx + 1) { const rp = Math.max(0, frac - .2) / .8; p.style.clipPath = `circle(${rp*150}% at 50% 50%)`; p.style.opacity = String(Math.min(1, rp * 1.3)); p.style.filter = `brightness(${.6+rp*.4})`; p.style.zIndex = String(TOTAL + 5) } }); if (idx !== cur) { cur = idx; uu(idx) } } }); document.addEventListener('keydown', kd); cd(); uu(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', kd) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="rmArea" class="rm-page"><div id="rmProgress" class="rm-progress-bar"></div><nav id="rmNav" class="rm-nav-dots"></nav>
    <div class="rm-indicator"><span class="rm-cur">1</span> / {{ TOTAL }}</div>
    <div class="rm-ripples"><div v-for="r in RC" :key="r" class="rm-ripple-ring" :style="{ width: `${r*55}px`, height: `${r*55}px` }"></div></div>
    <div class="rm-drop"></div>
    <section v-for="n in TOTAL" :key="n" class="rm-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${n*50+200},45%,80%), hsl(${(n-1)*52}, 52%,90%))` }">
      <div class="rm-content"><span class="rm-num">{{ String(n).padStart(2, '0') }}</span><span class="rm-icon">◉</span></div>
    </section>
  </div>
</template>

<style scoped>
.rm-page { font-family: system-ui, -apple-system, sans-serif; background: #f2f5f8; color: #1a1a2e; }
.rm-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter; }
.rm-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.rm-content { text-align: center; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.rm-num { font-size: clamp(5rem, 14vw, 10rem); font-weight: 900; color: rgba(26,26,46,.03); user-select: none; }
.rm-icon { font-size: 1.5rem; color: rgba(26,26,46,.08); }
.rm-ripples { position: fixed; top: 50%; left: 50%; z-index: 50; pointer-events: none; }
.rm-ripple-ring { position: absolute; border-radius: 50%; border: 2px solid rgba(26,26,46,.06); transform: translate(-50%,-50%) scale(0); will-change: transform, opacity; }
.rm-drop { position: fixed; top: 50%; left: 50%; width: 10px; height: 10px; background: rgba(26,26,46,.2); border-radius: 50%; z-index: 51; pointer-events: none; transform: translate(-50%,-50%); box-shadow: 0 0 16px rgba(26,26,46,.12); }
</style>

<style>
.rm-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.rm-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26,26,46,.12); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.rm-nav-dot.rm-active { background: #60a5fa; border-color: rgba(26,26,46,.25); transform: scale(1.5); box-shadow: 0 0 14px rgba(96,165,250,.4); }
.rm-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #60a5fa, #93c5fd, #bfdbfe); z-index: 1001; }
.rm-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>
