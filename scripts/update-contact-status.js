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

// Update contact status
const updateContactStatus = async (contactId, status, notes) => {
  try {
    const contact = await Contact.findById(contactId);
    
    if (!contact) {
      console.log(`❌ Contact with ID "${contactId}" not found`);
      return;
    }
    
    // Update the contact
    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }
    
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updateData,
      { new: true, runValidators: true }
    );
    
    console.log(`\n✅ CONTACT STATUS UPDATED`);
    console.log('=====================');
    console.log(`👤 Name: ${updatedContact.name}`);
    console.log(`📧 Email: ${updatedContact.email}`);
    console.log(`📋 Subject: ${updatedContact.subject}`);
    console.log(`📊 Status: ${updatedContact.status} (was: ${contact.status})`);
    console.log(`📅 Updated: ${updatedContact.updatedAt.toLocaleString()}`);
    
    if (notes) {
      console.log(`📝 Notes: ${notes}`);
    }
    
    console.log(`🆔 ID: ${updatedContact._id}`);
    
  } catch (error) {
    console.error('❌ Error updating contact:', error);
  }
};

// Get command line arguments
const contactId = process.argv[2];
const status = process.argv[3];
const notes = process.argv[4];

if (!contactId || !status) {
  console.log('❌ Please provide contact ID and status');
  console.log('Usage: node update-contact-status.js <contactId> <status> [notes]');
  console.log('Example: node update-contact-status.js "507f1f77bcf86cd799439011" "read"');
  console.log('Example: node update-contact-status.js "507f1f77bcf86cd799439011" "replied" "Called customer, discussed project requirements"');
  console.log('');
  console.log('Available statuses: pending, read, replied');
  process.exit(1);
}

if (!['pending', 'read', 'replied'].includes(status)) {
  console.log('❌ Invalid status. Available statuses: pending, read, replied');
  process.exit(1);
}

// Main function
const main = async () => {
  await connectDB();
  await updateContactStatus(contactId, status, notes);
  
  // Close connection
  await mongoose.connection.close();
  console.log('\n✅ Database connection closed');
  process.exit(0);
};

// Run the script
main().catch(console.error);
