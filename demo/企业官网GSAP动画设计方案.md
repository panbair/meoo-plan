# 🏢 企业官网设计方案（星际未来风格）

> 基于 GSAP 动画引擎的高科技企业官网完整设计方案

---

## 目录

1. [整体视觉定位](#一整体视觉定位)
2. [页面结构详细设计](#二页面结构详细设计)
3. [全局动效系统](#三全局动效系统)
4. [技术规范总结](#四技术规范总结)
5. [GSAP 代码模板库](#五gsap代码模板库)
6. [推荐组件清单](#六推荐组件清单)

---

## 一、整体视觉定位

### 1.1 设计理念

```
融合星际宇宙的神秘感 + 科技企业的专业感 + 动态交互的沉浸感
```

本设计方案以「星际未来」为主题，打造一个具有强烈视觉冲击力和深度交互体验的高端企业官网。整体视觉语言融合深邃星空、极光流光、粒子星尘等元素，营造神秘而专业的企业氛围，让访客在浏览过程中感受到科技的力量与创新的活力。

设计灵感来源于科幻电影中的星际航行界面、量子科技展示、以及现代极简主义设计。我们希望通过动态的粒子效果、流畅的过渡动画、以及精心设计的交互反馈，让每一位访客都能留下深刻印象。

### 1.2 色彩系统

#### 主色调

| 用途 | 颜色名称 | 十六进制 | RGB 值 | 说明 |
|------|---------|---------|--------|------|
| 主色-深 | 靛蓝紫 | `#6366f1` | rgb(99, 102, 241) | 用于主要按钮、重要标题 |
| 主色-浅 | 亮紫色 | `#8b5cf6` | rgb(139, 92, 246) | 渐变过渡、悬停状态 |
| 辅色-深 | 深青 | `#06b6d4` | rgb(6, 182, 212) | 次要强调、图标 |
| 辅色-浅 | 亮青 | `#22d3ee` | rgb(34, 211, 238) | 高亮、进度条 |
| 强调色-深 | 玫红 | `#f43f5e` | rgb(244, 63, 94) | 重要提示、警示 |
| 强调色-浅 | 橙色 | `#fb923c` | rgb(251, 146, 60) | 热力区域、渐变过渡 |

#### 背景色系

| 用途 | 颜色名称 | 十六进制 | 使用场景 |
|------|---------|---------|---------|
| 深空黑 | Deep Space | `#0a0a1a` | 主背景、导航栏 |
| 星空蓝 | Star Blue | `#1a1a3a` | 渐变过渡、卡片背景 |
| 暗紫 | Dark Purple | `#1e1b4b` | 分区背景、页脚 |
| 深海蓝 | Ocean Blue | `#0f172a` | 区块背景 |

#### 文字色系

| 用途 | 颜色名称 | 十六进制 | 说明 |
|------|---------|---------|------|
| 主文字 | 纯白 | `#f8fafc` | 标题、重要文字 |
| 辅文字 | 银灰 | `#94a3b8` | 正文、次要信息 |
| 弱文字 | 深灰 | `#64748b` | 辅助说明、占位符 |
| 链接文字 | 天蓝 | `#38bdf8` | 超链接、交互元素 |

#### 功能色

| 用途 | 颜色 | 说明 |
|------|------|------|
| 成功 | `#10b981` | 成功提示、完成状态 |
| 警告 | `#f59e0b` | 警告提示 |
| 错误 | `#ef4444` | 错误提示、必填标识 |
| 信息 | `#3b82f6` | 信息提示 |

#### 渐变配方

```css
/* 主渐变 - 用于按钮、卡片背景 */
background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);

/* 背景渐变 - 用于区块背景 */
background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 50%, #0f172a 100%);

/* 光晕渐变 - 用于发光效果 */
background: radial-gradient(circle at center, rgba(99, 102, 241, 0.3), transparent 70%);

/* 霓虹渐变 - 用于文字发光 */
background: linear-gradient(90deg, #f43f5e, #8b5cf6, #06b6d4);
```

### 1.3 字体系统

#### 字体族定义

```css
/* 中文优先 */
font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* 英文标题 */
font-family: 'Outfit', 'Poppins', 'Inter', sans-serif;

/* 正文 */
font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;

/* 代码/数字 */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

#### 字体规格

| 层级 | 字号 | 行高 | 字重 | 使用场景 |
|------|------|------|------|---------|
| H1 | clamp(2.5rem, 5vw, 4rem) | 1.1 | 800 (ExtraBold) | 主标题、Hero |
| H2 | clamp(2rem, 4vw, 3rem) | 1.2 | 700 (Bold) | 区块标题 |
| H3 | clamp(1.5rem, 3vw, 2rem) | 1.3 | 600 (SemiBold) | 卡片标题 |
| H4 | clamp(1.25rem, 2vw, 1.5rem) | 1.4 | 600 | 小标题 |
| Body | 1rem (16px) | 1.6 | 400 (Regular) | 正文内容 |
| Small | 0.875rem (14px) | 1.5 | 400 | 辅助说明 |
| Caption | 0.75rem (12px) | 1.4 | 500 | 标签、注释 |

### 1.4 间距系统

```css
:root {
  /* 基础间距单位 */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
  --space-4xl: 6rem;     /* 96px */
  --space-5xl: 8rem;     /* 128px */
  
  /* 容器宽度 */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

---

## 二、页面结构详细设计

### 📌 模块一：导航栏 (Navigation)

#### 布局结构

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  [Logo]         首页         关于我们         服务         案例         团队         联系我们         [CTA按钮: 立即咨询]  │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### 设计规格

| 元素 | 样式 | 尺寸 |
|------|------|------|
| Logo | 高度 40px，白色主题 | 宽度自适应，最大 150px |
| 导航链接 | 字号 15px，字重 500 | 左右间距 32px |
| CTA 按钮 | 圆角 8px，内边距 12px 24px | 最小宽度 120px |

#### 状态设计

**默认状态：**
- 背景：透明
- Logo：白色
- 链接文字：`#f8fafc`，无下划线
- CTA 按钮：渐变背景，白色文字

**滚动后状态（滚动 >100px）：**
- 背景：`rgba(10, 10, 26, 0.95)`
- 模糊效果：`backdrop-filter: blur(20px)`
- 边框底部：`1px solid rgba(99, 102, 241, 0.2)`
- 阴影：`0 4px 30px rgba(0, 0, 0, 0.3)`

#### GSAP 动画效果

| 动画阶段 | 触发时机 | 效果描述 | GSAP 参数 |
|---------|---------|---------|-----------|
| 入场动画 | 页面加载 | Logo 从左侧滑入 + 透明度渐显 | `x: -50, opacity: 0 → 1, duration: 0.8, ease: back.out(1.7)` |
| 入场动画 | 页面加载 | 导航链接依次淡入 | `opacity: 0 → 1, stagger: 0.1s, duration: 0.6` |
| 悬停效果 | 鼠标移入 | 链接下划线从中心向两侧展开 | `scaleX: 0 → 1, duration: 0.3, ease: power2.out` |
| 悬停效果 | 鼠标移入 | 文字颜色渐变为 `#6366f1` | `color: #6366f1, duration: 0.3` |
| CTA按钮 | 鼠标移入 | 背景光晕脉冲 + 轻微放大 | `scale: 1 → 1.05, boxShadow 增强, duration: 0.3` |
| 滚动效果 | 滚动 >100px | 导航栏背景模糊过渡 | `backdropFilter: blur(0) → blur(20px), duration: 0.3` |

#### GSAP 代码实现

```javascript
// ========================================
// 导航栏入场动画
// ========================================

// Logo 入场
gsap.from('.nav-logo', {
  x: -50,
  opacity: 0,
  duration: 0.8,
  ease: 'back.out(1.7)'
})

// 导航链接依次入场
gsap.from('.nav-link', {
  y: -20,
  opacity: 0,
  stagger: 0.1,
  duration: 0.6,
  ease: 'back.out(1.7)',
  delay: 0.2
})

// CTA 按钮入场
gsap.from('.nav-cta-btn', {
  scale: 0.8,
  opacity: 0,
  duration: 0.6,
  ease: 'back.out(2)',
  delay: 0.5
})

// ========================================
// 导航链接悬停效果
// ========================================

document.querySelectorAll('.nav-link').forEach(link => {
  // 创建下划线元素
  const underline = document.createElement('span')
  underline.className = 'nav-link-underline'
  link.appendChild(underline)
  
  link.addEventListener('mouseenter', () => {
    gsap.to(underline, {
      scaleX: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(link, {
      color: '#6366f1',
      duration: 0.3
    })
  })
  
  link.addEventListener('mouseleave', () => {
    gsap.to(underline, {
      scaleX: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(link, {
      color: '#f8fafc',
      duration: 0.3
    })
  })
})

// ========================================
// CTA 按钮动画
// ========================================

const ctaBtn = document.querySelector('.nav-cta-btn')

ctaBtn.addEventListener('mouseenter', () => {
  gsap.to(ctaBtn, {
    scale: 1.05,
    boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)',
    duration: 0.3,
    ease: 'power2.out'
  })
})

ctaBtn.addEventListener('mouseleave', () => {
  gsap.to(ctaBtn, {
    scale: 1,
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
    duration: 0.3,
    ease: 'power2.out'
  })
})

ctaBtn.addEventListener('mousedown', () => {
  gsap.to(ctaBtn, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.in'
  })
})

ctaBtn.addEventListener('mouseup', () => {
  gsap.to(ctaBtn, {
    scale: 1.05,
    duration: 0.2,
    ease: 'elastic.out(1, 0.5)'
  })
})

// ========================================
// 滚动时导航栏状态变化
// ========================================

ScrollTrigger.create({
  start: 100,
  onUpdate: (self) => {
    const progress = self.progress
    
    // 背景和模糊
    gsap.to('.navbar', {
      backgroundColor: progress > 0 ? 'rgba(10, 10, 26, 0.95)' : 'transparent',
      duration: 0.3
    })
    
    gsap.to('.navbar', {
      backdropFilter: progress > 0 ? 'blur(20px)' : 'blur(0)',
      duration: 0.3
    })
    
    // 边框
    gsap.to('.navbar', {
      borderBottomColor: progress > 0 ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
      duration: 0.3
    })
  }
})
```

#### CSS 样式

```css
.nav-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 0;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.nav-container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  position: relative;
  color: #f8fafc;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.3s ease;
}

.nav-link-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #06b6d4);
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  border-radius: 2px;
}

.nav-cta-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #f8fafc;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  cursor: pointer;
  border: none;
}

.nav-cta-btn:hover {
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.6);
}

/* 滚动后样式 */
.nav-wrapper.scrolled {
  background-color: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}
```

---

### 📌 模块二：Hero 首屏区

#### 完整布局

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                              [动态粒子/极光背景 - 全屏]                                │
│                              [透视网格线背景]                                         │
│                              [漂浮光斑装饰]                                            │
│                                                                                       │
│                                                                                       │
│                    ╔═══════════════════════════════════════╗                        │
│                    ║                                       ║                        │
│                    ║           引 领 数 字 化 转 型        ║                        │
│                    ║              的 下 一 个 十 年          ║                        │
│                    ║                                       ║                        │
│                    ╚═══════════════════════════════════════╝                        │
│                                                                                       │
│                         我们是一家专注于创新的科技企业                                  │
│                         致力于为客户提供最优质的数字化解决方案                          │
│                                                                                       │
│               ┌────────────────┐  ┌────────────────┐  ┌────────────────┐               │
│               │    了解更多    │  │   观看视频     │  │   联系我们     │               │
│               └────────────────┘  └────────────────┘  └────────────────┘               │
│                                                                                       │
│                                                                                       │
│                                  ▼                                                    │
│                            向下滚动                           │
│                          [弹跳箭头动画]                                               │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### 背景层设计（多层叠加）

| 层级 | 元素 | 动画效果 | 参数 |
|------|------|---------|------|
| L0 | 渐变背景 | 静态 | `linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0f172a 100%)` |
| L1 | 粒子系统 | 随机漂浮 | 200个粒子，duration: 0.5-2s，ease: sine.inOut |
| L2 | 极光效果 | 色相旋转 | `hue-rotate(0 → 360deg)`，duration: 20s，repeat: -1 |
| L3 | 透视网格 | 向上移动 | `translateY(0 → -50%)`，duration: 10s，repeat: -1 |
| L4 | 光斑 | 随机漂移 | 3-5个大型模糊圆形，duration: 8-15s |
| L5 | 噪点纹理 | 轻微闪烁 | opacity: 0.02-0.05，duration: 0.1s |

#### GSAP 动画实现

```javascript
// ========================================
// Hero 背景粒子系统
// ========================================

// 生成 200 个粒子
const particlesContainer = document.querySelector('.hero-particles')
for (let i = 0; i < 200; i++) {
  const particle = document.createElement('div')
  particle.className = 'hero-particle'
  particle.style.cssText = `
    position: absolute;
    width: ${Math.random() * 4 + 1}px;
    height: ${Math.random() * 4 + 1}px;
    background: rgba(${255}, ${255}, ${255}, ${Math.random() * 0.5 + 0.2});
    border-radius: 50%;
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
  `
  particlesContainer.appendChild(particle)
}

// 粒子入场动画
gsap.from('.hero-particle', {
  scale: 0,
  opacity: 0,
  duration: 1,
  stagger: {
    amount: 2,
    from: 'random'
  },
  ease: 'power2.out'
})

// 粒子持续漂浮动画
gsap.utils.toArray('.hero-particle').forEach((particle, i) => {
  gsap.to(particle, {
    y: `random(-100, 100)`,
    x: `random(-50, 50)`,
    duration: `random(3, 8)`,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    delay: Math.random() * 2
  })
})

// ========================================
// 极光背景动画
// ========================================

gsap.to('.hero-aurora', {
  backgroundPosition: '100% 100%',
  duration: 20,
  repeat: -1,
  ease: 'none',
  onRepeat: () => {
    gsap.set('.hero-aurora', { backgroundPosition: '0% 0%' })
  }
})

// 色相旋转效果
gsap.to('.hero-aurora', {
  filter: 'hue-rotate(360deg)',
  duration: 30,
  repeat: -1,
  ease: 'none'
})

// ========================================
// 透视网格动画
// ========================================

gsap.to('.hero-grid', {
  backgroundPosition: '0 -50%',
  duration: 10,
  repeat: -1,
  ease: 'none'
})

// ========================================
// 光斑漂移动画
// ========================================

const glowSpots = [
  { class: '.hero-glow-1', x: 100, y: 50, scale: 1.2, duration: 8 },
  { class: '.hero-glow-2', x: -80, y: -60, scale: 1.3, duration: 12 },
  { class: '.hero-glow-3', x: 50, y: 100, scale: 1.1, duration: 10 }
]

glowSpots.forEach(spot => {
  gsap.to(spot.class, {
    x: spot.x,
    y: spot.y,
    scale: spot.scale,
    duration: spot.duration,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  })
})

// ========================================
// 标题文字动画
// ========================================

// 分割标题文字
const titleText = '引领数字化转型的下一个十年'
const titleChars = titleText.split('').map(char => {
  if (char === ' ') return '<span class="title-space">&nbsp;</span>'
  return `<span class="hero-title-char">${char}</span>`
}).join('')
document.querySelector('.hero-title').innerHTML = titleChars

// 字符入场动画
gsap.from('.hero-title-char', {
  y: 100,
  opacity: 0,
  rotationY: -90,
  stagger: 0.03,
  duration: 1,
  ease: 'back.out(1.7)',
  delay: 0.5
})

// 字符持续浮动
gsap.to('.hero-title-char', {
  y: 'random(-5, 5)',
  duration: 'random(2, 4)',
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut',
  stagger: {
    amount: 1,
    from: 'random'
  }
})

// ========================================
// 副标题淡入动画
// ========================================

gsap.from('.hero-subtitle', {
  y: 50,
  opacity: 0,
  duration: 1,
  delay: 1.2,
  ease: 'power3.out'
})

gsap.from('.hero-subtitle-line', {
  width: 0,
  duration: 1.5,
  delay: 1.5,
  ease: 'power2.out'
})

// ========================================
// CTA 按钮组入场
// ========================================

gsap.from('.hero-cta-btn', {
  y: 30,
  opacity: 0,
  scale: 0.8,
  stagger: 0.15,
  duration: 0.8,
  delay: 1.5,
  ease: 'back.out(2)'
})

// ========================================
// 滚动指示器弹跳动画
// ========================================

gsap.to('.scroll-indicator', {
  y: 15,
  duration: 1,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut'
})

gsap.to('.scroll-indicator .arrow', {
  opacity: 0.5,
  duration: 0.5,
  repeat: -1,
  yoyo: true
})

// ========================================
// 鼠标移动视差效果
// ========================================

document.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 2
  
  gsap.to('.hero-title', {
    x: mouseX * 20,
    y: mouseY * 10,
    duration: 1,
    ease: 'power2.out'
  })
  
  gsap.to('.hero-glow-1', {
    x: mouseX * 50,
    y: mouseY * 30,
    duration: 2,
    ease: 'power2.out'
  })
})
```

#### CSS 样式

```css
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0f172a 100%);
}

/* 背景层 */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-aurora {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 60%);
  filter: hue-rotate(0deg);
}

.hero-grid {
  position: absolute;
  width: 100%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center top;
  opacity: 0.5;
}

.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
}

.hero-glow-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent 70%);
  top: -200px;
  right: -100px;
}

.hero-glow-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%);
  bottom: -150px;
  left: -100px;
}

.hero-glow-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent 70%);
  top: 50%;
  left: 30%;
}

/* 内容层 */
.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 900px;
  padding: 0 24px;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #f8fafc;
  text-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
}

.hero-title-char {
  display: inline-block;
  transition: transform 0.3s ease;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #94a3b8;
  line-height: 1.8;
  margin-bottom: 16px;
}

.hero-subtitle-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #06b6d4);
  margin: 0 auto 40px;
  border-radius: 3px;
}

/* CTA 按钮组 */
.hero-cta-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 80px;
}

.hero-cta-btn {
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hero-cta-btn.primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #f8fafc;
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
}

.hero-cta-btn.primary:hover {
  box-shadow: 0 0 50px rgba(99, 102, 241, 0.6);
  transform: translateY(-2px);
}

.hero-cta-btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.hero-cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #6366f1;
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 0.875rem;
}

.scroll-indicator .arrow {
  width: 24px;
  height: 24px;
  border-right: 2px solid #6366f1;
  border-bottom: 2px solid #6366f1;
  transform: rotate(45deg);
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: rotate(45deg) translateY(0); }
  50% { transform: rotate(45deg) translateY(10px); }
}
```

---

### 📌 模块三：关于我们 (About Us)

#### 布局结构

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                              关于 我们                                                 │
│                              ─────────                                               │
│                                                                                       │
│   ┌──────────────────────┐      ┌─────────────────────────────────────────────┐     │
│   │                      │      │                                             │     │
│   │                      │      │   我们是一家专注于创新的科技企业              │     │
│   │    [3D 旋转          │      │   致力于为客户 提供最优质的数字化解决方案      │     │
│   │     图形/图像]       │      │                                             │     │
│   │                      │      │   ─────────────────────────────────        │     │
│   │                      │      │                                             │     │
│   │                      │      │   ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░  78%  创新         │     │
│   │                      │      │   ▓▓▓▓▓▓░░░░░░░░░░░░░░░  65%  专业        │     │
│   │                      │      │   ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░  90%  服务         │     │
│   │                      │      │   ▓▓▓▓▓▓▓░░░░░░░░░░░░░░  70%  效率        │     │
│   └──────────────────────┘      └─────────────────────────────────────────────┘     │
│                                                                                       │
│                              ┌───────┬───────┬───────┬───────┐                       │
│                              │ 500+  │  98%  │  200+ │  50+  │                       │
│                              │ 项目  │ 满意  │ 客户  │ 奖项  │                       │
│                              │[环形] │[环形] │[环形] │[环形] │                       │
│                              └───────┴───────┴───────┴───────┘                       │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### GSAP 动画实现

```javascript
// ========================================
// 关于我们区块入场动画
// ========================================

// 标题入场
gsap.from('.about-title', {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.about-section',
    start: 'top 80%'
  }
})

// 3D 图形旋转入场
gsap.from('.about-visual', {
  x: -100,
  opacity: 0,
  rotateY: -30,
  duration: 1.2,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.about-section',
    start: 'top 75%'
  }
})

// 3D 图形持续旋转
gsap.to('.about-3d-shape', {
  rotateY: 360,
  duration: 20,
  repeat: -1,
  ease: 'none'
})

gsap.to('.about-3d-shape', {
  rotateX: 360,
  duration: 15,
  repeat: -1,
  ease: 'none'
})

// 文字内容入场
gsap.from('.about-text-content', {
  x: 100,
  opacity: 0,
  duration: 1.2,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.about-section',
    start: 'top 70%'
  }
})

// ========================================
// 技能进度条动画
// ========================================

const skillBars = document.querySelectorAll('.skill-bar-fill')

skillBars.forEach((bar, index) => {
  const targetWidth = bar.dataset.percent || 0
  
  gsap.from(bar, {
    width: 0,
    duration: 1.5,
    delay: index * 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.skills-section',
      start: 'top 75%'
    }
  })
  
  // 进度条发光脉冲
  gsap.to(bar, {
    boxShadow: '0 0 20px currentColor',
    duration: 1,
    repeat: -1,
    yoyo: true,
    delay: index * 0.3
  })
})

// ========================================
// 数字计数器动画
// ========================================

const counters = document.querySelectorAll('.counter-value')

counters.forEach(counter => {
  const target = parseInt(counter.dataset.target || '0')
  const suffix = counter.dataset.suffix || ''
  const prefix = counter.dataset.prefix || ''
  
  ScrollTrigger.create({
    trigger: counter,
    start: 'top 85%',
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          counter.textContent = prefix + Math.round(this.targets()[0].val) + suffix
        }
      })
    },
    once: true
  })
})

// ========================================
// 环形进度动画
// ========================================

const statRings = document.querySelectorAll('.stat-ring')

statRings.forEach((ring, index) => {
  const percentage = parseInt(ring.dataset.percent || '0')
  const circle = ring.querySelector('circle.progress')
  const circumference = 2 * Math.PI * 45
  
  // 设置初始状态
  gsap.set(circle, {
    strokeDasharray: circumference,
    strokeDashoffset: circumference
  })
  
  // 动画
  gsap.to(circle, {
    strokeDashoffset: circumference - (circumference * percentage / 100),
    duration: 2,
    delay: index * 0.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.stats-section',
      start: 'top 75%'
    }
  })
  
  // 数字计数
  const numEl = ring.querySelector('.stat-number')
  gsap.to({ val: 0 }, {
    val: percentage,
    duration: 2,
    delay: index * 0.2,
    ease: 'power2.out',
    onUpdate: function() {
      numEl.textContent = Math.round(this.targets()[0].val) + '%'
    },
    scrollTrigger: {
      trigger: '.stats-section',
      start: 'top 75%'
    }
  })
})

// ========================================
// 数字卡片入场动画
// ========================================

gsap.from('.stat-card', {
  y: 80,
  opacity: 0,
  scale: 0.8,
  stagger: 0.15,
  duration: 0.8,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.stats-grid',
    start: 'top 80%'
  }
})

// 卡片悬停效果
document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      y: -10,
      boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)',
      duration: 0.3
    })
  })
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      y: 0,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      duration: 0.3
    })
  })
})
```

#### CSS 样式

```css
.about-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 100%);
  position: relative;
  overflow: hidden;
}

.about-container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  text-align: center;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 60px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #06b6d4);
  border-radius: 2px;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 80px;
}

/* 3D 视觉区域 */
.about-visual {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.about-3d-shape {
  width: 200px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
}

.shape-face {
  position: absolute;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(6, 182, 212, 0.3));
  border: 1px solid rgba(99, 102, 241, 0.5);
  backdrop-filter: blur(10px);
}

.shape-face.front { transform: translateZ(100px); }
.shape-face.back { transform: rotateY(180deg) translateZ(100px); }
.shape-face.left { transform: rotateY(-90deg) translateZ(100px); }
.shape-face.right { transform: rotateY(90deg) translateZ(100px); }
.shape-face.top { transform: rotateX(90deg) translateZ(100px); }
.shape-face.bottom { transform: rotateX(-90deg) translateZ(100px); }

/* 文字内容区域 */
.about-text-content h3 {
  font-size: 1.5rem;
  color: #f8fafc;
  margin-bottom: 20px;
}

.about-text-content p {
  color: #94a3b8;
  line-height: 1.8;
  margin-bottom: 30px;
}

/* 技能进度条 */
.skill-item {
  margin-bottom: 20px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.skill-name {
  color: #f8fafc;
  font-weight: 500;
}

.skill-percent {
  color: #6366f1;
  font-weight: 600;
}

.skill-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #06b6d4);
  border-radius: 4px;
  position: relative;
}

/* 统计数据区域 */
.stats-section {
  padding: 80px 0;
  background: rgba(99, 102, 241, 0.05);
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.stat-card {
  text-align: center;
  padding: 30px 20px;
  background: rgba(10, 10, 26, 0.8);
  border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}

.stat-ring {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  position: relative;
}

.stat-ring svg {
  transform: rotate(-90deg);
}

.stat-ring circle {
  fill: none;
  stroke-width: 8;
}

.stat-ring .bg {
  stroke: rgba(255, 255, 255, 0.1);
}

.stat-ring .progress {
  stroke: url(#gradient);
  stroke-linecap: round;
}

.stat-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
}

.stat-label {
  font-size: 1rem;
  color: #94a3b8;
}

/* 响应式 */
@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 📌 模块四：核心服务 (Services)

#### 布局结构 - 卡片网格

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                              我们的核心服务                                            │
│                              ─────────────                                           │
│                                                                                       │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│   │      🌐      │  │      📊      │  │      🔒      │  │      🚀      │                │
│   │              │  │              │  │              │  │              │                │
│   │   云服务      │  │   大数据分析 │  │   安全解决方案│  │   智能运维    │                │
│   │              │  │              │  │              │  │              │                │
│   │   提供稳定    │  │   深度挖掘   │  │   全方位防护  │  │   AI驱动的   │                │
│   │   高效云      │  │   数据价值   │  │   保障业务    │  │   自动化运维  │                │
│   │   解决方案    │  │   辅助决策   │  │   安全        │  │   服务        │                │
│   │              │  │              │  │              │  │              │                │
│   │  [了解更多 →] │  │  [了解更多 →] │  │  [了解更多 →] │  │  [了解更多 →] │                │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                                       │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│   │      🎨      │  │      📱      │  │      🤖      │  │      📡      │                │
│   │              │  │              │  │              │  │              │                │
│   │   UI/UX设计  │  │   移动开发   │  │   AI应用     │  │   物联网解决方案│               │
│   │              │  │              │  │              │  │              │                │
│   │   用户体验   │  │   iOS/Android│  │   机器学习   │  │   智能设备   │                │
│   │   视觉设计   │  │   跨平台开发  │  │   深度学习   │  │   连接管理   │                │
│   │              │  │              │  │              │  │              │                │
│   │  [了解更多 →] │  │  [了解更多 →] │  │  [了解更多 →] │  │  [了解更多 →] │                │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### GSAP 动画实现

```javascript
// ========================================
// 服务卡片入场动画
// ========================================

gsap.from('.service-card', {
  y: 80,
  opacity: 0,
  scale: 0.9,
  stagger: {
    amount: 0.8,
    from: 'start'
  },
  duration: 0.8,
  ease: 'back.out(1.4)',
  scrollTrigger: {
    trigger: '.services-grid',
    start: 'top 75%'
  }
})

// ========================================
// 卡片 3D 倾斜效果
// ========================================

document.querySelectorAll('.service-card').forEach(card => {
  const inner = card.querySelector('.card-inner')
  
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15
    
    gsap.to(inner, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000
    })
  })
  
  card.addEventListener('mouseleave', () => {
    gsap.to(inner, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    })
  })
})

// ========================================
// 卡片悬停效果
// ========================================

document.querySelectorAll('.service-card').forEach(card => {
  const icon = card.querySelector('.service-icon')
  const overlay = card.querySelector('.card-overlay')
  const link = card.querySelector('.service-link')
  
  card.addEventListener('mouseenter', () => {
    // 图标放大
    gsap.to(icon, {
      scale: 1.2,
      color: '#6366f1',
      duration: 0.3,
      ease: 'back.out(2)'
    })
    
    // 遮罩显现
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.3
    })
    
    // 边框发光
    gsap.to(card, {
      borderColor: 'rgba(99, 102, 241, 0.5)',
      boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
      duration: 0.3
    })
    
    // 链接箭头移动
    gsap.to(link.querySelector('span'), {
      x: 5,
      duration: 0.3
    })
  })
  
  card.addEventListener('mouseleave', () => {
    gsap.to(icon, {
      scale: 1,
      color: '#06b6d4',
      duration: 0.3
    })
    
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3
    })
    
    gsap.to(card, {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: 'none',
      duration: 0.3
    })
    
    gsap.to(link.querySelector('span'), {
      x: 0,
      duration: 0.3
    })
  })
})

