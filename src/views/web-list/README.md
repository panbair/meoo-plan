
# 你是世界上最厉害的前端开发工程师，精通vue3全家桶开发，vue3组件开发，gsap动画开发，

# 在这个文件（meoo-plan/src/views/web-list/card-time）里面开发卡片，酷炫的卡片，震撼的卡片

# 开发前，重点检查这个文件（meoo-plan/src/views/web-list/card-time）里面的组件，不要创建重复了，不能覆盖已经有的组件。

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

# 动画效果：量子跃迁面板 - 滚动触发的多维空间折叠动画，极致视觉冲击
效果特点
初始状态：所有面板压缩为一维线条，隐藏在视口中心，透明度 0
滚动触发：向下滚动触发空间展开，面板沿 Z 轴立体弹射、X/Y 轴错位扩散
动态特效：伴随旋转扭曲、光影闪烁、边缘辉光，模拟多维空间撕裂
双向无缝：向上滚动自动反向折叠，回归初始线条状态，滚动丝滑无卡顿
层级递进：面板按随机顺序先后动画，形成错落有致的爆炸式视觉效果
技术实现
GSAP Timeline：串联立体位移、旋转、透明度、缩放复合动画
ScrollTrigger：精准绑定滚动进度，支持 scrub 双向跟随、pin 固定容器
GSAP stagger：随机序列 stagger，打造无序宇宙扩散的震撼感
Vue 3 + TS：Composition API + ref 绑定 DOM，类型安全
动画效果参考代码
typescript
运行
import { ref, onMounted } from 'vue'
import gsap from 'gsap/all'

// 注册插件（必须）
gsap.registerPlugin(gsap.Timeline, gsap.ScrollTrigger)

const quantumPanelRef = ref<HTMLDivElement>()
const panelItems = ref<HTMLDivElement[]>([])

onMounted(() => {
const panels = panelItems.value
if (!panels.length) return

// 1. 初始化：所有面板压缩为一维线条，聚集在中心
gsap.set(panels, {
xPercent: 50,
yPercent: 50,
scaleX: 0.01, // 水平压缩
scaleY: 1,
rotation: gsap.utils.random(-180, 180), // 随机初始角度
opacity: 0,
z: -500, // 深度层级
filter: 'brightness(0) blur(20px)'
})

// 2. 创建滚动驱动时间线
const quantumTl = gsap.timeline({
scrollTrigger: {
trigger: quantumPanelRef.value,
start: 'top 70%',
end: 'top 20%',
scrub: 1.5, // 滚动跟随平滑度
pin: false,
toggleActions: 'play reverse play reverse'
}
})

// 3. 核心动画：量子跃迁展开效果
quantumTl.to(panels, {
// 空间展开
xPercent: 0,
yPercent: 0,
scaleX: 1,
scaleY: 1,
z: 0,

    // 视觉特效
    rotation: 0,
    opacity: 1,
    filter: 'brightness(1.2) blur(0px)',
    
    // 动画参数
    duration: 1.8,
    stagger: {
      each: 0.06,
      from: 'random', // 随机顺序扩散
      amount: 1
    },
    ease: 'expo.out', // 强力弹性缓动
})
})

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


