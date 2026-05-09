<template>
  <div class="scroll-image-panorama">
    <div class="panorama-container" ref="container">
      <div class="panorama-track" ref="track">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="panorama-item"
          :class="`item-${index}`"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            class="panorama-image"
            :data-x="image.x"
          />
          <div class="panorama-info">
            <h3>{{ image.title }}</h3>
            <p>{{ image.location }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="panorama-controls">
      <button class="control-btn prev" @click="prevImage">←</button>
      <div class="panorama-dots">
        <span
          v-for="(_, index) in images"
          :key="index"
          class="dot"
          :class="{ active: currentIndex === index }"
          @click="goToImage(index)"
        ></span>
      </div>
      <button class="control-btn next" @click="nextImage">→</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const container = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const currentIndex = ref(0)

const images = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600',
    alt: 'Mountain panorama',
    title: '阿尔卑斯山脉',
    location: '瑞士',
    x: 0
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1600',
    alt: 'Forest panorama',
    title: '黑森林',
    location: '德国',
    x: 100
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
    alt: 'Beach panorama',
    title: '马尔代夫',
    location: '印度洋',
    x: 200
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600',
    alt: 'Nature panorama',
    title: '大峡谷',
    location: '美国',
    x: 300
  }
]

const prevImage = () => {
  const newIndex = currentIndex.value > 0 ? currentIndex.value - 1 : images.length - 1
  goToImage(newIndex)
}

const nextImage = () => {
  const newIndex = currentIndex.value < images.length - 1 ? currentIndex.value + 1 : 0
  goToImage(newIndex)
}

const goToImage = (index: number) => {
  currentIndex.value = index
  
  // 安全检查
  if (!track.value) return
  
  const items = gsap.utils.toArray('.panorama-item') as HTMLElement[]
  const targetItem = items[index] as HTMLElement
  
  if (!targetItem || !targetItem.dataset) {
    console.warn('Target item not found or dataset undefined')
    return
  }
  
  const x = -parseFloat(targetItem.dataset.x || '0')

  gsap.to(track.value, {
    x: x,
    duration: 1,
    ease: 'power3.inOut'
  })
}

// Initialize animations
const initAnimations = () => {
  if (!container.value) {
    console.warn('Container not found')
    return
  }

  const items = gsap.utils.toArray('.panorama-item') as HTMLElement[]

  items.forEach((item, index) => {
    const image = item.querySelector('.panorama-image') as HTMLElement
    const info = item.querySelector('.panorama-info') as HTMLElement

    if (!image || !info) return

    // Parallax effect
    gsap.fromTo(
      image,
      {
        scale: 1.3,
        xPercent: index % 2 === 0 ? -5 : 5
      },
      {
        scale: 1,
        xPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'left right',
          end: 'right left',
          scrub: 1
        }
      }
    )

    // Info reveal
    gsap.fromTo(
      info,
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'left center',
          end: 'right center',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Auto-play on scroll
  ScrollTrigger.create({
    trigger: container.value,
    start: 'top center',
    end: 'bottom center',
    onUpdate: (self) => {
      const direction = self.direction
      if (direction === 1) {
        nextImage()
      } else if (direction === -1) {
        prevImage()
      }
    }
  })
}

// Auto-initialize on mount
onMounted(() => {
  // 等待DOM渲染完成
  setTimeout(() => {
    initAnimations()
  }, 100)
})

onUnmounted(() => {
  // 清理ScrollTrigger
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger === container.value) {
      trigger.kill()
    }
  })
})
</script>

<style scoped lang="scss">
.scroll-image-panorama {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  .panorama-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .panorama-track {
      display: flex;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;

      .panorama-item {
        flex: 0 0 100vw;
        width: 100vw;
        height: 100%;
        position: relative;
        overflow: hidden;

        .panorama-image {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          min-width: 100%;
          min-height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        
  opacity: 1 !important;}

        .panorama-info {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;

          h3 {
            font-size: 2.5rem;
            color: #fff;
            margin: 0 0 10px 0;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
          
  opacity: 1 !important;}

          p {
            font-size: 1.2rem;
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
          }
        }
      }
    }
  }

  .panorama-controls {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 20px;
    z-index: 100;

    .control-btn {
      width: 50px;
      height: 50px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      
  opacity: 1 !important;}
    }

    .panorama-dots {
      display: flex;
      gap: 10px;

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;

        &.active {
          background: #667eea;
          transform: scale(1.3);
        
  opacity: 1 !important;}

        &:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}

@media (max-width: 768px) {

  .scroll-image-panorama {
    .panorama-container {

      .panorama-track {
    .panorama-item {
          .panorama-info {
            bottom: 120px;

            h3 {
              font-size: 1.8rem;
            
  opacity: 1 !important;}

            p {
              font-size: 1rem;
            }
          }
        }
      }
    }

    .panorama-controls {
      bottom: 20px;
      gap: 15px;

      .control-btn {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      
  opacity: 1 !important;
  }


      .panorama-dots {
    .dot {
          width: 10px;
          height: 10px;
        
  opacity: 1 !important;}
      }
    }
  }
}
</style>
