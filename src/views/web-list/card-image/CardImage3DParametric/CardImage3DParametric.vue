<template>
  <section ref="rootRef" class="pm-root" :style="rootVars">
    <div ref="scrollRef" class="pm-scroll">
      <div ref="trackRef" class="pm-track" :style="{ height: trackHeight }">
        <div class="pm-sticky">

          <header ref="headerRef" class="pm-header">
            <span class="pm-kicker">⚙️ 参数化 3D 空间引擎 · 数据驱动 · 可配置架构 ◈</span>
            <h1 class="pm-title">
              <span ref="tc1" class="pm-title__c">参</span>
              <span ref="tc2" class="pm-title__c pm-title__c--engine">数</span>
              <span ref="tc3" class="pm-title__c">引</span>
              <span ref="tc4" class="pm-title__c pm-title__c--engine">擎</span>
            </h1>
            <div ref="dividerRef" class="pm-divider"></div>
            <p ref="subRef" class="pm-sub">
              向下滚动改变参数 · CSS变量驱动的3D空间 · 一套代码无数场景
            </p>
          </header>

          <!-- ════════════════ 🔑 参数化 3D 场景 ════════════════ -->
          <div ref="sceneRef" class="pm-scene">
            <div ref="stageRef" class="pm-stage">

              <!-- 🔑 动态生成的环形元素 — 数量和角度由参数计算 -->
              <div
                v-for="(item, i) in generatedItems"
                :key="i"
                class="pm-item"
                :style="{
                  '--angle': item.angle + 'deg',
                  '--anim-delay': item.delay + 's',
                }"
              >
                <div class="pm-item__card">
                  <img :src="item.url" :alt="''" class="pm-item__img" loading="lazy" />
                  <span class="pm-item__index">{{ i + 1 }}</span>
                </div>
              </div>

            </div>
          </div>

          <!-- ═══════════════ 🔑 参数控制面板 ═══════════════ -->
          <div class="pm-panel">
            <div class="pm-panel__row">
              <span class="pm-panel__label">N</span>
              <span class="pm-panel__value">{{ engine.itemCount }}</span>
              <span class="pm-panel__unit">个元素</span>
            </div>
            <div class="pm-panel__row">
              <span class="pm-panel__label">R</span>
              <span class="pm-panel__value">{{ engine.radius }}</span>
              <span class="pm-panel__unit">px 半径</span>
            </div>
            <div class="pm-panel__row">
              <span class="pm-panel__label">P</span>
              <span class="pm-panel__value">{{ engine.perspective }}</span>
              <span class="pm-panel__unit">px 透视</span>
            </div>
            <div class="pm-panel__row">
              <span class="pm-panel__label">φ</span>
              <span class="pm-panel__value">{{ Math.round(engine.rotation * 10) / 10 }}°</span>
            </div>
          </div>

          <div class="pm-progress"><div ref="progRef" class="pm-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, computed, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

// ═══════════════ 🔑 参数化 3D 引擎状态机 ═══════════════
const engine = reactive({
  itemCount: 8,        // 元素数量
  radius: 300,         // 环形半径 (px)
  perspective: 1000,   // 透视强度 (px)
  rotation: 0,         // 当前旋转角度
  itemWidth: 160,      // 元素宽度
  itemHeight: 110,     // 元素高度
  autoRotateSpeed: 0,  // 自动旋转速度
})

// 🔑 图片池
const imgPool = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80',
  'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80',
  'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80',
  'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=400&q=80',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
]

// 🔑 引擎自动计算：根据 itemCount 重新分配角度/延迟
interface GeneratedItem { angle: number; delay: number; url: string }
const generatedItems = computed<GeneratedItem[]>(() => {
  const count = engine.itemCount
  const angleStep = 360 / count
  const items: GeneratedItem[] = []
  for (let i = 0; i < count; i++) {
    items.push({
      angle: i * angleStep,
      delay: parseFloat((i * 0.08).toFixed(2)),
      url: imgPool[i % imgPool.length],
    })
  }
  return items
})

