<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, shallowRef, defineAsyncComponent } from 'vue'

// ==================== 预加载数量控制 ====================
const PRELOAD_COUNT = 2 // 视口上方预加载数量
const VISIBLE_BUFFER = 2 // 视口下方预加载数量

// ==================== 懒加载模式 ====================
const LAZY_MODE = true // 设为 false 可关闭懒加载

// ==================== 响应式数据 ====================
const visibleCards = ref(new Set<number>())
const pageRefs = ref<Map<number, HTMLElement>>(new Map())
const propsMap = ref<Map<number, Record<string, unknown>>>(new Map())
let observer: IntersectionObserver | null = null

// ==================== 动态导入组件 ====================
// card-list 目录组件
const modules = import.meta.glob('./card-list/*/[^/]*.vue', { eager: true })
// card-time 目录组件（精确匹配主文件）
const modulesTime = import.meta.glob('./card-time/*/CardTime*.vue', { eager: true })

/**
 * 自动化构建组件列表
 */
// let dirNameList=['Card3DFlipGallery', 'CardAbstractGeometry', ]
const dirNameList = [
  'CardTimeCosmic',
  'CardTimeForge',
  'CardTimeNeon',
  'CardTimePageFlip',
  'CardTimeQuantumLeap',
  'CardTimeRasterize',
  'CardTimeSpatialDepth',
  'CardTimeCinematic',
  'CardTimeCubeFlip',
  'CardTimeDiagonal',
  'CardTimeDust',
  'CardTimeElastic',
  'CardTimeEpicenter',
  'CardTimeHologram',
  'CardTimeLuminous',
  'CardTimeLuxeDrop',
  'CardTimeLuxury',
  'CardTimeRevelation',
  'CardTimeShimmer',
  'CardTimeSpiral',
  'CardTimeTypography',
  'CardTimeVoyage',
  'CardTimeWave',
  'CardTimeBeat',
  'CardTimeBlueprint',
  'CardTimeBook',
  'CardTimeDrawer',
  'CardTimeEqualizer',
  'CardTimeLens',
  'CardTimeShatter',
  'CardTimeTeam',
  'CardTimeTrust',
  'CardTimeAether',
  'CardTimeCascade',
  'CardTimeDepthParallax',
  'CardTimeMagicFlip',
  'CardTimeMaterialAwakening',
  'CardTimeMirage',
  'CardTimePerspective',
  'CardTimeRipple',
  'CardTimeSingularity',
  'CardTimeSolarFlare',
  'CardTimeTemporal',
  'CardTimeTheatre',
  'CardAllInOne',
  'CardAudioWave',
  'CardAurora',
  'CardAuroraWave',
  'CardBioluminescence',
  'CardCatalyst',
  'CardCelestial',
  'CardCircuit',
  'CardCrystal',
  'CardCyberspace',
  'CardDNA',
  'CardDataStream',
  'CardEclipse',
  'CardFadeBlur',
  'CardFadeInOut',
  'CardFireflies',
  'CardFrost',
  'CardFullCombo',
  'CardFusion',
  'CardGalaxy',
  'CardGlacier',
  'CardGlitch',
  'CardGradientWave',
  'CardGravity',
  'CardGravity2',
  'CardHologram',
  'CardHolographic',
  'CardInfinity',
  'CardKaleidoscope',
  'CardLightning',
  'CardLiquid',
  'CardLiquidMetal',
  'CardMagma',
  'CardMatrix',
  'CardMeteor',
  'CardMorph',
  'CardMosaic',
  'CardNebula',
  'CardNeon',
  'CardNeonCircuit',
  'CardNineCombo',
  'CardParticle',
  'CardPhantom',
  'CardPlasma',
  'CardPortal',
  'CardPrism',
  'CardQuantum',
  'CardRipple',
  'CardRotate',
  'CardRotateScaleTranslate',
  'CardScale',
  'CardShatter',
  'CardSixCombo',
  'CardSlideEdge',
  'CardSolarSystem',
  'CardSphere',
  'CardSupernova',
  'CardSwipe',
  'CardTornado',
  'CardTranslate',
  'CardTranslateRotateScale',
  'CardVoid',
  'CardVortex',
  'CardWave',
]

const dirNameList1 = []

