import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from '../models/Contact.js';

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

// Create a test contact message
const createTestContact = async () => {
  try {
    const testContact = new Contact({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+91 8052808612',
      subject: 'Test Message - Website Development',
      message: 'This is a test message to verify that the contact form is working properly. I need a professional website for my business with e-commerce functionality.',
      priority: 'medium'
    });
    
    await testContact.save();
    
    console.log('\n✅ TEST CONTACT CREATED');
    console.log('=====================');
    console.log(`👤 Name: ${testContact.name}`);
    console.log(`📧 Email: ${testContact.email}`);
    console.log(`� Phone: ${testContact.phone}`);
    console.log(`�📋 Subject: ${testContact.subject}`);
    console.log(`📝 Message: ${testContact.message}`);
    console.log(`🎯 Priority: ${testContact.priority}`);
    console.log(`📊 Status: ${testContact.status}`);
    console.log(`📅 Submitted: ${testContact.formattedDate}`);
    console.log(`🆔 ID: ${testContact._id}`);
    console.log('=====================');
    console.log('✅ Test contact saved to database successfully!');
    
    return testContact;
  } catch (error) {
    console.error('❌ Error creating test contact:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createTestContact();
  
  // Close connection
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

// Run the script
main().catch(console.error);