// ========================================
// 光泽扫过效果
// ========================================

document.querySelectorAll('.service-card').forEach(card => {
  const shine = document.createElement('div')
  shine.className = 'card-shine'
  card.appendChild(shine)
  
  card.addEventListener('mouseenter', () => {
    gsap.fromTo(shine,
      { left: '-100%' },
      {
        left: '100%',
        duration: 0.6,
        ease: 'power2.inOut'
      }
    )
  })
})

// ========================================
// 数字/图标动画
// ========================================

gsap.utils.toArray('.service-number').forEach((num, i) => {
  gsap.from(num, {
    textContent: 0,
    duration: 2,
    ease: 'power2.out',
    snap: { textContent: 1 },
    scrollTrigger: {
      trigger: num,
      start: 'top 80%'
    }
  })
})
```

#### CSS 样式

```css
.services-section {
  padding: 120px 0;
  background: #0a0a1a;
  position: relative;
}

.services-container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 24px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 60px;
}

.service-card {
  position: relative;
  background: rgba(26, 26, 58, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-card:hover::before {
  opacity: 1;
}

.card-inner {
  position: relative;
  z-index: 1;
  transform-style: preserve-3d;
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  pointer-events: none;
}

.service-icon {
  font-size: 3rem;
  color: #06b6d4;
  margin-bottom: 24px;
  display: block;
  transition: all 0.3s ease;
}

.service-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 16px;
}

.service-desc {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
}

.service-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6366f1;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.service-link span {
  display: inline-block;
  transition: transform 0.3s ease;
}

.service-link::after {
  content: '→';
  transition: transform 0.3s ease;
}

.service-card:hover .service-link {
  color: #8b5cf6;
}

/* 响应式 */
@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 📌 模块五：产品展示 / 案例 (Portfolio)

#### 布局 - 水平滚动画廊

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                              项 目 案 例                                              │
│                              ────────                                                │
│                                                                                       │
│  ════════════════════════════════════════════════════════════════════════════════   │
│  │                                                                                  │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │   │
│  │  │                │  │                │  │                │  │                │  │   │
│  │  │    [项目图片]   │  │    [项目图片]   │  │    [项目图片]   │  │    [项目图片]   │  │   │
│  │  │   [模糊→清晰]   │  │   [模糊→清晰]   │  │   [模糊→清晰]   │  │   [模糊→清晰]   │  │   │
│  │  │                │  │                │  │                │  │                │  │   │
│  │  ├────────────────┤  ├────────────────┤  ├────────────────┤  ├────────────────┤  │   │
│  │  │   项目标题 01   │  │   项目标题 02   │  │   项目标题 03   │  │   项目标题 04   │  │   │
│  │  │   品牌设计      │  │   电商平台      │  │   移动应用      │  │   SaaS系统     │  │   │
│  │  │                │  │                │  │                │  │                │  │   │
│  │  │   查看详情  →   │  │   查看详情  →   │  │   查看详情  →   │  │   查看详情  →   │  │   │
│  │  └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘  │   │
│  │                                                                                  │   │
│  ════════════════════════════════════════════════════════════════════════════════   │
│                                                                                       │
│                              [进度条 ████████░░░░░░░░░░░░]                          │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### GSAP 动画实现

```javascript
// ========================================
// 水平滚动效果
// ========================================

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const portfolioSections = gsap.utils.toArray('.portfolio-item')
const portfolioContainer = document.querySelector('.portfolio-container')

// 计算总滚动距离
const totalWidth = portfolioSections.length * 100

gsap.to(portfolioSections, {
  xPercent: -100 * (portfolioSections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: portfolioContainer,
    pin: true,
    scrub: 1,
    snap: 1 / (portfolioSections.length - 1),
    end: () => '+=' + (portfolioContainer.offsetWidth * (portfolioSections.length - 1))
  }
})

// ========================================
// 图片视差效果
// ========================================

portfolioSections.forEach((section, i) => {
  const img = section.querySelector('.portfolio-img')
  
  gsap.fromTo(img,
    { scale: 1.5 },
    {
      scale: 1,
      scrollTrigger: {
        trigger: section,
        containerAnimation: ScrollTrigger.getAll()[0].animation,
        start: 'left right',
        end: 'right left',
        scrub: true
      }
    }
  )
})

// ========================================
// 图片模糊揭示动画
// ========================================

gsap.utils.toArray('.portfolio-card').forEach(card => {
  const img = card.querySelector('.portfolio-img')
  const overlay = card.querySelector('.portfolio-overlay')
  const content = card.querySelector('.portfolio-content')
  
  // 图片揭示
  gsap.fromTo(img,
    { filter: 'blur(20px)', scale: 1.2 },
    {
      filter: 'blur(0px)',
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  )
  
  // 遮罩滑出
  gsap.fromTo(overlay,
    { x: '-100%', opacity: 1 },
    {
      x: '0%',
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: card,
        start: 'top 70%'
      }
    }
  )
  
  // 内容入场
  gsap.from(content, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    delay: 0.3,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 60%'
    }
  })
})

// ========================================
// 进度条指示器
// ========================================

ScrollTrigger.create({
  trigger: portfolioContainer,
  start: 'top top',
  end: () => '+=' + (portfolioContainer.offsetWidth * (portfolioSections.length - 1)),
  onUpdate: (self) => {
    gsap.to('.portfolio-progress-bar', {
      scaleX: self.progress,
      transformOrigin: 'left center',
      duration: 0.1
    })
    
    document.querySelector('.portfolio-progress-text').textContent = 
      Math.round(self.progress * 100) + '%'
  }
})

// ========================================
// 卡片悬停效果
// ========================================

document.querySelectorAll('.portfolio-card').forEach(card => {
  const img = card.querySelector('.portfolio-img')
  
  card.addEventListener('mouseenter', () => {
    gsap.to(img, {
      scale: 1.1,
      duration: 0.5,
      ease: 'power2.out'
    })
  })
  
  card.addEventListener('mouseleave', () => {
    gsap.to(img, {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
  })
})
```

#### CSS 样式

```css
.portfolio-section {
  position: relative;
  background: #0a0a1a;
  overflow: hidden;
}

.portfolio-container {
  display: flex;
  width: fit-content;
}

.portfolio-item {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5vw;
  box-sizing: border-box;
}

.portfolio-card {
  position: relative;
  width: 400px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
}

.portfolio-img-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.portfolio-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(0);
}

.portfolio-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(10, 10, 26, 0.9) 100%
  );
}

.portfolio-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
}

.portfolio-category {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(99, 102, 241, 0.2);
  color: #6366f1;
  border-radius: 20px;
  font-size: 0.875rem;
  margin-bottom: 12px;
}

.portfolio-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 12px;
}

.portfolio-desc {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.portfolio-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #06b6d4;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.portfolio-link:hover {
  color: #22d3ee;
  gap: 12px;
}

/* 进度条 */
.portfolio-progress {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  z-index: 100;
}

.portfolio-progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.portfolio-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #06b6d4);
  transform-origin: left;
  transform: scaleX(0);
}

.portfolio-progress-text {
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 8px;
}
```

---

### 📌 模块六：团队成员 (Team)

#### 布局 - 卡片翻转

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                              核 心 团 队                                              │
│                              ────────                                                │
│                                                                                       │
│   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐      │
│   │                │  │                │  │                │  │                │      │
│   │   [头像照片]    │  │   [头像照片]    │  │   [头像照片]    │  │   [头像照片]    │      │
│   │                │  │                │  │                │  │                │      │
│   │   [翻转显示]    │  │   [翻转显示]    │  │   [翻转显示]    │  │   [翻转显示]    │      │
│   │   [联系方式]    │  │   [联系方式]    │  │   [联系方式]    │  │   [联系方式]    │      │
│   │                │  │                │  │                │  │                │      │
│   ├────────────────┤  ├────────────────┤  ├────────────────┤  ├────────────────┤      │
│   │    张三         │  │    李四         │  │    王五         │  │    赵六         │      │
│   │    CEO         │  │    CTO         │  │    设计总监     │  │    运营总监     │      │
│   │  [社交图标]    │  │  [社交图标]    │  │  [社交图标]    │  │  [社交图标]    │      │
│   └────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘      │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### GSAP 动画实现

```javascript
// ========================================
// 团队卡片入场动画
// ========================================

gsap.from('.team-card', {
  y: 100,
  opacity: 0,
  scale: 0.8,
  stagger: 0.15,
  duration: 1,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.team-grid',
    start: 'top 75%'
  }
})

// ========================================
// 卡片 3D 翻转效果
// ========================================

document.querySelectorAll('.team-card').forEach(card => {
  const front = card.querySelector('.card-front')
  const back = card.querySelector('.card-back')
  
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      rotateY: 180,
      duration: 0.6,
      ease: 'power2.inOut'
    })
  })
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    })
  })
})

// ========================================
// 头像悬浮效果
// ========================================

document.querySelectorAll('.team-avatar').forEach(avatar => {
  avatar.addEventListener('mouseenter', () => {
    gsap.to(avatar, {
      scale: 1.1,
      boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
      duration: 0.3
    })
  })
  
  avatar.addEventListener('mouseleave', () => {
    gsap.to(avatar, {
      scale: 1,
      boxShadow: 'none',
      duration: 0.3
    })
  })
})

// ========================================
// 社交图标动画
// ========================================

document.querySelectorAll('.team-social a').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    gsap.to(icon, {
      y: -5,
      color: '#6366f1',
      duration: 0.3
    })
  })
  
  icon.addEventListener('mouseleave', () => {
    gsap.to(icon, {
      y: 0,
      color: '#94a3b8',
      duration: 0.3
    })
  })
})
```

#### CSS 样式

```css
.team-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #1a1a3a 0%, #0a0a1a 100%);
}

.team-container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 24px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 60px;
}

.team-card {
  position: relative;
  height: 380px;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  overflow: hidden;
}

.card-front {
  background: rgba(26, 26, 58, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 30px;
}

.card-back {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
}

.team-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 24px;
  border: 3px solid rgba(99, 102, 241, 0.5);
  transition: all 0.3s ease;
}

.team-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 8px;
}

.team-role {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.team-social {
  display: flex;
  gap: 16px;
}

.team-social a {
  color: #94a3b8;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.team-social a:hover {
  color: #6366f1;
}

.card-back-content {
  text-align: center;
  color: #f8fafc;
}

.card-back-content h4 {
  font-size: 1.25rem;
  margin-bottom: 16px;
}

.card-back-content p {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 24px;
  opacity: 0.9;
}

/* 响应式 */
@media (max-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}
```

---

### 📌 模块七：客户评价 (Testimonials)

#### 布局 - 轮播卡片

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                              客 户 评 价                                              │
│                              ────────                                                │
│                                                                                       │
│        ◀  ┌─────────────────────────────────────────────────────────────┐  ▶         │
│           │                                                               │             │
│           │    "引号                                                       │             │
│           │                                                               │             │
│           │    这家公司的服务非常专业，帮助我们实现了数字化转型。            │             │
│           │    他们的团队非常出色，技术实力强大，值得信赖！                 │             │
│           │                                                               │             │
│           │    "引号                                                       │             │
│           │                                                               │             │
│           │                    ┌────────┐                                  │             │
│           │                    │ [头像] │   张总 - XX公司 CEO              │             │
│           │                    └────────┘                                  │             │
│           │                                                               │             │
│           │                    ★★★★☆                                      │             │
│           │                                                               │             │
│           └─────────────────────────────────────────────────────────────┘               │
│                                                                                       │
│                              ●  ○  ○  ○  ○                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### GSAP 动画实现

```javascript
// ========================================
// 评价卡片入场动画
// ========================================

gsap.from('.testimonial-card', {
  scale: 0.8,
  opacity: 0,
  duration: 1,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.testimonials-section',
    start: 'top 75%'
  }
})

// ========================================
// 自动轮播动画
// ========================================

const testimonialCards = gsap.utils.toArray('.testimonial-item')
let currentIndex = 0
let autoplayInterval

function showSlide(index) {
  testimonialCards.forEach((card, i) => {
    if (i === index) {
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        zIndex: 10,
        duration: 0.5,
        ease: 'power2.out'
      })
    } else {
      gsap.to(card, {
        opacity: 0,
        scale: 0.9,
        zIndex: 1,
        duration: 0.5,
        ease: 'power2.in'
      })
    }
  })
  
  // 更新指示器
  gsap.to('.testimonial-dot', {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    duration: 0.3
  })
  gsap.to(`.testimonial-dot:nth-child(${index + 1})`, {
    backgroundColor: '#6366f1',
    duration: 0.3
  })
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % testimonialCards.length
  showSlide(currentIndex)
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length
  showSlide(currentIndex)
}

// 自动播放
function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 5000)
}

function stopAutoplay() {
  clearInterval(autoplayInterval)
}

// 开始
showSlide(0)
startAutoplay()

// 点击指示器
document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
  dot.addEventListener('click', () => {
    currentIndex = i
    showSlide(currentIndex)
    stopAutoplay()
    startAutoplay()
  })
})

// 悬停时暂停
document.querySelector('.testimonials-section').addEventListener('mouseenter', stopAutoplay)
document.querySelector('.testimonials-section').addEventListener('mouseleave', startAutoplay)

// ========================================
// 引用符号动画
// ========================================

gsap.to('.testimonial-quote-icon', {
  scale: 1.2,
  opacity: 0.8,
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
})

// ========================================
// 星级评分动画
// ========================================

document.querySelectorAll('.testimonial-card').forEach(card => {
  const stars = card.querySelectorAll('.star')
  gsap.from(stars, {
    scale: 0,
    opacity: 0,
    stagger: 0.1,
    duration: 0.5,
    ease: 'back.out(2)',
    scrollTrigger: {
      trigger: card,
      start: 'top 70%'
    }
  })
})
```

#### CSS 样式

```css
.testimonials-section {
  padding: 120px 0;
  background: #0a0a1a;
  position: relative;
  overflow: hidden;
}

.testimonials-container {
  max-width: var(--container-lg);
  margin: 0 auto;
  padding: 0 24px;
}

.testimonials-slider {
  position: relative;
  margin-top: 60px;
}

.testimonial-card {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
  padding: 60px;
  background: rgba(26, 26, 58, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  text-align: center;
}

.testimonial-quote-icon {
  font-size: 4rem;
  color: #6366f1;
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 20px;
}

.testimonial-text {
  font-size: 1.25rem;
  color: #f8fafc;
  line-height: 1.8;
  margin-bottom: 40px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.testimonial-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #6366f1;
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-info {
  text-align: left;
}

.testimonial-name {
  font-size: 1rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 4px;
}

.testimonial-role {
  font-size: 0.875rem;
  color: #94a3b8;
}

.testimonial-rating {
  margin-top: 16px;
}

.testimonial-rating .star {
  color: #fb923c;
  font-size: 1.25rem;
  margin: 0 2px;
}

/* 指示器 */
.testimonial-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
}

.testimonial-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.testimonial-dot:hover,
.testimonial-dot.active {
  background: #6366f1;
  transform: scale(1.2);
}

/* 导航按钮 */
.testimonial-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #f8fafc;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testimonial-nav:hover {
  background: #6366f1;
}

.testimonial-prev {
  left: 0;
}

.testimonial-next {
  right: 0;
}
```

---

### 📌 模块八：联系方式 (Contact)

#### 布局

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                              联 系 我 们                                              │
│                              ────────                                                │
│                                                                                       │
│   ┌─────────────────────────────────┐  ┌─────────────────────────────────────────┐   │
│   │         联系信息                  │  │           发送消息                      │   │
│   │         ────────                 │  │           ────────                      │   │
│   │                                 │  │                                         │   │
│   │  📍  北京市朝阳区科技园A座1001    │  │  ┌─────────────────────────────────┐  │   │
│   │                                 │  │  │ 姓名                             │  │   │
│   │  📞  +86 10 8888 8888          │  │  └─────────────────────────────────┘  │   │
│   │                                 │  │  ┌─────────────────────────────────┐  │   │
│   │  ✉️  contact@company.com       │  │  │ 邮箱                             │  │   │
│   │                                 │  │  └─────────────────────────────────┘  │   │
│   │  🕐  周一至周五 9:00-18:00      │  │  ┌─────────────────────────────────┐  │   │
│   │                                 │  │  │ 主题                             │  │   │
│   │  ┌─────────────────────────┐   │  │  └─────────────────────────────────┘  │   │
│   │  │    [社交媒体图标]        │   │  │  ┌─────────────────────────────────┐  │   │
│   │  │  微博  微信  领英  GitHub │   │  │  │                                 │  │   │
│   │  └─────────────────────────┘   │  │  │ 留言内容...                      │  │   │
│   │                                 │  │  │                                 │  │   │
│   └─────────────────────────────────┘  │  │  └─────────────────────────────────┘  │   │
│                                        │  │         [发送消息]                  │   │
│                                        └─────────────────────────────────────────┘   │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### GSAP 动画实现

```javascript
// ========================================
// 联系信息入场
// ========================================

gsap.from('.contact-info', {
  x: -50,
  opacity: 0,
  duration: 0.8,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.contact-section',
    start: 'top 75%'
  }
})

// ========================================
// 联系项动画
// ========================================

gsap.from('.contact-item', {
  x: -30,
  opacity: 0,
  stagger: 0.15,
  duration: 0.6,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.contact-info',
    start: 'top 70%'
  }
})

// ========================================
// 表单入场
// ========================================

gsap.from('.contact-form', {
  x: 50,
  opacity: 0,
  duration: 0.8,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.contact-section',
    start: 'top 75%'
  }
})

// ========================================
// 输入框聚焦效果
// ========================================

document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('focus', () => {
    gsap.to(input, {
      scale: 1.02,
      borderColor: '#6366f1',
      boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
      duration: 0.3,
      ease: 'power2.out'
    })
    
    // 标签动画
    gsap.to(input.previousElementSibling, {
      y: -25,
      scale: 0.85,
      color: '#6366f1',
      duration: 0.3
    })
  })
  
  input.addEventListener('blur', () => {
    if (!input.value) {
      gsap.to(input.previousElementSibling, {
        y: 0,
        scale: 1,
        color: '#94a3b8',
        duration: 0.3
      })
    }
    
    gsap.to(input, {
      scale: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      boxShadow: 'none',
      duration: 0.3
    })
  })
})

// ========================================
// 文本域自动高度
// ========================================

const textarea = document.querySelector('.form-textarea')

textarea.addEventListener('input', () => {
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
})

// ========================================
// 提交按钮动画
// ========================================

const submitBtn = document.querySelector('.submit-btn')

submitBtn.addEventListener('mouseenter', () => {
  gsap.to(submitBtn, {
    scale: 1.05,
    boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)',
    duration: 0.3
  })
})

submitBtn.addEventListener('mouseleave', () => {
  gsap.to(submitBtn, {
    scale: 1,
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
    duration: 0.3
  })
})

// 点击爆炸粒子效果
submitBtn.addEventListener('click', function(e) {
  // 创建粒子
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('span')
    particle.className = 'btn-particle'
    particle.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: #6366f1;
      border-radius: 50%;
      pointer-events: none;
    `
    this.appendChild(particle)
    
    const angle = (i / 20) * Math.PI * 2
    const distance = 50 + Math.random() * 50
    
    gsap.to(particle, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity: 0,
      scale: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => particle.remove()
    })
  }
  
  // 按钮缩放
  gsap.to(this, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  })
})

