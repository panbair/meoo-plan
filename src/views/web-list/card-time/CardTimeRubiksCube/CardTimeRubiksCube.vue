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
const cubeRef = ref<HTMLElement | null>(null)
const movesRef = ref<HTMLElement | null>(null)
const statusRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cellRefs = ref<(HTMLElement | null)[]>(new Array(9).fill(null))

const cells = [
  {
    icon: '🔴',
    title: 'Core',
    desc: '核心模块',
    tag: 'R1C1',
    hue: 0
  },
  {
    icon: '🟡',
    title: 'Logic',
    desc: '逻辑引擎',
    tag: 'R1C2',
    hue: 45
  },
  {
    icon: '🟢',
    title: 'View',
    desc: '视图层',
    tag: 'R1C3',
    hue: 120
  },
  {
    icon: '🔵',
    title: 'Data',
    desc: '数据流',
    tag: 'R2C1',
    hue: 200
  },
  {
    icon: '🟣',
    title: 'State',
    desc: '状态管理',
    tag: 'R2C2',
    hue: 280
  },
  {
    icon: '🟠',
    title: 'Route',
    desc: '路由系统',
    tag: 'R2C3',
    hue: 25
  },
  {
    icon: '⚪',
    title: 'Auth',
    desc: '认证鉴权',
    tag: 'R3C1',
    hue: 0
  },
  {
    icon: '🔷',
    title: 'API',
    desc: '接口层',
    tag: 'R3C2',
    hue: 210
  },
  {
    icon: '💜',
    title: 'Deploy',
    desc: '部署发布',
    tag: 'R3C3',
    hue: 320
  }
]

let ctx: gsap.Context | null = null

onMounted(() => {
  if (!containerRef.value) {
    return
  }

  // 使用 gsap.context() 包裹所有动画,便于统一清理
  ctx = gsap.context(() => {
    const allCells = cellRefs.value.filter(Boolean) as HTMLElement[]
    if (allCells.length === 0) {
      return
    }

    gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
      opacity: 0,
      y: -40,
      filter: 'blur(12px)'
    })
    gsap.set(footerRef.value, { opacity: 0, y: 30 })
    gsap.set(allCells, { opacity: 0, scale: 0.5, rotateY: 180 })

    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })
    introTl
      .to([badgeRef.value, titleRef.value, subtitleRef.value], {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out'
      })
      .to(
        allCells,
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 0.5,
          stagger: { each: 0.05, grid: [3, 3], from: 'center' },
          ease: 'back.out(1.3)'
        },
        '-=0.4'
      )
      .to(footerRef.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')

    // Rubik's scramble & solve
    let moveCount = 0
    const solveTl = gsap.timeline({
      scrollTrigger: {
        trigger: cubeRef.value,
        start: 'top 70%',
        end: 'top 5%',
        scrub: 1.5,
        immediateRender: false,
        onUpdate: (self) => {
          if (progressRef.value) {
            progressRef.value.textContent = `${Math.round(self.progress * 100)}%`
          }
          if (statusRef.value) {
            statusRef.value.textContent =
              self.progress < 0.5 ? 'SCRAMBLING' : self.progress < 0.95 ? 'SOLVING' : 'SOLVED!'
          }
        }
      }
    })

    // Phase 1: Scramble — rotate rows and columns
    // Row 0 shift right
    const row0 = allCells.filter((_, i) => Math.floor(i / 3) === 0)
    solveTl.to(
      row0,
      {
        x: 100,
        duration: 0.1,
        stagger: 0.02,
        ease: 'power2.inOut',
        onComplete: () => {
          moveCount++
          if (movesRef.value) {
            movesRef.value.textContent = String(moveCount)
          }
        }
      },
      0
    )

    // Col 1 shift down
    const col1 = allCells.filter((_, i) => i % 3 === 1)
    solveTl.to(
      col1,
      {
        y: 80,
        duration: 0.1,
        stagger: 0.02,
        ease: 'power2.inOut',
        onComplete: () => {
          moveCount++
          if (movesRef.value) {
            movesRef.value.textContent = String(moveCount)
          }
        }
      },
      0.1
    )

    // Row 2 shift left
    const row2 = allCells.filter((_, i) => Math.floor(i / 3) === 2)
    solveTl.to(
      row2,
      {
        x: -80,
        duration: 0.1,
        stagger: 0.02,
        ease: 'power2.inOut',
        onComplete: () => {
          moveCount++
          if (movesRef.value) {
            movesRef.value.textContent = String(moveCount)
          }
        }
      },
      0.2
    )

    // Col 0 shift up
    const col0 = allCells.filter((_, i) => i % 3 === 0)
    solveTl.to(
      col0,
      {
        y: -60,
        duration: 0.1,
        stagger: 0.02,
        ease: 'power2.inOut',
        onComplete: () => {
          moveCount++
          if (movesRef.value) {
            movesRef.value.textContent = String(moveCount)
          }
        }
      },
      0.3
    )

    // Add rotation for visual flair
    solveTl.to(allCells, { rotateZ: () => gsap.utils.random(-15, 15), duration: 0.1 }, 0.15)

    // Phase 2: Solve — everything back
    solveTl.to(
      allCells,
      {
        x: 0,
        y: 0,
        rotateZ: 0,
        rotateY: 0,
        duration: 0.3,
        stagger: { each: 0.03, grid: [3, 3], from: 'center' },
        ease: 'elastic.out(1, 0.7)',
        onComplete: () => {
          moveCount += 5
          if (movesRef.value) {
            movesRef.value.textContent = String(moveCount)
          }
        }
      },
      0.5
    )

    // Phase 3: Celebration glow
    solveTl.to(
      allCells.map((c) => c.querySelector('.cell-face')),
      {
        boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
        duration: 0.15,
        stagger: 0.02
      },
      0.85
    )
  }, containerRef.value) // 传入容器元素作为作用域
})

