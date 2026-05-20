<template>
  <section ref="containerRef" class="terminal-section">
    <div class="terminal-bg"><div class="scanline"></div></div>
    <div ref="headerRef" class="term-header">
      <div ref="badgeRef" class="term-badge"><span>></span><span>TERMINAL</span></div>
      <h1 ref="titleRef" class="term-title">TERMINAL</h1>
      <p ref="subtitleRef" class="term-subtitle">命令行 · 逐行输出 · 绿色荧光</p>
    </div>
    <div ref="termRef" class="terminal-window">
      <div class="window-bar">
        <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
        <span class="window-title">user@machine:~$</span>
      </div>
      <div class="window-body">
        <div v-for="(line, i) in lines" :key="i" :ref="el => lineRefs[i] = el as HTMLElement"
          class="term-line" :class="line.type">
          <span v-if="line.type === 'cmd'" class="prompt">$</span>
          <span class="line-text">{{ line.visible }}</span>
          <span v-if="line.type === 'cmd' && line.showCursor" class="cursor">█</span>
          <div v-if="line.type === 'card'" class="inline-card">
            <div class="ic-inner">
              <span class="ic-idx">{{ line.cardIdx }}</span>
              <h3>{{ line.cardTitle }}</h3>
              <p>{{ line.cardDesc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div ref="footerRef" class="term-footer"><span>cat /dev/urandom | matrix</span></div>
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
const termRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const lineRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

interface TLine { type: string; full: string; visible: string; showCursor: boolean; cardIdx?: string; cardTitle?: string; cardDesc?: string }
const lines = reactive<TLine[]>([
  { type: 'cmd', full: 'ls -la ./components', visible: '', showCursor: true },
  { type: 'out', full: 'total 6 components found', visible: '', showCursor: false },
  { type: 'card', full: '', visible: '', showCursor: false, cardIdx: '01', cardTitle: 'Core Engine', cardDesc: '核心渲染引擎' },
  { type: 'cmd', full: 'cat README.md | head -5', visible: '', showCursor: true },
  { type: 'out', full: '# Project Meoo-Plan v2.0', visible: '', showCursor: false },
  { type: 'card', full: '', visible: '', showCursor: false, cardIdx: '02', cardTitle: 'API Gateway', cardDesc: '接口网关层' },
  { type: 'cmd', full: 'npm run build --prod', visible: '', showCursor: true },
  { type: 'out', full: '✓ Build successful (2.3s)', visible: '', showCursor: false },
  { type: 'card', full: '', visible: '', showCursor: false, cardIdx: '03', cardTitle: 'Deploy Agent', cardDesc: '部署自动化' },
  { type: 'cmd', full: 'git push origin main', visible: '', showCursor: true },
  { type: 'out', full: '→ remote: Deployed to production', visible: '', showCursor: false },
  { type: 'card', full: '', visible: '', showCursor: false, cardIdx: '04', cardTitle: 'Monitor', cardDesc: '实时监控面板' },
])

onMounted(() => {
  if (!containerRef.value) return
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  const allLines = lineRefs.value.filter(Boolean) as HTMLElement[]
  gsap.set(allLines, { opacity: 0, y: 10 })

  const introTl = gsap.timeline({ scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' } })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out' })
    .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  const termTl = gsap.timeline({ scrollTrigger: { trigger: termRef.value, start: 'top 75%', end: 'top 5%', scrub: 1.5, immediateRender: false } })
  lines.forEach((line, i) => {
    const el = allLines[i]
    if (!el) return
    termTl.to(el, { opacity: 1, y: 0, duration: 0.03 }, i * 0.07)
    if (line.full) {
      const chars = line.full.length
      termTl.to({}, { duration: 0.05, onUpdate: function() { line.visible = line.full.substring(0, Math.floor(this.progress() * chars)) } }, i * 0.07 + 0.01)
    }
  })
  cleanupFns.push(() => termTl.kill())
})
onUnmounted(() => { cleanupFns.forEach(fn => fn()); ScrollTrigger.getAll().forEach(st => st.kill()) })
</script>

<style scoped lang="scss">
.terminal-section { width: 100vw; height: 100vh; background: #0a0a0a; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.terminal-bg { position: absolute; inset: 0; pointer-events: none; .scanline { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.01) 2px, rgba(0,255,0,0.01) 4px); } }
.term-header { position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .term-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px; border-radius: 40px; border: 1px solid rgba(0,255,0,0.15); background: rgba(0,255,0,0.03); backdrop-filter: blur(10px); margin-bottom: 12px; font-size: 11px; letter-spacing: 5px; color: rgba(0,255,0,0.6); font-family: 'Courier New', monospace; }
  .term-title { font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace; color: #00ff00; margin: 0 0 8px; text-shadow: 0 0 20px rgba(0,255,0,0.3); }
  .term-subtitle { font-size: 16px; color: rgba(0,255,0,0.4); letter-spacing: 6px; margin: 0; font-family: 'Courier New', monospace; }
}
.terminal-window { position: relative; z-index: 10; width: 90%; max-width: 700px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(0,255,0,0.1); background: rgba(0,10,0,0.8); }
.window-bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: rgba(20,30,20,0.9); border-bottom: 1px solid rgba(0,255,0,0.06);
  .dot { width: 10px; height: 10px; border-radius: 50%; &.red { background: #ff5f56; } &.yellow { background: #ffbd2e; } &.green { background: #27c93f; } }
  .window-title { margin-left: 10px; font-size: 10px; color: rgba(0,255,0,0.4); font-family: 'Courier New', monospace; }
}
.window-body { padding: 16px; font-family: 'Courier New', monospace; min-height: 340px; }
.term-line { margin-bottom: 4px; display: flex; align-items: flex-start; gap: 6px; flex-wrap: wrap;
  .prompt { color: rgba(0,255,0,0.7); font-weight: 700; }
  .line-text { color: rgba(0,255,0,0.85); font-size: 12px; }
  .cursor { color: rgba(0,255,0,0.8); animation: blink 1s steps(1) infinite; }
  &.out .line-text { color: rgba(0,200,0,0.6); }
  &.card { flex-direction: column; }
}
@keyframes blink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
.inline-card { width: 100%; margin: 4px 0;
  .ic-inner { padding: 20px 18px; border-radius: 16px; background: rgba(0,30,0,0.6); border: 1px solid rgba(0,255,0,0.08); border-left: 3px solid rgba(0,255,0,0.3);
    .ic-idx { font-size: 8px; color: rgba(0,255,0,0.3); }
    h3 { font-size: 13px; font-weight: 700; color: rgba(0,255,0,0.9); margin: 2px 0; }
    p { font-size: 10px; color: rgba(0,200,0,0.5); margin: 0; }
  }
}
.term-footer { position: relative; z-index: 10; margin-top: 50px; font-size: 14px; letter-spacing: 3px; color: rgba(0,255,0,0.2); font-family: 'Courier New', monospace; }
</style>
