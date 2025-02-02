import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchBookById, fetchReviewsByBookId } from "../utils/api";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import "../styles/BookDetails.css";

function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const getBookData = async () => {
      setLoading(true);
      try {
        const [bookData, reviewsData] = await Promise.all([
          fetchBookById(bookId),
          fetchReviewsByBookId(bookId),
        ]);
        setBook(bookData);
        setReviews(reviewsData);

        // Calculate average rating
        if (reviewsData.length > 0) {
          const avgRating = (
            reviewsData.reduce((acc, review) => acc + review.rating, 0) /
            reviewsData.length
          ).toFixed(1);
          setAverageRating(avgRating);
        }
      } catch (error) {
        setError(error.message || "Error fetching book details");
      } finally {
        setLoading(false);
      }
    };

    getBookData();
  }, [bookId]);

  const handleReviewAdded = (newReview) => {
    setReviews((prevReviews) => {
      const updatedReviews = [...prevReviews, newReview];
      const newAvg = (
        updatedReviews.reduce((acc, review) => acc + review.rating, 0) /
        updatedReviews.length
      ).toFixed(1);
      setAverageRating(newAvg);
      return updatedReviews;
    });
  };

  if (loading) {
    return <div className="loading-container">Loading book details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!book) {
    return <div className="not-found-container">Book not found</div>;
  }

  return (
    <div className="book-details-page">
      <div className="book-details-container">
        <div className="book-header">
          <div className="book-title-section">
            <h1>{book.title}</h1>
            <div className="book-meta">
              <span className="book-author">by {book.author}</span>
              {averageRating > 0 && (
                <div className="rating-badge">
                  <span className="stars">★</span>
                  {averageRating}
                  <span className="review-count">
                    ({reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="book-content">
          <div className="book-info-card">
            <div className="book-metadata">
              <div className="metadata-item">
                <span className="label">Genre</span>
                <span className="value">{book.genre}</span>
              </div>
              <div className="metadata-item">
                <span className="label">ISBN</span>
                <span className="value">{book.isbn}</span>
              </div>
              <div className="metadata-item">
                <span className="label">Publication Year</span>
                <span className="value">{book.publicationYear}</span>
              </div>
            </div>
          </div>

          <div className="reviews-section">
            <div className="reviews-header">
              <h2>Reviews</h2>
              {reviews.length > 0 && (
                <div className="reviews-summary">
                  <span className="rating-large">★ {averageRating}</span>
                  <span className="rating-details">
                    Based on {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </span>
                </div>
              )}
            </div>

            <ReviewForm bookId={bookId} onReviewAdded={handleReviewAdded} />

            {reviews.length > 0 ? (
              <ReviewList reviews={reviews} />
            ) : (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this book!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
