// ==================== V4 炫酷特效精选 (5个) ====================
export const v4 = {
    // 霓虹故障 - 经典的故障效果
    neonGlitch: {
        type: 'timeline',
        animations: [
            { opacity: 0, x: -30, filter: 'blur(5px) hue-rotate(0deg)', duration: 0 },
            { opacity: 1, x: 30, filter: 'blur(3px) hue-rotate(120deg)', duration: 0.05, ease: 'none' },
            { opacity: 0.8, x: -20, filter: 'blur(8px) hue-rotate(240deg)', duration: 0.05, ease: 'none' },
            { opacity: 1, x: 20, filter: 'blur(2px) hue-rotate(360deg)', duration: 0.05, ease: 'none' },
            { opacity: 1, x: 0, filter: 'blur(0px) hue-rotate(0deg)', duration: 0.1, ease: 'power2.out' }
        ]
    },
    // 粒子爆发 - 最简洁的爆炸效果
    particleBurst: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0, rotation: 0, duration: 0 },
            { opacity: 1, scale: 1.8, rotation: 180, duration: 0.2, ease: 'back.out(2)' },
            { scale: 0.9, rotation: 360, duration: 0.15, ease: 'power2.in' },
            { scale: 1, rotation: 0, duration: 0.15, ease: 'elastic.out(1, 0.5)' }
        ]
    },
    // 液体变形 - 最自然的变形效果
    liquidMorph: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.3, borderRadius: '50%', rotation: 0, duration: 0 },
            { opacity: 0.5, scale: 1.2, borderRadius: '30%', rotation: 90, duration: 0.3, ease: 'power1.inOut' },
            { opacity: 1, scale: 0.8, borderRadius: '10%', rotation: 180, duration: 0.25, ease: 'power1.inOut' },
            { opacity: 1, scale: 1, borderRadius: '20px', rotation: 0, duration: 0.2, ease: 'elastic.out(1, 0.5)' }
        ]
    },
    // 赛博朋克升起 - 独特的skew组合效果
    cyberpunkRise: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.2, skewX: -30, skewY: -20, filter: 'blur(30px) hue-rotate(0deg)', duration: 0 },
            { opacity: 0.4, scale: 0.6, skewX: 20, skewY: 15, filter: 'blur(20px) hue-rotate(45deg)', duration: 0.15, ease: 'power2.out' },
            { opacity: 0.7, scale: 1.4, skewX: -15, skewY: -10, filter: 'blur(10px) hue-rotate(90deg)', duration: 0.12, ease: 'power2.in' },
            { opacity: 0.5, scale: 0.9, skewX: 10, skewY: 8, filter: 'blur(15px) hue-rotate(135deg)', duration: 0.1, ease: 'power2.out' },
            { opacity: 0.9, scale: 1.1, skewX: -5, skewY: -4, filter: 'blur(8px) hue-rotate(180deg)', duration: 0.08, ease: 'power2.in' },
            { opacity: 1, scale: 1, skewX: 0, skewY: 0, filter: 'blur(0px) hue-rotate(0deg)', duration: 0.15, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 虚空崩溃 - 独特的逆向动画
    voidCollapse: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 3, filter: 'blur(50px) invert(1)', duration: 0 },
            { opacity: 0.6, scale: 2, filter: 'blur(30px) invert(0.5)', duration: 0.2, ease: 'power2.in' },
            { opacity: 0.3, scale: 1.5, filter: 'blur(15px) invert(0.2)', duration: 0.15, ease: 'power2.out' },
            { opacity: 1, scale: 1, filter: 'blur(0px) invert(0)', duration: 0.2, ease: 'elastic.out(1, 0.4)' }
        ]
    }
}
