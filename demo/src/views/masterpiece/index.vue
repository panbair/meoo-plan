<template>
  <div ref="wrapperRef" class="masterpiece-wrapper">
    <!-- 动态星空背景 -->
    <Starfield :star-count="100" />

    <!-- 页面标题 -->
    <header class="page-header">
      <h1 class="page-title">组件展示</h1>
      <p class="page-subtitle">GSAP 高级动画组件库</p>
      <div class="performance-info" v-if="showPerformance">
        <span class="fps-counter">FPS: {{ fps }}</span>
        <span class="visible-count">可见组件: {{ visibleCount }}</span>
        <button class="optimize-btn" @click="optimizeAll">优化</button>
      </div>
    </header>

    <!-- 主英雄区域 - 3D立方体 -->
    <section class="hero-section">
      <ThreeDCube
        :size="250"
        :icons="['❄', '⚡', '🔥', '💧', '🌟', '🌙']"
        :rotate-speed="20"
        :hover-speed-multiplier="3"
      />
    </section>

    <!-- Tab 切换 -->
    <div class="tabs-container">
      <div class="tabs-wrapper">
        <button
          :class="['tab-button', { active: activeTab === 'canvas' }]"
          @click="activeTab = 'canvas'"
        >
          Canvas 组件 (18)
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'non-canvas' }]"
          @click="activeTab = 'non-canvas'"
        >
          GSAP 组件 (21)
        </button>
      </div>
      <div class="tab-indicator" :style="{ left: indicatorPosition }"></div>
    </div>

    <!-- Canvas 组件 -->
    <section v-if="activeTab === 'canvas'" class="canvas-section">
      <OptimizedSection
        v-for="(item, index) in canvasComponents"
        :key="`canvas-${index}`"
        :title="item.title"
        :subtitle="item.subtitle"
        :component="item.component"
        :props="item.props"
      />
    </section>

    <!-- 非Canvas 组件 -->
    <section v-if="activeTab === 'non-canvas'" class="non-canvas-section">
      <OptimizedSection
        v-for="(item, index) in nonCanvasComponents"
        :key="`non-canvas-${index}`"
        :title="item.title"
        :subtitle="item.subtitle"
        :component="item.component"
        :props="item.props"
      />
    </section>

    <!-- 时间轴区域 -->
    <section class="timeline-section">
      <div class="timeline-container">
        <div class="timeline-line"></div>
        <TimelineEvent
          v-for="(event, index) in timelineEvents"
          :key="index"
          :year="event.year"
          :title="event.title"
          :desc="event.desc"
          :index="index"
        />
      </div>
    </section>

    <!-- 返回顶部 -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, watch } from 'vue'
import { timelineEvents } from './data'
import Starfield from './components/Starfield.vue'
import ThreeDCube from './components/ThreeDCube.vue'
import Pyramid3D from './components/Pyramid3D.vue'
import DNAHelix from './components/DNAHelix.vue'
import SolarSystem from './components/SolarSystem.vue'
import MorphingBlob from './components/MorphingBlob.vue'
import CardCarousel from './components/CardCarousel.vue'
import AudioVisualizer from './components/AudioVisualizer.vue'
import InfinityLoop from './components/InfinityLoop.vue'
import ParallaxCards from './components/ParallaxCards.vue'
import Metronome from './components/Metronome.vue'
import WaveSpinner from './components/WaveSpinner.vue'
import HexagonGrid from './components/HexagonGrid.vue'
import QuantumPortal from './components/QuantumPortal.vue'
import NeuralNetwork from './components/NeuralNetwork.vue'
import CyberGlobe from './components/CyberGlobe.vue'
import HolographicDisplay from './components/HolographicDisplay.vue'
import AuroraBorealis from './components/AuroraBorealis.vue'
import MolecularStructure from './components/MolecularStructure.vue'
import CrystalFormation from './components/CrystalFormation.vue'
import TeslaCoil from './components/TeslaCoil.vue'
import GalaxySpiral from './components/GalaxySpiral.vue'
import WarpDrive from './components/WarpDrive.vue'
import QuantumComputer from './components/QuantumComputer.vue'
import MatterAntimatter from './components/MatterAntimatter.vue'
import BlackHole from './components/BlackHole.vue'
import FourthDimension from './components/FourthDimension.vue'
import NeonPulse from './components/NeonPulse.vue'
import TimeTravel from './components/TimeTravel.vue'
import FractalUniverse from './components/FractalUniverse.vue'
import SoundWave from './components/SoundWave.vue'
import Card3DFlipGallery from './components/Card3DFlipGallery.vue'
import LiquidWave from './components/LiquidWave.vue'
import ParticleExplosion from './components/ParticleExplosion.vue'
import QuantumEntanglement from './components/QuantumEntanglement.vue'
import NebulaStarburst from './components/NebulaStarburst.vue'
import ElectromagneticField from './components/ElectromagneticField.vue'
import ParticleWaveFusion from './components/ParticleWaveFusion.vue'
import CubeMatrix3D from './components/CubeMatrix3D.vue'
import LightTunnel from './components/LightTunnel.vue'
import TimelineEvent from './components/TimelineEvent.vue'
import BackToTop from './components/BackToTop.vue'
import OptimizedSection from './components/OptimizedSection.vue'

