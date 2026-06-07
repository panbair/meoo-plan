<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'eex-dot' + (i === 0 ? ' eex-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.eex-dot').forEach((d, i) => d.classList.toggle('eex-active', i === index)); const el = document.querySelector('.eex-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'elastic.out(1, 0.5)' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('eexArea') as HTMLElement; progressBar = document.getElementById('eexProgress'); navDots = document.getElementById('eexNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.eex-panel') as HTMLElement[]
  panels.forEach((p, i) => { if (i === 0) { p.style.transform = ''; p.style.opacity = '1'; p.style.filter = ''; p.style.clipPath = 'inset(0 0 0 0)'; p.style.zIndex = String(TOTAL + 10) } else { p.style.transform = 'scaleX(0.3)'; p.style.opacity = '0'; p.style.filter = 'blur(8px)'; p.style.clipPath = 'inset(0 0 0 100%)'; p.style.zIndex = String(TOTAL - i) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.3,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.clipPath = 'inset(0 100% 0 0)'; panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.clipPath = 'inset(0 0 0 100%)'; panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) { const stretchP = Math.min(1, frac * 1.8); const el = stretchP < .7 ? 1 + Math.sin(stretchP * Math.PI / .7) * .15 * (1 - stretchP / .7) : 1 - (stretchP - .7) * .3; const scaleX = Math.max(.05, el * (1 - stretchP * .9)); panel.style.transform = `scaleX(${scaleX}) scaleY(${1 + stretchP * .08})`; panel.style.clipPath = `inset(0 0 0 ${stretchP * 100}%)`; panel.style.opacity = String(1 - stretchP * .5); panel.style.filter = `blur(${stretchP*6}px) brightness(${1 + stretchP * .5})`; panel.style.zIndex = String(TOTAL + 10) }
        else if (i === idx + 1) { const revealP = Math.max(0, frac - .3) / .7; const ei = 1 - Math.pow(1 - revealP, 3); const os = revealP > .7 ? 1 + Math.sin((revealP - .7) * Math.PI / .3) * .08 * (1 - revealP) : 1; const scaleX = .2 + ei * .8 * os; panel.style.transform = `scaleX(${Math.min(1.1, scaleX)})`; panel.style.clipPath = `inset(0 ${(1-revealP)*100}% 0 0)`; panel.style.opacity = String(revealP); panel.style.filter = `blur(${(1-revealP)*12}px) brightness(${.2 + revealP * .8})`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="eexArea" class="eex-page">
    <div id="eexProgress" class="eex-progress-bar"></div><nav id="eexNav" class="eex-nav-dots"></nav>
    <div class="eex-indicator"><span class="eex-cur">1</span> / {{ TOTAL }}</div>
    <div class="eex-glow"></div>
    <section v-for="n in TOTAL" :key="n" class="eex-panel" :class="`eex-panel-${n}`"><div class="eex-content"><span class="eex-num">{{ String(n).padStart(2, '0') }}</span></div></section>
  </div>
</template>

<style scoped>
.eex-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #181028 0%, #0e0a1c 40%, #060410 100%); }
.eex-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, clip-path, opacity, filter; }
.eex-panel:nth-child(odd) { background: linear-gradient(90deg, #1c1238 0%, #2a1a52 50%, #1c1238 100%); }
.eex-panel:nth-child(even) { background: linear-gradient(90deg, #122038 0%, #1a3052 50%, #122038 100%); }
.eex-content { text-align: center; }
.eex-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(255,255,255,.9); text-shadow: 0 0 30px rgba(245,158,11,.4), 0 0 60px rgba(251,191,36,.2); }
.eex-glow { position: fixed; width: 400px; height: 400px; border-radius: 50%; filter: blur(140px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .12; background: radial-gradient(circle, rgba(245,158,11,.3), transparent); }
</style>

<style>
.eex-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.eex-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.08); border: 2px solid rgba(245,158,11,.15); cursor: pointer; transition: all .3s cubic-bezier(0.68,-0.55,0.265,1.55); }
.eex-nav-dot.eex-active { background: #f59e0b; border-color: #f59e0b; box-shadow: 0 0 22px rgba(245,158,11,.5); transform: scale(1.3); }
.eex-progress-bar { position: fixed; top: 0; left: 0; height: 4px; background: linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d); z-index: 1001; transition: width .3s; }
.eex-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.35); z-index: 1002; }
</style>
