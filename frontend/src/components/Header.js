import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import '../styles/Header.css'

function Header() {
    const { authUser, logout } = useAuth();
     const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
  return (
    <header className='header'>
      <nav className='nav'>
        <ul className='nav-list'>
          <li className='nav-item'>
              <Link className='nav-link' to='/'>Home</Link>
          </li>
          {authUser ? (
            <>
               <li className='nav-item'>
                  <Link className='nav-link' to='/profile'>Profile</Link>
              </li>
              <li className='nav-item'>
                <button className='nav-link'  onClick={handleLogout}>Logout</button>
               </li>
             </>
          ) : (
              <>
                 <li className='nav-item'>
                  <Link className='nav-link' to='/login'>Login</Link>
              </li>
               <li className='nav-item'>
                   <Link className='nav-link' to='/register'>Sign Up</Link>
               </li>
              </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
