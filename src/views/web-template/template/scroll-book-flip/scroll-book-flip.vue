<script setup lang="ts">
/**
 * ==================== Scroll Book Flip ====================
 * 翻书 —— 真实双面翻页效果：
 *   每一"页"有正面和背面，翻过90°后看到的是背面
 *   书页从右向左翻转，书脊在中间
 *   翻页时有弧度弯曲(通过阴影模拟)和页面层叠
 *
 * 布局：书本左右翻开，右侧页面绕中间书脊翻到左侧
 * 每滚一屏翻一页
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
  if (!navDots) {
    return
  }
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'bkf-dot' + (i === 0 ? ' bkf-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.bkf-dot').forEach((d, i) => {
    d.classList.toggle('bkf-active', i === index)
  })
  const el = document.querySelector('.bkf-indicator .bkf-cur')
  if (el) {
    el.textContent = String(index + 1)
  }
  if (progressBar) {
    progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
  }
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
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault()
    goTo(currentIndex + 1)
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault()
    goTo(currentIndex - 1)
  }
}

function init() {
  scrollArea = document.getElementById('bkfArea') as HTMLElement
  progressBar = document.getElementById('bkfProgress')
  navDots = document.getElementById('bkfNav')
  if (!scrollArea) {
    return
  }

  scrollArea.style.height = (TOTAL + 1) * 100 + 'vh'
  const leaves = gsap.utils.toArray('.bkf-leaf') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const p = self.progress
      const focus = p * (TOTAL - 1)

      leaves.forEach((leaf, i) => {
        const dist = i - focus // 负=已翻过, 正=未翻

        if (dist <= -1) {
          // 完全翻到左侧
          leaf.style.transform = 'rotateY(-180deg)'
          leaf.style.zIndex = String(i + 1)
        } else if (dist >= 1) {
          // 还在右侧未翻
          leaf.style.transform = 'rotateY(0deg)'
          leaf.style.zIndex = String(TOTAL - i)
        } else if (dist < 0) {
          // 正在翻过 (-1 < dist < 0)
          const flipProg = -dist // 0→1
          const angle = flipProg * -180
          leaf.style.transform = `rotateY(${angle}deg)`
          leaf.style.zIndex = String(TOTAL + 2)
        } else {
          // 即将被翻 (0 <= dist < 1)
          const flipProg = 1 - dist // 0→1
          const angle = flipProg * -180
          leaf.style.transform = `rotateY(${angle}deg)`
          leaf.style.zIndex = String(TOTAL + 1)
        }
      })

      // 翻页阴影效果
      const shadow = document.querySelector('.bkf-shadow') as HTMLElement
      if (shadow) {
        const frac = focus % 1
        const shadowIntensity = Math.sin(frac * Math.PI) * 0.4
        shadow.style.opacity = String(shadowIntensity)
      }

      const idx = Math.round(focus)
      if (idx !== currentIndex) {
        currentIndex = idx
        updateUI(idx)
      }
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
  <div class="bkf-wrapper">
    <div id="bkfProgress" class="bkf-progress-bar"></div>
    <nav id="bkfNav" class="bkf-nav-dots"></nav>
    <div class="bkf-indicator">
      <span class="bkf-cur">1</span> / {{ TOTAL }}
    </div>

    <div id="bkfArea" class="bkf-scroll-area">
      <div class="bkf-viewport">
        <div class="bkf-book">
          <!-- 书脊 -->
          <div class="bkf-spine-line"></div>
          <!-- 翻页阴影 -->
          <div class="bkf-shadow"></div>

          <!-- 每一页(leaf)：含正面和背面 -->
          <div
            v-for="n in TOTAL"
            :key="n"
            class="bkf-leaf"
          >
            <!-- 正面(右侧可见) -->
            <div
              class="bkf-face bkf-front"
              :style="{
                background: `linear-gradient(100deg, hsl(${(n - 1) * 40 + 20}, 25%, 18%) 0%, hsl(${(n - 1) * 40}, 35%, 25%) 5%, hsl(${(n - 1) * 40}, 30%, 20%) 100%)`,
              }"
            >
              <span class="bkf-num">{{ String(n).padStart(2, '0') }}</span>
              <div class="bkf-page-lines">
                <div v-for="l in 5" :key="l" class="bkf-line"></div>
              </div>
            </div>
            <!-- 背面(翻过来后左侧可见) -->
            <div
              class="bkf-face bkf-back"
              :style="{
                background: `linear-gradient(260deg, hsl(${(n - 1) * 40 + 10}, 20%, 16%) 0%, hsl(${(n - 1) * 40 + 10}, 28%, 22%) 95%, hsl(${(n - 1) * 40 + 20}, 22%, 17%) 100%)`,
              }"
            >
              <span class="bkf-num bkf-num-back">{{ String(n).padStart(2, '0') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bkf-wrapper {
  font-family: 'Georgia', 'Times New Roman', serif;
  background: #0c0c14;
  color: #fff;
}

.bkf-scroll-area {
  position: relative;
}

.bkf-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 2000px;
}

.bkf-book {
  position: relative;
  width: 60vw;
  height: 72vh;
  max-width: 800px;
  transform-style: preserve-3d;
}

/* 书脊中线 */
.bkf-spine-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  margin-left: -1px;
  background: linear-gradient(to bottom, rgba(180, 140, 100, 0.15), rgba(180, 140, 100, 0.06), rgba(180, 140, 100, 0.15));
  z-index: 300;
  pointer-events: none;
  border-radius: 2px;
  box-shadow: 0 0 12px rgba(180, 140, 100, 0.08);
}

/* 翻页阴影 */
.bkf-shadow {
  position: absolute;
  left: 45%;
  top: 5%;
  bottom: 5%;
  width: 10%;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5), transparent);
  z-index: 250;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.1s;
}

/* 每个 leaf 绕书脊中心翻转 */
.bkf-leaf {
  position: absolute;
  top: 0;
  left: 50%; /* 右半边 */
  width: 50%;
  height: 100%;
  transform-origin: left center;
  transform-style: preserve-3d;
  will-change: transform;
}

/* 正面和背面 */
.bkf-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.bkf-front {
  border-radius: 0 12px 12px 0;
  box-shadow: inset -8px 0 20px rgba(0, 0, 0, 0.15), 2px 0 8px rgba(0, 0, 0, 0.2);
}

.bkf-back {
  transform: rotateY(180deg);
  border-radius: 12px 0 0 12px;
  box-shadow: inset 8px 0 20px rgba(0, 0, 0, 0.15), -2px 0 8px rgba(0, 0, 0, 0.2);
}

.bkf-num {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.07);
  user-select: none;
  pointer-events: none;
  font-style: italic;
  letter-spacing: 4px;
}

.bkf-num-back {
  color: rgba(255, 255, 255, 0.04);
}

/* 页面纹理线 */
.bkf-page-lines {
  position: absolute;
  top: 20%;
  bottom: 20%;
  left: 15%;
  right: 15%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

.bkf-line {
  height: 1px;
  background: rgba(255, 255, 255, 0.025);
  border-radius: 1px;
}

@media (max-width: 768px) {
  .bkf-book {
    width: 90vw;
    height: 55vh;
  }
}
</style>

<style lang="scss">
$accent: #d4a574;

.bkf-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, $accent, #a0845c);
  z-index: 1001;
}

.bkf-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bkf-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
    transform: scale(1.3);
  }

  &.bkf-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.35);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.5);
  }
}

.bkf-indicator {
  position: fixed;
  top: 28px;
  right: 28px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(12px);
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.75);

  .bkf-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>

