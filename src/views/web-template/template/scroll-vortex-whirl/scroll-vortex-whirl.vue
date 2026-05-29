<script setup lang="ts">
/**
 * ==================== Scroll Vortex Whirl ====================
 * 漩涡吸入 —— 面板沿对数螺旋向内吸入中心漩涡，越近旋转越快
 *
 * 与 scroll-spiral-in（展开式螺旋飞入）相反：
 *   本模板模拟"吸入"效果 —— 面板从外向内螺旋收缩，
 *   越靠近中心旋转速度呈对数增长，最终被吸入漩涡核心消失。
 *
 * 对数螺旋公式：r = a * e^(bθ)
 *   距离中心越近，角速度越快 → r 小时 θ 变化巨大
 *
 * 核心机制：
 *   1. scrollArea 撑出纵向空间
 *   2. sticky viewport 锁住视口
 *   3. 所有面板 position:absolute 重叠
 *   4. scroll progress → 计算每个面板的对数螺旋位置
 *   5. 面板向中心漩涡吸入，角加速度呈幂函数增长
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
let vortexEye: HTMLElement | null = null
let mainST: ScrollTrigger | null = null

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button')
    dot.className = 'svw-dot' + (i === 0 ? ' svw-active' : '')
    dot.addEventListener('click', () => goTo(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.svw-dot').forEach((d, i) => d.classList.toggle('svw-active', i === index))
  const el = document.querySelector('.svw-indicator .svw-cur')
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
  scrollArea = document.getElementById('svwArea') as HTMLElement
  progressBar = document.getElementById('svwProgress')
  navDots = document.getElementById('svwNav')
  vortexEye = document.getElementById('svwVortex')
  if (!scrollArea) return
  scrollArea.style.height = TOTAL * 100 + 'vh'
  const panels = gsap.utils.toArray('.svw-panel') as HTMLElement[]

  // ============ 对数螺旋参数 ============
  // 面板被吸入漩涡的对数螺旋路径
  // 特点：距离中心越近，角速度越快
  const MAX_ROT = 1080       // 最大旋转角度（3圈）
  const MAX_RADIUS = 160     // 最大偏移半径（%视口）
  const LOG_POWER = 0.28     // 对数加速指数（< 0.5 = 对数级加速）

  ScrollTrigger.create({
    trigger: scrollArea,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: (self) => {
      const focus = self.progress * (TOTAL - 1)
      // 全局漩涡呼吸：越接近整数面板，漩涡越活跃
      const fracDist = Math.abs(focus - Math.round(focus))
      const vortexPulse = 1 - fracDist * 1.5 // 面板对齐时漩涡最强

      panels.forEach((panel, i) => {
        const dist = i - focus

        if (dist > 1.5) {
          // 远距离：面板在视口外待命，不可见
          panel.style.transform = `translate(0, 0) rotate(0deg) scale(0)`
          panel.style.opacity = '0'
          panel.style.zIndex = '0'
          panel.style.filter = 'none'
        } else if (dist > 0) {
          // ============ 吸入阶段：对数螺旋向内收缩 ============
          const t = dist / 1.5 // 0→1 从中心到边缘

          // 对数螺旋角加速度：越靠近中心旋转越快
          // pow(t, LOG_POWER) 在 t→0 时剧烈变化
          const rot = MAX_ROT * Math.pow(t, LOG_POWER)

          // 半径：从中心向外扩散（指数衰减向内）
          const radius = MAX_RADIUS * Math.pow(t, 1.6)

          // 缩放：靠近中心时放大到 1，远处缩到 0.05
          const scale = 0.05 + 0.95 * Math.pow(1 - t, 2.5)

          // 透明度：靠近中心时完全显现
          const opacity = Math.min(1, Math.pow(1 - t, 1.8) * 1.3)

          // 动态模糊：快速旋转时增加模糊
          const blur = rot > 300 ? (rot - 300) * 0.008 : 0

          const angleRad = (rot * Math.PI) / 180
          const tx = Math.sin(angleRad) * radius
          const ty = -Math.cos(angleRad) * radius

          panel.style.transform = `translate(${tx}%, ${ty}%) rotate(${rot}deg) scale(${scale})`
          panel.style.opacity = String(Math.max(0, opacity))
          panel.style.zIndex = String(Math.round((1 - t) * 100))
          panel.style.filter = blur > 0 ? `blur(${Math.min(blur, 6)}px)` : 'none'
          panel.style.pointerEvents = 'none'
        } else if (dist >= -0.8) {
          // ============ 刚被吸入：快速坍缩到漩涡核心 ============
          const t = -dist / 0.8 // 0→1 刚吸入→完全消失

          // 被吸入后极速旋转坍缩
          const rot = MAX_ROT + 360 * Math.pow(t, 0.25)
          const scale = Math.pow(1 - t, 3) * 0.3
          const opacity = Math.pow(1 - t, 4)
          const blur = t * 12

          panel.style.transform = `translate(0, 0) rotate(${rot}deg) scale(${scale})`
          panel.style.opacity = String(Math.max(0, opacity))
          panel.style.zIndex = String(Math.round((1 - t) * 10))
          panel.style.filter = `blur(${blur}px)`
          panel.style.pointerEvents = 'none'
        } else {
          // 已被完全吸入，不可见
          panel.style.transform = 'translate(0, 0) rotate(0deg) scale(0)'
          panel.style.opacity = '0'
          panel.style.zIndex = '-1'
          panel.style.filter = 'none'
          panel.style.pointerEvents = 'none'
        }
      })

      // 漩涡核心动画
      if (vortexEye) {
        vortexEye.style.transform = `scale(${0.7 + vortexPulse * 0.5}) rotate(${self.progress * 360}deg)`
        vortexEye.style.opacity = String(0.3 + vortexPulse * 0.6)
        vortexEye.style.boxShadow = `0 0 ${40 + vortexPulse * 80}px rgba(0,240,255,${0.3 + vortexPulse * 0.5})`
      }

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
  <div class="svw-page">
    <div id="svwProgress" class="svw-progress-bar"></div>
    <nav id="svwNav" class="svw-nav-dots"></nav>
    <div class="svw-indicator"><span class="svw-cur">1</span> / {{ TOTAL }}</div>

    <div id="svwArea" class="svw-scroll-area">
      <div class="svw-viewport">
        <div class="svw-stack">
          <!-- 漩涡核心 -->
          <div id="svwVortex" class="svw-vortex-eye"></div>

          <!-- 面板 -->
          <section
            v-for="n in TOTAL" :key="n"
            class="svw-panel"
            :style="{
              background: `conic-gradient(from ${(n-1)*45}deg at 50% 50%, 
                hsl(${260+(n-1)*12}, 60%, 12%), 
                hsl(${260+(n-1)*12}, 70%, 22%), 
                hsl(${260+(n-1)*12}, 50%, 35%), 
                hsl(${260+(n-1)*12+20}, 55%, 18%), 
                hsl(${260+(n-1)*12}, 60%, 12%))`
            }">
            <span class="svw-num">{{ String(n).padStart(2, '0') }}</span>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.svw-page {
  font-family: system-ui, -apple-system, sans-serif;
  background: #040810;
  color: #e0e8ff;
}
.svw-scroll-area {
  position: relative;
}
.svw-viewport {
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 50%, #0a1030 0%, #040810 60%, #020510 100%);
}
.svw-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

// ============ 漩涡核心 ============
.svw-vortex-eye {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 500;
  will-change: transform, opacity, box-shadow;
  background: radial-gradient(circle at 40% 40%,
    rgba(0, 240, 255, 0.25) 0%,
    rgba(100, 80, 255, 0.15) 20%,
    rgba(0, 240, 255, 0.05) 45%,
    transparent 70%);
  &::before {
    content: '';
    position: absolute;
    inset: -30px;
    border-radius: 50%;
    border: 1px solid rgba(0, 240, 255, 0.12);
    animation: svw-ring-pulse 2s ease-in-out infinite;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 10px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      transparent 0%, rgba(0, 240, 255, 0.08) 20%,
      rgba(100, 80, 255, 0.12) 40%, transparent 50%,
      rgba(0, 240, 255, 0.06) 70%, rgba(100, 80, 255, 0.04) 90%, transparent 100%
    );
    animation: svw-core-spin 3s linear infinite;
  }
}

@keyframes svw-ring-pulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.3); opacity: 0.7; }
}
@keyframes svw-core-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// ============ 面板 ============
.svw-panel {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity, filter;
  border-radius: 20px;
  margin: 2vh 2vw;
  &::before {
    content: '';
    position: absolute;
    inset: 16px;
    border: 1px solid rgba(0, 240, 255, 0.06);
    border-radius: 16px;
    pointer-events: none;
  }
}
.svw-num {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: rgba(224, 232, 255, 0.04);
  user-select: none;
  pointer-events: none;
  text-shadow: 0 0 80px rgba(0, 240, 255, 0.05);
}
</style>

<style lang="scss">
$accent: #00f0ff;
$accent2: #6450ff;

.svw-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, $accent2, $accent, $accent2);
  z-index: 1001;
  box-shadow: 0 0 12px rgba($accent, 0.4);
}
.svw-nav-dots {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.svw-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(224, 232, 255, 0.15);
  cursor: pointer;
  border: 1px solid rgba(0, 240, 255, 0.2);
  padding: 0;
  transition: all 0.35s ease;
  &:hover {
    background: rgba(0, 240, 255, 0.5);
    transform: scale(1.4);
    box-shadow: 0 0 16px rgba(0, 240, 255, 0.5);
  }
  &.svw-active {
    background: $accent;
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.6);
    box-shadow: 0 0 22px rgba($accent, 0.7), 0 0 40px rgba($accent, 0.3);
  }
}
.svw-indicator {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 1000;
  background: rgba(4, 8, 16, 0.85);
  backdrop-filter: blur(14px);
  padding: 6px 18px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: rgba(224, 232, 255, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.15);
  .svw-cur {
    color: $accent;
    font-weight: 700;
    text-shadow: 0 0 10px rgba($accent, 0.5);
  }
}
</style>
