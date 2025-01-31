const express = require('express');
const authRoutes = require('./api/auth');
const bookRoutes = require('./api/books');
const reviewRoutes = require('./api/reviews')
const authenticateToken = require('./middleware/authMiddleware')
const { body } = require('express-validator');


const router = express.Router();

// Auth routes
router.use('/auth',
    body('username').optional().isString().withMessage('Username must be a string'),
     body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
 authRoutes);

// Book routes
router.use('/books', authenticateToken,
  body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('genre').optional().isString().withMessage('Genre must be a string'),
     body('isbn').notEmpty().isString().withMessage('ISBN must be a string'),
      body('publicationYear').optional().isInt().withMessage('Publication year must be an integer'),
    bookRoutes);
//Review routes
router.use('/reviews', authenticateToken,
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('comment').notEmpty().isString().withMessage('Comment must be a string'),
    reviewRoutes);

module.exports = router;
