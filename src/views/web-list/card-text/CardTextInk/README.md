# CardTextInk 组件

墨韵流水 · 东方书法叙事动画组件 - 东方美学的沉浸式动画方案

## 特性

- **标题逐字挥毫生成**: 字符从模糊到清晰，模拟毛笔书写
- **笔锋实体跟随**: 光点沿路径运动产生墨点飞溅
- **副标题墨韵晕染**: 模糊到清晰，颜色从冷灰到温润墨色
- **段落纸卡古法悬浮**: 纸张飘落 + 角速度旋转 + 纸质回弹
- **鼠标准毛笔涟漪**: 同心圆墨色涟漪扩散
- **远山淡影与金箔**: 视差漂移 + 金箔飘屑
- **卷轴闭合叙事**: 水平墨线绘制，优雅收束

## 使用示例

```vue
<CardTextInk
  title="墨韵流芳"
  subtitle="传承千年的东方美学"
  :paragraphs="['探索未来的无限可能，创造美好的明天。']"
  @animation-start="onStart"
  @animation-complete="onComplete"
/>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '墨韵流芳' | 主标题 |
| subtitle | string | '' | 副标题 |
| paragraphs | string[] | [] | 段落内容 |
| animationDuration | number | 2.0 | 动画时长(秒) |
| staggerDelay | number | 0.15 | 交错延迟(秒) |
| fontSize | string | 'clamp(2.5rem, 8vw, 5rem)' | 字体大小 |
| fontWeight | number | 600 | 字重 |
| enableParticles | boolean | true | 是否启用粒子 |
| enableGoldFoil | boolean | true | 是否启用金箔效果 |
| enableRipple | boolean | true | 是否启用涟漪效果 |
| autoPlay | boolean | true | 是否自动播放 |

## Events

| 事件 | 参数 | 说明 |
|------|------|------|
| animation-start | - | 动画开始时触发 |
| animation-complete | - | 动画完成时触发 |
| scroll-progress | progress: number | 滚动进度(0-1) |
