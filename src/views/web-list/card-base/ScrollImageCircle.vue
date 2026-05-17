<template>
  <div class="scroll-image-circle">
    <div class="circle-container" ref="container">
      <div class="circle-wrapper" ref="wrapper">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="circle-item"
          :class="`item-${index}`"
          :data-index="index"
          :data-angle="index * angleStep"
        >
          <div class="circle-card">
            <img
              :src="image.src"
              :alt="image.alt"
              class="circle-image"
            />
            <div class="circle-overlay">
              <h3>{{ image.title }}</h3>
              <p>{{ image.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="circle-center">
      <div class="center-content">
        <h2>探索世界</h2>
        <p>滚动发现更多</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const container = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)

const images = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    alt: 'Mountain',
    title: '山脉',
    desc: '攀登高峰'
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400',
    alt: 'Forest',
    title: '森林',
    desc: '绿色世界'
  },
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400',
    alt: 'Waterfall',
    title: '瀑布',
    desc: '自然奇观'
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    alt: 'Beach',
    title: '海滩',
    desc: '阳光沙滩'
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    alt: 'Nature',
    title: '自然',
    desc: '生命奇迹'
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    alt: 'Lake',
    title: '湖泊',
    desc: '宁静水面'
  }
]

const angleStep = 360 / images.length

// Initialize animations
const initAnimations = () => {
  const items = gsap.utils.toArray('.circle-item') as HTMLElement[]

  // Initial positioning
  items.forEach((item) => { const angle = parseFloat(item.dataset.angle || '0')
    const radius = 300

    gsap.set(item, {
      rotation: angle,
      x: Math.cos((angle * Math.PI) / 180) * radius,
      y: Math.sin((angle * Math.PI) / 180) * radius
    })
  })

  // Rotation on scroll
  gsap.to(wrapper.value, {
    rotation: 360,
    ease: 'none',
    scrollTrigger: {
      trigger: container.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  })

  // Individual item animations
  items.forEach((item) => {
    const card = item.querySelector('.circle-card') as HTMLElement
    const image = item.querySelector('.circle-image') as HTMLElement
    const overlay = item.querySelector('.circle-overlay') as HTMLElement

    // Image scale
    gsap.fromTo(
      image,
      { scale: 1.2, opacity: 1 },
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

    // Card reveal
    gsap.from(card, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    // Overlay animation
    gsap.fromTo(
      overlay,
      {
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: item,
          start: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })
}



// Auto-initialize on mount
onMounted(() => {
  setTimeout(() => {
    initAnimations()
  }, 100)
})

</script>

<style scoped lang="scss">
.scroll-image-circle {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  overflow: hidden;

  .circle-container {
    position: relative;
    width: 100%;
    height: 100vh;

    .circle-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;

      .circle-item { position: absolute;
        top: 50%;
        left: 50%;
        width: 200px;
        height: 200px;
        margin-left: -100px;
        margin-top: -100px;

        .circle-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.1);
            border-color: rgba(102, 126, 234, 0.8);
      opacity: 1;
    }

          .circle-image { width: 100%;
            height: 100%;
            object-fit: cover;
      opacity: 1;
    }

          .circle-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
            text-align: center;

            h3 {
              font-size: 1.2rem;
              color: #fff;
              margin: 0 0 5px 0;
            
  opacity: 1 !important;}

            p {
              font-size: 0.8rem;
              color: rgba(255, 255, 255, 0.7);
              margin: 0;
            }
          }
        }
      }
    }
  }

  .circle-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.5);
    z-index: 10;

    .center-content {
      text-align: center;

      h2 {
        font-size: 2rem;
        color: #fff;
        margin: 0 0 10px 0;
      
  opacity: 1 !important;}

      p {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
      }
    }
  }
}

@media (max-width: 768px) {

  .scroll-image-circle {
    .circle-container {

      .circle-wrapper {
    .circle-item { width: 150px;
          height: 150px;
          margin-left: -75px;
          margin-top: -75px;


          .circle-card {
    .circle-overlay {
              padding: 10px;

              h3 {
                font-size: 1rem;
      opacity: 1;
    }

              p {
                font-size: 0.7rem;
              }
            }
          }
        }
      }
    }

    .circle-center {
      width: 180px;
      height: 180px;

      .center-content {
        h2 {
          font-size: 1.5rem;
        
  opacity: 1 !important;}

        p {
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style>
