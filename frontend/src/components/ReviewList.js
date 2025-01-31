import React from 'react';
import '../styles/ReviewList.css'

const ReviewList = ({ reviews }) => {
    if (!reviews || reviews.length === 0){
        return <p>No reviews yet.</p>
    }
    return (
       <div className='review-list'>
           <h2>Reviews</h2>
           {reviews.map((review) => (
              <div key={review.id} className='review-item'>
                    <p><strong>User: </strong> {review.user.username}</p>
                     <p><strong>Rating: </strong> {review.rating}</p>
                     <p><strong>Comment: </strong> {review.comment}</p>
              </div>
            ))}
      </div>
    );
};

export default ReviewList;
