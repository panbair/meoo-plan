<template>
  <div class="scroll-aurora-nebula-cards-230">
    <!-- 星空背景 -->
    <div class="starfield-230">
      <div v-for="n in 200" :key="n" class="star-230" :style="{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${1 + Math.random() * 2}px`,
        height: `${1 + Math.random() * 2}px`,
        animationDelay: `${-Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
        opacity: 0.3 + Math.random() * 0.7
      }"></div>
    </div>

    <!-- 极光层 -->
    <div class="aurora-layers-230">
      <div v-for="n in 5" :key="n" class="aurora-layer-230" :style="{
        background: `linear-gradient(180deg, ${auroraColors[n - 1]}00, ${auroraColors[n - 1]}40, ${auroraColors[n - 1]}00)`,
        animationDelay: `${-n * 2}s`,
        animationDuration: `${8 + n * 2}s`,
        top: `${n * 15}%`
      }"></div>
    </div>

    <!-- 星云粒子 -->
    <div class="nebula-particles-230">
      <div v-for="n in 30" :key="n" class="nebula-particle-230" :style="{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${20 + Math.random() * 60}px`,
        height: `${20 + Math.random() * 60}px`,
        background: `radial-gradient(circle, nebulaColors[Math.floor(Math.random() * nebulaColors.length)]30 0%, transparent 70%)`,
        animationDelay: `${-Math.random() * 10}s`,
        animationDuration: `${10 + Math.random() * 10}s`
      }"></div>
    </div>

    <!-- 射击星 -->
    <div class="shooting-stars-230">
      <div v-for="n in 3" :key="n" class="shooting-star-230" :style="{
        left: `${30 + n * 20}%`,
        animationDelay: `${-n * 3}s`,
        animationDuration: `${5 + n * 2}s`
      }"></div>
    </div>

    <!-- 主标题 -->
    <div class="aurora-title-230">
      <div class="title-glow-230">
        <div class="glow-ring-230" v-for="n in 4" :key="n" :style="{
          animationDelay: `${-n * 0.5}s`
        }"></div>
      </div>
      <h2 class="title-text-230">
        <span class="title-main-230">AURORA NEBULA</span>
        <span class="title-sub-230">极光星云</span>
      </h2>
    </div>

    <!-- 卡片容器 -->
    <div class="nebula-container-230">
      <div v-for="(planet, index) in planets" :key="index" class="planet-card-230" :class="`planet-${index + 1}-230`">
        <!-- 星云背景 -->
        <div class="card-nebula-230" :style="{
          background: `radial-gradient(circle at 30% 30%, ${planet.glowColor}20 0%, transparent 50%),
                     radial-gradient(circle at 70% 70%, ${planet.color}15 0%, transparent 50%)`
        }"></div>

        <!-- 轨道环 -->
        <div class="orbit-rings-230">
          <div class="orbit-ring-230 orbit-1-230" :style="{ borderColor: `${planet.color}40` }"></div>
          <div class="orbit-ring-230 orbit-2-230" :style="{ borderColor: `${planet.glowColor}30` }"></div>
          <div class="orbit-ring-230 orbit-3-230" :style="{ borderColor: `${planet.color}20` }"></div>
        </div>

        <!-- 卡片内容 -->
        <div class="card-planet-230">
          <!-- 行星图标 -->
          <div class="planet-icon-230">
            <div class="planet-body-230" :style="{
              background: `radial-gradient(circle at 30% 30%, ${planet.color}ff, ${planet.color}80, ${planet.color}40)`,
              boxShadow: `0 0 40px ${planet.glowColor}60, inset 0 0 20px ${planet.color}80`
            }">
              <div class="planet-atmosphere-230" :style="{
                background: `linear-gradient(45deg, transparent, ${planet.glowColor}40, transparent)`
              }"></div>
            </div>
            <div class="planet-glow-230" :style="{ 
              background: `radial-gradient(circle, ${planet.glowColor}60 0%, transparent 70%)`
            }"></div>
          </div>

          <!-- 行星名称 -->
          <h3 class="planet-name-230" :style="{ color: planet.color }">
            {{ planet.name }}
            <span class="name-stars-230">★</span>
          </h3>

          <!-- 行星描述 -->
          <p class="planet-desc-230">{{ planet.desc }}</p>

          <!-- 行星数据 -->
          <div class="planet-data-230">
            <div class="data-item-230">
              <span class="data-icon-230">🌡️</span>
              <span class="data-label-230">温度</span>
              <span class="data-value-230" :style="{ color: planet.color }">{{ planet.temperature }}</span>
            </div>
            <div class="data-item-230">
              <span class="data-icon-230">📏</span>
              <span class="data-label-230">直径</span>
              <span class="data-value-230" :style="{ color: planet.color }">{{ planet.diameter }}</span>
            </div>
            <div class="data-item-230">
              <span class="data-icon-230">🔄</span>
              <span class="data-label-230">自转</span>
              <span class="data-value-230" :style="{ color: planet.color }">{{ planet.rotation }}</span>
            </div>
          </div>

          <!-- 探索按钮 -->
          <button class="explore-btn-230" :style="{
            background: `linear-gradient(135deg, ${planet.color}20, ${planet.glowColor}20)`,
            borderColor: planet.color,
            color: planet.color
          }">
            <span>EXPLORE</span>
            <div class="btn-stars-230">
              <span v-for="n in 5" :key="n" class="btn-star-230" :style="{ animationDelay: `${-n * 0.2}s` }"></span>
            </div>
          </button>
        </div>

        <!-- 星星装饰 -->
        <div class="card-stars-230">
          <div v-for="n in 15" :key="n" class="mini-star-230" :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${-Math.random() * 3}s`
          }"></div>
        </div>

        <!-- 悬停光效 -->
        <div class="hover-glow-230" :style="{ 
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${planet.glowColor}30 0%, transparent 50%)`
        }"></div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="nebula-footer-230">
      <div class="footer-galaxy-230">
        <div class="galaxy-core-230"></div>
        <div class="galaxy-arms-230">
          <div v-for="n in 4" :key="n" class="galaxy-arm-230" :style="{
            animationDelay: `${-n * 0.5}s`
          }"></div>
        </div>
      </div>
      <span class="footer-text-230">星际探索中...</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx = null

