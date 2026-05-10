<template>
  <section class="trust-section">
    <!-- 背景效果 -->
    <div class="trust-bg">
      <div class="bg-gradient"></div>
      <div class="bg-pattern"></div>
    </div>

    <!-- 标题区域 -->
    <div class="trust-header" ref="headerRef">
      <div class="header-badge">数据见证实力</div>
      <h1 class="header-title">信任 · 量化可见</h1>
      <p class="header-subtitle">滚动探索我们的成长轨迹</p>
    </div>

    <!-- 数据卡片画廊 -->
    <div class="trust-gallery" ref="galleryRef">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="trust-card"
        :ref="el => { if(el) cardRefs[index] = el as HTMLElement }"
        :style="{ '--accent': stat.color }"
      >
        <!-- 卡片背景装饰 -->
        <div class="card-bg-circle"></div>

        <!-- 顶部图标 -->
        <div class="card-icon-wrap">
          <span class="card-icon">{{ stat.icon }}</span>
        </div>

        <!-- 数字显示 -->
        <div class="card-number-wrap">
          <span
            class="card-number"
            :ref="el => { if(el) numberRefs[index] = el as HTMLElement }"
            :data-target="stat.value"
            :data-decimal="stat.decimal"
            :data-suffix="stat.suffix"
          >0</span>
          <span class="card-unit">{{ stat.unit }}</span>
        </div>

        <!-- 标签 -->
        <div class="card-label">{{ stat.label }}</div>

        <!-- 描述 -->
        <div class="card-desc">{{ stat.desc }}</div>

        <!-- 进度条 -->
        <div class="card-progress">
          <div class="progress-fill" :ref="el => { if(el) progressRefs[index] = el as HTMLElement }"></div>
        </div>

        <!-- 高光扫过 -->
        <div class="card-shimmer"></div>

        <!-- 边框光晕 -->
        <div class="card-glow"></div>
      </div>
    </div>

    <!-- 底部总结 -->
    <div class="trust-footer" ref="footerRef">
      <div class="footer-quote">"数据是我们最好的语言"</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Stat {
  icon: string
  label: string
  desc: string
  value: number
  unit: string
  suffix: string
  decimal: boolean
  color: string
}

const stats: Stat[] = [
  {
    icon: '🌍',
    label: '全球客户',
    desc: '覆盖六大洲的国际企业客户',
    value: 500,
    unit: '+',
    suffix: '家',
    decimal: false,
    color: '#3B82F6'
  },
  {
    icon: '🏙️',
    label: '覆盖城市',
    desc: '深入各线城市的服务网络',
    value: 128,
    unit: '',
    suffix: '座城市',
    decimal: false,
    color: '#10B981'
  },
  {
    icon: '⚡',
    label: '系统稳定性',
    desc: '全年无间断服务保障',
    value: 99.9,
    unit: '',
    suffix: '%',
    decimal: true,
    color: '#8B5CF6'
  },
  {
    icon: '⏱️',
    label: '小时响应',
    desc: '7×24小时全天候技术支持',
    value: 24,
    unit: '/',
    suffix: '小时',
    decimal: false,
    color: '#F59E0B'
  },
  {
    icon: '📈',
    label: '年度增长',
    desc: '连续三年保持高速增长',
    value: 156,
    unit: '',
    suffix: '%',
    decimal: false,
    color: '#EC4899'
  },
  {
    icon: '🔒',
    label: '安全合规',
    desc: '通过ISO27001安全认证',
    value: 100,
    unit: '',
    suffix: '%',
    decimal: false,
    color: '#06B6D4'
  }
]

// Refs
const headerRef = ref<HTMLElement | null>(null)
const galleryRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const numberRefs = ref<HTMLElement[]>([])
const progressRefs = ref<HTMLElement[]>([])

// 清理函数
const cleanupFns: (() => void)[] = []

// 数字递增函数
function animateNumber(element: HTMLElement, target: number, isDecimal: boolean) {
  const obj = { value: 0 }

  gsap.to(obj, {
    value: target,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      if (isDecimal) {
        element.textContent = obj.value.toFixed(1)
      } else {
        element.textContent = Math.round(obj.value).toLocaleString()
      }
    }
  })
}

