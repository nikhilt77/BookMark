const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../config/database');
const Book = require('../models/book');
const User = require('../models/user');

const { generateToken } = require('../utils/authUtils');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Drop and create tables

   await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
  
    await Book.create({
        title: 'Test Book 1',
        author: 'Test Author 1',
        genre: 'Fiction',
        isbn: '12345678901',
    });
});

afterAll(async () => {
    await sequelize.close();
})

describe('Book API Endpoints', () => {
  it('should get all books', async () => {
    const response = await request(app).get('/api/books');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Array))
  });

  it('should get a book by ID', async () => {
     const book = await Book.findOne({ where: { isbn: '12345678901' } });
    const response = await request(app).get('/api/books/'+book.id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('title', 'Test Book 1');
  });

  it('should return 404 if book not found', async () => {
      const response = await request(app).get('/api/books/999');
      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('Book not found');
  });


    it('should create a new book', async () => {
       const user = await User.findOne({ where: { email: 'test@example.com' } });
         const token = generateToken(user.id)
    const response = await request(app)
        .post('/api/books')
        .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'New Book',
        author: 'New Author',
        genre: 'Mystery',
        isbn: '9876543210',
        publicationYear: 2023
      });
    expect(response.statusCode).toBe(201);
     expect(response.body).toHaveProperty('book');
     expect(response.body.message).toEqual('Book created successfully');
  });
  it('should not create a new book with invalid isbn', async () => {
       const user = await User.findOne({ where: { email: 'test@example.com' } });
         const token = generateToken(user.id)
        const response = await request(app)
        .post('/api/books')
        .set('Authorization', 'Bearer ' + token)
          .send({
            title: 'New Book',
            author: 'New Author',
            genre: 'Mystery',
            isbn: '9876543210',
            publicationYear: 'invalid'
          });
    expect(response.statusCode).toBe(400);
       expect(response.body.errors).toEqual(expect.any(Array))
  });
 it('should not create a new book if isbn already exist', async () => {
    const user = await User.findOne({ where: { email: 'test@example.com' } });
         const token = generateToken(user.id)
    const response = await request(app)
        .post('/api/books')
        .set('Authorization', 'Bearer ' + token)
      .send({
        title: 'Existing Book',
        author: 'Existing Author',
        genre: 'Fiction',
        isbn: '12345678901',
        publicationYear: 2023
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Book with this ISBN already exists');
  });


  it('should update an existing book', async () => {
     const book = await Book.findOne({ where: { isbn: '12345678901' } });
       const user = await User.findOne({ where: { email: 'test@example.com' } });
         const token = generateToken(user.id)
    const response = await request(app)
      .put('/api/books/'+book.id)
       .set('Authorization', 'Bearer ' + token)
      .send({
          title: 'Updated Book',
          author: 'Updated Author',
          genre: 'Thriller',
           isbn: '12345678902',
          publicationYear: 2024,
      });
    expect(response.statusCode).toBe(200);
     expect(response.body).toHaveProperty('book');
    expect(response.body.message).toEqual('Book updated successfully');
  });

    it('should not update an existing book with invalid publication year', async () => {
       const book = await Book.findOne({ where: { isbn: '12345678902' } });
      const user = await User.findOne({ where: { email: 'test@example.com' } });
         const token = generateToken(user.id)
    const response = await request(app)
      .put('/api/books/'+book.id)
       .set('Authorization', 'Bearer ' + token)
      .send({
          title: 'Updated Book',
          author: 'Updated Author',
          genre: 'Thriller',
          isbn: '12345678902',
          publicationYear: 'invalid',
      });
    expect(response.statusCode).toBe(400);
         expect(response.body.errors).toEqual(expect.any(Array))
  });

     it('should not update an existing book if isbn already exist', async () => {
        const book1 = await Book.findOne({ where: { isbn: '12345678902' } });
         const book2 = await Book.create({
            title: 'Another Book',
            author: 'Another Author',
            genre: 'Mystery',
            isbn: '12345678903',
        })
         const user = await User.findOne({ where: { email: 'test@example.com' } });
         const token = generateToken(user.id)
    const response = await request(app)
      .put('/api/books/'+book1.id)
       .set('Authorization', 'Bearer ' + token)
      .send({
          title: 'Updated Book',
          author: 'Updated Author',
          genre: 'Thriller',
          isbn: '12345678903',
          publicationYear: 2024,
      });
    expect(response.statusCode).toBe(400);
     expect(response.body.message).toEqual('Book with this ISBN already exists');
  });
    it('should delete an existing book', async () => {
    const book = await Book.findOne({ where: { isbn: '12345678902' } });
     const user = await User.findOne({ where: { email: 'test@example.com' } });
         const token = generateToken(user.id)
    const response = await request(app)
      .delete('/api/books/'+book.id)
       .set('Authorization', 'Bearer' + ' token')
    expect(response.statusCode).toBe(200);
     expect(response.body.message).toEqual('Book deleted successfully');
  });

    it('should return 404 if deleting non-existent book', async () => {
      const user = await User.findOne({ where: { email: 'test@example.com' } });
      const token = generateToken(user.id)
    const response = await request(app)
        .delete('/api/books/999')
        .set('Authorization', 'Bearer' + ' token')

      expect(response.statusCode).toBe(404);
       expect(response.body.message).toEqual('Book not found');
  });

});
