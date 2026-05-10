<template>
  <div class="scroll-loading-art-226">
    <div class="loading-art-container">
      <!-- 标题区域 -->
      <div class="section-header-226">
        <h2 class="section-title-226">创意加载动画艺术</h2>
        <p class="section-subtitle-226">10种独特的加载指示器动画</p>
      </div>

      <!-- 滚动进度指示器 -->
      <div class="scroll-progress-226">
        <div class="progress-bar-226" :style="{ width: scrollProgress + '%' }"></div>
      </div>

      <!-- 加载动画展示区 -->
      <div class="loading-demos-226">
        <!-- 1. 经典旋转加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">经典旋转</div>
          <div class="loading-wrapper-226">
            <div class="spinner-classic-226"></div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(0)">重播</button>
        </div>

        <!-- 2. 弹性脉冲加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">弹性脉冲</div>
          <div class="loading-wrapper-226">
            <div class="spinner-pulse-226"></div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(1)">重播</button>
        </div>

        <!-- 3. 波浪加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">波浪加载</div>
          <div class="loading-wrapper-226">
            <div class="spinner-wave-226">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(2)">重播</button>
        </div>

        <!-- 4. 陀螺仪加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">陀螺仪</div>
          <div class="loading-wrapper-226">
            <div class="spinner-gyro-226"></div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(3)">重播</button>
        </div>

        <!-- 5. 原子加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">原子结构</div>
          <div class="loading-wrapper-226">
            <div class="spinner-atom-226">
              <div class="atom-core-226"></div>
              <div class="atom-orbit-226 orbit-1-226"></div>
              <div class="atom-orbit-226 orbit-2-226"></div>
              <div class="atom-orbit-226 orbit-3-226"></div>
            </div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(4)">重播</button>
        </div>

        <!-- 6. 条形进度加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">条形进度</div>
          <div class="loading-wrapper-226">
            <div class="spinner-bars-226">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(5)">重播</button>
        </div>

        <!-- 7. 三个圆环加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">三重圆环</div>
          <div class="loading-wrapper-226">
            <div class="spinner-triple-226">
              <div class="ring-226 ring-1-226"></div>
              <div class="ring-226 ring-2-226"></div>
              <div class="ring-226 ring-3-226"></div>
            </div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(6)">重播</button>
        </div>

        <!-- 8. 霓虹加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">霓虹光效</div>
          <div class="loading-wrapper-226">
            <div class="spinner-neon-226">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(7)">重播</button>
        </div>

        <!-- 9. 旋转方块加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">旋转方块</div>
          <div class="loading-wrapper-226">
            <div class="spinner-cube-226">
              <div class="cube-face-226 face-1-226"></div>
              <div class="cube-face-226 face-2-226"></div>
              <div class="cube-face-226 face-3-226"></div>
              <div class="cube-face-226 face-4-226"></div>
            </div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(8)">重播</button>
        </div>

        <!-- 10. 进度圆环加载 -->
        <div class="demo-card-226">
          <div class="demo-title-226">进度圆环</div>
          <div class="loading-wrapper-226">
            <div class="spinner-progress-226">
              <svg class="progress-svg-226" viewBox="0 0 100 100">
                <circle class="progress-bg-226" cx="50" cy="50" r="40" />
                <circle class="progress-bar-226" cx="50" cy="50" r="40" />
              </svg>
              <div class="progress-text-226">0%</div>
            </div>
          </div>
          <button class="demo-btn-226" @click="resetDemo(9)">重播</button>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel-226">
        <div class="control-group-226">
          <label class="control-label-226">动画速度</label>
          <input
            type="range"
            v-model="animationSpeed"
            min="0.5"
            max="3"
            step="0.1"
            class="control-slider-226"
            @input="updateSpeed"
          />
          <span class="control-value-226">{{ animationSpeed }}x</span>
        </div>
        <div class="control-group-226">
          <label class="control-label-226">主题颜色</label>
          <input
            type="color"
            v-model="themeColor"
            class="control-color-226"
            @input="updateColor"
          />
        </div>
        <button class="control-btn-226 primary" @click="resetAllDemos">重置全部</button>
      </div>

      <!-- 状态信息 -->
      <div class="status-info-226">
        <span class="info-item-226">加载动画: 10种</span>
        <span class="info-item-226">滚动进度: {{ Math.round(scrollProgress) }}%</span>
        <span class="info-item-226">当前速度: {{ animationSpeed }}x</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 响应式状态
