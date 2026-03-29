import dotenv from 'dotenv';
import supabase from '../config/supabase.js';

dotenv.config();

const analysisId = process.argv[2];

if (!analysisId) {
  console.error('❌ Please provide an Analysis ID');
  console.log('Usage: node scripts/deleteDemoCertificate.js <analysisId>');
  process.exit(1);
}

async function deleteDemoCertificate() {
  try {
    console.log('✅ Connected to Supabase');

    // Find analysis by analysis_id
    const { data: analysis, error: findError } = await supabase
      .from('analyses')
      .select('id')
      .eq('analysis_id', analysisId)
      .single();
    
    if (findError || !analysis) {
      console.log(`⚠️  Certificate ${analysisId} not found`);
      process.exit(0);
    }

    // Delete analysis (cascade will delete items)
    const { error: deleteError } = await supabase
      .from('analyses')
      .delete()
      .eq('id', analysis.id);
    
    if (deleteError) throw deleteError;
    
    console.log(`✅ Certificate ${analysisId} deleted successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deleteDemoCertificate();

