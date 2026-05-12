# CardTextSweep 组件

逐词拆分流光扫过文字滚动定格动画组件 - 高端简约的微观字符级动画方案

## 特性

- **逐词精准拆分动效**: 文字逐词拆分，每个单词独立动画生命周期
- **专属流光蒙版扫掠**: 渐变柔光蒙版从左至右扫过，镀字质感
- **字间距开合动态**: 标题文字紧凑→舒展动画
- **滚动触发定格+反向退场**: toggleActions 精准控制动画状态
- **静态 Hover 微交互**: 动画定格后保留轻柔 hover 效果
- **极致性能优化**: 单个全局 ScrollTrigger 统一管控

## 使用示例

```vue
<CardTextSweep
  title="Elegant Design"
  subtitle="简约而不简单"
  :paragraphs="['探索未来的无限可能，创造美好的明天。', '创新驱动发展，科技引领未来。']"
  @animation-start="onStart"
  @animation-complete="onComplete"
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | 'ELEGANT' | 主标题 |
| subtitle | string | '' | 副标题 |
| paragraphs | string[] | [] | 段落内容 |
| animationDuration | number | 1.2 | 动画时长(秒) |
| staggerDelay | number | 0.08 | 交错延迟(秒) |
| fontSize | string | 'clamp(2.5rem, 8vw, 5rem)' | 字体大小 |
| fontWeight | number | 600 | 字重 |
| enableHover | boolean | true | 是否启用 hover 效果 |
| autoPlay | boolean | true | 是否自动播放 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| animation-start | - | 动画开始时触发 |
| animation-complete | - | 动画完成时触发 |
| scroll-progress | progress: number | 滚动进度(0-1) |
