const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../config/database');
const Review = require('../models/review');
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

  const book = await Book.create({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        isbn: '1234567890',
  });

  const user = await User.findOne({ where: { email: 'test@example.com' } });

  await Review.create({
    rating: 4,
    comment: 'Great book!',
    bookId: book.id,
    userId: user.id
  });
});
afterAll(async () => {
    await sequelize.close();
})


describe('Review API Endpoints', () => {
    it('should get all reviews for a book', async () => {
        const book = await Book.findOne({ where: { isbn: '1234567890' } });
        const response = await request(app).get('/api/books/'+book.id+'/reviews');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.any(Array));
    });

     it('should return 404 if getting reviews for non-existent book', async () => {
        const response = await request(app).get('/api/books/999/reviews');
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Error fetching reviews');
  });

    it('should get a review by ID', async () => {
        const review = await Review.findOne();
        const response = await request(app).get('/api/reviews/'+review.id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('comment', 'Great book!');
    });

      it('should return 404 if getting non-existent review by ID', async () => {
       const response = await request(app).get('/api/reviews/999');
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual('Review not found');
  });


  it('should create a new review for a book', async () => {
        const book = await Book.findOne({ where: { isbn: '1234567890' } });
    const user = await User.findOne({ where: { email: 'test@example.com' } });
      const token = generateToken(user.id)

    const response = await request(app)
      .post('/api/books/'+book.id+'/reviews')
        .set('Authorization', 'Bearer '+token)
      .send({
          rating: 5,
          comment: 'Awesome book!'
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('review');
    expect(response.body.message).toEqual('Review created successfully');
  });

  it('should not create a new review with invalid rating', async () => {
      const book = await Book.findOne({ where: { isbn: '1234567890' } });
        const user = await User.findOne({ where: { email: 'test@example.com' } });
        const token = generateToken(user.id)
    const response = await request(app)
      .post('/api/books/'+book.id'/reviews')
      .set('Authorization', 'Bearer ' + token)
      .send({
        rating: 6,
        comment: 'Bad rating'
      });
    expect(response.statusCode).toBe(400);
     expect(response.body.errors).toEqual(expect.any(Array))
  });
    it('should not create a new review for non-existent book', async () => {
        const user = await User.findOne({ where: { email: 'test@example.com' } });
        const token = generateToken(user.id)
    const response = await request(app)
      .post('/api/books/999/reviews')
       .set('Authorization', 'Bearer' + token)
      .send({
        rating: 3,
        comment: 'Bad review'
    });
    expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('Error creating review')
  });


    it('should update an existing review', async () => {
    const review = await Review.findOne();
      const user = await User.findOne({ where: { email: 'test@example.com' } });
        const token = generateToken(user.id)
      const response = await request(app)
      .put('/api/reviews/'+review.id)
        .set('Authorization', Bearer'+ token)
      .send({
          rating: 2,
          comment: 'Updated comment',
      });
      expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('review');
    expect(response.body.message).toEqual('Review updated successfully');
  });

   it('should not update an existing review with invalid rating', async () => {
    const review = await Review.findOne();
      const user = await User.findOne({ where: { email: 'test@example.com' } });
        const token = generateToken(user.id)
      const response = await request(app)
      .put('/api/reviews/'+review.id)
        .set('Authorization', 'Bearer '+ token)
      .send({
          rating: 0,
          comment: 'Bad comment'
      });
      expect(response.statusCode).toBe(400);
       expect(response.body.errors).toEqual(expect.any(Array))
  });

  it('should not update an existing review of another user', async () => {
      const user = await User.create({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'anotherpassword',
    });
    const anotherReview = await Review.create({
         rating: 2,
         comment: 'Another Review',
        bookId: 1,
        userId: user.id
    });
    const user1 = await User.findOne({ where: { email: 'test@example.com' } });
        const token = generateToken(user1.id)
    const response = await request(app)
      .put('/api/reviews/' + anotherReview.id)
      .set('Authorization', 'Bearer '+ token)
      .send({
          rating: 1,
          comment: 'Bad updated comment',
      });
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toEqual('Unauthorized: You can only update your own reviews.');
  });

    it('should return 404 if updating non-existent review', async () => {
       const user = await User.findOne({ where: { email: 'test@example.com' } });
        const token = generateToken(user.id)
    const response = await request(app)
      .put('/api/reviews/999')
       .set('Authorization', 'Bearer ' + token)
      .send({
          rating: 3,
        comment: 'Bad review'
    });
    expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual('Review not found');
  });

  it('should delete an existing review', async () => {
    const review = await Review.findOne();
      const user = await User.findOne({ where: { email: 'test@example.com' } });
       const token = generateToken(user.id)
    const response = await request(app)
      .delete('/api/reviews/'+review.id)
        .set('Authorization', 'Bearer ' + token)
    expect(response.statusCode).toBe(200);
      expect(response.body.message).toEqual('Review deleted successfully');
  });

  it('should not delete an existing review of another user', async () => {
      const user = await User.create({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'anotherpassword',
    });
    const anotherReview = await Review.create({
         rating: 2,
         comment: 'Another Review',
        bookId: 1,
        userId: user.id
    });
    const user1 = await User.findOne({ where: { email: 'test@example.com' } });
       const token = generateToken(user1.id)
    const response = await request(app)
      .delete('/api/reviews/'+anotherReview.id)
         .set('Authorization', 'Bearer ' + token)
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toEqual('Unauthorized: You can only delete your own reviews.');
  });

  it('should return 404 if deleting non-existent review', async () => {
     const user = await User.findOne({ where: { email: 'test@example.com' } });
        const token = generateToken(user.id)
        const response = await request(app)
        .delete('/api/reviews/999')
         .set('Authorization', 'Bearer ' + token)
      expect(response.statusCode).toBe(404);
       expect(response.body.message).toEqual('Review not found');
    });
});
