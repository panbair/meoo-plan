<template>
  <section ref="rootRef" class="room-root">
    <!-- 环境光晕 -->
    <div ref="glowTop" class="room-glow room-glow--top"></div>
    <div ref="glowBot" class="room-glow room-glow--bot"></div>
    <div ref="glowSpot" class="room-glow room-glow--spot"></div>

    <!-- 滚动容器 -->
    <div ref="scrollRef" class="room-scroll">
      <div ref="trackRef" class="room-track" :style="{ height: trackHeight }">
        <div class="room-sticky">

          <!-- 标题 -->
          <header ref="headerRef" class="room-header">
            <span class="room-kicker">◆ CSS3 3D Room · 立体空间剧场 ◆</span>
            <h1 class="room-title">
              <span ref="tc1" class="room-title__c">空</span>
              <span ref="tc2" class="room-title__c room-title__c--3d">间</span>
              <span ref="tc3" class="room-title__c">剧</span>
              <span ref="tc4" class="room-title__c room-title__c--3d">场</span>
            </h1>
            <div ref="lineRef" class="room-line"></div>
            <p class="room-sub">向下滚动 · 相机360°旋转穿梭 · 四面墙壁 + 天顶 + 地板</p>
          </header>

          <!-- 🔑 3D房间场景 — 整个房间旋转 -->
          <div ref="sceneRef" class="room-scene">
            <div ref="roomRef" class="room-cube">
              <!-- 前墙 -->
              <div class="room-wall room-wall--front">
                <img :src="walls[0].image" :alt="walls[0].label" class="room-wall__img" />
                <div class="room-wall__overlay"></div>
                <span class="room-wall__label">{{ walls[0].label }}</span>
                <span class="room-wall__num">01</span>
              </div>
              <!-- 右墙 -->
              <div class="room-wall room-wall--right">
                <img :src="walls[1].image" :alt="walls[1].label" class="room-wall__img" />
                <div class="room-wall__overlay"></div>
                <span class="room-wall__label">{{ walls[1].label }}</span>
                <span class="room-wall__num">02</span>
              </div>
              <!-- 后墙 -->
              <div class="room-wall room-wall--back">
                <img :src="walls[2].image" :alt="walls[2].label" class="room-wall__img" />
                <div class="room-wall__overlay"></div>
                <span class="room-wall__label">{{ walls[2].label }}</span>
                <span class="room-wall__num">03</span>
              </div>
              <!-- 左墙 -->
              <div class="room-wall room-wall--left">
                <img :src="walls[3].image" :alt="walls[3].label" class="room-wall__img" />
                <div class="room-wall__overlay"></div>
                <span class="room-wall__label">{{ walls[3].label }}</span>
                <span class="room-wall__num">04</span>
              </div>
              <!-- 天花板 -->
              <div class="room-wall room-wall--ceiling">
                <img :src="walls[4].image" :alt="walls[4].label" class="room-wall__img" />
                <div class="room-wall__overlay room-wall__overlay--dim"></div>
                <span class="room-wall__label">{{ walls[4].label }}</span>
              </div>
              <!-- 地板 -->
              <div class="room-wall room-wall--floor">
                <img :src="walls[5].image" :alt="walls[5].label" class="room-wall__img" />
                <div class="room-wall__overlay room-wall__overlay--dim"></div>
                <span class="room-wall__label">{{ walls[5].label }}</span>
              </div>

              <!-- 房间内的悬浮相框 -->
              <div ref="floatingFrame" class="room-float-frame">
                <img :src="walls[currentWall]?.image" :alt="walls[currentWall]?.label" class="room-float-frame__img" />
              </div>
            </div>
          </div>

          <!-- 当前视角指示 -->
          <div ref="indicator" class="room-indicator">
            <span class="room-indicator__dot"></span>
            <span class="room-indicator__text">{{ walls[currentWall]?.label }}</span>
          </div>

          <div class="room-progress"><div ref="progRef" class="room-progress__fill"></div></div>
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
//  CardImage3DRoom — CSS3 3D 立体空间剧场
//
//  核心概念：相机在3D房间内旋转
//  1. 构建一个完整的3D立方体房间（6面：4墙+天顶+地板）
//  2. 相机（我们的视角）在房间中心
//  3. 用户竖滚 → 整个房间绕Y轴旋转360°
//  4. 旋转过程中依次看到各面墙上的大幅图片
//  5. 房间中央悬浮一个当前视角对应的"精选画框"
//
//  青春时尚配色：日出橙 · 天空蓝 · 极光绿 · 暮光紫
// ═══════════════════════════════════════════════════════════════════

