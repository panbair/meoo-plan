# 🛠️ Web-List Skill 使用文档

> 4 个 AI Skill，覆盖 GSAP 动画组件开发的完整生命周期：**搜索 → 生成 → 审计 → 审查**

---

## 目录

1. [快速开始](#快速开始)
2. [Skill 总览](#skill-总览)
3. [触发方式](#触发方式)
4. [工作流示例](#工作流示例)
5. [Skill 详解](#skill-详解)
6. [FAQ](#faq)

---

## 快速开始

### 30 秒上手

```
你: "帮我找一个适合做产品展示的3D旋转组件"
AI: [自动调用 component-finder → 给出 Top 3 匹配]

你: "用 component-scaffold 创建一个极光主题的标题组件"
AI: [自动调用 component-scaffold → 生成完整 .vue + README]

你: "审查一下这个组件的动画代码"
AI: [自动调用 animation-audit → 6 维度评分报告]

你: "看看这个组件的UI设计怎么样"
AI: [自动调用 design-review → 配色/层次/节奏分析]
```

---

## Skill 总览

```
┌─────────────────────────────────────────────────────────┐
│                     开发工作流                            │
│                                                         │
│   需求 ──→ 🔍 component-finder ──→ 找到已有组件?        │
│               │                        │                │
│               │ 没找到                  │ 有现成的        │
│               ▼                        ▼                │
│         🏗️ component-scaffold    直接使用/定制           │
│               │                        │                │
│               ▼                        │                │
│         生成 .vue + README             │                │
│               │                        │                │
│               ▼                        ▼                │
│         🔍 animation-audit  ←── 代码完成                 │
│               │                                         │
│               ▼                                         │
│         🎨 design-review    ←── 设计审查                 │
│               │                                         │
│               ▼                                         │
│           上线 🚀                                       │
└─────────────────────────────────────────────────────────┘
```

| # | Skill | 阶段 | 输入 | 输出 |
|---|-------|------|------|------|
| 🔍 | **component-finder** | 需求分析 | 自然语言描述 | Top 3 匹配 + 推荐方案 |
| 🏗️ | **component-scaffold** | 开发 | 组件名+描述 | .vue + README.md |
| 🔍 | **animation-audit** | 代码审查 | .vue 文件路径 | 6 维度评分报告 + 修复建议 |
| 🎨 | **design-review** | 设计审查 | .vue 文件路径 | 6 维度设计评分 + 改进建议 |

---

## 触发方式

### 方式 1: 斜杠命令（最直接）

```
/component-finder <描述>
/component-scaffold <描述>
/animation-audit <文件路径>
/design-review <文件路径>
```

### 方式 2: 自然语言（AI 自动识别）

当你描述的需求匹配 Skill 时，AI 会自动调用。触发关键词：

| Skill | 中文触发词 | English triggers |
|-------|-----------|-----------------|
| component-finder | 找组件、搜索、推荐、有没有、适合做、可以用来 | find component, search, recommend, looking for |
| component-scaffold | 创建组件、新建组件、生成组件、脚手架 | create component, scaffold, make a component |
| animation-audit | 检查动画、审计、审查代码、有没有问题 | audit, check animation, review code, find issues |
| design-review | UI审查、设计审查、设计评估、好看吗、配色怎么样 | design review, UI review, how does it look |

### 方式 3: 明确点名

```
"调用 component-finder 帮我..."
"用 animation-audit 分析这个文件"
```

**推荐用方式 2**——直接用自然语言描述需求，AI 会根据关键词自动匹配 Skill。

---

## 工作流示例

### 场景 1: 需要新组件

```
👤: "需要一个图片碎片飞散然后重组的揭示效果，适合放在产品展示页"

🤖: [component-finder 自动激活]
    → 搜索到: CardImageShatterRebuild (匹配度 90%)
    → 推荐: 方案A 直接使用 / 方案B 基于它定制

👤: "方案B，基于它定制一个命名为 CardImageGlassShatter 的新组件"

🤖: [component-scaffold 自动激活]
    → 创建 card-image/CardImageGlassShatter/
    → 生成 CardImageGlassShatter.vue (完整规范代码)
    → 生成 README.md
    → 输出 10 项自检清单
```

### 场景 2: 审查已有组件

```
👤: "帮我审查一下 CardImgAurora 的代码质量"

🤖: [animation-audit 自动激活]
    → 读取文件 → grep 扫描 → 6 维度审计
    → 输出报告: 清理 10/10, DOM引用 10/10, ST配置 9/10, 性能 8/10...
    → 指出: 粒子数量 60 略高，移动端建议减至 30

👤: "再看看它的 UI 设计怎么样"

🤖: [design-review 自动激活]
    → 分析配色/层次/节奏/微交互/响应式/一致性
    → 输出报告: 配色 10/10, 层次 10/10, 节奏 9/10...
    → 建议: 移动端 @media 断点可以更细致
```

### 场景 3: 从零到上线完整流程

```
👤: "需要一个赛博朋克风格的企业发展时间线"

🤖: [component-finder]
    → 搜索到 CardTimeNeon 匹配 85%，CardTimeLuminous 匹配 75%
    → 但都不完全满足"赛博朋克"

👤: "基于 CardTimeNeon 风格，创建 CardTimeCyber"

🤖: [component-scaffold]
    → 分析: card-time/, 赛博时间线隐喻, Canvas数据流+霓虹节点+扫描线
    → 生成完整代码

👤: "审计一下刚创建的组件"

🤖: [animation-audit]
    → 全部通过，6 维度评分 55/60

👤: "审查一下设计"

🤖: [design-review]
    → 配色 9/10 (建议增加 CRT 噪点纹理)
    → 总评 52/60
```

---

## Skill 详解

### 🔍 component-finder（组件搜索引擎）

**能力**：搜索 276 个现有组件，推荐最佳匹配

**内部逻辑**：
1. 语义提取 — 从你的描述中提取 4 个维度（类型/风格/效果/场景）
2. 三级匹配 — 目录级 → 名称级 → README级
3. 智能推荐 — 直接使用 / 组合使用 / 定制开发 三种方案

**适用时机**：
- 开发前先看看有没有现成的
- 不确定某个效果叫什么名字
- 需要找参考组件学习写法

**示例**：
```
输入: "找一个带粒子效果的科技感背景组件"
输出: → CardParticle (91%), CardCircuit (85%), CardMatrix (78%)
     → 推荐 CardParticle + CardNeon 组合使用
```

---

### 🏗️ component-scaffold（组件脚手架）

**能力**：一键生成完整动画组件（.vue + README.md）

**内部逻辑**：
1. 前置检查 — 确认目录、避免重名
2. 分析设计 — 确定视觉隐喻、层级架构、动画阶段
3. 生成代码 — 严格按照 6 大强制规范生成
4. 生成文档 — 配套 README.md
5. 自检验证 — 10 项检查清单

**强制规范**：
- ✅ ref 取 DOM，🚫 class 选择器
- ✅ cleanupFns 模式
- ✅ ScrollTrigger 黄金法则
- ✅ gsap.set 初始状态
- ✅ 100vw × 100vh
- ✅ 深色+高饱和+发光

**示例**：
```
输入: "创建一个瀑布流动的图片效果组件"
输出: → 创建 card-img/CardImgWaterfall/
     → CardImgWaterfall.vue (450行)
     → README.md (完整文档)
     → ✅ 10项自检全部通过
```

---

### 🔍 animation-audit（动画代码审计）

**能力**：6 维度深度审计 GSAP 动画代码

**审计维度**：

| 维度 | 严重度 | 检查什么 |
|------|:--:|------|
| 清理完整性 | 🔴 | cleanupFns/timeline.kill/ScrollTrigger.kill/ticker.remove/removeEventListener/cancelAnimationFrame |
| DOM 引用规范 | 🔴 | 是否用了 class 选择器（致命错误） |
| ScrollTrigger 配置 | 🟡 | start/end/scrub/pin 参数合理性 |
| 性能 | 🟡 | GPU 加速属性/will-change/Canvas 粒子数/事件节流 |
| 内存泄漏 | 🟡 | Canvas 清理/定时器/粒子数组/闭包引用 |
| 初始状态 | 🟢 | gsap.set 覆盖完整性 |

**评分标准**：
- 50-60: ✅ 生产就绪
- 35-49: ⚠️ 需修复几个问题
- <35: 🔴 需重写

**示例**：
```
输入: "审计 CardTimeBook.vue"
输出: → 6 维度评分 53/60
     → 🔴 L234: ScrollTrigger.create 未注册到 cleanupFns
     → 🟡 L156: backdrop 动画使用了 width 属性 (触发 reflow)
```

---

### 🎨 design-review（UI 设计审查）

**能力**：6 维度设计质量评估

**审查维度**：

| 维度 | 检查什么 | 标杆 |
|------|---------|------|
| 配色 | 是否灰暗/是否有强调色/渐变/发光 | CardImgAurora |
| 视觉层次 | z-index分层/景深/文字层次/视觉锚点 | CardImgAurora |
| 动画节奏 | 入场时机/stagger/时长/缓动/叙事弧线 | CardTimeBook |
| 微交互 | hover/鼠标跟随/过渡/SVG动画/进度指示 | CardTextCyber |
| 响应式 | @media断点/移动端降级/clamp()/触摸 | - |
| 一致性 | 渐变文字/发光边框/玻璃拟态/badge/divider | CardTextCyber |

**评分标准**：
- 50-60: 🏆 标杆级别
- 35-49: 👍 良好，有优化空间
- <35: 🔧 需大幅改进

**示例**：
```
输入: "审查 CardImgAurora 的 UI 设计"
输出: → 总评 56/60
     → 🎨配色 10/10: 翠绿+紫罗兰+青蓝，四层渐变，发光丰富
     → 📐层次 10/10: 五层 z-index + 两重 backdrop-filter 景深
     → ⏱️节奏 9/10: 入场→视差→色相呼吸→退场，叙事完整
     → ✨微交互 9/10: 鼠标光晕 + 极光扰动 + hover CTA
     → 📱响应式 8/10: 平板断点完善，手机可再加一个 480px
     → 🔄一致性 10/10: 渐变文字+发光边框+胶囊badge+渐变divider
```

---

## FAQ

### Q: 这些 Skill 放在哪里？

```
.claude/skills/
├── component-scaffold.md
├── animation-audit.md
├── design-review.md
├── component-finder.md
└── USAGE.md              ← 本文档
```

### Q: 需要手动注册吗？

不需要。放在 `.claude/skills/` 目录下即可被自动发现。

### Q: 每个 Skill 什么时候会被调用？

- **自动触发**：你的话匹配 Skill 的 `description` 或 `triggers` 字段时
- **手动触发**：输入 `/skill-name`
- **明确点名**：说"用 xxx 帮我..."

### Q: 可以组合使用吗？

可以。推荐工作流：

```
component-finder (找参考) → component-scaffold (生成) → animation-audit (审代码) → design-review (审设计)
```

### Q: 我需要对 Skill 内容做修改吗？

Skill 是基于项目现有规范（SKILL.md）编写的，如果项目规范发生变化，记得同步更新 Skill。

### Q: 审计发现问题后会自动修复吗？

`animation-audit` 和 `design-review` 只做诊断，不会自动修改代码。需要你确认后手动修复，或者让我基于报告做修改。

---

*文档版本: 1.0 | 适用项目: meoo-plan | 组件数: 276+*
