const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.route('/:id')
  .delete(protect, deletePost);

module.exports = router;
