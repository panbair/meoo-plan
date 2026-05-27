<script setup lang="ts">
/**
 * ==================== Scroll Domino Chain ====================
 * 多米诺骨牌链 —— 滚动推倒第一张卡片，后续卡片连锁翻倒
 * 核心：每块面板绕底边 rotateX，滚动进度依次触发翻倒，
 *       前一张倒下后"撞击"后一张产生延迟翻转，形成多米诺效果
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 10
const DOMINO_DELAY = 0.08 // 连锁延迟(进度比例)

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
    dot.className = 'dc-dot' + (i === 0 ? ' dc-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.dc-dot').forEach((d, i) => d.classList.toggle('dc-active', i === index))
  const el = document.querySelector('.dc-indicator .dc-cur')
  if (el) el.textContent = String(index + 1)
}

function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  gsap.to(window, { scrollTo: { y: index * window.innerHeight, autoKill: false }, duration: 0.6, ease: 'power2.inOut' })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); goToPanel(currentIndex + 1) }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goToPanel(currentIndex - 1) }
}

function init() {
  scrollArea = document.getElementById('dcArea') as HTMLElement
  progressBar = document.getElementById('dcProgress')
  navDots = document.getElementById('dcNav')
  if (!scrollArea) return

  scrollArea.style.height = (TOTAL * 100) + 'vh'

  const panels = gsap.utils.toArray('.dc-panel') as HTMLElement[]

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.4,
    onUpdate: (self) => {
      const p = self.progress

      panels.forEach((panel, i) => {
        // 每张牌的翻倒进度：前一张倒到一定程度后才开始
        const startP = i * DOMINO_DELAY
        const endP = startP + 0.12
        const local = Math.max(0, Math.min(1, (p - startP) / (endP - startP)))

        // 绕底边翻倒 0 → 90deg
        const rotX = local * 90
        // 倒下时略微前移 + 缩小
        const tz = -local * 60
        const scale = 1 - local * 0.05
        const opacity = 1 - local * 0.6

        panel.style.transform = `perspective(1200px) rotateX(${rotX}deg) translateZ(${tz}px) scale(${scale})`
        panel.style.opacity = String(Math.max(0.2, opacity))

        // 撞击闪光
        panel.classList.toggle('dc-falling', local > 0.1 && local < 0.9)
        panel.classList.toggle('dc-fallen', local >= 0.9)
      })

      const idx = Math.min(TOTAL - 1, Math.floor(p * TOTAL))
      if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) }
      if (progressBar) progressBar.style.width = (p * 100) + '%'
    }
  })

  mainST = ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1]
  createNavDots()
  updateUI(0)
  document.addEventListener('keydown', onKeydown)
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
  <div class="dc-page">
    <div id="dcProgress" class="dc-progress-bar"></div>
    <nav id="dcNav" class="dc-nav-dots"></nav>
    <div class="dc-indicator"><span class="dc-cur">1</span> / {{ TOTAL }}</div>

    <div id="dcArea" class="dc-scroll-area">
      <div class="dc-viewport">
        <div class="dc-stack">
          <section
            v-for="n in TOTAL"
            :key="n"
            class="dc-panel"
            :style="{
              background: `linear-gradient(160deg, hsl(${(n-1)*36}, 35%, 14%), hsl(${(n-1)*36+25}, 25%, 8%))`,
              zIndex: TOTAL - n
            }"
          >
            <span class="dc-num">{{ String(n).padStart(2, '0') }}</span>
            <div class="dc-edge"></div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dc-page { font-family: system-ui, -apple-system, sans-serif; background: #050508; color: #fff; }
.dc-scroll-area { position: relative; }
.dc-viewport {
  position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden;
  perspective: 1200px;
}
.dc-stack {
  position: relative; width: 100%; height: 100%;
  transform-style: preserve-3d;
}
.dc-panel {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  transform-origin: bottom center;
  will-change: transform, opacity;
  backface-visibility: hidden;
  &::before {
    content: ''; position: absolute; inset: 24px;
    border: 1px solid rgba(255,255,255,.06); border-radius: 12px;
    pointer-events: none;
  }
}
.dc-panel.dc-falling {
  &::after {
    content: ''; position: absolute; bottom: 0; left: 10%; right: 10%; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255,200,100,.4), transparent);
    animation: dc-flash .3s ease-out;
  }
}
.dc-panel.dc-fallen { pointer-events: none; }

@keyframes dc-flash {
  from { opacity: 1; transform: scaleX(0.3); }
  to { opacity: 0; transform: scaleX(1.2); }
}

.dc-num {
  font-size: clamp(4rem, 10vw, 8rem); font-weight: 900;
  color: rgba(255,255,255,.06); user-select: none; pointer-events: none;
}
.dc-edge {
  position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent 10%, rgba(255,255,255,.08) 50%, transparent 90%);
}
</style>

<style lang="scss">
$accent: #ffa040;
.dc-progress-bar {
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, $accent, #ff6060); z-index: 1001;
}
.dc-nav-dots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  z-index: 1000; display: flex; flex-direction: column; gap: 10px;
}
.dc-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,.12); cursor: pointer;
  border: 2px solid transparent; padding: 0; transition: all .3s;
  &:hover { background: rgba(255,255,255,.35); transform: scale(1.3); }
  &.dc-active { background: $accent; transform: scale(1.5); box-shadow: 0 0 12px rgba($accent,.5); }
}
.dc-indicator {
  position: fixed; top: 24px; right: 24px; z-index: 1000;
  background: rgba(0,0,0,.4); backdrop-filter: blur(10px);
  padding: 6px 16px; border-radius: 20px; font-size: .8rem;
  color: rgba(255,255,255,.65); border: 1px solid rgba(255,255,255,.08);
  .dc-cur { color: $accent; font-weight: 700; }
}
</style>

