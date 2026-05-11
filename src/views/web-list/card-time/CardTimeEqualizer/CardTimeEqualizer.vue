<template>
  <section class="equalizer-section">
    <!-- 背景效果 -->
    <div class="eq-bg">
      <div class="bg-floor"></div>
      <div class="bg-reflection"></div>
      <div class="bg-particles"></div>
      <div class="bg-waves"></div>
    </div>

    <!-- 标题 -->
    <div class="eq-header" ref="headerRef">
      <div class="header-tag">节奏律动</div>
      <h1 class="header-title">音浪频谱</h1>
      <p class="header-subtitle">让视觉跟随节拍跳动</p>
    </div>

    <!-- 频谱均衡器 -->
    <div class="equalizer-container" ref="containerRef">
      <!-- 频谱柱 -->
      <div
        v-for="(genre, index) in genres"
        :key="index"
        class="eq-card"
        :ref="el => { if(el) cardRefs[index] = el as HTMLElement }"
        :style="{
          '--h': genre.height,
          '--color1': genre.color1,
          '--color2': genre.color2,
          '--delay': index * 0.08
        }"
      >
        <!-- 卡片内容 -->
        <div class="card-content">
          <span class="card-genre">{{ genre.name }}</span>
          <span class="card-bpm">{{ genre.bpm }} BPM</span>
        </div>

        <!-- 发光层 -->
        <div class="card-glow"></div>

        <!-- 顶部装饰 -->
        <div class="card-top-cap"></div>

        <!-- 频率指示 -->
        <div class="freq-indicator">
          <span
            v-for="i in 5"
            :key="i"
            class="freq-bar"
            :style="{ animationDelay: `${i * 0.1}s` }"
          ></span>
        </div>
      </div>

      <!-- 地面反光 -->
      <div class="eq-floor"></div>
    </div>

    <!-- 底部控制 -->
    <div class="eq-footer" ref="footerRef">
      <div class="footer-controls">
        <div class="control-btn" @click="replayAnimation">
          <span class="btn-icon">↺</span>
          <span class="btn-text">重播</span>
        </div>
        <div class="control-slider">
          <span class="slider-label">强度</span>
          <input type="range" v-model="intensity" min="1" max="5" step="1" class="slider" />
        </div>
      </div>
      <p class="footer-hint">滚动触发 · 音浪冲击</p>
    </div>

    <!-- 冲击波效果 -->
    <div class="shockwave" ref="shockwaveRef"></div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Genre {
  name: string
  bpm: number
  height: number
  color1: string
  color2: string
}

const genres: Genre[] = [
  { name: 'HIP-HOP', bpm: 90, height: 1.3, color1: '#FF1493', color2: '#9400D3' },
  { name: 'JAZZ', bpm: 120, height: 0.7, color1: '#FFD700', color2: '#FF8C00' },
  { name: 'ROCK', bpm: 140, height: 1.8, color1: '#FF4444', color2: '#FF0000' },
  { name: 'LO-FI', bpm: 85, height: 0.5, color1: '#9B59B6', color2: '#8E44AD' },
  { name: 'EDM', bpm: 130, height: 1.6, color1: '#00FFFF', color2: '#0080FF' },
  { name: 'CLASSIC', bpm: 100, height: 1.0, color1: '#E6E6FA', color2: '#DDA0DD' }
]

// Refs
const headerRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const shockwaveRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

// 强度控制
const intensity = ref(3)

// 清理函数
const cleanupFns: (() => void)[] = []

// 强度映射
const intensityMap: Record<number, { back: number; duration: number }> = {
  1: { back: 2, duration: 0.6 },
  2: { back: 2.5, duration: 0.7 },
  3: { back: 3, duration: 0.8 },
  4: { back: 3.5, duration: 0.9 },
  5: { back: 4, duration: 1.0 }
}

