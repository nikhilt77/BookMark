import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import BookPage from './pages/BookPage';
import UserPage from './pages/UserPage';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm'
import { AuthProvider } from './utils/auth';
import './styles/global.css'



function App() {
  return (
       <AuthProvider>
             <Header />
             <main>
                 <Routes>
                    <Route path='/' element={<Home />} />
                     <Route path='/books/:bookId' element={<BookPage />} />
                      <Route path='/profile' element={<UserPage />} />
                       <Route path='/login' element={<LoginForm />} />
                      <Route path='/register' element={<SignupForm />} />
                 </Routes>
             </main>
       </AuthProvider>
  );
}

export default App;
