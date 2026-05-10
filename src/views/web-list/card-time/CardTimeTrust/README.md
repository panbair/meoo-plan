# CardTimeTrust - 信任脉冲 · 关键指标的数字呼吸

## 概述

CardTimeTrust 组件实现了"信任脉冲"效果 - 数字在滚动进入视口时从0递增到目标值，同时卡片轻微上浮、边框高光扫过，营造"数据刚刚被实时统计出来"的鲜活可信感。

## 设计理念

企业官网常需要用冷冰冰的数据证明实力。这个方案让数字在滚动进入视口时"活过来"，同时卡片采用毛玻璃底板、细阴影，边框在动画时出现一道跑动的高光线。

## 特性

### 核心动画

- **数字递增**: 从0滚动到目标值
- **高光扫过**: 卡片出现后触发shimmer效果
- **边框光晕**: 渐变边框光效
- **进度条动画**: 同步进度条填充

### 数据指标

| 图标 | 指标 | 描述 | 目标值 | 颜色 |
|------|------|------|--------|------|
| 🌍 | 全球客户 | 覆盖六大洲的国际企业客户 | 500+ | #3B82F6 |
| 🏙️ | 覆盖城市 | 深入各线城市的服务网络 | 128 | #10B981 |
| ⚡ | 系统稳定性 | 全年无间断服务保障 | 99.9% | #8B5CF6 |
| ⏱️ | 小时响应 | 7×24小时全天候技术支持 | 24/7 | #F59E0B |
| 📈 | 年度增长 | 连续三年保持高速增长 | 156% | #EC4899 |
| 🔒 | 安全合规 | 通过ISO27001安全认证 | 100% | #06B6D4 |

## 技术实现

### 数字递增函数

```typescript
function animateNumber(element: HTMLElement, target: number, isDecimal: boolean) {
  const obj = { value: 0 }

  gsap.to(obj, {
    value: target,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      if (isDecimal) {
        element.textContent = obj.value.toFixed(1)
      } else {
        element.textContent = Math.round(obj.value).toLocaleString()
      }
    }
  })
}
```

### ScrollTrigger 触发

```typescript
ScrollTrigger.create({
  trigger: card,
  start: 'top 80%',
  onEnter: () => {
    animateNumber(numberEl, stat.value, stat.decimal)
    gsap.fromTo(progressEl,
      { width: '0%' },
      { width: `${stat.value}%`, duration: 1.5 }
    )
  },
  onLeaveBack: () => {
    numberEl.textContent = '0'
    gsap.to(progressEl, { width: '0%', duration: 0.3 })
  }
})
```

## 视觉效果

- **毛玻璃卡片**: `backdrop-filter: blur(20px)`
- **边框光晕**: CSS mask 实现渐变边框
- **高光扫过**: shimmer 动画
- **背景装饰**: 径向渐变圆圈
- **3D 悬停**: 鼠标位置驱动的 rotateX/rotateY

## 动画清理

组件卸载时自动清理：
- GSAP Timeline 实例
- ScrollTrigger 实例
- mousemove/mouseleave 事件监听
