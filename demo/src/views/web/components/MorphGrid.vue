<template>
  <div class="mg-morph-grid-48">
    <div class="mg-container-48">
      <h2 class="mg-section-title-48">变形网格</h2>

      <div class="mg-grid-layout-48">
        <div
          class="mg-grid-cell-48"
          v-for="(img, index) in images"
          :key="index"
          :class="{ 'mg-expanded-48': expandedCell === index }"
          ref="items"
          @click="expandCell(index)"
        >
          <div class="mg-cell-inner-48">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="mg-cell-content-48">
              <span class="mg-cell-number-48">{{ index + 1 }}</span>
              <h3 class="mg-cell-title-48">{{ titles[index] }}</h3>
              <p class="mg-cell-desc-48">{{ descs[index] }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = ref<HTMLElement[]>([])
const expandedCell = ref<number | null>(null)
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

const titles = ['创意', '灵感', '设计', '艺术', '美学', '视觉']
const descs = ['无限可能', '源源不断', '精益求精', '追求卓越', '独特风格', '震撼效果']

const expandCell = (index: number) => {
  if (expandedCell.value === index) {
    expandedCell.value = null
  } else {
    expandedCell.value = index
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.mg-section-title-48', {
      scrollTrigger: {
        trigger: '.mg-section-title-48',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 网格入场
    gsap.from('.mg-grid-layout-48', {
      scrollTrigger: {
        trigger: '.mg-grid-layout-48',
        start: 'top 85%'
      },
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    items.value.forEach((item, index) => {
      const inner = item.querySelector('.mg-cell-inner-48') as HTMLElement
      const img = item.querySelector('img') as HTMLElement
      const content = item.querySelector('.mg-cell-content-48') as HTMLElement
      const number = item.querySelector('.mg-cell-number-48') as HTMLElement

      // 从中心扩散入场
      gsap.fromTo(item,
        {
          scale: 0.5,
          opacity: 0,
          borderRadius: '50%'
        },
        {
          scale: 1,
          opacity: 1,
          borderRadius: '16px',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 45%',
            toggleActions: 'play none none reverse'
          },
          duration: 1,
          ease: 'back.out(1.5)',
          delay: index * 0.1
        }
      )

      // 图片缩放
      gsap.fromTo(img,
        { scale: 1.3 },
        {
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 30%',
            scrub: true
          },
          ease: 'power2.out'
        }
      )

      // 内容淡入
      gsap.fromTo(content,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 30%',
            scrub: true
          }
        }
      )

      // 数字旋转缩放
      gsap.fromTo(number,
        { rotate: -360, scale: 0 },
        {
          rotate: 0,
          scale: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 65%',
            end: 'top 25%',
            scrub: true
          }
        }
      )
    })

    // 滚动时整体缩放
    gsap.to('.mg-grid-layout-48', {
      scale: 1.05,
      scrollTrigger: {
        trigger: '.mg-grid-layout-48',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.5
      },
      ease: 'power1.inOut'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.mg-morph-grid-48 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #0f0f23 0%, #1e3c72 50%, #0f0f23 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 40%, rgba(66, 220, 219, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 70% 60%, rgba(102, 126, 234, 0.1) 0%, transparent 40%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.mg-container-48 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.mg-section-title-48 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 80px;
  background: linear-gradient(135deg, #42dcce 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(66, 220, 219, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #42dcce, #667eea);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.mg-grid-layout-48 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 40px 0;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

  opacity: 1 !important;}

.mg-grid-cell-48 {
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  background: #fff;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;

  &.mg-expanded-48 {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) !important;
    width: 80vw;
    max-width: 1000px;
    height: 70vh;
    max-height: 800px;
    z-index: 100;
    border-radius: 24px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  
  opacity: 1 !important;}

  &:not(.expanded):hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  }
}

.mg-cell-inner-48 {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: filter 0.3s ease;

  .mg-grid-cell.expanded-48 & {
    height: 60%;
  }
}

.mg-grid-cell-48:hover img {
  filter: brightness(1.1) saturate(1.1);
}

.mg-cell-content-48 {
  padding: 25px;
  background: linear-gradient(135deg, #42dcce 0%, #667eea 100%);
  text-align: center;

  .mg-grid-cell.expanded-48 & {
    padding: 35px;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  
  opacity: 1 !important;}
}

.mg-cell-number-48 {
  display: block;
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  opacity: 0.9;
  margin-bottom: -10px;
  font-family: 'Arial', sans-serif;

  .mg-grid-cell.expanded-48 & {
    font-size: 4rem;
  }
}

.mg-cell-title-48 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px;

  .mg-grid-cell.expanded-48 & {
    font-size: 2rem;
  
  opacity: 1 !important;}
}

.mg-cell-desc-48 {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;

  .mg-grid-cell.expanded-48 & {
    font-size: 1.2rem;
  
  opacity: 1 !important;}
}

@media (max-width: 1024px) {
  .mg-grid-layout-48 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .mg-grid-layout-48 {
    grid-template-columns: 1fr;
  }

  .mg-section-title-48 {
    font-size: 2rem;
  
  opacity: 1 !important;}

  .mg-grid-cell.expanded-48 {
    width: 95vw;
    height: 80vh;
  
  opacity: 1 !important;}
}
</style>
