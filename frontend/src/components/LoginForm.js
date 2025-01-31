import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { useAuth } from '../utils/auth';
import '../styles/AuthForm.css'

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
    const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    if (!email || !password){
        setError('Email and password are required.');
        return;
      }

     try{
        const data = {
            email: email,
             password: password
         }
         const result = await loginUser(data);
        if (result?.token){
          login(result.user,result.token);
           navigate('/');
         } else{
           setError(result.message || 'Login Failed')
        }
     } catch(error){
        console.error('Login error', error)
          setError(error.message || 'Login Failed')
     }

  };

  return (
    <div className='auth-form'>
        <h2>Login</h2>
        {error && <p className='error-message'>{error}</p>}
      <form onSubmit={handleSubmit}>
         <div className='form-group'>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
       <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
