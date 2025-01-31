const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../config/database');
const User = require('../models/user');
require('dotenv').config();
const { generateToken } = require('../utils/authUtils');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Drop and create tables
  await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });
});

afterAll(async () => {
    await sequelize.close();
})

describe('Authentication API Endpoints', () => {

  it('should register a new user', async () => {
     const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newUser',
        email: 'new@example.com',
        password: 'newPassword123'
    });
    expect(response.statusCode).toBe(201);
     expect(response.body).toHaveProperty('token');
    expect(response.body.message).toEqual('User created successfully');
  });

 it('should not register a user with invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
       username: 'newUser',
        email: 'invalidemail',
        password: 'newPassword123'
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.errors).toEqual(expect.any(Array))
  });
  it('should not register a user if email already exist', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('User with this email already exists');
  });

  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
      expect(response.body.message).toEqual('Logged in successfully');

  });

    it('should not log in a user with invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'password123',
    });
    expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual('Invalid credentials');
  });

  it('should not log in a user with invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
    });
     expect(response.statusCode).toBe(401);
     expect(response.body.message).toEqual('Invalid credentials');
  });

    it('should fetch profile for logged in user', async () => {
         const user = await User.findOne({ where: { email: 'test@example.com' } });
          const token = generateToken(user.id)
          const response = await request(app)
          .get('/api/auth/profile')
           .set('Authorization', 'Bearer' + ' token')

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
         expect(response.body).toHaveProperty('username');
         expect(response.body).toHaveProperty('email');
        expect(response.body).not.toHaveProperty('password');
  });

});
