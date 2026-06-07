<script setup lang="ts">
/**
 * ════════════ 回音溶解 · Echo Dissolve ════════════
 * echo-grid + blur + scale 梦幻溶解
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 7; const ECHO_COUNT = 5; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let echoLayers: HTMLElement[][] = []

function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'ed-dot' + (i === 0 ? ' ed-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.ed-dot').forEach((d, i) => d.classList.toggle('ed-active', i === index)); const el = document.querySelector('.ed-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function buildEchoLayers() { echoLayers = []; const panels = document.querySelectorAll('.ed-panel'); panels.forEach((panel, panelIdx) => { const container = panel.querySelector('.ed-echo-container'); if (!container) return; container.innerHTML = ''; const echoes: HTMLElement[] = []; for (let e = 0; e < ECHO_COUNT; e++) { const echo = document.createElement('div'); echo.className = 'ed-echo'; echo.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:inherit;z-index:' + (10 - e) + ';opacity:0;'; const content = panel.querySelector('.ed-content')?.cloneNode(true) as HTMLElement; if (content) { content.style.position = 'relative'; echo.appendChild(content) }; container.appendChild(echo); echoes.push(echo) }; echoLayers.push(echoes) }) }

function init() {
  scrollArea = document.getElementById('edArea') as HTMLElement; progressBar = document.getElementById('edProgress'); navDots = document.getElementById('edNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.ed-panel') as HTMLElement[]; buildEchoLayers()

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.6,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) {
          panel.style.opacity = String(1 - frac * .4); panel.style.zIndex = String(TOTAL + 10)
          const echoes = echoLayers[i] || []; echoes.forEach((echo, ei) => { const delay = ei * .12; const echoP = Math.max(0, Math.min(1, (frac - delay) / .5)); const scale = 1 + echoP * .25 * (ei + 1); const blur = echoP * 6 * (ei + 1); const opacity = echoP > .05 && echoP < .9 ? Math.sin(echoP * Math.PI) * (.5 - ei * .1) : 0; echo.style.transform = `scale(${scale})`; echo.style.filter = `blur(${blur}px) brightness(${1 + echoP * .2})`; echo.style.opacity = String(Math.max(0, opacity)) })
        } else if (i === idx + 1) { const revealP = Math.max(0, frac - .3) / .7; panel.style.opacity = String(revealP); panel.style.filter = `blur(${(1 - revealP) * 16}px) brightness(${.3 + revealP * .7})`; panel.style.transform = `scale(${.92 + revealP * .08})`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="edArea" class="ed-page">
    <div id="edProgress" class="ed-progress-bar"></div><nav id="edNav" class="ed-nav-dots"></nav>
    <div class="ed-indicator"><span class="ed-cur">1</span> / {{ TOTAL }}</div>
    <!-- 漂浮粒子 -->
    <div class="ed-particles"><div v-for="i in 35" :key="i" class="ed-particle" :style="{ left: `${(i*37+13)%100}%`, top: `${(i*53+7)%100}%`, animationDelay: `${i*.2}s`, animationDuration: `${3 + (i%4)}s` }"></div></div>
    <!-- 光晕 -->
    <div class="ed-ambient"></div>
    <section v-for="n in TOTAL" :key="n" class="ed-panel" :class="`ed-panel-${n}`">
      <div class="ed-echo-container"></div>
      <div class="ed-content"><span class="ed-num">{{ String(n).padStart(2, '0') }}</span><div class="ed-wave"><div v-for="w in 3" :key="w" class="ed-wave-line" :style="{ animationDelay: `${w*.3}s` }"></div></div></div>
    </section>
  </div>
</template>

<style scoped>
.ed-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 30%, #12102a 0%, #0a0818 50%, #040410 100%); }
.ed-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter, transform; }
.ed-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 35%, #1e1a40 0%, #120e28 50%, #0a0818 100%); }
.ed-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 60%, #1e1a38 0%, #141028 50%, #0c0a1a 100%); }
.ed-content { text-align: center; position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.ed-num { font-family: 'Georgia', serif; font-size: clamp(5rem, 15vw, 11rem); font-weight: 300; font-style: italic; color: rgba(220,210,255,.9); text-shadow: 0 0 40px rgba(180,160,255,.3), 0 0 80px rgba(140,120,220,.15); }
.ed-wave { display: flex; gap: 8px; align-items: center; }
.ed-wave-line { width: 40px; height: 2px; background: rgba(200,180,240,.3); animation: edWave 3s ease-in-out infinite; }
@keyframes edWave { 0%,100%{transform:scaleX(1);opacity:.2} 50%{transform:scaleX(3);opacity:.7} }
.ed-particles { position: fixed; inset: 0; z-index: 1; pointer-events: none; }
.ed-particle { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: rgba(180,170,240,.35); animation: edFloat linear infinite; }
@keyframes edFloat { 0%,100%{transform:translateY(0) scale(1);opacity:.1} 50%{transform:translateY(-25px) scale(1.8);opacity:.5} }
.ed-ambient { position: fixed; width: 600px; height: 600px; border-radius: 50%; filter: blur(160px); top: 30%; left: 50%; transform: translate(-50%,-50%); z-index: 0; pointer-events: none; opacity: .15; background: radial-gradient(circle, rgba(140,120,240,.4), transparent); }
</style>

<style>
.ed-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 16px; z-index: 1000; }
.ed-nav-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.08); border: none; cursor: pointer; transition: all .4s; }
.ed-nav-dot.ed-active { background: #c4b5fd; box-shadow: 0 0 22px rgba(196,181,253,.5), 0 0 44px rgba(180,160,240,.2); transform: scale(2.2); }
.ed-progress-bar { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #a78bfa, #c4b5fd, #8b5cf6); z-index: 1001; transition: width .3s; }
.ed-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Georgia', serif; font-size: 14px; color: rgba(255,255,255,.25); z-index: 1002; font-style: italic; }
</style>
