import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
  X
} from 'lucide-react';

const AttendanceDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: '', checkOut: '' });

  // Get employee info from location state or mock data
  const employee = location.state?.employee || {
    employeeId: id,
    employeeName: 'John Doe',
    department: 'Engineering',
    email: 'john.doe@company.com',
    phoneNo: '+1-555-0123'
  };

  // Mock detailed attendance data for the employee
  const mockAttendanceData = [
    {
      id: 1,
      employeeId: id,
      date: '2024-01-01',
      day: 1,
      checkIn: '09:00 AM',
      checkOut: '05:30 PM',
      status: 'present',
      totalHours: 8.5,
      overtime: 0.5,
      notes: 'Regular day'
    },
    {
      id: 2,
      employeeId: id,
      date: '2024-01-02',
      day: 2,
      checkIn: '08:45 AM',
      checkOut: '06:00 PM',
      status: 'present',
      totalHours: 9.25,
      overtime: 1.25,
      notes: 'Overtime work'
    },
    {
      id: 3,
      employeeId: id,
      date: '2024-01-03',
      day: 3,
      checkIn: '09:30 AM',
      checkOut: '05:00 PM',
      status: 'late',
      totalHours: 7.5,
      overtime: 0,
      notes: 'Late arrival due to traffic'
    },
    {
      id: 4,
      employeeId: id,
      date: '2024-01-04',
      day: 4,
      checkIn: null,
      checkOut: null,
      status: 'absent',
      totalHours: 0,
      overtime: 0,
      notes: 'Sick leave'
    },
    {
      id: 5,
      employeeId: id,
      date: '2024-01-05',
      day: 5,
      checkIn: '08:30 AM',
      checkOut: '05:15 PM',
      status: 'present',
      totalHours: 8.75,
      overtime: 0.75,
      notes: 'Regular day'
    },
    {
      id: 6,
      employeeId: id,
      date: '2024-01-08',
      day: 8,
      checkIn: '09:15 AM',
      checkOut: '06:30 PM',
      status: 'late',
      totalHours: 9.25,
      overtime: 1.25,
      notes: 'Late but worked overtime'
    },
    {
      id: 7,
      employeeId: id,
      date: '2024-01-09',
      day: 9,
      checkIn: '08:00 AM',
      checkOut: '05:00 PM',
      status: 'present',
      totalHours: 9.0,
      overtime: 1.0,
      notes: 'Early start'
    },
    {
      id: 8,
      employeeId: id,
      date: '2024-01-10',
      day: 10,
      checkIn: '09:00 AM',
      checkOut: '05:30 PM',
      status: 'present',
      totalHours: 8.5,
      overtime: 0.5,
      notes: 'Regular day'
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAttendanceData(mockAttendanceData);
      setLoading(false);
    }, 1000);
  }, []);

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
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Filter data based on selected month and year
  const getFilteredDataByMonth = () => {
    return attendanceData.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
    });
  };

  const filteredData = getFilteredDataByMonth();

  const stats = {
    total: filteredData.length,
    present: filteredData.filter(r => r.status === 'present').length,
    absent: filteredData.filter(r => r.status === 'absent').length,
    late: filteredData.filter(r => r.status === 'late').length,
    totalHours: filteredData.reduce((sum, r) => sum + r.totalHours, 0),
    totalOvertime: filteredData.reduce((sum, r) => sum + r.overtime, 0)
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'late':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'present':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'absent':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'late':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Edit functions
  const handleEdit = (record) => {
    setEditingRecord(record);
    setEditForm({
      checkIn: record.checkIn || '',
      checkOut: record.checkOut || ''
    });
  };

  const handleSave = () => {
    // Update the record
    const updatedData = attendanceData.map(record => 
      record.id === editingRecord.id 
        ? { ...record, ...editForm }
        : record
    );
    setAttendanceData(updatedData);
    setEditingRecord(null);
    setEditForm({ checkIn: '', checkOut: '' });
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setEditForm({ checkIn: '', checkOut: '' });
  };

  // Helper: Get number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Build rows for every day in the selected month
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const monthRows = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const record = filteredData.find(r => r.day === day);
    return {
      day,
      date: dateStr,
      ...(record || {})
    };
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b pb-6 border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/attendance')}
              className="p-2 hover:bg-gray-100 rounded-lg transition duration-150 ease-in-out"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <Calendar className="h-10 w-10 text-blue-600" />
            <div>
              <h1 className="text-4xl font-extrabold text-gray-800">Attendance Detail</h1>
              <p className="text-lg text-gray-600">{employee.employeeName} - {employee.department}</p>
            </div>
          </div>
        </div>

        {/* Employee Info */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Employee Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">ID:</span> {employee.employeeId}</p>
                <p><span className="font-medium">Name:</span> {employee.employeeName}</p>
                <p><span className="font-medium">Department:</span> {employee.department}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Contact</h3>
              
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {employee.email}</p>
                <p><span className="font-medium">Phone:</span> {employee.phoneNo}</p>
              </div>
            </div>
            <div>
           
          <span className="inline-block  text-blue-800 text-lg font-semibold rounded-full px-6 py-2">
            {getMonthName(currentMonth)}
          </span>
        
              <div className="space-y-2">
                <p><span className="font-medium">Total Work Days:</span> {stats.total}</p>
                <p><span className="font-medium">Total Work Hours:</span> {stats.totalHours.toFixed(1)}h</p>
                <p><span className="font-medium">Total Overtime:</span> {stats.totalOvertime.toFixed(1)}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-blue-100 rounded-lg transition duration-150 ease-in-out"
            >
              <ChevronLeft className="h-5 w-5 text-blue-600" />
            </button>
            
            <h2 className="text-2xl font-bold text-blue-900">{getMonthName(currentMonth)}</h2>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-blue-100 rounded-lg transition duration-150 ease-in-out"
            >
              <ChevronRight className="h-5 w-5 text-blue-600" />
            </button>
          </div>
          
          <button
            onClick={goToCurrentMonth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Today
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Work Days</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Present Days</p>
                <p className="text-2xl font-bold text-green-900">{stats.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Total Absent Days</p>
                <p className="text-2xl font-bold text-red-900">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Total Late Days</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.late}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Day</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Total Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Overtime</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {monthRows.map((row) => (
                  <tr key={row.day} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.day}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {editingRecord?.day === row.day ? (
                        <input
                          type="time"
                          value={editForm.checkIn}
                          onChange={(e) => setEditForm({...editForm, checkIn: e.target.value})}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      ) : (
                        row.checkIn || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {editingRecord?.day === row.day ? (
                        <input
                          type="time"
                          value={editForm.checkOut}
                          onChange={(e) => setEditForm({...editForm, checkOut: e.target.value})}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      ) : (
                        row.checkOut || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.totalHours > 0 ? `${row.totalHours}h` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.overtime > 0 ? `${row.overtime}h` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {row.status ? getStatusIcon(row.status) : null}
                        {row.status ? (
                          <span className={getStatusBadge(row.status)}>
                            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {row.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingRecord?.day === row.day ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSave}
                            className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-50 transition duration-150 ease-in-out"
                            title="Save Changes"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition duration-150 ease-in-out"
                            title="Cancel"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(row)}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition duration-150 ease-in-out"
                          title="Edit Attendance"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg">No attendance records found for {getMonthName(currentMonth)}</p>
                <p className="text-sm">This employee has no attendance data for the selected month</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDetail;
