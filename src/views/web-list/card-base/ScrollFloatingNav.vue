<template>
  <div class="scroll-floating-nav-section-225">
    <!-- 粒子背景 -->
    <canvas ref="particleCanvas" class="particle-canvas-225"></canvas>

    <!-- 主标题 -->
    <div class="section-header-225">
      <h2 class="section-title-225">悬浮导航动画</h2>
      <p class="section-subtitle-225">Floating Navigation Animation</p>
    </div>

    <!-- 悬浮导航 1: 顶部导航栏 -->
    <div class="nav-demo-225 top-nav-225">
      <div class="demo-label-225">顶部导航栏</div>
      <div class="nav-container-225">
        <nav class="floating-nav-225" ref="nav1">
          <div class="nav-logo-225">
            <span class="logo-icon-225">🚀</span>
            <span class="logo-text-225">FloatNav</span>
          </div>
          <div class="nav-links-225">
            <a href="#" class="nav-link-225 nav-active-225">首页</a>
            <a href="#" class="nav-link-225">产品</a>
            <a href="#" class="nav-link-225">服务</a>
            <a href="#" class="nav-link-225">关于</a>
            <a href="#" class="nav-link-225">联系</a>
          </div>
          <div class="nav-actions-225">
            <button class="nav-btn-225 nav-btn-ghost-225">登录</button>
            <button class="nav-btn-225 nav-btn-primary-225">注册</button>
          </div>
        </nav>
        <div class="nav-placeholder-225">
          <p class="placeholder-text-225">向下滚动查看导航栏浮动效果</p>
          <div class="scroll-hint-225">
            <span class="hint-arrow-225">↓</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮导航 2: 侧边栏导航 -->
    <div class="nav-demo-225 sidebar-nav-225">
      <div class="demo-label-225">侧边栏导航</div>
      <div class="nav-container-225 nav-container-sidebar-225">
        <nav class="floating-nav-225 nav-sidebar-225" ref="nav2">
          <div class="sidebar-header-225">
            <span class="sidebar-icon-225">⚡</span>
            <span class="sidebar-title-225">快速访问</span>
          </div>
          <div class="sidebar-links-225">
            <a href="#" class="sidebar-link-225 sidebar-link-active-225">
              <span class="link-icon-225">🏠</span>
              <span class="link-text-225">仪表盘</span>
            </a>
            <a href="#" class="sidebar-link-225">
              <span class="link-icon-225">📊</span>
              <span class="link-text-225">数据分析</span>
            </a>
            <a href="#" class="sidebar-link-225">
              <span class="link-icon-225">📁</span>
              <span class="link-text-225">文件管理</span>
            </a>
            <a href="#" class="sidebar-link-225">
              <span class="link-icon-225">⚙️</span>
              <span class="link-text-225">系统设置</span>
            </a>
          </div>
          <div class="sidebar-footer-225">
            <div class="user-avatar-225">U</div>
            <div class="user-info-225">
              <span class="user-name-225">用户名</span>
              <span class="user-status-225">在线</span>
            </div>
          </div>
        </nav>
        <div class="sidebar-content-225">
          <h3 class="content-title-225">侧边栏导航</h3>
          <p class="content-text-225">侧边栏导航会随滚动产生平滑的上下浮动效果,保持导航的可见性同时不遮挡内容。</p>
        </div>
      </div>
    </div>

    <!-- 悬浮导航 3: 底部导航栏 -->
    <div class="nav-demo-225 bottom-nav-225">
      <div class="demo-label-225">底部导航栏</div>
      <div class="nav-container-225">
        <nav class="floating-nav-225 nav-bottom-225" ref="nav3">
          <a href="#" class="bottom-nav-item-225 bottom-nav-active-225">
            <span class="bottom-icon-225">🏠</span>
            <span class="bottom-label-225">首页</span>
          </a>
          <a href="#" class="bottom-nav-item-225">
            <span class="bottom-icon-225">🔍</span>
            <span class="bottom-label-225">搜索</span>
          </a>
          <a href="#" class="bottom-nav-item-225">
            <span class="bottom-icon-225">➕</span>
            <span class="bottom-label-225">添加</span>
          </a>
          <a href="#" class="bottom-nav-item-225">
            <span class="bottom-icon-225">❤️</span>
            <span class="bottom-label-225">收藏</span>
          </a>
          <a href="#" class="bottom-nav-item-225">
            <span class="bottom-icon-225">👤</span>
            <span class="bottom-label-225">我的</span>
          </a>
        </nav>
        <div class="bottom-placeholder-225">
          <h3 class="content-title-225">底部导航栏</h3>
          <p class="content-text-225">底部导航栏随滚动产生轻微浮动,在移动端提供便捷的导航体验。</p>
        </div>
      </div>
    </div>

    <!-- 悬浮导航 4: 圆形悬浮按钮 -->
    <div class="nav-demo-225 fab-nav-225">
      <div class="demo-label-225">圆形悬浮按钮</div>
      <div class="nav-container-225 nav-container-fab-225">
        <nav class="floating-nav-225 nav-fab-225" ref="nav4">
          <button class="fab-button-225 fab-main-225">
            <span class="fab-icon-225">+</span>
          </button>
          <div class="fab-menu-225">
            <button class="fab-button-225 fab-item-225">
              <span class="fab-icon-225">📝</span>
            </button>
            <button class="fab-button-225 fab-item-225">
              <span class="fab-icon-225">📷</span>
            </button>
            <button class="fab-button-225 fab-item-225">
              <span class="fab-icon-225">📍</span>
            </button>
          </div>
        </nav>
        <div class="fab-content-225">
          <h3 class="content-title-225">圆形悬浮按钮</h3>
          <p class="content-text-225">圆形悬浮按钮(FAB)随滚动产生浮动效果,提供快速访问常用功能。</p>
        </div>
      </div>
    </div>

    <!-- 悬浮导航 5: 卡片式导航 -->
    <div class="nav-demo-225 card-nav-225">
      <div class="demo-label-225">卡片式导航</div>
      <div class="nav-container-225">
        <nav class="floating-nav-225 nav-card-225" ref="nav5">
          <div class="nav-card-item-225 nav-card-active-225">
            <div class="nav-card-icon-225">📊</div>
            <span class="nav-card-label-225">概览</span>
          </div>
          <div class="nav-card-item-225">
            <div class="nav-card-icon-225">📈</div>
            <span class="nav-card-label-225">趋势</span>
          </div>
          <div class="nav-card-item-225">
            <div class="nav-card-icon-225">🎯</div>
            <span class="nav-card-label-225">目标</span>
          </div>
          <div class="nav-card-item-225">
            <div class="nav-card-icon-225">⚙️</div>
            <span class="nav-card-label-225">设置</span>
          </div>
        </nav>
        <div class="card-placeholder-225">
          <h3 class="content-title-225">卡片式导航</h3>
          <p class="content-text-225">卡片式导航提供清晰的视觉层次,每个卡片代表一个导航项,悬浮效果增强交互体验。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const particleCanvas = ref(null)
