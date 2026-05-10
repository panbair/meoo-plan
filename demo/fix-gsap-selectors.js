const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src/views/web/components');

const componentFixes = {
  'InfiniteScrollText.vue': {
    suffix: '-17',
    selectors: {
      '.infinite-scroll-section': '.infinite-scroll-section-17',
      '.scroll-text': '.scroll-text-17',
      '.scroll-container': '.scroll-container-17'
    }
  },
  'NeonGlowText.vue': {
    suffix: '-19',
    selectors: {
      '.ngt-letter': '.ngt-letter-19',
      '.ngt-neon-text': '.ngt-neon-text-19',
      '.ngt-neon-container': '.ngt-neon-container-19'
    }
  },
  'CyberpunkCity.vue': {
    suffix: '-21',
    selectors: {
      '.building': '.building-21',
      '.city-skyline': '.city-skyline-21',
      '.building-neon': '.building-neon-21',
      '.rain-drop': '.rain-drop-21',
      '.window': '.window-21',
      '.city-container': '.city-container-21',
      '.ground-neon': '.ground-neon-21'
    }
  }
};

function fixComponent(componentName, fixes) {
  const filePath = path.join(componentsDir, componentName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${componentName}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Replace each selector with its suffixed version
  for (const [oldSelector, newSelector] of Object.entries(fixes.selectors)) {
    const regex = new RegExp(`'${oldSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g');
    const newContent = content.replace(regex, `'${newSelector}'`);
    
    if (content !== newContent) {
      const count = (content.match(regex) || []).length;
      changes += count;
      console.log(`  ✅ Fixed ${count} occurrences of ${oldSelector} → ${newSelector}`);
      content = newContent;
    }
  }

  // Also handle gsap.utils.toArray with querySelectorAll patterns
  if (content.includes('querySelectorAll')) {
    const queryAllRegex = /document\.querySelectorAll\(['"]\.([a-zA-Z0-9-]+)['"]\)/g;
    content = content.replace(queryAllRegex, (match, className) => {
      const newClassName = className + fixes.suffix;
      console.log(`  ✅ Fixed querySelectorAll: .${className} → .${newClassName}`);
      changes++;
      return `gsap.utils.toArray('.${newClassName}')`;
    });
  }

  // Fix MorphingShapes.vue specifically - use ref instead of selector
  if (componentName === 'MorphingShapes.vue') {
    if (content.includes(".querySelector('.morphing-shape')")) {
      content = content.replace(
        /\.querySelector\(['"]\.morphing-shape['"]\)/g,
        ".querySelector('.morphing-shape-20')"
      );
      console.log(`  ✅ Fixed MorphingShapes.vue selector`);
      changes++;
    }
  }

  // Fix GlassmorphismGallery.vue
  if (componentName === 'GlassmorphismGallery.vue') {
    if (content.includes('.gg-card-image') || content.includes('.gg-card-content')) {
      content = content.replace(/\.gg-card-image/g, '.gg-card-image-16');
      content = content.replace(/\.gg-card-content/g, '.gg-card-content-16');
      console.log(`  ✅ Fixed GlassmorphismGallery.vue selectors`);
      changes++;
    }
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${changes} selectors in ${componentName}`);
  } else {
    console.log(`ℹ️  No changes needed for ${componentName}`);
  }
}

console.log('🔧 Starting GSAP selector fixes...\n');

for (const [componentName, fixes] of Object.entries(componentFixes)) {
  console.log(`\nProcessing ${componentName} (suffix: ${fixes.suffix}):`);
  fixComponent(componentName, fixes);
}

console.log('\n✨ All GSAP selector fixes completed!');
