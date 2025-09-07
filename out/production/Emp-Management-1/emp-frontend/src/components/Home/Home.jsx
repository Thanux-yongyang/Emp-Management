import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useEmployees } from '../../context/EmployeeContext'
import { Users, UserPlus, Building } from 'lucide-react';

export const Home = () => {
  const { employees } = useEmployees();
  const navigate = useNavigate();
  
  const departments = [...new Set(employees.map(emp => emp.department))];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div 
        className="relative rounded-xl overflow-hidden h-64 mb-8"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/80" />
        <div className="relative h-full flex items-center px-8">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Employee Management System</h1>
            <p className="text-lg text-blue-100 mb-6">
              Streamline your workforce management with our comprehensive employee management solution
            </p>
            <button
              onClick={() => navigate('/add')}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Add New Employee
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600">Total Employees</p>
              <h3 className="text-2xl font-bold">{employees.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Departments</p>
              <h3 className="text-2xl font-bold">{departments.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600">New This Month</p>
              <h3 className="text-2xl font-bold">
                {employees.filter(emp => {
                  const startDate = new Date(emp.dateOfEntry);
                  const now = new Date();
                  return startDate.getMonth() === now.getMonth() &&
                         startDate.getFullYear() === now.getFullYear();
                }).length}
              </h3>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600">Active Projects</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </div> */}
      </div>

      {/* Recent Employees */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Employees</h2>
        </div>
        <div className="p-6">
          <div className="divide-y">
            {employees.slice(-5).reverse().map(employee => (
              <div key={employee.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* <img
                    src={employee.picture || 'https://via.placeholder.com/40'}
                    alt={`${employee.firstName} ${employee.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                  /> */}
                  <div>
                    <h3 className="font-medium">{employee.firstName} {employee.lastName}</h3>
                    <p className="text-sm text-gray-500">{employee.department}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  Joined {new Date(employee.dateOfEntry).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};