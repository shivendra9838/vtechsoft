import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

async function makeAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update user role to admin
    const result = await User.updateOne(
      { email: 'admin@vtechsoft.com' },
      { role: 'admin' }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated user role to admin');
    } else {
      console.log('❌ User not found or already admin');
    }

    // Verify the update
    const adminUser = await User.findOne({ email: 'admin@vtechsoft.com' });
    console.log('User details:', {
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await mongoose.disconnect();
  }
}

makeAdmin();