onUnmounted(() => {
  // 按照规范顺序清理:先 kill ScrollTrigger → 再 kill context
  try {
    ScrollTrigger.getAll().forEach((st) => {
      st.kill()
    })
  } catch (e) {
    console.warn('[CardTimeRubiksCube] ScrollTrigger cleanup error:', e)
  }

  try {
    if (ctx) {
      ctx.kill()
      ctx = null
    }
  } catch (e) {
    console.warn('[CardTimeRubiksCube] Context cleanup error:', e)
  }

  try {
    gsap.globalTimeline.clear()
  } catch (e) {
    console.warn('[CardTimeRubiksCube] Global timeline cleanup error:', e)
  }
})
</script>

<template>
  <section ref="containerRef" class="rubiks-section">
    <div class="rubiks-bg">
      <div class="cube-ambient"></div>
    </div>
    <div class="rubiks-content">
      <div ref="headerRef" class="rubiks-header">
        <div ref="badgeRef" class="rubiks-badge">
          <span class="badge-icon">🧩</span>
          <span>PUZZLE</span>
        </div>
        <h1 ref="titleRef" class="rubiks-title">RUBIK'S CUBE</h1>
        <p ref="subtitleRef" class="rubiks-subtitle">魔方旋转 · 行列打乱 · 还原归位</p>
      </div>

      <div ref="cubeRef" class="cube-container">
        <!-- 3×3 网格 -->
        <div class="cube-grid">
          <div
            v-for="(cell, i) in cells"
            :key="i"
            :ref="(el) => (cellRefs[i] = el as HTMLElement)"
            class="cube-cell"
            :data-row="Math.floor(i / 3)"
            :data-col="i % 3"
            :style="{ '--cell-hue': cell.hue }"
          >
            <div class="cell-face">
              <div class="cell-inner">
                <span class="cell-icon">{{ cell.icon }}</span>
                <h3 class="cell-title">{{ cell.title }}</h3>
                <p class="cell-desc">{{ cell.desc }}</p>
                <span class="cell-tag">{{ cell.tag }}</span>
              </div>
              <div class="cell-shine"></div>
            </div>
          </div>
        </div>

        <!-- 旋转指示器 -->
        <div class="rotation-indicators">
          <div
            v-for="i in 3"
            :key="'ri' + i"
            class="row-indicator"
            :style="{ top: `${(i - 1) * 33.33 + 16}%` }"
          >
            <span class="indicator-arrow">↔</span>
          </div>
          <div
            v-for="i in 3"
            :key="'ci' + i"
            class="col-indicator"
            :style="{ left: `${(i - 1) * 33.33 + 16}%` }"
          >
            <span class="indicator-arrow">↕</span>
          </div>
        </div>
      </div>

      <!-- 步数与计时 -->
      <div class="solve-stats">
        <div class="stat">
          <span class="stat-label">MOVES</span>
          <span ref="movesRef" class="stat-value">0</span>
        </div>
        <div class="stat">
          <span class="stat-label">STATUS</span>
          <span ref="statusRef" class="stat-value status-val">SOLVING</span>
        </div>
        <div class="stat">
          <span class="stat-label">PROGRESS</span>
          <span ref="progressRef" class="stat-value">0%</span>
        </div>
      </div>

      <div ref="footerRef" class="rubiks-footer">
        <div class="color-legend">
          <span
            v-for="h in [0, 45, 120, 200, 280, 320]"
            :key="h"
            class="legend-dot"
            :style="{ background: `hsl(${h}, 60%, 50%)` }"
          ></span>
        </div>
        <p class="footer-text">SCROLL TO SOLVE</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.rubiks-section {
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 40% 40%, rgba(239, 68, 68, 0.08) 0%, transparent 30%),
    radial-gradient(circle at 60% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 30%),
    radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.06) 0%, transparent 40%),
    linear-gradient(180deg, #08080e 0%, #0e0e18 50%, #08080e 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rubiks-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  .cube-ambient {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.02), transparent 60%);
  }
}

.rubiks-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 30px;
  max-width: 900px;
  width: 100%;
}

