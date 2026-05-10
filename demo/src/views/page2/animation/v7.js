
// ==================== V7 超越极限精选 (5个) ====================
export const v7 = {
    // 弹簧进场 - 最基础的弹性效果
    springEntrance: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.3, rotation: 0, duration: 0 },
            { opacity: 0.7, scale: 1.3, rotation: 5, duration: 0.4, ease: 'elastic.out(1, 0.5)' },
            { scale: 0.95, rotation: -2, duration: 0.15, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.2, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 交错波浪 - 独特的波浪效果
    staggerWave: {
        type: 'timeline',
        animations: [
            { opacity: 0, y: 100, scale: 0.5, duration: 0 },
            { opacity: 0.8, y: -50, scale: 1.1, duration: 0.35, ease: 'power2.out' },
            { y: 25, scale: 0.95, duration: 0.2, ease: 'power2.in' },
            { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'elastic.out(1, 0.4)' }
        ]
    },
    // 3D弹性折叠 - 唯一的3D折叠效果
    elastic3DFold: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.4, rotationX: 90, rotationY: 0, duration: 0 },
            { opacity: 0.7, scale: 1.2, rotationX: 45, rotationY: 45, duration: 0.3, ease: 'elastic.out(1, 0.6)' },
            { scale: 0.9, rotationX: 22.5, rotationY: -22.5, duration: 0.15, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotationX: 0, rotationY: 0, duration: 0.2, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 弹性变形 - 唯一的弹性变形效果
    elasticMorph: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.5, borderRadius: '50%', rotation: 0, duration: 0 },
            { opacity: 0.7, scale: 1.3, borderRadius: '20%', rotation: 180, duration: 0.35, ease: 'elastic.out(1, 0.5)' },
            { scale: 0.9, borderRadius: '15%', rotation: -90, duration: 0.18, ease: 'power2.in' },
            { opacity: 1, scale: 1, borderRadius: '10px', rotation: 0, duration: 0.22, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 弹性滑动 - 唯一的弹性滑动效果
    elasticSlide: {
        type: 'timeline',
        animations: [
            { opacity: 0, x: -150, scale: 0.8, duration: 0 },
            { opacity: 0.8, x: 30, scale: 1.1, duration: 0.4, ease: 'elastic.out(1, 0.5)' },
            { x: -15, scale: 0.95, duration: 0.16, ease: 'power2.in' },
            { opacity: 1, x: 0, scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.3)' }
        ]
    }
}
