<script setup lang="ts">
/**
 * ==================== Scroll Origami Unfold ====================
 * 折纸展开 —— 面板像折纸一样从折叠状态逐步展开成全屏：
 *   初始状态：面板折成 4 折(上下各折一次)
 *   竖滚驱动：从中间向上下展开
 *   展开时每折带有 rotateX 翻转和阴影
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 8
const FOLDS = 4 // 折叠数

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
    dot.className = 'ori-dot' + (i === 0 ? ' ori-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.ori-dot').forEach((d, i) => d.classList.toggle('ori-active', i === index))
  const el = document.querySelector('.ori-indicator .ori-cur')
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
  scrollArea = document.getElementById('oriArea') as HTMLElement
  progressBar = document.getElementById('oriProgress')
  navDots = document.getElementById('oriNav')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const groups = gsap.utils.toArray('.ori-group') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.5,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      groups.forEach((group, i) => {
        const dist = i - focus
        const folds = group.querySelectorAll('.ori-fold') as NodeListOf<HTMLElement>

        if (dist <= -1) {
          // 已展开
          folds.forEach((fold) => {
            fold.style.transform = 'perspective(800px) rotateX(0deg)'
            fold.style.opacity = '1'
          })
          group.style.zIndex = String(i)
          group.style.opacity = '1'
        } else if (dist >= 1) {
          // 折叠状态(隐藏)
          folds.forEach((fold, fi) => {
            const dir = fi < FOLDS / 2 ? 1 : -1 // 上半向前折, 下半向后折
            fold.style.transform = `perspective(800px) rotateX(${dir * 90}deg)`
            fold.style.opacity = '0.3'
          })
          group.style.zIndex = String(TOTAL + i)
          group.style.opacity = '0'
        } else if (dist > 0) {
          // 正在展开 (0 < dist < 1)
          const p = 1 - dist // 0→1
          folds.forEach((fold, fi) => {
            const dir = fi < FOLDS / 2 ? 1 : -1
            // 从中间向两端依次展开
            const centerDist = Math.abs(fi - (FOLDS - 1) / 2) / ((FOLDS - 1) / 2)
            const foldDelay = centerDist * 0.4
            const foldP = Math.max(0, Math.min(1, (p - foldDelay) / (1 - foldDelay)))
            const angle = (1 - foldP) * dir * 90

            fold.style.transform = `perspective(800px) rotateX(${angle}deg)`
            fold.style.opacity = String(0.3 + 0.7 * foldP)
          })
          group.style.zIndex = String(TOTAL + i)
          group.style.opacity = String(Math.min(1, p * 2.5))
        } else {
          // 已展开完毕
          folds.forEach((fold) => {
            fold.style.transform = 'perspective(800px) rotateX(0deg)'
            fold.style.opacity = '1'
          })
          group.style.zIndex = String(i)
          group.style.opacity = '1'
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
  <div class="ori-page">
    <div id="oriProgress" class="ori-progress-bar"></div>
    <nav id="oriNav" class="ori-nav-dots"></nav>
    <div class="ori-indicator"><span class="ori-cur">1</span> / {{ TOTAL }}</div>
    <div id="oriArea" class="ori-scroll-area">
      <div class="ori-viewport">
        <div v-for="n in TOTAL" :key="n" class="ori-group">
          <div
            v-for="f in FOLDS" :key="f"
            class="ori-fold"
            :style="{
              top: ((f - 1) / FOLDS * 100) + '%',
              height: (100 / FOLDS) + '%',
              background: `linear-gradient(${f % 2 === 0 ? 180 : 0}deg, hsl(${(n-1)*44}, 50%, ${28 + (f-1)*2}%), hsl(${(n-1)*44+10}, 40%, ${18 + (f-1)*2}%))`,
              transformOrigin: f <= FOLDS / 2 ? 'center bottom' : 'center top',
            }"
          >
            <!-- 折痕线 -->
            <div class="ori-crease" :style="{ [f <= FOLDS / 2 ? 'bottom' : 'top']: '0' }"></div>
            <!-- 数字只在中间两折显示 -->
            <span v-if="f === Math.ceil(FOLDS / 2)" class="ori-num">{{ String(n).padStart(2, '0') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ori-page { font-family: system-ui, sans-serif; background: #08080f; color: #fff; }
.ori-scroll-area { position: relative; }
.ori-viewport { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.ori-group { position: absolute; inset: 0; will-change: opacity; }

.ori-fold {
  position: absolute; left: 0; width: 100%;
  will-change: transform, opacity;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  box-shadow: 0 1px 0 rgba(0,0,0,0.15);
}

/* 折痕装饰 */
.ori-crease {
  position: absolute; left: 5%; right: 5%; height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.04) 80%, transparent 100%);
  pointer-events: none;
}

.ori-num {
  font-size: clamp(4rem, 10vw, 8rem); font-weight: 900;
  color: rgba(255,255,255,0.05); user-select: none; pointer-events: none;
  /* 数字在中间折，需要向下偏移到中央位置 */
  position: absolute; bottom: -10%; transform: translateY(50%);
}
</style>

<style lang="scss">
$accent: #ec4899;
.ori-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, $accent, #f472b6); z-index: 1001; }
.ori-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.ori-dot {
  width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all 0.3s;
  &:hover { background: rgba(255,255,255,0.4); transform: scale(1.3); }
  &.ori-active { background: $accent; border-color: rgba(255,255,255,0.35); transform: scale(1.5); box-shadow: 0 0 14px rgba($accent, 0.5); }
}
.ori-indicator {
  position: fixed; top: 28px; right: 28px; z-index: 1000; background: rgba(0,0,0,0.4); backdrop-filter: blur(12px);
  padding: 8px 20px; border-radius: 24px; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.75);
  .ori-cur { color: $accent; font-weight: 700; }
}
</style>

