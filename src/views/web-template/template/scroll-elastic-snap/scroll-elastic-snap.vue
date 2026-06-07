<script setup lang="ts">
/**
 * ==================== Scroll Elastic Snap ====================
 * 弹性吸附 —— 停止滚动后弹性回弹到最近面板，带过冲和震动感
 * 核心：scroll 停止 150ms 后触发 elastic snap
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const TOTAL = 7
let vh = 0
let currentIndex = 0
let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let scrollTimer: ReturnType<typeof setTimeout> | null = null
let isSnapping = false
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) { const d = document.createElement('button'); d.className = 'esn-dot' + (i === 0 ? ' esn-active' : ''); d.addEventListener('click', () => snapTo(i)); navDots.appendChild(d) }
}
function updateUI(index: number) {
  document.querySelectorAll('.esn-dot').forEach((d, i) => d.classList.toggle('esn-active', i === index))
  const el = document.querySelector('.esn-cur'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
}

function snapTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  if (isSnapping && index === currentIndex) return
  isSnapping = true; currentIndex = index; updateUI(index)

  // 禁用 scrub 避免和 snap 冲突
  mainST?.disable()

  gsap.to(window, {
    scrollTo: { y: index * vh, autoKill: false },
    duration: 1.0,
    ease: 'elastic.out(1.2, 0.4)',
    onComplete: () => { isSnapping = false; mainST?.enable() }
  })
}

let lastScrollY = 0
function onScroll() {
  if (isSnapping) return
  const sy = window.scrollY
  const idx = Math.round(sy / vh)
  if (idx !== currentIndex && Math.abs(sy - lastScrollY) < 5) {
    // 滚动速度极慢或已停止 → 触发吸附
    currentIndex = idx; updateUI(idx)
    if (scrollTimer) clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => snapTo(idx), 150)
  }
  lastScrollY = sy
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); snapTo(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); snapTo(currentIndex - 1) }
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('esnArea') as HTMLElement
  progressBar = document.getElementById('esnProgress')
  navDots = document.getElementById('esnNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'

  // 轻量 scrub：仅仅用来让面板有跟随感
  const panels = gsap.utils.toArray('.esn-panel') as HTMLElement[]
  mainST = ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.2,
    onUpdate: (self) => {
      const f = self.progress * (TOTAL - 1); const idx = Math.floor(f); const frac = f - idx
      // 弹簧动画：面板离中心越近，弹性越大
      panels.forEach((p, i) => {
        const d = i - f; const ad = Math.abs(d)
        if (ad < .3) { p.style.transform = `scale(${1 + Math.sin(frac * Math.PI) * .04})`; p.style.filter = 'brightness(1)' }
        else if (ad < 1) { p.style.transform = ''; p.style.filter = `brightness(${1 - ad * .3})` }
        else { p.style.transform = ''; p.style.filter = 'brightness(.5)' }
      })
    }
  })

  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  createNavDots(); updateUI(0)
}

function destroy() {
  mainST?.kill(); mainST = null
  ScrollTrigger.getAll().forEach(st => st.kill())
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKeydown)
  if (scrollTimer) clearTimeout(scrollTimer)
}
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div id="esnArea" class="esn-page">
    <div id="esnProgress" class="esn-progress-bar"></div>
    <nav id="esnNav" class="esn-nav-dots"></nav>
    <div class="esn-indicator"><span class="esn-cur">1</span> / {{ TOTAL }}</div>

    <div class="esn-sticky">
      <section v-for="n in TOTAL" :key="n" class="esn-panel"
        :style="{ background: `linear-gradient(${[150,210,150,210,150,210,150][n-1]}deg, hsl(${(n-1)*52},${52+(n%3)*3}%,${72+(n%2)*4}%), hsl(${(n-1)*52+30},${42+(n%3)*2}%,${82+(n%2)*3}%))` }">
        <span class="esn-num">{{ String(n).padStart(2, '0') }}</span>
        <div class="esn-spring">
          <div class="esn-spring-coil" v-for="s in 3" :key="s" :style="{ animationDelay: `${s*0.1}s` }"></div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.esn-page { font-family: system-ui, -apple-system, sans-serif; background: #fafafe; color: #2d2d3f; }
.esn-sticky { position: sticky; top: 0; }
.esn-panel {
  width: 100vw; height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; position: relative; overflow: hidden;
  will-change: transform, filter; gap: 20px;
}
.esn-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(0,0,0,.06); border-radius: 20px; pointer-events: none; }
.esn-num { font-size: clamp(5rem, 12vw, 10rem); font-weight: 900; color: rgba(0,0,0,.04); user-select: none; position: relative; z-index: 2; }
/* 弹簧装饰 */
.esn-spring { position: relative; width: 80px; height: 80px; z-index: 2; }
.esn-spring-coil {
  position: absolute; top: 50%; left: 50%; border-radius: 50%;
  border: 2px solid rgba(0,0,0,.06); transform: translate(-50%, -50%);
  animation: esnCoil 2s ease-in-out infinite;
}
.esn-spring-coil:nth-child(1) { width: 40px; height: 40px; }
.esn-spring-coil:nth-child(2) { width: 60px; height: 60px; }
.esn-spring-coil:nth-child(3) { width: 80px; height: 80px; }
@keyframes esnCoil {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: .3; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: .7; }
}
</style>

<style>
.esn-progress-bar { position: fixed; top: 0; left: 0; height: 4px; width: 0%; background: linear-gradient(90deg, #ffa24b, #ff6b6b, #ff6eb4); z-index: 1001; }
.esn-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 12px; }
.esn-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(0,0,0,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s cubic-bezier(.68,-.55,.265,1.55); }
.esn-dot:hover { background: rgba(0,0,0,.25); transform: scale(1.3); }
.esn-dot.esn-active { background: #ff6b6b; border-color: rgba(0,0,0,.12); transform: scale(1.5); box-shadow: 0 0 14px rgba(255,107,107,.45); }
.esn-indicator { position: fixed; top: 24px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(10px); padding: 6px 16px; border-radius: 20px; font-size: .8rem; color: rgba(0,0,0,.5); border: 1px solid rgba(0,0,0,.06); }
.esn-indicator .esn-cur { color: #ff6b6b; font-weight: 700; }
</style>
