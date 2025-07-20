import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Trash2, Eye } from "lucide-react"; // Changed View to Eye for a more common icon
import { useEmployees } from "../../context/EmployeeContext";

const EmployeeList = () => {
  const navigate = useNavigate();
  const { employees, loading, error, deleteEmployee } = useEmployees();

  const handleDoubleClick = (employee) => {
    navigate(`/employee/view/${employee.id}`, { state: { employee } });
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b pb-6 border-gray-200">
          <Users className="h-10 w-10 text-blue-600" />
          <h1 className="text-4xl font-extrabold text-gray-800">Employee Directory</h1>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-lg text-gray-600 py-10">Loading employee data...</p>
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
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Full Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out"
                        onDoubleClick={() => handleDoubleClick(employee)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{employee.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${employee.firstName} ${employee.lastName}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.phoneNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-4">
                            {/* View Button */}
                            <button
                              onClick={() => navigate(`/employee/view/${employee.id}`, { state: { employee } })}
                              className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition duration-150 ease-in-out"
                              title="View Employee Details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(employee.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition duration-150 ease-in-out"
                              title="Delete Employee"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default EmployeeList;