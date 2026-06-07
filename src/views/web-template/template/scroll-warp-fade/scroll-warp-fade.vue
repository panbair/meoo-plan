<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T = 7; let c = 0; let sa: HTMLElement | null = null; let pb: HTMLElement | null = null; let nd: HTMLElement | null = null
function cd() { if (!nd) return; nd.innerHTML = ''; for (let i = 0; i < T; i++) { const d = document.createElement('button'); d.className = 'wf-dot' + (i === 0 ? ' wf-active' : ''); d.addEventListener('click', () => go(i)); nd.appendChild(d) } }
function uu(i: number) { document.querySelectorAll('.wf-dot').forEach((d, j) => d.classList.toggle('wf-active', j === i)); const el = document.querySelector('.wf-cur'); if (el) el.textContent = String(i + 1); if (pb) pb.style.width = ((i + 1) / T) * 100 + '%' }
function go(i: number) { i = Math.max(0, Math.min(i, T - 1)); gsap.to(window, { scrollTo: { y: i * innerHeight, autoKill: false }, duration: 0.8, ease: 'power2.inOut' }) }
function kd(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(c + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(c - 1) } }
function init() { sa = document.getElementById('wfArea') as HTMLElement; pb = document.getElementById('wfProgress'); nd = document.getElementById('wfNav'); if (!sa) return; sa.style.height = T * 100 + 'vh'; const panels = gsap.utils.toArray('.wf-panel') as HTMLElement[]
  panels.forEach((p, i) => { if (i === 0) { p.style.transform = ''; p.style.opacity = '1'; p.style.filter = ''; p.style.zIndex = String(T + 10) } else { p.style.transform = 'perspective(1000px) rotateY(55deg) rotateX(15deg) scale(0.6)'; p.style.opacity = '0'; p.style.filter = 'blur(16px)'; p.style.zIndex = String(T - i) } })
  ScrollTrigger.create({ trigger: sa, start: 'top top', end: 'bottom bottom', scrub: 0.6, onUpdate: (self) => { const f = self.progress * (T - 1); const idx = Math.floor(f); const frac = f - idx
      panels.forEach((p, i) => { if (i < idx) { p.style.opacity = '0'; p.style.transform = 'perspective(1000px) rotateY(-70deg) rotateX(25deg) scale(0.4)'; p.style.zIndex = String(i) } else if (i > idx + 1) { p.style.opacity = '0'; p.style.transform = 'perspective(1000px) rotateY(70deg) rotateX(-25deg) scale(0.4)'; p.style.zIndex = String(T - i) } else if (i === idx) { const ep = frac * frac; p.style.transform = `perspective(1000px) rotateY(${ep*-60}deg) rotateX(${ep*20}deg) scale(${1-ep*.45})`; p.style.opacity = String(Math.max(0, 1 - ep * .7)); p.style.filter = `blur(${ep*14}px)`; p.style.zIndex = String(T + 10) } else if (i === idx + 1) { const rp = Math.max(0, frac - .2) / .8; const ep = 1 - Math.pow(1 - rp, 3); p.style.transform = `perspective(1000px) rotateY(${(1-ep)*70}deg) rotateX(${(1-ep)*-25}deg) scale(${.5+ep*.5})`; p.style.opacity = String(ep); p.style.filter = `blur(${(1-ep)*14}px)`; p.style.zIndex = String(T + 5) } }); if (idx !== c) { c = idx; uu(idx) } } }); document.addEventListener('keydown', kd); cd(); uu(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', kd) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="wfArea" class="wf-page"><div id="wfProgress" class="wf-progress-bar"></div><nav id="wfNav" class="wf-nav-dots"></nav>
    <div class="wf-indicator"><span class="wf-cur">1</span> / {{ T }}</div>
    <section v-for="n in T" :key="n" class="wf-panel" :style="{ background: `linear-gradient(135deg, hsl(${(n-1)*52}, 52%,80%), hsl(${(n-1)*52}, 52%,90%))` }">
      <div class="wf-content"><span class="wf-num">{{ String(n).padStart(2, '0') }}</span><div class="wf-line"></div></div>
    </section>
  </div>
</template>

<style scoped>
.wf-page { font-family: 'Helvetica Neue', system-ui, sans-serif; background: #f5f4f8; color: #1a1a2e; perspective: 1200px; }
.wf-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.wf-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.wf-content { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px; transform-style: preserve-3d; }
.wf-num { font-size: clamp(4rem, 14vw, 11rem); font-weight: 200; color: rgba(26,26,46,.03); user-select: none; letter-spacing: .05em; }
.wf-line { width: 180px; height: 1px; background: rgba(26,26,46,.08); }
</style>

<style>
.wf-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 18px; }
.wf-nav-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(26,26,46,.08); cursor: pointer; border: none; padding: 0; transition: all .5s; }
.wf-nav-dot.wf-active { background: #64748b; transform: scale(2.8); box-shadow: 0 0 12px rgba(100,116,139,.4); }
.wf-progress-bar { position: fixed; top: 0; left: 0; height: 1px; width: 0%; background: linear-gradient(90deg, #94a3b8, #cbd5e1, #e2e8f0); z-index: 1001; }
.wf-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.6); font-weight: 300; }
</style>
