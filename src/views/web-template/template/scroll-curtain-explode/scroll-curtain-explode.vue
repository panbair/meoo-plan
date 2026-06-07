<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const TOTAL = 7; let currentIndex = 0; let scrollArea: HTMLElement | null = null; let progressBar: HTMLElement | null = null; let navDots: HTMLElement | null = null
function createNavDots() { if (!navDots) return; navDots.innerHTML = ''; for (let i = 0; i < TOTAL; i++) { const dot = document.createElement('button'); dot.className = 'ce-dot' + (i === 0 ? ' ce-active' : ''); dot.addEventListener('click', () => goTo(i)); navDots.appendChild(dot) } }
function updateUI(index: number) { document.querySelectorAll('.ce-dot').forEach((d, i) => d.classList.toggle('ce-active', i === index)); const el = document.querySelector('.ce-cur'); if (el) el.textContent = String(index + 1); if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
function goTo(index: number) { index = Math.max(0, Math.min(index, TOTAL - 1)); gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' }) }
function onKeydown(e: KeyboardEvent) { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) } }

function init() {
  scrollArea = document.getElementById('ceArea') as HTMLElement; progressBar = document.getElementById('ceProgress'); navDots = document.getElementById('ceNav')
  if (!scrollArea) return; scrollArea.style.height = TOTAL * 100 + 'vh'; const panels = gsap.utils.toArray('.ce-panel') as HTMLElement[]; const curtainL = document.querySelector('.ce-curtain-l') as HTMLElement; const curtainR = document.querySelector('.ce-curtain-r') as HTMLElement; const shards = document.querySelectorAll('.ce-shard') as NodeListOf<HTMLElement>
  panels.forEach((p, i) => { if (i === 0) { p.style.opacity = '1'; p.style.transform = ''; p.style.filter = ''; p.style.zIndex = String(TOTAL + 10) } else { p.style.opacity = '0'; p.style.transform = 'scale(0.5)'; p.style.filter = 'blur(8px)'; p.style.zIndex = String(TOTAL - i) } })
  if (curtainL) curtainL.style.transform = 'translateX(-105%)'; if (curtainR) curtainR.style.transform = 'translateX(105%)'

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.4,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1); const idx = Math.floor(focus); const frac = focus - idx
      if (curtainL && curtainR) {
        if (frac < .15) { const p = frac / .15; curtainL.style.transform = `translateX(${-105 + p * 105}%)`; curtainR.style.transform = `translateX(${105 - p * 105}%)`; curtainL.style.opacity = String(p); curtainR.style.opacity = String(p) }
        else if (frac < .3) { curtainL.style.transform = 'translateX(0%)'; curtainR.style.transform = 'translateX(0%)'; curtainL.style.opacity = '1'; curtainR.style.opacity = '1' }
        else { const p = (frac - .3) / .7; curtainL.style.transform = `translateX(${-p * 150}%) rotate(${-p * 30}deg)`; curtainR.style.transform = `translateX(${p * 150}%) rotate(${p * 30}deg)`; curtainL.style.opacity = String(1 - p); curtainR.style.opacity = String(1 - p) }
      }
      shards.forEach((shard, si) => { const shardP = Math.max(0, frac - .25 - si * .02); const angle = (si / shards.length) * 360; const dist = shardP * 300; const rad = (angle * Math.PI) / 180; (shard as HTMLElement).style.transform = `translate(${Math.cos(rad)*dist}px,${Math.sin(rad)*dist}px) rotate(${shardP*720}deg) scale(${1-shardP*.8})`; (shard as HTMLElement).style.opacity = String(Math.max(0, 1 - shardP * 1.5)) })
      panels.forEach((panel, i) => {
        if (i < idx) { panel.style.opacity = '0'; panel.style.zIndex = String(i) }
        else if (i > idx + 1) { panel.style.opacity = '0'; panel.style.zIndex = String(TOTAL - i) }
        else if (i === idx) { if (frac < .3) { const p = frac / .3; panel.style.clipPath = `inset(0 ${50 - p * 50}% 0 ${50 - p * 50}%)`; panel.style.opacity = '1'; panel.style.filter = ''; panel.style.zIndex = String(TOTAL + 10) } else { const p = (frac - .3) / .7; panel.style.clipPath = 'none'; panel.style.opacity = String(1 - p); panel.style.filter = `brightness(${1 + p * 2}) blur(${p * 8}px)`; panel.style.transform = `scale(${1 + p * .3})`; panel.style.zIndex = String(TOTAL + 10) } }
        else if (i === idx + 1) { const revealP = Math.max(0, frac - .35) / .65; panel.style.opacity = String(revealP); panel.style.filter = `blur(${(1-revealP)*12}px) brightness(${.3 + revealP * .7})`; panel.style.transform = `scale(${.7 + revealP * .3})`; panel.style.zIndex = String(TOTAL + 5) }
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
  <div id="ceArea" class="ce-page">
    <div id="ceProgress" class="ce-progress-bar"></div><nav id="ceNav" class="ce-nav-dots"></nav>
    <div class="ce-indicator"><span class="ce-cur">1</span> / {{ TOTAL }}</div>
    <div class="ce-curtain ce-curtain-l"><div class="ce-curtain-fold" v-for="f in 5" :key="'l'+f" :style="{ left: `${f*20}%` }"></div></div>
    <div class="ce-curtain ce-curtain-r"><div class="ce-curtain-fold" v-for="f in 5" :key="'r'+f" :style="{ left: `${f*20}%` }"></div></div>
    <div class="ce-shards"><div v-for="i in 28" :key="i" class="ce-shard" :style="{ '--c': `hsl(${i*15+340},80%,${50+i%3*10}%)`, width: `${3+(i%7)*3}px`, height: `${3+(i%4)*4}px` }"></div></div>
    <div class="ce-spotlight"></div>
    <section v-for="n in TOTAL" :key="n" class="ce-panel" :class="`ce-panel-${n}`"><div class="ce-content"><span class="ce-num">{{ String(n).padStart(2, '0') }}</span></div></section>
  </div>
</template>

<style scoped>
.ce-page { width: 100vw; height: 100vh; overflow: hidden; position: relative; background: radial-gradient(ellipse at 50% 40%, #1a1020 0%, #0c0818 40%, #040410 100%); }
.ce-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter, transform; }
.ce-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 50%, #2a1520 0%, #1a0a14 50%, #0c0410 100%); }
.ce-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 50%, #152a20 0%, #0a1a14 50%, #040c10 100%); }
.ce-content { text-align: center; position: relative; z-index: 2; }
.ce-num { font-family: 'Georgia', serif; font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(255,255,255,.92); text-shadow: 0 0 30px rgba(255,180,60,.5), 0 0 60px rgba(220,120,50,.3); }
.ce-curtain { position: fixed; top: 0; width: 52vw; height: 100vh; z-index: 80; pointer-events: none; will-change: transform, opacity; }
.ce-curtain-l { left: 0; background: linear-gradient(90deg, #6b1020, #8b1a30 40%, #b84050 70%, #d06070 95%, transparent); box-shadow: 8px 0 40px rgba(0,0,0,.4); }
.ce-curtain-r { right: 0; background: linear-gradient(270deg, #6b1020, #8b1a30 40%, #b84050 70%, #d06070 95%, transparent); box-shadow: -8px 0 40px rgba(0,0,0,.4); }
.ce-curtain-fold { position: absolute; top: 0; width: 2px; height: 100%; background: linear-gradient(to bottom, transparent, rgba(0,0,0,.25) 20%, rgba(0,0,0,.45) 50%, rgba(0,0,0,.25) 80%, transparent); }
.ce-shards { position: fixed; top: 50%; left: 50%; z-index: 75; pointer-events: none; }
.ce-shard { position: absolute; border-radius: 2px; background: var(--c); transform: translate(-50%,-50%); will-change: transform, opacity; box-shadow: 0 0 6px var(--c); }
.ce-spotlight { position: fixed; width: 300px; height: 300px; border-radius: 50%; filter: blur(100px); top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 5; pointer-events: none; opacity: .3; background: radial-gradient(circle, rgba(255,200,100,.4), transparent); }
</style>

<style>
.ce-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 14px; z-index: 1000; }
.ce-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.08); border: 1px solid rgba(200,100,60,.2); cursor: pointer; transition: all .3s; }
.ce-nav-dot.ce-active { background: #cd5c5c; border-color: transparent; box-shadow: 0 0 20px rgba(205,92,92,.5); transform: scale(1.4); }
.ce-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #6b1020, #b84050, #f0a080); z-index: 1001; transition: width .3s; }
.ce-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Georgia', serif; font-size: 14px; color: rgba(255,255,255,.4); z-index: 1002; }
</style>