// ========================================
// 社交图标动画
// ========================================

document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('mouseenter', () => {
    gsap.to(link, {
      y: -5,
      backgroundColor: '#6366f1',
      color: '#fff',
      duration: 0.3
    })
  })
  
  link.addEventListener('mouseleave', () => {
    gsap.to(link, {
      y: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#94a3b8',
      duration: 0.3
    })
  })
})
```

#### CSS 样式

```css
.contact-section {
  padding: 120px 0;
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 100%);
}

.contact-container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 24px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-top: 60px;
}

/* 联系信息 */
.contact-info {
  padding: 40px;
  background: rgba(26, 26, 58, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 30px;
}

.contact-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.contact-text h4 {
  font-size: 1rem;
  color: #f8fafc;
  margin-bottom: 8px;
}

.contact-text p {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* 社交链接 */
.social-links {
  display: flex;
  gap: 12px;
  margin-top: 40px;
}

.social-link {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 1.25rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #6366f1;
  color: #fff;
}

/* 表单 */
.contact-form {
  padding: 40px;
  background: rgba(26, 26, 58, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}

.form-group {
  position: relative;
  margin-bottom: 24px;
}

.form-label {
  position: absolute;
  top: 16px;
  left: 16px;
  color: #94a3b8;
  font-size: 0.95rem;
  pointer-events: none;
  transition: all 0.3s ease;
  transform-origin: left top;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #f8fafc;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #6366f1;
}

.form-textarea {
  min-height: 150px;
  resize: none;
  font-family: inherit;
}

.submit-btn {
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #f8fafc;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: visible;
}

/* 响应式 */
@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
```

---

### 📌 模块九：页脚 (Footer)

#### 布局

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │             │  │             │  │             │  │             │                  │
│  │   [Logo]    │  │   快速链接   │  │   产品      │  │   订阅新闻   │                  │
│  │             │  │             │  │             │  │             │                  │
│  │  公司简介    │  │  首页       │  │  云服务     │  │  输入框     │                  │
│  │  文字描述... │  │  关于我们   │  │  大数据     │  │  [订阅按钮] │                  │
│  │             │  │  服务       │  │  安全       │  │             │                  │
│  │  [社交图标] │  │  案例       │  │  ...       │  │  [社交图标] │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                                       │
│  ────────────────────────────────────────────────────────────────────────────────     │
│  © 2026 公司名称 | 隐私政策 | 服务条款 | ICP备案号                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

#### GSAP 动画实现

```javascript
// ========================================
// 页脚入场动画
// ========================================

gsap.from('.footer-section', {
  y: 50,
  opacity: 0,
  stagger: 0.1,
  duration: 0.8,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: 'footer',
    start: 'top 90%'
  }
})

// ========================================
// 订阅表单动画
// ========================================

const subscribeInput = document.querySelector('.subscribe-input')
const subscribeBtn = document.querySelector('.subscribe-btn')

subscribeBtn.addEventListener('mouseenter', () => {
  gsap.to(subscribeBtn, {
    scale: 1.05,
    duration: 0.3
  })
})

subscribeBtn.addEventListener('mouseleave', () => {
  gsap.to(subscribeBtn, {
    scale: 1,
    duration: 0.3
  })
})

// 订阅成功动画
subscribeBtn.addEventListener('click', () => {
  gsap.to(subscribeBtn, {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      gsap.to('.subscribe-success', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      })
      
      setTimeout(() => {
        gsap.to('.subscribe-success', {
          opacity: 0,
          y: -20,
          duration: 0.3
        })
      }, 3000)
    }
  })
})

