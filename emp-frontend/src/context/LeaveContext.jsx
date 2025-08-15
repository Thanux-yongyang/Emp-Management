import React, { createContext, useContext } from "react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Create context
const LeaveContext = createContext();

// Provider component
export const LeaveProvider = ({ children }) => {
  // Save leave
  const saveLeave = async (leaveData) => {
    try {
      const response = await axios.post("/api/paid-leave", leaveData);
      return response.data;
    } catch (error) {
      console.error("Error saving leave:", error);
      throw error; // so caller can handle it
    }
  };

  // Fetch all leaves (optional, can be used later)
  const getLeaves = async () => {
    try {
      const response = await axios.get("/api/paid-leave");
      return response.data;
    } catch (error) {
      console.error("Error fetching leaves:", error);
      throw error;
    }
  };

  // Update leave (optional)
  const updateLeave = async (id, leaveData) => {
    try {
      const response = await axios.put(`/api/paid-leave/${id}`, leaveData);
      return response.data;
    } catch (error) {
      console.error("Error updating leave:", error);
      throw error;
    }
  };

  // Delete leave (optional)
  const deleteLeave = async (id) => {
    try {
      const response = await axios.delete(`/api/paid-leave/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting leave:", error);
      throw error;
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        saveLeave,
        getLeaves,
        updateLeave,
        deleteLeave,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

// Hook for consuming context
export const useLeave = () => {
  return useContext(LeaveContext);
};
