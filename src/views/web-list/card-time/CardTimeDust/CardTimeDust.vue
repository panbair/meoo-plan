<template>
  <section class="dust-section" ref="sectionRef">
    <!-- 背景效果 -->
    <div class="dust-bg">
      <div class="bg-stars" ref="starsRef"></div>
      <div class="bg-mesh"></div>
      <div class="bg-aura"></div>
    </div>

    <!-- 标题 -->
    <div class="dust-header" ref="headerRef">
      <h1 class="header-title">
        <span class="title-particle" v-for="n in 5" :key="n">✧</span>
        记忆尘埃 · 粒子聚合
        <span class="title-particle" v-for="n in 5" :key="'b' + n">✧</span>
      </h1>
      <p class="header-subtitle">从混沌到秩序 · 数字生命的诞生</p>
    </div>

    <!-- 粒子卡片画廊 -->
    <div class="dust-gallery" ref="galleryRef">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="dust-card"
        :ref="el => { if(el) cardRefs[index] = el as HTMLElement }"
        :style="{ '--i': index, '--hue': card.hue, '--sat': card.sat, '--light': card.light }"
      >
        <!-- 4x4 粒子碎片网格 -->
        <div class="particle-grid">
          <div
            v-for="n in 16"
            :key="n"
            class="dust-particle"
            :data-index="n - 1"
            :data-row="Math.floor((n - 1) / 4)"
            :data-col="(n - 1) % 4"
          ></div>
        </div>

        <!-- 聚合光晕 -->
        <div class="gather-glow"></div>

        <!-- 卡片内容 -->
        <div class="card-content">
          <div class="content-icon">{{ card.icon }}</div>
          <div class="content-title">{{ card.title }}</div>
          <div class="content-en">{{ card.english }}</div>
          <div class="content-desc">{{ card.desc }}</div>
          <div class="content-energy">
            <span class="energy-bar" v-for="n in 5" :key="n" :style="{ '--n': n }"></span>
          </div>
        </div>

        <!-- 边框装饰 -->
        <div class="card-frame"></div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="dust-footer" ref="footerRef">
      <div class="footer-orb">
        <div class="orb-inner"></div>
        <div class="orb-ring orb-ring-1"></div>
        <div class="orb-ring orb-ring-2"></div>
      </div>
      <p>滚动见证聚合奇迹</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Card {
  icon: string
  title: string
  english: string
  desc: string
  hue: number
  sat: number
  light: number
}

// 卡片数据
const cards: Card[] = [
  { icon: '◈', title: '量子', english: 'Quantum', desc: '微观世界的奥秘', hue: 280, sat: 100, light: 65 },
  { icon: '❖', title: '觉醒', english: 'Awaken', desc: '意识的曙光', hue: 320, sat: 100, light: 60 },
  { icon: '✧', title: '涅槃', english: 'Phoenix', desc: '重生的力量', hue: 200, sat: 100, light: 55 },
  { icon: '◇', title: '无限', english: 'Infinity', desc: '永恒的循环', hue: 45, sat: 100, light: 60 },
]

// Refs
const sectionRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const galleryRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const starsRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

// 清理函数
const cleanupFns: (() => void)[] = []

// 随机数工具
function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// 初始化粒子
function initParticles() {
  cardRefs.value.forEach((card) => {
    const particles = card.querySelectorAll('.dust-particle')
    const cardWidth = 200
    const cardHeight = 280
    const fragWidth = cardWidth / 4
    const fragHeight = cardHeight / 4

    particles.forEach((particle, i) => {
      const row = Math.floor(i / 4)
      const col = i % 4
      const targetX = col * fragWidth
      const targetY = row * fragHeight

      // 随机初始位置（更大范围散布）
      const startX = random(-400, 400)
      const startY = random(-350, 350)
      const startRotation = random(-180, 180)
      const startScale = random(0.2, 0.7)
      const startOpacity = random(0.2, 0.5)

      // 存储目标位置
      ;(particle as HTMLElement).dataset.targetX = String(targetX)
      ;(particle as HTMLElement).dataset.targetY = String(targetY)

      gsap.set(particle, {
        x: startX,
        y: startY,
        rotation: startRotation,
        scale: startScale,
        opacity: startOpacity,
      })
    })

    // 设置内容初始状态
    const content = card.querySelector('.card-content')
    const gatherGlow = card.querySelector('.gather-glow')
    if (content) {
      gsap.set(content, { opacity: 0, scale: 0.3, filter: 'blur(10px)' })
    }
    if (gatherGlow) {
      gsap.set(gatherGlow, { opacity: 0, scale: 0.5 })
    }
  })
}

// 创建背景星星
function createStars() {
  if (!starsRef.value) return
  for (let i = 0; i < 50; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = `${random(0, 100)}%`
    star.style.top = `${random(0, 100)}%`
    star.style.width = `${random(1, 3)}px`
    star.style.height = star.style.width
    star.style.animationDelay = `${random(0, 3)}s`
    star.style.animationDuration = `${random(2, 5)}s`
    starsRef.value.appendChild(star)
  }
}

