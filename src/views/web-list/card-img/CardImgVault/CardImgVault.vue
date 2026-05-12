<template>
  <div ref="parentRef" class="card-img-vault">
    <div ref="vaultRef" class="vault-container">
      <div class="vault-door">
        <img
          ref="imageRef"
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          alt="保险柜影像"
          class="vault-image"
        />
        <!-- 十字光标 -->
        <div ref="crosshairRef" class="crosshair">
          <div class="crosshair-h"></div>
          <div class="crosshair-v"></div>
        </div>
        <!-- 锁芯装饰 -->
        <div class="vault-lock">
          <div class="lock-ring"></div>
          <div class="lock-center"></div>
        </div>
        <!-- 金属柜门阴影 -->
        <div class="vault-shadow"></div>
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
const vaultRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const crosshairRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  if (!parentRef.value || !vaultRef.value || !imageRef.value || !crosshairRef.value) return

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parentRef.value,
      start: 'top 100%',
      end: 'bottom 20%',
      scrub: 1.5
    }
  })

  // 主开锁动画：淡入+旋转回正
  tl.fromTo(
    imageRef.value,
    { opacity: 0, rotateZ: -2.5 },
    { opacity: 1, rotateZ: 0, duration: 2.2, ease: 'power3.inOut' }
  )

  // 十字光标：归零瞬间闪现
  tl.fromTo(
    crosshairRef.value,
    { opacity: 0, scale: 0.8 },
    { opacity: 0.6, scale: 1, duration: 0.15, ease: 'none' },
    '>-0.1'
  )
  tl.to(crosshairRef.value, { opacity: 0, duration: 0.15, ease: 'power2.out' })

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
.card-img-vault {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 50%, #0a0a0a 100%);
  overflow: hidden;
}

.vault-container {
  position: relative;
  width: 85vmin;
  height: 85vmin;
  max-width: 800px;
  max-height: 800px;
}

.vault-door {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 40%, #0d0d0d 100%);
  box-shadow: 
    0 0 100px rgba(0, 0, 0, 0.8),
    inset 0 0 80px rgba(0, 0, 0, 0.6),
    inset 0 2px 4px rgba(60, 60, 60, 0.3),
    0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  transform-origin: center center;
}

.vault-image {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  border-radius: 12px;
  object-fit: cover;
  opacity: 0;
  transform-origin: center center;
  filter: 
    brightness(0.95)
    contrast(1.05)
    saturate(0.9);
  box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
  z-index: 10;

  .crosshair-h {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 220, 100, 0.8) 30%,
      rgba(255, 220, 100, 1) 50%,
      rgba(255, 220, 100, 0.8) 70%,
      transparent 100%
    );
    transform: translateY(-50%);
  }

  .crosshair-v {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(255, 220, 100, 0.8) 30%,
      rgba(255, 220, 100, 1) 50%,
      rgba(255, 220, 100, 0.8) 70%,
      transparent 100%
    );
    transform: translateX(-50%);
  }
}

.vault-lock {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;

  .lock-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    border: 3px solid rgba(80, 80, 80, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 100%;
      width: 12px;
      height: 3px;
      background: rgba(80, 80, 80, 0.6);
      transform: translateY(-50%);
    }
  }

  .lock-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    background: radial-gradient(circle, rgba(60, 60, 60, 0.8) 0%, rgba(40, 40, 40, 0.6) 100%);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}

.vault-shadow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  box-shadow: 
    inset 0 0 100px rgba(0, 0, 0, 0.4),
    inset 4px 4px 20px rgba(0, 0, 0, 0.3),
    inset -4px -4px 20px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  animation: vaultBreath 6s ease-in-out infinite;
}

@keyframes vaultBreath {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}

// 柜门金属质感
.vault-door::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.03) 0%,
    transparent 100%
  );
  pointer-events: none;
}

.vault-door::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  border: 1px solid rgba(60, 60, 60, 0.3);
  border-radius: 16px;
  pointer-events: none;
}
</style>
