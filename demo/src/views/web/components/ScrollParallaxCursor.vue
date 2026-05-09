<template>
  <div class="scroll-parallax-cursor-wrapper-220">
    <!-- 视差光标层 -->
    <div ref="cursorLayer" class="spc-cursor-layer-220">
      <!-- 第一层：中心点 -->
      <div ref="layer1" class="spc-layer-220 spc-layer-1-220">
        <div class="spc-dot-220"></div>
      </div>

      <!-- 第二层：内环 -->
      <div ref="layer2" class="spc-layer-220 spc-layer-2-220">
        <div class="spc-ring-220"></div>
      </div>

      <!-- 第三层：中环 -->
      <div ref="layer3" class="spc-layer-220 spc-layer-3-220">
        <div class="spc-ring-220 spc-ring-dashed-220"></div>
      </div>

      <!-- 第四层：外环 -->
      <div ref="layer4" class="spc-layer-220 spc-layer-4-220">
        <div class="spc-ring-220 spc-ring-pulse-220"></div>
      </div>

      <!-- 第五层：装饰点 -->
      <div ref="layer5" class="spc-layer-220 spc-layer-5-220">
        <div class="spc-decorator-220">
          <div class="spc-decor-dot-220" style="--angle: 0deg;"></div>
          <div class="spc-decor-dot-220" style="--angle: 72deg;"></div>
          <div class="spc-decor-dot-220" style="--angle: 144deg;"></div>
          <div class="spc-decor-dot-220" style="--angle: 216deg;"></div>
          <div class="spc-decor-dot-220" style="--angle: 288deg;"></div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <section class="spc-content-220">
      <h2 class="spc-title-220">视差光标效果</h2>
      <p class="spc-description-220">
        移动鼠标，观察多层元素以不同速度跟随光标移动，创造出3D深度感。
      </p>

      <!-- 交互卡片网格 -->
      <div class="spc-cards-220">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="spc-card-220"
          :class="`spc-card-${index + 1}-220`"
          @mouseenter="onCardHover(index)"
          @mouseleave="onCardLeave"
        >
          <div class="spc-card-icon-220">{{ card.icon }}</div>
          <h3 class="spc-card-title-220">{{ card.title }}</h3>
          <p class="spc-card-desc-220">{{ card.description }}</p>
          <div class="spc-card-layer-220">
            <div class="spc-card-depth-1-220"></div>
            <div class="spc-card-depth-2-220"></div>
            <div class="spc-card-depth-3-220"></div>
          </div>
        </div>
      </div>

      <!-- 演示区域 -->
      <div class="spc-demo-220">
        <div ref="demoContainer" class="spc-demo-container-220">
          <!-- 背景圆圈 -->
          <div ref="bgCircle1" class="spc-bg-circle-220 spc-bg-1-220"></div>
          <div ref="bgCircle2" class="spc-bg-circle-220 spc-bg-2-220"></div>
          <div ref="bgCircle3" class="spc-bg-circle-220 spc-bg-3-220"></div>

          <!-- 中心内容 -->
          <div class="spc-demo-content-220">
            <div class="spc-demo-icon-220">🎯</div>
            <h3 class="spc-demo-title-220">视差深度</h3>
            <p class="spc-demo-text-220">鼠标移动体验多层视差效果</p>
          </div>
        </div>
      </div>

      <!-- 图像视差 -->
      <div class="spc-images-220">
        <div
          v-for="(image, index) in images"
          :key="index"
          ref="imageLayers"
          class="spc-image-wrapper-220"
          :style="{ '--delay': `${index * 0.1}s` }"
        >
          <div class="spc-image-layer-220" :class="`spc-img-${index + 1}-220`">
            <div class="spc-image-placeholder-220" :style="{ background: image.gradient }">
              <div class="spc-image-content-220">
                <h4 class="spc-image-title-220">{{ image.title }}</h4>
                <p class="spc-image-desc-220">深度级别 {{ index + 1 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 粒子背景 -->
      <div ref="particleContainer" class="spc-particles-220">
        <div
          v-for="i in 20"
          :key="i"
          ref="particles"
          class="spc-particle-220"
          :style="{ 
            '--x': `${Math.random() * 100}%`,
            '--y': `${Math.random() * 100}%`,
            '--size': `${Math.random() * 4 + 2}px`,
            '--speed': `${Math.random() * 0.5 + 0.2}`
          }"
        ></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

// 元素引用
const cursorLayer = ref<HTMLElement | null>(null)
const layer1 = ref<HTMLElement | null>(null)
const layer2 = ref<HTMLElement | null>(null)
const layer3 = ref<HTMLElement | null>(null)
const layer4 = ref<HTMLElement | null>(null)
const layer5 = ref<HTMLElement | null>(null)

const demoContainer = ref<HTMLElement | null>(null)
const bgCircle1 = ref<HTMLElement | null>(null)
const bgCircle2 = ref<HTMLElement | null>(null)
const bgCircle3 = ref<HTMLElement | null>(null)

const imageLayers = ref<(HTMLElement | null)[]>([])
const particleContainer = ref<HTMLElement | null>(null)
const particles = ref<(HTMLElement | null)[]>([])

// 视差速度配置
const parallaxSpeeds = {
  layer1: 0.05,
  layer2: 0.1,
  layer3: 0.15,
  layer4: 0.2,
  layer5: 0.25
}

// 卡片数据
const cards = [
  { icon: '🚀', title: '速度层级', description: '每层元素以不同速度移动' },
  { icon: '🎨', title: '视觉深度', description: '创造3D空间感' },
  { icon: '✨', title: '流畅动画', description: '丝滑的过渡效果' },
  { icon: '🔮', title: '交互体验', description: '沉浸式视觉反馈' }
]

// 图像数据
const images = [
  { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', title: '紫韵' },
  { gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', title: '粉彩' },
  { gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', title: '蓝调' }
]

// 鼠标位置
let mouseX = 0
let mouseY = 0

// 卡片悬停
const onCardHover = (index: number) => {
  gsap.to(`.spc-card-${index + 1}-220`, {
    scale: 1.05,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    duration: 0.3
  })

  gsap.to(`.spc-card-${index + 1}-220 .spc-card-icon-220`, {
    scale: 1.2,
    rotation: 10,
    duration: 0.3
  })
}

const onCardLeave = () => {
  gsap.to('.spc-card-220', {
    scale: 1,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    duration: 0.3
  })

  gsap.to('.spc-card-220 .spc-card-icon-220', {
    scale: 1,
    rotation: 0,
    duration: 0.3
  })
}

// 鼠标移动处理
const handleMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY

  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  // 视差光标层
  if (layer1.value) {
    gsap.to(layer1.value, {
      x: (mouseX - centerX) * parallaxSpeeds.layer1,
      y: (mouseY - centerY) * parallaxSpeeds.layer1,
      duration: 0.1
    })
  }

  if (layer2.value) {
    gsap.to(layer2.value, {
      x: (mouseX - centerX) * parallaxSpeeds.layer2,
      y: (mouseY - centerY) * parallaxSpeeds.layer2,
      duration: 0.15
    })
  }

  if (layer3.value) {
    gsap.to(layer3.value, {
      x: (mouseX - centerX) * parallaxSpeeds.layer3,
      y: (mouseY - centerY) * parallaxSpeeds.layer3,
      duration: 0.2
    })
  }

  if (layer4.value) {
    gsap.to(layer4.value, {
      x: (mouseX - centerX) * parallaxSpeeds.layer4,
      y: (mouseY - centerY) * parallaxSpeeds.layer4,
      duration: 0.25
    })
  }

  if (layer5.value) {
    gsap.to(layer5.value, {
      x: (mouseX - centerX) * parallaxSpeeds.layer5,
      y: (mouseY - centerY) * parallaxSpeeds.layer5,
      duration: 0.3
    })
  }

  // 背景圆圈
  if (bgCircle1.value) {
    gsap.to(bgCircle1.value, {
      x: (mouseX - centerX) * 0.05,
      y: (mouseY - centerY) * 0.05,
      duration: 0.5
    })
  }

  if (bgCircle2.value) {
    gsap.to(bgCircle2.value, {
      x: (mouseX - centerX) * 0.1,
      y: (mouseY - centerY) * 0.1,
      duration: 0.6
    })
  }

  if (bgCircle3.value) {
    gsap.to(bgCircle3.value, {
      x: (mouseX - centerX) * 0.15,
      y: (mouseY - centerY) * 0.15,
      duration: 0.7
    })
  }

  // 图像层
  imageLayers.value.forEach((layer, index) => {
    if (layer) {
      const speed = 0.03 + (index * 0.02)
      gsap.to(layer, {
        x: (mouseX - centerX) * speed,
        y: (mouseY - centerY) * speed,
        duration: 0.3 + (index * 0.1)
      })
    }
  })

  // 粒子
  particles.value.forEach((particle, index) => {
    if (particle) {
      const speed = parseFloat(particle.style.getPropertyValue('--speed') || '0.3')
      gsap.to(particle, {
        x: (mouseX - centerX) * speed * 2,
        y: (mouseY - centerY) * speed * 2,
        duration: 0.5
      })
    }
  })
}

onMounted(() => {
  // 监听鼠标移动
  document.addEventListener('mousemove', handleMouseMove)

  // 初始化鼠标位置
  mouseX = window.innerWidth / 2
  mouseY = window.innerHeight / 2

  // 入场动画
  gsap.from('.spc-title-220', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from('.spc-description-220', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  })

  gsap.from('.spc-card-220', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.4,
    ease: 'power3.out'
  })

  gsap.from('.spc-demo-220', {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    delay: 0.8,
    ease: 'power3.out'
  })

  gsap.from('.spc-image-wrapper-220', {
    x: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    delay: 1,
    ease: 'power3.out'
  })

  // 装饰点旋转动画
  gsap.to('.spc-decor-dot-220', {
    rotate: 360,
    duration: 20,
    repeat: -1,
    ease: 'none'
  })

  // 背景圆圈旋转
  gsap.to('.spc-bg-circle-220', {
    rotate: 360,
    duration: 30 + Math.random() * 20,
    repeat: -1,
    ease: 'none'
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.scroll-parallax-cursor-wrapper-220 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  cursor: none;
}

/* 视差光标层 */
.spc-cursor-layer-220 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.spc-layer-220 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 中心点 */
.spc-layer-1-220 {
  z-index: 5;
}

.spc-dot-220 {
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(167, 139, 250, 0.8);
}

/* 内环 */
.spc-layer-2-220 {
  z-index: 4;
}

.spc-ring-220 {
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
}

.spc-layer-2-220 .spc-ring-220 {
  width: 40px;
  height: 40px;
}

/* 中环 */
.spc-layer-3-220 {
  z-index: 3;
}

.spc-layer-3-220 .spc-ring-220 {
  width: 80px;
  height: 80px;
}

.spc-ring-dashed-220 {
  border-style: dashed;
  border-color: rgba(167, 139, 250, 0.6);
}

/* 外环 */
.spc-layer-4-220 {
  z-index: 2;
}

.spc-layer-4-220 .spc-ring-220 {
  width: 120px;
  height: 120px;
  border-color: rgba(96, 165, 250, 0.4);
}

.spc-ring-pulse-220 {
  animation: spcPulse 2s ease-in-out infinite;
}

@keyframes spcPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

/* 装饰点 */
.spc-layer-5-220 {
  z-index: 1;
}

.spc-decorator-220 {
  position: relative;
  width: 200px;
  height: 200px;
}

.spc-decor-dot-220 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background: rgba(244, 114, 182, 0.8);
  border-radius: 50%;
  transform: rotate(var(--angle)) translateX(100px);
  box-shadow: 0 0 10px rgba(244, 114, 182, 0.6);
}

/* 主内容 */
.spc-content-220 {
  position: relative;
  z-index: 1;
  padding: 80px 20px;
  cursor: none;
}

.spc-title-220 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  text-align: center;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.spc-description-220 {
  font-size: 1.2rem;
  color: #94a3b8;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 80px;
  line-height: 1.8;
}

/* 卡片 */
.spc-cards-220 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto 80px;
}

.spc-card-220 {
  position: relative;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s ease;
}

.spc-card-icon-220 {
  font-size: 3.5rem;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.spc-card-title-220 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.spc-card-desc-220 {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.6;
}

.spc-card-layer-220 {
  position: absolute;
  bottom: 0;
  right: 0;
  pointer-events: none;
}

.spc-card-depth-1-220,
.spc-card-depth-2-220,
.spc-card-depth-3-220 {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.spc-card-depth-1-220 {
  width: 100px;
  height: 100px;
  background: #a78bfa;
  bottom: -50px;
  right: -50px;
}

.spc-card-depth-2-220 {
  width: 60px;
  height: 60px;
  background: #60a5fa;
  bottom: -30px;
  right: -20px;
}

.spc-card-depth-3-220 {
  width: 40px;
  height: 40px;
  background: #f472b6;
  bottom: -20px;
  right: -10px;
}

/* 演示区域 */
.spc-demo-220 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 80px;
}

.spc-demo-container-220 {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spc-bg-circle-220 {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
}

.spc-bg-1-220 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(96, 165, 250, 0.3));
}

.spc-bg-2-220 {
  width: 280px;
  height: 280px;
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.3), rgba(236, 72, 153, 0.3));
}

.spc-bg-3-220 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.3), rgba(16, 185, 129, 0.3));
}

