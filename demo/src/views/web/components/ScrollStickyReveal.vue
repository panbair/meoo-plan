<template>
  <div class="scroll-sticky-reveal-wrapper-219">
    <!-- 粘性标题 -->
    <div class="ssr-sticky-header-219">
      <h2 class="ssr-sticky-title-219">粘性揭示效果</h2>
      <p class="ssr-sticky-subtitle-219">向下滚动，观察内容如何逐渐揭示</p>
    </div>

    <!-- 粘性揭示区域 1 -->
    <section class="ssr-sticky-section-219">
      <div ref="stickyContent1" class="ssr-sticky-content-219">
        <div class="ssr-sticky-card-219 ssr-purple-219">
          <div class="ssr-card-number-219">01</div>
          <h3 class="ssr-card-title-219">初始状态</h3>
          <p class="ssr-card-desc-219">
            元素固定在顶部，内容逐渐从底部向上滚动揭示。随着滚动进度，内容会逐渐展示完整。
          </p>
          <div class="ssr-card-visual-219">
            <div class="ssr-progress-bar-219">
              <div ref="progress1" class="ssr-progress-fill-219"></div>
            </div>
            <span class="ssr-progress-text-219">揭示进度</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 粘性揭示区域 2 -->
    <section class="ssr-sticky-section-219">
      <div ref="stickyContent2" class="ssr-sticky-content-219">
        <div class="ssr-sticky-card-219 ssr-blue-219">
          <div class="ssr-card-number-219">02</div>
          <h3 class="ssr-card-title-219">逐渐展开</h3>
          <p class="ssr-card-desc-219">
            继续滚动，第二张卡片固定在顶部。内容从边缘逐渐展开，创造出流畅的视觉过渡效果。
          </p>
          <div class="ssr-card-visual-219">
            <div class="ssr-expand-animation-219">
              <div ref="expand1" class="ssr-expand-item-219"></div>
              <div ref="expand2" class="ssr-expand-item-219"></div>
              <div ref="expand3" class="ssr-expand-item-219"></div>
            </div>
            <span class="ssr-progress-text-219">展开动画</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 粘性揭示区域 3 -->
    <section class="ssr-sticky-section-219">
      <div ref="stickyContent3" class="ssr-sticky-content-219">
        <div class="ssr-sticky-card-219 ssr-pink-219">
          <div class="ssr-card-number-219">03</div>
          <h3 class="ssr-card-title-219">完全揭示</h3>
          <p class="ssr-card-desc-219">
            第三张卡片固定，内容完全展示。所有元素都平滑过渡，形成一个连贯的视觉叙事流程。
          </p>
          <div class="ssr-card-visual-219">
            <div class="ssr-reveal-grid-219">
              <div v-for="i in 9" :key="i" :ref="el => { if (el) gridItems[i-1] = el }" class="ssr-grid-cell-219"></div>
            </div>
            <span class="ssr-progress-text-219">网格揭示</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 粘性揭示区域 4 - 多段内容 -->
    <section class="ssr-sticky-section-219 ssr-tall-219">
      <div ref="stickyContent4" class="ssr-sticky-content-219">
        <div class="ssr-sticky-card-219 ssr-green-219">
          <div class="ssr-card-number-219">04</div>
          <h3 class="ssr-card-title-219">分段揭示</h3>
          <p class="ssr-card-desc-219">
            长内容分段显示，每段内容在滚动时逐渐揭示，最后完整展示所有信息。
          </p>

          <!-- 分段内容 -->
          <div class="ssr-segments-219">
            <div ref="segment1" class="ssr-segment-219">
              <h4 class="ssr-segment-title-219">第一段</h4>
              <p class="ssr-segment-text-219">
                这是第一段内容，在滚动初期揭示。粘性效果让用户体验更加流畅和连贯。
              </p>
            </div>
            <div ref="segment2" class="ssr-segment-219">
              <h4 class="ssr-segment-title-219">第二段</h4>
              <p class="ssr-segment-text-219">
                这是第二段内容，在中期滚动时展示。每一段都有独特的动画效果。
              </p>
            </div>
            <div ref="segment3" class="ssr-segment-219">
              <h4 class="ssr-segment-title-219">第三段</h4>
              <p class="ssr-segment-text-219">
                这是第三段内容，在滚动后期展示。所有内容组合成一个完整的故事。
              </p>
            </div>
            <div ref="segment4" class="ssr-segment-219">
              <h4 class="ssr-segment-title-219">第四段</h4>
              <p class="ssr-segment-text-219">
                这是最后一段内容，完全揭示后展示。粘性揭示技术创造了沉浸式体验。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 粘性揭示区域 5 - 图像揭示 -->
    <section class="ssr-sticky-section-219">
      <div ref="stickyContent5" class="ssr-sticky-content-219">
        <div class="ssr-sticky-card-219 ssr-orange-219">
          <div class="ssr-card-number-219">05</div>
          <h3 class="ssr-card-title-219">图像揭示</h3>
          <p class="ssr-card-desc-219">
            图像从底部逐渐揭示，配合文字动画，创造出动态的视觉效果。
          </p>
          <div class="ssr-image-reveal-219">
            <div ref="imageLayer1" class="ssr-image-layer-219 ssr-layer-1-219"></div>
            <div ref="imageLayer2" class="ssr-image-layer-219 ssr-layer-2-219"></div>
            <div ref="imageLayer3" class="ssr-image-layer-219 ssr-layer-3-219"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 粘性揭示区域 6 - 圆环揭示 -->
    <section class="ssr-sticky-section-219">
      <div ref="stickyContent6" class="ssr-sticky-content-219">
        <div class="ssr-sticky-card-219 ssr-cyan-219">
          <div class="ssr-card-number-219">06</div>
          <h3 class="ssr-card-title-219">圆环揭示</h3>
          <p class="ssr-card-desc-219">
            圆环从中心向外扩散揭示，配合内容淡入，展现出独特的视觉效果。
          </p>
          <div class="ssr-circles-reveal-219">
            <div ref="circle1" class="ssr-circle-219"></div>
            <div ref="circle2" class="ssr-circle-219"></div>
            <div ref="circle3" class="ssr-circle-219"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 元素引用
const stickyContent1 = ref<HTMLElement | null>(null)
const stickyContent2 = ref<HTMLElement | null>(null)
const stickyContent3 = ref<HTMLElement | null>(null)
const stickyContent4 = ref<HTMLElement | null>(null)
const stickyContent5 = ref<HTMLElement | null>(null)
const stickyContent6 = ref<HTMLElement | null>(null)

const progress1 = ref<HTMLElement | null>(null)
const expand1 = ref<HTMLElement | null>(null)
const expand2 = ref<HTMLElement | null>(null)
const expand3 = ref<HTMLElement | null>(null)
const gridItems = ref<(HTMLElement | null)[]>([])

const segment1 = ref<HTMLElement | null>(null)
const segment2 = ref<HTMLElement | null>(null)
const segment3 = ref<HTMLElement | null>(null)
const segment4 = ref<HTMLElement | null>(null)

const imageLayer1 = ref<HTMLElement | null>(null)
const imageLayer2 = ref<HTMLElement | null>(null)
const imageLayer3 = ref<HTMLElement | null>(null)

const circle1 = ref<HTMLElement | null>(null)
const circle2 = ref<HTMLElement | null>(null)
const circle3 = ref<HTMLElement | null>(null)

let triggers: any[] = []

onMounted(() => {
  // 粘性揭示 1 - 进度条动画
  const trigger1 = gsap.to(progress1.value, {
    width: '100%',
    scrollTrigger: {
      trigger: stickyContent1.value,
      start: 'top top',
      end: 'bottom center',
      scrub: 1
    }
  })
  triggers.push(trigger1)

  // 粘性揭示 2 - 展开动画
  const trigger2 = gsap.timeline({
    scrollTrigger: {
      trigger: stickyContent2.value,
      start: 'top top',
      end: 'bottom center',
      scrub: 1
    }
  })

  trigger2.to(expand1.value, { width: '100%' })
  trigger2.to(expand2.value, { width: '100%' }, '-=0.3')
  trigger2.to(expand3.value, { width: '100%' }, '-=0.3')
  triggers.push(trigger2)

  // 粘性揭示 3 - 网格揭示
  const trigger3 = gsap.fromTo(
    gridItems.value.filter(Boolean),
    {
      scale: 0,
      opacity: 0
    },
    {
      scale: 1,
      opacity: 1,
      stagger: 0.1,
      scrollTrigger: {
        trigger: stickyContent3.value,
        start: 'top top',
        end: 'bottom center',
        scrub: 1
      }
    }
  )
  triggers.push(trigger3)

  // 粘性揭示 4 - 分段揭示
  const trigger4 = gsap.timeline({
    scrollTrigger: {
      trigger: stickyContent4.value,
      start: 'top top',
      end: 'bottom center',
      scrub: 1
    }
  })

  trigger4.fromTo(
    segment1.value,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1 }
  )
  trigger4.fromTo(
    segment2.value,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1 },
    '-=0.5'
  )
  trigger4.fromTo(
    segment3.value,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1 },
    '-=0.5'
  )
  trigger4.fromTo(
    segment4.value,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1 },
    '-=0.5'
  )
  triggers.push(trigger4)

  // 粘性揭示 5 - 图像揭示
  const trigger5 = gsap.timeline({
    scrollTrigger: {
      trigger: stickyContent5.value,
      start: 'top top',
      end: 'bottom center',
      scrub: 1
    }
  })

  trigger5.fromTo(
    imageLayer1.value,
    { y: 300, opacity: 0 },
    { y: 0, opacity: 1 }
  )
  trigger5.fromTo(
    imageLayer2.value,
    { y: 300, opacity: 0 },
    { y: 0, opacity: 1 },
    '-=0.5'
  )
  trigger5.fromTo(
    imageLayer3.value,
    { y: 300, opacity: 0 },
    { y: 0, opacity: 1 },
    '-=0.5'
  )
  triggers.push(trigger5)

  // 粘性揭示 6 - 圆环揭示
  const trigger6 = gsap.timeline({
    scrollTrigger: {
      trigger: stickyContent6.value,
      start: 'top top',
      end: 'bottom center',
      scrub: 1
    }
  })

  trigger6.fromTo(
    circle1.value,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1 }
  )
  trigger6.fromTo(
    circle2.value,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1 },
    '-=0.5'
  )
  trigger6.fromTo(
    circle3.value,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1 },
    '-=0.5'
  )
  triggers.push(trigger6)
})

