/*
 * @Author: panboren
 * @Date: 2024/11/5$
 * @LastModifiedBy: Administrator$
 * @QQ: 3248874747
 */
import * as uuid from 'uuid'
import dayjs from 'dayjs'
import { keys, keys2 } from './keys.js'

export const colors = [
  ' linear-gradient(225deg, rgb(255, 60, 172) 0%, rgb(120, 75, 160) 50%, rgb(43, 134, 197) 100%)',
  ' linear-gradient(225deg, rgb(255, 60, 172) 0%, rgb(120, 75, 160) 50%, rgb(43, 134, 197) 100%)',
  ' linear-gradient(90deg, rgb(254, 225, 64) 0%, rgb(250, 112, 154) 100%)',
  ' linear-gradient(90deg, rgb(254, 225, 64) 0%, rgb(250, 112, 154) 100%)',
  ' linear-gradient(90deg, rgb(250, 217, 97) 0%, rgb(247, 107, 28) 100%)',
  ' linear-gradient(90deg, rgb(250, 217, 97) 0%, rgb(247, 107, 28) 100%)',
  ' linear-gradient(19deg, rgb(250, 172, 168) 0%, rgb(221, 214, 243) 100%)',

  ' linear-gradient(19deg, rgb(250, 172, 168) 0%, rgb(221, 214, 243) 100%)',

  ' linear-gradient(90deg, rgb(116, 235, 213) 0%, rgb(159, 172, 230) 100%)',

  ' linear-gradient(90deg, rgb(116, 235, 213) 0%, rgb(159, 172, 230) 100%)',

  ' linear-gradient(rgb(169, 201, 255) 0%, rgb(255, 187, 236) 100%)',

  ' linear-gradient(rgb(169, 201, 255) 0%, rgb(255, 187, 236) 100%)',

  ' linear-gradient(132deg, rgb(244, 208, 63) 0%, rgb(22, 160, 133) 100%)',

  ' linear-gradient(132deg, rgb(244, 208, 63) 0%, rgb(22, 160, 133) 100%)',

  ' linear-gradient(45deg, rgb(251, 218, 97) 0%, rgb(255, 90, 205) 100%)',

  ' linear-gradient(45deg, rgb(251, 218, 97) 0%, rgb(255, 90, 205) 100%)',

  ' linear-gradient(90deg, rgb(255, 154, 139) 0%, rgb(255, 106, 136) 55%, rgb(255, 153, 172) 100%)',
  ' linear-gradient(90deg, rgb(255, 154, 139) 0%, rgb(255, 106, 136) 55%, rgb(255, 153, 172) 100%)',

  ' linear-gradient(45deg, rgb(250, 139, 255) 0%, rgb(43, 210, 255) 52%, rgb(43, 255, 136) 90%)',

  ' linear-gradient(45deg, rgb(250, 139, 255) 0%, rgb(43, 210, 255) 52%, rgb(43, 255, 136) 90%)',

  ' linear-gradient(19deg, rgb(62, 236, 172) 0%, rgb(238, 116, 225) 100%)',

  ' linear-gradient(19deg, rgb(62, 236, 172) 0%, rgb(238, 116, 225) 100%)',

  ' linear-gradient(19deg, rgb(33, 212, 253) 0%, rgb(183, 33, 255) 100%)',

  ' linear-gradient(147deg, rgb(255, 229, 59) 0%, rgb(255, 37, 37) 74%)',
  ' linear-gradient(19deg, rgb(33, 212, 253) 0%, rgb(183, 33, 255) 100%)',

  ' linear-gradient(147deg, rgb(255, 229, 59) 0%, rgb(255, 37, 37) 74%)',

  ' linear-gradient(rgb(82, 172, 255) 25%, rgb(255, 227, 44) 100%)',

  ' linear-gradient(rgb(82, 172, 255) 25%, rgb(255, 227, 44) 100%)',

  ' linear-gradient(0deg, rgb(8, 174, 234) 0%, rgb(42, 245, 152) 100%)',

  ' linear-gradient(0deg, rgb(8, 174, 234) 0%, rgb(42, 245, 152) 100%)',

  ' linear-gradient(0deg, rgb(255, 222, 233) 0%, rgb(181, 255, 252) 100%)',

  ' linear-gradient(0deg, rgb(255, 222, 233) 0%, rgb(181, 255, 252) 100%)',

  ' linear-gradient(135deg, rgb(139, 198, 236) 0%, rgb(149, 153, 226) 100%)',

  ' linear-gradient(135deg, rgb(139, 198, 236) 0%, rgb(149, 153, 226) 100%)',

  ' linear-gradient(45deg, rgb(133, 255, 189) 0%, rgb(255, 251, 125) 100%)',

  ' linear-gradient(45deg, rgb(133, 255, 189) 0%, rgb(255, 251, 125) 100%)',

  ' linear-gradient(62deg, rgb(251, 171, 126) 0%, rgb(247, 206, 104) 100%)',

  ' linear-gradient(62deg, rgb(251, 171, 126) 0%, rgb(247, 206, 104) 100%)',

  ' linear-gradient(90deg, rgb(0, 219, 222) 0%, rgb(252, 0, 255) 100%)',

  ' linear-gradient(90deg, rgb(0, 219, 222) 0%, rgb(252, 0, 255) 100%)',

  ' linear-gradient(rgb(255, 255, 255) 0%, rgb(98, 132, 255) 50%, rgb(255, 0, 0) 100%)',

  ' linear-gradient(rgb(255, 255, 255) 0%, rgb(98, 132, 255) 50%, rgb(255, 0, 0) 100%)',

  ' linear-gradient(0deg, rgb(217, 175, 217) 0%, rgb(151, 217, 225) 100%)',

  ' linear-gradient(0deg, rgb(217, 175, 217) 0%, rgb(151, 217, 225) 100%)',

  ' linear-gradient(62deg, rgb(142, 197, 252) 0%, rgb(224, 195, 252) 100%)',

  ' linear-gradient(62deg, rgb(142, 197, 252) 0%, rgb(224, 195, 252) 100%)',

  ' linear-gradient(160deg, rgb(0, 147, 233) 0%, rgb(128, 208, 199) 100%)',

  ' linear-gradient(160deg, rgb(0, 147, 233) 0%, rgb(128, 208, 199) 100%)',

  ' linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%)',

  ' linear-gradient(43deg, rgb(65, 88, 208) 0%, rgb(200, 80, 192) 46%, rgb(255, 204, 112) 100%)'
]

