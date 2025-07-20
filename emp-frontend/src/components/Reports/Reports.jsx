import React from 'react';

// Dummy Data
const dummyEmployees = [
  { id: 1, name: 'John Doe', department: 'Engineering', role: 'Developer', location: 'Tokyo', status: 'Active', joinDate: '2024-06-01', salary: 500000, experience: 3, type: 'Permanent' },
  { id: 2, name: 'Jane Smith', department: 'Marketing', role: 'Manager', location: 'Osaka', status: 'Active', joinDate: '2024-05-15', salary: 600000, experience: 5, type: 'Permanent' },
  { id: 3, name: 'Mike Johnson', department: 'HR', role: 'HR', location: 'Tokyo', status: 'Inactive', joinDate: '2023-12-10', salary: 400000, experience: 2, type: 'Probation' },
  { id: 4, name: 'Sarah Wilson', department: 'Finance', role: 'Accountant', location: 'Nagoya', status: 'Active', joinDate: '2024-06-05', salary: 550000, experience: 4, type: 'Permanent' },
  { id: 5, name: 'Emily Brown', department: 'Engineering', role: 'Developer', location: 'Tokyo', status: 'Active', joinDate: '2024-06-03', salary: 520000, experience: 1, type: 'Probation' },
];

const dummyAttendance = {
  present: 4,
  absent: 1,
  late: 1,
  leaves: 2,
  remainingLeaves: 8,
  monthlySummary: [22, 20, 21, 23, 19, 20, 21], // days present per month
};

const dummySalaries = dummyEmployees.map(e => e.salary);
const totalPayroll = dummySalaries.reduce((a, b) => a + b, 0);
const highestSalary = Math.max(...dummySalaries);
const lowestSalary = Math.min(...dummySalaries);
const highestEarner = dummyEmployees.find(e => e.salary === highestSalary);
const lowestEarner = dummyEmployees.find(e => e.salary === lowestSalary);

const departments = Array.from(new Set(dummyEmployees.map(e => e.department)));
const departmentSummary = departments.map(dep => {
  const emps = dummyEmployees.filter(e => e.department === dep);
  return {
    department: dep,
    total: emps.length,
    avgSalary: Math.round(emps.reduce((a, b) => a + b.salary, 0) / emps.length),
    avgExp: (emps.reduce((a, b) => a + b.experience, 0) / emps.length).toFixed(1),
  };
});

