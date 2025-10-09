#!/usr/bin/env node

/**
 * Everwear Image Update Script
 *
 * This script automatically copies images from Desktop and updates product image URLs
 * Images should be in: /Users/vaishnavi/Desktop/images for website/
 */

const fs = require('fs');
const path = require('path');

// Source folder on Desktop
const sourceFolder = '/Users/vaishnavi/Desktop/images for website';
const targetFolder = 'public/images';

// Image mappings - will auto-detect images from your Desktop folder
const imageMap = {
  1: '/images/tshirt-1.jpg',        // Essential T-Shirt 1
  2: '/images/tshirt-2.jpg',        // Essential T-Shirt 2
  3: '/images/crop-top-1.jpg',      // Essential Crop Top 1
  4: '/images/crop-top-2.jpg',      // Essential Crop Top 2
  5: '/images/sweatshirt-1.jpg',    // Essential Sweatshirt 1
  6: '/images/sweatshirt-2.jpg',    // Essential Sweatshirt 2
  7: '/images/sweatpants-1.jpg',    // Essential Sweatpants 1
  8: '/images/sweatpants-2.jpg',    // Essential Sweatpants 2
};

// Files to update
const filesToUpdate = [
  'src/pages/CategoryPage.tsx',
  'src/pages/ProductPage.tsx'
];

function copyImagesFromDesktop() {
  console.log('📁 Copying images from Desktop...\n');

  // Check if source folder exists
  if (!fs.existsSync(sourceFolder)) {
    console.error(`❌ Error: Source folder not found: ${sourceFolder}`);
    console.log('💡 Please make sure your images are in: /Users/vaishnavi/Desktop/images for website/');
    return false;
  }

  // Get all image files from source folder
  const files = fs.readdirSync(sourceFolder);
  const imageFiles = files.filter(file =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  if (imageFiles.length === 0) {
    console.error('❌ No image files found in source folder');
    return false;
  }

  console.log(`📸 Found ${imageFiles.length} image files:`);
  imageFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');

  // Auto-assign images to products based on filename keywords
  const autoMapping = {};
  imageFiles.forEach((file, index) => {
    const fileName = file.toLowerCase();
    let productId = null;
    let newName = null;

    // Smart mapping based on filename
    if (fileName.includes('tshirt') || fileName.includes('t-shirt') || fileName.includes('tee')) {
      productId = Object.keys(autoMapping).filter(id => id <= 2).length === 0 ? 1 : 2;
      newName = `tshirt-${productId}.${file.split('.').pop()}`;
    } else if (fileName.includes('crop')) {
      productId = Object.keys(autoMapping).filter(id => id >= 3 && id <= 4).length === 0 ? 3 : 4;
      newName = `crop-top-${productId - 2}.${file.split('.').pop()}`;
    } else if (fileName.includes('sweatshirt') || fileName.includes('hoodie')) {
      productId = Object.keys(autoMapping).filter(id => id >= 5 && id <= 6).length === 0 ? 5 : 6;
      newName = `sweatshirt-${productId - 4}.${file.split('.').pop()}`;
    } else if (fileName.includes('sweatpant') || fileName.includes('jogger')) {
      productId = Object.keys(autoMapping).filter(id => id >= 7 && id <= 8).length === 0 ? 7 : 8;
      newName = `sweatpants-${productId - 6}.${file.split('.').pop()}`;
    } else {
      // Fallback: assign to first available slot
      for (let i = 1; i <= 8; i++) {
        if (!autoMapping[i]) {
          productId = i;
          const types = ['tshirt', 'tshirt', 'crop-top', 'crop-top', 'sweatshirt', 'sweatshirt', 'sweatpants', 'sweatpants'];
          const nums = [1, 2, 1, 2, 1, 2, 1, 2];
          newName = `${types[i-1]}-${nums[i-1]}.${file.split('.').pop()}`;
          break;
        }
      }
    }

    if (productId && newName) {
      autoMapping[productId] = { originalFile: file, newName: newName };
    }
  });

  // Copy and rename files
  let copiedCount = 0;
  Object.entries(autoMapping).forEach(([productId, fileInfo]) => {
    try {
      const sourcePath = path.join(sourceFolder, fileInfo.originalFile);
      const targetPath = path.join(targetFolder, fileInfo.newName);

      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copied: ${fileInfo.originalFile} → ${fileInfo.newName} (Product ${productId})`);

      // Update imageMap with actual file extension
      imageMap[productId] = `/images/${fileInfo.newName}`;
      copiedCount++;
    } catch (error) {
      console.error(`❌ Error copying ${fileInfo.originalFile}:`, error.message);
    }
  });

  console.log(`\n📁 Successfully copied ${copiedCount} images\n`);
  return copiedCount > 0;
}

function updateImageUrls() {
  console.log('🖼️  Updating Everwear product image URLs...\n');

  filesToUpdate.forEach(filePath => {
    try {
      console.log(`📝 Updating ${filePath}...`);

      let content = fs.readFileSync(filePath, 'utf8');
      let updatedCount = 0;

      // Update each product's imageUrl
      Object.entries(imageMap).forEach(([productId, imagePath]) => {
        // Check if image file exists
        const fullImagePath = path.join('public', imagePath.substring(1)); // Remove leading /
        if (!fs.existsSync(fullImagePath)) {
          console.log(`   ⚠️  Warning: Image not found: ${fullImagePath}`);
          return;
        }

        // Pattern to match imageUrl for specific product ID
        const pattern = new RegExp(
          `(id:\\s*${productId}[\\s\\S]*?imageUrl:\\s*')[^']*(')`
        );

        if (pattern.test(content)) {
          content = content.replace(pattern, `$1${imagePath}$2`);
          updatedCount++;
          console.log(`   ✅ Updated product ${productId} image`);
        }
      });

      // Write updated content back to file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   📁 ${updatedCount} images updated in ${filePath}\n`);

    } catch (error) {
      console.error(`❌ Error updating ${filePath}:`, error.message);
    }
  });

  console.log('🎉 Image update complete!');
  console.log('💡 Refresh your browser to see the new images.');
}

// Check if target images directory exists
if (!fs.existsSync('public/images')) {
  console.error('❌ Error: public/images directory not found!');
  console.log('💡 Please create the directory first.');
  process.exit(1);
}

console.log('🎨 Everwear Image Setup Script');
console.log('==============================\n');

// Step 1: Copy images from Desktop
const imagesCopied = copyImagesFromDesktop();

if (!imagesCopied) {
  console.log('❌ No images were copied. Please check your Desktop folder.');
  process.exit(1);
}

// Step 2: Update image URLs in code
updateImageUrls();
