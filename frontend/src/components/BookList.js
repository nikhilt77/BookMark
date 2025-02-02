import React, { useState, useEffect } from "react";
import { fetchBooks } from "../utils/api";
import { Link } from "react-router-dom";
import "../styles/BookList.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Get unique genres from books
  const genres = ["all", ...new Set(books.map((book) => book.genre))];

  // Filter books based on search and genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "all" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        {!token && (
          <div className="auth-links">
            <p>
              Please <Link to="/login">login</Link> or{" "}
              <Link to="/register">register</Link> to view books
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="books-container">
      <div className="books-header">
        <h1>Book Collection</h1>
        <div className="action-buttons">
          <Link to="/books/new" className="add-book-btn">
            Add New Book
          </Link>
          <Link to="/books" className="view-all-btn">
            View All Books
          </Link>
        </div>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="genre-filter"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === "all" ? "All Genres" : genre}
            </option>
          ))}
        </select>
      </div>

      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id} className="book-card">
              <div className="book-content">
                <h2 className="book-title">{book.title}</h2>
                <p className="book-author">by {book.author}</p>
                <div className="book-details">
                  <span className="book-genre">{book.genre}</span>
                  <span className="book-year">{book.publicationYear}</span>
                </div>
                <div className="book-meta">
                  <span className="book-isbn">ISBN: {book.isbn}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-results">No books found matching your criteria</p>
        )}
      </div>
    </div>
  );
};

export default BookList;
