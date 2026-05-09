// ==================== V9 时空幻境精选 (5个) ====================
export const v9 = {
    // 时间膨胀 - 独特的时间效果
    timeDilation: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.5, timeScale: 0.1, filter: 'blur(20px)', duration: 0 },
            { opacity: 0.7, scale: 1.5, timeScale: 2, filter: 'blur(10px)', duration: 0.35, ease: 'power2.out' },
            { opacity: 0.4, scale: 0.8, timeScale: 0.5, filter: 'blur(15px)', duration: 0.2, ease: 'power2.in' },
            { opacity: 0.9, scale: 1.2, timeScale: 1.5, filter: 'blur(5px)', duration: 0.25, ease: 'power2.out' },
            { opacity: 1, scale: 1, timeScale: 1, filter: 'blur(0px)', duration: 0.3, ease: 'elastic.out(1, 0.4)' }
        ]
    },
    // 空间折叠 - 唯一的空间折叠效果
    spatialFold: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.1, perspective: 1000, rotationX: 0, z: -2000, duration: 0 },
            { opacity: 0.5, scale: 0.6, rotationX: 60, z: -1000, duration: 0.2, ease: 'power2.out' },
            { opacity: 0.3, scale: 0.4, rotationX: -30, z: -500, duration: 0.12, ease: 'power2.in' },
            { opacity: 0.8, scale: 1.3, rotationX: 15, z: -250, duration: 0.18, ease: 'power2.out' },
            { opacity: 0.6, scale: 0.85, rotationX: -7, z: -100, duration: 0.1, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotationX: 0, z: 0, duration: 0.22, ease: 'elastic.out(1, 0.35)' }
        ]
    },
    // 虚空构建 - 独特的虚空效果
    voidConstruct: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0, filter: 'blur(50px) invert(1)', duration: 0 },
            { opacity: 0.6, scale: 2, filter: 'blur(30px) invert(0.5)', duration: 0.22, ease: 'power2.out' },
            { opacity: 0.3, scale: 0.5, filter: 'blur(40px) invert(0.75)', duration: 0.14, ease: 'power2.in' },
            { opacity: 0.9, scale: 1.5, filter: 'blur(15px) invert(0.25)', duration: 0.18, ease: 'power2.out' },
            { opacity: 0.5, scale: 0.8, filter: 'blur(20px) invert(0.5)', duration: 0.1, ease: 'power2.in' },
            { opacity: 1, scale: 1, filter: 'blur(0px) invert(0)', duration: 0.2, ease: 'elastic.out(1, 0.4)' }
        ]
    },
    // 混沌理论 - 独特的混沌效果
    chaosTheory: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.2, rotation: 0, x: 0, y: 0, filter: 'blur(25px)', duration: 0 },
            { opacity: 0.6, scale: 1.4, rotation: 90, x: 30, y: -30, filter: 'blur(12px)', duration: 0.25, ease: 'power2.out' },
            { opacity: 0.3, scale: 0.7, rotation: -45, x: -15, y: 15, filter: 'blur(20px)', duration: 0.15, ease: 'power2.in' },
            { opacity: 0.8, scale: 1.2, rotation: 22.5, x: 7, y: -7, filter: 'blur(8px)', duration: 0.18, ease: 'power2.out' },
            { opacity: 0.5, scale: 0.9, rotation: -11, x: -3, y: 3, filter: 'blur(5px)', duration: 0.1, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotation: 0, x: 0, y: 0, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 多元宇宙 - 唯一的多维宇宙效果
    multiverse: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.1, perspective: 1000, rotationX: 0, rotationY: 0, rotationZ: 0, z: -3000, duration: 0 },
            { opacity: 0.4, scale: 0.5, rotationX: 45, rotationY: 0, rotationZ: 0, z: -1500, duration: 0.15, ease: 'power2.out' },
            { opacity: 0.7, scale: 1.3, rotationX: 45, rotationY: 45, rotationZ: 0, z: -750, duration: 0.12, ease: 'power2.in' },
            { opacity: 0.5, scale: 0.75, rotationX: 45, rotationY: 45, rotationZ: 45, z: -375, duration: 0.1, ease: 'power2.out' },
            { opacity: 0.9, scale: 1.15, rotationX: 0, rotationY: 0, rotationZ: 0, z: -187, duration: 0.15, ease: 'power2.in' },
            { opacity: 1, scale: 1, z: 0, duration: 0.2, ease: 'elastic.out(1, 0.5)' }
        ]
    }
}
