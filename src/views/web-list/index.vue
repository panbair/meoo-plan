<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  shallowRef,
  defineAsyncComponent,
  watch,
  nextTick,
} from 'vue'
import { useRouter } from 'vue-router'

// 获取 router 实例
const router = useRouter()

// ==================== 预加载数量控制 ====================
const PRELOAD_COUNT = 2 // 视口上方预加载数量
const VISIBLE_BUFFER = 2 // 视口下方预加载数量

// ==================== 懒加载模式 ====================
const LAZY_MODE = true // 设为 false 可关闭懒加载

// ==================== 分类筛选 ====================
// 当前选中的分类（默认全部）
const activeCategory = ref('all')

// ==================== 收藏功能 ====================
// 从 localStorage 加载收藏的组件名列表
const loadFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem('cardFavorites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// 收藏的组件名列表
const favorites = ref<string[]>(loadFavorites())

// 保存收藏到 localStorage
const saveFavorites = () => {
  localStorage.setItem('cardFavorites', JSON.stringify(favorites.value))
}

// 切换收藏状态
const toggleFavorite = (dirName: string) => {
  const index = favorites.value.indexOf(dirName)
  if (index === -1) {
    favorites.value.push(dirName)
  } else {
    favorites.value.splice(index, 1)
  }
  saveFavorites()
}

// 检查组件是否已收藏
const isFavorite = (dirName: string) => favorites.value.includes(dirName)

// 添加收藏分类
const categories = [
  { key: 'all', label: '全部' },
  { key: 'card-image', label: '图片' },
  { key: 'card-img', label: '图像' },
  { key: 'card-text', label: '文字' },
  { key: 'card-3d', label: '3D' },
  { key: 'card-time', label: '时间' },
  { key: 'card-list', label: '基础' },
  { key: 'favorite', label: '我的收藏' },
]

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
// card-3d 目录组件
const modules3d = import.meta.glob('./card-3d/*/[^/]*.vue', { eager: true })
// card-img 目录组件
const modulesImg = import.meta.glob('./card-img/*/[^/]*.vue', { eager: true })
// card-image 目录组件
const modulesImage = import.meta.glob('./card-image/*/[^/]*.vue', { eager: true })
// card-text 目录组件
const modulesText = import.meta.glob('./card-text/*/[^/]*.vue', { eager: true })

/**
 * 自动化构建组件列表
 */
/*const dirNameList = [
  'CardImageCarbonBlade',
  'CardImageCarbonCrystal',
  'CardImageCrossCrack',
  'CardImageCurtainRise',
  'CardImageDeepSeaCoffin',
  'CardImageDepthStorm',
  'CardImageDiagonalGrid',
  'CardImageDiagonalSlice',
  'CardImageGlacierCrevasse',
  'CardImageMirage',
  'CardImageObsidianSplit',
  'CardImagePulsarBurst',
  'CardImageRippleReveal',
  'CardImageRockCrack',
  'CardImageRollingShade',
  'CardImageShatterRebuild',
  'CardImageSkyTower',
  'CardImageStardustCoalescence',
  'CardImgBokeh',
  'CardImgDiag',
  'CardImgDoubleEdge',
  'CardImgFeather',
  'CardImgFocalWindow',
  'CardImgFocusRing',
  'CardImgMontage',
  'CardImgNarrative',
  'CardImgPearl',
  'CardImgSand',
  'CardImgSink',
  'CardImgStarCore',
  'CardImgVapor',
  'CardImgDarkroom',
  'CardImgFrost',
  'CardImgPerspective',
  'CardImgReversal',
  'CardImgStage',
  'CardImgSundial',
  'CardImgVault',
  'CardImgAmber',
  'CardImgDepthLadder',
  'CardImgFlipCard',
  'CardImgMorningMist',
  'CardImgSpinCard',
  'CardImgTidalDream',
  'CardImgWaterfall',
  'CardImgZen',
  'CardImgBeacon',
  'CardImgBook',
  'CardImgCrystal',
  'CardImgFallingLeaf',
  'CardImgFlyingStones',
  'CardImgFoldedFan',
  'CardImgPinhole',
  'CardImgRippleWave',
  'CardImgSplitFocus',
  'CardImgSteel',
  'CardImgTelescope',
  'CardImgTitanium',
  'CardImgTungsten',
  'CardImgVelvet',
  'CardImgVelvetDisplay',
  'CardImgWaxSeal',
  'CardImgCarousel',
  'CardImgCloudTide',
  'CardImgDolly',
  'CardImgDust',
  'CardImgFlip',
  'CardImgFloat',
  'CardImgFlower',
  'CardImgForestMist',
  'CardImgInk',
  'CardImgMaglev',
  'CardImgMistReveal',
  'CardImgNebulaBreath',
  'CardImgPolarize',
  'CardImgPrism',
  'CardImgRain',
  'CardImgRipple',
  'CardImgRiver',
  'CardImgTwinWings',
  'CardImgDeepPulse',
  'CardImgFilm',
  'CardImgGravity',
  'CardImgHydraulic',
  'CardImgStatic',
  'CardImgStripes',
  'CardImgAurora',
  'CardImgCube',
  'CardImgDeepSea',
  'CardImgFog',
  'CardImgGalaxy',
  'CardImgMirror',
  'CardImgThermal',
  'CardImgBloom',
  'CardImgCrosshair',
  'CardImgCurtain',
  'CardImgDepth',
  'CardImgGilded',
  'CardImgMercury',
  'CardImgProjector',
  'CardImgTyndall',
  'CardImgAbyss',
  'CardImgAperture',
  'CardImgDeconstruct',
  'CardImgFocusShift',
  'CardImgParallax',
  'CardImgRift',
  'CardImgStardust',
  'CardImgVortex',
  'CardImgWireless',
  'Card3DFlipGallery',
  'Card3dHologram',
  'Card3dHouse',
  'Card3dTome',
  'CardTextAurora',
  'CardTextBioluminescent',
  'CardTextBlur',
  'CardTextBoiling',
  'CardTextChladni',
  'CardTextCinematic',
  'CardTextCorona',
  'CardTextCrystal',
  'CardTextCyber',
  'CardTextDomino',
  'CardTextFirework',
  'CardTextFluid3D',
  'CardTextGalaxy',
  'CardTextHologram',
  'CardTextHolographic',
  'CardTextInk',
  'CardTextLaser',
  'CardTextMagnetic',
  'CardTextMetal',
  'CardTextMoonlightEmbroider',
  'CardTextMycelium',
  'CardTextNeonCrack',
  'CardTextNeonSign',
  'CardTextOrganic',
  'CardTextOrigami',
  'CardTextParticleStorm',
  'CardTextPrismDispersion',
  'CardTextQuantumCollapse',
  'CardTextSeismograph',
  'CardTextSpikes',
  'CardTextSweep',
  'CardTextSynapse',
  'CardTextTsunami3D',
  'CardTextVoidRebirth',
  'CardTextWaterWave',
  'Card3dCube',
  'Card3dEntanglement',
  'Card3dSpectrum',
  'Card3dWormhole',
  'CardTimeOrbitFlip',

  'CardTimeGravity',
  'CardTimeKaleidoscope',
  'CardTimeMagnet',
  'CardTimeOrbitFlip',
  'CardAbstractGeometry',
  'CardTimeAether',
  'CardTimeBeat',
  'CardTimeBlackHole',
  'CardTimeBlueprint',
  'CardTimeBook',
  'CardTimeCascade',
  'CardTimeCinematic',
  'CardTimeCosmic',
  'CardTimeCosmicRhythm',
  'CardTimeCubeFlip',
  'CardTimeDepthParallax',
  'CardTimeDiagonal',
  'CardTimeDimensionFold',
  'CardTimeDrawer',
  'CardTimeDust',
  'CardTimeElastic',
  'CardTimeEpicenter',
  'CardTimeEqualizer',
  'CardTimeForge',
  'CardTimeGravitonSling',
  'CardTimeHologram',
  'CardTimeLens',
  'CardTimeLuminous',
  'CardTimeLuxeDrop',
  'CardTimeLuxury',
  'CardTimeMagicFlip',
  'CardTimeMaterialAwakening',
  'CardTimeMirage',
  'CardTimeNeon',
  'CardTimePageFlip',
  'CardTimePerspective',
  'CardTimeQuantumLeap',
  'CardTimeRasterize',
  'CardTimeRevelation',
  'CardTimeRipple',
  'CardTimeShatter',
  'CardTimeShimmer',
  'CardTimeSingularity',
  'CardTimeSolarFlare',
  'CardTimeSpacetimeFissure',
  'CardTimeSpatialDepth',
  'CardTimeSpiral',
  'CardTimeStellarOrbit',
  'CardTimeTeam',
  'CardTimeTemporal',
  'CardTimeTheatre',
  'CardTimeTrust',
  'CardTimeTypography',
  'CardTimeVoyage',
  'CardTimeWave',
  /!*'Card3DFlipGallery',
  'CardAbstractGeometry',*!/
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
  'CardWave'
]*/
const dirNameList = []
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
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-list'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
        // console.log(dirNameList1)
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
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-time'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
        // console.log(dirNameList1)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-text 目录组件
  const textComponents = Object.entries(modulesText)
    .map(([path, module]) => {
      const match = path.match(/\/card-text\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/CardText/g, '文字')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-text'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-3d 目录组件
  const d3dComponents = Object.entries(modules3d)
    .map(([path, module]) => {
      const match = path.match(/\/card-3d\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/3d/g, ' 3D')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-3d'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-img 目录组件
  const imgComponents = Object.entries(modulesImg)
    .map(([path, module]) => {
      const match = path.match(/\/card-img\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Img/g, ' Image')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-img'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })

  // 处理 card-image 目录组件
  const imageComponents = Object.entries(modulesImage)
    .map(([path, module]) => {
      const match = path.match(/\/card-image\/([^/]+)\/[^/]+\.vue$/)
      const dirName = match?.[1] || ''
      const name = dirName
        .replace(/Card/g, '')
        .replace(/Image/g, ' Image')
        .replace(/([A-Z])/g, ' $1')
        .replace(/^/, '')
        .trim()

      return {
        dirName,
        name: name || dirName,
        path,
        // 懒加载模式：使用 defineAsyncComponent
        component: LAZY_MODE ?
          defineAsyncComponent(() => import(/* @vite-ignore */ path)) :
          (module as any)?.default || null,
        type: 'card-image'
      }
    })
    .filter((item) => {
      if (!dirNameList.includes(item.dirName) && item.component !== null) {
        dirNameList1.push(item.dirName)
      }
      return !dirNameList.includes(item.dirName) && item.component !== null
    })
  console.log([...listComponents].map((item) => item.dirName))
  console.log([...timeComponents].map((item) => item.dirName))
  console.log([...textComponents].map((item) => item.dirName))
  console.log([...d3dComponents].map((item) => item.dirName))

  console.log([...imgComponents].map((item) => item.dirName))
  console.log([...imageComponents].map((item) => item.dirName))
  // 合并数组：card-image 组件在最前，card-img 其次，card-3d 再次，card-time 再次，card-list 最后
  return [
    ...imageComponents,
    ...imgComponents,
    ...textComponents,
    ...d3dComponents,
    ...timeComponents,
    ...listComponents
  ]
})

// ==================== 分类筛选后的组件列表 ====================
const filteredComponents = computed(() => {
  if (activeCategory.value === 'all') {
    return cardComponents.value
  }
  if (activeCategory.value === 'favorite') {
    return cardComponents.value.filter((comp) => isFavorite(comp.dirName))
  }
  return cardComponents.value.filter((comp) => comp.type === activeCategory.value)
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
    filteredComponents.value.forEach((_, index) => {
      if (index < PRELOAD_COUNT) {
        visibleCards.value.add(index)
      }
    })
    return
  }

  // 等待一小段时间确保 DOM 已更新
  setTimeout(() => {
    // 重新从 DOM 中获取所有页面元素
    const pageEls = document.querySelectorAll('.page:not(.page1):not(.page-footer)')
    pageEls.forEach((el, index) => {
      el.setAttribute('data-index', String(index))
      observer?.observe(el)
    })

    // 触发初始可见性检查
    handleScroll()
  }, 50)

  observer = new IntersectionObserver(
    (entries) => {
      if (!visibleCards.value) {
        return
      } // HMR 保护
      entries.forEach((entry) => {
        const index = parseInt((entry.target as HTMLElement).dataset.index || '0')

        if (entry.isIntersecting) {
          // 进入视口：加载组件
          visibleCards.value?.add(index)
          // 预加载下一个
          for (let i = 1; i <= VISIBLE_BUFFER; i++) {
            const nextIndex = index + i
            if (nextIndex < filteredComponents.value.length) {
              visibleCards.value?.add(nextIndex)
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
    { root: null,
      rootMargin: '0px 0px -20% 0px', // 视口下方 20% 开始加载
      threshold: 0
    },
  )
}

// ==================== 滚动监听（备用） ====================
const handleScroll = () => {
  if (!LAZY_MODE) {
    return
  }

  const viewportHeight = window.innerHeight
  const scrollTop = window.scrollY

  // 直接从 DOM 获取所有卡片页面元素
  const pageEls = document.querySelectorAll('.page:not(.page1):not(.page-footer)')
  pageEls.forEach((el, index) => {
    const rect = el.getBoundingClientRect()
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
  // 确保 visibleCards 初始化
  if (!visibleCards.value) {
    visibleCards.value = new Set<number>()
  }
  if (!pageRefs.value) {
    pageRefs.value = new Map()
  }

  // 初始化可见性
  if (!LAZY_MODE) {
    filteredComponents.value.forEach((_, index) => {
      if (index < PRELOAD_COUNT) {
        visibleCards.value?.add(index)
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

// ==================== 分类切换时重置可见性 ====================
watch(activeCategory, () => {
  // 切换分类时清空可见卡片和 pageRefs
  visibleCards.value.clear()
  pageRefs.value.clear()
  // 断开旧的 observer
  observer?.disconnect()
  observer = null

  // 等待 DOM 更新后再重新初始化 Observer
  nextTick(() => {
    if (LAZY_MODE) {
      initIntersectionObserver()
    }
  })
})
</script>

<template>
  <div class="web-list">
    <!-- 顶部悬浮分类选项卡 -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.key"
        :class="['tab-btn', { active: activeCategory === cat.key }]"
        @click="activeCategory = cat.key"
      >
        {{ cat.label }}
      </button>
      <button class="tab-btn generate-btn" @click="router.push('/web-ai')">去生成方案</button>
    </div>

    <div class="page page1">
      <h1 class="page-title">Creative Cards Gallery</h1>
      <p class="page-desc">Scroll down to explore interactive card animations</p>
      <div>数量：{{ filteredComponents.length }}</div>
      <div class="scroll-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div
      v-for="(cardInfo, index) in filteredComponents"
      :key="cardInfo.name"
      :ref="(el) => setPageRef(el, index)"
      :class="['page', `page-card-${index + 1}`]"
    >
      <!-- 懒加载：只在进入视口时渲染组件 -->
      <component :is="cardInfo.component" v-if="visibleCards.has(index)" v-bind="propsMap[index]" />
      <div class="card-info position-absolute top-10px left-100px z-99999">
        <span class="card-name">{{ cardInfo.dirName }}</span>
        <button
          :class="['favorite-btn', { active: isFavorite(cardInfo.dirName) }]"
          @click="toggleFavorite(cardInfo.dirName)"
        >
          {{ isFavorite(cardInfo.dirName) ? '❤️' : '🤍' }}
        </button>
      </div>
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

  // ==================== 顶部悬浮分类选项卡 ====================
  .category-tabs {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

    .tab-btn {
      padding: 8px 18px;
      background: transparent;
      border: none;
      border-radius: 25px;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      &.active {
        color: #fff;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      &.generate-btn {
        color: #fff;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        font-weight: 600;

        &:hover {
          background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
          transform: scale(1.05);
        }
      }
    }
  }

  // ==================== 卡片信息 ====================
  .card-info {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);

    .card-name {
      font-size: 0.9rem;
      font-weight: 600;
      background: rgba(0, 0, 0, 0.4);
      padding: 4px 12px;
      border-radius: 20px;
      backdrop-filter: blur(4px);
    }

    .favorite-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      cursor: pointer;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &:hover {
        transform: scale(1.15);
        background: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: rgba(255, 0, 0, 0.3);
        box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
      }
    }
  }

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
