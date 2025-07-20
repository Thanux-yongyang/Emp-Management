import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set axios baseURL from VITE_BACKEND_URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
    } catch (err) {
      setError('Failed to fetch departments');
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (departName) => {
    try {
      const res = await axios.post('/api/departments', { departmentName: departName });
      setDepartments(prev => [...prev, { ...res.data, name: res.data.departmentName }]);
      return res.data;
    } catch (err) {
      setError('Failed to add department');
      throw err;
    }
  };

  const updateDepartment = async (id, departName) => {
    try {
      const res = await axios.put(`/api/departments/${id}`, { departmentName: departName });
      setDepartments(prev => prev.map(d => d.id === id ? { ...res.data, name: res.data.departmentName } : d));
      return res.data;
    } catch (err) {
      setError('Failed to update department');
      throw err;
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`/api/departments/${id}`);
      setDepartments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError('Failed to delete department');
      throw err;
    }
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        loading,
        error,
        fetchDepartments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartments = () => useContext(DepartmentContext); 