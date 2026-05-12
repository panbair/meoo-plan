<template>
  <div class="card-img-focus-ring" ref="containerRef">
    <div class="focus-ring-scene" ref="sceneRef">
      <!-- 背景光晕 -->
      <div class="scene-glow" ref="sceneGlowRef"></div>

      <!-- 图片容器 -->
      <div class="image-container" ref="imageContainerRef">
        <!-- R 通道层 -->
        <div class="channel-layer channel-r" ref="channelRedRef">
          <img
            :src="imageUrl"
            alt="Focus ring red channel"
            class="channel-image"
            loading="lazy"
          />
        </div>

        <!-- G 通道层 -->
        <div class="channel-layer channel-g" ref="channelGreenRef">
          <img
            :src="imageUrl"
            alt="Focus ring green channel"
            class="channel-image"
            loading="lazy"
          />
        </div>

        <!-- B 通道层 -->
        <div class="channel-layer channel-b" ref="channelBlueRef">
          <img
            :src="imageUrl"
            alt="Focus ring blue channel"
            class="channel-image"
            loading="lazy"
          />
        </div>

        <!-- 原始图片层 -->
        <div class="channel-layer channel-original" ref="channelOriginalRef">
          <img
            :src="imageUrl"
            alt="Focus ring original"
            class="channel-image"
            ref="originalImageRef"
            loading="lazy"
          />
        </div>
      </div>

      <!-- 金属对焦环 -->
      <div class="focus-ring-frame" ref="focusRingFrameRef">
        <!-- 外环 -->
        <div class="ring-outer" ref="ringOuterRef">
          <!-- 刻度 -->
          <div class="ring-ticks" ref="ringTicksRef">
            <div 
              v-for="i in 36" 
              :key="i"
              class="ring-tick"
              :class="{ major: i % 9 === 0 }"
              :style="{ transform: `rotate(${i * 10}deg)` }"
            ></div>
          </div>
          
          <!-- 刻度数字 -->
          <div class="ring-numbers" ref="ringNumbersRef">
            <span class="ring-number" data-value="∞" style="transform: rotate(0deg)">∞</span>
            <span class="ring-number" data-value="8" style="transform: rotate(40deg)">8</span>
            <span class="ring-number" data-value="4" style="transform: rotate(80deg)">4</span>
            <span class="ring-number" data-value="2" style="transform: rotate(120deg)">2</span>
            <span class="ring-number" data-value="1" style="transform: rotate(160deg)">1</span>
            <span class="ring-number" data-value="0.5" style="transform: rotate(200deg)">0.5</span>
            <span class="ring-number" data-value="0.3" style="transform: rotate(240deg)">0.3</span>
            <span class="ring-number" data-value="0.2" style="transform: rotate(280deg)">0.2</span>
            <span class="ring-number" data-value="近" style="transform: rotate(320deg)">近</span>
          </div>
        </div>

        <!-- 指针 -->
        <div class="ring-pointer" ref="ringPointerRef">
          <div class="pointer-line"></div>
          <div class="pointer-indicator"></div>
        </div>

        <!-- 内环 -->
        <div class="ring-inner" ref="ringInnerRef"></div>
      </div>

      <!-- 合焦光晕 -->
      <div class="focus-lock-glow" ref="focusLockGlowRef"></div>

      <!-- 参数显示 -->
      <div class="focus-params" ref="focusParamsRef">
        <div class="param-item">
          <span class="param-label">FOCUS</span>
          <span class="param-value" ref="focusDistanceRef">0.3m</span>
        </div>
        <div class="param-item">
          <span class="param-label">BLUR</span>
          <span class="param-value" ref="blurValueRef">25px</span>
        </div>
        <div class="param-item">
          <span class="param-label">APERTURE</span>
          <span class="param-value">f/1.4</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TweenCleanup {
  kill: () => void
}

interface Props {
  imageUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80'
})

