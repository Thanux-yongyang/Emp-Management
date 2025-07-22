import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EmployeeProvider } from './context/EmployeeContext';
// import { Navigation } from './components/Navbar/Navigation';
import { Home } from './components/Home/Home';
import  EmployeeList  from './components/EmployeeList/EmployeeList';
import EmployeeDetail from "./components/EmployeeDetail/EmployeeDetail";
import { EmployeeForm } from './components/EmployeeForm/EmployeeForm';
import { Settings } from './components/Setting/Setting';
import  LoginForm  from './components/login/LoginForm';
import { AuthProvider } from './context/AuthContext';
import { ProtectedLayout } from './components/protectedlayout/ProtectedLayout';
import SalaryDetail from './components/salarydetail/SalaryDetail';
import Reports from './components/Reports/Reports';
import Attendance from './components/Attendance/Attendance';
 import  Departments  from './components/Departments/Departments';
 import  EmpSalaryList  from './components/salarydetail/EmpSalaryList';
 import AttendanceDetail from './components/Attendance/AttendanceDetail';
import {DepartmentProvider} from './context/DepartmentContext';
import { EmpSalaryProvider } from './context/EmpSalaryContext';


function App() {
  return (
    <Router>
      <AuthProvider>
      <EmployeeProvider>
        <DepartmentProvider>
          <EmpSalaryProvider>
            <Routes>
              <Route path='/' element={<LoginForm/>}/>
              <Route element={<ProtectedLayout />}>

              <Route path="/home" element={<Home />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/add" element={<EmployeeForm />} />
              <Route path="/edit/:id" element={<EmployeeForm />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/salary" element={<EmpSalaryList />} />
              <Route path="/employee/view/:id" element={<EmployeeDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/salarydetail" element={<SalaryDetail />} />
              <Route path="/attendance/detail/:id" element={<AttendanceDetail />} />
             
              </Route>
            </Routes>
          </EmpSalaryProvider>
            </DepartmentProvider>
      </EmployeeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;