import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAttendanceLoginContext } from "../../context/AttendanceContext";
import { useSalaryData } from "../../context/SalaryDataContext";
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useLeave } from "../../context/LeaveContext";
import Holidays from "date-holidays";

const hd = new Holidays("JP");

const AttendanceDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    fetchEmployeeAttendance,
    updateAttendanceDetail,
    applyPaidLeave,
    cancelPaidLeave,
  } = useAttendanceLoginContext();

  const [employee, setEmployee] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingRecord, setEditingRecord] = useState(null);
  const [appliedDates, setAppliedDates] = useState([]);

  const [editForm, setEditForm] = useState({
    clockIn: "",
    clockOut: "",
    breakHours: 1,
  });
  const { getLeaves, updateLeave } = useLeave();
  const [leaves, setLeaves] = useState([]);

  // Get employee info from location state if available
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    // setLoading(true);

    const fetchData = async () => {
      try {
        const data = await fetchEmployeeAttendance(
          id,
          selectedYear,
          (selectedMonth + 1).toString().padStart(2, "0")
        );

        if (!isMounted) return;

        setAttendanceData(data || []);

        // Set employee info either from location.state or from first attendance record
        if (location.state?.employee) {
          setEmployee(location.state.employee);
        } else if (data && data.length > 0) {
          setEmployee({
            id,
            employeename: data[0].employeeName || "Unknown",
            departname: data[0].departmentName || "Unknown",
            email: data[0].email || null,
            phoneNo: data[0].phoneNo || null,
          });
        } else {
          setEmployee({
            id,
            employeename: "Unknown Employee",
            departname: "Unknown Department",
          });
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        if (isMounted) {
          setAttendanceData([]);
          setEmployee({
            id,
            employeename: "Unknown Employee",
            departname: "Unknown Department",
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id, selectedYear, selectedMonth, location.state]);

  // Month navigation functions
  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
    setSelectedMonth(newMonth.getMonth());
    setSelectedYear(newMonth.getFullYear());
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
    setSelectedMonth(newMonth.getMonth());
    setSelectedYear(newMonth.getFullYear());
  };

  const goToCurrentMonth = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Calculate statistics
  const calculateStats = () => {
    // Total workdays (exclude weekends and holidays)
    const totalWorkdays = monthRows.filter(
      (row) => !row.isHoliday && !row.isWeekend
    ).length;

    // Real worked days: days with clockIn and clockOut, excluding holiday/weekends
    const realWorkedDays = monthRows.filter(
      (row) => !row.isHoliday && !row.isWeekend && row.clockIn && row.clockOut
    ).length;

    const present = monthRows.filter((r) => r.status === "present").length;
    const ontime = monthRows.filter((r) => r.status === "On Time").length;
    const absent = monthRows.filter(
      (r) => r.status === "absent" && !r.isHoliday && !r.isWeekend
    ).length;
    const late = monthRows.filter(
      (r) => r.status === "late" && !r.isHoliday && !r.isWeekend
    ).length;

    const totalHours = monthRows.reduce(
      (sum, r) => sum + (r.totalHour || 0),
      0
    );
    const totalOvertime = monthRows.reduce((sum, r) => {
      if (r.isHoliday || r.isWeekend) {
        // On holiday or weekend, count all hours as overtime
        return sum + (r.totalHour || 0);
      } else {
        // On regular workday, count only overtime hours
        return sum + (r.overTime || 0);
      }
    }, 0);

    return {
      total: monthRows.length,
      totalWorkdays,
      realWorkedDays,
      present,
      ontime,
      absent,
      late,
      totalHours,
      totalOvertime,
    };
  };

  const getStatusFromRecord = (record) => {
    if (!record.clockIn) return "absent";

    const clockInTime = new Date(record.clockIn);
    const lateThreshold = new Date(clockInTime);
    lateThreshold.setHours(9, 0, 0, 0);

    if (clockInTime > lateThreshold) return "late";
    return "On Time";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "On Time":
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
      case "On Time":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "absent":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "late":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Format date/time helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr.split("T")[0]; // Fallback to ISO string extraction
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Edit functions
  const handleEdit = (record) => {
    const extractTime = (datetimeStr) => {
      if (!datetimeStr) return "";
      // Expecting format like "2025-08-10T09:00:00"
      const parts = datetimeStr.split("T");
      return parts[1] ? parts[1].substring(0, 5) : "";
    };

    setEditingRecord(record);
    setEditForm({
      clockIn: extractTime(record.clockIn),
      clockOut: extractTime(record.clockOut),
      breakHours: record.breakHours || 1,
    });
  };

  const handleSave = async () => {
    if (!editingRecord) return;

    try {
      const buildDateTime = (dateStr, timeStr) => {
        if (!timeStr) return null;
        return `${dateStr}T${timeStr}:00`;
      };

      const updatedRecord = {
        ...editingRecord,
        clockIn: buildDateTime(editingRecord.attendDate, editForm.clockIn),
        clockOut: buildDateTime(editingRecord.attendDate, editForm.clockOut),
        breakHour: editForm.breakHours,
      };

      await updateAttendanceDetail(editingRecord.id, updatedRecord);

      setAttendanceData((prev) =>
        prev.map((record) =>
          record.id === editingRecord.id ? updatedRecord : record
        )
      );
      setEditingRecord(null);
    } catch (error) {
      console.error("Failed to update attendance record:", error);
    }
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setEditForm({ clockIn: "", clockOut: "", breakHours: 1 });
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await getLeaves(); // from useLeave
        setLeaves(data);
      } catch (error) {
        console.error("Failed to fetch leave data", error);
      }
    };
    fetchLeaves();
  }, [getLeaves]);

  const UpdatePaidLeave = async (employeeId, dateStr) => {
    try {
      // Call backend API to apply leave & increment count
      await applyPaidLeave(employeeId, dateStr);

      // Re-fetch attendance data for updated month
      const refreshedAttendance = await fetchEmployeeAttendance(
        employeeId,
        selectedYear,
        String(selectedMonth + 1).padStart(2, "0")
      );
      setAttendanceData(refreshedAttendance);

      // Re-fetch paid leave data
      const refreshedLeaves = await getLeaves();
      setLeaves(refreshedLeaves);

      // No need to manually increment in the frontend
      alert("Paid leave applied successfully!");
    } catch (error) {
      console.error("Error applying paid leave:", error);
      alert("Failed to apply paid leave.");
    }
  };

  const CancelPaidLeave = async (employeeId, dateStr) => {
    try {
      await cancelPaidLeave(employeeId, dateStr);
      // Refresh attendance after cancel
      const refreshedAttendance = await fetchEmployeeAttendance(
        employeeId,
        selectedYear,
        String(selectedMonth + 1).padStart(2, "0")
      );
      setAttendanceData(refreshedAttendance);

      // Refresh leave data (optional)
      const refreshedLeaves = await getLeaves();
      setLeaves(refreshedLeaves);

      alert("Paid leave canceled successfully!");
    } catch (error) {
      console.error("Error canceling paid leave:", error);
      alert("Failed to cancel paid leave.");
    }
  };

  const currentLeave = leaves.find((l) => l.employeeId === parseInt(id));
  const totalLeaves = currentLeave?.totalLeaveDays || 0;
  const usedLeaves = currentLeave?.usedLeaveDays || 0;
  const remainingLeaves = totalLeaves - usedLeaves;

  // Build rows for every day in the selected month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const monthRows = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const dateObj = new Date(dateStr);

    // Find matching attendance record as before
    const record = attendanceData.find((r) => {
      const recordDate = new Date(r.attendDate);
      return (
        recordDate.getDate() === day &&
        recordDate.getMonth() === selectedMonth &&
        recordDate.getFullYear() === selectedYear
      );
    });

    // --- CHECK JAPANESE HOLIDAY & WEEKEND ---
    const holiday = hd.isHoliday(dateObj);
    const isHoliday = !!holiday;
    const holidayName = isHoliday ? holiday.name : "";
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

    return {
      id: record?.id || null,
      day,
      date: dateStr,
      attendDate: dateStr,
      clockIn: record?.clockIn || null,
      clockOut: record?.clockOut || null,
      breakHours: record?.breakHours || 1,
      totalHour: record?.totalHour || 0,
      overTime: record?.overTime || 0,
      status: record ? getStatusFromRecord(record) : "absent",
      paidleave: record?.paidLeave || false,
      notes: record?.notes || "",
      isHoliday,
      holidayName,
      isWeekend,
    };
  });


  const paidLeavesThisMonth = monthRows.filter(
    (row) => row.paidleave && !row.isHoliday && !row.isWeekend
  ).length;

  const stats = calculateStats();

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

