import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {  Save, Edit2, X } from "lucide-react";
import axios from "axios";
import { useEmployees } from "../../context/EmployeeContext"; // ✅ Use the context
import { useDepartments } from "../../context/DepartmentContext";
import "./EmployeeDetail.css";

// Remove the hardcoded departments array
// const departments = [ ... ];

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve employee data from Router state
  const { departments, loading: deptLoading, error: deptError } = useDepartments();

  //  If no employee data is found, redirect back to the employee list
  if (!state || !state.employee) {
    navigate("/employees");
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  // Ensure department is stored as id (string or number)
  const [formData, setFormData] = useState({
    ...state.employee,
    department: departments.find(d => d.name === state.employee.department)?.id || state.employee.department
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const {updateEmployee , deleteEmployee} = useEmployees();
  const handleSave = async () => {
    try {
      // When saving, send department as id
      await updateEmployee(formData.id, {
        ...formData,
        department: formData.department
      });
      alert("Employee details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee.");
    }
  };

  const handleCancel = () => {
    setFormData({
      ...state.employee,
      department: departments.find(d => d.name === state.employee.department)?.id || state.employee.department
    });
    setIsEditing(false);
  };

  const handlePostalCodeChange = (e) => {
    let value = e.target.value.replace(/[^\d]/g, ""); // Remove non-numeric characters
    if (value.length > 3) {
      value = value.substring(0, 3) + "-" + value.substring(3);
    }
    // setPostalCode(value);
    setFormData((prev) => ({ ...prev, postalCode: value }));

    // Trigger fetch when the postal code has a valid format
    if (value.length === 8 && /^\d{3}-\d{4}$/.test(value)) {
      fetchAddress(value);
    }
  };
  const fetchAddress = async (postalCode) => {
    try {
      const response = await axios.get(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
      );
      if (response.data.results) {
        const { address1, address2, address3 } = response.data.results[0];
        const mainAddress = `${address1} ${address2} ${address3}`;
        setFormData((prev) => ({ ...prev, address: mainAddress }));
      } else {
        setFormData((prev) => ({ ...prev, address: "Address not found" }));
      }
    } catch (error) {
      setFormData((prev) => ({ ...prev, address: "Error fetching address" }));
    }
  };
  const formatPhoneNumber = (e) => {
    let input = e.target.value.replace(/[^\d]/g, ""); // Remove non-numeric characters
    if (input.length > 11) return;
    let formattedInput = input;
    if (input.length >= 4 && input.length < 8) {
      formattedInput = input.replace(/(\d{3})(\d{1,4})/, "$1-$2");
    } else if (input.length >= 8) {
      formattedInput = input.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3");
    }

    setFormData((prev) => ({ ...prev, phoneNo: formattedInput })); // Update formData
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    try {
      await deleteEmployee(formData.id);
      alert("Employee deleted successfully!");
      navigate("/employees");
    } catch (error) {
      alert("Failed to delete employee.");
    }
  };

  // Find department name for display
  const deptObj = departments.find(d => d.id === formData.department);
  const deptName = deptObj ? deptObj.name : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center flex items-center justify-center space-x-4 mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Employee Details</h1>
            <p className="text-gray-600">View and manage employee information</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Employee Information</h2>
              <div className="text-white/90 font-semibold">ID: {formData.id}</div>
            </div>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="flex space-x-3">
                  {["male", "female", "other"].map((gender) => (
                    <label key={gender} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="form-radio text-purple-600"
                      />
                      <span className="ml-1 text-sm capitalize">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="dateOfEntry"
                  value={formData.dateOfEntry}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-white border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="">Select Department</option>
                  {deptLoading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))
                  )}
                </select>
                {deptError && <div className="text-red-500 text-sm mt-1">{deptError}</div>}
                {/* Show department name when not editing */}
                {/* {!isEditing && deptName && (
                  <div className="text-sm text-gray-500 mt-1">Department: {deptName}</div>
                )} */}
              </div>
              
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter email address"
                />
              </div>
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone No
                </label>
                <input
                  type="text"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={formatPhoneNumber}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter phone number"
                />
              </div>
            
                  <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handlePostalCodeChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="123-4567"
                />
              </div>
           
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter main address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City/Street/Building/Room No
                </label>
                <input
                  type="text"
                  name="subAddress"
                  value={formData.subAddress}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter sub address"
                />
              </div>
        
            </div>
           

            <div className="flex justify-end space-x-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;