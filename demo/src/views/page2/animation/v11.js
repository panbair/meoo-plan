// ==================== V11 爆炸破坏特效精选 (3个) ====================
export const v11 = {
    // 核爆炸 - 最震撼的爆炸效果
    nuclearExplosion: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.1, filter: 'blur(80px) brightness(10)', duration: 0 },
            { opacity: 1, scale: 3, filter: 'blur(40px) brightness(8) hue-rotate(20deg)', duration: 0.15, ease: 'power2.out' },
            { opacity: 0.6, scale: 4.5, filter: 'blur(60px) brightness(6) hue-rotate(40deg)', duration: 0.1, ease: 'power2.in' },
            { opacity: 0.9, scale: 2.5, filter: 'blur(20px) brightness(9) hue-rotate(10deg)', duration: 0.12, ease: 'power2.out' },
            { opacity: 0.5, scale: 5, filter: 'blur(50px) brightness(5) hue-rotate(60deg)', duration: 0.08, ease: 'power2.in' },
            { opacity: 1, scale: 1.8, filter: 'blur(10px) brightness(7) hue-rotate(5deg)', duration: 0.1, ease: 'power2.out' },
            { opacity: 0.7, scale: 3.5, filter: 'blur(30px) brightness(4) hue-rotate(80deg)', duration: 0.07, ease: 'power2.in' },
            { opacity: 1, scale: 1.2, filter: 'blur(5px) brightness(6) hue-rotate(0deg)', duration: 0.08, ease: 'power2.out' },
            { opacity: 0.9, scale: 2, filter: 'blur(8px) brightness(3) hue-rotate(15deg)', duration: 0.06, ease: 'power2.in' },
            { opacity: 1, scale: 1, filter: 'blur(0px) brightness(1) hue-rotate(0deg)', duration: 0.14, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 玻璃破碎 - 独特的破碎效果
    glassShatter: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 1, rotate: 0, filter: 'blur(0px)', duration: 0 },
            { opacity: 1, scale: 1.1, rotate: 5, filter: 'blur(2px)', duration: 0.08, ease: 'power1.out' },
            { opacity: 0.9, scale: 1.3, rotate: -8, filter: 'blur(5px)', duration: 0.06, ease: 'power1.in' },
            { opacity: 1, scale: 1.15, rotate: 12, filter: 'blur(3px)', duration: 0.07, ease: 'power1.out' },
            { opacity: 0.8, scale: 1.6, rotate: -15, filter: 'blur(8px)', duration: 0.05, ease: 'power1.in' },
            { opacity: 1, scale: 1.2, rotate: 8, filter: 'blur(4px)', duration: 0.06, ease: 'power1.out' },
            { opacity: 0.85, scale: 1.4, rotate: -10, filter: 'blur(6px)', duration: 0.05, ease: 'power1.in' },
            { opacity: 1, scale: 1.1, rotate: 6, filter: 'blur(2px)', duration: 0.06, ease: 'power1.out' },
            { opacity: 0.9, scale: 1.05, rotate: -3, filter: 'blur(1px)', duration: 0.04, ease: 'power1.in' },
            { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)', duration: 0.08, ease: 'elastic.out(1, 0.3)' }
        ]
    },
    // 晶体爆炸 - 独特的晶体爆炸效果
    crystalExplosion: {
        type: 'timeline',
        animations: [
            { opacity: 0, scale: 0.3, rotation: 0, filter: 'blur(20px)', duration: 0 },
            { opacity: 1, scale: 2, rotation: 45, filter: 'blur(10px)', duration: 0.12, ease: 'back.out(2)' },
            { opacity: 0.7, scale: 3.5, rotation: 90, filter: 'blur(15px)', duration: 0.08, ease: 'power2.in' },
            { opacity: 0.9, scale: 1.8, rotation: -45, filter: 'blur(8px)', duration: 0.1, ease: 'power2.out' },
            { opacity: 0.6, scale: 4, rotation: 135, filter: 'blur(12px)', duration: 0.06, ease: 'power2.in' },
            { opacity: 0.95, scale: 1.3, rotation: -22, filter: 'blur(5px)', duration: 0.08, ease: 'power2.out' },
            { opacity: 0.8, scale: 3, rotation: 67, filter: 'blur(7px)', duration: 0.05, ease: 'power2.in' },
            { opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.15, ease: 'elastic.out(1, 0.4)' }
        ]
    }
}
