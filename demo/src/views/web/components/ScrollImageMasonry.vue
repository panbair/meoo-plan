<template>
  <div class="scroll-image-masonry">
    <div class="masonry-container" ref="container">
      <div class="masonry-grid" ref="grid">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="masonry-item"
          :class="`item-${index} size-${image.size}`"
          :data-index="index"
        >
          <div class="masonry-card">
            <img
              :src="image.src"
              :alt="image.alt"
              class="masonry-image"
              :style="{ aspectRatio: image.aspectRatio }"
            />
            <div class="masonry-overlay">
              <h3>{{ image.title }}</h3>
              <p>{{ image.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="masonry-stats">
      <div class="stat-item">
        <span class="stat-number" ref="statNumber">{{ images.length }}</span>
        <span class="stat-label">精美图片</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const container = ref<HTMLElement | null>(null)
const grid = ref<HTMLElement | null>(null)
const statNumber = ref<HTMLElement | null>(null)

const images = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    alt: 'Mountain',
    title: '雄伟山川',
    desc: '壮丽的自然风光',
    size: 'large',
    aspectRatio: '16/9'
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600',
    alt: 'Forest',
    title: '茂密森林',
    desc: '探索绿色世界',
    size: 'small',
    aspectRatio: '1/1'
  },
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
    alt: 'Lake',
    title: '宁静湖泊',
    desc: '感受水的温柔',
    size: 'small',
    aspectRatio: '3/4'
  },
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600',
    alt: 'Waterfall',
    title: '飞流直下',
    desc: '大自然的奇迹',
    size: 'medium',
    aspectRatio: '4/3'
  },
  {
    src: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=600',
    alt: 'Sunrise',
    title: '日出东方',
    desc: '迎接新的一天',
    size: 'medium',
    aspectRatio: '16/9'
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    alt: 'Beach',
    title: '海滨度假',
    desc: '享受阳光沙滩',
    size: 'large',
    aspectRatio: '16/9'
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
    alt: 'Trees',
    title: '参天大树',
    desc: '感受生命的力量',
    size: 'small',
    aspectRatio: '3/4'
  },
  {
    src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600',
    alt: 'Waterfall2',
    title: '瀑布群',
    desc: '自然奇观',
    size: 'small',
    aspectRatio: '1/1'
  },
  {
    src: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600',
    alt: 'Desert',
    title: '沙漠绿洲',
    desc: '生命的奇迹',
    size: 'medium',
    aspectRatio: '4/3'
  }
]

onMounted(() => {
  const items = gsap.utils.toArray('.masonry-item') as HTMLElement[]

  // Staggered reveal animation
  gsap.from(items, {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: {
      each: 0.1,
      from: 'center'
    },
    scrollTrigger: {
      trigger: grid.value,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse'
    }
  })

  // Scale effect on scroll
  items.forEach((item) => {
    const card = item.querySelector('.masonry-card') as HTMLElement
    const image = item.querySelector('.masonry-image') as HTMLElement
    const overlay = item.querySelector('.masonry-overlay') as HTMLElement

    // Image parallax
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

    // Card lift effect
    gsap.fromTo(
      card,
      {
        y: 20,
        rotationX: 10
      },
      {
        y: 0,
        rotationX: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1
        }
      }
    )

    // Overlay slide up
    gsap.fromTo(
      overlay,
      {
        yPercent: 50,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Stats counter animation
  if (statNumber.value) {
    gsap.from(statNumber.value, {
      innerText: 0,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: statNumber.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })
  }
})
</script>

<style scoped lang="scss">
.scroll-image-masonry {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  .masonry-container {
    max-width: 1400px;
    margin: 0 auto;

    .masonry-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      grid-auto-rows: 280px;
      gap: 20px;

      .masonry-item {
        position: relative;
        overflow: hidden;

        &.size-small {
          grid-row: span 1;
        }

        &.size-medium {
          grid-row: span 2;
        }

        &.size-large {
          grid-column: span 2;
          grid-row: span 2;
        }

        .masonry-card {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform-style: preserve-3d;

          .masonry-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
            opacity: 1;
          }

          .masonry-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 25px;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
            transform: translateZ(20px);

            h3 {
              font-size: 1.4rem;
              color: #fff;
              margin: 0 0 10px 0;
              text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
              opacity: 1 !important;
            }

            p {
              font-size: 0.9rem;
              color: rgba(255, 255, 255, 0.7);
              margin: 0;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }

  .masonry-stats {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 100;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    padding: 20px 30px;
    display: flex;
    align-items: center;
    gap: 15px;


    .stat-item {
    .stat-number {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        opacity: 1 !important;
      }

      .stat-label {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        opacity: 1 !important;
      }
    }
  }
}

@media (max-width: 1024px) {

  .scroll-image-masonry {
    .masonry-container {

      .masonry-grid {
    .masonry-item {
          &.size-large {
            grid-column: span 1;
          }
        }
      }
    }

    .masonry-stats {
      bottom: 20px;
      right: 20px;
      padding: 15px 20px;


      .stat-item {
    .stat-number {
          font-size: 1.5rem;
          opacity: 1 !important;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .scroll-image-masonry {
    padding: 40px 20px;


    .masonry-container {
    .masonry-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        grid-auto-rows: 250px;
        gap: 15px;


        .masonry-item {
    .masonry-card {
            .masonry-overlay {
              padding: 15px;

              h3 {
                font-size: 1.2rem;
                opacity: 1;
              }

              p {
                font-size: 0.8rem;
              }
            }
          }
        }
      }
    }

    .masonry-stats {
      display: none;
    }
  }
}
</style>
