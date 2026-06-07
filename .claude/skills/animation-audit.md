---
name: animation-audit
description: Audit a GSAP animation Vue component for bugs and issues. Use when user says "audit/check/review/find issues/审查/检查/审计" referring to a .vue component file, or mentions "animation problems/memory leaks/cleanup issues/performance".
triggers:
  - 检查动画 / 审计代码 / 审查动画
  - audit / check animation / review component
  - animation bug / cleanup issue / memory leak
---

# Animation Audit — 动画代码审计

你是 GSAP 动画代码审计专家。对指定 .vue 文件做 6 维度深度检查。

## ⚡ 执行流程

### Step 1: 读取目标文件

```bash
# 读取全部内容，统计行数
cat <file_path> | wc -l
```

### Step 2: 快速 grep 扫描（命中即有问题）

```bash
# 🔴 致命：class 选择器误用
grep -n "gsap\.to\s*(\s*['\"]" <file> 
grep -n "gsap\.from\s*(\s*['\"]" <file>
grep -n "\.fromTo\s*(\s*['\"]" <file>

# 🔴 致命：缺失清理
grep -c "cleanupFns.push" <file>          # 应该 ≥ tween数量
grep -c "ScrollTrigger.getAll" <file>      # 应该 ≥ 1
grep -c "onUnmounted" <file>               # 应该 ≥ 1

# 🟡 性能：动画了非GPU属性
grep -n "width:\|height:\|top:\|left:\|margin:\|padding:" <file> | grep "gsap\|\.to\|\.from"

# 🟡 内存：gsap.ticker 是否被清理
grep -n "ticker.add" <file>
grep -n "ticker.remove" <file>
```

### Step 3: 6 维度审计

**🔴 维度 1: 清理完整性**
```
□ type TweenCleanup 和 cleanupFns[] 是否定义
□ 每个 timeline 是否 push kill
□ 每个 ScrollTrigger.create 是否 push kill
□ 每个 ticker.add 是否 push remove
□ 每个 addEventListener 是否 push removeEventListener
□ 每个 requestAnimationFrame 是否 push cancelAnimationFrame
□ onUnmounted 是否: cleanupFns.forEach + ScrollTrigger.getAll().forEach(kill)
```

**🔴 维度 2: DOM 引用规范**
```
搜索模式: gsap.(to|from|fromTo|set)\s*\(\s*['"]  → 命中即严重问题
必须使用 ref.value，禁止任何字符串选择器
```

**🟡 维度 3: ScrollTrigger 配置**
```
□ start 值是否在 'top 75%' ~ 'top 90%' 范围内
□ scrub 是否在 1-2 之间
□ pin:true 时 end 是否动态计算 (如 '+=N*150%')
□ toggleActions 是否合理
```

**🟡 维度 4: 性能**
```
□ 动画属性是否为 GPU 加速 (transform, opacity) — 不是则扣分
□ 是否用了 width/height/top/left/margin/padding → 触发 reflow
□ Canvas 粒子数: 桌面 ≤80, 移动应减半
□ mousemove/scroll 事件是否有节流
□ will-change 是否合理使用
```

**🟡 维度 5: 内存泄漏**
```
□ Canvas: 卸载时 clearRect + 置零宽高
□ 定时器: setTimeout/setInterval 是否清除
□ 粒子数组: 卸载时是否置空
□ gsap.ticker: 回调是否移除
```

**🟢 维度 6: 初始状态**
```
□ 所有动画元素是否 gsap.set 初始状态
□ 初始状态是否覆盖 opacity/transform/filter
□ gsap.set 是否在 timeline 之前
```

### Step 4: 输出报告

```markdown
# 🔍 动画审计: <文件名>

## 总览
- 文件行数: N  |  动画元素: N 个  |  timeline: N  |  ScrollTrigger: N

## 🔴 严重 (必须修复)
| # | 维度 | 行号 | 问题 | 修复 |
|---|------|------|------|------|

## 🟡 改进 (建议修复)
| # | 维度 | 行号 | 问题 | 建议 |
|---|------|------|------|------|

## 🟢 良好
- ✅ ...

## 📊 评分
| 清理 | DOM | ST | 性能 | 内存 | 初始 | **总分** |
|------|-----|-----|------|------|------|---------|
| X/10 | X/10 | X/10 | X/10 | X/10 | X/10 | **X/60** |

## ⚡ 快速修复 (如有问题直接给 diff)
```
