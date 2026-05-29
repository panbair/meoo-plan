<script setup lang="ts">
/**
 * ==================== Snake Path ====================
 * 贪吃蛇路径 —— 单轨道 S 形折返
 * 纵向滚动驱动横向位移，但偶数段右移、奇数段左移
 * 面板在左右往返中"贪吃蛇"式地向下覆盖
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const totalSegments = 7
let vw = 0, currentIndex = 0

let scrollArea: HTMLElement | null = null
let track: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalSegments; i++) {
    const dot = document.createElement('button'); dot.className = 'sp-nav-dot' + (i === 0 ? ' sp-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.sp-nav-dot').forEach((d, i) => d.classList.toggle('sp-active', i === index))
  const el = document.querySelector('.sp-indicator .sp-cur'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = (index / (totalSegments - 1) * 100) + '%'
}
function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalSegments - 1))
  gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' })
}
function onKeydown(e: KeyboardEvent) {
  const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalSegments - 1 }
  if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) }
}
let tsY = 0; function onTS(e: TouchEvent) { tsY = e.touches[0].clientY }
function onTE(e: TouchEvent) { const d = tsY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function init() {
  vw = window.innerWidth
  scrollArea = document.getElementById('spArea') as HTMLElement
  track = document.getElementById('spTrack') as HTMLElement
  progressBar = document.getElementById('spProgress')
  navDots = document.getElementById('spNav')
  if (!scrollArea || !track) return

  const panels = gsap.utils.toArray('.sp-panel') as HTMLElement[]

  // 每个面板：左上角位于 (0,0)，面板绝对定位到轨道上
  // 轨道总宽 = 面板数 × 视口宽（因为每段横向偏移）
  scrollArea.style.height = (totalSegments * 100) + 'vh'
  track.style.width = (totalSegments * vw) + 'px'

  // 使用 GSAP 属性动画：根据进度在 X 轴上来回移动
  const tween = gsap.to(track, {
    x: () => -(totalSegments - 1) * vw,
    ease: 'none',
    scrollTrigger: {
      trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress
        const totalPanels = totalSegments
        const idx = Math.round(progress * (totalPanels - 1))
        if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }

        // 贪吃蛇：偶数段 y=0, 奇数段做 y 翻转（从底部开始吸上来）
        panels.forEach((p, i) => {
          const isOdd = i % 2 === 1
          const panelProgress = Math.max(0, Math.min(1, (progress * (totalPanels - 1) - i + 0.5) / 0.5))
          if (isOdd) {
            // 奇数段从视口底部滑入
            p.style.transform = `translateY(${(1 - panelProgress) * 80}vh)`
          } else {
            p.style.transform = `translateY(0)`
          }
          p.style.opacity = panelProgress < 0.1 ? '0' : panelProgress > 0.9 ? '1' : String(panelProgress)
        })
        if (progressBar) progressBar.style.width = (progress * 100) + '%'
      }
    }
  })
  mainST = tween.scrollTrigger

  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTS, { passive: true })
  document.addEventListener('touchend', onTE, { passive: true })
  createNavDots(); updateUI(0)
}
function destroy() { mainST?.kill(); mainST = null; document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTS); document.removeEventListener('touchend', onTE) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="sp-page">
    <div id="spProgress" class="sp-progress-bar"></div>
    <nav id="spNav" class="sp-nav-dots"></nav>
    <div class="sp-indicator"><span class="sp-cur">1</span><span class="sp-tot"> / {{ totalSegments }}</span></div>

    <div id="spArea" class="sp-scroll-area">
      <div class="sp-pinned">
        <div id="spTrack" class="sp-track">
          <section v-for="n in totalSegments" :key="n" class="sp-panel" :class="n % 2 === 1 ? 'sp-even' : 'sp-odd'" :style="{
            left: `${(n-1)*100}vw`,
            background: n % 2 === 1
              ? `linear-gradient(135deg, hsl(${(n-1)*51}, 30%, 86%), hsl(${(n-1)*51+20}, 20%, 92%))`
              : `linear-gradient(225deg, hsl(${(n-1)*51+60},28%,12%), hsl(${(n-1)*51+80},18%,6%))`
          }">
            <div class="sp-content" :style="{ flexDirection: n % 2 === 1 ? 'column' : 'column-reverse' }">
              <div class="sp-arrow">{{ n % 2 === 1 ? '→' : '←' }}</div>
              <h2>段 {{ n }}</h2>
              <p>{{ n % 2 === 1 ? '向右滑行' : '向左折返' }}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sp-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #060512; color: #1a1a2e; }
.sp-scroll-area { position: relative; }
.sp-pinned { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.sp-track { position: relative; height: 100vh; will-change: transform; }
.sp-panel { position: absolute; top: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; transition: opacity .2s;
  &::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(255,255,255,.06); border-radius: 20px; pointer-events: none; }
}
.sp-content { display: flex; align-items: center; gap: 12px; text-align: center; z-index: 1;
  h2 { font-size: 3rem; font-weight: 900; margin: 0; }
  p { font-size: .9rem; opacity: .5; margin: 0; }
}
.sp-arrow { font-size: 2rem; opacity: .2; }
</style>

<style lang="scss">
.sp-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 12px; }
.sp-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,.12); cursor: pointer; transition: all .3s; border: none;
  &:hover { background: rgba(26, 26, 46,.35); }
  &.sp-active { background: #60d0a0; transform: scale(1.5); box-shadow: 0 0 16px rgba(96,208,160,.5); }
}
.sp-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #60d0a0, #40b080); }
.sp-indicator { position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0,0,0,.35); backdrop-filter: blur(12px); padding: 6px 18px; border-radius: 20px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26, 26, 46,.75); }
</style>
