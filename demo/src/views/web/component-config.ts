/**
 * 组件配置文件 - 用于虚拟滚动
 * 
 * 用途：
 * 1. 定义所有组件的分类
 * 2. 定义组件的导入路径
 * 3. 定义组件的优先级（加载顺序）
 */

export interface ComponentConfig {
  id: string
  name: string
  component: () => Promise<any>
  category: 'core' | '3d' | 'creative' | 'scroll' | 'card' | 'text' | 'image'
  priority: number // 优先级，数字越小越先加载
  description?: string
}

// 核心组件（始终加载）
export const coreComponents: ComponentConfig[] = [
  {
    id: 'card-3d-flip',
    name: 'Card3DFlipGallery',
    component: () => import('./components/Card3DFlipGallery.vue'),
    category: 'core',
    priority: 1,
    description: '3D翻转卡片画廊'
  },
  {
    id: 'timeline',
    name: 'Timeline',
    component: () => import('./components/Timeline.vue'),
    category: 'core',
    priority: 2,
    description: '时间线动画'
  },
  {
    id: 'text-typewriter',
    name: 'TextTypewriter',
    component: () => import('./components/TextTypewriter.vue'),
    category: 'core',
    priority: 3,
    description: '打字机效果'
  },
  {
    id: 'cube-3d',
    name: 'Cube3D',
    component: () => import('./components/Cube3D.vue'),
    category: 'core',
    priority: 4,
    description: '3D立方体'
  },
  {
    id: 'image-parallax',
    name: 'ImageParallax',
    component: () => import('./components/ImageParallax.vue'),
    category: 'core',
    priority: 5,
    description: '图片视差'
  }
]

// 3D动画组件
export const threeDComponents: ComponentConfig[] = [
  {
    id: 'scroll-3d-cube',
    name: 'Scroll3DCube',
    component: () => import('./components/Scroll3DCube.vue'),
    category: '3d',
    priority: 10,
    description: '滚动3D立方体'
  },
  {
    id: 'scroll-3d-tunnel',
    name: 'Scroll3DTunnel',
    component: () => import('./components/Scroll3DTunnel.vue'),
    category: '3d',
    priority: 11,
    description: '3D隧道效果'
  },
  {
    id: 'scroll-3d-gallery',
    name: 'Scroll3DGallery',
    component: () => import('./components/Scroll3DGallery.vue'),
    category: '3d',
    priority: 12,
    description: '3D画廊'
  }
  // 继续添加其他3D组件...
]

// 创意特效组件
export const creativeComponents: ComponentConfig[] = [
  {
    id: 'scroll-liquid-wave',
    name: 'ScrollLiquidWave',
    component: () => import('./components/ScrollLiquidWave.vue'),
    category: 'creative',
    priority: 20,
    description: '液体波浪'
  },
  {
    id: 'scroll-particle-explosion',
    name: 'ScrollParticleExplosion',
    component: () => import('./components/ScrollParticleExplosion.vue'),
    category: 'creative',
    priority: 21,
    description: '粒子爆炸'
  }
  // 继续添加其他创意组件...
]

// 滚动交互组件
export const scrollComponents: ComponentConfig[] = [
  {
    id: 'scroll-reveal',
    name: 'ScrollReveal',
    component: () => import('./components/ScrollReveal.vue'),
    category: 'scroll',
    priority: 30,
    description: '滚动揭示'
  },
  {
    id: 'scroll-parallax',
    name: 'ScrollParallax',
    component: () => import('./components/ScrollParallax.vue'),
    category: 'scroll',
    priority: 31,
    description: '滚动视差'
  }
  // 继续添加其他滚动组件...
]

// 卡片特效组件
export const cardComponents: ComponentConfig[] = [
  {
    id: 'accordion-cards',
    name: 'AccordionCards',
    component: () => import('./components/AccordionCards.vue'),
    category: 'card',
    priority: 38,
    description: '手风琴卡片'
  },
  {
    id: 'scroll-card-zoom',
    name: 'ScrollCardZoom',
    component: () => import('./components/ScrollCardZoom.vue'),
    category: 'card',
    priority: 40,
    description: '卡片缩放'
  },
  {
    id: 'scroll-card-rotate-3d',
    name: 'ScrollCardRotate3D',
    component: () => import('./components/ScrollCardRotate3D.vue'),
    category: 'card',
    priority: 41,
    description: '卡片3D旋转'
  }
  // 继续添加其他卡片组件...
]

// 文字特效组件
export const textComponents: ComponentConfig[] = [
  {
    id: 'scroll-text-flow',
    name: 'ScrollTextFlow',
    component: () => import('./components/ScrollTextFlow.vue'),
    category: 'text',
    priority: 50,
    description: '文字流动'
  },
  {
    id: 'scroll-text-shadow',
    name: 'ScrollTextShadow',
    component: () => import('./components/ScrollTextShadow.vue'),
    category: 'text',
    priority: 51,
    description: '文字阴影'
  }
  // 继续添加其他文字组件...
]

