import dotenv from 'dotenv';
dotenv.config();
console.log('URL:', process.env.SUPABASE_URL);
console.log('KEY Length:', process.env.SUPABASE_ANON_KEY?.length);
console.log('KEY Start:', process.env.SUPABASE_ANON_KEY?.substring(0, 15));

async function testFetch() {
  try {
    const res = await fetch(process.env.SUPABASE_URL + '/rest/v1/', {
      headers: { 'apikey': process.env.SUPABASE_ANON_KEY }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text.substring(0, 100));
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

testFetch();