// Refs
const containerRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const sceneGlowRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const channelRedRef = ref<HTMLElement | null>(null)
const channelGreenRef = ref<HTMLElement | null>(null)
const channelBlueRef = ref<HTMLElement | null>(null)
const channelOriginalRef = ref<HTMLElement | null>(null)
const originalImageRef = ref<HTMLImageElement | null>(null)
const focusRingFrameRef = ref<HTMLElement | null>(null)
const ringOuterRef = ref<HTMLElement | null>(null)
const ringTicksRef = ref<HTMLElement | null>(null)
const ringNumbersRef = ref<HTMLElement | null>(null)
const ringPointerRef = ref<HTMLElement | null>(null)
const ringInnerRef = ref<HTMLElement | null>(null)
const focusLockGlowRef = ref<HTMLElement | null>(null)
const focusParamsRef = ref<HTMLElement | null>(null)
const focusDistanceRef = ref<HTMLElement | null>(null)
const blurValueRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

// 创建手动对焦动画
const createFocusRingAnimation = () => {
  if (!containerRef.value) return

  // 主时间线
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top 100%',
      end: 'bottom 0%',
      scrub: 1.5
    }
  })

  cleanupFns.push({
    kill: () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === containerRef.value) {
          st.kill()
        }
      })
    }
  })

  // ===== 阶段0: 初始状态设置 =====
  // 极度失焦状态
  gsap.set(imageContainerRef.value, {
    scale: 1.35,
    filter: 'blur(25px)',
    opacity: 0.85
  })

  gsap.set(channelRedRef.value, { x: -7 })
  gsap.set(channelGreenRef.value, { x: 0 })
  gsap.set(channelBlueRef.value, { x: 7 })

  // 对焦环初始位置 - 近端
  gsap.set(focusRingFrameRef.value, { rotation: -15, opacity: 0.6 })
  gsap.set(ringPointerRef.value, { rotation: -15 })

  // ===== 阶段1: 对焦环开始旋转 =====
  tl.to(focusRingFrameRef.value,
    {
      rotation: 0,
      opacity: 1,
      ease: 'power3.inOut',
      duration: 2.4
    },
    0
  )

  // ===== 阶段2: 指针同步旋转 =====
  tl.to(ringPointerRef.value,
    {
      rotation: 0,
      ease: 'power3.inOut',
      duration: 2.4
    },
    0
  )

  // ===== 阶段3: 图片缩放回归 (1.35 -> 1.0) =====
  tl.to(imageContainerRef.value,
    {
      scale: 1.0,
      ease: 'power3.inOut',
      duration: 2.4
    },
    0
  )

  // ===== 阶段4: 模糊度下降 (25px -> 0) =====
  // 正常对焦过程
  tl.to(imageContainerRef.value,
    {
      filter: 'blur(0px)',
      ease: 'power3.inOut',
      duration: 2.4
    },
    0
  )

  // ===== 阶段5: RGB通道色散消除 =====
  // 红色通道归位
  tl.to(channelRedRef.value,
    {
      x: 0,
      ease: 'power3.inOut',
      duration: 2.4
    },
    0
  )

  // 蓝色通道归位
  tl.to(channelBlueRef.value,
    {
      x: 0,
      ease: 'power3.inOut',
      duration: 2.4
    },
    0
  )

  // 色散加速收敛（接近合焦时）
  tl.to([channelRedRef.value, channelBlueRef.value],
    {
      x: 0,
      ease: 'power2.in',
      duration: 0.4
    },
    2.0
  )

  // ===== 阶段6: 焦点过冲 (在blur归零前) =====
  // 短暂过冲至锐化
  tl.to(imageContainerRef.value,
    {
      filter: 'blur(-1.5px)', // 负模糊产生锐化效果
      scale: 1.005,
      ease: 'power2.in',
      duration: 0.15
    },
    2.25
  )

  // 回稳
  tl.to(imageContainerRef.value,
    {
      filter: 'blur(0px)',
      scale: 1.0,
      ease: 'power2.out',
      duration: 0.15
    },
    2.4
  )

  // ===== 阶段7: 指针微震锁定 =====
  tl.to(ringPointerRef.value,
    {
      rotation: [0, 2, -1, 0.5, 0],
      ease: 'none',
      duration: 0.3
    },
    2.4
  )

  // ===== 阶段8: 合焦光晕 =====
  tl.fromTo(focusLockGlowRef.value,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.3 },
    2.55
  )

  tl.to(focusLockGlowRef.value,
    { opacity: 0, ease: 'power2.in', duration: 0.4 },
    2.85
  )

  // ===== 阶段9: 刻度数字亮起 =====
  if (ringNumbersRef.value) {
    const numbers = ringNumbersRef.value.querySelectorAll('.ring-number')
    tl.to(numbers,
      {
        textShadow: '0 0 20px rgba(255, 200, 100, 0.8)',
        color: '#ffd700',
        duration: 0.3
      },
      2.5
    )

    tl.to(numbers,
      {
        textShadow: '0 0 8px rgba(255, 200, 100, 0.3)',
        color: '#ccc',
        duration: 0.5
      },
      2.8
    )
  }

  // ===== 阶段10: 图片透明度恢复 =====
  tl.to(imageContainerRef.value,
    {
      opacity: 1,
      ease: 'power2.out',
      duration: 0.5
    },
    2.5
  )

  // ===== 参数显示更新 =====
  const distances = ['0.3m', '0.5m', '1m', '2m', '4m', '8m', '∞']
  const blurs = ['25px', '18px', '12px', '6px', '3px', '1px', '0px']

  distances.forEach((dist, i) => {
    tl.to({}, {
      duration: 0,
      onStart: () => {
        if (focusDistanceRef.value) {
          focusDistanceRef.value.textContent = dist
        }
        if (blurValueRef.value) {
          blurValueRef.value.textContent = blurs[i]
        }
      }
    }, i * (2.4 / 7))
  })
}