const cardComponents = computed(() => {
  // 处理 card-list 目录组件
  const listComponents = Object.entries(modules)
    .map(([path, module]) => {
      const match = path.match(/\/card-list\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE
          ? defineAsyncComponent(() => import(/* @vite-ignore */ path))
          : (module as any)?.default || null,
        type: 'card-list'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
        console.log(dirNameList1)
      }

      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-time 目录组件
  const timeComponents = Object.entries(modulesTime)
    .map(([path, module]) => {
      const match = path.match(/\/card-time\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Time/g, ' Time')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE
          ? defineAsyncComponent(() => import(/* @vite-ignore */ path))
          : (module as any)?.default || null,
        type: 'card-time'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
        console.log(dirNameList1)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 合并两个数组，card-time 组件在前
  return [...listComponents, ...timeComponents]
})

// ==================== 模板引用 ====================
const setPageRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  const element = el instanceof Element ? el : (el as any)?.$el
  if (element) {
    pageRefs.value.set(index, element as HTMLElement)
  } else {
    pageRefs.value.delete(index)
  }
}

// ==================== Intersection Observer ====================
const initIntersectionObserver = () => {
  if (!LAZY_MODE) {
    // 非懒加载模式：预加载前 N 个
    cardComponents.value.forEach((_, index) => {
      if (index < PRELOAD_COUNT) {
        visibleCards.value.add(index)
      }
    })
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = parseInt((entry.target as HTMLElement).dataset.index || '0')

        if (entry.isIntersecting) {
          // 进入视口：加载组件
          visibleCards.value.add(index)
          // 预加载下一个
          for (let i = 1; i <= VISIBLE_BUFFER; i++) {
            const nextIndex = index + i
            if (nextIndex < cardComponents.value.length) {
              visibleCards.value.add(nextIndex)
            }
          }
        } else {
          // 离开视口较远时卸载（节省内存）
          const viewportHeight = window.innerHeight
          const rect = entry.boundingClientRect
          if (rect.top < -viewportHeight * 2 || rect.top > viewportHeight * 3) {
            visibleCards.value.delete(index)
          }
        }
      })
    },
    {
      root: null,
      rootMargin: '0px 0px -20% 0px', // 视口下方 20% 开始加载
      threshold: 0
    },
  )

  // 观察所有页面
  pageRefs.value.forEach((el, index) => {
    el.dataset.index = String(index)
    observer?.observe(el)
  })
}

// ==================== 滚动监听（备用） ====================
const handleScroll = () => {
  if (!LAZY_MODE) {
    return
  }

  const viewportHeight = window.innerHeight
  const scrollTop = window.scrollY

  cardComponents.value.forEach((_, index) => {
    const pageEl = pageRefs.value.get(index)
    if (!pageEl) {
      return
    }

    const rect = pageEl.getBoundingClientRect()
    const pageTop = rect.top + scrollTop

    // 在视口范围内或预加载范围内
    const inView = rect.top < viewportHeight && rect.bottom > 0
    const inPreload = pageTop < scrollTop + viewportHeight * (1 + PRELOAD_COUNT * 0.5)

    if (inView || inPreload) {
      visibleCards.value.add(index)
    }
  })
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 初始化可见性
  if (!LAZY_MODE) {
    cardComponents.value.forEach((_, index) => {
      if (index < PRELOAD_COUNT) {
        visibleCards.value.add(index)
      }
    })
  } else {
    // 等待 DOM 渲染后初始化 Observer
    setTimeout(initIntersectionObserver, 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="web-list">
    <div class="page page1">
      <h1 class="page-title">Creative Cards Gallery</h1>
      <p class="page-desc">Scroll down to explore interactive card animations</p>
      <div>数量：{{ cardComponents.length }}</div>
      <div class="scroll-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div
      v-for="(cardInfo, index) in cardComponents"
      :key="cardInfo.name"
      :ref="(el) => setPageRef(el, index)"
      :class="['page', `page-card-${index + 1}`]"
    >
      <!-- 懒加载：只在进入视口时渲染组件 -->
      <component :is="cardInfo.component" v-if="visibleCards.has(index)" v-bind="propsMap[index]" />
      <span class="position-absolute top-10px left-100px color-red z-index-99999">
        {{ cardInfo.dirName }}</span
      >
    </div>

    <div class="page page-footer">
      <h1 class="page-title">That's All</h1>
      <p class="page-desc">Thanks for watching</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// ==================== 布局样式 ====================
.web-list {
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;

  .page {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    box-sizing: border-box;
  }

  .page-header {
    text-align: center;
    margin-bottom: 60px;

    .page-index {
      display: inline-block;
      font-size: 0.875rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.1);
      padding: 4px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 700;
      color: #fff;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      margin: 0 0 12px 0;
    }

    .page-desc {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      max-width: 500px;
    }
  }
}

// ==================== 页面背景 ====================
.page1 {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .page-title {
    color: #fff;
  }
  .page-desc {
    color: rgba(255, 255, 255, 0.8);
  }
}

.page-card-1 {
  background: linear-gradient(135deg, #77b3e3 0%, #4a90d9 100%);
}

.page-card-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.page-card-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.page-card-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.page-card-5 {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.page-footer {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

  .page-title {
    color: #fff;
  }
  .page-desc {
    color: rgba(255, 255, 255, 0.6);
  }
}

// ==================== 滚动指示器 ====================
.scroll-indicator {
  position: absolute;
  bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  span {
    width: 30px;
    height: 30px;
    border-right: 3px solid #fff;
    border-bottom: 3px solid #fff;
    transform: rotate(45deg);
    animation: scrollBounce 1.5s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
      opacity: 0.7;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
      opacity: 0.4;
    }
  }
}

@keyframes scrollBounce {
  0%,
  100% {
    transform: rotate(45deg) translateY(0);
    opacity: 1;
  }
  50% {
    transform: rotate(45deg) translateY(15px);
    opacity: 0.5;
  }
}
</style>
