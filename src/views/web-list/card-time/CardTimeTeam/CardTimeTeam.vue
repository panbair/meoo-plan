<template>
  <section class="team-section">
    <!-- 背景效果 -->
    <div class="team-bg">
      <div class="bg-gradient"></div>
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div class="team-header" ref="headerRef">
      <div class="header-label">我们的团队</div>
      <h1 class="header-title">核心成员</h1>
      <p class="header-subtitle">用专业创造价值 · 用热情点燃创新</p>
    </div>

    <!-- 团队成员卡片 -->
    <div class="team-grid" ref="gridRef">
      <div
        v-for="(member, index) in members"
        :key="index"
        class="member-card"
        :ref="el => { if(el) cardRefs[index] = el as HTMLElement }"
        :style="{ '--speed': member.speed, '--accent': member.color }"
        :data-speed="member.speed"
      >
        <!-- 卡片背景 -->
        <div class="card-bg"></div>

        <!-- 头像区域 -->
        <div class="card-avatar-wrap">
          <div class="avatar-ring"></div>
          <div class="avatar-inner">
            <span class="avatar-emoji">{{ member.avatar }}</span>
          </div>
        </div>

        <!-- 基础信息 -->
        <div class="card-info">
          <h3 class="info-name">{{ member.name }}</h3>
          <p class="info-role">{{ member.role }}</p>
        </div>

        <!-- 技能标签 -->
        <div class="card-skills">
          <span
            v-for="(skill, i) in member.skills"
            :key="i"
            class="skill-tag"
          >{{ skill }}</span>
        </div>

        <!-- 详情层 -->
        <div class="card-detail" ref="el => { if(el) detailRefs[index] = el as HTMLElement }">
          <div class="detail-content">
            <p class="detail-bio">{{ member.bio }}</p>
            <div class="detail-stats">
              <div class="stat">
                <span class="stat-value">{{ member.exp }}</span>
                <span class="stat-label">年经验</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ member.projects }}</span>
                <span class="stat-label">项目</span>
              </div>
            </div>
          </div>
          <div class="detail-contact">
            <span class="contact-icon">✉️</span>
            <span class="contact-text">{{ member.email }}</span>
          </div>
        </div>

        <!-- 视差指示线 -->
        <div class="parallax-line"></div>

        <!-- 边框装饰 -->
        <div class="card-border"></div>
      </div>
    </div>

    <!-- 底部团队宣言 -->
    <div class="team-footer" ref="footerRef">
      <div class="footer-text">
        <span class="text-highlight">共同愿景</span>
        <span class="text-normal">驱动我们前行</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Member {
  avatar: string
  name: string
  role: string
  skills: string[]
  bio: string
  exp: number
  projects: number
  email: string
  color: string
  speed: number
}

const members: Member[] = [
  {
    avatar: '👨‍💼',
    name: '张明远',
    role: '创始人 & CEO',
    skills: ['战略规划', '商业模式', '团队建设'],
    bio: '深耕行业十五年，致力于用技术创新改变世界。',
    exp: 15,
    projects: 50,
    email: 'zhang@company.com',
    color: '#3B82F6',
    speed: 0.8
  },
  {
    avatar: '👩‍💻',
    name: '李雨晴',
    role: '技术总监',
    skills: ['架构设计', '云计算', 'AI研发'],
    bio: '前BAT技术专家，专注于大规模分布式系统。',
    exp: 12,
    projects: 80,
    email: 'li@company.com',
    color: '#8B5CF6',
    speed: 1.0
  },
  {
    avatar: '👨‍🎨',
    name: '王浩宇',
    role: '设计总监',
    skills: ['UI/UX', '品牌设计', '创意策划'],
    bio: '曾获多项国际设计大奖，追求极致的用户体验。',
    exp: 10,
    projects: 120,
    email: 'wang@company.com',
    color: '#EC4899',
    speed: 1.2
  },
  {
    avatar: '👩‍🔬',
    name: '陈思远',
    role: '产品总监',
    skills: ['需求分析', '数据分析', '敏捷管理'],
    bio: '用数据驱动决策，用洞察引领产品方向。',
    exp: 8,
    projects: 60,
    email: 'chen@company.com',
    color: '#10B981',
    speed: 0.6
  },
  {
    avatar: '👨‍🔧',
    name: '刘建豪',
    role: '运维总监',
    skills: ['DevOps', '安全', '容灾'],
    bio: '保障系统7×24稳定运行的安全守护者。',
    exp: 11,
    projects: 45,
    email: 'liu@company.com',
    color: '#F59E0B',
    speed: 1.4
  },
  {
    avatar: '👩‍📊',
    name: '赵婉儿',
    role: '市场总监',
    skills: ['品牌运营', '市场营销', '用户增长'],
    bio: '连续创业者，擅长从0到1打造品牌影响力。',
    exp: 9,
    projects: 35,
    email: 'zhao@company.com',
    color: '#06B6D4',
    speed: 1.0
  }
]

// Refs
const headerRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const cardRefs = ref<HTMLElement[]>([])
const detailRefs = ref<HTMLElement[]>([])

// 清理函数
const cleanupFns: (() => void)[] = []

