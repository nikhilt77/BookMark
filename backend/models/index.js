const Book = require('./book');
const Review = require('./review');
const User = require('./user');

// Set up associations
Book.hasMany(Review, {
    foreignKey: 'bookId',
    as: 'reviews'
});

Review.belongsTo(Book, {
    foreignKey: 'bookId',
    as: 'book'
});

User.hasMany(Review, {
    foreignKey: 'userId',
    as: 'reviews'
});

Review.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

module.exports = {
    Book,
    Review,
    User
};
