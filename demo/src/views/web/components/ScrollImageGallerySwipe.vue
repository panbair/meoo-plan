<template>
  <div class="scroll-image-gallery-swipe">
    <div class="gallery-swipe-container" ref="container">
      <div class="gallery-swipe-track" ref="track">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="gallery-swipe-item"
          :class="`item-${index}`"
        >
          <div class="image-card">
            <img :src="image.src" :alt="image.alt" class="gallery-image" />
            <div class="image-info">
              <h3>{{ image.title }}</h3>
              <p>{{ image.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gallery-indicator">
      <span class="progress-text">{{ currentIndex }} / {{ images.length }}</span>
      <div class="progress-bar">
        <div class="progress-fill" ref="progressFill"></div>
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
const track = ref<HTMLElement | null>(null)
const progressFill = ref<HTMLElement | null>(null)
const currentIndex = ref(1)

const images = [
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600',
    alt: 'Mountains',
    title: '壮丽山川',
    desc: '探索自然的壮丽景色'
  },
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600',
    alt: 'Waterfall',
    title: '飞流瀑布',
    desc: '感受大自然的震撼力量'
  },
  {
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    alt: 'Sunset',
    title: '落日余晖',
    desc: '享受美好的日落时光'
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    alt: 'Forest',
    title: '神秘森林',
    desc: '探索森林的神秘世界'
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    alt: 'Lake',
    title: '宁静湖泊',
    desc: '感受湖水的宁静之美'
  }
]

// Initialize animations
const initAnimations = () => {
  const items = gsap.utils.toArray('.gallery-swipe-item') as HTMLElement[]

  // Create the horizontal scroll animation once and reuse it
  const horizontalAnimation = gsap.to(track.value, {
    xPercent: -100 * (items.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: container.value,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: `+=${items.length * 100}%`,
      onUpdate: (self) => {
        const progress = self.progress
        currentIndex.value = Math.ceil(progress * items.length) || 1
        if (progressFill.value) {
          progressFill.value.style.width = `${progress * 100}%`
        }
      }
    }
  })

  // Staggered reveal for images
  items.forEach((item, index) => {
    gsap.from(item.querySelector('.image-card'), {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'left center',
        end: 'right center',
        containerAnimation: horizontalAnimation,
        toggleActions: 'play none none reverse'
      }
    })

    // Parallax effect within cards
    const image = item.querySelector('.gallery-image') as HTMLElement
    gsap.fromTo(
      image,
      {
        scale: 1.2,
        yPercent: -10
      },
      {
        scale: 1,
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'left right',
          end: 'right left',
          containerAnimation: horizontalAnimation,
          scrub: 1
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
.scroll-image-gallery-swipe {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  .gallery-swipe-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .gallery-swipe-track {
      display: flex;
      width: 100%;
      height: 100%;

      .gallery-swipe-item {
        flex: 0 0 100%;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;

        .image-card {
          position: relative;
          width: 100%;
          max-width: 600px;
          height: 70vh;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);

          .gallery-image {
            width: 100%;
            height: 80%;
            object-fit: cover;
            transition: transform 0.3s ease;
          
  opacity: 1 !important;}

          .image-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));

            h3 {
              font-size: 1.5rem;
              color: #fff;
              margin: 0 0 10px 0;
            
  opacity: 1 !important;}

            p {
              font-size: 0.9rem;
              color: rgba(255, 255, 255, 0.7);
              margin: 0;
            }
          }
        }
      }
    }
  }

  .gallery-indicator {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 20px;
    z-index: 10;

    .progress-text {
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
    
  opacity: 1 !important;}

    .progress-bar {
      width: 200px;
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 2px;
        transition: width 0.1s ease;
      
  opacity: 1 !important;}
    }
  }
}

@media (max-width: 768px) {
  .scroll-image-gallery-swipe {
    height: 80vh;


    .gallery-swipe-container {
    .gallery-swipe-track {
        .gallery-swipe-item {
          padding: 20px;

          .image-card {
            height: 60vh;
            max-width: 100%;

            .image-info {
              h3 {
                font-size: 1.2rem;
              
  opacity: 1 !important;}

              p {
                font-size: 0.8rem;
              }
            }
          }
        }
      }
    }

    .gallery-indicator {
      bottom: 20px;
      flex-direction: column;
      gap: 10px;

      .progress-bar {
        width: 150px;
      
  opacity: 1 !important;}
    }
  }
}
</style>
