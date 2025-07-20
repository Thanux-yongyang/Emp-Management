// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // holds user data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();




// ...

const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:8081/api/auth/login', {
      username,
      password,
    });

    const userData = response.data; // No need for response.json()
    setUser(userData);
    setIsAuthenticated(true);
    navigate('/home');
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    alert('Invalid credentials or server error.');
  }
};

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login'); // redirect to login
  };

  const createUser = async (newUserData) => {
  try {
    const response = await axios.post('http://localhost:8081/api/createuser', newUserData);
    alert('User created successfully!');
    return response.data;
  } catch (error) {
    console.error('Create user error:', error.response?.data || error.message);
    alert('Failed to create user');
    return null;
  }
};

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, createUser }}>
      {children}
    </AuthContext.Provider>
  );
};


// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
