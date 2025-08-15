import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, Edit2, X, DollarSign, Calculator, ArrowLeft, PlusCircle } from "lucide-react";
import axios from "axios";
import { useEmpSalaries } from "../../context/EmpSalaryContext";

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
  const employee = state?.employee;

  if (!employee) {
    useEffect(() => {
      navigate("/salary");
    }, [navigate]);
    return null;
  }

  const {
    loading,
    error,
    fetchSalaryHistory,
    createSalary,
    updateSalary,
  } = useEmpSalaries();

  const [isEditing, setIsEditing] = useState(false);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [selectedSalaryIndex, setSelectedSalaryIndex] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [formData, setFormData] = useState(null);
  const [newMonthError, setNewMonthError] = useState("");
  const [disableInputs, setDisableInputs] = useState(false);

  

  // Helper: Get all existing months (YYYY-MM) from salaryHistory
  const existingMonths = salaryHistory.map(
    record => record.effectiveDate && record.effectiveDate.slice(0, 7)
  );

  useEffect(() => {
    const loadSalaryHistory = async () => {
      const history = await fetchSalaryHistory(employee.id);
      if (history.length > 0) {
        setSalaryHistory(history);
        setFormData(mapApiToFormData(history[0]));
      } else {
        // No history, prepare a new record form
        handleAddNew();
      }
    };
    loadSalaryHistory();
  }, [employee.id]);
  
  useEffect(() => {
    if (salaryHistory.length > 0 && !isNewRecord) {
      const currentSalary = salaryHistory[selectedSalaryIndex];
      setFormData(mapApiToFormData(currentSalary));
    }
  }, [selectedSalaryIndex, salaryHistory, isNewRecord]);

  const mapApiToFormData = (apiData) => {
    if (!apiData) return null;
    return {
      salid: apiData.salid,
      employeeId: apiData.empid || employee.id, // <-- Use empid from API or fallback to employee.id
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      baseSalary: apiData.baseSalary || 0,
      salaryType: apiData.salaryType || "Monthly",
      allowances: {
        housing: apiData.housingAllowance || 0,
        transport: apiData.transportAllowance || 0,
        meals: apiData.mealAllowance || 0,
        communication: apiData.communicationAllowance || 0,
        overtime: apiData.overtimeAllowance || 0,
        bonus: apiData.bonusAllowance || 0,
      },
      deductions: {
        incomeTax: apiData.incomeTax || 0,
        healthInsurance: apiData.healthInsurance || 0,
        employmentInsurance: apiData.employmentInsurance || 0,
        pensionInsurance: apiData.pensionInsurance || 0,
        longTermCare: apiData.longtermCare || 0,
        other: apiData.other || 0,
      },
      paymentMethod: apiData.paymentMethod || "Bank Transfer",
      bankDetails: {
        bankName: apiData.bankName || "",
        branchName: apiData.branchName || "",
        accountType: apiData.accountType || "Savings",
        accountNumber: apiData.accountNumber || "",
      },
      effectiveDate: apiData.effectiveDate ? new Date(apiData.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  };

  const calculateTotalAllowances = () => {
    if (!formData) return 0;
    return Object.values(formData.allowances).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  const calculateTotalDeductions = () => {
    if (!formData) return 0;
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
    if (!formData) return 0;
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

  const getNextMonthFirstDay = () => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1; // next month (0-based)
    if (month > 11) {
      year += 1;
      month = 0;
    }
    // month is 0-based for Date, but 1-based for formatting
    return `${year}-${String(month + 1).padStart(2, '0')}-01`;
  };

  const isEditableMonth = (dateStr) => {
    if (!dateStr) return false;
    const now = new Date();
    const recordDate = new Date(dateStr);
    // Editable if recordDate is after the last day of the current month
    return (
      recordDate.getFullYear() > now.getFullYear() ||
      (recordDate.getFullYear() === now.getFullYear() && recordDate.getMonth() > now.getMonth())
    );
  };

  const handleSave = async () => {
    const totalAllowance = calculateTotalAllowances();
    const totalDeduction = calculateTotalDeductions();
    const netSalary = calculateNetSalary();

    // Only allow saving for future months and not duplicate months
    const recordDate = new Date(formData.effectiveDate);
    const now = new Date();
    const selectedMonth = formData.effectiveDate.slice(0, 7);
    if (
      recordDate.getFullYear() < now.getFullYear() ||
      (recordDate.getFullYear() === now.getFullYear() && recordDate.getMonth() <= now.getMonth())
    ) {
      alert("You can only create or edit salary details for following months.");
      return;
    }
    if (existingMonths.includes(selectedMonth) && (isNewRecord || !formData.salid)) {
      alert("A salary record for this month already exists.");
      return;
    }

    // Ensure effectiveDate is a full date string (YYYY-MM-DD)
    let effectiveDate = formData.effectiveDate;
    if (/^\d{4}-\d{2}$/.test(effectiveDate)) {
      effectiveDate = effectiveDate + "-01";
    }

    const payload = {
      empid: formData.employeeId, // <-- Correct field for your backend!
      baseSalary: parseFloat(formData.baseSalary),
      salaryType: formData.salaryType,
      effectiveDate, // use the fixed value
      housingAllowance: parseFloat(formData.allowances.housing) || 0,
      transportAllowance: parseFloat(formData.allowances.transport) || 0,
      mealAllowance: parseFloat(formData.allowances.meals) || 0,
      communicationAllowance: parseFloat(formData.allowances.communication) || 0,
      overtimeAllowance: parseFloat(formData.allowances.overtime) || 0,
      bonusAllowance: parseFloat(formData.allowances.bonus) || 0,
      totalAllowance,
      incomeTax: parseFloat(formData.deductions.incomeTax) || 0,
      healthInsurance: parseFloat(formData.deductions.healthInsurance) || 0,
      employmentInsurance: parseFloat(formData.deductions.employmentInsurance) || 0,
      pensionInsurance: parseFloat(formData.deductions.pensionInsurance) || 0,
      longtermCare: parseFloat(formData.deductions.longTermCare) || 0,
      other: parseFloat(formData.deductions.other) || 0,
      totalDeduction,
      netSalary,
      paymentMethod: formData.paymentMethod,
      bankName: formData.bankDetails.bankName,
      branchName: formData.bankDetails.branchName,
      accountType: formData.bankDetails.accountType,
      accountNumber: formData.bankDetails.accountNumber,
    };

    try {
      if (isNewRecord || !formData.salid) {
        await createSalary(payload);
        alert('Salary record created successfully!');
      } else {
        await updateSalary(formData.salid, payload);
        alert('Salary details updated successfully!');
      }
      setIsEditing(false);
      setIsNewRecord(false);
      // Refresh history
      const history = await fetchSalaryHistory(employee.id);
      setSalaryHistory(history);
      setSelectedSalaryIndex(0); // Go back to the latest record
    } catch (error) {
      console.error("Error saving salary details:", error);
      alert("Failed to save salary details.");
    }
  };
  
  const handleAddNew = () => {
    setIsNewRecord(true);
    setIsEditing(true);
    setDisableInputs(false);
    setFormData({
      ...mapApiToFormData({}),
      effectiveDate: "", // Let user pick
    });
    setNewMonthError("");
  };

  // New: handle month picking for new record
  const handleEffectiveDateChange = (e) => {
    const value = e.target.value;
    const selectedMonth = value.slice(0, 7);
    const now = new Date();
    const selectedDate = new Date(value + "-01");
    // Only allow future months
    if (
      selectedDate.getFullYear() < now.getFullYear() ||
      (selectedDate.getFullYear() === now.getFullYear() && selectedDate.getMonth() <= now.getMonth())
    ) {
      setNewMonthError("You can only create salary records for future months.");
      setDisableInputs(true);
      setFormData(prev => ({ ...prev, effectiveDate: value }));
      return;
    }
    if (existingMonths.includes(selectedMonth)) {
      setNewMonthError("A salary record for this month already exists.");
      setDisableInputs(true);
      setFormData(prev => ({ ...prev, effectiveDate: value }));
    } else {
      setNewMonthError("");
      setDisableInputs(false);
      // Reset form to original (empty) state for the selected month
      setFormData({
        ...mapApiToFormData({}),
        effectiveDate: value
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsNewRecord(false);
    // If we were adding a new one and canceled, go back to the latest existing record
    if (salaryHistory.length > 0) {
      setSelectedSalaryIndex(0);
      setFormData(mapApiToFormData(salaryHistory[0]));
    } else {
       navigate('/salary'); // No records exist, go back
    }
  };

  const handlePrevMonth = () => {
    setSelectedSalaryIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const handleNextMonth = () => {
    setSelectedSalaryIndex((prev) => (prev < salaryHistory.length - 1 ? prev + 1 : prev));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', minimumFractionDigits: 0 }).format(amount || 0);
  };

  if (loading && !formData) return <div className="text-center p-8">Loading salary details...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!formData) return <div className="text-center p-8">No salary data found for this employee. Click "Add New Record".</div>;

  // Safely get the selected record to prevent crashes
  const selectedSalaryRecord = isNewRecord ? null : salaryHistory[selectedSalaryIndex];

  const selectedMonthSalary = isNewRecord ? {
    month: "New Record",
    baseSalary: formData.baseSalary,
    allowances: calculateTotalAllowances(),
    deductions: calculateTotalDeductions(),
    netSalary: calculateNetSalary(),
  } : {
    month: selectedSalaryRecord?.effectiveDate?.substring(0, 7) || "N/A",
    baseSalary: selectedSalaryRecord?.baseSalary || 0,
    allowances: selectedSalaryRecord?.totalAllowance || 0,
    deductions: selectedSalaryRecord?.totalDeduction || 0,
    netSalary: selectedSalaryRecord?.netSalary || 0,
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
                    onClick={handleNextMonth} // Go to older record (index + 1)
                    type="button"
                    disabled={isNewRecord || selectedSalaryIndex >= salaryHistory.length - 1}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    ◀
                  </button>
                  <span className="text-base font-semibold text-gray-700">
                    {selectedMonthSalary.month}
                  </span>
                  <button
                    onClick={handlePrevMonth} // Go to newer record (index - 1)
                    type="button"
                    disabled={isNewRecord || selectedSalaryIndex === 0}
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
                    disabled={disableInputs || !isEditing}
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
                    disabled={disableInputs || !isEditing}
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
                  {isNewRecord ? (
                    <>
                      <input
                        type="month"
                        name="effectiveDate"
                        value={formData.effectiveDate ? formData.effectiveDate.slice(0, 7) : ""}
                        onChange={handleEffectiveDateChange}
                        disabled={false}
                        className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                      {/* Show the full date below the month picker */}
                      {formData.effectiveDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Full effective date: <span className="font-mono">{/^\d{4}-\d{2}$/.test(formData.effectiveDate) ? formData.effectiveDate + "-01" : formData.effectiveDate}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <input
                      type="date"
                      name="effectiveDate"
                      value={formData.effectiveDate}
                      onChange={handleInputChange}
                      disabled={disableInputs || !isEditableMonth(formData.effectiveDate) || !isEditing}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  )}
                  {isNewRecord && newMonthError && (
                    <div className="text-red-600 text-xs mt-1">{newMonthError}</div>
                  )}
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
                      disabled={disableInputs || !isEditing}
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
                      disabled={disableInputs || !isEditing}
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
                    disabled={disableInputs || !isEditing}
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
                      disabled={disableInputs || !isEditing}
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
                      disabled={disableInputs || !isEditing}
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
                      disabled={disableInputs || !isEditing}
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
                      disabled={disableInputs || !isEditing}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
              )}
            </div>

           

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={handleAddNew}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Record
              </button>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button onClick={handleCancel} className="px-5 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center" >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                      </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center" >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                      </button>
                  </>
                ) : (
                  !isNewRecord && isEditableMonth(formData.effectiveDate) && (
                    <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center" >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                    </button>
                  )
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetail;