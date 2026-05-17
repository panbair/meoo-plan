<template>
  <div class="scroll-magnetic-wrapper-218">
    <!-- 磁性按钮区域 -->
    <section class="sm-section-218">
      <h2 class="sm-title-218">磁性吸附效果</h2>
      <p class="sm-description-218">
        将鼠标移到按钮上，体验磁性吸附效果。元素会跟随鼠标移动，但带有弹性回弹。
      </p>

      <!-- 磁性按钮组 -->
      <div class="sm-buttons-218">
        <button
          ref="magneticBtn1"
          class="sm-magnetic-btn-218 sm-primary-218"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticBtn1)"
        >
          <span class="sm-btn-text-218">主要按钮</span>
          <span class="sm-btn-icon-218">→</span>
        </button>

        <button
          ref="magneticBtn2"
          class="sm-magnetic-btn-218 sm-secondary-218"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticBtn2)"
        >
          <span class="sm-btn-text-218">次要按钮</span>
          <span class="sm-btn-icon-218">★</span>
        </button>

        <button
          ref="magneticBtn3"
          class="sm-magnetic-btn-218 sm-outline-218"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticBtn3)"
        >
          <span class="sm-btn-text-218">轮廓按钮</span>
          <span class="sm-btn-icon-218">●</span>
        </button>
      </div>

      <!-- 磁性卡片 -->
      <div class="sm-cards-218">
        <div
          v-for="(card, index) in cards"
          :key="index"
          :ref="el => { if (el) magneticCards[index] = el }"
          class="sm-card-218"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticCards[index])"
        >
          <div class="sm-card-icon-218">{{ card.icon }}</div>
          <h3 class="sm-card-title-218">{{ card.title }}</h3>
          <p class="sm-card-desc-218">{{ card.description }}</p>
        </div>
      </div>

      <!-- 磁性圆形元素 -->
      <div class="sm-circles-218">
        <div
          v-for="(circle, index) in circles"
          :key="index"
          :ref="el => { if (el) magneticCircles[index] = el }"
          class="sm-circle-218"
          :style="{ background: circle.color }"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticCircles[index])"
        >
          <span class="sm-circle-text-218">{{ circle.text }}</span>
        </div>
      </div>

      <!-- 磁性图片 -->
      <div class="sm-images-218">
        <div
          ref="magneticImage1"
          class="sm-image-218"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticImage1)"
        >
          <div class="sm-image-content-218">
            <div class="sm-image-placeholder-218 sm-purple-218"></div>
            <div class="sm-image-overlay-218">
              <h4 class="sm-image-title-218">磁性图片</h4>
              <p class="sm-image-text-218">鼠标移动观察效果</p>
            </div>
          </div>
        </div>

        <div
          ref="magneticImage2"
          class="sm-image-218"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticImage2)"
        >
          <div class="sm-image-content-218">
            <div class="sm-image-placeholder-218 sm-blue-218"></div>
            <div class="sm-image-overlay-218">
              <h4 class="sm-image-title-218">弹性跟随</h4>
              <p class="sm-image-text-218">平滑的过渡动画</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 磁性链接 -->
      <div class="sm-links-218">
        <a
          ref="magneticLink1"
          class="sm-link-218"
          href="#"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticLink1)"
        >
          了解更多
        </a>
        <a
          ref="magneticLink2"
          class="sm-link-218"
          href="#"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticLink2)"
        >
          查看案例
        </a>
        <a
          ref="magneticLink3"
          class="sm-link-218"
          href="#"
          @mouseenter="onMagneticEnter"
          @mouseleave="onMagneticLeave"
          @mousemove="onMagneticMove($event, magneticLink3)"
        >
          联系我们
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// 元素引用
const magneticBtn1 = ref<HTMLElement | null>(null)
const magneticBtn2 = ref<HTMLElement | null>(null)
const magneticBtn3 = ref<HTMLElement | null>(null)
const magneticCards = ref<(HTMLElement | null)[]>([])
const magneticCircles = ref<(HTMLElement | null)[]>([])
const magneticImage1 = ref<HTMLElement | null>(null)
const magneticImage2 = ref<HTMLElement | null>(null)
const magneticLink1 = ref<HTMLElement | null>(null)
const magneticLink2 = ref<HTMLElement | null>(null)
const magneticLink3 = ref<HTMLElement | null>(null)

// 卡片数据
const cards = [
  { icon: '🎯', title: '精确控制', description: '精准的磁性吸附效果' },
  { icon: '⚡', title: '快速响应', description: '即时的鼠标交互反馈' },
  { icon: '🎨', title: '流畅动画', description: '丝滑的过渡动画体验' },
  { icon: '✨', title: '视觉吸引', description: '吸引眼球的交互设计' }
]

