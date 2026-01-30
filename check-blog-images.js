import mongoose from 'mongoose';
import Blog from './models/Blog.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://techsoft:techsoft9838@cluster0.cdfsqrd.mongodb.net')
.then(async () => {
  console.log('Connected to MongoDB');
  
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
