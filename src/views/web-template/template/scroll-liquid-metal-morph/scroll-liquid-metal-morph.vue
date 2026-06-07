<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let mainST: ScrollTrigger | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'lmm-dot' + (i === 0 ? ' lmm-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.lmm-dot').forEach((d, i) => d.classList.toggle('lmm-active', i === index)); const el = document.querySelector('.lmm-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('lmmArea') as HTMLElement; progressBar = document.getElementById('lmmProgress'); navDots = document.getElementById('lmmNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.lmm-panel') as HTMLElement[]; const turbulence = document.querySelector('.lmm-turbulence feTurbulence') as SVGFETurbulenceElement; const displacement = document.querySelector('.lmm-displacement feDisplacementMap') as SVGFEDisplacementMapElement
  panels.forEach((p, i) => { if (i === 0) { p.style.filter = ''; p.style.opacity = '1'; p.style.transform = ''; p.style.clipPath = 'none'; p.style.zIndex = String(TOTAL + 10) } else { p.style.filter = 'url(#lmm-liquid-filter)'; p.style.opacity = '0'; p.style.transform = 'scale(0.6)'; p.style.clipPath = 'circle(0% at 50% 50%)'; p.style.zIndex = String(TOTAL - i) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      if (turbulence) { const freq = .001 + Math.sin(frac * Math.PI) * .04; turbulence.setAttribute('baseFrequency', `0.01 ${freq}`) }
      if (displacement) { const scale = Math.sin(frac * Math.PI) * 55; displacement.setAttribute('scale', String(Math.abs(scale))) }
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.opacity = '0'; panel.style.clipPath = 'circle(0% at 50% 50%)'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.opacity = '0'; panel.style.clipPath = 'circle(0% at 50% 50%)'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) {
          if (frac < .4) { const p = frac / .4; panel.style.filter = 'url(#lmm-liquid-filter)'; panel.style.clipPath = 'none'; panel.style.opacity = '1'; panel.style.transform = `rotateY(0deg) scale(${1 - p * .1})`; panel.style.zIndex = String(TOTAL + 10) }
          else if (frac < .55) { const p = (frac - .4) / .15; panel.style.filter = 'url(#lmm-liquid-filter)'; panel.style.clipPath = 'none'; panel.style.opacity = String(1 - p * .3); panel.style.transform = `rotateY(${p*180}deg) scale(${.9 - p * .3})`; panel.style.zIndex = String(TOTAL + 10) }
          else { const p = (frac - .55) / .45; const easeP = p * p; panel.style.filter = `url(#lmm-liquid-filter) blur(${easeP*10}px)`; panel.style.clipPath = `circle(${(1-easeP)*100}% at 50% 50%)`; panel.style.opacity = String(1 - easeP); panel.style.transform = `rotateY(180deg) rotate(${easeP*360}deg) scale(${.6 - easeP * .5})`; panel.style.zIndex = String(TOTAL + 10) }
        } else if (i === idx + 1) { const revealP = Math.max(0, frac - .3) / .7; panel.style.filter = 'url(#lmm-liquid-filter)'; panel.style.clipPath = `circle(${revealP*150}% at 50% 50%)`; panel.style.opacity = String(Math.min(1, revealP * 1.2)); panel.style.transform = `scale(${.8 + revealP * .2})`; panel.style.zIndex = String(TOTAL + 5) }
      })
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0)
}
function destroy() { mainST?.kill(); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="lmmArea" class="lmm-page">
    <svg class="lmm-svg"><filter id="lmm-liquid-filter" class="lmm-displacement"><feTurbulence class="lmm-turbulence" type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="3" seed="7" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" /></filter></svg>
    <div id="lmmProgress" class="lmm-progress-bar"></div><nav id="lmmNav" class="lmm-nav-dots"></nav>
    <div class="lmm-indicator"><span class="lmm-cur">1</span> / {{ TOTAL }}</div>
    <div class="lmm-sheen"></div><div class="lmm-glow"></div>
    <section v-for="n in TOTAL" :key="n" class="lmm-panel" :class="`lmm-panel-${n}`"><div class="lmm-content"><span class="lmm-num">{{ String(n).padStart(2, '0') }}</span></div></section>
  </div>
</template>

<style scoped>
.lmm-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #12121e 0%, #0a0a14 50%, #040408 100%); }
.lmm-svg { position: absolute; width: 0; height: 0; pointer-events: none; }
.lmm-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter, clip-path; perspective: 1200px; }
.lmm-panel:nth-child(odd) { background: linear-gradient(135deg, #1a1a30 0%, #282840 30%, #1a1a30 60%, #121222 100%); }
.lmm-panel:nth-child(even) { background: linear-gradient(135deg, #121222 0%, #2a2a3c 30%, #18182a 60%, #1a1a30 100%); }
.lmm-content { text-align: center; position: relative; z-index: 2; }
.lmm-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 15vw, 11rem); font-weight: 900; background: linear-gradient(135deg, #e8e8f0 0%, #a0a0b8 30%, #d0d0e0 60%, #808098 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 4px 12px rgba(200,200,220,.3)); }
.lmm-sheen { position: fixed; inset: 0; z-index: 3; pointer-events: none; background: linear-gradient(135deg, transparent, rgba(255,255,255,.02) 30%, rgba(255,255,255,.05) 50%, rgba(255,255,255,.02) 70%, transparent); }
.lmm-glow { position: fixed; width: 400px; height: 400px; border-radius: 50%; filter: blur(150px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .1; background: radial-gradient(circle, rgba(200,200,240,.3), transparent); }
</style>

<style>
.lmm-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 1000; }
.lmm-nav-dot { width: 10px; height: 10px; border-radius: 2px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.05); cursor: pointer; transition: all .3s; }
.lmm-nav-dot.lmm-active { background: linear-gradient(135deg, #c0c0d0, #9090a0); box-shadow: 0 0 18px rgba(192,192,208,.4); transform: scale(1.3); }
.lmm-progress-bar { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #808090, #c0c0d0, #e0e0f0); z-index: 1001; transition: width .3s; }
.lmm-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.25); z-index: 1002; }
</style>
