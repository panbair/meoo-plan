<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const FRAGMENTS = 12; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let allFragments: HTMLElement[][] = []
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'ds-dot' + (i === 0 ? ' ds-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.ds-dot').forEach((d, i) => d.classList.toggle('ds-active', i === index)); const el = document.querySelector('.ds-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }
function buildDiamondFragments() { allFragments = []; const panels = document.querySelectorAll('.ds-panel'); panels.forEach((panel) => { const container = panel.querySelector('.ds-frag-container'); if (!container) { allFragments.push([]); return }; container.innerHTML = ''; const frags: HTMLElement[] = []; for (let f = 0; f < FRAGMENTS; f++) { const angle1 = (f / FRAGMENTS) * 360; const angle2 = ((f + 1) / FRAGMENTS) * 360; const rad1 = (angle1 - 90) * Math.PI / 180; const rad2 = (angle2 - 90) * Math.PI / 180; const r = 85; const cx = 50; const cy = 50; const x1 = cx + Math.cos(rad1) * r; const y1 = cy + Math.sin(rad1) * r; const x2 = cx + Math.cos(rad2) * r; const y2 = cy + Math.sin(rad2) * r; const frag = document.createElement('div'); frag.style.cssText = `position:absolute;inset:0;clip-path:polygon(50% 50%,${x1}% ${y1}%,${x2}% ${y2}%);background:inherit;transform-origin:50% 50%`; const inner = document.createElement('div'); inner.style.cssText = 'position:absolute;inset:0;background:inherit'; frag.appendChild(inner); container.appendChild(frag); frags.push(frag) }; allFragments.push(frags) }) }

function init() {
  scrollArea = document.getElementById('dsArea') as HTMLElement; progressBar = document.getElementById('dsProgress'); navDots = document.getElementById('dsNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.ds-panel') as HTMLElement[]; buildDiamondFragments()
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      panels.forEach((panel, i) => {
        if (i < idx - 1 || i > idx + 1) { panel.style.opacity = '0' } else if (i === idx) { panel.style.opacity = '1'; panel.style.zIndex = String(TOTAL + 10); const frags = allFragments[i] || []
          frags.forEach((frag, fi) => { const fragAngle = (fi / FRAGMENTS) * 360; const rad = (fragAngle - 90) * Math.PI / 180; const dirX = Math.cos(rad); const dirY = Math.sin(rad)
            if (frac < .45) { const p = frac / .45; const easeP = p * p; const dist = easeP * 200; frag.style.transform = `translate(${dirX*dist}px,${dirY*dist}px) rotate(${fragAngle*easeP}deg) scale(${1-easeP*.4})`; frag.style.opacity = String(1 - easeP * .4); frag.style.filter = `brightness(${1+easeP*1.5}) hue-rotate(${easeP*120}deg)` }
            else if (frac < .55) { const p = (frac - .45) / .1; const dist = 200; const hoverX = Math.sin(p * Math.PI * 2) * 12; const hoverY = Math.cos(p * Math.PI * 2) * 8; frag.style.transform = `translate(${dirX*dist+hoverX}px,${dirY*dist+hoverY}px) rotate(${fragAngle+hoverX*.4}deg) scale(.6)`; frag.style.opacity = '.6'; frag.style.filter = 'brightness(2.2) hue-rotate(180deg) saturate(2)' }
            else { const p = (frac - .55) / .45; const easeP = 1 - Math.pow(1 - p, 4); const dist = 200 * (1 - easeP); frag.style.transform = `translate(${dirX*dist}px,${dirY*dist}px) rotate(${fragAngle*(1-easeP)}deg) scale(${.6+easeP*.4})`; frag.style.opacity = String(.6 + easeP * .4); frag.style.filter = `brightness(${2.2-easeP*1.2}) hue-rotate(${180*(1-easeP)}deg)` } })
        } else if (i === idx + 1) { const revealP = Math.max(0, frac - .55) / .45; panel.style.opacity = String(revealP); panel.style.filter = `blur(${(1-revealP)*6}px)`; panel.style.zIndex = String(TOTAL + 5) }
      })
      const sparkles = document.querySelectorAll('.ds-sparkle'); sparkles.forEach((sp, si) => { const phase = (frac * 360 + si * 60) % 360; (sp as HTMLElement).style.opacity = String(.1 + Math.abs(Math.sin(phase * Math.PI / 180)) * .6) })
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0)
}
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="dsArea" class="ds-page">
    <div id="dsProgress" class="ds-progress-bar"></div><nav id="dsNav" class="ds-nav-dots"></nav>
    <div class="ds-indicator"><span class="ds-cur">1</span> / {{ TOTAL }}</div>
    <div class="ds-sparkle" v-for="i in 20" :key="i" :style="{ left: `${(i*47+13)%90+5}%`, top: `${(i*59+7)%90+5}%`, width: `${2+(i%4)}px`, height: `${2+(i%4)}px`, animationDelay: `${i*.3}s` }"></div>
    <div class="ds-glow"></div>
    <section v-for="n in TOTAL" :key="n" class="ds-panel" :class="`ds-panel-${n}`"><div class="ds-frag-container"></div><div class="ds-bg-content"><span class="ds-num">{{ String(n).padStart(2, '0') }}</span><div class="ds-diamond-icon">◆</div></div></section>
    <div class="ds-crosshair"><div class="ds-cross-v"></div><div class="ds-cross-h"></div></div>
  </div>
