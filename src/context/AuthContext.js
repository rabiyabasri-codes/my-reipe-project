import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // This effect can be used to load user data if a token exists
    // For now, we'll just set loading to false
    setLoading(false);
  }, []);

  const login = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', formData);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      // You would typically fetch user data here as well
      // For now, we'll just navigate
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
      // You can add state to show an error message to the user
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', formData);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      // Navigate to home page after registration
      navigate('/');
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 