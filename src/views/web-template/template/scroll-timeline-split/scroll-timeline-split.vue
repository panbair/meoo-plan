<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'tls-dot' + (i === 0 ? ' tls-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.tls-dot').forEach((d, i) => d.classList.toggle('tls-active', i === index)); const el = document.querySelector('.tls-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('tlsArea') as HTMLElement; progressBar = document.getElementById('tlsProgress'); navDots = document.getElementById('tlsNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.tls-panel') as HTMLElement[]; const timelineLine = document.querySelector('.tls-line-progress') as HTMLElement; const timelineNodes = document.querySelectorAll('.tls-node') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { if (i === 0) { p.style.opacity = '1'; p.style.clipPath = 'inset(0 0 0 0)'; p.style.transform = ''; p.style.zIndex = String(TOTAL + 10) } else { p.style.opacity = '0'; p.style.clipPath = 'inset(0 0 0 100%)'; p.style.transform = 'translateX(40px)'; p.style.zIndex = String(TOTAL - i) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx; const lineProgress = (focus / (TOTAL - 1)) * 100
      if (timelineLine) timelineLine.style.height = `${lineProgress}%`
      timelineNodes.forEach((node, ni) => { const isPast = ni < idx; const isCurrent = ni === idx; (node as HTMLElement).style.background = isCurrent ? '#fff' : isPast ? '#667eea' : 'rgba(255,255,255,.15)'; (node as HTMLElement).style.boxShadow = isCurrent ? '0 0 24px rgba(102,126,234,.8),0 0 48px rgba(118,75,162,.4)' : isPast ? '0 0 8px rgba(102,126,234,.3)' : 'none'; (node as HTMLElement).style.transform = isCurrent ? 'scale(1.6)' : 'scale(1)' })
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.clipPath = 'inset(0 0 0 100%)'; panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.clipPath = 'inset(0 0 0 100%)'; panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) { panel.style.clipPath = `inset(0 ${frac*40}% 0 0)`; panel.style.opacity = String(1 - frac * .4); panel.style.transform = `translateX(${frac*30}px)`; panel.style.zIndex = String(TOTAL + 10) }
        else if (i === idx + 1) { const rp = Math.max(0, frac - .3) / .7; panel.style.clipPath = `inset(0 0 0 ${(1-rp)*60}%)`; panel.style.opacity = String(rp); panel.style.transform = `translateX(${(1-rp)*40}px)`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="tlsArea" class="tls-page">
    <div id="tlsProgress" class="tls-progress-bar"></div><nav id="tlsNav" class="tls-nav-dots"></nav>
    <div class="tls-indicator"><span class="tls-cur">1</span> / {{ TOTAL }}</div>
    <div class="tls-timeline"><div class="tls-line-bg"></div><div class="tls-line-progress"></div>
      <div v-for="n in TOTAL" :key="n" class="tls-node-wrapper" :style="{ top: `${(n-1)/(TOTAL-1)*100}%` }"><div class="tls-node"></div><span class="tls-year">{{ 2018 + n }}</span></div>
    </div>
    <div class="tls-glow"></div>
    <div class="tls-panels-container">
      <section v-for="n in TOTAL" :key="n" class="tls-panel" :class="`tls-panel-${n}`"><div class="tls-content"><span class="tls-num">{{ String(n).padStart(2, '0') }}</span><span class="tls-stage">Phase {{ n }}</span></div></section>
    </div>
  </div>
</template>

<style scoped>
.tls-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 30% 50%, #121830 0%, #080c1a 50%, #040610 100%); }
.tls-panels-container { position: absolute; left: 28vw; right: 0; top: 0; bottom: 0; }
.tls-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, transform; }
.tls-panel:nth-child(odd) { background: radial-gradient(ellipse at 60% 50%, #1a1538 0%, #0e0a22 50%, #060510 100%); }
.tls-panel:nth-child(even) { background: radial-gradient(ellipse at 40% 50%, #151a38 0%, #0a0e22 50%, #050610 100%); }
.tls-content { text-align: center; display: flex; flex-direction: column; gap: 8px; }
.tls-num { font-family: 'Orbitron', monospace; font-size: clamp(4rem, 12vw, 8rem); font-weight: 900; color: rgba(255,255,255,.88); text-shadow: 0 0 30px rgba(102,126,234,.5), 0 0 60px rgba(118,75,162,.3); }
.tls-stage { font-size: .85rem; color: rgba(255,255,255,.25); letter-spacing: .3em; }
.tls-timeline { position: fixed; left: 7vw; top: 50%; transform: translateY(-50%); width: 10vw; height: 65vh; z-index: 90; }
.tls-line-bg { position: absolute; left: 50%; top: 0; width: 2px; height: 100%; background: rgba(255,255,255,.04); transform: translateX(-50%); border-radius: 1px; }
.tls-line-progress { position: absolute; left: 50%; top: 0; width: 3px; height: 0%; background: linear-gradient(to bottom, #667eea, #764ba2, #ec4899); transform: translateX(-50%); border-radius: 2px; box-shadow: 0 0 16px rgba(102,126,234,.4); }
.tls-node-wrapper { position: absolute; left: 0; right: 0; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; }
.tls-node { width: 14px; height: 14px; border-radius: 50%; background: rgba(255,255,255,.15); margin: 0 auto; transition: all .3s; }
.tls-year { font-family: 'Orbitron', monospace; font-size: .65rem; color: rgba(255,255,255,.15); position: absolute; left: 24px; white-space: nowrap; }
.tls-glow { position: fixed; width: 350px; height: 350px; border-radius: 50%; filter: blur(130px); top: 50%; left: 20%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .08; background: radial-gradient(circle, rgba(102,126,234,.3), transparent); }
</style>

<style>
.tls-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.tls-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(102,126,234,.2); cursor: pointer; transition: all .3s; }
.tls-nav-dot.tls-active { background: #667eea; box-shadow: 0 0 20px rgba(102,126,234,.5); transform: scale(1.4); }
.tls-progress-bar { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #667eea, #764ba2, #ec4899); z-index: 1001; transition: width .3s; }
.tls-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.35); z-index: 1002; }
</style>
