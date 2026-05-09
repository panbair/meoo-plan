<template>
  <section class="scroll-swipe-up-252">
    <div class="scroll-swipe-up-header-252">
      <h2 class="scroll-swipe-up-title-252">上滑揭示</h2>
      <p class="scroll-swipe-up-subtitle-252">向上滑动探索更多内容</p>
    </div>

    <!-- 交互说明 -->
    <div class="scroll-swipe-up-instructions-252">
      <div class="scroll-swipe-up-instruction-item-252">
        <div class="scroll-swipe-up-icon-wrapper-252">
          <svg class="scroll-swipe-up-icon-252" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 19V5M5 12l7-7 7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span>上滑手势</span>
      </div>
      <div class="scroll-swipe-up-instruction-item-252">
        <div class="scroll-swipe-up-icon-wrapper-252">
          <svg class="scroll-swipe-up-icon-252" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
            <path d="M12 8v8M8 12h8" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>揭示内容</span>
      </div>
      <div class="scroll-swipe-up-instruction-item-252">
        <div class="scroll-swipe-up-icon-wrapper-252">
          <svg class="scroll-swipe-up-icon-252" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke-width="2" stroke-linecap="round"/>
            <polyline points="16 6 12 2 8 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="2" x2="12" y2="15" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span>上传交互</span>
      </div>
    </div>

    <!-- 上滑容器 -->
    <div class="scroll-swipe-up-container-252">
      <!-- 滑动提示 -->
      <div class="scroll-swipe-up-hint-252" ref="swipeHint">
        <div class="scroll-swipe-up-hint-icon-252">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 19V5M5 12l7-7 7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="scroll-swipe-up-hint-text-252">向上滑动</div>
        <div class="scroll-swipe-up-hint-line-252"></div>
      </div>

      <!-- 遮罩层 -->
      <div class="scroll-swipe-up-mask-252" ref="swipeMask">
        <div class="scroll-swipe-up-mask-content-252">
          <div class="scroll-swipe-up-lock-icon-252">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="scroll-swipe-up-lock-text-252">滑动解锁</div>
          <div class="scroll-swipe-up-progress-252">
            <div class="scroll-swipe-up-progress-bar-252" ref="progressBar"></div>
          </div>
          <div class="scroll-swipe-up-percentage-252" ref="percentageText">0%</div>
        </div>
      </div>

      <!-- 揭示内容 -->
      <div class="scroll-swipe-up-reveal-content-252" ref="revealContent">
        <!-- 卡片1 -->
        <div class="scroll-swipe-up-card-252">
          <div class="scroll-swipe-up-card-header-252" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="scroll-swipe-up-card-icon-252">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>快速解锁</h3>
          </div>
          <div class="scroll-swipe-up-card-body-252">
            <h4>闪电般速度</h4>
            <p>瞬间解锁所有内容，无需等待。丝滑的动画体验带来极致享受。</p>
            <div class="scroll-swipe-up-card-stats-252">
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">0.3s</span>
                <span class="scroll-swipe-up-stat-label-252">响应时间</span>
              </div>
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">60fps</span>
                <span class="scroll-swipe-up-stat-label-252">帧率</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片2 -->
        <div class="scroll-swipe-up-card-252">
          <div class="scroll-swipe-up-card-header-252" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <div class="scroll-swipe-up-card-icon-252">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>安全可靠</h3>
          </div>
          <div class="scroll-swipe-up-card-body-252">
            <h4>保护你的内容</h4>
            <p>手势验证技术确保只有正确的操作才能解锁，防止意外触发。</p>
            <div class="scroll-swipe-up-card-stats-252">
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">AES-256</span>
                <span class="scroll-swipe-up-stat-label-252">加密</span>
              </div>
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">99.9%</span>
                <span class="scroll-swipe-up-stat-label-252">准确率</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片3 -->
        <div class="scroll-swipe-up-card-252">
          <div class="scroll-swipe-up-card-header-252" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <div class="scroll-swipe-up-card-icon-252">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="2"/>
                <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>智能感知</h3>
          </div>
          <div class="scroll-swipe-up-card-body-252">
            <h4>自适应手势</h4>
            <p>自动识别你的滑动速度和力度，提供个性化的解锁体验。</p>
            <div class="scroll-swipe-up-card-stats-252">
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">AI</span>
                <span class="scroll-swipe-up-stat-label-252">智能</span>
              </div>
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">自适应</span>
                <span class="scroll-swipe-up-stat-label-252">优化</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片4 -->
        <div class="scroll-swipe-up-card-252">
          <div class="scroll-swipe-up-card-header-252" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
            <div class="scroll-swipe-up-card-icon-252">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>多层体验</h3>
          </div>
          <div class="scroll-swipe-up-card-body-252">
            <h4>渐进式揭示</h4>
            <p>随着滑动深入，内容逐层展开，创造流畅的视觉流。</p>
            <div class="scroll-swipe-up-card-stats-252">
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">4</span>
                <span class="scroll-swipe-up-stat-label-252">层级</span>
              </div>
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">流畅</span>
                <span class="scroll-swipe-up-stat-label-252">过渡</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片5 -->
        <div class="scroll-swipe-up-card-252">
          <div class="scroll-swipe-up-card-header-252" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
            <div class="scroll-swipe-up-card-icon-252">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>视觉盛宴</h3>
          </div>
          <div class="scroll-swipe-up-card-body-252">
            <h4>精美动效</h4>
            <p>精心设计的动画效果，让每一次滑动都成为视觉享受。</p>
            <div class="scroll-swipe-up-card-stats-252">
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">60+</span>
                <span class="scroll-swipe-up-stat-label-252">动效</span>
              </div>
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">HD</span>
                <span class="scroll-swipe-up-stat-label-252">品质</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片6 -->
        <div class="scroll-swipe-up-card-252">
          <div class="scroll-swipe-up-card-header-252" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
            <div class="scroll-swipe-up-card-icon-252">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="22.08" x2="12" y2="12" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3>跨平台</h3>
          </div>
          <div class="scroll-swipe-up-card-body-252">
            <h4>全设备支持</h4>
            <p>完美支持桌面和移动设备，统一的手势体验。</p>
            <div class="scroll-swipe-up-card-stats-252">
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">iOS</span>
                <span class="scroll-swipe-up-stat-label-252">Android</span>
              </div>
              <div class="scroll-swipe-up-stat-252">
                <span class="scroll-swipe-up-stat-value-252">Web</span>
                <span class="scroll-swipe-up-stat-label-252">全平台</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="scroll-swipe-up-footer-252">
      <button class="scroll-swipe-up-reset-btn-252" @click="resetSwipe">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 3v5h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        重置滑动
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const swipeHint = ref(null)
const swipeMask = ref(null)
const progressBar = ref(null)
const percentageText = ref(null)
const revealContent = ref(null)

