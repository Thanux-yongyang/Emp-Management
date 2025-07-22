import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const EmpSalaryContext = createContext();

export const EmpSalaryProvider = ({ children }) => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // This can be used to fetch all salaries for an admin view if needed
  const fetchAllSalaries = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${VITE_BACKEND_URL}/api/salaries`);
      setSalaries(res.data);
    } catch (err) {
      setError('Failed to fetch salaries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all salary records for a single employee
  const fetchSalaryHistory = async (employeeId) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${VITE_BACKEND_URL}/api/empsalaries/employee/${employeeId}`);
      // Sort by effectiveDate descending to show the most recent first
      const sortedData = res.data.sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate));
      return sortedData;
    } catch (err) {
      // If the error is 404, it just means no records exist. Treat this as a success with empty data.
      if (err.response && err.response.status === 404) {
        console.log(`No salary history for employee ${employeeId}. Returning empty array.`);
        return [];
      }
      // For all other errors, it's a real problem.
      setError(`Failed to fetch salary history for employee ${employeeId}`);
      console.error(err);
      return []; // Return empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Create a new salary record
  const createSalary = async (salaryData) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${VITE_BACKEND_URL}/api/empsalaries`, salaryData);
      setSalaries(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError('Failed to create salary record');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing salary record by its own ID (sal_id)
  const updateSalary = async (salId, salaryData) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`${VITE_BACKEND_URL}/api/empsalaries/${salId}`, salaryData);
      setSalaries(prev =>
        prev.map(s => s.salid === salId ? res.data : s)
      );
      return res.data;
    } catch (err) {
      setError(`Failed to update salary record ${salId}`);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmpSalaryContext.Provider
      value={{
        salaries,
        loading,
        error,
        fetchAllSalaries,
        fetchSalaryHistory,
        createSalary,
        updateSalary,
      }}
    >
      {children}
    </EmpSalaryContext.Provider>
  );
};

export const useEmpSalaries = () => useContext(EmpSalaryContext);
