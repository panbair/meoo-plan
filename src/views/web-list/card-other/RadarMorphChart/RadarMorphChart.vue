<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { gsap } from 'gsap'

interface DataSet {
  name: string
  color: string
  values: number[]
  visible: boolean
}

const dimensions = ['速度', '准确率', '成本效益', '易用性', '扩展性', '安全性', '稳定性', '创新力']
const ringCount = 5
const maxValue = 100

const presets = [
  { label: 'Q1 vs Q2', indices: [0, 1] },
  { label: '产品对比', indices: [2, 3] },
  { label: '全部展示', indices: [0, 1, 2, 3] },
]

const datasets = reactive<DataSet[]>([
  { name: 'Q1 业绩', color: '#3b82f6', values: [85, 72, 90, 65, 78, 88, 70, 60], visible: true },
  { name: 'Q2 业绩', color: '#10b981', values: [70, 88, 75, 82, 90, 72, 85, 78], visible: true },
  { name: '产品 A', color: '#f59e0b', values: [92, 68, 55, 90, 60, 95, 88, 75], visible: false },
  { name: '产品 B', color: '#ef4444', values: [60, 95, 80, 70, 85, 60, 72, 92], visible: false },
])

const containerRef = ref<HTMLElement | null>(null)
const svgW = ref(800)
const svgH = ref(600)
const cxVal = computed(() => svgW.value / 2)
const cyVal = computed(() => svgH.value / 2)
const rad = computed(() => Math.min(svgW.value, svgH.value) * 0.32)
const hoveredAxis = ref(-1)
const hoveredDs = ref(-1)
const autoPlay = ref(false)
let autoTimer: number | null = null
let autoIdx = 0

const animVals = reactive<number[][]>(datasets.map(d => d.values.map(() => 0)))
const gridOp = ref(0)
const axisOp = ref(0)

const axes = computed(() => {
  const n = dimensions.length
  return dimensions.map((label, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    const r = rad.value
    return {
      label, angle: a,
      x: cxVal.value + Math.cos(a) * r,
      y: cyVal.value + Math.sin(a) * r,
      lx: cxVal.value + Math.cos(a) * (r + 28),
      ly: cyVal.value + Math.sin(a) * (r + 28),
    }
  })
})

const gridRings = computed(() => {
  const rings: string[] = []
  const n = dimensions.length
  for (let r = 1; r <= ringCount; r++) {
    const rr = (rad.value / ringCount) * r
    let p = ''
    for (let i = 0; i <= n; i++) {
      const a = (Math.PI * 2 * (i % n)) / n - Math.PI / 2
      p += (i === 0 ? 'M' : 'L') + `${cxVal.value + Math.cos(a) * rr},${cyVal.value + Math.sin(a) * rr}`
    }
    rings.push(p + 'Z')
  }
  return rings
})

function polyPath(vals: number[]) {
  const n = dimensions.length
  let p = ''
  vals.forEach((v, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    const r = (v / maxValue) * rad.value
    p += (i === 0 ? 'M' : 'L') + `${cxVal.value + Math.cos(a) * r},${cyVal.value + Math.sin(a) * r}`
  })
  return p + 'Z'
}

function ptPos(v: number, i: number) {
  const a = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2
  const r = (v / maxValue) * rad.value
  return { x: cxVal.value + Math.cos(a) * r, y: cyVal.value + Math.sin(a) * r }
}

function toggleDs(i: number) {
  datasets[i].visible = !datasets[i].visible
  if (datasets[i].visible) animIn(i); else animOut(i)
}

function animIn(i: number) {
  datasets[i].values.forEach((v, j) => {
    gsap.to(animVals[i], { [j]: v, duration: 0.8, delay: j * 0.05, ease: 'elastic.out(1,0.6)' })
  })
}
function animOut(i: number) {
  animVals[i].forEach((_, j) => {
    gsap.to(animVals[i], { [j]: 0, duration: 0.4, ease: 'power2.in' })
  })
}

function applyPreset(p: { indices: number[] }) {
  datasets.forEach((d, i) => {
    const show = p.indices.includes(i)
    if (show !== d.visible) { d.visible = show; show ? animIn(i) : animOut(i) }
  })
}

function toggleAuto() {
  autoPlay.value = !autoPlay.value
  if (autoPlay.value) autoTimer = window.setInterval(() => { autoIdx = (autoIdx + 1) % presets.length; applyPreset(presets[autoIdx]) }, 3000)
  else { if (autoTimer) clearInterval(autoTimer); autoTimer = null }
}

function updateSize() {
  if (!containerRef.value) return
  svgW.value = containerRef.value.clientWidth
  svgH.value = containerRef.value.clientHeight
}

onMounted(() => {
  updateSize()
  gsap.to(gridOp, { value: 1, duration: 0.8 })
  gsap.to(axisOp, { value: 1, duration: 0.8, delay: 0.3 })
  datasets.forEach((d, i) => { if (d.visible) d.values.forEach((v, j) => { gsap.to(animVals[i], { [j]: v, duration: 1, delay: 0.5 + j * 0.06 + i * 0.15, ease: 'elastic.out(1,0.5)' }) }) })
  window.addEventListener('resize', updateSize)
})

onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
  window.removeEventListener('resize', updateSize)
})
</script>

<template>
  <div class="radar-morph-chart" ref="containerRef">
    <div class="title-bar"><h2>📡 多维能力雷达图</h2><p>AI 产品能力对比 · 点击数据集切换</p></div>
    <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="radar-svg">
      <g :opacity="gridOp">
        <path v-for="(r, i) in gridRings" :key="i" :d="r" fill="none" :stroke="i === ringCount - 1 ? '#334155' : '#1e293b'" :stroke-width="i === ringCount - 1 ? 1.5 : 0.8" />
        <line v-for="(a, i) in axes" :key="'a'+i" :x1="cxVal" :y1="cyVal" :x2="a.x" :y2="a.y" :stroke="hoveredAxis===i?'#3b82f6':'#1e293b'" :stroke-width="hoveredAxis===i?2:0.8" style="transition:all .2s" />
        <text v-for="r in ringCount" :key="'rv'+r" :x="cxVal+4" :y="cyVal-(rad/ringCount)*r+4" fill="#475569" font-size="10">{{ (maxValue/ringCount)*r }}</text>
      </g>
      <g v-for="(ds, di) in datasets" :key="'d'+di">
        <template v-if="ds.visible">
          <path :d="polyPath(animVals[di])" :fill="ds.color+'22'" :stroke="ds.color" :stroke-width="hoveredDs===di?3:2" />
          <circle v-for="(v, vi) in animVals[di]" :key="vi" :cx="ptPos(v,vi).x" :cy="ptPos(v,vi).y" :r="hoveredAxis===vi?6:4" :fill="ds.color" stroke="#0b1120" stroke-width="2" style="transition:r .2s" />
        </template>
      </g>
      <g :opacity="axisOp">
        <text v-for="(a, i) in axes" :key="'l'+i" :x="a.lx" :y="a.ly" :text-anchor="a.lx<cxVal?'end':a.lx>cxVal+5?'start':'middle'" dominant-baseline="central" :fill="hoveredAxis===i?'#e2e8f0':'#94a3b8'" font-size="13" font-weight="bold" style="cursor:pointer;transition:fill .2s" @mouseenter="hoveredAxis=i" @mouseleave="hoveredAxis=-1">{{ a.label }}</text>
        <g v-if="hoveredAxis>=0">
          <text v-for="(ds, di) in datasets.filter(d=>d.visible)" :key="'hv'+di" :x="ptPos(animVals[datasets.indexOf(ds)][hoveredAxis],hoveredAxis).x" :y="ptPos(animVals[datasets.indexOf(ds)][hoveredAxis],hoveredAxis).y-14" text-anchor="middle" :fill="ds.color" font-size="12" font-weight="bold">{{ Math.round(animVals[datasets.indexOf(ds)][hoveredAxis]) }}</text>
        </g>
      </g>
    </svg>
    <div class="controls">
      <div class="legend">
        <div v-for="(ds,i) in datasets" :key="i" class="legend-item" :class="{active:ds.visible}" @click="toggleDs(i)" @mouseenter="hoveredDs=i" @mouseleave="hoveredDs=-1">
          <span class="dot" :style="{background:ds.visible?ds.color:'#334155'}"></span>{{ ds.name }}
        </div>
      </div>
      <div class="presets">
        <button v-for="(p,i) in presets" :key="i" class="pbtn" @click="applyPreset(p)">{{ p.label }}</button>
        <button class="pbtn" :class="{on:autoPlay}" @click="toggleAuto">{{ autoPlay?'⏸ 停止':'▶ 轮播' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radar-morph-chart{width:100vw;height:100vh;background:#0b1120;position:relative;overflow:hidden;font-family:'Microsoft YaHei',sans-serif;display:flex;align-items:center;justify-content:center}
.radar-svg{position:absolute;top:0;left:0;width:100%;height:100%}
.title-bar{position:absolute;top:24px;left:50%;transform:translateX(-50%);text-align:center;z-index:10;pointer-events:none}
.title-bar h2{color:#e2e8f0;font-size:22px;margin:0}
.title-bar p{color:#64748b;font-size:13px;margin:6px 0 0}
.controls{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;align-items:center;gap:12px}
.legend{display:flex;gap:16px}
.legend-item{display:flex;align-items:center;gap:6px;color:#64748b;font-size:13px;cursor:pointer;padding:4px 12px;border-radius:6px;transition:all .2s;border:1px solid transparent}
.legend-item.active{color:#e2e8f0;border-color:#334155;background:rgba(30,41,59,.6)}
.legend-item:hover{color:#e2e8f0}
.dot{width:10px;height:10px;border-radius:50%;transition:background .2s}
.presets{display:flex;gap:8px}
.pbtn{background:#1e293b;border:1px solid #334155;color:#94a3b8;padding:6px 16px;border-radius:6px;cursor:pointer;font-size:12px;transition:all .2s}
.pbtn:hover{background:#334155;color:#e2e8f0}
.pbtn.on{background:#3b82f6;border-color:#3b82f6;color:#fff}
</style>

