<template>
  <section ref="rootRef" class="c3d-root">
    <!-- 3D场景光晕 -->
    <div ref="glowA" class="c3d-glow c3d-glow--a"></div>
    <div ref="glowB" class="c3d-glow c3d-glow--b"></div>
    <div ref="glowC" class="c3d-glow c3d-glow--c"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="c3d-scroll">
      <div ref="trackRef" class="c3d-track" :style="{ height: trackHeight }">
        <div class="c3d-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="c3d-header">
            <span class="c3d-kicker">◆ CSS 3D Cube · 立体魔方 ◆</span>
            <h1 class="c3d-title">
              <span ref="tc1" class="c3d-title__c">立</span>
              <span ref="tc2" class="c3d-title__c c3d-title__c--3d">体</span>
              <span ref="tc3" class="c3d-title__c">魔</span>
              <span ref="tc4" class="c3d-title__c c3d-title__c--3d">方</span>
            </h1>
            <div ref="lineRef" class="c3d-line"></div>
            <p class="c3d-sub">向下滚动 · 纯CSS3 3D立方体旋转 · 六面图片环绕</p>
          </header>

          <!-- 🎲 3D立方体场景 -->
          <div ref="sceneRef" class="c3d-scene">
            <div ref="cubeRef" class="c3d-cube">
              <!-- 前面 -->
              <div class="c3d-face c3d-face--front">
                <img :src="faces[0].image" :alt="faces[0].label" class="c3d-face__img" />
                <span class="c3d-face__label">{{ faces[0].label }}</span>
              </div>
              <!-- 后面 -->
              <div class="c3d-face c3d-face--back">
                <img :src="faces[1].image" :alt="faces[1].label" class="c3d-face__img" />
                <span class="c3d-face__label">{{ faces[1].label }}</span>
              </div>
              <!-- 右面 -->
              <div class="c3d-face c3d-face--right">
                <img :src="faces[2].image" :alt="faces[2].label" class="c3d-face__img" />
                <span class="c3d-face__label">{{ faces[2].label }}</span>
              </div>
              <!-- 左面 -->
              <div class="c3d-face c3d-face--left">
                <img :src="faces[3].image" :alt="faces[3].label" class="c3d-face__img" />
                <span class="c3d-face__label">{{ faces[3].label }}</span>
              </div>
              <!-- 顶面 -->
              <div class="c3d-face c3d-face--top">
                <img :src="faces[4].image" :alt="faces[4].label" class="c3d-face__img" />
                <span class="c3d-face__label">{{ faces[4].label }}</span>
              </div>
              <!-- 底面 -->
              <div class="c3d-face c3d-face--bottom">
                <img :src="faces[5].image" :alt="faces[5].label" class="c3d-face__img" />
                <span class="c3d-face__label">{{ faces[5].label }}</span>
              </div>
            </div>
          </div>

          <!-- 当前面指示 -->
          <div ref="faceIndicator" class="c3d-indicator">
            <span class="c3d-indicator__text">{{ faces[currentFace]?.label }}</span>
          </div>

          <div class="c3d-progress"><div ref="progRef" class="c3d-progress__fill"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// ═══════════════════════════════════════════════════════════════════
//  CardImage3DCube — CSS3 3D立体魔方
//
//  核心概念：纯CSS3 3D立方体
//  1. transform-style: preserve-3d — 保持3D空间
//  2. 六个面通过 rotateX/Y + translateZ 构建真正的3D立方体
//  3. 用户竖滚 → 立方体旋转 (rotateX + rotateY)
//  4. 每个面贴一张图片，旋转即切换视角
//  5. 背面自动隐藏 backface-visibility: hidden
//
//  青春时尚配色：糖果粉 · 电光蓝 · 薄荷绿 · 珊瑚橙 · 柠檬黄 · 薰衣草紫
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface CubeFace {
  id: string; label: string; image: string; alt: string
}

