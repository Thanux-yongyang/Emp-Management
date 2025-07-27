import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  UserPlus,
  Users,
  Settings,
  JapaneseYen,
  Building,
  BarChart2,
  CalendarCheck,
  LogOut,
} from 'lucide-react';

export const Navigation = () => {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4 flex flex-col justify-between z-10 shadow-lg">
      {/* Logo */}
      <div>
        <div className="mb-6 flex items-center justify-start">
          <span className="text-2xl font-bold tracking-wide">E</span>
          <span className="ml-2 text-2xl font-bold tracking-wide">
            MS
          </span>
        </div>

        {/* Navigation Sections */}
        {/* ADD list-none HERE */}
        <ul className="space-y-1 list-none">
          <NavItem to="/home" icon={<Home size={20} />} label="Dashboard" />
          <Divider />
          <NavItem to="/add" icon={<UserPlus size={20} />} label="Add Employee" />
          <NavItem to="/employees" icon={<Users size={20} />} label="View Employees" />
          

          <Divider />
          
          <NavItem to="/departments" icon={<Building size={20} />} label="Departments" />
          <NavItem to="/attendance" icon={<CalendarCheck size={20} />} label="Attendance" />

          <Divider />
          <NavItem to="/salary" icon={<JapaneseYen size={20} />} label="Salary Details" />
          <NavItem to="/reports" icon={<BarChart2 size={20} />} label="Reports" />

          <Divider />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Account Settings" />
          <Divider />
          <NavItem to="/clockinout" icon={<Settings size={20} />} label="Clock " />
        </ul>
      </div>

      {/* Logout */}
      {/* ADD list-none HERE as well, if it's a separate <ul> or similar structure causing the dot */}
      {/* If Logout is the only li and not wrapped in a ul, you can apply list-none to its li directly too. */}
      {/* However, the current structure places it within its own <div>.
          The safest bet is to add a <ul> around it with list-none. */}
      <ul className="list-none"> {/* Added this <ul> for the Logout NavItem */}
        <NavItem
          to="/"
          icon={<LogOut size={20} />}
          label="Logout"
          extraClass="text-red-400 hover:bg-red-700"
        />
      </ul>
    </nav>
  );
};

// Reusable Nav Item
const NavItem = ({ to, icon, label, extraClass = '' }) => (
  // The 'list-none' class on the parent <ul> will usually handle this,
  // but if you wanted to be super explicit per item, you could add it here too:
  <li className="list-none">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
          isActive
            ? 'bg-blue-600 text-white'
            : `text-gray-300 hover:bg-gray-700 ${extraClass}`
        }`
      }
    >
      <div className="min-w-[24px]">{icon}</div>
      <span className="ml-3 text-sm">
        {label}
      </span>
    </NavLink>
  </li>
);

// Optional divider between sections
const Divider = () => <hr className="my-2 border-gray-700" />;