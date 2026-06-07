<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const NEBULA_PARTICLES = 60; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let particleEls: HTMLElement[] = []
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'nb-dot' + (i === 0 ? ' nb-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.nb-dot').forEach((d, i) => d.classList.toggle('nb-active', i === index)); const el = document.querySelector('.nb-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }
function buildParticles() { const container = document.querySelector('.nb-particles') as HTMLElement; if (!container) return; container.innerHTML = ''; particleEls = []; for (let i = 0; i < NEBULA_PARTICLES; i++) { const p = document.createElement('div'); p.className = 'nb-dot-particle'; const angle = (i / NEBULA_PARTICLES) * Math.PI * 2; const radius = 20 + Math.random() * 60; p.style.cssText = `--bx:${Math.cos(angle)*radius}%;--by:${Math.sin(angle)*radius}%;--sz:${1+Math.random()*3}px;--h:${(i/NEBULA_PARTICLES)*360}`; container.appendChild(p); particleEls.push(p) } }

function init() {
  scrollArea = document.getElementById('nbArea') as HTMLElement; progressBar = document.getElementById('nbProgress'); navDots = document.getElementById('nbNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.nb-panel') as HTMLElement[]; buildParticles()
  panels.forEach((p, i) => { if (i === 0) { p.style.opacity = '1'; p.style.transform = ''; p.style.filter = ''; p.style.zIndex = String(TOTAL + 10) } else { p.style.opacity = '0'; p.style.transform = 'scale(0.3)'; p.style.filter = 'blur(15px) hue-rotate(180deg)'; p.style.zIndex = String(TOTAL - i) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      particleEls.forEach((p, pi) => { const spread = Math.sin(frac * Math.PI) * 200; const hueShift = frac * 360; const bx = parseFloat(p.style.getPropertyValue('--bx')); const by = parseFloat(p.style.getPropertyValue('--by')); p.style.transform = `translate(${bx*spread/60}px,${by*spread/60}px) scale(${.3+Math.abs(Math.sin(frac*Math.PI))*2})`; p.style.opacity = String(Math.abs(Math.sin(frac * Math.PI)) * .5 + .1); p.style.background = `hsla(${(pi/NEBULA_PARTICLES*360+hueShift)%360},80%,${50+Math.sin(frac*Math.PI)*30}%,${.2+Math.abs(Math.sin(frac*Math.PI))*.5})` })
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) { if (frac < .3) { const p = frac / .3; panel.style.transform = `scale(${1 + p * .4})`; panel.style.opacity = '1'; panel.style.filter = `hue-rotate(${p*120}deg)`; panel.style.zIndex = String(TOTAL + 10) } else if (frac < .55) { const p = (frac - .3) / .25; panel.style.transform = `scale(${1.4 - p * .3})`; panel.style.opacity = String(1 - p * .3); panel.style.filter = `hue-rotate(${120 + p * 240}deg) blur(${p*8}px) brightness(${1 + p * .5})`; panel.style.zIndex = String(TOTAL + 10) } else { const p = (frac - .55) / .45; panel.style.transform = `scale(${1.1 - p * 1.1})`; panel.style.opacity = String(1 - p); panel.style.filter = `hue-rotate(360deg) blur(${8 + p * 10}px) brightness(${1.5 - p * 1.5})`; panel.style.zIndex = String(TOTAL + 10) } }
        else if (i === idx + 1) { const revealP = Math.max(0, frac - .4) / .6; panel.style.transform = `scale(${.1 + revealP * .9})`; panel.style.opacity = String(revealP); panel.style.filter = `hue-rotate(${(1-revealP)*360}deg) blur(${(1-revealP)*18}px) brightness(${.1 + revealP * .9})`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="nbArea" class="nb-page">
    <div id="nbProgress" class="nb-progress-bar"></div><nav id="nbNav" class="nb-nav-dots"></nav>
    <div class="nb-indicator"><span class="nb-cur">1</span> / {{ TOTAL }}</div>
    <div class="nb-particles"></div>
    <div class="nb-core-glow"></div>
    <div class="nb-starfield"><div v-for="i in 50" :key="i" class="nb-star" :style="{ left: `${(i*41+17)%100}%`, top: `${(i*29+11)%100}%`, animationDelay: `${i*.15}s`, width: `${1+(i%3)}px`, height: `${1+(i%3)}px` }"></div></div>
    <section v-for="n in TOTAL" :key="n" class="nb-panel" :class="`nb-panel-${n}`"><div class="nb-content"><span class="nb-num">{{ String(n).padStart(2, '0') }}</span></div></section>
  </div>
</template>

<style scoped>
.nb-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #0a0a20 0%, #04041a 40%, #01010e 100%); }
.nb-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.nb-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 35%, #0c0c28 0%, #060620 40%, #020212 100%); }
.nb-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 65%, #0a0828 0%, #040418 40%, #010110 100%); }
.nb-content { text-align: center; position: relative; z-index: 2; }
.nb-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; background: linear-gradient(135deg, hsl(280,80%,70%) 0%, hsl(200,80%,60%) 25%, hsl(160,80%,55%) 50%, hsl(40,80%,60%) 75%, hsl(320,80%,65%) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 0 40px rgba(150,100,255,.4)) drop-shadow(0 0 80px rgba(100,200,255,.2)); }
.nb-particles { position: fixed; top: 50%; left: 50%; z-index: 50; pointer-events: none; }
.nb-dot-particle { position: absolute; border-radius: 50%; width: var(--sz); height: var(--sz); transform: translate(-50%,-50%); will-change: transform, opacity, background; }
.nb-core-glow { position: fixed; top: 50%; left: 50%; width: 250px; height: 250px; border-radius: 50%; z-index: 49; pointer-events: none; transform: translate(-50%,-50%); background: radial-gradient(circle, rgba(150,100,255,.12) 0%, rgba(100,200,255,.04) 40%, transparent 70%); }
.nb-starfield { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
.nb-star { position: absolute; border-radius: 50%; background: rgba(255,255,255,.15); animation: nbTwinkle 4s ease-in-out infinite; }
@keyframes nbTwinkle { 0%,100%{opacity:.05;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }
</style>

<style>
.nb-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 16px; z-index: 1000; }
.nb-nav-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.06); border: none; cursor: pointer; transition: all .4s; }
.nb-nav-dot.nb-active { background: #a78bfa; box-shadow: 0 0 22px rgba(167,139,250,.6), 0 0 44px rgba(100,200,255,.3), 0 0 66px rgba(150,100,255,.2); transform: scale(2.2); }
.nb-progress-bar { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #8b5cf6, #6366f1, #3b82f6, #06b6d4, #8b5cf6); background-size: 200% 100%; animation: nbBar 3s linear infinite; z-index: 1001; transition: width .3s; }
@keyframes nbBar { 0%{background-position:0 50%} 100%{background-position:200% 50%} }
.nb-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.25); z-index: 1002; }
</style>