onMounted(() => {
  if (!gridRef.value) return

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
      .fromTo('.header-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
      .fromTo('.header-title',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.2'
      )
      .fromTo('.header-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.3'
      )

    cleanupFns.push(() => headerTl.kill())

    // 卡片入场 + 视差效果
    cardRefs.value.forEach((card, index) => {
      const member = members[index]
      const detail = detailRefs.value[index]
      if (!detail) return

      // 入场动画
      gsap.fromTo(card,
        {
          y: 100,
          opacity: 0,
          rotateY: 15,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )

      // 滚动视差
      gsap.to(card, {
        y: -30 * member.speed,
        ease: 'none',
        scrollTrigger: {
          trigger: gridRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      })

      // 悬停效果
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -15,
          scale: 1.03,
          rotateY: 5,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(detail, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        })
        gsap.to(card.querySelector('.card-bg'), {
          opacity: 0.8,
          duration: 0.3
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        })
        gsap.to(detail, {
          opacity: 0,
          y: 20,
          duration: 0.3
        })
        gsap.to(card.querySelector('.card-bg'), {
          opacity: 0.3,
          duration: 0.3
        })
      })

      // 初始化详情层
      gsap.set(detail, { opacity: 0, y: 20 })
    })

    // 头像脉冲动画
    cardRefs.value.forEach((card, i) => {
      gsap.to(card.querySelector('.avatar-ring'), {
        scale: 1.1,
        opacity: 0.5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3
      })
    })

    // 底部入场
    gsap.fromTo(footerRef.value,
      { opacity: 0, y: 40 },
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
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.team-section {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
}

.team-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
  }

  .bg-shapes {
    position: absolute;
    inset: 0;

    .shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;

      &.shape-1 {
        width: 400px;
        height: 400px;
        background: rgba(59, 130, 246, 0.3);
        top: -100px;
        left: -100px;
        animation: shapeFloat1 8s ease-in-out infinite;
      }

      &.shape-2 {
        width: 300px;
        height: 300px;
        background: rgba(139, 92, 246, 0.3);
        bottom: -50px;
        right: -50px;
        animation: shapeFloat2 10s ease-in-out infinite;
      }

      &.shape-3 {
        width: 200px;
        height: 200px;
        background: rgba(236, 72, 153, 0.3);
        top: 50%;
        left: 50%;
        animation: shapeFloat3 12s ease-in-out infinite;
      }
    }
  }
}

@keyframes shapeFloat1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 20px); }
}

@keyframes shapeFloat2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, -30px); }
}

@keyframes shapeFloat3 {
  0%, 100% { transform: translate(-50%, -50%); }
  50% { transform: translate(calc(-50% + 20px), calc(-50% - 20px)); }
}

.team-header {
  text-align: center;
  margin-bottom: 60px;
  z-index: 1;

  .header-label {
    font-size: 12px;
    color: #60a5fa;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 12px;
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

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1000px;
  z-index: 1;
  perspective: 1000px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.member-card {
  position: relative;
  width: 280px;
  padding: 32px 24px;
  background: rgba(30, 30, 50, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: border-color 0.3s;
  overflow: hidden;

  .card-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, var(--accent), transparent 70%);
    opacity: 0.3;
    transition: opacity 0.3s;
  }

  .card-avatar-wrap {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;

    .avatar-ring {
      position: absolute;
      inset: -10px;
      border: 2px solid var(--accent);
      border-radius: 50%;
      opacity: 0.4;
    }

    .avatar-inner {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255, 255, 255, 0.1);

      .avatar-emoji {
        font-size: 36px;
      }
    }
  }

  .card-info {
    margin-bottom: 16px;

    .info-name {
      font-size: 20px;
      font-weight: bold;
      color: #f1f5f9;
      margin: 0 0 6px;
      letter-spacing: 1px;
    }

    .info-role {
      font-size: 14px;
      color: var(--accent);
      margin: 0;
      letter-spacing: 0.5px;
    }
  }

  .card-skills {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;

    .skill-tag {
      padding: 4px 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 11px;
      color: rgba(148, 163, 184, 0.8);
    }
  }

  .card-detail {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
    border-radius: 0 0 20px 20px;

    .detail-content {
      margin-bottom: 12px;

      .detail-bio {
        font-size: 13px;
        color: rgba(200, 200, 220, 0.8);
        margin: 0 0 12px;
        line-height: 1.5;
      }

      .detail-stats {
        display: flex;
        justify-content: center;
        gap: 24px;

        .stat {
          text-align: center;

          .stat-value {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: var(--accent);
          }

          .stat-label {
            font-size: 11px;
            color: rgba(148, 163, 184, 0.6);
          }
        }
      }
    }

    .detail-contact {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .contact-icon {
        font-size: 14px;
      }

      .contact-text {
        font-size: 12px;
        color: rgba(148, 163, 184, 0.7);
      }
    }
  }

  .parallax-line {
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, transparent, var(--accent), transparent);
    opacity: 0.3;
  }

  .card-border {
    position: absolute;
    inset: 0;
    border-radius: 20px;
    border: 1px solid transparent;
    background: linear-gradient(145deg, var(--accent), transparent 50%) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: var(--accent);

    .card-border {
      opacity: 0.5;
    }
  }
}

.team-footer {
  margin-top: 80px;
  text-align: center;
  z-index: 1;

  .footer-text {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 32px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 40px;
    border: 1px solid rgba(255, 255, 255, 0.08);

    .text-highlight {
      font-size: 18px;
      font-weight: bold;
      color: #60a5fa;
    }

    .text-normal {
      font-size: 16px;
      color: rgba(148, 163, 184, 0.8);
    }
  }
}
</style>
