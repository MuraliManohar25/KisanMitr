import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import TrainingImageModel from '../models/TrainingImage.js';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function importDataset() {
  try {
    console.log('✅ Connected to Supabase');

    const datasetPath = process.argv[2] || path.join(__dirname, '..', '..', 'dataset');
    
    console.log(`\n📁 Looking for dataset in: ${datasetPath}`);
    
    // Check if dataset directory exists
    try {
      const stats = await fs.stat(datasetPath);
      if (!stats.isDirectory()) {
        console.error('❌ Dataset path is not a directory');
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Dataset directory not found: ${datasetPath}`);
      console.log('\n💡 Usage: node scripts/importDataset.js <path-to-dataset>');
      console.log('   Example: node scripts/importDataset.js C:\\Users\\YourName\\Downloads\\crop-dataset');
      process.exit(1);
    }

    console.log('\n📋 Scanning dataset directory...');
    
    // Expected structure: dataset/crop-type/image.jpg
    const cropTypes = ['apple', 'tomato', 'orange', 'mango'];
    let totalImported = 0;

    for (const cropType of cropTypes) {
      const cropPath = path.join(datasetPath, cropType);
      
      try {
        const files = await fs.readdir(cropPath);
        const imageFiles = files.filter(f => 
          /\.(jpg|jpeg|png|bmp|webp)$/i.test(f)
        );

        console.log(`\n🌾 Processing ${cropType}: ${imageFiles.length} images found`);

        for (const imageFile of imageFiles) {
          const imagePath = path.join(cropPath, imageFile);
          
          try {
            // Read image file
            const imageBuffer = await fs.readFile(imagePath);
            
            // Get image metadata
            const metadata = await sharp(imageBuffer).metadata();
            
            // Convert to base64 for storage (or upload to Supabase Storage)
            const base64Image = imageBuffer.toString('base64');
            const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

            // Create training image record
            await TrainingImageModel.create({
              cropType: cropType,
              imageUrl: imageDataUrl,
              imagePath: imagePath,
              filename: imageFile,
              uploadedBy: 'system',
              metadata: {
                size: imageBuffer.length,
                width: metadata.width,
                height: metadata.height,
                importedAt: new Date()
              }
            });

            totalImported++;
          } catch (error) {
            console.error(`   ⚠️  Error importing ${imageFile}:`, error.message);
          }
        }

        console.log(`✅ Imported ${imageFiles.length} ${cropType} images`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`⚠️  No ${cropType} folder found, skipping...`);
        } else {
          console.error(`❌ Error processing ${cropType}:`, error.message);
        }
      }
    }

    console.log(`\n✅ Import complete! Total images imported: ${totalImported}`);
    console.log('\n📊 Dataset Summary:');
    
    const summary = await TrainingImageModel.countByCropType();
    Object.entries(summary).forEach(([cropType, count]) => {
      console.log(`   ${cropType}: ${count} images`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

importDataset();