onMounted(() => {
  if (!sectionRef.value) return

  setTimeout(() => {
    // 创建星星背景
    createStars()

    // 初始化粒子位置
    initParticles()

    // 入场动画 - 标题
    gsap.fromTo(
      headerRef.value,
      { opacity: 0, y: -60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.value,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )

    // 每张卡片的粒子聚合动画
    cardRefs.value.forEach((card, cardIndex) => {
      const particles = card.querySelectorAll('.dust-particle')
      const content = card.querySelector('.card-content')
      const gatherGlow = card.querySelector('.gather-glow')

      // 获取卡片对应的 CSS 变量值
      const cardStyle = getComputedStyle(card)
      const hue = cardStyle.getPropertyValue('--hue').trim() || '200'
      const sat = cardStyle.getPropertyValue('--sat').trim() || '100'
      const light = cardStyle.getPropertyValue('--light').trim() || '60'

      // 将具体的 HSL 值写入粒子元素，替换 CSS 变量
      particles.forEach((particle) => {
        const p = particle as HTMLElement
        p.style.setProperty('--particle-hue', hue)
        p.style.setProperty('--particle-sat', sat)
        p.style.setProperty('--particle-light', light)
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1.5,
        },
      })

      // 阶段1：光晕出现
      tl.to(gatherGlow, {
        opacity: 0.8,
        scale: 1.5,
        duration: 0.3,
        ease: 'power2.in',
      })

      // 阶段2：粒子飞向目标位置
      tl.to(
        particles,
        {
          x: (i, el) => Number((el as HTMLElement).dataset.targetX),
          y: (i, el) => Number((el as HTMLElement).dataset.targetY),
          rotation: 0,
          scale: 1,
          opacity: 0.85,
          duration: 0.5,
          stagger: {
            amount: 0.4,
            from: 'random',
          },
          ease: 'power3.out',
        },
        0
      )

      // 阶段3：粒子变为卡片颜色
      // 使用具体的 HSL 值，而不是 CSS 变量
      tl.to(
        particles,
        {
          backgroundColor: `hsl(${hue}, ${sat}%, ${light}%)`,
          boxShadow: `0 0 15px hsl(${hue}, 100%, 60%)`,
          duration: 0.3,
          stagger: { amount: 0.2, from: 'random' },
        },
        '-=0.3'
      )

      // 阶段4：光晕消散
      tl.to(
        gatherGlow,
        {
          opacity: 0,
          scale: 2,
          duration: 0.3,
        },
        '-=0.2'
      )

      // 阶段5：内容渐显
      tl.to(
        content,
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.4,
          ease: 'back.out(1.7)',
        },
        '-=0.2'
      )

      cleanupFns.push(() => tl.kill())
    })

    // 卡片浮动动画
    cardRefs.value.forEach((card, i) => {
      gsap.to(card, {
        y: -12,
        duration: 2.5 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: galleryRef.value,
          start: 'top 30%',
          end: 'bottom 70%',
          toggleActions: 'play none none none',
        },
      })
    })

    // 底部提示入场
    gsap.fromTo(
      footerRef.value,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.value,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      }
    )

    // 底部orb旋转动画
    gsap.to(footerRef.value?.querySelector('.orb-ring-1'), {
      rotation: 360,
      duration: 8,
      repeat: -1,
      ease: 'none',
    })
    gsap.to(footerRef.value?.querySelector('.orb-ring-2'), {
      rotation: -360,
      duration: 12,
      repeat: -1,
      ease: 'none',
    })
  }, 100)
})

onUnmounted(() => {
  // 执行所有清理
  cleanupFns.forEach(fn => fn())

  // 清理所有 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => st.kill())

  // 清理星星
  if (starsRef.value) {
    starsRef.value.innerHTML = ''
  }
})
</script>

<style scoped lang="scss">
.dust-section {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #03050a 0%, #0a0a18 50%, #03050a 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.dust-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-stars {
    position: absolute;
    inset: 0;
  }

  .bg-mesh {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(100, 80, 200, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100, 80, 200, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .bg-aura {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1000px;
    height: 1000px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(100, 50, 200, 0.08) 0%,
      rgba(200, 100, 150, 0.04) 50%,
      transparent 70%
    );
    animation: auraPulse 6s ease-in-out infinite;
  }
}

@keyframes auraPulse {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
}