// ========================================
// 链接悬停效果
// ========================================

document.querySelectorAll('.footer-link').forEach(link => {
  link.addEventListener('mouseenter', () => {
    gsap.to(link, {
      x: 5,
      color: '#6366f1',
      duration: 0.3
    })
  })
  
  link.addEventListener('mouseleave', () => {
    gsap.to(link, {
      x: 0,
      color: '#94a3b8',
      duration: 0.3
    })
  })
})
```

#### CSS 样式

```css
footer {
  background: #0a0a1a;
  border-top: 1px solid rgba(99, 102, 241, 0.1);
  padding: 80px 0 40px;
}

.footer-container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 60px;
  margin-bottom: 60px;
}

.footer-brand {
  max-width: 300px;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-desc {
  color: #94a3b8;
  line-height: 1.8;
  margin-bottom: 24px;
}

.footer-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 24px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #6366f1;
}

/* 订阅表单 */
.subscribe-form {
  display: flex;
  gap: 12px;
}

.subscribe-input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #f8fafc;
  font-size: 0.95rem;
}

.subscribe-input::placeholder {
  color: #64748b;
}

.subscribe-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #f8fafc;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subscribe-success {
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 12px;
  opacity: 0;
  transform: translateY(10px);
}

/* 底部栏 */
.footer-bottom {
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-copyright {
  color: #64748b;
  font-size: 0.875rem;
}

.footer-legal {
  display: flex;
  gap: 24px;
}

.footer-legal a {
  color: #64748b;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-legal a:hover {
  color: #6366f1;
}

/* 响应式 */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
```

---

## 三、全局动效系统

### 3.1 页面加载过渡效果

```javascript
// ========================================
// 页面整体加载动画
// ========================================

const pageLoader = () => {
  // 加载进度条
  gsap.fromTo('.page-loader',
    { opacity: 1 },
    {
      opacity: 0,
      duration: 0.5,
      delay: 1.5,
      onComplete: () => {
        document.querySelector('.page-loader').style.display = 'none'
      }
    }
  )
  
  // 页面内容入场
  gsap.from('.page-content', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.5,
    ease: 'power3.out'
  })
}

