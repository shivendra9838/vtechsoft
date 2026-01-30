import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

dotenv.config();

async function testNewPost() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ email: 'admin@vtechsoft.com' });
    
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }

    // Create a new test blog post
    const newPost = await Blog.create({
      title: "Test Post with New Avatar",
      excerpt: "This is a test post to verify the admin avatar is working",
      content: "# Test Post\n\nThis is a test post to verify that the admin avatar is properly displayed in the blog posts.",
      category: "Web Development",
      readTime: "2 min read",
      published: true,
      author: adminUser._id
    });

    // Populate the author to test
    await newPost.populate('author', 'name avatar');

    console.log('New post created:');
    console.log('Title:', newPost.title);
    console.log('Author name:', newPost.author.name);
    console.log('Author avatar:', newPost.author.avatar);
    console.log('Avatar exists:', !!newPost.author.avatar);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testNewPost();