onUnmounted(() => {
  // 清理所有 ScrollTrigger
  triggers.forEach(trigger => trigger.kill())
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.scroll-sticky-reveal-wrapper-219 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);

  opacity: 1 !important;}

/* 粘性标题 */
.ssr-sticky-header-219 {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 40px 20px;
  background: rgba(15, 15, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;

  opacity: 1 !important;}

.ssr-sticky-title-219 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.ssr-sticky-subtitle-219 {
  font-size: 1.1rem;
  color: #94a3b8;

  opacity: 1 !important;}

/* 粘性区域 */
.ssr-sticky-section-219 {
  position: relative;
  height: 150vh;

  opacity: 1 !important;}

.ssr-sticky-section-219.ssr-tall-219 {
  height: 200vh;

  opacity: 1 !important;}

.ssr-sticky-content-219 {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  opacity: 1 !important;}

/* 粘性卡片 */
.ssr-sticky-card-219 {
  max-width: 800px;
  width: 100%;
  padding: 60px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  backdrop-filter: blur(20px);

  opacity: 1 !important;}

.ssr-purple-219 {
  border-color: rgba(167, 139, 250, 0.3);
  box-shadow: 0 20px 60px rgba(167, 139, 250, 0.2);

  opacity: 1 !important;}

.ssr-blue-219 {
  border-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 20px 60px rgba(96, 165, 250, 0.2);

  opacity: 1 !important;}

.ssr-pink-219 {
  border-color: rgba(244, 114, 182, 0.3);
  box-shadow: 0 20px 60px rgba(244, 114, 182, 0.2);

  opacity: 1 !important;}

.ssr-green-219 {
  border-color: rgba(74, 222, 128, 0.3);
  box-shadow: 0 20px 60px rgba(74, 222, 128, 0.2);

  opacity: 1 !important;}

.ssr-orange-219 {
  border-color: rgba(251, 146, 60, 0.3);
  box-shadow: 0 20px 60px rgba(251, 146, 60, 0.2);

  opacity: 1 !important;}

.ssr-cyan-219 {
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow: 0 20px 60px rgba(34, 211, 238, 0.2);

  opacity: 1 !important;}

.ssr-card-number-219 {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  font-weight: 900;
  color: #fff;

  opacity: 1 !important;}

.ssr-card-title-219 {
  font-size: 2rem;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 16px;

  opacity: 1 !important;}

.ssr-card-desc-219 {
  font-size: 1.1rem;
  color: #94a3b8;
  line-height: 1.8;
  margin-bottom: 40px;

  opacity: 1 !important;}

/* 卡片视觉 */
.ssr-card-visual-219 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

/* 进度条 */
.ssr-progress-bar-219 {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;

  opacity: 1 !important;}

.ssr-progress-fill-219 {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #60a5fa);
  border-radius: 4px;

  opacity: 1 !important;}

.ssr-progress-text-219 {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;

  opacity: 1 !important;}

/* 展开动画 */
.ssr-expand-animation-219 {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;

  opacity: 1 !important;}

.ssr-expand-item-219 {
  width: 0;
  height: 12px;
  background: linear-gradient(90deg, #60a5fa, #34d399);
  border-radius: 6px;

  opacity: 1 !important;}

/* 网格揭示 */
.ssr-reveal-grid-219 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.ssr-grid-cell-219 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f472b6, #ec4899);
  border-radius: 12px;

  opacity: 1 !important;}

/* 分段内容 */
.ssr-segments-219 {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ssr-segment-219 {
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transform: translateY(100px);
  opacity: 0;
}

.ssr-segment-title-219 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;

  opacity: 1 !important;}

.ssr-segment-text-219 {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.6;

  opacity: 1 !important;}

/* 图像揭示 */
.ssr-image-reveal-219 {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 16px;

  opacity: 1 !important;}

.ssr-image-layer-219 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;

  opacity: 1 !important;}

