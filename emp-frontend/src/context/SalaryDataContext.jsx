// context/SalaryDataContext.js
import React, { createContext, useContext, useState } from 'react';

const SalaryDataContext = createContext();

export const useSalaryData = () => {
  return useContext(SalaryDataContext);
};

export const SalaryDataProvider = ({ children }) => {
  const [salaryData, setSalaryData] = useState({
    totalWorkdays: 0,
    realWorkedDays: 0,
    appliedPaidLeaves: 0,
    employeeId: null,
    date: null,
  });

  const updateSalaryData = (newData) => {
    setSalaryData(prev => ({ ...prev, ...newData }));
  };

  return (
    <SalaryDataContext.Provider value={{ salaryData, updateSalaryData }}>
      {children}
    </SalaryDataContext.Provider>
  );
};