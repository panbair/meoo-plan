<template>
  <div class="sf-section" ref="sectionRef">
    <!-- 画廊墙面 -->
    <div class="sf-wall"></div>

    <!-- 光斑 -->
    <div class="sf-spot sf-spot-1"></div>
    <div class="sf-spot sf-spot-2"></div>

    <!-- 画廊布局 -->
    <div class="sf-gallery" ref="galleryRef">
      <div
        v-for="(photo, idx) in photos"
        :key="photo.id"
        class="sf-frame-wrap"
        :class="'sf-row-' + photo.row"
        :ref="(el: any) => { if (el) frameRefs[idx] = el }"
      >
        <!-- 幻灯框 -->
        <div class="sf-frame" :class="'sf-dir-' + photo.dir">
          <div class="sf-frame-inner">
            <img
              :src="photo.url"
              :alt="photo.title"
              class="sf-photo"
              crossorigin="anonymous"
            />
            <!-- 幻灯片编号 -->
            <span class="sf-num">{{ String(photo.id).padStart(3, '0') }}</span>
          </div>
          <!-- 框标签 -->
          <div class="sf-label">
            <span class="sf-title">{{ photo.title }}</span>
            <span class="sf-date">{{ photo.date }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 标题铭牌 -->
    <div class="sf-plaque" ref="plaqueRef">
      <span class="sf-plaque-no">GALLERY · 0{{ photos.length }}</span>
      <h2 class="sf-plaque-title">幻灯展览</h2>
      <span class="sf-plaque-line"></span>
      <p class="sf-plaque-sub">SLIDE FRAME EXHIBITION</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type CleanupFn = () => void

// ==================== 照片数据 ====================
interface PhotoItem {
  id: number
  url: string
  title: string
  date: string
  row: number   // 行号：0/1/2
  dir: string   // 入场方向：left / right / bottom / scale
}

const photoUrls = [
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=600&h=400&fit=crop',
]

const titles = [
  '海浪', '山间晨光', '林中小径', '远山淡雾',
  '晨曦林地', '瀑布流云', '秋日原野', '星云深处',
  '静谧湖面', '时光小径'
]

const dates = [
  '2026 / 01', '2026 / 02', '2026 / 03', '2026 / 04',
  '2026 / 05', '2026 / 06', '2026 / 07', '2026 / 08',
  '2026 / 09', '2026 / 10'
]

// 行号和进场方向
const rows = [0, 1, 0, 1, 2, 0, 2, 1, 2, 0]
const dirs = ['left', 'right', 'left', 'scale', 'right', 'bottom', 'left', 'right', 'bottom', 'scale']

const photos = ref<PhotoItem[]>(
  photoUrls.map((url, i) => ({
    id: i + 1,
    url,
    title: titles[i],
    date: dates[i],
    row: rows[i],
    dir: dirs[i],
  }))
)

// ==================== Refs ====================
const sectionRef = ref<HTMLElement | null>(null)
const galleryRef = ref<HTMLElement | null>(null)
const plaqueRef = ref<HTMLElement | null>(null)
const frameRefs = ref<(HTMLElement | null)[]>([])

let cleanupFns: CleanupFn[] = []

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

  // 初始状态：所有照片不可见
  frameRefs.value.forEach((el, i) => {
    if (!el) return
    const dir = dirs[i]
    let startX = 0, startY = 0, startScale = 1
    if (dir === 'left') { startX = -80; startY = 20 }
    else if (dir === 'right') { startX = 80; startY = 20 }
    else if (dir === 'bottom') { startX = 0; startY = 60 }
    else if (dir === 'scale') { startScale = 0.7; startY = 30 }

    gsap.set(el, {
      x: startX,
      y: startY,
      scale: startScale,
      opacity: 0,
      filter: 'blur(6px)',
      rotationX: dir === 'scale' ? 15 : 0,
      rotationY: dir === 'left' ? -12 : dir === 'right' ? 12 : 0,
      rotationZ: 0,
    })
  })

  gsap.set(plaqueRef.value, { opacity: 0, y: 30, filter: 'blur(4px)' })

  const total = photos.value.length

  // ===== 照片逐个入场 =====
  photoUrls.forEach((_, i) => {
    const st = ScrollTrigger.create({
      trigger: container,
      start: `top ${88 - i * 1.8}%`,
      end: `top ${42 - i * 1.8}%`,
      scrub: 1.5,
      onUpdate(self) {
        const p = clamp(self.progress, 0, 1)
        const eased = 1 - Math.pow(1 - p, 2.5)
        const el = frameRefs.value[i]
        if (!el) return

        const dir = dirs[i]
        let x = 0, y = 0, sc = 1, rx = 0, ry = 0

        if (dir === 'left') {
          x = -80 * (1 - eased)
          y = 20 * (1 - eased)
          ry = -12 * (1 - eased)
        } else if (dir === 'right') {
          x = 80 * (1 - eased)
          y = 20 * (1 - eased)
          ry = 12 * (1 - eased)
        } else if (dir === 'bottom') {
          y = 60 * (1 - eased)
        } else if (dir === 'scale') {
          sc = 0.7 + 0.3 * eased
          y = 30 * (1 - eased)
          rx = 15 * (1 - eased)
        }

        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${sc.toFixed(3)}) rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`
        el.style.opacity = String(eased.toFixed(3))
        el.style.filter = `blur(${(6 * (1 - eased)).toFixed(1)}px)`
      },
    })
    cleanupFns.push(() => st.kill())
  })

  // ===== 铭牌入场 =====
  const plaqueSt = ScrollTrigger.create({
    trigger: container,
    start: 'top 72%',
    end: 'top 34%',
    scrub: 1,
    onUpdate(self) {
      const p = clamp(self.progress, 0, 1)
      const eased = Math.pow(p, 0.7)
      if (!plaqueRef.value) return
      plaqueRef.value.style.opacity = String(eased.toFixed(3))
      plaqueRef.value.style.transform = `translateY(${(30 * (1 - eased)).toFixed(1)}px)`
      plaqueRef.value.style.filter = `blur(${(4 * (1 - eased)).toFixed(1)}px)`
    },
  })
  cleanupFns.push(() => plaqueSt.kill())
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.sf-section {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  background: #f5f2ec;
  padding: clamp(100px, 15vh, 160px) clamp(20px, 5vw, 80px) clamp(60px, 12vh, 100px);
}

// ==================== 画廊墙面 ====================
.sf-wall {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 30% 25%, rgba(220, 210, 190, 0.25), transparent 55%),
    radial-gradient(ellipse at 70% 60%, rgba(210, 200, 180, 0.15), transparent 50%),
    linear-gradient(180deg, #f8f6f1 0%, #f2efe7 30%, #ede9de 70%, #f0ece2 100%);
}

// ==================== 光斑 ====================
.sf-spot {
  position: absolute;
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  opacity: 0.45;
  filter: blur(60px);
  &-1 {
    top: 18%;
    left: 10%;
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, rgba(200, 210, 220, 0.55), transparent 60%);
  }
  &-2 {
    bottom: 15%;
    right: 8%;
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, rgba(230, 220, 200, 0.45), transparent 60%);
  }
}

// ==================== 画廊布局 ====================
.sf-gallery {
  position: relative;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(28px, 5vw, 60px) clamp(24px, 4vw, 50px);
  max-width: 1350px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

// ==================== 照片框包裹 ====================
.sf-frame-wrap {
  position: relative;
  will-change: transform, opacity, filter;

  &.sf-row-0 { transform: translateY(-25px); }
  &.sf-row-1 { transform: translateY(0); }
  &.sf-row-2 { transform: translateY(22px); }
}

// ==================== 幻灯框 ====================
.sf-frame {
  position: relative;
  padding: 18px 18px 14px;
  background: #ffffff;
  border-radius: 3px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 6px 16px rgba(0, 0, 0, 0.05),
    0 14px 32px rgba(0, 0, 0, 0.035),
    0 0 0 0.5px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.6s ease;

  &:hover {
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.07),
      0 10px 24px rgba(0, 0, 0, 0.065),
      0 20px 44px rgba(0, 0, 0, 0.045),
      0 0 0 0.5px rgba(0, 0, 0, 0.05);
  }
}

.sf-frame-inner {
  position: relative;
  overflow: hidden;
  border-radius: 1px;
}

.sf-photo {
  display: block;
  width: clamp(200px, 24vw, 340px);
  height: clamp(135px, 16vw, 225px);
  object-fit: cover;
  transition: transform 0.6s ease;
}

.sf-frame:hover .sf-photo {
  transform: scale(1.035);
}

// ==================== 编号 ====================
.sf-num {
  position: absolute;
  top: -2px;
  right: 0;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(0, 0, 0, 0.35);
  padding: 2px 7px 2px 8px;
  border-radius: 0 1px 0 2px;
  backdrop-filter: blur(2px);
  font-family: 'Courier New', monospace;
}

// ==================== 标签 ====================
.sf-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 12px;
  padding: 0 2px;
}

.sf-title {
  font-size: clamp(0.7rem, 1.05vw, 0.88rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #3a3835;
}

.sf-date {
  font-size: 10.5px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: #b5af9f;
  font-family: 'Courier New', monospace;
}

// ==================== 铭牌 ====================
.sf-plaque {
  position: relative;
  z-index: 5;
  text-align: center;
  margin-top: clamp(20px, 4vh, 50px);
  pointer-events: none;
}

.sf-plaque-no {
  display: block;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.12em;
  color: #beb8a8;
  font-family: 'Courier New', monospace;
  margin-bottom: 14px;
}

.sf-plaque-title {
  font-size: clamp(1.8rem, 4.5vw, 3.2rem);
  font-weight: 200;
  letter-spacing: clamp(0.06em, 0.12em, 0.18em);
  color: #2e2b26;
  margin: 0 0 14px;
}

.sf-plaque-line {
  display: block;
  width: 70px;
  height: 1px;
  margin: 0 auto 14px;
  background: linear-gradient(90deg,
    transparent, #c8c0ac 30%, #b0a88e 70%, transparent
  );
}

.sf-plaque-sub {
  font-size: clamp(0.6rem, 0.95vw, 0.78rem);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #c0b9a2;
  margin: 0;
  font-family: 'Courier New', monospace;
}
</style>
