<template>
  <section ref="shatterSection" class="is-section-227">
    <!-- 动态背景 -->
    <div class="is-bg-particles-227"></div>

    <div class="is-header-227">
      <h2 class="is-title-227">图片碎片爆炸</h2>
      <p class="is-subtitle-227">Image Shatter Explosion</p>
    </div>

    <!-- 碎片容器 -->
    <div class="is-shatter-container-227">
      <div
        ref="shatterImage"
        class="is-shatter-image-227"
        :style="shatterImageStyle"
      >
        <div
          v-for="shard in shards"
          :key="shard.id"
          :ref="el => { if (el) shardRefs[shard.id] = el as HTMLElement }"
          class="is-shard-227"
          :class="`is-shard-${shard.id}`"
          :style="shard.style"
        ></div>
      </div>

      <!-- 悬浮效果图片 -->
      <div ref="floatingImage" class="is-floating-image-227">
        <img :src="currentImage" alt="Shatter Image" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const shatterSection = ref<HTMLElement>()
const shatterImage = ref<HTMLElement>()
const floatingImage = ref<HTMLElement>()
const shardRefs = ref<Record<number, HTMLElement>>({})

// 当前图片索引
const currentImageIndex = ref(0)

// 图片列表
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href
]

const currentImage = computed(() => images[currentImageIndex.value])

// 碎片数据
const shards = ref<Array<{ id: number; style: Record<string, string> }>>([])

// 碎片图片样式
const shatterImageStyle = computed(() => ({
  backgroundImage: `url(${currentImage.value})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))

// 固定配置（由滚动控制效果）
const gridSize = 10
const intensity = 2.5

// 生成碎片
const generateShards = () => {
  const newShards: Array<{ id: number; style: Record<string, string> }> = []

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const id = row * gridSize + col
      const x = (col / gridSize) * 100
      const y = (row / gridSize) * 100
      const width = 100 / gridSize
      const height = 100 / gridSize

      newShards.push({
        id,
        style: {
          width: `${width}%`,
          height: `${height}%`,
          left: `${x}%`,
          top: `${y}%`,
          backgroundImage: `url(${currentImage.value})`,
          backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
          backgroundPosition: `${x * gridSize / 100}% ${y * gridSize / 100}%`,
          transform: 'translate3d(0, 0, 0)'
        }
      })
    }
  }

  shards.value = newShards
}

let ctx: gsap.Context

// 初始化碎片动画
const initShatterAnimation = () => {
  if (!shatterImage.value || !shatterSection.value) return

  ctx = gsap.context(() => {
    // 为每个碎片创建爆炸动画
    Object.values(shardRefs.value).forEach((shard, index) => {
      const angle = Math.random() * 360
      const distance = 50 + Math.random() * 100 * intensity
      const zDistance = 50 + Math.random() * 100 * intensity
      const rotation = Math.random() * 720 - 360

      gsap.from(shard, {
        x: 0,
        y: 0,
        z: 0,
        rotation: 0,
        opacity: 1,
        scrollTrigger: {
          trigger: shatterSection.value,
          start: 'top bottom',
          end: 'center center',
          scrub: 1.5
        },
        ease: 'power2.inOut'
      })

      // 悬停效果
      shard.addEventListener('mouseenter', () => {
        gsap.to(shard, {
          scale: 1.1,
          boxShadow: '0 0 20px rgba(244, 114, 182, 0.6)',
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      shard.addEventListener('mouseleave', () => {
        gsap.to(shard, {
          scale: 1,
          boxShadow: 'none',
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })

    // 悬浮图片淡入动画
    if (floatingImage.value) {
      gsap.from(floatingImage.value, {
        opacity: 0,
        scale: 0.5,
        scrollTrigger: {
          trigger: shatterSection.value,
          start: 'top 50%',
          end: 'center center',
          scrub: 1
        },
        ease: 'elastic.out(1, 0.5)'
      })
    }
  }, shatterSection.value)
}

onMounted(() => {
  setTimeout(() => {
    generateShards()
    setTimeout(() => {
      initShatterAnimation()
    }, 50)
  }, 200)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.is-section-227 {
  min-height: 100vh;
  padding: 60px 20px;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  position: relative;

  opacity: 1 !important;}

.is-bg-particles-227 {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(244, 114, 182, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(96, 165, 250, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
  animation: bgFloat 10s ease-in-out infinite;
}

@keyframes bgFloat {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-10px, -10px);
  }
}

.is-header-227 {
  text-align: center;
  margin-bottom: 40px;
  z-index: 10;

  opacity: 1 !important;}

.is-title-227 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
  animation: titleGlow 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes titleGlow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(167, 139, 250, 0.8));
  }
}

.is-subtitle-227 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 300;
  letter-spacing: 4px;

  opacity: 1 !important;}

// 碎片容器
.is-shatter-container-227 {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 600px;
  perspective: 1500px;
  margin-bottom: 40px;
  z-index: 10;

  opacity: 1 !important;}

.is-shatter-image-227 {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  opacity: 1 !important;}

.is-shard-227 {
  position: absolute;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;
  transition: box-shadow 0.3s;
  cursor: pointer;
  z-index: 1;

  &:hover {
    z-index: 10;
  }
}

.is-floating-image-227 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  pointer-events: none;
  z-index: 5;

  img {
    width: 100%;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 25px 80px rgba(244, 114, 182, 0.4);
    filter: brightness(1.2) contrast(1.1);
  
  opacity: 1 !important;}
}

@media (max-width: 768px) {
  .is-title-227 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .is-shatter-container-227 {
    height: 400px;
  
  opacity: 1 !important;}
}
</style>
