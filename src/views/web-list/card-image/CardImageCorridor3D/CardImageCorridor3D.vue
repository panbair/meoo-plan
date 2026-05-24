<template>
  <div class="cg-section" ref="sectionRef">
    <!-- 建筑背景 -->
    <div class="cg-bg"></div>

    <!-- 地板网格 -->
    <div class="cg-floor" ref="floorRef"></div>

    <!-- 顶部灯光 -->
    <div class="cg-lights">
      <div class="cg-light" v-for="n in 7" :key="n" :style="{ left: (10 + n * 12) + '%', animationDelay: (n * 0.5) + 's' }"></div>
    </div>

    <!-- 3D长廊场景 -->
    <div class="cg-scene" ref="sceneRef">
      <!-- 左侧墙壁照片 -->
      <div
        v-for="(photo, idx) in leftPhotos"
        :key="'L' + photo.id"
        class="cg-photo-wall cg-wall-left"
        :ref="(el: any) => { if (el) leftRefs[idx] = el }"
      >
        <div class="cg-frame">
          <img :src="photo.url" :alt="photo.title" class="cg-img" crossorigin="anonymous" />
          <div class="cg-glare"></div>
        </div>
        <span class="cg-tag">{{ photo.tag }}</span>
      </div>

      <!-- 右侧墙壁照片 -->
      <div
        v-for="(photo, idx) in rightPhotos"
        :key="'R' + photo.id"
        class="cg-photo-wall cg-wall-right"
        :ref="(el: any) => { if (el) rightRefs[idx] = el }"
      >
        <div class="cg-frame">
          <img :src="photo.url" :alt="photo.title" class="cg-img" crossorigin="anonymous" />
          <div class="cg-glare"></div>
        </div>
        <span class="cg-tag">{{ photo.tag }}</span>
      </div>
    </div>

    <!-- 前景暗角 -->
    <div class="cg-vignette"></div>

    <!-- 标题牌 -->
    <div class="cg-header" ref="headerRef">
      <span class="cg-museum">MUSEUM CORRIDOR</span>
      <h2 class="cg-title">长廊</h2>
      <span class="cg-line"></span>
      <p class="cg-sub">PERSPECTIVE GALLERY WALK</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ==================== 照片数据：12张，左右各6 ====================
interface PhotoItem {
  id: number
  url: string
  title: string
  tag: string
}

const urlPool = [
  'https://picsum.photos/seed/corridor1/600/400',
  'https://picsum.photos/seed/corridor2/600/400',
  'https://picsum.photos/seed/corridor3/600/400',
  'https://picsum.photos/seed/corridor4/600/400',
  'https://picsum.photos/seed/corridor5/600/400',
  'https://picsum.photos/seed/corridor6/600/400',
  'https://picsum.photos/seed/corridor7/600/400',
  'https://picsum.photos/seed/corridor8/600/400',
  'https://picsum.photos/seed/corridor9/600/400',
  'https://picsum.photos/seed/corridor10/600/400',
  'https://picsum.photos/seed/corridor11/600/400',
  'https://picsum.photos/seed/corridor12/600/400',
]

const tagPool = [
  'MOUNTAIN', 'FOREST', 'LAKE', 'VALLEY', 'RIVER', 'OCEAN',
  'MEADOW', 'NEBULA', 'GARDEN', 'PATH', 'PEAK', 'COAST'
]

const titlePool = [
  '群山', '密林', '湖泊', '峡谷', '河流', '海洋',
  '草原', '星云', '花园', '幽径', '峰顶', '海岸'
]

const depthCount = 6

const leftPhotos = ref<PhotoItem[]>(
  Array.from({ length: depthCount }, (_, i) => ({
    id: i + 1,
    url: urlPool[i * 2],
    title: titlePool[i * 2],
    tag: tagPool[i * 2],
  }))
)
const rightPhotos = ref<PhotoItem[]>(
  Array.from({ length: depthCount }, (_, i) => ({
    id: i + depthCount + 1,
    url: urlPool[i * 2 + 1],
    title: titlePool[i * 2 + 1],
    tag: tagPool[i * 2 + 1],
  }))
)

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const floorRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const leftRefs = ref<(HTMLElement | null)[]>([])
const rightRefs = ref<(HTMLElement | null)[]>([])

let cleanupFns: CleanupFn[] = []

// ==================== 长廊参数 ====================
const CORRIDOR_DEPTH = 580          // 长廊总深度
const WALL_OFFSET_X = 290            // 墙壁水平偏移
const WALL_ANGLE = 22                // 墙壁旋转角度（度）
const SWEET_SPOT_Z = -260            // 最佳焦点深度

// ==================== 挂载 ====================
onMounted(() => {
  if (!sectionRef.value) return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setupAnimation()
    })
  })
})

