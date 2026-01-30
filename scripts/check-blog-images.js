import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/Blog.js';

dotenv.config();

async function checkBlogImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const posts = await Blog.find({});
    console.log(`Checking ${posts.length} blog posts for images:`);

    for (const post of posts) {
      console.log(`\n📝 ${post.title}`);
      console.log(`   Category: ${post.category}`);
      console.log(`   Image: ${post.image || 'NO IMAGE'}`);
      console.log(`   Avatar: ${post.avatar || 'NO AVATAR'}`);
      console.log(`   Likes: ${post.likes}, Views: ${post.views}`);
    }

  } catch (error) {
    console.error('Error checking blog images:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkBlogImages();
