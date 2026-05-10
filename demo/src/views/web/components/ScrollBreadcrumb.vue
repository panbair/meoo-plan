<template>
  <div class="scroll-breadcrumb-section-223">
    <!-- 粒子背景 -->
    <canvas ref="particleCanvas" class="particle-canvas-223"></canvas>

    <!-- 主标题 -->
    <div class="section-header-223">
      <h2 class="section-title-223">面包屑导航动画</h2>
      <p class="section-subtitle-223">Breadcrumb Navigation Animation</p>
    </div>

    <!-- 面包屑导航 1: 水平逐步显示 -->
    <div class="breadcrumb-demo-223 horizontal-breadcrumb-223">
      <div class="demo-label-223">水平逐步显示</div>
      <div class="breadcrumb-container-223">
        <div class="crumb-item-223 crumb-home-223">
          <span class="crumb-icon-223">🏠</span>
          <span class="crumb-text-223">首页</span>
        </div>
        <div class="crumb-separator-223">/</div>
        <div class="crumb-item-223">
          <span class="crumb-icon-223">📦</span>
          <span class="crumb-text-223">产品</span>
        </div>
        <div class="crumb-separator-223">/</div>
        <div class="crumb-item-223">
          <span class="crumb-icon-223">⚡</span>
          <span class="crumb-text-223">功能</span>
        </div>
        <div class="crumb-separator-223">/</div>
        <div class="crumb-item-223 crumb-active-223">
          <span class="crumb-icon-223">🎯</span>
          <span class="crumb-text-223">详情</span>
        </div>
      </div>
      <div class="breadcrumb-info-223">
        <div class="info-badge-223">步骤: <span id="crumb-step-223">0</span>/4</div>
      </div>
    </div>

    <!-- 面包屑导航 2: 垂直逐步显示 -->
    <div class="breadcrumb-demo-223 vertical-breadcrumb-223">
      <div class="demo-label-223">垂直逐步显示</div>
      <div class="breadcrumb-container-223 breadcrumb-vertical-223">
        <div class="crumb-item-223 crumb-active-223">
          <div class="crumb-dot-223"></div>
          <span class="crumb-text-223">项目概览</span>
        </div>
        <div class="crumb-item-223">
          <div class="crumb-dot-223"></div>
          <span class="crumb-text-223">设计方案</span>
        </div>
        <div class="crumb-item-223">
          <div class="crumb-dot-223"></div>
          <span class="crumb-text-223">开发实现</span>
        </div>
        <div class="crumb-item-223">
          <div class="crumb-dot-223"></div>
          <span class="crumb-text-223">测试验收</span>
        </div>
        <div class="crumb-item-223">
          <div class="crumb-dot-223"></div>
          <span class="crumb-text-223">上线部署</span>
        </div>
      </div>
    </div>

    <!-- 面包屑导航 3: 卡片式面包屑 -->
    <div class="breadcrumb-demo-223 card-breadcrumb-223">
      <div class="demo-label-223">卡片式面包屑</div>
      <div class="breadcrumb-container-223 breadcrumb-cards-223">
        <div class="crumb-card-223 crumb-card-active-223">
          <div class="crumb-card-icon-223">1</div>
          <span class="crumb-card-text-223">购物车</span>
        </div>
        <div class="crumb-arrow-223">→</div>
        <div class="crumb-card-223">
          <div class="crumb-card-icon-223">2</div>
          <span class="crumb-card-text-223">收货地址</span>
        </div>
        <div class="crumb-arrow-223">→</div>
        <div class="crumb-card-223">
          <div class="crumb-card-icon-223">3</div>
          <span class="crumb-card-text-223">支付方式</span>
        </div>
        <div class="crumb-arrow-223">→</div>
        <div class="crumb-card-223">
          <div class="crumb-card-icon-223">4</div>
          <span class="crumb-card-text-223">确认订单</span>
        </div>
      </div>
    </div>

    <!-- 面包屑导航 4: 带进度条的面包屑 -->
    <div class="breadcrumb-demo-223 progress-breadcrumb-223">
      <div class="demo-label-223">带进度条</div>
      <div class="breadcrumb-container-223">
        <div class="progress-breadcrumb-wrapper-223">
          <div class="progress-line-223">
            <div class="progress-fill-223" id="progress-fill-223"></div>
          </div>
          <div class="progress-crumbs-223">
            <div class="progress-crumb-item-223 progress-crumb-active-223">
              <div class="progress-crumb-circle-223">1</div>
              <span class="progress-crumb-label-223">注册</span>
            </div>
            <div class="progress-crumb-item-223">
              <div class="progress-crumb-circle-223">2</div>
              <span class="progress-crumb-label-223">资料</span>
            </div>
            <div class="progress-crumb-item-223">
              <div class="progress-crumb-circle-223">3</div>
              <span class="progress-crumb-label-223">审核</span>
            </div>
            <div class="progress-crumb-item-223">
              <div class="progress-crumb-circle-223">4</div>
              <span class="progress-crumb-label-223">完成</span>
            </div>
          </div>
        </div>
      </div>
      <div class="breadcrumb-info-223">
        <div class="info-badge-223">进度: <span id="progress-percent-223">0</span>%</div>
      </div>
    </div>

    <!-- 面包屑导航 5: 圆形进度面包屑 -->
    <div class="breadcrumb-demo-223 circle-breadcrumb-223">
      <div class="demo-label-223">圆形进度</div>
      <div class="breadcrumb-container-223">
        <div class="circle-crumbs-223">
          <div class="circle-crumb-item-223 circle-crumb-active-223">
            <svg class="circle-progress-223" viewBox="0 0 36 36">
              <path class="circle-bg-223" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle-fill-223 circle-fill-complete-223" stroke-dasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span class="circle-crumb-text-223">开始</span>
          </div>
          <div class="circle-crumb-item-223">
            <svg class="circle-progress-223" viewBox="0 0 36 36">
              <path class="circle-bg-223" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle-fill-223" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span class="circle-crumb-text-223">设计</span>
          </div>
          <div class="circle-crumb-item-223">
            <svg class="circle-progress-223" viewBox="0 0 36 36">
              <path class="circle-bg-223" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle-fill-223" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span class="circle-crumb-text-223">开发</span>
          </div>
          <div class="circle-crumb-item-223">
            <svg class="circle-progress-223" viewBox="0 0 36 36">
              <path class="circle-bg-223" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="circle-fill-223" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span class="circle-crumb-text-223">测试</span>
          </div>
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

