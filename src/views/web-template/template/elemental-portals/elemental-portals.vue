<script setup lang="ts">
/**
 * ==================== Elemental Portals ====================
 * 元素之门 —— 7面板分别对应7种元素过渡：burn(火)/liquid(水)/wind(风)/shatter(土)/fade(光)/glitch(暗)/vortex(虚空)
 * 每个元素之间的切换使用匹配该元素的过渡动画，形成完整的元素循环。
 */
import { onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const totalPanels = 7
let vh = 0
let currentIndex = 0

let scrollArea: HTMLElement | null = null
let stage: HTMLElement | null = null
let progressBar: HTMLElement | null = null
let navDots: HTMLElement | null = null
let panels: HTMLElement[] = []
let mainTL: gsap.core.Timeline | null = null

// 元素类型与对应过渡
const elements = ['fire', 'water', 'wind', 'earth', 'light', 'shadow', 'void']

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'ep-nav-dot' + (i === 0 ? ' ep-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.ep-nav-dot').forEach((dot, i) => dot.classList.toggle('ep-active', i === index))
  const el = document.querySelector('.ep-page-indicator .ep-current')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}

function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const targetTop = (scrollArea?.offsetTop || 0) + index * vh
  window.scrollTo({ top: targetTop, behavior: 'smooth' })
}

function onKeydown(e: KeyboardEvent) {
  const keyMap: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }
  if (keyMap[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(keyMap[e.key]) : goToPanel(currentIndex + keyMap[e.key]) }
}

let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) { const diff = touchStartY - e.changedTouches[0].clientY; if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1)) }

function addFireSparks(panel: HTMLElement) {
  const container = document.createElement('div')
  container.className = 'ep-sparks'
  container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:3;'
  for (let s = 0; s < 30; s++) {
    const spark = document.createElement('div')
    spark.style.cssText = `position:absolute;width:3px;height:3px;background:#ff6b35;border-radius:50%;left:${50 + (Math.random()-0.5)*30}%;top:${50 + (Math.random()-0.5)*30}%;opacity:0;`
    container.appendChild(spark)
  }
  panel.appendChild(container)
  return container
}

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  gsap.set(panels, { opacity: 1, filter: 'none', clipPath: 'none', scale: 1 })

  for (let i = 0; i < segments; i++) {
    const curElem = elements[i]
    const nextElem = elements[i + 1]
    const sparks = i === 0 ? addFireSparks(panels[i]) : null

    switch (curElem) {
      case 'fire': // burn: 烧灼消散 + 火花
        if (sparks) {
          gsap.set(sparks.querySelectorAll('div'), { opacity: 0, scale: 0 })
          tl.to(sparks.querySelectorAll('div'), {
            opacity: 1, scale: 1, duration: 0.3, stagger: { each: 0.01, from: 'random' }
          }, i)
          tl.to(sparks.querySelectorAll('div'), {
            y: () => (Math.random() - 0.5) * 500, x: () => (Math.random() - 0.5) * 300,
            opacity: 0, scale: 0, duration: 0.5, stagger: { each: 0.015, from: 'random' }
          }, i + 0.25)
        }
        tl.to(panels[i], { filter: 'brightness(3) saturate(0)', opacity: 0, duration: 0.5, ease: 'power2.in' }, i + 0.3)
        break
      case 'water': // liquid: 液体波纹收缩
        tl.to(panels[i], { clipPath: 'circle(0% at 50% 50%)', filter: 'blur(8px)', duration: 0.5, ease: 'power3.in' }, i)
        tl.to(panels[i], { opacity: 0, duration: 0.2 }, i + 0.5)
        break
      case 'wind': // wind: 风卷残云（blur+scale+translate）
        tl.to(panels[i], { filter: 'blur(20px)', x: '30%', scale: 0.6, opacity: 0, duration: 0.6, ease: 'power3.in' }, i)
        break
      case 'earth': // shatter: 碎裂下沉
        tl.to(panels[i], { y: '40%', scale: 0.8, opacity: 0, filter: 'grayscale(1) blur(4px)', duration: 0.5, ease: 'power3.in' }, i)
        break
      case 'light': // fade: 纯光闪烁
        tl.to(panels[i], { filter: 'brightness(5)', opacity: 0, duration: 0.4, ease: 'power2.in' }, i)
        break
      case 'shadow': // glitch: 数字故障
        tl.to(panels[i], { filter: 'brightness(2) saturate(0.5) hue-rotate(90deg)', opacity: 0, duration: 0.4, ease: 'power3.in' }, i)
        break
    }

    // 下一屏入场
    switch (nextElem) {
      case 'water': // liquid 圆形扩散
        tl.fromTo(panels[i + 1],
          { clipPath: 'circle(0% at 50% 50%)', filter: 'blur(10px) brightness(2)', opacity: 0 },
          { clipPath: 'circle(100% at 50% 50%)', filter: 'blur(0px) brightness(1)', opacity: 1, duration: 0.5, ease: 'power3.out' },
          i + 0.45
        )
        tl.call(() => { panels[i + 1].style.clipPath = 'none' }, [], i + 1.0)
        break
      case 'wind': // 风吹入
        tl.fromTo(panels[i + 1],
          { x: '-40%', filter: 'blur(15px)', scale: 0.7, opacity: 0 },
          { x: '0%', filter: 'blur(0px)', scale: 1, opacity: 1, duration: 0.55, ease: 'power4.out' },
          i + 0.45
        )
        break
      case 'earth': // 从下升上
        tl.fromTo(panels[i + 1],
          { y: '50%', scale: 0.9, opacity: 0, filter: 'blur(6px)' },
          { y: '0%', scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'back.out(1.4)' },
          i + 0.45
        )
        break
      case 'light': // 光芒闪现
        tl.fromTo(panels[i + 1],
          { filter: 'brightness(6) blur(4px)', scale: 1.2, opacity: 0 },
          { filter: 'brightness(1) blur(0px)', scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' },
          i + 0.45
        )
        break
      case 'shadow': // 黑暗吞噬
        tl.fromTo(panels[i + 1],
          { filter: 'brightness(0) saturate(0)', scale: 1.1, opacity: 0 },
          { filter: 'brightness(1) saturate(1)', scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' },
          i + 0.45
        )
        break
      case 'void': // 涡旋卷入
        tl.fromTo(panels[i + 1],
          { rotateZ: 180, scale: 0.1, opacity: 0, filter: 'blur(8px)' },
          { rotateZ: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'back.out(1.7)' },
          i + 0.45
        )
        break
      case 'fire': // 火焰燃起
        tl.fromTo(panels[i + 1],
          { filter: 'brightness(3) saturate(2) hue-rotate(30deg)', scale: 0.5, opacity: 0 },
          { filter: 'brightness(1) saturate(1) hue-rotate(0deg)', scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
          i + 0.45
        )
        break
    }

    if (sparks) tl.call(() => { sparks.remove() }, [], i + 1.2)
  }
  return tl
}

function startTimeline() {
  const tl = buildTimeline(); mainTL = tl
  ScrollTrigger.create({
    trigger: scrollArea, start: 'top top', end: 'bottom bottom', scrub: 0.8,
    animation: tl,
    onUpdate: (self) => { const idx = Math.round(self.progress * (totalPanels - 1)); if (idx !== currentIndex) { currentIndex = idx; updateUI(idx) } }
  })
}

function killCurrent() {
  ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() })
  mainTL?.kill(); mainTL = null; gsap.set(panels, { clearProps: 'all' })
  panels.forEach(p => p.querySelectorAll('.ep-sparks').forEach(el => el.remove()))
}

