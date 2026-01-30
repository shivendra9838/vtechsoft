import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

dotenv.config();

async function updateAdminAvatar() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update admin user with new avatar
    const adminUser = await User.findOneAndUpdate(
      { email: 'admin@vtechsoft.com' },
      { 
        avatar: 'http://localhost:5173/src/assets/blog/m1.png',
        name: 'VTechSoft Team'
      },
      { new: true }
    );

    if (adminUser) {
      console.log('✅ Successfully updated admin avatar and name');
      console.log('Admin user details:', {
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        avatar: adminUser.avatar
      });
    } else {
      console.log('❌ Admin user not found');
      return;
    }

    // Update all blog posts to reflect the new author name
    const result = await Blog.updateMany(
      { author: adminUser._id },
      { 
        $set: { 
          'author.name': 'VTechSoft Team'
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} blog posts with new author name`);

    // Verify the updates by fetching posts with populated author
    const updatedPosts = await Blog.find({ author: adminUser._id })
      .populate('author', 'name email avatar')
      .limit(2);

    console.log('Sample updated posts:');
    updatedPosts.forEach(post => {
      console.log(`- ${post.title}: ${post.author.name} (${post.author.avatar})`);
    });

  } catch (error) {
    console.error('Error updating admin avatar:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateAdminAvatar();