.ssr-layer-1-219 {
  background: linear-gradient(135deg, #fb923c, #f97316);

  opacity: 1 !important;}

.ssr-layer-2-219 {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);

  opacity: 1 !important;}

.ssr-layer-3-219 {
  background: linear-gradient(135deg, #2dd4bf, #14b8a6);

  opacity: 1 !important;}

/* 圆环揭示 */
.ssr-circles-reveal-219 {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1 !important;}

.ssr-circle-219 {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #22d3ee, #06b6d4);

  opacity: 1 !important;}

.ssr-circle-219:nth-child(1) {
  width: 200px;
  height: 200px;
  opacity: 0.3;
}

.ssr-circle-219:nth-child(2) {
  width: 140px;
  height: 140px;
  opacity: 0.5;
}

.ssr-circle-219:nth-child(3) {
  width: 80px;
  height: 80px;
  opacity: 1;
}

/* 响应式 */
@media (max-width: 768px) {
  .ssr-sticky-card-219 {
    padding: 40px 24px;
  
  opacity: 1 !important;}

  .ssr-card-number-219 {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  
  opacity: 1 !important;}

  .ssr-card-title-219 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}

  .ssr-card-desc-219 {
    font-size: 1rem;
  
  opacity: 1 !important;}

  .ssr-sticky-section-219 {
    height: 120vh;
  
  opacity: 1 !important;}

  .ssr-sticky-section-219.ssr-tall-219 {
    height: 160vh;
  
  opacity: 1 !important;}

  .ssr-image-reveal-219 {
    height: 150px;
  
  opacity: 1 !important;}

  .ssr-circles-reveal-219 {
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}

  .ssr-circle-219:nth-child(1) {
    width: 150px;
    height: 150px;
  }

  .ssr-circle-219:nth-child(2) {
    width: 105px;
    height: 105px;
  }

  .ssr-circle-219:nth-child(3) {
    width: 60px;
    height: 60px;
  }
}
</style>
