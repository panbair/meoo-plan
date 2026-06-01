<template>
  <div class="mat-section-143" ref="sectionRef">
    <!-- 数字雨画布 -->
    <canvas ref="matrixCanvasRef" class="mat-canvas-143"></canvas>

    <!-- 扫描线覆盖 -->
    <div class="mat-scanlines-143"></div>

    <!-- 内容 -->
    <div class="mat-content-143" ref="contentRef">
      <!-- 标题区 -->
      <div class="mat-header-143" ref="headerRef">
        <div class="mat-sys-143" ref="sysRef">
          <span class="mat-sys-dot-143"></span>
          SYSTEM.ONLINE · MATRIX.V2.0
        </div>
        <h1 class="mat-title-143">
          <span class="mat-title-line-143" ref="titleLine1Ref">数字</span>
          <span class="mat-title-line-143 mat-title-accent-143" ref="titleLine2Ref">矩阵</span>
        </h1>
        <div class="mat-decode-143" ref="decodeRef">
          <span v-for="(char, i) in decodeText" :key="i" class="mat-decode-char-143" :ref="el => setDecodeRef(el as HTMLElement, i)">{{ char }}</span>
        </div>
      </div>

      <!-- 数据终端 -->
      <div class="mat-terminal-143" ref="terminalRef">
        <div class="mat-terminal-header-143">
          <div class="mat-term-dots-143">
            <span></span><span></span><span></span>
          </div>
          <span class="mat-term-title-143">matrix_terminal@localhost</span>
        </div>
        <div class="mat-terminal-body-143">
          <div v-for="(line, i) in terminalLines" :key="i" class="mat-term-line-143" :ref="el => setTermLineRef(el as HTMLElement, i)">
            <span class="mat-term-prompt-143">{{ line.prompt }}</span>
            <span :class="['mat-term-text-143', line.type === 'code' ? 'mat-term-code-143' : line.type === 'success' ? 'mat-term-success-143' : '']">{{ line.text }}</span>
          </div>
        </div>
      </div>

      <!-- 信息卡片 -->
      <div class="mat-info-143" ref="infoRef">
        <div
          v-for="(item, i) in infoItems"
          :key="i"
          class="mat-info-card-143"
          :ref="el => setInfoRef(el as HTMLElement, i)"
        >
          <div class="mat-info-header-143">
            <span class="mat-info-id-143">{{ item.id }}</span>
            <span class="mat-info-status-143" :class="item.statusClass">{{ item.status }}</span>
          </div>
          <h3 class="mat-info-title-143">{{ item.title }}</h3>
          <p class="mat-info-desc-143">{{ item.desc }}</p>
          <div class="mat-info-progress-143">
            <div class="mat-info-prog-fill-143" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 唯一后缀: 143

const sectionRef = ref<HTMLElement | null>(null)
const matrixCanvasRef = ref<HTMLCanvasElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const sysRef = ref<HTMLElement | null>(null)
const titleLine1Ref = ref<HTMLElement | null>(null)
const titleLine2Ref = ref<HTMLElement | null>(null)
const decodeRef = ref<HTMLElement | null>(null)
const terminalRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)

const decodeText = '每一行代码，都是宇宙的语言'.split('')
const decodeCharRefs = ref<(HTMLElement | null)[]>([])
const termLineRefs = ref<(HTMLElement | null)[]>([])
const infoCardRefs = ref<(HTMLElement | null)[]>([])

const setDecodeRef = (el: HTMLElement | null, i: number) => { if (el) decodeCharRefs.value[i] = el }
const setTermLineRef = (el: HTMLElement | null, i: number) => { if (el) termLineRefs.value[i] = el }
const setInfoRef = (el: HTMLElement | null, i: number) => { if (el) infoCardRefs.value[i] = el }

const terminalLines = [
  { prompt: '> ', text: 'INIT matrix.core --mode=awakening', type: 'code' },
  { prompt: '  ', text: 'Loading consciousness modules...', type: 'normal' },
  { prompt: '  ', text: '[████████████████████] 100%', type: 'success' },
  { prompt: '> ', text: 'DECODE reality.stream --depth=∞', type: 'code' },
  { prompt: '  ', text: 'Reality is just a construct.', type: 'success' },
  { prompt: '  ', text: 'Choose your path: [1] Red Pill  [2] Blue Pill', type: 'normal' },
]

