# 探索视界 · WanderScape 开发方案文档

## 项目概述

**项目名称**: 探索视界 · WanderScape  
**项目类型**: 沉浸式旅行体验平台  
**技术栈**: React 18 + TypeScript + Tailwind CSS + GSAP + Webpack  
**设计理念**: 全屏大图视觉 + GSAP 滚动视差动画 + 3D 立体效果

---

## 一、项目架构

### 1.1 技术选型

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | 核心框架 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.x | 样式系统 |
| GSAP | 3.x | 动画引擎 |
| @gsap/react | 最新 | React GSAP 集成 |
| Webpack | 5.x | 构建工具 |
| FontAwesome | 6.x | 图标库 |

### 1.2 项目结构

```
/home/project/
├── public/
│   └── index.html              # HTML 入口
├── src/
│   ├── components/             # 组件目录
│   │   ├── Navbar.tsx          # 导航栏组件
│   │   ├── Hero.tsx            # 首屏英雄区
│   │   ├── Destinations.tsx    # 目的地展示
│   │   ├── Experiences.tsx     # 体验项目
│   │   ├── StoryCards.tsx      # 故事卡片
│   │   ├── PackageCards.tsx    # 套餐卡片
│   │   ├── Community.tsx       # 社区模块
│   │   ├── Contact.tsx         # 联系表单
│   │   ├── Footer.tsx          # 页脚
│   │   ├── LoadingScreen.tsx   # 加载动画
│   │   ├── ScrollProgress.tsx  # 滚动进度条
│   │   ├── ImagePlaceholder.tsx# 图片占位
│   │   └── MagneticButton.tsx  # 磁吸按钮
│   ├── hooks/
│   │   └── useTheme.ts         # 主题切换 Hook
│   ├── styles/
│   │   └── index.css           # 全局样式
│   ├── App.tsx                 # 主应用组件
│   └── index.tsx               # 应用入口
├── package.json                # 依赖配置
├── webpack.config.js           # Webpack 配置
├── tailwind.config.js          # Tailwind 配置
├── postcss.config.js           # PostCSS 配置
└── tsconfig.json               # TypeScript 配置
```

---

## 二、核心功能模块

### 2.1 首屏 Hero 模块

**功能描述**:
- 全屏背景大图轮播
- 3D 立体标题 "探索视界"
- 视差滚动效果
- 导航栏固定定位

**技术实现**:
```typescript
// 3D 文字效果实现
const titleStyle = {
  textShadow: `
    1px 1px 0 #C9A962,
    2px 2px 0 #b8984f,
    3px 3px 0 #a68646,
    4px 4px 0 #95743d,
    5px 5px 10px rgba(0,0,0,0.3)
  `
};

// GSAP 视差动画
gsap.to(imageRef.current, {
  yPercent: 30,
  ease: "none",
  scrollTrigger: {
    trigger: sectionRef.current,
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});
```

**图片规格**:
- 分辨率: 2400px 宽度
- 质量: q=90
- 格式: WebP/JPG
- 来源: Unsplash

### 2.2 目的地展示模块 (Destinations)

**功能描述**:
- 全屏大图展示
- 多样化视差动画（上下/左右/旋转）
- 文字内容渐入效果
- 响应式布局

**动画策略**:
```typescript
// 基于索引的多样化动画
const getAnimationPattern = (index: number) => {
  switch (index % 4) {
    case 0: return { yPercent: 20, xPercent: 0, rotation: 0 };      // 向上视差
    case 1: return { yPercent: -15, xPercent: 10, rotation: 2 };    // 右上移动
    case 2: return { yPercent: 25, xPercent: -8, rotation: -1 };    // 左下移动
    case 3: return { yPercent: -20, xPercent: 5, rotation: 1.5 };   // 旋转效果
  }
};
```

### 2.3 体验项目模块 (Experiences)

**功能描述**:
- 三列卡片布局
- 悬停放大效果
- 滚动触发动画
- 图片懒加载

**交互设计**:
- 卡片悬停: scale(1.05) + 阴影增强
- 图片加载: shimmer 占位动画
- 滚动触发: stagger 延迟动画

### 2.4 故事卡片模块 (StoryCards)

