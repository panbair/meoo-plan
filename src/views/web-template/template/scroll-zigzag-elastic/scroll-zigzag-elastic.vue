<script setup lang="ts">
/**
 * ════════════ 之字弹跳 · Zigzag Elastic ════════════
 * 双效融合：zigzag-scroll(之字滚动) + elastic-snap(弹性吸附)
 *
 * 3×3 面板网格，之字路径移动（奇数行→右，偶数行←左）
 * 竖滚驱动面板沿之字路径平移
 * 面板切换带弹性过冲回弹感
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const ROWS = 3
const COLS = 3
const TOTAL = ROWS * COLS
let currentIndex = 0
let scrollArea: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'zge-dot' + (i === 0 ? ' zge-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.zge-dot').forEach((d, i) => d.classList.toggle('zge-active', i === index))
  const el = document.querySelector('.zge-indicator .zge-cur')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
}
function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.8, ease: 'elastic.out(1, 0.6)' })
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) }
}

function init() {
  scrollArea = document.getElementById('zgeArea') as HTMLElement
  progressBar = document.getElementById('zgeProgress')
  navDots = document.getElementById('zgeNav')
  if (!scrollArea) return

  // ═══ 关键修复：滚动空间 = 总面板数 × 屏高 ═══
  scrollArea.style.height = TOTAL * 100 + 'vh'

  const track = document.getElementById('zgeTrack') as HTMLElement
  const panels = gsap.utils.toArray('.zge-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      const idx = Math.floor(focus)
      const frac = focus - idx
      const row = Math.floor(idx / COLS)
      const col = idx % COLS
      const isEvenRow = row % 2 === 0

      // ═══ 之字路径计算 ═══
      // 偶数行(0,2,4...)：左→右，col 正常递增
      // 奇数行(1,3,5...)：右→左，col 反向
      const visualCol = isEvenRow ? col : (COLS - 1 - col)
      const targetX = -visualCol * 100
      const targetY = -row * 100

      // ═══ 弹性过冲 ═══
      // 当面板接近中心时(frac≈0.5)，弹性值最大
      const elasticWave = Math.sin(frac * Math.PI)
      const elasticDecay = 1 - frac
      const overshoot = elasticWave * 25 * elasticDecay * (isEvenRow ? 1 : -1)
      const overshootY = -Math.abs(elasticWave) * 8 * elasticDecay

      if (track) {
        track.style.transform = `translate(${targetX + overshoot}vw, ${targetY + overshootY}vh)`
      }

      // 面板亮度
      panels.forEach((panel, i) => {
        const dist = Math.abs(i - focus)
        if (dist < 0.15) {
          panel.style.opacity = '1'
          panel.style.filter = `brightness(1)`
        } else if (dist < 1.5) {
          panel.style.opacity = String(1 - Math.abs(dist - 0.15) * 0.8)
          panel.style.filter = `brightness(${1 - dist * 0.6})`
        } else {
          panel.style.opacity = '0.2'
          panel.style.filter = 'brightness(0.3)'
        }
      })

      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    }
  })
  document.addEventListener('keydown', onKeydown)
  createNavDots(); updateUI(0)
}
function destroy() { mainST?.kill(); document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div id="zgeArea" class="zge-page">
    <div id="zgeProgress" class="zge-progress-bar"></div>
    <nav id="zgeNav" class="zge-nav-dots"></nav>
    <div class="zge-indicator"><span class="zge-cur">1</span> / {{ TOTAL }}</div>

    <!-- ═══ 关键修复：sticky 固定视口，非 fixed ═══ -->
    <div class="zge-sticky">
      <div id="zgeTrack" class="zge-track">
        <section v-for="n in TOTAL" :key="n" class="zge-panel" :class="`zge-panel-${n}`">
          <div class="zge-content">
            <span class="zge-num">{{ String(n).padStart(2, '0') }}</span>
            <span class="zge-arrow">
              {{ ['↗','→','↘','↙','←','↖','↗','→','↘'][n-1] }}
            </span>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.zge-page {
  width: 100vw; height: 100vh;
  position: relative;
  background: #0a0a18;
}
/* ═══ 关键：sticky 固定视口，使 track 始终可见 ═══ */
.zge-sticky {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.zge-track {
  display: grid;
  grid-template-columns: repeat(3, 100vw);
  grid-template-rows: repeat(3, 100vh);
  width: 300vw;
  height: 300vh;
  will-change: transform;
}
.zge-panel {
  display: flex; align-items: center; justify-content: center;
  will-change: opacity, filter;
}
.zge-panel:nth-child(odd) { background: radial-gradient(ellipse at 50% 50%, #1a1530 0%, #0e0a20 50%, #060510 100%); }
.zge-panel:nth-child(even) { background: radial-gradient(ellipse at 50% 50%, #152530 0%, #0a1020 50%, #050810 100%); }
.zge-content { text-align: center; }
.zge-num {
  font-family: 'Orbitron', monospace; font-size: clamp(4rem, 12vw, 9rem); font-weight: 900;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 0 40px rgba(245,158,11,0.3);
  display: block;
}
.zge-arrow { font-size: 2.5rem; color: rgba(255,255,255,0.15); display: block; margin-top: 12px; }
</style>

<style>
.zge-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 1000; }
.zge-nav-dot { width: 10px; height: 10px; border-radius: 3px; background: rgba(255,255,255,0.1); border: none; cursor: pointer; transition: all 0.3s cubic-bezier(0.68,-0.55,0.265,1.55); }
.zge-nav-dot.zge-active { background: #f59e0b; box-shadow: 0 0 16px rgba(245,158,11,0.5); transform: scale(1.2); }
.zge-progress-bar { position: fixed; top: 0; left: 0; height: 4px; background: linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d); z-index: 1001; transition: width 0.3s; }
.zge-indicator { position: fixed; top: 24px; right: 32px; font-family: 'Orbitron', monospace; font-size: 14px; color: rgba(255,255,255,0.4); z-index: 1002; }
</style>
