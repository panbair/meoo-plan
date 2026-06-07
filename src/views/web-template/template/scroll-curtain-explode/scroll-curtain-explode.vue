<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T = 7; let c = 0; let sa: HTMLElement | null = null; let pb: HTMLElement | null = null; let nd: HTMLElement | null = null
function cd() { if (!nd) return; nd.innerHTML = ''; for (let i = 0; i < T; i++) { const d = document.createElement('button'); d.className = 'ce-dot' + (i === 0 ? ' ce-active' : ''); d.addEventListener('click', () => go(i)); nd.appendChild(d) } }
function uu(i: number) { document.querySelectorAll('.ce-dot').forEach((d, j) => d.classList.toggle('ce-active', j === i)); const el = document.querySelector('.ce-cur'); if (el) el.textContent = String(i + 1); if (pb) pb.style.width = ((i + 1) / T) * 100 + '%' }
function go(i: number) { i = Math.max(0, Math.min(i, T - 1)); gsap.to(window, { scrollTo: { y: i * innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function kd(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(c + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(c - 1) } }
function init() { sa = document.getElementById('ceArea') as HTMLElement; pb = document.getElementById('ceProgress'); nd = document.getElementById('ceNav'); if (!sa) return; sa.style.height = T * 100 + 'vh'; const panels = gsap.utils.toArray('.ce-panel') as HTMLElement[]; const cl = document.querySelector('.ce-curtain-l') as HTMLElement; const cr = document.querySelector('.ce-curtain-r') as HTMLElement; const shards = document.querySelectorAll('.ce-shard') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { if (i === 0) { p.style.opacity = '1'; p.style.transform = ''; p.style.zIndex = String(T + 10) } else { p.style.opacity = '0'; p.style.transform = 'scale(0.5)'; p.style.zIndex = String(T - i) } }); if (cl) cl.style.transform = 'translateX(-105%)'; if (cr) cr.style.transform = 'translateX(105%)'
  ScrollTrigger.create({ trigger: sa, start: 'top top', end: 'bottom bottom', scrub: 0.4, onUpdate: (self) => { const f = self.progress * (T - 1); const idx = Math.floor(f); const frac = f - idx
      if (cl && cr) { if (frac < .15) { const pp = frac / .15; cl.style.transform = `translateX(${-105+pp*105}%)`; cr.style.transform = `translateX(${105-pp*105}%)`; cl.style.opacity = String(pp); cr.style.opacity = String(pp) } else if (frac < .3) { cl.style.transform = 'translateX(0%)'; cr.style.transform = 'translateX(0%)'; cl.style.opacity = '1'; cr.style.opacity = '1' } else { const pp = (frac - .3) / .7; cl.style.transform = `translateX(${-pp*150}%) rotate(${-pp*25}deg)`; cr.style.transform = `translateX(${pp*150}%) rotate(${pp*25}deg)`; cl.style.opacity = String(1 - pp); cr.style.opacity = String(1 - pp) } }
      shards.forEach((sh, si) => { const sp = Math.max(0, frac - .25 - si * .02); const a = (si / shards.length) * 360; const d = sp * 250; const r = (a * Math.PI) / 180; (sh as HTMLElement).style.transform = `translate(${Math.cos(r)*d}px,${Math.sin(r)*d}px) rotate(${sp*600}deg) scale(${1-sp*.75})`; (sh as HTMLElement).style.opacity = String(Math.max(0, 1 - sp * 1.3)) })
      panels.forEach((p, i) => { if (i < idx) { p.style.opacity = '0'; p.style.zIndex = String(i) } else if (i > idx + 1) { p.style.opacity = '0'; p.style.zIndex = String(T - i) } else if (i === idx) { if (frac < .3) { const pp = frac / .3; p.style.clipPath = `inset(0 ${50-pp*50}% 0 ${50-pp*50}%)`; p.style.opacity = '1'; p.style.zIndex = String(T + 10) } else { const pp = (frac - .3) / .7; p.style.clipPath = 'none'; p.style.opacity = String(1 - pp); p.style.transform = `scale(${1+pp*.25})`; p.style.zIndex = String(T + 10) } } else if (i === idx + 1) { const rp = Math.max(0, frac - .35) / .65; p.style.opacity = String(rp); p.style.transform = `scale(${.75+rp*.25})`; p.style.zIndex = String(T + 5) } }); if (idx !== c) { c = idx; uu(idx) } } }); document.addEventListener('keydown', kd); cd(); uu(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', kd) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="ceArea" class="ce-page"><div id="ceProgress" class="ce-progress-bar"></div><nav id="ceNav" class="ce-nav-dots"></nav>
    <div class="ce-indicator"><span class="ce-cur">1</span> / {{ T }}</div>
    <div class="ce-curtain ce-curtain-l"></div><div class="ce-curtain ce-curtain-r"></div>
    <div class="ce-shards"><div v-for="i in 24" :key="i" class="ce-shard" :style="{ '--c': `hsl(${i*15+10},60%,${55+i%3*10}%)`, width: `${3+(i%6)*3}px`, height: `${3+(i%4)*3}px` }"></div></div>
    <section v-for="n in T" :key="n" class="ce-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${n*50+20},45%,80%), hsl(${(n-1)*52}, 52%,88%))` }">
      <div class="ce-content"><span class="ce-num">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.ce-page { font-family: 'Georgia', serif; background: #f7f4f2; color: #1a1a2e; }
.ce-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter, transform; }
.ce-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.ce-content { text-align: center; position: relative; z-index: 2; }
.ce-num { font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(26,26,46,.025); user-select: none; }
.ce-curtain { position: fixed; top: 0; width: 52vw; height: 100vh; z-index: 80; pointer-events: none; will-change: transform, opacity; }
.ce-curtain-l { left: 0; background: linear-gradient(90deg, #e8d5d0, #f0e0db 60%, #f5ece8 95%, transparent); box-shadow: 4px 0 20px rgba(0,0,0,.06); }
.ce-curtain-r { right: 0; background: linear-gradient(270deg, #d5e0d0, #e0ece0 60%, #e8f0e8 95%, transparent); box-shadow: -4px 0 20px rgba(0,0,0,.06); }
.ce-shards { position: fixed; top: 50%; left: 50%; z-index: 75; pointer-events: none; }
.ce-shard { position: absolute; border-radius: 2px; background: var(--c); transform: translate(-50%,-50%); will-change: transform, opacity; }
</style>

<style>
.ce-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.ce-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.ce-nav-dot.ce-active { background: #d4735a; border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(212,115,90,.4); }
.ce-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #d4735a, #e8a090, #f0c8c0); z-index: 1001; }
.ce-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); font-family: 'Georgia', serif; }
</style>
