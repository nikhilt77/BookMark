import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook } from "../utils/api";
import "../styles/AddBookForm.css";

const AddBookForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    publicationYear: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to add a book");
      }

      await createBook(bookData);
      navigate("/");
    } catch (err) {
      setError(err.message || "Error adding book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-page">
      <div className="add-book-container">
        <div className="form-header">
          <h1>Add New Book</h1>
          <p>Enter the book details below</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={bookData.title}
              onChange={handleChange}
              required
              placeholder="Enter book title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author*</label>
            <input
              type="text"
              id="author"
              name="author"
              value={bookData.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="genre">Genre*</label>
            <select
              id="genre"
              name="genre"
              value={bookData.genre}
              onChange={handleChange}
              required
            >
              <option value="">Select genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Biography">Biography</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="isbn">ISBN*</label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={bookData.isbn}
              onChange={handleChange}
              required
              placeholder="Enter ISBN"
            />
          </div>

          <div className="form-group">
            <label htmlFor="publicationYear">Publication Year</label>
            <input
              type="number"
              id="publicationYear"
              name="publicationYear"
              value={bookData.publicationYear}
              onChange={handleChange}
              placeholder="Enter publication year"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Adding Book..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookForm;
