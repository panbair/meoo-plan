<template>
  <div class="timeline-142" ref="componentRoot">
    <div class="tl-container-142">
      <h2 class="tl-title-142">📅 时间轴动画</h2>
      <p class="tl-desc-142">滚动触发的时间线展开效果</p>
      
      <div class="tl-stage-142">
        <div class="tl-line-142">
          <div class="tl-progress-142"></div>
        </div>
        
        <div class="tl-events-142">
          <div 
            v-for="(event, index) in events" 
            :key="index" 
            class="tl-event-142"
            :style="{ '--index': index }"
          >
            <div class="tl-dot-142"></div>
            <div class="tl-content-142">
              <div class="tl-year-142">{{ event.year }}</div>
              <div class="tl-title-text-142">{{ event.title }}</div>
              <div class="tl-description-142">{{ event.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="tl-hint-142">滚动查看时间线</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const componentRoot = ref<HTMLElement>()

const events = [
  {
    year: '2020',
    title: '起始之年',
    description: '项目正式启动，奠定基础架构'
  },
  {
    year: '2021',
    title: '快速发展',
    description: '核心功能完善，用户量突破百万'
  },
  {
    year: '2022',
    title: '创新突破',
    description: '引入AI技术，智能化升级'
  },
  {
    year: '2023',
    title: '全球扩张',
    description: '国际化布局，服务全球用户'
  },
  {
    year: '2024',
    title: '生态完善',
    description: '构建完整生态体系'
  },
  {
    year: '2025',
    title: '未来展望',
    description: '持续创新，引领行业'
  }
]

let ctx: any = null

onMounted(() => {
  ctx = gsap.context(() => {
    // 初始状态
    gsap.set('.tl-event-142', {
      x: -100,
      opacity: 0
    })
    
    gsap.set('.tl-progress-142', {
      scaleY: 0
    })

    // 时间线进度条
    gsap.to('.tl-progress-142', {
      scrollTrigger: {
        trigger: '.tl-stage-142',
        start: 'top center',
        end: 'bottom center',
        scrub: 0.5
      },
      scaleY: 1,
      ease: 'none'
    })

    // 事件依次出现
    events.forEach((_, index) => {
      gsap.to(`.tl-event-142:nth-child(${index + 1})`, {
        scrollTrigger: {
          trigger: `.tl-event-142:nth-child(${index + 1})`,
          start: 'top 80%',
          end: 'top 20%',
          toggleActions: 'play none none reverse'
        },
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
      })

      // 点的动画
      gsap.fromTo(`.tl-event-142:nth-child(${index + 1}) .tl-dot-142`,
        {
          scale: 0
        },
        {
          scrollTrigger: {
            trigger: `.tl-event-142:nth-child(${index + 1})`,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        }
      )
    })

    // 标题动画
    gsap.from('.tl-title-142', {
      scrollTrigger: {
        trigger: '.tl-container-142',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      y: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })

    // 描述动画
    gsap.from('.tl-desc-142', {
      scrollTrigger: {
        trigger: '.tl-container-142',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power3.out'
    })

    // 提示动画
    gsap.from('.tl-hint-142', {
      scrollTrigger: {
        trigger: '.tl-stage-142',
        start: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6
    })
  }, componentRoot.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
/* GSAP opacity fix: ensure content is always visible */

.timeline-142 {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  opacity: 1 !important;}

.tl-container-142 {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;

  opacity: 1 !important;}

.tl-title-142 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  margin-bottom: 10px;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.tl-desc-142 {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  text-align: center;

  opacity: 1 !important;}

.tl-stage-142 {
  width: 100%;
  position: relative;
  padding: 40px 0;

  opacity: 1 !important;}

.tl-line-142 {
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;

  opacity: 1 !important;}

.tl-progress-142 {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: linear-gradient(180deg, #fff 0%, #a8edea 100%);
  border-radius: 2px;
  transform-origin: top;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);

  opacity: 1 !important;}

.tl-events-142 {
  position: relative;
  padding-left: 80px;
}

.tl-event-142 {
  position: relative;
  margin-bottom: 60px;
  will-change: transform, opacity;
}

.tl-event-142:last-child {
  margin-bottom: 0;
}

.tl-dot-142 {
  position: absolute;
  left: -52px;
  top: 10px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
  will-change: transform;

  opacity: 1 !important;}

.tl-content-142 {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  opacity: 1 !important;}

.tl-year-142 {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.tl-title-text-142 {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8px;

  opacity: 1 !important;}

.tl-description-142 {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;

  opacity: 1 !important;}

.tl-hint-142 {
  margin-top: 30px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;

  opacity: 1 !important;}

@media (max-width: 768px) {
  .tl-line-142 {
    left: 20px;
  }
  
  .tl-events-142 {
    padding-left: 60px;
  }
  
  .tl-dot-142 {
    left: -38px;
    width: 16px;
    height: 16px;
  
  opacity: 1 !important;}
  
  .tl-content-142 {
    padding: 15px;
  
  opacity: 1 !important;}
  
  .tl-year-142 {
    font-size: 1.5rem;
  
  opacity: 1 !important;}
  
  .tl-title-text-142 {
    font-size: 1.1rem;
  
  opacity: 1 !important;}
}
</style>
