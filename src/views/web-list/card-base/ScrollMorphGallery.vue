<template>
  <div class="mg-container-184">
    <h2 class="mg-title-184">变形画廊滚动动画</h2>
    <div class="mg-stage-184">
      <div class="mg-gallery-184">
        <div class="mg-item-184" v-for="(item, index) in items" :key="index">
          <div class="mg-shape-184" :class="`mg-shape-${index + 1}-184`">
            <div class="mg-image-184" :style="{ backgroundImage: `url(${item.image})` }"></div>
          </div>
          <div class="mg-info-184">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
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

const items = [
  {
    title: '圆形变换',
    description: '完美的圆形形态',
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop'
  },
  {
    title: '方形形态',
    description: '稳定的几何形状',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=400&fit=crop'
  },
  {
    title: '三角结构',
    description: '尖锐的三角造型',
    image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400&h=400&fit=crop'
  },
  {
    title: '菱形切割',
    description: '优雅的菱形轮廓',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop'
  },
  {
    title: '六边对称',
    description: '完美的六边形',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=400&fit=crop'
  },
  {
    title: '星形光芒',
    description: '闪耀的星形图案',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop'
  }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.mg-title-184', {
      scrollTrigger: {
        trigger: '.mg-title-184',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 画廊项目动画
    gsap.utils.toArray<HTMLElement>('.mg-item-184').forEach((item, index) => {
      const shape = item.querySelector('.mg-shape-184') as HTMLElement
      const info = item.querySelector('.mg-info-184') as HTMLElement

      // 入场动画
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        rotate: -180,
        duration: 1,
        ease: 'elastic.out(1, 0.5)',
        delay: index * 0.15
      })

      // 形状变形动画 - 滚动触发
      gsap.to(shape, {
        scrollTrigger: {
          trigger: item,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        },
        rotate: 360,
        scale: 1.1,
        ease: 'none'
      })

      // 信息淡入
      gsap.from(info, {
        scrollTrigger: {
          trigger: item,
          start: 'top center-=50',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.3
      })

      // 悬停效果
      item.addEventListener('mouseenter', () => {
        gsap.to(shape, {
          scale: 1.2,
          rotate: shape.style.transform ? parseInt(shape.style.transform.match(/rotate\((\d+)deg\)/)?.[1] || '0') + 45 : 45,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
        gsap.to(item.querySelector('.mg-image-184'), {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      item.addEventListener('mouseleave', () => {
        gsap.to(shape, {
          scale: 1,
          rotate: gsap.getProperty(shape, 'rotate') || 0,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(item.querySelector('.mg-image-184'), {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  })
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.mg-container-184 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a3e 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.mg-container-184::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 40% 60%, rgba(100, 100, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 60% 40%, rgba(255, 100, 255, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.mg-title-184 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 60px;
  background: linear-gradient(90deg, #6464ff, #ff64ff, #6464ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: mg-glow-184 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes mg-glow-184 {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.mg-stage-184 {
  max-width: 1400px;
  margin: 0 auto;

  opacity: 1 !important;}

.mg-gallery-184 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.mg-item-184 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  opacity: 1 !important;}

.mg-item-184:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.mg-shape-184 {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 25px;
  transition: all 0.5s ease;
  overflow: hidden;

  opacity: 1 !important;}

.mg-shape-1-184 {
  border-radius: 50%;
}

.mg-shape-2-184 {
  border-radius: 0;
}

.mg-shape-3-184 {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.mg-shape-4-184 {
  transform: rotate(45deg);
  border-radius: 0;
}

.mg-shape-5-184 {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.mg-shape-6-184 {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.mg-image-184 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;

  opacity: 1 !important;}

.mg-info-184 {
  text-align: center;

  opacity: 1 !important;}

.mg-info-184 h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}

.mg-info-184 p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .mg-title-184 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}
  
  .mg-gallery-184 {
    grid-template-columns: 1fr;
  }
  
  .mg-shape-184 {
    width: 150px;
    height: 150px;
  
  opacity: 1 !important;}
}
</style>
