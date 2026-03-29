import express from 'express';
import AnalysisModel from '../models/Analysis.js';

const router = express.Router();

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

