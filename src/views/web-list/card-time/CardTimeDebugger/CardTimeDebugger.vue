<template>
  <section ref="containerRef" class="debugger-section">
    <div class="debug-bg"><div class="ide-grid"></div></div>
    <div ref="headerRef" class="dbg-header">
      <div ref="badgeRef" class="dbg-badge"><span>🔴</span><span>BREAKPOINT</span></div>
      <h1 ref="titleRef" class="dbg-title">DEBUGGER</h1>
      <p ref="subtitleRef" class="dbg-subtitle">断点调试 · 单步执行 · 变量监视</p>
    </div>
    <div class="ide-layout">
      <!-- 代码面板 -->
      <div ref="codeRef" class="code-panel">
        <div class="panel-header">main.ts</div>
        <div class="code-lines">
          <div v-for="(line, i) in codeLines" :key="i"
            :ref="el => lineRefs[i] = el as HTMLElement"
            class="code-line" :class="{ active: activeLine === i, breakpoint: line.bp }">
            <span class="line-bp" @click="line.bp = !line.bp">{{ line.bp ? '🔴' : '' }}</span>
            <span class="line-num">{{ i + 1 }}</span>
            <span class="line-code" v-html="line.code"></span>
          </div>
        </div>
      </div>
      <!-- 变量面板 -->
      <div ref="varsRef" class="vars-panel">
        <div class="panel-header">VARIABLES</div>
        <div class="var-list">
          <div v-for="(v, i) in variables" :key="i" class="var-item" :class="{ changed: v.changed }">
            <span class="var-name">{{ v.name }}</span>
            <span class="var-type">{{ v.type }}</span>
            <span class="var-value">{{ v.value }}</span>
          </div>
        </div>
        <div class="panel-header" style="margin-top:12px">CALL STACK</div>
        <div class="stack-list">
          <div v-for="(s, i) in callStack" :key="i" class="stack-item">
            <span class="stack-fn">{{ s.fn }}</span>
            <span class="stack-loc">{{ s.loc }}</span>
          </div>
        </div>
      </div>
    </div>
    <div ref="footerRef" class="dbg-footer">
      <div class="debug-controls">
        <span class="ctrl-btn" title="Continue">▶</span>
        <span class="ctrl-btn active" title="Step Over">⤵</span>
        <span class="ctrl-btn" title="Step Into">↓</span>
        <span class="ctrl-btn" title="Step Out">↑</span>
        <span class="ctrl-btn" title="Stop">⏹</span>
      </div>
      <span class="footer-text">SCROLL = STEP OVER</span>
    </div>
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
const codeRef = ref<HTMLElement | null>(null)
const varsRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const lineRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []
const activeLine = ref(-1)

const codeLines = reactive([
  { code: '<span class="kw">const</span> <span class="var">app</span> = <span class="fn">createApp</span>()', bp: true },
  { code: '<span class="kw">let</span> <span class="var">count</span> = <span class="num">0</span>', bp: false },
  { code: '<span class="kw">const</span> <span class="var">data</span> = <span class="fn">fetchAPI</span>(<span class="str">"/users"</span>)', bp: true },
  { code: '<span class="var">count</span> = <span class="var">data</span>.<span class="prop">length</span>', bp: false },
  { code: '<span class="kw">if</span> (<span class="var">count</span> > <span class="num">5</span>) {', bp: true },
  { code: '  <span class="fn">processData</span>(<span class="var">data</span>)', bp: false },
  { code: '  <span class="var">count</span> = <span class="fn">optimize</span>(<span class="var">count</span>)', bp: false },
  { code: '}', bp: false },
  { code: '<span class="fn">render</span>(<span class="var">app</span>, <span class="var">count</span>)', bp: true },
  { code: '<span class="cm">// Done</span>', bp: false },
])

const variables = reactive([
  { name: 'app', type: 'Object', value: 'null', changed: false },
  { name: 'count', type: 'number', value: '0', changed: false },
  { name: 'data', type: 'Array', value: '[]', changed: false },
])

const callStack = reactive([
  { fn: 'main()', loc: 'main.ts:1' },
])

// Variable states at each breakpoint line
const varStates = [
  [{ name: 'app', value: '{Vue}', changed: true }, { name: 'count', value: '0', changed: false }, { name: 'data', value: '[]', changed: false }],
  [{ name: 'app', value: '{Vue}', changed: false }, { name: 'count', value: '0', changed: false }, { name: 'data', value: '[...8]', changed: true }],
  [{ name: 'app', value: '{Vue}', changed: false }, { name: 'count', value: '8', changed: true }, { name: 'data', value: '[...8]', changed: false }],
  [{ name: 'app', value: '{Vue}', changed: false }, { name: 'count', value: '5', changed: true }, { name: 'data', value: '[...8]', changed: false }],
]

