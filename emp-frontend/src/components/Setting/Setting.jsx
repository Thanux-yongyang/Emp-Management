import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../../context/EmployeeContext"; // Adjust the import path as needed
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // Adjust the import path as needed

export const Settings = () => {
  const { searchEmployees } = useEmployees(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const { createUser } = useAuth(); // Get the createUser function from context

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    department: "",
    employeeId: "",
    email: "",
    username: "",
    password: "",
    retypePassword: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that an employee has been selected
    if (!form.employeeId || !form.firstName || !form.lastName) {
      alert("Please search and select an employee first before creating a user account.");
      return;
    }
    
    // validate passwords match, then send to backend or whatever
    if (form.password !== form.retypePassword) {
      alert("Passwords don't match");
      return;
    }
    
    const userData = {
      username: form.username,
      password: form.password,
      email: form.email,
      role: form.role,
      employeeId: form.employeeId,
    };

    const response = await createUser(userData);

    if (response) {
      alert("User successfully created!");
      navigate("/home"); // or wherever you want to redirect
    }
  };

  const handleClear = () => {
    setForm({
      firstName: "",
      lastName: "",
      department: "",
      employeeId: "",
      email: "",
      username: "",
      password: "",
      retypePassword: "",
      role: "",
    });
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchEmployees(query.trim());
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Debounce the search to avoid too many API calls
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300); // 300ms delay
  };

  const handleEmployeeSelect = (emp) => {
    setForm((prev) => ({
      ...prev,
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      department: emp.department || "",
      employeeId: emp.id ? emp.id.toString() : "",
      email: emp.email || "",
    }));
    setSearchResults([]);
    setSearchQuery("");
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(window.searchTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50  px-4 ">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center  flex items-center justify-center space-x-4 mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full  shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <div className="text-left pt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create New User
            </h1>
            <p className="text-gray-600 ">
              Add a new team member to your organization
            </p>
          </div>
        </div>

        {/* Search Bar with Floating Results */}
        <div className="mb-2 relative" ref={searchContainerRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search existing employees by name or ID..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery);
                }
                if (e.key === "Escape") {
                  setSearchResults([]);
                  setSearchQuery("");
                }
              }}
              className="w-full pl-12 pr-4 py-4 text-lg bg-white border-2 border-purple-300 rounded-2xl shadow-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>

          {/* Floating Search Results */}
          {(searchResults.length > 0 || isSearching) && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-purple-100 rounded-2xl shadow-2xl max-h-80 overflow-y-auto backdrop-blur-sm">
              {isSearching ? (
                <div className="p-6 text-center">
                  <div className="animate-spin inline-block w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full mb-2"></div>
                  <p className="text-purple-600 font-medium">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="py-2">
                  {searchResults.map((emp, index) => (
                    <li
                      key={emp.id}
                      className="mx-2 px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer rounded-xl border-b border-gray-100 last:border-b-0 transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => handleEmployeeSelect(emp)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                            {emp.firstName?.[0]}
                            {emp.lastName?.[0]}
                          </div>
                          <div>
                            <span className="font-semibold text-gray-800 text-lg">
                              {emp.firstName} {emp.lastName}
                            </span>
                            {emp.department && (
                              <div className="text-sm text-gray-500">
                                {emp.department}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-purple-600 font-medium bg-purple-100 px-3 py-1 rounded-full">
                          ID: {emp.id}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.485 0-4.735.895-6.495 2.381"
                    />
                  </svg>
                  <p>No results found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white">User Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-3 space-y-4 ">
            {/* Personal Information */}
            <div className="grid grid-cols-3 gap-4">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  disabled
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  disabled
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  disabled
                  value={form.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Work Information */}
            <div className="grid grid-cols-3 gap-4">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  disabled
                  value={form.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  disabled
                  value={form.employeeId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Contact Information */}

            {/* Account Information */}
            <div className="space-y-4 pt-2 border-t border-gray-300 ">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Account Settings
              </h3>
              <div className="grid grid-cols-2 gap-4 pt-0">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 placeholder-gray-400"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 appearance-none text-sm leading-tight"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>

                    <option value="employee">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300"
                    placeholder="Enter password"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-500 hover:text-purple-600"
                    style={{ top: "calc(5px + 1.5rem)" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <div className="group relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showRetypePassword ? "text" : "password"}
                    name="retypePassword"
                    value={form.retypePassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300"
                    placeholder="Confirm password"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-gray-500 hover:text-purple-600"
                    style={{ top: "calc(5px + 1.5rem)" }} // Adjust based on label height
                    onClick={() => setShowRetypePassword(!showRetypePassword)}
                  >
                    {showRetypePassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons and Status */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-2 border-t border-gray-300">
              {/* Employee Selection Status */}
              <div className="mb-4 lg:mb-0 lg:mr-4">
                {form.employeeId && form.firstName && form.lastName ? (
                  <div className="flex items-center p-3 bg-green-50 border-2 border-green-200 rounded-xl">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-green-800 font-semibold text-sm">Employee Selected</p>
                      <p className="text-green-600 text-xs">{form.firstName} {form.lastName} (ID: {form.employeeId})</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                    <svg className="w-4 h-4 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="text-yellow-800 font-semibold text-sm">No Employee Selected</p>
                      <p className="text-yellow-600 text-xs">Please search and select an employee above</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-5 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={!form.employeeId || !form.firstName || !form.lastName}
                className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center ${
                  form.employeeId && form.firstName && form.lastName
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-xl transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create User
              </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
