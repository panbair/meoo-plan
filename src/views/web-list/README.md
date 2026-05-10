
# 你是世界上最厉害的前端开发工程师，精通vue3全家桶开发，vue3组件开发，gsap动画开发，

# 在这个文件（meoo-plan/src/views/web-list/card-time）里面开发卡片，酷炫的卡片，震撼的卡片

# 重点检查这个文件（meoo-plan/src/views/web-list/card-time）里面的组件，不要创建重复了，不能覆盖已经有的组件。

## 代码严格符合vue3组件开源规范

# 注意获取元素要用vue3的方式 ref获取dom
# gsap获取元素要用vue3的方式，如果直接用classname,有重复classname可能会造成冲突， 比如：tl.fromTo('.header-badge'）,tl.to('.header-badge'）等，都是不行的


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
card-time/
└── CardTimeXxxx/
    └── CardTimeXxxx.vue          # 组件源码
    └── README.md            # 本文档
```


### 有入场动画、

### 每张卡片滚动控制动画ScrollTrigger一定要用

# 动画效果：万花筒棱镜·碎片旋转变焦重组（迷幻奢华 视觉冲击）
逻辑：卡片初始被打散为8个三角形碎片（使用 clip-path 切割），每个碎片随机散布在空间中并带有旋转和模糊。Timeline 驱动所有碎片像万花筒旋转般聚拢，同时反向旋转、缩放并消除模糊，最终拼合为完整卡片。拼合瞬间触发短暂的棱镜色散光晕，最后光晕消散，呈现精致的卡片内容。
javascript
const cards = gsap.utils.toArray('.kaleidoscope-card');
const tl = gsap.timeline({
defaults: { duration: 0.9, ease: 'power3.inOut' },
paused: true
});

cards.forEach((card, index) => {
const fragments = card.querySelectorAll('.kaleido-fragment');
const content = card.querySelector('.card-content');
const prismGlow = card.querySelector('.prism-glow');

// 存储每个碎片的最终位置（相对卡片中心）
const positions = [
{ x: -25, y: -25, rotate: 0, clip: 'polygon(0 0, 50% 0, 0 50%)' },
{ x: 25, y: -25, rotate: 0, clip: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)' },
{ x: -25, y: 25, rotate: 0, clip: 'polygon(0 50%, 50% 50%, 0 100%)' },
{ x: 25, y: 25, rotate: 0, clip: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' },
{ x: -12, y: -12, rotate: 0, clip: 'polygon(25% 25%, 75% 25%, 50% 50%)' },
{ x: 12, y: -12, rotate: 0, clip: 'polygon(50% 50%, 75% 25%, 75% 75%)' },
{ x: -12, y: 12, rotate: 0, clip: 'polygon(25% 75%, 50% 50%, 25% 25%)' },
{ x: 12, y: 12, rotate: 0, clip: 'polygon(50% 50%, 75% 75%, 25% 75%)' }
];

// 初始：随机散布
fragments.forEach((frag, i) => {
gsap.set(frag, {
x: gsap.utils.random(-300, 300),
y: gsap.utils.random(-400, 400),
scale: gsap.utils.random(0.3, 0.8),
rotation: gsap.utils.random(-180, 180),
filter: 'blur(6px)',
opacity: 0.6,
clipPath: positions[i].clip
});
});
gsap.set(content, { scale: 0.9, opacity: 0 });
gsap.set(prismGlow, { opacity: 0, scale: 0.5 });

const cardTl = gsap.timeline();

// 碎片聚拢：转成旋转着飞到目标位置
cardTl.to(fragments, {
x: (i) => positions[i].x,
y: (i) => positions[i].y,
scale: 1,
rotation: 0,
filter: 'blur(0px)',
opacity: 1,
duration: 0.8,
stagger: { amount: 0.3, from: 'random' },
ease: 'back.out(1.5)'
})
// 拼合瞬间：棱镜光晕爆发
.to(prismGlow, {
opacity: 1,
scale: 2.5,
duration: 0.4,
ease: 'power2.out'
})
.to(prismGlow, {
opacity: 0,
scale: 1,
duration: 0.5,
ease: 'power2.in'
}, '-=0.2')
// 内容显现
.to(content, {
opacity: 1,
scale: 1,
duration: 0.6,
ease: 'power3.out'
}, '-=0.4')
// 碎片轻微内缩，完成卡片整体感
.to(fragments, {
opacity: 0,
duration: 0.3,
stagger: 0.02
}, '-=0.3');

tl.add(cardTl, index * 0.25);
});

tl.play();

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

3 检查一下组件的 onUnmounted 清理逻辑，看看是否正确清理了 ScrollTrigger 和其他动画。有的就处理。


