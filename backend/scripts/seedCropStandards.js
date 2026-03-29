import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Supabase credentials not found in .env file');
  process.exit(1);
}

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
  const client = axios.create({
    baseURL: `${supabaseUrl}/rest/v1`,
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });

  try {
    console.log('Attempting to delete existing standards...');
    // Delete all except dummy (equivalent to delete all)
    await client.delete('/crop_standards?id=neq.00000000-0000-0000-0000-000000000000');
    
    console.log('Inserting crop standards...');
    const response = await client.post('/crop_standards', cropStandards);

    console.log('✅ Crop standards seeded successfully');
    console.log(`   Inserted ${response.data.length} crop types`);
    process.exit(0);
  } catch (error) {
    if (error.response?.status === 404 || error.response?.data?.code === '42P01') {
      console.error('❌ Table "crop_standards" does not exist!');
      console.error('   Please run the SQL schema first: backend/database/schema.sql');
    } else {
      console.error('❌ Seeding error:', error.response?.data || error.message);
    }
    process.exit(1);
  }
}

seed();
