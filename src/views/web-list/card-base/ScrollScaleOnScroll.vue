<template>
  <div class="scroll-scale-on-scroll-wrapper-221">
    <!-- 标题区域 -->
    <section class="ssos-header-221">
      <h2 class="ssos-title-221">滚动缩放效果</h2>
      <p class="ssos-subtitle-221">向下滚动，观察元素如何随滚动位置缩放</p>
    </section>

    <!-- 缩放演示 1 - 从小到大 -->
    <section class="ssos-section-221">
      <div ref="scaleContainer1" class="ssos-container-221">
        <div ref="scaleItem1" class="ssos-scale-item-221 ssos-purple-221">
          <div class="ssos-content-221">
            <div class="ssos-icon-221">📈</div>
            <h3 class="ssos-item-title-221">从小到大</h3>
            <p class="ssos-item-desc-221">
              元素从 0.5x 缩放到 2x，随着滚动逐渐变大
            </p>
            <div class="ssos-indicator-221">
              <span class="ssos-indicator-text-221">当前缩放: </span>
              <span ref="scaleValue1" class="ssos-indicator-value-221">0.5x</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 缩放演示 2 - 从大到小 -->
    <section class="ssos-section-221">
      <div ref="scaleContainer2" class="ssos-container-221">
        <div ref="scaleItem2" class="ssos-scale-item-221 ssos-blue-221">
          <div class="ssos-content-221">
            <div class="ssos-icon-221">📉</div>
            <h3 class="ssos-item-title-221">从大到小</h3>
            <p class="ssos-item-desc-221">
              元素从 2x 缩放到 0.5x，随着滚动逐渐变小
            </p>
            <div class="ssos-indicator-221">
              <span class="ssos-indicator-text-221">当前缩放: </span>
              <span ref="scaleValue2" class="ssos-indicator-value-221">2.0x</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 缩放演示 3 - 弹性缩放 -->
    <section class="ssos-section-221">
      <div ref="scaleContainer3" class="ssos-container-221">
        <div ref="scaleItem3" class="ssos-scale-item-221 ssos-pink-221">
          <div class="ssos-content-221">
            <div class="ssos-icon-221">🔄</div>
            <h3 class="ssos-item-title-221">弹性缩放</h3>
            <p class="ssos-item-desc-221">
              使用弹性缓动函数，创建有弹性的缩放效果
            </p>
            <div class="ssos-indicator-221">
              <span class="ssos-indicator-text-221">当前缩放: </span>
              <span ref="scaleValue3" class="ssos-indicator-value-221">1.0x</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 缩放演示 4 - 多元素同步缩放 -->
    <section class="ssos-section-221">
      <div ref="scaleContainer4" class="ssos-container-221 ssos-multi-221">
        <div ref="multiScale1" class="ssos-scale-item-221 ssos-green-221 ssos-small-221">
          <div class="ssos-content-221">
            <div class="ssos-icon-221">1</div>
            <p class="ssos-item-text-221">小元素</p>
          </div>
        </div>
        <div ref="multiScale2" class="ssos-scale-item-221 ssos-green-221 ssos-medium-221">
          <div class="ssos-content-221">
            <div class="ssos-icon-221">2</div>
            <p class="ssos-item-text-221">中元素</p>
          </div>
        </div>
        <div ref="multiScale3" class="ssos-scale-item-221 ssos-green-221 ssos-large-221">
          <div class="ssos-content-221">
            <div class="ssos-icon-221">3</div>
            <p class="ssos-item-text-221">大元素</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 缩放演示 5 - 3D缩放 -->
    <section class="ssos-section-221">
      <div ref="scaleContainer5" class="ssos-container-221">
        <div ref="scaleItem5" class="ssos-scale-item-221 ssos-orange-221 ssos-3d-221">
          <div class="ssos-content-221">
            <div class="ssos-icon-221">🎲</div>
            <h3 class="ssos-item-title-221">3D 缩放</h3>
            <p class="ssos-item-desc-221">
              结合旋转和缩放，创建3D空间效果
            </p>
            <div class="ssos-indicator-221">
              <span class="ssos-indicator-text-221">当前缩放: </span>
              <span ref="scaleValue5" class="ssos-indicator-value-221">1.0x</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 缩放演示 6 - 脉冲缩放 -->
    <section class="ssos-section-221">
      <div ref="scaleContainer6" class="ssos-container-221">
        <div ref="scaleItem6" class="ssos-scale-item-221 ssos-cyan-221 ssos-pulse-221">
          <div class="ssos-content-221">
            <div class="ssos-icon-221">💓</div>
            <h3 class="ssos-item-title-221">脉冲缩放</h3>
            <p class="ssos-item-desc-221">
              滚动触发脉冲式缩放动画
            </p>
            <div class="ssos-indicator-221">
              <span class="ssos-indicator-text-221">当前缩放: </span>
              <span ref="scaleValue6" class="ssos-indicator-value-221">1.0x</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 缩放演示 7 - 图像缩放 -->
    <section class="ssos-section-221">
      <div ref="scaleContainer7" class="ssos-container-221">
        <div ref="scaleItem7" class="ssos-image-wrapper-221">
          <div class="ssos-image-layer-221 ssos-img-layer-1-221">
            <div class="ssos-image-placeholder-221" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <span class="ssos-image-label-221">层 1</span>
            </div>
          </div>
          <div class="ssos-image-layer-221 ssos-img-layer-2-221">
            <div class="ssos-image-placeholder-221" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <span class="ssos-image-label-221">层 2</span>
            </div>
          </div>
          <div class="ssos-image-layer-221 ssos-img-layer-3-221">
            <div class="ssos-image-placeholder-221" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
              <span class="ssos-image-label-221">层 3</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 缩放演示 8 - 文字缩放 -->
    <section class="ssos-section-221">
      <div ref="scaleContainer8" class="ssos-container-221">
        <div class="ssos-text-scale-221">
          <h3 ref="textScale1" class="ssos-text-line-221 ssos-text-1-221">
            这行文字会缩放
          </h3>
          <h3 ref="textScale2" class="ssos-text-line-221 ssos-text-2-221">
            每行有不同的大小
          </h3>
          <h3 ref="textScale3" class="ssos-text-line-221 ssos-text-3-221">
            创造视觉层次感
          </h3>
        </div>
      </div>
    </section>

    <!-- 缩放进度指示器 -->
    <div class="ssos-progress-221">
      <div class="ssos-progress-bar-221">
        <div ref="progressBar" class="ssos-progress-fill-221"></div>
      </div>
      <span class="ssos-progress-label-221">滚动缩放进度</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 元素引用
