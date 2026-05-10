<template>
  <div class="im-infinity-motion-section-63">
    <div class="im-section-header-63">
      <h2 class="im-title-63">INFINITY MOTION</h2>
      <p class="im-subtitle-63">无限路径动画</p>
    </div>

    <div class="im-motion-wrapper-63">
      <svg class="im-infinity-svg-63" viewBox="0 0 1400 600">
        <!-- 无限符号路径 -->
        <path
          id="infinityPath"
          class="im-infinity-path-63"
          d="M 350 300 C 350 200, 550 200, 650 300 C 750 400, 550 500, 450 400 C 350 300, 550 200, 700 300 C 850 400, 1050 200, 1050 300 C 1050 400, 850 500, 750 400 C 650 300, 850 200, 700 300"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          stroke-width="3"
          stroke-dasharray="8,8"
        />

        <!-- 运动卡片 -->
        <foreignObject
          v-for="(card, index) in cards"
          :key="index"
          class="im-motion-card-63"
          :class="`im-card-${index}`"
          x="0"
          y="0"
          width="160"
          height="120"
        >
          <div class="im-card-wrapper-63">
            <div class="im-card-bg-63" :style="{ backgroundColor: card.color }"></div>
            <div class="im-card-content-63">
              <div class="im-card-badge-63">{{ String(index + 1).padStart(2, '0') }}</div>
              <h3>{{ card.title }}</h3>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>

    <div class="im-motion-status-63">
      <div class="im-status-item-63">
        <span class="im-label-63">速度</span>
        <span class="im-value-63">{{ currentSpeed }}x</span>
      </div>
      <div class="im-status-item-63">
        <span class="im-label-63">方向</span>
        <span class="im-value-63">{{ direction }}</span>
      </div>
    </div>

    <div class="im-motion-controls-63">
      <button class="im-control-btn-63 primary-63" @click="togglePlay">
        {{ isPlaying ? '暂停' : '播放' }}
      </button>
      <button class="im-control-btn-63" @click="changeDirection">切换方向</button>
      <button class="im-control-btn-63" @click="changeSpeed">改变速度</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger)

const cards = ref([
  { color: '#e74c3c', title: 'Loop' },
  { color: '#3498db', title: 'Cycle' },
  { color: '#2ecc71', title: 'Round' },
  { color: '#f39c12', title: 'Orbit' },
  { color: '#9b59b6', title: 'Turn' },
  { color: '#1abc9c', title: 'Spin' }
])

const isPlaying = ref(true)
const currentSpeed = ref(1)
const direction = ref('顺时针')
const speeds = [0.5, 1, 1.5, 2]
let speedIndex = 1

let ctx: gsap.Context
let infinityTimeline: gsap.core.Timeline | null = null

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    infinityTimeline?.play()
  } else {
    infinityTimeline?.pause()
  }
}

const changeDirection = () => {
  direction.value = direction.value === '顺时针' ? '逆时针' : '顺时针'
  infinityTimeline?.reverse()
}

const changeSpeed = () => {
  speedIndex = (speedIndex + 1) % speeds.length
  currentSpeed.value = speeds[speedIndex]
  infinityTimeline?.timeScale(currentSpeed.value)
}

