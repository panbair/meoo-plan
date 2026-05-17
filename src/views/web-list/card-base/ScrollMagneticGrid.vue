<template>
  <div class="smg-magnetic-grid-section-152" ref="componentRoot">
    <div class="smg-container-152">
      <h2 class="smg-title-152">磁性网格</h2>
      <p class="smg-subtitle-152">Magnetic Grid Effect</p>

      <div class="smg-grid-152" ref="grid">
        <div
          v-for="(item, index) in gridItems"
          :key="index"
          class="smg-grid-item-152"
          @mouseenter="handleMagneticEnter"
          @mouseleave="handleMagneticLeave"
          @mousemove="handleMagneticMove"
        >
          <div class="smg-item-content-152">
            <div class="smg-item-icon-152">{{ item.icon }}</div>
            <h3 class="smg-item-title-152">{{ item.title }}</h3>
            <p class="smg-item-desc-152">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <div class="smg-magnetic-field-152"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()
const grid = ref<HTMLElement>()

interface GridItem {
  icon: string
  title: string
  description: string
}

const gridItems = ref<GridItem[]>([
  { icon: '🎨', title: '设计', description: '创意设计' },
  { icon: '💻', title: '开发', description: '技术开发' },
  { icon: '🚀', title: '创新', description: '创新思维' },
  { icon: '🌟', title: '品质', description: '品质保证' },
  { icon: '🎯', title: '目标', description: '目标达成' },
  { icon: '💡', title: '灵感', description: '灵感激发' },
  { icon: '🔮', title: '未来', description: '未来展望' },
  { icon: '✨', title: '卓越', description: '卓越表现' },
  { icon: '🎪', title: '创意', description: '创意无限' }
])

let activeItem: HTMLElement | null = null

const handleMagneticEnter = (event: MouseEvent) => {
  activeItem = event.currentTarget as HTMLElement

  gsap.to(activeItem, {
    scale: 1.1,
    boxShadow: '0 20px 50px rgba(236, 72, 153, 0.3)',
    duration: 0.4,
    ease: 'power2.out'
  })

  const content = activeItem.querySelector('.smg-item-content-152') as HTMLElement
  gsap.to(content, {
    y: -5,
    duration: 0.3,
    ease: 'power2.out'
  })

  const icon = activeItem.querySelector('.smg-item-icon-152') as HTMLElement
  gsap.to(icon, {
    scale: 1.2,
    rotation: 10,
    duration: 0.4,
    ease: 'back.out(1.5)'
  })
}

const handleMagneticLeave = () => {
  if (!activeItem) return

  gsap.to(activeItem, {
    scale: 1,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    x: 0,
    y: 0,
    duration: 0.6,
    ease: 'elastic.out(1, 0.5)'
  })

  const content = activeItem.querySelector('.smg-item-content-152') as HTMLElement
  gsap.to(content, {
    y: 0,
    duration: 0.3,
    ease: 'power2.out'
  })

  const icon = activeItem.querySelector('.smg-item-icon-152') as HTMLElement
  gsap.to(icon, {
    scale: 1,
    rotation: 0,
    duration: 0.4,
    ease: 'power2.out'
  })

  activeItem = null
}

const handleMagneticMove = (event: MouseEvent) => {
  if (!activeItem || !grid.value) return

  const rect = grid.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const mouseX = event.clientX
  const mouseY = event.clientY

  const moveX = (mouseX - centerX) / rect.width * 30
  const moveY = (mouseY - centerY) / rect.height * 30

  gsap.to(activeItem, {
    x: moveX,
    y: moveY,
    duration: 0.3,
    ease: 'power2.out'
  })
}

let ctx: gsap.Context

