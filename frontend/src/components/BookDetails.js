import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookById, fetchReviewsByBookId } from '../utils/api';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import '../styles/BookDetails.css';
function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const getBookData = async () => {
      try{
            const bookData = await fetchBookById(bookId);
            setBook(bookData)
        } catch(error) {
            console.log('Error fetching book', error)
            setError(error.message || 'Error fetching book');
        }
       try{
            const reviewsData = await fetchReviewsByBookId(bookId);
            setReviews(reviewsData);
         } catch(error) {
             console.log('Error fetching reviews', error)
              setError(error.message || 'Error fetching reviews');
         }
      finally{
            setLoading(false)
         }
    }
       getBookData();
  }, [bookId]);

    const handleReviewAdded = (newReview) => {
      setReviews([...reviews, newReview]);
    };

  if (loading) {
      return <p>Loading Book Details...</p>
    }
     if (error) {
      return <p>Error: {error}</p>;
    }
  if (!book) {
      return <p>Book not found</p>
  }


  return (
    <div className='book-details'>
       <div className='book-details-info'>
            {book.coverImage &&
             <img className='book-cover' src={book.coverImage} alt={book.title} />
            }
        <div className='book-info'>
          <h2>{book.title}</h2>
          <p>By: {book.author}</p>
            <p>Genre: {book.genre}</p>
             <p>ISBN: {book.isbn}</p>
               <p>Published: {book.publicationYear}</p>
         </div>
       </div>
      <ReviewForm bookId={bookId} onReviewAdded={handleReviewAdded} />
      <ReviewList reviews={reviews} />
    </div>
  );
}

export default BookDetails;
