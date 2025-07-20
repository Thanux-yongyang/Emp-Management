import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, Edit2, X, DollarSign, Calculator, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useEmployees } from "../../context/EmployeeContext";

const salaryTypes = [
  "Monthly",
  "Annual",
  "Hourly",
  "Contract",
  "Commission"
];

const paymentMethods = [
  "Bank Transfer",
  "Cash",
  "Check",
  "Direct Deposit"
];

const taxBrackets = [
  { min: 0, max: 1950000, rate: 5 },
  { min: 1950000, max: 3300000, rate: 10 },
  { min: 3300000, max: 6950000, rate: 20 },
  { min: 6950000, max: 9000000, rate: 23 },
  { min: 9000000, max: 18000000, rate: 33 },
  { min: 18000000, max: 40000000, rate: 40 },
  { min: 40000000, max: Infinity, rate: 45 }
];

const SalaryDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // If no employee data is found, redirect back to the employee list
  if (!state || !state.employee) {
    navigate("/salary");
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: state.employee.id,
    employeeName: `${state.employee.firstName} ${state.employee.lastName}`,
    department: state.employee.department,
    baseSalary: state.employee.salary || 0,
    salaryType: "Monthly",
    allowances: {
      housing: 0,
      transport: 0,
      meals: 0,
      communication: 0,
      overtime: 0,
      bonus: 0
    },
    deductions: {
      incomeTax: 0,
      healthInsurance: 0,
      employmentInsurance: 0,
      pensionInsurance: 0,
      longTermCare: 0,
      other: 0
    },
    paymentMethod: "Bank Transfer",
    bankDetails: {
      bankName: "",
      branchName: "",
      accountType: "Savings",
      accountNumber: ""
    },
    effectiveDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  const { updateEmployee } = useEmployees();

  const calculateTotalAllowances = () => {
    return Object.values(formData.allowances).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  const calculateTotalDeductions = () => {
    return Object.values(formData.deductions).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  const calculateIncomeTax = (annualSalary) => {
    let tax = 0;
    let remaining = annualSalary;

    for (const bracket of taxBrackets) {
      if (remaining <= 0) break;
      
      const taxableAmount = Math.min(remaining, bracket.max - bracket.min);
      tax += taxableAmount * (bracket.rate / 100);
      remaining -= taxableAmount;
    }

    return Math.round(tax);
  };

  const calculateNetSalary = () => {
    const baseSalary = parseFloat(formData.baseSalary) || 0;
    const totalAllowances = calculateTotalAllowances();
    const totalDeductions = calculateTotalDeductions();
    
    return baseSalary + totalAllowances - totalDeductions;
  };

  const autoCalculateDeductions = () => {
    const baseSalary = parseFloat(formData.baseSalary) || 0;
    const annualSalary = baseSalary * 12;
    
    // Calculate standard Japanese deductions (approximate rates)
    const healthInsurance = Math.round(baseSalary * 0.0495); // ~4.95%
    const employmentInsurance = Math.round(baseSalary * 0.003); // ~0.3%
    const pensionInsurance = Math.round(baseSalary * 0.091); // ~9.1%
    const longTermCare = Math.round(baseSalary * 0.00575); // ~0.575%
    const monthlyIncomeTax = Math.round(calculateIncomeTax(annualSalary) / 12);

    setFormData(prev => ({
      ...prev,
      deductions: {
        ...prev.deductions,
        incomeTax: monthlyIncomeTax,
        healthInsurance,
        employmentInsurance,
        pensionInsurance,
        longTermCare
      }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      // You would typically save this to a separate salary table
      // For now, we'll just update the employee's salary field
      await updateEmployee(formData.employeeId, { 
        salary: parseFloat(formData.baseSalary) 
      });
      
      alert("Salary details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating salary details:", error);
      alert("Failed to update salary details.");
    }
  };

  const handleCancel = () => {
    // Reset to original values - you'd fetch from API in real app
    setIsEditing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Dummy month-wise salary data
  const dummySalaryHistory = [
    {
      month: "2024-01",
      baseSalary: 300000,
      allowances: 20000,
      deductions: 10000,
      netSalary: 310000,
    },
    {
      month: "2024-02",
      baseSalary: 310000,
      allowances: 25000,
      deductions: 12000,
      netSalary: 323000,
    },
    {
      month: "2024-03",
      baseSalary: 320000,
      allowances: 18000,
      deductions: 11000,
      netSalary: 327000,
    },
  ];

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const selectedMonthSalary = dummySalaryHistory[selectedMonthIndex];

  const handlePrevMonth = () => {
    setSelectedMonthIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const handleNextMonth = () => {
    setSelectedMonthIndex((prev) => (prev < dummySalaryHistory.length - 1 ? prev + 1 : prev));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/salary')}
          className="flex items-center mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-semibold shadow transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back 
        </button>
        <div className="text-center flex items-center justify-center space-x-4 mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-lg">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Salary Details</h1>
            <p className="text-gray-600">Manage employee compensation and benefits</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Salary Information</h2>
                <p className="text-green-100">{formData.employeeName} - {formData.department}</p>
              </div>
              <div className="text-white/90 font-semibold">ID: {formData.employeeId}</div>
            </div>
          </div>
          
          <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
            {/* Net Salary Summary with Month Selector */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Salary Summary</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    type="button"
                    disabled={selectedMonthIndex === 0}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    ◀
                  </button>
                  <span className="text-base font-semibold text-gray-700">
                    {selectedMonthSalary.month}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    type="button"
                    disabled={selectedMonthIndex === dummySalaryHistory.length - 1}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    ▶
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-sm text-gray-600">Base Salary</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(selectedMonthSalary.baseSalary)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-sm text-gray-600">Total Allowances</div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedMonthSalary.allowances)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow">
                  <div className="text-sm text-gray-600">Total Deductions</div>
                  <div className="text-lg font-bold text-red-600">
                    {formatCurrency(selectedMonthSalary.deductions)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow border-2 border-purple-200">
                  <div className="text-sm text-gray-600">Net Salary</div>
                  <div className="text-xl font-bold text-purple-600">
                    {formatCurrency(selectedMonthSalary.netSalary)}
                  </div>
                </div>
              </div>
            </div>
            {/* Basic Salary Information */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-green-600" />
                Basic Salary Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Salary
                  </label>
                  <input
                    type="number"
                    name="baseSalary"
                    value={formData.baseSalary}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Enter base salary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Type
                  </label>
                  <select
                    name="salaryType"
                    value={formData.salaryType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-white border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {salaryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    name="effectiveDate"
                    value={formData.effectiveDate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Allowances */}
            <div className="bg-green-50 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-green-800">
                Allowances & Benefits
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(formData.allowances).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')} Allowance
                    </label>
                    <input
                      type="number"
                      name={`allowances.${key}`}
                      value={value}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <div className="text-sm text-green-800">
                  <strong>Total Allowances: {formatCurrency(calculateTotalAllowances())}</strong>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-red-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-red-800">
                  Deductions & Taxes
                </h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={autoCalculateDeductions}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Auto Calculate
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(formData.deductions).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="number"
                      name={`deductions.${key}`}
                      value={value}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <div className="text-sm text-red-800">
                  <strong>Total Deductions: {formatCurrency(calculateTotalDeductions())}</strong>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">
                Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {formData.paymentMethod === "Bank Transfer" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      name="bankDetails.bankName"
                      value={formData.bankDetails.bankName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      name="bankDetails.branchName"
                      value={formData.bankDetails.branchName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Enter branch name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select
                      name="bankDetails.accountType"
                      value={formData.bankDetails.accountType}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="Savings">Savings</option>
                      <option value="Checking">Checking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      name="bankDetails.accountNumber"
                      value={formData.bankDetails.accountNumber}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
              )}
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
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetail;