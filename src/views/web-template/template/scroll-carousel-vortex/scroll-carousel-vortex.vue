<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const RING_RADIUS = 380; const angleStep = 360 / TOTAL; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'crv-dot' + (i === 0 ? ' crv-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.crv-dot').forEach((d, i) => d.classList.toggle('crv-active', i === index)); const el = document.querySelector('.crv-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('crvArea') as HTMLElement; progressBar = document.getElementById('crvProgress'); navDots = document.getElementById('crvNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.crv-panel') as HTMLElement[]; const ring = document.querySelector('.crv-ring') as HTMLElement; const vortexCore = document.querySelector('.crv-vortex-core') as HTMLElement
  const orbs = document.querySelectorAll('.crv-orb') as NodeListOf<HTMLElement>

  panels.forEach((p, i) => { const angle = angleStep * i; const rad = (angle * Math.PI) / 180; p.style.transform = `translate3d(${Math.sin(rad)*RING_RADIUS}px,0,${Math.cos(rad)*RING_RADIUS}px) rotateY(${-angle}deg)`; p.style.opacity = i === 0 ? '1' : '.25'; p.style.filter = i === 0 ? 'none' : 'brightness(.35) blur(2px)'; p.style.zIndex = i === 0 ? String(TOTAL + 10) : String(TOTAL - i) })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx; const ringAngle = -focus * angleStep
      if (ring) ring.style.transform = `translate(-50%,-50%) rotateY(${ringAngle}deg)`
      orbs.forEach((o, oi) => { const oa = ringAngle * .3 + oi * 45; (o as HTMLElement).style.transform = `translate(-50%,-50%) rotate(${oa}deg) scale(${1+Math.sin(frac*Math.PI+oi)*.3})`; (o as HTMLElement).style.opacity = String(.08 + Math.sin(frac * Math.PI * 2 + oi) * .08) })

      panels.forEach((panel, i) => {
        const angle = angleStep * i + ringAngle; const rad = (angle * Math.PI) / 180; const x = Math.sin(rad) * RING_RADIUS; const z = Math.cos(rad) * RING_RADIUS
        const frontness = (z + RING_RADIUS) / (2 * RING_RADIUS); const brightness = .15 + frontness * .85; const panelOpacity = .1 + frontness * .9; const blur = (1 - frontness) * 8
        if (i === idx && frac > .7) { const vp = (frac - .7) / .3; const vs = 1 - vp; panel.style.transform = `translate3d(${x*vs}px,0,${z*vs}px) rotateY(${-angle}deg) scale(${Math.max(.05,vs)})`; panel.style.opacity = String(Math.max(0, 1 - vp)); panel.style.filter = `brightness(${1+vp*3}) blur(${vp*12}px)`; panel.style.zIndex = String(TOTAL + 20) }
        else if (i === (idx + 1) % TOTAL && frac > .5) { const ep = (frac - .5) / .5; const scale = .05 + Math.min(1, ep * 1.5); panel.style.transform = `translate3d(${x}px,0,${z}px) rotateY(${-angle}deg) scale(${Math.min(1.1,scale)})`; panel.style.opacity = String(Math.min(1, ep * 1.3)); panel.style.filter = `brightness(${.1 + ep * .9}) blur(${(1-ep)*15}px)`; panel.style.zIndex = String(TOTAL + 15) }
        else { panel.style.transform = `translate3d(${x}px,0,${z}px) rotateY(${-angle}deg) scale(1)`; panel.style.opacity = String(panelOpacity); panel.style.filter = `brightness(${brightness}) blur(${blur}px)`; panel.style.zIndex = String(Math.round(frontness * 10)) }
      })
      if (vortexCore) { const va = frac > .7 ? (frac - .7) / .3 : 0; vortexCore.style.opacity = String(va * .9); vortexCore.style.transform = `translate(-50%,-50%) scale(${.3 + va * 1.5})` }
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0)
}
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="crvArea" class="crv-page">
    <div id="crvProgress" class="crv-progress-bar"></div><nav id="crvNav" class="crv-nav-dots"></nav>
    <div class="crv-indicator"><span class="crv-cur">1</span> / {{ TOTAL }}</div>
    <div class="crv-orbs"><div v-for="i in 8" :key="i" class="crv-orb" :style="{ '--oh': i*45 }"></div></div>
    <div class="crv-stage"><div class="crv-ring"><section v-for="n in TOTAL" :key="n" class="crv-panel" :class="`crv-panel-${n}`"><div class="crv-content"><span class="crv-num">{{ String(n).padStart(2, '0') }}</span></div></section></div></div>
    <div class="crv-vortex-core"></div>
    <div class="crv-ambient"></div>
  </div>
</template>

<style scoped>
.crv-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #141030 0%, #0a081e 40%, #040410 100%); perspective: 1600px; }
.crv-stage { position: fixed; top: 50%; left: 50%; transform-style: preserve-3d; z-index: 10; }
.crv-ring { position: absolute; transform-style: preserve-3d; width: 0; height: 0; will-change: transform; }
.crv-panel { position: absolute; width: 260px; height: 360px; left: -130px; top: -180px; border-radius: 20px; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; backface-visibility: hidden; }
.crv-panel:nth-child(odd) { background: linear-gradient(135deg, rgba(139,92,246,.8), rgba(30,20,60,.9)); border: 1px solid rgba(139,92,246,.25); box-shadow: 0 20px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06); }
.crv-panel:nth-child(even) { background: linear-gradient(135deg, rgba(59,130,246,.8), rgba(20,30,60,.9)); border: 1px solid rgba(59,130,246,.25); box-shadow: 0 20px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06); }
.crv-content { text-align: center; }
.crv-num { font-family: 'Orbitron', monospace; font-size: 4.5rem; font-weight: 900; color: rgba(255,255,255,.85); text-shadow: 0 0 30px rgba(139,92,246,.5); }
.crv-orbs { position: fixed; top: 50%; left: 50%; z-index: 8; pointer-events: none; }
.crv-orb { position: absolute; width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(circle, hsla(var(--oh),70%,60%,.1), transparent); transform: translate(-50%,-50%); will-change: transform, opacity; }
.crv-vortex-core { position: fixed; top: 50%; left: 50%; width: 30px; height: 30px; transform: translate(-50%,-50%); border-radius: 50%; background: radial-gradient(circle, #fff 0%, rgba(139,92,246,.7) 40%, transparent 70%); z-index: 100; pointer-events: none; opacity: 0; box-shadow: 0 0 60px rgba(139,92,246,.6), 0 0 120px rgba(59,130,246,.3); }
.crv-ambient { position: fixed; width: 500px; height: 500px; border-radius: 50%; filter: blur(160px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 1; pointer-events: none; opacity: .1; background: radial-gradient(circle, rgba(139,92,246,.3), transparent); }
</style>

<style>
.crv-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.crv-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(139,92,246,.2); cursor: pointer; transition: all .3s; }
.crv-nav-dot.crv-active { background: #8b5cf6; box-shadow: 0 0 22px rgba(139,92,246,.5); transform: scale(1.4); }
.crv-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #8b5cf6, #6366f1, #3b82f6); z-index: 1001; transition: width .3s; }
.crv-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.35); z-index: 1002; }
</style>
