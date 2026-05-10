/**
 * ============================================
 * 💎 珠宝企业官网 - 配置文件
 * ============================================
 * 版本: 3.0.0
 * 最后更新: 2026-03-26
 * ============================================
 */

const JewelryConfig = {
  // ==================== 颜色主题 ====================
  colors: {
    gold: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12'
    },
    rose: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#b76e79',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337'
    },
    diamond: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    }
  },

  // ==================== 动画配置 ====================
  animation: {
    speedMultiplier: {
      slow: 1.5,
      normal: 1.0,
      fast: 0.6
    },
    duration: {
      fast: 0.2,
      normal: 0.4,
      slow: 0.8,
      extraSlow: 1.2
    },
    easing: {
      smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'elastic.out(1, 0.5)',
      power2: 'power2.inOut',
      back: 'back.out(2)'
    },
    scrollTrigger: {
      start: 'top 85%',
      end: 'bottom 15%',
      scrub: 1,
      markers: false
    }
  },

  // ==================== 组件开关 ====================
  features: {
    enableCrystalPrism: true,
    enableNeonPrism: true,
    enableHologram: true,
    enableAurora: true,
    enableElegantCards: true,
    enableParticles: true,
    enableSmoothScroll: false,
    enableParallax: true,
    enable3DTransform: true,
    enableGlowEffects: true,
    enableMouseInteraction: true,
    enableTouchInteraction: true,
    enableKeyboardNav: true,
    enableReducedMotion: false
  },

  // ==================== 性能优化 ====================
  performance: {
    enableMonitoring: true,
    fpsThreshold: 30,
    memoryThreshold: 100,
    enableLazyLoad: true,
    lazyLoadMargin: 200,
    canvasQuality: {
      high: { scale: 1.5, particleCount: 40 },
      medium: { scale: 1.0, particleCount: 20 },
      low: { scale: 0.5, particleCount: 10 }
    }
  },

  // ==================== 内容配置 ====================
  content: {
    brand: {
      name: '璀璨珠宝',
      slogan: '永恒之美，璀璨传承',
      description: '传承百年经典工艺，诠释永恒优雅之美'
    },
    seo: {
      title: '璀璨珠宝 - 永恒之美，璀璨传承',
      description: '顶级珠宝品牌，传承百年经典工艺，打造永恒优雅之美。',
      keywords: '珠宝, 奢侈品, 钻石, 黄金, 首饰, 高端定制',
      ogImage: '/assets/images/og-image.jpg'
    },
    contact: {
      email: 'contact@jewelry.com',
      phone: '+86 400-888-8888',
      address: '上海市黄浦区南京东路123号',
      hours: '10:00 - 22:00'
    }
  }
};

// 导出到全局
window.JewelryConfig = JewelryConfig;

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JewelryConfig;
}
