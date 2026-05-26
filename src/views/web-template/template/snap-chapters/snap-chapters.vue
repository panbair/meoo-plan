<script setup lang="ts">
/**
 * ==================== 吸附章节 · 动画骨架 ====================
 * 全屏纵向吸附滚动 + 首尾无限循环。只保留动画机制，不填充业务文案。
 *
 * 架构：
 *   .container  100vh 容器，overflow-y:auto
 *   .panel      N 个全屏面板，ScrollTrigger.snap 吸附
 *   首屏克隆到末尾，配合 scroll 跳转实现无限循环
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const N = 7
let vh = 0
let cur = 0
let jumping = false
let touchY = 0
let scroller: HTMLElement | null = null
let bar: HTMLElement | null = null
let dots: HTMLElement | null = null
let st: ScrollTrigger | null = null

function createDots() {
  if (!dots) return
  dots.innerHTML = ''
  for (let i = 0; i < N; i++) {
    const d = document.createElement('button')
    d.className = 'sc-dot' + (i === 0 ? ' active' : '')
    d.textContent = String(i + 1)
    d.addEventListener('click', () => go(i))
    dots.appendChild(d)
  }
}
function updateUI(i: number) {
  document.querySelectorAll('.sc-dot').forEach((d, j) => d.classList.toggle('active', j === i))
  document.querySelectorAll('.sc-indicator .sc-cur').forEach(el => el.textContent = String(i + 1))
  if (bar) bar.style.width = ((i + 1) / N * 100) + '%'
}
function go(i: number) {
  if (!scroller) return
  i = ((i % N) + N) % N
  cur = i; updateUI(i)
  st?.disable()
  scroller.scrollTop = i * vh
  requestAnimationFrame(() => st?.enable())
}

function onScroll() {
  if (!scroller || jumping) return
  const top = scroller.scrollTop
  const max = scroller.scrollHeight - scroller.clientHeight
  let i = Math.round(top / vh)
  if (i >= N) { i = 0 }
  if (top >= max - 10) { jumping = true; scroller.scrollTop = 2; setTimeout(() => (jumping = false), 500); i = 0 }
  else if (top <= 10) { jumping = true; scroller.scrollTop = max - 2; setTimeout(() => (jumping = false), 500); i = N - 1 }
  if (i !== cur) { cur = i; updateUI(i) }
}
function onKey(e: KeyboardEvent) {
  const m: Record<string, number> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, Home: 0, End: N - 1 }
  if (m[e.key] !== undefined) { e.preventDefault(); go(e.key === 'Home' || e.key === 'End' ? m[e.key] : cur + m[e.key]) }
}
function onTS(e: TouchEvent) { touchY = e.touches[0].clientY }
function onTE(e: TouchEvent) { if (Math.abs(touchY - e.changedTouches[0].clientY) > 50) go(cur + (touchY > e.changedTouches[0].clientY ? 1 : -1)) }

function init() {
  vh = innerHeight
  scroller = document.querySelector('.sc-container') as HTMLElement
  bar = document.querySelector('.sc-progress-bar')
  dots = document.querySelector('.sc-nav-dots')
  const wrapper = scroller?.querySelector('.sc-track') as HTMLElement
  if (!scroller || !wrapper) return

  const panels = gsap.utils.toArray('.sc-panel') as HTMLElement[]
  const clone = panels[0].cloneNode(true) as HTMLElement
  clone.setAttribute('data-clone', 'true')
  wrapper.appendChild(clone)

  st = ScrollTrigger.create({
    scroller, trigger: wrapper, start: 'top top', end: 'bottom bottom',
    snap: { snapTo: 1 / N, duration: { min: 0.15, max: 0.4 }, delay: 0.05, ease: 'power1.inOut' }
  })

  scroller.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKey)
  document.addEventListener('touchstart', onTS, { passive: true })
  document.addEventListener('touchend', onTE, { passive: true })
  createDots()
  updateUI(0)
}
function destroy() {
  st?.kill(); st = null
  scroller?.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('touchstart', onTS)
  document.removeEventListener('touchend', onTE)
}
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="sc-page">
    <div class="sc-progress-bar"></div>
    <nav class="sc-nav-dots"></nav>
    <div class="sc-indicator"><span class="sc-cur">1</span> / {{ N }}</div>

    <div class="sc-container">
      <div class="sc-track">
        <section v-for="i in N" :key="i" class="sc-panel" :class="`p${i}`">{{ i }}</section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #0a0a12;
$accent: #7c5cfc;
.sc-page { height: 100vh; overflow: hidden; font-family: system-ui, sans-serif; background: $bg; color: #fff; }
.sc-container { height: 100%; overflow-y: auto; overflow-x: hidden; }
.sc-track { /* wrapper for ScrollTrigger snap trigger */ }
.sc-panel {
  width: 100%; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  font-size: 6rem; font-weight: 300; color: rgba(255,255,255,0.25);
  position: relative; overflow: hidden;
  &::after {
    position: absolute; bottom: 30px; right: 40px;
    font-size: 8rem; font-weight: 900; color: rgba(255,255,255,0.03);
    pointer-events: none;
  }
  &.p1 { background: radial-gradient(ellipse 70% 50% at 50% 40%, rgba(124,92,252,0.12), transparent), linear-gradient(180deg, #0a0e24, #121640); &::after { content: '01'; } }
  &.p2 { background: linear-gradient(135deg, #0f2027, #2c5364); &::after { content: '02'; } }
  &.p3 { background: linear-gradient(135deg, #1a1a2e, #243b55); &::after { content: '03'; } }
  &.p4 { background: linear-gradient(135deg, #1a1a2e, #0f3460); &::after { content: '04'; } }
  &.p5 { background: linear-gradient(135deg, #0d0d1a, #1a1a3e); &::after { content: '05'; } }
  &.p6 { background: linear-gradient(135deg, #1a2980, #26d0ce); &::after { content: '06'; } }
  &.p7 { background: linear-gradient(135deg, #16213e, #1a1a5e); &::after { content: '07'; } }
}

@media (max-width: 600px) {
  .sc-panel { font-size: 3rem; &::after { font-size: 4rem; bottom: 20px; right: 20px; } }
}
</style>

<style lang="scss">
$accent: #7c5cfc;
.sc-progress-bar {
  position: fixed; bottom: 0; left: 0; height: 3px; z-index: 1001; width: 0%;
  background: linear-gradient(90deg, $accent, #a78bfa, #ec4899);
  box-shadow: 0 0 8px rgba(124,92,252,0.3);
}
.sc-nav-dots {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000;
  display: flex; flex-direction: row; gap: 12px;
}
.sc-dot {
  width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.35);
  font-size: 0.7rem; font-weight: 600; cursor: pointer; transition: all 0.3s;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: rgba(255,255,255,0.15); }
  &.active { background: $accent; border-color: rgba(255,255,255,0.5); color: #fff; transform: scale(1.15); box-shadow: 0 0 16px rgba(124,92,252,0.4); }
}
.sc-indicator {
  position: fixed; top: 20px; left: 20px; z-index: 1000;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); padding: 6px 18px; border-radius: 20px;
  font-size: 0.8rem; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.08);
  .sc-cur { color: $accent; font-weight: 700; }
}
</style>
