<template>
  <div class="scroll-image-stack-3d">
    <div class="stack-3d-container" ref="container">
      <div class="stack-3d-wrapper" ref="wrapper">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="stack-3d-item"
          :class="`item-${index}`"
          :data-index="index"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            class="stack-image"
            :style="{ '--index': index }"
          />
          <div class="image-overlay">
            <h3>{{ image.title }}</h3>
            <p>{{ image.desc }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="scroll-hint">
      <span>向下滚动探索</span>
      <div class="scroll-arrow">↓</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const container = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)

const images = [
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    alt: 'Beach',
    title: '阳光沙滩',
    desc: '享受海滨度假的惬意时光'
  },
  {
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    alt: 'Swiss Alps',
    title: '瑞士雪山',
    desc: '探索壮丽的阿尔卑斯山脉'
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    alt: 'Ocean',
    title: '蔚蓝海洋',
    desc: '感受大海的无穷魅力'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    alt: 'Desert',
    title: '金色沙漠',
    desc: '体验沙漠的神秘与壮美'
  },
  {
    src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    alt: 'Night Sky',
    title: '星空璀璨',
    desc: '仰望满天繁星的浪漫'
  }
]

onMounted(() => {
  const items = gsap.utils.toArray('.stack-3d-item') as HTMLElement[]

  // 3D stack animation
  items.forEach((item, index) => {
    const depth = index * 100
    const rotation = index * 5

    // Initial state
    gsap.set(item, {
      transform: `translateZ(-${depth}px) rotateX(${rotation}deg)`,
      opacity: index === 0 ? 1 : 0.3,
      scale: 1 - index * 0.1
    })

    // Animate on scroll
    gsap.to(item, {
      transform: `translateZ(0px) rotateX(0deg)`,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 60%',
        end: 'top 30%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const zIndex = Math.floor(progress * 10)
          item.style.zIndex = zIndex.toString()
        }
      }
    })

    // Parallax effect for image inside
    const image = item.querySelector('.stack-image') as HTMLElement
    gsap.fromTo(
      image,
      {
        scale: 1.3
      },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    )

    // Overlay reveal
    const overlay = item.querySelector('.image-overlay') as HTMLElement
    gsap.from(overlay, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 40%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Scroll hint animation
  gsap.to('.scroll-hint', {
    opacity: 0,
    duration: 0.5,
    scrollTrigger: {
      trigger: container.value,
      start: 'top 20%',
      end: 'top 10%',
      scrub: true
    }
  })
})
</script>

<style scoped lang="scss">
.scroll-image-stack-3d {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  perspective: 2000px;

  .stack-3d-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .stack-3d-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;

      .stack-3d-item {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        max-width: 900px;
        aspect-ratio: 16/9;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
        transform-style: preserve-3d;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);

        .stack-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        
  opacity: 1 !important;}

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
          transform: translateZ(50px);

          h3 {
            font-size: 2rem;
            color: #fff;
            margin: 0 0 15px 0;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          
  opacity: 1 !important;}

          p {
            font-size: 1rem;
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            line-height: 1.6;
          }
        }
      }
    }
  }

  .scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 10;

    span {
      display: block;
      color: #fff;
      font-size: 0.9rem;
      margin-bottom: 10px;
    
  opacity: 1 !important;}

    .scroll-arrow {
      font-size: 2rem;
      color: #667eea;
      animation: bounce 2s infinite;
    
  opacity: 1 !important;}
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .scroll-image-stack-3d {
    height: 80vh;


    .stack-3d-container {
    .stack-3d-wrapper {
        .stack-3d-item {
          width: 90%;
          max-width: 100%;

          .image-overlay {
            padding: 20px;

            h3 {
              font-size: 1.5rem;
            
  opacity: 1 !important;}

            p {
              font-size: 0.9rem;
            }
          }
        }
      }
    }
  }
}
</style>
