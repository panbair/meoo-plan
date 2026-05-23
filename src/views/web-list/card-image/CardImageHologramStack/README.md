## CardImageHologramStack — 全息图层堆叠

**RGB 通道分离 × 色差偏移 × 全息扫描线**

### 🔴🟢🔵 核心技术

| 技术 | 实现 |
|------|------|
| **通道分离** | SVG `feColorMatrix` 分别提取 R/G/B 三个通道，保留各自色彩矩阵 |
| **色差偏移** | 红层 `translateX(-14px)` → 绿层 `0px` → 蓝层 `translateX(+14px)`，滚动对齐至 0 |
| **混合合成** | 三层均用 `mix-blend-mode: screen` 叠加，合成完整彩色图像 |
| **扫描线** | 水平线从上→下移动，120px 辉光区域 + 2px 核心线 + `box-shadow` 三层发光 |

### 🎞️ 6层架构

| 层 | 内容 | 技术 |
|:---:|------|------|
| L1 | 红色通道 | `feColorMatrix` 只保留 R 分量 + `screen` 混合 |
| L2 | 绿色通道 | `feColorMatrix` 只保留 G 分量 + `screen` 混合 |
| L3 | 蓝色通道 | `feColorMatrix` 只保留 B 分量 + `screen` 混合 |
| L4 | 扫描线 | 渐变翠绿线 + 辉光区 + 脉冲动画 `scanLinePulse` 2s |
| L5 | 底片网格 | `repeating-linear-gradient` 双重 2px 间距翠绿网格 + `overlay` 混合 |
| L6 | RGB 噪点 | Canvas 100ms 刷新, ~(面积/800) 颗彩色随机像素 + `screen` 混合 |

### 🎬 滚动动画 (scrub=1.2)

| 进度 | 色差偏移 | 扫描线 | 网格 | 边框 |
|:---:|:---:|:---:|:---:|:---:|
| 0% | ±14px 最大 | 顶部 0% | opacity 0.5 | 0.5→0.8→0.3 闪烁 |
| 50% | ±7px 半途 | 中部 50% | →0.15 渐隐 | 0.25 |
| 85% | ±2.1px | 85% | 最低 | 0.25→0.9→0.95 冲刺 |
| 100% | 0px 完美对齐 | 底部 100% | 0.35 回升 | 0.95 完成 |

### ⚡ 自动发现

通过 `import.meta.glob` 自动注册，零手动配置。
