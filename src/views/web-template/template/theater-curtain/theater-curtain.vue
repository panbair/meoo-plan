<script setup lang="ts">
/**
 * ==================== Theater Curtain ====================
 * 剧场帷幕 —— swing(追光灯扫过) + reveal(幕布拉开) + zoom-blur(虚焦转场) + explode(爆裂高潮)
 * 舞台剧三幕结构：追光灯摆动扫视 → 幕布从中间往两侧拉开 → 虚焦转场 → 爆裂碎片高潮散开后谢幕
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
  if (!navDots) return; navDots.innerHTML = ''
  for (let i = 0; i < totalPanels; i++) {
    const dot = document.createElement('button'); dot.className = 'tc-nav-dot' + (i === 0 ? ' tc-active' : '')
    dot.addEventListener('click', () => goToPanel(i)); navDots.appendChild(dot)
  }
}
function updateUI(index: number) {
  document.querySelectorAll('.tc-nav-dot').forEach((d, i) => d.classList.toggle('tc-active', i === index))
  const el = document.querySelector('.tc-page-indicator .tc-current'); if (el) el.textContent = String(index + 1)
  if (progressBar) progressBar.style.width = ((index) / (totalPanels - 1) * 100) + '%'
}
function goToPanel(index: number) { index = Math.max(0, Math.min(index, totalPanels - 1)); window.scrollTo({ top: (scrollArea?.offsetTop || 0) + index * vh, behavior: 'smooth' }) }
function onKeydown(e: KeyboardEvent) { const m: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1, Home: 0, End: totalPanels - 1 }; if (m[e.key] !== undefined) { e.preventDefault(); e.key === 'Home' || e.key === 'End' ? goToPanel(m[e.key]) : goToPanel(currentIndex + m[e.key]) } }
let tsY = 0
function onTouchStart(e: TouchEvent) { tsY = e.touches[0].clientY }
function onTouchEnd(e: TouchEvent) { const d = tsY - e.changedTouches[0].clientY; if (Math.abs(d) > 50) goToPanel(currentIndex + (d > 0 ? 1 : -1)) }

function buildTimeline(): gsap.core.Timeline {
  gsap.set(panels, { clearProps: 'all' })
  gsap.set(panels, { position: 'absolute', width: '100vw', height: '100vh' })
  const tl = gsap.timeline({ paused: true })
  const segments = totalPanels - 1
  panels.forEach((p, i) => { p.style.zIndex = String(totalPanels - i) })

  for (let i = 0; i < segments; i++) {
    const cur = panels[i]
    const nxt = panels[i + 1]
    const spotlight = cur.querySelector('.tc-spotlight') as HTMLElement
    const curtainL = cur.querySelector('.tc-curtain-l') as HTMLElement
    const curtainR = cur.querySelector('.tc-curtain-r') as HTMLElement

    // === 阶段1: 追光灯扫过 (swing) ===
    // 圆形聚光灯从右扫到左，最后收缩消失
    if (spotlight) {
      tl.fromTo(spotlight,
        { x: '80%', y: '-30%', scale: 1, opacity: 0.9 },
        { x: '-80%', y: '20%', scale: 0.6, opacity: 0.7, duration: 0.2, ease: 'power2.inOut' }, i)
      tl.to(spotlight, { x: '0%', y: '0%', scale: 0, opacity: 0, duration: 0.2, ease: 'power3.in' }, i + 0.2)
    }

    // === 阶段2: 幕布拉开 (reveal) ===
    // 两片幕布从中线向两侧拉开
    if (curtainL && curtainR) {
      tl.to(curtainL, { x: '-100%', duration: 0.4, ease: 'power3.inOut' }, i + 0.15)
      tl.to(curtainR, { x: '100%', duration: 0.4, ease: 'power3.inOut' }, i + 0.15)
    }
    tl.to(cur, { opacity: 0, duration: 0.2 }, i + 0.55)

    // === 阶段3: 虚焦转场 (zoom-blur) ===
    // 新画面从虚焦到清晰，像镜头对焦
    tl.set(nxt, { scale: 1.3, filter: 'blur(12px) brightness(0.4)', opacity: 0 }, i + 0.45)
    tl.to(nxt, { opacity: 1, duration: 0.15 }, i + 0.5)
    tl.to(nxt, {
      scale: 1, filter: 'blur(0px) brightness(1)',
      duration: 0.5, ease: 'power2.out'
    }, i + 0.55)

    // === 阶段4: 爆裂高潮 (explode) ===
    // 碎片粒子从画面中向外爆裂散开（装饰性效果）
    const explodeContainer = nxt.querySelector('.tc-explode-container') as HTMLElement
    if (explodeContainer) {
      const fragments = explodeContainer.querySelectorAll('.tc-explode-frag')
      fragments.forEach((frag, idx) => {
        tl.fromTo(frag, {
          x: 0, y: 0, scale: 1, opacity: 0
        }, {
          x: (Math.random() - 0.5) * 300,
          y: (Math.random() - 0.5) * 300,
          scale: 0, opacity: 0,
          duration: 0.35, ease: 'power3.out'
        }, i + 1.0 + idx * 0.02)
      })
    }

    // 最终画面微微回调稳定
    tl.to(nxt, { scale: 0.97, duration: 0.05, ease: 'power2.in' }, i + 1.3)
    tl.to(nxt, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.4)' }, i + 1.35)
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
  scrollArea = document.getElementById('tcScrollArea') as HTMLElement; stage = document.getElementById('tcStage') as HTMLElement
  progressBar = document.getElementById('tcProgressBar'); navDots = document.getElementById('tcNavDots')
  if (!scrollArea || !stage) return
  panels = gsap.utils.toArray('.tc-panel') as HTMLElement[]
  document.addEventListener('keydown', onKeydown); document.addEventListener('touchstart', onTouchStart, { passive: true }); document.addEventListener('touchend', onTouchEnd, { passive: true })
  createNavDots(); updateUI(0); startTimeline()
}
function destroy() { killCurrent(); document.removeEventListener('keydown', onKeydown); document.removeEventListener('touchstart', onTouchStart); document.removeEventListener('touchend', onTouchEnd) }
onMounted(() => nextTick(init))
onUnmounted(destroy)
</script>

<template>
  <div class="tc-page">
    <div id="tcProgressBar" class="tc-progress-bar"></div>
    <nav id="tcNavDots" class="tc-nav-dots"></nav>
    <div class="tc-page-indicator"><span class="tc-current">1</span><span class="tc-total"> / {{ totalPanels }}</span></div>
    <div id="tcScrollArea" class="tc-scroll-area" :style="{ height: totalPanels * 100 + 'vh' }">
      <div id="tcStage" class="tc-stage">
        <!-- 面板 0: 序章 -->
        <section class="tc-panel tc-panel-0">
          <div class="tc-spotlight"></div>
          <div class="tc-curtain tc-curtain-l"></div>
          <div class="tc-curtain tc-curtain-r"></div>
          <div class="tc-content"><h2>序</h2></div>
        </section>
        <!-- 面板 1: 第一幕 -->
        <section class="tc-panel tc-panel-1">
          <div class="tc-spotlight"></div>
          <div class="tc-curtain tc-curtain-l"></div>
          <div class="tc-curtain tc-curtain-r"></div>
          <div class="tc-explode-container">
            <span v-for="n in 16" :key="n" class="tc-explode-frag" :style="{
              position:'absolute',width:'20px',height:'20px',borderRadius:'2px',
              background:`hsl(${n*22},70%,60%)`,opacity:'.6',
              left:30+Math.random()*40+'%', top:30+Math.random()*40+'%'
            }"></span>
          </div>
          <div class="tc-content"><h2>一</h2></div>
        </section>
        <!-- 面板 2: 第二幕 -->
        <section class="tc-panel tc-panel-2">
          <div class="tc-spotlight"></div>
          <div class="tc-curtain tc-curtain-l"></div>
          <div class="tc-curtain tc-curtain-r"></div>
          <div class="tc-explode-container">
            <span v-for="n in 16" :key="n" class="tc-explode-frag" :style="{
              position:'absolute',width:'20px',height:'20px',borderRadius:'50%',
              background:`hsl(${n*22+60},70%,60%)`,opacity:'.6',
              left:30+Math.random()*40+'%', top:30+Math.random()*40+'%'
            }"></span>
          </div>
          <div class="tc-content"><h2>二</h2></div>
        </section>
        <!-- 面板 3-6: 后续幕 -->
        <section class="tc-panel tc-panel-3">
          <div class="tc-spotlight"></div>
          <div class="tc-curtain tc-curtain-l"></div>
          <div class="tc-curtain tc-curtain-r"></div>
          <div class="tc-explode-container">
            <span v-for="n in 16" :key="n" class="tc-explode-frag" :style="{
              position:'absolute',width:'16px',height:'16px',borderRadius:'3px',
              background:`hsl(${n*22+120},70%,60%)`,opacity:'.6',
              left:30+Math.random()*40+'%', top:30+Math.random()*40+'%'
            }"></span>
          </div>
          <div class="tc-content"><h2>三</h2></div>
        </section>
        <section class="tc-panel tc-panel-4">
          <div class="tc-spotlight"></div>
          <div class="tc-curtain tc-curtain-l"></div>
          <div class="tc-curtain tc-curtain-r"></div>
          <div class="tc-explode-container">
            <span v-for="n in 16" :key="n" class="tc-explode-frag" :style="{
              position:'absolute',width:'12px',height:'24px',borderRadius:'2px',
              background:`hsl(${n*22+180},70%,60%)`,opacity:'.6',
              left:30+Math.random()*40+'%', top:30+Math.random()*40+'%'
            }"></span>
          </div>
          <div class="tc-content"><h2>四</h2></div>
        </section>
        <section class="tc-panel tc-panel-5">
          <div class="tc-spotlight"></div>
          <div class="tc-curtain tc-curtain-l"></div>
          <div class="tc-curtain tc-curtain-r"></div>
          <div class="tc-content"><h2>五</h2></div>
        </section>
        <!-- 面板 6: 谢幕 -->
        <section class="tc-panel tc-panel-6">
          <div class="tc-content"><h2>谢</h2></div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tc-page { font-family: 'Noto Serif SC', 'Georgia', serif; background: #0d0d0d; color: #e8d5b0; }
.tc-scroll-area { position: relative; }
.tc-stage { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }
.tc-panel {
  position: absolute; inset: 0; width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.tc-spotlight {
  position: absolute; z-index: 10; pointer-events: none;
  width: 800px; height: 800px; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,240,200,.25) 0%, rgba(255,240,200,.05) 30%, transparent 70%);
  transform: translate(-50%, -50%);
}
.tc-curtain {
  position: absolute; top: 0; width: 52%; height: 100%; z-index: 5; pointer-events: none;
  background: linear-gradient(0deg, #1a0a08, #2a0a08, #1a0a08);
  &::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,.08) 4px, rgba(0,0,0,.08) 6px); }
}
.tc-curtain-l { left: 0; box-shadow: inset -4px 0 20px rgba(0,0,0,.6); }
.tc-curtain-r { right: 0; box-shadow: inset 4px 0 20px rgba(0,0,0,.6); }
.tc-explode-container { position: absolute; inset: 0; z-index: 3; pointer-events: none; }
.tc-content { text-align: center; z-index: 2; position: relative;
  h2 { font-size: 5.5rem; font-weight: 300; margin: 0; letter-spacing: 16px; color: #e8d5b0; text-shadow: 0 0 40px rgba(232,213,176,.2); }
}
.tc-panel-0 { background: radial-gradient(ellipse at center, #1a1008 0%, #0d0d0d 60%); }
.tc-panel-1 { background: radial-gradient(ellipse at center, #1a1408 0%, #0d0d0d 60%); }
.tc-panel-2 { background: radial-gradient(ellipse at center, #1a0a14 0%, #0d0d0d 60%); }
.tc-panel-3 { background: radial-gradient(ellipse at center, #0a141a 0%, #0d0d0d 60%); }
.tc-panel-4 { background: radial-gradient(ellipse at center, #141a0a 0%, #0d0d0d 60%); }
.tc-panel-5 { background: radial-gradient(ellipse at center, #0a1a14 0%, #0d0d0d 60%); }
.tc-panel-6 { background: radial-gradient(ellipse at center, #1a0a08 0%, #0d0d0d 60%); }
@media (max-width: 768px) { .tc-content { h2 { font-size: 3.5rem; letter-spacing: 8px; } } .tc-spotlight { width: 400px; height: 400px; } }
</style>

<style lang="scss">
.tc-nav-dots { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); z-index: 1000; display: flex; gap: 14px; }
.tc-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(232,213,176,.12); cursor: pointer; border: 1px solid rgba(232,213,176,.2); transition: all .3s;
  &:hover { background: rgba(232,213,176,.4); transform: scale(1.3); }
  &.tc-active { background: #e8d5b0; border-color: rgba(232,213,176,.5); transform: scale(1.4); box-shadow: 0 0 16px rgba(232,213,176,.4); }
}
.tc-progress-bar { position: fixed; top: 0; left: 0; height: 3px; z-index: 1001; width: 0%; background: linear-gradient(90deg, #e8d5b0, #b89a6b, #e8d5b0); }
.tc-page-indicator { position: fixed; top: 30px; right: 30px; z-index: 1000; background: rgba(13,13,13,.6); backdrop-filter: blur(8px); padding: 8px 22px; border-radius: 25px; font-size: .9rem; border: 1px solid rgba(232,213,176,.15); color: rgba(232,213,176,.8); }
@media (max-width: 768px) { .tc-nav-dots { gap: 10px; } .tc-page-indicator { top: 16px; right: 14px; font-size: .8rem; padding: 6px 16px; } }
</style>
