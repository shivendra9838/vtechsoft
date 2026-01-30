import mongoose from 'mongoose';
import Blog from './models/Blog.js';
import dotenv from 'dotenv';

dotenv.config();

const imageUrls = {
  "Building Modern Web Applications with React and TypeScript": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=entropy&auto=format",
  "Mobile App Development: React Native vs Flutter": "https://images.unsplash.com/photo-1551650975-87deedd944cb?w=800&h=400&fit=crop&crop=entropy&auto=format",
  "Cloud Architecture: AWS vs Azure vs Google Cloud": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&crop=entropy&auto=format",
  "From Monolith to Microservices: A Migration Guide": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&crop=entropy&auto=format",
  "UI/UX Design Trends for 2026": "https://images.unsplash.com/photo-1559028006-8488bf3e1cef?w=800&h=400&fit=crop&crop=entropy&auto=format",
  "Machine Learning in Web Development": "https://images.unsplash.com/photo-1555250002-52383c5a6d0c?w=800&h=400&fit=crop&crop=entropy&auto=format"
};

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  // Update all blog posts with images
  const posts = await Blog.find({});
  console.log(`Found ${posts.length} blog posts`);
  
  for (const post of posts) {
    if (imageUrls[post.title]) {
      post.image = imageUrls[post.title];
      await post.save();
      console.log(`✓ Updated image for: ${post.title}`);
    }
  }
  
  console.log('\nAll blog posts updated with images!');
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
