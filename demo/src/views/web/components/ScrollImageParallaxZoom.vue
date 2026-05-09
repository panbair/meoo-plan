<template>
  <div class="scroll-image-parallax-zoom">
    <div class="parallax-zoom-container" ref="container">
      <div class="parallax-zoom-wrapper" ref="wrapper">
        <img
          v-for="(img, index) in images"
          :key="index"
          :src="img.src"
          :alt="img.alt"
          class="parallax-zoom-image"
          :class="`image-${index}`"
          :data-speed="img.speed"
        />
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
    src: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    alt: 'Beautiful landscape',
    speed: 0.2
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    alt: 'Mountain view',
    speed: 0.4
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    alt: 'Nature scene',
    speed: 0.6
  },
  {
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800',
    alt: 'Forest',
    speed: 0.8
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    const imageElements = gsap.utils.toArray('.parallax-zoom-image') as HTMLElement[]

    imageElements.forEach((img) => {
      const speed = parseFloat(img.dataset.speed || '0.5')

      // Parallax effect
      gsap.to(img, {
        yPercent: -50 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: container.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })

      // Zoom effect on scroll
      gsap.fromTo(
        img,
        {
          scale: 1.1
        },
        {
          scale: 1.3,
          ease: 'none',
          scrollTrigger: {
            trigger: container.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      )

      // Fade in on enter
      gsap.from(img, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: img,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      })
    })
  }, container.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.scroll-image-parallax-zoom {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .parallax-zoom-container {
    position: relative;
    width: 100%;
    height: 100%;

    .parallax-zoom-wrapper {
      position: relative;
      width: 100%;
      height: 100%;

      .parallax-zoom-image {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s ease;

        &.image-0 {
          z-index: 1;
        }

        &.image-1 {
          z-index: 2;
        }

        &.image-2 {
          z-index: 3;
        }

        &.image-3 {
          z-index: 4;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .scroll-image-parallax-zoom {
    height: 80vh;
  
  opacity: 1 !important;}
}
</style>
