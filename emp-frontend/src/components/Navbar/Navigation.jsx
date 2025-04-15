import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserPlus, Users, Settings } from 'lucide-react';

export const Navigation = () => {
  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/add', icon: <UserPlus size={20} />, label: 'Add Employee' },
    { to: '/employees', icon: <Users size={20} />, label: 'View Employees' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white p-4 shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center py-4">EMS</h1>
      </div>
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};