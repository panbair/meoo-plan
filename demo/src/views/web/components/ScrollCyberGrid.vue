<template>
  <div class="cg-container-185">
    <h2 class="cg-title-185">赛博网格滚动动画</h2>
    <div class="cg-stage-185">
      <div class="cg-grid-185">
        <div class="cg-cell-185" v-for="(cell, index) in cells" :key="index" :class="`cg-cell-${index % 6}-185`">
          <div class="cg-content-185">
            <div class="cg-icon-185">{{ cell.icon }}</div>
            <h3>{{ cell.title }}</h3>
            <p>{{ cell.description }}</p>
          </div>
          <div class="cg-glow-185"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cells = [
  { icon: '🌐', title: '网络连接', description: '全球网络互联' },
  { icon: '🔮', title: '虚拟现实', description: '沉浸式体验' },
  { icon: '⚡', title: '量子计算', description: '超级算力' },
  { icon: '🛡️', title: '安全防护', description: '多层加密' },
  { icon: '🚀', title: '未来科技', description: '科技前沿' },
  { icon: '💫', title: '人工智能', description: '智能革命' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.cg-title-185', {
      scrollTrigger: {
        trigger: '.cg-title-185',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 网格单元格动画
    gsap.utils.toArray<HTMLElement>('.cg-cell-185').forEach((cell, index) => {
      const row = Math.floor(index / 3)
      const col = index % 3

      // 入场动画 - 交错效果
      gsap.from(cell, {
        scrollTrigger: {
          trigger: cell,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        x: (col - 1) * 100,
        y: (row - 1) * 100,
        scale: 0,
        opacity: 0,
        rotate: (col - row) * 30,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        delay: (row * 3 + col) * 0.1
      })

      // 滚动触发缩放动画
      gsap.to(cell, {
        scrollTrigger: {
          trigger: cell,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        },
        scale: 1.05,
        ease: 'none'
      })

      // 发光效果动画
      const glow = cell.querySelector('.cg-glow-185') as HTMLElement
      gsap.to(glow, {
        scrollTrigger: {
          trigger: cell,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        },
        opacity: 0.8,
        scale: 1.5,
        ease: 'none'
      })

      // 悬停效果
      cell.addEventListener('mouseenter', () => {
        gsap.to(cell.querySelector('.cg-icon-185'), {
          scale: 1.5,
          rotate: 360,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        })
        gsap.to(glow, {
          opacity: 1,
          scale: 2,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(cell, {
          borderColor: 'rgba(0, 255, 255, 0.8)',
          duration: 0.3
        })
      })

      cell.addEventListener('mouseleave', () => {
        gsap.to(cell.querySelector('.cg-icon-185'), {
          scale: 1,
          rotate: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(glow, {
          opacity: 0.4,
          scale: 1.2,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(cell, {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          duration: 0.3
        })
      })
    })

    // 整体网格动画
    gsap.from('.cg-grid-185', {
      scrollTrigger: {
        trigger: '.cg-grid-185',
        start: 'top bottom-=50',
        toggleActions: 'play none none reverse'
      },
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  })
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.cg-container-185 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a4e 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.cg-container-185::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

.cg-title-185 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 60px;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3);

  opacity: 1 !important;}

.cg-stage-185 {
  max-width: 1400px;
  margin: 0 auto;

  opacity: 1 !important;}

.cg-grid-185 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  perspective: 1000px;
}

.cg-cell-185 {
  position: relative;
  padding: 40px 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.cg-cell-185::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(0, 255, 255, 0.1) 0%, 
    transparent 50%,
    rgba(255, 0, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cg-cell-185:hover::before {
  opacity: 1;
}

.cg-cell-185:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 40px rgba(0, 255, 255, 0.2);
}

.cg-glow-185 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%);
  opacity: 0.4;
  pointer-events: none;
  transition: all 0.3s ease;
}

.cg-content-185 {
  position: relative;
  z-index: 1;
  text-align: center;
  transform: translateZ(20px);

  opacity: 1 !important;}

.cg-icon-185 {
  font-size: 3rem;
  margin-bottom: 20px;
  display: inline-block;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.cg-content-185 h3 {
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.cg-content-185 p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

/* 不同颜色的单元格 */
.cg-cell-0-185 { --cell-color: #00ffff; 
  opacity: 1 !important;}
.cg-cell-1-185 { --cell-color: #ff00ff; 
  opacity: 1 !important;}
.cg-cell-2-185 { --cell-color: #ffff00; 
  opacity: 1 !important;}
.cg-cell-3-185 { --cell-color: #00ff00; 
  opacity: 1 !important;}
.cg-cell-4-185 { --cell-color: #ff6600; 
  opacity: 1 !important;}
.cg-cell-5-185 { --cell-color: #6600ff; 
  opacity: 1 !important;}

.cg-cell-0-185 .cg-glow-185 { background: radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%); 
  opacity: 1 !important;}
.cg-cell-1-185 .cg-glow-185 { background: radial-gradient(circle, rgba(255, 0, 255, 0.4) 0%, transparent 70%); 
  opacity: 1 !important;}
.cg-cell-2-185 .cg-glow-185 { background: radial-gradient(circle, rgba(255, 255, 0, 0.4) 0%, transparent 70%); 
  opacity: 1 !important;}
.cg-cell-3-185 .cg-glow-185 { background: radial-gradient(circle, rgba(0, 255, 0, 0.4) 0%, transparent 70%); 
  opacity: 1 !important;}
.cg-cell-4-185 .cg-glow-185 { background: radial-gradient(circle, rgba(255, 102, 0, 0.4) 0%, transparent 70%); 
  opacity: 1 !important;}
.cg-cell-5-185 .cg-glow-185 { background: radial-gradient(circle, rgba(102, 0, 255, 0.4) 0%, transparent 70%); 
  opacity: 1 !important;}

@media (max-width: 1024px) {
  .cg-grid-185 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .cg-title-185 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}
  
  .cg-grid-185 {
    grid-template-columns: 1fr;
  }
}
</style>
