<template>
  <div ref="parentRef" class="card-img-sundial">
    <div ref="sundialRef" class="sundial-container">
      <div class="sundial-plate">
        <img
          ref="imageRef"
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="日晷影像"
          class="sundial-image"
        />
        <!-- 午后斜光 -->
        <div ref="sunlightRef" class="sunlight-overlay"></div>
        <!-- 日晷指针阴影 -->
        <div ref="gnomonShadowRef" class="gnomon-shadow"></div>
        <!-- 日晷刻度装饰 -->
        <div class="sundial-marks">
          <span v-for="i in 12" :key="i" class="mark" :style="{ '--index': i }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const sundialRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const sunlightRef = ref<HTMLElement | null>(null)
const gnomonShadowRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !sundialRef.value || !imageRef.value || !sunlightRef.value || !gnomonShadowRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  // 主旋转淡入动画
  tl.fromTo(
    imageRef.value,
    { opacity: 0, rotateZ: -3, scale: 0.95 },
    { opacity: 1, rotateZ: 0, scale: 1, duration: 2, ease: 'sine.inOut' }
  )

  // 斜光动画
  tl.fromTo(
    sunlightRef.value,
    { opacity: 0 },
    { opacity: 1, duration: 1, ease: 'power2.out' },
    '<'
  )

  // 指针阴影在归零瞬间显现
  tl.fromTo(
    gnomonShadowRef.value,
    { opacity: 0, scale: 0.5 },
    { opacity: 0.3, scale: 1, duration: 0.5, ease: 'power2.out' },
    '>-0.3'
  )

  // 保存清理函数
  cleanupFns.push(() => {
    ScrollTrigger.getAll().forEach(st => st.kill())
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style lang="scss" scoped>
.card-img-sundial {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  overflow: hidden;
}

.sundial-container {
  position: relative;
  width: 85vmin;
  height: 85vmin;
  max-width: 800px;
  max-height: 800px;
}

.sundial-plate {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #2d2d44 0%, #1a1a2e 60%, #0d0d1a 100%);
  box-shadow: 
    0 0 80px rgba(255, 200, 100, 0.15),
    0 0 160px rgba(255, 180, 80, 0.08),
    inset 0 0 100px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 220, 150, 0.1);
  overflow: hidden;
  transform-style: preserve-3d;
}

.sundial-image {
  position: absolute;
  top: 8%;
  left: 8%;
  width: 84%;
  height: 84%;
  border-radius: 50%;
  object-fit: cover;
  opacity: 0;
  transform-origin: center center;
  filter: 
    saturate(1.1) 
    contrast(1.05)
    sepia(0.1);
  box-shadow: 
    inset 0 0 60px rgba(0, 0, 0, 0.4),
    inset 0 0 120px rgba(0, 0, 0, 0.2);
}

.sunlight-overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 70%;
  height: 70%;
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 220, 150, 0.12) 50%,
    rgba(255, 200, 100, 0.08) 60%,
    transparent 70%
  );
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transform: rotate(-15deg);
}

.gnomon-shadow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 35%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    transparent 100%
  );
  transform-origin: top center;
  transform: translate(-50%, 0) rotate(0deg);
  opacity: 0;
  pointer-events: none;
  filter: blur(2px);
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid rgba(0, 0, 0, 0.5);
    filter: blur(1px);
  }
}

.sundial-marks {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90%;
  height: 90%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.mark {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 8%;
  background: linear-gradient(
    to bottom,
    rgba(255, 220, 150, 0.4) 0%,
    rgba(255, 200, 100, 0.2) 100%
  );
  transform-origin: center bottom;
  transform: translate(-50%, -100%) 
    rotate(calc((var(--index) - 1) * 30deg - 90deg));
  
  &:nth-child(3n+1) {
    height: 12%;
    background: linear-gradient(
      to bottom,
      rgba(255, 220, 150, 0.6) 0%,
      rgba(255, 200, 100, 0.3) 100%
    );
  }
}

// 外圈装饰
.sundial-plate::before {
  content: '';
  position: absolute;
  top: 3%;
  left: 3%;
  right: 3%;
  bottom: 3%;
  border: 1px solid rgba(255, 220, 150, 0.15);
  border-radius: 50%;
  pointer-events: none;
}

.sundial-plate::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, rgba(255, 220, 150, 0.8) 0%, rgba(200, 160, 100, 0.4) 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 
    0 0 10px rgba(255, 220, 150, 0.5),
    0 0 20px rgba(255, 200, 100, 0.3);
  pointer-events: none;
}
</style>
