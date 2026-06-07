<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'ppn-dot' + (i === 0 ? ' ppn-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.ppn-dot').forEach((d, i) => d.classList.toggle('ppn-active', i === index)); const el = document.querySelector('.ppn-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('ppnArea') as HTMLElement; progressBar = document.getElementById('ppnProgress'); navDots = document.getElementById('ppnNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const track = document.getElementById('ppnTrack') as HTMLElement; const panels = gsap.utils.toArray('.ppn-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress; const focus = progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      const translateX = -progress * 100 * (TOTAL - 1) / TOTAL; const tiltX = Math.sin(progress * Math.PI) * 20
      if (track) track.style.transform = `translateX(${translateX}vw) rotateX(${tiltX}deg)`
      panels.forEach((panel, i) => { const dist = Math.abs(i - focus); if (dist < .15) { panel.style.opacity = '1'; panel.style.filter = 'brightness(1) blur(0px)' } else if (dist < 1.5) { panel.style.opacity = String(1 - dist * .7); panel.style.filter = `brightness(${1 - dist * .6}) blur(${dist*4}px)` } else { panel.style.opacity = '0'; panel.style.filter = 'brightness(0.2) blur(8px)' } })
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0)
}
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="ppnArea" class="ppn-page">
    <div id="ppnProgress" class="ppn-progress-bar"></div><nav id="ppnNav" class="ppn-nav-dots"></nav>
    <div class="ppn-indicator"><span class="ppn-cur">1</span> / {{ TOTAL }}</div>
    <div class="ppn-viewport"><div id="ppnTrack" class="ppn-track">
      <section v-for="n in TOTAL" :key="n" class="ppn-panel" :class="`ppn-panel-${n}`"><div class="ppn-content"><span class="ppn-num">{{ String(n).padStart(2, '0') }}</span><div class="ppn-bar"></div></div></section>
    </div></div>
    <div class="ppn-gradient-l"></div><div class="ppn-gradient-r"></div>
  </div>
</template>

<style scoped>
.ppn-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #0e1428 0%, #080c1a 40%, #040610 100%); perspective: 2000px; }
.ppn-viewport { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; perspective: 2000px; perspective-origin: 50% 50%; }
.ppn-track { display: flex; height: 100vh; transform-style: preserve-3d; will-change: transform; }
.ppn-panel { min-width: 85vw; height: 100vh; flex-shrink: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter; }
.ppn-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 50%, #122048 0%, #0a142e 50%, #040a18 100%); }
.ppn-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 50%, #162048 0%, #0a142e 50%, #040a18 100%); }
.ppn-content { text-align: center; }
.ppn-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 14vw, 10rem); font-weight: 900; color: rgba(255,255,255,.85); text-shadow: 0 0 30px rgba(59,130,246,.5), 0 0 60px rgba(37,99,235,.3); display: block; }
.ppn-bar { width: 100px; height: 2px; background: linear-gradient(90deg, transparent, rgba(59,130,246,.4), transparent); margin: 16px auto 0; }
.ppn-gradient-l { position: fixed; left: 0; top: 0; width: 20vw; height: 100vh; z-index: 5; pointer-events: none; background: linear-gradient(90deg, rgba(4,6,16,.8), transparent); }
.ppn-gradient-r { position: fixed; right: 0; top: 0; width: 20vw; height: 100vh; z-index: 5; pointer-events: none; background: linear-gradient(270deg, rgba(4,6,16,.8), transparent); }
</style>

<style>
.ppn-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.ppn-nav-dot { width: 6px; height: 28px; border-radius: 3px; background: rgba(255,255,255,.06); border: none; cursor: pointer; transition: all .3s; }
.ppn-nav-dot.ppn-active { background: #3b82f6; box-shadow: 0 0 18px rgba(59,130,246,.5); height: 38px; }
.ppn-progress-bar { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #1d4ed8, #3b82f6, #60a5fa); z-index: 1001; transition: width .3s; }
.ppn-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.35); z-index: 1002; }
</style>
