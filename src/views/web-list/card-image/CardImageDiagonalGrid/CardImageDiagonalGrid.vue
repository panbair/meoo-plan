<template>
  <div class="card-image-diagonal-grid" ref="parentRef">
    <div class="scene-container" ref="sceneRef">
      <!-- 背景图片 -->
      <div class="image-container" ref="imageContainerRef">
        <img
          ref="imageRef"
          :src="imageUrl"
          :alt="title"
          class="main-image"
        />
      </div>

      <!-- 斜向幕墙鳞片 -->
      <div class="facade-container" ref="facadeRef">
        <div
          v-for="(scale, index) in scales"
          :key="index"
          class="scale-panel"
          :ref="el => { if (el) scaleRefs[index] = el as HTMLElement }"
          :style="getScaleStyle(index)"
        >
          <div class="scale-highlight"></div>
        </div>
      </div>

      <!-- 四角框架阴影 -->
      <div class="corner-frame" ref="cornerFrameRef"></div>
    </div>

    <!-- 内容 -->
    <div class="content-overlay" ref="contentRef">
      <h2 class="title">{{ title }}</h2>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = { revert: () => void }

const props = withDefaults(defineProps<{
  imageUrl?: string
  title?: string
  subtitle?: string
}>(), {
  imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80',
  title: '斜格律动',
  subtitle: '幕墙鳞片逐格显影'
})

const parentRef = ref<HTMLElement | null>(null)
const sceneRef = ref<HTMLElement | null>(null)
const imageContainerRef = ref<HTMLElement | null>(null)
const facadeRef = ref<HTMLElement | null>(null)
const cornerFrameRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)

const scaleRefs = ref<(HTMLElement | null)[]>([])

let cleanupFns: TweenCleanup[] = []

// 生成鳞片配置：12列 x 7行 = 84片鳞片
const scales = Array.from({ length: 84 }, (_, i) => i)

const getScaleStyle = (index: number) => {
  const cols = 12
  const rows = 7
  const col = index % cols
  const row = Math.floor(index / cols)

  // 对角线方向：从左上到右下
  const diagonalOrder = col + row

  return {
    '--col': col,
    '--row': row,
    '--diagonal': diagonalOrder
  }
}

onMounted(() => {
  if (!parentRef.value) return

  const ctx = gsap.context(() => {
    // ========== 幕墙鳞片动画 ==========
    const validScales = scaleRefs.value.filter(Boolean)
    if (validScales.length > 0) {
      const facadeTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({
        revert: () => facadeTl.kill()
      })

      // 鳞片依次滑出：沿对角线方向，stagger 0.08
      validScales.forEach((scale, index) => {
        const col = index % 12
        const row = Math.floor(index / 12)

        // 计算斜向滑出方向：沿45度对角线向外
        const diagonalOffset = 100 // 滑出距离

        // 每片鳞片解锁动画
        facadeTl.fromTo(scale,
          {
            x: 0,
            y: 0,
            opacity: 1,
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
          },
          {
            x: diagonalOffset,
            y: diagonalOffset,
            opacity: 0,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            ease: 'power3.in',
            duration: 0.5
          },
          index * 0.08 // stagger 沿对角线方向
        )

        // 冷光刻线瞬间高亮
        const highlight = scale.querySelector('.scale-highlight')
        if (highlight) {
          facadeTl.fromTo(highlight,
            { opacity: 0 },
            { opacity: 0.8, duration: 0.05 },
            index * 0.08
          )
          facadeTl.to(highlight,
            { opacity: 0, duration: 0.15 },
            index * 0.08 + 0.05
          )
        }
      })
    }

    // ========== 图片亮度过渡 ==========
    if (imageRef.value) {
      const imageTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({
        revert: () => imageTl.kill()
      })

      // 鳞片滑出后，图片亮度渐升
      imageTl.fromTo(imageRef.value,
        { filter: 'brightness(0.75)' },
        { filter: 'brightness(1.0)', ease: 'power2.out', duration: 1 },
        0
      )
    }

    // ========== 四角框架阴影 ==========
    if (cornerFrameRef.value) {
      const cornerTl = gsap.timeline({
        scrollTrigger: {
          trigger: parentRef.value,
          start: 'top 100%',
          end: 'bottom 20%',
          scrub: 1.5
        }
      })

      cleanupFns.push({
        revert: () => cornerTl.kill()
      })

      // 框架阴影在鳞片滑完后渐显，并低频呼吸
      cornerTl.fromTo(cornerFrameRef.value,
        { opacity: 0 },
        { opacity: 1, ease: 'power2.inOut', duration: 0.8 },
        7 // 鳞片动画结束后
      )

      // 低频呼吸
      cornerTl.to(cornerFrameRef.value,
        { opacity: 0.3, duration: 3, ease: 'sine.inOut' },
        8
      )
      cornerTl.to(cornerFrameRef.value,
        { opacity: 1, duration: 3, ease: 'sine.inOut' },
        11
      )
    }

    // ========== 内容入场动画 ==========
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: parentRef.value,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1
      }
    })

    cleanupFns.push({
      revert: () => contentTl.kill()
    })

    if (contentRef.value) {
      contentTl.fromTo(contentRef.value,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, ease: 'power3.out' },
        0
      )
    }

  }, parentRef.value)
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn.revert?.())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.card-image-diagonal-grid {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0e14;
}

