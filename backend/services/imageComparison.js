import TrainingImageModel from '../models/TrainingImage.js';
import sharp from 'sharp';
import axios from 'axios';

/**
 * Compare uploaded image with training dataset
 * Returns similar images and their grades for reference
 */
export default {
  async findSimilarImages(imageBuffer, cropType, limit = 5) {
    try {
      // Get training images for this crop type
      const trainingImages = await TrainingImageModel.findByCropType(cropType, 100);

      if (trainingImages.length === 0) {
        return {
          similar: [],
          message: 'No training images found for comparison'
        };
      }

      // For now, return random samples from training set
      // In production, you'd implement actual image similarity comparison
      // using techniques like:
      // - Feature extraction (SIFT, ORB)
      // - Deep learning embeddings
      // - Histogram comparison
      // - Color space analysis

      const shuffled = trainingImages.sort(() => 0.5 - Math.random());
      const similar = shuffled.slice(0, limit).map(img => ({
        imageUrl: img.imageUrl,
        labels: img.labels || [],
        metadata: img.metadata
      }));

      return {
        similar,
        totalTrainingImages: trainingImages.length
      };
    } catch (error) {
      console.error('Error finding similar images:', error);
      return {
        similar: [],
        error: error.message
      };
    }
  },

  /**
   * Extract features from image for comparison
   */
  async extractImageFeatures(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      const stats = await sharp(imageBuffer).stats();

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        dominantColors: stats.channels.map(ch => ({
          mean: ch.mean,
          stdev: ch.stdev
        })),
        histogram: stats.channels.map(ch => ch.histogram)
      };
    } catch (error) {
      console.error('Error extracting features:', error);
      return null;
    }
  },

  /**
   * Compare image features with training set
   */
  async compareFeatures(imageFeatures, cropType) {
    // This is a placeholder for actual feature comparison
    // In production, implement proper similarity metrics
    const trainingImages = await TrainingImageModel.findByCropType(cropType, 10);
    
    return trainingImages.map(img => ({
      similarity: Math.random() * 0.3 + 0.7, // Placeholder
      imageUrl: img.imageUrl,
      labels: img.labels || []
    })).sort((a, b) => b.similarity - a.similarity);
  }
};

