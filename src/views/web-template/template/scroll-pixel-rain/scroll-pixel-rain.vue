<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; const COLS = 16; const ROWS = 10; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null; let pixelGrid: HTMLElement | null = null; let pixels: HTMLElement[] = []; let pixelHues: number[] = []
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'prn-dot' + (i === 0 ? ' prn-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.prn-dot').forEach((d, i) => d.classList.toggle('prn-active', i === index)); const el = document.querySelector('.prn-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }
function buildPixels() { if (!pixelGrid) return; pixelGrid.innerHTML = ''; pixels = []; pixelHues = []; const pw = 100 / COLS; const ph = 100 / ROWS; for (let r = 0; r < ROWS; r++) { for (let c = 0; c < COLS; c++) { const px = document.createElement('div'); px.style.cssText = `position:absolute;left:${c*pw}%;top:${r*ph}%;width:${pw}%;height:${ph}%`; pixelGrid.appendChild(px); pixels.push(px); pixelHues.push((c/COLS)*360) } } }
function init() { scrollArea = document.getElementById('prnArea') as HTMLElement; progressBar = document.getElementById('prnProgress'); navDots = document.getElementById('prnNav'); pixelGrid = document.getElementById('prnGrid') as HTMLElement; if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.prn-panel') as HTMLElement[]; buildPixels()
  ScrollTrigger.create({ trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4, onUpdate: (self) => { const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx; panels.forEach((p, i) => { p.style.zIndex = i === idx ? String(TOTAL + 10) : i === idx + 1 ? String(TOTAL + 5) : String(i) })
      pixels.forEach((px, pi) => { const row = Math.floor(pi / COLS); const col = pi % COLS; const rf = row / ROWS; const trig = rf * 1.1; const lp = Math.max(0, Math.min(1, (frac - trig) / .3)); const nh = ((idx + 1) * 50 + col * 20) % 360; const ch = (idx * 50 + col * 20) % 360; if (lp <= 0) { px.style.background = `hsl(${ch},60%,${60+row*2}%)`; px.style.opacity = '1'; px.style.transform = 'translateY(0)'; px.style.borderRadius = '1px' } else { px.style.background = `hsl(${nh},60%,${60+((ROWS-1-row)/ROWS)*15}%)`; px.style.opacity = String(1 - lp * .3); px.style.transform = `translateY(${lp*lp*120}vh)`; px.style.borderRadius = `${lp*50}%` } }); if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) } } }); document.addEventListener('keydown', onKeydown); createNavDots(); updateUI(0) }
function destroy() { ScrollTrigger.getAll().forEach(st => st.kill()); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init)); onUnmounted(destroy)
</script>

<template>
  <div id="prnArea" class="prn-page"><div id="prnProgress" class="prn-progress-bar"></div><nav id="prnNav" class="prn-nav-dots"></nav>
    <div class="prn-indicator"><span class="prn-cur">1</span> / {{ TOTAL }}</div>
    <section v-for="n in TOTAL" :key="n" class="prn-panel" :style="{ background: `linear-gradient(180deg, hsl(${n*50+200},45%,80%), hsl(${(n-1)*52}, 52%,88%))` }"><span class="prn-bg-num">{{ String(n).padStart(2, '0') }}</span></section>
    <div id="prnGrid" class="prn-grid"></div>
  </div>
</template>

<style scoped>
.prn-page { font-family: system-ui, -apple-system, sans-serif; background: #f2f5f8; color: #1a1a2e; }
.prn-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.prn-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.prn-bg-num { font-size: 18rem; font-weight: 900; color: rgba(26,26,46,.02); position: absolute; user-select: none; pointer-events: none; }
.prn-grid { position: fixed; inset: 0; z-index: 50; pointer-events: none; }
</style>

<style>
.prn-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.prn-nav-dot { width: 8px; height: 8px; border-radius: 2px; background: rgba(26,26,46,.12); cursor: pointer; border: none; padding: 0; transition: all .3s; }
.prn-nav-dot.prn-active { background: #4dabf7; transform: scale(1.4) rotate(45deg); box-shadow: 0 0 12px rgba(77,171,247,.4); }
.prn-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #4dabf7, #74c0fc, #a5d8ff); z-index: 1001; }
.prn-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>