.scene-container {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1200px;
}

// ========== 背景图片 ==========
.image-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.75);
}

// ========== 斜向幕墙鳞片 ==========
.facade-container {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
}

.scale-panel {
  position: absolute;
  width: calc(100% / 12 + 1px);
  height: calc(100% / 7 + 1px);
  left: calc(var(--col) * (100% / 12));
  top: calc(var(--row) * (100% / 7));
  background: linear-gradient(
    135deg,
    #1a1f26 0%,
    #252b33 50%,
    #1a1f26 100%
  );
  transform-origin: center center;
  overflow: hidden;

  // 45度斜向切割
  &::before {
    content: '';
    position: absolute;
    inset: 2px;
    background: linear-gradient(
      45deg,
      #2a3040 0%,
      #1f242b 50%,
      #2a3040 100%
    );
  }

  // 精密网格纹理
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.02) 2px,
        rgba(255, 255, 255, 0.02) 4px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.02) 2px,
        rgba(255, 255, 255, 0.02) 4px
      );
  }
}

.scale-highlight {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(120, 180, 255, 0.6) 0%,
    rgba(100, 160, 220, 0.3) 50%,
    transparent 100%
  );
  opacity: 0;
  pointer-events: none;
}

// ========== 四角框架阴影 ==========
.corner-frame {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0;
  box-shadow:
    inset 0 0 100px rgba(0, 0, 0, 0.5),
    inset 0 0 200px rgba(0, 0, 0, 0.3);

  // 建筑框架边框
  &::before {
    content: '';
    position: absolute;
    inset: 20px;
    border: 1px solid rgba(100, 120, 140, 0.15);
  }

  // 四角装饰
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(80, 100, 120, 0.1) 0%, transparent 5%, transparent 95%, rgba(80, 100, 120, 0.1) 100%),
      linear-gradient(180deg, rgba(80, 100, 120, 0.1) 0%, transparent 5%, transparent 95%, rgba(80, 100, 120, 0.1) 100%);
  }
}

// ========== 内容层 ==========
.content-overlay {
  position: absolute;
  bottom: 12vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
  opacity: 0;
}

.title {
  font-family: 'Noto Serif SC', 'STSong', serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: transparent;
  background: linear-gradient(135deg,
    #e8f0f8 0%,
    #c8d8e8 30%,
    #a0b8c8 70%,
    #d0e0f0 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  letter-spacing: 0.4em;
  text-shadow: 0 0 40px rgba(200, 220, 240, 0.3);
  margin-bottom: 1rem;
}

.subtitle {
  font-family: 'Noto Sans SC', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(180, 200, 220, 0.7);
  letter-spacing: 0.5em;
  font-weight: 300;
}
</style>
