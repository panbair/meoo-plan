<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T = 7; const NP = 60; let c = 0; let sa: HTMLElement | null = null; let pb: HTMLElement | null = null; let nd: HTMLElement | null = null; let pels: HTMLElement[] = []
function cd() { if (!nd) return; nd.innerHTML = ''; for (let i = 0; i < T; i++) { const d = document.createElement('button'); d.className = 'nb-dot' + (i === 0 ? ' nb-active' : ''); d.addEventListener('click', () => go(i)); nd.appendChild(d) } }
function uu(i: number) { document.querySelectorAll('.nb-dot').forEach((d, j) => d.classList.toggle('nb-active', j === i)); const el = document.querySelector('.nb-cur'); if (el) el.textContent = String(i + 1); if (pb) pb.style.width = ((i + 1) / T) * 100 + '%' }
function go(i: number) { i = Math.max(0, Math.min(i, T - 1)); gsap.to(window, { scrollTo: { y: i * innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function kd(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(c + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(c - 1) } }
function bp() { const ct = document.querySelector('.nb-particles') as HTMLElement; if (!ct) return; ct.innerHTML = ''; pels = []; for (let i = 0; i < NP; i++) { const p = document.createElement('div'); p.className = 'nb-dp'; const a = (i / NP) * Math.PI * 2; const r = 20 + Math.random() * 60; p.style.cssText = `--bx:${Math.cos(a)*r}%;--by:${Math.sin(a)*r}%;--sz:${1+Math.random()*3}px;--h:${(i/NP)*360}`; ct.appendChild(p); pels.push(p) } }
function init() { sa = document.getElementById('nbArea') as HTMLElement; pb = document.getElementById('nbProgress'); nd = document.getElementById('nbNav'); if (!sa) return; sa.style.height = T * 100 + 'vh'; const panels = gsap.utils.toArray('.nb-panel') as HTMLElement[]; bp()
  panels.forEach((p, i) => { if (i === 0) { p.style.opacity = '1'; p.style.transform = ''; p.style.zIndex = String(T + 10) } else { p.style.opacity = '0'; p.style.transform = 'scale(0.3)'; p.style.zIndex = String(T - i) } })
  ScrollTrigger.create({ trigger: sa, start: 'top top', end: 'bottom bottom', scrub: 0.5, onUpdate: (self) => { const f = self.progress * (T - 1); const idx = Math.floor(f); const frac = f - idx
      pels.forEach((p, pi) => { const sp = Math.sin(frac * Math.PI) * 180; const hs = frac * 360; const bx = parseFloat(p.style.getPropertyValue('--bx')); const by = parseFloat(p.style.getPropertyValue('--by')); p.style.transform = `translate(${bx*sp/60}px,${by*sp/60}px) scale(${.3+Math.abs(Math.sin(frac*Math.PI))*2})`; p.style.opacity = String(Math.abs(Math.sin(frac * Math.PI)) * .4 + .1); p.style.background = `hsla(${(pi/NP*360+hs)%360},70%,${50+Math.sin(frac*Math.PI)*25}%,${.2+Math.abs(Math.sin(frac*Math.PI))*.4})` })
      panels.forEach((p, i) => { if (i < idx) { p.style.opacity = '0'; p.style.zIndex = String(i) } else if (i > idx + 1) { p.style.opacity = '0'; p.style.zIndex = String(T - i) } else if (i === idx) { if (frac < .3) { const pp = frac / .3; p.style.transform = `scale(${1+pp*.35})`; p.style.opacity = '1'; p.style.filter = `hue-rotate(${pp*100}deg)`; p.style.zIndex = String(T + 10) } else if (frac < .55) { const pp = (frac - .3) / .25; p.style.transform = `scale(${1.35-pp*.3})`; p.style.opacity = String(1 - pp * .25); p.style.filter = `hue-rotate(${100+pp*200}deg) blur(${pp*6}px)`; p.style.zIndex = String(T + 10) } else { const pp = (frac - .55) / .45; p.style.transform = `scale(${1.05-pp*1.05})`; p.style.opacity = String(1 - pp); p.style.filter = `hue-rotate(300deg) blur(${6+pp*8}px)`; p.style.zIndex = String(T + 10) } } else if (i === idx + 1) { const rp = Math.max(0, frac - .4) / .6; p.style.transform = `scale(${.1+rp*.9})`; p.style.opacity = String(rp); p.style.filter = `blur(${(1-rp)*14}px)`; p.style.zIndex = String(T + 5) } }); if (idx !== c) { c = idx; uu(idx) } } }); document.addEventListener('keydown', kd); cd(); uu(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', kd) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="nbArea" class="nb-page"><div id="nbProgress" class="nb-progress-bar"></div><nav id="nbNav" class="nb-nav-dots"></nav>
    <div class="nb-indicator"><span class="nb-cur">1</span> / {{ T }}</div>
    <div class="nb-particles"></div><div class="nb-core"></div>
    <section v-for="n in T" :key="n" class="nb-panel" :style="{ background: `radial-gradient(ellipse at 50% 40%, hsl(${(n-1)*52}, 52%,82%), hsl(${(n-1)*52}, 52%,92%))` }">
      <div class="nb-content"><span class="nb-num">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.nb-page { font-family: system-ui, -apple-system, sans-serif; background: #f6f4fa; color: #1a1a2e; }
.nb-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.nb-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.nb-content { text-align: center; position: relative; z-index: 2; }
.nb-num { font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; background: linear-gradient(135deg, rgba(26,26,46,.1), rgba(26,26,46,.04)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; user-select: none; }
.nb-particles { position: fixed; top: 50%; left: 50%; z-index: 50; pointer-events: none; }
.nb-dp { position: absolute; border-radius: 50%; width: var(--sz); height: var(--sz); transform: translate(-50%,-50%); will-change: transform, opacity, background; }
.nb-core { position: fixed; top: 50%; left: 50%; width: 200px; height: 200px; border-radius: 50%; z-index: 49; pointer-events: none; transform: translate(-50%,-50%); background: radial-gradient(circle, rgba(26,26,46,.04) 0%, transparent 70%); }
</style>

<style>
.nb-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 14px; }
.nb-nav-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(26,26,46,.08); cursor: pointer; border: none; padding: 0; transition: all .4s; }
.nb-nav-dot.nb-active { background: #8b5cf6; transform: scale(2.2); box-shadow: 0 0 14px rgba(139,92,246,.4); }
.nb-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd, #8b5cf6); background-size: 200% 100%; animation: nbBar 3s linear infinite; z-index: 1001; }
@keyframes nbBar { 0%{background-position:0 50%} 100%{background-position:200% 50%} }
.nb-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>
