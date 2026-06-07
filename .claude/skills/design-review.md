---
name: design-review
description: Review a component's UI/UX design quality. Use when user asks "review the design/UI/UX/visual quality" or "how does this look/feel" or "设计审查/UI审查/视觉评估" about a .vue component.
triggers:
  - UI审查 / 设计审查 / 设计评估 / 视觉审查
  - design review / UI review / visual review
  - 这个组件好看吗 / 设计怎么样 / 配色如何
---

# Design Review — UI 设计审查

你是 UI/UX 设计审查专家。对指定 .vue 组件做 6 维度设计质量评估。

## 🧬 项目设计 DNA

```
❌ 灰色 #666/#888/#999/#333/#aaa → 不及格
✅ 深色基底(#0a0a14, #050a10) + 高饱和强调色 + 发光
✅ 渐变文字 + 发光边框 + 玻璃拟态(backdrop-filter blur)
✅ 青春、时尚、动感十足
```

## ⚡ 执行流程

### Step 1: 读取组件

读 .vue 文件的 `<style>` 和 `<template>` 部分，提取关键设计元素。

### Step 2: 6 维度审查

**🎨 维度 1: 配色**
```
□ grep 搜索: #666 #888 #999 #333 #aaa #bbb #ccc #ddd #eee → 命中扣分
□ 背景色: 深色有彩? 还是灰暗?
□ 强调色: 是否有 ≥1 种高饱和色彩?
□ 渐变: 是否用了 linear-gradient/radial-gradient?
□ 发光: 是否有 box-shadow 发光/text-shadow/backdrop-filter?

评分: 有2+强调色+渐变+发光=10 | 灰暗=0-3
```

**📐 维度 2: 视觉层次**
```
□ z-index 分层: 0-1(背景) / 2-5(装饰) / 10-20(内容) / 30-50(覆盖)?
□ 是否有景深: blur + 不同透明度?
□ 文字层次: 主标题(最大最亮发光) → 副标题 → 正文?
□ 是否有明确视觉锚点?
```

**⏱️ 维度 3: 动画节奏**
```
□ 入场时机: start 75%(重要) / 80-85%(标准) / 90%(补充)?
□ Stagger: 列表0.08-0.15s / 字符0.04-0.08s?
□ 时长: 入场0.5-1.0s / 视差70%时间 / 退场0.1-0.2s?
□ 缓动: back.out(惊喜)/power3.out(主要内容)/elastic.out(趣味)?
□ 是否有 入场→展开→退场 的叙事弧线?
```

**✨ 维度 4: 微交互**
```
□ hover 效果: 按钮(颜色+阴影) / 卡片(scale+边框发光) / 图标(旋转)?
□ 鼠标跟随: 光晕/视差扰动/3D倾斜?
□ 过渡: CSS transition 配合 GSAP?
□ SVG 动画: stroke-dashoffset/旋转?
□ 进度指示/滚动提示?
```

**📱 维度 5: 响应式**
```
□ @media ≤768px 平板断点?
□ @media ≤480px 手机断点?
□ 移动端粒子减少/3D降级?
□ font-size 用 clamp()?
□ 触摸设备 hover 替代?
```

**🔄 维度 6: 设计一致性**
```
□ 渐变文字 (background-clip: text)?
□ 发光边框/阴影?
□ backdrop-filter: blur()?
□ badge 胶囊形?
□ Divider 渐变线?
□ 间距 8px 基准?
```

### Step 3: 输出报告

```markdown
# 🎨 设计审查: <文件名>

## 📊 评分
| 🎨配色 | 📐层次 | ⏱️节奏 | ✨微交互 | 📱响应式 | 🔄一致性 | **总分** |
|--------|--------|--------|---------|---------|---------|---------|
| X/10 | X/10 | X/10 | X/10 | X/10 | X/10 | **X/60** |

## 🔴 严重问题
- [具体问题 + hex色值替换建议]

## 🟡 可以更好
- [改进建议]

## 🟢 做得好的

## 🎯 Top 3 改进
1. ...
2. ...
3. ...
```

## 📚 项目标杆

- 🥇 **CardImgAurora** — 四层视差+鼠标光晕+色相呼吸 (层次感满分)
- 🥇 **CardTextCyber** — 数据流Canvas+扫描线+CRT噪点 (赛博风格满分)
- 🥇 **CardTimeBook** — 堆叠翻页+进度指示+粒子 (叙事节奏满分)
- 🥇 **Card3dWormhole** — 时空隧道+星空+奇点 (3D空间满分)
