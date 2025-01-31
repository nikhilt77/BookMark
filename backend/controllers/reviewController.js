const Review = require('../models/review');
const { validationResult } = require('express-validator');

const getReviewsByBookId = async (req, res) => {
    try {
        const bookId = req.params.bookId
      const reviews = await Review.findAll({
          where: { bookId },
            include: {
            model: require('../models/user'),
                as: 'user',
                attributes: ['id','username'],
          }
        });
    
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews by book ID:', error);
      res.status(500).json({ message: 'Error fetching reviews', error: error.message});
    }
};


const getReviewById = async (req, res) => {
    try {
        const reviewId = req.params.id
        const review = await Review.findByPk(reviewId,{
            include: {
            model: require('../models/user'),
                as: 'user',
                 attributes: ['id','username'],
          }
        });

        if (!review) {
          return res.status(404).json({ message: 'Review not found' });
        }
    
        res.json(review);
      } catch (error) {
        console.error('Error fetching review by ID:', error);
        res.status(500).json({ message: 'Error fetching review', error: error.message });
      }
}

const createReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  try {
      const { rating, comment } = req.body;
       const bookId = req.params.bookId
        const userId = req.user.id
      const newReview = await Review.create({ rating, comment, bookId, userId });
         const review = await Review.findByPk(newReview.id,{
            include: {
            model: require('../models/user'),
                as: 'user',
                attributes: ['id','username'],
          }
         })
      res.status(201).json({ message: 'Review created successfully', review });
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: 'Error creating review', error: error.message });
    }
};

const updateReview = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
      const reviewId = req.params.id
      const { rating, comment } = req.body;

       const review = await Review.findByPk(reviewId)
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
        if (review.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized: You can only update your own reviews.' });
    }

      await review.update({ rating, comment });
        const updatedReview = await Review.findByPk(reviewId,{
            include: {
            model: require('../models/user'),
                as: 'user',
                 attributes: ['id','username'],
          }
        });

      res.json({ message: 'Review updated successfully', review:updatedReview });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  };

const deleteReview = async (req, res) => {
    try {
      const reviewId = req.params.id;
       const review = await Review.findByPk(reviewId)
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
        if (review.userId !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized: You can only delete your own reviews.' });
        }

      await review.destroy();
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};

module.exports = { getReviewsByBookId, createReview, updateReview, deleteReview, getReviewById };
