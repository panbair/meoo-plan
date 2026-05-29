<script setup lang="ts">
/**
 * ==================== Scroll Typewriter ====================
 * 打字机卷纸 —— 面板像打字机纸张从底部卷出：
 *   纸张从底部向上"卷"出，带有轻微的弧度弯曲
 *   上方有一个打字机滚轴装饰，纸张绕过滚轴展开
 *   面板顶部有弧形阴影模拟纸张弯曲
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
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
    dot.className = 'twr-dot' + (i === 0 ? ' twr-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.twr-dot').forEach((d, i) => d.classList.toggle('twr-active', i === index))
  const el = document.querySelector('.twr-indicator .twr-cur')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
}
function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' })
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) }
}

function init() {
  scrollArea = document.getElementById('twrArea') as HTMLElement
  progressBar = document.getElementById('twrProgress')
  navDots = document.getElementById('twrNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.twr-paper') as HTMLElement[]
  const roller = document.querySelector('.twr-roller') as HTMLElement

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)

      // 滚轴旋转
      if (roller) roller.style.transform = `rotate(${focus * 90}deg)`

      panels.forEach((panel, i) => {
        const dist = i - focus

        if (dist <= -1) {
          // 已卷出，向上滚走
          panel.style.transform = 'translateY(-100%) rotateX(0deg)'
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
        } else if (dist >= 1) {
          // 还在底部等待卷出
          panel.style.transform = 'translateY(100%) rotateX(-15deg)'
          panel.style.opacity = '0'
          panel.style.zIndex = String(TOTAL + i)
        } else if (dist > 0) {
          // 正从底部卷出 (0 < dist < 1)
          const p = 1 - dist // 0→1
          const yOff = 100 * (1 - p) // 100→0
          // 纸张弧度：从底部弯曲(-15°)逐渐展平(0°)
          const rotX = -15 * (1 - p)
          panel.style.transform = `translateY(${yOff}%) rotateX(${rotX}deg)`
          panel.style.opacity = String(Math.min(1, p * 2))
          panel.style.zIndex = String(TOTAL + i)
          panel.style.transformOrigin = 'center top'
        } else {
          // 正在向上卷走 (-1 < dist < 0)
          const scrollP = -dist // 0→1
          const yOff = -scrollP * 100
          panel.style.transform = `translateY(${yOff}%)`
          panel.style.opacity = '1'
          panel.style.zIndex = String(i)
        }
      })

      const idx = Math.round(focus)
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    },
  })
  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  document.addEventListener('keydown', onKeydown)
  createNavDots(); updateUI(0)
}
function destroy() { mainST?.kill(); mainST = null; document.removeEventListener('keydown', onKeydown) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="twr-page">
    <div id="twrProgress" class="twr-progress-bar"></div>
    <nav id="twrNav" class="twr-nav-dots"></nav>
    <div class="twr-indicator"><span class="twr-cur">1</span> / {{ TOTAL }}</div>

    <!-- 打字机滚轴 -->
    <div class="twr-roller-wrap">
      <div class="twr-roller"></div>
    </div>

    <div id="twrArea" class="twr-scroll-area">
      <div class="twr-viewport">
        <section v-for="n in TOTAL" :key="n" class="twr-paper"
          :style="{ background: `linear-gradient(180deg, hsl(${(n-1)*44}, 20%, 90%) 0%, hsl(${(n-1)*44}, 15%, 85%) 100%)` }">
          <!-- 纸张顶部弧形阴影 -->
          <div class="twr-curl-shadow"></div>
          <!-- 纸张行线 -->
          <div class="twr-lines">
            <div v-for="l in 12" :key="l" class="twr-line"></div>
          </div>
          <span class="twr-num">{{ String(n).padStart(2, '0') }}</span>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.twr-page { font-family: 'Courier New', monospace; background: #f5f0f8; color: #333; }
.twr-scroll-area { position: relative; }
.twr-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; perspective: 1200px; }

.twr-paper {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  will-change: transform, opacity; overflow: hidden;
}

/* 纸张顶部卷曲阴影 */
.twr-curl-shadow {
  position: absolute; top: 0; left: 0; right: 0; height: 40px;
  background: linear-gradient(180deg, rgba(0,0,0,0.08), transparent);
  pointer-events: none;
}

/* 行线 */
.twr-lines {
  position: absolute; top: 10%; bottom: 10%; left: 8%; right: 8%;
  display: flex; flex-direction: column; justify-content: space-between; pointer-events: none;
}
.twr-line { height: 1px; background: rgba(0,0,0,0.06); }

.twr-num {
  font-size: clamp(5rem, 12vw, 10rem); font-weight: 300;
  color: rgba(0,0,0,0.06); user-select: none; pointer-events: none;
  font-family: 'Courier New', monospace;
}

/* 滚轴 */
.twr-roller-wrap {
  position: fixed; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 600; pointer-events: none;
}
.twr-roller {
  width: 60vw; max-width: 600px; height: 18px; border-radius: 9px;
  background: linear-gradient(180deg, #555, #333, #555);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.75);
  will-change: transform;
  &::before, &::after {
    content: ''; position: absolute; top: 3px; width: 12px; height: 12px; border-radius: 50%;
    background: #222; border: 2px solid #444;
  }
  &::before { left: 8px; }
  &::after { right: 8px; }
}
</style>

<style lang="scss">
$accent: #8b6914;
.twr-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #b8941f); z-index: 1001; }
.twr-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.twr-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(26, 26, 46,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(26, 26, 46,0.4); transform: scale(1.3); }
  &.twr-active { background: $accent; border-color: rgba(26, 26, 46,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.twr-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(26, 26, 46,0.75);
  .twr-cur { color: $accent; font-weight: 700; }
}
</style>

