import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);  // Add a loading state

  useEffect(() => {
    // console.log('useEffect ran');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');
  

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    } else {
      console.log('No user or token found');
    }

    setLoading(false); 
  }, []);  

  const login = (userData, authToken) => {
    console.log('Storing token and user in localStorage');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  return { user, token, login, logout, loading };
};