const auroraColors = ['#00ff88', '#ff00ff', '#00ffff', '#ffaa00', '#ff0066']
const nebulaColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8']

const planets = [
  {
    name: 'CELESTIA',
    desc: '天堂之星，永恒璀璨',
    color: '#ff6b6b',
    glowColor: '#ff8787',
    temperature: '-15°C',
    diameter: '12,742km',
    rotation: '24h'
  },
  {
    name: 'AQUARIA',
    desc: '水之星，碧波荡漾',
    color: '#4ecdc4',
    glowColor: '#45b7d1',
    temperature: '18°C',
    diameter: '14,256km',
    rotation: '28h'
  },
  {
    name: 'AURELIUS',
    desc: '金之星，光芒万丈',
    color: '#f9ca24',
    glowColor: '#f7dc6f',
    temperature: '32°C',
    diameter: '15,892km',
    rotation: '20h'
  },
  {
    name: 'STELLARIS',
    desc: '星辰之星，浩瀚无垠',
    color: '#6c5ce7',
    glowColor: '#a29bfe',
    temperature: '-42°C',
    diameter: '18,450km',
    rotation: '16h'
  },
  {
    name: 'NEONIA',
    desc: '霓虹之星，绚丽多彩',
    color: '#fd79a8',
    glowColor: '#fab1a0',
    temperature: '25°C',
    diameter: '13,678km',
    rotation: '22h'
  },
  {
    name: 'LUMINA',
    desc: '光明之星，永恒闪耀',
    color: '#74b9ff',
    glowColor: '#81ecec',
    temperature: '5°C',
    diameter: '16,234km',
    rotation: '26h'
  }
]

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场
    gsap.from('.aurora-title-230', {
      scrollTrigger: {
        trigger: '.aurora-title-230',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -100,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out'
    })

    gsap.from('.glow-ring-230', {
      scrollTrigger: {
        trigger: '.glow-ring-230',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'elastic.out(1, 0.5)'
    })

    gsap.from('.title-text-230', {
      scrollTrigger: {
        trigger: '.title-text-230',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)'
    })

    // 卡片入场
    gsap.from('.planet-card-230', {
      scrollTrigger: {
        trigger: '.nebula-container-230',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 150,
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out'
    })

    // 卡片内部动画
    const cards = gsap.utils.toArray('.planet-card-230')
    cards.forEach((card, i) => {
      // 星云背景
      gsap.from(card.querySelector('.card-nebula-230'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.5,
        opacity: 0,
        duration: 1,
        delay: i * 0.2,
        ease: 'power2.out'
      })

      // 轨道环
      gsap.from(card.querySelectorAll('.orbit-ring-230'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        delay: i * 0.2 + 0.1,
        ease: 'elastic.out(1, 0.5)'
      })

      // 持续旋转
      gsap.to(card.querySelectorAll('.orbit-ring-230'), {
        rotation: 360,
        duration: 10 + Math.random() * 5,
        repeat: -1,
        ease: 'none',
        stagger: 0.2
      })

      // 行星图标
      gsap.from(card.querySelector('.planet-icon-230'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        rotation: -360,
        opacity: 0,
        duration: 1.2,
        delay: i * 0.2 + 0.2,
        ease: 'elastic.out(1, 0.5)'
      })

      // 行星脉动
      gsap.to(card.querySelector('.planet-body-230'), {
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // 行星名称
      gsap.from(card.querySelector('.planet-name-230'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2 + 0.3,
        ease: 'power2.out'
      })

      // 行星描述
      gsap.from(card.querySelector('.planet-desc-230'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2 + 0.4,
        ease: 'power2.out'
      })

      // 行星数据
      gsap.from(card.querySelectorAll('.data-item-230'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: i * 0.2 + 0.5,
        ease: 'power2.out'
      })

      // 探索按钮
      gsap.from(card.querySelector('.explore-btn-230'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.2 + 0.7,
        ease: 'power2.out'
      })
    })

    // 持续动画
    gsap.to('.aurora-layer-230', {
      y: '-100%',
      duration: 8 + Math.random() * 4,
      repeat: -1,
      ease: 'none',
      stagger: 0.5
    })

    gsap.to('.nebula-particle-230', {
      y: -50,
      x: (i) => (i % 2 === 0 ? 30 : -30),
      scale: 1.2,
      duration: 10 + Math.random() * 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    // 星星闪烁
    gsap.to('.star-230', {
      opacity: (i, target) => {
        const baseOpacity = parseFloat(target.style.opacity) || 0.5
        return baseOpacity + Math.random() * 0.5
      },
      duration: 0.5 + Math.random() * 1,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })

    // 滚动控制
    gsap.to('.aurora-layer-230', {
      scrollTrigger: {
        trigger: '.nebula-container-230',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      y: '-50%',
      ease: 'none'
    })

    // 鼠标交互
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mouse-x', `${x}%`)
        card.style.setProperty('--mouse-y', `${y}%`)

        // 3D倾斜
        const rotateX = (y - 50) / 10
        const rotateY = (50 - x) / 10
        gsap.to(card.querySelector('.card-planet-230'), {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.card-planet-230'), {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
      })
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.scroll-aurora-nebula-cards-230 {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2a 50%, #0a1a2a 100%);
  padding: 80px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

/* 星空背景 */
.starfield-230 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.star-230 {
  position: absolute;
  border-radius: 50%;
  background: white;
  animation: starTwinkle ease-in-out infinite;

  opacity: 1 !important;}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* 极光层 */
.aurora-layers-230 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
}

.aurora-layer-230 {
  position: absolute;
  left: 0;
  right: 0;
  height: 300%;
  animation: auroraFlow ease-in-out infinite;

  opacity: 1 !important;}

@keyframes auroraFlow {
  0%, 100% { transform: translateY(-33.33%); }
  50% { transform: translateY(0%); }
}

/* 星云粒子 */
.nebula-particles-230 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
}

.nebula-particle-230 {
  position: absolute;
  border-radius: 50%;
  filter: blur(20px);
  animation: nebulaFloat ease-in-out infinite;
}

@keyframes nebulaFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.2); }
}

/* 射击星 */
.shooting-stars-230 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
}

.shooting-star-230 {
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(to right, transparent, white, transparent);
  animation: shooting linear infinite;

  opacity: 1 !important;}

@keyframes shooting {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% {
    transform: translateX(300px) translateY(300px);
    opacity: 0;
  }
}

/* 主标题 */
.aurora-title-230 {
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.title-glow-230 {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.glow-ring-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid rgba(255, 107, 107, 0.3);
  animation: glowRingExpand 3s ease-in-out infinite;

  opacity: 1 !important;}

.glow-ring-230:nth-child(1) { width: 150px; height: 150px; }
.glow-ring-230:nth-child(2) { width: 200px; height: 200px; animation-delay: -0.5s; }
.glow-ring-230:nth-child(3) { width: 250px; height: 250px; animation-delay: -1s; }
.glow-ring-230:nth-child(4) { width: 300px; height: 300px; animation-delay: -1.5s; }

@keyframes glowRingExpand {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.6;
  }
}

.title-text-230 {
  position: relative;
  z-index: 1;
}

.title-main-230 {
  display: block;
  font-size: 52px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #f9ca24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 6px;
  text-shadow: 0 0 40px rgba(255, 107, 107, 0.5);

  opacity: 1 !important;}

.title-sub-230 {
  display: block;
  font-size: 18px;
  color: #888;
  letter-spacing: 12px;
  margin-top: 10px;

  opacity: 1 !important;}

/* 卡片容器 */
.nebula-container-230 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

/* 卡片样式 */
.planet-card-230 {
  background: rgba(15, 15, 30, 0.8);
  border-radius: 30px;
  padding: 40px 30px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transform-style: preserve-3d;
  perspective: 1000px;

  opacity: 1 !important;}

/* 星云背景 */
.card-nebula-230 {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  pointer-events: none;
  opacity: 0.6;
}

/* 轨道环 */
.orbit-rings-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;

  opacity: 1 !important;}

.orbit-ring-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px solid;

  opacity: 1 !important;}

.orbit-1-230 { width: 200px; height: 200px; 
  opacity: 1 !important;}
.orbit-2-230 { width: 280px; height: 280px; 
  opacity: 1 !important;}
.orbit-3-230 { width: 360px; height: 360px; 
  opacity: 1 !important;}

/* 卡片内容 */
.card-planet-230 {
  position: relative;
  z-index: 2;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

/* 行星图标 */
.planet-icon-230 {
  width: 140px;
  height: 140px;
  margin: 0 auto 30px;
  position: relative;

  opacity: 1 !important;}

.planet-body-230 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

.planet-atmosphere-230 {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: atmosphereGlow 3s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes atmosphereGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.planet-glow-230 {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.5;
}

/* 行星名称 */
.planet-name-230 {
  font-size: 26px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 15px;
  letter-spacing: 3px;
  position: relative;

  opacity: 1 !important;}

.name-stars-230 {
  font-size: 20px;
  opacity: 0.5;
  animation: nameStarBlink 2s infinite;
}

@keyframes nameStarBlink {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 行星描述 */
.planet-desc-230 {
  text-align: center;
  color: #888;
  font-size: 16px;
  margin-bottom: 30px;
  letter-spacing: 1px;

  opacity: 1 !important;}

/* 行星数据 */
.planet-data-230 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.data-item-230 {
  text-align: center;
  padding: 15px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 15px;

  opacity: 1 !important;}

.data-icon-230 {
  display: block;
  font-size: 24px;
  margin-bottom: 8px;

  opacity: 1 !important;}

.data-label-230 {
  display: block;
  font-size: 11px;
  color: #666;
  letter-spacing: 1px;
  margin-bottom: 5px;

  opacity: 1 !important;}

.data-value-230 {
  display: block;
  font-size: 14px;
  font-weight: 700;

  opacity: 1 !important;}

/* 探索按钮 */
.explore-btn-230 {
  width: 100%;
  padding: 15px;
  border: 2px solid;
  border-radius: 25px;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  opacity: 1 !important;}

.explore-btn-230:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px currentColor;
}

.btn-stars-230 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.btn-star-230 {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: btnStarMove 2s linear infinite;

  opacity: 1 !important;}

@keyframes btnStarMove {
  0% { transform: translate(0, 0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(100px, 50px); opacity: 0; }
}

/* 星星装饰 */
.card-stars-230 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.mini-star-230 {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: miniStarTwinkle ease-in-out infinite;

  opacity: 1 !important;}

@keyframes miniStarTwinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

/* 悬停光效 */
.hover-glow-230 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.planet-card-230:hover .hover-glow-230 {
  opacity: 1;
}

/* 底部装饰 */
.nebula-footer-230 {
  text-align: center;
  margin-top: 60px;
  position: relative;
  z-index: 10;

  opacity: 1 !important;}

.footer-galaxy-230 {
  display: inline-block;
  margin-bottom: 15px;
  position: relative;
}

.galaxy-core-230 {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, #ff6b6b80, transparent);
  border-radius: 50%;
  animation: galaxyCorePulse 2s ease-in-out infinite;

  opacity: 1 !important;}

@keyframes galaxyCorePulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
}

.galaxy-arms-230 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.galaxy-arm-230 {
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(to right, transparent, #4ecdc4, transparent);
  animation: galaxyArmRotate 10s linear infinite;

  opacity: 1 !important;}

.galaxy-arm-230:nth-child(1) { transform: rotate(0deg); }
.galaxy-arm-230:nth-child(2) { transform: rotate(90deg); }
.galaxy-arm-230:nth-child(3) { transform: rotate(180deg); }
.galaxy-arm-230:nth-child(4) { transform: rotate(270deg); }

@keyframes galaxyArmRotate {
  from { transform: rotate(var(--rotation, 0deg)); }
  to { transform: rotate(calc(var(--rotation, 0deg) + 360deg)); }
}

.footer-text-230 {
  display: block;
  color: #ff6b6b;
  font-size: 16px;
  letter-spacing: 5px;
  animation: footerTextBlink 3s infinite;

  opacity: 1 !important;}

@keyframes footerTextBlink {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* 响应式 */
@media (max-width: 768px) {
  .title-main-230 {
    font-size: 32px;
    letter-spacing: 3px;
  
  opacity: 1 !important;}

  .nebula-container-230 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .planet-data-230 {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
