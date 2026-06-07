<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const CARDS = 6; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'stv-dot' + (i === 0 ? ' stv-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.stv-dot').forEach((d, i) => d.classList.toggle('stv-active', i === index)); const el = document.querySelector('.stv-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('stvArea') as HTMLElement; progressBar = document.getElementById('stvProgress'); navDots = document.getElementById('stvNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.stv-panel') as HTMLElement[]; const cards = document.querySelectorAll('.stv-card') as NodeListOf<HTMLElement>
  cards.forEach((card, ci) => { const angle = (ci / cards.length) * 360; const rad = (angle * Math.PI) / 180; const r = 100 + (ci % 3) * 45; (card as HTMLElement).style.transform = `translate(${Math.cos(rad)*r}px,${Math.sin(rad)*r}px)`; (card as HTMLElement).style.opacity = '.7' })
  panels.forEach((p, i) => { p.style.opacity = i === 0 ? '1' : '0'; p.style.zIndex = i === 0 ? String(TOTAL + 20) : String(TOTAL - i) })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      cards.forEach((card, ci) => { const sd = ci * .04; const cf = Math.max(0, Math.min(1, (frac - sd) / .5)); const angle = (ci / cards.length) * 360 + cf * 720; const rad = (angle * Math.PI) / 180; const r = (100 + (ci % 3) * 45) * (1 - cf * .95); (card as HTMLElement).style.transform = `translate(${Math.cos(rad)*r}px,${Math.sin(rad)*r}px) rotate(${cf*540}deg) scale(${Math.max(.1,1-cf*.8)})`; (card as HTMLElement).style.opacity = String(Math.max(.1, .7 - cf * .6)); (card as HTMLElement).style.filter = `blur(${cf*8}px) brightness(${1+cf*2})` })
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) { panel.style.opacity = String(1 - frac * .7); panel.style.filter = `blur(${frac*4}px)`; panel.style.zIndex = String(TOTAL + 10) }
        else if (i === idx + 1) { const rp = Math.max(0, frac - .4) / .6; panel.style.opacity = String(rp); panel.style.filter = `blur(${(1-rp)*10}px) brightness(${.3 + rp * .7})`; panel.style.zIndex = String(TOTAL + 5) }
      })
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0)
}
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="stvArea" class="stv-page">
    <div id="stvProgress" class="stv-progress-bar"></div><nav id="stvNav" class="stv-nav-dots"></nav>
    <div class="stv-indicator"><span class="stv-cur">1</span> / {{ TOTAL }}</div>
    <div class="stv-cards-layer"><div v-for="c in CARDS" :key="c" class="stv-card" :style="{ '--ch': c*60, width: `${90+c*25}px`, height: `${130+c*25}px` }"><span class="stv-card-num">{{ String(c).padStart(2, '0') }}</span></div></div>
    <div class="stv-vortex-center"></div>
    <div class="stv-glow"></div>
    <section v-for="n in TOTAL" :key="n" class="stv-panel" :class="`stv-panel-${n}`"><div class="stv-panel-num">{{ String(n).padStart(2, '0') }}</div></section>
  </div>
</template>

<style scoped>
.stv-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #140e28 0%, #0a0818 40%, #040410 100%); }
.stv-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter; background: radial-gradient(ellipse at 50% 50%, rgba(30,20,60,.4) 0%, transparent 70%); }
.stv-panel-num { font-family: 'Orbitron', monospace; font-size: 20rem; font-weight: 900; color: rgba(255,255,255,.012); position: absolute; }
.stv-cards-layer { position: fixed; top: 50%; left: 50%; z-index: 60; pointer-events: none; }
.stv-card { position: absolute; border-radius: 16px; border: 2px solid hsla(var(--ch),70%,60%,.3); background: hsla(var(--ch),40%,15%,.5); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; transform: translate(-50%,-50%); box-shadow: 0 10px 40px rgba(0,0,0,.3); }
.stv-card-num { font-family: 'Orbitron', monospace; font-size: 2rem; font-weight: 900; color: hsla(var(--ch),70%,70%,.8); }
.stv-vortex-center { position: fixed; top: 50%; left: 50%; width: 20px; height: 20px; border-radius: 50%; transform: translate(-50%,-50%); z-index: 61; pointer-events: none; background: radial-gradient(circle, #fff 0%, rgba(139,92,246,.5) 50%, transparent 70%); box-shadow: 0 0 40px rgba(139,92,246,.5), 0 0 80px rgba(236,72,153,.3); }
.stv-glow { position: fixed; width: 400px; height: 400px; border-radius: 50%; filter: blur(140px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .1; background: radial-gradient(circle, rgba(139,92,246,.3), transparent); }
</style>

<style>
.stv-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 1000; }
.stv-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.06); border: 1px solid rgba(139,92,246,.2); cursor: pointer; transition: all .3s; }
.stv-nav-dot.stv-active { background: #8b5cf6; box-shadow: 0 0 20px rgba(139,92,246,.5); transform: scale(1.4); }
.stv-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #7c3aed, #8b5cf6, #a78bfa); z-index: 1001; transition: width .3s; }
.stv-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.35); z-index: 1002; }
</style>