const animationSpeed = ref(1)
const themeColor = ref('#0ea5e9')
const scrollProgress = ref(0)
let progressTimelines: gsap.core.Timeline[] = []

// 重置单个演示
const resetDemo = (index: number) => {
  const demoWrappers = gsap.utils.toArray('.loading-wrapper-226')
  if (demoWrappers[index]) {
    // 添加闪烁效果
    gsap.fromTo(
      demoWrappers[index],
      { scale: 0.95 },
      { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
    )
  }

  // 重置进度圆环
  if (index === 9) {
    resetProgressRing()
  }
}

// 重置全部演示
const resetAllDemos = () => {
  const demoWrappers = gsap.utils.toArray('.loading-wrapper-226')
  gsap.fromTo(
    demoWrappers,
    { scale: 0.8, opacity: 0.5 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: 'back.out(1.7)',
      stagger: 0.05
    }
  )
  resetProgressRing()
}

// 重置进度圆环
const resetProgressRing = () => {
  const progressBar = document.querySelector('.progress-bar-226') as SVGElement
  const progressText = document.querySelector('.progress-text-226') as HTMLElement
  if (progressBar && progressText) {
    const circumference = 2 * Math.PI * 40
    gsap.to(progressBar, {
      strokeDashoffset: circumference,
      duration: 0.3
    })
    gsap.to(progressText, {
      textContent: 0,
      duration: 0.3,
      snap: { textContent: 1 }
    })

    // 重新开始进度动画
    setTimeout(() => {
      startProgressAnimation()
    }, 500)
  }
}

// 更新动画速度
const updateSpeed = () => {
  const wrappers = gsap.utils.toArray('.loading-wrapper-226 *')
  wrappers.forEach(el => {
    gsap.to(el, {
      animationDuration: `${2 / animationSpeed.value}s`,
      overwrite: 'auto'
    })
  })

  // 更新CSS变量
  document.documentElement.style.setProperty('--anim-speed', `${animationSpeed.value}s`)
}

// 更新主题颜色
const updateColor = () => {
  document.documentElement.style.setProperty('--theme-color', themeColor.value)
}

// 进度动画
const startProgressAnimation = () => {
  const progressBar = document.querySelector('.progress-bar-226') as SVGElement
  const progressText = document.querySelector('.progress-text-226') as HTMLElement
  if (!progressBar || !progressText) return

  const circumference = 2 * Math.PI * 40
  const duration = 4 / animationSpeed.value

  gsap.to(progressBar, {
    strokeDashoffset: 0,
    duration: duration,
    ease: 'none',
    onComplete: () => {
      gsap.to(progressBar, {
        strokeDashoffset: circumference,
        duration: 0.3,
        onComplete: startProgressAnimation
      })
    }
  })

  gsap.to(progressText, {
    textContent: 100,
    duration: duration,
    ease: 'none',
    snap: { textContent: 1 },
    onUpdate: function () {
      progressText.textContent = Math.round(this.targets()[0].textContent) + '%'
    },
    onComplete: () => {
      gsap.to(progressText, {
        textContent: 0,
        duration: 0.3
      })
    }
  })
}

onMounted(() => {
  // 标题滚动入场动画
  gsap.from('.section-title-226', {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: '.scroll-loading-art-226',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  })

  gsap.from('.section-subtitle-226', {
    y: -30,
    opacity: 0,
    duration: 0.6,
    delay: 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.scroll-loading-art-226',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  })

  // 演示卡片滚动入场动画 - 分批显示
  const demoCards = gsap.utils.toArray('.demo-card-226')
  demoCards.forEach((card, index) => {
    gsap.from(card, {
      y: 80,
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'top 60%',
        scrub: 1,
        toggleActions: 'play none none reverse'
      }
    })
  })

  // 控制面板滚动入场动画
  gsap.from('.control-panel-226', {
    y: 60,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.control-panel-226',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  })

  // 状态信息滚动入场动画
  gsap.from('.status-info-226', {
    y: 40,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.status-info-226',
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    }
  })

  // 滚动控制进度条 - scrub绑定
  ScrollTrigger.create({
    trigger: '.scroll-loading-art-226',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.3,
    onUpdate: (self) => {
      scrollProgress.value = self.progress * 100
    }
  })

  // 初始化进度圆环 - 滚动触发
  ScrollTrigger.create({
    trigger: '.spinner-progress-226',
    start: 'top 80%',
    onEnter: () => {
      setTimeout(() => {
        startProgressAnimation()
      }, 300)
    },
    once: true
  })

  // 设置初始CSS变量
  document.documentElement.style.setProperty('--anim-speed', `${animationSpeed.value}s`)
  document.documentElement.style.setProperty('--theme-color', themeColor.value)
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  gsap.killTweensOf('.scroll-loading-art-226 *')
  progressTimelines.forEach(tl => tl.kill())
})
</script>

<style scoped lang="scss">
.scroll-loading-art-226 {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  padding: 60px 20px;
  position: relative;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 70%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.loading-art-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.section-header-226 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.section-title-226 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  text-shadow: 0 0 30px rgba(14, 165, 233, 0.3);

  opacity: 1 !important;}

.section-subtitle-226 {
  font-size: 1.2rem;
  color: #94a3b8;
  font-weight: 500;

  opacity: 1 !important;}

.loading-demos-226 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.demo-card-226 {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--theme-color, #0ea5e9), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(14, 165, 233, 0.1);
    border-color: rgba(14, 165, 233, 0.3);

    &::before {
      opacity: 1;
    }
  }
}

.demo-title-226 {
  font-size: 1.1rem;
  color: #e2e8f0;
  margin-bottom: 25px;
  font-weight: 600;

  opacity: 1 !important;}

.loading-wrapper-226 {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  opacity: 1 !important;}

.demo-btn-226 {
  padding: 10px 24px;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
  color: #0ea5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: rgba(14, 165, 233, 0.2);
    border-color: #0ea5e9;
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
  
  opacity: 1 !important;}
}

// 1. 经典旋转加载
.spinner-classic-226 {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(14, 165, 233, 0.1);
  border-top-color: var(--theme-color, #0ea5e9);
  border-radius: 50%;
  animation: spin-226 calc(var(--anim-speed, 1s) * 1) linear infinite;

  opacity: 1 !important;}

@keyframes spin-226 {
  to {
    transform: rotate(360deg);
  }
}

// 2. 弹性脉冲加载
.spinner-pulse-226 {
  width: 50px;
  height: 50px;
  background: var(--theme-color, #0ea5e9);
  border-radius: 50%;
  position: relative;
  animation: pulse-226 calc(var(--anim-speed, 1s) * 1.5) ease-in-out infinite;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: var(--theme-color, #0ea5e9);
  
  opacity: 1 !important;}

  &::before {
    animation: pulse-226 calc(var(--anim-speed, 1s) * 1.5) ease-in-out infinite 0.3s;
  }

  &::after {
    animation: pulse-226 calc(var(--anim-speed, 1s) * 1.5) ease-in-out infinite 0.6s;
  }
}

@keyframes pulse-226 {
  0%, 100% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.4);
    opacity: 0.3;
  }
}

// 3. 波浪加载
.spinner-wave-226 {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 50px;

  span {
    width: 6px;
    height: 100%;
    background: var(--theme-color, #0ea5e9);
    border-radius: 3px;
    animation: wave-226 calc(var(--anim-speed, 1s) * 1.2) ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    
  opacity: 1 !important;}
    &:nth-child(2) {
      animation-delay: 0.1s;
    }
    &:nth-child(3) {
      animation-delay: 0.2s;
    }
    &:nth-child(4) {
      animation-delay: 0.3s;
    }
    &:nth-child(5) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes wave-226 {
  0%, 100% {
    height: 20%;
  }
  50% {
    height: 100%;
  }
}

// 4. 陀螺仪加载
.spinner-gyro-226 {
  width: 50px;
  height: 50px;
  border: 3px solid transparent;
  border-top-color: var(--theme-color, #0ea5e9);
  border-bottom-color: var(--theme-color, #0ea5e9);
  border-radius: 50%;
  animation: gyro-226 calc(var(--anim-speed, 1s) * 1) linear infinite;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border: 3px solid transparent;
    border-left-color: rgba(14, 165, 233, 0.5);
    border-right-color: rgba(14, 165, 233, 0.5);
    border-radius: 50%;
    animation: gyro-reverse-226 calc(var(--anim-speed, 1s) * 1) linear infinite;
  
  opacity: 1 !important;}
}

@keyframes gyro-226 {
  to {
    transform: rotate(360deg);
  }
}

@keyframes gyro-reverse-226 {
  to {
    transform: rotate(-360deg);
  }
}

// 5. 原子加载
.spinner-atom-226 {
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.atom-core-226 {
  width: 16px;
  height: 16px;
  background: var(--theme-color, #0ea5e9);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
  animation: atom-pulse-226 calc(var(--anim-speed, 1s) * 2) ease-in-out infinite;

  opacity: 1 !important;}

.atom-orbit-226 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(14, 165, 233, 0.3);
  border-radius: 50%;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    width: 8px;
    height: 8px;
    background: var(--theme-color, #0ea5e9);
    border-radius: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 8px rgba(14, 165, 233, 0.6);
  
  opacity: 1 !important;}
}

.orbit-1-226 {
  animation: orbit-1-226 calc(var(--anim-speed, 1s) * 2) linear infinite;
}

.orbit-2-226 {
  animation: orbit-2-226 calc(var(--anim-speed, 1s) * 2) linear infinite;
}

.orbit-3-226 {
  animation: orbit-3-226 calc(var(--anim-speed, 1s) * 2) linear infinite;
}

@keyframes atom-pulse-226 {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes orbit-1-226 {
  to {
    transform: rotate(360deg);
  }
}

@keyframes orbit-2-226 {
  from {
    transform: rotate(60deg);
  }
  to {
    transform: rotate(420deg);
  }
}

@keyframes orbit-3-226 {
  from {
    transform: rotate(120deg);
  }
  to {
    transform: rotate(480deg);
  }
}

// 6. 条形进度加载
.spinner-bars-226 {
  display: flex;
  gap: 5px;
  align-items: center;
  height: 50px;

  span {
    width: 8px;
    background: var(--theme-color, #0ea5e9);
    border-radius: 4px;
    animation: bars-226 calc(var(--anim-speed, 1s) * 1) ease-in-out infinite;

    &:nth-child(1) {
      height: 20px;
      animation-delay: 0s;
    
  opacity: 1 !important;}
    &:nth-child(2) {
      height: 30px;
      animation-delay: 0.1s;
    }
    &:nth-child(3) {
      height: 40px;
      animation-delay: 0.2s;
    }
    &:nth-child(4) {
      height: 30px;
      animation-delay: 0.3s;
    }
    &:nth-child(5) {
      height: 20px;
      animation-delay: 0.4s;
    }
  }
}

@keyframes bars-226 {
  0%, 100% {
    transform: scaleY(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scaleY(1.2);
    opacity: 1;
  }
}

// 7. 三重圆环加载
.spinner-triple-226 {
  position: relative;
  width: 40px;
  height: 40px;

  opacity: 1 !important;}

.ring-226 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid transparent;
  border-radius: 50%;

  opacity: 1 !important;}

.ring-1-226 {
  border-top-color: var(--theme-color, #0ea5e9);
  border-right-color: var(--theme-color, #0ea5e9);
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.6);
  animation: ring-1-226 calc(var(--anim-speed, 1s) * 1.5) linear infinite;

  opacity: 1 !important;}

.ring-2-226 {
  top: 3px;
  left: 3px;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border-bottom-color: rgba(14, 165, 233, 0.7);
  border-left-color: rgba(14, 165, 233, 0.7);
  box-shadow: 0 0 6px rgba(14, 165, 233, 0.4);
  animation: ring-2-226 calc(var(--anim-speed, 1s) * 1.2) linear infinite reverse;

  opacity: 1 !important;}

.ring-3-226 {
  top: 6px;
  left: 6px;
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  border-top-color: rgba(14, 165, 233, 0.4);
  border-right-color: rgba(14, 165, 233, 0.4);
  box-shadow: 0 0 4px rgba(14, 165, 233, 0.3);
  animation: ring-1-226 calc(var(--anim-speed, 1s) * 1.8) linear infinite;

  opacity: 1 !important;}

@keyframes ring-1-226 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes ring-2-226 {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

// 8. 霓虹加载
.spinner-neon-226 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 50px;
  height: 50px;

  span {
    width: 100%;
    height: 100%;
    background: var(--theme-color, #0ea5e9);
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
    animation: neon-226 calc(var(--anim-speed, 1s) * 1.5) ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    
  opacity: 1 !important;}
    &:nth-child(2) {
      animation-delay: 0.3s;
    }
    &:nth-child(3) {
      animation-delay: 0.6s;
    }
    &:nth-child(4) {
      animation-delay: 0.9s;
    }
  }
}

@keyframes neon-226 {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

// 9. 旋转方块加载
.spinner-cube-226 {
  width: 40px;
  height: 40px;
  position: relative;
  animation: cube-226 calc(var(--anim-speed, 1s) * 2) linear infinite;

  opacity: 1 !important;}

.cube-face-226 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--theme-color, #0ea5e9);
  border-radius: 8px;

  opacity: 1 !important;}

.face-1-226 {
  animation: face-1-226 calc(var(--anim-speed, 1s) * 2) linear infinite;
}

.face-2-226 {
  animation: face-2-226 calc(var(--anim-speed, 1s) * 2) linear infinite;
}

.face-3-226 {
  animation: face-3-226 calc(var(--anim-speed, 1s) * 2) linear infinite;
}

.face-4-226 {
  animation: face-4-226 calc(var(--anim-speed, 1s) * 2) linear infinite;
}

@keyframes cube-226 {
  to {
    transform: rotate(360deg);
  }
}

@keyframes face-1-226 {
  0%, 100% {
    transform: rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: rotate(90deg);
    opacity: 0.5;
  }
}

@keyframes face-2-226 {
  0%, 100% {
    transform: rotate(45deg);
    opacity: 0.5;
  }
  50% {
    transform: rotate(135deg);
    opacity: 1;
  }
}

@keyframes face-3-226 {
  0%, 100% {
    transform: rotate(90deg);
    opacity: 0.5;
  }
  50% {
    transform: rotate(180deg);
    opacity: 1;
  }
}

@keyframes face-4-226 {
  0%, 100% {
    transform: rotate(135deg);
    opacity: 1;
  }
  50% {
    transform: rotate(225deg);
    opacity: 0.5;
  }
}

// 10. 进度圆环加载
.spinner-progress-226 {
  position: relative;
  width: 80px;
  height: 80px;

  opacity: 1 !important;}

.progress-svg-226 {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);

  opacity: 1 !important;}

.progress-bg-226 {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 6;

  opacity: 1 !important;}

.progress-bar-226 {
  fill: none;
  stroke: var(--theme-color, #0ea5e9);
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 251.2;
  stroke-dashoffset: 251.2;

  opacity: 1 !important;}

.progress-text-226 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2rem;
  font-weight: 700;
  color: #e2e8f0;

  opacity: 1 !important;}

// 控制面板
.control-panel-226 {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px 30px;
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 30px;

  opacity: 1 !important;}

.control-group-226 {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-label-226 {
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: 500;

  opacity: 1 !important;}

.control-slider-226 {
  width: 120px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: var(--theme-color, #0ea5e9);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    
  opacity: 1 !important;}
  }
}

.control-color-226 {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  padding: 0;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  
  opacity: 1 !important;}

  &::-webkit-color-swatch {
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
  }
}

.control-value-226 {
  font-size: 0.9rem;
  color: #e2e8f0;
  font-weight: 600;
  min-width: 40px;

  opacity: 1 !important;}

.control-btn-226 {
  padding: 12px 24px;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
  color: #0ea5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: rgba(14, 165, 233, 0.2);
    border-color: #0ea5e9;
    box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
  
  opacity: 1 !important;}

  &.primary {
    background: var(--theme-color, #0ea5e9);
    border-color: var(--theme-color, #0ea5e9);
    color: #0f172a;

    &:hover {
      background: rgba(14, 165, 233, 0.8);
      color: #fff;
    
  opacity: 1 !important;}
  }
}

// 滚动进度
.scroll-progress-226 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 9999;

  opacity: 1 !important;}

.progress-bar-226 {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #8b5cf6, #ec4899);
  width: 0%;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);

  opacity: 1 !important;}

// 状态信息
.status-info-226 {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;

  opacity: 1 !important;}

.info-item-226 {
  font-size: 0.9rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--theme-color, #0ea5e9);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
  
  opacity: 1 !important;}
}

// 响应式设计
@media (max-width: 768px) {
  .loading-demos-226 {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }

  .control-panel-226 {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }

  .control-group-226 {
    flex-direction: column;
    align-items: flex-start;
  }

  .status-info-226 {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
