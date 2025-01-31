import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(getStoredAuth());

  const login = (user,token) => {
    setAuthUser({user: user, token: token});
    localStorage.setItem('auth', JSON.stringify({user:user, token: token}));
  };

  const logout = () => {
    setAuthUser(null);
     localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

const getStoredAuth = () => {
    try {
         const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : null;
     } catch(error){
          console.error('Error retrieving authentication data', error);
          return null;
     }
};
