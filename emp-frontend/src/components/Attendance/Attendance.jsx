import React, { useState, useEffect, useRef, useMemo } from "react";
import { useAttendanceLoginContext } from '../../context/AttendanceLoginContext';
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const Attendance = () => {
  const { fetchAllAttendance } = useAttendanceLoginContext();
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // You can remove if no status field available
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef();
  const qrValue = "http://192.168.43.57:5173/clockinout";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allData = await fetchAllAttendance();

        const today = new Date().toISOString().split("T")[0];

        // Filter records whose attendDate matches today
        const filtered = allData.filter(record => {
          const recordDateStr = record.attendDate ? new Date(record.attendDate).toISOString().split("T")[0] : null;
          return recordDateStr === today;
        });

        setAttendanceData(filtered);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchAllAttendance]);

  // Extract unique departments from `departname` field
  const departments = [
    "all",
    ...Array.from(
      new Set(attendanceData.map(r => r.departname).filter(Boolean))
    ),
  ];
const getStatusFromRecord = (record) => {
  if (!record.clockIn) return "absent"; // No clock-in means absent

  const clockInTime = new Date(record.clockIn);

  // Define late threshold, e.g., 9:00 AM
  const lateThreshold = new Date(clockInTime);
  lateThreshold.setHours(9, 0, 0, 0); // 9:00:00.000 AM

  if (clockInTime > lateThreshold) return "late";

  return "present";
};

const enhancedAttendanceData = useMemo(() => {
    return attendanceData.map(record => ({
      ...record,
      status: getStatusFromRecord(record),
    }));
  }, [attendanceData]);

  // You don't have status field? So either remove these or handle safely
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

  // Filter attendance data based on search, department, and status (if available)
  const filteredData = useMemo(() => {
    return enhancedAttendanceData.filter((record) => {
      const matchesSearch = record.employeename.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || record.status === filterStatus;
      const matchesDepartment = filterDepartment === "all" || record.departname === filterDepartment;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [enhancedAttendanceData, searchTerm, filterStatus, filterDepartment]);


  // Stats based on status if you have it; otherwise fallback to zeros or remove
  const stats = useMemo(() => {
    return {
      total: enhancedAttendanceData.length,
      present: enhancedAttendanceData.filter(r => r.status === "present").length,
      absent: enhancedAttendanceData.filter(r => r.status === "absent").length,
      late: enhancedAttendanceData.filter(r => r.status === "late").length,
    };
  }, [enhancedAttendanceData]);
  // Format date/time helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDoubleClick = (record) => {
    navigate(`/attendance/detail/${record.id}`, { state: { employee: record } });
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

          {/* Show stats only if you have status field */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Present</p>
                <p className="text-2xl font-bold text-green-900">{stats.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Total Absent</p>
                <p className="text-2xl font-bold text-red-900">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Total Late</p>
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
              {departments.map(dep => (
                <option key={dep} value={dep}>
                  {dep === "all" ? "All Departments" : dep}
                </option>
              ))}
            </select>

            {/* Status Filter - keep or remove based on your data */}
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
                  {/* Remove status column header if no status */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map(record => (
                    <tr
                      key={record.id || record.attendanceId} // fallback id
                      className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                      onDoubleClick={() => handleDoubleClick(record)}
                      title="Double-click to view detailed attendance"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.employeename}</div>
                          {/* Remove employeeId if not available */}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.departname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(record.attendDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatTime(record.clockIn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatTime(record.clockOut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.totalHour > 0 ? `${record.totalHour}h` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.overTime > 0 ? `${record.overTime}h` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {/* If no status, you may want to show something else */}
                          {getStatusIcon(record.status)}
                          <span className={getStatusBadge(record.status)}>
                            {record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : "-"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      No attendance records found
                      <br />
                      Try adjusting your search or filter criteria
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
