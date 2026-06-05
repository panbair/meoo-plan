# CardImageQuantumLeap — 量子叠加

## 概述
薛定谔的图片——多张图以"叠加态"同时存在（半透明+干涉图样），滚动=观测行为触发波函数坍缩，一张图片从概率云中实体化。

## 核心动画
```
叠加态(多图半透明+干涉) → 坍缩(filter blur→0, opacity→1) →
确定态驻留 → 退相干(重新叠加) → 下一帧坍缩
```

## 视觉元素
- SVG feTurbulence + feDisplacementMap 量子干涉滤镜
- Canvas概率云粒子(120个)
- 叠加态指示器(5个轨道光点)
- 波函数可视化(底部wave层scaleY脉动)
- 量子蓝/青配色

## 技术要点
- SVG滤镜动态参数(通过GSAP proxy对象)
- 多帧半透明叠加模拟量子态
- filter blur + opacity 坍缩/退相干
- ur(#ql-interference) / ur(#ql-wave) 滤镜切换
