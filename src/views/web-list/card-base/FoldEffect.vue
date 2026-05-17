<template>
  <div class="fold-effect-47">
    <div class="container-47">
      <h2 class="section-title-47">折叠效果</h2>

      <div class="fold-container-47">
        <div
          v-for="(img, index) in images"
          :key="index"
          ref="items"
          class="fold-panel-47"
          :style="{
            transformOrigin: index % 2 === 0 ? 'left' : 'right',
            transform: `rotateY(${openedPanels.includes(index) ? 0 : -90}deg)`
          }"
          @click="togglePanel(index)"
        >
          <div class="panel-front-47">
            <img :src="img" :alt="`Image ${index + 1}`" />
            <div class="panel-content-47">
              <span class="panel-number-47">{{ index + 1 }}</span>
              <h3 class="panel-title-47">{{ titles[index] }}</h3>
            </div>
          </div>
          <div class="panel-back-47">
            <div class="back-content-47">
              <h3>{{ titles[index] }}</h3>
              <p>点击折叠/展开</p>
            </div>
          </div>
        </div>
      </div>

      <button class="expand-all-btn-47" @click="toggleAll">全部展开/折叠</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const items = ref<HTMLElement[]>([])
const openedPanels = ref<number[]>([])
const images = [
  new URL('@/assets/image/1.png', import.meta.url).href,
  new URL('@/assets/image/2.png', import.meta.url).href,
  new URL('@/assets/image/3.png', import.meta.url).href,
  new URL('@/assets/image/4.png', import.meta.url).href,
  new URL('@/assets/image/5.png', import.meta.url).href,
  new URL('@/assets/image/6.png', import.meta.url).href
]

const titles = ['探索', '发现', '创造', '设计', '创新', '突破']

const togglePanel = (index: number) => {
  if (openedPanels.value.includes(index)) {
    openedPanels.value = openedPanels.value.filter(i => i !== index)
  } else {
    openedPanels.value.push(index)
  }
}

const toggleAll = () => {
  if (openedPanels.value.length === images.length) {
    openedPanels.value = []
  } else {
    openedPanels.value = Array.from({ length: images.length }, (_, i) => i)
  }
}

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.section-title-47', {
      scrollTrigger: {
        trigger: '.section-title-47',
        start: 'top 90%'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    items.value.forEach((item, index) => {
      const front = item.querySelector('.panel-front-47') as HTMLElement
      const img = item.querySelector('img') as HTMLElement
      const content = item.querySelector('.panel-content-47') as HTMLElement
      const number = item.querySelector('.panel-number-47') as HTMLElement

      // 折叠入场
      gsap.fromTo(
        item,
        {
          rotateY: -90,
          opacity: 0
        },
        {
          rotateY: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 45%',
            toggleActions: 'play none none reverse'
          },
          duration: 1,
          ease: 'power3.out',
          delay: index * 0.15
        }
      )

      // 图片缩放
      gsap.fromTo(
        img,
        { scale: 1.4 },
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

      // 滚动时轻微旋转
      gsap.to(item, {
        rotateY: index % 2 === 0 ? -10 : 10,
        scrollTrigger: {
          trigger: item,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1
        },
        ease: 'none'
      })

      // 内容淡入
      gsap.fromTo(
        content,
        { opacity: 0, y: 30 },
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

      // 数字旋转
      gsap.fromTo(
        number,
        { rotate: -180, scale: 0 },
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

    // 按钮动画
    gsap.from('.expand-all-btn-47', {
      scrollTrigger: {
        trigger: '.expand-all-btn-47',
        start: 'top 90%'
      },
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(2)'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.fold-effect-47 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #1a1a2e 0%, #4a1942 50%, #1a1a2e 100%);
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
      radial-gradient(circle at 20% 30%, rgba(237, 100, 166, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(102, 126, 234, 0.1) 0%, transparent 40%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.container-47 {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.section-title-47 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 80px;
  background: linear-gradient(135deg, #ed64a6 0%, #667eea 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(237, 100, 166, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #ed64a6, #667eea);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.fold-container-47 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 40px 0;
  perspective: 1000px;

  opacity: 1 !important;}

.fold-panel-47 {
  height: 400px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  width: 100%;

  opacity: 1 !important;}

.panel-front-47 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backface-visibility: hidden;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  background: #fff;

  opacity: 1 !important;}

.fold-panel-47 img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.fold-panel-47:hover img {
  filter: brightness(1.1) saturate(1.1);
}

.panel-content-47 {
  padding: 25px;
  background: linear-gradient(135deg, #ed64a6 0%, #667eea 100%);

  opacity: 1 !important;}

.panel-number-47 {
  display: block;
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  opacity: 0.9;
  margin-bottom: -15px;
  font-family: 'Arial', sans-serif;
}

.panel-title-47 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.panel-back-47 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #ed64a6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.back-content-47 {
  text-align: center;
  color: #fff;

  h3 {
    font-size: 1.8rem;
    margin: 0 0 10px;
  
  opacity: 1 !important;}

  p {
    font-size: 1rem;
    opacity: 0.9;
    margin: 0;
  }
}

.expand-all-btn-47 {
  display: block;
  margin: 60px auto 0;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #ed64a6 0%, #667eea 100%);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(237, 100, 166, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(237, 100, 166, 0.4);
  
  opacity: 1 !important;}

  &:active {
    transform: translateY(-1px);
  }
}

@media (max-width: 1024px) {
  .fold-container-47 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .fold-container-47 {
    grid-template-columns: 1fr;
  }

  .section-title-47 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
