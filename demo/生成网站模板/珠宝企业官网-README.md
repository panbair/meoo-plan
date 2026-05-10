# 💎 璀璨珠宝企业官网

基于"珠宝元素主题模板-终极企业版-专业完美版 v3.0"开发的真实企业网站项目。

---

## 📋 项目概述

- **项目名称**: 璀璨珠宝企业官网
- **模板版本**: v3.0.0 专业完美版
- **技术栈**: HTML5 + CSS3 + GSAP + JavaScript
- **浏览器支持**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **响应式**: 支持桌面、平板、手机
- **无障碍**: 符合 WCAG 2.1 AA 级标准

---

## 🚀 快速开始

### 1. 克隆或下载项目

```bash
# 直接下载
下载整个项目文件夹到本地

# 或使用Git克隆
git clone [项目地址]
cd jewelry-enterprise-website
```

### 2. 本地开发服务器

#### 方式一: 使用VSCode Live Server

1. 在VSCode中安装 "Live Server" 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

#### 方式二: 使用Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### 方式三: 使用Node.js

```bash
# 安装http-server
npm install -g http-server

# 启动服务
http-server -p 8000
```

#### 方式四: 直接打开

直接在浏览器中打开 `index.html` 文件（某些功能可能受限）

### 3. 访问网站

打开浏览器访问: `http://localhost:8000`

---

## 📁 项目结构

```
jewelry-enterprise-website/
├── index.html                      # 主页面
├── css/
│   ├── variables.css              # CSS变量系统
│   ├── base.css                   # 基础样式
│   ├── components.css             # 组件样式
│   ├── animations.css             # 动画关键帧
│   └── responsive.css             # 响应式样式
├── js/
│   ├── config.js                  # 配置文件
│   ├── utils.js                   # 工具函数库
│   ├── accessibility.js           # 无障碍支持
│   ├── performance.js             # 性能优化系统
│   ├── compatibility.js           # 兼容性检测
│   ├── animations/
│   │   ├── crystalPrism.js        # 水晶棱镜效果
│   │   ├── neonPrism.js           # 霓虹棱镜卡片
│   │   ├── hologram.js            # 全息投影画廊
│   │   ├── aurora.js              # 极光领域背景
│   │   └── elegantCards.js        # 优雅卡片
│   ├── main.js                    # 应用入口
│   └── components/
│       ├── navigation.js          # 导航栏
│       ├── hero.js                # Hero区域
│       ├── products.js            # 产品展示
│       ├── contact.js             # 联系表单
│       └── backToTop.js           # 返回顶部
└── assets/
    ├── images/                    # 图片资源
    ├── fonts/                     # 字体文件
    └── icons/                     # 图标资源
```

---

## ⚙️ 配置说明

### 修改品牌信息

编辑 `js/config.js` 文件:

```javascript
content: {
  brand: {
    name: '你的品牌名称',
    slogan: '你的品牌口号',
    description: '品牌描述'
  }
}
```

### 修改联系方式

编辑 `js/config.js` 文件:

```javascript
contact: {
  email: 'contact@yourdomain.com',
  phone: '+86 400-XXX-XXXX',
  address: '你的地址',
  hours: '营业时间'
}
```

### 修改SEO信息

编辑 `index.html` 文件头部的meta标签:

```html
<title>你的网站标题</title>
<meta name="description" content="网站描述">
<meta name="keywords" content="关键词1, 关键词2">
```

### 修改颜色主题

编辑 `css/variables.css` 文件:

```css
:root {
  --color-gold-500: #eab308;  /* 修改为你的品牌色 */
  --color-gold-400: #facc15;
  --color-gold-600: #ca8a04;
}
```

---

## 🎨 样式自定义

### 替换Logo

将你的Logo图片放入 `assets/images/` 文件夹,然后修改HTML中的Logo部分:

```html
<div class="nav-logo">
  <a href="#" class="logo-link">
    <img src="assets/images/logo.png" alt="Logo" class="logo-image">
  </a>
</div>
```

### 替换产品图片

将产品图片放入 `assets/images/products/` 文件夹,然后修改产品卡片:

```html
<div class="product-image">
  <img src="assets/images/products/product1.jpg" alt="产品名称">
</div>
```

---

