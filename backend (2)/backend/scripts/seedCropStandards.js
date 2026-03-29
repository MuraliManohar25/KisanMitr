import supabase from '../config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

const cropStandards = [
  {
    crop_type: 'apple',
    display_name: 'Apple',
    icon: '🍎',
    grade_a_min_diameter: 70,
    grade_a_max_diameter: 100,
    grade_a_min_hue: 0,
    grade_a_max_hue: 30,
    grade_b_min_diameter: 60,
    grade_b_max_diameter: 70,
    grade_b_min_hue: 0,
    grade_b_max_hue: 40,
    grade_c_min_diameter: 50,
    grade_c_max_diameter: 60,
    grade_c_min_hue: 0,
    grade_c_max_hue: 50
  },
  {
    crop_type: 'tomato',
    display_name: 'Tomato',
    icon: '🍅',
    grade_a_min_diameter: 60,
    grade_a_max_diameter: 90,
    grade_a_min_hue: 340,
    grade_a_max_hue: 20,
    grade_b_min_diameter: 50,
    grade_b_max_diameter: 60,
    grade_b_min_hue: 330,
    grade_b_max_hue: 30,
    grade_c_min_diameter: 40,
    grade_c_max_diameter: 50,
    grade_c_min_hue: 320,
    grade_c_max_hue: 40
  },
  {
    crop_type: 'orange',
    display_name: 'Orange',
    icon: '🍊',
    grade_a_min_diameter: 70,
    grade_a_max_diameter: 90,
    grade_a_min_hue: 10,
    grade_a_max_hue: 30,
    grade_b_min_diameter: 60,
    grade_b_max_diameter: 70,
    grade_b_min_hue: 5,
    grade_b_max_hue: 35,
    grade_c_min_diameter: 50,
    grade_c_max_diameter: 60,
    grade_c_min_hue: 0,
    grade_c_max_hue: 40
  },
  {
    crop_type: 'mango',
    display_name: 'Mango',
    icon: '🥭',
    grade_a_min_diameter: 80,
    grade_a_max_diameter: 120,
    grade_a_min_hue: 30,
    grade_a_max_hue: 60,
    grade_b_min_diameter: 70,
    grade_b_max_diameter: 80,
    grade_b_min_hue: 25,
    grade_b_max_hue: 65,
    grade_c_min_diameter: 60,
    grade_c_max_diameter: 70,
    grade_c_min_hue: 20,
    grade_c_max_hue: 70
  }
];

async function seed() {
  try {
    // Delete existing standards
    const { error: deleteError } = await supabase
      .from('crop_standards')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError && deleteError.code !== 'PGRST116') {
      console.log('Note: Could not delete existing standards (table may not exist yet)');
    }

    // Insert crop standards
    const { data, error } = await supabase
      .from('crop_standards')
      .insert(cropStandards)
      .select();

    if (error) {
      if (error.code === '42P01') {
        console.error('❌ Table "crop_standards" does not exist!');
        console.error('   Please run the SQL schema first: backend/database/schema.sql');
        console.error('   Run it in your Supabase SQL Editor');
        process.exit(1);
      }
      throw error;
    }

    console.log('✅ Crop standards seeded successfully');
    console.log(`   Inserted ${data.length} crop types`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    if (error.code === '42P01') {
      console.error('\n⚠️  Database tables not found!');
      console.error('   Please:');
      console.error('   1. Go to your Supabase project');
      console.error('   2. Open SQL Editor');
      console.error('   3. Run: backend/database/schema.sql');
    }
    process.exit(1);
  }
}

seed();
