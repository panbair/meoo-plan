<script setup lang="ts">
/**
 * ==================== Cube Navigator ====================
 * 魔方导航 —— infinite-scroll + 3D 立方旋转
 * 外层 infinite-scroll：纵向切换魔方面
 * 每面内部：4个子面板排列为 3D 立方体面，rotateX/rotateY 翻转到对应面
 * 整体形成：竖向选面 → 面内3D立方旋转查看内容
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalFaces = 6
const faceNames = ['前', '右', '后', '左', '上', '下']
const faceColors = ['#1a3a5e', '#1a5e3a', '#5e1a3a', '#3a1a5e', '#5e5a1a', '#1a5e5e']

let vh = 0, currentFace = 0, isJumping = false, touchY = 0

let outerContainer: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let scrollTriggers: ScrollTrigger[] = []

function createNavDots() {
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalFaces; i++) {
    const dot = document.createElement('button'); dot.className = 'cn-nav-dot' + (i === 0 ? ' cn-active' : '')
    dot.addEventListener('click', () => goToFace(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.cn-nav-dot').forEach((d, i) => d.classList.toggle('cn-active', i === index))
  const el = document.querySelector('.cn-indicator .cn-cur'); if (el) el.textContent = faceNames[index]
  if (progressBar) progressBar.style.width = ((index + 1) / totalFaces * 100) + '%'
}
function goToFace(index: number) {
  if (!outerContainer) return
  index = ((index % totalFaces) + totalFaces) % totalFaces
  currentFace = index; updateUI(index)
  outerContainer.scrollTop = index * vh
}
function onOuterScroll() {
  if (!outerContainer || isJumping) return
  const st = outerContainer.scrollTop; const max = outerContainer.scrollHeight - vh
  let idx = Math.round(st / vh) % totalFaces
  if (st >= max - 10) { isJumping = true; outerContainer.scrollTop = 2; setTimeout(() => isJumping = false, 500); idx = 0 }
  else if (st <= 10) { isJumping = true; outerContainer.scrollTop = max - 2; setTimeout(() => isJumping = false, 500); idx = totalFaces - 1 }
  if (idx !== currentFace) { currentFace = idx; updateUI(idx) }
}
function onKeydown(e: KeyboardEvent) {
  const m: Record<string, number> = { ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1, Home: 0, End: totalFaces - 1 }
  if (m[e.key] !== undefined) { e.preventDefault(); goToFace(e.key === 'Home' || e.key === 'End' ? m[e.key] : currentFace + m[e.key]) }
}
function onTS(e: TouchEvent) { touchY = e.touches[0].clientY }
function onTE(e: TouchEvent) { const d = touchY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToFace(currentFace + (d > 0 ? 1 : -1)) }

function init() {
  vh = window.innerHeight
  outerContainer = document.getElementById('cnOuter') as HTMLElement
  progressBar = document.getElementById('cnProgress')
  navDots = document.getElementById('cnNav')
  if (!outerContainer) return

  const firstFace = document.querySelector('.cn-face') as HTMLElement
  if (firstFace) {
    const clone = firstFace.cloneNode(true) as HTMLElement
    clone.setAttribute('data-cloned', 'true')
    outerContainer.appendChild(clone)
  }

  const snapST = ScrollTrigger.create({
    trigger: outerContainer, start: 'top top', end: `+=${totalFaces * 100}%`,
    snap: { snapTo: 1 / totalFaces, duration: { min: 0.25, max: 0.45 }, ease: 'power1.inOut' }
  })
  scrollTriggers.push(snapST)

  // 每面的立方体子面板旋转动画
  document.querySelectorAll('.cn-face:not([data-cloned])').forEach((face, fi) => {
    const cube = face.querySelector('.cn-cube-inner') as HTMLElement
    if (!cube) return
    // 根据面号做不同的3D旋转
    const rotations = [
      'rotateX(0deg) rotateY(0deg)',
      'rotateX(0deg) rotateY(-90deg)',
      'rotateX(0deg) rotateY(-180deg)',
      'rotateX(0deg) rotateY(90deg)',
      'rotateX(90deg) rotateY(0deg)',
      'rotateX(-90deg) rotateY(0deg)'
    ]
    gsap.set(cube, { transform: rotations[fi] })
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
  <div class="cn-page">
    <div id="cnProgress" class="cn-progress-bar"></div>
    <nav id="cnNav" class="cn-nav-dots"></nav>
    <div class="cn-indicator"><span class="cn-cur">{{ faceNames[0] }}</span><span class="cn-tot">面</span></div>

    <div id="cnOuter" class="cn-outer">
      <section v-for="(name, fi) in faceNames" :key="fi" class="cn-face" :style="{ background: `radial-gradient(ellipse at center, ${faceColors[fi]} 0%, #080810 100%)` }">
        <div class="cn-cube-scene">
          <div class="cn-cube-inner" :style="{ width: '60vmin', height: '60vmin' }">
            <!-- 魔方的4个可见子面 -->
            <div class="cn-sub-face cn-face-front" :style="{ background: faceColors[fi], opacity: .9 }">
              <div class="cn-face-label">{{ name }}面</div>
              <div class="cn-face-grid">
                <span v-for="g in 9" :key="g" class="cn-grid-cell" :style="{ background: `hsl(${fi*60+g*20},50%,50%)` }"></span>
              </div>
            </div>
            <div class="cn-sub-face cn-face-right" :style="{ background: faceColors[(fi+1)%6], opacity: .7 }">
              <div class="cn-face-label">{{ faceNames[(fi+1)%6] }}面</div>
            </div>
            <div class="cn-sub-face cn-face-bottom" :style="{ background: faceColors[(fi+2)%6], opacity: .7 }">
              <div class="cn-face-label">{{ faceNames[(fi+2)%6] }}面</div>
            </div>
            <div class="cn-sub-face cn-face-left" :style="{ background: faceColors[(fi+3)%6], opacity: .7 }">
              <div class="cn-face-label">{{ faceNames[(fi+3)%6] }}面</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cn-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; height: 100vh; overflow: hidden; color: #fff; }
.cn-outer { height: 100%; overflow-y: auto; overflow-x: hidden; }
.cn-face { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
.cn-cube-scene { perspective: 900px; width: 60vmin; height: 60vmin; }
.cn-cube-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .6s ease; }
.cn-sub-face { position: absolute; width: 60vmin; height: 60vmin; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px solid rgba(255,255,255,.15); border-radius: 12px; }
.cn-face-front { transform: translateZ(30vmin); }
.cn-face-right { transform: rotateY(90deg) translateZ(30vmin); }
.cn-face-bottom { transform: rotateX(-90deg) translateZ(30vmin); }
.cn-face-left { transform: rotateY(-90deg) translateZ(30vmin); }
.cn-face-label { font-size: 1.5rem; font-weight: 900; opacity: .8; margin-bottom: 16px; }
.cn-face-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.cn-grid-cell { width: 4vmin; height: 4vmin; border-radius: 4px; border: 1px solid rgba(255,255,255,.15); }
</style>

<style lang="scss">
.cn-nav-dots { position: fixed; right: 18px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.cn-nav-dot { width: 10px; height: 10px; border-radius: 4px; background: rgba(255,255,255,.12); cursor: pointer; transition: all .3s; border: none;
  &:hover { background: rgba(255,255,255,.35); }
  &.cn-active { background: #f0a060; transform: scale(1.4) rotate(45deg); box-shadow: 0 0 14px rgba(240,160,96,.5); }
}
.cn-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #f0a060, #e08050); }
.cn-indicator { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 6px 18px; border-radius: 20px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.75); }
</style>
