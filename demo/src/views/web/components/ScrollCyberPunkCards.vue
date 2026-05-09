<template>
  <div class="scroll-cyberpunk-cards-228">
    <!-- 赛博网格背景 -->
    <div class="cyber-grid-228">
      <div class="grid-line-228"></div>
      <div class="grid-line-228" style="animation-delay: -2s;"></div>
      <div class="grid-line-228" style="animation-delay: -4s;"></div>
    </div>

    <!-- 霓虹雨 -->
    <div class="neon-rain-228">
      <div v-for="n in 20" :key="n" class="rain-drop-228" :style="{
        left: `${(n * 5) % 100}%`,
        animationDelay: `${-n * 0.3}s`,
        animationDuration: `${2 + Math.random() * 2}s`
      }"></div>
    </div>

    <!-- 扫描线 -->
    <div class="scan-line-228"></div>

    <!-- 主标题 -->
    <div class="cyber-title-228">
      <h2 class="title-text-228">
        <span class="title-glitch-228" data-text="CYBERPUNK">CYBERPUNK</span>
        <span class="title-sub-228">CARDS</span>
      </h2>
      <div class="title-border-228"></div>
    </div>

    <!-- 卡片容器 -->
    <div class="cards-container-228">
      <div v-for="(card, index) in cards" :key="index" class="cyber-card-228" :class="`card-${index + 1}-228`">
        <!-- 卡片光效 -->
        <div class="card-glow-228" :style="{ borderColor: card.glowColor }"></div>
        
        <!-- 装饰角 -->
        <div class="corner-228 corner-tl-228"></div>
        <div class="corner-228 corner-tr-228"></div>
        <div class="corner-228 corner-bl-228"></div>
        <div class="corner-228 corner-br-228"></div>

        <!-- 赛博边框 -->
        <div class="cyber-border-228" :style="{ background: `linear-gradient(45deg, ${card.color}, ${card.glowColor})` }"></div>

        <!-- 卡片内容 -->
        <div class="card-content-228">
          <!-- 编号 -->
          <div class="card-number-228">
            <span class="number-bg-228">{{ String(index + 1).padStart(2, '0') }}</span>
          </div>

          <!-- 图标 -->
          <div class="card-icon-228" :style="{ color: card.color }">
            <div class="icon-ring-228" :style="{ borderColor: card.glowColor }"></div>
            <span class="icon-text-228">{{ card.icon }}</span>
          </div>

          <!-- 标题 -->
          <h3 class="card-title-228" :style="{ color: card.color }">
            {{ card.title }}
            <span class="title-underline-228" :style="{ background: card.color }"></span>
          </h3>

          <!-- 描述 -->
          <p class="card-desc-228">{{ card.desc }}</p>

          <!-- 能量条 -->
          <div class="energy-bar-228">
            <div class="energy-track-228"></div>
            <div class="energy-fill-228" :style="{ 
              width: `${card.energy}%`,
              background: `linear-gradient(90deg, ${card.color}, ${card.glowColor})`,
              boxShadow: `0 0 20px ${card.glowColor}`
            }"></div>
            <span class="energy-value-228" :style="{ color: card.color }">{{ card.energy }}%</span>
          </div>

          <!-- 数据行 -->
          <div class="data-row-228">
            <div class="data-item-228">
              <span class="data-label-228">SPEED</span>
              <span class="data-value-228" :style="{ color: card.color }">{{ card.speed }}%</span>
            </div>
            <div class="data-item-228">
              <span class="data-label-228">POWER</span>
              <span class="data-value-228" :style="{ color: card.color }">{{ card.power }}%</span>
            </div>
          </div>
        </div>

        <!-- 悬停光效 -->
        <div class="hover-light-228" :style="{ background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${card.glowColor}40 0%, transparent 50%)` }"></div>

        <!-- 故障纹理 -->
        <div class="glitch-texture-228"></div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-deco-228">
      <div class="deco-line-228"></div>
      <span class="deco-text-228">SYSTEM ONLINE</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let ctx = null