const infoItems = [
  { id: 'SYS_01', status: 'ACTIVE', statusClass: 'mat-status-active-143', title: '意识上传', desc: '将人类意识转化为数字信号，在虚拟空间中创造永生。每秒处理 10^15 次神经突触信号。', progress: 87 },
  { id: 'SYS_02', status: 'RUNNING', statusClass: 'mat-status-run-143', title: '矩阵渗透', desc: '深层算法穿透现实的数字层，在代码的缝隙中寻找真相，解构人工建构的感知边界。', progress: 64 },
  { id: 'SYS_03', status: 'LOCKED', statusClass: 'mat-status-lock-143', title: '时间回溯', desc: '访问时间轴的备份节点，重写历史数据流。注意：修改过去将影响无数平行世界的运行状态。', progress: 31 },
]

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []
let ctx: gsap.Context | null = null
let animFrameId: number | null = null

// 矩阵数字雨
const initMatrix = () => {
  const canvas = matrixCanvasRef.value
  const section = sectionRef.value
  if (!canvas || !section) return

  const resize = () => {
    canvas.width = section.offsetWidth
    canvas.height = section.offsetHeight
  }
  resize()
  window.addEventListener('resize', resize)
  cleanupFns.push(() => window.removeEventListener('resize', resize))

  const c = canvas.getContext('2d')
  if (!c) return

  const fontSize = 14
  const cols = Math.floor(canvas.width / fontSize)
  const drops: number[] = Array(cols).fill(1)
  const chars = '0123456789ABCDEFアイウエオカキクケコサシスセソタチツテトナニヌネノ∞∂∫∑'

  const draw = () => {
    c.fillStyle = 'rgba(0, 0, 0, 0.05)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)]
      const x = i * fontSize

      // 渐变色：顶部亮绿，往下淡化
      const alpha = Math.random() > 0.95 ? 1 : 0.3 + Math.random() * 0.3
      c.fillStyle = `rgba(0, 255, 70, ${alpha})`
      c.font = `${fontSize}px monospace`
      c.fillText(char, x, y * fontSize)

      if (y * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    })

    animFrameId = requestAnimationFrame(draw)
  }
  draw()

  const vis = () => {
    if (document.hidden) { if (animFrameId) cancelAnimationFrame(animFrameId) }
    else draw()
  }
  document.addEventListener('visibilitychange', vis)
  cleanupFns.push(() => document.removeEventListener('visibilitychange', vis))
}

