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

// View all contact messages
const viewContacts = async () => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    console.log('\n📧 CONTACT MESSAGES DATABASE');
    console.log('=====================================');
    console.log(`Total messages: ${contacts.length}\n`);
    
    if (contacts.length === 0) {
      console.log('No contact messages found in database.');
      return;
    }
    
    contacts.forEach((contact, index) => {
      console.log(`\n📨 MESSAGE #${index + 1}`);
      console.log('-------------------');
      console.log(`👤 Name: ${contact.name}`);
      console.log(`📧 Email: ${contact.email}`);
      console.log(`� Phone: ${contact.phone}`);
      console.log(`� Subject: ${contact.subject}`);
      console.log(`📝 Message: ${contact.message}`);
      console.log(`🎯 Priority: ${contact.priority}`);
      console.log(`📊 Status: ${contact.status}`);
      console.log(`📅 Submitted: ${contact.formattedDate}`);
      console.log(`⏰ Created At: ${contact.createdAt.toISOString()}`);
      console.log(`🆔 ID: ${contact._id}`);
      
      if (contact.notes) {
        console.log(`📝 Notes: ${contact.notes}`);
      }
      
      if (contact.assignedTo) {
        console.log(`👥 Assigned To: ${contact.assignedTo}`);
      }
      
      console.log('-----------------------------------');
    });
    
    // Summary statistics
    const pending = contacts.filter(c => c.status === 'pending').length;
    const read = contacts.filter(c => c.status === 'read').length;
    const replied = contacts.filter(c => c.status === 'replied').length;
    const high = contacts.filter(c => c.priority === 'high').length;
    const medium = contacts.filter(c => c.priority === 'medium').length;
    const low = contacts.filter(c => c.priority === 'low').length;
    
    console.log('\n📊 SUMMARY STATISTICS');
    console.log('====================');
    console.log(`📋 Pending: ${pending}`);
    console.log(`👁️  Read: ${read}`);
    console.log(`✅ Replied: ${replied}`);
    console.log(`🔥 High Priority: ${high}`);
    console.log(`⚡ Medium Priority: ${medium}`);
    console.log(`💚 Low Priority: ${low}`);
    
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await viewContacts();
  
  // Close connection
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

// Run the script
main().catch(console.error);
