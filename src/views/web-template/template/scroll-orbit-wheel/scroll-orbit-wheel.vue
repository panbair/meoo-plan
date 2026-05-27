<script setup lang="ts">
/**
 * ==================== Scroll Orbit Wheel ====================
 * 轨道轮盘 —— 面板围绕中心排列在一个平面圆环轨道上，
 * 竖滚驱动整个轮盘旋转(rotateZ)，最近位置的面板放大突出
 *
 * 核心机制：
 *   1. scrollArea 撑出纵向空间
 *   2. sticky viewport 居中显示轮盘
 *   3. 面板用 rotate + translate 定位在圆环上
 *   4. scroll → 容器 rotateZ 旋转，面板自身反向旋转保持正立
 *   5. 底部位置(6点钟方向)的面板高亮放大
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const ANGLE_STEP = 360 / TOTAL
const ORBIT_R = 280 // 轨道半径 px

let currentIndex = 0
let scrollArea: HTMLElement | null = null
let wheel: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) { return }
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'orw-dot' + (i === 0 ? ' orw-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.orw-dot').forEach((d, i) => {
    d.classList.toggle('orw-active', i === index)
  })
  const el = document.querySelector('.orw-indicator .orw-cur')
  if (el) { el.textContent = String(index + 1) }
  if (progressBar) { progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%' }
}

function goTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, {
    scrollTo: { y: index * window.innerHeight, autoKill: false },
    duration: 0.6,
    ease: 'power2.inOut',
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(currentIndex - 1) }
}

function init() {
  scrollArea = document.getElementById('orwArea') as HTMLElement
  wheel = document.getElementById('orwWheel')
  progressBar = document.getElementById('orwProgress')
  navDots = document.getElementById('orwNav')
  if (!scrollArea || !wheel) { return }

  scrollArea.style.height = TOTAL * 100 + 'vh'

  const cards = gsap.utils.toArray('.orw-card') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const wheelRot = -p * 360 // 整盘旋转
      if (wheel) { wheel.style.transform = `rotate(${wheelRot}deg)` }

      // 每张卡片反向旋转保持正立 + 高亮底部的
      cards.forEach((card, i) => {
        const selfAngle = i * ANGLE_STEP
        // 卡片在世界空间的角度(0=顶, 90=右, 180=底, 270=左)
        const worldAngle = ((selfAngle + wheelRot) % 360 + 360) % 360
        // 反向旋转保持正立
        card.style.transform = `rotate(${-wheelRot}deg)`

        // 底部(180°)附近高亮
        const distToBottom = Math.min(Math.abs(worldAngle - 180), Math.abs(worldAngle - 180 + 360), Math.abs(worldAngle - 180 - 360))
        const isFocus = distToBottom < ANGLE_STEP * 0.6
        const scale = isFocus ? 1.15 : 0.85
        const opacity = isFocus ? 1 : 0.35

        card.style.transform = `rotate(${-wheelRot}deg) scale(${scale})`
        card.style.opacity = String(opacity)
        card.classList.toggle('orw-focus', isFocus)
      })

      const idx = Math.round(p * (TOTAL - 1))
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
    },
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  document.addEventListener('keydown', onKeydown)
  createNavDots()
  updateUI(0)
}

function destroy() {
  mainST?.kill()
  mainST = null
  document.removeEventListener('keydown', onKeydown)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="orw-page">
    <div id="orwProgress" class="orw-progress-bar"></div>
    <nav id="orwNav" class="orw-nav-dots"></nav>
    <div class="orw-indicator"><span class="orw-cur">1</span> / {{ TOTAL }}</div>

    <div id="orwArea" class="orw-scroll-area">
      <div class="orw-viewport">
        <!-- 轨道圆环(装饰) -->
        <div class="orw-orbit-ring"></div>
        <!-- 旋转轮盘 -->
        <div id="orwWheel" class="orw-wheel">
          <div
            v-for="n in TOTAL"
            :key="n"
            class="orw-slot"
            :style="{
              transform: `rotate(${(n - 1) * ANGLE_STEP}deg) translateY(-${ORBIT_R}px)`,
            }"
          >
            <div class="orw-card"
              :style="{
                background: `linear-gradient(160deg, hsl(${(n - 1) * 45}, 55%, 35%), hsl(${(n - 1) * 45 + 25}, 40%, 18%))`,
              }">
              <span class="orw-num">{{ String(n).padStart(2, '0') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.orw-page { font-family: system-ui, -apple-system, sans-serif; background: #0a0a18; color: #fff; }
.orw-scroll-area { position: relative; }
.orw-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.orw-orbit-ring {
  position: absolute; width: 560px; height: 560px;
  border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 50%;
  pointer-events: none;
}
.orw-wheel {
  position: relative; width: 0; height: 0;
  will-change: transform;
}
.orw-slot {
  position: absolute; top: 0; left: 0;
  transform-origin: center center;
  display: flex; align-items: center; justify-content: center;
  margin-left: -60px; margin-top: -80px;
}
.orw-card {
  width: 120px; height: 160px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
  will-change: transform, opacity;
  transition: box-shadow 0.3s;

  &.orw-focus {
    box-shadow: 0 8px 40px rgba(100, 140, 255, 0.15), 0 0 30px rgba(100, 140, 255, 0.08);
  }
}
.orw-num {
  font-size: 1.8rem; font-weight: 900;
  color: rgba(255, 255, 255, 0.08); user-select: none; pointer-events: none;
}

@media (max-width: 600px) {
  .orw-orbit-ring { width: 380px; height: 380px; }
  .orw-card { width: 80px; height: 110px; }
  .orw-slot { margin-left: -40px; margin-top: -55px; }
}
</style>

<style lang="scss">
$accent: #60a0ff;
.orw-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #a78bfa); z-index: 1001; }
.orw-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.orw-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255, 255, 255, 0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255, 255, 255, 0.4); transform: scale(1.3); }
  &.orw-active { background: $accent; border-color: rgba(255, 255, 255, 0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.orw-indicator {
  position: fixed; top: 24px; right: 24px; z-index: 1000; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(10px);
  padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; color: rgba(255, 255, 255, 0.65); border: 1px solid rgba(255, 255, 255, 0.08);
  .orw-cur { color: $accent; font-weight: 700; }
}
</style>