// 初始化边缘光晕动画
const initAmbientAnimations = () => {
  // 边缘金属环呼吸
  if (focusRingFrameRef.value) {
    gsap.to(focusRingFrameRef.value, {
      boxShadow: '0 0 40px rgba(255, 200, 100, 0.3), inset 0 0 30px rgba(255, 200, 100, 0.1)',
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // 场景光晕呼吸
  if (sceneGlowRef.value) {
    gsap.to(sceneGlowRef.value, {
      opacity: 0.6,
      scale: 1.1,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // 对焦环旋转
  if (ringOuterRef.value) {
    gsap.to(ringOuterRef.value, {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: 'none'
    })
  }

  // 内环反向旋转
  if (ringInnerRef.value) {
    gsap.to(ringInnerRef.value, {
      rotation: -360,
      duration: 45,
      repeat: -1,
      ease: 'none'
    })
  }
}

onMounted(() => {
  requestAnimationFrame(() => {
    createFocusRingAnimation()
    initAmbientAnimations()
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.kill())
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.trigger === containerRef.value) {
      st.kill()
    }
  })
  gsap.killTweensOf('*')
})
</script>

<style lang="scss" scoped>
.card-img-focus-ring {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    160deg,
    #1a1a2e 0%,
    #16213e 30%,
    #1a1a2e 60%,
    #0f0f23 100%
  );
}

.focus-ring-scene {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

// 场景光晕
.scene-glow {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 50% 50%, rgba(255, 200, 100, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 30%, rgba(100, 150, 255, 0.05) 0%, transparent 40%);
  pointer-events: none;
  opacity: 0.4;
}

// 图片容器
.image-container {
  position: absolute;
  width: 65vw;
  height: 70vh;
  max-width: 850px;
  max-height: 900px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 30px 100px rgba(0, 0, 0, 0.5),
    0 10px 40px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

// 通道层
.channel-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;

  .channel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// RGB通道叠加
.channel-r {
  mix-blend-mode: screen;
  filter: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='redChannel'%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/%3E%3C/filter%3E%3C/svg%3E#redChannel");
  
  .channel-image {
    filter: sepia(100%) saturate(300%) hue-rotate(-30deg);
  }
}

.channel-g {
  mix-blend-mode: screen;
  
  .channel-image {
    filter: sepia(100%) saturate(200%) hue-rotate(0deg);
  }
}

.channel-b {
  mix-blend-mode: screen;
  
  .channel-image {
    filter: sepia(100%) saturate(300%) hue-rotate(210deg);
  }
}

.channel-original {
  .channel-image {
    mix-blend-mode: normal;
  }
}

// ===== 金属对焦环 =====
.focus-ring-frame {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(65vw + 120px);
  height: calc(70vh + 120px);
  max-width: 970px;
  max-height: 1020px;
  border-radius: 50%;
  z-index: 10;
  box-shadow: 
    0 0 20px rgba(255, 200, 100, 0.15),
    inset 0 0 20px rgba(255, 200, 100, 0.05);
}

// 外环
.ring-outer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  background: 
    linear-gradient(#2a2a3e, #2a2a3e) padding-box,
    linear-gradient(135deg, #c0c0c0, #808080, #c0c0c0, #606060, #c0c0c0) border-box;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3),
    0 4px 20px rgba(0, 0, 0, 0.3);
}

// 刻度
.ring-ticks {
  position: absolute;
  inset: 8px;
  border-radius: 50%;

  .ring-tick {
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: 12px;
    background: #888;
    transform-origin: center calc(50vh + 60px);
    margin-left: -0.5px;

    &.major {
      width: 2px;
      height: 18px;
      background: #aaa;
      margin-left: -1px;
    }
  }
}

// 刻度数字
.ring-numbers {
  position: absolute;
  inset: 30px;

  .ring-number {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 10px;
    font-weight: 600;
    color: #999;
    font-family: 'Courier New', monospace;
    transform-origin: center center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    margin-left: -8px;
    margin-top: -6px;
  }
}

// 指针
.ring-pointer {
  position: absolute;
  left: 50%;
  top: 0;
  transform-origin: center center;
  width: 4px;
  height: 50%;
  transform: translateX(-50%);

  .pointer-line {
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 200, 100, 0.9) 0%,
      rgba(255, 200, 100, 0.6) 70%,
      transparent 100%
    );
    transform: translateX(-50%);
    box-shadow: 0 0 10px rgba(255, 200, 100, 0.5);
  }

  .pointer-indicator {
    position: absolute;
    left: 50%;
    top: 8px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid rgba(255, 200, 100, 0.9);
    transform: translateX(-50%);
    filter: drop-shadow(0 0 6px rgba(255, 200, 100, 0.6));
  }
}

// 内环
.ring-inner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  border-radius: 50%;
  border: 1px solid rgba(150, 150, 150, 0.3);
  background: transparent;
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
}

// 合焦光晕
.focus-lock-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  background: 
    radial-gradient(
      ellipse at 50% 50%,
      rgba(255, 220, 150, 0.3) 0%,
      rgba(255, 200, 100, 0.1) 30%,
      transparent 60%
    );
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  filter: blur(20px);
}

// 参数显示
.focus-params {
  position: absolute;
  bottom: 40px;
  left: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 200, 100, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  z-index: 20;

  .param-item {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .param-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.5);
    font-family: 'Courier New', monospace;
    min-width: 70px;
  }

  .param-value {
    font-size: 14px;
    font-weight: 600;
    color: #ffd700;
    font-family: 'Courier New', monospace;
    text-shadow: 0 0 10px rgba(255, 200, 100, 0.5);
  }
}
</style>
