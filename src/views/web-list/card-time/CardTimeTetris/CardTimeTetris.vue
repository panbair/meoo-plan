<template>
  <section ref="containerRef" class="tetris-section">
    <div class="tetris-bg">
      <div class="grid-overlay"></div>
      <div class="ambient-glow"></div>
    </div>
    <div class="tetris-content">
      <div ref="headerRef" class="tetris-header">
        <div ref="badgeRef" class="tetris-badge">
          <span class="badge-icon">🎮</span>
          <span>CLASSIC GAME</span>
        </div>
        <h1 ref="titleRef" class="tetris-title">TETRIS</h1>
        <p ref="subtitleRef" class="tetris-subtitle">俄罗斯方块 · 掉落堆叠 · 消行闪光</p>
      </div>

      <div class="game-layout">
        <!-- 游戏信息面板 -->
        <div class="info-panel left-panel">
          <div class="score-box">
            <span class="score-label">SCORE</span>
            <span class="score-value" ref="scoreRef">0</span>
          </div>
          <div class="level-box">
            <span class="level-label">LEVEL</span>
            <span class="level-value">01</span>
          </div>
          <div class="lines-box">
            <span class="lines-label">LINES</span>
            <span class="lines-value" ref="linesRef">0</span>
          </div>
        </div>

        <!-- 游戏区域 -->
        <div ref="fieldRef" class="game-field">
          <div class="field-grid">
            <span v-for="i in 60" :key="'g'+i" class="grid-cell"></span>
          </div>
          <!-- 掉落方块卡片 -->
          <div v-for="(block, i) in blocks" :key="i"
            :ref="el => blockRefs[i] = el as HTMLElement"
            class="tetris-block"
            :style="{ '--block-hue': block.hue, '--col': block.col, '--row': block.targetRow }">
            <div class="block-inner">
              <span class="block-index">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="block-title">{{ block.title }}</h3>
              <p class="block-desc">{{ block.desc }}</p>
              <span class="block-type">{{ block.type }}</span>
            </div>
            <div class="block-shadow"></div>
          </div>
          <!-- 消行闪光 -->
          <div ref="clearLineRef" class="clear-line-flash"></div>
        </div>

        <!-- NEXT预览 -->
        <div class="info-panel right-panel">
          <div class="next-box">
            <span class="next-label">NEXT</span>
            <div class="next-preview">
              <div class="mini-block" :style="{ background: `hsla(180, 70%, 50%, 0.4)` }"></div>
            </div>
          </div>
          <div class="hold-box">
            <span class="hold-label">HOLD</span>
            <div class="hold-preview">
              <div class="mini-block" :style="{ background: `hsla(60, 70%, 50%, 0.3)` }"></div>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="tetris-footer">
        <div class="controls-hint">
          <span class="key">←</span>
          <span class="key">→</span>
          <span class="key">↻</span>
          <span class="key">↓</span>
        </div>
        <p class="footer-text">SCROLL TO DROP BLOCKS</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const fieldRef = ref<HTMLElement | null>(null)
const clearLineRef = ref<HTMLElement | null>(null)
const scoreRef = ref<HTMLElement | null>(null)
const linesRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const blockRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const blocks = [
  { title: 'I-Block', desc: '长条型', type: 'I', hue: 180, col: 0, targetRow: 4 },
  { title: 'T-Block', desc: 'T字型', type: 'T', hue: 280, col: 1, targetRow: 4 },
  { title: 'O-Block', desc: '方块型', type: 'O', hue: 50, col: 2, targetRow: 4 },
  { title: 'S-Block', desc: 'S字型', type: 'S', hue: 120, col: 0, targetRow: 3 },
  { title: 'Z-Block', desc: 'Z字型', type: 'Z', hue: 0, col: 1, targetRow: 3 },
  { title: 'L-Block', desc: 'L字型', type: 'L', hue: 30, col: 2, targetRow: 3 },
  { title: 'J-Block', desc: 'J字型', type: 'J', hue: 220, col: 0, targetRow: 2 },
  { title: 'Power', desc: '特殊块', type: '★', hue: 320, col: 1, targetRow: 2 },
  { title: 'Combo', desc: '连击块', type: 'C', hue: 160, col: 2, targetRow: 2 },
]

