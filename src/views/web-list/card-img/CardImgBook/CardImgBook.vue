<template>
  <div class="card-book">
    <div class="book-bg">
      <div class="bg-gradient"></div>
      <div class="bg-pattern"></div>
    </div>

    <div ref="parentRef" class="book-container">
      <!-- 背景书籍装饰 -->
      <div class="bookshelf-decoration">
        <div class="shelf-line"></div>
        <div class="book-spine" v-for="i in 5" :key="i"></div>
      </div>

      <!-- 书籍主体 -->
      <div ref="bookRef" class="book-wrapper">
        <!-- 书本阴影 -->
        <div ref="shadowRef" class="book-shadow"></div>

        <!-- 书页主体 -->
        <div ref="pageRef" class="book-page">
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=85"
            alt=""
          />
          <!-- 装订线高光 -->
          <div ref="spineLineRef" class="spine-highlight"></div>
        </div>

        <!-- 书页边缘纹理 -->
        <div class="page-edge"></div>
      </div>
    </div>

    <!-- 标题 -->
    <div ref="titleRef" class="book-title">
      <h2>Fine Binding</h2>
      <p>精装扉页</p>
    </div>

    <!-- 装饰 -->
    <div class="book-decoration">
      <div class="decoration-border left"></div>
      <div class="decoration-border right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const parentRef = ref<HTMLElement | null>(null)
const bookRef = ref<HTMLElement | null>(null)
const pageRef = ref<HTMLElement | null>(null)
const shadowRef = ref<HTMLElement | null>(null)
const spineLineRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

const cleanupFns: TweenCleanup[] = []

onMounted(() => {
  // 初始状态：从右侧滑入
  gsap.set(bookRef.value, {
    x: '120%',
    rotateY: -4,
    transformPerspective: 1000
  })
  gsap.set(pageRef.value, {
    filter: 'brightness(0.9) sepia(0.1)'
  })
  gsap.set(shadowRef.value, {
    x: 40,
    opacity: 0.6,
    skewX: -8
  })
  gsap.set(spineLineRef.value, { opacity: 0 })
  gsap.set(titleRef.value, { opacity: 0, x: -30 })

  const trigger = ScrollTrigger.create({
    trigger: parentRef.value,
    start: 'top 85%',
    end: 'bottom 20%',
    scrub: 1.5,
    onEnter: () => {
      gsap.set(bookRef.value, {
        x: '120%',
        rotateY: -4,
        transformPerspective: 1000
      })
      gsap.set(shadowRef.value, {
        x: 40,
        opacity: 0.6,
        skewX: -8
      })
      gsap.set(spineLineRef.value, { opacity: 0 })
    },
    onUpdate: (self) => {
      const p = self.progress
      const book = bookRef.value
      const page = pageRef.value
      const shadow = shadowRef.value

      if (!book || !page || !shadow) return

      // 主属性：translateX 和 rotateY
      // 使用 ease 曲线实现前段从容、中段提速、末段减速
      const moveP = Math.pow(p, 0.7) // 加速曲线
      const x = 120 * (1 - moveP)

      // 回弹效果（接近终点时）
      let bounceX = 0
      let bounceRotate = 0
      if (p >= 0.85) {
        const bounceP = (p - 0.85) / 0.15
        if (bounceP < 0.3) {
          // 轻微回弹
          bounceX = -3 * Math.sin(bounceP / 0.3 * Math.PI)
          bounceRotate = 0.5 * Math.sin(bounceP / 0.3 * Math.PI)
        } else if (bounceP < 0.6) {
          // 回落
          const settleP = (bounceP - 0.3) / 0.3
          bounceX = -3 * Math.cos((settleP) * Math.PI / 0.3) * 0.3
        }
      }

      // rotateY 在前段先扶正
      const rotateP = Math.min(p / 0.6, 1)
      const rotateY = -4 * (1 - Math.pow(rotateP, 0.8))

      gsap.set(book, {
        x: x + bounceX,
        rotateY: rotateY + bounceRotate
      })

      // 阴影变化：从侧边深长到底部均匀
      const shadowX = 40 * (1 - Math.pow(p, 0.5))
      const shadowOpacity = 0.6 * (1 - Math.pow(p, 0.6))
      const shadowSkew = -8 * (1 - Math.pow(p, 0.7))
      gsap.set(shadow, {
        x: shadowX,
        opacity: shadowOpacity,
        skewX: shadowSkew
      })

      // 图片亮度
      const brightness = 0.9 + 0.1 * Math.pow(p, 0.5)
      gsap.set(page, { filter: `brightness(${brightness}) sepia(${0.1 * (1 - p)})` })

      // 装订线高光（落位后呼吸）
      if (p >= 0.9) {
        const spineP = (p - 0.9) / 0.1
        const spineOpacity = 0.4 + 0.2 * Math.sin(Date.now() / 600)
        gsap.set(spineLineRef.value, { opacity: spineOpacity })
      }

      // 标题
      if (p >= 0.7) {
        const titleP = (p - 0.7) / 0.3
        gsap.set(titleRef.value, { opacity: titleP, x: -30 * (1 - titleP) })
      }
    },
    onLeaveBack: () => {
      gsap.set(bookRef.value, {
        x: '120%',
        rotateY: -4,
        transformPerspective: 1000
      })
      gsap.set(shadowRef.value, {
        x: 40,
        opacity: 0.6,
        skewX: -8
      })
      gsap.set(spineLineRef.value, { opacity: 0 })
      gsap.set(titleRef.value, { opacity: 0, x: -30 })
    }
  })

  cleanupFns.push(() => trigger.kill())

  // 装订线持续呼吸
  const spineAnim = gsap.to(spineLineRef.value, {
    opacity: 0.6,
    duration: 5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    paused: true
  })
  cleanupFns.push(() => spineAnim.kill())

  // 书架装饰动画
  const shelfAnim = gsap.fromTo(
    '.book-spine',
    { opacity: 0, y: 20 },
    {
      opacity: 0.3,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    }
  )
  cleanupFns.push(() => shelfAnim.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  cleanupFns.length = 0
})
</script>

<style scoped lang="scss">
.card-book {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1510 0%, #2a2018 50%, #1a1510 100%);
}

.book-bg {
  position: absolute;
  inset: 0;

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 40% 35% at 60% 50%, rgba(180, 140, 80, 0.06) 0%, transparent 70%);
  }

  .bg-pattern {
    position: absolute;
    inset: 0;
    opacity: 0.03;
    background-image:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 30px,
        rgba(180, 150, 100, 0.3) 30px,
        rgba(180, 150, 100, 0.3) 31px
      );
  }
}

