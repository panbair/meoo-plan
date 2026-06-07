<script setup lang="ts">
/**
 * ════════════ 火水交锋 · Fire-Water Clash ════════════
 * burn(火焰烧灼) + liquid(水流冲刷) 双半屏对抗
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 7; const SPLIT_Y = 50
let currentIndex = 0; let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'fwc-dot' + (i === 0 ? ' fwc-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) }
}
function updateUI(index: number) {
  document.querySelectorAll('.fwc-dot').forEach((d, i) => d.classList.toggle('fwc-active', i === index))
  const el = document.querySelector('.fwc-cur'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
}
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('fwcArea') as HTMLElement; progressBar = document.getElementById('fwcProgress'); navDots = document.getElementById('fwcNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.fwc-panel') as HTMLElement[]; const fireLine = document.querySelector('.fwc-fire-line') as HTMLElement; const waterLine = document.querySelector('.fwc-water-line') as HTMLElement
  const particles = document.querySelectorAll('.fwc-particle') as NodeListOf<HTMLElement>

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx

      particles.forEach((p, pi) => {
        const pFrac = (pi / particles.length + frac * 0.5) % 1
        ;(p as HTMLElement).style.transform = `translateY(${-pFrac * 40}px) scale(${0.5 + Math.sin(pFrac * Math.PI * 2) * 0.5})`
        ;(p as HTMLElement).style.opacity = String(0.2 + Math.sin(pFrac * Math.PI * 3) * 0.3)
      })

      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.clipPath = 'inset(0 0 100% 0)'; panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.clipPath = 'inset(100% 0 0 0)'; panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) {
          const fireP = Math.min(1, frac * 1.5); const topC = fireP * SPLIT_Y; const waterP = Math.min(1, frac * 1.5); const botC = waterP * (100 - SPLIT_Y)
          panel.style.clipPath = `inset(${topC}% 0 ${botC}% 0)`; panel.style.opacity = String(1 - frac)
          panel.style.filter = `hue-rotate(${frac * 80}deg) brightness(${1 + frac * 1.2}) saturate(${1 + frac * 2})`; panel.style.zIndex = String(TOTAL + 10)
          if (fireLine) { fireLine.style.opacity = String(frac < 0.8 ? frac * 0.8 : (1 - frac) * 3); fireLine.style.top = `${SPLIT_Y - topC}%` }
          if (waterLine) { waterLine.style.opacity = String(frac < 0.8 ? frac * 0.8 : (1 - frac) * 3); waterLine.style.bottom = `${100 - SPLIT_Y - botC}%` }
        } else if (i === idx + 1) {
          const revealP = Math.max(0, frac - 0.3) / 0.7; const r = revealP * SPLIT_Y
          panel.style.clipPath = `inset(${SPLIT_Y - r}% 0 ${(100 - SPLIT_Y) - r}% 0)`; panel.style.opacity = String(revealP)
          panel.style.filter = `brightness(${0.6 + revealP * 0.4}) hue-rotate(${(1 - revealP) * 40}deg)`; panel.style.zIndex = String(TOTAL + 5)
        }
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
  <div id="fwcArea" class="fwc-page">
    <div id="fwcProgress" class="fwc-progress-bar"></div><nav id="fwcNav" class="fwc-nav-dots"></nav>
    <div class="fwc-indicator"><span class="fwc-cur">1</span> / {{ TOTAL }}</div>
    <!-- 装饰粒子 -->
    <div class="fwc-particles"><div v-for="i in 40" :key="i" class="fwc-particle" :style="{ left: `${(i*27+13)%100}%`, top: `${(i*31+7)%100}%`, animationDelay: `${i*0.15}s`, '--hue': i % 2 ? '10' : '200' }"></div></div>
    <div class="fwc-fire-line"></div><div class="fwc-water-line"></div>
    <!-- 光晕 -->
    <div class="fwc-glow fwc-glow-fire"></div><div class="fwc-glow fwc-glow-water"></div>
    <section v-for="n in TOTAL" :key="n" class="fwc-panel" :class="`fwc-panel-${n}`">
      <div class="fwc-content"><span class="fwc-num">{{ String(n).padStart(2, '0') }}</span><span class="fwc-icon">{{ n % 2 === 0 ? '💧' : '🔥' }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.fwc-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #1a0f18 0%, #0f0a14 40%, #060510 100%); }
.fwc-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter; }
.fwc-panel:nth-child(odd) { background: linear-gradient(180deg, #1a0812 0%, #241020 25%, #162040 55%, #0a1a38 80%, #040c18 100%); }
.fwc-panel:nth-child(even) { background: linear-gradient(180deg, #040c18 0%, #0a1a38 25%, #162040 55%, #241020 80%, #1a0812 100%); }
.fwc-content { text-align: center; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.fwc-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(255,255,255,0.92); text-shadow: 0 0 30px rgba(255,80,20,0.5), 0 0 60px rgba(0,180,220,0.4), 0 4px 8px rgba(0,0,0,0.5); }
.fwc-icon { font-size: 3rem; animation: fwcPulse 2s ease-in-out infinite; }
@keyframes fwcPulse { 0%,100%{transform:scale(1);opacity:.7} 50%{transform:scale(1.3);opacity:1} }
/* 装饰粒子 */
.fwc-particles { position: fixed; inset: 0; z-index: 3; pointer-events: none; }
.fwc-particle { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: hsl(var(--hue), 80%, 60%); will-change: transform, opacity; animation: fwcFloat 4s ease-in-out infinite; }
@keyframes fwcFloat { 0%,100%{transform:translateY(0);opacity:.1} 50%{transform:translateY(-20px);opacity:.5} }
/* 光晕 */
.fwc-glow { position: fixed; border-radius: 50%; filter: blur(120px); z-index: 1; pointer-events: none; opacity: 0.25; }
.fwc-glow-fire { width: 500px; height: 500px; top: -150px; left: -100px; background: radial-gradient(circle, rgba(255,80,20,0.5), transparent); }
.fwc-glow-water { width: 400px; height: 400px; bottom: -100px; right: -80px; background: radial-gradient(circle, rgba(0,180,220,0.5), transparent); }
.fwc-fire-line { position: fixed; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg,transparent,#ff4500,#ff8c00,#ff4500,transparent); z-index: 1000; pointer-events: none; opacity: 0; box-shadow: 0 -8px 40px rgba(255,69,0,.6), 0 -4px 20px rgba(255,140,0,.4); }
.fwc-water-line { position: fixed; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg,transparent,#0077b6,#00b4d8,#0077b6,transparent); z-index: 1000; pointer-events: none; opacity: 0; box-shadow: 0 8px 40px rgba(0,119,182,.6), 0 4px 20px rgba(0,180,216,.4); }
</style>

<style>
.fwc-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 1000; }
.fwc-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.1); cursor: pointer; transition: all .3s; }
.fwc-nav-dot.fwc-active { background: linear-gradient(135deg, #ff4500, #0077b6); border-color: transparent; box-shadow: 0 0 20px rgba(255,80,20,.5), 0 0 20px rgba(0,180,220,.5); transform: scale(1.4); }
.fwc-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #ff4500, #ff8c00, #00b4d8, #0077b6); z-index: 1001; transition: width .3s; }
.fwc-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.4); z-index: 1002; }
</style>
