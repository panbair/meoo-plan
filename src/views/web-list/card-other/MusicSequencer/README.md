# MusicSequencer 音乐序列器

## 效果描述
网格式节拍编辑器组件，使用Web Audio API实时播放。提供16步×8轨的节拍网格，每轨对应一种乐器/音色，点击格子开关音符。支持BPM调节、播放/暂停、音量控制、多种音色预设，播放时光标实时滚动高亮当前拍。

## 技术实现
- **核心技术**: Web Audio API + Vue 3 + GSAP
- **音频合成**: OscillatorNode 生成不同频率波形模拟乐器
- **节拍引擎**: setInterval 精确计时 + AudioContext 调度
- **网格交互**: 点击切换音符开关，拖拽批量编辑

## 使用方法
```vue
<MusicSequencer />
```