function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('epScrollArea') as HTMLElement; stage = document.getElementById('epStage') as HTMLElement
  progressBar = document.getElementById('epProgressBar'); navDots = document.getElementById('epNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.ep-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}

function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="ep-page">
    <div id="epProgressBar" class="ep-progress-bar"></div>
    <nav id="epNavDots" class="ep-nav-dots"></nav>
    <div class="ep-page-indicator"><span class="ep-current">1</span><span class="ep-total"> / {{ totalPanels }}</span></div>
    <div id="epScrollArea" class="ep-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="epStage" class="ep-stage">
        <section class="ep-panel ep-panel-0 ep-fire"><div class="ep-content"><h2>01</h2></div></section>
        <section class="ep-panel ep-panel-1 ep-water"><div class="ep-content"><h2>02</h2></div></section>
        <section class="ep-panel ep-panel-2 ep-wind"><div class="ep-content"><h2>03</h2></div></section>
        <section class="ep-panel ep-panel-3 ep-earth"><div class="ep-content"><h2>04</h2></div></section>
        <section class="ep-panel ep-panel-4 ep-light"><div class="ep-content"><h2>05</h2></div></section>
        <section class="ep-panel ep-panel-5 ep-shadow"><div class="ep-content"><h2>06</h2></div></section>
        <section class="ep-panel ep-panel-6 ep-void"><div class="ep-content"><h2>07</h2></div></section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ep-page { font-family: 'Noto Sans SC', -apple-system, sans-serif; background: #0a0a0a; color: #fff; }
.ep-scroll-area { position: relative; }
.ep-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.ep-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::before { content: ''; position: absolute; inset: 20px; border: 1px solid rgba(255,255,255,.08); border-radius: 20px; pointer-events: none; z-index: 1; }
}
.ep-content { text-align: center; z-index: 2; h2 { font-size: 6rem; font-weight: 900; margin: 0; letter-spacing: 4px; } }
.ep-fire { background: radial-gradient(circle at 50% 80%, #ff4400, #1a0a00); }
.ep-water { background: radial-gradient(circle at 50% 50%, #0066cc, #000a1a); }
.ep-wind { background: radial-gradient(circle at 50% 30%, #88ccff, #0a1a2a); }
.ep-earth { background: radial-gradient(circle at 50% 90%, #8b6914, #1a1000); }
.ep-light { background: radial-gradient(circle at 50% 50%, #ffffff, #1a1a2e); .ep-content h2 { color: #1a1a2e; } }
.ep-shadow { background: radial-gradient(circle at 50% 50%, #220044, #050510); }
.ep-void { background: radial-gradient(circle at 50% 50%, #0a0a2e, #020208); }
@media (max-width: 768px) { .ep-content { h2 { font-size: 3.5rem; } } }
</style>

<style lang="scss">
.ep-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.ep-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.15); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(255,255,255,.4); transform: scale(1.3); }
  &.ep-active { background: #ffa500; border-color: rgba(255,165,0,.4); transform: scale(1.4); box-shadow: 0 0 20px rgba(255,165,0,.6); }
}
.ep-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #ff4400, #0066cc, #88ccff, #8b6914, #ffffff, #8800cc, #0a0a2e); box-shadow: 0 0 10px rgba(255,165,0,.4); }
.ep-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(0,0,0,.4); backdrop-filter: blur(12px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(255,255,255,.1); color: rgba(255,255,255,.8); }
@media (max-width: 768px) { .ep-nav-dots { gap: 10px; } .ep-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
