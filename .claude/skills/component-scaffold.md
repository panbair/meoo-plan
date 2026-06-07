---
name: component-scaffold
description: Generate a new Vue3+GSAP animation component. Use when the user wants to create a new card/image/text/3d/time/video animation component, or says "create/make/build/generate/scaffold a component" with names like CardImg/CardText/CardTime/Card3d/CardVideo/CardImage.
triggers:
  - 创建组件 / 新建组件 / 生成组件 / 脚手架
  - make a component / create a component / scaffold a component
  - CardImg / CardText / CardTime / Card3d / CardVideo / CardImage
---

# Component Scaffold — 组件脚手架

你是本项目的 GSAP 动画组件架构师。根据用户描述，一键生成完整组件。

## ⚡ 执行流程

### Step 0: 强制前置检查

```
1. ls src/views/web-list/<目标目录>/ | grep -i <组件名>  # 检查是否重名
2. 读取 src/views/web-list/SKILL.md 了解完整规范
3. 确定目录和前缀：

   需求关键词 → 目录 → 前缀
   ─────────────────────────────────
   3D+图片+空间      → card-image/ → CardImage3D
   视频+特效         → card-video/  → CardVideo
   图片+自然/光影    → card-img/    → CardImg
   文字+特效         → card-text/   → CardText
   3D+立方体/几何    → card-3d/     → Card3d
   时间线/历程       → card-time/   → CardTime
   通用卡片/粒子     → card-list/   → Card
```

### Step 1: 分析 (一句话输出)

说出：组件名、目标目录、核心隐喻、层级架构（背景/内容/装饰/粒子）

### Step 2: 创建目录

```bash
mkdir -p src/views/web-list/<目录>/<ComponentName>
```

### Step 3: 生成 .vue（必须遵守以下强制规则）

```typescript
// ══════════ 强制模板 ══════════
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void
const cleanupFns: TweenCleanup[] = []

// Props
interface Props { title?: string; subtitle?: string }
const props = withDefaults(defineProps<Props>(), { title: '', subtitle: '' })

// Refs — 每个动画元素都要有独立 ref
const rootRef = ref<HTMLElement | null>(null)

// 动画
function initAnimations() {
  if (!rootRef.value) return
  // ① gsap.set() 设置所有初始状态
  // ② timeline + ScrollTrigger
  // ③ 每个 tween/st/事件 注册到 cleanupFns
}

function nextTick(fn: () => void) { requestAnimationFrame(() => requestAnimationFrame(fn)) }

onMounted(() => nextTick(initAnimations))
onUnmounted(() => {
  cleanupFns.forEach(fn => fn()); cleanupFns.length = 0
  ScrollTrigger.getAll().forEach(st => st.kill())
})
```

**🚫 绝对禁止：** `gsap.to('.class')` / `gsap.from('.class')` / `tl.to('.class')` — 必须用 `ref.value`

**📐 ScrollTrigger 黄金法则：**
- 重要内容: `start: 'top 75%'` | 标准: `'top 80%'` | 补充: `'top 90%'`
- scrub: `1.5` | pin时: `end: '+=${n * 150}%'`

**🎨 配色：** 禁止 `#666/#888/#999/#333` → 必须深色基底+高饱和+发光

**📏 尺寸：** `100vw × 100vh`，`overflow: hidden`

### Step 4: 生成 README.md

```markdown
# ComponentName · 中文名
> 一句话描述

## 层级架构
| 层级 | 元素 | 速度系数 | 效果 |

## 动画特效
### 入场 / 展开 / 退场

## 使用方式
<ComponentName />
```

### Step 5: 10 项自检

```
□ 不重名  □ ref取DOM  □ cleanupFns完整  □ onUnmounted清理
□ ScrollTrigger参数合理  □ gsap.set初始状态  □ 100vw×100vh
□ 配色青春时尚  □ 无class选择器  □ README完整
```

## 💡 组件命名参考

好名字 = 视觉隐喻。从这些维度组合：
- 自然: Aurora, Galaxy, Nebula, Tornado, Magma, Frost, Ripple, Bloom, Cloud
- 物理: Gravity, Elastic, Prism, Spectrum, Vortex, Shatter, Rift
- 科技: Cyber, Hologram, Neon, Circuit, Matrix, Glitch, Quantum, Laser
- 材质: Crystal, Velvet, Pearl, Mercury, Titanium, Steel, Amber
- 动作: Flip, Spin, Float, Cascade, Parallax, Morph, Drift, Flow
- 空间: Wormhole, Corridor, Tunnel, Bridge, Staircase, Portal, Room, Dome

## 📋 示例

用户: "创建一个银河星空旋转的图片组件"

→ 分析: CardImgGalaxy, card-img/, 银河隐喻, 星空粒子+旋转+背景图
→ 生成: CardImgGalaxy.vue + README.md
