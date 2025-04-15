import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Trash2, View } from "lucide-react";
import { useEmployees } from "../../context/EmployeeContext"; // ✅ Use the context

const EmployeeList = () => {
  const navigate = useNavigate();
  const { employees, loading, error, deleteEmployee } = useEmployees(); // ✅ Use `useEmployees` hook

  // Navigate to employee details
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
      navigate("/employees");
    } catch (error) {
      alert("Failed to delete employee.");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Employee List</h1>
      </div>

      {/* Error Handling */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-500">Loading employees...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onDoubleClick={() => handleDoubleClick(employee)}
                  >
                    <td className="px-6 py-4">{employee.id}</td>
                    <td className="px-6 py-4">{`${employee.firstName} ${employee.lastName}`}</td>
                    <td className="px-6 py-4">{employee.department}</td>
                    <td className="px-6 py-4">{employee.email}</td>
                    <td className="px-6 py-4">{employee.phoneNo}</td>
                    <td className="px-6 py-4 flex gap-3">
                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/employee/view/${employee.id}`, { state: { employee } })}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <View className="h-5 w-5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(employee.id)} // Use deleteEmployee from context
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