type TweenCleanup = () => void

interface WallData {
  id: string; label: string; image: string; alt: string
}

const walls: WallData[] = [
  { id: 'front', label: '日出 · 希望之墙', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80', alt: '日出海滩' },
  { id: 'right', label: '苍穹 · 探索之壁', image: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200&q=80', alt: '浩瀚星空' },
  { id: 'back',  label: '极光 · 梦想之幕', image: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1200&q=80', alt: '极光山脉' },
  { id: 'left',  label: '暮光 · 沉思之镜', image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1200&q=80', alt: '暮光山谷' },
  { id: 'ceiling', label: '苍穹之顶', image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80', alt: '银河星空' },
  { id: 'floor', label: '镜面大地', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80', alt: '金色麦田' },
]

const WALL_COUNT = 4 // 4面墙，旋转一周
const trackHeight = `${(WALL_COUNT + 2) * 100}vh`

const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const tc1 = ref<HTMLElement | null>(null); const tc2 = ref<HTMLElement | null>(null)
const tc3 = ref<HTMLElement | null>(null); const tc4 = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const roomRef = ref<HTMLElement | null>(null)
const floatingFrame = ref<HTMLElement | null>(null)
const indicator = ref<HTMLElement | null>(null)
const progRef = ref<HTMLElement | null>(null)
const glowTop = ref<HTMLElement | null>(null)
const glowBot = ref<HTMLElement | null>(null)
const glowSpot = ref<HTMLElement | null>(null)

const currentWall = ref(0)
const cleanupFns: TweenCleanup[] = []

function setupEntrance() {
  if (!scrollRef.value || !headerRef.value || !sceneRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollRef.value, scroller: scrollRef.value,
      start: 'top 75%', toggleActions: 'play none none reverse'
    }
  })
  const chars = [tc1.value, tc2.value, tc3.value, tc4.value]
  tl.fromTo(headerRef.value, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' })
    .fromTo(chars, { autoAlpha: 0, z: -300, scale: 0.2, rotateY: 90 }, { autoAlpha: 1, z: 0, scale: 1, rotateY: 0, duration: 0.7, stagger: 0.1, ease: 'back.out(2)' }, '-=0.5')
    .fromTo(lineRef.value, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power3.inOut' }, '-=0.3')
    .fromTo(sceneRef.value, { autoAlpha: 0, scale: 0.7, y: 80 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: 'power4.out' }, '-=0.4')
  cleanupFns.push(() => { tl.scrollTrigger?.kill(); tl.kill() })
}

function setup3DRoom() {
  if (!scrollRef.value || !trackRef.value || !roomRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const room = roomRef.value

  // 初始：略微俯视角度，看到前墙+部分地板
  gsap.set(room, { rotateX: 0, rotateY: 0 })
  // 场景初始倾斜，有立体感
  if (sceneRef.value) gsap.set(sceneRef.value, { rotateX: -5, rotateY: 0 })

  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.5,
      onUpdate(self) {
        const idx = Math.min(WALL_COUNT - 1, Math.max(0, Math.round(self.progress * (WALL_COUNT - 1))))
        currentWall.value = idx
      },
    },
  })

  // 🎥 房间Y轴旋转360° — 依次展示前→右→后→左→回到前
  // 阶段设计: 让每个面停留多一些
  master.to(room, { rotateY: 90,  duration: 1.0, ease: 'power2.inOut' }, 0)     // 前→右
  master.to(room, { rotateY: 90,  duration: 0.4, ease: 'none' }, 1.0)            // 停留右墙
  master.to(room, { rotateY: 180, duration: 1.0, ease: 'power2.inOut' }, 1.4)    // 右→后
  master.to(room, { rotateY: 180, duration: 0.4, ease: 'none' }, 2.4)            // 停留后墙
  master.to(room, { rotateY: 270, duration: 1.0, ease: 'power2.inOut' }, 2.8)    // 后→左
  master.to(room, { rotateY: 270, duration: 0.4, ease: 'none' }, 3.8)            // 停留左墙
  master.to(room, { rotateY: 360, duration: 1.0, ease: 'power2.inOut' }, 4.2)    // 左→回到前

  // 轻微呼吸式缩放
  for (let i = 0; i < 5; i++) {
    master.to(room, { scale: 1.04, duration: 0.2, ease: 'sine.inOut' }, i * 1.05)
    master.to(room, { scale: 1, duration: 0.25, ease: 'sine.inOut' }, i * 1.05 + 0.2)
  }

  // 悬浮画框旋转（与主房间略微不同步，产生层次感）
  if (floatingFrame.value) {
    master.fromTo(floatingFrame.value,
      { rotateY: -30, scale: 0.6, opacity: 0 },
      { rotateY: 330, scale: 1, opacity: 1, duration: WALL_COUNT },
      '>-=0.5'
    )
  }

  // 光晕位移
  if (glowTop.value) master.to(glowTop.value, { y: '-8vh', opacity: 0.8, duration: WALL_COUNT }, 0)
  if (glowBot.value) master.to(glowBot.value, { y: '5vh', opacity: 0.9, duration: WALL_COUNT }, 0)
  if (glowSpot.value) master.to(glowSpot.value, { x: '15vw', scale: 1.3, duration: WALL_COUNT, ease: 'sine.inOut' }, 0)

  // 指示器闪烁
  if (indicator.value) {
    for (let i = 0; i < WALL_COUNT; i++) {
      master.to(indicator.value, { scale: 1.25, opacity: 1, duration: 0.12, ease: 'power2.out' }, i + 0.3)
      master.to(indicator.value, { scale: 1, opacity: 0.75, duration: 0.25, ease: 'power2.in' }, i + 0.42)
    }
  }

  if (progRef.value) master.to(progRef.value, { width: '100%', duration: 5 }, 0)

  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

function handleResize() { ScrollTrigger.refresh(true) }

onMounted(() => {
  requestAnimationFrame(() => requestAnimationFrame(() => { setupEntrance(); setup3DRoom() }))
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
.room-root {
  position: relative; width: 100vw; height: 100vh; overflow: hidden;
  background: linear-gradient(160deg, #0a0a14 0%, #0d1020 15%, #0f1228 35%, #0c0f1f 60%, #0a0d1a 85%, #0a0a14 100%);
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

.room-glow {
  position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; will-change: transform,opacity; z-index: 0;
  &--top { width: 40vw; height: 30vw; top: -10vh; left: 20vw; background: radial-gradient(circle, rgba(255,140,80,.3) 0%, transparent 70%); }
  &--bot { width: 35vw; height: 25vw; bottom: -8vh; right: 15vw; background: radial-gradient(circle, rgba(80,160,240,.3) 0%, transparent 70%); }
  &--spot { width: 20vw; height: 20vw; top: 35vh; left: 50vw; background: radial-gradient(circle, rgba(150,220,140,.25) 0%, transparent 70%); }
}

.room-scroll {
  position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 2;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba(255,160,100,.25); &:hover { background: rgba(255,160,100,.45); } }
}
.room-track { position: relative; width: 100%; }
.room-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.room-header { position: absolute; top: 3vh; left: 50%; transform: translateX(-50%); z-index: 30; text-align: center; width: min(92vw, 800px); }
.room-kicker { display: inline-block; font-size: .64rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,180,120,.85); background: rgba(255,140,80,.08); backdrop-filter: blur(8px); border: 1px solid rgba(255,150,90,.2); border-radius: 999px; padding: .28rem 1.1rem; margin-bottom: .5rem; }
.room-title { margin: 0; display: flex; justify-content: center; gap: .08em; }
.room-title__c { display: inline-block; font-size: clamp(2rem, 5vw, 4.2rem); font-weight: 900; color: #f0a070; will-change: transform,opacity;
  &--3d { background: linear-gradient(135deg, #ff9966, #5eb3f0, #5ae0a0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 2px 16px rgba(100,180,240,.5)); }
}
.room-line { width: 90px; height: 2px; margin: .4rem auto .55rem; border-radius: 2px; background: linear-gradient(90deg, transparent, #ff9966, #5eb3f0, #5ae0a0, transparent); transform-origin: center; }
.room-sub { margin: 0; font-size: clamp(.7rem, 1vw, .84rem); color: rgba(200,160,130,.45); max-width: 480px; margin-inline: auto; }

/* ═══════════════════════ CSS3 3D 房间场景 ═══════════════════════ */
.room-scene {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 0; height: 0;
  z-index: 10;
  perspective: 1000px;
  perspective-origin: 50% 45%;
  will-change: transform, opacity;
}

/* 🔑 3D房间立方体 */
.room-cube {
  position: absolute;
  width: 0; height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

$roomW: min(70vw, 560px);
$roomH: min(52vw, 420px);
$roomD: min(70vw, 560px);
$halfW: calc($roomW / 2);
$halfH: calc($roomH / 2);
$halfD: calc($roomD / 2);

.room-wall {
  position: absolute;
  width: $roomW;
  height: $roomH;
  margin-left: calc($halfW * -1);
  margin-top: calc($halfH * -1);
  backface-visibility: hidden;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 0 80px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.08);
}

.room-wall__img { width: 100%; height: 100%; object-fit: cover; }
.room-wall__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,.15) 0%, transparent 40%, transparent 60%, rgba(0,0,0,.35) 100%);
  &--dim { background: rgba(0,0,0,.4); }
}
.room-wall__label {
  position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 2;
  font-size: .72rem; font-weight: 800; letter-spacing: .22em;
  color: #fff; text-shadow: 0 2px 12px rgba(0,0,0,.6);
  background: rgba(0,0,0,.3); backdrop-filter: blur(8px);
  border-radius: 999px; padding: .22rem 1rem;
}
.room-wall__num {
  position: absolute; top: 16px; right: 20px; z-index: 2;
  font-size: 2.5rem; font-weight: 900; color: rgba(255,255,255,.15);
  letter-spacing: .05em;
}

// 🔑 六面定位
.room-wall--front   { transform: translateZ($halfD); }
.room-wall--back    { transform: translateZ(calc($halfD * -1)) rotateY(180deg); }
.room-wall--right   { transform: translateX($halfW) rotateY(90deg); }
.room-wall--left    { transform: translateX(calc($halfW * -1)) rotateY(-90deg); }
.room-wall--ceiling { transform: translateY(calc($halfH * -1)) rotateX(90deg); width: $roomW; height: $roomD; margin-left: calc($halfW * -1); margin-top: calc($halfD * -1); }
.room-wall--floor   { transform: translateY($halfH) rotateX(-90deg); width: $roomW; height: $roomD; margin-left: calc($halfW * -1); margin-top: calc($halfD * -1); }

/* 悬浮画框 */
.room-float-frame {
  position: absolute;
  width: min(20vw, 150px); height: min(20vw, 150px);
  margin-left: calc(min(20vw, 150px) / -2);
  margin-top: calc(min(20vw, 150px) / -2);
  transform: translateZ(0);
  transform-style: preserve-3d;
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 8px 50px rgba(255,140,80,.25), 0 0 0 2px rgba(255,180,120,.4);
  will-change: transform, opacity;
}
.room-float-frame__img { width: 100%; height: 100%; object-fit: cover; }

.room-indicator {
  position: absolute; bottom: 12vh; left: 50%; transform: translateX(-50%); z-index: 25;
  display: flex; align-items: center; gap: .5rem; pointer-events: none;
  will-change: transform, opacity; opacity: .75;
}
.room-indicator__dot { width: 8px; height: 8px; border-radius: 50%; background: #ff9966; box-shadow: 0 0 12px rgba(255,153,102,.7); animation: room-dot-pulse 2s ease-in-out infinite; }
@keyframes room-dot-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.8); } }
.room-indicator__text { font-size: .72rem; font-weight: 700; letter-spacing: .22em; color: #f0a070; background: rgba(10,10,20,.5); backdrop-filter: blur(12px); border-radius: 999px; padding: .25rem 1rem; border: 1px solid rgba(255,150,90,.2); }

.room-progress { position: absolute; left: 0; bottom: 0; z-index: 30; width: 100%; height: 3px; background: rgba(255,160,100,.06); }
.room-progress__fill { width: 0; height: 100%; background: linear-gradient(90deg, #ff9966, #5eb3f0, #5ae0a0, #ff9966); background-size: 200% 100%; box-shadow: 0 0 14px rgba(255,140,80,.5); }

@media (max-width: 768px) {
  .room-header { top: 2vh; } .room-kicker { font-size: .5rem; padding: .18rem .6rem; } .room-title__c { font-size: 1.6rem; }
  .room-float-frame { width: 25vw; height: 25vw; margin-left: -12.5vw; margin-top: -12.5vw; }
}
</style>
