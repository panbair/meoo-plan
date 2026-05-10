/**
 * V14 补充经典动画系列 - 从 animate.css 补充缺失动画
 * 
 * 补充 animate.css 中缺失的重要动画效果
 */

// ==================== Attention Seekers 注意力动画 (6个) ====================
export const bounce = {
  type: 'timeline',
  animations: [
    { y: 0, duration: 0 },
    { y: -30, duration: 0.3, ease: 'power2.out' },
    { y: -15, duration: 0.15, ease: 'power2.inOut' },
    { y: 0, duration: 0.15, ease: 'power2.inOut' },
    { y: -4, duration: 0.1, ease: 'power2.out' },
    { y: 0, duration: 0.1, ease: 'power2.out' }
  ]
}

// flash 和 pulse 已在 V1 中定义，此处不再重复

export const shakeX = {
  type: 'timeline',
  animations: [
    { x: 0, duration: 0 },
    { x: -10, duration: 0.1, ease: 'power1.out' },
    { x: 10, duration: 0.1, ease: 'power1.out' },
    { x: -10, duration: 0.1, ease: 'power1.out' },
    { x: 10, duration: 0.1, ease: 'power1.out' },
    { x: -10, duration: 0.1, ease: 'power1.out' },
    { x: 10, duration: 0.1, ease: 'power1.out' },
    { x: -10, duration: 0.1, ease: 'power1.out' },
    { x: 10, duration: 0.1, ease: 'power1.out' },
    { x: 0, duration: 0.1, ease: 'power1.out' }
  ]
}

export const shakeY = {
  type: 'timeline',
  animations: [
    { y: 0, duration: 0 },
    { y: -10, duration: 0.1, ease: 'power1.out' },
    { y: 10, duration: 0.1, ease: 'power1.out' },
    { y: -10, duration: 0.1, ease: 'power1.out' },
    { y: 10, duration: 0.1, ease: 'power1.out' },
    { y: -10, duration: 0.1, ease: 'power1.out' },
    { y: 10, duration: 0.1, ease: 'power1.out' },
    { y: -10, duration: 0.1, ease: 'power1.out' },
    { y: 10, duration: 0.1, ease: 'power1.out' },
    { y: 0, duration: 0.1, ease: 'power1.out' }
  ]
}

export const heartBeat = {
  type: 'timeline',
  animations: [
    { scale: 1, duration: 0 },
    { scale: 1.3, duration: 0.2, ease: 'power1.out' },
    { scale: 1, duration: 0.2, ease: 'power1.in' },
    { scale: 1.3, duration: 0.2, ease: 'power1.out' },
    { scale: 1, duration: 0.4, ease: 'power1.inOut' }
  ]
}

// ==================== Bouncing 弹跳系列 (10个) ====================
// bounceIn 和 bounceOut 已在 V1 中定义，此处不再重复

export const bounceInDown = {
  type: 'timeline',
  animations: [
    { opacity: 0, y: -300, scaleY: 3, duration: 0 },
    { opacity: 1, y: 25, scaleY: 0.9, duration: 0.5, ease: 'bounce.out' },
    { y: -10, scaleY: 0.95, duration: 0.12, ease: 'power2.in' },
    { y: 5, scaleY: 0.985, duration: 0.08, ease: 'power2.out' },
    { y: 0, scaleY: 1, duration: 0.1, ease: 'power2.out' }
  ]
}

export const bounceOutDown = {
  type: 'timeline',
  animations: [
    { y: 10, scaleY: 0.985, opacity: 1, duration: 0 },
    { y: -20, scaleY: 0.9, opacity: 1, duration: 0.12, ease: 'power2.in' },
    { opacity: 0, y: 200, scaleY: 3, duration: 0.5, ease: 'power2.in' }
  ]
}

export const bounceInLeft = {
  type: 'timeline',
  animations: [
    { opacity: 0, x: -300, scaleX: 3, duration: 0 },
    { opacity: 1, x: 25, scaleX: 1, duration: 0.5, ease: 'bounce.out' },
    { x: -10, scaleX: 0.98, duration: 0.12, ease: 'power2.in' },
    { x: 5, scaleX: 0.995, duration: 0.08, ease: 'power2.out' },
    { x: 0, scaleX: 1, duration: 0.1, ease: 'power2.out' }
  ]
}

export const bounceOutLeft = {
  type: 'timeline',
  animations: [
    { x: 20, scaleX: 0.9, opacity: 1, duration: 0 },
    { opacity: 0, x: -200, scaleX: 2, duration: 0.4, ease: 'power2.in' }
  ]
}

export const bounceInRight = {
  type: 'timeline',
  animations: [
    { opacity: 0, x: 300, scaleX: 3, duration: 0 },
    { opacity: 1, x: -25, scaleX: 1, duration: 0.5, ease: 'bounce.out' },
    { x: 10, scaleX: 0.98, duration: 0.12, ease: 'power2.in' },
    { x: -5, scaleX: 0.995, duration: 0.08, ease: 'power2.out' },
    { x: 0, scaleX: 1, duration: 0.1, ease: 'power2.out' }
  ]
}

export const bounceOutRight = {
  type: 'timeline',
  animations: [
    { x: -20, scaleX: 0.9, opacity: 1, duration: 0 },
    { opacity: 0, x: 200, scaleX: 2, duration: 0.4, ease: 'power2.in' }
  ]
}

export const bounceInUp = {
  type: 'timeline',
  animations: [
    { opacity: 0, y: 300, scaleY: 5, duration: 0 },
    { opacity: 1, y: -20, scaleY: 0.9, duration: 0.5, ease: 'bounce.out' },
    { y: 10, scaleY: 0.95, duration: 0.12, ease: 'power2.in' },
    { y: -5, scaleY: 0.985, duration: 0.08, ease: 'power2.out' },
    { y: 0, scaleY: 1, duration: 0.1, ease: 'power2.out' }
  ]
}

export const bounceOutUp = {
  type: 'timeline',
  animations: [
    { y: -10, scaleY: 0.985, opacity: 1, duration: 0 },
    { y: 20, scaleY: 0.9, opacity: 1, duration: 0.12, ease: 'power2.in' },
    { opacity: 0, y: -200, scaleY: 3, duration: 0.5, ease: 'power2.in' }
  ]
}

// ==================== Flippers 翻转系列 (1个) ====================
export const flip = {
  type: 'timeline',
  animations: [
    { perspective: 400, scale: 1, rotationY: 0, duration: 0 },
    { perspective: 400, scale: 1, rotationY: -180, y: 0, duration: 0.6, ease: 'power2.inOut' },
    { perspective: 400, scale: 0.95, rotationY: -170, y: 0, duration: 0.2, ease: 'power1.out' },
    { perspective: 400, scale: 1, rotationY: 0, y: 0, duration: 0.2, ease: 'power1.in' }
  ]
}

// Fading 和 Rotating 系列已在 V1 中定义，此处不再重复

// ==================== 导出所有动画 ====================
export const v14 = {
  // Attention Seekers (6个)
  bounce,
  shakeX,
  shakeY,
  heartBeat,
  
  // Bouncing (8个)
  bounceInDown,
  bounceOutDown,
  bounceInLeft,
  bounceOutLeft,
  bounceInRight,
  bounceOutRight,
  bounceInUp,
  bounceOutUp,
  
  // Flippers (1个)
  flip
}
