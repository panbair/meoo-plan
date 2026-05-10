import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, 'src/views/web/components');
const suffixMap = {
  'Card3DFlipGallery': '-1',
  'LiquidWave': '-2',
  'Timeline': '-3',
  'ParticleExplosion': '-4',
  'TextTypewriter': '-5',
  'Cube3D': '-6',
  'ImageParallax': '-7',
  'NumberCounter': '-8',
  'BouncingBall': '-9',
  'CircularProgress': '-10',
  'TextReveal': '-11',
  'MagneticButton': '-12',
  'ParallaxCards': '-13',
  'RotatingRings': '-14',
  'TextDistortion': '-15',
  'GlassmorphismGallery': '-16',
  'InfiniteScrollText': '-17',
  'Holographic3D': '-18',
  'NeonGlowText': '-19',
  'MorphingShapes': '-20',
  'CyberpunkCity': '-21',
  'DNAHelix': '-22',
  'AuroraBorealis': '-23',
  'GalaxySpiral': '-24',
  'OceanWaves': '-25',
  'QuantumField': '-26',
  'VolcanicEruption': '-27',
  'SolarSystem': '-28',
  'Tornado': '-29',
  'ParallaxZoomGallery': '-30',
  'RotationCarousel': '-31',
  'FadeInStack': '-32',
  'ScaleWave': '-33',
  'HorizontalScroll': '-34',
  'DiagonalParallax': '-35',
  'RotationGallery': '-36',
  'TextScroll': '-37',
  'ScaleShapes': '-38',
  'GradientFlow': '-39',
  'CascadeParallax': '-40',
  'StackedCards': '-41',
  'FloatingImages': '-42',
  'StaggerGrid': '-43',
  'StaggerTimeline': '-44',
  'StaggerCards': '-45',
  'CircleGallery': '-46',
  'FoldEffect': '-47',
  'MorphGrid': '-48',
  'WaveReveal': '-49',
  'ZoomPan': '-50',
  'RotateScale': '-51',
  'ScrollReveal': '-52',
  'ParallaxScroll': '-53',
  'FixedParallax': '-54',
  'TimelineSequence': '-55',
  'OverlappingTimeline': '-56',
  'NestedTimeline': '-57',
  'FlipCards': '-58',
  'SlidingPanels': '-59',
  'MorphingCards': '-60',
  'MotionPathCards': '-61',
  'CircleMotion': '-62',
  'InfinityMotion': '-63'
};

function fixTemplateExpressions(content, suffix) {
  let changes = 0;

  // 修复: 将属性中的变量名恢复 (例如 card.icon-1 改回 card.icon)
  // 匹配: {{ ... }} 内部的表达式,以及 v-bind 中的属性值
  const patterns = [
    // 插值表达式 {{ ... }}
    /\{\{([^}]+)\}\}/g,
    // v-bind 或 : 后面的属性值
    /[:=]\s*"([^"]+)"/g,
    /[:=]\s*'([^']+)'/g,
    // v-for 中的表达式
    /v-for="([^"]+)"/g,
  ];

  patterns.forEach(pattern => {
    content = content.replace(pattern, (match, expr) => {
      // 将变量名中的 -数字后缀移除
      const fixedExpr = expr.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)-\d+/g, '$1');
      if (fixedExpr !== expr) {
        changes++;
        return match.replace(expr, fixedExpr);
      }
      return match;
    });
  });

  return { content, changes };
}

let totalChanges = 0;
console.log('开始修复模板表达式...\n');

Object.keys(suffixMap).forEach(component => {
  const suffix = suffixMap[component];
  const filePath = path.join(componentsDir, `${component}.vue`);

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixTemplateExpressions(content, suffix);

    if (result.changes > 0) {
      fs.writeFileSync(filePath, result.content);
      console.log(`✓ ${component} - 修复了 ${result.changes} 处`);
      totalChanges += result.changes;
    }
  }
});

console.log(`\n✓ 完成! 总共修复了 ${totalChanges} 处`);
