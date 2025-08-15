import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAttendanceLoginContext } from '../../context/AttendanceContext';
import { useEmployees } from "../../context/EmployeeContext";
import { useDepartments } from "../../context/DepartmentContext";
import {
  Calendar,
  Clock,
  Users,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Printer,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const Attendance = () => {
  const { fetchAllAttendance } = useAttendanceLoginContext();
  const { employees } = useEmployees();
  const { departments } = useDepartments();
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState([]);
  const [allAttendanceData, setAllAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showQR, setShowQR] = useState(false);
  const [error, setError] = useState(null);
  const qrRef = useRef();
  const qrValue = "http://192.168.43.57:5173/clockinout";

  // Helper function to normalize dates for comparison
  const normalizeDate = (dateInput) => {
    if (!dateInput) return null;
    
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return null;
      
      // Return date in YYYY-MM-DD format in local timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Date normalization error:", error);
      return null;
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return normalizeDate(today);
  };

  // Get department name by ID with better debugging
  const getDepartmentName = (departmentId) => {
    if (!departments || !Array.isArray(departments) || !departmentId) {
      console.log("getDepartmentName: Missing data", { 
        departments: departments?.length, 
        departmentId 
      });
      return "Unknown Department";
    }
    
    // console.log("Looking for department:", {
    //   departmentId,
    //   departmentIdType: typeof departmentId,
    //   availableDepartments: departments.map(d => ({ id: d.id, idType: typeof d.id, name: d.name || d.departmentName }))
    // });
    
    // Try both string and number matching
    const department = departments.find(dept => 
      dept.id === departmentId || 
      dept.id === String(departmentId) || 
      String(dept.id) === String(departmentId)
    );
    
    const result = department ? (department.name || department.departmentName) : "Unknown Department";
   // console.log("Department lookup result:", { departmentId, found: !!department, result });
    
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      
      try {
        const allData = await fetchAllAttendance();
        
        if (!allData || !Array.isArray(allData)) {
          throw new Error("Invalid data format received from API");
        }

        // Store all data for debugging
        setAllAttendanceData(allData);
        
        const todayString = getTodayString();
        console.log("Today's date string:", todayString);

        // Filter attendance records for today
        const todaysAttendance = allData.filter(record => {
          if (!record || !record.attendDate) return false;
          const recordDateString = normalizeDate(record.attendDate);
          return recordDateString === todayString;
        });

        setAttendanceData(todaysAttendance);
        
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
        setError(error.message || "Failed to fetch attendance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchAllAttendance]);

  // Create enhanced data combining all employees with their attendance records
  const enhancedEmployeeData = useMemo(() => {
    if (!employees || !Array.isArray(employees)) {
      console.log("No employees data available");
      return [];
    }

    // console.log("=== DEBUGGING EMPLOYEE-DEPARTMENT MATCHING ===");
    // console.log("Total employees:", employees.length);
    // console.log("Total departments:", departments?.length || 0);
    // console.log("Sample employee:", employees[0]);
    // console.log("Sample department:", departments?.[0]);

    return employees.map((employee, index) => {
      // Debug each employee's department info
      if (index < 3) { // Log first 3 employees for debugging
        console.log(`Employee ${index + 1}:`, {
          name: `${employee.firstName} ${employee.lastName}`,
          departmentId: employee.departmentId,
          departmentIdType: typeof employee.departmentId,
          departmentField: employee.department, // Check if there's a department field
          allEmployeeFields: Object.keys(employee)
        });
      }

      // Find today's attendance record for this employee
      const todaysAttendance = attendanceData.find(attendance => 
        attendance.employeeId === employee.id || 
        attendance.employeename === `${employee.firstName} ${employee.lastName}` ||
        attendance.employeename === employee.fullName
      );

      // Determine status
      let status = "absent";
      if (todaysAttendance && todaysAttendance.clockIn) {
        try {
          const clockInTime = new Date(todaysAttendance.clockIn);
          if (!isNaN(clockInTime.getTime())) {
            // Define late threshold (9:00 AM)
            const lateThreshold = new Date(clockInTime);
            lateThreshold.setHours(9, 0, 0, 0);
            status = clockInTime > lateThreshold ? "late" : "present";
          }
        } catch (error) {
          console.error("Error determining status:", error);
        }
      }

      const departmentName = getDepartmentName(employee.departmentId || employee.department);
      const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();

      return {
        ...employee,
        attendanceRecord: todaysAttendance || null,
        status: status,
        departmentName: departmentName,
        fullName: fullName || employee.name || 'Unknown Employee'
      };
    });
  }, [employees, attendanceData, departments]);

  // Extract unique departments for filter dropdown
  const departmentOptions = useMemo(() => {
    if (!departments || !Array.isArray(departments)) {
      return ["all"];
    }
    
    // Get department names from department context
    const deptNames = departments.map(dept => dept.name || dept.departmentName).filter(Boolean);
    return ["all", ...deptNames];
  }, [departments]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "absent":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "late":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "present":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "absent":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "late":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Filter employee data based on search, department, and status
  const filteredData = useMemo(() => {
    return enhancedEmployeeData.filter((employee) => {
      const matchesSearch = employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesStatus = filterStatus === "all" || employee.status === filterStatus;
      const matchesDepartment = filterDepartment === "all" || employee.departmentName === filterDepartment;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [enhancedEmployeeData, searchTerm, filterStatus, filterDepartment]);

  // Stats based on status
  const stats = useMemo(() => {
    return {
      total: enhancedEmployeeData.length,
      present: enhancedEmployeeData.filter(emp => emp.status === "present").length,
      absent: enhancedEmployeeData.filter(emp => emp.status === "absent").length,
      late: enhancedEmployeeData.filter(emp => emp.status === "late").length,
    };
  }, [enhancedEmployeeData]);

  // Format date/time helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleDateString();
    } catch (error) {
      return "-";
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return "-";
    }
  };

  const handleDoubleClick = (employee) => {
    // Navigate with the actual employee ID, not attendance record ID
    navigate(`/attendance/detail/${employee.id}`, { 
      state: { 
        employee: {
          id: employee.id,
          employeename: employee.fullName,
          departname: employee.departmentName,
          email: employee.email,
          phoneNo: employee.phoneNo
        }
      } 
    });
  };

  const handlePrint = () => {
    if (!qrRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Print QR Code</title></head>
        <body style="text-align:center; margin-top:50px;">
          <h2>QR Code</h2>
          ${qrRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b pb-6 border-gray-200">
          <Calendar className="h-10 w-10 text-blue-600" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            Attendance Management
          </h1>
          <button
            onClick={handleRefresh}
            className="ml-auto p-2 text-gray-500 hover:text-blue-600 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="h-6 w-6" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Today's Status and Date */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-lg font-semibold rounded-full px-6 py-2">
              Today's Status
            </span>
            <span className="text-gray-700 text-base font-medium">
              {new Date(selectedDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* QR Code Popup */}
            {showQR && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Attendance QR Code</h3>
                    <button
                      onClick={() => setShowQR(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="flex flex-col items-center">
                    <div ref={qrRef} className="mb-4 p-4 bg-white rounded-lg">
                      <QRCodeCanvas value={qrValue} size={256} />
                    </div>
                    <p className="text-gray-600 mb-4 text-center">
                      Scan this QR code to check-in for today's attendance
                    </p>
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Printer className="h-4 w-4" /> Print QR Code
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <button
              onClick={() => setShowQR(true)}
              className="px-2 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Generate QR
            </button>

            <button
              type="button"
              onClick={() => navigate("/attendance/create-logins")}
              className="px-2 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Manage Login
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Employees</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Present</p>
                <p className="text-2xl font-bold text-green-900">{stats.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Absent</p>
                <p className="text-2xl font-bold text-red-900">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Late</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.late}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="pt-1">
            <h1>Filter By</h1>
          </div>

          <div className="flex gap-4">
            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departmentOptions.map(dept => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-lg text-gray-600 mt-4">Loading attendance data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((employee, index) => {
                    const record = employee.attendanceRecord;
                    return (
                      <tr
                        key={employee.id || index}
                        className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                        onDoubleClick={() => handleDoubleClick(employee)}
                        title="Double-click to view detailed attendance history"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {employee.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {employee.employeeId || employee.id}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {employee.departmentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {record ? formatDate(record.attendDate) : formatDate(new Date())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {record ? formatTime(record.clockIn) : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {record ? formatTime(record.clockOut) : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {(record && record.totalHour && record.totalHour > 0) ? `${record.totalHour}h` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {(record && record.overTime && record.overTime > 0) ? `${record.overTime}h` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(employee.status)}
                            <span className={getStatusBadge(employee.status)}>
                              {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-16 text-gray-500">
                      <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <div className="text-lg font-medium mb-2">No employees found</div>
                      <div className="text-sm">
                        {employees?.length > 0 
                          ? "Try adjusting your search or filter criteria"
                          : "No employees available in the system"
                        }
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;