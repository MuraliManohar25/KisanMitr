import dotenv from 'dotenv';
import AnalysisModel from '../models/Analysis.js';
import crypto from 'crypto';

dotenv.config();

async function createDemoCertificate() {
  try {
    console.log('✅ Connected to Supabase');

    // Create a demo analysis with sample data
    const analysisId = `FTC-${new Date().getFullYear()}-DEMO-${Date.now().toString(36).toUpperCase()}`;
    
    const demoAnalysis = await AnalysisModel.create({
      analysisId,
      userId: null, // No user linked for demo
      cropType: 'apple',
      farmerInfo: {
        name: 'Demo Farmer',
        location: 'Demo Village, Demo State',
        phone: '+91 98765 43210'
      },
      imageUrl: '/uploads/demo-image.jpg', // Placeholder
      detectionResults: {
        totalCount: 45,
        items: [] // Empty for demo
      },
      overallGrade: 'A',
      gradeDistribution: {
        A: 30,
        B: 12,
        C: 3,
        Reject: 0
      },
      certificateHash: crypto.createHash('sha256').update(analysisId + Date.now()).digest('hex'),
      verified: true
    });
    
    console.log('');
    console.log('✅ Demo Certificate Created Successfully!');
    console.log('');
    console.log('📋 Certificate Details:');
    console.log(`   Analysis ID: ${analysisId}`);
    console.log(`   Crop Type: Apple`);
    console.log(`   Overall Grade: A`);
    console.log(`   Total Items: 45`);
    console.log(`   Grade A: 30, Grade B: 12, Grade C: 3`);
    console.log('');
    console.log('🌐 View Certificate:');
    console.log(`   http://localhost:3000/certificate/${analysisId}`);
    console.log('');
    console.log('🗑️  To Delete This Certificate:');
    console.log(`   Run: node scripts/deleteDemoCertificate.js ${analysisId}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDemoCertificate();

