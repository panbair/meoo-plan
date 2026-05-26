<script setup lang="ts">
/**
 * ==================== Cross Hatch ====================
 * 十字网格 —— infinite-scroll + fake-horizontal-scroll 双轴混合
 * 外层：纵向全屏 snap 吸附 + 无限循环，切换"行"
 * 每行内部：fake-horizontal 横向平移，展示该行的多个子面板
 * 像浏览一个交叉网格，先选行再游列
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalRows = 5
const colsPerRow = [4, 3, 5, 3, 4]

let vw = 0, vh = 0
let currentRow = 0
let isJumping = false
let touchStartY = 0

let outerContainer: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let scrollTriggers: ScrollTrigger[] = []

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalRows; i++) {
    const dot = document.createElement('button')
    dot.className = 'ch-nav-dot' + (i === 0 ? ' ch-active' : '')
    dot.addEventListener('click', () => goToRow(i))
    navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.ch-nav-dot').forEach((d, i) => d.classList.toggle('ch-active', i === index))
  const el = document.querySelector('.ch-page-indicator .ch-current'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index + 1) / totalRows * 100) + '%'
}
function goToRow(index: number) {
  if (!outerContainer) return
  index = ((index % totalRows) + totalRows) % totalRows
  currentRow = index; updateUI(index)
  outerContainer.scrollTop = index * vh
}
function onOuterScroll() {
  if (!outerContainer || isJumping) return
  const st = outerContainer.scrollTop
  const max = outerContainer.scrollHeight - vh
  let idx = Math.round(st / vh) % totalRows
  if (st >= max - 10) { isJumping = true; outerContainer.scrollTop = 2; setTimeout(() => isJumping = false, 500); idx = 0 }
  else if (st <= 10) { isJumping = true; outerContainer.scrollTop = max - 2; setTimeout(() => isJumping = false, 500); idx = totalRows - 1 }
  if (idx !== currentRow) { currentRow = idx; updateUI(idx) }
}
function onKeydown(e: KeyboardEvent) {
  const m: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1, Home: 0, End: totalRows - 1 }
  if (m[e.key] !== undefined) { e.preventDefault(); goToRow(e.key === 'Home' || e.key === 'End' ? m[e.key] : currentRow + m[e.key]) }
}
function onTS(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTE(e: TouchEvent) {
  const d = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(d) > 50) goToRow(currentRow + (d > 0 ? 1 : -1))
}

function init() {
  vw = window.innerWidth; vh = window.innerHeight
  outerContainer = document.getElementById('chOuter') as HTMLElement
  progressBar = document.getElementById('chProgress')
  navDots = document.getElementById('chNav')
  if (!outerContainer) return

  const firstPanel = document.querySelector('.ch-row') as HTMLElement
  if (firstPanel) {
    const clone = firstPanel.cloneNode(true) as HTMLElement
    clone.setAttribute('data-cloned', 'true')
    outerContainer.appendChild(clone)
  }

  // outer snap
  const snapST = ScrollTrigger.create({
    trigger: outerContainer, start: 'top top', end: `+=${totalRows * 100}%`,
    snap: { snapTo: 1 / totalRows, duration: { min: 0.2, max: 0.45 }, ease: 'power1.inOut' }
  })
  scrollTriggers.push(snapST)

  // 每行内的横向滚动
  document.querySelectorAll('.ch-row:not([data-cloned])').forEach((row, ri) => {
    const track = row.querySelector('.ch-h-track') as HTMLElement
    const area = row.querySelector('.ch-h-area') as HTMLElement
    if (!track || !area) return
    const cols = colsPerRow[ri]
    // 撑高制造纵向滚动空间用于驱动横向
    area.style.height = (cols * 100) + 'vh'

    gsap.to(track, {
      x: () => -((cols - 1) * vw),
      ease: 'none',
      scrollTrigger: {
        trigger: area, start: 'top top', end: 'bottom bottom', scrub: 0.5,
        onUpdate: (self) => {
          // 高亮当前子面板
          const ci = Math.round(self.progress * (cols - 1))
          track.querySelectorAll('.ch-h-panel').forEach((p, pi) => {
            p.classList.toggle('ch-h-active', pi === ci)
          })
        }
      }
    })
  })

  outerContainer.addEventListener('scroll', onOuterScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTS, { passive: true })
  document.addEventListener('touchend', onTE, { passive: true })
  createNavDots(); updateUI(0)
}
function destroy() {
  scrollTriggers.forEach(st => st.kill()); scrollTriggers = []
  outerContainer?.removeEventListener('scroll', onOuterScroll)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTS); document.removeEventListener('touchend', onTE)
}
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="ch-page">
    <div id="chProgress" class="ch-progress-bar"></div>
    <nav id="chNav" class="ch-nav-dots"></nav>
    <div class="ch-page-indicator"><span class="ch-current">1</span><span class="ch-total"> / {{ totalRows }}</span></div>

    <div id="chOuter" class="ch-outer">
      <!-- 第1行: 4列 -->
      <section class="ch-row ch-row-0">
        <div class="ch-h-area">
          <div class="ch-h-pinned">
            <div class="ch-h-track">
              <div v-for="n in colsPerRow[0]" :key="n" class="ch-h-panel" :class="n===1&&'ch-h-active'" :style="{ background: `linear-gradient(135deg, hsl(${(n-1)*90},30%,14%), hsl(${(n-1)*90+30},20%,8%))` }">
                <div class="ch-h-content"><div class="ch-h-badge">R1·C{{ n }}</div><h2>象限 {{ n }}</h2></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 第2行: 3列 -->
      <section class="ch-row ch-row-1">
        <div class="ch-h-area">
          <div class="ch-h-pinned">
            <div class="ch-h-track">
              <div v-for="n in colsPerRow[1]" :key="n" class="ch-h-panel" :class="n===1&&'ch-h-active'" :style="{ background: `linear-gradient(135deg, hsl(${(n-1)*120+30},28%,14%), hsl(${(n-1)*120+60},18%,8%))` }">
                <div class="ch-h-content"><div class="ch-h-badge">R2·C{{ n }}</div><h2>三柱 {{ n }}</h2></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 第3行: 5列 -->
      <section class="ch-row ch-row-2">
        <div class="ch-h-area">
          <div class="ch-h-pinned">
            <div class="ch-h-track">
              <div v-for="n in colsPerRow[2]" :key="n" class="ch-h-panel" :class="n===1&&'ch-h-active'" :style="{ background: `linear-gradient(135deg, hsl(${(n-1)*72+60},28%,13%), hsl(${(n-1)*72+90},18%,7%))` }">
                <div class="ch-h-content"><div class="ch-h-badge">R3·C{{ n }}</div><h2>五行 {{ n }}</h2></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 第4行: 3列 -->
      <section class="ch-row ch-row-3">
        <div class="ch-h-area">
          <div class="ch-h-pinned">
            <div class="ch-h-track">
              <div v-for="n in colsPerRow[3]" :key="n" class="ch-h-panel" :class="n===1&&'ch-h-active'" :style="{ background: `linear-gradient(135deg, hsl(${(n-1)*120+90},26%,14%), hsl(${(n-1)*120+120},16%,8%))` }">
                <div class="ch-h-content"><div class="ch-h-badge">R4·C{{ n }}</div><h2>三联 {{ n }}</h2></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- 第5行: 4列 -->
      <section class="ch-row ch-row-4">
        <div class="ch-h-area">
          <div class="ch-h-pinned">
            <div class="ch-h-track">
              <div v-for="n in colsPerRow[4]" :key="n" class="ch-h-panel" :class="n===1&&'ch-h-active'" :style="{ background: `linear-gradient(135deg, hsl(${(n-1)*90+120},30%,14%), hsl(${(n-1)*90+150},20%,8%))` }">
                <div class="ch-h-content"><div class="ch-h-badge">R5·C{{ n }}</div><h2>四象 {{ n }}</h2></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ch-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #080812; color: #fff; height: 100vh; overflow: hidden; }
.ch-outer { height: 100%; overflow-y: auto; overflow-x: hidden; }
.ch-row { width: 100%; height: 100vh; position: relative; flex-shrink: 0; }
.ch-h-area { position: relative; width: 100%; height: 100%; }
.ch-h-pinned { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.ch-h-track { display: flex; will-change: transform; height: 100%; }
.ch-h-panel { min-width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; transition: opacity .3s; opacity: .6;
  &.ch-h-active { opacity: 1; }
}
.ch-h-content { text-align: center; z-index: 1; h2 { font-size: 3rem; font-weight: 900; margin: 0 0 8px; } }
.ch-h-badge { display: inline-block; padding: 5px 18px; border: 1px solid rgba(255,255,255,.2); border-radius: 16px; font-size: .7rem; letter-spacing: 2px; margin-bottom: 16px; opacity: .7; }
</style>

<style lang="scss">
.ch-nav-dots { position: fixed; right: 22px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 12px; }
.ch-nav-dot { width: 10px; height: 24px; border-radius: 5px; background: rgba(255,255,255,.12); cursor: pointer; transition: all .3s; border: none;
  &:hover { background: rgba(255,255,255,.3); }
  &.ch-active { background: #7c6cff; height: 36px; box-shadow: 0 0 14px rgba(124,108,255,.5); }
}
.ch-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #7c6cff, #a78bfa); }
.ch-page-indicator { position: fixed; top: 24px; right: 28px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 6px 18px; border-radius: 20px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.75); }
</style>
