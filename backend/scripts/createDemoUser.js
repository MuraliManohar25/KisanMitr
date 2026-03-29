import UserModel from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function createDemoUser() {
  try {
    // Check if demo user exists
    const existingUser = await UserModel.findByEmail('demo@farmer.com');
    if (existingUser) {
      console.log('✅ Demo user already exists');
      console.log('Email: demo@farmer.com');
      console.log('Password: demo123');
      process.exit(0);
    }

    // Create demo user
    const demoUser = await UserModel.create({
      username: 'demo',
      email: 'demo@farmer.com',
      password: 'demo123',
      farmerName: 'Demo Farmer',
      location: 'Demo Village',
      phone: '1234567890'
    });

    console.log('✅ Demo user created successfully!');
    console.log('');
    console.log('Demo Credentials:');
    console.log('Email: demo@farmer.com');
    console.log('Password: demo123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '42P01') {
      console.error('\n⚠️  Database tables not found!');
      console.error('   Please run schema.sql in Supabase SQL Editor');
    }
    process.exit(1);
  }
}

createDemoUser();
