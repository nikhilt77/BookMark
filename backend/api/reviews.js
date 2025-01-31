const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

// Get reviews by book ID
router.get('/books/:bookId/reviews', reviewController.getReviewsByBookId);
// Get reviews by ID
router.get('/:id', reviewController.getReviewById)

// Create review
router.post('/books/:bookId/reviews', reviewController.createReview);

// Update review
router.put('/:id', reviewController.updateReview);

// Delete review
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
