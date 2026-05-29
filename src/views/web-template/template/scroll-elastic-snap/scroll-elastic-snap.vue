<script setup lang="ts">
/**
 * ==================== Scroll Elastic Snap ====================
 * 弹性吸附 -- 滚动过程中松手停止后弹性回弹到最近面板
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const TOTAL = 7

let currentIndex = 0
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let scrollTimer: ReturnType<typeof setTimeout> | null = null
let isSnapping = false

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'esn-dot' + (i === 0 ? ' esn-active' : '')
    dot.addEventListener('click', () => snapTo(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.esn-dot').forEach((d, i) => {
    d.classList.toggle('esn-active', i === index)
  })
  const el = document.querySelector('.esn-indicator .esn-cur')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / TOTAL) * 100 + '%'
}

function snapTo(index: number) {
  index = Math.max(0, Math.min(index, TOTAL - 1))
  isSnapping = true
  const panels = gsap.utils.toArray('.esn-panel') as HTMLElement[]
  gsap.to(window, {
    scrollTo: { y: index * window.innerHeight, autoKill: false },
    duration: 0.8,
    ease: 'elastic.out(1, 0.5)',
    onComplete: () => {
      isSnapping = false
    }
  })
  if (panels[index]) {
    gsap.fromTo(
      panels[index],
      { scale: 0.95 },
      { scale: 1, duration: 0.8, ease: 'elastic.out(1.2, 0.4)' }
    )
  }
  currentIndex = index
  updateUI(index)
}

function onScroll() {
  if (isSnapping) return
  const vh = window.innerHeight
  const idx = Math.max(0, Math.min(Math.round(window.scrollY / vh), TOTAL - 1))
  if (idx !== currentIndex) {
    currentIndex = idx
    updateUI(idx)
  }
  if (scrollTimer) clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => snapTo(Math.round(window.scrollY / vh)), 120)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault()
    snapTo(currentIndex + 1)
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault()
    snapTo(currentIndex - 1)
  }
}

function init() {
  progressBar = document.getElementById('esnProgress')
  navDots = document.getElementById('esnNav')

  const panels = gsap.utils.toArray('.esn-panel') as HTMLElement[]
  panels.forEach((panel, i) => {
    if (i === 0) return
    gsap.set(panel, { opacity: 0.3, y: 60 })
    ScrollTrigger.create({
      trigger: panel,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 0.3,
      onUpdate: (self) => {
        gsap.set(panel, {
          opacity: 0.3 + self.progress * 0.7,
          y: 60 * (1 - self.progress)
        })
      }
    })
  })

  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  createNavDots()
  updateUI(0)
}

function destroy() {
  ScrollTrigger.getAll().forEach((st) => st.kill())
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKeydown)
  if (scrollTimer) clearTimeout(scrollTimer)
}

onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="esn-page">
    <div id="esnProgress" class="esn-progress-bar" />
    <nav id="esnNav" class="esn-nav-dots" />
    <div class="esn-indicator">
      <span class="esn-cur">1</span> / {{ TOTAL }}
    </div>
    <section
      v-for="n in TOTAL"
      :key="n"
      class="esn-panel"
      :style="{ background: `linear-gradient(150deg, hsl(${30 + (n - 1) * 50}, 70%, 88%), hsl(${30 + (n - 1) * 50 + 25}, 60%, 82%))` }"
    >
      <span class="esn-num">{{ String(n).padStart(2, '0') }}</span>
      <div class="esn-spring" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.esn-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #fafafe;
  color: #2d2d3f;
}

.esn-panel {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  will-change: transform;
  transform-origin: center center;

  &::before {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    pointer-events: none;
  }
}

.esn-num {
  font-size: clamp(5rem, 12vw, 10rem);
  font-weight: 900;
  color: rgba(0, 0, 0, 0.04);
  user-select: none;
  pointer-events: none;
}

.esn-spring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border: 2px solid rgba(0, 0, 0, 0.04);
  border-radius: 50%;
  pointer-events: none;
}
</style>

<style lang="scss">
$accent: #ff6b6b;
$accent2: #ffa24b;

.esn-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: 0%;
  background: linear-gradient(90deg, $accent2, $accent, #ff6eb4);
  z-index: 1001;
}

.esn-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.esn-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.25);
    transform: scale(1.3);
  }

  &.esn-active {
    background: $accent;
    border-color: rgba(0, 0, 0, 0.12);
    transform: scale(1.5);
    box-shadow: 0 0 14px rgba($accent, 0.45);
  }
}

.esn-indicator {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.06);

  .esn-cur {
    color: $accent;
    font-weight: 700;
  }
}
</style>
