import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test registration
const testRegistration = async () => {
  try {
    console.log('\n🧪 TESTING REGISTRATION');
    console.log('=====================');
    
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    console.log('📝 Creating test user:', testUser);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('⚠️  User already exists, deleting...');
      await User.deleteOne({ email: testUser.email });
      console.log('✅ Existing user deleted');
    }
    
    // Create new user
    const user = await User.create(testUser);
    console.log('✅ User created successfully:');
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.createdAt}`);
    
    // Test password comparison
    const isMatch = await user.comparePassword(testUser.password);
    console.log(`   Password match: ${isMatch ? '✅' : '❌'}`);
    
    // Clean up
    await User.deleteOne({ email: testUser.email });
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Registration test error:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach(key => {
        console.error(`${key}: ${error.errors[key].message}`);
      });
    }
  }
};

// Main function
const main = async () => {
  await connectDB();
  await testRegistration();
  
  // Close connection
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

// Run the script
main().catch(console.error);