// 播放动画函数
function playAnimation() {
  if (!containerRef.value) return

  const settings = intensityMap[intensity.value] || intensityMap[3]

  // 冲击波效果
  if (shockwaveRef.value) {
    gsap.fromTo(shockwaveRef.value,
      { scale: 0, opacity: 0.8 },
      {
        scale: 3,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      }
    )
  }

  // 卡片弹起动画
  const tl = gsap.timeline()

  // 先设置初始状态
  gsap.set('.eq-card', { scaleY: 0.1, transformOrigin: 'bottom center', opacity: 0 })

  // 弹起动画
  tl.to('.eq-card', {
    scaleY: (i: number, el: Element) => {
      const h = parseFloat((el as HTMLElement).style.getPropertyValue('--h')) || 1
      return h
    },
    opacity: 1,
    duration: settings.duration,
    stagger: {
      each: 0.08,
      from: 'random'
    },
    ease: `back.out(${settings.back})`
  })

  // 阴影增强
  tl.to('.eq-card', {
    boxShadow: (i: number, el: Element) => {
      const color1 = (el as HTMLElement).style.getPropertyValue('--color1') || '#FF1493'
      return `0 0 60px ${color1}cc, 0 0 100px ${color1}66`
    },
    stagger: 0.08,
    duration: 0.3,
    ease: 'power2.out'
  }, '-=0.4')

  // 阴影恢复正常
  tl.to('.eq-card', {
    boxShadow: (i: number, el: Element) => {
      const color1 = (el as HTMLElement).style.getPropertyValue('--color1') || '#FF1493'
      return `0 0 30px ${color1}66`
    },
    stagger: 0.08,
    duration: 0.3,
    ease: 'power2.inOut'
  }, '+=0.1')

  // 地面反光
  tl.fromTo('.eq-floor',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 },
    '-=0.6'
  )

  return tl
}

function replayAnimation() {
  // 重置卡片状态
  gsap.set('.eq-card', { scaleY: 0.1, opacity: 0 })
  gsap.set('.eq-floor', { opacity: 0 })

  // 重新播放
  const settings = intensityMap[intensity.value] || intensityMap[3]

  const tl = gsap.timeline()

  // 冲击波
  if (shockwaveRef.value) {
    gsap.fromTo(shockwaveRef.value,
      { scale: 0, opacity: 0.8 },
      { scale: 3, opacity: 0, duration: 0.6, ease: 'power2.out' }
    )
  }

  // 弹起
  tl.to('.eq-card', {
    scaleY: (i: number, el: Element) => {
      const h = parseFloat((el as HTMLElement).style.getPropertyValue('--h')) || 1
      return h
    },
    opacity: 1,
    duration: settings.duration,
    stagger: { each: 0.08, from: 'random' },
    ease: `back.out(${settings.back})`
  })
  .to('.eq-floor', { opacity: 1, duration: 0.4 }, '-=0.3')
}

onMounted(() => {
  setTimeout(() => {
    // 标题入场
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: headerRef.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })

    headerTl
      .fromTo('.header-tag',
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )
      .fromTo('.header-title',
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.2'
      )
      .fromTo('.header-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.3'
      )

    cleanupFns.push(() => headerTl.kill())

    // 主频谱动画
    const settings = intensityMap[intensity.value] || intensityMap[3]

    gsap.set('.eq-card', { scaleY: 0.1, transformOrigin: 'bottom center', opacity: 0 })

    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    })

    mainTl
      .add(playAnimation())

    cleanupFns.push(() => mainTl.kill())

    // 卡片持续跳动
    cardRefs.value.forEach((card, i) => {
      gsap.to(card, {
        scaleY: (i: number, el: Element) => {
          const baseH = parseFloat((el as HTMLElement).style.getPropertyValue('--h')) || 1
          return baseH * 1.05
        },
        duration: 0.3 + Math.random() * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.15
      })
    })

    // 底部入场
    gsap.fromTo(footerRef.value,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: footerRef.value,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    )
  }, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.equalizer-section {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0a0a12 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
}

.eq-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-floor {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  }

  .bg-reflection {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 200px;
    background: radial-gradient(ellipse at center bottom, rgba(138, 43, 226, 0.15), transparent 70%);
  }

  .bg-particles {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(2px 2px at 10% 20%, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(2px 2px at 30% 60%, rgba(255, 255, 255, 0.2), transparent),
      radial-gradient(1px 1px at 70% 30%, rgba(255, 255, 255, 0.3), transparent),
      radial-gradient(2px 2px at 90% 70%, rgba(255, 255, 255, 0.2), transparent);
    animation: particleTwinkle 3s ease-in-out infinite;
  }

  .bg-waves {
    position: absolute;
    bottom: 30%;
    left: 0;
    right: 0;
    height: 100px;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      rgba(138, 43, 226, 0.03) 20px,
      rgba(138, 43, 226, 0.03) 21px
    );
    animation: waveMove 8s linear infinite;
  }
}

