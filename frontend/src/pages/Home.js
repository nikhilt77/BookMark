import React from 'react';
import BookList from '../components/BookList';
import '../styles/Home.css';
const Home = () => {
  return (
    <div className='home'>
         <h2>Welcome to the Book Review Platform</h2>
      <BookList />
    </div>
  );
};

export default Home;
