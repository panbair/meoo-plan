# AugmentedReality AR叠加层

## 效果描述
利用摄像头画面叠加虚拟3D元素的AR体验组件。通过getUserMedia获取摄像头视频流，在视频画面上叠加Canvas绘制的3D虚拟物体（旋转立方体、粒子效果、信息标签）。支持鼠标点击放置虚拟物体、拖拽移动位置。

## 技术实现
- **核心技术**: getUserMedia + Canvas 2D + GSAP
- **视频采集**: navigator.mediaDevices.getUserMedia 获取摄像头
- **叠加渲染**: Canvas 叠加层绘制3D线框物体
- **交互放置**: 鼠标/触摸点击在视频画面上放置虚拟元素

## 使用方法
```vue
<AugmentedReality />
```

