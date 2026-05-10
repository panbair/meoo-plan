<template>
  <section class="shatter-section">
    <!-- 背景效果 -->
    <div class="shatter-bg">
      <div class="bg-particles" ref="particlesRef"></div>
      <div class="bg-grid"></div>
      <div class="bg-glow"></div>
    </div>

    <!-- 标题 -->
    <div class="shatter-header" ref="headerRef">
      <h1 class="header-title">信息从混沌中诞生</h1>
      <p class="header-subtitle">滚动探索 · 记忆重组</p>
    </div>

    <!-- 碎片卡片画廊 -->
    <div class="shatter-gallery" ref="galleryRef">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="shatter-card"
        :ref="el => { if(el) cardRefs[index] = el as HTMLElement }"
        :style="{ '--i': index, '--hue': card.hue, '--hue2': card.hue2 }"
      >
        <!-- 四个碎片 -->
        <div class="fragment" data-piece="1"></div>
        <div class="fragment" data-piece="2"></div>
        <div class="fragment" data-piece="3"></div>
        <div class="fragment" data-piece="4"></div>

        <!-- 碎片光晕 -->
        <div class="fragment-glow"></div>

        <!-- 卡片内容 -->
        <div class="card-content">
          <div class="content-icon">{{ card.icon }}</div>
          <div class="content-title">{{ card.title }}</div>
          <div class="content-desc">{{ card.desc }}</div>
          <div class="content-meta">{{ card.meta }}</div>
        </div>

        <!-- 边框装饰 -->
        <div class="card-border"></div>
      </div>
    </div>

    <!-- 底部提示 -->
    <div class="shatter-footer" ref="footerRef">
      <div class="footer-icon">⟳</div>
      <p>滚动继续探索</p>
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
  desc: string
  meta: string
  hue: number
  hue2: number
}

const cards: Card[] = [
  { icon: '🔮', title: '起源', desc: '宇宙大爆炸', meta: '138亿年前', hue: 340, hue2: 20 },
  { icon: '🌌', title: '进化', desc: '星系形成', meta: '100亿年前', hue: 200, hue2: 260 },
  { icon: '🌍', title: '超越', desc: '生命诞生', meta: '38亿年前', hue: 120, hue2: 60 },
  { icon: '🚀', title: '永恒', desc: '文明探索', meta: '21世纪', hue: 30, hue2: 280 },
  { icon: '✨', title: '新生', desc: '意识觉醒', meta: '未来纪元', hue: 280, hue2: 340 },
]

// Refs
const headerRef = ref<HTMLElement | null>(null)
const galleryRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const particlesRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])

// 清理函数
const cleanupFns: (() => void)[] = []

// 随机偏移数据
const randomOffsets: { x: number; y: number; rotation: number; scale: number }[][] = []

// 生成随机数工具
function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

onMounted(() => {
  if (!galleryRef.value) return

  setTimeout(() => {
    // 初始化每张卡片的碎片随机偏移
    cardRefs.value.forEach((card) => {
      const fragments = card.querySelectorAll('.fragment')
      const cardOffsets: { x: number; y: number; rotation: number; scale: number }[] = []

      fragments.forEach((frag) => {
        const offset = {
          x: random(-150, 150),
          y: random(-180, 180),
          rotation: random(-200, 200),
          scale: random(0.2, 0.6)
        }
        cardOffsets.push(offset)

        gsap.set(frag, {
          x: offset.x,
          y: offset.y,
          rotation: offset.rotation,
          scale: offset.scale,
          opacity: 0.3
        })
      })

      // 设置内容初始状态
      const content = card.querySelector('.card-content')
      gsap.set(content, { opacity: 0, scale: 0.5 })

      randomOffsets.push(cardOffsets)
    })

    // 创建粒子
    if (particlesRef.value) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = `${random(0, 100)}%`
        particle.style.top = `${random(0, 100)}%`
        particle.style.animationDelay = `${random(0, 3)}s`
        particle.style.animationDuration = `${random(2, 4)}s`
        particlesRef.value.appendChild(particle)
      }
    }

    // 入场动画 - 标题
    gsap.fromTo(headerRef.value,
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.value,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )

    // 每张卡片的碎片重组动画
    cardRefs.value.forEach((card, cardIndex) => {
      const fragments = card.querySelectorAll('.fragment')
      const content = card.querySelector('.card-content')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      })

      // 碎片飞入归位
      tl.to(fragments, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        stagger: {
          each: 0.06,
          from: 'random'
        },
        ease: 'power3.out'
      })
      // 碎片光晕消退
      .to(card.querySelector('.fragment-glow'), {
        opacity: 0,
        scale: 0.5,
        duration: 0.4
      }, 0)
      // 内容渐显
      .to(content, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }, '-=0.3')

      cleanupFns.push(() => tl.kill())
    })

    // 卡片呼吸效果
    cardRefs.value.forEach((card, i) => {
      gsap.to(card, {
        y: -10,
        duration: 2.5 + i * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
        scrollTrigger: {
          trigger: galleryRef.value,
          start: 'top 20%',
          end: 'bottom 80%',
          toggleActions: 'play none none none'
        }
      })
    })

    // 底部提示入场
    gsap.fromTo(footerRef.value,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
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
  // 执行所有清理
  cleanupFns.forEach(fn => fn())

  // 清理所有 ScrollTrigger
  ScrollTrigger.getAll().forEach(st => st.kill())

  // 清理粒子
  if (particlesRef.value) {
    particlesRef.value.innerHTML = ''
  }
})
</script>

