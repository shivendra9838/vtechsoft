import mongoose from 'mongoose';
import Blog from './models/Blog.js';
import dotenv from 'dotenv';

dotenv.config();

const localImageUrls = {
  "Building Modern Web Applications with React and TypeScript": "/src/assets/blog/web.png",
  "Mobile App Development: React Native vs Flutter": "/src/assets/blog/mobile.png",
  "Cloud Architecture: AWS vs Azure vs Google Cloud": "/src/assets/blog/cloud.png",
  "From Monolith to Microservices: A Migration Guide": "/src/assets/blog/devops.jpeg",
  "UI/UX Design Trends for 2026": "/src/assets/blog/ui-ux.png",
  "Machine Learning in Web Development": "/src/assets/blog/machine.png"
};

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  // Update all blog posts with local images
  const posts = await Blog.find({});
  console.log(`Found ${posts.length} blog posts`);
  
  for (const post of posts) {
    if (localImageUrls[post.title]) {
      post.image = localImageUrls[post.title];
      await post.save();
      console.log(`✓ Updated local image for: ${post.title}`);
      console.log(`   Image: ${post.image}`);
    }
  }
  
  console.log('\nAll blog posts updated with local assets images!');
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