const faces: CubeFace[] = [
  { id: 'front', label: '珊瑚', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80', alt: '珊瑚色海面' },
  { id: 'back', label: '薄荷', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80', alt: '绿色山峦' },
  { id: 'right', label: '金色', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', alt: '金色麦田' },
  { id: 'left', label: '薰衣草', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80', alt: '紫色山谷' },
  { id: 'top', label: '天空', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', alt: '天空森林' },
  { id: 'bottom', label: '蜜桃', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80', alt: '蜜桃花朵' },
]

const FACE_COUNT = faces.length
const trackHeight = `${(FACE_COUNT + 1) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const cubeRef = ref<HTMLElement | null>(null)
const faceIndicator = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const glowA = ref<HTMLElement | null>(null)
const glowB = ref<HTMLElement | null>(null)
const glowC = ref<HTMLElement | null>(null)

const currentFace = ref(0)
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({ scrollTrigger: { trigger: scrollRef.value, scroller: scrollRef.value, start: 'top 75%', toggleActions: 'play none none reverse' } })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -200, scale: 0.3 }, { autoAlpha: 1, z: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.45')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.25')
    .fromTo(sceneRef.value, { autoAlpha: 0, rotateX: 45, rotateY: -45 }, { autoAlpha: 1, rotateX: -15, rotateY: 20, duration: 0.8, ease: 'power3.out' }, '-=0.35')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setup3DCube() {
  if (!scrollRef.value || !trackRef.value || !cubeRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const cube = cubeRef.value

  // 初始状态：立方体现有一个小角度倾斜，展示前方的面
  gsap.set(cube, { rotateX: -15, rotateY: 20 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.2,
      onUpdate(self) {
        // 根据进度计算当前看到的面
        const idx = Math.min(FACE_COUNT - 1, Math.max(0, Math.round(self.progress * (FACE_COUNT - 1))))
        currentFace.value = idx
      },
    },
  })

  // 🎲 立方体旋转路径：从前面→右面→顶面→左面→后面→底面
  // 通过组合 rotateY(水平旋转) + rotateX(垂直旋转) 来展示不同面

  // 阶段0→1: 前面→右面 (rotateY: 20°→-70°)
  master.to(cube, { rotateY: -70, rotateX: -15, duration: 0.7, ease: 'power2.inOut' }, 0)
  master.to(cube, { rotateY: -70, rotateX: -15, duration: 0.3, ease: 'none' }, 0.7)

  // 阶段1→2: 右面→顶面 (rotateX: -15°→-75°)
  master.to(cube, { rotateY: -70, rotateX: -75, duration: 0.7, ease: 'power2.inOut' }, 1)
  master.to(cube, { rotateY: -70, rotateX: -75, duration: 0.3, ease: 'none' }, 1.7)

  // 阶段2→3: 顶面→左面 (rotateY: -70°→110°)
  master.to(cube, { rotateY: 110, rotateX: -75, duration: 0.7, ease: 'power2.inOut' }, 2)
  master.to(cube, { rotateY: 110, rotateX: -75, duration: 0.3, ease: 'none' }, 2.7)

  // 阶段3→4: 左面→后面 (rotateY: 110°→200°)
  master.to(cube, { rotateY: 200, rotateX: -75, duration: 0.7, ease: 'power2.inOut' }, 3)
  master.to(cube, { rotateY: 200, rotateX: -75, duration: 0.3, ease: 'none' }, 3.7)

  // 阶段4→5: 后面→底面 (rotateX: -75°→75°)
  master.to(cube, { rotateY: 200, rotateX: 75, duration: 0.7, ease: 'power2.inOut' }, 4)
  master.to(cube, { rotateY: 200, rotateX: 75, duration: 0.3, ease: 'none' }, 4.7)

  // 回到前面附近 (rotateY: 200°→380°即20°)
  master.to(cube, { rotateY: 380, rotateX: -15, duration: 1.0, ease: 'power2.inOut' }, 5)

  // 缩放呼吸
  for (let i = 0; i <= FACE_COUNT; i++) {
    master.to(cube, { scale: 1.06, duration: 0.15, ease: 'sine.inOut' }, i + 0.35)
    master.to(cube, { scale: 1, duration: 0.2, ease: 'sine.inOut' }, i + 0.5)
  }

  // 光晕
  if (glowA.value && glowB.value && glowC.value) {
    master.to(glowA.value, { x: '10vw', y: '-6vh', scale: 1.2, duration: FACE_COUNT }, 0)
    master.to(glowB.value, { x: '-8vw', y: '8vh', scale: 1.25, duration: FACE_COUNT }, 0)
    master.to(glowC.value, { x: '5vw', y: '-10vh', scale: 1.15, duration: FACE_COUNT }, 0)
  }

  // 面指示器
  if (faceIndicator.value) {
    for (let i = 0; i < FACE_COUNT; i++) {
      master.to(faceIndicator.value, { scale: 1.3, opacity: 1, duration: 0.08, ease: 'power2.out' }, i + 0.35)
      master.to(faceIndicator.value, { scale: 1, opacity: 0.7, duration: 0.2, ease: 'power2.in' }, i + 0.43)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: FACE_COUNT }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setup3DCube() }))
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
.c3d-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: linear-gradient(150deg, #fefaf7 0%, #fcf6f0 20%, #fdf7f8 40%, #fef9f4 60%, #fcf8f3 80%, #fefaf6 100%); font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif; }

.c3d-glow { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; will-change: transform; z-index: 0; }
.c3d-glow--a { width: 32vw; height: 32vw; top: -5vh; left: -3vw; background: radial-gradient(circle, rgba(255,130,150,.45) 0%, transparent 70%); }
.c3d-glow--b { width: 28vw; height: 28vw; bottom: -6vh; right: -2vw; background: radial-gradient(circle, rgba(100,180,230,.4) 0%, transparent 70%); }
.c3d-glow--c { width: 24vw; height: 24vw; top: 40vh; left: 55vw; background: radial-gradient(circle, rgba(140,220,160,.35) 0%, transparent 70%); }

.c3d-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,140,150,.3); &:hover { background: rgba(255,140,150,.5); } }
}
.c3d-track { position: relative; width: 100%; }
.c3d-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.c3d-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 20; text-align: center; width: min(92vw, 800px); }
.c3d-kicker { display: inline-block; font-size: .66rem; font-weight: 700; letter-spacing: .26em; text-transform: uppercase; color: rgba(200,100,140,.8); background: rgba(255,140,160,.1); backdrop-filter: blur(8px); border: 1px solid rgba(255,130,150,.2); border-radius: 999px; padding: .3rem 1.2rem; margin-bottom: .55rem; }
.c3d-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.c3d-title__c { display: inline-block; font-size: clamp(2.2rem, 5.5vw, 4.6rem); font-weight: 900; color: #c86078; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #ff6b8a, #5ab8f0, #5ce0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 14px rgba(100,180,240,.45)); }
}
.c3d-line { width: 90px; height: 2px; margin: .45rem auto .6rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff6b8a, #5ab8f0, #5ce0a0, transparent); transform-origin: center; }
.c3d-sub { margin: 0; font-size: clamp(.76rem, 1.1vw, .88rem); color: rgba(180,100,130,.5); max-width: 460px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 场景 ═══════════════════════ */
.c3d-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0;
  z-index: 10;
  perspective: 900px;          // 🔑 3D透视
  perspective-origin: 50% 50%;
  will-change: transform, opacity;
}

/* ═══════════════════════ 3D立方体 ═══════════════════════ */
.c3d-cube {
  position: absolute;
  width: 0; height: 0;
  transform-style: preserve-3d;  // 🔑 保持3D空间
  will-change: transform;
}

.c3d-face {
  position: absolute;
  width: min(55vw, 420px);
  height: min(55vw, 420px);
  margin-left: calc(min(55vw, 420px) / -2);
  margin-top: calc(min(55vw, 420px) / -2);
  backface-visibility: hidden;   // 🔑 背面隐藏
  overflow: hidden;
  border-radius: 14px;
  box-shadow: 0 0 60px rgba(0,0,0,.15), inset 0 0 0 1px rgba(255,255,255,.3);
}

.c3d-face__img {
  width: 100%; height: 100%; object-fit: cover;
}

.c3d-face__label {
  position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
  z-index: 2; font-size: .7rem; font-weight: 800; letter-spacing: .2em;
  color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.5);
  background: rgba(0,0,0,.25); backdrop-filter: blur(6px);
  border-radius: 999px; padding: .2rem .9rem;
}

// 🔑 六个面的3D定位
$cubeSize: min(55vw, 420px);
$half: calc($cubeSize / 2);

.c3d-face--front  { transform: translateZ(calc($half)) rotateY(0deg); }
.c3d-face--back   { transform: translateZ(calc($half * -1)) rotateY(180deg); }
.c3d-face--right  { transform: translateX(calc($half)) rotateY(90deg); }
.c3d-face--left   { transform: translateX(calc($half * -1)) rotateY(-90deg); }
.c3d-face--top    { transform: translateY(calc($half * -1)) rotateX(90deg); }
.c3d-face--bottom { transform: translateY(calc($half)) rotateX(-90deg); }

.c3d-indicator { position: absolute; bottom: 10vh; left: 50%; transform: translateX(-50%); z-index: 25; pointer-events: none; will-change: transform,opacity; opacity: .7; }
.c3d-indicator__text { font-size: .75rem; font-weight: 700; letter-spacing: .25em; color: #c86078; background: rgba(255,255,255,.5); backdrop-filter: blur(10px); border-radius: 999px; padding: .3rem 1.2rem; border: 1px solid rgba(255,130,150,.25); }

.c3d-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,140,150,.06); }
.c3d-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff6b8a, #5ab8f0, #5ce0a0, #ff6b8a); background-size: 200% 100%; box-shadow: 0 0 12px rgba(255,120,150,.5); }

@media (max-width: 768px) {
  .c3d-header { top: 2vh; } .c3d-kicker { font-size: .54rem; padding: .2rem .65rem; } .c3d-title__c { font-size: 1.7rem; }
  .c3d-face { width: 70vw; height: 70vw; margin-left: -35vw; margin-top: -35vw; }
}
</style>
