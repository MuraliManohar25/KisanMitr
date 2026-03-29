import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import yoloService from '../services/yoloService.js';
import gradingEngine from '../services/gradingEngine.js';
import imageComparison from '../services/imageComparison.js';
import AnalysisModel from '../models/Analysis.js';
import recommendationService from '../services/recommendationService.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

const upload = multer({ dest: uploadsDir });

router.post('/', upload.single('image'), async (req, res, next) => {
  console.log("Analyze route hit - Supabase version");
  try {
    let { cropType, farmerName, location, phone, userId } = req.body;
    const imagePath = req.file.path;

    if (!imagePath) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // 1. Preprocess image
    const processedPath = `${imagePath}-processed.jpg`;
    await sharp(imagePath)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toFile(processedPath);

    // 2. YOLO Detection
    const detections = await yoloService.detectObjects(processedPath, cropType || 'auto');

    // Auto-detect crop type logic
    if (!cropType || cropType === 'auto') {
      cropType = detections.detectedCropType || 'tomato';
      console.log(`🤖 Auto-detected crop: ${cropType}`);
    }

    // 3. Compare with training dataset (optional)
    let similarImages = null;
    try {
      const imageBuffer = await fs.readFile(processedPath);
      similarImages = await imageComparison.findSimilarImages(imageBuffer, cropType, 3);
    } catch (error) {
      console.log('Dataset comparison skipped:', error.message);
    }

    // 4. Grading
    const gradedResults = await gradingEngine.grade(detections, cropType);

    // 5. Detect Health Issues (Aggregate)
    const detectedDisease = gradedResults.detectionResults.items.reduce((acc, item) => {
      // If any item has a disease (not "Healthy"), flag it. 
      const healthStatus = item.healthStatus || 'Healthy';
      if (healthStatus !== 'Healthy' && healthStatus !== 'None') {
        if (acc === 'Rot') return acc;
        if (healthStatus === 'Rot') return 'Rot';
        return healthStatus;
      }
      return acc;
    }, 'No Disease Detected');

    // 6. Get Recommendations
    const recommendations = recommendationService.getRecommendations(
      cropType,
      gradedResults.overallGrade,
      detectedDisease === 'No Disease Detected' ? null : detectedDisease
    );

    // 7. Generate Analysis ID
    const analysisId = `FTC-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // 8. Save to DB
    const analysis = await AnalysisModel.create({
      analysisId,
      userId: userId || null,
      cropType,
      farmerInfo: { name: farmerName, location, phone },
      imageUrl: `/uploads/${path.basename(processedPath)}`,
      detectionResults: gradedResults.detectionResults,
      overallGrade: gradedResults.overallGrade,
      gradeDistribution: gradedResults.gradeDistribution,
      certificateHash: crypto.createHash('sha256').update(analysisId + Date.now()).digest('hex'),
      verified: false,
      diseaseDetected: detectedDisease,
      recommendations: recommendations
    });

    // 9. Cleanup original file (keep processed)
    await fs.unlink(imagePath).catch(console.error);

    res.json({
      analysisId,
      ...gradedResults,
      similarImages: similarImages?.similar || null,
      datasetInfo: similarImages ? {
        totalTrainingImages: similarImages.totalTrainingImages
      } : null
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:analysisId', async (req, res, next) => {
  try {
    const analysis = await AnalysisModel.findByAnalysisId(req.params.analysisId);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
    res.json(analysis);
  } catch (error) {
    next(error);
  }
});

export default router;