// ==================== 主动画 ====================
function setupAnimation() {
  const container = sectionRef.value
  if (!container) return

  // 初始状态设置
  const allLeft = leftRefs.value
  const allRight = rightRefs.value

  allLeft.forEach((el, i) => {
    if (!el) return
    const z0 = -80 - i * 95
    const ang = -WALL_ANGLE
    const xOff = -WALL_OFFSET_X
    gsap.set(el, {
      transform: `rotateY(${ang}deg) translateZ(${z0}px) translateX(${xOff}px)`,
      opacity: 0.25,
      filter: 'blur(3px) brightness(0.45)',
      zIndex: depthCount - i,
    })
  })

  allRight.forEach((el, i) => {
    if (!el) return
    const z0 = -80 - i * 95
    const ang = WALL_ANGLE
    const xOff = WALL_OFFSET_X
    gsap.set(el, {
      transform: `rotateY(${ang}deg) translateZ(${z0}px) translateX(${xOff}px)`,
      opacity: 0.25,
      filter: 'blur(3px) brightness(0.45)',
      zIndex: depthCount - i,
    })
  })

  gsap.set(floorRef.value, { opacity: 0.35 })
  gsap.set(headerRef.value, { opacity: 0, y: 20, filter: 'blur(3px)' })

  // ===== 主 ScrollTrigger =====
  const mainSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 90%',
    end: 'bottom 10%',
    scrub: 1.6,
    onUpdate(self) {
      const p = clamp(self.progress, 0, 1)
      const eased = 1 - Math.pow(1 - p, 2.5)

      // Z 偏移量：整个场景向前推进
      const zShift = eased * CORRIDOR_DEPTH

      // 更新地板透视
      if (floorRef.value) {
        floorRef.value.style.opacity = String((0.12 + eased * 0.23).toFixed(3))
        floorRef.value.style.transform = `perspective(1000px) rotateX(${(58 - eased * 18).toFixed(1)}deg) scaleY(${(1.1 + eased * 0.6).toFixed(2)})`
      }

      // 更新每张照片
      for (let i = 0; i < depthCount; i++) {
        const zBase = -80 - i * 95
        let z = zBase + zShift
        // 循环：最前面的照片绕回最后
        while (z > -20) z -= (CORRIDOR_DEPTH + 60)

        // 距离最佳焦点有多远
        const distSweet = Math.abs(z - SWEET_SPOT_Z)
        const focus = clamp(1 - distSweet / 280, 0.08, 1)

        const blurAmt = 5.5 * (1 - focus)
        const brightAmt = 0.2 + focus * 0.8
        const op = 0.12 + focus * 0.88
        // Z-index: 越近越高
        const zi = Math.round(10 + (1 - (z + CORRIDOR_DEPTH) / CORRIDOR_DEPTH) * 20)

        // 左墙
        const elL = allLeft[i]
        if (elL) {
          elL.style.transform = `rotateY(${-WALL_ANGLE}deg) translateZ(${z.toFixed(1)}px) translateX(${-WALL_OFFSET_X}px)`
          elL.style.opacity = String(op.toFixed(3))
          elL.style.filter = `blur(${blurAmt.toFixed(1)}px) brightness(${brightAmt.toFixed(2)})`
          elL.style.zIndex = String(zi)
        }

        // 右墙
        const elR = allRight[i]
        if (elR) {
          elR.style.transform = `rotateY(${WALL_ANGLE}deg) translateZ(${z.toFixed(1)}px) translateX(${WALL_OFFSET_X}px)`
          elR.style.opacity = String(op.toFixed(3))
          elR.style.filter = `blur(${blurAmt.toFixed(1)}px) brightness(${brightAmt.toFixed(2)})`
          elR.style.zIndex = String(zi)
        }
      }
    },
    onLeaveBack() {
      allLeft.forEach((el, i) => {
        if (!el) return
        const z0 = -80 - i * 95
        el.style.transform = `rotateY(${-WALL_ANGLE}deg) translateZ(${z0}px) translateX(${-WALL_OFFSET_X}px)`
        el.style.opacity = '0.25'
        el.style.filter = 'blur(3px) brightness(0.45)'
        el.style.zIndex = String(depthCount - i)
      })
      allRight.forEach((el, i) => {
        if (!el) return
        const z0 = -80 - i * 95
        el.style.transform = `rotateY(${WALL_ANGLE}deg) translateZ(${z0}px) translateX(${WALL_OFFSET_X}px)`
        el.style.opacity = '0.25'
        el.style.filter = 'blur(3px) brightness(0.45)'
        el.style.zIndex = String(depthCount - i)
      })
      if (floorRef.value) { floorRef.value.style.opacity = '0.12'; floorRef.value.style.transform = 'perspective(1000px) rotateX(58deg) scaleY(1.1)' }
    },
  })
  cleanupFns.push(() => mainSt.kill())

  // ===== 标题 =====
  const headerSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 68%',
    end: 'top 24%',
    scrub: 0.7,
    onUpdate(self) {
      const p = clamp(self.progress, 0, 1)
      const e = Math.pow(p, 0.6)
      if (!headerRef.value) return
      headerRef.value.style.opacity = String(e.toFixed(3))
      headerRef.value.style.transform = `translateY(${(20 * (1 - e)).toFixed(1)}px)`
      headerRef.value.style.filter = `blur(${(3 * (1 - e)).toFixed(1)}px)`
    },
  })
  cleanupFns.push(() => headerSt.kill())
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.cg-section {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0c0f19;
}

