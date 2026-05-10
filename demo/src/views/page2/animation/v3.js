
// ==================== V3 前沿特效精选 (4个) ====================
export const v3 = {
    // 虫洞穿越 - 独特的3D效果
    wormhole: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.1, rotationZ: 0, rotationX: 0, filter: 'blur(100px)', duration: 0 },
            { opacity: 0.6, scale: 3, rotationZ: 180, rotationX: 90, filter: 'blur(50px)', duration: 0.25, ease: 'power2.out' },
            { opacity: 0.4, scale: 0.5, rotationZ: -180, rotationX: -90, filter: 'blur(75px)', duration: 0.15, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotationZ: 0, rotationX: 0, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.5)' }
        ]
    },
    // 超空间驱动 - 最震撼的空间动画
    warpDrive: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.01, perspective: 1000, rotationX: 0, z: -1000, duration: 0 },
            { opacity: 0.7, scale: 0.5, rotationX: 45, z: -500, duration: 0.3, ease: 'power2.out' },
            { opacity: 0.3, scale: 2, rotationX: -45, z: 0, duration: 0.2, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotationX: 0, z: 0, duration: 0.25, ease: 'elastic.out(1, 0.6)' }
        ]
    },
    // 量子纠缠 - 唯一保留的量子类动画
    quantumEntanglement: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0, rotation: 0, filter: 'blur(20px)', duration: 0 },
            { opacity: 0.5, scale: 0.8, rotation: 180, filter: 'blur(10px)', duration: 0.2, ease: 'power2.out' },
            { opacity: 0.3, scale: 1.2, rotation: -180, filter: 'blur(15px)', duration: 0.15, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.4)' }
        ]
    },
    // 元宇宙进场 - 独特的沉浸式效果
    metaverse: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.2, rotationY: 0, filter: 'blur(30px)', duration: 0 },
            { opacity: 0.6, scale: 1.5, rotationY: 90, filter: 'blur(15px)', duration: 0.3, ease: 'power2.out' },
            { opacity: 0.4, scale: 0.8, rotationY: -90, filter: 'blur(20px)', duration: 0.2, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotationY: 0, filter: 'blur(0px)', duration: 0.25, ease: 'elastic.out(1, 0.5)' }
        ]
    }
}