const scaleContainer1 = ref<HTMLElement | null>(null)
const scaleItem1 = ref<HTMLElement | null>(null)
const scaleValue1 = ref<HTMLElement | null>(null)

const scaleContainer2 = ref<HTMLElement | null>(null)
const scaleItem2 = ref<HTMLElement | null>(null)
const scaleValue2 = ref<HTMLElement | null>(null)

const scaleContainer3 = ref<HTMLElement | null>(null)
const scaleItem3 = ref<HTMLElement | null>(null)
const scaleValue3 = ref<HTMLElement | null>(null)

const scaleContainer4 = ref<HTMLElement | null>(null)
const multiScale1 = ref<HTMLElement | null>(null)
const multiScale2 = ref<HTMLElement | null>(null)
const multiScale3 = ref<HTMLElement | null>(null)

const scaleContainer5 = ref<HTMLElement | null>(null)
const scaleItem5 = ref<HTMLElement | null>(null)
const scaleValue5 = ref<HTMLElement | null>(null)

const scaleContainer6 = ref<HTMLElement | null>(null)
const scaleItem6 = ref<HTMLElement | null>(null)
const scaleValue6 = ref<HTMLElement | null>(null)

const scaleContainer7 = ref<HTMLElement | null>(null)
const scaleItem7 = ref<HTMLElement | null>(null)

const scaleContainer8 = ref<HTMLElement | null>(null)
const textScale1 = ref<HTMLElement | null>(null)
const textScale2 = ref<HTMLElement | null>(null)
const textScale3 = ref<HTMLElement | null>(null)

const progressBar = ref<HTMLElement | null>(null)

let triggers: any[] = []

