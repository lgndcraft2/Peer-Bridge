const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, '../public/logo.png');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateIcons() {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error('Error: Please save your image as "public/logo.png" first!');
    process.exit(1);
  }

  try {
    console.log('Generating icons...');

    // Generate 192x192
    await sharp(SOURCE_FILE)
      .resize(192, 192)
      .toFile(path.join(PUBLIC_DIR, 'icon-192x192.png'));
    console.log('✓ Created public/icon-192x192.png');

    // Generate 512x512
    await sharp(SOURCE_FILE)
      .resize(512, 512)
      .toFile(path.join(PUBLIC_DIR, 'icon-512x512.png'));
    console.log('✓ Created public/icon-512x512.png');

    console.log('Success! PWA icons are ready.');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
