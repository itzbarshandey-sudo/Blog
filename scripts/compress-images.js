// scripts/compress-images.js
// Image optimization script for Node.js
// Requires: npm install sharp
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const IMAGES_TO_OPTIMIZE = [
  { name: 'mascot.webp', quality: 75, maxWidth: 380 },
  { name: 'mascotblog.webp', quality: 75, maxWidth: 300 },
  { name: 'mascotcontact.webp', quality: 75, maxWidth: 300 },
  { name: 'mascotresume.webp', quality: 75, maxWidth: 330 },
  { name: 'og-image.png', quality: 85, maxWidth: 1200 },
];

async function optimizeImage(config) {
  const inputPath = path.join(ASSETS_DIR, config.name);
  const ext = path.extname(config.name).toLowerCase();
  const isWebP = ext === '.webp';
  const isPNG = ext === '.png';

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${config.name} (not found)`);
    return;
  }

  const originalSize = fs.statSync(inputPath).size;
  const backupPath = `${inputPath}.backup`;

  // Backup original
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
  }

  let sharpInstance = sharp(inputPath);

  // Resize if needed
  if (config.maxWidth) {
    sharpInstance = sharpInstance.resize({
      width: config.maxWidth,
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  // Apply compression
  if (isWebP) {
    sharpInstance = sharpInstance.webp({
      quality: config.quality,
      effort: 6, // Higher effort = better compression
    });
  } else if (isPNG) {
    sharpInstance = sharpInstance.png({
      compressionLevel: 9,
      quality: config.quality,
      effort: 10,
    });
  } else {
    sharpInstance = sharpInstance.jpeg({
      quality: config.quality,
      mozjpeg: true,
    });
  }

  // Save optimized image
  await sharpInstance.toFile(`${inputPath}.tmp`);

  // Replace original
  fs.renameSync(`${inputPath}.tmp`, inputPath);

  const newSize = fs.statSync(inputPath).size;
  const savings = originalSize - newSize;
  const percent = ((savings / originalSize) * 100).toFixed(1);

  console.log(`✅ ${config.name}: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (saved ${(savings / 1024).toFixed(1)}KB, ${percent}%)`);
}

async function main() {
  console.log('🎨 Starting image optimization...\n');

  for (const config of IMAGES_TO_OPTIMIZE) {
    try {
      await optimizeImage(config);
    } catch (err) {
      console.error(`❌ Error optimizing ${config.name}:`, err.message);
    }
  }

  console.log('\n✨ Optimization complete!');
  console.log('💡 Original files backed up with .backup extension');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
