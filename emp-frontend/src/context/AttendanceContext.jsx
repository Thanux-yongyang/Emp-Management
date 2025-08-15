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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/attendance/clockin`, {
        username,
        password,
      });
      return response.data; // Return the login data
    } catch (error) {
      handleError(error, "Clock In failed. Please check your credentials.");
      throw error; // Propagate the error
    }
  };
  const clockOut = async (username, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/attendance/clockout`, {
        username,
        password,
      });
      return response.data; // Return the login data
    } catch (error) {
      handleError(error, "Clock out failed. Please check your credentials.");
      throw error; // Propagate the error
    }
  };

  /// Fetch all attendance records for all employees
const fetchAllAttendance = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/attendance/getall`);
    return response.data; // List of AttendanceLoginResponseDto
  } catch (error) {
    handleError(error, "Failed to fetch attendance data.");
    throw error;
  } finally {
    setLoading(false);
  }
};

const fetchEmployeeAttendance = async (employeeId, year, month) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/attendance/${employeeId}?year=${year}&month=${month}`);
    return response.data; // Array of attendance records for that employee
  } catch (error) {
    handleError(error, "Failed to fetch employee attendance data.");
    throw error;
  }
};

  // Initial fetch
  // useEffect(() => {
  //   fetchAttendanceLogins();
  // }, []);

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
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/attendance/update/${id}`, updatedLogin);
      setAttendanceLogins(prev =>
        prev.map(login => login.id === id ? response.data : login)
      );
      return response.data;
    } catch (error) {
      handleError(error, "Failed to update attendance login.");
      throw error;
    }
  };

  // Inside AttendanceLoginProvider, below updateAttendanceLogin

const updateAttendanceDetail = async (id, updatedDetail) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/attendance/details/${id}`,
      updatedDetail
    );

    // Optional: If you keep attendanceData in state, update it here
    setAttendanceLogins(prev =>
      prev.map(detail => detail.id === id ? response.data : detail)
    );

    return response.data;
  } catch (error) {
    handleError(error, "Failed to update attendance detail.");
    throw error;
  }
};

const applyPaidLeave = async (employeeId, dateStr) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/paid-leave/apply`,
      null, // No body, just params
      {
        params: {
          employeeId,
          date: dateStr
        }
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to apply paid leave.");
    throw error;
  }
};

const cancelPaidLeave = async (employeeId, dateStr) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/paid-leave/cancel`,
      null, // No body, just params
      {
        params: {
          employeeId,
          date: dateStr
        }
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to cancel paid leave.");
    throw error;
  }
};

  // Add more functions as needed
  



  return (
    <AttendanceLoginContext.Provider value={{
      attendanceLogins,
      login,
      clockOut,
      loading,
      error,
      addAttendanceLogin,
      updateAttendanceLogin,
      fetchAllAttendance,
      fetchEmployeeAttendance,
      updateAttendanceDetail,
      applyPaidLeave,
      cancelPaidLeave
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