<style scoped lang="scss">
.shatter-section {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #0a0a12 0%, #0f0f1a 50%, #0a0a12 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.shatter-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-particles {
    position: absolute;
    inset: 0;
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(100, 100, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(100, 100, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  .bg-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 800px;
    height: 800px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(100, 50, 150, 0.1) 0%, transparent 70%);
    animation: glowPulse 4s ease-in-out infinite;
  }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

.shatter-header {
  text-align: center;
  margin-bottom: 50px;
  z-index: 1;

  .header-title {
    font-size: 42px;
    font-weight: bold;
    color: #fff;
    margin: 0 0 16px;
    text-shadow:
      0 0 30px rgba(255, 100, 150, 0.5),
      0 0 60px rgba(100, 150, 255, 0.3);
    letter-spacing: 4px;
  }

  .header-subtitle {
    font-size: 16px;
    color: rgba(200, 200, 220, 0.6);
    margin: 0;
    letter-spacing: 3px;
  }
}

.shatter-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: center;
  z-index: 1;
  max-width: 1200px;
}

.shatter-card {
  position: relative;
  width: 200px;
  height: 280px;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 800px;

  .fragment {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    will-change: transform, opacity;
    transition: filter 0.3s;

    &[data-piece="1"] {
      clip-path: polygon(0 0, 50% 0, 0 50%);
      background: linear-gradient(135deg, hsl(var(--hue), 100%, 60%), hsl(var(--hue2), 100%, 50%));
      filter: brightness(1.1);
    }

    &[data-piece="2"] {
      clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 50%);
      background: linear-gradient(225deg, hsl(var(--hue), 100%, 55%), hsl(var(--hue2), 100%, 45%));
      filter: brightness(0.95);
    }

    &[data-piece="3"] {
      clip-path: polygon(0 50%, 50% 50%, 0 100%);
      background: linear-gradient(45deg, hsl(var(--hue2), 100%, 50%), hsl(var(--hue), 100%, 60%));
      filter: brightness(0.9);
    }

    &[data-piece="4"] {
      clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
      background: linear-gradient(315deg, hsl(var(--hue), 100%, 50%), hsl(var(--hue2), 100%, 55%));
      filter: brightness(1.05);
    }
  }

  .fragment-glow {
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle, hsl(var(--hue), 100%, 60%) 0%, transparent 70%);
    opacity: 0.5;
    filter: blur(20px);
    pointer-events: none;
    transition: opacity 0.3s;
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
      rgba(10, 10, 20, 0.3) 0%,
      rgba(10, 10, 20, 0.6) 100%
    );
    border-radius: 16px;

    .content-icon {
      font-size: 48px;
      margin-bottom: 12px;
      filter: drop-shadow(0 0 15px hsl(var(--hue), 100%, 60%));
      transition: transform 0.3s;
    }

    .content-title {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 8px;
      text-shadow: 0 0 20px hsl(var(--hue), 100%, 60%);
      letter-spacing: 3px;
    }

    .content-desc {
      font-size: 14px;
      color: rgba(220, 220, 240, 0.8);
      margin-bottom: 16px;
    }

    .content-meta {
      font-size: 12px;
      color: hsl(var(--hue), 100%, 60%);
      letter-spacing: 2px;
      font-family: monospace;
    }
  }

  .card-border {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  &:hover {
    .fragment {
      filter: brightness(1.2) saturate(1.2);
    }

    .content-icon {
      transform: scale(1.15) rotate(5deg);
    }

    .card-border {
      border-color: hsl(var(--hue), 100%, 60%);
      box-shadow:
        0 0 20px hsl(var(--hue), 100%, 50%),
        inset 0 0 20px rgba(255, 255, 255, 0.05);
    }
  }
}

// 粒子样式
:deep(.particle) {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 150, 200, 0.6);
  border-radius: 50%;
  animation: particleFloat 3s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: inherit;
    border-radius: 50%;
    animation: particleGlow 2s ease-in-out infinite;
  }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

@keyframes particleGlow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.5); }
}

.shatter-footer {
  position: absolute;
  bottom: 40px;
  text-align: center;
  z-index: 1;

  .footer-icon {
    font-size: 24px;
    color: rgba(200, 150, 200, 0.6);
    animation: footerSpin 3s linear infinite;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: rgba(200, 200, 220, 0.5);
    margin: 0;
    letter-spacing: 2px;
  }
}

@keyframes footerSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
