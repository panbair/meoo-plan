<template>
  <div class="hscroll-section-69">
    <div class="hs-header-69">
      <h2 class="hs-title-69">水平滚动</h2>
      <p class="hs-subtitle-69">Horizontal Scroll Cards</p>
    </div>

    <div class="hscroll-container-69" ref="scrollContainer">
      <div class="hscroll-track-69" ref="scrollTrack">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="hscroll-card-69"
          :class="{ 'hs-visible-69': visibleCards.includes(index) }"
        >
          <div class="card-image-wrapper-69">
            <div class="card-image-69" :style="{ backgroundImage: `url(${card.image})` }"></div>
            <div class="card-badge-69">{{ card.badge }}</div>
          </div>
          <div class="card-content-69">
            <h3 class="card-title-69">{{ card.title }}</h3>
            <p class="card-desc-69">{{ card.description }}</p>
            <div class="card-footer-69">
              <div class="card-author-69">
                <div class="author-avatar-69">{{ card.author.charAt(0) }}</div>
                <span class="author-name-69">{{ card.author }}</span>
              </div>
              <button class="card-action-69">查看详情</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hs-progress-69">
      <div class="progress-bar-69" ref="progressBar"></div>
    </div>

    <div class="hs-controls-69">
      <button class="hs-nav-btn-69" @click="scrollLeft">
        <span>◀</span>
      </button>
      <span class="hs-page-indicator-69">{{ currentPage }} / {{ totalPages }}</span>
      <button class="hs-nav-btn-69" @click="scrollRight">
        <span>▶</span>
      </button>
    </div>

    <!-- 滚动提示 -->
    <div class="hs-scroll-hint-69">
      <span class="hs-hint-icon-69">⬇</span>
      <span class="hs-hint-text-69">向下滚动查看更多</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scrollContainer = ref<HTMLElement>()
const scrollTrack = ref<HTMLElement>()
const progressBar = ref<HTMLElement>()
const visibleCards = ref<number[]>([0, 1, 2])
const currentPage = ref(1)
let ctx: gsap.Context

const cards = [
  {
    title: '创意工坊',
    description: '探索无限创意可能，打造独特品牌形象',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    badge: '热门',
    author: '张三'
  },
  {
    title: '技术前沿',
    description: '掌握最新技术趋势，引领行业发展',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80',
    badge: '推荐',
    author: '李四'
  },
  {
    title: '设计美学',
    description: '追求极致视觉体验，传递品牌价值',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    badge: '精选',
    author: '王五'
  },
  {
    title: '用户体验',
    description: '以用户为中心，创造流畅交互',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    badge: '新晋',
    author: '赵六'
  },
  {
    title: '数据驱动',
    description: '用数据说话，助力科学决策',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    badge: '热门',
    author: '孙七'
  },
  {
    title: '品牌策略',
    description: '制定全方位品牌战略，提升影响力',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    badge: '推荐',
    author: '周八'
  },
  {
    title: '营销创新',
    description: '创新营销模式，引爆品牌声量',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
    badge: '精选',
    author: '吴九'
  },
  {
    title: '客户成功',
    description: '客户第一，创造长期价值',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80',
    badge: '新晋',
    author: '郑十'
  }
]

const totalPages = Math.ceil(cards.length / 3)

const scrollLeft = () => {
  if (!scrollTrack.value) return
  const scrollAmount = scrollTrack.value.offsetWidth * 0.8
  const currentX = parseFloat(scrollTrack.value.style.transform?.replace('translateX(', '')?.replace('px)', '') || '0')
  const newX = Math.min(currentX + scrollAmount, 0)

  gsap.to(scrollTrack.value, {
    x: newX,
    duration: 0.6,
    ease: 'power3.out'
  })
  updateProgress()
}

const scrollRight = () => {
  if (!scrollTrack.value) return
  const maxScroll = scrollTrack.value.scrollWidth - scrollTrack.value.offsetWidth
  const scrollAmount = scrollTrack.value.offsetWidth * 0.8
  const currentX = parseFloat(scrollTrack.value.style.transform?.replace('translateX(', '')?.replace('px)', '') || '0')
  const newX = Math.max(currentX - scrollAmount, -maxScroll)

  gsap.to(scrollTrack.value, {
    x: newX,
    duration: 0.6,
    ease: 'power3.out'
  })
  updateProgress()
}

const updateProgress = () => {
  if (!scrollTrack.value || !progressBar.value) return

  const totalWidth = scrollTrack.value.scrollWidth
  const containerWidth = scrollTrack.value.offsetWidth
  const currentX = parseFloat(scrollTrack.value.style.transform?.replace('translateX(', '')?.replace('px)', '') || '0')
  const progress = Math.abs(currentX) / (totalWidth - containerWidth)

  gsap.to(progressBar.value, {
    width: `${progress * 100}%`,
    duration: 0.6,
    ease: 'power3.out'
  })

  currentPage.value = Math.min(Math.ceil((progress * (totalPages - 1)) + 1), totalPages)
}

