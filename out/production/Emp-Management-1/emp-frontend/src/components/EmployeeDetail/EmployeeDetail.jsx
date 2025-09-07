import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {  Save, Edit2, X } from "lucide-react";
import axios from "axios";
import { useEmployees } from "../../context/EmployeeContext"; // ✅ Use the context
import "./EmployeeDetail.css";

const departments = [
  "Engineering",
  "IT",
  "HR",
  "Marketing",
  "Finance",
  "Operations",
  "Sales",
  "Customer Support",

];

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve employee data from Router state

  //  If no employee data is found, redirect back to the employee list
  if (!state || !state.employee) {
    navigate("/employees");
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(state.employee); // Use passed data

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const {updateEmployee , deleteEmployee} = useEmployees(); // ✅ Use `useEmployees` hook
  const handleSave = async () => {
    try {
      await updateEmployee(formData.id, formData)
      
      alert("Employee details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee.");
    }
  };

  const handleCancel = () => {
    setFormData(state.employee); // Reset form data to original values
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

  return (
    <div className="max-w-2xl mx-4 md:mx-auto p-4 md:p-4">
      {/* Header Section */}
      {/* <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/employees")}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        
      </div> */}
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold mb-6">Employee Details</h1>
      </div>

      {/* Employee Form */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="text-blue-600 font-bold ">Employee Id: {formData.id}</div>
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Date of Birth & Entry Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Entry
              </label>
              <input
                type="date"
                name="dateOfEntry"
                value={formData.dateOfEntry}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Gender Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="mt-1 space-x-4">
              {["male", "female", "other"].map((gender) => (
                <label key={gender} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="form-radio"
                  />
                  <span className="ml-2">{gender}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handlePostalCodeChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sub Address (Room No, etc.)
              </label>
              <input
                type="text"
                name="subAddress"
                value={formData.subAddress}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Phone Number & Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone No
            </label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={formatPhoneNumber}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 gap-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
              >
                <Edit2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeDetail;
