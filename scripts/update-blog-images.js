import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/Blog.js';

dotenv.config();

// Map categories to appropriate images
const categoryImages = {
  'Web Development': 'http://localhost:5173/src/assets/blog/web.png',
  'Mobile Apps': 'http://localhost:5173/src/assets/blog/mobile.png', 
  'Cloud': 'http://localhost:5173/src/assets/blog/cloud.png',
  'DevOps': 'http://localhost:5173/src/assets/blog/devops.jpeg',
  'UI/UX Design': 'http://localhost:5173/src/assets/blog/ui-ux.png',
  'AI/ML': 'http://localhost:5173/src/assets/blog/machine.png'
};

async function updateBlogImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const posts = await Blog.find({});
    console.log(`Found ${posts.length} blog posts to update with category-specific images`);

    for (const post of posts) {
      const categoryImage = categoryImages[post.category];
      
      if (categoryImage) {
        post.image = categoryImage;
        await post.save();
        
        console.log(`✅ Updated: ${post.title}`);
        console.log(`   Category: ${post.category}`);
        console.log(`   Image: ${categoryImage.split('/').pop()}`);
        console.log('');
      } else {
        console.log(`⚠️  No image mapping for category: ${post.category}`);
      }
    }

    console.log(`\n✅ Successfully updated all blog posts with category-specific images!`);

  } catch (error) {
    console.error('Error updating blog images:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateBlogImages();
