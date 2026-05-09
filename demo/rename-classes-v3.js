import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentSuffixes = {
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

const excludedClasses = new Set(['page-header', 'page-title', 'page-subtitle', 'web-wrapper']);

function processFile(filePath, suffix, componentName) {
  console.log(`处理 ${componentName}...`);

  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  const lines = content.split('\n');
  let inTemplate = false;
  let inStyle = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('<template>')) {
      inTemplate = true;
      continue;
    }
    if (line.includes('</template>')) {
      inTemplate = false;
      continue;
    }
    if (line.includes('<style')) {
      inStyle = true;
      inTemplate = false;
    }

    if (inTemplate) {
      // 修改 template 中的 class 属性,但跳过插值表达式
      if (line.includes('class=')) {
        const newLine = line.replace(/class="([^"]+)"/g, (match, classes) => {
          const modifiedClasses = classes.split(/\s+/)
            .map(cls => {
              if (!cls || excludedClasses.has(cls)) return cls;
              if (/-\d+$/.test(cls)) return cls;
              return cls + suffix;
            })
            .join(' ');
          if (modifiedClasses !== classes) changes++;
          return `class="${modifiedClasses}"`;
        });
        lines[i] = newLine;
      }
    }

    if (inStyle) {
      // 修改 style 中的 CSS 选择器
      const newLine = line.replace(/\.([a-zA-Z][a-zA-Z0-9-]*)(?=[\s\{,\:\>\+\~])/g, (match, className) => {
        if (excludedClasses.has(className)) return match;
        if (/-\d+$/.test(className)) return match;
        if (match.includes(':') || match.includes('::')) return match;
        changes++;
        return `.${className}${suffix}`;
      });
      lines[i] = newLine;
    }
  }

  content = lines.join('\n');

  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ ${componentName} - 修改了 ${changes} 处`);
  } else {
    console.log(`  - ${componentName} - 无需修改`);
  }

  return changes;
}

const componentsDir = path.join(__dirname, 'src/views/web/components');
let totalChanges = 0;

console.log('开始批量修改组件class名称...\n');

Object.keys(componentSuffixes).forEach(component => {
  const suffix = componentSuffixes[component];
  const filePath = path.join(componentsDir, `${component}.vue`);

  if (fs.existsSync(filePath)) {
    const changes = processFile(filePath, suffix, component);
    totalChanges += changes;
  } else {
    console.log(`✗ ${component}.vue - 文件不存在`);
  }
});

console.log(`\n✓ 完成! 总共修改了 ${totalChanges} 处`);
console.log('请检查修改结果,然后运行项目测试。');
