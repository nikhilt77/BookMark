import React, { useState } from "react";
import { useAuth } from "../utils/auth";
import { createReview } from "../utils/api";
import "../styles/ReviewForm.css";

function ReviewForm({ bookId, onReviewAdded }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuth();

  // Add star rating display
  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${parseInt(rating) >= star ? "filled" : ""}`}
        onClick={() => setRating(star.toString())}
      >
        ★
      </span>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!authUser) {
      setError("You must be logged in to submit a review.");
      setLoading(false);
      return;
    }

    if (!rating) {
      setError("Please select a rating");
      setLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment");
      setLoading(false);
      return;
    }

    if (comment.length < 10) {
      setError("Comment must be at least 10 characters long");
      setLoading(false);
      return;
    }

    try {
      const newReview = {
        rating: parseInt(rating, 10),
        comment: comment.trim(),
      };

      const review = await createReview(bookId, newReview, authUser.token);
      onReviewAdded(review);

      // Reset form
      setRating("");
      setComment("");

      // Show success message (optional)
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error creating review:", error);
      setError(error.message || "Error creating review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <h2>Add Review</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating:</label>
          <div className="star-rating">{renderStars()}</div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here (minimum 10 characters)"
            disabled={loading}
            minLength={10}
          />
          <small className="character-count">
            {comment.length} characters (minimum 10)
          </small>
        </div>

        <button
          type="submit"
          disabled={loading || !authUser}
          className={loading ? "loading" : ""}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;
