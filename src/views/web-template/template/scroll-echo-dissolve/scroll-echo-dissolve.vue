<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const ECHO = 5; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let echoLayers: HTMLElement[][] = []
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'ed-dot' + (i === 0 ? ' ed-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.ed-dot').forEach((d, i) => d.classList.toggle('ed-active', i === index)); const el = document.querySelector('.ed-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }
function buildEcho() { echoLayers = []; document.querySelectorAll('.ed-panel').forEach((p, pi) => { const c = p.querySelector('.ed-echo-container'); if (!c) return; c.innerHTML = ''; const echoes: HTMLElement[] = []; for (let e = 0; e < ECHO; e++) { const el = document.createElement('div'); el.style.cssText = `position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:${10-e};opacity:0`; const content = p.querySelector('.ed-content')?.cloneNode(true) as HTMLElement; if (content) { content.style.position = 'relative'; el.appendChild(content) }; c.appendChild(el); echoes.push(el) }; echoLayers.push(echoes) }) }
function init() { scrollArea = document.getElementById('edArea') as HTMLElement; progressBar = document.getElementById('edProgress'); navDots = document.getElementById('edNav'); if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.ed-panel') as HTMLElement[]; buildEcho()
  ScrollTrigger.create({ trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.6, onUpdate: (self) => { const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      panels.forEach((panel, i) => { if (i < idx) { panel.style.opacity = '0'; panel.style.zIndex = String(i) } else if (i > idx + 1) { panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) } else if (i === idx) { panel.style.opacity = String(1 - frac * .3); panel.style.zIndex = String(TOTAL + 10); const echoes = echoLayers[i] || []; echoes.forEach((echo, ei) => { const ep = Math.max(0, Math.min(1, (frac - ei * .12) / .5)); const sc = 1 + ep * .2 * (ei + 1); const bl = ep * 5 * (ei + 1); const op = ep > .05 && ep < .9 ? Math.sin(ep * Math.PI) * (.45 - ei * .08) : 0; echo.style.transform = `scale(${sc})`; echo.style.filter = `blur(${bl}px) brightness(${1+ep*.15})`; echo.style.opacity = String(Math.max(0, op)) }) } else if (i === idx + 1) { const rp = Math.max(0, frac - .3) / .7; panel.style.opacity = String(rp); panel.style.filter = `blur(${(1-rp)*12}px) brightness(${.4+rp*.6})`; panel.style.transform = `scale(${.93+rp*.07})`; panel.style.zIndex = String(TOTAL + 5) } }); if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) } } }); document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="edArea" class="ed-page"><div id="edProgress" class="ed-progress-bar"></div><nav id="edNav" class="ed-nav-dots"></nav>
    <div class="ed-indicator"><span class="ed-cur">1</span> / {{ TOTAL }}</div>
    <section v-for="n in TOTAL" :key="n" class="ed-panel" :style="{ background: `radial-gradient(ellipse at 50% 40%, hsl(${n*48+260},45%,82%), hsl(${n*48+240},30%,90%))` }">
      <div class="ed-echo-container"></div>
      <div class="ed-content"><span class="ed-num">{{ String(n).padStart(2, '0') }}</span><div class="ed-wave"><div v-for="w in 3" :key="w" class="ed-wl" :style="{ animationDelay: `${w*.3}s` }"></div></div></div>
    </section>
  </div>
</template>

<style scoped>
.ed-page { font-family: system-ui, -apple-system, sans-serif; background: #f5f4fa; color: #1a1a2e; }
.ed-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter, transform; }
.ed-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.ed-content { text-align: center; position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.ed-num { font-family: 'Georgia', serif; font-size: clamp(5rem, 15vw, 11rem); font-weight: 300; font-style: italic; color: rgba(26,26,46,.03); user-select: none; }
.ed-wave { display: flex; gap: 8px; } .ed-wl { width: 40px; height: 1px; background: rgba(26,26,46,.1); animation: edW 3s ease-in-out infinite; }
@keyframes edW { 0%,100%{transform:scaleX(1);opacity:.1} 50%{transform:scaleX(3);opacity:.5} }
</style>

<style>
.ed-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.ed-nav-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: none; padding: 0; transition: all .4s; }
.ed-nav-dot.ed-active { background: #a78bfa; transform: scale(2.2); box-shadow: 0 0 14px rgba(167,139,250,.4); }
.ed-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #a78bfa, #c4b5fd, #e0d5ff); z-index: 1001; }
.ed-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); font-style: italic; }
</style>