export const getId = () => {
  let myId = dayjs().format('YYYYMMDDHHmmssSSS')
  let index = Math.floor(Math.random() * 100) // 0-50随机数
  let index2 = Math.floor(Math.random() * 100) // 0-50随机数
  let id = myId + index + index2
  console.log(index)
  return {
    id: id,
    uuid: uuid.v4() + id
  }
}

// 添加单个
export const getItem = (horizontal, templateView) => {
  let { id, uuid } = getId()
  let index = Math.floor(Math.random() * 51) // 0-50随机数
  let color = colors[index] ?? colors[0]
  let linkName = horizontal ? 'PA' : 'PB'

  return {
    templateView,
    id: id,
    linkName: linkName + id,
    uuid: uuid,
    type: 'panel',
    className: 'panel' + id,
    name: horizontal ? '横屏' : '竖屏',
    horizontal,
    style: {
      backgroundImage: color
    },
    formData: {
      animationKeys: [], // 动画设置
      animationStyle: {} // 滚动动画样式
    },
    level: 2,
    children: []
  }
}
export const getData = (horizontal = false, templateView) => {
  let item = getItem(horizontal, templateView)
  let panel = getItem(horizontal, templateView)
  let panel2 = getItem(horizontal, templateView)
  item.pid = 0
  panel.pid = item.id
  panel2.pid = item.id
  panel.parentClassName = item.className
  panel2.parentClassName = item.className
  item.level = 1
  if (horizontal) {
    // 横向布局
    item.children = [panel, panel2]
  } else {
    // 竖向布局
    item.children = [panel]
  }
  return item
}

