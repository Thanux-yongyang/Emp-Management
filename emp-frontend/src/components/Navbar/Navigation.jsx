import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
  ChevronDown,
} from "lucide-react";

export const Navigation = () => {
  // For click toggle submenu (optional)
  const [employeeMenuOpen, setEmployeeMenuOpen] = useState(false);

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-4 flex flex-col justify-between z-10 shadow-lg">
      <div>
        <div className="mb-6 flex items-center justify-start">
          <span className="text-2xl font-bold tracking-wide">E</span>
          <span className="ml-2 text-2xl font-bold tracking-wide">MS</span>
        </div>

        <ul className="space-y-1 list-none">
          <NavItem to="/home" icon={<Home size={20} />} label="Dashboard" />
          <Divider />

         <li className="list-none">
  <div
    className="flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors select-none"
    onClick={() => setEmployeeMenuOpen(!employeeMenuOpen)}
  >
    <div className="min-w-[24px]">
      <Users size={20} />
    </div>
    <span className="ml-3 text-sm flex-1">Employee</span>
    <ChevronDown
      className={`transition-transform ${employeeMenuOpen ? "rotate-180" : ""}`}
      size={16}
    />
  </div>

  {/* Submenu inline — pushes other items down */}
  {employeeMenuOpen && (
    <ul className="ml-6 mt-1 space-y-1">
      <SubNavItem to="/add" icon={<UserPlus size={18} />} label="Add Employee" />
      <SubNavItem to="/employees" icon={<Users size={18} />} label="View Employees" />
      <SubNavItem to="/leave-management" icon={<CalendarCheck size={18} />} label="Leave Management" />
    </ul>
  )}
</li>


          <Divider />
          <NavItem to="/departments" icon={<Building size={20} />} label="Departments" />
          <NavItem to="/attendance" icon={<CalendarCheck size={20} />} label="Attendance" />

          <Divider />
          <NavItem to="/salary" icon={<JapaneseYen size={20} />} label="Salary Details" />
          {/* <NavItem to="/reports" icon={<BarChart2 size={20} />} label="Reports" /> */}

          <Divider />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Account Settings" />
          <Divider />
          
        </ul>
      </div>

      <ul className="list-none">
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

// Main Nav Item
const NavItem = ({ to, icon, label, extraClass = "" }) => (
  <li className="list-none">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
          isActive ? "bg-blue-600 text-white" : `text-gray-300 hover:bg-gray-700 ${extraClass}`
        }`
      }
    >
      <div className="min-w-[24px]">{icon}</div>
      <span className="ml-3 text-sm">{label}</span>
    </NavLink>
  </li>
);

// Submenu Nav Item (smaller padding, slightly different style)
const SubNavItem = ({ to, icon, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 text-sm rounded hover:bg-gray-700 whitespace-nowrap ${
          isActive ? "bg-blue-600 text-white" : "text-gray-300"
        }`
      }
    >
      <div className="min-w-[20px]">{icon}</div>
      <span className="ml-3">{label}</span>
    </NavLink>
  </li>
);

const Divider = () => <hr className="my-2 border-gray-700" />;
