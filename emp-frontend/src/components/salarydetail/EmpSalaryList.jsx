import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react"; // Changed View to Eye for a more common icon
import { useEmployees } from "../../context/EmployeeContext";
import { useDepartments } from "../../context/DepartmentContext";
import { useEffect, useRef } from "react";

const EmpSalaryList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const { employees, loading, error, deleteEmployee } = useEmployees();
  const { departments } = useDepartments();

  const handleDoubleClick = (employee) => {
    navigate(`/salarydetail`, { state: { employee } });
  };

  const handleDelete = async (employeeID) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    try {
      await deleteEmployee(employeeID);
      alert("Employee deleted successfully!");
      // No need to navigate again if the context automatically re-fetches or updates
    } catch (error) {
      alert("Failed to delete employee.");
      console.error("Error deleting employee:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Filter employees locally based on search query
    if (value.trim()) {
      const filtered = employees.filter(
        (emp) =>
          emp.firstName?.toLowerCase().includes(value.toLowerCase()) ||
          emp.lastName?.toLowerCase().includes(value.toLowerCase()) ||
          emp.id?.toString().includes(value) ||
          emp.department?.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b pb-6 border-gray-200">
          <Users className="h-10 w-10 text-blue-600" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            Employee Directory
          </h1>
        </div>
                  <div className="mb-2 relative">
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
              placeholder="Search employees by name, ID, or department..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full pl-12 pr-4 py-4 text-lg bg-white border-2 border-purple-300 rounded-2xl shadow-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 placeholder-gray-400"
            />
          </div>
        </div>
        {/* Error Handling */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-lg text-gray-600 py-10">
            Loading employee data...
          </p>
        ) : (
          <>
            {employees.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                <p>No employees found. Start by adding a new employee!</p>
                {/* Optional: Add a button to navigate to add employee page if applicable */}
              </div>
            ) : (
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  {/* Table Header */}
                  <thead className="bg-blue-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Department
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(searchQuery.trim() ? searchResults : employees).map(
                      (employee) => (
                        <tr
                          key={employee.id}
                          className="hover:bg-gray-50 transition duration-150 ease-in-out"
                          onDoubleClick={() => handleDoubleClick(employee)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {employee.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${employee.firstName} ${employee.lastName}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {departments.find(d => d.id == employee.department || d.name === employee.department)?.name || ''}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-4">
                              {/* View Button */}
                                                          <button
                              type="button"
                              onClick={() =>
                                navigate(`/salarydetail`, { state: { employee } })
                              }
                              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                              title={`View Salary Details for ${employee.firstName} ${employee.lastName}`}
                            >
                              Salary Details
                            </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmpSalaryList;