onMounted(() => {
  if (!containerRef.value) return
  const allBlocks = blockRefs.value.filter(Boolean) as HTMLElement[]

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -40, filter: 'blur(12px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 30 })
  gsap.set(allBlocks, { opacity: 0, y: -400, rotation: () => gsap.utils.random(-45, 45) })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'power3.out'
  })
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  cleanupFns.push(() => introTl.kill())

  // Tetris drop animation
  const dropTl = gsap.timeline({
    scrollTrigger: { trigger: fieldRef.value, start: 'top 70%', end: 'top 5%', scrub: 1.5, immediateRender: false }
  })

  let score = 0
  allBlocks.forEach((block, i) => {
    dropTl.to(block, {
      opacity: 1, y: 0, rotation: 0,
      duration: 0.15,
      ease: 'bounce.out',
      onComplete: () => {
        score += 100
        if (scoreRef.value) scoreRef.value.textContent = String(score)
      }
    }, i * 0.1)
  })

  // Clear line flash after all blocks land
  dropTl.to(clearLineRef.value, {
    opacity: 1, scaleX: 1, duration: 0.08, ease: 'power4.out'
  }, 0.9)
  dropTl.to(clearLineRef.value, {
    opacity: 0, duration: 0.15
  }, 0.98)
  dropTl.call(() => {
    if (linesRef.value) linesRef.value.textContent = '1'
  }, [], 0.95)

  cleanupFns.push(() => dropTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.tetris-section {
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
    linear-gradient(180deg, #05050a 0%, #0a0a18 50%, #05050a 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tetris-bg {
  position: absolute; inset: 0; pointer-events: none;
  .grid-overlay {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(99, 102, 241, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99, 102, 241, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .ambient-glow {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.04), transparent 60%);
  }
}

.tetris-content {
  position: relative; z-index: 10; text-align: center;
  padding: 30px; max-width: 1100px; width: 100%;
}

.tetris-header {
  margin-bottom: 30px;

  .tetris-badge {
    display: inline-flex; align-items: center; gap: 10px; padding: 10px 28px;
    border-radius: 40px; border: 1px solid rgba(99, 102, 241, 0.3);
    background: rgba(99, 102, 241, 0.08); backdrop-filter: blur(10px);
    margin-bottom: 24px; font-size: 11px; letter-spacing: 5px;
    color: rgba(165, 180, 252, 0.9);
    .badge-icon { font-size: 16px; }
  }

  .tetris-title {
    font-size: clamp(48px, 7vw, 80px); font-weight: 800; letter-spacing: 8px;
    background: linear-gradient(180deg, #fff 0%, #a5b4fc 50%, #6366f1 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin: 0 0 16px; filter: drop-shadow(0 0 40px rgba(99, 102, 241, 0.4));
  }

  .tetris-subtitle {
    font-size: 16px; color: rgba(255, 255, 255, 0.5); letter-spacing: 6px; margin: 0;
  }
}

.game-layout {
  display: flex; gap: 20px; justify-content: center; align-items: flex-start;
}

.info-panel {
  width: 120px; display: flex; flex-direction: column; gap: 16px;

  .score-box, .level-box, .lines-box, .next-box, .hold-box {
    padding: 16px 12px; border-radius: 16px;
    background: rgba(10, 10, 24, 0.8);
    border: 1px solid rgba(99, 102, 241, 0.08);
    text-align: center;
  }

  .score-label, .level-label, .lines-label, .next-label, .hold-label {
    font-size: 9px; letter-spacing: 3px; color: rgba(165, 180, 252, 0.4); display: block; margin-bottom: 6px;
  }

  .score-value, .level-value, .lines-value {
    font-size: 24px; font-weight: 800; color: rgba(165, 180, 252, 0.9);
    font-family: 'Courier New', monospace;
  }

  .next-preview, .hold-preview {
    width: 50px; height: 50px; margin: 0 auto;
    border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    .mini-block { width: 30px; height: 30px; border-radius: 6px; }
  }
}

.game-field {
  position: relative; width: 360px;
  background: rgba(8, 8, 18, 0.9);
  border: 2px solid rgba(99, 102, 241, 0.12);
  border-radius: 12px; overflow: hidden;
  padding: 8px;

  .field-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(20, 24px);
    gap: 1px; opacity: 0.3; position: absolute; inset: 8px;
    .grid-cell { background: rgba(99, 102, 241, 0.02); border-radius: 2px; }
  }
}

.tetris-block {
  position: relative; width: calc(33.33% - 6px);
  display: inline-block; vertical-align: top; margin: 3px;

  .block-inner {
    padding: 16px 14px; border-radius: 16px;
    background: linear-gradient(180deg,
      hsla(var(--block-hue), 50%, 20%, 0.9),
      hsla(var(--block-hue), 45%, 12%, 0.95));
    border: 1px solid hsla(var(--block-hue), 60%, 50%, 0.2);
    backdrop-filter: blur(8px);
    text-align: left;

    &::before {
      content: ''; position: absolute; inset: 0; border-radius: 16px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, transparent 50%);
      pointer-events: none;
    }

    .block-index { font-size: 9px; color: rgba(255, 255, 255, 0.2); letter-spacing: 2px; }
    .block-title { font-size: 16px; font-weight: 700; color: #fff; margin: 4px 0; letter-spacing: 1px; }
    .block-desc { font-size: 12px; color: rgba(255, 255, 255, 0.45); margin: 0 0 6px; line-height: 1.5; }
    .block-type {
      font-size: 18px; font-weight: 900; color: hsla(var(--block-hue), 70%, 60%, 0.8);
      font-family: 'Courier New', monospace;
    }
  }

  .block-shadow {
    position: absolute; bottom: -4px; left: 10%; right: 10%; height: 6px;
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.3), transparent 70%);
    border-radius: 50%;
  }

  &:hover .block-inner {
    border-color: hsla(var(--block-hue), 70%, 60%, 0.4);
    box-shadow: 0 0 25px hsla(var(--block-hue), 60%, 50%, 0.15);
  }
}

.clear-line-flash {
  position: absolute; left: 0; right: 0; bottom: 30%; height: 4px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  opacity: 0; transform: scaleX(0);
}

.tetris-footer {
  margin-top: 30px;

  .controls-hint {
    display: flex; gap: 8px; justify-content: center; margin-bottom: 14px;
    .key {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; color: rgba(165, 180, 252, 0.5);
      background: rgba(99, 102, 241, 0.06);
      border: 1px solid rgba(99, 102, 241, 0.12);
    }
  }

  .footer-text {
    font-size: 14px; letter-spacing: 3px; color: rgba(255, 255, 255, 0.4); margin: 0;
  }
}
</style>

