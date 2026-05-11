# CardTextCinematic 组件

流光景深文字动画组件 - 电影般的沉浸式滚动动画方案

## 特性

- **标题动画**: 从远处带着景深飞入，伴随径向光晕扩散和字体权重变化
- **副标题动画**: 延迟后轻柔浮出，带有轻微弹性效果
- **段落卡片**: 从画面深处(z轴)旋转上升，背景扫描光线划过
- **环境粒子**: 品牌色调微光粒子，随滚动节奏起伏
- **整体节奏**: 流畅、克制且充满细节，完全由 GSAP 原生能力实现

## 使用示例

```vue
<CardTextCinematic
  title="未来科技"
  subtitle="探索无限可能"
  :paragraphs="['探索未来的无限可能，创造美好的明天。', '创新驱动发展，科技引领未来。']"
  theme="brand"
  @animation-start="onStart"
  @animation-complete="onComplete"
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | 'CINEMATIC' | 主标题 |
| subtitle | string | '' | 副标题 |
| paragraphs | string[] | [] | 段落内容 |
| animationDuration | number | 1.8 | 动画时长(秒) |
| staggerDelay | number | 0.06 | 交错延迟(秒) |
| theme | 'brand' \| 'tech' \| 'elegant' | 'brand' | 主题色 |
| fontSize | string | 'clamp(3rem, 10vw, 8rem)' | 字体大小 |
| fontWeight | number | 900 | 字重 |
| enableParticles | boolean | true | 是否启用粒子 |
| autoPlay | boolean | true | 是否自动播放 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| animation-start | - | 动画开始时触发 |
| animation-complete | - | 动画完成时触发 |
| scroll-progress | progress: number | 滚动进度(0-1) |