.dust-header {
  text-align: center;
  margin-bottom: 50px;
  z-index: 1;

  .header-title {
    font-size: 38px;
    font-weight: bold;
    color: #fff;
    margin: 0 0 16px;
    text-shadow:
      0 0 30px rgba(200, 150, 255, 0.6),
      0 0 60px rgba(150, 100, 200, 0.4);
    letter-spacing: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    .title-particle {
      font-size: 18px;
      color: rgba(200, 150, 255, 0.8);
      animation: particleTwinkle 2s ease-in-out infinite;
      
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
      &:nth-child(4) { animation-delay: 0.6s; }
      &:nth-child(5) { animation-delay: 0.8s; }
    }
  }

  .header-subtitle {
    font-size: 16px;
    color: rgba(200, 200, 220, 0.6);
    margin: 0;
    letter-spacing: 4px;
  }
}

@keyframes particleTwinkle {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.dust-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 50px;
  justify-content: center;
  z-index: 1;
  max-width: 1100px;
}

.dust-card {
  position: relative;
  width: 200px;
  height: 280px;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;

  .particle-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .dust-particle {
    position: absolute;
    width: 50px;
    height: 70px;
    background: linear-gradient(135deg, #00f2fe 0%, #ff00c1 100%);
    border-radius: 4px;
    will-change: transform, opacity;
    transition: box-shadow 0.3s;

    &[data-row="0"] { top: 0; }
    &[data-row="1"] { top: 70px; }
    &[data-row="2"] { top: 140px; }
    &[data-row="3"] { top: 210px; }

    &[data-col="0"] { left: 0; }
    &[data-col="1"] { left: 50px; }
    &[data-col="2"] { left: 100px; }
    &[data-col="3"] { left: 150px; }
  }

  .gather-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 350px;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(200, 150, 255, 0.5) 0%,
      rgba(100, 200, 255, 0.3) 40%,
      transparent 70%
    );
    filter: blur(30px);
    pointer-events: none;
    z-index: 5;
  }

  .card-content {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 10;
    text-align: center;
    background: linear-gradient(
      180deg,
      rgba(10, 10, 20, 0.2) 0%,
      rgba(20, 15, 35, 0.5) 100%
    );
    border-radius: 16px;
    backdrop-filter: blur(5px);

    .content-icon {
      font-size: 52px;
      margin-bottom: 14px;
      filter: drop-shadow(0 0 20px hsl(var(--hue), var(--sat), var(--light)));
      transition: transform 0.3s;
    }

    .content-title {
      font-size: 28px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 6px;
      text-shadow: 0 0 25px hsl(var(--hue), var(--sat), var(--light));
      letter-spacing: 4px;
    }

    .content-en {
      font-size: 12px;
      color: hsl(var(--hue), var(--sat), 70%);
      margin-bottom: 14px;
      letter-spacing: 3px;
      opacity: 0.8;
    }

    .content-desc {
      font-size: 14px;
      color: rgba(220, 220, 240, 0.75);
      margin-bottom: 18px;
    }

    .content-energy {
      display: flex;
      gap: 6px;

      .energy-bar {
        width: 20px;
        height: 4px;
        background: linear-gradient(
          90deg,
          hsl(var(--hue), var(--sat), var(--light)),
          hsl(calc(var(--hue) + 30), var(--sat), var(--light))
        );
        border-radius: 2px;
        opacity: 0.6;
        animation: energyPulse 1.5s ease-in-out infinite;
        animation-delay: calc(var(--n) * 0.15s);
      }
    }
  }

  .card-frame {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    border: 1px solid rgba(200, 150, 255, 0.15);
    pointer-events: none;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  &:hover {
    .content-icon {
      transform: scale(1.15) rotate(5deg);
    }

    .card-frame {
      border-color: hsl(var(--hue), var(--sat), var(--light));
      box-shadow:
        0 0 30px hsla(var(--hue), var(--sat), var(--light), 0.4),
        inset 0 0 30px rgba(255, 255, 255, 0.03);
    }
  }
}

@keyframes energyPulse {
  0%, 100% { opacity: 0.5; transform: scaleX(0.8); }
  50% { opacity: 1; transform: scaleX(1); }
}

.dust-footer {
  position: absolute;
  bottom: 40px;
  text-align: center;
  z-index: 1;

  .footer-orb {
    position: relative;
    width: 50px;
    height: 50px;
    margin: 0 auto 12px;

    .orb-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, #fff 0%, hsl(280, 100%, 70%) 100%);
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(200, 150, 255, 0.8);
    }

    .orb-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 2px solid rgba(200, 150, 255, 0.3);
      border-radius: 50%;
      transform-origin: center;
    }

    .orb-ring-1 {
      animation: ringPulse 3s ease-in-out infinite;
    }

    .orb-ring-2 {
      animation: ringPulse 4s ease-in-out infinite reverse;
      opacity: 0.5;
    }
  }

  p {
    font-size: 14px;
    color: rgba(200, 200, 220, 0.5);
    margin: 0;
    letter-spacing: 3px;
  }
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.6; }
}

// 背景星星样式
:deep(.star) {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: starTwinkle 3s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(200, 150, 255, 0.5);

  @keyframes starTwinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }
}
</style>