const wrapperRef = ref<HTMLElement>()
const componentsRefs = ref<any[]>([])
const fps = ref(60)
const visibleCount = ref(0)
const showPerformance = ref(false)
const activeTab = ref<'canvas' | 'non-canvas'>('canvas')
const indicatorPosition = ref('0%')
let ctx: any
let frameCount = 0
let lastTime = performance.now()
let animationId: number
let isOptimized = false

// 优化的组件列表（减少粒子数量）
const carouselCards = [
  { title: 'GSAP', desc: '强大的动画库', color: '#8b5cf6' },
  { title: 'Vue 3', desc: '渐进式框架', color: '#3b82f6' },
  { title: 'TypeScript', desc: '类型安全', color: '#ec4899' },
  { title: 'SCSS', desc: 'CSS 预处理器', color: '#10b981' }
]

const parallaxCards = [
  { icon: '🚀', title: '快速启动', desc: '秒级响应，即刻开始', color: '#8b5cf6' },
  { icon: '⚡', title: '高性能', desc: '极致优化，流畅体验', color: '#3b82f6' },
  { icon: '🎨', title: '美观设计', desc: '精心打磨，视觉盛宴', color: '#ec4899' },
  { icon: '🔒', title: '安全可靠', desc: '多层防护，值得信赖', color: '#10b981' }
]

// Canvas 组件配置
const canvasComponents = reactive([
  { title: '极光带', subtitle: '粒子流体模拟', component: AuroraBorealis, props: { width: 500, height: 350, particleCount: 200 } },
  { title: '晶体形成', subtitle: 'Voronoi 几何模拟', component: CrystalFormation, props: { cellCount: 25 } },
  { title: '螺旋星系', subtitle: '万有引力模拟', component: GalaxySpiral, props: { starCount: 600 } },
  { title: '曲速引擎', subtitle: '空间折叠模拟', component: WarpDrive, props: { starCount: 400 } },
  { title: '物质反物质', subtitle: '粒子对撞模拟', component: MatterAntimatter, props: { width: 500, height: 350 } },
  { title: '黑洞视界', subtitle: '事件视界引力奇点', component: BlackHole, props: { size: 350, particleCount: 200 } },
  { title: '四维超立方', subtitle: 'Tesseract 超体可视化', component: FourthDimension, props: { size: 350 } },
  { title: '霓虹脉冲', subtitle: '电磁波频率共振', component: NeonPulse, props: { size: 350 } },
  { title: '时空穿梭', subtitle: '时间维度的折叠与展开', component: TimeTravel, props: { size: 400, particleCount: 250 } },
  { title: '分形宇宙', subtitle: '无限自相似几何', component: FractalUniverse, props: { size: 400 } },
  { title: '声波可视化', subtitle: '频率与振幅分析', component: SoundWave, props: { size: 400, waveCount: 4 } },
  { title: '粒子爆炸', subtitle: 'GSAP粒子爆炸效果', component: ParticleExplosion, props: {} },
  { title: '量子纠缠网络', subtitle: '量子态可视化', component: QuantumEntanglement, props: {} },
  { title: '星云星暴', subtitle: '恒星系统与爆发', component: NebulaStarburst, props: {} },
  { title: '电磁力场', subtitle: '电场与磁场可视化', component: ElectromagneticField, props: {} },
  { title: '粒子波浪融合', subtitle: 'GSAP粒子波浪动画', component: ParticleWaveFusion, props: {} },
  { title: '光流隧道', subtitle: 'GSAP光流效果', component: LightTunnel, props: {} }
])

