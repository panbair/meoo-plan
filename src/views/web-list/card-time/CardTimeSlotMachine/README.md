# CardTimeSlotMachine 老虎机

## 效果描述
三列卡片高速滚动后逐列停下，对齐时触发"中奖"特效。

## 技术实现
### 动画阶段
1. **拉杆** — 拉杆动画触发
2. **高速滚动** — 三列卡片垂直高速滚动
3. **逐列停止** — 左→中→右依次减速停下
4. **中奖判定** — 三列对齐触发金光特效

### 核心技术
- GSAP ScrollTrigger scrub 控制拉杆+停止
- translateY 循环滚动
- stagger 逐列停止
- 对齐检测 + 庆祝粒子

## 使用方法
```vue
<CardTimeSlotMachine />
```

