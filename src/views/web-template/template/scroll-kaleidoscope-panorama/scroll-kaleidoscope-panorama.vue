<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const MIRRORS = 6; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'kpn-dot' + (i === 0 ? ' kpn-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.kpn-dot').forEach((d, i) => d.classList.toggle('kpn-active', i === index)); const el = document.querySelector('.kpn-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('kpnArea') as HTMLElement; progressBar = document.getElementById('kpnProgress'); navDots = document.getElementById('kpnNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.kpn-panel') as HTMLElement[]; const scopeRing = document.querySelector('.kpn-scope') as HTMLElement; const wedgeGlows = document.querySelectorAll('.kpn-wg') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { p.style.opacity = i === 0 ? '1' : '0'; p.style.zIndex = i === 0 ? String(TOTAL + 10) : String(TOTAL - i); p.style.transform = i === 0 ? '' : 'scale(0.3)' })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx; const kaleidoAngle = frac * 60
      if (scopeRing) scopeRing.style.transform = `translate(-50%,-50%) rotate(${kaleidoAngle}deg)`
      wedgeGlows.forEach((wg, wi) => { const wp = (frac * MIRRORS - wi + MIRRORS) % MIRRORS / MIRRORS; (wg as HTMLElement).style.opacity = String(.04 + wp * .1); (wg as HTMLElement).style.transform = `rotate(${wi*60}deg) scale(${1+Math.sin(wp*Math.PI)*.3})` })
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) { const driftX = -frac * 120; panel.style.transform = `translateX(${driftX}%) scale(${1 - frac * .3})`; panel.style.opacity = String(1 - frac * .6); panel.style.filter = `blur(${frac*8}px) brightness(${1 - frac * .3}) hue-rotate(${frac*60}deg)`; panel.style.zIndex = String(TOTAL + 10) }
        else if (i === idx + 1) { const revealP = Math.max(0, frac - .2) / .8; panel.style.transform = `translateX(${60 - revealP * 60}%) scale(${.7 + revealP * .3})`; panel.style.opacity = String(revealP); panel.style.filter = `blur(${(1-revealP)*10}px) brightness(${.5 + revealP * .5})`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="kpnArea" class="kpn-page">
    <div id="kpnProgress" class="kpn-progress-bar"></div><nav id="kpnNav" class="kpn-nav-dots"></nav>
    <div class="kpn-indicator"><span class="kpn-cur">1</span> / {{ TOTAL }}</div>
    <div class="kpn-scope">
      <div v-for="m in MIRRORS" :key="m" class="kpn-wg" :style="{ transform: `rotate(${m*60}deg)` }"></div>
    </div>
    <div class="kpn-ambient"></div>
    <section v-for="n in TOTAL" :key="n" class="kpn-panel" :class="`kpn-panel-${n}`"><div class="kpn-content"><span class="kpn-num">{{ String(n).padStart(2, '0') }}</span></div></section>
  </div>
</template>

<style scoped>
.kpn-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #100c20 0%, #080618 40%, #040310 100%); }
.kpn-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.kpn-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 50%, #1a1535 0%, #0e0a22 50%, #060510 100%); }
.kpn-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 50%, #151a35 0%, #0a0e22 50%, #050610 100%); }
.kpn-content { text-align: center; }
.kpn-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 15vw, 11rem); font-weight: 900; color: rgba(255,255,255,.85); text-shadow: 0 0 40px rgba(139,92,246,.5), 0 0 80px rgba(236,72,153,.25); }
.kpn-scope { position: fixed; top: 50%; left: 50%; width: 500px; height: 500px; transform: translate(-50%,-50%); z-index: 45; pointer-events: none; border-radius: 50%; box-shadow: inset 0 0 80px rgba(0,0,0,.4), 0 0 0 9999px rgba(0,0,0,.25); overflow: hidden; }
.kpn-wg { position: absolute; top: 50%; left: 50%; width: 700px; height: 700px; transform-origin: 0 0; background: conic-gradient(from 0deg, transparent 0deg, rgba(139,92,246,.04) 30deg, transparent 60deg); will-change: transform, opacity; }
.kpn-ambient { position: fixed; width: 500px; height: 500px; border-radius: 50%; filter: blur(140px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .1; background: radial-gradient(circle, rgba(139,92,246,.3), transparent); }
</style>

<style>
.kpn-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.kpn-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(139,92,246,.2); cursor: pointer; transition: all .3s; }
.kpn-nav-dot.kpn-active { background: linear-gradient(135deg, #8b5cf6, #ec4899); border-color: transparent; box-shadow: 0 0 22px rgba(139,92,246,.5); transform: scale(1.4); }
.kpn-progress-bar { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #8b5cf6, #a855f7, #ec4899); z-index: 1001; transition: width .3s; }
.kpn-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.35); z-index: 1002; }
</style>
