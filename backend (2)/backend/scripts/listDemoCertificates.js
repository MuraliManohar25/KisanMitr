import dotenv from 'dotenv';
import supabase from '../config/supabase.js';

dotenv.config();

async function listDemoCertificates() {
  try {
    console.log('✅ Connected to Supabase');

    // Get all analyses (limited to 20)
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select('analysis_id, crop_type, overall_grade, grade_a_count, grade_b_count, grade_c_count, reject_count, farmer_name, farmer_location, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    
    const certificates = (analyses || []).map(a => ({
      analysisId: a.analysis_id,
      cropType: a.crop_type,
      overallGrade: a.overall_grade,
      gradeDistribution: {
        A: a.grade_a_count,
        B: a.grade_b_count,
        C: a.grade_c_count,
        Reject: a.reject_count
      },
      farmerInfo: {
        name: a.farmer_name,
        location: a.farmer_location
      },
      createdAt: a.created_at
    }));

    if (certificates.length === 0) {
      console.log('No certificates found');
      process.exit(0);
    }

    console.log('');
    console.log('📋 Certificates:');
    console.log('');
    
    certificates.forEach((cert, index) => {
      console.log(`${index + 1}. ${cert.analysisId}`);
      console.log(`   Crop: ${cert.cropType} | Grade: ${cert.overallGrade}`);
      console.log(`   Farmer: ${cert.farmerInfo.name}`);
      console.log(`   Created: ${new Date(cert.createdAt).toLocaleString()}`);
      console.log(`   URL: http://localhost:3000/certificate/${cert.analysisId}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listDemoCertificates();

