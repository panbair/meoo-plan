/**
 * V12 创新动画系列
 * 全新创作的动画效果，与之前的动画完全不同
 */

export const v12 = {
  // 水波纹扩散 - 像水滴落在水面的效果
  rippleExpand: {
    type: 'timeline',
    animations: [
      { opacity: 0, scale: 0.3, borderRadius: '50%', filter: 'blur(0px)', duration: 0 },
      { opacity: 0.8, scale: 0.6, filter: 'blur(2px)', duration: 0.15, ease: 'power1.out' },
      { opacity: 0.4, scale: 1.5, filter: 'blur(4px)', duration: 0.12, ease: 'power1.in' },
      { opacity: 0.9, scale: 1.1, filter: 'blur(2px)', duration: 0.1, ease: 'power1.out' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 极光飘舞 - 流动的北极光效果
  auroraDance: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: 50, x: 0, filter: 'blur(20px) hue-rotate(0deg)', duration: 0 },
      { opacity: 0.7, y: -30, x: 20, filter: 'blur(15px) hue-rotate(45deg)', duration: 0.25, ease: 'sine.inOut' },
      { opacity: 0.5, y: 20, x: -15, filter: 'blur(18px) hue-rotate(90deg)', duration: 0.18, ease: 'sine.inOut' },
      { opacity: 0.9, y: -10, x: 8, filter: 'blur(10px) hue-rotate(135deg)', duration: 0.15, ease: 'sine.inOut' },
      { opacity: 1, y: 0, x: 0, filter: 'blur(0px) hue-rotate(0deg)', duration: 0.25, ease: 'elastic.out(1, 0.4)' }
    ]
  },

  // 磁场吸引 - 被磁场吸入的效果
  magneticPull: {
    type: 'timeline',
    animations: [
      { opacity: 0, x: 200, y: 0, scale: 0.5, rotation: 180, duration: 0 },
      { opacity: 0.6, x: 100, y: -20, scale: 0.7, rotation: 90, duration: 0.2, ease: 'power3.in' },
      { opacity: 0.8, x: 50, y: 10, scale: 0.85, rotation: 45, duration: 0.12, ease: 'power2.in' },
      { opacity: 0.9, x: 20, y: -5, scale: 0.95, rotation: 22, duration: 0.08, ease: 'power1.in' },
      { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: 0.15, ease: 'elastic.out(1, 0.5)' }
    ]
  },

  // 星光闪烁 - 星星闪烁出现的效果
  starTwinkle: {
    type: 'timeline',
    animations: [
      { opacity: 0, scale: 0.1, rotation: 0, filter: 'blur(5px)', duration: 0 },
      { opacity: 0.5, scale: 0.5, rotation: 45, filter: 'blur(3px)', duration: 0.1, ease: 'power1.out' },
      { opacity: 0.8, scale: 1.3, rotation: -30, filter: 'blur(1px)', duration: 0.08, ease: 'power1.in' },
      { opacity: 0.6, scale: 0.9, rotation: 15, filter: 'blur(2px)', duration: 0.06, ease: 'power1.out' },
      { opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.12, ease: 'elastic.out(1, 0.4)' }
    ]
  },

  // 流星划过 - 流星坠落的效果
  meteorFall: {
    type: 'timeline',
    animations: [
      { opacity: 0, x: -300, y: -200, scale: 0.3, rotation: -45, filter: 'blur(10px)', duration: 0 },
      { opacity: 1, x: -100, y: -60, scale: 0.8, rotation: -45, filter: 'blur(5px)', duration: 0.25, ease: 'power2.out' },
      { x: 0, y: 0, scale: 1.1, duration: 0.15, ease: 'power2.in' },
      { scale: 1, duration: 0.12, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // DNA螺旋 - DNA双螺旋上升的效果
  dnaRise: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: 150, scale: 0.4, rotationY: 0, filter: 'blur(15px)', duration: 0 },
      { opacity: 0.5, y: 80, scale: 0.7, rotationY: 90, filter: 'blur(10px)', duration: 0.2, ease: 'power2.out' },
      { opacity: 0.8, y: 30, scale: 0.9, rotationY: -90, filter: 'blur(5px)', duration: 0.12, ease: 'power2.in' },
      { opacity: 0.6, y: 10, scale: 0.95, rotationY: 45, filter: 'blur(3px)', duration: 0.08, ease: 'power1.out' },
      { opacity: 1, y: 0, scale: 1, rotationY: 0, filter: 'blur(0px)', duration: 0.15, ease: 'elastic.out(1, 0.4)' }
    ]
  },

  // 火焰燃烧 - 火焰从底部升起
  flameIgnite: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: 100, scale: 0.6, filter: 'blur(20px) brightness(1.5)', duration: 0 },
      { opacity: 0.7, y: 50, scale: 0.8, filter: 'blur(15px) brightness(2) hue-rotate(10deg)', duration: 0.15, ease: 'power1.out' },
      { opacity: 1, y: 20, scale: 1.1, filter: 'blur(10px) brightness(2.5) hue-rotate(20deg)', duration: 0.1, ease: 'power1.in' },
      { opacity: 0.9, y: 5, scale: 1.05, filter: 'blur(5px) brightness(2) hue-rotate(10deg)', duration: 0.08, ease: 'power1.out' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px) brightness(1) hue-rotate(0deg)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 冰霜凝结 - 从底部向上结冰
  frostForm: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: 150, scale: 0.7, filter: 'blur(15px) brightness(0.8)', duration: 0 },
      { opacity: 0.6, y: 100, scale: 0.85, filter: 'blur(12px) brightness(0.9)', duration: 0.18, ease: 'power2.out' },
      { opacity: 0.8, y: 50, scale: 0.95, filter: 'blur(8px) brightness(1)', duration: 0.12, ease: 'power2.in' },
      { opacity: 0.9, y: 15, scale: 1.02, filter: 'blur(4px) brightness(1.1)', duration: 0.08, ease: 'power1.out' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px) brightness(1)', duration: 0.15, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 旋转木马 - 温柔的3D旋转效果
  carouselSpin: {
    type: 'timeline',
    animations: [
      { opacity: 0, perspective: 1000, rotationY: -180, scale: 0.6, duration: 0 },
      { opacity: 0.7, rotationY: -90, scale: 0.8, duration: 0.25, ease: 'power1.inOut' },
      { opacity: 0.9, rotationY: 0, scale: 1.1, duration: 0.2, ease: 'power1.inOut' },
      { opacity: 0.8, rotationY: 45, scale: 0.95, duration: 0.1, ease: 'power1.inOut' },
      { opacity: 1, rotationY: 0, scale: 1, duration: 0.15, ease: 'elastic.out(1, 0.35)' }
    ]
  },

  // 弹簧跳入 - 像弹簧一样跳出来
  springJump: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: -200, scaleY: 0.3, duration: 0 },
      { opacity: 1, y: 30, scaleY: 1.5, duration: 0.4, ease: 'elastic.out(1, 0.8)' },
      { y: -15, scaleY: 0.85, duration: 0.12, ease: 'power2.in' },
      { y: 5, scaleY: 1.05, duration: 0.08, ease: 'power1.out' },
      { y: 0, scaleY: 1, duration: 0.1, ease: 'elastic.out(1, 0.25)' }
    ]
  },

  // 能量充能 - 像电池充电一样的效果
  energyCharge: {
    type: 'timeline',
    animations: [
      { opacity: 0, scale: 0.5, filter: 'blur(10px) brightness(0.5)', duration: 0 },
      { opacity: 0.6, scale: 0.7, filter: 'blur(8px) brightness(1.2)', duration: 0.15, ease: 'power1.out' },
      { opacity: 0.4, scale: 0.6, filter: 'blur(12px) brightness(0.8)', duration: 0.08, ease: 'power1.in' },
      { opacity: 0.8, scale: 0.9, filter: 'blur(5px) brightness(1.5)', duration: 0.1, ease: 'power1.out' },
      { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)', duration: 0.2, ease: 'elastic.out(1, 0.4)' }
    ]
  },

  // 梦境漂浮 - 轻柔的漂浮效果
  dreamFloat: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: -80, scale: 0.9, filter: 'blur(10px)', duration: 0 },
      { opacity: 0.7, y: 40, scale: 1.05, filter: 'blur(5px)', duration: 0.3, ease: 'sine.inOut' },
      { opacity: 0.9, y: -20, scale: 0.98, filter: 'blur(3px)', duration: 0.18, ease: 'sine.inOut' },
      { opacity: 1, y: 10, scale: 1.02, filter: 'blur(1px)', duration: 0.12, ease: 'sine.inOut' },
      { y: 0, scale: 1, filter: 'blur(0px)', duration: 0.15, ease: 'elastic.out(1, 0.25)' }
    ]
  },

  // 闪电闪现 - 快速闪电效果
  lightningStrike: {
    type: 'timeline',
    animations: [
      { opacity: 0, scale: 0.8, filter: 'blur(5px)', duration: 0 },
      { opacity: 1, scale: 1.2, filter: 'blur(2px)', duration: 0.05, ease: 'power1.out' },
      { opacity: 0.3, scale: 0.95, filter: 'blur(8px)', duration: 0.03, ease: 'none' },
      { opacity: 1, scale: 1.1, filter: 'blur(1px)', duration: 0.04, ease: 'power1.out' },
      { opacity: 0.5, scale: 1.02, filter: 'blur(3px)', duration: 0.03, ease: 'none' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.15, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 棱镜折射 - 光线通过棱镜的彩色效果
  prismRefract: {
    type: 'timeline',
    animations: [
      { opacity: 0, x: -50, scale: 0.6, filter: 'blur(10px) hue-rotate(0deg)', duration: 0 },
      { opacity: 0.7, x: 30, scale: 1.2, filter: 'blur(5px) hue-rotate(60deg)', duration: 0.18, ease: 'power1.out' },
      { opacity: 0.5, x: -20, scale: 0.9, filter: 'blur(8px) hue-rotate(120deg)', duration: 0.1, ease: 'power1.in' },
      { opacity: 0.9, x: 15, scale: 1.08, filter: 'blur(3px) hue-rotate(180deg)', duration: 0.08, ease: 'power1.out' },
      { opacity: 1, x: 0, scale: 1, filter: 'blur(0px) hue-rotate(0deg)', duration: 0.2, ease: 'elastic.out(1, 0.35)' }
    ]
  },

  // 气球升空 - 气球慢慢升起的效果
  balloonRise: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: 200, scale: 0.8, rotation: -10, duration: 0 },
      { opacity: 0.8, y: 100, scale: 0.95, rotation: 5, duration: 0.3, ease: 'power1.out' },
      { opacity: 1, y: 30, scale: 1.05, rotation: -3, duration: 0.18, ease: 'power1.in' },
      { y: 10, scale: 1.02, rotation: 2, duration: 0.08, ease: 'power1.out' },
      { y: 0, scale: 1, rotation: 0, duration: 0.15, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 纸张折叠 - 像纸一样折叠的效果
  paperFold: {
    type: 'timeline',
    animations: [
      { opacity: 0, scale: 0.3, rotationX: 90, filter: 'blur(5px)', duration: 0 },
      { opacity: 0.7, scale: 0.8, rotationX: 45, filter: 'blur(3px)', duration: 0.2, ease: 'power2.out' },
      { opacity: 0.5, scale: 0.95, rotationX: 20, filter: 'blur(4px)', duration: 0.1, ease: 'power1.in' },
      { opacity: 1, scale: 1.05, rotationX: 5, filter: 'blur(1px)', duration: 0.08, ease: 'power1.out' },
      { scale: 1, rotationX: 0, filter: 'blur(0px)', duration: 0.15, ease: 'elastic.out(1, 0.25)' }
    ]
  },

  // 泡泡升起 - 泡泡慢慢上升并破裂
  bubbleFloat: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: 150, scale: 0.2, filter: 'blur(2px) brightness(1.3)', duration: 0 },
      { opacity: 0.6, y: 80, scale: 0.6, filter: 'blur(3px) brightness(1.4)', duration: 0.25, ease: 'power1.out' },
      { opacity: 0.8, y: 30, scale: 1.2, filter: 'blur(2px) brightness(1.5)', duration: 0.15, ease: 'power1.in' },
      { opacity: 0.9, y: 10, scale: 1.05, filter: 'blur(1px) brightness(1.3)', duration: 0.08, ease: 'power1.out' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px) brightness(1)', duration: 0.18, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 万花筒旋转 - 快速旋转的万花筒效果
  kaleidoscopeSpin: {
    type: 'timeline',
    animations: [
      { opacity: 0, scale: 0.1, rotation: 0, filter: 'blur(10px)', duration: 0 },
      { opacity: 0.5, scale: 0.8, rotation: 120, filter: 'blur(6px)', duration: 0.12, ease: 'power2.out' },
      { opacity: 0.3, scale: 1.3, rotation: 240, filter: 'blur(4px)', duration: 0.08, ease: 'power2.in' },
      { opacity: 0.8, scale: 1.1, rotation: 300, filter: 'blur(2px)', duration: 0.06, ease: 'power1.out' },
      { opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.4)' }
    ]
  },

  // 3D翻转卡片 - 像卡片翻转的效果
  cardFlip: {
    type: 'timeline',
    animations: [
      { opacity: 0, perspective: 1000, rotationY: -90, scale: 0.8, duration: 0 },
      { opacity: 0.7, rotationY: -45, scale: 0.95, duration: 0.2, ease: 'power1.inOut' },
      { opacity: 1, rotationY: 0, scale: 1.05, duration: 0.15, ease: 'power1.inOut' },
      { rotationY: 15, scale: 0.98, duration: 0.08, ease: 'power1.inOut' },
      { rotationY: 0, scale: 1, duration: 0.12, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 旋涡吸入 - 被旋涡吸入中心的效果
  vortexSuck: {
    type: 'timeline',
    animations: [
      { opacity: 0, x: 150, y: 150, scale: 0.5, rotation: 0, duration: 0 },
      { opacity: 0.6, x: 80, y: 80, scale: 0.7, rotation: 90, duration: 0.15, ease: 'power2.in' },
      { opacity: 0.8, x: 30, y: 30, scale: 0.85, rotation: 180, duration: 0.1, ease: 'power2.in' },
      { opacity: 0.9, x: 10, y: 10, scale: 0.95, rotation: 270, duration: 0.06, ease: 'power1.in' },
      { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, duration: 0.15, ease: 'elastic.out(1, 0.4)' }
    ]
  },

  // 彩虹渐变 - 彩虹色彩渐变效果
  rainbowFade: {
    type: 'timeline',
    animations: [
      { opacity: 0, filter: 'blur(15px) hue-rotate(0deg) brightness(0.8)', duration: 0 },
      { opacity: 0.7, filter: 'blur(10px) hue-rotate(60deg) brightness(1.2)', duration: 0.2, ease: 'power1.out' },
      { opacity: 0.9, filter: 'blur(6px) hue-rotate(120deg) brightness(1.4)', duration: 0.12, ease: 'power1.in' },
      { opacity: 1, filter: 'blur(3px) hue-rotate(180deg) brightness(1.3)', duration: 0.08, ease: 'power1.out' },
      { filter: 'blur(0px) hue-rotate(0deg) brightness(1)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 糖果弹跳 - 可爱的弹跳效果
  candyBounce: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: -120, scaleY: 0.4, duration: 0 },
      { opacity: 1, y: 40, scaleY: 1.6, duration: 0.35, ease: 'bounce.out' },
      { y: -20, scaleY: 0.8, duration: 0.15, ease: 'power2.in' },
      { y: 10, scaleY: 1.1, duration: 0.1, ease: 'bounce.out' },
      { y: 0, scaleY: 1, duration: 0.2, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 液滴落下 - 水滴落下的效果
  dropletFall: {
    type: 'timeline',
    animations: [
      { opacity: 0, y: -150, scaleY: 0.2, filter: 'blur(2px)', duration: 0 },
      { opacity: 1, y: 50, scaleY: 0.8, filter: 'blur(3px)', duration: 0.3, ease: 'power2.out' },
      { y: 20, scaleY: 1.3, filter: 'blur(1px)', duration: 0.1, ease: 'power2.in' },
      { y: 5, scaleY: 0.95, filter: 'blur(0px)', duration: 0.06, ease: 'power1.out' },
      { y: 0, scaleY: 1, duration: 0.15, ease: 'elastic.out(1, 0.25)' }
    ]
  },

  // 磁盘加载 - 像磁盘旋转加载的效果
  diskSpin: {
    type: 'timeline',
    animations: [
      { opacity: 0, scale: 0.2, rotation: 0, filter: 'blur(8px)', duration: 0 },
      { opacity: 0.5, scale: 0.6, rotation: 180, filter: 'blur(5px)', duration: 0.15, ease: 'power1.out' },
      { opacity: 0.8, scale: 0.9, rotation: 360, filter: 'blur(3px)', duration: 0.12, ease: 'power1.in' },
      { opacity: 0.9, scale: 1.05, rotation: 540, filter: 'blur(1px)', duration: 0.08, ease: 'power1.out' },
      { opacity: 1, scale: 1, rotation: 720, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
    ]
  },

  // 相机快门 - 像相机快门闪烁的效果
  shutterFlash: {
    type: 'timeline',
    animations: [
      { opacity: 0, scaleY: 0.01, duration: 0 },
      { opacity: 1, scaleY: 1.2, duration: 0.03, ease: 'none' },
      { opacity: 0.1, scaleY: 0.95, duration: 0.02, ease: 'none' },
      { opacity: 0.9, scaleY: 1.08, duration: 0.02, ease: 'none' },
      { opacity: 1, scaleY: 1, duration: 0.15, ease: 'elastic.out(1, 0.3)' }
    ]
  }
}
