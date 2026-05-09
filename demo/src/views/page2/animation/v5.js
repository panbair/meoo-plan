// ==================== V5 极限冲击特效精选 (5个) ====================
export const v5 = {
    // 超空间跳跃 - 最震撼的维度变换
    hyperspaceJump: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.01, rotationX: 0, rotationY: 0, z: -2000, duration: 0 },
            { opacity: 0.5, scale: 0.5, rotationX: 45, rotationY: 45, z: -1000, duration: 0.2, ease: 'power2.out' },
            { opacity: 0.8, scale: 1.5, rotationX: -45, rotationY: -45, z: -500, duration: 0.15, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotationX: 0, rotationY: 0, z: 0, duration: 0.2, ease: 'elastic.out(1, 0.5)' }
        ]
    },
    // 维度级联 - 复杂的多维变换
    dimensionCascade: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.1, rotationX: 0, rotationY: 0, rotationZ: 0, duration: 0 },
            { opacity: 0.3, scale: 0.5, rotationX: 90, rotationY: 0, rotationZ: 0, duration: 0.12, ease: 'power2.out' },
            { opacity: 0.6, scale: 1.2, rotationX: 90, rotationY: 90, rotationZ: 0, duration: 0.12, ease: 'power2.in' },
            { opacity: 0.4, scale: 0.8, rotationX: 90, rotationY: 90, rotationZ: 90, duration: 0.1, ease: 'power2.out' },
            { opacity: 0.8, scale: 1.1, rotationX: 0, rotationY: 0, rotationZ: 0, duration: 0.15, ease: 'power2.in' },
            { opacity: 1, scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.4)' }
        ]
    },
    // 超新星核心 - 最强的爆炸效果
    supernovaCore: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.1, filter: 'blur(50px) brightness(3)', duration: 0 },
            { opacity: 1, scale: 2.5, filter: 'blur(30px) brightness(2.5)', duration: 0.18, ease: 'power2.out' },
            { opacity: 0.7, scale: 4, filter: 'blur(40px) brightness(2)', duration: 0.12, ease: 'power2.in' },
            { opacity: 1, scale: 1.8, filter: 'blur(20px) brightness(1.5)', duration: 0.15, ease: 'power2.out' },
            { opacity: 0.8, scale: 2.5, filter: 'blur(25px) brightness(1.3)', duration: 0.1, ease: 'power2.in' },
            { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 等离子风暴 - 最完整的等离子效果
    plasmaStorm: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.2, filter: 'blur(60px) hue-rotate(0deg)', duration: 0 },
            { opacity: 0.5, scale: 1.5, filter: 'blur(40px) hue-rotate(60deg)', duration: 0.15, ease: 'power2.out' },
            { opacity: 0.8, scale: 2.2, filter: 'blur(25px) hue-rotate(120deg)', duration: 0.12, ease: 'power2.in' },
            { opacity: 0.6, scale: 1.8, filter: 'blur(35px) hue-rotate(180deg)', duration: 0.1, ease: 'power2.out' },
            { opacity: 0.9, scale: 1.3, filter: 'blur(15px) hue-rotate(240deg)', duration: 0.08, ease: 'power2.in' },
            { opacity: 1, scale: 1, filter: 'blur(0px) hue-rotate(0deg)', duration: 0.2, ease: 'elastic.out(1, 0.4)' }
        ]
    },
    // 超高维度 - 最复杂的维度效果
    hyperDimensional: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.01, perspective: 1000, rotationX: 0, rotationY: 0, rotationZ: 0, z: -2000, duration: 0 },
            { opacity: 0.4, scale: 0.5, rotationX: 45, rotationY: 45, rotationZ: 45, z: -1000, duration: 0.15, ease: 'power2.out' },
            { opacity: 0.7, scale: 1.5, rotationX: -45, rotationY: -45, rotationZ: -45, z: -500, duration: 0.12, ease: 'power2.in' },
            { opacity: 0.5, scale: 0.8, rotationX: 22.5, rotationY: 22.5, rotationZ: 22.5, z: -250, duration: 0.1, ease: 'power2.out' },
            { opacity: 0.9, scale: 1.2, rotationX: -22.5, rotationY: -22.5, rotationZ: -22.5, z: -100, duration: 0.08, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0, z: 0, duration: 0.2, ease: 'elastic.out(1, 0.5)' }
        ]
    }
}
