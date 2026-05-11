# 🖥️ 高端电脑科技企业官网设计方案

> 基于 GSAP 3.12+ 的星际未来风格电脑产品官网完整方案

---

## 目录

1. [整体视觉定位](#一整体视觉定位)
2. [页面结构详细设计](#二页面结构详细设计)
3. [动画效果系统](#三动画效果系统)
4. [GSAP 代码模板库](#四gsap代码模板库)
5. [技术规范总结](#五技术规范总结)
6. [项目集成指南](#六项目集成指南)

---

## 一、整体视觉定位

### 1.1 设计理念

```
融合星际宇宙的神秘感 + 电脑科技的专业感 + 流畅交互的沉浸感 + 高端产品的奢华感
```

本设计方案以「星际未来·电脑科技」为主题，打造一个具有强烈视觉冲击力和深度交互体验的高端电脑产品官网。整体视觉语言融合深邃星空、极光流光、粒子星尘、磁力交互等元素，营造神秘而专业的科技氛围，让访客在浏览过程中感受到高端电脑的力量与创新。

### 1.2 色彩系统

#### 核心色彩配方

```css
:root {
  /* 主色调 - 科技蓝 */
  --color-primary: #3b82f6;
  --color-primary-light: #60a5fa;
  --color-primary-dark: #2563eb;
  
  /* 辅助色 - 霓虹紫 */
  --color-accent: #8b5cf6;
  --color-accent-light: #a78bfa;
  --color-accent-dark: #7c3aed;
  
  /* 点缀色 - 赛博青 */
  --color-cyan: #06b6d4;
  --color-cyan-light: #22d3ee;
  
  /* 背景色系 */
  --color-dark: #0f172a;
  --color-dark-2: #1e293b;
  --color-dark-3: #334155;
  
  /* 文字色系 */
  --color-text-primary: #ffffff;
  --color-text-secondary: #94a3b8;
  --color-text-muted: #64748b;
  
  /* 功能色 */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  /* 渐变 */
  --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  --gradient-neon: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4);
  --gradient-dark: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  --gradient-card: linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.05));
}
```

### 1.3 字体系统

```css
:root {
  /* 字体族 */
  --font-heading: 'Inter', 'Poppins', 'SF Pro Display', sans-serif;
  --font-body: 'Inter', 'SF Pro Text', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-chinese: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  
  /* 字号系统 */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
  --text-hero: clamp(3rem, 8vw, 6rem);
}
```

### 1.4 间距系统

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  
  --container-lg: 1024px;
  --container-xl: 1280px;
}
```

---

## 二、页面结构详细设计

### 📌 模块零：页面加载器 (Loader)

**动画效果：**
- Logo 从上方滑入 + 透明度渐显
- 进度条从 0% 填充到 100%
- 数字计数器动画（0 → 100）
- 完成后整体淡出 + 页面揭示

```javascript
const loadingAnimation = gsap.timeline()

loadingAnimation
  .from('.loader-logo', {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.7)'
  })
  .to('.loader-progress-bar', {
    width: '100%',
    duration: 2,
    ease: 'power2.inOut'
  }, '-=0.3')
  .to('.loader-percent', {
    textContent: 100,
    duration: 2,
    snap: { textContent: 1 },
    ease: 'power2.inOut'
  }, '<')
  .to('.loader-wrapper', {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.inOut'
  })
  .from('.page-content', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.3')
```

---

### 📌 模块一：导航栏 (Navigation)

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo]  首页  产品  解决方案  技术支持  关于我们  联系  [主题切换] │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// 导航栏入场
const navAnimation = gsap.timeline()
navAnimation
  .from('.nav-logo', { x: -60, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' })
  .from('.nav-link', { y: -30, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.4')
  .from('.nav-cta-btn', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(2)' }, '-=0.3')
  .from('.theme-toggle', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.2')

// 链接悬停下划线
document.querySelectorAll('.nav-link').forEach(link => {
  const underline = document.createElement('span')
  underline.className = 'nav-underline'
  link.appendChild(underline)
  
  link.addEventListener('mouseenter', () => {
    gsap.to(underline, { scaleX: 1, duration: 0.3, ease: 'power2.out' })
    gsap.to(link, { color: '#3b82f6', duration: 0.3 })
  })
  link.addEventListener('mouseleave', () => {
    gsap.to(underline, { scaleX: 0, duration: 0.3, ease: 'power2.out' })
    gsap.to(link, { color: '#f8fafc', duration: 0.3 })
  })
})

// 滚动时状态变化
ScrollTrigger.create({
  start: 80,
  onUpdate: (self) => {
    const progress = self.progress
    gsap.to('.navbar-container', {
      backgroundColor: progress > 0 ? 'rgba(15, 23, 42, 0.9)' : 'transparent',
      backdropFilter: progress > 0 ? 'blur(20px)' : 'blur(0)',
      borderBottomColor: progress > 0 ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
      duration: 0.3
    })
  }
})

// 平滑滚动
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const targetId = link.getAttribute('href')
    const target = document.querySelector(targetId)
    if (target) {
      gsap.to(window, {
        duration: 1,
        scrollTo: target.getBoundingClientRect().top + window.pageYOffset - 80,
        ease: 'power3.inOut'
      })
    }
  })
})
```

---

### 📌 模块二：Hero 首屏区

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│ [粒子背景] [极光渐变] [透视网格] [光斑装饰]                       │
│                                                                  │
│              未 来 已 来 · 极 致 性 能                            │
│           [CHAR] [CHAR] [CHAR] [CHAR] [CHAR]                    │
│                                                                  │
│         解锁无限可能，定义新一代计算体验                           │
│                                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│   │ 探索产品  │  │ 观看演示  │  │ 联系我们  │                     │
│   └──────────┘  └──────────┘  └──────────┘                     │
│                                                                  │
│                   ┌─────────────┐                                │
│                   │ 电脑3D悬浮  │                                │
│                   │ 粒子环绕    │                                │
│                   │ 霓虹光效    │                                │
│                   └─────────────┘                                │
│                            ▼                                     │
│                         [弹跳箭头]                               │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// 粒子系统
function createParticles() {
  const container = document.querySelector('.hero-particles')
  for (let i = 0; i < 60; i++) {
    const particle = document.createElement('div')
    particle.className = 'hero-particle'
    const size = Math.random() * 4 + 2
    const isGlowing = Math.random() > 0.85
    particle.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      background: ${isGlowing ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.5)'};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      ${isGlowing ? 'box-shadow: 0 0 15px rgba(59, 130, 246, 0.8);' : ''}
    `
    container.appendChild(particle)
    gsap.to(particle, {
      y: `-=${100 + Math.random() * 150}`,
      x: `random(-50, 50)`,
      opacity: 0,
      duration: `random(4, 10)`,
      repeat: -1, delay: `random(0, 3)`, ease: 'none'
    })
  }
}
gsap.from('.hero-particle', { scale: 0, opacity: 0, duration: 1, stagger: { amount: 2, from: 'random' }, ease: 'power2.out' })

// 极光动画
gsap.to('.hero-aurora-1', { x: 100, y: 50, scale: 1.2, duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut' })
gsap.to('.hero-aurora-2', { x: -80, y: -60, scale: 1.3, duration: 25, repeat: -1, yoyo: true, ease: 'sine.inOut' })

// 透视网格
gsap.to('.hero-grid', { backgroundPosition: '0 -100%', duration: 15, repeat: -1, ease: 'none' })

// 标题字符动画
const mainTitle = '未来已来·极致性能'
const titleHTML = mainTitle.split('').map(char => {
  if (char === '·') return '<span class="hero-char hero-separator">·</span>'
  return `<span class="hero-char">${char}</span>`
}).join('')
document.querySelector('.hero-title').innerHTML = titleHTML

gsap.from('.hero-char', {
  y: 120, opacity: 0, rotationY: -90, stagger: 0.04,
  duration: 1, ease: 'back.out(1.7)', delay: 0.5
})

// 字符持续浮动
gsap.to('.hero-char:not(.hero-separator)', {
  y: 'random(-8, 8)', duration: 'random(2, 4)', repeat: -1, yoyo: true,
  ease: 'sine.inOut', stagger: { amount: 1, from: 'random' }
})

// 副标题动画
gsap.from('.hero-subtitle', { y: 50, opacity: 0, duration: 1, delay: 1.2, ease: 'power3.out' })
gsap.from('.hero-subtitle-line', { width: 0, duration: 1.5, delay: 1.5, ease: 'power2.out' })

// CTA 按钮入场
gsap.from('.hero-cta-btn', {
  y: 40, opacity: 0, scale: 0.8, stagger: 0.15,
  duration: 0.8, delay: 1.6, ease: 'back.out(2)'
})

// 电脑 3D 悬浮
gsap.to('.hero-computer', { y: -30, rotationZ: 3, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' })
gsap.to('.computer-glow', { scale: 1.2, opacity: 0.4, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' })

// 鼠标视差
document.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  const mouseY = (e.clientY / window.innerHeight - 0.5) * 2
  gsap.to('.hero-title', { x: mouseX * 15, y: mouseY * 8, duration: 1, ease: 'power2.out' })
  gsap.to('.hero-computer', { rotateY: mouseX * 15, rotateX: -mouseY * 10, duration: 0.8, ease: 'power2.out' })
  gsap.to('.hero-glow-1', { x: mouseX * 60, y: mouseY * 40, duration: 2, ease: 'power2.out' })
})

// 滚动指示器
gsap.to('.scroll-indicator', { y: 20, duration: 1.2, repeat: -1, yoyo: true, ease: 'power1.inOut' })
```

---

### 📌 模块三：产品特性 (Features)

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│                         核 心 优 势                               │
│                                                                  │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                │
│  │  [图标] │  │  [图标] │  │  [图标] │  │  [图标] │                │
│  │ 极致性能 │  │ 智能散热 │  │ 超长续航 │  │ 轻薄设计 │                │
│  │ 描述... │  │ 描述... │  │ 描述... │  │ 描述... │                │
│  │  [数据] │  │  [数据] │  │  [数据] │  │  [数据] │                │
│  └────────┘  └────────┘  └────────┘  └────────┘                │
│                                                                  │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                │
│  │  [图标] │  │  [图标] │  │  [图标] │  │  [图标] │                │
│  │  4K显示 │  │ 高速存储│  │  AI助手 │  │ 安全防护 │                │
│  │ 描述... │  │ 描述... │  │ 描述... │  │ 描述... │                │
│  │  [数据] │  │  [数据] │  │  [数据] │  │  [数据] │                │
│  └────────┘  └────────┘  └────────┘  └────────┘                │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// 特性卡片入场
gsap.from('.feature-card', {
  y: 100, opacity: 0, scale: 0.8,
  stagger: { amount: 1, from: 'start' },
  duration: 0.8, ease: 'back.out(1.4)',
  scrollTrigger: { trigger: '.features-grid', start: 'top 75%' }
})

// 卡片 3D 磁力交互
document.querySelectorAll('.feature-card').forEach(card => {
  const inner = card.querySelector('.feature-card-inner')
  const glow = card.querySelector('.feature-glow')
  
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left, y = e.clientY - rect.top
    const centerX = rect.width / 2, centerY = rect.height / 2
    gsap.to(inner, { rotateX: (y - centerY) / 12, rotateY: (centerX - x) / 12, duration: 0.4, ease: 'power2.out', transformPerspective: 1200 })
    gsap.to(glow, { x: x - centerX, y: y - centerY, opacity: 0.6, scale: 1.5, duration: 0.3 })
  })
  
  card.addEventListener('mouseleave', () => {
    gsap.to(inner, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
    gsap.to(glow, { x: 0, y: 0, opacity: 0, scale: 1, duration: 0.4 })
  })
})

// 图标动画
gsap.to('.feature-icon', { scale: 1.1, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })

// 数字动画
document.querySelectorAll('.feature-stat').forEach(stat => {
  const value = parseFloat(stat.dataset.value)
  const suffix = stat.dataset.suffix || ''
  gsap.from(stat, {
    textContent: 0, duration: 2, ease: 'power2.out',
    snap: { textContent: value < 10 ? 0.1 : 1 },
    scrollTrigger: { trigger: stat, start: 'top 85%' },
    onUpdate: function() {
      stat.textContent = value < 10 ? this.targets()[0].textContent.toFixed(1) + suffix : Math.round(this.targets()[0].textContent) + suffix
    }
  })
})
```

---

### 📌 模块四：性能参数 (Specs)

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│                         性 能 巅 峰                               │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  环形进度 │  │  环形进度 │  │  环形进度 │  │  环形进度 │        │
│  │   98%    │  │   97%    │  │   96%    │  │   99%    │        │
│  │  处理器   │  │  显卡性能 │  │  内存容量 │  │  存储速度 │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          [MotionPath 路径动画区域]                         │   │
│  │          [数据点沿 SVG 路径运动]                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                      │
│  │ CPU │ │ GPU │ │ RAM │ │ SSD │ │屏幕 │                      │
│  │ i9  │ │4090 │ │64GB │ │ 2TB │ │16" │                      │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                      │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// 环形进度动画
document.querySelectorAll('.spec-ring').forEach((ring, index) => {
  const percentage = parseFloat(ring.dataset.percent)
  const circle = ring.querySelector('circle.progress')
  const circumference = 2 * Math.PI * 54
  
  gsap.set(circle, { strokeDasharray: circumference, strokeDashoffset: circumference })
  
  gsap.to(circle, {
    strokeDashoffset: circumference - (circumference * percentage / 100),
    duration: 2, delay: index * 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: '.specs-rings', start: 'top 75%' }
  })
  
  const numEl = ring.querySelector('.spec-number')
  gsap.to({ val: 0 }, {
    val: percentage, duration: 2, delay: index * 0.2, ease: 'power2.out',
    onUpdate: function() { numEl.textContent = Math.round(this.targets()[0].val) + '%' },
    scrollTrigger: { trigger: '.specs-rings', start: 'top 75%' }
  })
  
  gsap.to(ring.querySelector('.ring-glow'), { opacity: 0.5, scale: 1.2, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: index * 0.3 })
})

// MotionPath 路径动画
gsap.registerPlugin(MotionPathPlugin)
const specPath = document.querySelector('#specMotionPath')

document.querySelectorAll('.motion-point').forEach((point, i) => {
  gsap.to(point, {
    motionPath: { path: specPath, align: specPath, alignOrigin: [0.5, 0.5], autoRotate: true },
    duration: 4 + i * 0.5, repeat: -1, yoyo: true, ease: 'none', delay: i * 0.3
  })
})

gsap.to('.motion-point', {
  motionPath: { path: specPath, align: specPath, alignOrigin: [0.5, 0.5] },
  scrollTrigger: { trigger: '.specs-motion-section', start: 'top bottom', end: 'bottom top', scrub: 1 }
})

// 规格卡片
gsap.from('.spec-item', {
  y: 60, opacity: 0, scale: 0.9, stagger: 0.1,
  duration: 0.8, ease: 'back.out(1.4)',
  scrollTrigger: { trigger: '.specs-list', start: 'top 80%' }
})
```

---

### 📌 模块五：产品图库 (Gallery)

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│                         产 品 图 库                               │
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ Morph   │ │  变形   │ │  网格   │ │  变形   │ │  变形   │    │
│  │  Grid   │ │  卡片   │ │  布局   │ │  卡片   │ │  卡片   │    │
│  │ [图片]  │ │ [图片]  │ │ [图片]  │ │ [图片]  │ │ [图片]  │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│  ┌──────────────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │     变形卡片      │ │  变形   │ │  变形   │ │  变形   │       │
│  │     [图片]       │ │  卡片   │ │  卡片   │ │  卡片   │       │
│  │     (跨2列)      │ │ [图片]  │ │ [图片]  │ │ [图片]  │       │
│  └──────────────────┘ └─────────┘ └─────────┘ └─────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  [对比滑块] Before ════════════ After                    │   │
│  │            [图片A]  [滑块]  [图片B]                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// MorphGrid 入场
gsap.fromTo('.gallery-item', 
  { scale: 0.5, opacity: 0, borderRadius: '50%' },
  { scale: 1, opacity: 1, borderRadius: '20px', duration: 1, ease: 'back.out(1.5)',
    stagger: { amount: 1.5, from: 'random' },
    scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%' }
  }
)

// 卡片展开模态框
galleryItems.forEach(item => {
  item.addEventListener('click', function() {
    const img = this.querySelector('img')
    const modal = document.createElement('div')
    modal.className = 'gallery-modal'
    modal.innerHTML = `<div class="gallery-modal-content"><img src="${img.src}" alt="${img.alt}"><button class="gallery-modal-close">×</button></div>`
    document.body.appendChild(modal)
    
    gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    gsap.fromTo(modal.querySelector('img'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
    
    modal.querySelector('.gallery-modal-close').addEventListener('click', () => {
      gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.remove() })
    })
  })
  
  item.addEventListener('mouseenter', () => {
    gsap.to(item, { scale: 1.05, boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)', duration: 0.3 })
    gsap.to(item.querySelector('.gallery-overlay'), { opacity: 1, y: 0, duration: 0.3 })
  })
  item.addEventListener('mouseleave', () => {
    gsap.to(item, { scale: 1, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)', duration: 0.3 })
    gsap.to(item.querySelector('.gallery-overlay'), { opacity: 0, y: 20, duration: 0.3 })
  })
})

// 图片对比滑块
const comparisonSlider = document.querySelector('.comparison-slider')
let isDragging = false

const updateSlider = (x) => {
  const rect = comparisonWrapper.getBoundingClientRect()
  let percentage = ((x - rect.left) / rect.width) * 100
  percentage = Math.max(0, Math.min(100, percentage))
  gsap.to(comparisonSlider, { left: percentage + '%', duration: 0.1, ease: 'none' })
  gsap.to('.comparison-overlay', { width: percentage + '%', duration: 0.1, ease: 'none' })
}

comparisonSlider.addEventListener('mousedown', () => isDragging = true)
document.addEventListener('mouseup', () => isDragging = false)
document.addEventListener('mousemove', (e) => { if (isDragging) updateSlider(e.clientX) })
comparisonSlider.addEventListener('touchstart', () => isDragging = true)
document.addEventListener('touchend', () => isDragging = false)
document.addEventListener('touchmove', (e) => { if (isDragging) updateSlider(e.touches[0].clientX) })
```

---

### 📌 模块六：用户体验 (Use Cases)

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│                         使 用 场 景                               │
│                                                                  │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐  │
│  │                  │ │                  │ │                  │  │
│  │   [3D 翻转卡片]   │ │   [3D 翻转卡片]   │ │   [3D 翻转卡片]   │  │
│  │                  │ │                  │ │                  │  │
│  │     正面内容      │ │     正面内容      │ │     正面内容      │  │
│  ├──────────────────┤ ├──────────────────┤ ├──────────────────┤  │
│  │                  │ │                  │ │                  │  │
│  │     背面详情      │ │     背面详情      │ │     背面详情      │  │
│  │     [了解更多]    │ │     [了解更多]    │ │     [了解更多]    │  │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// 3D 翻转卡片
document.querySelectorAll('.usecase-card').forEach((card, index) => {
  gsap.from(card, {
    y: 80, opacity: 0, scale: 0.8, rotateY: 90,
    duration: 1, delay: index * 0.15, ease: 'back.out(1.7)',
    scrollTrigger: { trigger: '.usecases-grid', start: 'top 75%' }
  })
  
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { rotateY: 180, duration: 0.8, ease: 'back.out(1.5)' })
    gsap.to(card.querySelector('.usecase-icon'), { scale: 1.2, rotate: 15, duration: 0.4 })
  })
  
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
    gsap.to(card.querySelector('.usecase-icon'), { scale: 1, rotate: 0, duration: 0.4 })
  })
})

// 视差滚动
gsap.utils.toArray('.usecase-card').forEach((card, i) => {
  gsap.to(card, { y: -30, scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 } })
})

// 装饰元素
gsap.to('.usecase-decoration-1', { rotation: 360, duration: 20, repeat: -1, ease: 'none' })
gsap.to('.usecase-decoration-2', { rotation: -360, duration: 25, repeat: -1, ease: 'none' })
```

---

### 📌 模块七：技术规格 (Tech Specs)

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│                         技 术 规 格                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   [全息扫描线动画]                                         │   │
│  │                                                          │   │
│  │   处理器        Intel Core i9-14900HX        [▼]         │   │
│  │   ├──────────────────────────────────────────────────┤   │   │
│  │   │ 详细规格内容...                                    │   │   │
│  │   └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │   显卡          NVIDIA GeForce RTX 4090        [▼]     │   │
│  │   内存          64GB DDR5 5600MHz              [▼]     │   │
│  │   存储          2TB PCIe Gen4 NVMe SSD         [▼]     │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// 全息扫描线
gsap.to('.holographic-scan', { top: '100%', duration: 3, repeat: -1, ease: 'power1.inOut', repeatDelay: 1 })

// 规格项入场
gsap.from('.spec-table-item', {
  x: -50, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
  scrollTrigger: { trigger: '.spec-table', start: 'top 80%' }
})

// 规格项展开/折叠
document.querySelectorAll('.spec-table-item').forEach(item => {
  const content = item.querySelector('.spec-content')
  const indicator = item.querySelector('.spec-indicator')
  
  gsap.set(content, { height: 0, opacity: 0 })
  
  item.querySelector('.spec-header').addEventListener('click', () => {
    const isOpen = item.classList.contains('open')
    if (isOpen) {
      item.classList.remove('open')
      gsap.to(content, { height: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut' })
      gsap.to(indicator, { rotation: 0, duration: 0.3 })
    } else {
      item.classList.add('open')
      gsap.to(content, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.inOut' })
      gsap.to(indicator, { rotation: 180, duration: 0.3 })
    }
  })
})

// 进度条动画
document.querySelectorAll('.spec-progress-bar').forEach(bar => {
  const value = bar.dataset.value
  gsap.fromTo(bar, { width: 0 }, {
    width: value + '%', duration: 1.5, ease: 'power2.out',
    scrollTrigger: { trigger: bar, start: 'top 85%' }
  })
})
```

---

### 📌 模块八：客户评价 (Testimonials)

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│                         客 户 评 价                               │
│                                                                  │
│        ◀  ┌────────────────────────────────────────┐  ▶          │
│           │                                        │              │
│           │   " 评价内容文字...                     │              │
│           │      评价内容文字...                     │              │
│           │   "                                        │              │
│           │                    ┌────┐                 │              │
│           │                    │头像│  姓名           │              │
│           │                    └────┘  职位           │              │
│           │                    ★★★★☆                │              │
│           └────────────────────────────────────────┘              │
│                            ●  ○  ○  ○  ○                         │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// 评价轮播
const testimonialCards = gsap.utils.toArray('.testimonial-card')
let currentIndex = 0

testimonialCards.forEach((card, i) => {
  gsap.set(card, { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 0.9, zIndex: i === 0 ? 10 : 1 })
})

function showTestimonial(index) {
  testimonialCards.forEach((card, i) => {
    if (i === index) {
      gsap.to(card, { opacity: 1, scale: 1, zIndex: 10, duration: 0.5, ease: 'power2.out' })
    } else {
      gsap.to(card, { opacity: 0, scale: 0.9, zIndex: 1, duration: 0.5, ease: 'power2.in' })
    }
  })
  gsap.to('.testimonial-dot', { backgroundColor: 'rgba(255, 255, 255, 0.3)', duration: 0.3 })
  gsap.to(`.testimonial-dot:nth-child(${index + 1})`, { backgroundColor: '#3b82f6', duration: 0.3 })
}

let autoplay = setInterval(() => { currentIndex = (currentIndex + 1) % testimonialCards.length; showTestimonial(currentIndex) }, 5000)

document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
  dot.addEventListener('click', () => {
    currentIndex = i; showTestimonial(currentIndex)
    clearInterval(autoplay)
    autoplay = setInterval(() => { currentIndex = (currentIndex + 1) % testimonialCards.length; showTestimonial(currentIndex) }, 5000)
  })
})

// 星级动画
gsap.from('.testimonial-rating .star', { scale: 0, opacity: 0, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' })

// 引用符号
gsap.to('.quote-icon', { scale: 1.1, opacity: 0.3, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut' })
```

---

### 📌 模块九：联系我们 (Contact)

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│                         联 系 我 们                               │
│                                                                  │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │  联系信息                 │  │  发送消息                    │   │
│  │  ─────────                │  │  ─────────                   │   │
│  │  📍 北京市朝阳区科技园...  │  │  ┌─────────────────┐        │   │
│  │  📞 +86 10 8888 8888    │  │  │ 姓名            │        │   │
│  │  ✉️  contact@techpc.com │  │  └─────────────────┘        │   │
│  │  🕐 周一至周五 9:00-18:00│  │  ┌─────────────────┐        │   │
│  │                          │  │  │ 邮箱            │        │   │
│  │  ┌─────────────────────┐│  │  └─────────────────┘        │   │
│  │  │ [社交媒体图标]       ││  │  ┌─────────────────┐        │   │
│  │  │ 微信 微博 领英 YouTube││  │  │ 公司            │        │   │
│  │  └─────────────────────┘│  │  └─────────────────┘        │   │
│  │                          │  │  ┌─────────────────┐        │   │
│  │                          │  │  │                 │        │   │
│  │                          │  │  │  留言内容...    │        │   │
│  │                          │  │  │                 │        │   │
│  │                          │  │  └─────────────────┘        │   │
│  │                          │  │  [发送消息]                  │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// 联系信息入场
gsap.from('.contact-info-item', {
  x: -60, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.7)',
  scrollTrigger: { trigger: '.contact-info', start: 'top 75%' }
})

// 表单入场
gsap.from('.contact-form', {
  x: 60, opacity: 0, duration: 0.8, ease: 'back.out(1.7)',
  scrollTrigger: { trigger: '.contact-form', start: 'top 75%' }
})

// 输入框聚焦
document.querySelectorAll('.form-group').forEach(group => {
  const input = group.querySelector('input, textarea')
  const label = group.querySelector('label')
  
  input.addEventListener('focus', () => {
    gsap.to(group, { borderColor: '#3b82f6', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)', duration: 0.3 })
    gsap.to(label, { y: -25, scale: 0.85, color: '#3b82f6', duration: 0.3 })
  })
  
  input.addEventListener('blur', () => {
    if (!input.value) gsap.to(label, { y: 0, scale: 1, color: '#94a3b8', duration: 0.3 })
    gsap.to(group, { borderColor: 'rgba(255, 255, 255, 0.1)', boxShadow: 'none', duration: 0.3 })
  })
})

// 提交按钮粒子爆炸
submitBtn.addEventListener('click', function(e) {
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('span')
    particle.className = 'submit-particle'
    particle.style.cssText = `position: absolute; width: ${Math.random() * 6 + 4}px; height: ${Math.random() * 6 + 4}px; background: #3b82f6; border-radius: 50%; pointer-events: none;`
    this.appendChild(particle)
    const angle = (i / 15) * Math.PI * 2
    const distance = 50 + Math.random() * 50
    gsap.to(particle, { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, opacity: 0, scale: 0, duration: 0.6, ease: 'power2.out', onComplete: () => particle.remove() })
  }
  gsap.to(this, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 })
})
```

---

### 📌 模块十：页脚 (Footer)

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────────────┐   │
│  │   [无限滚动文字] TechPC · 未来科技 · 极致性能 · 创新无限 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │  [Logo] │  │  产品   │  │  支持   │  │  公司   │             │
│  │  简介... │  │ 笔记本  │  │ 常见问题│  │ 关于我们│             │
│  │ [社交]  │  │ 台式机  │  │ 技术支持│  │ 新闻动态│             │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘             │
│  ────────────────────────────────────────────────────────────    │
│  © 2026 TechPC | 隐私政策 | 服务条款 | ICP备案号                │
└──────────────────────────────────────────────────────────────────┘
```

**GSAP 动画：**

```javascript
// 无限滚动文字
document.querySelectorAll('.infinite-scroll-track').forEach((track, index) => {
  const text = track.querySelector('.scroll-text-content')
  const textWidth = text.offsetWidth
  const clone = text.cloneNode(true)
  track.appendChild(clone)
  const direction = index % 2 === 0 ? -1 : 1
  gsap.to(track, {
    x: direction * -textWidth,
    duration: 30 + index * 5, repeat: -1, ease: 'none',
    modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % textWidth) }
  })
})

// 滚动加速
ScrollTrigger.create({
  trigger: '.infinite-scroll-section',
  start: 'top bottom', end: 'bottom top',
  onUpdate: (self) => {
    document.querySelectorAll('.infinite-scroll-track').forEach(track => {
      gsap.to(track, { timeScale: 1 + self.progress * 3, duration: 0.3 })
    })
  }
})

// 页脚入场
gsap.from('.footer-section', {
  y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
  scrollTrigger: { trigger: 'footer', start: 'top 90%' }
})

// 链接悬停
document.querySelectorAll('.footer-link').forEach(link => {
  link.addEventListener('mouseenter', () => gsap.to(link, { x: 5, color: '#3b82f6', duration: 0.3 }))
  link.addEventListener('mouseleave', () => gsap.to(link, { x: 0, color: '#94a3b8', duration: 0.3 }))
})
```

---

## 三、动画效果系统

### 3.1 全局动画配置

```javascript
gsap.defaults({ ease: 'power2.out', duration: 0.8 })
ScrollTrigger.defaults({ toggleActions: 'play none none reverse', start: 'top 85%' })
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true })
```

### 3.2 页面加载动画

```javascript
window.addEventListener('load', () => {
  gsap.to('.page-loader', { opacity: 0, duration: 0.5, delay: 0.5 })
  gsap.from('.page-wrapper', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' })
  gsap.from('.navbar', { y: -100, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 })
})
```

### 3.3 滚动进度指示器

```javascript
gsap.to('.scroll-progress', {
  scaleX: ScrollTrigger.create({ trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }).progress,
  transformOrigin: 'left center', ease: 'none'
})

ScrollTrigger.create({
  trigger: document.body, start: 'top top', end: 'bottom bottom',
  onUpdate: (self) => { document.querySelector('.scroll-percent').textContent = Math.round(self.progress * 100) + '%' }
})
```

### 3.4 返回顶部按钮

```javascript
const backToTop = document.getElementById('backToTop')

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) gsap.to(backToTop, { opacity: 1, visibility: 'visible', duration: 0.3 })
  else gsap.to(backToTop, { opacity: 0, visibility: 'hidden', duration: 0.3 })
})

backToTop.addEventListener('click', () => {
  gsap.to(window, { scrollTo: 0, duration: 1, ease: 'power3.inOut' })
  gsap.to(backToTop.querySelector('span'), { rotation: 360, duration: 1, ease: 'power2.out' })
})

backToTop.addEventListener('mouseenter', () => gsap.to(backToTop, { scale: 1.1, boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)', duration: 0.3 }))
backToTop.addEventListener('mouseleave', () => gsap.to(backToTop, { scale: 1, boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)', duration: 0.3 }))
```

---

## 四、GSAP 代码模板库

### 4.1 基础入场动画模板

```javascript
// 单元素淡入上移
gsap.from('.element', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.element', start: 'top 85%' } })

// 多元素交错入场
gsap.from('.list-item', { y: 50, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.list-container', start: 'top 80%' } })

// 随机交错入场
gsap.from('.grid-item', { scale: 0.8, opacity: 0, stagger: { amount: 1, from: 'random' }, duration: 0.8, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.grid', start: 'top 75%' } })

// 3D 旋转入场
gsap.from('.rotate-element', { rotateY: -90, opacity: 0, duration: 1, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.rotate-element', start: 'top 80%' } })
```

### 4.2 滚动绑定动画模板

```javascript
// 基础滚动绑定
gsap.to('.element', { y: -100, scrollTrigger: { trigger: '.element', start: 'top bottom', end: 'bottom top', scrub: 1 } })

// 带 snap 的滚动
ScrollTrigger.create({ trigger: '.snap-container', start: 'top top', end: () => '+=' + containerHeight, snap: { snapTo: 1 / (slides.length - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.1 } })

// 颜色变化
ScrollTrigger.create({
  trigger: '.color-section', start: 'top center', end: 'bottom center',
  onUpdate: (self) => {
    const color = gsap.utils.interpolate('#0f172a', '#1e293b', self.progress)
    gsap.to('.color-section', { backgroundColor: color, duration: 0.1 })
  }
})
```

### 4.3 3D 效果模板

```javascript
// 3D 卡片倾斜
card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left, y = e.clientY - rect.top
  gsap.to(card, { rotateX: (y - rect.height / 2) / 10, rotateY: (rect.width / 2 - x) / 10, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 })
})
card.addEventListener('mouseleave', () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }))

// 3D 翻转
flipCard.addEventListener('mouseenter', () => gsap.to(inner, { rotateY: 180, duration: 0.8, ease: 'back.out(1.5)' }))
flipCard.addEventListener('mouseleave', () => gsap.to(inner, { rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }))
```

### 4.4 文字动画模板

```javascript
// 字符拆分动画
const chars = text.split('').map(char => `<span class="char">${char}</span>`).join('')
element.innerHTML = chars
gsap.from('.char', { y: 50, opacity: 0, rotationX: -90, stagger: 0.05, duration: 0.8, ease: 'back.out(1.7)', scrollTrigger: { trigger: element, start: 'top 80%' } })

// 打字机效果
let index = 0
const interval = setInterval(() => { element.textContent = text.substring(0, index++) if (index > text.length) clearInterval(interval) }, 100)

// 渐变文字
gsap.to('.gradient-text', { backgroundPosition: '200% center', duration: 3, repeat: -1, ease: 'none' })
```

### 4.5 磁性吸附模板

```javascript
magneticBtn.addEventListener('mousemove', (e) => {
  const rect = magneticBtn.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2, y = e.clientY - rect.top - rect.height / 2
  gsap.to(magneticBtn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' })
})
magneticBtn.addEventListener('mouseleave', () => gsap.to(magneticBtn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }))
```

### 4.6 粒子效果模板

```javascript
function createParticles(container, count = 50) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    const size = Math.random() * 4 + 1, isGlowing = Math.random() > 0.85
    particle.style.cssText = `position: absolute; width: ${size}px; height: ${size}px; background: ${isGlowing ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.5)'}; border-radius: 50%; left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; ${isGlowing ? 'box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);' : ''}`
    container.appendChild(particle)
    gsap.to(particle, { y: `-=${100 + Math.random() * 150}`, x: `random(-50, 50)`, opacity: 0, duration: `random(4, 10)`, repeat: -1, delay: `random(0, 3)`, ease: 'none' })
  }
}
```

---

## 五、技术规范总结

### 5.1 类名命名规范

| 模块 | 前缀 | 示例 |
|------|------|------|
| 加载器 | `.loader-` | `.loader-wrapper`, `.loader-progress-bar` |
| 导航栏 | `.nav-` | `.nav-logo`, `.nav-link`, `.nav-cta-btn` |
| Hero | `.hero-` | `.hero-title`, `.hero-cta-btn`, `.hero-particle` |
| 特性 | `.feature-` | `.feature-card`, `.feature-icon`, `.feature-title` |
| 参数 | `.spec-` | `.spec-ring`, `.spec-item`, `.spec-value` |
| 图库 | `.gallery-` | `.gallery-grid`, `.gallery-item`, `.gallery-modal` |
| 场景 | `.usecase-` | `.usecase-card`, `.usecase-icon` |
| 规格 | `.techspecs-` | `.spec-table`, `.spec-header`, `.spec-content` |
| 评价 | `.testimonial-` | `.testimonial-card`, `.testimonial-text` |
| 联系 | `.contact-` | `.contact-form`, `.contact-info` |
| 页脚 | `.footer-` | `.footer-section`, `.footer-link` |

### 5.2 GSAP 动画参数规范

| 类型 | 时长 | 缓动函数 | 适用场景 |
|------|------|---------|---------|
| 入场动画 | 0.8-1.2s | `back.out(1.7)` | 元素首次出现 |
| 交互动画 | 0.2-0.4s | `power2.out` | 悬停、点击反馈 |
| 滚动动画 | scrub | - | 滚动绑定效果 |
| 弹性动画 | 0.5-1s | `elastic.out(1, 0.5)` | 弹回、复原 |
| 持续动画 | repeat: -1 | `sine.inOut` | 背景装饰 |

### 5.3 CDN 引入

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollToPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/MotionPathPlugin.min.js"></script>
```

---

## 六、项目集成指南

### 6.1 完整 HTML 结构模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TechPC | 高端电脑设备官网</title>
  
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollToPlugin.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/MotionPathPlugin.min.js"></script>
  
  <style>
    :root {
      --color-primary: #3b82f6;
      --color-dark: #0f172a;
      --color-text: #f8fafc;
      --gradient-primary: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; background: var(--color-dark); color: var(--color-text); overflow-x: hidden; }
  </style>
</head>
<body>
  <div class="loader-wrapper">
    <div class="loader-logo">TechPC</div>
    <div class="loader-progress"><div class="loader-progress-bar"></div></div>
    <div class="loader-percent">0%</div>
  </div>
  
  <div class="scroll-progress"></div>
  
  <nav class="navbar">
    <div class="navbar-container">
      <a href="#" class="nav-logo"><span class="nav-logo-glow"></span>TechPC</a>
      <div class="nav-links">
        <a href="#home" class="nav-link">首页</a>
        <a href="#features" class="nav-link">产品</a>
        <a href="#specs" class="nav-link">技术</a>
        <a href="#contact" class="nav-link">联系</a>
        <a href="#" class="nav-cta-btn">立即购买</a>
      </div>
      <button class="theme-toggle"><span class="theme-icon">☀️</span></button>
      <div class="menu-toggle"><span class="menu-line"></span><span class="menu-line"></span><span class="menu-line"></span></div>
    </div>
  </nav>
  
  <section class="hero-section" id="home">
    <div class="hero-background">
      <div class="hero-grid"></div>
      <div class="hero-aurora-gradient"></div>
      <div class="hero-aurora-1"></div>
      <div class="hero-aurora-2"></div>
      <div class="hero-glow hero-glow-1"></div>
      <div class="hero-glow hero-glow-2"></div>
      <div class="hero-particles"></div>
    </div>
    
    <div class="hero-content">
      <h1 class="hero-title"></h1>
      <div class="hero-subtitle-wrapper">
        <p class="hero-subtitle">解锁无限可能，定义新一代计算体验</p>
        <div class="hero-subtitle-line"></div>
      </div>
      <div class="hero-cta-group">
        <a href="#features" class="hero-cta-btn primary">探索产品</a>
        <a href="#" class="hero-cta-btn secondary">观看演示</a>
      </div>
    </div>
    
    <div class="hero-computer-wrapper">
      <div class="hero-computer">
        <div class="computer-glow"></div>
        <div class="computer-particles"></div>
        <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800" alt="MacBook Pro" class="computer-image">
      </div>
    </div>
    
    <div class="scroll-indicator"><span>向下滚动</span><div class="arrow-line"></div></div>
  </section>
  
  <!-- 其他区块... -->
  
  <div class="back-to-top" id="backToTop"><span>↑</span></div>
  
  <script>
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, MotionPathPlugin)
    
    function initAll() {
      createParticles()
      initNavigation()
      initAnimations()
      initScrollProgress()
      initBackToTop()
    }
    
    document.addEventListener('DOMContentLoaded', initAll)
  </script>
</body>
</html>
```

### 6.2 性能优化建议

```javascript
// 使用 will-change
.animated-element { will-change: transform, opacity; }

// 使用 gsap.context()
const ctx = gsap.context(() => { /* 动画代码 */ }, container)
onUnmounted(() => ctx.revert())

// 限制同时动画
gsap.from(items, { stagger: 0.1, /* ... */ })

// 清理动画
onUnmounted(() => { ScrollTrigger.getAll().forEach(st => st.kill()) })
```

---

## 结语

本设计方案为高端电脑科技企业官网提供了完整的视觉规范、交互设计和 GSAP 动画实现指南。通过合理运用这些设计元素和动画效果，可以打造出一个专业、震撼、流畅的电脑产品官网。

**输出文件：** `page-demo/demo20/index.html`
**最终交付物：** 单文件 HTML（包含所有 CSS、JS），可直接在浏览器中运行