// ========================================
// 滚动揭示效果
// ========================================

const revealElements = gsap.utils.toArray('.reveal')

revealElements.forEach(el => {
  gsap.fromTo(el,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )
})

// ========================================
// 滚动进度指示器
// ========================================

gsap.to('.scroll-progress-bar', {
  scaleX: ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }).progress,
  transformOrigin: 'left center',
  ease: 'none'
})

// 显示滚动百分比
ScrollTrigger.create({
  trigger: document.body,
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    document.querySelector('.scroll-percentage').textContent = 
      Math.round(self.progress * 100) + '%'
  }
})
```

### 3.2 鼠标跟随效果

```javascript
// ========================================
// 自定义光标
// ========================================

const cursor = document.querySelector('.custom-cursor')
const cursorDot = document.querySelector('.cursor-dot')
const cursorRing = document.querySelector('.cursor-ring')

document.addEventListener('mousemove', (e) => {
  // 光点立即跟随
  gsap.to(cursorDot, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.05
  })
  
  // 光环延迟跟随
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.3,
    ease: 'power2.out'
  })
})

// 悬停时光标放大
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, {
      scale: 2,
      borderColor: '#6366f1',
      duration: 0.3
    })
    gsap.to(cursorDot, {
      scale: 0,
      duration: 0.3
    })
  })
  
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, {
      scale: 1,
      borderColor: '#6366f1',
      duration: 0.3
    })
    gsap.to(cursorDot, {
      scale: 1,
      duration: 0.3
    })
  })
})

