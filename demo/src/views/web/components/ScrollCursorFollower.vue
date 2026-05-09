<template>
  <div class="scroll-cursor-follower-wrapper-217">
    <!-- 自定义光标跟随元素 -->
    <div ref="cursorFollower" class="scf-cursor-follower-217">
      <div class="scf-cursor-dot-217"></div>
      <div class="scf-cursor-ring-217"></div>
      <div class="scf-cursor-label-217">Hover Me</div>
    </div>

    <!-- 演示内容区域 -->
    <div class="scf-content-217">
      <section class="scf-section-217">
        <h2 class="scf-title-217">光标跟随效果</h2>
        <p class="scf-description-217">
          移动鼠标，观察光标跟随动画。自定义光标会平滑地跟随您的鼠标移动。
        </p>

        <!-- 交互元素 -->
        <div class="scf-interactive-items-217">
          <button class="scf-btn-217" @mouseenter="onHover" @mouseleave="onLeave">
            按钮交互
          </button>
          <div class="scf-card-217" @mouseenter="onHover" @mouseleave="onLeave">
            <div class="scf-card-icon-217">🎯</div>
            <h3 class="scf-card-title-217">卡片悬停</h3>
            <p class="scf-card-desc-217">悬停时改变光标状态</p>
          </div>
          <a href="#" class="scf-link-217" @mouseenter="onHover" @mouseleave="onLeave">
            链接效果
          </a>
        </div>

        <!-- 图像网格 -->
        <div class="scf-grid-217">
          <div
            v-for="(item, index) in gridItems"
            :key="index"
            class="scf-grid-item-217"
            @mouseenter="onHover"
            @mouseleave="onLeave"
          >
            <div class="scf-grid-icon-217">{{ item.icon }}</div>
            <span class="scf-grid-text-217">{{ item.text }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// 自定义光标元素引用
const cursorFollower = ref<HTMLElement | null>(null)
const cursorDot = ref<HTMLElement | null>(null)
const cursorRing = ref<HTMLElement | null>(null)
const cursorLabel = ref<HTMLElement | null>(null)

// 鼠标位置
let mouseX = 0
let mouseY = 0
let cursorX = 0
let cursorY = 0

// 网格项数据
const gridItems = [
  { icon: '🚀', text: '速度' },
  { icon: '💡', text: '创意' },
  { icon: '🎨', text: '设计' },
  { icon: '⚡', text: '性能' },
  { icon: '🔥', text: '激情' },
  { icon: '✨', text: '品质' }
]

// 鼠标移动处理
const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

// 悬停状态处理
const onHover = () => {
  if (!cursorFollower.value) return

  // 放大光标环
  gsap.to(cursorFollower.value, {
    scale: 1.5,
    duration: 0.3,
    ease: 'power2.out'
  })

  // 改变标签文本
  if (cursorLabel.value) {
    cursorLabel.value.textContent = 'Click!'
    gsap.to(cursorLabel.value, {
      opacity: 1,
      y: 0,
      duration: 0.3
    })
  }

  // 点动画
  if (cursorDot.value) {
    gsap.to(cursorDot.value, {
      scale: 2,
      duration: 0.3,
      ease: 'back.out(1.7)'
    })
  }
}

const onLeave = () => {
  if (!cursorFollower.value) return

  // 恢复光标环大小
  gsap.to(cursorFollower.value, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  })

  // 恢复标签
  if (cursorLabel.value) {
    cursorLabel.value.textContent = 'Hover Me'
    gsap.to(cursorLabel.value, {
      opacity: 0,
      y: 10,
      duration: 0.3
    })
  }

  // 点恢复
  if (cursorDot.value) {
    gsap.to(cursorDot.value, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
}

// 动画循环
const animate = () => {
  if (cursorFollower.value) {
    // 平滑跟随
    cursorX += (mouseX - cursorX) * 0.15
    cursorY += (mouseY - cursorY) * 0.15

    gsap.to(cursorFollower.value, {
      x: cursorX,
      y: cursorY,
      duration: 0.1
    })
  }

  requestAnimationFrame(animate)
}

onMounted(() => {
  // 监听鼠标移动
  document.addEventListener('mousemove', handleMouseMove)

  // 初始化光标位置
  mouseX = window.innerWidth / 2
  mouseY = window.innerHeight / 2
  cursorX = mouseX
  cursorY = mouseY

  // 开始动画循环
  animate()

  // 初始动画
  gsap.from(cursorFollower.value, {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)'
  })

  // 添加鼠标样式
  document.body.style.cursor = 'none'
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.body.style.cursor = 'auto'
})
</script>

<style scoped>
.scroll-cursor-follower-wrapper-217 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

/* 自定义光标跟随器 */
.scf-cursor-follower-217 {
  position: fixed;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
}

.scf-cursor-dot-217 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.scf-cursor-ring-217 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: border-color 0.3s ease;
}

.scf-cursor-follower-217:hover .scf-cursor-ring-217 {
  border-color: #a78bfa;
}

.scf-cursor-label-217 {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s ease;
}

/* 内容区域 */
.scf-content-217 {
  position: relative;
  z-index: 1;
  padding: 80px 20px;
}

.scf-section-217 {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.scf-title-217 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: scfTitleFadeIn 1s ease-out;
}

.scf-description-217 {
  font-size: 1.2rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 60px;
  line-height: 1.8;
  animation: scfDescFadeIn 1s ease-out 0.3s both;
}

/* 交互元素 */
.scf-interactive-items-217 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.scf-btn-217 {
  position: relative;
  padding: 16px 40px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.scf-btn-217::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.scf-btn-217:hover::before {
  left: 100%;
}

.scf-btn-217:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(167, 139, 250, 0.3);
}

.scf-card-217 {
  position: relative;
  padding: 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  min-width: 200px;
  transition: all 0.3s ease;
}

.scf-card-217:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(167, 139, 250, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.scf-card-icon-217 {
  font-size: 3rem;
  margin-bottom: 16px;
}

.scf-card-title-217 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
}

.scf-card-desc-217 {
  font-size: 0.9rem;
  color: #94a3b8;
}

.scf-link-217 {
  font-size: 1.1rem;
  color: #60a5fa;
  text-decoration: none;
  position: relative;
  padding: 8px 16px;
  transition: color 0.3s ease;
}

.scf-link-217::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #a78bfa, #60a5fa);
  transition: width 0.3s ease;
}

.scf-link-217:hover {
  color: #a78bfa;
}

.scf-link-217:hover::after {
  width: 100%;
}

/* 网格 */
.scf-grid-217 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.scf-grid-item-217 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scf-grid-item-217:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(167, 139, 250, 0.3);
  transform: translateY(-3px);
}

.scf-grid-icon-217 {
  font-size: 2.5rem;
}

.scf-grid-text-217 {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
}

/* 动画 */
@keyframes scfTitleFadeIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scfDescFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .scf-title-217 {
    font-size: 2rem;
  }

  .scf-interactive-items-217 {
    flex-direction: column;
  }

  .scf-grid-217 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