@keyframes particleTwinkle {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes waveMove {
  from { transform: translateX(0); }
  to { transform: translateX(-21px); }
}

.eq-header {
  text-align: center;
  margin-bottom: 60px;
  z-index: 1;

  .header-tag {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(255, 20, 147, 0.15);
    border: 1px solid rgba(255, 20, 147, 0.3);
    border-radius: 20px;
    font-size: 12px;
    color: #FF1493;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .header-title {
    font-size: 56px;
    font-weight: bold;
    color: #fff;
    margin: 0 0 12px;
    letter-spacing: 4px;
    text-shadow:
      0 0 30px rgba(255, 20, 147, 0.6),
      0 0 60px rgba(138, 43, 226, 0.4);
  }

  .header-subtitle {
    font-size: 16px;
    color: rgba(148, 163, 184, 0.7);
    margin: 0;
    letter-spacing: 1px;
  }
}

.equalizer-container {
  position: relative;
  display: flex;
  gap: 20px;
  align-items: flex-end;
  padding: 40px 60px 60px;
  z-index: 1;
}

.eq-card {
  position: relative;
  width: 100px;
  height: 300px;
  border-radius: 12px 12px 20px 20px;
  background: linear-gradient(180deg, var(--color1), var(--color2));
  box-shadow:
    0 0 30px color-mix(in srgb, var(--color1) 50%, transparent),
    0 20px 40px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 24px;
  transform-origin: bottom center;
  cursor: pointer;
  will-change: transform;

  .card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    writing-mode: horizontal-tb;
    text-align: center;
    z-index: 2;

    .card-genre {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      letter-spacing: 2px;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }

    .card-bpm {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
      font-family: monospace;
    }
  }

  .card-glow {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(ellipse at 50% 30%, rgba(255, 255, 255, 0.3), transparent 60%);
    opacity: 0.5;
    pointer-events: none;
  }

  .card-top-cap {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 16px;
    background: linear-gradient(180deg, var(--color1), var(--color2));
    border-radius: 8px 8px 0 0;
    opacity: 0.8;

    &::after {
      content: '';
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 50%;
      height: 4px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 2px;
    }
  }

  .freq-indicator {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 3px;
    align-items: flex-end;
    height: 30px;

    .freq-bar {
      width: 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 2px;
      animation: freqPulse 0.5s ease-in-out infinite alternate;

      &:nth-child(1) { height: 40%; }
      &:nth-child(2) { height: 70%; }
      &:nth-child(3) { height: 100%; }
      &:nth-child(4) { height: 60%; }
      &:nth-child(5) { height: 30%; }
    }
  }

  &:hover {
    filter: brightness(1.15);
  }
}

@keyframes freqPulse {
  from { transform: scaleY(0.5); opacity: 0.5; }
  to { transform: scaleY(1); opacity: 1; }
}

.eq-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
    transparent,
    rgba(138, 43, 226, 0.5) 20%,
    rgba(255, 20, 147, 0.5) 50%,
    rgba(138, 43, 226, 0.5) 80%,
    transparent
  );
  border-radius: 2px;
  box-shadow:
    0 0 20px rgba(255, 20, 147, 0.5),
    0 0 40px rgba(138, 43, 226, 0.3);
}

.eq-footer {
  margin-top: 60px;
  text-align: center;
  z-index: 1;

  .footer-controls {
    display: inline-flex;
    align-items: center;
    gap: 30px;
    padding: 16px 32px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 40px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    margin-bottom: 16px;

    .control-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(255, 20, 147, 0.1);
      border: 1px solid rgba(255, 20, 147, 0.3);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: rgba(255, 20, 147, 0.2);
        transform: scale(1.05);
      }

      .btn-icon {
        font-size: 18px;
        color: #FF1493;
      }

      .btn-text {
        font-size: 13px;
        color: #FF1493;
      }
    }

    .control-slider {
      display: flex;
      align-items: center;
      gap: 12px;

      .slider-label {
        font-size: 13px;
        color: rgba(148, 163, 184, 0.8);
      }

      .slider {
        width: 100px;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        outline: none;

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #FF1493, #9400D3);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 20, 147, 0.5);
        }
      }
    }
  }

  .footer-hint {
    font-size: 13px;
    color: rgba(148, 163, 184, 0.5);
    margin: 0;
    letter-spacing: 2px;
  }
}

.shockwave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 3px solid rgba(255, 20, 147, 0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 0;
}
</style>