export let butOption = {
  customizeAnimation: {
    horizontalDisable: true,
    verticalDisable: false
  },
  initHorizontalAnimation: {
    horizontalDisable: false,
    verticalDisable: false
  },
  infinitePanelScrollAnimation: {
    horizontalDisable: true,
    verticalDisable: false
  },
  scalePanelScrollAnimation: {
    horizontalDisable: true,
    verticalDisable: false
  },
  // 新增酷炫模板
  threeDCardFlipAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '3D卡片翻转',
    description: '面板进行3D翻转效果'
  },
  particleWaveAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '粒子波浪',
    description: '面板以波浪形式进入，带粒子效果'
  },
  wormholeAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '虫洞穿梭',
    description: '面板以虫洞效果缩放穿梭'
  },
  glassShatterAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '玻璃破碎',
    description: '面板以玻璃破碎方式进入'
  },
  liquidFlowAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '液体流动',
    description: '面板以液体流动方式变换'
  },
  fractalGrowAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '分形生长',
    description: '面板以分形模式生长展开'
  },
  quantumEntanglementAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '量子纠缠',
    description: '多面板同步量子纠缠动画'
  },
  magneticDistortionAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '磁场扭曲',
    description: '面板在磁场中扭曲变形'
  },
  // 专业级模板 V12-V19
  origamiFoldAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '纸张折叠',
    description: '3D纸张逐层折叠展开效果'
  },
  moebiusTransformAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '莫比乌斯环',
    description: '无限循环拓扑变换'
  },
  auroraFlowAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '极光流淌',
    description: '自然极光光效流动'
  },
  particleConvergeAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '粒子汇聚',
    description: '粒子从四周汇聚成形'
  },
  dnaHelixAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: 'DNA双螺旋',
    description: '生物双螺旋旋转结构'
  },
  honeycombUnfoldAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '蜂巢展开',
    description: '六边形网格有序展开'
  },
  hologramScanAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '全息扫描',
    description: '未来感全息投影扫描'
  },
  kaleidoscopeMirrorAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '万花筒镜像',
    description: '对称镜像几何变换'
  },
  // 精英级模板 V20-V27
  liquidSurfaceTensionAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '液体张力',
    description: '物理表面张力液滴效果'
  },
  electromagneticWaveAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '电磁波动',
    description: 'SVG正弦波电磁场'
  },
  fragmentReassembleAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '碎片重组',
    description: '碎片从四面八方汇聚'
  },
  parallaxDepthAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '多层视差',
    description: '多层3D深度视差效果'
  },
  matrixRainAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '矩阵代码雨',
    description: '赛博朋克风格代码雨'
  },
  galaxyRotationAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '星系旋转',
    description: '宇宙星系螺旋旋转'
  },
  fluidVortexAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '流体涡旋',
    description: '多层流体涡旋流动'
  },
  panoramaUnfoldAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '全景展开',
    description: '360度全景柱状展开'
  },
  // 传奇级模板 V28-V35
  interstellarPortalAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '星际传送门',
    description: '穿越时空的传送门效果'
  },
  quantumTunnelAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '量子时空穿越',
    description: '量子隧穿从粒子态重组'
  },
  cyberspaceAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '赛博空间',
    description: '沉浸式赛博朋克空间'
  },
  liquidMetalAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '液态金属',
    description: '仿真的液态金属变形'
  },
  timeFoldAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '时间折叠',
    description: '时间循环和空间折叠'
  },
  nebulaBirthAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '星云诞生',
    description: '星云从混沌到有序的演化'
  },
  neonCityAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '霓虹城市',
    description: '赛博朋克霓虹城市夜景'
  },
  ultimateParallaxAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '极限视差',
    description: '极致深度的3D空间体验'
  },
  // 精华级模板 V36-V43
  smoothHorizontalAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '平滑横向',
    description: '更自然的ease曲线，更流畅的滚动'
  },
  elasticScaleAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '弹性缩放',
    description: 'back缓动加过冲效果，更有活力'
  },
  infiniteSmoothAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '无限循环优化',
    description: '无缝衔接加snap吸附'
  },
  fadeUpAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '淡入上移',
    description: '经典淡入向上移动，简洁优雅'
  },
  staggeredHorizontalAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '交错横向',
    description: '不同面板不同速度，更有层次感'
  },
  scaleFadeAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '缩放淡入',
    description: '从中心缩放加淡入，简洁大方'
  },
  infiniteRotateAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '无限旋转',
    description: '无限滚动加持续旋转'
  },
  smoothComboAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '平滑组合',
    description: '横向缩放淡入三合一'
  },
  // 大师级模板 V44-V51
  particleExplosionAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '粒子爆炸',
    description: '粒子从中心爆炸散开，形成冲击波'
  },
  liquidMorphAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '液态变形',
    description: 'CSS border-radius模拟液态流动'
  },
  holographicDataflowAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '全息数据流',
    description: 'SVG线条绘制 + 霓虹光效'
  },
  magneticAttractionAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '磁力吸引',
    description: '元素被磁力吸入，形成漩涡'
  },
  origamiUnfoldAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '折纸展开',
    description: '3D旋转 + 边缘折痕'
  },
  auroraRippleAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '极光波纹',
    description: 'CSS渐变 + 混合模式'
  },
  neonGlitchAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '霓虹故障',
    description: 'RGB分离 + 随机故障'
  },
  wormholeTravelAnimation: {
    horizontalDisable: true,
    verticalDisable: false,
    name: '虫洞穿越',
    description: '3D旋转 + 虫洞吸力'
  }
}