onMounted(() => {
  if (!containerRef.value) return
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  gsap.set(codeRef.value, { opacity: 0, x: -30 })
  gsap.set(varsRef.value, { opacity: 0, x: 30 })

  const introTl = gsap.timeline({ scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' } })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out' })
    .to([codeRef.value, varsRef.value], { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.3')
    .to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Step through breakpoints on scroll
  const bpIndices = codeLines.map((l, i) => l.bp ? i : -1).filter(i => i >= 0)
  const debugTl = gsap.timeline({
    scrollTrigger: {
      trigger: codeRef.value, start: 'top 70%', end: 'top 10%', scrub: 1.5, immediateRender: false,
      onUpdate: (self) => {
        const step = Math.min(bpIndices.length - 1, Math.floor(self.progress * bpIndices.length))
        activeLine.value = bpIndices[step]
        // Update variables
        if (varStates[step]) {
          varStates[step].forEach((vs, vi) => {
            if (variables[vi]) {
              variables[vi].value = vs.value
              variables[vi].changed = vs.changed
            }
          })
        }
        // Update call stack
        callStack[0].loc = `main.ts:${bpIndices[step] + 1}`
      }
    }
  })
  debugTl.to({}, { duration: 1 }) // placeholder
  cleanupFns.push(() => debugTl.kill())
})
onUnmounted(() => { cleanupFns.forEach(fn => fn()); ScrollTrigger.getAll().forEach(st => st.kill()) })
</script>

<style scoped lang="scss">
.debugger-section { width: 100vw; height: 100vh; background: #1e1e1e; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.debug-bg { position: absolute; inset: 0; pointer-events: none; .ide-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(60,60,80,0.03) 1px, transparent 1px); background-size: 100% 22px; } }
.dbg-header { position: relative; z-index: 10; text-align: center; margin-bottom: 12px;
  .dbg-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 28px; border-radius: 40px; border: 1px solid rgba(255,80,80,0.15); background: rgba(255,80,80,0.05); backdrop-filter: blur(10px); margin-bottom: 10px; font-size: 11px; letter-spacing: 5px; color: rgba(255,120,120,0.7); }
  .dbg-title { font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px; font-family: 'Courier New', monospace; background: linear-gradient(135deg, #f87171, #fbbf24, #f87171); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0 0 6px; filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2)); }
  .dbg-subtitle { font-size: 16px; color: rgba(180,180,200,0.5); letter-spacing: 6px; margin: 0; }
}
.ide-layout { position: relative; z-index: 10; display: flex; gap: 12px; width: 90%; max-width: 850px; }
.code-panel { flex: 1.5; border-radius: 20px; background: #252526; border: 1px solid rgba(80,80,100,0.15); overflow: hidden; }
.vars-panel { flex: 1; border-radius: 20px; background: #252526; border: 1px solid rgba(80,80,100,0.15); overflow: hidden; }
.panel-header { padding: 8px 12px; font-size: 10px; letter-spacing: 2px; color: rgba(180,180,200,0.5); background: rgba(30,30,40,0.8); border-bottom: 1px solid rgba(80,80,100,0.1); font-family: 'Courier New', monospace; }
.code-lines { padding: 4px 0; }
.code-line { display: flex; align-items: center; gap: 0; padding: 2px 8px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 22px; transition: background 0.2s;
  &.active { background: rgba(255,200,50,0.08); }
  &.breakpoint .line-num { color: rgba(255,80,80,0.7); }
  .line-bp { width: 18px; text-align: center; font-size: 8px; cursor: pointer; }
  .line-num { width: 24px; text-align: right; color: rgba(140,140,160,0.3); font-size: 11px; margin-right: 12px; }
  .line-code { color: rgba(220,220,240,0.85); :deep(.kw) { color: #c586c0; } :deep(.var) { color: #9cdcfe; } :deep(.fn) { color: #dcdcaa; } :deep(.str) { color: #ce9178; } :deep(.num) { color: #b5cea8; } :deep(.prop) { color: #4fc1ff; } :deep(.cm) { color: rgba(100,140,80,0.6); } }
}
.var-list { padding: 8px; }
.var-item { display: flex; gap: 8px; align-items: center; padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 11px; transition: background 0.3s;
  &.changed { background: rgba(255,200,50,0.08); }
  .var-name { color: #9cdcfe; min-width: 50px; } .var-type { color: rgba(140,140,160,0.4); font-size: 9px; } .var-value { color: #ce9178; margin-left: auto; }
}
.stack-list { padding: 8px; }
.stack-item { display: flex; justify-content: space-between; padding: 3px 8px; font-family: 'Courier New', monospace; font-size: 10px;
  .stack-fn { color: #dcdcaa; } .stack-loc { color: rgba(140,140,160,0.4); }
}
.dbg-footer { position: relative; z-index: 10; margin-top: 14px; text-align: center;
  .debug-controls { display: flex; gap: 6px; justify-content: center; margin-bottom: 8px;
    .ctrl-btn { width: 28px; height: 28px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: rgba(200,200,220,0.5); background: rgba(60,60,80,0.3); border: 1px solid rgba(80,80,100,0.15); cursor: pointer;
      &.active { color: #fbbf24; background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.2); }
    }
  }
  .footer-text { font-size: 14px; letter-spacing: 3px; color: rgba(180,180,200,0.3); font-family: 'Courier New', monospace; }
}
</style>

