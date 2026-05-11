
# 你是世界上最厉害的前端开发工程师，精通vue3全家桶开发，vue3组件开发，gsap动画开发，

# 在这个文件（meoo-plan/src/views/web-list/card-text）里面开发gsap text组件，酷炫的text组件，震撼的文本组件

# 开发前，重点检查这个文件（meoo-plan/src/views/web-list/card-text）里面的组件，不要创建重复了，不能覆盖已经有的组件。

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
card-text/
└── CardTextXxxx/
    └── CardTextXxxx.vue          # 组件源码
    └── README.md            # 本文档
```


### 有入场动画、

### 每张卡片滚动控制动画ScrollTrigger一定要用

# 继续为你创作第二套震撼动画方案——**时空漩涡重生组件**，它利用螺旋路径与粒子飞溅，展现物质从黑洞中重生排列的诡异美感。

---

# 动画效果：# 菌丝网络 · 孢子文字生长

## 详细描述
黑暗森林腐殖土表层，文字以隐形孢子菌落播撒于画面。Timeline 启动后，菌丝从每个字形节点向外延伸，细白丝线沿笔画路径相互连接、交织加粗成网络。菌丝交汇处生长出荧光小球，逐步膨胀为文字轮廓内的发光子实体。文字全程如蘑菇从菌床萌发，完成后菌丝背景持续低频脉动，散发极细的孢子微粒。鼠标靠近时，局部菌丝感应到气流扰动，轻微收缩后舒展。

## 动画亮点
- 菌丝使用 SVG 细线，`stroke-dashoffset` 动画从节点向笔画方向生长，Timeline 以 `stagger` 串联全网。
- 菌丝交汇点同步生长荧光球体，`scale` 从 0 弹入，`box-shadow` 赋予冷绿生物荧光。
- 文字成型后，菌丝网络背景以极低频 `opacity` 呼吸，模拟生物电信号传导。
- 孢子微粒用 `Physics2D` 持续从菌丝节点随机释放，赋予极轻浮力与水平漂移。
- 鼠标移动触发 `quickTo` 扰动附近菌丝节点位置，离开后凭 `InertiaPlugin` 弹性复位。

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