const initAnimations = () => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.im-infinity-motion-section-63 .im-title-63', {
      scrollTrigger: {
        trigger: '.im-infinity-motion-section-63',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: 60,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8
    })

    // 副标题动画
    gsap.from('.im-infinity-motion-section-63 .im-subtitle-63', {
      scrollTrigger: {
        trigger: '.im-infinity-motion-section-63',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      },
      y: 40,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.8,
      delay: 0.2
    })

    // 创建无限路径运动时间轴 - 使用 MotionPath 插件
    infinityTimeline = gsap.timeline({ paused: false })

    cards.value.forEach((_, index) => {
      const cardList = gsap.utils.toArray(`.im-card-${index}`)
      if (!cardList.length) return
      const card = cardList[0] as HTMLElement

      // 计算每个卡片的起始位置
      const startProgress = index / cards.value.length

      // 使用 MotionPath 沿无限符号路径运动
      const tween = gsap.to(card, {
        motionPath: {
          path: '#infinityPath', // 使用选择器引用路径
          align: '#infinityPath',
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: startProgress,
          end: startProgress + 2
        },
        duration: 8 + index * 1.5,
        ease: 'none',
        repeat: -1
      })

      infinityTimeline?.add(tween, 0)
    })

    // 卡片入场
    gsap.from('.im-card-wrapper-63', {
      scrollTrigger: {
        trigger: '.im-motion-wrapper-63',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      opacity: 0,
      rotation: -180,
      stagger: 0.12,
      ease: 'back.out(1.7)',
      duration: 0.8
    })

    // 背景渐入
    gsap.from('.im-card-bg-63', {
      scrollTrigger: {
        trigger: '.im-motion-wrapper-63',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      scale: 2,
      opacity: 0,
      stagger: 0.12,
      ease: 'power2.out',
      duration: 0.6
    })

    // 徽章动画
    gsap.from('.im-card-badge-63', {
      scrollTrigger: {
        trigger: '.im-motion-wrapper-63',
        start: 'top 65%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      rotation: -360,
      stagger: 0.12,
      ease: 'back.out(1.7)',
      duration: 0.5
    })

    // 状态显示动画
    gsap.from('.im-motion-status-63', {
      scrollTrigger: {
        trigger: '.im-motion-status-63',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      duration: 0.6
    })

    // 按钮动画
    gsap.from('.im-control-btn-63', {
      scrollTrigger: {
        trigger: '.im-motion-controls-63',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      stagger: 0.1,
      ease: 'power3.out',
      duration: 0.6
    })

    // 悬停效果 - 使用gsap.utils.toArray自动清理
    gsap.utils.toArray('.im-card-wrapper-63').forEach((card: Element) => {
      const cardEl = card as HTMLElement
      cardEl.addEventListener('mouseenter', () => {
        gsap.to(cardEl.querySelector('.im-card-bg-63'), {
          scale: 1.1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.im-card-badge-63'), {
          scale: 1.3,
          rotation: 45,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })

      cardEl.addEventListener('mouseleave', () => {
        gsap.to(cardEl.querySelector('.im-card-bg-63'), {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(cardEl.querySelector('.im-card-badge-63'), {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  })
}

onMounted(() => {
  initAnimations()
})

onUnmounted(() => {
  ctx?.revert()
  infinityTimeline?.kill()
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
.im-infinity-motion-section-63 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

.im-section-header-63 {
  text-align: center;
  margin-bottom: 60px;
}

.im-title-63 {
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(15, 52, 96, 0.5);
}

.im-subtitle-63 {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 16px;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.im-motion-wrapper-63 {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.im-infinity-svg-63 {
  width: 1400px;
  height: 600px;
}

.im-infinity-path-63 {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
}

.im-card-wrapper-63 {
  width: 160px;
  height: 120px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  transition: box-shadow 0.4s ease;
}

.im-card-wrapper-63:hover {
  box-shadow: 0 20px 60px rgba(15, 52, 96, 0.5);
}

.im-card-bg-63 {
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}

.im-card-content-63 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  pointer-events: none;
}

.im-card-badge-63 {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
}

.im-card-content-63 h3 {
  position: absolute;
  bottom: 12px;
  left: 12px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.im-motion-status-63 {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin: 40px 0;
}

.im-status-item-63 {
  text-align: center;
}

.im-status-item-63 .im-label-63 {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.im-status-item-63 .im-value-63 {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.im-motion-controls-63 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.im-control-btn-63 {
  padding: 16px 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.im-control-btn-63:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.im-control-btn.primary-63 {
  background: linear-gradient(135deg, #0f3460 0%, #e94560 100%);
  border-color: transparent;
  box-shadow: 0 10px 30px rgba(15, 52, 96, 0.3);
}

.im-control-btn.primary-63:hover {
  box-shadow: 0 15px 40px rgba(15, 52, 96, 0.4);
}

@media (max-width: 768px) {
  .im-title-63 {
    font-size: 32px;
    letter-spacing: 3px;
  }

  .im-subtitle-63 {
    font-size: 14px;
  }

  .im-infinity-svg-63 {
    width: 100%;
    height: 400px;
  }

  .im-card-wrapper-63 {
    width: 120px;
    height: 90px;
  }
}
</style>