const observeVisibleCards = () => {
  if (!scrollContainer.value) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const index = parseInt(entry.target.getAttribute('data-index') || '0')
      if (entry.isIntersecting) {
        if (!visibleCards.value.includes(index)) {
          visibleCards.value.push(index)
          gsap.fromTo(entry.target,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
          )
        }
      }
    })
  }, { threshold: 0.2, root: scrollContainer.value })

  document.querySelectorAll('.hscroll-card-69').forEach(card => {
    observer.observe(card)
  })

  return observer
}

onMounted(() => {
  ctx = gsap.context(() => {
    // 标题动画
    gsap.fromTo('.hs-title-69',
      { y: 50, opacity: 0 },
      {
        scrollTrigger: { trigger: '.hscroll-section-69', start: 'top 80%' },
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
      }
    )

    // 副标题动画
    gsap.fromTo('.hs-subtitle-69',
      { y: 30, opacity: 0 },
      {
        scrollTrigger: { trigger: '.hscroll-section-69', start: 'top 75%' },
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
      }
    )

    // 滚动条驱动的水平滚动
    if (scrollTrack.value) {
      gsap.to(scrollTrack.value, {
        x: () => -(scrollTrack.value!.scrollWidth - scrollTrack.value!.parentElement!.offsetWidth),
        scrollTrigger: {
          trigger: '.hscroll-section-69',
          start: 'top 70%',
          end: 'bottom 20%',
          scrub: 1,
          onUpdate: (self) => {
            updateProgress()
          }
        },
        ease: 'none'
      })
    }

    // 卡片动画 - 分批显示
    gsap.fromTo('.hscroll-card-69',
      { y: 60, opacity: 0 },
      {
        scrollTrigger: { trigger: '.hscroll-container-69', start: 'top 65%' },
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
      }
    )

    // 导航按钮
    gsap.fromTo('.hs-nav-btn-69',
      { scale: 0, opacity: 0 },
      {
        scrollTrigger: { trigger: '.hs-controls-69', start: 'top 90%' },
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }
    )

    // 页面指示器
    gsap.fromTo('.hs-page-indicator-69',
      { y: 20, opacity: 0 },
      {
        scrollTrigger: { trigger: '.hs-controls-69', start: 'top 90%' },
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: 0.2,
        ease: 'power3.out'
      }
    )
  })

  document.querySelectorAll('.hscroll-card-69').forEach((card, i) => {
    card.setAttribute('data-index', i.toString())
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.hscroll-section-69 {
  min-height: 100vh;
  padding: 80px 40px;
  background: linear-gradient(180deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
  overflow: hidden;

  opacity: 1 !important;}

.hs-header-69 {
  text-align: center;
  margin-bottom: 60px;

  opacity: 1 !important;}

.hs-title-69 {
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff !important;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.hs-subtitle-69 {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8) !important;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.hscroll-container-69 {
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: 500px;
  margin: 0 auto;
  overflow: hidden;

  opacity: 1 !important;}

.hscroll-track-69 {
  display: flex;
  gap: 32px;
  width: max-content;
  transform: translateX(0);

  opacity: 1 !important;}

.hscroll-card-69 {
  width: 380px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 1 !important;
  transform: translateY(0) !important;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
    border-color: rgba(102, 126, 234, 0.3);
  }
}

.card-image-wrapper-69 {
  position: relative;
  width: 100%;
  height: 220px;

  opacity: 1 !important;}

.card-image-69 {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;

  opacity: 1 !important;}

.card-badge-69 {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  opacity: 1 !important;}

.card-content-69 {
  padding: 24px;

  opacity: 1 !important;}

.card-title-69 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff !important;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  opacity: 1 !important;}

.card-desc-69 {
  color: rgba(255, 255, 255, 0.85) !important;
  line-height: 1.6;
  margin-bottom: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

  opacity: 1 !important;}

.card-footer-69 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-author-69 {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar-69 {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;

  opacity: 1 !important;}

.author-name-69 {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 0.9rem;

  opacity: 1 !important;}

.card-action-69 {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(102, 126, 234, 0.5);
  border-radius: 20px;
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    transform: scale(1.05);
  
  opacity: 1 !important;}
}

.hs-progress-69 {
  width: 100%;
  max-width: 600px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin: 40px auto;
  overflow: hidden;

  opacity: 1 !important;}

.progress-bar-69 {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;

  opacity: 1 !important;}

.hs-controls-69 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}

.hs-nav-btn-69 {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex !important;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  opacity: 1 !important;
  transform: scale(1) !important;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
}

.hs-page-indicator-69 {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 1rem;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.hs-scroll-hint-69 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
  animation: hintPulse 2s ease-in-out infinite;
}

.hs-hint-icon-69 {
  font-size: 2rem;
  color: rgba(102, 126, 234, 0.6);
  animation: hintBounce 1.5s ease-in-out infinite;

  opacity: 1 !important;}

.hs-hint-text-69 {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;

  opacity: 1 !important;}

@keyframes hintPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes hintBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

@media (max-width: 768px) {
  .hs-title-69 {
    font-size: 2.2rem;
  
  opacity: 1 !important;}

  .hscroll-container-69 {
    height: 450px;
  
  opacity: 1 !important;}

  .hscroll-card-69 {
    width: 300px;
  
  opacity: 1 !important;}

  .card-image-wrapper-69 {
    height: 180px;
  
  opacity: 1 !important;}
}
</style>