// 圆形数据
const circles = [
  { color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: 'A' },
  { color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: 'B' },
  { color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: 'C' },
  { color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: 'D' }
]

// 磁性效果强度
const magneticStrength = 0.3

// 进入磁性区域
const onMagneticEnter = () => {
  gsap.to('.sm-magnetic-btn-218', {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out'
  })
}

// 离开磁性区域
const onMagneticLeave = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  gsap.to(target, {
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)'
  })
}

// 磁性移动效果
const onMagneticMove = (e: MouseEvent, element: any) => {
  if (!element) return

  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const mouseX = e.clientX
  const mouseY = e.clientY

  const deltaX = (mouseX - centerX) * magneticStrength
  const deltaY = (mouseY - centerY) * magneticStrength

  gsap.to(element, {
    x: deltaX,
    y: deltaY,
    duration: 0.3,
    ease: 'power2.out'
  })
}

onMounted(() => {
  // 入场动画
  gsap.from('.sm-title-218', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from('.sm-description-218', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  })

  gsap.from('.sm-magnetic-btn-218', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    delay: 0.4,
    ease: 'power3.out'
  })

  gsap.from('.sm-card-218', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.6,
    ease: 'power3.out'
  })

  gsap.from('.sm-circle-218', {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.8,
    ease: 'back.out(1.7)'
  })

  gsap.from('.sm-image-218', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    delay: 1,
    ease: 'power3.out'
  })

  gsap.from('.sm-link-218', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    delay: 1.2,
    ease: 'power3.out'
  })
})
</script>

<style scoped>
.scroll-magnetic-wrapper-218 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

.sm-section-218 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
}

.sm-title-218 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sm-description-218 {
  font-size: 1.2rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 60px;
  line-height: 1.8;
}

/* 磁性按钮 */
.sm-buttons-218 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-bottom: 80px;
  flex-wrap: wrap;
}

.sm-magnetic-btn-218 {
  position: relative;
  padding: 18px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sm-magnetic-btn-218::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.sm-magnetic-btn-218:hover::before {
  left: 100%;
}

.sm-primary-218 {
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
}

.sm-primary-218:hover {
  box-shadow: 0 10px 30px rgba(167, 139, 250, 0.4);
}

.sm-secondary-218 {
  background: linear-gradient(135deg, #f472b6, #ec4899);
}

.sm-secondary-218:hover {
  box-shadow: 0 10px 30px rgba(244, 114, 182, 0.4);
}

.sm-outline-218 {
  background: transparent;
  border: 2px solid #a78bfa;
  color: #a78bfa;
}

.sm-outline-218:hover {
  background: rgba(167, 139, 250, 0.1);
  box-shadow: 0 10px 30px rgba(167, 139, 250, 0.3);
}

.sm-btn-icon-218 {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.sm-magnetic-btn-218:hover .sm-btn-icon-218 {
  transform: translateX(5px);
}

/* 磁性卡片 */
.sm-cards-218 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
}

.sm-card-218 {
  position: relative;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.sm-card-218:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(167, 139, 250, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.sm-card-icon-218 {
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.sm-card-title-218 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.sm-card-desc-218 {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.6;
}

/* 磁性圆形 */
.sm-circles-218 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 80px;
  flex-wrap: wrap;
}

.sm-circle-218 {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.sm-circle-218:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.sm-circle-text-218 {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
}

/* 磁性图片 */
.sm-images-218 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 80px;
}

.sm-image-218 {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
}

.sm-image-218:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.sm-image-content-218 {
  position: relative;
  width: 100%;
  height: 250px;
}

.sm-image-placeholder-218 {
  width: 100%;
  height: 100%;
}

.sm-purple-218 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.sm-blue-218 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.sm-image-overlay-218 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sm-image-218:hover .sm-image-overlay-218 {
  opacity: 1;
}

.sm-image-title-218 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.sm-image-text-218 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 磁性链接 */
.sm-links-218 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.sm-link-218 {
  position: relative;
  font-size: 1.2rem;
  font-weight: 600;
  color: #60a5fa;
  text-decoration: none;
  padding: 10px 20px;
  transition: color 0.3s ease;
}

.sm-link-218::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #a78bfa, #60a5fa);
  transition: width 0.3s ease;
}

.sm-link-218:hover {
  color: #a78bfa;
}

.sm-link-218:hover::after {
  width: 100%;
}

/* 响应式 */
@media (max-width: 768px) {
  .sm-title-218 {
    font-size: 2rem;
  }

  .sm-buttons-218 {
    flex-direction: column;
  }

  .sm-cards-218 {
    grid-template-columns: 1fr;
  }

  .sm-images-218 {
    grid-template-columns: 1fr;
  }

  .sm-links-218 {
    flex-direction: column;
  }
}
</style>
