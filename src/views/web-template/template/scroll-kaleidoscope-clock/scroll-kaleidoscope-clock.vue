<script setup lang="ts">
/**
 * ════════════ 万花筒时钟 · Kaleidoscope Clock ════════════
 * 万花筒镜像 + 时钟指针 sweep + 中心展开
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null

function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'kc-dot' + (i === 0 ? ' kc-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.kc-dot').forEach((d, i) => d.classList.toggle('kc-active', i === index)); const el = document.querySelector('.kc-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('kcArea') as HTMLElement; progressBar = document.getElementById('kcProgress'); navDots = document.getElementById('kcNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.kc-panel') as HTMLElement[]; const clockHand = document.querySelector('.kc-hand') as HTMLElement; const centerDot = document.querySelector('.kc-center') as HTMLElement
  const orbs = document.querySelectorAll('.kc-orb') as NodeListOf<HTMLElement>

  panels.forEach((p, i) => { if (i === 0) { gsap.set(p, { opacity: 1, zIndex: TOTAL + 10 }); p.style.clipPath = 'circle(80% at 50% 50%)'; p.style.filter = 'none' } else { gsap.set(p, { opacity: 0, zIndex: TOTAL - i }); p.style.clipPath = 'circle(0% at 50% 50%)'; p.style.filter = 'blur(6px)' } })

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx; const sweepAngle = frac * 360
      if (clockHand) clockHand.style.transform = `rotate(${sweepAngle}deg)`
      if (centerDot) centerDot.style.transform = `translate(-50%, -50%) scale(${1 + Math.sin(frac * Math.PI) * 0.6})`
      orbs.forEach((o, oi) => { (o as HTMLElement).style.transform = `translate(-50%, -50%) rotate(${sweepAngle * 0.2 + oi * 60}deg)`; (o as HTMLElement).style.opacity = String(0.15 + Math.sin(frac * Math.PI + oi) * 0.1) })

      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.clipPath = 'circle(0% at 50% 50%)'; panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.clipPath = 'circle(0% at 50% 50%)'; panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) {
          const steps = 48; const clipPoints: string[] = ['50% 50%']
          for (let s = 0; s <= steps; s++) { const angle = (s / steps) * 360; if (angle <= sweepAngle) clipPoints.push('50% 50%'); else { const rad = ((angle - 90) * Math.PI) / 180; clipPoints.push(`${50 + Math.cos(rad) * 80}% ${50 + Math.sin(rad) * 80}%`) } }
          panel.style.clipPath = `polygon(${clipPoints.join(', ')})`; panel.style.opacity = String(1 - frac * 0.5); panel.style.filter = `brightness(${1 - frac * 0.3}) blur(${frac * 4}px)`; panel.style.zIndex = String(TOTAL + 10)
        } else if (i === idx + 1) {
          const revealP = Math.max(0, frac - 0.15) / 0.85; const r = revealP * 85
          panel.style.clipPath = `circle(${r}% at 50% 50%)`; panel.style.opacity = String(Math.min(1, revealP * 1.3)); panel.style.filter = `brightness(${0.4 + revealP * 0.6}) blur(${(1 - revealP) * 10}px)`; panel.style.zIndex = String(TOTAL + 5)
        }
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
  <div id="kcArea" class="kc-page">
    <div id="kcProgress" class="kc-progress-bar"></div><nav id="kcNav" class="kc-nav-dots"></nav>
    <div class="kc-indicator"><span class="kc-cur">1</span> / {{ TOTAL }}</div>
    <!-- 装饰光球 -->
    <div class="kc-orbs"><div v-for="i in 6" :key="i" class="kc-orb" :style="{ '--orb-hue': i * 60 }"></div></div>
    <!-- 几何环 -->
    <div class="kc-rings"><div class="kc-ring r1"></div><div class="kc-ring r2"></div><div class="kc-ring r3"></div></div>
    <div class="kc-hand"><div class="kc-hand-line"></div><div class="kc-hand-tip"></div></div>
    <div class="kc-center"></div>
    <section v-for="n in TOTAL" :key="n" class="kc-panel" :class="`kc-panel-${n}`">
      <div class="kc-content"><span class="kc-num">{{ String(n).padStart(2, '0') }}</span><span class="kc-label">{{ ['星','云','银','河','宇','宙','光'][n-1] }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.kc-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #141028 0%, #0c0a1e 40%, #060510 100%); }
.kc-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter; }
.kc-panel:nth-child(1) { background: radial-gradient(ellipse at 50% 50%, #1a1540 0%, #120e2e 50%, #0a0820 100%); }
.kc-panel:nth-child(2) { background: radial-gradient(ellipse at 50% 50%, #152040 0%, #0e1830 50%, #080e20 100%); }
.kc-panel:nth-child(3) { background: radial-gradient(ellipse at 50% 50%, #201540 0%, #181030 50%, #0c0820 100%); }
.kc-panel:nth-child(4) { background: radial-gradient(ellipse at 50% 50%, #1a2035 0%, #12182a 50%, #080e1e 100%); }
.kc-panel:nth-child(5) { background: radial-gradient(ellipse at 50% 50%, #1a1828 0%, #121020 50%, #08081a 100%); }
.kc-panel:nth-child(6) { background: radial-gradient(ellipse at 50% 50%, #182530 0%, #101a22 50%, #081018 100%); }
.kc-panel:nth-child(7) { background: radial-gradient(ellipse at 50% 50%, #1a1030 0%, #120c24 50%, #0a0818 100%); }
.kc-content { text-align: center; position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.kc-num { font-family: 'Orbitron', monospace; font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(255,255,255,0.9); text-shadow: 0 0 30px rgba(167,139,250,.5), 0 0 60px rgba(139,92,246,.3), 0 0 100px rgba(236,72,153,.2); }
.kc-label { font-family: 'PingFang SC','Microsoft YaHei',sans-serif; font-size: clamp(1rem, 2vw, 1.5rem); color: rgba(255,255,255,.45); letter-spacing: .3em; }
/* 光球 */
.kc-orbs { position: fixed; top: 50%; left: 50%; z-index: 44; pointer-events: none; }
.kc-orb { position: absolute; width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(circle, hsla(var(--orb-hue),70%,60%,.15), transparent); transform: translate(-50%,-50%); will-change: transform, opacity; }
/* 几何环 */
.kc-rings { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 45; pointer-events: none; }
.kc-ring { position: absolute; border-radius: 50%; transform: translate(-50%,-50%); }
.r1 { width: 200px; height: 200px; border: 1px solid rgba(167,139,250,.2); box-shadow: 0 0 30px rgba(167,139,250,.1), inset 0 0 30px rgba(167,139,250,.05); }
.r2 { width: 320px; height: 320px; border: 1px dashed rgba(139,92,246,.1); }
.r3 { width: 440px; height: 440px; border: 1px solid rgba(236,72,153,.06); }
.kc-hand { position: fixed; top: 50%; left: 50%; width: 0; height: 0; z-index: 60; pointer-events: none; transform-origin: 0 0; }
.kc-hand-line { position: absolute; left: 0; top: 0; width: 3px; height: 180px; background: linear-gradient(to bottom, rgba(255,255,255,.9), rgba(255,255,255,.3), transparent); box-shadow: 0 0 16px rgba(255,255,255,.5); border-radius: 2px; }
.kc-hand-tip { position: absolute; left: -5px; top: 176px; width: 13px; height: 13px; background: #fff; border-radius: 50%; box-shadow: 0 0 24px rgba(255,255,255,.9), 0 0 48px rgba(167,139,250,.6); }
.kc-center { position: fixed; top: 50%; left: 50%; width: 16px; height: 16px; background: #fff; border-radius: 50%; z-index: 61; pointer-events: none; transform: translate(-50%,-50%); box-shadow: 0 0 32px rgba(255,255,255,.8), 0 0 64px rgba(167,139,250,.5); }
</style>

<style>
.kc-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 16px; z-index: 1000; }
.kc-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(167,139,250,.2); cursor: pointer; transition: all .3s; }
.kc-nav-dot.kc-active { background: #a78bfa; border-color: transparent; box-shadow: 0 0 20px rgba(167,139,250,.6); transform: scale(1.5); }
.kc-progress-bar { position: fixed; top: 0; left: 0; height: 2px; background: linear-gradient(90deg, #8b5cf6, #a78bfa, #ec4899, #8b5cf6); background-size: 200% 100%; animation: kcBarShine 3s linear infinite; z-index: 1001; transition: width .3s; }
@keyframes kcBarShine { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
.kc-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,.3); z-index: 1002; }
</style>