// ========================================
// 鼠标移动视差背景
// ========================================

document.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 2
  
  // 背景层视差
  gsap.to('.parallax-layer-1', {
    x: mouseX * 30,
    y: mouseY * 20,
    duration: 1,
    ease: 'power2.out'
  })
  
  gsap.to('.parallax-layer-2', {
    x: mouseX * 50,
    y: mouseY * 30,
    duration: 1.2,
    ease: 'power2.out'
  })
  
  gsap.to('.parallax-layer-3', {
    x: mouseX * 80,
    y: mouseY * 50,
    duration: 1.5,
    ease: 'power2.out'
  })
})
```

### 3.3 滚动时元素变化

```javascript
// ========================================
// 元素随滚动缩放/旋转
// ========================================

gsap.utils.toArray('.scroll-scale').forEach(el => {
  gsap.to(el, {
    scale: 1.2,
    rotation: 10,
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1
    }
  }
})

// ========================================
// 视差滚动效果
// ========================================

gsap.utils.toArray('.parallax-element').forEach(el => {
  const speed = el.dataset.speed || 0.5
  
  gsap.to(el, {
    y: () => (window.innerHeight * speed),
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
})

// ========================================
// 背景颜色随滚动变化
// ========================================

ScrollTrigger.create({
  trigger: '.color-transition-section',
  start: 'top center',
  end: 'bottom center',
  onUpdate: (self) => {
    const color = gsap.utils.interpolate('#0a0a1a', '#1a1a3a', self.progress)
    gsap.to('.color-transition-section', {
      backgroundColor: color,
      duration: 0.1
    })
  }
})
```

### 3.4 性能优化

```javascript
// ========================================
// GSAP 性能优化
// ========================================

// 使用 will-change
gsap.set('.animated-element', {
  willChange: 'transform, opacity'
})

// 动画完成后清理
ScrollTrigger.create({
  trigger: '.lazy-animation',
  start: 'top 80%',
  onEnter: () => {
    // 执行动画
    gsap.to('.lazy-animation', { opacity: 1, y: 0 })
    // 清理
    ScrollTrigger.getAll().forEach(st => st.kill())
  }
})

// 使用 requestAnimationFrame
let ticking = false
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // 执行滚动相关动画
      ticking = false
    })
    ticking = true
  }
})
```

---

## 四、技术规范总结

### 4.1 类名命名规范

| 模块 | 前缀 | 示例 |
|------|------|------|
| 导航栏 | `.nav-` | `.nav-wrapper`, `.nav-link`, `.nav-logo` |
| Hero | `.hero-` | `.hero-title`, `.hero-cta-btn`, `.hero-particle` |
| 关于我们 | `.about-` | `.about-section`, `.about-title`, `.about-3d-shape` |
| 服务 | `.service-` | `.service-card`, `.service-icon`, `.service-title` |
| 案例 | `.portfolio-` | `.portfolio-item`, `.portfolio-card`, `.portfolio-img` |
| 团队 | `.team-` | `.team-card`, `.team-avatar`, `.team-social` |
| 评价 | `.testimonial-` | `.testimonial-card`, `.testimonial-text` |
| 联系 | `.contact-` | `.contact-form`, `.contact-item`, `.form-input` |
| 页脚 | `.footer-` | `.footer-section`, `.footer-link`, `.footer-logo` |
| 全局 | `.section-`, `.container-` | `.section-title`, `.container-xl` |

### 4.2 GSAP 动画参数规范

| 类型 | 时长 | 缓动函数 | 适用场景 |
|------|------|---------|---------|
| 入场动画 | 0.8-1.2s | `back.out(1.7)` | 元素首次出现 |
| 交互动画 | 0.2-0.4s | `power2.out` | 悬停、点击反馈 |
| 滚动动画 | scrub | - | 滚动绑定效果 |
| 弹性动画 | 0.5-1s | `elastic.out(1, 0.5)` | 弹回、复原 |
| 持续动画 | repeat: -1 | `sine.inOut` | 背景装饰 |

### 4.3 响应式断点

| 设备 | 断点 | 网格列数 |
|------|------|---------|
| 桌面 | >1024px | 4列 |
| 平板 | 768-1024px | 2列 |
| 手机 | <768px | 1列 |

### 4.4 性能优化建议

1. **优先使用 transform 和 opacity** - GPU 加速
2. **使用 will-change 提示浏览器** - 提前优化
3. **避免动画中修改 layout** - 使用 transform
4. **使用 gsap.utils.toArray()** - 安全选择器
5. **组件卸载时清理动画** - 使用 gsap.context()
6. **限制同时动画元素数量** - 避免性能问题

---

## 五、GSAP 代码模板库

### 5.1 基础入场动画模板

```javascript
// 单元素入场
gsap.from('.element', {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.element',
    start: 'top 85%',
    toggleActions: 'play none none reverse'
  }
})

