<script setup lang="ts">
/**
 * ==================== Mobius Strip ====================
 * 莫比乌斯环 —— infinite-scroll 增强版
 * 无限循环滚动，每次切换面板时当前面板做180°3D翻转消失，
 * 下一面板从翻转的背面呈现，模拟走过莫比乌斯环的"正反切换"
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
let currentIndex = 0
let vh = 0
let isJumping = false
let touchStartY = 0

let containerEl: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button'); dot.className = 'mb-nav-dot' + (i === 0 ? ' mb-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.mb-nav-dot').forEach((d, i) => d.classList.toggle('mb-active', i === index))
  const el = document.querySelector('.mb-page-indicator .mb-current'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / totalPanels * 100) + '%'
}
function goToPanel(index: number) {
  if (!containerEl) return
  index = ((index % totalPanels) + totalPanels) % totalPanels
  currentIndex = index; updateUI(index)
  containerEl.scrollTop = index * vh
}

function onScroll() {
  if (!containerEl || isJumping) return
  const scrollTop = containerEl.scrollTop
  const maxScroll = containerEl.scrollHeight - containerEl.clientHeight
  let index = Math.round(scrollTop / vh) % totalPanels

  if (scrollTop >= maxScroll - 10) { isJumping = true; containerEl.scrollTop = 2; setTimeout(() => (isJumping = false), 500); index = 0 }
  else if (scrollTop <= 10) { isJumping = true; containerEl.scrollTop = maxScroll - 2; setTimeout(() => (isJumping = false), 500); index = totalPanels - 1 }

  if (index !== currentIndex) {
    // 出发面板翻转
    const leavingPanel = document.querySelector(`.mb-panel[data-index="${currentIndex}"] .mb-face`) as HTMLElement
    if (leavingPanel) gsap.to(leavingPanel, { rotateX: 180, opacity: 0, duration: 0.3, ease: 'power2.in' })

    // 进入面板从翻转状态恢复
    const enteringPanel = document.querySelector(`.mb-panel[data-index="${index}"] .mb-face`) as HTMLElement
    if (enteringPanel) {
      gsap.set(enteringPanel, { rotateX: -180, opacity: 0 })
      gsap.to(enteringPanel, { rotateX: 0, opacity: 1, duration: 0.4, ease: 'power2.out', delay: 0.15 })
    }

    currentIndex = index; updateUI(currentIndex)
  }
}

function onKeydown(e: KeyboardEvent) { const m: Record<string, number> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, Home: 0, End: totalPanels - 1 }; if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) } }
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) { const d = touchStartY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function init() {
  vh = window.innerHeight
  containerEl = document.getElementById('mbContainer') as HTMLElement
  progressBar = document.getElementById('mbProgressBar')
  navDots = document.getElementById('mbNavDots')
  if (!containerEl) return

  // 克隆首屏
  const panels = gsap.utils.toArray('.mb-panel')
  const cloned = (panels[0] as HTMLElement).cloneNode(true) as HTMLElement
  cloned.setAttribute('data-cloned', 'true')
  containerEl.appendChild(cloned)

  containerEl.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTouchStart, { passive: true })
  document.addEventListener('touchend', onTouchEnd, { passive: true })

  createNavDots(); updateUI(0)
}
function destroy() { containerEl?.removeEventListener('scroll', onScroll); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="mb-page">
    <div id="mbProgressBar" class="mb-progress-bar"></div>
    <nav id="mbNavDots" class="mb-nav-dots"></nav>
    <div class="mb-page-indicator"><span class="mb-current">1</span><span class="mb-total"> / {{ totalPanels }}</span></div>
    <div id="mbContainer" class="mb-container">
      <section v-for="n in totalPanels" :key="n" class="mb-panel" :data-index="n - 1" :style="{
        background: `radial-gradient(ellipse at 50% 50%, hsl(${(n-1)*52+200}, 30%, 18%), hsl(${(n-1)*52}, 20%, 6%))`
      }">
        <div class="mb-face">
          <h2>0{{ n }}</h2>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mb-page { height: 100vh; overflow: hidden; font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; }
.mb-container { height: 100%; overflow-y: auto; overflow-x: hidden; scroll-snap-type: y mandatory; }
.mb-panel {
  width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; scroll-snap-align: start; perspective: 1500px;
}
.mb-face {
  text-align: center; backface-visibility: visible;
  h2 { font-size: 5rem; font-weight: 900; margin: 0; letter-spacing: 8px; opacity: .6; }
}
@media (max-width: 768px) { .mb-face h2 { font-size: 3rem; } }
</style>

<style lang="scss">
.mb-nav-dots { position: fixed; right: 28px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 14px; }
.mb-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,.12); cursor: pointer; border: 1px solid rgba(255,255,255,.1); transition: all .3s;
  &:hover { background: rgba(26, 26, 46,.4); transform: scale(1.3); }
  &.mb-active { background: #4ecdc4; border-color: rgba(78,205,196,.5); transform: scale(1.5); box-shadow: 0 0 18px rgba(78,205,196,.4); }
}
.mb-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #4ecdc4, #2ec4b6, #4ecdc4); transition: width .4s; }
.mb-page-indicator { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.8); }
@media (max-width: 768px) { .mb-nav-dots { right: 12px; gap: 10px; } .mb-page-indicator { bottom: 20px; } }
</style>
