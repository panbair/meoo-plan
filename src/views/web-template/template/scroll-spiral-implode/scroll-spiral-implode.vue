<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let cur = 0; let sa: HTMLElement | null = null; let pb: HTMLElement | null = null; let nd: HTMLElement | null = null
function cd() { if (!nd) return; nd.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const d = document.createElement('button'); d.className = 'sbi-dot' + (i === 0 ? ' sbi-active' : ''); d.addEventListener('click', () => go(i)); nd.appendChild(d) } }
function uu(i: number) { document.querySelectorAll('.sbi-dot').forEach((d, j) => d.classList.toggle('sbi-active', j === i)); const el = document.querySelector('.sbi-cur'); if (el) el.textContent = String(i + 1); if (pb) pb.style.width = ((i + 1) / TOTAL) * 100 + '%' }
function go(i: number) { i = Math.max(0, Math.min(i, TOTAL - 1)); gsap.to(window, { scrollTo: { y: i * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function kd(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1) } }
function init() { sa = document.getElementById('sbiArea') as HTMLElement; pb = document.getElementById('sbiProgress'); nd = document.getElementById('sbiNav'); if (!sa) return; sa.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.sbi-panel') as HTMLElement[]; const cg = document.querySelector('.sbi-core') as HTMLElement; const rings = document.querySelectorAll('.sbi-ring') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { if (i === 0) { p.style.opacity = '1'; p.style.transform = ''; p.style.zIndex = String(TOTAL + 10) } else { p.style.opacity = '0'; p.style.transform = 'scale(0.1) rotate(720deg)'; p.style.zIndex = String(TOTAL - i) } })
  ScrollTrigger.create({ trigger: sa, start: 'top top', end: 'bottom bottom', scrub: 0.4, onUpdate: (self) => { const f = self.progress * (TOTAL - 1); const idx = Math.floor(f); const frac = f - idx
      rings.forEach((r, ri) => { const rp = Math.sin(frac * Math.PI + ri * .5); (r as HTMLElement).style.transform = `translate(-50%,-50%) scale(${.6+Math.abs(rp)*1.2})`; (r as HTMLElement).style.opacity = String(.1+Math.abs(rp)*.3) })
      panels.forEach((p, i) => { if (i < idx) { p.style.opacity = '0'; p.style.zIndex = String(i) } else if (i > idx + 1) { p.style.opacity = '0'; p.style.zIndex = String(TOTAL - i) } else if (i === idx) { if (frac < .6) { const pp = frac / .6; const ep = pp * pp; const sc = 1 - ep; const rt = ep * 720; p.style.transform = `translate(${Math.cos(ep*Math.PI*3)*ep*70}px,${Math.sin(ep*Math.PI*3)*ep*70}px) rotate(${rt}deg) scale(${Math.max(.05,sc)})`; p.style.opacity = String(1 - ep * .4); p.style.filter = `blur(${ep*6}px) brightness(${1+ep*1.5})`; p.style.zIndex = String(TOTAL + 10); if (cg) cg.style.opacity = String(ep * .7) } else { const pp = (frac - .6) / .4; p.style.transform = `scale(${.05+pp*.01})`; p.style.opacity = String(Math.max(0, 1 - pp * 2)); p.style.filter = 'blur(20px) brightness(3)'; p.style.zIndex = String(TOTAL + 10); if (cg) cg.style.opacity = String(.7 * (1 - pp)) } } else if (i === idx + 1) { const rp = Math.max(0, frac - .35) / .65; const ep = 1 - Math.pow(1 - rp, 4); p.style.transform = `scale(${.05+ep*2})`; p.style.opacity = String(Math.min(1, rp * 1.5)); p.style.filter = `blur(${(1-rp)*14}px)`; p.style.zIndex = String(TOTAL + 5) } }); if (idx !== cur) { cur = idx; uu(idx) } } }); document.addEventListener('keydown', kd); cd(); uu(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', kd) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="sbiArea" class="sbi-page"><div id="sbiProgress" class="sbi-progress-bar"></div><nav id="sbiNav" class="sbi-nav-dots"></nav>
    <div class="sbi-indicator"><span class="sbi-cur">1</span> / {{ TOTAL }}</div>
    <div class="sbi-core"></div><div class="sbi-rings"><div v-for="r in 5" :key="r" class="sbi-ring" :style="{ width: `${r*70}px`, height: `${r*70}px` }"></div></div>
    <section v-for="n in TOTAL" :key="n" class="sbi-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${n*50+280},42%,80%), hsl(${(n-1)*52}, 52%,90%))` }">
      <div class="sbi-content"><span class="sbi-num">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.sbi-page { font-family: system-ui, -apple-system, sans-serif; background: #f6f2fa; color: #1a1a2e; }
.sbi-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.sbi-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.sbi-content { text-align: center; position: relative; z-index: 2; }
.sbi-num { font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(26,26,46,.03); user-select: none; }
.sbi-core { position: fixed; top: 50%; left: 50%; width: 20px; height: 20px; border-radius: 50%; background: rgba(26,26,46,.3); z-index: 70; pointer-events: none; opacity: 0; transform: translate(-50%,-50%); box-shadow: 0 0 24px rgba(26,26,46,.15); }
.sbi-rings { position: fixed; top: 50%; left: 50%; pointer-events: none; z-index: 48; }
.sbi-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(26,26,46,.06); transform: translate(-50%,-50%); will-change: transform, opacity; }
</style>

<style>
.sbi-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.sbi-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26,26,46,.12); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.sbi-nav-dot.sbi-active { background: #a855f7; border-color: rgba(26,26,46,.25); transform: scale(1.5); box-shadow: 0 0 14px rgba(168,85,247,.4); }
.sbi-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #a855f7, #c084fc, #e0b0ff); z-index: 1001; }
.sbi-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>
