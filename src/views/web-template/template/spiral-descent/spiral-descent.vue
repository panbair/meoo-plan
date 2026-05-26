<script setup lang="ts">
/**
 * ==================== Spiral Descent ====================
 * 螺旋下降 —— 竖滚驱动横向平移，面板逐级下坠+旋转，形成螺旋路径
 * 核心：track 纯横移（fake-horizontal 已验证可靠），
 *       每块面板通过 position + translateY + rotate 形成螺旋下坠效果
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const totalPanels = 8

let currentIndex = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null
let panels: NodeListOf<HTMLElement> | null = null

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button'); dot.className = 'sd-nav-dot' + (i === 0 ? ' sd-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.sd-nav-dot').forEach((d, i) => d.classList.toggle('sd-active', i === index))
  const el = document.querySelector('.sd-indicator .sd-cur'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = (index / (totalPanels - 1) * 100) + '%'
}
function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const step = window.innerHeight
  gsap.to(window, { scrollTo: { y: index * step, autoKill: false }, duration: 0.5, ease: 'power2.inOut' })
}
function onKeydown(e: KeyboardEvent) {
  const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }
  if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) }
}
let tsY = 0; function onTS(e: TouchEvent) { tsY = e.touches[0].clientY }
function onTE(e: TouchEvent) { const d = tsY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function init() {
  scrollArea = document.getElementById('sdArea') as HTMLElement
  track = document.getElementById('sdTrack') as HTMLElement
  progressBar = document.getElementById('sdProgress')
  navDots = document.getElementById('sdNav')
  panels = document.querySelectorAll('.sd-panel')
  if (!scrollArea || !track || !panels) return

  // 滚动画布高度 = 每屏一 vh
  scrollArea.style.height = (totalPanels * 100) + 'vh'

  // 等布局完成后再读取 track 实际宽度计算位移
  requestAnimationFrame(() => {
    if (!track || !scrollArea || !panels) return
    const vw = window.innerWidth
    const trackW = track.scrollWidth
    // track 纯横移：把最后一屏移到视口内
    const totalMoveX = -(trackW - vw)

    const tween = gsap.to(track, {
      x: totalMoveX,
      ease: 'none',
      scrollTrigger: {
        trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.6,
        onUpdate: (self) => {
          const idx = Math.round(self.progress * (totalPanels - 1))
          if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
          if (progressBar) progressBar.style.width = (self.progress * 100) + '%'

          // 面板逐级螺旋：每块面板随滚动进度产生 translateY + rotate + scale
          if (panels) {
            panels.forEach((panel, i) => {
              const panelProgress = Math.max(0, Math.min(1, (self.progress - i / (totalPanels - 1)) * (totalPanels - 1)))
              const yOffset = panelProgress * 120
              const rot = panelProgress * 15
              const scale = 1 - panelProgress * 0.12
              const opacity = 1 - panelProgress * 0.35
              panel.style.transform = `translateY(${yOffset}px) rotate(${rot}deg) scale(${scale})`
              panel.style.opacity = String(opacity)
            })
          }
        }
      }
    })
    mainST = tween.scrollTrigger
  })

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTS, { passive: true })
  document.addEventListener('touchend', onTE, { passive: true })
  createNavDots()
  updateUI(0)
}
function destroy() { mainST?.kill(); mainST = null; document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTS); document.removeEventListener('touchend', onTE) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="sd-page">
    <div id="sdProgress" class="sd-progress-bar"></div>
    <nav id="sdNav" class="sd-nav-dots"></nav>
    <div class="sd-indicator"><span class="sd-cur">1</span><span class="sd-tot"> / {{ totalPanels }}</span></div>

    <div id="sdArea" class="sd-scroll-area">
      <div class="sd-pinned">
        <div id="sdTrack" class="sd-track">
          <section
            v-for="n in totalPanels"
            :key="n"
            class="sd-panel"
            :style="{
              background: `linear-gradient(135deg, hsl(${(n-1)*45}, 28%, 12%), hsl(${(n-1)*45+35}, 18%, 6%))`,
              zIndex: totalPanels - n
            }"
          >
            <div class="sd-content">
              <div class="sd-badge">LEVEL {{ n }}</div>
              <h2>螺旋 {{ n }}</h2>
              <p>深度 {{ n }} · 第 {{ n }} 层旋涡</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sd-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #060610; color: #fff; }
.sd-scroll-area { position: relative; }
.sd-pinned { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.sd-track { display: flex; will-change: transform; height: 100vh; gap: 15vw; }
.sd-panel {
  min-width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
  transition: transform 0.1s linear, opacity 0.1s linear;
  &::after {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(255, 255, 255, .06);
    border-radius: 16px;
    pointer-events: none;
  }
}
.sd-content { text-align: center; z-index: 1;
  h2 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; margin: 0 0 12px; letter-spacing: 4px; }
  p { font-size: 1rem; opacity: .45; margin: 0; }
}
.sd-badge { display: inline-block; padding: 5px 20px; border: 1px solid rgba(255, 255, 255, .2); border-radius: 16px; font-size: .7rem; letter-spacing: 3px; margin-bottom: 16px; opacity: .6; }
</style>

<style lang="scss">
.sd-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 12px; }
.sd-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.12); cursor: pointer; transition: all .3s; border: none;
  &:hover { background: rgba(255,255,255,.35); }
  &.sd-active { background: #e060a0; transform: scale(1.5); box-shadow: 0 0 16px rgba(224,96,160,.5); }
}
.sd-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #c060e0, #e060a0); }
.sd-indicator { position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0,0,0,.35); backdrop-filter: blur(12px); padding: 6px 18px; border-radius: 20px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.75); }
</style>