**功能描述**:
- 横向滚动故事线
- 时间轴设计
- 图片视差效果
- 文字渐入动画

### 2.5 套餐卡片模块 (PackageCards)

**功能描述**:
- 价格卡片展示
- 特性列表
- CTA 按钮
- 磁吸悬停效果

### 2.6 社区模块 (Community)

**功能描述**:
- 用户评价展示
- 头像网格
- 统计数据动画
- 社交链接

### 2.7 联系表单模块 (Contact)

**功能描述**:
- 表单验证
- 提交动画
- 成功状态反馈
- 响应式布局

---

## 三、动画系统

### 3.1 GSAP ScrollTrigger 配置

```typescript
// 全局 ScrollTrigger 默认配置
gsap.defaults({
  ease: "power2.out",
  duration: 1
});

ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
  markers: false // 生产环境关闭
});
```

### 3.2 动画类型清单

| 动画类型 | 应用场景 | 实现方式 |
|---------|---------|---------|
| 视差滚动 | 全屏图片 | yPercent/xPercent + scrub |
| 渐入效果 | 文字内容 | opacity + y + stagger |
| 缩放效果 | 卡片悬停 | scale + transition |
| 旋转效果 | 特色模块 | rotation + scrollTrigger |
| 磁吸效果 | 按钮交互 | mousemove + transform |
| 进度条 | 页面滚动 | scroll event + width |
| 加载动画 | 页面初始化 | timeline + progress |

### 3.3 性能优化

```css
/* GPU 加速 */
.will-change-transform {
  will-change: transform;
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 四、组件详细设计

### 4.1 LoadingScreen 组件

**功能**: 页面加载动画
**特性**:
- 品牌 Logo 展示
- 进度条动画
- 自动隐藏 (2秒后)
- 平滑过渡

```typescript
interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

// 核心逻辑
const [progress, setProgress] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    setProgress(p => Math.min(p + Math.random() * 15, 100));
  }, 150);
  return () => clearInterval(interval);
}, []);
```

### 4.2 ScrollProgress 组件

**功能**: 顶部滚动进度指示器
**特性**:
- 实时计算滚动百分比
- 渐变色进度条
- 显示/隐藏控制

```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    setProgress(scrollPercent);
    setIsVisible(scrollTop > 100);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
}, []);
```

### 4.3 ImagePlaceholder 组件

**功能**: 图片懒加载占位
**特性**:
- shimmer 闪烁动画
- 淡入效果
- 错误处理

```typescript
interface ImagePlaceholderProps {
  src: string;
  alt: string;
  className?: string;
}

// shimmer 动画 CSS
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 4.4 MagneticButton 组件

**功能**: 磁吸悬停效果按钮
**特性**:
- 鼠标跟随
- 弹性回位
- 涟漪点击效果

```typescript
const handleMouseMove = (e: React.MouseEvent) => {
  const rect = buttonRef.current?.getBoundingClientRect();
  if (!rect) return;
  const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
  const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
  setPosition({ x, y });
};
```

---

## 五、样式系统

### 5.1 设计令牌

```javascript
// tailwind.config.js
colors: {
  primary: '#C9A962',      // 金色主色
  'primary-dark': '#b8984f',
  secondary: '#E8DCC4',    // 米白辅色
  background: '#0A0A0A',   // 深色背景
  surface: '#1a1a1a',      // 卡片表面
}
```

### 5.2 字体规范

- **标题字体**: system-ui, sans-serif (font-light)
- **正文字体**: system-ui, sans-serif (font-normal)
- **字号层级**:
  - Hero 标题: text-6xl ~ text-8xl
  - 模块标题: text-4xl ~ text-5xl
  - 卡片标题: text-xl ~ text-2xl
  - 正文: text-base ~ text-lg

### 5.3 间距系统

- 模块间距: py-24 ~ py-32
- 容器内边距: px-4 ~ px-8
- 卡片间距: gap-6 ~ gap-8
- 元素间距: space-y-4 ~ space-y-6

---

## 六、路由与导航

### 6.1 导航结构

