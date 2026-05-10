
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

# 动画效果：磁场扭曲·悬浮卡片环绕（超现实交互 艺术装置感）
逻辑：多张卡片围绕一个无形的中心点呈环形排列，不是平放在网格中，而是悬浮在三维环面上。随着Timeline推进，整个环形结构先缓慢公转，然后每张卡片依次受到“磁场脉冲”发生自转与Z轴弹跳，最终停在面对用户的完美角度。鼠标悬停时卡片会被磁力吸引轻微靠近光标，离开后恢复轨道。
javascript
const cards = gsap.utils.toArray('.magnet-card');
const container = document.querySelector('.magnet-orbit');
const total = cards.length;
const radius = 250;

// 初始排列：绕Y轴均匀分布
cards.forEach((card, i) => {
const angle = (i / total) * Math.PI * 2;
gsap.set(card, {
rotationY: angle * (180 / Math.PI),
z: radius,
x: 0,
y: 0,
opacity: 0,
transformOrigin: 'center center'
});
});

const tl = gsap.timeline({
defaults: { duration: 1.2, ease: 'power3.inOut' },
paused: true
});

// 整体出现并缓慢绕Y轴旋转展示
tl.to(cards, {
opacity: 1,
stagger: 0.1
})
.to(container, {
rotationY: 45,
duration: 2,
ease: 'none'
})
// 各卡片依次自转弹跳
.to(cards, {
rotationY: (i) => (i / total) * 360,  // 转回正面
z: radius + 30,
stagger: 0.15,
yoyo: true,
repeat: 1,
ease: 'power2.inOut',
duration: 0.6
})
.to(container, {
rotationY: 0,
duration: 1.5,
ease: 'power2.out'
});

tl.play();

// 鼠标交互：轻微磁力吸引
container.addEventListener('mousemove', (e) => {
const rect = container.getBoundingClientRect();
const mouseX = e.clientX - rect.left - rect.width / 2;
const mouseY = e.clientY - rect.top - rect.height / 2;

cards.forEach((card, i) => {
const angle = (i / total) * Math.PI * 2;
const baseX = Math.cos(angle) * radius;
const baseY = Math.sin(angle) * radius * 0.3; // 压扁环
const dist = Math.hypot(mouseX - baseX, mouseY - baseY);
const pull = Math.max(0, 1 - dist / 400) * 60;

    gsap.to(card, {
      x: baseX + (mouseX - baseX) * pull * 0.01,
      y: baseY + (mouseY - baseY) * pull * 0.01,
      z: radius + pull * 0.5,
      duration: 0.5,
      overwrite: 'auto'
    });
});
});

container.addEventListener('mouseleave', () => {
cards.forEach((card, i) => {
const angle = (i / total) * Math.PI * 2;
gsap.to(card, {
x: 0,
y: 0,
z: radius,
duration: 0.8,
ease: 'power2.out'
});
});
});

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


