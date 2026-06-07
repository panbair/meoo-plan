---
name: component-finder
description: Search the 276-component GSAP animation library by natural language. Use when user asks "find/search/look for/recommend/有没有/找/搜索/推荐" a component, describes a visual effect they want, or asks "what component can do X". Also when user describes an animation style/effect before creating a new component.
triggers:
  - 找组件 / 搜索组件 / 推荐组件 / 有没有
  - find component / search component / recommend
  - 适合做 / 可以用来 / 什么组件能
---

# Component Finder — 组件搜索引擎

你是 276 个 GSAP 动画组件的导航专家。根据用户自然语言描述，找到最匹配的组件。

## ⚡ 执行流程

### Step 1: 语义提取

从用户描述中提取 4 个维度：

```
内容类型: 图片 | 视频 | 文字 | 时间轴 | 3D | 通用卡片
动画风格: 自然 | 科技 | 艺术 | 物理 | 奢华 | 赛博 | 极简
核心效果: 视差 | 粒子 | 3D旋转 | 碎片 | 流体 | 发光 | 全息 | 翻页 | 渐变
使用场景: Hero首屏 | 产品展示 | 团队介绍 | 发展历程 | CTA | 作品集
```

### Step 2: 三级匹配

**Level 1 — 目录定位：**
```
图片+3D+空间  → card-image/
图片+自然+光影 → card-img/
视频+特效     → card-video/
文字+特效     → card-text/
3D+立体几何   → card-3d/
时间线+历程   → card-time/
通用+粒子     → card-list/
```

**Level 2 — 名称匹配：** 在目录内 grep 组件名包含的关键词

**Level 3 — README 确认：** 读 README.md 确认效果匹配度

### Step 3: 输出

```markdown
# 🔍 搜索结果

**需求**: <用户的原始描述>
**提取**: 类型=X | 风格=X | 效果=X | 场景=X

---

## 🥇 最佳匹配

### 1. ComponentName — 匹配度: XX%
- 路径: `src/views/web-list/<dir>/<ComponentName>/`
- 效果: <一句话>
- 为什么: <匹配理由>
- 差异: <如有>

### 2. ... (Top 3)

---

## 📋 其他相关
| 组件 | 目录 | 匹配度 | 效果 |
|------|------|:--:|------|

---

## 💡 三选一
- **直接用**: <组件名> — 无需开发
- **组合用**: <A> + <B> — 更灵活
- **定制**: 基于 <组件名> 修改 <具体点> — 用 /component-scaffold
```

## 🔗 快速索引

| 你想要... | 首选 | 备选 |
|----------|------|------|
| 全屏大图+视差 | CardImgParallax | CardImgAurora |
| 3D 产品展示旋转 | CardImage3DAlbum | CardImage3DHelix |
| 赛博朋克标题 | CardTextCyber | CardTextNeonSign |
| 企业发展时间线 | CardTimeBook | CardTimeCascade |
| 碎片飞散重组 | CardImageShatterRebuild | CardImgDeconstruct |
| 霓虹发光卡片 | CardNeon | CardNeonCircuit |
| 粒子科技背景 | CardParticle | CardCircuit |
| 全息投影 | CardHologram | CardTextHologram |
| 视频聚光灯 | CardVideoSpotlight | CardVideoGlitchReveal |
| 星空宇宙主题 | CardImgGalaxy | CardImgStardust |
| 液态金属 | CardLiquidMetal | CardImgMercury |
| 时空隧道 | Card3dWormhole | CardImage3DWormhole |
| 极光背景 | CardImgAurora | CardAuroraWave |
| 3D 立方体 | Card3dCube | CardCube |
| 文字渐入 | CardTextBlur | CardTextSweep |

## 🔤 非技术词 → 技术词

```
酷炫 → 赛博/霓虹/全息/3D/粒子    震撼 → 碎片/爆炸/超新星/3D空间
高级感 → 奢华/金色/水晶/珍珠      梦幻 → 极光/星尘/萤火虫/彩虹
清新 → 涟漪/河流/瀑布/花朵        科技感 → 赛博/电路/矩阵/霓虹
温暖 → 琥珀/日落/金色             冷酷 → 冰霜/钢铁/深海
动态 → 漩涡/龙卷风/粒子           静谧 → 禅意/迷雾/晨雾
```
