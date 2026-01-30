import express from 'express';
import Blog from '../models/Blog.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { checkConnection } from '../config/db.js';

const router = express.Router();

// Middleware to check DB connection
const requireDB = (req, res, next) => {
  // Allow requests to proceed even if DB is not connected for demo purposes
  // In production, you might want to enforce DB connection
  next();
};

// @route   GET /api/blog
// @desc    Get all published blog posts
// @access  Public
router.get('/', requireDB, async (req, res) => {
  try {
    const posts = await Blog.find({ published: true })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching blog posts',
    });
  }
});

// @route   GET /api/blog/:id
// @desc    Get single blog post by ID
// @access  Public
router.get('/:id', requireDB, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate('author', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Get blog error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error fetching blog post',
    });
  }
});

// @route   POST /api/blog
// @desc    Create a new blog post
// @access  Private (Admin only)
router.post('/', requireDB, protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, published } = req.body;

    // Validate required fields
    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, excerpt, content, and category',
      });
    }

    const post = await Blog.create({
      title,
      excerpt,
      content,
      category,
      readTime: readTime || '5 min read',
      published: published !== undefined ? published : true,
      author: req.user.id,
    });

    await post.populate('author', 'name');

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post,
    });
  } catch (error) {
    console.error('Create blog error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error creating blog post',
    });
  }
});

// @route   PUT /api/blog/:id
// @desc    Update a blog post
// @access  Private (Admin only)
router.put('/:id', requireDB, protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, category, readTime, published } = req.body;

    let post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    post = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        excerpt,
        content,
        category,
        readTime,
        published,
      },
      { new: true, runValidators: true }
    ).populate('author', 'name');

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: post,
    });
  } catch (error) {
    console.error('Update blog error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating blog post',
    });
  }
});

// @route   DELETE /api/blog/:id
// @desc    Delete a blog post
// @access  Private (Admin only)
router.delete('/:id', requireDB, protect, adminOnly, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    console.error('Delete blog error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error deleting blog post',
    });
  }
});

// @route   POST /api/blog/:id/like
// @desc    Like a blog post
// @access  Public
router.post('/:id/like', requireDB, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    post.likes += 1;
    await post.save();

    res.json({
      success: true,
      message: 'Post liked successfully',
      likes: post.likes,
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error liking post',
    });
  }
});

// @route   POST /api/blog/:id/comment
// @desc    Add comment to a blog post
// @access  Private
router.post('/:id/comment', requireDB, protect, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    const comment = {
      user: req.user.id,
      content: content.trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Populate the comment with user info
    await post.populate({
      path: 'comments.user',
      select: 'name email avatar'
    });

    const newComment = post.comments[post.comments.length - 1];

    res.json({
      success: true,
      message: 'Comment added successfully',
      comment: newComment,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding comment',
    });
  }
});

// @route   GET /api/blog/:id/comments
// @desc    Get all comments for a blog post
// @access  Public
router.get('/:id/comments', requireDB, async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id)
      .populate('comments.user', 'name email avatar')
      .select('comments');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.json({
      success: true,
      comments: post.comments,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching comments',
    });
  }
});

export default router;
