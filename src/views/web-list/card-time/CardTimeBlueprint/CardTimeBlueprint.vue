<template>
  <section class="blueprint-section">
    <!-- 背景效果 -->
    <div class="bp-bg">
      <div class="bg-grid"></div>
      <div class="bg-glow"></div>
    </div>

    <!-- 标题 -->
    <div class="bp-header" ref="headerRef">
      <div class="header-tag">精密流程</div>
      <h1 class="header-title">蓝图体系</h1>
      <p class="header-subtitle">从分析到交付的完整链路</p>
    </div>

    <!-- SVG连接线 -->
    <div class="bp-svg-container" ref="svgContainerRef">
      <svg class="bp-svg" viewBox="0 0 900 80" preserveAspectRatio="none" ref="svgRef">
        <!-- 主连接线 -->
        <path
          class="bp-path-main"
          d="M 50 40 L 180 40 L 230 40 L 280 40 L 350 40 L 400 40 L 450 40 L 520 40 L 570 40 L 620 40 L 700 40 L 750 40 L 800 40 L 850 40"
          fill="none"
          stroke="url(#pathGradient)"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="1200"
          stroke-dashoffset="1200"
        />
        <!-- 节点圆点 -->
        <circle class="bp-node" cx="50" cy="40" r="6" fill="#3B82F6" />
        <circle class="bp-node" cx="280" cy="40" r="6" fill="#8B5CF6" />
        <circle class="bp-node" cx="450" cy="40" r="6" fill="#10B981" />
        <circle class="bp-node" cx="620" cy="40" r="6" fill="#F59E0B" />
        <circle class="bp-node" cx="850" cy="40" r="8" fill="#EC4899" />
        <!-- 渐变定义 -->
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3B82F6" />
            <stop offset="50%" stop-color="#8B5CF6" />
            <stop offset="100%" stop-color="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <!-- 绘制进度指示器 -->
      <div class="bp-progress" ref="progressRef"></div>
    </div>

    <!-- 流程卡片 -->
    <div class="bp-cards" ref="cardsRef">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="bp-card"
        :ref="el => { if(el) cardRefs[index] = el as HTMLElement }"
        :style="{ '--accent': step.color, '--delay': index * 0.15 }"
      >
        <!-- 卡片顶部装饰 -->
        <div class="card-top-line"></div>

        <!-- 节点编号 -->
        <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>

        <!-- 图标 -->
        <div class="card-icon-wrap" :ref="el => { if(el) iconRefs[index] = el as HTMLElement }">
          <span class="card-icon">{{ step.icon }}</span>
          <div class="icon-ring"></div>
        </div>

        <!-- 内容 -->
        <div class="card-content">
          <h3 class="card-title">{{ step.title }}</h3>
          <p class="card-desc">{{ step.desc }}</p>
        </div>

        <!-- 底部装饰 -->
        <div class="card-bottom">
          <div class="bottom-dots">
            <span v-for="i in 5" :key="i" class="dot"></span>
          </div>
        </div>

        <!-- 悬停信息 -->
        <div class="card-hover-info">
          <span class="hover-label">关键能力</span>
          <span class="hover-value">{{ step.skill }}</span>
        </div>

        <!-- 连接线指示 -->
        <div class="card-connector" v-if="index < steps.length - 1">
          <div class="connector-line"></div>
          <div class="connector-arrow">›</div>
        </div>
      </div>
    </div>

    <!-- 底部总结 -->
    <div class="bp-footer" ref="footerRef">
      <div class="footer-badge">
        <span class="badge-icon">⚡</span>
        <span class="badge-text">全流程可追溯 · 节点可视化</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Step {
  icon: string
  title: string
  desc: string
  skill: string
  color: string
}

const steps: Step[] = [
  {
    icon: '🔍',
    title: '需求分析',
    desc: '深入业务场景',
    skill: '商业洞察',
    color: '#3B82F6'
  },
  {
    icon: '⚙️',
    title: '方案架构',
    desc: '定制化设计',
    skill: '系统规划',
    color: '#8B5CF6'
  },
  {
    icon: '🔧',
    title: '开发实施',
    desc: '敏捷迭代',
    skill: '技术实现',
    color: '#10B981'
  },
  {
    icon: '🧪',
    title: '测试验证',
    desc: '严格质检',
    skill: '质量保障',
    color: '#F59E0B'
  },
  {
    icon: '🚀',
    title: '部署交付',
    desc: '快速上线',
    skill: '运维支持',
    color: '#EC4899'
  }
]

// Refs
const headerRef = ref<HTMLElement | null>(null)
const svgContainerRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const cardsRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const iconRefs = ref<HTMLElement[]>([])

// 清理函数
const cleanupFns: (() => void)[] = []

