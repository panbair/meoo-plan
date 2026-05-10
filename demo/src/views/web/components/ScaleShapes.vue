<template>
  <div class="scale-shapes-38">
    <div class="ss-container-38">
      <h2 class="ss-section-title-38">缩放形状</h2>
      
      <div class="ss-shapes-container-38">
        <div 
          class="shape-item-38" 
          v-for="(shape, index) in shapes" 
          :key="index"
          :class="shape.className"
          ref="items"
        >
          <div class="ss-shape-inner-38">
            <div class="ss-shape-content-38">
              <span class="ss-shape-number-38">{{ index + 1 }}</span>
              <h3 class="ss-shape-name-38">{{ shape.name }}</h3>
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

interface Shape {
  name: string
  className: string
}

const shapes: Shape[] = [
  { name: 'Circle', className: 'circle' },
  { name: 'Square', className: 'square' },
  { name: 'Triangle', className: 'triangle' },
  { name: 'Diamond', className: 'diamond' },
  { name: 'Hexagon', className: 'hexagon' },
  { name: 'Star', className: 'star' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画 - 增强效果
    gsap.from('.ss-section-title-38', {
      scrollTrigger: {
        trigger: '.ss-section-title-38',
        start: 'top 85%'
      },
      y: 120,
      opacity: 0,
      scale: 0.5,
      rotationX: -45,
      duration: 1.5,
      ease: 'back.out(1.7)'
    })

    items.value.forEach((item, index) => {
      const inner = item.querySelector('.ss-shape-inner-38') as HTMLElement
      const content = item.querySelector('.ss-shape-content-38') as HTMLElement
      const number = item.querySelector('.ss-shape-number-38') as HTMLElement

      // 从中心缩放入场 - 增强效果
      gsap.fromTo(item,
        { scale: 0, opacity: 0, rotate: 360, y: 200 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          y: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 45%',
            toggleActions: 'play none none reverse'
          },
          duration: 1.5,
          ease: 'elastic.out(1, 0.6)',
          delay: index * 0.15
        }
      )

      // 内部缩放 - 增强效果
      gsap.fromTo(inner,
        { scale: 2.5, rotateZ: 180 },
        {
          scale: 1,
          rotateZ: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.5
          },
          ease: 'power2.out'
        }
      )

      // 滚动时旋转 - 增强效果
      gsap.to(inner, {
        rotate: 540,
        scrollTrigger: {
          trigger: item,
          start: 'top 100%',
          end: 'bottom 0%',
          scrub: 1.5
        },
        ease: 'none'
      })

      // 内容渐入 - 增强效果
      gsap.fromTo(content,
        { opacity: 0, scale: 0.3, rotateX: 90 },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1.5
          }
        }
      )

      // 数字旋转 - 增强效果
      gsap.fromTo(number,
        { rotate: -720, scale: 0, opacity: 0, y: 100 },
        {
          rotate: 0,
          scale: 1,
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: item,
            start: 'top 65%',
            end: 'top 25%',
            scrub: 1.5
          }
        }
      )
    })

    // 整体容器轻微旋转 - 增强效果
    gsap.to('.ss-shapes-container-38', {
      rotate: 10,
      scale: 1.02,
      scrollTrigger: {
        trigger: '.ss-shapes-container-38',
        start: 'top 100%',
        end: 'bottom 0%',
        scrub: 0.8
      },
      ease: 'none'
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.scale-shapes-38 {
  min-height: 100vh;
  padding: 100px 0;
  background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(123, 67, 151, 0.15) 0%, transparent 70%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.ss-container-38 {
  width: 100%;
  max-width: 1200px;
  padding: 0 40px;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.ss-section-title-38 {
  text-align: center;
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 100px;
  background: linear-gradient(135deg, #7b4397 0%, #dc2430 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(123, 67, 151, 0.5);

  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #7b4397, #dc2430);
    margin: 20px auto 0;
    border-radius: 2px;
  
  opacity: 1 !important;}
}

.ss-shapes-container-38 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
  padding: 60px 0;
  perspective: 1000px;

  opacity: 1 !important;}

.shape-item-38 {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.1);
  
  opacity: 1 !important;}

  &.circle-38 .ss-shape-inner-38 {
    border-radius: 50%;
  }

  &.square-38 .ss-shape-inner-38 {
    border-radius: 10px;
  }

  &.triangle-38 .ss-shape-inner-38 {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  }

  &.diamond-38 .ss-shape-inner-38 {
    transform: rotate(45deg);
    border-radius: 10px;
  }

  &.diamond-38 .ss-shape-content-38 {
    transform: rotate(-45deg);
  }

  &.hexagon-38 .ss-shape-inner-38 {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }

  &.star-38 .ss-shape-inner-38 {
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }
}

.ss-shape-inner-38 {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(123, 67, 151, 0.8) 0%, rgba(220, 36, 48, 0.8) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;

  opacity: 1 !important;}

.shape-item-38:hover .ss-shape-inner-38 {
  background: linear-gradient(135deg, rgba(123, 67, 151, 1) 0%, rgba(220, 36, 48, 1) 100%);

  opacity: 1 !important;}

.ss-shape-content-38 {
  text-align: center;
  color: #fff;
  z-index: 1;

  opacity: 1 !important;}

.ss-shape-number-38 {
  display: block;
  font-size: 3.5rem;
  font-weight: 900;
  opacity: 0.9;
  margin-bottom: -10px;
  font-family: 'Arial', sans-serif;
}

.ss-shape-name-38 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .ss-shapes-container-38 {
    grid-template-columns: repeat(2, 1fr);
  }

  .shape-item-38 {
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}

  .ss-shape-number-38 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .ss-section-title-38 {
    font-size: 2rem;
  
  opacity: 1 !important;}
}
</style>
