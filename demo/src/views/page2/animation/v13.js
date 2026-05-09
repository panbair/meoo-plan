/**
 * V13 经典动画系列 - 从 animate.css 学习补充
 * 
 * 这些动画是从 animate.css 4.1.1 中提取的经典效果
 * 经过 GSAP 优化和改编，更加流畅和可控
 */

// ==================== Back 进场/出场 (8个) ====================
export const backIn = {
  type: 'timeline',
  animations: [
    { opacity: 0, scale: 0.7, y: -100, duration: 0 },
    { opacity: 0.7, y: 0, scale: 0.7, duration: 0.6, ease: 'power2.out' },
    { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
  ]
}

export const backOut = {
  type: 'timeline',
  animations: [
    { opacity: 1, scale: 1, duration: 0 },
    { opacity: 0.7, y: 0, scale: 0.7, duration: 0.2, ease: 'power2.in' },
    { opacity: 0.7, y: 100, scale: 0.7, duration: 0.5, ease: 'power2.in' }
  ]
}

export const backInLeft = {
  type: 'timeline',
  animations: [
    { opacity: 0, scale: 0.7, x: -200, duration: 0 },
    { opacity: 0.7, x: 0, scale: 0.7, duration: 0.6, ease: 'power2.out' },
    { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
  ]
}

export const backOutLeft = {
  type: 'timeline',
  animations: [
    { opacity: 1, scale: 1, duration: 0 },
    { opacity: 0.7, x: 0, scale: 0.7, duration: 0.2, ease: 'power2.in' },
    { opacity: 0.7, x: -200, scale: 0.7, duration: 0.5, ease: 'power2.in' }
  ]
}

export const backInRight = {
  type: 'timeline',
  animations: [
    { opacity: 0, scale: 0.7, x: 200, duration: 0 },
    { opacity: 0.7, x: 0, scale: 0.7, duration: 0.6, ease: 'power2.out' },
    { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
  ]
}

export const backOutRight = {
  type: 'timeline',
  animations: [
    { opacity: 1, scale: 1, duration: 0 },
    { opacity: 0.7, x: 0, scale: 0.7, duration: 0.2, ease: 'power2.in' },
    { opacity: 0.7, x: 200, scale: 0.7, duration: 0.5, ease: 'power2.in' }
  ]
}

export const backInUp = {
  type: 'timeline',
  animations: [
    { opacity: 0, scale: 0.7, y: 100, duration: 0 },
    { opacity: 0.7, y: 0, scale: 0.7, duration: 0.6, ease: 'power2.out' },
    { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
  ]
}

export const backOutUp = {
  type: 'timeline',
  animations: [
    { opacity: 1, scale: 1, duration: 0 },
    { opacity: 0.7, y: 0, scale: 0.7, duration: 0.2, ease: 'power2.in' },
    { opacity: 0.7, y: -100, scale: 0.7, duration: 0.5, ease: 'power2.in' }
  ]
}

// ==================== Big 变种 (8个) - 已删除，与 V1 Fade 系列重复 ====================
// 这些动画与 V1 的 Fade 系列效果相似，只是位移更大，已移除以避免重复

// ==================== 对角线 Fade 进场 (4个) ====================
export const fadeInTopLeft = {
  type: 'timeline',
  animations: [
    { opacity: 0, x: -100, y: -100, duration: 0 },
    { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out' }
  ]
}

export const fadeInTopRight = {
  type: 'timeline',
  animations: [
    { opacity: 0, x: 100, y: -100, duration: 0 },
    { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out' }
  ]
}

export const fadeInBottomLeft = {
  type: 'timeline',
  animations: [
    { opacity: 0, x: -100, y: 100, duration: 0 },
    { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out' }
  ]
}

export const fadeInBottomRight = {
  type: 'timeline',
  animations: [
    { opacity: 0, x: 100, y: 100, duration: 0 },
    { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out' }
  ]
}

// ==================== 对角线 Fade 出场 (4个) ====================
export const fadeOutTopLeft = {
  type: 'timeline',
  animations: [
    { opacity: 1, x: 0, y: 0, duration: 0 },
    { opacity: 0, x: -100, y: -100, duration: 0.8, ease: 'power2.in' }
  ]
}

export const fadeOutTopRight = {
  type: 'timeline',
  animations: [
    { opacity: 1, x: 0, y: 0, duration: 0 },
    { opacity: 0, x: 100, y: -100, duration: 0.8, ease: 'power2.in' }
  ]
}

export const fadeOutBottomRight = {
  type: 'timeline',
  animations: [
    { opacity: 1, x: 0, y: 0, duration: 0 },
    { opacity: 0, x: 100, y: 100, duration: 0.8, ease: 'power2.in' }
  ]
}

export const fadeOutBottomLeft = {
  type: 'timeline',
  animations: [
    { opacity: 1, x: 0, y: 0, duration: 0 },
    { opacity: 0, x: -100, y: 100, duration: 0.8, ease: 'power2.in' }
  ]
}

// ==================== 3D Flip 翻转 (5个) ====================
export const flipInX = {
  type: 'timeline',
  animations: [
    { opacity: 0, perspective: 400, rotationX: 90, duration: 0 },
    { opacity: 0, rotationX: -20, duration: 0.4, ease: 'power1.in' },
    { opacity: 1, rotationX: 10, duration: 0.2, ease: 'power1.out' },
    { rotationX: -5, duration: 0.1, ease: 'power1.in' },
    { rotationX: 0, duration: 0.15, ease: 'power1.out' }
  ]
}

export const flipInY = {
  type: 'timeline',
  animations: [
    { opacity: 0, perspective: 400, rotationY: 90, duration: 0 },
    { opacity: 0, rotationY: -20, duration: 0.4, ease: 'power1.in' },
    { opacity: 1, rotationY: 10, duration: 0.2, ease: 'power1.out' },
    { rotationY: -5, duration: 0.1, ease: 'power1.in' },
    { rotationY: 0, duration: 0.15, ease: 'power1.out' }
  ]
}

export const flipOutX = {
  type: 'timeline',
  animations: [
    { opacity: 1, perspective: 400, rotationX: 0, duration: 0 },
    { opacity: 1, rotationX: -20, duration: 0.25, ease: 'power1.out' },
    { opacity: 0, rotationX: 90, duration: 0.3, ease: 'power2.in' }
  ]
}

export const flipOutY = {
  type: 'timeline',
  animations: [
    { opacity: 1, perspective: 400, rotationY: 0, duration: 0 },
    { opacity: 1, rotationY: -15, duration: 0.25, ease: 'power1.out' },
    { opacity: 0, rotationY: 90, duration: 0.3, ease: 'power2.in' }
  ]
}

// ==================== Lightspeed 光速 (4个) ====================
export const lightSpeedInRight = {
  type: 'timeline',
  animations: [
    { opacity: 0, x: 100, skewX: -30, duration: 0 },
    { opacity: 1, x: 0, skewX: 20, duration: 0.5, ease: 'power2.out' },
    { skewX: -5, duration: 0.15, ease: 'power1.out' },
    { skewX: 0, duration: 0.15, ease: 'power1.out' }
  ]
}

export const lightSpeedInLeft = {
  type: 'timeline',
  animations: [
    { opacity: 0, x: -100, skewX: 30, duration: 0 },
    { opacity: 1, x: 0, skewX: -20, duration: 0.5, ease: 'power2.out' },
    { skewX: 5, duration: 0.15, ease: 'power1.out' },
    { skewX: 0, duration: 0.15, ease: 'power1.out' }
  ]
}

export const lightSpeedOutRight = {
  type: 'timeline',
  animations: [
    { opacity: 1, x: 0, skewX: 0, duration: 0 },
    { opacity: 0, x: 100, skewX: 30, duration: 0.5, ease: 'power2.in' }
  ]
}

export const lightSpeedOutLeft = {
  type: 'timeline',
  animations: [
    { opacity: 1, x: 0, skewX: 0, duration: 0 },
    { opacity: 0, x: -100, skewX: -30, duration: 0.5, ease: 'power2.in' }
  ]
}

// ==================== 旋转进场 (5个) ====================
export const rotateInDownLeft = {
  type: 'timeline',
  animations: [
    { opacity: 0, rotation: -45, duration: 0 },
    { opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  ]
}

export const rotateInDownRight = {
  type: 'timeline',
  animations: [
    { opacity: 0, rotation: 45, duration: 0 },
    { opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  ]
}

export const rotateInUpLeft = {
  type: 'timeline',
  animations: [
    { opacity: 0, rotation: 45, duration: 0 },
    { opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  ]
}

export const rotateInUpRight = {
  type: 'timeline',
  animations: [
    { opacity: 0, rotation: -90, duration: 0 },
    { opacity: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
  ]
}

// ==================== 旋转出场 (5个) ====================
export const rotateOutDownLeft = {
  type: 'timeline',
  animations: [
    { opacity: 1, rotation: 0, duration: 0 },
    { opacity: 0, rotation: 45, duration: 0.8, ease: 'power2.in' }
  ]
}

export const rotateOutDownRight = {
  type: 'timeline',
  animations: [
    { opacity: 1, rotation: 0, duration: 0 },
    { opacity: 0, rotation: -45, duration: 0.8, ease: 'power2.in' }
  ]
}

export const rotateOutUpLeft = {
  type: 'timeline',
  animations: [
    { opacity: 1, rotation: 0, duration: 0 },
    { opacity: 0, rotation: -45, duration: 0.8, ease: 'power2.in' }
  ]
}

export const rotateOutUpRight = {
  type: 'timeline',
  animations: [
    { opacity: 1, rotation: 0, duration: 0 },
    { opacity: 0, rotation: 90, duration: 0.8, ease: 'power2.in' }
  ]
}

// ==================== Special 特殊动画 (4个) ====================
export const hinge = {
  type: 'timeline',
  animations: [
    { opacity: 1, rotation: 0, duration: 0 },
    { rotation: 80, duration: 0.4, ease: 'power1.inOut' },
    { rotation: 60, opacity: 1, duration: 0.2, ease: 'power1.inOut' },
    { rotation: 80, opacity: 1, duration: 0.2, ease: 'power1.inOut' },
    { opacity: 0, rotation: 70, y: 100, duration: 0.6, ease: 'power1.inOut' }
  ]
}

export const jackInTheBox = {
  type: 'timeline',
  animations: [
    { opacity: 0, scale: 0.1, rotation: 30, duration: 0 },
    { opacity: 1, rotation: -10, scale: 1, duration: 0.4, ease: 'back.out(1.7)' },
    { rotation: 3, duration: 0.2, ease: 'power1.out' },
    { rotation: 0, duration: 0.15, ease: 'power1.in' }
  ]
}

export const rollIn = {
  type: 'timeline',
  animations: [
    { opacity: 0, x: -100, rotation: -120, duration: 0 },
    { opacity: 1, x: 0, rotation: 0, duration: 0.8, ease: 'power2.out' }
  ]
}

export const rollOut = {
  type: 'timeline',
  animations: [
    { opacity: 1, x: 0, rotation: 0, duration: 0 },
    { opacity: 0, x: 100, rotation: 120, duration: 0.8, ease: 'power2.in' }
  ]
}

// ==================== Zoom 基础缩放 (2个) - 已删除，与 V1 Scale 系列重复 ====================
// zoomIn 和 zoomOut 与 V1 的 scaleIn/scaleOut 效果相同，已移除

export const zoomInDown = {
  type: 'timeline',
  animations: [
    { opacity: 0, scale: 0.1, y: -100, duration: 0 },
    { opacity: 1, scale: 0.475, y: 60, duration: 0.6, ease: 'power2.out' },
    { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
  ]
}

export const zoomInUp = {
  type: 'timeline',
  animations: [
    { opacity: 0, scale: 0.1, y: 100, duration: 0 },
    { opacity: 1, scale: 0.475, y: -60, duration: 0.6, ease: 'power2.out' },
    { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
  ]
}

export const zoomInLeft = {
  type: 'timeline',
  animations: [
    { opacity: 0, scale: 0.1, x: -100, duration: 0 },
    { opacity: 1, scale: 0.475, x: 10, duration: 0.6, ease: 'power2.out' },
    { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: 'back.out(1.7)' }
  ]
}

export const zoomInRight = {
  type: 'timeline',
  animations: [
    { opacity: 0, scale: 0.1, x: 100, duration: 0 },
    { opacity: 1, scale: 0.475, x: -10, duration: 0.6, ease: 'power2.out' },
    { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: 'back.out(1.7)' }
  ]
}

export const zoomOutDown = {
  type: 'timeline',
  animations: [
    { opacity: 1, scale: 1, duration: 0 },
    { opacity: 1, scale: 0.475, y: -60, duration: 0.4, ease: 'power2.out' },
    { opacity: 0, scale: 0.1, y: 200, duration: 0.5, ease: 'power2.in' }
  ]
}

export const zoomOutUp = {
  type: 'timeline',
  animations: [
    { opacity: 1, scale: 1, duration: 0 },
    { opacity: 1, scale: 0.475, y: 60, duration: 0.4, ease: 'power2.out' },
    { opacity: 0, scale: 0.1, y: -200, duration: 0.5, ease: 'power2.in' }
  ]
}

export const zoomOutLeft = {
  type: 'timeline',
  animations: [
    { opacity: 1, scale: 1, duration: 0 },
    { opacity: 1, scale: 0.475, x: 42, duration: 0.4, ease: 'power2.out' },
    { opacity: 0, scale: 0.1, x: -200, duration: 0.5, ease: 'power2.in' }
  ]
}

export const zoomOutRight = {
  type: 'timeline',
  animations: [
    { opacity: 1, scale: 1, duration: 0 },
    { opacity: 1, scale: 0.475, x: -42, duration: 0.4, ease: 'power2.out' },
    { opacity: 0, scale: 0.1, x: 200, duration: 0.5, ease: 'power2.in' }
  ]
}

// ==================== Slide 滑动 (8个) ====================
export const slideInDown = {
  type: 'timeline',
  animations: [
    { y: -100, duration: 0 },
    { y: 0, duration: 0.8, ease: 'power2.out' }
  ]
}

export const slideInUp = {
  type: 'timeline',
  animations: [
    { y: 100, duration: 0 },
    { y: 0, duration: 0.8, ease: 'power2.out' }
  ]
}

export const slideInLeft = {
  type: 'timeline',
  animations: [
    { x: -100, duration: 0 },
    { x: 0, duration: 0.8, ease: 'power2.out' }
  ]
}

export const slideInRight = {
  type: 'timeline',
  animations: [
    { x: 100, duration: 0 },
    { x: 0, duration: 0.8, ease: 'power2.out' }
  ]
}

export const slideOutDown = {
  type: 'timeline',
  animations: [
    { y: 0, duration: 0 },
    { y: 100, duration: 0.8, ease: 'power2.in' }
  ]
}

export const slideOutUp = {
  type: 'timeline',
  animations: [
    { y: 0, duration: 0 },
    { y: -100, duration: 0.8, ease: 'power2.in' }
  ]
}

export const slideOutLeft = {
  type: 'timeline',
  animations: [
    { x: 0, duration: 0 },
    { x: -100, duration: 0.8, ease: 'power2.in' }
  ]
}

export const slideOutRight = {
  type: 'timeline',
  animations: [
    { x: 0, duration: 0 },
    { x: 100, duration: 0.8, ease: 'power2.in' }
  ]
}

// ==================== 注意力动画扩展 (5个) ====================
export const rubberBand = {
  type: 'timeline',
  animations: [
    { scaleX: 1, scaleY: 1, duration: 0 },
    { scaleX: 1.25, scaleY: 0.75, duration: 0.15, ease: 'power1.out' },
    { scaleX: 0.75, scaleY: 1.25, duration: 0.12, ease: 'power1.in' },
    { scaleX: 1.15, scaleY: 0.85, duration: 0.1, ease: 'power1.out' },
    { scaleX: 0.95, scaleY: 1.05, duration: 0.08, ease: 'power1.in' },
    { scaleX: 1.05, scaleY: 0.95, duration: 0.06, ease: 'power1.out' },
    { scaleX: 1, scaleY: 1, duration: 0.1, ease: 'power1.in' }
  ]
}

export const headShake = {
  type: 'timeline',
  animations: [
    { x: 0, rotationY: 0, duration: 0 },
    { x: -6, rotationY: -9, duration: 0.1, ease: 'power1.inOut' },
    { x: 5, rotationY: 7, duration: 0.1, ease: 'power1.inOut' },
    { x: -3, rotationY: -5, duration: 0.1, ease: 'power1.inOut' },
    { x: 2, rotationY: 3, duration: 0.07, ease: 'power1.inOut' },
    { x: 0, rotationY: 0, duration: 0.05, ease: 'power1.inOut' }
  ]
}

export const swing = {
  type: 'timeline',
  animations: [
    { rotation: 0, duration: 0 },
    { rotation: 15, duration: 0.2, ease: 'power1.out' },
    { rotation: -10, duration: 0.2, ease: 'power1.in' },
    { rotation: 5, duration: 0.15, ease: 'power1.out' },
    { rotation: -5, duration: 0.1, ease: 'power1.in' },
    { rotation: 0, duration: 0.15, ease: 'power1.out' }
  ]
}

export const tada = {
  type: 'timeline',
  animations: [
    { scale: 1, rotation: 0, duration: 0 },
    { scale: 0.9, rotation: -3, duration: 0.15, ease: 'power1.out' },
    { scale: 1.1, rotation: 3, duration: 0.2, ease: 'power1.in' },
    { scale: 1.1, rotation: -3, duration: 0.15, ease: 'power1.out' },
    { scale: 1.1, rotation: 3, duration: 0.2, ease: 'power1.in' },
    { scale: 1.1, rotation: -3, duration: 0.15, ease: 'power1.out' },
    { scale: 1, rotation: 0, duration: 0.2, ease: 'power1.in' }
  ]
}

export const wobble = {
  type: 'timeline',
  animations: [
    { x: 0, rotation: 0, duration: 0 },
    { x: -25, rotation: -5, duration: 0.15, ease: 'power1.out' },
    { x: 20, rotation: 3, duration: 0.12, ease: 'power1.in' },
    { x: -15, rotation: -3, duration: 0.1, ease: 'power1.out' },
    { x: 10, rotation: 2, duration: 0.08, ease: 'power1.in' },
    { x: -5, rotation: -1, duration: 0.06, ease: 'power1.out' },
    { x: 0, rotation: 0, duration: 0.08, ease: 'power1.in' }
  ]
}

export const jello = {
  type: 'timeline',
  animations: [
    { skewX: 0, skewY: 0, duration: 0 },
    { skewX: -12.5, skewY: -12.5, duration: 0.15, ease: 'power1.out' },
    { skewX: 6.25, skewY: 6.25, duration: 0.12, ease: 'power1.in' },
    { skewX: -3.125, skewY: -3.125, duration: 0.1, ease: 'power1.out' },
    { skewX: 1.5625, skewY: 1.5625, duration: 0.08, ease: 'power1.in' },
    { skewX: -0.78, skewY: -0.78, duration: 0.06, ease: 'power1.out' },
    { skewX: 0.39, skewY: 0.39, duration: 0.05, ease: 'power1.in' },
    { skewX: -0.2, skewY: -0.2, duration: 0.04, ease: 'power1.out' },
    { skewX: 0, skewY: 0, duration: 0.05, ease: 'power1.in' }
  ]
}

// 导出完整的 V13 对象
export const v13 = {
  backIn,
  backOut,
  backInLeft,
  backOutLeft,
  backInRight,
  backOutRight,
  backInUp,
  backOutUp,
  fadeInTopLeft,
  fadeInTopRight,
  fadeInBottomLeft,
  fadeInBottomRight,
  fadeOutTopLeft,
  fadeOutTopRight,
  fadeOutBottomRight,
  fadeOutBottomLeft,
  flipInX,
  flipInY,
  flipOutX,
  flipOutY,
  lightSpeedInRight,
  lightSpeedInLeft,
  lightSpeedOutRight,
  lightSpeedOutLeft,
  rotateInDownLeft,
  rotateInDownRight,
  rotateInUpLeft,
  rotateInUpRight,
  rotateOutDownLeft,
  rotateOutDownRight,
  rotateOutUpLeft,
  rotateOutUpRight,
  hinge,
  jackInTheBox,
  rollIn,
  rollOut,
  zoomInDown,
  zoomInUp,
  zoomInLeft,
  zoomInRight,
  zoomOutDown,
  zoomOutUp,
  zoomOutLeft,
  zoomOutRight,
  slideInDown,
  slideInUp,
  slideInLeft,
  slideInRight,
  slideOutDown,
  slideOutUp,
  slideOutLeft,
  slideOutRight,
  rubberBand,
  headShake,
  swing,
  tada,
  wobble,
  jello
}