onMounted(() => {
  // 缩放 1: 从小到大
  const trigger1 = gsap.to(scaleItem1.value, {
    scale: 2,
    scrollTrigger: {
      trigger: scaleContainer1.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: () => {
        const progress = gsap.getProperty(scaleItem1.value, 'scale')
        if (scaleValue1.value) {
          scaleValue1.value.textContent = `${progress.toFixed(2)}x`
        }
      }
    }
  })
  gsap.set(scaleItem1.value, { scale: 0.5 })
  triggers.push(trigger1)

  // 缩放 2: 从大到小
  const trigger2 = gsap.to(scaleItem2.value, {
    scale: 0.5,
    scrollTrigger: {
      trigger: scaleContainer2.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: () => {
        const progress = gsap.getProperty(scaleItem2.value, 'scale')
        if (scaleValue2.value) {
          scaleValue2.value.textContent = `${progress.toFixed(2)}x`
        }
      }
    }
  })
  gsap.set(scaleItem2.value, { scale: 2 })
  triggers.push(trigger2)

  // 缩放 3: 弹性缩放
  const trigger3 = gsap.to(scaleItem3.value, {
    scale: 1.5,
    scrollTrigger: {
      trigger: scaleContainer3.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: () => {
        const progress = gsap.getProperty(scaleItem3.value, 'scale')
        if (scaleValue3.value) {
          scaleValue3.value.textContent = `${progress.toFixed(2)}x`
        }
      }
    }
  })
  gsap.set(scaleItem3.value, { scale: 0.8 })
  triggers.push(trigger3)

  // 缩放 4: 多元素同步缩放
  const trigger4 = gsap.to([multiScale1.value, multiScale2.value, multiScale3.value], {
    scale: 1.5,
    scrollTrigger: {
      trigger: scaleContainer4.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    }
  })
  gsap.set(multiScale1.value, { scale: 0.6 })
  gsap.set(multiScale2.value, { scale: 0.8 })
  gsap.set(multiScale3.value, { scale: 1 })
  triggers.push(trigger4)

  // 缩放 5: 3D 缩放
  const trigger5 = gsap.timeline({
    scrollTrigger: {
      trigger: scaleContainer5.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: () => {
        const progress = gsap.getProperty(scaleItem5.value, 'scale')
        if (scaleValue5.value) {
          scaleValue5.value.textContent = `${progress.toFixed(2)}x`
        }
      }
    }
  })
  trigger5.to(scaleItem5.value, { scale: 1.5, rotation: 0 })
  triggers.push(trigger5)

  // 缩放 6: 脉冲缩放
  const trigger6 = gsap.to(scaleItem6.value, {
    scale: 1.3,
    scrollTrigger: {
      trigger: scaleContainer6.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: () => {
        const progress = gsap.getProperty(scaleItem6.value, 'scale')
        if (scaleValue6.value) {
          scaleValue6.value.textContent = `${progress.toFixed(2)}x`
        }
      }
    }
  })
  triggers.push(trigger6)

  // 缩放 7: 图像缩放
  const trigger7 = gsap.to('.ssos-img-layer-1-221', {
    scale: 1.5,
    scrollTrigger: {
      trigger: scaleContainer7.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    }
  })
  gsap.to('.ssos-img-layer-2-221', {
    scale: 1.3,
    scrollTrigger: {
      trigger: scaleContainer7.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    }
  })
  gsap.to('.ssos-img-layer-3-221', {
    scale: 1.1,
    scrollTrigger: {
      trigger: scaleContainer7.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    }
  })
  triggers.push(trigger7)

  // 缩放 8: 文字缩放
  const trigger8 = gsap.to(textScale1.value, {
    scale: 1.8,
    scrollTrigger: {
      trigger: scaleContainer8.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    }
  })
  gsap.to(textScale2.value, {
    scale: 1.5,
    scrollTrigger: {
      trigger: scaleContainer8.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    }
  })
  gsap.to(textScale3.value, {
    scale: 1.2,
    scrollTrigger: {
      trigger: scaleContainer8.value,
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    }
  })
  triggers.push(trigger8)

  // 进度条
  const triggerProgress = gsap.to(progressBar.value, {
    width: '100%',
    scrollTrigger: {
      trigger: '.scroll-scale-on-scroll-wrapper-221',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5
    }
  })
  triggers.push(triggerProgress)

  // 入场动画
  gsap.from('.ssos-title-221', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })

  gsap.from('.ssos-subtitle-221', {
    y: 30,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
  })
})

