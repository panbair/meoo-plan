# CardTimeBook - 时光翻阅卡片

## 设计理念

堆叠卡片的逐张揭示 — 突破网格排列的常规，所有卡片在同一位置堆叠，就像一本还没翻开的故事书。用户向下滚动时，页面被固定，最上方的卡片优雅地向左滑出并微缩淡化，露出下一张。

## 核心特性

- **堆叠翻页效果**: ScrollTrigger pin 固定 + scrub 驱动
- **逐张揭示动画**: 卡片依次向左滑出、缩小、旋转
- **时间线叙事**: 适合时间线、作品集、步骤介绍
- **进度指示器**: 显示当前翻阅进度
- **3D 透视效果**: perspective 增加深度感

## 技术实现

| 技术 | 用途 |
|------|------|
| Vue 3 | 组件框架 |
| TypeScript | 类型安全 |
| GSAP | 堆叠动画引擎 |
| ScrollTrigger | 滚动 + pin 固定 |
| SCSS | 样式预处理 |

## 动画机制

### Pin 固定 + Scrub
```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: stackBookRef,
    start: 'top top',
    end: `+=${cardCount * 150}%`,
    pin: true,
    scrub: 1
  }
})
```

### 卡片翻走动画
```javascript
tl.to(card, {
  x: -250,
  y: -50,
  scale: 0.7,
  rotate: -12,
  opacity: 0,
  ease: 'power2.inOut',
  duration: 1
}, i * 1)
```

### 章节内容
| 章节 | 标题 | 描述 |
|------|------|------|
| 第一章 | 启程 | 怀揣梦想，踏上未知的旅途 |
| 第二章 | 迷雾 | 在迷雾中探索，寻找方向 |
| 第三章 | 觉醒 | 顿悟时刻，发现真正的力量 |
| 第四章 | 巅峰 | 登顶望远，一览众山小 |
| 终章 | 新生 | 破茧成蝶，迎接全新开始 |

## 文件结构

```
CardTimeBook/
├── CardTimeBook.vue    # 组件源码
└── README.md           # 本文档
```

## 使用方式

```vue
<template>
  <CardTimeBook />
</template>
```

## 视觉效果

1. 滚动进入时堆叠书本固定在屏幕中央
2. 向下滚动触发翻页动画
3. 最上层卡片向左滑出并缩小淡化
4. 下一张卡片成为焦点
5. 进度指示器同步更新

## 组件尺寸

- 宽度: 100vw
- 高度: 100vh
