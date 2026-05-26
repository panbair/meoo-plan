<script setup lang="ts">
/**
 * ==================== Fractal Recursion ====================
 * 分形递归 —— infinite-scroll 增强版
 * 无限循环滚动，每完成一轮循环（从面板0回到面板0），整屏缩小一级
 * 模拟分形自相似递归：在同一个系统中不断深入更深层级
 * 面板内部也嵌有缩放指示器，展现"层数"
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'

const totalPanels = 7
let currentIndex = 0
let vh = 0
let isJumping = false
let touchStartY = 0
let recursionLevel = 1 // 当前递归层级（1=最外层）

let containerEl: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let pageFrame: HTMLElement | null = null

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button'); dot.className = 'fr-nav-dot' + (i === 0 ? ' fr-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.fr-nav-dot').forEach((d, i) => d.classList.toggle('fr-active', i === index))
  const el = document.querySelector('.fr-page-indicator .fr-current'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / totalPanels * 100) + '%'
  // 更新递归层级显示
  const levelEl = document.querySelector('.fr-level')
  if (levelEl) levelEl.textContent = 'L' + recursionLevel
}
function goToPanel(index: number) {
  if (!containerEl) return
  index = ((index % totalPanels) + totalPanels) % totalPanels
  currentIndex = index; updateUI(index)
  containerEl.scrollTop = index * vh
}

function applyRecursionScale() {
  if (!pageFrame) return
  // 每层缩小25%，最少到0.25
  const scale = Math.max(0.25, 1 - (recursionLevel - 1) * 0.25)
  gsap.to(pageFrame, { scale, duration: 0.5, ease: 'power2.inOut' })

  // 每层变换边框颜色
  const hue = (recursionLevel - 1) * 72 % 360
  gsap.set(pageFrame, { borderColor: `hsla(${hue}, 60%, 50%, ${0.3 - recursionLevel * 0.05})` })
}

function onScroll() {
  if (!containerEl || isJumping) return
  const scrollTop = containerEl.scrollTop
  const maxScroll = containerEl.scrollHeight - containerEl.clientHeight
  let index = Math.round(scrollTop / vh) % totalPanels

  if (scrollTop >= maxScroll - 10) {
    isJumping = true; containerEl.scrollTop = 2
    setTimeout(() => (isJumping = false), 500)
    index = 0
    // 检测完整循环（回到面板0）
    recursionLevel++
    applyRecursionScale()
  } else if (scrollTop <= 10) {
    isJumping = true; containerEl.scrollTop = maxScroll - 2
    setTimeout(() => (isJumping = false), 500)
    index = totalPanels - 1
  }

  if (index !== currentIndex) {
    // 面板切换缩放动效
    const leaving = document.querySelector(`.fr-panel[data-index="${currentIndex}"] .fr-face`) as HTMLElement
    const entering = document.querySelector(`.fr-panel[data-index="${index}"] .fr-face`) as HTMLElement
    if (leaving) gsap.to(leaving, { scale: 0.85, opacity: 0.5, duration: 0.25, ease: 'power2.in' })
    if (entering) { gsap.set(entering, { scale: 1.15, opacity: 0.5 }); gsap.to(entering, { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' }) }
    currentIndex = index; updateUI(currentIndex)
  }
}

function onKeydown(e: KeyboardEvent) { const m: Record<string, number> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, Home: 0, End: totalPanels - 1 }; if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) } }
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) { const d = touchStartY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function init() {
  vh = window.innerHeight
  containerEl = document.getElementById('frContainer') as HTMLElement
  progressBar = document.getElementById('frProgressBar')
  navDots = document.getElementById('frNavDots')
  pageFrame = document.getElementById('frPageFrame')
  if (!containerEl) return

  const panels = gsap.utils.toArray('.fr-panel')
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
  <div id="frPageFrame" class="fr-page-frame">
    <div class="fr-page">
      <div id="frProgressBar" class="fr-progress-bar"></div>
      <nav id="frNavDots" class="fr-nav-dots"></nav>
      <div class="fr-level-indicator"><span class="fr-level">L1</span></div>
      <div class="fr-page-indicator"><span class="fr-current">1</span><span class="fr-total"> / {{ totalPanels }}</span></div>
      <div id="frContainer" class="fr-container">
        <section v-for="n in totalPanels" :key="n" class="fr-panel" :data-index="n - 1" :style="{
          background: `radial-gradient(ellipse at 50% 50%, hsl(${(n-1)*52}, 35%, 18%), hsl(${(n-1)*52}, 20%, 6%))`
        }">
          <div class="fr-face"><h2>{{ n }}</h2></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fr-page-frame {
  border: 4px solid hsla(0, 60%, 50%, 0.3); overflow: hidden; height: 100vh;
  transition: border-color .5s, transform .5s; transform-origin: center center;
}
.fr-page { height: 100vh; overflow: hidden; font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #060610; color: #fff; }
.fr-container { height: 100%; overflow-y: auto; overflow-x: hidden; scroll-snap-type: y mandatory; }
.fr-panel { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; scroll-snap-align: start; }
.fr-face { text-align: center; h2 { font-size: 4rem; font-weight: 900; margin: 0; letter-spacing: 6px; opacity: .5; } }
@media (max-width: 768px) { .fr-face h2 { font-size: 2.5rem; } }
</style>

<style lang="scss">
.fr-nav-dots { position: fixed; right: 28px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 14px; }
.fr-nav-dot { width: 10px; height: 10px; border-radius: 2px; background: rgba(255,255,255,.1); cursor: pointer; border: 1px solid rgba(255,255,255,.08); transition: all .3s;
  &:hover { background: rgba(255,255,255,.4); transform: scale(1.3); }
  &.fr-active { background: #e87ff0; border-color: rgba(232,127,240,.5); transform: scale(1.4); box-shadow: 0 0 16px rgba(232,127,240,.4); }
}
.fr-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #e87ff0, #b87be0, #e87ff0); transition: width .4s; }
.fr-level-indicator { position: fixed; top: 30px; left: 30px; z-index: 1000;
  .fr-level { background: rgba(0,0,0,.5); backdrop-filter: blur(12px); padding: 6px 16px; border-radius: 16px; font-size: .85rem; font-weight: 700; color: #e87ff0; border: 1px solid rgba(232,127,240,.2); }
}
.fr-page-indicator { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .fr-nav-dots { right: 12px; gap: 10px; } .fr-level-indicator { top: 16px; left: 14px; } }
</style>