// 🔑 CSS变量 — 响应式注入到 :root
const rootVars = computed(() => ({
  '--pm-count': engine.itemCount,
  '--pm-radius': engine.radius + 'px',
  '--pm-perspective': engine.perspective + 'px',
  '--pm-rotation': engine.rotation + 'deg',
  '--pm-item-w': engine.itemWidth + 'px',
  '--pm-item-h': engine.itemHeight + 'px',
}))

const STAGES = 8
const trackHeight = `${(STAGES + 1) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const subRef = ref<HTMLElement | null>(null)
const dividerRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value) return
  const scroller = scrollRef.value
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value].filter(Boolean)
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller, start: 'top 75%', toggleActions: 'play none none reverse' } })
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .7, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -150, scale: .3 }, { autoAlpha: 1, z: 0, scale: 1, duration: .5, stagger: .07, ease: 'back.out(1.5)' }, '-=.3')
    .fromTo(dividerRef.value, { scaleX: 0 }, { scaleX: 1, duration: .4, ease: 'power3.inOut' }, '-=.12')
    .fromTo(subRef.value, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, '-=.06')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

// ═══════════════ 🔑 参数驱动动画 ═══════════════
function setupParametricEngine() {
  if (!scrollRef.value || !trackRef.value || !stageRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const stage = stageRef.value
  const D = STAGES

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        const p = self.progress

        // 🔑 参数随滚动连续变化!
        // Stage 0→2: itemCount 8→12
        // Stage 2→4: radius 300→500
        // Stage 4→6: perspective 1000→600
        // Stage 6→8: itemCount 12→6 + radius 500→250

        if (p < 0.3) {
          engine.itemCount = Math.round(8 + (p / 0.3) * 4)
          engine.radius = 300
          engine.perspective = 1000
        } else if (p < 0.5) {
          engine.itemCount = 12
          engine.radius = Math.round(300 + ((p - 0.3) / 0.2) * 200)
          engine.perspective = 1000
        } else if (p < 0.7) {
          engine.itemCount = 12
          engine.radius = 500
          engine.perspective = Math.round(1000 - ((p - 0.5) / 0.2) * 400)
        } else {
          engine.itemCount = Math.round(12 - ((p - 0.7) / 0.3) * 6)
          engine.radius = Math.round(500 - ((p - 0.7) / 0.3) * 250)
          engine.perspective = 600
        }

        engine.rotation = p * 360
        // 更新stage旋转
        if (stageRef.value) {
          stageRef.value.style.transform = `rotateY(${engine.rotation}deg)`
        }
      },
    },
  })

  // 场景微倾斜
  master.to(stage, { rotateX: 10, duration: D * .3, ease: 'sine.inOut' }, 0)
  master.to(stage, { rotateX: -8, duration: D * .4, ease: 'sine.inOut' }, D * .35)
  master.to(stage, { rotateX: 0, duration: D * .3, ease: 'sine.inOut' }, D * .7)

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: D }, 0)
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setupParametricEngine() }))
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  ScrollTrigger.getAll().forEach(st => st.kill())
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
/* ═══════════════════════ 引擎空间 ═══════════════════════ */
.pm-root {
  --pm-perspective: 1000px;
  --pm-radius: 300px;
  --pm-rotation: 0deg;
  --pm-item-w: 160px;
  --pm-item-h: 110px;

  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: radial-gradient(ellipse 55% 45% at 50% 45%, #0e0c18 0%, #04020c 55%, #010004 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, monospace;
}

.pm-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(80,160,220,.08); }
}
.pm-track { position: relative; width: 100%; }
.pm-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.pm-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 40; text-align: center; width: min(92vw, 800px); pointer-events: none; }
.pm-kicker { display: inline-block; font-size: .48rem; font-weight: 700; letter-spacing: .2em; color: rgba(80,180,230,.55); background: rgba(40,140,220,.04); backdrop-filter: blur(8px); border: 1px solid rgba(40,140,220,.1); border-radius: 999px; padding: .14rem .8rem; margin-bottom: .45rem; }
.pm-title { margin: 0; display: flex; justify-content: center; gap: .06em; }
.pm-title__c { display: inline-block; font-size: clamp(2rem, 5.5vw, 4.2rem); font-weight: 900; color: #4898c8;
  &--engine { background: linear-gradient(150deg, #3098e0 0%, #60d0f8 30%, #d060e0 60%, #f080f0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 10px rgba(60,180,230,.5)); }
}
.pm-divider { width: 110px; height: 2px; margin: .35rem auto .45rem; background: linear-gradient(90deg, transparent, #3098e0, #d060e0, #3098e0, transparent); }
.pm-sub { margin: 0; font-size: clamp(.5rem, 1vw, .66rem); color: rgba(60,160,220,.3); max-width: 520px; margin-inline: auto; }

/* ═══════════════════════ 🔑 3D 场景 (CSS变量驱动) ═══════════════════════ */
.pm-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0; z-index: 10;
  perspective: var(--pm-perspective); // 🔑 CSS变量!
  perspective-origin: 50% 48%;
}
.pm-stage {
  position: absolute; width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

/* ═══════════════ 🔑 动态环形元素 ═══════════════ */
.pm-item {
  --angle: 0deg; --anim-delay: 0s;
  position: absolute; transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;

  // 🔑 CSS变量决定3D位置 — 修改--pm-radius全局生效!
  transform:
    rotateY(var(--angle))
    translateZ(var(--pm-radius));

  // 入场动画
  animation: pm-item-in .6s var(--anim-delay) both cubic-bezier(.23,1,.32,1);
}
@keyframes pm-item-in {
  from { opacity: 0; transform: rotateY(var(--angle)) translateZ(calc(var(--pm-radius) - 200px)) scale(.5); }
  to   { opacity: 1; transform: rotateY(var(--angle)) translateZ(var(--pm-radius)) scale(1); }
}

.pm-item__card {
  position: absolute;
  width: var(--pm-item-w); height: var(--pm-item-h);
  margin-left: calc(var(--pm-item-w) / -2);
  margin-top: calc(var(--pm-item-h) / -2);
  border-radius: 8px; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.05);
}
.pm-item__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pm-item__index {
  position: absolute; top: 4px; right: 6px;
  font-size: .6rem; font-weight: 900; color: rgba(255,255,255,.8);
  text-shadow: 0 1px 3px rgba(0,0,0,.5); font-family: 'Courier New', monospace;
}

/* ═══════════════ 🔑 参数面板 ═══════════════ */
.pm-panel {
  position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%);
  z-index: 35; pointer-events: none; display: flex; gap: 1.2rem;
  background: rgba(6,4,14,.55); backdrop-filter: blur(10px);
  border-radius: 12px; padding: .45rem 1rem;
  border: 1px solid rgba(60,140,220,.1);
}
.pm-panel__row { display: flex; align-items: baseline; gap: .2rem; }
.pm-panel__label { font-size: .6rem; font-weight: 900; color: rgba(80,180,230,.5); font-family: 'Courier New', monospace; }
.pm-panel__value { font-size: .85rem; font-weight: 900; color: rgba(80,200,240,.85); font-family: 'Courier New', monospace; }
.pm-panel__unit { font-size: .45rem; font-weight: 500; color: rgba(60,140,200,.35); font-family: 'Courier New', monospace; }

.pm-progress { position: absolute; left: 0; bottom: 0; z-index: 40; width: 100%; height: 2px; background: rgba(40,140,220,.02); }
.pm-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #3098e0, #d060e0, #3098e0); }

@media (max-width: 768px) {
  .pm-header { top: 2vh; } .pm-kicker { font-size: .3rem; } .pm-title__c { font-size: 1.4rem; }
  .pm-panel { gap: .6rem; padding: .35rem .7rem; }
  .pm-panel__value { font-size: .7rem; }
}
</style>
