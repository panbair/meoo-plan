
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

# 动画效果：霓虹节拍网格 · 脉冲扩散
设计意图
9 张卡片（3x3 网格）初始暗淡。当滚动触发，从中心卡片开始，一道脉冲向外扩散：每张卡片依次快速闪烁（缩放+透明度+霓虹边框色彩变化），形成类似心脏跳动或迪斯科球扫过的连锁反应，循环一次后归于平静。

html
<div class="beat-grid">
  <div class="beat-card">1</div>
  <div class="beat-card">2</div>
  <div class="beat-card">3</div>
  <div class="beat-card">4</div>
  <div class="beat-card core">5</div>
  <div class="beat-card">6</div>
  <div class="beat-card">7</div>
  <div class="beat-card">8</div>
  <div class="beat-card">9</div>
</div>
css
body {
  background: #0d0d1a;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.beat-grid {
  display: grid;
  grid-template-columns: repeat(3, 120px);
  gap: 20px;
  justify-content: center;
}
.beat-card {
  height: 140px;
  background: #1a1a2e;
  border: 2px solid #2d2d4a;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #6c63ff;
  transition: border-color 0.2s, box-shadow 0.2s;
  will-change: transform, opacity, border-color;
}
.beat-card.core {
  background: #6c63ff22;
  border-color: #6c63ff;
}
js
gsap.registerPlugin(ScrollTrigger);

// 计算卡片距离中心的“环数”，用来决定延迟（中心先动）
const cards = gsap.utils.toArray(".beat-card");
const grid = document.querySelector(".beat-grid");
const centerIndex = 4; // 中间卡片索引 (0-based: 3x3 的中间是第5个)

// 设置初始：全部微缩、暗色
gsap.set(cards, { scale: 0.9, opacity: 0.6 });

const masterTL = gsap.timeline({
scrollTrigger: {
trigger: ".beat-grid",
start: "top 80%",
toggleActions: "play none none none",
}
});

// 为每张卡片创建独立脉冲，根据与中心距离设置延迟
cards.forEach((card, i) => {
// 曼哈顿距离或欧氏距离决定延迟
const row = Math.floor(i / 3);
const col = i % 3;
const centerRow = 1, centerCol = 1;
const dist = Math.abs(row - centerRow) + Math.abs(col - centerCol);
const delay = dist * 0.12;

// 每张卡片的节拍动画
const pulse = gsap.timeline();
pulse.to(card, {
scale: 1.2,
opacity: 1,
borderColor: "#ff4da6",
boxShadow: "0 0 40px #ff4da6",
duration: 0.25,
ease: "power2.out",
})
.to(card, {
scale: 1,
opacity: 0.9,
borderColor: "#6c63ff",
boxShadow: "0 0 15px #6c63ff",
duration: 0.3,
ease: "power2.out",
})
.to(card, {
scale: 0.95,
borderColor: "#2d2d4a",
boxShadow: "0 0 0px transparent",
duration: 0.2,
});

masterTL.add(pulse, delay);
});

// 最后让所有卡片回归初始状态（或保留微光）
masterTL.to(cards, { scale: 0.95, opacity: 0.85, duration: 0.3 }, "-=0.1");
效果：中间卡片率先亮起，边缘闪烁紫色与粉红，然后涟漪般一圈圈向外扩散，每张卡片依次“砰”地放大、发光、再淡回，像夜店的灯光矩阵跟随节拍跳动。如果你想要无限循环，可以给 masterTL 设置 repeat: -1，但企业官网慎用循环。




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