// 多元素交错入场
gsap.from('.list-item', {
  y: 50,
  opacity: 0,
  stagger: 0.1,
  duration: 0.8,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.list-container',
    start: 'top 80%'
  }
})

// 随机交错入场
gsap.from('.grid-item', {
  scale: 0.8,
  opacity: 0,
  stagger: {
    amount: 1,
    from: 'random'
  },
  duration: 0.8,
  ease: 'back.out(1.4)',
  scrollTrigger: {
    trigger: '.grid',
    start: 'top 75%'
  }
})
```

### 5.2 滚动绑定动画模板

```javascript
// 基础滚动绑定
gsap.to('.element', {
  y: -100,
  scrollTrigger: {
    trigger: '.element',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1
  }
})

// 带snap的滚动
ScrollTrigger.create({
  trigger: '.snap-container',
  start: 'top top',
  end: () => '+=' + containerHeight,
  snap: {
    snapTo: 1 / (slides.length - 1),
    duration: { min: 0.2, max: 0.6 },
    delay: 0.1
  }
})

// 进度条
gsap.to('.progress-fill', {
  scaleX: progress,
  transformOrigin: 'left center',
  ease: 'none',
  scrollTrigger: {
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
})
```

### 5.3 3D 效果模板

```javascript
// 3D 卡片倾斜
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  gsap.to(card, {
    rotateX: (y - centerY) / 10,
    rotateY: (centerX - x) / 10,
    duration: 0.3,
    ease: 'power2.out',
    transformPerspective: 1000
  })
})

