const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const { generateToken } = require('../utils/authUtils');
require('dotenv').config();

const register = async (req, res) => {
   const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  try {
    const { username, email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    const token = generateToken(newUser.id)

    res.status(201).json({ message: 'User created successfully', user: {id: newUser.id, username: newUser.username, email: newUser.email}, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
       const token = generateToken(user.id)


    res.json({ message: 'Logged in successfully', user: {id: user.id, username: user.username, email: user.email}, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const profile = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] } 
        });
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
}

module.exports = { register, login, profile };
