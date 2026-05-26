<script setup lang="ts">
/**
 * ==================== Calligraphy Flow ====================
 * 书法流韵 —— reveal(宣纸展开) + strips(竹简竖条) + wind(墨迹吹散) + swing(运笔顿挫)
 * 东方美学：竖直揭开仿宣纸展卷 → 竖条交错竹简翻开 → 墨迹被风吹散 → 毛笔收锋顿挫停顿
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

function createNavDots() {
  if (!navDots) return
  navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button')
    dot.className = 'cf-nav-dot' + (i === 0 ? ' cf-active' : '')
    dot.addEventListener('click', () => goToPanel(i))
    navDots.appendChild(dot)
  }
}

function updateUI(index: number) {
  document.querySelectorAll('.cf-nav-dot').forEach((dot, i) => dot.classList.toggle('cf-active', i === index))
  const el = document.querySelector('.cf-page-indicator .cf-current')
  if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}

function goToPanel(index: number) {
  index = Math.max(0, Math.min(index, totalPanels - 1))
  const targetTop = (scrollArea?.offsetTop || 0) + index * vh
  window.scrollTo({ top: targetTop, behavior: 'smooth' })
}

function onKeydown(e: KeyboardEvent) { const keyMap: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }; if (keyMap[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(keyMap[e.key]) : goToPanel(currentIndex + keyMap[e.key]) } }
let touchStartY = 0
function onTouchStart(e: TouchEvent) { touchStartY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) { const diff = touchStartY - e.changedTouches[0].clientY; if (Math.abs(diff) > 50) goToPanel(currentIndex + (diff > 0 ? 1 : -1)) }

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })
  const stripCount = 6

  for (let i = 0; i < segments; i++) {
    const cur = panels[i]
    const nxt = panels[i + 1]

    // === 阶段1: 宣纸展开 (reveal) ===
    // 覆盖层从上向下卷起，如同宣纸展卷
    const overlay = cur.querySelector('.cf-reveal-overlay') as HTMLElement
    tl.set(overlay, { scaleY: 1, transformOrigin: '50% 0%', opacity: 1 }, i)
    tl.to(overlay, { scaleY: 0, duration: 0.45, ease: 'power2.inOut' }, i)
    tl.to(cur, { opacity: 0, duration: 0.2 }, i + 0.45)

    // === 阶段2: 竹简竖条 (strips) ===
    // 6条竖向条带从下到上依次揭开
    tl.set(nxt, { opacity: 0 }, i + 0.4)
    tl.set(nxt, { opacity: 1 }, i + 0.5)
    for (let s = 0; s < stripCount; s++) {
      tl.fromTo(nxt,
        { clipPath: `inset(${100 - (s + 1) * (100 / stripCount)}% ${(stripCount - s - 1) * (99 / stripCount)}% ${s * (99 / stripCount)}% ${s * (99 / stripCount)}%)`, opacity: 0 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.3, ease: 'power2.inOut' },
        i + 0.5 + s * 0.06
      )
    }
    tl.call(() => { nxt.style.clipPath = 'none' }, [], i + 1.0)

    // === 阶段3: 墨迹吹散 (wind) ===
    // 粒子墨迹从面板散开
    const inkContainer = nxt.querySelector('.cf-ink-container') as HTMLElement
    if (inkContainer) {
      const inks = inkContainer.querySelectorAll('.cf-ink-particle')
      inks.forEach((ink, idx) => {
        tl.fromTo(ink,
          { x: 0, y: 0, scale: 0, opacity: 0 },
          { x: (idx % 2 === 0 ? -80 : 80) + Math.random() * 60, y: (Math.random() - 0.5) * 120, scale: 1.5, opacity: 0, duration: 0.4, ease: 'power2.out' },
          i + 0.9 + idx * 0.03
        )
      })
      tl.to(inks, { opacity: 0, duration: 0.1 }, i + 1.4)
    }

    // === 阶段4: 运笔顿挫 (swing) ===
    // 整页像毛笔收锋一样摆动还原
    tl.fromTo(nxt,
      { rotationZ: 8, rotateX: -5, scale: 0.85, filter: 'blur(3px) brightness(0.6)', transformOrigin: '0% 100%' },
      { rotateX: 0, rotationZ: 0, scale: 1, filter: 'blur(0px) brightness(1)', duration: 0.5, ease: 'elastic.out(1, 0.4)' },
      i + 1.05
    )
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

function killCurrent() { ScrollTrigger.getAll().forEach(st => { if (st.vars.trigger === scrollArea) st.kill() }); mainTL?.kill(); mainTL = null; gsap.set(panels, { clearProps: 'all' }) }
function init() {
  vh = window.innerHeight
  scrollArea = document.getElementById('cfScrollArea') as HTMLElement; stage = document.getElementById('cfStage') as HTMLElement
  progressBar = document.getElementById('cfProgressBar'); navDots = document.getElementById('cfNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.cf-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="cf-page">
    <div id="cfProgressBar" class="cf-progress-bar"></div>
    <nav id="cfNavDots" class="cf-nav-dots"></nav>
    <div class="cf-page-indicator"><span class="cf-current">1</span><span class="cf-total"> / {{ totalPanels }}</span></div>
    <div id="cfScrollArea" class="cf-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="cfStage" class="cf-stage">
        <section class="cf-panel cf-panel-0">
          <div class="cf-reveal-overlay" :style="{ background: '#1a1a1a' }"></div>
          <div class="cf-content"><h2>壹</h2></div>
        </section>
        <section class="cf-panel cf-panel-1">
          <div class="cf-reveal-overlay" :style="{ background: '#1a1a1a' }"></div>
          <div class="cf-ink-container">
            <span v-for="n in 20" :key="n" class="cf-ink-particle" :style="{
              position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(30,30,30,.6)',
              left: 30 + Math.random() * 40 + '%', top: 30 + Math.random() * 40 + '%'
            }"></span>
          </div>
          <div class="cf-content"><h2>贰</h2></div>
        </section>
        <section class="cf-panel cf-panel-2">
          <div class="cf-reveal-overlay" :style="{ background: '#1a1a1a' }"></div>
          <div class="cf-ink-container">
            <span v-for="n in 20" :key="n" class="cf-ink-particle" :style="{
              position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(30,30,30,.6)',
              left: 30 + Math.random() * 40 + '%', top: 30 + Math.random() * 40 + '%'
            }"></span>
          </div>
          <div class="cf-content"><h2>叁</h2></div>
        </section>
        <section class="cf-panel cf-panel-3">
          <div class="cf-reveal-overlay" :style="{ background: '#1a1a1a' }"></div>
          <div class="cf-ink-container">
            <span v-for="n in 20" :key="n" class="cf-ink-particle" :style="{
              position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(30,30,30,.6)',
              left: 30 + Math.random() * 40 + '%', top: 30 + Math.random() * 40 + '%'
            }"></span>
          </div>
          <div class="cf-content"><h2>肆</h2></div>
        </section>
        <section class="cf-panel cf-panel-4">
          <div class="cf-reveal-overlay" :style="{ background: '#1a1a1a' }"></div>
          <div class="cf-ink-container">
            <span v-for="n in 20" :key="n" class="cf-ink-particle" :style="{
              position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(30,30,30,.6)',
              left: 30 + Math.random() * 40 + '%', top: 30 + Math.random() * 40 + '%'
            }"></span>
          </div>
          <div class="cf-content"><h2>伍</h2></div>
        </section>
        <section class="cf-panel cf-panel-5">
          <div class="cf-reveal-overlay" :style="{ background: '#1a1a1a' }"></div>
          <div class="cf-ink-container">
            <span v-for="n in 20" :key="n" class="cf-ink-particle" :style="{
              position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(30,30,30,.6)',
              left: 30 + Math.random() * 40 + '%', top: 30 + Math.random() * 40 + '%'
            }"></span>
          </div>
          <div class="cf-content"><h2>陆</h2></div>
        </section>
        <section class="cf-panel cf-panel-6">
          <div class="cf-reveal-overlay" :style="{ background: '#1a1a1a' }"></div>
          <div class="cf-content"><h2>柒</h2></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cf-page { font-family: 'Noto Serif SC', 'SimSun', serif; background: #f5f0e8; color: #2c2c2c; }
.cf-scroll-area { position: relative; }
.cf-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.cf-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  &::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 60%, rgba(245,240,232,.3) 100%); pointer-events: none; z-index: 1; }
}
.cf-reveal-overlay { position: absolute; inset: 0; z-index: 5; opacity: 0; transform-origin: 50% 0%; }
.cf-ink-container { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
.cf-content { text-align: center; z-index: 2; position: relative;
  h2 { font-size: 7rem; font-weight: 300; margin: 0; letter-spacing: 20px; color: #2c2c2c; text-shadow: 2px 2px 0 rgba(0,0,0,.05); }
}
.cf-panel-0 { background: linear-gradient(180deg, #f5f0e8, #ebe3d8); }
.cf-panel-1 { background: linear-gradient(180deg, #ebe3d8, #e0d5c5); }
.cf-panel-2 { background: linear-gradient(180deg, #e0d5c5, #d8caba); }
.cf-panel-3 { background: linear-gradient(180deg, #d8caba, #cfbfad); }
.cf-panel-4 { background: linear-gradient(180deg, #cfbfad, #c8b8a5); }
.cf-panel-5 { background: linear-gradient(180deg, #c8b8a5, #c0b09a); }
.cf-panel-6 { background: linear-gradient(180deg, #c0b09a, #f5f0e8); }
@media (max-width: 768px) { .cf-content { h2 { font-size: 4rem; letter-spacing: 10px; } } }
</style>

<style lang="scss">
.cf-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.cf-nav-dot { width: 12px; height: 12px; border-radius: 2px; background: rgba(44,44,44,.15); cursor: pointer; border: 2px solid transparent; transition: all .3s;
  &:hover { background: rgba(44,44,44,.4); transform: scale(1.3); }
  &.cf-active { background: #2c2c2c; border-color: rgba(44,44,44,.2); transform: scale(1.3); }
}
.cf-progress-bar { position: fixed; top: 0; left: 0; height: 2px; z-index: 1001; width: 0%; background: #2c2c2c; }
.cf-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(44,44,44,.06); backdrop-filter: blur(8px); padding: 8px 22px; border-radius: 4px; font-size: .9rem; border: 1px solid rgba(44,44,44,.1); color: rgba(44,44,44,.8); }
@media (max-width: 768px) { .cf-nav-dots { gap: 10px; } .cf-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
