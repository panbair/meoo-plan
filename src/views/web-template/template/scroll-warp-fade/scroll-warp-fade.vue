<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'wf-dot' + (i === 0 ? ' wf-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.wf-dot').forEach((d, i) => d.classList.toggle('wf-active', i === index)); const el = document.querySelector('.wf-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.8, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('wfArea') as HTMLElement; progressBar = document.getElementById('wfProgress'); navDots = document.getElementById('wfNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.wf-panel') as HTMLElement[]; const orbs = document.querySelectorAll('.wf-orb') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { if (i === 0) { p.style.transform = ''; p.style.opacity = '1'; p.style.filter = ''; p.style.zIndex = String(TOTAL + 10) } else { p.style.transform = 'perspective(1000px) rotateY(60deg) rotateX(20deg) scale(0.6)'; p.style.opacity = '0'; p.style.filter = 'blur(20px)'; p.style.zIndex = String(TOTAL - i) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.6,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      orbs.forEach((orb, oi) => { const orbP = (frac + oi * .25) % 1; (orb as HTMLElement).style.transform = `translate(-50%,-50%) scale(${.5 + Math.sin(orbP * Math.PI) * 1}) translateY(${Math.cos(orbP * Math.PI * 2) * 40}px)`; (orb as HTMLElement).style.opacity = String(.05 + Math.abs(Math.sin(orbP * Math.PI)) * .15) })
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.opacity = '0'; panel.style.transform = 'perspective(1000px) rotateY(-80deg) rotateX(30deg) scale(0.4)'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.opacity = '0'; panel.style.transform = 'perspective(1000px) rotateY(80deg) rotateX(-30deg) scale(0.4)'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) { const easeP = frac * frac; panel.style.transform = `perspective(1000px) rotateY(${easeP*-70}deg) rotateX(${easeP*25}deg) scale(${1-easeP*.5})`; panel.style.opacity = String(Math.max(0, 1 - easeP * .8)); panel.style.filter = `blur(${easeP*18}px) brightness(${1 - easeP * .35})`; panel.style.zIndex = String(TOTAL + 10) }
        else if (i === idx + 1) { const revealP = Math.max(0, frac - .2) / .8; const easeP = 1 - Math.pow(1 - revealP, 3); panel.style.transform = `perspective(1000px) rotateY(${(1-easeP)*80}deg) rotateX(${(1-easeP)*-30}deg) scale(${.5 + easeP * .5})`; panel.style.opacity = String(easeP); panel.style.filter = `blur(${(1-easeP)*18}px) brightness(${.6 + easeP * .4})`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="wfArea" class="wf-page">
    <div id="wfProgress" class="wf-progress-bar"></div><nav id="wfNav" class="wf-nav-dots"></nav>
    <div class="wf-indicator"><span class="wf-cur">1</span> / {{ TOTAL }}</div>
    <div class="wf-orbs"><div v-for="i in 3" :key="i" class="wf-orb" :style="{ '--orb-delay': `${i*.3}s`, '--orb-hue': 200+i*60 }"></div></div>
    <section v-for="n in TOTAL" :key="n" class="wf-panel" :class="`wf-panel-${n}`"><div class="wf-content"><span class="wf-num">{{ String(n).padStart(2, '0') }}</span><div class="wf-plane"></div></div></section>
  </div>
</template>

<style scoped>
.wf-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 35%, #101830 0%, #080e20 40%, #040810 100%); perspective: 1200px; }
.wf-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.wf-panel:nth-child(odd) { background: linear-gradient(135deg, #0f1228 0%, #161a38 40%, #0f1228 100%); }
.wf-panel:nth-child(even) { background: linear-gradient(135deg, #0a0e20 0%, #1a2030 40%, #0a0e20 100%); }
.wf-content { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px; transform-style: preserve-3d; }
.wf-num { font-family: 'Helvetica Neue', sans-serif; font-size: clamp(4rem, 14vw, 11rem); font-weight: 200; color: rgba(255,255,255,.85); text-shadow: 0 0 40px rgba(120,140,220,.35); letter-spacing: .05em; }
.wf-plane { width: 200px; height: 2px; background: linear-gradient(90deg, transparent, rgba(120,140,220,.4), transparent); }
.wf-orbs { position: fixed; top: 50%; left: 50%; z-index: 5; pointer-events: none; }
.wf-orb { position: absolute; width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, hsla(var(--orb-hue),60%,50%,.1), transparent); transform: translate(-50%,-50%); filter: blur(40px); will-change: transform, opacity; }
</style>

<style>
.wf-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 18px; z-index: 1000; }
.wf-nav-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,.08); border: none; cursor: pointer; transition: all .5s; }
.wf-nav-dot.wf-active { background: #8899cc; box-shadow: 0 0 28px rgba(120,140,220,.5); transform: scale(2.8); }
.wf-progress-bar { position: fixed; top: 0; left: 0; height: 1px; background: linear-gradient(90deg, #6678aa, #8899cc, #aabbee); z-index: 1001; transition: width .3s; }
.wf-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Helvetica Neue', sans-serif; font-size: 14px; color: rgba(255,255,255,.2); z-index: 1002; font-weight: 300; }
</style>