// 3D 旋转入场
gsap.from('.rotate-3d', {
  rotateY: -180,
  duration: 1.5,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.rotate-3d',
    start: 'top 80%'
  }
})
```

### 5.4 文字动画模板

```javascript
// 字符拆分动画
const text = '动画文字'
const chars = text.split('').map(char => 
  `<span class="char">${char}</span>`
).join('')
element.innerHTML = chars

gsap.from('.char', {
  y: 50,
  opacity: 0,
  rotationX: -90,
  stagger: 0.05,
  duration: 0.8,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: element,
    start: 'top 80%'
  }
})

// 打字机效果
const text = '这是一段打字机效果文字'
let index = 0
const interval = setInterval(() => {
  element.textContent = text.substring(0, index++)
  if (index > text.length) clearInterval(interval)
}, 100)
```

### 5.5 磁性吸附模板

```javascript
// 磁性按钮
const magneticBtn = document.querySelector('.magnetic-btn')

magneticBtn.addEventListener('mousemove', (e) => {
  const rect = magneticBtn.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  
  gsap.to(magneticBtn, {
    x: x * 0.3,
    y: y * 0.3,
    duration: 0.3,
    ease: 'power2.out'
  })
})

magneticBtn.addEventListener('mouseleave', () => {
  gsap.to(magneticBtn, {
    x: 0,
    y: 0,
    duration: 0.5,
    ease: 'elastic.out(1, 0.5)'
  })
})
```

---

## 六、推荐组件清单

基于项目现有 `src/views/web/components` 目录，以下组件可直接复用或参考：

### 6.1 背景效果组件

| 组件名称 | 文件 | 用途 |
|---------|------|------|
| `QuantumWormhole.vue` | 量子虫洞背景 | Hero/全站背景 |
| `NebulaVortex.vue` | 星云旋涡 | 装饰背景 |
| `AuroraBorealis.vue` | 极光效果 | 区块背景 |
| `GalaxySpiral.vue` | 银河旋涡 | 背景装饰 |
| `GradientFlow.vue` | 渐变流动 | 背景渐变 |

### 6.2 卡片组件

| 组件名称 | 文件 | 用途 |
|---------|------|------|
| `CardStack.vue` | 卡片堆叠 | 案例展示 |
| `Card3DFlipGallery.vue` | 3D翻转卡片 | 团队成员 |
| `FlipCards.vue` | 翻转卡片 | 产品展示 |
| `GlassmorphismGallery.vue` | 玻璃拟态卡片 | 服务展示 |
| `MorphingCards.vue` | 变形卡片 | 交互效果 |

### 6.3 滚动效果组件

| 组件名称 | 文件 | 用途 |
|---------|------|------|
| `ParallaxScroll.vue` | 视差滚动 | 图片视差 |
| `HorizontalScroll.vue` | 水平滚动 | 案例画廊 |
| `HorizontalScrollCards.vue` | 水平卡片滚动 | 产品展示 |
| `CascadeParallax.vue` | 层叠视差 | 分层效果 |
| `DiagonalParallax.vue` | 对角视差 | 区块分隔 |

### 6.4 交互效果组件

| 组件名称 | 文件 | 用途 |
|---------|------|------|
| `MagneticButton.vue` | 磁力按钮 | CTA按钮 |
| `MagneticOrbit.vue` | 磁力轨道 | 装饰效果 |
| `NeonGlowText.vue` | 霓虹文字 | 标题效果 |
| `Holographic3D.vue` | 全息3D | 卡片效果 |
| `FloatingImages.vue` | 漂浮图片 | 装饰元素 |

### 6.5 数据展示组件

| 组件名称 | 文件 | 用途 |
|---------|------|------|
| `NumberCounter.vue` | 数字计数器 | 统计数据 |
| `CircularProgress.vue` | 环形进度 | 数据可视化 |
| `ImageComparison.vue` | 图片对比 | 案例展示 |

### 6.6 高级特效组件

| 组件名称 | 文件 | 用途 |
|---------|------|------|
| `QuantumWormhole.vue` | 量子虫洞 | 全局背景 |
| `QuantumField.vue` | 量子场 | 装饰背景 |
| `DNAHelix.vue` | DNA螺旋 | 装饰元素 |
| `InfinityMotion.vue` | 无限运动 | 装饰效果 |
| `LiquidWave.vue` | 液体波浪 | 背景效果 |

---

## 七、项目集成指南

### 7.1 安装依赖

```bash
npm install gsap
# 或
pnpm add gsap
```

### 7.2 在 Vue 组件中使用

```javascript
// 1. 引入 GSAP 和 ScrollTrigger
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 2. 注册插件
gsap.registerPlugin(ScrollTrigger)

// 3. 在 onMounted 中初始化动画
onMounted(() => {
  // 创建 GSAP Context
  ctx = gsap.context(() => {
    // 你的动画代码
    gsap.from('.element', {
      y: 50,
      opacity: 0,
      duration: 1
    })
  })
  
  // 或使用 ScrollTrigger
  ScrollTrigger.create({
    trigger: '.element',
    start: 'top 80%',
    onEnter: () => {
      gsap.to('.element', { opacity: 1, y: 0 })
    }
  })
})

// 4. 在 onUnmounted 中清理
onUnmounted(() => {
  ctx?.revert()
  ScrollTrigger.getAll().forEach(st => st.kill())
})
```

### 7.3 全局 GSAP 配置

```javascript
// main.ts 或单独的配置文件
import { gsap } from 'gsap'

// 设置默认缓动函数
gsap.defaults({
  ease: 'power2.out',
  duration: 0.8
})

// 设置 ScrollTrigger 默认配置
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
  start: 'top 80%'
})
```

---

## 结语

本设计方案为企业官网提供了完整的视觉规范、交互设计和 GSAP 动画实现指南。通过合理运用这些设计元素和动画效果，可以打造出一个既专业又具有强烈视觉冲击力的高端企业官网。

所有动画效果都遵循以下原则：
- **性能优先** - 使用 transform 和 opacity，避免 layout thrashing
- **体验流畅** - 合理的动画时长和缓动函数
- **渐进增强** - 动画作为增强，不影响核心功能
- **无障碍友好** - 提供减少动画的选项

如需进一步的定制开发或有问题，请随时沟通！