// 粒子系统
let particles = []
let animationId = null

const initParticles = () => {
  const canvas = particleCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // 创建粒子
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
      ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`
      ctx.fill()
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

// GSAP动画
const initAnimations = () => {
  // 水平面包屑逐步显示
  gsap.from('.horizontal-breadcrumb-223 .crumb-item-223, .horizontal-breadcrumb-223 .crumb-separator-223', {
    scrollTrigger: {
      trigger: '.horizontal-breadcrumb-223',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    x: -30,
    opacity: 0,
    stagger: 0.15,
    ease: 'power2.out'
  })

  // 更新步骤指示 - 只用onUpdate更新textContent，不需要动画value属性
  const stepElement = document.getElementById('crumb-step-223')
  if (stepElement) {
    ScrollTrigger.create({
      trigger: '.horizontal-breadcrumb-223',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1,
      onUpdate: (self) => {
        const step = Math.floor(self.progress * 4) + 1
        const el = document.getElementById('crumb-step-223')
        if (el) el.textContent = Math.min(step, 4)
      }
    })
  }

  // 垂直面包屑逐步显示
  gsap.from('.vertical-breadcrumb-223 .crumb-item-223', {
    scrollTrigger: {
      trigger: '.vertical-breadcrumb-223',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    x: -30,
    opacity: 0,
    stagger: 0.2,
    ease: 'power2.out'
  })

  // 卡片式面包屑动画
  gsap.from('.card-breadcrumb-223 .crumb-card-223', {
    scrollTrigger: {
      trigger: '.card-breadcrumb-223',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    y: 30,
    opacity: 0,
    scale: 0.8,
    stagger: 0.15,
    ease: 'back.out(1.7)'
  })

  gsap.from('.card-breadcrumb-223 .crumb-arrow-223', {
    scrollTrigger: {
      trigger: '.card-breadcrumb-223',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    x: -20,
    opacity: 0,
    stagger: 0.15,
    ease: 'power2.out'
  })

  // 进度条面包屑动画
  gsap.from('.progress-breadcrumb-223 .progress-crumb-item-223', {
    scrollTrigger: {
      trigger: '.progress-breadcrumb-223',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    y: 20,
    opacity: 0,
    stagger: 0.2,
    ease: 'power2.out'
  })

  // 进度条填充动画
  gsap.to('#progress-fill-223', {
    scrollTrigger: {
      trigger: '.progress-breadcrumb-223',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1,
      onUpdate: (self) => {
        document.getElementById('progress-percent-223').textContent = Math.round(self.progress * 100)
      }
    },
    width: '100%',
    ease: 'power2.out'
  })

  // 圆形进度面包屑动画
  gsap.from('.circle-breadcrumb-223 .circle-crumb-item-223', {
    scrollTrigger: {
      trigger: '.circle-breadcrumb-223',
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1
    },
    scale: 0,
    opacity: 0,
    rotation: -180,
    stagger: 0.2,
    ease: 'back.out(1.7)'
  })

  // 圆形进度填充
  const circleFills = document.querySelectorAll('.circle-breadcrumb-223 .circle-fill-223')
  circleFills.forEach((fill, index) => {
    gsap.to(fill, {
      scrollTrigger: {
        trigger: '.circle-breadcrumb-223',
        start: 'top 70%',
        end: 'bottom 50%',
        scrub: 1
      },
      strokeDasharray: index === 0 ? '100, 100' : `${(index / 3) * 100}, 100`,
      ease: 'power2.out',
      delay: index * 0.1
    })
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

.scroll-breadcrumb-section-223 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.particle-canvas-223 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;

  opacity: 1 !important;}

.section-header-223 {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.section-title-223 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  text-shadow: 0 0 40px rgba(16, 185, 129, 0.3);

  opacity: 1 !important;}

.section-subtitle-223 {
  font-size: 1.25rem;
  color: #64748b;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.breadcrumb-demo-223 {
  max-width: 1200px;
  margin: 0 auto 60px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.1);
  position: relative;
  z-index: 2;

  opacity: 1 !important;}

.demo-label-223 {
  font-size: 0.875rem;
  color: #10b981;
  margin-bottom: 24px;
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

/* 水平面包屑 */
.breadcrumb-container-223 {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.crumb-item-223 {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(16, 185, 129, 0.2);

  opacity: 1 !important;}

.crumb-item-223:hover {
  background: rgba(16, 185, 129, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
}

.crumb-active-223 {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);

  opacity: 1 !important;}

.crumb-icon-223 {
  font-size: 1.25rem;

  opacity: 1 !important;}

.crumb-text-223 {
  font-size: 1rem;
  font-weight: 500;
  color: #e2e8f0;

  opacity: 1 !important;}

.crumb-active-223 .crumb-text-223 {
  color: #10b981;
  font-weight: 600;

  opacity: 1 !important;}

.crumb-separator-223 {
  color: #64748b;
  font-size: 1.25rem;
  font-weight: 300;

  opacity: 1 !important;}

.breadcrumb-info-223 {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.info-badge-223 {
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 600;

  opacity: 1 !important;}

/* 垂直面包屑 */
.breadcrumb-vertical-223 {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.vertical-breadcrumb-223 .crumb-item-223 {
  width: 100%;
  justify-content: flex-start;
  padding: 16px 24px;

  opacity: 1 !important;}

.crumb-dot-223 {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid #10b981;
  flex-shrink: 0;

  opacity: 1 !important;}

.crumb-active-223 .crumb-dot-223 {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);

  opacity: 1 !important;}

/* 卡片式面包屑 */
.breadcrumb-cards-223 {
  gap: 16px;
}

.crumb-card-223 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 2px solid rgba(16, 185, 129, 0.2);
  min-width: 120px;
  cursor: pointer;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.crumb-card-223:hover {
  background: rgba(16, 185, 129, 0.1);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.2);
}

.crumb-card-active-223 {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.3);

  opacity: 1 !important;}

.crumb-card-icon-223 {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;

  opacity: 1 !important;}

.crumb-card-text-223 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #e2e8f0;
  text-align: center;

  opacity: 1 !important;}

.crumb-card-active-223 .crumb-card-text-223 {
  color: #10b981;
  font-weight: 600;

  opacity: 1 !important;}

.crumb-arrow-223 {
  color: #64748b;
  font-size: 1.5rem;
  font-weight: 300;

  opacity: 1 !important;}

/* 进度条面包屑 */
.progress-breadcrumb-wrapper-223 {
  width: 100%;
  position: relative;

  opacity: 1 !important;}

.progress-line-223 {
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  opacity: 1 !important;}

.progress-fill-223 {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);

  opacity: 1 !important;}

.progress-crumbs-223 {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 16px;

  opacity: 1 !important;}

.progress-crumb-item-223 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 2;
}

.progress-crumb-circle-223 {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.progress-crumb-active-223 .progress-crumb-circle-223 {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: #fff;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);

  opacity: 1 !important;}

.progress-crumb-label-223 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;

  opacity: 1 !important;}

.progress-crumb-active-223 .progress-crumb-label-223 {
  color: #10b981;
  font-weight: 600;

  opacity: 1 !important;}

/* 圆形进度面包屑 */
.circle-crumbs-223 {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.circle-crumb-item-223 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.circle-progress-223 {
  width: 80px;
  height: 80px;
  transform: rotate(-90deg);

  opacity: 1 !important;}

.circle-bg-223 {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 3;

  opacity: 1 !important;}

.circle-fill-223 {
  fill: none;
  stroke: url(#gradient-223);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;

  opacity: 1 !important;}

.circle-fill-complete-223 {
  stroke: #10b981;
  filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.6));
}

.circle-crumb-text-223 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;

  opacity: 1 !important;}

.circle-crumb-active-223 .circle-crumb-text-223 {
  color: #10b981;
  font-weight: 600;

  opacity: 1 !important;}

/* 响应式 */
@media (max-width: 768px) {
  .section-title-223 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .breadcrumb-demo-223 {
    padding: 24px;
  
  opacity: 1 !important;}

  .breadcrumb-container-223 {
    flex-wrap: wrap;
  }

  .crumb-item-223 {
    padding: 10px 16px;
  
  opacity: 1 !important;}

  .circle-crumbs-223 {
    gap: 20px;
  }

  .circle-progress-223 {
    width: 60px;
    height: 60px;
  
  opacity: 1 !important;}

  .crumb-card-223 {
    min-width: 80px;
    padding: 16px 20px;
  
  opacity: 1 !important;}

  .crumb-card-icon-223 {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  
  opacity: 1 !important;}
}
</style>