onUnmounted(() => {
  triggers.forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.scroll-scale-on-scroll-wrapper-221 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
  padding-bottom: 100px;

  opacity: 1 !important;}

/* 标题 */
.ssos-header-221 {
  text-align: center;
  padding: 80px 20px 60px;

  opacity: 1 !important;}

.ssos-title-221 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.ssos-subtitle-221 {
  font-size: 1.2rem;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto;

  opacity: 1 !important;}

/* 区域 */
.ssos-section-221 {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;

  opacity: 1 !important;}

.ssos-container-221 {
  position: relative;
  max-width: 1200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.ssos-container-221.ssos-multi-221 {
  gap: 40px;
  flex-wrap: wrap;
}

/* 缩放项 */
.ssos-scale-item-221 {
  position: relative;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  max-width: 500px;
  text-align: center;
  transform-origin: center center;

  opacity: 1 !important;}

.ssos-purple-221 {
  border-color: rgba(167, 139, 250, 0.3);
  box-shadow: 0 20px 60px rgba(167, 139, 250, 0.2);

  opacity: 1 !important;}

.ssos-blue-221 {
  border-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 20px 60px rgba(96, 165, 250, 0.2);

  opacity: 1 !important;}

.ssos-pink-221 {
  border-color: rgba(244, 114, 182, 0.3);
  box-shadow: 0 20px 60px rgba(244, 114, 182, 0.2);

  opacity: 1 !important;}

.ssos-green-221 {
  border-color: rgba(74, 222, 128, 0.3);
  box-shadow: 0 20px 60px rgba(74, 222, 128, 0.2);

  opacity: 1 !important;}

.ssos-orange-221 {
  border-color: rgba(251, 146, 60, 0.3);
  box-shadow: 0 20px 60px rgba(251, 146, 60, 0.2);

  opacity: 1 !important;}

.ssos-cyan-221 {
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow: 0 20px 60px rgba(34, 211, 238, 0.2);

  opacity: 1 !important;}

/* 多元素尺寸 */
.ssos-small-221 {
  width: 200px;
  padding: 30px;

  opacity: 1 !important;}

.ssos-medium-221 {
  width: 280px;
  padding: 40px;

  opacity: 1 !important;}

.ssos-large-221 {
  width: 360px;
  padding: 50px;

  opacity: 1 !important;}

/* 3D 效果 */
.ssos-3d-221 {
  perspective: 1000px;
}

.ssos-3d-221 > div {
  transform-style: preserve-3d;
}

/* 脉冲效果 */
.ssos-pulse-221 .ssos-icon-221 {
  animation: ssosPulse 1s ease-in-out infinite;
}

@keyframes ssosPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 内容 */
.ssos-content-221 {
  position: relative;
}

.ssos-icon-221 {
  font-size: 4rem;
  margin-bottom: 24px;

  opacity: 1 !important;}

.ssos-item-title-221 {
  font-size: 2rem;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 16px;

  opacity: 1 !important;}

.ssos-item-desc-221 {
  font-size: 1.1rem;
  color: #94a3b8;
  line-height: 1.8;
  margin-bottom: 24px;

  opacity: 1 !important;}

.ssos-item-text-221 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e2e8f0;

  opacity: 1 !important;}

/* 指示器 */
.ssos-indicator-221 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;

  opacity: 1 !important;}

.ssos-indicator-text-221 {
  font-size: 0.9rem;
  color: #94a3b8;

  opacity: 1 !important;}

.ssos-indicator-value-221 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #60a5fa;
  font-family: monospace;

  opacity: 1 !important;}

/* 图像缩放 */
.ssos-image-wrapper-221 {
  position: relative;
  width: 100%;
  max-width: 600px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.ssos-image-layer-221 {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.ssos-img-layer-1-221 {
  z-index: 3;
}

.ssos-img-layer-2-221 {
  z-index: 2;
  transform: translate(50px, 50px);
}

.ssos-img-layer-3-221 {
  z-index: 1;
  transform: translate(100px, 100px);
}

.ssos-image-placeholder-221 {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.ssos-image-label-221 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

/* 文字缩放 */
.ssos-text-scale-221 {
  text-align: center;

  opacity: 1 !important;}

.ssos-text-line-221 {
  font-size: 2rem;
  font-weight: 800;
  color: #e2e8f0;
  margin: 24px 0;
  transform-origin: center center;

  opacity: 1 !important;}

.ssos-text-1-221 {
  color: #a78bfa;

  opacity: 1 !important;}

.ssos-text-2-221 {
  color: #60a5fa;

  opacity: 1 !important;}

.ssos-text-3-221 {
  color: #f472b6;

  opacity: 1 !important;}

/* 进度条 */
.ssos-progress-221 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 100;
}

.ssos-progress-bar-221 {
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;

  opacity: 1 !important;}

.ssos-progress-fill-221 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #60a5fa, #f472b6);
  border-radius: 3px;

  opacity: 1 !important;}

.ssos-progress-label-221 {
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: 500;

  opacity: 1 !important;}

/* 响应式 */
@media (max-width: 768px) {
  .ssos-title-221 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .ssos-scale-item-221 {
    padding: 40px 24px;
    max-width: 100%;
  
  opacity: 1 !important;}

  .ssos-container-221.ssos-multi-221 {
    flex-direction: column;
  }

  .ssos-small-221,
  .ssos-medium-221,
  .ssos-large-221 {
    width: 100%;
  
  opacity: 1 !important;}

  .ssos-image-wrapper-221 {
    height: 300px;
  
  opacity: 1 !important;}

  .ssos-image-layer-221 {
    width: 200px;
    height: 200px;
  
  opacity: 1 !important;}

  .ssos-progress-bar-221 {
    width: 200px;
  
  opacity: 1 !important;}
}
</style>