const cards = [
  {
    icon: '⚡',
    title: 'NEON SURGE',
    desc: 'Electrify your digital presence',
    color: '#00f0ff',
    glowColor: '#00f0ff',
    energy: 98,
    speed: 95,
    power: 92
  },
  {
    icon: '🔮',
    title: 'CYBER VOID',
    desc: 'Dive into the digital abyss',
    color: '#ff00aa',
    glowColor: '#ff00aa',
    energy: 95,
    speed: 88,
    power: 97
  },
  {
    icon: '🎯',
    title: 'DATA HUNTER',
    desc: 'Track every digital footprint',
    color: '#00ff66',
    glowColor: '#00ff66',
    energy: 92,
    speed: 96,
    power: 90
  },
  {
    icon: '🌐',
    title: 'NET RUNNER',
    desc: 'Navigate the network grid',
    color: '#ffaa00',
    glowColor: '#ffaa00',
    energy: 89,
    speed: 94,
    power: 88
  },
  {
    icon: '💾',
    title: 'NEURAL SYNC',
    desc: 'Connect to the mainframe',
    color: '#aa00ff',
    glowColor: '#aa00ff',
    energy: 87,
    speed: 91,
    power: 86
  },
  {
    icon: '🚀',
    title: 'SYSTEM RISE',
    desc: 'Ascend to cyber space',
    color: '#ff6600',
    glowColor: '#ff6600',
    energy: 85,
    speed: 93,
    power: 84
  }
]

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题入场动画
    gsap.from('.cyber-title-228', {
      scrollTrigger: {
        trigger: '.cyber-title-228',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    })

    gsap.from('.title-text-228', {
      scrollTrigger: {
        trigger: '.title-text-228',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      skewY: 20,
      scale: 1.5,
      opacity: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)'
    })

    // 卡片交错入场
    gsap.from('.cyber-card-228', {
      scrollTrigger: {
        trigger: '.cards-container-228',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 150,
      x: (i) => (i % 2 === 0 ? -100 : 100),
      scale: 0.8,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    })

    // 卡片内部元素动画
    const cardElements = gsap.utils.toArray('.cyber-card-228')
    cardElements.forEach((card, i) => {
      // 编号
      gsap.from(card.querySelector('.card-number-228'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'back.out(1.7)'
      })

      // 图标
      gsap.from(card.querySelector('.card-icon-228'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        scale: 0,
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15 + 0.1,
        ease: 'elastic.out(1, 0.5)'
      })

      // 标题
      gsap.from(card.querySelector('.card-title-228'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15 + 0.2,
        ease: 'power2.out'
      })

      // 描述
      gsap.from(card.querySelector('.card-desc-228'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15 + 0.3,
        ease: 'power2.out'
      })

      // 能量条
      gsap.from(card.querySelector('.energy-fill-228'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        width: 0,
        duration: 1,
        delay: i * 0.15 + 0.4,
        ease: 'power3.out'
      })

      // 数据行
      gsap.from(card.querySelector('.data-row-228'), {
        scrollTrigger: {
          trigger: card,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.15 + 0.5,
        ease: 'power2.out'
      })
    })

    // 滚动进度控制
    gsap.to('.energy-fill-228', {
      scrollTrigger: {
        trigger: '.cards-container-228',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      width: (i, target) => {
        const card = cards[i]
        return card ? `${card.energy}%` : '0%'
      }
    })

    // 持续动画
    gsap.to('.icon-ring-228', {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: 'none'
    })

    gsap.to('.scan-line-228', {
      y: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none'
    })

    // 鼠标交互
    cardElements.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mouse-x', `${x}%`)
        card.style.setProperty('--mouse-y', `${y}%`)

        // 3D倾斜
        const rotateX = (y - 50) / 5
        const rotateY = (50 - x) / 5
        gsap.to(card.querySelector('.card-content-228'), {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.3,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.card-content-228'), {
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

.scroll-cyberpunk-cards-228 {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a0a1f 50%, #0f1a1a 100%);
  padding: 80px 20px;
  position: relative;
  overflow: hidden;

  opacity: 1 !important;}

/* 赛博网格背景 */
.cyber-grid-228 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.1;
  z-index: 1;
}

.grid-line-228 {
  position: absolute;
  width: 100%;
  height: 100%;
  background: 
    linear-gradient(90deg, transparent 49%, #00f0ff 49%, #00f0ff 51%, transparent 51%),
    linear-gradient(0deg, transparent 49%, #ff00aa 49%, #ff00aa 51%, transparent 51%);
  background-size: 100px 100px;
  animation: gridMove 20s linear infinite;

  opacity: 1 !important;}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(100px, 100px); }
}

/* 霓虹雨 */
.neon-rain-228 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.rain-drop-228 {
  position: absolute;
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, #00f0ff, transparent);
  animation: rainFall linear infinite;

  opacity: 1 !important;}

@keyframes rainFall {
  0% {
    transform: translateY(-100px);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

/* 扫描线 */
.scan-line-228 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, #00f0ff, transparent);
  opacity: 0.5;
  pointer-events: none;
  z-index: 2;
}

/* 主标题 */
.cyber-title-228 {
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  z-index: 3;

  opacity: 1 !important;}

.title-text-228 {
  display: block;
  margin-bottom: 10px;
}

.title-glitch-228 {
  font-size: 64px;
  font-weight: 900;
  letter-spacing: 10px;
  background: linear-gradient(45deg, #00f0ff, #ff00aa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  position: relative;
  text-transform: uppercase;
  text-shadow: 0 0 30px #00f0ff40;

  opacity: 1 !important;}

.title-glitch-228::before,
.title-glitch-228::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-glitch-228::before {
  animation: glitch1 2s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.title-glitch-228::after {
  animation: glitch2 3s infinite linear alternate-reverse;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

@keyframes glitch1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

@keyframes glitch2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(2px, -2px); }
  40% { transform: translate(2px, 2px); }
  60% { transform: translate(-2px, -2px); }
  80% { transform: translate(-2px, 2px); }
}

.title-sub-228 {
  font-size: 24px;
  letter-spacing: 20px;
  color: #ff00aa;
  text-transform: uppercase;
  font-weight: 700;
  text-shadow: 0 0 20px #ff00aa60;

  opacity: 1 !important;}

.title-border-228 {
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f0ff, #ff00aa, transparent);
  margin: 20px auto;
  position: relative;

  opacity: 1 !important;}

.title-border-228::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 6px;
  background: inherit;
  filter: blur(4px);
}

/* 卡片容器 */
.cards-container-228 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 3;

  opacity: 1 !important;}

/* 卡片样式 */
.cyber-card-228 {
  background: rgba(10, 10, 20, 0.9);
  border-radius: 20px;
  padding: 40px 30px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transform-style: preserve-3d;
  perspective: 1000px;

  opacity: 1 !important;}

/* 卡片光效 */
.card-glow-228 {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  border: 1px solid transparent;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cyber-card-228:hover .card-glow-228 {
  opacity: 1;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { 
    box-shadow: 0 0 20px var(--glow-color), inset 0 0 20px var(--glow-color);
  }
  50% { 
    box-shadow: 0 0 40px var(--glow-color), inset 0 0 40px var(--glow-color);
  }
}

/* 装饰角 */
.corner-228 {
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: currentColor;
  opacity: 0.3;
  transition: all 0.3s ease;
}

.corner-tl-228 {
  top: 10px;
  left: 10px;
  border-top: 3px solid;
  border-left: 3px solid;
}

.corner-tr-228 {
  top: 10px;
  right: 10px;
  border-top: 3px solid;
  border-right: 3px solid;
}

.corner-bl-228 {
  bottom: 10px;
  left: 10px;
  border-bottom: 3px solid;
  border-left: 3px solid;
}

.corner-br-228 {
  bottom: 10px;
  right: 10px;
  border-bottom: 3px solid;
  border-right: 3px solid;
}

.cyber-card-228:hover .corner-228 {
  opacity: 1;
}

/* 赛博边框 */
.cyber-border-228 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cyber-card-228:hover .cyber-border-228 {
  opacity: 1;
}

/* 卡片内容 */
.card-content-228 {
  position: relative;
  z-index: 2;
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

/* 编号 */
.card-number-228 {
  margin-bottom: 20px;
}

.number-bg-228 {
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff, #888888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0.2;
  letter-spacing: 2px;
}

/* 图标 */
.card-icon-228 {
  width: 80px;
  height: 80px;
  margin: 0 auto 25px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 1 !important;}

.icon-ring-228 {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px dashed currentColor;
  border-radius: 50%;
  opacity: 0.5;
}

.icon-text-228 {
  font-size: 36px;

  opacity: 1 !important;}

/* 标题 */
.card-title-228 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 3px;
  position: relative;
  display: inline-block;

  opacity: 1 !important;}

.title-underline-228 {
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 3px;
  transition: width 0.3s ease;

  opacity: 1 !important;}

.cyber-card-228:hover .title-underline-228 {
  width: 100%;

  opacity: 1 !important;}

/* 描述 */
.card-desc-228 {
  color: #888;
  font-size: 16px;
  margin-bottom: 30px;
  letter-spacing: 1px;

  opacity: 1 !important;}

/* 能量条 */
.energy-bar-228 {
  position: relative;
  height: 8px;
  margin-bottom: 25px;
  overflow: hidden;

  opacity: 1 !important;}

.energy-track-228 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;

  opacity: 1 !important;}

.energy-fill-228 {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;

  opacity: 1 !important;}

.energy-value-228 {
  position: absolute;
  top: -25px;
  right: 0;
  font-size: 14px;
  font-weight: 700;

  opacity: 1 !important;}

/* 数据行 */
.data-row-228 {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.data-item-228 {
  text-align: center;

  opacity: 1 !important;}

.data-label-228 {
  display: block;
  font-size: 12px;
  color: #666;
  letter-spacing: 2px;
  margin-bottom: 5px;

  opacity: 1 !important;}

.data-value-228 {
  display: block;
  font-size: 20px;
  font-weight: 700;

  opacity: 1 !important;}

/* 悬停光效 */
.hover-light-228 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cyber-card-228:hover .hover-light-228 {
  opacity: 1;
}

/* 故障纹理 */
.glitch-texture-228 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 240, 255, 0.03) 2px,
    rgba(0, 240, 255, 0.03) 4px
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cyber-card-228:hover .glitch-texture-228 {
  opacity: 1;
}

/* 底部装饰 */
.bottom-deco-228 {
  text-align: center;
  margin-top: 60px;
  position: relative;
  z-index: 3;

  opacity: 1 !important;}

.deco-line-228 {
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f0ff, transparent);
  margin: 0 auto 15px;

  opacity: 1 !important;}

.deco-text-228 {
  color: #00f0ff;
  font-size: 14px;
  letter-spacing: 5px;
  text-transform: uppercase;
  animation: blink 2s infinite;

  opacity: 1 !important;}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 响应式 */
@media (max-width: 768px) {
  .title-glitch-228 {
    font-size: 36px;
    letter-spacing: 5px;
  
  opacity: 1 !important;}

  .title-sub-228 {
    font-size: 16px;
    letter-spacing: 10px;
  
  opacity: 1 !important;}

  .cards-container-228 {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .card-content-228 {
    padding: 20px;
  
  opacity: 1 !important;}
}
</style>