onMounted(() => {
  const rootEl = sectionRef.value
  if (!rootEl) return

  initMatrix()

  ctx = gsap.context(() => {
    // sys 标签
    if (sysRef.value) {
      const t = gsap.fromTo(sysRef.value,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: headerRef.value, start: 'top 80%', end: 'top 40%', scrub: 1 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 标题行1
    if (titleLine1Ref.value) {
      const t = gsap.fromTo(titleLine1Ref.value,
        { opacity: 0, x: -100, skewX: -10 },
        { opacity: 1, x: 0, skewX: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.value, start: 'top 78%', end: 'top 30%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 标题行2
    if (titleLine2Ref.value) {
      const t = gsap.fromTo(titleLine2Ref.value,
        { opacity: 0, x: 100, skewX: 10 },
        { opacity: 1, x: 0, skewX: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.value, start: 'top 75%', end: 'top 25%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 解码文字逐字出现
    const validChars = decodeCharRefs.value.filter(Boolean)
    if (validChars.length > 0) {
      const t = gsap.fromTo(validChars,
        { opacity: 0, y: 20, color: '#00ff46' },
        {
          opacity: 1, y: 0, color: '#86efac',
          duration: 0.6, ease: 'power2.out',
          stagger: 0.04,
          scrollTrigger: { trigger: headerRef.value, start: 'top 70%', end: 'top 20%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 终端逐行入场
    const validTermLines = termLineRefs.value.filter(Boolean)
    if (validTermLines.length > 0) {
      const t = gsap.fromTo(validTermLines,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: { trigger: terminalRef.value, start: 'top 85%', end: 'top 20%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }

    // 信息卡片
    const validInfoCards = infoCardRefs.value.filter(Boolean)
    if (validInfoCards.length > 0) {
      const t = gsap.fromTo(validInfoCards,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: infoRef.value, start: 'top 85%', end: 'top 15%', scrub: 1.5 }
        }
      )
      cleanupFns.push(() => t.kill())
    }
  }, rootEl)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
  if (animFrameId) cancelAnimationFrame(animFrameId)
  ctx?.revert()
  ctx = null
  decodeCharRefs.value = []
  termLineRefs.value = []
  infoCardRefs.value = []
})
</script>

<style scoped>
.mat-section-143 {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mat-canvas-143 {
  position: absolute;
  inset: 0;
  opacity: 0.25;
  pointer-events: none;
}

.mat-scanlines-143 {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px);
  pointer-events: none;
  z-index: 1;
}

.mat-content-143 {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1100px;
  padding: 80px 40px;
  margin: 0 auto;
}

.mat-header-143 {
  margin-bottom: 60px;
}

.mat-sys-143 {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #00ff46;
  letter-spacing: 0.15em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mat-sys-dot-143 {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff46;
  box-shadow: 0 0 8px #00ff46;
  animation: mat-blink-143 1.2s ease-in-out infinite;
}

@keyframes mat-blink-143 {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.mat-title-143 {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  line-height: 0.9;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
}

.mat-title-line-143 {
  display: block;
  color: rgba(0, 255, 70, 0.9);
  text-shadow: 0 0 20px rgba(0, 255, 70, 0.6), 0 0 60px rgba(0, 255, 70, 0.2);
  font-family: 'Courier New', monospace;
}

.mat-title-accent-143 {
  color: transparent;
  -webkit-text-stroke: 2px rgba(0, 255, 70, 0.6);
  text-shadow: none;
  margin-left: 2em;
}

.mat-decode-143 {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
}

.mat-decode-char-143 {
  color: #86efac;
  display: inline-block;
}

.mat-terminal-143 {
  background: rgba(0, 10, 0, 0.8);
  border: 1px solid rgba(0, 255, 70, 0.3);
  border-radius: 8px;
  margin-bottom: 40px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 255, 70, 0.1);
}

.mat-terminal-header-143 {
  background: rgba(0, 255, 70, 0.1);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(0, 255, 70, 0.2);
}

.mat-term-dots-143 {
  display: flex;
  gap: 6px;
}

.mat-term-dots-143 span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 255, 70, 0.4);
}

.mat-term-title-143 {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: rgba(0, 255, 70, 0.6);
}

.mat-terminal-body-143 {
  padding: 20px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.mat-term-line-143 {
  margin-bottom: 8px;
  display: flex;
  gap: 4px;
}

.mat-term-prompt-143 {
  color: rgba(0, 255, 70, 0.5);
  flex-shrink: 0;
}

.mat-term-text-143 {
  color: #a7f3d0;
}

.mat-term-code-143 {
  color: #6ee7b7;
  font-weight: 700;
}

.mat-term-success-143 {
  color: #00ff46;
}

.mat-info-143 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .mat-info-143 { grid-template-columns: 1fr; }
}

.mat-info-card-143 {
  background: rgba(0, 255, 70, 0.03);
  border: 1px solid rgba(0, 255, 70, 0.2);
  border-radius: 8px;
  padding: 20px;
  transition: border-color 0.3s, background 0.3s;
}

.mat-info-card-143:hover {
  border-color: rgba(0, 255, 70, 0.5);
  background: rgba(0, 255, 70, 0.06);
}

.mat-info-header-143 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.mat-info-id-143 {
  font-family: 'Courier New', monospace;
  font-size: 0.7rem;
  color: rgba(0, 255, 70, 0.5);
  letter-spacing: 0.1em;
}

.mat-info-status-143 {
  font-size: 0.65rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.mat-status-active-143 {
  background: rgba(0, 255, 70, 0.15);
  color: #00ff46;
  border: 1px solid rgba(0, 255, 70, 0.3);
}

.mat-status-run-143 {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.mat-status-lock-143 {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.mat-info-title-143 {
  font-size: 1rem;
  font-weight: 700;
  color: #a7f3d0;
  margin-bottom: 8px;
}

.mat-info-desc-143 {
  font-size: 0.85rem;
  color: #4ade80;
  line-height: 1.6;
  opacity: 0.7;
  margin-bottom: 12px;
}

.mat-info-progress-143 {
  height: 2px;
  background: rgba(0, 255, 70, 0.1);
  border-radius: 1px;
}

.mat-info-prog-fill-143 {
  height: 100%;
  background: linear-gradient(90deg, #00ff46, #6ee7b7);
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(0, 255, 70, 0.6);
}
</style>