.book-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bookshelf-decoration {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  .shelf-line {
    width: 200px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(160, 130, 80, 0.3), transparent);
    margin-bottom: 10px;
  }

  .book-spine {
    width: 8px;
    height: 30px;
    background: rgba(140, 110, 70, 0.3);
    border-radius: 1px;

    &:nth-child(2) { height: 35px; background: rgba(150, 120, 75, 0.25); }
    &:nth-child(3) { height: 28px; background: rgba(145, 115, 72, 0.28); }
    &:nth-child(4) { height: 32px; background: rgba(140, 110, 68, 0.22); }
    &:nth-child(5) { height: 26px; background: rgba(155, 125, 78, 0.26); }
  }
}

.book-wrapper {
  position: relative;
  transform-style: preserve-3d;
}

.book-shadow {
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 100%;
  height: 30px;
  background: radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
  pointer-events: none;
}

.book-page {
  position: relative;
  width: 420px;
  height: 560px;
  border-radius: 2px 6px 6px 2px;
  overflow: hidden;
  box-shadow:
    -3px 0 0 rgba(255, 250, 240, 0.1),
    0 20px 50px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(160, 120, 60, 0.1);
  transform-origin: left center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.spine-highlight {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    180deg,
    rgba(255, 250, 230, 0.6) 0%,
    rgba(255, 245, 220, 0.4) 50%,
    rgba(255, 250, 230, 0.6) 100%
  );
  pointer-events: none;
  box-shadow: 0 0 10px rgba(255, 250, 230, 0.3);
}

.page-edge {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 15px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(200, 180, 140, 0.1) 30%,
    rgba(180, 160, 120, 0.15) 70%,
    rgba(160, 140, 100, 0.1) 100%
  );
  border-radius: 0 6px 6px 0;
}

.book-title {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;

  h2 {
    font-size: 36px;
    font-weight: 300;
    color: #e8dcc8;
    margin: 0 0 10px;
    letter-spacing: 8px;
    text-transform: uppercase;
    text-shadow: 0 0 40px rgba(180, 150, 80, 0.3);
  }

  p {
    font-size: 14px;
    color: rgba(200, 180, 140, 0.5);
    margin: 0;
    letter-spacing: 6px;
  }
}

.book-decoration {
  .decoration-border {
    position: absolute;
    top: 50%;
    width: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(160, 130, 80, 0.3));

    &.left {
      left: 60px;
      background: linear-gradient(90deg, transparent, rgba(160, 130, 80, 0.3));
    }

    &.right {
      right: 60px;
      background: linear-gradient(270deg, transparent, rgba(160, 130, 80, 0.3));
    }
  }
}
</style>
