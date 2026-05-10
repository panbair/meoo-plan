<template>
  <div ref="sectionRef" class="card-mirage">
    <!-- 热浪扭曲背景 -->
    <div class="mirage-bg">
      <div class="heat-distortion"></div>
      <div class="mirage-city">
        <div v-for="(building, i) in buildings" :key="i" class="building" :style="building.style">
          <div class="windows">
            <div v-for="w in building.windows" :key="w.id" class="window" :style="w.style"></div>
          </div>
        </div>
      </div>
      <div class="reflection-layer"></div>
    </div>

    <!-- 内容区域 -->
    <div class="mirage-content">
      <div ref="badgeRef" class="mirage-badge">海市蜃楼</div>
      <h2 ref="titleRef" class="mirage-title">MIRAGE</h2>
      <p ref="subtitleRef" class="mirage-subtitle">光与影的幻境 · 虚实交错的空间</p>

      <!-- 海市蜃楼卡片 -->
      <div ref="cardsWrapRef" class="mirage-cards">
        <div
          v-for="(card, i) in mirageCards"
          :key="i"
          :ref="el => cardRefs.set(i, el as HTMLElement)"
          class="mirage-card"
        >
          <div class="card-icon">{{ card.icon }}</div>
          <h3 class="card-title">{{ card.title }}</h3>
          <p class="card-desc">{{ card.desc }}</p>
          <div class="card-ripple"></div>
        </div>
      </div>

      <div ref="footerRef" class="mirage-footer">
        <span>探索虚幻之美</span>
      </div>
    </div>

    <!-- 闪烁效果 -->
    <div class="mirage-shimmer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

const sectionRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref(new Map<number, HTMLElement>())