.spc-demo-content-220 {
  position: relative;
  text-align: center;
}

.spc-demo-icon-220 {
  font-size: 4rem;
  margin-bottom: 20px;
}

.spc-demo-title-220 {
  font-size: 2rem;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.spc-demo-text-220 {
  font-size: 1rem;
  color: #94a3b8;
}

/* 图像层 */
.spc-images-220 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 80px;
  flex-wrap: wrap;
}

.spc-image-wrapper-220 {
  position: relative;
  width: 250px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.spc-image-layer-220 {
  width: 100%;
  height: 100%;
}

.spc-image-placeholder-220 {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.spc-image-title-220 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.spc-image-desc-220 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 粒子 */
.spc-particles-220 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.spc-particle-220 {
  position: absolute;
  left: var(--x);
  top: var(--y);
  width: var(--size);
  height: var(--size);
  background: rgba(167, 139, 250, 0.5);
  border-radius: 50%;
  opacity: 0.6;
}

/* 响应式 */
@media (max-width: 768px) {
  .spc-title-220 {
    font-size: 2rem;
  }

  .spc-cards-220 {
    grid-template-columns: 1fr;
  }

  .spc-demo-container-220 {
    width: 300px;
    height: 300px;
  }

  .spc-bg-1-220 {
    width: 260px;
    height: 260px;
  }

  .spc-bg-2-220 {
    width: 200px;
    height: 200px;
  }

  .spc-bg-3-220 {
    width: 140px;
    height: 140px;
  }

  .spc-images-220 {
    flex-direction: column;
  }

  .spc-layer-4-220 .spc-ring-220,
  .spc-layer-5-220 {
    display: none;
  }
}
</style>
