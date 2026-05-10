// ==================== V6 光影特效精选 (6个) ====================
export const v6 = {
    // 霓虹脉冲 - 唯一保留的霓虹动画
    neonPulsar: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.5, filter: 'blur(10px) drop-shadow(0 0 0 rgba(0, 255, 255, 0))', duration: 0 },
            { opacity: 1, scale: 1.2, filter: 'blur(5px) drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))', duration: 0.3, ease: 'power2.out' },
            { opacity: 0.8, scale: 0.9, filter: 'blur(8px) drop-shadow(0 0 15px rgba(0, 255, 255, 0.6))', duration: 0.2, ease: 'power2.in' },
            { opacity: 1, scale: 1, filter: 'blur(0px) drop-shadow(0 0 10px rgba(0, 255, 255, 0.4))', duration: 0.25, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 激光扫描 - 独特的扫描效果
    laserSweep: {
        type: 'timeline',
        animations: [
            { opacity: 0, x: -200, skewX: -20, filter: 'blur(2px)', duration: 0 },
            { opacity: 1, x: 200, skewX: 20, filter: 'blur(5px)', duration: 0.4, ease: 'power1.inOut' },
            { opacity: 0.7, x: -100, skewX: -10, filter: 'blur(3px)', duration: 0.2, ease: 'power1.inOut' },
            { opacity: 1, x: 0, skewX: 0, filter: 'blur(0px)', duration: 0.15, ease: 'elastic.out(1, 0.4)' }
        ]
    },
    // 光环光晕 - 柔和的光晕效果
    haloGlow: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.8, filter: 'blur(30px) brightness(2)', duration: 0 },
            { opacity: 0.6, scale: 1.3, filter: 'blur(20px) brightness(1.8)', duration: 0.3, ease: 'power2.out' },
            { opacity: 0.4, scale: 0.9, filter: 'blur(25px) brightness(1.5)', duration: 0.2, ease: 'power2.in' },
            { opacity: 0.8, scale: 1.1, filter: 'blur(15px) brightness(1.3)', duration: 0.15, ease: 'power2.out' },
            { opacity: 1, scale: 1, filter: 'blur(10px) brightness(1)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 玻璃折射 - 唯一的折射效果
    glassRefraction: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.9, rotation: 0, filter: 'blur(15px) brightness(1.5)', duration: 0 },
            { opacity: 0.7, scale: 1.1, rotation: 15, filter: 'blur(8px) brightness(1.3)', duration: 0.25, ease: 'power2.out' },
            { opacity: 0.5, scale: 0.95, rotation: -10, filter: 'blur(12px) brightness(1.2)', duration: 0.15, ease: 'power2.in' },
            { opacity: 0.9, scale: 1.05, rotation: 5, filter: 'blur(5px) brightness(1.1)', duration: 0.12, ease: 'power2.out' },
            { opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px) brightness(1)', duration: 0.18, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 星尘闪烁 - 柔和的粒子效果
    stardustTwinkle: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.5, filter: 'blur(20px)', duration: 0 },
            { opacity: 0.6, scale: 1.3, filter: 'blur(12px)', duration: 0.25, ease: 'power2.out' },
            { opacity: 0.4, scale: 0.8, filter: 'blur(18px)', duration: 0.18, ease: 'power2.in' },
            { opacity: 0.8, scale: 1.1, filter: 'blur(8px)', duration: 0.14, ease: 'power2.out' },
            { opacity: 0.5, scale: 0.9, filter: 'blur(10px)', duration: 0.1, ease: 'power2.in' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 魔法光环 - 独特的魔法效果
    magicAura: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.6, filter: 'blur(25px) hue-rotate(0deg)', duration: 0 },
            { opacity: 0.7, scale: 1.4, filter: 'blur(15px) hue-rotate(45deg)', duration: 0.28, ease: 'power2.out' },
            { opacity: 0.5, scale: 0.85, filter: 'blur(20px) hue-rotate(90deg)', duration: 0.2, ease: 'power2.in' },
            { opacity: 0.9, scale: 1.15, filter: 'blur(10px) hue-rotate(135deg)', duration: 0.16, ease: 'power2.out' },
            { opacity: 1, scale: 1, filter: 'blur(5px) hue-rotate(180deg)', duration: 0.22, ease: 'elastic.out(1, 0.35)' }
        ]
    }
}
