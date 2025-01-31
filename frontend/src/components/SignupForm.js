import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { useAuth } from '../utils/auth';
import '../styles/AuthForm.css'

function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [error, setError] = useState('');
     const navigate = useNavigate();
    const { login } = useAuth();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
    if (!username || !email || !password){
        setError('Username, email and password is required.');
        return;
    }
     try {
          const data = {
            username,
             email,
            password
        }
         const result = await registerUser(data);
       if (result?.token) {
         login(result.user,result.token);
         navigate('/')
       } else{
         setError(result.message || 'Signup failed')
        }
     } catch(error){
        console.error('Error signing up', error)
        setError(error.message || 'Signup failed')
     }
  };

  return (
      <div className='auth-form'>
        <h2>Sign Up</h2>
          {error && <p className='error-message'>{error}</p>}
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
            <label htmlFor='username'>Username:</label>
            <input
                type='text'
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
        </div>
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
           <button type='submit'>Sign Up</button>
        </form>
    </div>
  );
}

export default SignupForm;