// 建筑数据
const buildings = Array.from({ length: 10 }, (_, i) => {
  const height = 80 + Math.random() * 150
  const width = 40 + Math.random() * 60
  return {
    style: {
      left: `${i * 10}%`,
      height: `${height}px`,
      width: `${width}px`
    },
    windows: Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, wi) => ({
      id: wi,
      style: {
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 2}s`
      }
    }))
  }
})

// 卡片数据
const mirageCards = [
  { icon: '🏛️', title: '幻境宫殿', desc: '在沙漠深处浮现的辉煌建筑群' },
  { icon: '🌊', title: '水中城市', desc: '倒映在天空之境的未来都市' },
  { icon: '⛰️', title: '空中楼阁', desc: '云端之上的神秘悬浮城堡' },
  { icon: '🌫️', title: '雾中港湾', desc: '被薄雾笼罩的宁静港湾' },
  { icon: '✨', title: '星光绿洲', desc: '黑暗中闪耀的神秘水源' }
]

const initAnimations = () => {
  if (!sectionRef.value) return

  // 创建热浪扭曲效果
  const heatWave = sectionRef.value.querySelector('.heat-distortion')
  if (heatWave) {
    gsap.to(heatWave, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // 创建闪烁效果
  const shimmer = sectionRef.value.querySelector('.mirage-shimmer')
  if (shimmer) {
    gsap.to(shimmer, {
      opacity: 0.3,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // ========== 入场动画 ==========
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })

  tl.fromTo(badgeRef.value,
    { scale: 0, opacity: 0, rotation: -20 },
    { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  )
  .fromTo(titleRef.value,
    { y: 60, opacity: 0, filter: 'blur(10px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo(subtitleRef.value,
    { y: 40, opacity: 0, letterSpacing: '20px' },
    { y: 0, opacity: 1, letterSpacing: '6px', duration: 0.6, ease: 'power2.out' },
    '-=0.3'
  )

  // 卡片淡入上浮
  const cards = cardRefs.value
  cards.forEach((card, i) => {
    if (!card) return
    gsap.set(card, { opacity: 0, y: 60, scale: 0.9 })
    tl.to(card,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(1.4)'
      },
      `-=${0.4 - i * 0.05}`
    )
  })

  tl.fromTo(footerRef.value,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
    '-=0.2'
  )

  cleanupFns.push(() => tl.kill())

  // ========== 滚动动画 ==========
  // 标题滚动消失
  if (titleRef.value) {
    const st1 = ScrollTrigger.create({
      trigger: titleRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(titleRef.value, {
          y: -100 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2.5),
          filter: `blur(${self.progress * 8}px)`
        })
      }
    })
    cleanupFns.push(() => st1.kill())
  }

  // 副标题滚动效果
  if (subtitleRef.value) {
    const st2 = ScrollTrigger.create({
      trigger: subtitleRef.value,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(subtitleRef.value, {
          y: -50 * self.progress,
          opacity: Math.max(0, 1 - self.progress * 2),
          skewY: `${self.progress * 5}deg`
        })
      }
    })
    cleanupFns.push(() => st2.kill())
  }

  // 卡片滚动翻转
  cards.forEach((card, i) => {
    if (!card) return

    const st = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1.5,
      onUpdate: (self) => {
        gsap.set(card, {
          y: -50 * self.progress,
          rotateY: self.progress * 15,
          scale: 1 + self.progress * 0.1,
          filter: `saturate(${1 - self.progress * 0.5})`
        })
      }
    })
    cleanupFns.push(() => st.kill())
  })

  // 热浪扭曲滚动效果
  if (heatWave) {
    const stHeat = ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        gsap.set(heatWave, {
          scaleY: 1 + self.progress * 0.3,
          y: -20 * self.progress
        })
      }
    })
    cleanupFns.push(() => stHeat.kill())
  }
}

onMounted(() => {
  // 延迟初始化以确保懒加载时 DOM 已完全渲染
  setTimeout(initAnimations, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
})
</script>

<style scoped lang="scss">
.card-mirage {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #1a0a2e 0%, #16213e 30%, #0f3460 60%, #e94560 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mirage-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.heat-distortion {
  position: absolute;
  bottom: 30%;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(0deg,
    transparent 0%,
    rgba(233, 69, 96, 0.1) 30%,
    rgba(15, 52, 96, 0.2) 60%,
    transparent 100%
  );
  filter: blur(3px);
  transform-origin: center bottom;
}

.mirage-city {
  position: absolute;
  bottom: 25%;
  left: 0;
  right: 0;
  height: 300px;
  opacity: 0.3;
}

.building {
  position: absolute;
  bottom: 0;
  background: linear-gradient(180deg, #1a0a2e 0%, #0a1628 100%);
  border-radius: 2px 2px 0 0;

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    border-left: calc(width / 2) solid transparent;
    border-right: calc(width / 2) solid transparent;
    border-bottom: 20px solid inherit;
  }
}

.windows {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  gap: 3px;
  height: 100%;
  align-content: flex-start;
}

.window {
  width: 6px;
  height: 8px;
  background: rgba(233, 69, 96, 0.6);
  box-shadow: 0 0 8px rgba(233, 69, 96, 0.5);
  animation: windowFlicker 2s ease-in-out infinite;
}

@keyframes windowFlicker {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.reflection-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(180deg,
    rgba(15, 52, 96, 0.3) 0%,
    transparent 100%
  );
  transform: scaleY(-1);
  filter: blur(5px);
  opacity: 0.5;
}

.mirage-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 60px;
}

.mirage-badge {
  display: inline-block;
  padding: 8px 24px;
  background: rgba(233, 69, 96, 0.2);
  border: 1px solid rgba(233, 69, 96, 0.4);
  border-radius: 30px;
  color: #e94560;
  font-size: 14px;
  letter-spacing: 3px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.mirage-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 80px;
  font-weight: 900;
  letter-spacing: 15px;
  background: linear-gradient(180deg, #fff 0%, #e94560 50%, #0f3460 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  text-shadow: 0 0 60px rgba(233, 69, 96, 0.5);
  filter: drop-shadow(0 0 30px rgba(233, 69, 96, 0.3));
}

.mirage-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 6px;
  margin-bottom: 60px;
}

.mirage-cards {
  display: flex;
  gap: 25px;
  justify-content: center;
  flex-wrap: wrap;
  perspective: 1000px;
}

.mirage-card {
  position: relative;
  width: 200px;
  padding: 30px 20px;
  background: rgba(26, 10, 46, 0.7);
  border: 1px solid rgba(233, 69, 96, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  transform-style: preserve-3d;
  cursor: pointer;
  transition: border-color 0.3s;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    background: linear-gradient(135deg,
      rgba(233, 69, 96, 0.1) 0%,
      transparent 50%,
      rgba(15, 52, 96, 0.1) 100%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: rgba(233, 69, 96, 0.6);

    &::before {
      opacity: 1;
    }

    .card-icon {
      transform: scale(1.2);
    }
  }
}

.card-icon {
  font-size: 48px;
  margin-bottom: 15px;
  transition: transform 0.3s;
  filter: drop-shadow(0 0 15px rgba(233, 69, 96, 0.5));
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
}

.card-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

.card-ripple {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(233, 69, 96, 0.5), transparent);
  border-radius: 1px;
}

.mirage-footer {
  margin-top: 60px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  letter-spacing: 3px;
}

.mirage-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 70%
  );
  pointer-events: none;
  opacity: 0;
}

@media (max-width: 768px) {
  .mirage-title {
    font-size: 48px;
    letter-spacing: 8px;
  }

  .mirage-subtitle {
    font-size: 14px;
    letter-spacing: 4px;
  }

  .mirage-cards {
    gap: 15px;
  }

  .mirage-card {
    width: 160px;
    padding: 20px 15px;
  }

  .card-icon {
    font-size: 36px;
  }
}
</style>
