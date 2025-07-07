const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../assets/images');

// Ensure directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Simple placeholder images from a reliable source
const images = [
  {
    name: 'icon.png',
    url: 'https://via.placeholder.com/1024x1024/4A90E2/FFFFFF?text=M'
  },
  {
    name: 'adaptive-icon.png', 
    url: 'https://via.placeholder.com/1024x1024/4A90E2/FFFFFF?text=M'
  },
  {
    name: 'splash-icon.png',
    url: 'https://via.placeholder.com/512x512/4A90E2/FFFFFF?text=Mythopedia'
  },
  {
    name: 'favicon.png',
    url: 'https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=M'
  }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(imagesDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if download failed
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('Downloading placeholder images...');
  
  for (const image of images) {
    try {
      await downloadImage(image.url, image.name);
    } catch (error) {
      console.error(`Failed to download ${image.name}:`, error.message);
    }
  }
  
  console.log('Download complete!');
}

downloadAllImages(); 