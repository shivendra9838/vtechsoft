import mongoose from 'mongoose';
import Blog from './models/Blog.js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  const posts = await Blog.find().select('title image');
  console.log(`Found ${posts.length} blog posts:`);
  console.log('');
  
  posts.forEach((post, index) => {
    console.log(`${index + 1}. Title: ${post.title}`);
    console.log(`   Image: ${post.image || 'NO IMAGE'}`);
    console.log('---');
  });
  
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
