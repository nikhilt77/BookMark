import React, { useState } from 'react';
import { useAuth } from '../utils/auth';
import { createReview } from '../utils/api';
import '../styles/ReviewForm.css'

function ReviewForm({ bookId, onReviewAdded }) {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { authUser } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
      setError('')
       if (!authUser){
            setError('You must be logged in to submit a review.');
            return;
      }
       if (!rating || !comment){
            setError('Rating and Comment is required');
            return;
       }

        try {
            const newReview = {
                rating: parseInt(rating,10),
                comment: comment
            }
            const review = await createReview(bookId,newReview, authUser.token);
             onReviewAdded(review)
          setRating('');
          setComment('');
         } catch (error) {
            console.error('Error creating review', error);
                setError(error.message || 'Error creating review')
         }
    };

  return (
       <div className='review-form'>
          <h2>Add Review</h2>
           {error && <p className='error-message'>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='rating'>Rating (1-5):</label>
                  <input
                      type='number'
                      id='rating'
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      min='1'
                      max='5'
                     />
                </div>
              <div className='form-group'>
                <label htmlFor='comment'>Comment:</label>
                   <textarea
                       id='comment'
                       value={comment}
                       onChange={(e) => setComment(e.target.value)}
                       />
              </div>
              <button type='submit'>Submit Review</button>
            </form>
          </div>
  );
}

export default ReviewForm;
