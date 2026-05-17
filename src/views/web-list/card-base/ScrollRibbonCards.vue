<template>
  <div class="rc-container-191">
    <h2 class="rc-title-191">丝带卡片滚动动画</h2>
    <div class="rc-stage-191">
      <div class="rc-ribbons-191">
        <div class="rc-ribbon-191" v-for="(ribbon, index) in ribbons" :key="index" :class="`rc-ribbon-${index + 1}-191`">
          <div class="rc-fold-191"></div>
          <div class="rc-content-191">
            <div class="rc-icon-191">{{ ribbon.icon }}</div>
            <h3>{{ ribbon.title }}</h3>
            <p>{{ ribbon.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ribbons = [
  { icon: '🎀', title: '优雅丝带', description: '流畅的丝带效果' },
  { icon: '✨', title: '飘逸动态', description: '自然的飘动动画' },
  { icon: '💫', title: '弯曲造型', description: '优雅的弯曲形状' },
  { icon: '🌟', title: '光泽质感', description: '精美的光泽效果' }
]

let ctx: gsap.Context

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.from('.rc-title-191', {
      scrollTrigger: {
        trigger: '.rc-title-191',
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })

    // 丝带动画
    gsap.utils.toArray<HTMLElement>('.rc-ribbon-191').forEach((ribbon, index) => {
      const fold = ribbon.querySelector('.rc-fold-191') as HTMLElement
      const content = ribbon.querySelector('.rc-content-191') as HTMLElement

      // 入场动画 - 丝带展开
      gsap.from(ribbon, {
        scrollTrigger: {
          trigger: ribbon,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        },
        x: -300,
        opacity: 0,
        rotate: -20,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        delay: index * 0.2
      })

      // 折叠动画 - 滚动触发
      gsap.to(fold, {
        scrollTrigger: {
          trigger: ribbon,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        },
        rotate: 180,
        scaleX: 0.8,
        ease: 'none'
      })

      // 丝带弯曲动画
      gsap.to(ribbon, {
        scrollTrigger: {
          trigger: ribbon,
          start: 'top center',
          end: 'bottom center',
          scrub: 1
        },
        rotate: index % 2 === 0 ? 10 : -10,
        ease: 'none'
      })

      // 悬停效果
      ribbon.addEventListener('mouseenter', () => {
        gsap.to(ribbon, {
          rotate: 5,
          scale: 1.05,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        })
        gsap.to(content, {
          translateX: 20,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(ribbon.querySelector('.rc-icon-191'), {
          rotate: 360,
          scale: 1.3,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        })
      })

      ribbon.addEventListener('mouseleave', () => {
        gsap.to(ribbon, {
          rotate: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
        gsap.to(content, {
          translateX: 0,
          duration: 0.3,
          ease: 'power2.out'
        })
        gsap.to(ribbon.querySelector('.rc-icon-191'), {
          rotate: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })

    // 整体容器动画
    gsap.from('.rc-ribbons-191', {
      scrollTrigger: {
        trigger: '.rc-ribbons-191',
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

onUnmounted(() => {
  ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.rc-container-191 {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1aae 50%, #0a0a0a 100%);
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.rc-container-191::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 70%, rgba(255, 0, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 70% 30%, rgba(0, 255, 255, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.rc-title-191 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 60px;
  background: linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rc-glow-191 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes rc-glow-191 {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.rc-stage-191 {
  max-width: 1400px;
  margin: 0 auto;

  opacity: 1 !important;}

.rc-ribbons-191 {
  display: flex;
  flex-direction: column;
  gap: 30px;
  perspective: 1000px;
}

.rc-ribbon-191 {
  position: relative;
  padding: 40px 60px 40px 80px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  transform-style: preserve-3d;

  opacity: 1 !important;}

.rc-ribbon-191::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  background: linear-gradient(to right, var(--ribbon-color), transparent);
  border-radius: 15px 0 0 15px;
}

.rc-ribbon-1-191 { --ribbon-color: #ff00ff; 
  opacity: 1 !important;}
.rc-ribbon-2-191 { --ribbon-color: #00ffff; 
  opacity: 1 !important;}
.rc-ribbon-3-191 { --ribbon-color: #ffff00; 
  opacity: 1 !important;}
.rc-ribbon-4-191 { --ribbon-color: #ff6600; 
  opacity: 1 !important;}

.rc-fold-191 {
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: var(--ribbon-color);
  border-radius: 0 15px 0 0;
  transition: all 0.5s ease;
  box-shadow: 0 0 20px var(--ribbon-color);

  opacity: 1 !important;}

.rc-ribbon-191:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.rc-content-191 {
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease;
}

.rc-icon-191 {
  font-size: 3rem;
  transition: transform 0.5s ease;

  opacity: 1 !important;}

.rc-content-191 h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
}

.rc-content-191 p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .rc-title-191 {
    font-size: 1.8rem;
  
  opacity: 1 !important;}
  
  .rc-ribbon-191 {
    padding: 30px 40px 30px 60px;
  
  opacity: 1 !important;}
  
  .rc-content-191 {
    flex-direction: column;
    text-align: center;
  
  opacity: 1 !important;}
}
</style>