// 图片特效组件
export const imageComponents: ComponentConfig[] = [
  {
    id: 'scroll-image-clip',
    name: 'ScrollImageClip',
    component: () => import('./components/ScrollImageClip.vue'),
    category: 'image',
    priority: 60,
    description: '图片裁剪'
  },
  {
    id: 'scroll-image-blur',
    name: 'ScrollImageBlur',
    component: () => import('./components/ScrollImageBlur.vue'),
    category: 'image',
    priority: 61,
    description: '图片模糊'
  },
  {
    id: 'scroll-image-spectrum',
    name: 'ScrollImageSpectrum',
    component: () => import('./components/ScrollImageSpectrum.vue'),
    category: 'image',
    priority: 62,
    description: '图片光谱扫描'
  },
  {
    id: 'scroll-image-holographic',
    name: 'ScrollImageHolographic',
    component: () => import('./components/ScrollImageHolographic.vue'),
    category: 'image',
    priority: 63,
    description: '全息图片投影'
  },
  {
    id: 'scroll-image-pixelate',
    name: 'ScrollImagePixelate',
    component: () => import('./components/ScrollImagePixelate.vue'),
    category: 'image',
    priority: 64,
    description: '像素化揭示'
  },
  {
    id: 'scroll-image-kaleidoscope',
    name: 'ScrollImageKaleidoscope',
    component: () => import('./components/ScrollImageKaleidoscope.vue'),
    category: 'image',
    priority: 65,
    description: '万花筒图片'
  },
  {
    id: 'scroll-image-morph',
    name: 'ScrollImageMorph',
    component: () => import('./components/ScrollImageMorph.vue'),
    category: 'image',
    priority: 66,
    description: '图片变形'
  },
  {
    id: 'scroll-image-misalign',
    name: 'ScrollImageMisalign',
    component: () => import('./components/ScrollImageMisalign.vue'),
    category: 'image',
    priority: 67,
    description: '图片错位动画'
  },
  {
    id: 'scroll-image-crossfade',
    name: 'ScrollImageCrossfade',
    component: () => import('./components/ScrollImageCrossfade.vue'),
    category: 'image',
    priority: 68,
    description: '图片交错动画'
  },
  {
    id: 'scroll-image-morph',
    name: 'ScrollImageMorph',
    component: () => import('./components/ScrollImageMorph.vue'),
    category: 'image',
    priority: 69,
    description: '图片变形动画'
  },
  {
    id: 'scroll-image-parallax',
    name: 'ScrollImageParallax',
    component: () => import('./components/ScrollImageParallax.vue'),
    category: 'image',
    priority: 70,
    description: '图片多层视差'
  },
  {
    id: 'scroll-image-liquid',
    name: 'ScrollImageLiquid',
    component: () => import('./components/ScrollImageLiquid.vue'),
    category: 'image',
    priority: 71,
    description: '液体图片变形'
  },
  {
    id: 'scroll-image-distort',
    name: 'ScrollImageDistort',
    component: () => import('./components/ScrollImageDistort.vue'),
    category: 'image',
    priority: 72,
    description: '图片扭曲变形'
  },
  {
    id: 'scroll-image-glitch',
    name: 'ScrollImageGlitch',
    component: () => import('./components/ScrollImageGlitch.vue'),
    category: 'image',
    priority: 73,
    description: '图片故障艺术'
  },
  {
    id: 'scroll-image-3d',
    name: 'ScrollImage3D',
    component: () => import('./components/ScrollImage3D.vue'),
    category: 'image',
    priority: 74,
    description: '图片3D变换'
  },
  {
    id: 'scroll-image-hologram',
    name: 'ScrollImageHologram',
    component: () => import('./components/ScrollImageHologram.vue'),
    category: 'image',
    priority: 75,
    description: '全息图片投影'
  },
  {
    id: 'scroll-image-prism',
    name: 'ScrollImagePrism',
    component: () => import('./components/ScrollImagePrism.vue'),
    category: 'image',
    priority: 76,
    description: '棱镜光影效果'
  },
  {
    id: 'scroll-image-neon',
    name: 'ScrollImageNeon',
    component: () => import('./components/ScrollImageNeon.vue'),
    category: 'image',
    priority: 77,
    description: '霓虹光效图片'
  },
  {
    id: 'scroll-image-cyber',
    name: 'ScrollImageCyber',
    component: () => import('./components/ScrollImageCyber.vue'),
    category: 'image',
    priority: 78,
    description: '赛博朋克风格'
  },
  {
    id: 'scroll-image-portal',
    name: 'ScrollImagePortal',
    component: () => import('./components/ScrollImagePortal.vue'),
    category: 'image',
    priority: 79,
    description: '时空传送门'
  },
  {
    id: 'scroll-image-quantum',
    name: 'ScrollImageQuantum',
    component: () => import('./components/ScrollImageQuantum.vue'),
    category: 'image',
    priority: 80,
    description: '量子态图片'
  },
  {
    id: 'scroll-image-aurora',
    name: 'ScrollImageAurora',
    component: () => import('./components/ScrollImageAurora.vue'),
    category: 'image',
    priority: 81,
    description: '极光图片效果'
  },
  {
    id: 'scroll-image-vortex',
    name: 'ScrollImageVortex',
    component: () => import('./components/ScrollImageVortex.vue'),
    category: 'image',
    priority: 82,
    description: '漩涡图片效果'
  },
  {
    id: 'scroll-image-cuboid',
    name: 'ScrollImageCuboid',
    component: () => import('./components/ScrollImageCuboid.vue'),
    category: 'image',
    priority: 83,
    description: '3D长方体图片'
  },
  {
    id: 'scroll-image-pyramid',
    name: 'ScrollImagePyramid',
    component: () => import('./components/ScrollImagePyramid.vue'),
    category: 'image',
    priority: 84,
    description: '3D金字塔图片'
  },
  {
    id: 'scroll-image-sphere',
    name: 'ScrollImageSphere',
    component: () => import('./components/ScrollImageSphere.vue'),
    category: 'image',
    priority: 85,
    description: '3D球体图片'
  },
  {
    id: 'scroll-image-torus',
    name: 'ScrollImageTorus',
    component: () => import('./components/ScrollImageTorus.vue'),
    category: 'image',
    priority: 86,
    description: '3D环形体图片'
  },
  {
    id: 'scroll-carousel-3d',
    name: 'ScrollCarousel3D',
    component: () => import('./components/ScrollCarousel3D.vue'),
    category: 'image',
    priority: 87,
    description: '3D轮播画廊'
  },
  {
    id: 'scroll-cube-carousel',
    name: 'ScrollCubeCarousel',
    component: () => import('./components/ScrollCubeCarousel.vue'),
    category: 'image',
    priority: 88,
    description: '立方体轮播'
  },
  {
    id: 'scroll-sphere-carousel',
    name: 'ScrollSphereCarousel',
    component: () => import('./components/ScrollSphereCarousel.vue'),
    category: 'image',
    priority: 89,
    description: '球形轮播'
  },
  {
    id: 'scroll-helix-carousel',
    name: 'ScrollHelixCarousel',
    component: () => import('./components/ScrollHelixCarousel.vue'),
    category: 'image',
    priority: 90,
    description: '螺旋轮播'
  },
  {
    id: 'scroll-cover-flow-gallery',
    name: 'ScrollCoverFlowGallery',
    component: () => import('./components/ScrollCoverFlowGallery.vue'),
    category: 'image',
    priority: 91,
    description: '3D封面流相册'
  },
  {
    id: 'scroll-stack-gallery',
    name: 'ScrollStackGallery',
    component: () => import('./components/ScrollStackGallery.vue'),
    category: 'image',
    priority: 92,
    description: '3D堆叠相册'
  },
  {
    id: 'scroll-accordion-gallery',
    name: 'ScrollAccordionGallery',
    component: () => import('./components/ScrollAccordionGallery.vue'),
    category: 'image',
    priority: 93,
    description: '3D手风琴相册'
  },
  {
    id: 'scroll-cylinder-gallery',
    name: 'ScrollCylinderGallery',
    component: () => import('./components/ScrollCylinderGallery.vue'),
    category: 'image',
    priority: 94,
    description: '3D圆柱相册'
  }
  // 继续添加其他图片组件...
]

// 合并所有组件
export const allComponents: ComponentConfig[] = [
  ...coreComponents,
  ...threeDComponents,
  ...creativeComponents,
  ...scrollComponents,
  ...cardComponents,
  ...textComponents,
  ...imageComponents
].sort((a, b) => a.priority - b.priority)

// 按分类获取组件
export const getComponentsByCategory = (category: string): ComponentConfig[] => {
  if (category === 'all') return allComponents
  return allComponents.filter(c => c.category === category)
}

// 统计分类数量
export const countCategory = (category: string): number => {
  if (category === 'all') return allComponents.length
  return allComponents.filter(c => c.category === category).length
}

// 搜索组件
export const searchComponents = (query: string): ComponentConfig[] => {
  const lowerQuery = query.toLowerCase()
  return allComponents.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description?.toLowerCase().includes(lowerQuery)
  )
}