// Add this import


const AttendanceDetail = () => {
  const { updateSalaryData } = useSalaryData();
  
  // Add this useEffect to update salary data when stats change
  useEffect(() => {
    if (stats && employee) {
      updateSalaryData({
        totalWorkdays: stats.totalWorkdays,
        realWorkedDays: stats.realWorkedDays,
        appliedPaidLeaves: paidLeavesThisMonth,
        employeeId: employee.id,
        date: currentMonth,
      });
    }
  }, [stats, paidLeavesThisMonth, employee, selectedMonth, selectedYear, updateSalaryData]);
  
  // ... rest of your component
}

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-lg p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8 border-b pb-4 md:pb-6 border-gray-200">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => navigate("/attendance")}
              className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition duration-150 ease-in-out"
            >
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
            </button>
            <Calendar className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                Attendance Detail
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                {employee.employeename} - {employee.departname}
              </p>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className="bg-blue-50 p-4 md:p-6 rounded-lg mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-1 md:mb-2">
                Employee Information
              </h3>
              <div className="space-y-1">
                <p className="text-sm md:text-base">
                  <span className="font-medium">ID:</span> {employee.id}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Name:</span>{" "}
                  {employee.employeename}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Department:</span>{" "}
                  {employee.departname}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-1 md:mb-2">
                Contact
              </h3>
              <div className="space-y-1">
                <p className="text-sm md:text-base">
                  <span className="font-medium">Email:</span>{" "}
                  {employee.email || "N/A"}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Phone:</span>{" "}
                  {employee.phoneNo || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm md:text-base font-semibold rounded-full px-4 py-1">
                  {getMonthName(currentMonth)}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm md:text-base">
                  <span className="font-medium">Total Work Days:</span>{" "}
                  {stats.totalWorkdays}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Real Worked Days:</span>{" "}
                  {stats.realWorkedDays}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Total Work Hours:</span>{" "}
                  {stats.totalHours.toFixed(1)}h
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Total Overtime:</span>{" "}
                  {stats.totalOvertime.toFixed(1)}h
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-1 md:mb-2">
                Paid Leave Status
              </h3>
              <div className="space-y-1">
                <p className="text-sm md:text-base">
                  <span className="font-medium">Total :</span> {totalLeaves}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Used :</span> {usedLeaves}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">Remaining :</span>{" "}
                  {remainingLeaves}
                </p>
                <p className="text-sm md:text-base">
                  <span className="font-medium">
                    Current month paid leave :
                  </span>{" "}
                  {paidLeavesThisMonth}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4 md:mb-6 bg-blue-50 p-3 md:p-4 rounded-lg">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={goToPreviousMonth}
              className="p-1 md:p-2 hover:bg-blue-100 rounded-lg transition duration-150 ease-in-out"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-blue-900">
              {getMonthName(currentMonth)}
            </h2>

            <button
              onClick={goToNextMonth}
              className="p-1 md:p-2 hover:bg-blue-100 rounded-lg transition duration-150 ease-in-out"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            </button>
          </div>

          <button
            onClick={goToCurrentMonth}
            className="px-3 py-1 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out text-sm md:text-base"
          >
            Current Month
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-blue-600">
                  Total Days
                </p>
                <p className="text-xl md:text-2xl font-bold text-blue-900">
                  {stats.totalWorkdays}
                </p>
              </div>
              <Calendar className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-green-600">
                  Total Worked Days
                </p>
                <p className="text-xl md:text-2xl font-bold text-green-900">
                  {stats.ontime + stats.late}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-green-600">
                  On Time Days
                </p>
                <p className="text-xl md:text-2xl font-bold text-green-900">
                  {stats.ontime}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 p-3 md:p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-red-600">
                  Absent Days
                </p>
                <p className="text-xl md:text-2xl font-bold text-red-900">
                  {stats.absent}
                </p>
              </div>
              <XCircle className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-yellow-50 p-3 md:p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-yellow-600">
                  Late Days
                </p>
                <p className="text-xl md:text-2xl font-bold text-yellow-900">
                  {stats.late}
                </p>
              </div>
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8 md:py-10">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-base md:text-lg text-gray-600 mt-4">
              Loading attendance data...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
              <thead className="bg-blue-600">
                <tr>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Break
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Paid Leave
                  </th>
                  <th className="px-3 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-semibold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {monthRows.map((row) => (
                  <tr
                    key={row.day}
                    className={
                      row.isHoliday
                        ? "bg-red-100"
                        : row.isWeekend
                        ? "bg-red-100"
                        : ""
                    }
                    title={
                      row.isHoliday
                        ? row.holidayName
                        : row.isWeekend
                        ? "週末"
                        : ""
                    }
                  >
                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-gray-700">
                      {formatDate(row.date)}
                      {row.isHoliday && (
                        <span className="ml-2 inline-block text-xs bg-red-500 text-white font-semibold px-2 py-0.5 rounded">
                          {row.holidayName || "祝日"}
                        </span>
                      )}
                      {!row.isHoliday && row.isWeekend && (
                        <span className="ml-2 inline-block text-xs  bg-red-500 text-white font-semibold px-2 py-0.5 rounded">
                          週末
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-gray-700">
                      {formatDate(row.date)}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-gray-700">
                      {editingRecord?.id === row.id ? (
                        <input
                          type="time"
                          value={editForm.clockIn}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              clockIn: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                        />
                      ) : (
                        formatTime(row.clockIn) || "-"
                      )}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-gray-700">
                      {editingRecord?.id === row.id ? (
                        <input
                          type="time"
                          value={editForm.clockOut}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              clockOut: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                        />
                      ) : (
                        formatTime(row.clockOut) || "-"
                      )}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-gray-700">
                      {row.totalHour > 0 ? `${row.totalHour.toFixed(1)}h` : "-"}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-gray-700">
                      {editingRecord?.id === row.id ? (
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={editForm.breakHours}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              breakHours: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-16"
                        />
                      ) : (
                        `${row.breakHours.toFixed(1)}h`
                      )}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-gray-700">
                      {row.overTime > 0 ? `${row.overTime.toFixed(1)}h` : "-"}
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(row.status)}
                        <span className={getStatusBadge(row.status)}>
                          {row.status.charAt(0).toUpperCase() +
                            row.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-gray-700">
                      {editingRecord?.id === row.id ? (
                        // 
                        row.paidleave ? (
                          <button
                            onClick={() =>
                              CancelPaidLeave(employee.id, row.date)
                            }
                            className="px-3 py-1 md:px-4 md:py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                          >
                            Cancel
                          </button>
                        ) : !row.isHoliday && !row.isWeekend && row.status === "absent" ? ( // Only show Apply button on absent workdays and not holiday/weekend
                          <button
                            onClick={() =>
                              UpdatePaidLeave(employee.id, row.date)
                            }
                            className="px-3 py-1 md:px-4 md:py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                          >
                            Apply
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            -
                          </span>
                        )
                      ) : !row.isHoliday &&
                        !row.isWeekend &&
                        row.status === "absent" ? (
                        // Normal mode as before
                        <button
                          onClick={() => UpdatePaidLeave(employee.id, row.date)}
                          disabled={row.paidleave}
                          className={`px-3 py-1 md:px-4 md:py-2 rounded-lg ${
                            row.paidleave
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {row.paidleave ? "Applied" : "Apply"}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm italic">-</span>
                      )}
                    </td>

                    <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap text-sm font-medium">
                      {editingRecord?.id === row.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleSave}
                            className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-50 transition duration-150 ease-in-out"
                            title="Save Changes"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition duration-150 ease-in-out"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : row.id ? (
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition duration-150 ease-in-out"
                          title="Edit Attendance"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">No record</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {attendanceData.length === 0 && !loading && (
              <div className="text-center py-8 md:py-10 text-gray-500">
                <Clock className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-base md:text-lg">
                  No attendance records found for {getMonthName(currentMonth)}
                </p>
                <p className="text-sm md:text-base mt-1">
                  This employee has no attendance data for the selected month
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDetail;
