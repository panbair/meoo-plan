<template>
  <div class="scroll-image-zoom-reveal">
    <div class="zoom-reveal-container" ref="container">
      <div class="zoom-reveal-wrapper" ref="wrapper">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="zoom-reveal-item"
          :class="`item-${index}`"
          :data-index="index"
        >
          <div class="zoom-image-container">
            <img
              :src="image.src"
              :alt="image.alt"
              class="zoom-image"
              :style="{ '--zoom-level': image.zoom }"
            />
            <div class="zoom-overlay">
              <h3>{{ image.title }}</h3>
              <p>{{ image.desc }}</p>
              <div class="zoom-level">
                <span>缩放倍数: {{ image.zoom }}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="zoom-progress">
      <div class="progress-track">
        <div class="progress-bar" ref="progressBar"></div>
      </div>
      <div class="progress-text" ref="progressText">0%</div>
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
const progressBar = ref<HTMLElement | null>(null)
const progressText = ref<HTMLElement | null>(null)

const images = [
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200',
    alt: 'Forest',
    title: '深林秘境',
    desc: '探索森林深处的秘密',
    zoom: 1.5
  },
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200',
    alt: 'Waterfall',
    title: '瀑布奇观',
    desc: '感受大自然的震撼力量',
    zoom: 1.8
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    alt: 'Mountain',
    title: '巍峨山峰',
    desc: '攀登人生的高峰',
    zoom: 2
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
    alt: 'Beach',
    title: '金色沙滩',
    desc: '享受海滨的悠闲时光',
    zoom: 1.6
  }
]

// Initialize animations
const initAnimations = () => {
  const items = gsap.utils.toArray('.zoom-reveal-item') as HTMLElement[]

  items.forEach((item) => {
    const image = item.querySelector('.zoom-image') as HTMLElement
    const overlay = item.querySelector('.zoom-overlay') as HTMLElement
    const zoomLevel = parseFloat(image.style.getPropertyValue('--zoom-level'))

    // Zoom reveal effect
    gsap.fromTo(
      image,
      {
        scale: zoomLevel
      },
      {
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'center center',
          scrub: 1
        }
      }
    )

    // Parallax movement
    gsap.to(image, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })

    // Overlay reveal
    gsap.fromTo(
      overlay,
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 40%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Text stagger animation
    const textElements = overlay.querySelectorAll('h3, p, .zoom-level')
    gsap.from(textElements, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 30%',
        toggleActions: 'play none none reverse'
      }
    })
  })

  // Progress tracking
  ScrollTrigger.create({
    trigger: container.value,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const progress = Math.round(self.progress * 100)
      if (progressBar.value) {
        progressBar.value.style.width = `${progress}%`
      }
      if (progressText.value) {
        progressText.value.textContent = `${progress}%`
      }
    }
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
.scroll-image-zoom-reveal {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);

  .zoom-reveal-container {
    position: relative;
    width: 100%;

    .zoom-reveal-wrapper {
      width: 100%;

      .zoom-reveal-item {
        position: relative;
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        .zoom-image-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;

          .zoom-image {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-width: 100%;
            min-height: 100%;
            object-fit: cover;
            scale: var(--zoom-level);
          
  opacity: 1 !important;}

          .zoom-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 60px;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.95));

            h3 {
              font-size: 3rem;
              color: #fff;
              margin: 0 0 20px 0;
              text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
            
  opacity: 1 !important;}

            p {
              font-size: 1.2rem;
              color: rgba(255, 255, 255, 0.8);
              margin: 0 0 20px 0;
              line-height: 1.8;
              max-width: 600px;
            }

            .zoom-level {
              display: inline-flex;
              align-items: center;
              gap: 10px;
              padding: 10px 20px;
              background: linear-gradient(135deg, #667eea, #764ba2);
              border-radius: 25px;
              font-size: 0.9rem;
              font-weight: 600;
              color: #fff;
              box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            
  opacity: 1 !important;}
          }
        }
      }
    }
  }

  .zoom-progress {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    padding: 15px 30px;

    .progress-track {
      width: 200px;
      height: 6px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      overflow: hidden;

      .progress-bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 3px;
        transition: width 0.1s ease;
      
  opacity: 1 !important;}
    }

    .progress-text {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      min-width: 50px;
      text-align: center;
    
  opacity: 1 !important;}
  }
}

@media (max-width: 768px) {

  .scroll-image-zoom-reveal {
    .zoom-reveal-container {

      .zoom-reveal-wrapper {
    .zoom-reveal-item {

          .zoom-image-container {
    .zoom-overlay {
              padding: 30px;

              h3 {
                font-size: 2rem;
              
  opacity: 1 !important;}

              p {
                font-size: 1rem;
              }
            }
          }
        }
      }
    }

    .zoom-progress {
      bottom: 20px;
      padding: 10px 20px;
      gap: 15px;

      .progress-track {
        width: 150px;
      
  opacity: 1 !important;}

      .progress-text {
        font-size: 0.9rem;
      
  opacity: 1 !important;}
    }
  }
}
</style>
