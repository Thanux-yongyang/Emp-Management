import React, { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Users,
  Filter,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Printer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const Attendance = () => {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Mock data for demonstration
  const mockAttendanceData = [
    {
      id: 1,
      employeeId: "EMP001",
      employeeName: "John Doe",
      department: "Engineering",
      date: "2024-01-15",
      checkIn: "09:00 AM",
      checkOut: "05:30 PM",
      status: "present",
      totalHours: 8.5,
      overtime: 0.5,
    },
    {
      id: 2,
      employeeId: "EMP002",
      employeeName: "Jane Smith",
      department: "Marketing",
      date: "2024-01-15",
      checkIn: "08:45 AM",
      checkOut: "06:00 PM",
      status: "present",
      totalHours: 9.25,
      overtime: 1.25,
    },
    {
      id: 3,
      employeeId: "EMP003",
      employeeName: "Mike Johnson",
      department: "Sales",
      date: "2024-01-15",
      checkIn: "09:30 AM",
      checkOut: null,
      status: "late",
      totalHours: 0,
      overtime: 0,
    },
    {
      id: 4,
      employeeId: "EMP004",
      employeeName: "Sarah Wilson",
      department: "HR",
      date: "2024-01-15",
      checkIn: null,
      checkOut: null,
      status: "absent",
      totalHours: 0,
      overtime: 0,
    },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAttendanceData(mockAttendanceData);
      setLoading(false);
    }, 1000);
  }, []);

  // Extract unique departments
  const departments = [
    "all",
    ...Array.from(
      new Set(attendanceData.map((r) => r.department).filter(Boolean))
    ),
  ];

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

  //Generate QR Code
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef();
  const qrValue = "http://192.168.43.57:5173/clockinout"; // Replace with your actual URL
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

  const filteredData = attendanceData.filter((record) => {
    const matchesSearch =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || record.status === filterStatus;
    const matchesDepartment =
      filterDepartment === "all" || record.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const stats = {
    total: attendanceData.length,
    present: attendanceData.filter((r) => r.status === "present").length,
    absent: attendanceData.filter((r) => r.status === "absent").length,
    late: attendanceData.filter((r) => r.status === "late").length,
  };

  // Handle double click to navigate to attendance detail
  const handleDoubleClick = (record) => {
    navigate(`/attendance/detail/${record.id}`, {
      state: {
        employee: record,
      },
    });
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
        </div>

        {/* Today's Status and Date */}
        <div className="flex items-center justify-between">
          <div className="mb-4 flex items-center gap-4">
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

            {/* Button to show QR Code */}
       
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
                <p className="text-sm font-medium text-blue-600">
                  Total Employees
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.total}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Total Present
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.present}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Total Absent</p>
                <p className="text-2xl font-bold text-red-900">
                  {stats.absent}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  Total Late
                </p>
                <p className="text-2xl font-bold text-yellow-900">
                  {stats.late}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by employee name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <h1 className="pt-1">Filter By</h1>
          </div>
          <div className="flex gap-4">
            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep === "all" ? "All Departments" : dep}
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
            <p className="text-lg text-gray-600 mt-4">
              Loading attendance data...
            </p>
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
                {filteredData.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                    onDoubleClick={() => handleDoubleClick(record)}
                    title="Double-click to view detailed attendance"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.employeeName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.employeeId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.checkIn || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.checkOut || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.totalHours > 0 ? `${record.totalHours}h` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.overtime > 0 ? `${record.overtime}h` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <span className={getStatusBadge(record.status)}>
                          {record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">No attendance records found</p>
                <p className="text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
