<script setup lang="ts">
/**
 * ==================== Elevator Lobby ====================
 * 电梯大堂 —— infinite-scroll + fake-horizontal-scroll 嵌套
 * 外层 infinite-scroll：纵向滚动切换楼层（0F~5F）
 * 每层内部 fake-horizontal：横向画廊，每层有不同数量/风格的展品
 * 上楼看不同楼层的展览
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalFloors = 6
const exhibitsPerFloor = [5, 4, 6, 3, 5, 4]
const floorNames = ['科技馆', '美术馆', '博物馆', '天文馆', '自然馆', '未来馆']

let vw = 0, vh = 0, currentFloor = 0
let isJumping = false, touchY = 0

let outerContainer: HTMLElement | null = null
let floorIndicator: HTMLElement | null = null
let elevatorPanel: HTMLElement | null = null
let hScrollTriggers: ScrollTrigger[] = []

function updateFloorIndicator(index: number) {
  document.querySelectorAll('.el-floor-btn').forEach((b, i) => b.classList.toggle('el-floor-active', i === index))
  if (floorIndicator) {
    const fl = document.querySelector('.el-floor-name') as HTMLElement; if (fl) fl.textContent = floorNames[index]
    const fn = document.querySelector('.el-floor-num') as HTMLElement; if (fn) fn.textContent = String(index)
  }
}
function goToFloor(index: number) {
  if (!outerContainer) return
  index = ((index % totalFloors) + totalFloors) % totalFloors
  currentFloor = index; updateFloorIndicator(index)
  outerContainer.scrollTop = index * vh
}
function onOuterScroll() {
  if (!outerContainer || isJumping) return
  const st = outerContainer.scrollTop; const max = outerContainer.scrollHeight - vh
  let idx = Math.round(st / vh) % totalFloors
  if (st >= max - 10) { isJumping = true; outerContainer.scrollTop = 2; setTimeout(() => isJumping = false, 500); idx = 0 }
  else if (st <= 10) { isJumping = true; outerContainer.scrollTop = max - 2; setTimeout(() => isJumping = false, 500); idx = totalFloors - 1 }
  if (idx !== currentFloor) { currentFloor = idx; updateFloorIndicator(idx) }
}
function onKeydown(e: KeyboardEvent) {
  const m: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1, Home: 0, End: totalFloors - 1 }
  if (m[e.key] !== undefined) { e.preventDefault(); goToFloor(e.key === 'Home' || e.key === 'End' ? m[e.key] : currentFloor + m[e.key]) }
}
function onTS(e: TouchEvent) { touchY = e.touches[0].clientY }
function onTE(e: TouchEvent) { const d = touchY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToFloor(currentFloor + (d > 0 ? 1 : -1)) }

function init() {
  vw = window.innerWidth; vh = window.innerHeight
  outerContainer = document.getElementById('elOuter') as HTMLElement
  floorIndicator = document.getElementById('elIndicator')
  elevatorPanel = document.getElementById('elElevatorPanel')
  if (!outerContainer) return

  // 克隆首层
  const firstFloor = document.querySelector('.el-floor') as HTMLElement
  if (firstFloor) {
    const clone = firstFloor.cloneNode(true) as HTMLElement
    clone.setAttribute('data-cloned', 'true')
    outerContainer.appendChild(clone)
  }

  // outer snap
  const snapST = ScrollTrigger.create({
    trigger: outerContainer, start: 'top top', end: `+=${totalFloors * 100}%`,
    snap: { snapTo: 1 / totalFloors, duration: { min: 0.2, max: 0.4 }, ease: 'power1.inOut' }
  })
  hScrollTriggers.push(snapST)

  // 每层的横向画廊
  document.querySelectorAll('.el-floor:not([data-cloned])').forEach((floor, fi) => {
    const track = floor.querySelector('.el-h-track') as HTMLElement
    const area = floor.querySelector('.el-h-area') as HTMLElement
    if (!track || !area) return
    const count = exhibitsPerFloor[fi]
    area.style.height = (count * 100) + 'vh'

    gsap.to(track, {
      x: () => -((count - 1) * vw),
      ease: 'none',
      scrollTrigger: {
        trigger: area, start: 'top top', end: 'bottom bottom', scrub: 0.5,
        onUpdate: (self) => {
          const ci = Math.round(self.progress * (count - 1))
          track.querySelectorAll('.el-h-panel').forEach((p, pi) => p.classList.toggle('el-h-active', pi === ci))
        }
      }
    })
  })

  // 创建电梯按钮面板
  if (elevatorPanel) {
    elevatorPanel.innerHTML = ''
    for (let i = 0; i < totalFloors; i++) {
      const btn = document.createElement('button')
      btn.className = 'el-floor-btn' + (i === 0 ? ' el-floor-active' : '')
      btn.innerHTML = `<span class="el-fn">${i}F</span><span class="el-fl">${floorNames[i]}</span>`
      btn.addEventListener('click', () => goToFloor(i))
      elevatorPanel.appendChild(btn)
    }
  }

  outerContainer.addEventListener('scroll', onOuterScroll, { passive: true })
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('touchstart', onTS, { passive: true })
  document.addEventListener('touchend', onTE, { passive: true })
  updateFloorIndicator(0)
}
function destroy() {
  hScrollTriggers.forEach(st => st.kill()); hScrollTriggers = []
  outerContainer?.removeEventListener('scroll', onOuterScroll)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('touchstart', onTS); document.removeEventListener('touchend', onTE)
}
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="el-page">
    <!-- 电梯面板 (左侧) -->
    <div id="elElevatorPanel" class="el-elevator-panel"></div>
    <!-- 楼层指示 -->
    <div id="elIndicator" class="el-floor-indicator">
      <span class="el-floor-num">0</span><span class="el-floor-unit">F</span>
      <span class="el-floor-name">{{ floorNames[0] }}</span>
    </div>

    <div id="elOuter" class="el-outer">
      <section v-for="(cnt, fi) in exhibitsPerFloor" :key="fi" class="el-floor" :style="{ background: `linear-gradient(180deg, hsl(${fi*60}, 24%, 92%), hsl(${fi*60+20},16%,5%))` }">
        <div class="el-h-area">
          <div class="el-h-pinned">
            <div class="el-h-track">
              <div v-for="n in cnt" :key="n" class="el-h-panel" :class="n===1&&'el-h-active'" :style="{ background: `linear-gradient(135deg, hsl(${(n-1)*360/cnt+fi*30}, 26%, 86%), hsl(${(n-1)*360/cnt+fi*30+20}, 14%, 92%))` }">
                <div class="el-h-content">
                  <div class="el-h-num">{{ String(n).padStart(2, '0') }}</div>
                  <h3>{{ floorNames[fi] }}·展品{{ n }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.el-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #f5f0f8; color: #1a1a2e; height: 100vh; overflow: hidden; }
.el-outer { height: 100%; overflow-y: auto; overflow-x: hidden; }
.el-floor { width: 100%; height: 100vh; position: relative; flex-shrink: 0; }
.el-h-area { position: relative; width: 100%; height: 100%; }
.el-h-pinned { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.el-h-track { display: flex; will-change: transform; height: 100%; }
.el-h-panel { min-width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; opacity: .5; transition: opacity .35s;
  &.el-h-active { opacity: 1; }
}
.el-h-content { text-align: center; z-index: 1;
  .el-h-num { font-size: 7rem; font-weight: 900; opacity: .08; line-height: 1; margin-bottom: -20px; }
  h3 { font-size: 2rem; font-weight: 700; margin: 0; }
}
</style>

<style lang="scss">
.el-elevator-panel { position: fixed; left: 16px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 6px; background: rgba(0,0,0,.35); backdrop-filter: blur(12px); border-radius: 14px; padding: 8px; border: 1px solid rgba(255,255,255,.08); }
.el-floor-btn { display: flex; align-items: center; gap: 10px; padding: 6px 14px; border-radius: 10px; background: transparent; border: 1px solid transparent; color: rgba(26, 26, 46,.4); cursor: pointer; transition: all .25s; font-family: inherit; width: 100%;
  .el-fn { font-size: .8rem; font-weight: 700; width: 22px; text-align: center; }
  .el-fl { font-size: .7rem; white-space: nowrap; }
  &:hover { background: rgba(26, 26, 46,.08); color: rgba(26, 26, 46,.8); border-color: rgba(26, 26, 46,.1); }
  &.el-floor-active { background: rgba(99,130,255,.25); border-color: rgba(99,130,255,.4); color: #1a1a2e;
    .el-fn { color: #a0b8ff; }
  }
}
.el-floor-indicator { position: fixed; top: 24px; right: 24px; z-index: 1000; display: flex; align-items: baseline; gap: 4px; background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(12px); padding: 6px 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,.08); }
.el-floor-num { font-size: 1.4rem; font-weight: 900; color: #a0b8ff; }
.el-floor-unit { font-size: .65rem; color: rgba(26, 26, 46,.35); margin-right: 6px; }
.el-floor-name { font-size: .85rem; color: rgba(26, 26, 46,.7); }
</style>
