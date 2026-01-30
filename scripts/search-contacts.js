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

// Search contact messages
const searchContacts = async (searchTerm) => {
  try {
    // Search by name, email, subject, or message
    const contacts = await Contact.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { subject: { $regex: searchTerm, $options: 'i' } },
        { message: { $regex: searchTerm, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    console.log(`\n🔍 SEARCH RESULTS FOR: "${searchTerm}"`);
    console.log('=====================================');
    console.log(`Found ${contacts.length} matching messages\n`);
    
    if (contacts.length === 0) {
      console.log('No matching contact messages found.');
      return;
    }
    
    contacts.forEach((contact, index) => {
      console.log(`\n📨 RESULT #${index + 1}`);
      console.log('-------------------');
      console.log(`👤 Name: ${contact.name}`);
      console.log(`📧 Email: ${contact.email}`);
      console.log(`📋 Subject: ${contact.subject}`);
      console.log(`📝 Message: ${contact.message.substring(0, 100)}${contact.message.length > 100 ? '...' : ''}`);
      console.log(`🎯 Priority: ${contact.priority}`);
      console.log(`📊 Status: ${contact.status}`);
      console.log(`📅 Submitted: ${contact.formattedDate}`);
      console.log(`🆔 ID: ${contact._id}`);
      console.log('-----------------------------------');
    });
    
  } catch (error) {
    console.error('❌ Error searching contacts:', error);
  }
};

// Get command line arguments
const searchTerm = process.argv[2];

if (!searchTerm) {
  console.log('❌ Please provide a search term');
  console.log('Usage: node search-contacts.js "search term"');
  console.log('Example: node search-contacts.js "urgent"');
  console.log('Example: node search-contacts.js "john@gmail.com"');
  process.exit(1);
}

// Main function
const main = async () => {
  await connectDB();
  await searchContacts(searchTerm);
  
  // Close connection
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

// Run the script
main().catch(console.error);
