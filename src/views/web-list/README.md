
# 你是世界上最厉害的前端开发工程师，精通vue3全家桶开发，vue3组件开发，gsap动画开发，

# 在这个文件（meoo-plan/src/views/web-list/card-list）里面开发卡片，酷炫的卡片，震撼的卡片

# 重点检查这个文件（meoo-plan/src/views/web-list/card-list）里面的组件，不要创建重复了，不能覆盖已经有的组件。

## 代码严格符合vue3组件开源规范

## 组件宽高都是:
height: 100vh;
width: 100vw;

## 内容要根据组件宽高设计

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.3 | 核心框架 |
| TypeScript | ^5.0 | 类型系统 |
| GSAP | ^3.12 | 动画引擎 |
| ScrollTrigger | ^3.12 | 滚动动画插件 |
| SCSS | ^1.6 | 样式预处理 |

### 文件结构

```
card-list/
└── CardXXXX/
    └── CardXXXX.vue          # 组件源码
    └── README.md            # 本文档
```


### 有入场动画、

### 每张卡片滚动控制动画ScrollTrigger一定要用

# 动画效果用gsap.timeline设计,卡片动画要有节奏


### ScrollTrigger 参数说明

| 参数 | 值 | 说明 |
|------|-----|------|
| `trigger` | `parent` | 触发器元素 |
| `start` | `'top 80%'` | 元素顶部到达视口80%时开始 |
| `end` | `'top 20%'` | 元素顶部到达视口20%时结束 |
| `scrub` | `1.5` | 平滑系数，值越大动画越平滑 |

### 动画清理
let cleanupFns: TweenCleanup[] = []

1 保存清理函数

2 组件卸载时清理动画,这个组件所有gsap动画全部清理掉.

# 注意获取元素要用vue3的方式 ref获取dom
gsap获取元素要用vue3的方式，如果直接用classname,有重复classname可能会造成冲突， 比如：tl.fromTo('.header-badge'）,tl.to('.header-badge'）等，都是不行的





 
'CardAudioWave', 'CardAurora', 'CardAuroraWave', 1
'CardBioluminescence', 'CardCatalyst', 'CardCelestial', 1
'CardCircuit', 'CardCrystal', 'CardCyberspace', 1
'CardDNA', 'CardDataStream', 'CardEclipse', 1
'CardFadeBlur', 'CardFadeInOut', 'CardFireflies', 1
'CardFrost', 'CardFullCombo', 'CardFusion', 1
'CardGalaxy', 'CardGlacier', 'CardGlitch', 1
'CardGradientWave', 'CardGravity', 'CardGravity2', 1
'CardHologram', 'CardHolographic', 'CardInfinity', 1
'CardKaleidoscope', 'CardLightning', 'CardLiquid', 1
'CardLiquidMetal', 'CardMagma', 'CardMatrix', 'CardMeteor', 'CardMorph', 'CardMosaic',1
'CardNebula', 'CardNeon', 'CardNeonCircuit', 'CardNineCombo', 'CardParticle',1
'CardPhantom', 'CardPlasma', 'CardPortal', 'CardPrism', 'CardQuantum',1
'CardRipple', 'CardRotate', 'CardRotateScaleTranslate', 'CardScale',1
'CardShatter', 'CardSixCombo', 'CardSlideEdge', 'CardSolarSystem', 1
'CardSphere', 'CardSupernova', 'CardSwipe', 'CardTornado', 'CardTranslate',1
'CardTranslateRotateScale', 'CardVoid', 'CardVortex', 'CardWave'

检查一下:'CardTranslateRotateScale', 'CardVoid', 'CardVortex', 'CardWave'组件的 onUnmounted 清理逻辑，看看是否正确清理了 ScrollTrigger 和其他动画。有的就处理。
