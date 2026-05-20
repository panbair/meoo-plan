<template>
  <section ref="containerRef" class="sort-section">
    <div class="sort-bg"><div class="algo-grid"></div></div>
    <div ref="headerRef" class="sort-header">
      <div ref="badgeRef" class="sort-badge"><span>📊</span><span>ALGORITHM</span></div>
      <h1 ref="titleRef" class="sort-title">SORT ALGO</h1>
      <p ref="subtitleRef" class="sort-subtitle">冒泡排序 · 可视化交换 · 逐步执行</p>
    </div>
    <div ref="barsRef" class="bars-container">
      <div v-for="(bar, i) in bars" :key="bar.id" :ref="el => barRefs[i] = el as HTMLElement"
        class="sort-bar" :class="{ comparing: bar.comparing, sorted: bar.sorted }"
        :style="{ height: bar.height + 'px', '--bar-hue': bar.hue }">
        <div class="bar-inner"><span class="bar-value">{{ bar.value }}</span></div>
        <span class="bar-label">{{ bar.label }}</span>
      </div>
    </div>
    <div class="sort-info">
      <div class="info-item"><span class="i-label">比较</span><span class="i-value">{{ comparisons }}</span></div>
      <div class="info-item"><span class="i-label">交换</span><span class="i-value">{{ swaps }}</span></div>
      <div class="info-item"><span class="i-label">算法</span><span class="i-value">Bubble</span></div>
    </div>
    <div ref="footerRef" class="sort-footer"><span>SCROLL TO STEP</span></div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const barsRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const barRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []
const comparisons = ref(0)
const swaps = ref(0)

interface Bar { id: number; value: number; height: number; hue: number; label: string; comparing: boolean; sorted: boolean }
const initVals = [38, 72, 15, 91, 54, 27, 63, 45]
const bars = reactive<Bar[]>(initVals.map((v, i) => ({ id: i, value: v, height: v * 3 + 30, hue: (v / 100) * 260, label: String.fromCharCode(65 + i), comparing: false, sorted: false })))

interface Step { type: 'compare' | 'swap' | 'sorted'; i: number; j: number }
const steps: Step[] = []
const arr = [...initVals]
for (let i = 0; i < arr.length - 1; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
    steps.push({ type: 'compare', i: j, j: j + 1 })
    if (arr[j] > arr[j + 1]) { steps.push({ type: 'swap', i: j, j: j + 1 }); [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]] }
  }
  steps.push({ type: 'sorted', i: arr.length - i - 1, j: 0 })
}
steps.push({ type: 'sorted', i: 0, j: 0 })

onMounted(() => {
  if (!containerRef.value) return
  const allBars = barRefs.value.filter(Boolean) as HTMLElement[]
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  gsap.set(allBars, { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' })

  const introTl = gsap.timeline({ scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' } })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out' })
    .to(allBars, { opacity: 1, scaleY: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.3)' }, '-=0.3')
    .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  let cur = -1
  ScrollTrigger.create({
    trigger: barsRef.value, start: 'top 70%', end: 'top 5%',
    onUpdate: (self) => {
      const target = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
      if (target <= cur) return
      while (cur < target) {
        cur++
        const s = steps[cur]
        bars.forEach(b => b.comparing = false)
        if (s.type === 'compare') { comparisons.value++; bars[s.i].comparing = true; bars[s.j].comparing = true }
        else if (s.type === 'swap') {
          swaps.value++
          const t = { v: bars[s.i].value, h: bars[s.i].height, hu: bars[s.i].hue }
          bars[s.i].value = bars[s.j].value; bars[s.i].height = bars[s.j].height; bars[s.i].hue = bars[s.j].hue
          bars[s.j].value = t.v; bars[s.j].height = t.h; bars[s.j].hue = t.hu
          if (allBars[s.i]) gsap.fromTo(allBars[s.i], { y: -15 }, { y: 0, duration: 0.3, ease: 'bounce.out' })
          if (allBars[s.j]) gsap.fromTo(allBars[s.j], { y: -15 }, { y: 0, duration: 0.3, ease: 'bounce.out' })
        } else { bars[s.i].sorted = true }
      }
    }
  })
})
onUnmounted(() => { cleanupFns.forEach(fn => fn()); ScrollTrigger.getAll().forEach(st => st.kill()) })
</script>

<style scoped lang="scss">
.sort-section { width: 100vw; height: 100vh; background: linear-gradient(180deg, #0c0e14 0%, #141820 50%, #0c0e14 100%); position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.sort-bg { position: absolute; inset: 0; pointer-events: none; .algo-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(80,120,200,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(80,120,200,0.02) 1px, transparent 1px); background-size: 40px 40px; } }
.sort-header { position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .sort-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px; border-radius: 40px; border: 1px solid rgba(100,180,255,0.15); background: rgba(100,180,255,0.05); backdrop-filter: blur(10px); margin-bottom: 12px; font-size: 11px; letter-spacing: 5px; color: rgba(140,200,255,0.7); }
  .sort-title { font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 8px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2)); }
  .sort-subtitle { font-size: 16px; color: rgba(140,170,220,0.5); letter-spacing: 6px; margin: 0; }
}
.bars-container { position: relative; z-index: 10; display: flex; gap: 10px; align-items: flex-end; height: 320px; }
.sort-bar { width: 70px; border-radius: 8px 8px 0 0; transition: height 0.3s; position: relative;
  .bar-inner { width: 100%; height: 100%; border-radius: 8px 8px 0 0; background: linear-gradient(180deg, hsla(var(--bar-hue),60%,55%,0.9), hsla(var(--bar-hue),50%,35%,0.95)); border: 1px solid hsla(var(--bar-hue),50%,50%,0.15); display: flex; align-items: flex-start; justify-content: center; padding-top: 8px;
    .bar-value { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.9); font-family: 'Courier New', monospace; }
  }
  .bar-label { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 9px; color: rgba(140,170,220,0.4); }
  &.comparing .bar-inner { border-color: rgba(255,200,50,0.5); box-shadow: 0 0 15px rgba(255,200,50,0.15); }
  &.sorted .bar-inner { border-color: rgba(74,222,128,0.3); box-shadow: 0 0 10px rgba(74,222,128,0.1); }
}
.sort-info { position: relative; z-index: 10; display: flex; gap: 24px; margin-top: 30px;
  .info-item { display: flex; flex-direction: column; align-items: center; gap: 2px;
    .i-label { font-size: 9px; color: rgba(140,170,220,0.4); } .i-value { font-size: 16px; font-weight: 700; color: rgba(160,200,255,0.8); font-family: 'Courier New', monospace; }
  }
}
.sort-footer { position: relative; z-index: 10; margin-top: 50px; font-size: 14px; letter-spacing: 3px; color: rgba(140,170,220,0.3); font-family: 'Courier New', monospace; }
</style>
