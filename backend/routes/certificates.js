import express from 'express';
import AnalysisModel from '../models/Analysis.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all certificates for logged-in user
router.get('/my-certificates', authMiddleware, async (req, res, next) => {
  try {
    const analyses = await AnalysisModel.findByUserId(req.user.id);
    
    // Remove detailed items for list view
    const certificates = analyses.map(a => {
      const { detectionResults, ...rest } = a;
      return {
        ...rest,
        detectionResults: {
          totalCount: detectionResults.totalCount
        }
      };
    });

    res.json({
      certificates,
      count: certificates.length
    });
  } catch (error) {
    next(error);
  }
});

export default router;