</template>

<style scoped>
.ds-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #101428 0%, #080c1a 50%, #040610 100%); }
.ds-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter; }
.ds-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 50%, #0f1230 0%, #0a0c22 50%, #050818 100%); }
.ds-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 50%, #1a1c2e 0%, #101224 50%, #080a18 100%); }
.ds-frag-container { position: absolute; inset: 0; z-index: 5; }
.ds-bg-content { text-align: center; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.ds-num { font-family: 'Orbitron', monospace; font-size: clamp(4rem, 14vw, 10rem); font-weight: 900; background: linear-gradient(135deg, #e0e7ff 0%, #c4b5fd 30%, #a78bfa 60%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 0 24px rgba(167,139,250,.4)); }
.ds-diamond-icon { font-size: 2.5rem; color: rgba(167,139,250,.25); animation: dsSpin 4s linear infinite; }
@keyframes dsSpin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
.ds-crosshair { position: fixed; inset: 0; z-index: 3; pointer-events: none; }
.ds-cross-v { position: absolute; left: 50%; top: 0; width: 1px; height: 100%; background: linear-gradient(to bottom, transparent, rgba(167,139,250,.08) 30%, rgba(167,139,250,.08) 70%, transparent); }
.ds-cross-h { position: absolute; top: 50%; left: 0; height: 1px; width: 100%; background: linear-gradient(to right, transparent, rgba(167,139,250,.08) 30%, rgba(167,139,250,.08) 70%, transparent); }
.ds-sparkle { position: fixed; border-radius: 50%; background: #c4b5fd; z-index: 2; pointer-events: none; animation: dsSparkle 3s ease-in-out infinite; }
@keyframes dsSparkle { 0%,100%{transform:scale(.5);opacity:.08} 50%{transform:scale(2.5);opacity:.7} }
.ds-glow { position: fixed; width: 500px; height: 500px; border-radius: 50%; filter: blur(150px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .12; background: radial-gradient(circle, rgba(167,139,250,.3), transparent); }
</style>

<style>
.ds-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.ds-nav-dot { width: 8px; height: 8px; border-radius: 1px; background: rgba(255,255,255,.06); border: 1px solid rgba(167,139,250,.15); cursor: pointer; transition: all .3s; transform: rotate(45deg); }
.ds-nav-dot.ds-active { background: #a78bfa; border-color: #c4b5fd; box-shadow: 0 0 22px rgba(167,139,250,.7), 0 0 44px rgba(196,181,253,.3); transform: rotate(45deg) scale(1.5); }
.ds-progress-bar { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #818cf8, #a78bfa, #c4b5fd, #e0e7ff); z-index: 1001; transition: width .3s; }
.ds-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.3); z-index: 1002; }
</style>