const roles = Array.from(new Set(dummyEmployees.map(e => e.role)));
const locations = Array.from(new Set(dummyEmployees.map(e => e.location)));
const joinersThisMonth = dummyEmployees.filter(e => e.joinDate.startsWith('2024-06'));
const activeCount = dummyEmployees.filter(e => e.status === 'Active').length;
const inactiveCount = dummyEmployees.filter(e => e.status === 'Inactive').length;
const probationCount = dummyEmployees.filter(e => e.type === 'Probation').length;
const permanentCount = dummyEmployees.filter(e => e.type === 'Permanent').length;

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">Reports & Analytics</h1>
        {/* 1. Employee Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-800 mb-2">{dummyEmployees.length}</div>
            <div className="text-sm font-semibold text-blue-700">Total Employees</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-800 mb-2">{departments.length}</div>
            <div className="text-sm font-semibold text-green-700">Departments</div>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-800 mb-2">{roles.length}</div>
            <div className="text-sm font-semibold text-purple-700">Designations</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-800 mb-2">{locations.length}</div>
            <div className="text-sm font-semibold text-yellow-700">Locations</div>
          </div>
        </div>
        {/* Employees by Department */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Employees by Department</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Count</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentSummary.map(row => (
                <tr key={row.department}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-bold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Employees by Role */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Employees by Designation</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roles.map(role => (
              <li key={role} className="bg-purple-100 rounded-lg p-4 text-center font-semibold text-purple-800">
                {role}: {dummyEmployees.filter(e => e.role === role).length}
              </li>
            ))}
          </ul>
        </div>
        {/* Employees by Location */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Employees by Location</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {locations.map(loc => (
              <li key={loc} className="bg-yellow-100 rounded-lg p-4 text-center font-semibold text-yellow-800">
                {loc}: {dummyEmployees.filter(e => e.location === loc).length}
              </li>
            ))}
          </ul>
        </div>
        {/* New Joiners This Month */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">New Joiners This Month</h2>
          <ul className="list-disc pl-8">
            {joinersThisMonth.length === 0 ? <li>No new joiners this month.</li> : joinersThisMonth.map(e => (
              <li key={e.id}>{e.name} ({e.department})</li>
            ))}
          </ul>
        </div>
        {/* 2. Attendance Report */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-800 mb-2">{dummyAttendance.present}</div>
            <div className="text-sm font-semibold text-green-700">Present Today</div>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-800 mb-2">{dummyAttendance.absent}</div>
            <div className="text-sm font-semibold text-red-700">Absent Today</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-800 mb-2">{dummyAttendance.late}</div>
            <div className="text-sm font-semibold text-yellow-700">Late Today</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-800 mb-2">{dummyAttendance.leaves}</div>
            <div className="text-sm font-semibold text-blue-700">Leaves Taken</div>
          </div>
        </div>
        {/* Monthly Attendance Summary (Bar Chart) */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Monthly Attendance Summary</h2>
          <div className="flex items-end gap-4 h-40">
            {dummyAttendance.monthlySummary.map((days, i) => (
              <div key={i} className="flex flex-col items-center w-12">
                <div className="bg-blue-400 rounded-t" style={{ height: `${days * 6}px`, width: '100%' }} title={`Present: ${days} days`}></div>
                <div className="text-xs mt-2 text-gray-700 font-semibold">M{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
        {/* 3. Salary Report */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-800 mb-2">¥{totalPayroll.toLocaleString()}</div>
            <div className="text-sm font-semibold text-blue-700">Total Payroll</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-800 mb-2">¥{highestSalary.toLocaleString()}</div>
            <div className="text-sm font-semibold text-green-700">Highest Salary<br/>{highestEarner?.name}</div>
          </div>
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-800 mb-2">¥{lowestSalary.toLocaleString()}</div>
            <div className="text-sm font-semibold text-red-700">Lowest Salary<br/>{lowestEarner?.name}</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-800 mb-2">Paid</div>
            <div className="text-sm font-semibold text-yellow-700">Salary Status (Dummy)</div>
          </div>
        </div>
        {/* Salary by Department */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Salary by Department</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Avg Salary</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentSummary.map(row => (
                <tr key={row.department}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-bold">¥{row.avgSalary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 4. Department-wise Summary */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Department-wise Summary</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Total Employees</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Avg Salary</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Avg Experience</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentSummary.map(row => (
                <tr key={row.department}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-bold">{row.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-bold">¥{row.avgSalary.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700 font-bold">{row.avgExp} yrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 5. Employee Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-800 mb-2">{activeCount}</div>
            <div className="text-sm font-semibold text-blue-700">Active Employees</div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 text-center">
            <div className="text-2xl font-bold text-gray-700 mb-2">{inactiveCount}</div>
            <div className="text-sm font-semibold text-gray-600">Inactive Employees</div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-800 mb-2">{permanentCount}</div>
            <div className="text-sm font-semibold text-green-700">Permanent</div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-800 mb-2">{probationCount}</div>
            <div className="text-sm font-semibold text-yellow-700">Probation</div>
          </div>
        </div>
        {/* 6. Export Options */}
        <div className="flex gap-4 justify-end mt-8">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow">Export Employee List (Excel)</button>
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow">Export Salary Report (Excel)</button>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow">Export Attendance (Excel)</button>
        </div>
      </div>
    </div>
  );
};

export default Reports;