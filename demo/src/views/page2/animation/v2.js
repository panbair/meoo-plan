// ==================== V2 高级特效精选 (6个) ====================
export const v2 = {
    // 全息效果 - 保留最早实现
    hologram: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.5, filter: 'blur(10px) hue-rotate(90deg)', duration: 0 },
            { opacity: 0.8, scale: 1.1, filter: 'blur(2px) hue-rotate(180deg)', duration: 0.3, ease: 'power2.out' },
            { opacity: 1, scale: 1, filter: 'blur(0px) hue-rotate(0deg)', duration: 0.2, ease: 'power2.in' }
        ]
    },
    // 漩涡进场 - 独特的旋转缩放组合
    vortexIn: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0, rotation: -720, duration: 0 },
            { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }
        ]
    },
    // 正弦波浪 - 流畅的S型运动
    sineWave: {
        type: 'timeline',
        animations: [
            { opacity: 0, y: 50, x: -30, duration: 0 },
            { opacity: 0.5, y: -50, x: 30, duration: 0.3, ease: 'power1.inOut' },
            { opacity: 1, y: 0, x: 0, duration: 0.3, ease: 'power1.inOut' }
        ]
    },
    // 极光 - 唯一保留的极光类动画
    aurora: {
        type: 'timeline',
        animations: [
            { opacity: 0, filter: 'blur(20px) hue-rotate(0deg)', duration: 0 },
            { opacity: 0.7, filter: 'blur(15px) hue-rotate(60deg)', duration: 0.4, ease: 'power2.out' },
            { opacity: 1, filter: 'blur(10px) hue-rotate(120deg)', duration: 0.3, ease: 'power2.in' },
            { opacity: 1, filter: 'blur(5px) hue-rotate(0deg)', duration: 0.3, ease: 'power2.out' }
        ]
    },
    // 晶体折射 - 唯一保留的晶体类动画
    crystalRefraction: {
        type: 'timeline',
        animations: [
            { opacity: 0, rotation: 0, filter: 'blur(10px)', duration: 0 },
            { opacity: 0.8, rotation: 45, filter: 'blur(5px)', duration: 0.3, ease: 'power2.out' },
            { opacity: 0.5, rotation: -45, filter: 'blur(8px)', duration: 0.2, ease: 'power2.in' },
            { opacity: 1, rotation: 0, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 超空间跳跃 - 唯一保留的空间跳跃动画
    timeWarp: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.1, rotation: 0, filter: 'blur(50px)', duration: 0 },
            { opacity: 0.5, scale: 2, rotation: 180, filter: 'blur(30px)', duration: 0.3, ease: 'power2.out' },
            { opacity: 0.8, scale: 3, rotation: 360, filter: 'blur(15px)', duration: 0.2, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.25, ease: 'elastic.out(1, 0.4)' }
        ]
    }
}