```typescript
const navItems = [
  { label: '首页', href: '#home' },
  { label: '目的地', href: '#destinations' },
  { label: '体验', href: '#experiences' },
  { label: '故事', href: '#stories' },
  { label: '套餐', href: '#packages' },
  { label: '社区', href: '#community' },
  { label: '联系', href: '#contact' }
];
```

### 6.2 平滑滚动

```typescript
const scrollToSection = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
```

### 6.3 导航栏行为

- 始终固定在顶部
- 背景透明/半透明切换
- 滚动时保持可见
- 移动端汉堡菜单

---

## 七、图片资源管理

### 7.1 图片来源

- **Unsplash**: 高质量免费图片
- **格式**: `https://images.unsplash.com/photo-{ID}?w=2400&q=90&auto=format&fit=crop`

### 7.2 图片分类

| 模块 | 数量 | 尺寸要求 |
|------|------|---------|
| Hero 轮播 | 3张 | 2400x1600 |
| 目的地 | 4张 | 2400x1600 |
| 体验项目 | 3张 | 800x600 |
| 故事卡片 | 4张 | 600x800 |
| 套餐展示 | 3张 | 800x600 |
| 社区头像 | 6张 | 200x200 |

### 7.3 优化策略

- 懒加载 (loading="lazy")
- WebP 格式优先
- 响应式图片 (srcset)
- 占位 shimmer 效果

---

## 八、开发流程

### 8.1 环境搭建

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm run dev

# 3. 生产构建
pnpm run build
```

### 8.2 开发顺序

1. 基础配置 (webpack, tailwind, tsconfig)
2. 全局样式 (index.css)
3. 布局组件 (Navbar, Footer)
4. 核心页面 (Hero, Destinations)
5. 功能模块 (Experiences, StoryCards, etc.)
6. 动画增强 (LoadingScreen, ScrollProgress)
7. 性能优化 (懒加载, 代码分割)
8. 测试验证 (构建预览)

### 8.3 代码规范

- 2 空格缩进
- 单引号字符串
- 无分号 (除必要情况)
- 组件名 PascalCase
- 函数名 camelCase
- 无注释 (除非必要)

---

## 九、性能指标

### 9.1 目标指标

| 指标 | 目标值 |
|------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |

### 9.2 优化措施

- 图片懒加载
- 代码分割
- CSS 优化
- 动画性能 (will-change)
- 减少重排重绘

---

## 十、浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 十一、项目文件清单

### 11.1 配置文件

| 文件 | 用途 |
|------|------|
| package.json | 依赖管理 |
| webpack.config.js | 构建配置 |
| tailwind.config.js | 样式配置 |
| postcss.config.js | CSS 处理 |
| tsconfig.json | TypeScript 配置 |

### 11.2 源代码文件

| 文件 | 行数 | 功能 |
|------|------|------|
| App.tsx | ~50 | 主应用组件 |
| Navbar.tsx | ~150 | 导航栏 |
| Hero.tsx | ~200 | 首屏英雄区 |
| Destinations.tsx | ~270 | 目的地展示 |
| Experiences.tsx | ~260 | 体验项目 |
| StoryCards.tsx | ~250 | 故事卡片 |
| PackageCards.tsx | ~270 | 套餐卡片 |
| Community.tsx | ~300 | 社区模块 |
| Contact.tsx | ~230 | 联系表单 |
| Footer.tsx | ~110 | 页脚 |
| LoadingScreen.tsx | ~45 | 加载动画 |
| ScrollProgress.tsx | ~35 | 滚动进度 |
| ImagePlaceholder.tsx | ~30 | 图片占位 |
| MagneticButton.tsx | ~45 | 磁吸按钮 |

---

## 十二、总结

本项目通过以下核心设计打造沉浸式旅行体验平台:

1. **视觉设计**: 全屏大图 + 深色主题 + 金色点缀
2. **动画系统**: GSAP ScrollTrigger 实现多样化视差效果
3. **交互体验**: 磁吸按钮 + 加载动画 + 滚动进度
4. **性能优化**: 懒加载 + 代码分割 + GPU 加速
5. **响应式**: 移动端适配 + 触摸优化

项目体现了现代 Web 设计的最佳实践,兼顾视觉冲击力与用户体验。
