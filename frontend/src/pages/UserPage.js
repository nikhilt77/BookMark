import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import { fetchUserProfile } from '../utils/api';
import '../styles/UserPage.css';

const UserPage = () => {
   const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authUser } = useAuth();

    useEffect(() => {
        const getUserProfile = async () => {
        if (authUser){
            try{
                const profile = await fetchUserProfile(authUser.token);
                setUser(profile)
            } catch(error){
                console.error('Error fetching user profile', error);
                   setError(error.message || 'Error fetching user profile')
             } finally{
                setLoading(false)
            }
         } else{
                setLoading(false);
                setError('You must be logged in to view your profile');
        }
    }
      getUserProfile();
  }, [authUser]);

   if (loading) {
      return <p>Loading Profile Details...</p>;
    }
     if (error) {
      return <p>Error: {error}</p>;
    }

    if (!user) {
       return <p>No user data available</p>
    }

  return (
    <div className='user-profile'>
      <h2>User Profile</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.firstName && <p><strong>First Name:</strong> {user.firstName}</p>}
         {user.lastName &&  <p><strong>Last Name:</strong> {user.lastName}</p>}
    </div>
  );
};

export default UserPage;
