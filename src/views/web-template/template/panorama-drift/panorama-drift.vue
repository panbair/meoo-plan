<script setup lang="ts">
/**
 * ==================== 竖滚横移 · 动画骨架 ====================
 * 垂直滚动 → 横向平移。只保留动画机制，不填充业务文案。
 *
 * 架构：
 *   .scroll-area 撑出 N×100vh 纵向滚动空间
 *   .pinned      用 position:sticky 固定在视口
 *   .track       被 GSAP translateX，承载 N 个 .panel
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const N = 7
let vw = 0
let cur = 0
let area: HTMLElement | null = null
let track: HTMLElement | null = null
let bar: HTMLElement | null = null
let dots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null
let subSTs: ScrollTrigger[] = []

function createDots() {
  if (!dots) return
  dots.innerHTML = ''
  for (let i = 0; i < N; i++) {
    const d = document.createElement('button')
    d.className = 'pd-dot' + (i === 0 ? ' active' : '')
    d.textContent = String(i + 1)
    d.addEventListener('click', () => go(i))
    dots.appendChild(d)
  }
}
function updateUI(i: number) {
  document.querySelectorAll('.pd-dot').forEach((d, j) => d.classList.toggle('active', j === i))
  document.querySelectorAll('.pd-indicator .pd-cur').forEach(el => el.textContent = String(i + 1))
  if (bar) bar.style.width = (i / (N - 1) * 100) + '%'
}
function go(i: number) {
  i = Math.max(0, Math.min(i, N - 1))
  gsap.to(window, { scrollTo: { y: i * innerHeight, autoKill: false }, duration: 0.5, ease: 'power2.inOut' })
}

let touchY = 0
function onKey(e: KeyboardEvent) {
  const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: N - 1 }
  if (m[e.key] !== undefined) { e.preventDefault(); go(e.key === 'Home' || e.key === 'End' ? m[e.key] : cur + m[e.key]) }
}
function onTS(e: TouchEvent) { touchY = e.touches[0].clientY }
function onTE(e: TouchEvent) { if (Math.abs(touchY - e.changedTouches[0].clientY) > 50) go(cur + (touchY > e.changedTouches[0].clientY ? 1 : -1)) }

function init() {
  vw = innerWidth
  area = document.querySelector('.pd-scroll-area') as HTMLElement
  track = document.querySelector('.pd-track') as HTMLElement
  bar = document.querySelector('.pd-progress-bar')
  dots = document.querySelector('.pd-nav-dots')
  if (!area || !track) return

  const tw = gsap.to(track, {
    x: () => -(N - 1) * vw,
    ease: 'none',
    scrollTrigger: {
      trigger: area,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (s) => {
        const i = Math.round(s.progress * (N - 1))
        if (i !== cur) { cur = i; updateUI(i) }
      }
    }
  })
  mainST = tw.scrollTrigger

  // 入场动画
  const panels = gsap.utils.toArray('.pd-panel')
  panels.forEach((p, i) => {
    if (i === 0) return
    const el = p as HTMLElement
    const inner = el.querySelector('.pd-panel-inner')
    if (!inner) return
    let done = false
    const anim = (dir: string) => {
      if (done) return; done = true
      gsap.fromTo(inner, { opacity: 0, y: dir === 'forward' ? 50 : -50 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    }
    subSTs.push(ScrollTrigger.create({ trigger: el, containerAnimation: tw, start: 'left center', end: 'center center', onEnter: () => anim('forward'), onEnterBack: () => anim('backward'), onLeave: () => { done = false }, onLeaveBack: () => { done = false } }))
  })

  document.addEventListener('keydown', onKey)
  document.addEventListener('touchstart', onTS, { passive: true })
  document.addEventListener('touchend', onTE, { passive: true })
  createDots()
  updateUI(0)
}
function destroy() {
  mainST?.kill(); mainST = null
  subSTs.forEach(s => s.kill()); subSTs = []
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('touchstart', onTS)
  document.removeEventListener('touchend', onTE)
}
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="pd-page">
    <div class="pd-progress-bar"></div>
    <nav class="pd-nav-dots"></nav>
    <div class="pd-indicator"><span class="pd-cur">1</span> / {{ N }}</div>

    <div class="pd-scroll-area" :style="{ height: N * 100 + 'vh' }">
      <div class="pd-pinned">
        <div class="pd-track">
          <section v-for="i in N" :key="i" class="pd-panel" :class="`p${i}`">
            <div class="pd-panel-inner">{{ i }}</div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bg: #0a0a12;
$accent: #6c8cff;
.pd-page { font-family: system-ui, sans-serif; background: $bg; color: #1a1a2e; }
.pd-scroll-area { position: relative; }
.pd-pinned { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.pd-track { display: flex; will-change: transform; }
.pd-panel {
  min-width: 100vw; height: 100vh; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  &::after {
    position: absolute; bottom: 30px; right: 40px;
    font-size: 8rem; font-weight: 900; color: rgba(26, 26, 46,0.03);
    pointer-events: none;
  }
  &.p1 { background: linear-gradient(135deg, #0a1028, #d8daf0); &::after { content: '01'; } }
  &.p2 { background: linear-gradient(135deg, #e8f0f4, #d0e4ec); &::after { content: '02'; } }
  &.p3 { background: linear-gradient(135deg, #e8ecf2, #d4e0ec); &::after { content: '03'; } }
  &.p4 { background: linear-gradient(135deg, #dcdff0, #d0ddf0); &::after { content: '04'; } }
  &.p5 { background: linear-gradient(135deg, #ececf2, #dcdcf0); &::after { content: '05'; } }
  &.p6 { background: linear-gradient(135deg, #d0d8f0, #d0f5f4); &::after { content: '06'; } }
  &.p7 { background: linear-gradient(135deg, #16213e, #d8daf0); &::after { content: '07'; } }
}
.pd-panel-inner { font-size: 5rem; font-weight: 300; opacity: 0.3; z-index: 1; }

@media (max-width: 600px) {
  .pd-panel-inner { font-size: 3rem; }
  .pd-panel::after { font-size: 4rem; bottom: 20px; right: 20px; }
}
</style>

<style lang="scss">
$accent: #6c8cff;
.pd-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%;
  background: linear-gradient(90deg, $accent, #a78bfa, #f472b6);
  box-shadow: 0 0 8px rgba(108,140,255,0.3);
}
.pd-nav-dots {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000;
  display: flex; gap: 12px;
}
.pd-dot {
  width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.12);
  background: rgba(26, 26, 46,0.06); color: rgba(26, 26, 46,0.4);
  font-size: 0.7rem; font-weight: 600; cursor: pointer; transition: all 0.3s;
  display: flex; align-items: center; justify-content: center;
  &:hover { background: rgba(26, 26, 46,0.15); }
  &.active { background: $accent; border-color: rgba(26, 26, 46,0.5); color: #1a1a2e; transform: scale(1.15); box-shadow: 0 0 16px rgba(108,140,255,0.4); }
}
.pd-indicator {
  position: fixed; top: 20px; right: 20px; z-index: 1000;
  background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(8px); padding: 6px 18px; border-radius: 20px;
  font-size: 0.8rem; color: rgba(26, 26, 46,0.7); border: 1px solid rgba(255,255,255,0.08);
  .pd-cur { color: $accent; font-weight: 700; }
}
</style>
