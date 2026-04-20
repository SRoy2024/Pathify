const Post = require('../models/Post');

// @desc    Get posts for user's college
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ collegeId: req.user.collegeId })
      .populate('author', 'name profile')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    if (!req.body.content) {
      return res.status(400).json({ message: 'Please add content' });
    }

    const post = await Post.create({
      content: req.body.content,
      author: req.user.id,
      collegeId: req.user.collegeId
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name profile');

    // Add points to user for posting
    req.user.points += 5;
    await req.user.save();

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getPosts,
  createPost,
  deletePost
};
