const fs = require('fs');
const path = require('path');
const https = require('https');

const outputFile = path.join(__dirname, '..', 'src', 'assets', 'images', 'base64-images.ts');

const images = [
  { key: 'hero1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=60' },
  { key: 'hero2', url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=60' },
  { key: 'hero3', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=60' },
  { key: 'hero4', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=60' },
  { key: 'destination1', url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=60' },
  { key: 'destination2', url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=60' },
  { key: 'destination3', url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=60' },
  { key: 'destination4', url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=60' },
  { key: 'experience1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=60' },
  { key: 'experience2', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=60' },
  { key: 'experience3', url: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800&q=60' },
  { key: 'experience4', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=60' },
  { key: 'story1', url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=60' },
  { key: 'story2', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=60' },
  { key: 'story3', url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=60' },
  { key: 'package1', url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=60' },
  { key: 'package2', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=60' },
  { key: 'package3', url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=60' },
  { key: 'community1', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=60' },
  { key: 'community2', url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=60' },
  { key: 'community3', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=60' },
  { key: 'community4', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=60' },
  { key: 'card1', url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=60' },
  { key: 'card2', url: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800&q=60' },
];

function downloadToBase64(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout')), 15000);
    https.get(url, (response) => {
      clearTimeout(timeout);
      if (response.statusCode === 200) {
        const data = [];
        response.on('data', chunk => data.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(data);
          const base64 = buffer.toString('base64');
          resolve(`data:image/jpeg;base64,${base64}`);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        downloadToBase64(response.headers.location).then(resolve).catch(reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

async function generate() {
  const results = {};
  console.log('Downloading images and converting to base64...\n');

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    try {
      const base64 = await downloadToBase64(img.url);
      results[img.key] = base64;
      console.log(`✓ ${img.key} (${Math.round(base64.length / 1024)}KB)`);
    } catch (err) {
      console.error(`✗ ${img.key}: ${err.message}`);
      results[img.key] = '';
    }
  }

  const tsContent = `// Auto-generated base64 images
export const images = ${JSON.stringify(results, null, 2)};
`;

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, tsContent);

  console.log(`\n✓ Generated: ${outputFile}`);
  const totalSize = Object.values(results).reduce((sum, img) => sum + img.length, 0);
  console.log(`Total size: ${Math.round(totalSize / 1024)}KB`);
}

generate().catch(console.error);
