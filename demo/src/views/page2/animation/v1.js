// ==================== V1 基础动画 (19个) - 全部保留 ====================
export const v1 = {
    // Fade 淡入淡出系列
    fadeIn: {
        type: 'fromTo',
        animations: [
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: 'power2.out' }
        ]
    },
    fadeOut: {
        type: 'fromTo',
        animations: [
            { opacity: 1 },
            { opacity: 0, duration: 0.8, ease: 'power2.out' }
        ]
    },
    fadeInDown: {
        type: 'fromTo',
        animations: [
            { opacity: 0, y: -100 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        ]
    },
    fadeOutDown: {
        type: 'fromTo',
        animations: [
            { opacity: 1 },
            { opacity: 0, y: 100, duration: 0.8, ease: 'power2.out' }
        ]
    },
    fadeInUp: {
        type: 'fromTo',
        animations: [
            { opacity: 0, y: 100 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        ]
    },
    fadeOutUp: {
        type: 'fromTo',
        animations: [
            { opacity: 1 },
            { opacity: 0, y: -100, duration: 0.8, ease: 'power2.out' }
        ]
    },
    fadeInLeft: {
        type: 'fromTo',
        animations: [
            { opacity: 0, x: -100 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
        ]
    },
    fadeOutLeft: {
        type: 'fromTo',
        animations: [
            { opacity: 1 },
            { opacity: 0, x: -100, duration: 0.8, ease: 'power2.out' }
        ]
    },
    fadeInRight: {
        type: 'fromTo',
        animations: [
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
        ]
    },
    fadeOutRight: {
        type: 'fromTo',
        animations: [
            { opacity: 1 },
            { opacity: 0, x: 100, duration: 0.8, ease: 'power2.out' }
        ]
    },

    // Scale 缩放系列
    scaleIn: {
        type: 'fromTo',
        animations: [
            { opacity: 0, scale: 0.3 },
            { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
        ]
    },
    scaleOut: {
        type: 'fromTo',
        animations: [
            { opacity: 1, scale: 1 },
            { opacity: 0, scale: 0.3, duration: 0.8, ease: 'power2.in' }
        ]
    },

    // Rotate 旋转系列
    rotateIn: {
        type: 'fromTo',
        animations: [
            { opacity: 0, rotation: -180, scale: 0 },
            { opacity: 1, rotation: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
        ]
    },
    rotateOut: {
        type: 'fromTo',
        animations: [
            { opacity: 1, rotation: 0, scale: 1 },
            { opacity: 0, rotation: 180, scale: 0, duration: 0.8, ease: 'power2.in' }
        ]
    },

    // Bounce 弹跳系列
    bounceIn: {
        type: 'fromTo',
        animations: [
            { opacity: 0, scale: 0.3 },
            { opacity: 1, scale: 1.05, duration: 0.5, ease: 'elastic.out(1, 0.5)' },
            { scale: 1, duration: 0.2, ease: 'power2.out' }
        ]
    },
    bounceOut: {
        type: 'fromTo',
        animations: [
            { opacity: 1, scale: 1 },
            { opacity: 0, scale: 0.3, duration: 0.5, ease: 'back.in(1.7)' }
        ]
    },

    // Attention 注意力动画
    flash: {
        type: 'fromTo',
        animations: [
            { opacity: 1 },
            { opacity: 0, duration: 0.15, ease: 'none' },
            { opacity: 1, duration: 0.15, ease: 'none' },
            { opacity: 0, duration: 0.15, ease: 'none' },
            { opacity: 1, duration: 0.15, ease: 'none' }
        ]
    },
    shake: {
        type: 'fromTo',
        animations: [
            { x: 0 },
            { x: -10, duration: 0.1, ease: 'none' },
            { x: 10, duration: 0.1, ease: 'none' },
            { x: -10, duration: 0.1, ease: 'none' },
            { x: 10, duration: 0.1, ease: 'none' },
            { x: -10, duration: 0.1, ease: 'none' },
            { x: 10, duration: 0.1, ease: 'none' },
            { x: 0, duration: 0.1, ease: 'none' }
        ]
    },
    pulse: {
        type: 'fromTo',
        animations: [
            { scale: 1 },
            { scale: 1.05, duration: 0.4, ease: 'power2.out' },
            { scale: 1, duration: 0.4, ease: 'power2.in' }
        ]
    }
}
