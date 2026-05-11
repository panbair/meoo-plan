# CardTextOrganic 组件

重力弹润叙事 · 有机物理动画组件 - 自然物理质感的沉浸式动画方案

## 特性

- **重量级标题摆锤**: 单词自由落体，触碰基线时弹性形变
- **橡皮筋副标题伸展**: 拉伸收缩，带有过冲余韵
- **卡片天体坠落与弹性形变**: 物理引擎模拟真实弹跳
- **柔性联动与惯性拖拽**: 卡片间软连接约束
- **鼠标引力场与涟漪**: 鼠标吸引效果
- **物理粒子背景的布朗运动**: 自然漂浮光点

## 使用示例

```vue
<CardTextOrganic
  title="Natural Beauty"
  subtitle="探索自然之美"
  :paragraphs="['探索未来的无限可能，创造美好的明天。', '创新驱动发展，科技引领未来。']"
  @animation-start="onStart"
  @animation-complete="onComplete"
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | 'ORGANIC' | 主标题 |
| subtitle | string | '' | 副标题 |
| paragraphs | string[] | [] | 段落内容 |
| animationDuration | number | 1.2 | 动画时长(秒) |
| staggerDelay | number | 0.1 | 交错延迟(秒) |
| gravity | number | 980 | 重力系数 |
| friction | number | 0.3 | 摩擦系数 |
| fontSize | string | 'clamp(3rem, 10vw, 7rem)' | 字体大小 |
| fontWeight | number | 700 | 字重 |
| enableParticles | boolean | true | 是否启用粒子 |
| enableMouseGravity | boolean | true | 是否启用鼠标引力 |
| autoPlay | boolean | true | 是否自动播放 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| animation-start | - | 动画开始时触发 |
| animation-complete | - | 动画完成时触发 |
| scroll-progress | progress: number | 滚动进度(0-1) |