// 非 Canvas 组件配置
const nonCanvasComponents = reactive([
  { title: '3D 金字塔', subtitle: '悬浮与旋转动画', component: Pyramid3D, props: { size: 180 } },
  { title: 'DNA 双螺旋', subtitle: '动态螺旋结构', component: DNAHelix, props: { height: 350, speed: 2 } },
  { title: '太阳系', subtitle: '行星轨道动画', component: SolarSystem, props: { size: 300 } },
  { title: '变形液滴', subtitle: '流动形态变换', component: MorphingBlob, props: { size: 250 } },
  { title: '3D 卡片轮播', subtitle: '自动播放卡片', component: CardCarousel, props: { cards: carouselCards, autoPlay: true, autoPlayInterval: 3000 } },
  { title: '音频可视化', subtitle: '动态波形显示', component: AudioVisualizer, props: { barCount: 15 } },
  { title: '无限循环', subtitle: '路径跟随动画', component: InfinityLoop, props: { size: 180 } },
  { title: '视差卡片', subtitle: '3D 悬浮效果', component: ParallaxCards, props: { cards: parallaxCards } },
  { title: '节拍器', subtitle: '交互式摆动动画', component: Metronome, props: { initialBpm: 60 } },
  { title: '波浪旋转器', subtitle: '动态加载效果', component: WaveSpinner, props: { barCount: 10 } },
  { title: '蜂窝网格', subtitle: '交互式矩阵', component: HexagonGrid, props: { gridSize: 4 } },
  { title: '量子传送门', subtitle: '次元撕裂效果', component: QuantumPortal, props: { size: 350 } },
  { title: '神经网络', subtitle: 'AI 数据流可视化', component: NeuralNetwork, props: { layers: [3, 5, 7, 5, 3] } },
  { title: '赛博地球', subtitle: '全球数据监控', component: CyberGlobe, props: { size: 350 } },
  { title: '全息显示', subtitle: '未来科技界面', component: HolographicDisplay, props: { size: 350 } },
  { title: '分子结构', subtitle: '动态原子键模拟', component: MolecularStructure, props: { atomCount: 15 } },
  { title: '特斯拉线圈', subtitle: '高压电弧模拟', component: TeslaCoil, props: { arcCount: 8 } },
  { title: '量子计算机', subtitle: '量子比特模拟', component: QuantumComputer, props: { qubitCount: 6 } },
  { title: '3D卡片翻转画廊', subtitle: 'GSAP+CSS3翻转动画', component: Card3DFlipGallery, props: {} },
  { title: '流体波浪', subtitle: 'GSAP流体波浪动画', component: LiquidWave, props: {} },
  { title: '3D立方体矩阵', subtitle: 'GSAP 3D矩阵动画', component: CubeMatrix3D, props: {} }
])

// FPS 计算 - 只在需要时运行
const updateFPS = () => {
  frameCount++
  const currentTime = performance.now()

  if (currentTime - lastTime >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastTime = currentTime

    // 性能监控
    if (fps.value < 30 && !showPerformance.value) {
      showPerformance.value = true
    }
  }

  animationId = requestAnimationFrame(updateFPS)
}

// 优化所有组件
const optimizeAll = () => {
  isOptimized = !isOptimized

  if (isOptimized) {
    // 暂停不可见组件
    componentsRefs.value.forEach(ref => {
      const el = ref.$el
      if (!el) return
      const rect = el.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0

      if (!isVisible) {
        ref.pauseAnimation?.()
      }
    })
  } else {
    // 恢复所有组件
    componentsRefs.value.forEach(ref => {
      ref.resumeAnimation?.()
    })
  }
}

// 滚动优化
let ticking = false
const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      if (isOptimized) {
        // 只暂停远离视口的组件
        componentsRefs.value.forEach(ref => {
          const el = ref.$el
          if (!el) return
          const rect = el.getBoundingClientRect()
          const isVisible = rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight * 0.5

          if (isVisible) {
            ref.resumeAnimation?.()
          } else {
            ref.pauseAnimation?.()
          }
        })
      }
      ticking = false
    })
    ticking = true
  }
}

// 监听 tab 切换，更新指示器位置
watch(activeTab, (newTab) => {
  indicatorPosition.value = newTab === 'canvas' ? '0%' : '50%'
})

onMounted(() => {
  // 只在性能较低时启动 FPS 监控
  if (showPerformance.value) {
    updateFPS()
  }
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('scroll', onScroll)
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.masterpiece-wrapper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%);
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow-x: hidden;
  position: relative;
}

.page-header {
  text-align: center;
  padding: 60px 20px 40px;
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #a78bfa, #60a5fa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #94a3b8;
}

.performance-info {
  margin-top: 20px;
  padding: 12px 20px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.85rem;
  animation: fadeIn 0.5s ease;
}

.fps-counter {
  color: #ef4444;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.visible-count {
  color: #94a3b8;
}

.optimize-btn {
  padding: 6px 12px;
  background: #ef4444;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    transform: scale(1.05);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-section {
  padding: 40px 20px 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.component-section {
  padding: 60px 10%;
  position: relative;
  z-index: 1;
}

.component-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.experiment-section {
  padding: 120px 10%;
  position: relative;
  z-index: 1;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
}

.timeline-section {
  padding: 120px 10%;
  position: relative;
  z-index: 1;
}

.timeline-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, transparent, rgba(167, 139, 250, 0.5), transparent);
  transform: translateX(-50%);
}

.tabs-container {
  position: relative;
  margin: 40px 10% 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.tabs-wrapper {
  display: flex;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tab-button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.tab-button:hover {
  color: #e2e8f0;
}

.tab-button.active {
  color: #fff;
}

.tab-indicator {
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 50%;
  height: calc(100% - 16px);
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  border-radius: 8px;
  transition: left 0.3s ease;
  z-index: 1;
}

.canvas-section,
.non-canvas-section {
  padding: 20px 10%;
  position: relative;
  z-index: 1;
}

.canvas-section {
  background: linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.05), transparent);
}

.non-canvas-section {
  background: linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.05), transparent);
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}
</style>