onMounted(() => {
  if (!galleryRef.value) return

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
      .fromTo('.header-badge',
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      )
      .fromTo('.header-title',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('.header-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )

    cleanupFns.push(() => headerTl.kill())

    // 卡片入场动画
    const cardTl = gsap.timeline({
      scrollTrigger: {
        trigger: galleryRef.value,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    })

    cardTl
      .fromTo('.trust-card',
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        }
      )
      .fromTo('.card-shimmer',
        { left: '-100%' },
        {
          left: '120%',
          duration: 1,
          stagger: 0.1,
          ease: 'power2.inOut'
        },
        '-=0.5'
      )
      .fromTo('.card-glow',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1
        },
        '-=0.8'
      )

    cleanupFns.push(() => cardTl.kill())

    // 数字递增动画 - 每个卡片独立的 ScrollTrigger
    cardRefs.value.forEach((card, index) => {
      const numberEl = numberRefs.value[index]
      const progressEl = progressRefs.value[index]
      if (!numberEl || !progressEl) return

      const stat = stats[index]

      ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        onEnter: () => {
          // 数字递增
          animateNumber(numberEl, stat.value, stat.decimal)

          // 进度条动画
          gsap.fromTo(progressEl,
            { width: '0%' },
            {
              width: `${stat.value > 100 ? 100 : stat.value}%`,
              duration: 1.5,
              ease: 'power2.out'
            }
          )
        },
        onLeaveBack: () => {
          // 回到视口外时重置
          numberEl.textContent = '0'
          gsap.to(progressEl, { width: '0%', duration: 0.3 })
        }
      })

      cleanupFns.push(() => ScrollTrigger.getAll().pop()?.kill())
    })

    // 卡片悬停3D效果
    cardRefs.value.forEach((card) => {
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)

      function handleMouseMove(e: MouseEvent) {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = (y - centerY) / 20
        const rotateY = (centerX - x) / 20

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          scale: 1.03,
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      function handleMouseLeave() {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        })
      }
    })

    // 底部入场
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

  // 移除事件监听
  cardRefs.value.forEach((card) => {
    card.removeEventListener('mousemove', () => {})
    card.removeEventListener('mouseleave', () => {})
  })
})
</script>

<style scoped lang="scss">
.trust-section {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
}

.trust-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
  }

  .bg-pattern {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
}

.trust-header {
  text-align: center;
  margin-bottom: 60px;
  z-index: 1;

  .header-badge {
    display: inline-block;
    padding: 8px 20px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 20px;
    font-size: 13px;
    color: #3B82F6;
    letter-spacing: 2px;
    margin-bottom: 20px;
  }

  .header-title {
    font-size: 48px;
    font-weight: bold;
    color: #0f172a;
    margin: 0 0 16px;
    letter-spacing: 2px;
  }

  .header-subtitle {
    font-size: 18px;
    color: #64748b;
    margin: 0;
    letter-spacing: 1px;
  }
}

.trust-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1100px;
  z-index: 1;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.trust-card {
  position: relative;
  padding: 36px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.04),
    0 1px 2px rgba(0, 0, 0, 0.02);
  text-align: center;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 800px;
  cursor: pointer;
  will-change: transform;

  .card-bg-circle {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
    opacity: 0.1;
    border-radius: 50%;
    transition: opacity 0.3s, transform 0.3s;
  }

  .card-icon-wrap {
    margin-bottom: 16px;

    .card-icon {
      font-size: 36px;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
    }
  }

  .card-number-wrap {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    margin-bottom: 8px;

    .card-number {
      font-size: 52px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    .card-unit {
      font-size: 20px;
      font-weight: 600;
      color: #64748b;
    }
  }

  .card-label {
    font-size: 18px;
    font-weight: 600;
    color: #334155;
    margin-bottom: 8px;
    letter-spacing: 1px;
  }

  .card-desc {
    font-size: 13px;
    color: #94a3b8;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .card-progress {
    height: 4px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 16px;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 70%, white));
      border-radius: 2px;
      width: 0%;
    }
  }

  .card-shimmer {
    position: absolute;
    top: 0;
    left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    transform: skewX(-25deg);
    pointer-events: none;
  }

  .card-glow {
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 1px;
    background: linear-gradient(135deg, transparent 40%, var(--accent) 50%, transparent 60%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.08),
      0 4px 12px rgba(0, 0, 0, 0.04);

    .card-bg-circle {
      opacity: 0.2;
      transform: scale(1.2);
    }

    .card-glow {
      opacity: 0.6;
    }
  }
}

.trust-footer {
  margin-top: 60px;
  text-align: center;
  z-index: 1;

  .footer-quote {
    font-size: 16px;
    color: #94a3b8;
    font-style: italic;
    letter-spacing: 1px;
    padding: 16px 32px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 30px;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
}
</style>
