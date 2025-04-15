import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployees } from "../../context/EmployeeContext";
import "./EmployeeForm.css";
import axios from "axios";

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

const defaultEmployee = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  dateOfEntry: new Date().toISOString().split("T")[0],
  gender: "male",
  address: "",
  subAddress: "",
  postalCode: "",
  department: "",
  email: "",
  phoneNo: "",
  // picture: "",
};

export const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addEmployee, updateEmployee, getEmployee } = useEmployees();
  const [formData, setFormData] = useState(defaultEmployee);
  // const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (id) {
      const employee = getEmployee(id);
      if (employee) {
        setFormData(employee);
        // setPreviewImage(employee.picture);
      }
    }
  }, [id, getEmployee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       const base64String = reader.result;
  //       setPreviewImage(base64String);
  //       setFormData((prev) => ({ ...prev, picture: base64String }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employeeData = {
      ...formData, // Include all form fields
    };

    try {
      let response;
 
        await addEmployee(employeeData);
      
      alert("Employee saved successfully!");
      handleClear();
      navigate("/");
    } catch (error) {
      console.error("Error saving employee:", error);
      alert(
        error.response?.data?.message ||
          "Error saving employee. Please try again."
      );
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

  const handleClear = () => {
    setFormData(defaultEmployee); // Reset form to default values

    // setPreviewImage(""); // Remove the preview image
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

  //sending data to the backend server

  return (
    <div className="max-w-2xl mx-4 md:mx-auto p-4 md:p-4 ">
      <div className="flex justify-center">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="dateOfEntry"
              value={formData.dateOfEntry}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

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
                  className="form-radio"
                />
                <span className="ml-2 capitalize">{gender}</span>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
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
              City/Street/Building/Room No
            </label>
            <input
              type="text"
              name="subAddress"
              value={formData.subAddress}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover rounded-full"
            />
          )}
        </div> */}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Add
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Clear
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};
