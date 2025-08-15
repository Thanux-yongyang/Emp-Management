import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { useEmployees } from "../../context/EmployeeContext";
import { useDepartments } from "../../context/DepartmentContext";
import {useLeave} from "../../context/LeaveContext";

const LeaveManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [leaveInputs, setLeaveInputs] = useState({}); // Track editable leave data per employee

  const navigate = useNavigate();
  const { employees, loading, error } = useEmployees();
  const { departments } = useDepartments();
  const {saveLeave, getLeaves ,updateLeave} = useLeave();
const [leaves, setLeaves] = useState([]);

useEffect(() => {
  const fetchLeaves = async () => {
    const data = await getLeaves();
    setLeaves(data);

    // Map leaves to inputs so table uses backend data
    const initialLeaveData = {};
    employees.forEach((emp) => {
      const empLeave = data.find(l => l.employeeId === emp.id);
      initialLeaveData[emp.id] = {
        totalPaidLeave: empLeave?.totalLeaveDays ?? emp.totalPaidLeave ?? 10,
        usedPaidLeave: empLeave?.usedLeaveDays ?? emp.usedPaidLeave ?? 0,
      };
    });
    setLeaveInputs(initialLeaveData);
  };

  if (!loading && employees.length) {
    fetchLeaves();
  }
}, [loading, employees]);


  

  // Initialize leaveInputs when employees load
  useEffect(() => {
    if (!loading && employees.length) {
      const initialLeaveData = {};
      employees.forEach((emp) => {
        initialLeaveData[emp.id] = {
          totalPaidLeave: emp.totalPaidLeave || 10, // default 10 or from employee data
          usedPaidLeave: emp.usedPaidLeave || 0,
        };
      });
      setLeaveInputs(initialLeaveData);
    }
  }, [loading, employees]);

  // Update leave input for specific employee and field
  const handleInputChange = (id, field, value) => {
    setLeaveInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value >= 0 ? value : 0, // Prevent negative numbers
      },
    }));
  };

  // Save leave data for one employee (connect to API or context)
const saveEmployeeLeave = async (id) => {
  const leaveData = leaveInputs[id];

  // Find the leave record for this employee
  const existingLeave = leaves.find(l => l.employeeId === id); // fetched from getLeaves()

  try {
    if (existingLeave) {
      console.log("employeeId", id);
       console.log("leaveData", leaveData);
       console.log("totalPaidLeave", leaveData.totalPaidLeave);
       console.log("usedPaidLeave", leaveData.usedPaidLeave);
      await updateLeave(existingLeave.id, {
       
        
        employeeId:  id,
        totalLeaveDays: leaveData.totalPaidLeave,
        usedLeaveDays: leaveData.usedPaidLeave
      });
      alert("Leave updated!");
    } else {
      
      await saveLeave({
        employeeId: id,
        totalLeaveDays: leaveData.totalPaidLeave,
        usedLeaveDays: leaveData.usedPaidLeave
      });
      alert("Leave saved!");
    }
  } catch (err) {
    console.error(err);
  }
};


  // Filter employees by search
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const filtered = employees.filter(
        (emp) =>
          emp.firstName?.toLowerCase().includes(value.toLowerCase()) ||
          emp.lastName?.toLowerCase().includes(value.toLowerCase()) ||
          emp.id?.toString().includes(value) ||
          departments.find((d) => d.id === emp.department)?.name
            .toLowerCase()
            .includes(value.toLowerCase())
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
            Leave Management
          </h1>
        </div>

        {/* Search */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search employees by name, ID, or department..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="w-full pl-4 pr-4 py-3 text-lg bg-white border-2 border-purple-300 rounded-2xl shadow-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none transition-all duration-300 placeholder-gray-400"
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <p className="text-center text-lg text-gray-600 py-10">
            Loading employee data...
          </p>
        ) : (
          <>
            {(searchQuery.trim() ? searchResults : employees).length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                <p>No employees found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
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
                        Date of Joining
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Total Paid Leave
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Used Paid Leave
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Remaining Paid Leave
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(searchQuery.trim() ? searchResults : employees).map(
                      (employee) => {
                        const leave = leaveInputs[employee.id] || {
                          totalPaidLeave: 0,
                          usedPaidLeave: 0,
                        };
                        const remaining = leave.totalPaidLeave - leave.usedPaidLeave;

                        return (
                          <tr
                            key={employee.id}
                            className="hover:bg-gray-50 transition duration-150 ease-in-out"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {employee.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {
                                departments.find((d) => d.id === employee.department)
                                  ?.name || ""
                              }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(employee.dateOfEntry).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <input
                                type="number"
                                min={0}
                                className="w-16 border rounded px-2 py-1"
                                value={leave.totalPaidLeave}
                                onChange={(e) =>
                                  handleInputChange(
                                    employee.id,
                                    "totalPaidLeave",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <input
                                type="number"
                                min={0}
                                max={leave.totalPaidLeave}
                                className="w-16 border rounded px-2 py-1"
                                value={leave.usedPaidLeave}
                                onChange={(e) =>
                                  handleInputChange(
                                    employee.id,
                                    "usedPaidLeave",
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {remaining >= 0 ? remaining : 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => saveEmployeeLeave(employee.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                Save
                              </button>
                            </td>
                          </tr>
                        );
                      }
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

export default LeaveManagement;