// ==================== 建筑背景 ====================
.cg-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 50% 35%, rgba(30, 45, 70, 0.25), transparent 60%),
    radial-gradient(ellipse at 50% 50%, rgba(20, 35, 55, 0.15), transparent 55%),
    linear-gradient(180deg,
      #0e1220 0%, #0c101c 30%, #0a0e18 60%, #080c14 100%
    );
}

// ==================== 地板 ====================
.cg-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 38%;
  z-index: 1;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 18px,
      rgba(40, 60, 90, 0.08) 18px,
      rgba(40, 60, 90, 0.08) 19px
    ),
    linear-gradient(0deg,
      rgba(15, 20, 35, 0.95) 0%,
      rgba(12, 18, 30, 0.6) 40%,
      rgba(10, 15, 25, 0.15) 100%
    );
  transform: perspective(1000px) rotateX(58deg) scaleY(1.1);
  transform-origin: 50% 100%;
  will-change: transform, opacity;
  pointer-events: none;
}

// ==================== 顶部灯光 ====================
.cg-lights {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.cg-light {
  position: absolute;
  top: 0;
  width: 2px;
  height: 40%;
  background: linear-gradient(
    180deg,
    rgba(255, 240, 210, 0.05) 0%,
    rgba(200, 180, 140, 0.08) 15%,
    rgba(180, 160, 120, 0.03) 50%,
    transparent 100%
  );
  box-shadow:
    0 0 20px rgba(255, 230, 180, 0.04),
    0 0 40px rgba(220, 200, 140, 0.02);
  animation: cgLightDrift 8s ease-in-out infinite;
}

@keyframes cgLightDrift {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

// ==================== 3D 场景 ====================
.cg-scene {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
  height: 600px;
  z-index: 4;
  perspective: 1500px;
  perspective-origin: 50% 48%;
}

// ==================== 照片墙 ====================
.cg-photo-wall {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 230px;
  height: 155px;
  margin-left: -115px;
  margin-top: -77.5px;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  pointer-events: none;
}

// ==================== 相框 ====================
.cg-frame {
  position: relative;
  width: 230px;
  height: 155px;
  padding: 8px;
  background: linear-gradient(135deg, #1a1e28, #141820);
  border-radius: 2px;
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.5),
    inset 0 0 0 0.5px rgba(160, 180, 200, 0.1);
  overflow: hidden;
}

.cg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 1px;
}

.cg-glare {
  position: absolute;
  inset: 8px;
  pointer-events: none;
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.03) 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.08) 100%
  );
}

// ==================== 标签 ====================
.cg-tag {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  color: rgba(160, 185, 210, 0.35);
  font-family: 'Courier New', monospace;
  white-space: nowrap;
}

// ==================== 暗角 ====================
.cg-vignette {
  position: absolute;
  inset: 0;
  z-index: 8;
  pointer-events: none;
  background: radial-gradient(ellipse at center,
    transparent 30%,
    rgba(5, 8, 14, 0.25) 50%,
    rgba(4, 6, 12, 0.55) 72%,
    rgba(2, 4, 8, 0.8) 90%
  );
}

// ==================== 标题 ====================
.cg-header {
  position: absolute;
  top: 7%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 14;
  text-align: center;
  pointer-events: none;
}

.cg-museum {
  display: inline-block;
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: rgba(180, 200, 220, 0.4);
  border: 0.5px solid rgba(150, 175, 200, 0.15);
  padding: 4px 16px;
  border-radius: 1px;
  margin-bottom: 16px;
  font-family: 'Courier New', monospace;
}

.cg-title {
  font-size: clamp(1.9rem, 5vw, 3.4rem);
  font-weight: 200;
  letter-spacing: 0.14em;
  color: #d5dde8;
  margin: 0 0 12px;
  text-shadow:
    0 0 25px rgba(140, 170, 210, 0.12),
    0 0 50px rgba(100, 140, 180, 0.06);
}

.cg-line {
  display: block;
  width: 70px;
  height: 1px;
  margin: 0 auto 12px;
  background: linear-gradient(90deg,
    transparent,
    rgba(150, 180, 210, 0.3),
    rgba(130, 160, 190, 0.2),
    transparent
  );
}

.cg-sub {
  font-size: clamp(0.6rem, 0.95vw, 0.76rem);
  font-weight: 400;
  letter-spacing: 0.07em;
  color: rgba(150, 175, 200, 0.35);
  margin: 0;
  font-family: 'Courier New', monospace;
}
</style>
