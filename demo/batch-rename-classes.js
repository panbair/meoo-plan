import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 组件和对应的后缀映射
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

// 需要排除的class名称
const excludedClasses = new Set(['page-header', 'page-title', 'page-subtitle', 'web-wrapper']);

function processFile(filePath, suffix, componentName) {
  console.log(`处理 ${componentName}...`);

  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // 1. 修改template中的class属性
  content = content.replace(/class="([^"]+)"/g, (match, classes) => {
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

  // 2. 修改单引号的class属性
  content = content.replace(/class='([^']+)'/g, (match, classes) => {
    const modifiedClasses = classes.split(/\s+/)
      .map(cls => {
        if (!cls || excludedClasses.has(cls)) return cls;
        if (/-\d+$/.test(cls)) return cls;
        return cls + suffix;
      })
      .join(' ');
    if (modifiedClasses !== classes) changes++;
    return `class='${modifiedClasses}'`;
  });

  // 3. 修改style标签中的CSS选择器
  content = content.replace(/(\.)([a-zA-Z][a-zA-Z0-9-]*)(?=[\s\{,\:\>\+\~])/g, (match, dot, className) => {
    if (excludedClasses.has(className)) return match;
    if (/-\d+$/.test(className)) return match;
    if (match.includes(':') || match.includes('::')) return match;
    changes++;
    return `.${className}${suffix}`;
  });

  // 4. 修改GSAP选择器
  content = content.replace(/querySelector(?:All)?\(['"]\.([a-zA-Z][a-zA-Z0-9-]*)['"]\)/g, (match, className) => {
    if (excludedClasses.has(className)) return match;
    if (/-\d+$/.test(className)) return match;
    changes++;
    return match.replace(`.${className}`, `.${className}${suffix}`);
  });

  // 5. 修改GSAP中的字符串选择器
  content = content.replace(/(gsap\.(?:from|to|fromTo|set)\(\s*['"])\.([a-zA-Z][a-zA-Z0-9-]*)(['"])/g, (match, prefix, className, suffixStr) => {
    if (excludedClasses.has(className)) return match;
    if (/-\d+$/.test(className)) return match;
    changes++;
    return `${prefix}.${className}${suffix}${suffixStr}`;
  });

  // 6. 修改trigger中的选择器
  content = content.replace(/trigger:\s*['"]\.([a-zA-Z][a-zA-Z0-9-]*)['"]/g, (match, className) => {
    if (excludedClasses.has(className)) return match;
    if (/-\d+$/.test(className)) return match;
    changes++;
    return `trigger: '.${className}${suffix}'`;
  });

  // 7. 修改gsap.utils.toArray中的选择器
  content = content.replace(/gsap\.utils\.toArray\(['"]\.([a-zA-Z][a-zA-Z0-9-]*)['"]\)/g, (match, className) => {
    if (excludedClasses.has(className)) return match;
    if (/-\d+$/.test(className)) return match;
    changes++;
    return `gsap.utils.toArray('.${className}${suffix}')`;
  });

  // 8. 修改@keyframes名称
  content = content.replace(/@keyframes\s+([a-zA-Z][a-zA-Z0-9-]*)(?=\s*\{)/g, (match, animName) => {
    if (excludedClasses.has(animName)) return match;
    if (/-\d+$/.test(animName)) return match;
    changes++;
    return `@keyframes ${animName}${suffix}`;
  });

  // 9. 修改animation属性
  content = content.replace(/animation:\s*([^;]+);/g, (match, animValue) => {
    const parts = animValue.trim().split(/\s+/);
    if (parts.length > 0 && !excludedClasses.has(parts[0])) {
      const animName = parts[0];
      if (!/-\d+$/.test(animName)) {
        parts[0] = `${animName}${suffix}`;
        changes++;
        return `animation: ${parts.join(' ')};`;
      }
    }
    return match;
  });

  // 10. 修改animation-name属性
  content = content.replace(/animation-name:\s*([^;]+);/g, (match, animName) => {
    animName = animName.trim();
    if (!excludedClasses.has(animName) && !/-\d+$/.test(animName)) {
      changes++;
      return `animation-name: ${animName}${suffix};`;
    }
    return match;
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  ✓ ${componentName} - 修改了 ${changes} 处`);
  } else {
    console.log(`  - ${componentName} - 无需修改`);
  }

  return changes;
}

// 处理所有组件文件
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
