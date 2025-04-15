import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EmployeeProvider } from './context/EmployeeContext';
import { Navigation } from './components/Navbar/Navigation';
import { Home } from './components/Home/Home';
import  EmployeeList  from './components/EmployeeList/EmployeeList';
import EmployeeDetail from "./components/EmployeeDetail/EmployeeDetail";
import { EmployeeForm } from './components/EmployeeForm/EmployeeForm';
import { Settings } from './components/Setting/Setting';


function App() {
  return (
    <Router>
      <EmployeeProvider>
        <div className="flex min-h-screen bg-gray-300">
          <Navigation />
          <main className="flex-1 ml-64 p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/add" element={<EmployeeForm />} />
              <Route path="/edit/:id" element={<EmployeeForm />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/employee/view/:id" element={<EmployeeDetail />} />
            </Routes>
          </main>
        </div>
      </EmployeeProvider>
    </Router>
  );
}

export default App;