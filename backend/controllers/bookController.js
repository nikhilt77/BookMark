const Book = require('../models/book');
const { validationResult } = require('express-validator');

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        res.json(books);
      } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books', error: error.message });
      }
};

const getBookById = async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      res.status(500).json({ message: 'Error fetching book', error: error.message });
    }
  };


const createBook = async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  try {
      const { title, author, genre, isbn, publicationYear, coverImage } = req.body;

      const existingBook = await Book.findOne({ where: { isbn } });
        if (existingBook) {
            return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }

      const newBook = await Book.create({ title, author, genre, isbn, publicationYear, coverImage });
      res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ message: 'Error creating book', error: error.message});
    }
};

const updateBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const bookId = req.params.id;
      const { title, author, genre, isbn, publicationYear, coverImage } = req.body;
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
    const existingBook = await Book.findOne({ where: { isbn } });
    if (existingBook && existingBook.id !== Number(bookId)) {
        return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
      await book.update({ title, author, genre, isbn, publicationYear, coverImage });
      res.json({ message: 'Book updated successfully', book });
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ message: 'Error updating book', error: error.message });
    }
  };

const deleteBook = async (req, res) => {
    try {
      const bookId = req.params.id;
      const book = await Book.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      await book.destroy();
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
  };


module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
