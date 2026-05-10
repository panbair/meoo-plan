
// ==================== V10 超视觉系列精选 (3个) ====================
export const v10 = {
    // 像素故障 - 唯一保留的像素故障效果
    pixelGlitch: {
        type: 'timeline',
        animations: [
            { opacity: 0, x: 0, y: 0, filter: 'blur(0px) contrast(1)', duration: 0 },
            { opacity: 1, x: -5, y: 2, filter: 'blur(1px) contrast(1.5)', duration: 0.05, ease: 'none' },
            { opacity: 0.8, x: 5, y: -2, filter: 'blur(2px) contrast(0.5)', duration: 0.05, ease: 'none' },
            { opacity: 1, x: -3, y: 1, filter: 'blur(1.5px) contrast(2)', duration: 0.05, ease: 'none' },
            { opacity: 0.9, x: 3, y: -1, filter: 'blur(0.5px) contrast(0.8)', duration: 0.05, ease: 'none' },
            { opacity: 1, x: 0, y: 0, filter: 'blur(0px) contrast(1)', duration: 0.1, ease: 'power2.out' }
        ]
    },
    // 扫描线扭曲 - 唯一的扫描线效果
    scanlineDistort: {
        type: 'timeline',
        animations: [
            { opacity: 0, scaleY: 0.1, filter: 'blur(3px) saturate(0)', duration: 0 },
            { opacity: 0.7, scaleY: 1.5, filter: 'blur(1px) saturate(2)', duration: 0.2, ease: 'power2.out' },
            { opacity: 0.4, scaleY: 0.8, filter: 'blur(2px) saturate(0.5)', duration: 0.1, ease: 'power2.in' },
            { opacity: 0.9, scaleY: 1.2, filter: 'blur(0.5px) saturate(1.5)', duration: 0.12, ease: 'power2.out' },
            { opacity: 0.6, scaleY: 0.9, filter: 'blur(1px) saturate(0.8)', duration: 0.08, ease: 'power2.in' },
            { opacity: 1, scaleY: 1, filter: 'blur(0px) saturate(1)', duration: 0.15, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 波形失真 - 唯一的波形效果
    waveDistortion: {
        type: 'timeline',
        animations: [
            { opacity: 0, skewX: 0, skewY: 0, filter: 'blur(0px)', duration: 0 },
            { opacity: 0.8, skewX: -15, skewY: 10, filter: 'blur(2px)', duration: 0.18, ease: 'power1.out' },
            { opacity: 0.5, skewX: 12, skewY: -8, filter: 'blur(4px)', duration: 0.12, ease: 'power1.in' },
            { opacity: 0.9, skewX: -6, skewY: 4, filter: 'blur(1px)', duration: 0.1, ease: 'power1.out' },
            { opacity: 0.7, skewX: 3, skewY: -2, filter: 'blur(2px)', duration: 0.08, ease: 'power1.in' },
            { opacity: 1, skewX: 0, skewY: 0, filter: 'blur(0px)', duration: 0.15, ease: 'elastic.out(1, 0.3)' }
        ]
    }
}