const nav1 = ref(null)
const nav2 = ref(null)
const nav3 = ref(null)
const nav4 = ref(null)
const nav5 = ref(null)

// 粒子系统
let particles = []
let animationId = null

const initParticles = () => {
  const canvas = particleCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.5 + 0.2
    })
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => {
      p.x += p.speedX
      p.y += p.speedY

      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`
      ctx.fill()
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

// GSAP动画
const initAnimations = () => {
  // 顶部导航栏浮动
  if (nav1.value) {
    gsap.fromTo(nav1.value,
      { y: -100, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.top-nav-225',
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        },
        y: 0,
        opacity: 1,
        ease: 'power2.out'
      }
    )

    // 滚动时导航栏轻微浮动
    gsap.to(nav1.value, {
      scrollTrigger: {
        trigger: '.top-nav-225',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      },
      y: -20,
      ease: 'none'
    })
  }

  // 侧边栏导航浮动
  if (nav2.value) {
    gsap.fromTo(nav2.value,
      { x: -100, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.sidebar-nav-225',
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        },
        x: 0,
        opacity: 1,
        ease: 'power2.out'
      }
    )

    gsap.to(nav2.value, {
      scrollTrigger: {
        trigger: '.sidebar-nav-225',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      },
      y: -30,
      ease: 'none'
    })
  }

  // 底部导航栏浮动
  if (nav3.value) {
    gsap.fromTo(nav3.value,
      { y: 100, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.bottom-nav-225',
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        },
        y: 0,
        opacity: 1,
        ease: 'power2.out'
      }
    )

    gsap.to(nav3.value, {
      scrollTrigger: {
        trigger: '.bottom-nav-225',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      },
      y: 15,
      ease: 'none'
    })
  }

  // 圆形悬浮按钮浮动
  if (nav4.value) {
    gsap.fromTo(nav4.value,
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.fab-nav-225',
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        },
        scale: 1,
        opacity: 1,
        ease: 'back.out(1.7)'
      }
    )

    gsap.to(nav4.value, {
      scrollTrigger: {
        trigger: '.fab-nav-225',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      },
      y: -25,
      ease: 'none'
    })
  }

  // 卡片式导航浮动
  if (nav5.value) {
    gsap.fromTo(nav5.value,
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.card-nav-225',
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1
        },
        y: 0,
        opacity: 1,
        ease: 'power2.out'
      }
    )

    gsap.to(nav5.value, {
      scrollTrigger: {
        trigger: '.card-nav-225',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5
      },
      y: -18,
      ease: 'none'
    })
  }

  // 导航链接悬停动画
  gsap.utils.toArray('.nav-link-225').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        y: -3,
        color: '#8b5cf6',
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        y: 0,
        color: '',
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })

  // 滚动提示动画
  gsap.to('.scroll-hint-225', {
    scrollTrigger: {
      trigger: '.top-nav-225',
      start: 'top 80%',
      end: 'top 60%',
      scrub: 1
    },
    y: 10,
    opacity: 0,
    repeat: -1,
    yoyo: true,
    duration: 1
  })
}

onMounted(() => {
  initParticles()
  initAnimations()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.scroll-floating-nav-section-225 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.particle-canvas-225 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.section-header-225 {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.section-title-225 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  text-shadow: 0 0 40px rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

.section-subtitle-225 {
  font-size: 1.25rem;
  color: #64748b;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.nav-demo-225 {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.1);
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.demo-label-225 {
  font-size: 0.875rem;
  color: #8b5cf6;
  margin-bottom: 24px;
  padding: 8px 16px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 20px;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

/* 顶部导航 */
.nav-container-225 {
  position: relative;
}

.floating-nav-225 {
  position: relative;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.nav-logo-225 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;

  opacity: 1 !important;}

.logo-icon-225 {
  font-size: 1.5rem;

  opacity: 1 !important;}

.logo-text-225 {
  background: linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.nav-links-225 {
  display: flex;
  gap: 8px;
}

.nav-link-225 {
  padding: 10px 20px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.nav-link-225:hover {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.nav-active-225 {
  color: #fff;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);

  opacity: 1 !important;}

.nav-actions-225 {
  display: flex;
  gap: 12px;
}

.nav-btn-225 {
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.nav-btn-ghost-225 {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

.nav-btn-ghost-225:hover {
  color: #8b5cf6;
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.nav-btn-primary-225 {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

.nav-btn-primary-225:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

/* 顶部导航布局 */
.top-nav-225 .floating-nav-225 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;

  opacity: 1 !important;}

.nav-placeholder-225 {
  margin-top: 40px;
  padding: 60px 20px;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 16px;
  text-align: center;
  border: 1px dashed rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

.placeholder-text-225 {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 20px;

  opacity: 1 !important;}

.scroll-hint-225 {
  display: inline-block;
  animation: bounce-hint-225 1.5s ease-in-out infinite;
}

@keyframes bounce-hint-225 {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

.hint-arrow-225 {
  font-size: 2rem;
  color: #8b5cf6;

  opacity: 1 !important;}

/* 侧边栏导航 */
.nav-container-sidebar-225 {
  display: flex;
  gap: 32px;
}

.nav-sidebar-225 {
  width: 240px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  opacity: 1 !important;}

.sidebar-header-225 {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}

.sidebar-icon-225 {
  font-size: 1.5rem;

  opacity: 1 !important;}

.sidebar-title-225 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;

  opacity: 1 !important;}

.sidebar-links-225 {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.sidebar-link-225 {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.sidebar-link-225:hover {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.sidebar-link-active-225 {
  color: #fff;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);

  opacity: 1 !important;}

.link-icon-225 {
  font-size: 1.1rem;

  opacity: 1 !important;}

.link-text-225 {
  font-size: 0.95rem;
  font-weight: 500;

  opacity: 1 !important;}

.sidebar-footer-225 {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.user-avatar-225 {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;

  opacity: 1 !important;}

.user-info-225 {
  display: flex;
  flex-direction: column;
}

.user-name-225 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;

  opacity: 1 !important;}

.user-status-225 {
  font-size: 0.8rem;
  color: #22c55e;

  opacity: 1 !important;}

.sidebar-content-225 {
  flex: 1;
  padding: 24px;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 16px;

  opacity: 1 !important;}

/* 底部导航 */
.nav-bottom-225 {
  display: flex;
  justify-content: space-around;
  padding: 16px;

  opacity: 1 !important;}

.bottom-nav-item-225 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  min-width: 80px;

  opacity: 1 !important;}

.bottom-nav-item-225:hover {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.bottom-nav-active-225 {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);

  opacity: 1 !important;}

.bottom-icon-225 {
  font-size: 1.5rem;

  opacity: 1 !important;}

.bottom-label-225 {
  font-size: 0.8rem;
  font-weight: 500;

  opacity: 1 !important;}

.bottom-placeholder-225 {
  margin-top: 40px;
  padding: 60px 20px;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 16px;
  text-align: center;
  border: 1px dashed rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

/* 圆形悬浮按钮 */
.nav-container-fab-225 {
  display: flex;
  align-items: center;
  gap: 40px;
}

.nav-fab-225 {
  position: relative;
}

.fab-button-225 {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.fab-main-225 {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  font-size: 2rem;
  color: #fff;

  opacity: 1 !important;}

.fab-main-225:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 12px 35px rgba(139, 92, 246, 0.5);
}

.fab-icon-225 {
  color: #fff;

  opacity: 1 !important;}

.fab-menu-225 {
  position: absolute;
  top: -20px;
  left: -20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fab-item-225 {
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  backdrop-filter: blur(10px);
  width: 44px;
  height: 44px;

  opacity: 1 !important;}

.fab-item-225:hover {
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  transform: scale(1.1);
}

.fab-content-225 {
  flex: 1;
  padding: 24px;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 16px;

  opacity: 1 !important;}

/* 卡片式导航 */
.nav-card-225 {
  display: flex;
  gap: 16px;
  padding: 20px;
  justify-content: center;

  opacity: 1 !important;}

.nav-card-item-225 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;

  opacity: 1 !important;}

.nav-card-item-225:hover {
  background: rgba(139, 92, 246, 0.1);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(139, 92, 246, 0.2);
}

.nav-card-active-225 {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%);
  border-color: #8b5cf6;
  box-shadow: 0 0 25px rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

.nav-card-icon-225 {
  font-size: 2rem;

  opacity: 1 !important;}

.nav-card-label-225 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;

  opacity: 1 !important;}

.nav-card-active-225 .nav-card-label-225 {
  color: #8b5cf6;

  opacity: 1 !important;}

.card-placeholder-225 {
  margin-top: 40px;
  padding: 60px 20px;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 16px;
  text-align: center;
  border: 1px dashed rgba(139, 92, 246, 0.3);

  opacity: 1 !important;}

.content-title-225 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 16px;

  opacity: 1 !important;}

.content-text-225 {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.8;

  opacity: 1 !important;}

/* 响应式 */
@media (max-width: 768px) {
  .section-title-225 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .nav-demo-225 {
    padding: 24px;
  
  opacity: 1 !important;}

  .top-nav-225 .floating-nav-225 {
    flex-wrap: wrap;
    gap: 16px;
  }

  .nav-links-225 {
    order: 3;
    width: 100%;
    justify-content: center;
  
  opacity: 1 !important;}

  .nav-actions-225 {
    order: 2;
  }

  .nav-container-sidebar-225 {
    flex-direction: column;
  }

  .nav-sidebar-225 {
    width: 100%;
  
  opacity: 1 !important;}

  .nav-container-fab-225 {
    flex-direction: column;
  }

  .nav-card-225 {
    flex-wrap: wrap;
  }

  .nav-card-item-225 {
    min-width: 80px;
    padding: 16px 20px;
  
  opacity: 1 !important;}

  .bottom-nav-item-225 {
    min-width: 60px;
    padding: 6px 12px;
  
  opacity: 1 !important;}

  .bottom-label-225 {
    font-size: 0.7rem;
  
  opacity: 1 !important;}
}
</style>