onMounted(() => {
  if (!cardsRef.value) return

  setTimeout(() => {
    // 标题入场动画
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
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.2'
      )
      .fromTo('.header-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.3'
      )

    cleanupFns.push(() => headerTl.kill())

    // SVG路径绘制动画
    const pathTl = gsap.timeline({
      scrollTrigger: {
        trigger: svgContainerRef.value,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    })

    pathTl
      .fromTo('.bp-path-main',
        { strokeDashoffset: 1200 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut'
        }
      )
      .fromTo('.bp-node',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.15,
          ease: 'back.out(2)'
        },
        '-=0.8'
      )
      .fromTo(progressRef.value,
        { width: '0%' },
        { width: '100%', duration: 1.5, ease: 'power2.inOut' },
        0
      )

    cleanupFns.push(() => pathTl.kill())

    // 卡片入场动画
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: cardsRef.value,
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    })

    cardTl
      .fromTo('.bp-card',
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'back.out(1.4)'
        }
      )
      .fromTo('.card-number',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.12
        },
        '-=0.5'
      )
      .fromTo('.card-icon-wrap',
        { scale: 0, rotation: -45 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'back.out(1.7)'
        },
        '-=0.4'
      )

    cleanupFns.push(() => cardTl.kill())

    // 卡片悬停效果
    cardRefs.value.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.card-hover-info'), {
          opacity: 1,
          y: 0,
          duration: 0.3
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
        gsap.to(card.querySelector('.card-hover-info'), {
          opacity: 0,
          y: 10,
          duration: 0.3
        })
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

    // 卡片呼吸效果
    cardRefs.value.forEach((card, i) => {
      gsap.to(card, {
        y: -5,
        duration: 2 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2
      })
    })
  }, 100)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.blueprint-section {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
}

.bp-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .bg-glow {
    position: absolute;
    top: 30%;
    left: 50%;
    width: 600px;
    height: 300px;
    transform: translateX(-50%);
    background: radial-gradient(ellipse, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    filter: blur(40px);
  }
}

.bp-header {
  text-align: center;
  margin-bottom: 60px;
  z-index: 1;

  .header-tag {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 20px;
    font-size: 12px;
    color: #60a5fa;
    letter-spacing: 2px;
    margin-bottom: 16px;
    text-transform: uppercase;
  }

  .header-title {
    font-size: 48px;
    font-weight: bold;
    color: #fff;
    margin: 0 0 12px;
    letter-spacing: 3px;
    text-shadow: 0 0 40px rgba(59, 130, 246, 0.5);
  }

  .header-subtitle {
    font-size: 16px;
    color: rgba(148, 163, 184, 0.8);
    margin: 0;
    letter-spacing: 1px;
  }
}

.bp-svg-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 80px;
  margin-bottom: 40px;
  z-index: 1;

  .bp-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .bp-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #3B82F6, #EC4899);
    border-radius: 1px;
  }
}

.bp-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  max-width: 1100px;
  z-index: 1;
}

.bp-card {
  position: relative;
  width: 180px;
  padding: 28px 20px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
  overflow: hidden;

  .card-top-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .card-number {
    position: absolute;
    top: 12px;
    left: 12px;
    font-size: 12px;
    font-weight: bold;
    color: var(--accent);
    font-family: monospace;
    opacity: 0.6;
  }

  .card-icon-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: 16px;

    .card-icon {
      font-size: 40px;
      filter: drop-shadow(0 0 10px var(--accent));
    }

    .icon-ring {
      position: absolute;
      inset: -8px;
      border: 2px solid var(--accent);
      border-radius: 50%;
      opacity: 0.3;
      animation: ringPulse 2s ease-in-out infinite;
    }
  }

  .card-content {
    .card-title {
      font-size: 18px;
      font-weight: bold;
      color: #f1f5f9;
      margin: 0 0 8px;
      letter-spacing: 1px;
    }

    .card-desc {
      font-size: 13px;
      color: rgba(148, 163, 184, 0.7);
      margin: 0;
    }
  }

  .card-bottom {
    margin-top: 16px;

    .bottom-dots {
      display: flex;
      justify-content: center;
      gap: 6px;

      .dot {
        width: 4px;
        height: 4px;
        background: var(--accent);
        border-radius: 50%;
        opacity: 0.4;

        &:nth-child(2) { opacity: 0.6; }
        &:nth-child(3) { opacity: 0.8; }
        &:nth-child(4) { opacity: 0.6; }
      }
    }
  }

  .card-hover-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    background: linear-gradient(to top, var(--accent), transparent);
    opacity: 0;
    transform: translateY(10px);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .hover-label {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
    }

    .hover-value {
      font-size: 12px;
      font-weight: bold;
      color: #fff;
    }
  }

  .card-connector {
    position: absolute;
    right: -24px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    z-index: 10;

    .connector-line {
      width: 18px;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), rgba(255, 255, 255, 0.3));
    }

    .connector-arrow {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.5);
    }
  }

  &:hover {
    border-color: var(--accent);
    box-shadow:
      0 0 30px rgba(59, 130, 246, 0.2),
      0 10px 40px rgba(0, 0, 0, 0.3);

    .card-top-line {
      opacity: 1;
    }

    .icon-ring {
      animation-duration: 1s;
      opacity: 0.6;
    }
  }
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.bp-footer {
  margin-top: 60px;
  z-index: 1;

  .footer-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 30px;

    .badge-icon {
      font-size: 18px;
    }

    .badge-text {
      font-size: 14px;
      color: #94a3b8;
      letter-spacing: 1px;
    }
  }
}
</style>
