import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/Blog.js';

dotenv.config();

const avatars = [
  'http://localhost:5173/src/assets/blog/m1.png',
  'http://localhost:5173/src/assets/blog/m2.png',
  'http://localhost:5173/src/assets/blog/m3.png',
  'http://localhost:5173/src/assets/blog/w1.png',
  'http://localhost:5173/src/assets/blog/w2.png',
  'http://localhost:5173/src/assets/blog/w3.png'
];

async function updateBlogAvatarsAndEngagement() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const posts = await Blog.find({});
    console.log(`Found ${posts.length} blog posts to update`);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const avatar = avatars[i % avatars.length];
      
      // Update with unique avatar and random engagement data
      post.avatar = avatar;
      post.likes = Math.floor(Math.random() * 50) + 10; // 10-60 likes
      post.views = Math.floor(Math.random() * 500) + 100; // 100-600 views
      
      await post.save();
      
      console.log(`✅ Updated: ${post.title.substring(0, 30)}...`);
      console.log(`   Avatar: ${avatar.split('/').pop()}`);
      console.log(`   Likes: ${post.likes}, Views: ${post.views}`);
    }

    console.log(`\n✅ Successfully updated all ${posts.length} blog posts!`);

  } catch (error) {
    console.error('Error updating blog posts:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateBlogAvatarsAndEngagement();
