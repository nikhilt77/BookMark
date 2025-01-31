import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { fetchBooks } from '../utils/api';
import '../styles/BookList.css'

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
       const getBooks = async () => {
             try {
                 const data = await fetchBooks();
                 setBooks(data)
                } catch(error){
                    console.log('Error fetching books', error)
                    setError(error.message || 'Error fetching books')
                } finally {
                    setLoading(false)
                }
       }
       getBooks();
    }, []);

    if(loading) {
        return <p>Loading books...</p>
    }

    if (error) {
      return <p>Error: {error}</p>;
    }


    return (
        <div className='book-list'>
            {books && books.map((book) => (
               <div key={book.id} className='book-item'>
                    <Link className='book-link' to={'/books/'+book.id}>
                         {book.coverImage &&
                         <img className='book-cover'
                              src={book.coverImage}
                               alt={book.title}
                            />}
                        <div className='book-info'>
                             <h2>{book.title}</h2>
                             <p>By: {book.author}</p>
                        </div>
                     </Link>
                 </div>
             ))}
        </div>
    );
};

export default BookList;
