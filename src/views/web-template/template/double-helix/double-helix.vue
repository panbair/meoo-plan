<script setup lang="ts">
/**
 * ==================== Double Helix ====================
 * 双螺旋 —— 两个 fake-horizontal 轨道在同一个纵向 infinite 容器中交错
 * 轨道A：右移（正方向），速度 1x
 * 轨道B：左移（反方向），速度 0.7x
 * 两个轨道上下错开50vh，形成 DNA 双螺旋般的交错滚动
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalHelixes = 8
const helixColors = [
  ['#ff6b6b', '#ee5a24'], ['#ffd93d', '#f6b93b'], ['#6bcb77', '#2ed573'],
  ['#4d96ff', '#2e86de'], ['#a55eea', '#8854d0'], ['#ff6348', '#eb4d4b'],
  ['#7bed9f', '#2bcb6b'], ['#70a1ff', '#1e90ff']
]
let vw = 0, vh = 0, currentIndex = 0, isJumping = false, touchY = 0

let outerContainer: HTMLElement | null = null
let trackA: HTMLElement | null = null
let trackB: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalHelixes; i++) {
    const dot = document.createElement('button'); dot.className = 'dh-nav-dot' + (i === 0 ? ' dh-active' : '')
    dot.addEventListener('click', () => goToIndex(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.dh-nav-dot').forEach((d, i) => d.classList.toggle('dh-active', i === index))
  const el = document.querySelector('.dh-indicator .dh-cur'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / totalHelixes * 100) + '%'
}
function goToIndex(index: number) {
  if (!outerContainer) return
  index = ((index % totalHelixes) + totalHelixes) % totalHelixes
  currentIndex = index
  outerContainer.scrollTop = index * vh * 0.6
}
function onOuterScroll() {
  if (!outerContainer || isJumping) return
  const st = outerContainer.scrollTop; const max = outerContainer.scrollHeight - vh
  const step = vh * 0.6
  let idx = Math.round(st / step) % totalHelixes
  if (st >= max - 10) { isJumping = true; outerContainer.scrollTop = 2; setTimeout(() => isJumping = false, 500); idx = 0 }
  else if (st <= 10) { isJumping = true; outerContainer.scrollTop = max - 2; setTimeout(() => isJumping = false, 500); idx = totalHelixes - 1 }
  if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
}
function onKeydown(e: KeyboardEvent) {
  const m: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1, Home: 0, End: totalHelixes - 1 }
  if (m[e.key] !== undefined) { e.preventDefault(); goToIndex(e.key === 'Home' || e.key === 'End' ? m[e.key] : currentIndex + m[e.key]) }
}
function onTS(e: TouchEvent) { touchY = e.touches[0].clientY }
function onTE(e: TouchEvent) { const d = touchY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToIndex(currentIndex + (d > 0 ? 1 : -1)) }

function init() {
  vw = window.innerWidth; vh = window.innerHeight
  outerContainer = document.getElementById('dhOuter') as HTMLElement
  trackA = document.getElementById('dhTrackA') as HTMLElement
  trackB = document.getElementById('dhTrackB') as HTMLElement
  progressBar = document.getElementById('dhProgress')
  navDots = document.getElementById('dhNav')
  if (!outerContainer || !trackA || !trackB) return

  const firstSet = document.querySelector('.dh-set') as HTMLElement
  if (firstSet) {
    const clone = firstSet.cloneNode(true) as HTMLElement
    clone.setAttribute('data-cloned', 'true')
    outerContainer.appendChild(clone)
  }

  // 纵向 snap
  const snapST = ScrollTrigger.create({
    trigger: outerContainer, start: 'top top', end: `+=${totalHelixes * 60}%`,
    snap: { snapTo: 1 / totalHelixes, duration: { min: 0.3, max: 0.5 }, ease: 'power1.inOut' }
  })

  // 双轨道：A右移，B左移
  const tween = gsap.timeline({
    scrollTrigger: {
      trigger: outerContainer, start: 'top top', end: 'bottom bottom', scrub: 0.6,
      onUpdate: (self) => {
        const idx = Math.round(self.progress * (totalHelixes - 1))
        if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
        if (progressBar) progressBar.style.width = (self.progress * 100) + '%'
      }
    }
  })
  .to(trackA, { x: () => -((totalHelixes - 1) * vw * 0.6), ease: 'none' }, 0)
  .to(trackB, { x: () => (totalHelixes - 1) * vw * 0.6, ease: 'none' }, 0)

  mainST = tween.scrollTrigger!

  outerContainer.addEventListener('scroll', onOuterScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTS, { passive: true })
  document.addEventListener('touchend', onTE, { passive: true })
  createNavDots(); updateUI(0)
}
function destroy() {
  mainST?.kill(); mainST = null
  outerContainer?.removeEventListener('scroll', onOuterScroll)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTS); document.removeEventListener('touchend', onTE)
}
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="dh-page">
    <div id="dhProgress" class="dh-progress-bar"></div>
    <nav id="dhNav" class="dh-nav-dots"></nav>
    <div class="dh-indicator"><span class="dh-cur">1</span><span class="dh-tot"> / {{ totalHelixes }}</span></div>

    <div id="dhOuter" class="dh-outer">
      <section v-for="(colors, hi) in helixColors" :key="hi" class="dh-set">
        <div class="dh-helix-zone dh-zone-a">
          <div id="dhTrackA" class="dh-track">
            <div v-for="n in 3" :key="'a'+n" class="dh-helix-card" :style="{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }">
              <div class="dh-card-label">A{{ hi+1 }}-{{ n }}</div>
            </div>
          </div>
        </div>
        <div class="dh-helix-zone dh-zone-b">
          <div id="dhTrackB" class="dh-track">
            <div v-for="n in 3" :key="'b'+n" class="dh-helix-card" :style="{ background: `linear-gradient(225deg, ${colors[1]}, ${colors[0]})` }">
              <div class="dh-card-label">B{{ hi+1 }}-{{ n }}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dh-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; height: 100vh; overflow: hidden; background: #06060f; color: #fff; }
.dh-outer { height: 100%; overflow-y: auto; overflow-x: hidden; }
.dh-set { width: 100%; height: 100vh; display: flex; flex-direction: column; position: relative; flex-shrink: 0; overflow: hidden; }
.dh-helix-zone { flex: 1; position: relative; overflow: hidden; }
.dh-zone-a { border-bottom: 1px solid rgba(255,255,255,.06); }
.dh-track { display: flex; height: 100%; will-change: transform; }
.dh-helix-card { min-width: 50vw; height: 100%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; opacity: .85; }
.dh-card-label { font-size: 1.5rem; font-weight: 900; opacity: .7; text-shadow: 0 2px 8px rgba(0,0,0,.5); }
</style>

<style lang="scss">
.dh-nav-dots { position: fixed; right: 18px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 8px; }
.dh-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,.12); cursor: pointer; transition: all .3s; border: 1px solid transparent;
  &:hover { background: rgba(255,255,255,.35); }
  &.dh-active { background: #ff6b6b; border-color: #ffd93d; transform: scale(1.5); box-shadow: 0 0 12px rgba(255,107,107,.5); }
}
.dh-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77); }
.dh-indicator { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 6px 18px; border-radius: 20px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.75); }
</style>
