const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, '..', 'src', 'assets', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const images = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', name: 'hero-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1920&q=80', name: 'hero-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80', name: 'hero-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80', name: 'hero-4.jpg' },
  { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80', name: 'destination-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1920&q=80', name: 'destination-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1920&q=80', name: 'destination-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1920&q=80', name: 'destination-4.jpg' },
  { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80', name: 'experience-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=1920&q=80', name: 'experience-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80', name: 'experience-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80', name: 'story-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1920&q=80', name: 'story-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=1920&q=80', name: 'story-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=80', name: 'package-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80', name: 'community-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80', name: 'community-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80', name: 'community-3.jpg' },
  { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80', name: 'community-4.jpg' },
  { url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&h=1000&fit=crop', name: 'card-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=1600&h=1000&fit=crop', name: 'card-2.jpg' },
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const data = [];
        response.on('data', chunk => data.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(data);
          fs.writeFileSync(filepath, buffer);
          console.log(`Downloaded: ${path.basename(filepath)}`);
          resolve(buffer);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function downloadAll() {
  for (const img of images) {
    const filepath = path.join(imagesDir, img.name);
    if (!fs.existsSync(filepath)) {
      try {
        await downloadImage(img.url, filepath);
      } catch (err) {
        console.error(`Error downloading ${img.name}:`, err.message);
      }
    } else {
      console.log(`Already exists: ${img.name}`);
    }
  }
  console.log('\nAll downloads complete!');
}

downloadAll();