let ctx = null
let isSwiped = false
let currentSwipeProgress = 0

const initSwipeUp = () => {
  const sectionEl = document.querySelector('.scroll-swipe-up-252')
  if (!sectionEl) return

  ctx = gsap.context(() => {
    // 标题入场动画
    const titleEl = document.querySelector('.scroll-swipe-up-title-252')
    if (titleEl) {
      gsap.from(titleEl, {
        y: 200,
        opacity: 0,
        scale: 0.5,
        rotationX: -60,
        duration: 1.8,
        ease: 'elastic.out(1, 0.8)',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 副标题入场动画
    const subtitleEl = document.querySelector('.scroll-swipe-up-subtitle-252')
    if (subtitleEl) {
      gsap.from(subtitleEl, {
        y: 150,
        opacity: 0,
        scale: 0.6,
        rotationY: 45,
        duration: 1.5,
        ease: 'elastic.out(1, 0.7)',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 88%',
          end: 'top 65%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 交互说明入场动画
    const instructionItems = gsap.utils.toArray('.scroll-swipe-up-instruction-item-252')
    if (instructionItems.length > 0) {
      gsap.from(instructionItems, {
        y: 150,
        opacity: 0,
        scale: 0.6,
        rotation: -30,
        duration: 1.2,
        ease: 'back.out(2)',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.scroll-swipe-up-instructions-252',
          start: 'top 90%',
          end: 'bottom 80%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 容器入场动画
    const containerEl = document.querySelector('.scroll-swipe-up-container-252')
    if (containerEl) {
      gsap.from(containerEl, {
        y: 300,
        opacity: 0,
        scale: 0.7,
        rotationX: 20,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1.5,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 卡片入场动画
    const cards = gsap.utils.toArray('.scroll-swipe-up-card-252')
    if (cards.length > 0) {
      gsap.from(cards, {
        y: 200,
        x: -100,
        opacity: 0,
        scale: 0.5,
        rotationY: 30,
        duration: 1.2,
        ease: 'elastic.out(1, 0.6)',
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1.2,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 底部重置按钮入场动画
    const footerEl = document.querySelector('.scroll-swipe-up-footer-252')
    if (footerEl) {
      gsap.from(footerEl, {
        y: 100,
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: footerEl,
          start: 'top 90%',
          end: 'bottom 70%',
          scrub: 1,
          toggleActions: 'play none none reverse'
        }
      })
    }

    // 上滑提示动画
    if (swipeHint.value) {
      gsap.to(swipeHint.value, {
        y: -20,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    }

    // 上滑交互
    let startY = 0
    let isDragging = false
    const containerHeight = containerEl?.offsetHeight || 500
    const threshold = containerHeight * 0.6

    const handleTouchStart = (e) => {
      if (isSwiped) return
      isDragging = true
      startY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      if (!isDragging || isSwiped) return
      e.preventDefault()

      const currentY = e.touches[0].clientY
      const deltaY = startY - currentY
      const progress = Math.min(Math.max(deltaY / threshold, 0), 1)

      currentSwipeProgress = progress

      // 更新进度条
      if (progressBar.value) {
        gsap.set(progressBar.value, { width: `${progress * 100}%` })
      }

      // 更新百分比
      if (percentageText.value) {
        percentageText.value.textContent = `${Math.round(progress * 100)}%`
      }

      // 移动遮罩层
      if (swipeMask.value) {
        gsap.set(swipeMask.value, {
          y: -progress * 400,
          opacity: 1 - progress,
          scale: 1 - progress * 0.2
        })
      }

      // 移动揭示内容
      if (revealContent.value) {
        gsap.set(revealContent.value, {
          y: (1 - progress) * 300,
          opacity: progress
        })
      }
    }

    const handleTouchEnd = () => {
      if (!isDragging) return
      isDragging = false

      if (currentSwipeProgress >= 0.7) {
        // 完成滑动
        completeSwipe()
      } else {
        // 回弹
        springBack()
      }
    }

    // 鼠标事件
    const handleMouseDown = (e) => {
      if (isSwiped) return
      isDragging = true
      startY = e.clientY
    }

    const handleMouseMove = (e) => {
      if (!isDragging || isSwiped) return

      const deltaY = startY - e.clientY
      const progress = Math.min(Math.max(deltaY / threshold, 0), 1)

      currentSwipeProgress = progress

      // 更新进度条
      if (progressBar.value) {
        gsap.set(progressBar.value, { width: `${progress * 100}%` })
      }

      // 更新百分比
      if (percentageText.value) {
        percentageText.value.textContent = `${Math.round(progress * 100)}%`
      }

      // 移动遮罩层
      if (swipeMask.value) {
        gsap.set(swipeMask.value, {
          y: -progress * 400,
          opacity: 1 - progress,
          scale: 1 - progress * 0.2
        })
      }

      // 移动揭示内容
      if (revealContent.value) {
        gsap.set(revealContent.value, {
          y: (1 - progress) * 300,
          opacity: progress
        })
      }
    }

    const handleMouseUp = () => {
      if (!isDragging) return
      isDragging = false

      if (currentSwipeProgress >= 0.7) {
        completeSwipe()
      } else {
        springBack()
      }
    }

    const completeSwipe = () => {
      isSwiped = true
      currentSwipeProgress = 1

      gsap.to(swipeMask.value, {
        y: -400,
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: 'power3.out'
      })

      gsap.to(revealContent.value, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      })

      gsap.to(swipeHint.value, {
        opacity: 0,
        duration: 0.3
      })
    }

    const springBack = () => {
      currentSwipeProgress = 0

      gsap.to([swipeMask.value, progressBar.value], {
        y: 0,
        width: '0%',
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      })

      gsap.to(revealContent.value, {
        y: 300,
        opacity: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      })

      if (percentageText.value) {
        percentageText.value.textContent = '0%'
      }
    }

    // 绑定事件
    if (containerEl) {
      containerEl.addEventListener('touchstart', handleTouchStart, { passive: true })
      containerEl.addEventListener('touchmove', handleTouchMove, { passive: false })
      containerEl.addEventListener('touchend', handleTouchEnd, { passive: true })
      containerEl.addEventListener('mousedown', handleMouseDown)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    // 卡片悬停效果
    const hoverCards = gsap.utils.toArray('.scroll-swipe-up-card-252')
    hoverCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        if (!isSwiped) return
        gsap.to(card, {
          scale: 1.05,
          y: -10,
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          y: 0,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          duration: 0.4,
          ease: 'power2.out'
        })
      })
    })

    // 交互说明项悬停效果
    const hoverInstructionItems = gsap.utils.toArray('.scroll-swipe-up-instruction-item-252')
    hoverInstructionItems.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, {
          y: -5,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(item.querySelector('.scroll-swipe-up-icon-wrapper-252'), {
          scale: 1.2,
          rotation: 360,
          duration: 0.5,
          ease: 'back.out(1.7)'
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(item, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(item.querySelector('.scroll-swipe-up-icon-wrapper-252'), {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

  }, sectionEl)
}

const resetSwipe = () => {
  isSwiped = false
  currentSwipeProgress = 0

  gsap.to(swipeMask.value, {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)'
  })

  gsap.to(revealContent.value, {
    y: 300,
    opacity: 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)'
  })

  if (progressBar.value) {
    gsap.set(progressBar.value, { width: '0%' })
  }

  if (percentageText.value) {
    percentageText.value.textContent = '0%'
  }

  if (swipeHint.value) {
    gsap.to(swipeHint.value, {
      opacity: 1,
      duration: 0.3
    })
  }
}

onMounted(() => {
  setTimeout(initSwipeUp, 300)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.scroll-swipe-up-252 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  position: relative;

  opacity: 1 !important;}

.scroll-swipe-up-252::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 60%),
              radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

/* 标题区域 */
.scroll-swipe-up-header-252 {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.scroll-swipe-up-title-252 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  opacity: 1 !important;}

.scroll-swipe-up-subtitle-252 {
  font-size: 1.2rem;
  color: #94a3b8;
  transform-style: preserve-3d;
  will-change: transform, opacity;

  opacity: 1 !important;}

/* 交互说明 */
.scroll-swipe-up-instructions-252 {
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.scroll-swipe-up-instruction-item-252 {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  color: #e2e8f0;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.scroll-swipe-up-icon-wrapper-252 {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;

  opacity: 1 !important;}

.scroll-swipe-up-icon-252 {
  width: 24px;
  height: 24px;

  opacity: 1 !important;}

/* 上滑容器 */
.scroll-swipe-up-container-252 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  height: 600px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  opacity: 1 !important;}

/* 滑动提示 */
.scroll-swipe-up-hint-252 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 5;
  pointer-events: none;

  opacity: 1 !important;}

.scroll-swipe-up-hint-icon-252 {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  color: #a78bfa;
  animation: swipeUp 2s infinite;

  opacity: 1 !important;}

.scroll-swipe-up-hint-icon-252 svg {
  width: 100%;
  height: 100%;
}

.scroll-swipe-up-hint-text-252 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 20px;

  opacity: 1 !important;}

.scroll-swipe-up-hint-line-252 {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  margin: 0 auto;
  animation: pulseLine 2s infinite;

  opacity: 1 !important;}

@keyframes swipeUp {
  0%, 100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px);
    opacity: 0.5;
  }
}

@keyframes pulseLine {
  0%, 100% {
    opacity: 0.5;
    transform: scaleX(0.8);
  }
  50% {
    opacity: 1;
    transform: scaleX(1);
  }
}

/* 遮罩层 */
.scroll-swipe-up-mask-252 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  pointer-events: none;
}

.scroll-swipe-up-mask-content-252 {
  text-align: center;

  opacity: 1 !important;}

.scroll-swipe-up-lock-icon-252 {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  color: #94a3b8;

  opacity: 1 !important;}

.scroll-swipe-up-lock-icon-252 svg {
  width: 100%;
  height: 100%;
}

.scroll-swipe-up-lock-text-252 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 30px;

  opacity: 1 !important;}

.scroll-swipe-up-progress-252 {
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 0 auto 20px;
  overflow: hidden;

  opacity: 1 !important;}

.scroll-swipe-up-progress-bar-252 {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.1s ease;

  opacity: 1 !important;}

.scroll-swipe-up-percentage-252 {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

/* 揭示内容 */
.scroll-swipe-up-reveal-content-252 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  overflow-y: auto;
  opacity: 0;
  pointer-events: none;
}

.scroll-swipe-up-reveal-content-252::-webkit-scrollbar {
  width: 6px;
}

.scroll-swipe-up-reveal-content-252::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.scroll-swipe-up-reveal-content-252::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.5);
  border-radius: 3px;
}

.scroll-swipe-up-card-252 {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;

  opacity: 1 !important;}

.scroll-swipe-up-card-header-252 {
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;

  opacity: 1 !important;}

.scroll-swipe-up-card-icon-252 {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;

  opacity: 1 !important;}

.scroll-swipe-up-card-icon-252 svg {
  width: 28px;
  height: 28px;
}

.scroll-swipe-up-card-header-252 h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.scroll-swipe-up-card-body-252 {
  padding: 24px;

  opacity: 1 !important;}

.scroll-swipe-up-card-body-252 h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.scroll-swipe-up-card-body-252 p {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 20px;
}

.scroll-swipe-up-card-stats-252 {
  display: flex;
  gap: 20px;
}

.scroll-swipe-up-stat-252 {
  text-align: center;

  opacity: 1 !important;}

.scroll-swipe-up-stat-value-252 {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: #a78bfa;
  margin-bottom: 4px;

  opacity: 1 !important;}

.scroll-swipe-up-stat-label-252 {
  font-size: 0.85rem;
  color: #64748b;

  opacity: 1 !important;}

/* 底部重置按钮 */
.scroll-swipe-up-footer-252 {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.scroll-swipe-up-reset-btn-252 {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.scroll-swipe-up-reset-btn-252 svg {
  width: 18px;
  height: 18px;
}

.scroll-swipe-up-reset-btn-252:hover {
  background: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .scroll-swipe-up-reveal-content-252 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .scroll-swipe-up-252 {
    padding: 40px 20px;
  
  opacity: 1 !important;}

  .scroll-swipe-up-instructions-252 {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .scroll-swipe-up-container-252 {
    height: 500px;
  
  opacity: 1 !important;}

  .scroll-swipe-up-reveal-content-252 {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 20px;
  
  opacity: 1 !important;}

  .scroll-swipe-up-lock-icon-252 {
    width: 60px;
    height: 60px;
  
  opacity: 1 !important;}

  .scroll-swipe-up-lock-text-252 {
    font-size: 1.2rem;
  
  opacity: 1 !important;}

  .scroll-swipe-up-progress-252 {
    width: 200px;
  
  opacity: 1 !important;}

  .scroll-swipe-up-percentage-252 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