onMounted(() => {
  setTimeout(() => {
    if (!componentRoot.value) return
    ctx = gsap.context(() => {
      const titleEl = gsap.utils.toArray<HTMLElement>('.smg-title-152', componentRoot.value)
      const subtitleEl = gsap.utils.toArray<HTMLElement>('.smg-subtitle-152', componentRoot.value)
      const gridItems = gsap.utils.toArray<HTMLElement>('.smg-grid-item-152', componentRoot.value)
      const grid = gsap.utils.toArray<HTMLElement>('.smg-grid-152', componentRoot.value)
      const itemIcons = gsap.utils.toArray<HTMLElement>('.smg-item-icon-152', componentRoot.value)
      const itemTitles = gsap.utils.toArray<HTMLElement>('.smg-item-title-152', componentRoot.value)
      const itemDescs = gsap.utils.toArray<HTMLElement>('.smg-item-desc-152', componentRoot.value)
      const magneticField = gsap.utils.toArray<HTMLElement>('.smg-magnetic-field-152', componentRoot.value)

      // 标题动画
      if (titleEl.length) {
        gsap.from(titleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        })
      }

      if (subtitleEl.length) {
        gsap.from(subtitleEl, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          },
          y: 40,
          opacity: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out'
        })
      }

      // 网格项目入场
      if (gridItems.length && grid.length) {
        gsap.from(gridItems, {
          scrollTrigger: {
            trigger: grid[0],
            start: 'top 85%'
          },
          y: 100,
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          ease: 'back.out(1.5)',
          stagger: {
            each: 0.08,
            from: 'center'
          }
        })

        // 网格视差效果
        gsap.to(gridItems, {
          y: (i) => {
            const row = Math.floor(i / 3)
            return row % 2 === 0 ? -20 : 20
          },
          scrollTrigger: {
            trigger: grid[0],
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        })
      }

      // 图标动画
      if (itemIcons.length) {
        gsap.from(itemIcons, {
          scrollTrigger: {
            trigger: grid[0] || componentRoot.value,
            start: 'top 80%'
          },
          scale: 0,
          rotation: -180,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: {
            each: 0.08,
            from: 'center'
          }
        })
      }

      // 标题文字淡入
      if (itemTitles.length) {
        gsap.from(itemTitles, {
          scrollTrigger: {
            trigger: grid[0] || componentRoot.value,
            start: 'top 80%'
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: {
            each: 0.08,
            from: 'center'
          }
        })
      }

      // 描述文字淡入
      if (itemDescs.length) {
        gsap.from(itemDescs, {
          scrollTrigger: {
            trigger: grid[0] || componentRoot.value,
            start: 'top 80%'
          },
          y: 15,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: {
            each: 0.08,
            from: 'center'
          },
          delay: 0.1
        })
      }

      // 磁场动画
      if (magneticField.length) {
        gsap.from(magneticField, {
          scrollTrigger: {
            trigger: componentRoot.value,
            start: 'top 90%'
          },
          scale: 0,
          opacity: 0,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)'
        })

        // 持续旋转
        gsap.to(magneticField, {
          rotation: 360,
          duration: 30,
          repeat: -1,
          ease: 'none'
        })
      }
    }, componentRoot.value)
  }, 100)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.smg-magnetic-grid-section-152 {
  min-height: 100vh;
  padding: 100px 20px;
  background: linear-gradient(135deg, #0c1929 0%, #1a2639 50%, #0c1929 100%);
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
      radial-gradient(circle at 30% 40%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
    pointer-events: none;
  
  opacity: 1 !important;}
}

.smg-container-152 {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  opacity: 1 !important;}

.smg-title-152 {
  text-align: center;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  opacity: 1 !important;}

.smg-subtitle-152 {
  text-align: center;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 80px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 1 !important;}

.smg-grid-152 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  perspective: 2000px;
}

.smg-grid-item-152 {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  cursor: pointer;
  transition: box-shadow 0.4s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  &:hover {
    box-shadow: 0 25px 60px rgba(236, 72, 153, 0.25);
  
  opacity: 1 !important;}
}

.smg-item-content-152 {
  text-align: center;
  padding: 30px;
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.smg-item-icon-152 {
  font-size: 3rem;
  margin-bottom: 16px;
  display: inline-block;
  transition: all 0.4s ease;

  opacity: 1 !important;}

.smg-item-title-152 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: 0.05em;

  opacity: 1 !important;}

.smg-item-desc-152 {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;

  opacity: 1 !important;}

.smg-magnetic-field-152 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%),
    conic-gradient(from 0deg, rgba(236, 72, 153, 0.02), transparent, rgba(168, 85, 247, 0.02), transparent);
  pointer-events: none;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .smg-grid-152 {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .smg-item-icon-152 {
    font-size: 2.5rem;
  
  opacity: 1 !important;}

  .smg-item-title-152 {
    font-size: 1.2rem;
  
  opacity: 1 !important;}

  .smg-item-desc-152 {
    font-size: 0.8rem;
  
  opacity: 1 !important;}
}

@media (max-width: 480px) {
  .smg-grid-152 {
    grid-template-columns: 1fr;
  }
}
</style>