.rubiks-header {
  margin-bottom: 30px;
  .rubiks-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 32px;
    border-radius: 50px;
    border: 1px solid rgba(239, 68, 68, 0.3);
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(219, 48, 48, 0.05));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(239, 68, 68, 0.15),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 24px;
    font-size: 11px;
    letter-spacing: 6px;
    color: rgba(252, 175, 175, 0.95);
    transition: all 0.3s ease;
    .badge-icon {
      font-size: 18px;
      filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.6));
    }
    &:hover {
      border-color: rgba(252, 165, 165, 0.5);
      box-shadow: 0 6px 30px rgba(239, 68, 68, 0.25);
      transform: translateY(-2px);
    }
  }
  .rubiks-title {
    font-size: clamp(52px, 7.5vw, 88px);
    font-weight: 900;
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #fcb5b5 30%, #fca5a5 60%, #ef4444 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 16px;
    filter: drop-shadow(0 0 60px rgba(239, 68, 68, 0.4));
    animation: rubiksGlow 3s ease-in-out infinite alternate;
  }
  .rubiks-subtitle {
    font-size: 16px;
    color: rgba(220, 210, 230, 0.6);
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
  }
}

.cube-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  perspective: 1000px;
}

.cube-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding: 20px;
}

.cube-cell {
  aspect-ratio: 1;
  transform-style: preserve-3d;
  will-change: transform;

  .cell-face {
    width: 100%;
    height: 100%;
    border-radius: 24px;
    background: linear-gradient(
      180deg,
      hsla(var(--cell-hue), 50%, 22%, 0.92),
      hsla(var(--cell-hue), 45%, 14%, 0.96)
    );
    border: 1px solid hsla(var(--cell-hue), 60%, 50%, 0.25);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 
      0 4px 20px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.06);

    .cell-inner {
      padding: 18px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      position: relative;
      z-index: 2;

      .cell-icon {
        font-size: 32px;
        filter: drop-shadow(0 0 10px hsla(var(--cell-hue), 60%, 50%, 0.4));
      }
      .cell-title {
        font-size: 17px;
        font-weight: 800;
        color: #fff;
        margin: 3px 0;
        letter-spacing: 1px;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
      }
      .cell-desc {
        font-size: 12px;
        color: rgba(230, 220, 240, 0.55);
        margin: 0;
      }
      .cell-tag {
        font-size: 10px;
        letter-spacing: 2px;
        padding: 4px 12px;
        border-radius: 14px;
        margin-top: 5px;
        background: rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-weight: 600;
      }
    }

    .cell-shine {
      position: absolute;
      inset: 0;
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
      pointer-events: none;
    }
  }

  &:hover .cell-face {
    border-color: hsla(var(--cell-hue), 70%, 60%, 0.45);
    box-shadow: 
      0 6px 30px hsla(var(--cell-hue), 60%, 50%, 0.3),
      inset 0 1px 0 rgba(255,255,255,0.1);
    transform: scale(1.03);
  }
}

.rotation-indicators {
  position: absolute;
  inset: 20px;
  pointer-events: none;

  .row-indicator,
  .col-indicator {
    position: absolute;
    opacity: 0.2;
    .indicator-arrow {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
      text-shadow: 0 0 10px rgba(255,255,255,0.3);
    }
  }
  .row-indicator {
    right: -30px;
  }
  .col-indicator {
    bottom: -30px;
  }
}

.solve-stats {
  display: flex;
  gap: 45px;
  justify-content: center;
  margin-top: 28px;
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px 18px;
    background: rgba(255,255,255,0.03);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.06);
    transition: all 0.2s;
    &:hover {
      border-color: rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.05);
    }
    .stat-label {
      font-size: 11px;
      letter-spacing: 3px;
      color: rgba(230, 220, 240, 0.4);
      font-weight: 600;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 900;
      color: rgba(255, 255, 255, 0.85);
      font-family: 'Courier New', monospace;
      text-shadow: 0 0 15px rgba(255,255,255,0.2);
    }
    .status-val {
      font-size: 15px;
      letter-spacing: 2px;
      color: rgba(134, 239, 172, 0.8);
      font-weight: 700;
      text-shadow: 0 0 15px rgba(134, 239, 172, 0.3);
    }
  }
}

.rubiks-footer {
  margin-top: 30px;
  .color-legend {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-bottom: 16px;
    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      box-shadow: 
        0 0 10px rgba(255, 255, 255, 0.15),
        0 0 20px rgba(255, 255, 255, 0.08);
      transition: all 0.2s;
      &:hover {
        transform: scale(1.2);
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.25);
      }
    }
  }
  .footer-text {
    font-size: 14px;
    letter-spacing: 4px;
    color: rgba(230, 220, 240, 0.5);
    font-weight: 500;
    margin: 0;
    text-shadow: 0 0 15px rgba(255,255,255,0.1);
  }
}

@keyframes rubiksGlow {
  0% { filter: drop-shadow(0 0 50px rgba(239, 68, 68, 0.35)); }
  100% { filter: drop-shadow(0 0 70px rgba(239, 68, 68, 0.5)); }
}
</style>
