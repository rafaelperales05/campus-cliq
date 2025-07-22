import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';

const router = express.Router();

// Validation rules
const postValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters')
    .escape(), // Sanitize HTML
];

// --- Reusable Database Service Function ---
const getCompletePostQuery = (postId = null) => {
  const query = db('posts')
    .select(
      'posts.*',
      'users.name as author_name',
      'users.email as author_email',
      'users.major as author_major',
      'users.year as author_year',
      'clubs.name as club_name'
    )
    .leftJoin('users', 'posts.author_id', 'users.id')
    .leftJoin('clubs', 'posts.club_id', 'clubs.id');

  if (postId) {
    return query.where('posts.id', postId).first();
  }

  return query.orderBy('posts.created_at', 'desc');
};
// -----------------------------------------

// GET /api/posts - Get all posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await getCompletePostQuery();
    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
});

// POST /api/posts - Create a new post
router.post('/', postValidation, async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors.array(),
          status: 400
        }
      });
    }

    const { content, club_id } = req.body;

    const [newPost] = await db('posts')
      .insert({
        content,
        author_id: req.user.id,
        club_id: club_id || null,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      })
      .returning('*');

    // REUSE the query function to get the full post data
    const completePost = await getCompletePostQuery(newPost.id);

    res.status(201).json({
      success: true,
      data: completePost,
      message: 'Post created successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', async (req, res, next) => {
  try {
    const postId = req.params.id;
    
    // Check if post exists and user owns it
    const post = await db('posts').where({ id: postId }).first();
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { message: 'Post not found', status: 404 }
      });
    }
    
    // Only allow deletion by author or admin
    if (post.author_id !== req.user.id && req.user.role !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to delete this post', status: 403 }
      });
    }
    
    await db('posts').where({ id: postId }).del();
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;