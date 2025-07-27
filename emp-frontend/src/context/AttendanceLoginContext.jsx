// src/context/AuthContext.js
import React, { createContext, useState, useEffect,useContext } from 'react';

import axios from 'axios'; 

const AttendanceLoginContext = createContext();

export const AttendanceLoginProvider = ({ children }) => {
  const [attendanceLogins, setAttendanceLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to handle errors
  const handleError = (error, message) => {
    console.error(message, error);
    setError(message);
    alert(message);
  };
  //attendance login context to manage attendance logins
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/attendance/login`, {
        username,
        password,
      });
      return response.data; // Return the login data
    } catch (error) {
      handleError(error, "Login failed. Please check your credentials.");
      throw error; // Propagate the error
    }
  };

  // Fetch attendance logins from backend
  const fetchAttendanceLogins = async () => {
    try {
      setLoading(true); // Reset loading state
      setError(null);   // Clear previous errors
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/attendance/create-logins`);
      setAttendanceLogins(response.data);
    } catch (error) {
      handleError(error, "Failed to load attendance logins.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAttendanceLogins();
  }, []);

  // Add attendance login
  const addAttendanceLogin = async (newLogin) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/attendance/create-logins`, newLogin);
      setAttendanceLogins(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      handleError(error, "Failed to add attendance login.");
      throw error;
    }
  };

  // Update attendance login
  const updateAttendanceLogin = async (id, updatedLogin) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/attendance/create-logins/${id}`, updatedLogin);
      setAttendanceLogins(prev =>
        prev.map(login => login.id === id ? response.data : login)
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to update attendance login.");
      throw error;
    }
  };

  return (
    <AttendanceLoginContext.Provider value={{
      attendanceLogins,
      login,
      loading,
      error,
      addAttendanceLogin,
      updateAttendanceLogin,
      fetchAttendanceLogins
    }}>
      {children}
    </AttendanceLoginContext.Provider>
  );
  
}
export const useAttendanceLoginContext = () => {
  const context = useContext(AttendanceLoginContext);
  if (!context) {
    throw new Error("useAttendanceLoginContext must be used within an AttendanceLoginProvider");
  }
  return context;
}