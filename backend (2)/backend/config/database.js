import supabase from './supabase.js';

export default async function connectDB() {
  try {
    // Test connection by querying a simple table
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist - schema not created yet
      console.log('⚠️ Database tables not found. Please run schema.sql in Supabase SQL Editor');
      console.log('   See: backend/database/schema.sql');
    } else if (error) {
      throw error;
    } else {
      console.log('✅ Supabase connected');
    }
  } catch (error) {
    console.error('⚠️ Supabase connection error:', error.message);
    console.log('⚠️ Continuing without database - some features may not work');
    console.log('⚠️ To fix: Set up Supabase and update SUPABASE_URL and SUPABASE_ANON_KEY in .env file');
    // Don't exit - allow server to run without DB for testing
  }
}