## 🔧 功能说明

### 动画组件

| 组件 | 文件 | 说明 |
|------|------|------|
| 水晶棱镜 | `crystalPrism.js` | 钻石系列展示,3D旋转效果 |
| 霓虹棱镜 | `neonPrism.js` | 夜间系列,霓虹光晕效果 |
| 全息投影 | `hologram.js` | 工艺展示,全息投影效果 |
| 极光背景 | `aurora.js` | Hero区域,Canvas极光动画 |
| 优雅卡片 | `elegantCards.js` | 品牌理念,优雅卡片展示 |

### 性能优化

项目包含完整的性能优化系统:

- FPS监控
- 内存监控
- 自动降级
- 懒加载
- 虚拟滚动

### 无障碍支持

- 键盘导航
- 屏幕阅读器支持
- 减少动画偏好
- 高对比度模式
- 焦点管理

---

## 📱 响应式断点

| 断点 | 屏幕宽度 | 设备 |
|------|---------|------|
| xs | ≤480px | 超小屏手机 |
| sm | ≤640px | 小屏手机 |
| md | ≤768px | 平板 |
| lg | ≤1024px | 笔记本 |
| xl | ≤1280px | 台式机 |
| 2xl | ≤1536px | 大屏显示器 |

---

## 🌐 部署指南

### 静态托管平台

#### Vercel

```bash
# 安装Vercel CLI
npm install -g vercel

# 部署
vercel
```

#### Netlify

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 部署
netlify deploy --prod
```

#### GitHub Pages

1. 将项目上传到GitHub仓库
2. 进入仓库Settings > Pages
3. 选择Source分支和目录
4. 保存即可访问

### 传统服务器

1. 将所有文件上传到服务器
2. 配置Nginx/Apache
3. 绑定域名
4. 启用HTTPS

### 部署检查清单

- [ ] 替换所有占位图片
- [ ] 修改所有文本内容
- [ ] 配置正确的SEO信息
- [ ] 更新联系方式
- [ ] 测试所有链接
- [ ] 检查表单提交
- [ ] 验证响应式布局
- [ ] 测试动画性能
- [ ] 检查无障碍功能

---

## 🐛 常见问题

### Q: 动画卡顿怎么办?

A:
1. 检查性能监控报告: `console.log(JewelryApp.getPerformance())`
2. 启用性能优化: `JewelryApp.optimizePerformance('high')`
3. 禁用不需要的动画组件
4. 减少粒子数量

### Q: 浏览器不支持某些特性?

A:
1. 查看兼容性报告: `console.log(JewelryApp.getCompatibility())`
2. 系统会自动降级
3. 建议使用Chrome 90+或Firefox 88+

### Q: 如何自定义颜色?

A:
1. 编辑 `css/variables.css` 文件
2. 修改对应的CSS变量
3. 保存并刷新页面

### Q: 表单提交如何配置?

A:
1. 需要后端支持
2. 修改 `js/components/contact.js` 中的表单提交逻辑
3. 或使用第三方服务如Formspree

### Q: 如何添加新的页面?

A:
1. 创建新的HTML文件
2. 复制 `index.html` 的结构
3. 修改内容和导航链接
4. 更新 `nav-links` 部分

---

## 📞 技术支持

如需技术支持,请联系:

- 📧 Email: support@zooow-animation.com
- 🌐 Website: https://zooow-animation.com
- 📱 WeChat: ZooowAnimation

---

## 📄 许可证

本模板由 Zooow Animation Studio 开发,仅供商业项目使用。

---

## 📊 项目统计

- 📦 总文件数: 50+
- 📄 HTML文件: 1
- 🎨 CSS文件: 5
- ⚡ JS文件: 15+
- 🎭 动画组件: 5
- 📱 响应式断点: 6
- ♿ 无障碍等级: WCAG 2.1 AA

---

## 🎯 开发路线图

- [x] v1.0 - 基础功能
- [x] v2.0 - 动画增强
- [x] v3.0 - 专业完美版
- [ ] v3.1 - 多语言支持
- [ ] v3.2 - CMS集成
- [ ] v3.3 - PWA支持
- [ ] v4.0 - SSR版本

---

**💎 璀璨珠宝 - 永恒之美，璀璨传承**
