<template>
  <div class="scroll-image-wave">
    <div class="wave-container" ref="container">
      <div class="wave-track" ref="track">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="wave-item"
          :class="`item-${index}`"
          :data-index="index"
        >
          <div class="wave-card" :style="{ '--delay': index * 0.1 }">
            <img
              :src="image.src"
              :alt="image.alt"
              class="wave-image"
            />
            <div class="wave-overlay">
              <h3>{{ image.title }}</h3>
              <p>{{ image.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wave-indicator">
      <div class="wave-lines">
        <span v-for="i in 5" :key="i" class="wave-line" :style="{ '--i': i }"></span>
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

const images = [
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    alt: 'Forest',
    title: '森林秘境',
    desc: '探索绿色世界'
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    alt: 'Mountain',
    title: '巍峨山川',
    desc: '攀登人生高峰'
  },
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600',
    alt: 'Waterfall',
    title: '瀑布飞流',
    desc: '感受自然力量'
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    alt: 'Beach',
    title: '海滨度假',
    desc: '享受阳光沙滩'
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600',
    alt: 'Nature',
    title: '自然风光',
    desc: '欣赏美景'
  }
]

// Initialize animations
const initAnimations = () => {
  const items = gsap.utils.toArray('.wave-item') as HTMLElement[]

  items.forEach((item, index) => {
    const card = item.querySelector('.wave-card') as HTMLElement
    const image = item.querySelector('.wave-image') as HTMLElement
    const overlay = item.querySelector('.wave-overlay') as HTMLElement

    // Wave animation
    gsap.fromTo(
      card,
      {
        y: 100,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1
        }
      }
    )

    // Parallax effect for image
    gsap.fromTo(
      image,
      {
        scale: 1.3,
        yPercent: -10
      },
      {
        scale: 1,
        yPercent: 0,
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
    gsap.fromTo(
      overlay,
      {
        yPercent: 30,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Wave lines animation
  const waveLines = gsap.utils.toArray('.wave-line') as HTMLElement[]
  waveLines.forEach((line) => {
    gsap.to(line, {
      scaleY: 1,
      ease: 'sine.inOut',
      scrollTrigger: {
        trigger: container.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    })
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
.scroll-image-wave {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  .wave-container {
    position: relative;
    width: 100%;

    .wave-track {
      display: flex;
      flex-direction: column;
      width: 100%;

      .wave-item {
        position: relative;
        width: 100%;
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;

        .wave-card {
          position: relative;
          width: 100%;
          max-width: 900px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);

          .wave-image {
            width: 100%;
            height: 70vh;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .wave-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 40px;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.95));

            h3 {
              font-size: 2rem;
              color: #fff;
              margin: 0 0 15px 0;
              text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
            }

            p {
              font-size: 1.1rem;
              color: rgba(255, 255, 255, 0.8);
              margin: 0;
              line-height: 1.6;
            }
          }
        }
      }
    }
  }

  .wave-indicator {
    position: fixed;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .wave-lines {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .wave-line {
        width: 4px;
        height: 40px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        transform-origin: bottom;
        transform: scaleY(var(--scale, 0.3));
        transition: transform 0.3s ease;

        @for $i from 1 through 5 {
          &:nth-child(#{$i}) {
            --scale: #{0.3 + ($i * 0.15)};
            animation: wave 1.5s ease-in-out infinite;
            animation-delay: calc(var(--i) * 0.2s);
          }
        }
      }
    }
  }
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(var(--scale));
  }
  50% {
    transform: scaleY(1);
  }
}

@media (max-width: 768px) {
  .scroll-image-wave {
    .wave-container {
      .wave-track {
        .wave-item {
          padding: 20px;

          .wave-card {
            .wave-image {
              height: 50vh;
            }

            .wave-overlay {
              padding: 20px;

              h3 {
                font-size: 1.5rem;
              }

              p {
                font-size: 0.9rem;
              }
            }
          }
        }
      }
    }

    .wave-indicator {
      right: 15px;

      .wave-lines {
        .wave-line {
          width: 3px;
          height: 30px;
        }
      }
    }
  }
}
</style>
