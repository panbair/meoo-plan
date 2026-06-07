<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let mainST: ScrollTrigger | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'sbi-dot' + (i === 0 ? ' sbi-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.sbi-dot').forEach((d, i) => d.classList.toggle('sbi-active', i === index)); const el = document.querySelector('.sbi-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('sbiArea') as HTMLElement; progressBar = document.getElementById('sbiProgress'); navDots = document.getElementById('sbiNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.sbi-panel') as HTMLElement[]; const coreGlow = document.querySelector('.sbi-core') as HTMLElement; const rings = document.querySelectorAll('.sbi-ring') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { if (i === 0) { p.style.opacity = '1'; p.style.transform = ''; p.style.filter = ''; p.style.zIndex = String(TOTAL + 10) } else { p.style.opacity = '0'; p.style.transform = 'scale(0.1) rotate(720deg)'; p.style.filter = 'blur(10px)'; p.style.zIndex = String(TOTAL - i) } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      rings.forEach((ring, ri) => { const ringP = Math.sin(frac * Math.PI + ri * .5); (ring as HTMLElement).style.transform = `translate(-50%,-50%) scale(${.6 + Math.abs(ringP) * 1.2})`; (ring as HTMLElement).style.opacity = String(.1 + Math.abs(ringP) * .4) })
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) {
          if (frac < .6) { const p = frac / .6; const easeP = p * p; const scale = 1 - easeP; const rotate = easeP * 720; const tx = Math.cos(easeP * Math.PI * 3) * easeP * 80; const ty = Math.sin(easeP * Math.PI * 3) * easeP * 80; panel.style.transform = `translate(${tx}px,${ty}px) rotate(${rotate}deg) scale(${Math.max(.05,scale)})`; panel.style.opacity = String(1 - easeP * .5); panel.style.filter = `blur(${easeP*8}px) brightness(${1+easeP*2})`; panel.style.zIndex = String(TOTAL + 10); if (coreGlow) coreGlow.style.opacity = String(easeP * .9) }
          else { const p = (frac - .6) / .4; panel.style.transform = `scale(${.05 + p * .01})`; panel.style.opacity = String(Math.max(0, 1 - p * 2)); panel.style.filter = `blur(${8+p*12}px) brightness(${2+p*4})`; panel.style.zIndex = String(TOTAL + 10); if (coreGlow) coreGlow.style.opacity = String(.9 * (1 - p)) }
        } else if (i === idx + 1) { const revealP = Math.max(0, frac - .35) / .65; const easeP = 1 - Math.pow(1 - revealP, 4); const scale = .05 + easeP * 2; const overshoot = revealP < .7 ? 1 + Math.sin(revealP * Math.PI / .7) * .3 : 1; panel.style.transform = `scale(${Math.min(scale * overshoot, 1.3)})`; panel.style.opacity = String(Math.min(1, revealP * 1.5)); panel.style.filter = `blur(${(1-revealP)*20}px) brightness(${.3 + revealP * .7})`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="sbiArea" class="sbi-page">
    <div id="sbiProgress" class="sbi-progress-bar"></div><nav id="sbiNav" class="sbi-nav-dots"></nav>
    <div class="sbi-indicator"><span class="sbi-cur">1</span> / {{ TOTAL }}</div>
    <div class="sbi-core"></div>
    <div class="sbi-spiral-rings"><div v-for="r in 5" :key="r" class="sbi-ring" :style="{ width: `${r*80}px`, height: `${r*80}px` }"></div></div>
    <div class="sbi-glow"></div>
    <section v-for="n in TOTAL" :key="n" class="sbi-panel" :class="`sbi-panel-${n}`"><div class="sbi-content"><span class="sbi-num">{{ String(n).padStart(2, '0') }}</span></div></section>
  </div>
</template>

<style scoped>
.sbi-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #180a20 0%, #0c0515 40%, #04020a 100%); }
.sbi-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.sbi-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 50%, #1e0a28 0%, #14051e 50%, #0a0310 100%); }
.sbi-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 50%, #0a1a28 0%, #05101e 50%, #020810 100%); }
.sbi-content { text-align: center; position: relative; z-index: 2; }
.sbi-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(255,255,255,.88); text-shadow: 0 0 40px rgba(200,100,255,.5), 0 0 80px rgba(150,50,220,.3), 0 0 120px rgba(100,20,200,.2); }
.sbi-core { position: fixed; top: 50%; left: 50%; width: 24px; height: 24px; border-radius: 50%; background: #fff; z-index: 70; pointer-events: none; opacity: 0; transform: translate(-50%,-50%); box-shadow: 0 0 40px rgba(200,100,255,.8), 0 0 80px rgba(150,50,220,.5), 0 0 120px rgba(100,20,200,.3); }
.sbi-spiral-rings { position: fixed; top: 50%; left: 50%; pointer-events: none; z-index: 48; }
.sbi-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(180,100,240,.12); transform: translate(-50%,-50%); will-change: transform, opacity; }
.sbi-glow { position: fixed; width: 450px; height: 450px; border-radius: 50%; filter: blur(140px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .15; background: radial-gradient(circle, rgba(180,100,240,.35), transparent); }
</style>

<style>
.sbi-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 1000; }
.sbi-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(180,100,240,.2); cursor: pointer; transition: all .3s; }
.sbi-nav-dot.sbi-active { background: #c084fc; box-shadow: 0 0 22px rgba(192,132,252,.6); transform: scale(1.4); }
.sbi-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #7c3aed, #a855f7, #c084fc); z-index: 1001; transition: width .3s; }
.sbi-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.35); z-index: 1002; }
</style>
