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
// import { Departments } from './components/Departments/Departments';


function App() {
  return (
    <Router>
      <AuthProvider>
      <EmployeeProvider>
            <Routes>
              <Route path='/' element={<LoginForm/>}/>
              <Route element={<ProtectedLayout />}>

              <Route path="/home" element={<Home />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/add" element={<EmployeeForm />} />
              <Route path="/edit/:id" element={<EmployeeForm />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/employee/view/:id" element={<EmployeeDetail />} />
             
              </Route>
            </Routes>
        
      </EmployeeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;