// ==================== V8 量子维度精选 (5个) ====================
export const v8 = {
    // 量子具象化 - 最完整的量子效果
    quantumMaterialize: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.1, filter: 'blur(30px) hue-rotate(180deg)', duration: 0 },
            { opacity: 0.5, scale: 1.5, filter: 'blur(20px) hue-rotate(120deg)', duration: 0.2, ease: 'power2.out' },
            { opacity: 0.3, scale: 0.8, filter: 'blur(25px) hue-rotate(60deg)', duration: 0.12, ease: 'power2.in' },
            { opacity: 0.8, scale: 1.2, filter: 'blur(15px) hue-rotate(0deg)', duration: 0.15, ease: 'power2.out' },
            { opacity: 0.5, scale: 0.95, filter: 'blur(10px) hue-rotate(-60deg)', duration: 0.1, ease: 'power2.in' },
            { opacity: 1, scale: 1, filter: 'blur(0px) hue-rotate(0deg)', duration: 0.18, ease: 'elastic.out(1, 0.4)' }
        ]
    },
    // 维度相位 - 独特的相位变换
    dimensionalPhase: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.5, perspective: 1000, rotationX: 0, z: -1000, duration: 0 },
            { opacity: 0.6, scale: 1.2, rotationX: 45, z: -500, duration: 0.22, ease: 'power2.out' },
            { opacity: 0.4, scale: 0.85, rotationX: -30, z: -250, duration: 0.14, ease: 'power2.in' },
            { opacity: 0.9, scale: 1.1, rotationX: 15, z: -100, duration: 0.18, ease: 'power2.out' },
            { opacity: 1, scale: 1, rotationX: 0, z: 0, duration: 0.2, ease: 'elastic.out(1, 0.35)' }
        ]
    },
    // 神经脉冲 - 独特的脉冲传播效果
    neuroPulse: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.3, filter: 'blur(15px)', duration: 0 },
            { opacity: 1, scale: 1.4, filter: 'blur(8px)', duration: 0.25, ease: 'back.out(1.5)' },
            { scale: 0.85, filter: 'blur(12px)', duration: 0.12, ease: 'power2.in' },
            { scale: 1.15, filter: 'blur(5px)', duration: 0.1, ease: 'power2.out' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 共振场 - 唯一的共振效果
    resonanceField: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.4, filter: 'blur(25px)', duration: 0 },
            { opacity: 0.7, scale: 1.6, filter: 'blur(12px)', duration: 0.3, ease: 'power2.out' },
            { opacity: 0.4, scale: 0.7, filter: 'blur(20px)', duration: 0.18, ease: 'power2.in' },
            { opacity: 0.9, scale: 1.3, filter: 'blur(6px)', duration: 0.15, ease: 'power2.out' },
            { opacity: 0.6, scale: 0.9, filter: 'blur(10px)', duration: 0.1, ease: 'power2.in' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.2, ease: 'elastic.out(1, 0.4)' }
        ]
    },
    // 晶体矩阵 - 独特的矩阵效果
    crystalMatrix: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.2, rotation: 0, filter: 'blur(30px)', duration: 0 },
            { opacity: 0.6, scale: 1.3, rotation: 45, filter: 'blur(18px)', duration: 0.22, ease: 'power2.out' },
            { opacity: 0.3, scale: 0.8, rotation: -30, filter: 'blur(24px)', duration: 0.14, ease: 'power2.in' },
            { opacity: 0.8, scale: 1.15, rotation: 15, filter: 'blur(10px)', duration: 0.16, ease: 'power2.out' },
            { opacity: 0.5, scale: 0.95, rotation: -5, filter: 'blur(5px)', duration: 0.1, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.18, ease: 'elastic.out(1, 0.35)' }
        ]
    }
}
