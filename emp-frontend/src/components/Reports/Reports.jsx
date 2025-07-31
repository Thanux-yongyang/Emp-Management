import React from 'react'; 
import { useDepartments } from '../../context/DepartmentContext';
import { useEmployees } from '../../context/EmployeeContext';
import { useEmpSalaries } from '../../context/EmpSalaryContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend 
} from 'recharts';

const Reports = () => {
  const { employees, loading: empLoading, error: empError } = useEmployees();
  const { departments, loading: deptLoading, error: deptError } = useDepartments();
  const { salaries, loading: salLoading } = useEmpSalaries();

  if (empLoading || deptLoading || salLoading) return <div>Loading...</div>;
  if (empError || deptError) return <div>Error loading data</div>;

  // Create a map of department ID to department name for easy lookup
  const departmentMap = departments.reduce((acc, dept) => {
    acc[dept.id] = dept.departmentName;
    return acc;
  }, {});

  // Create a map of employee ID to salary data
  const salaryMap = salaries.reduce((acc, sal) => {
    acc[sal.empid] = sal;
    return acc;
  }, {});

  // Enhanced employees with department names and salary data
  const enhancedEmployees = employees.map(emp => ({
    ...emp,
    departmentName: departmentMap[emp.department] || 'Unknown',
    salaryData: salaryMap[emp.id] || null,
    fullName: `${emp.firstName} ${emp.lastName}`,
    netSalary: salaryMap[emp.id]?.netSalary || 0
  }));

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const joinersThisMonth = enhancedEmployees.filter(e => {
    if (!e.dateOfEntry) return false;
    const entryDate = new Date(e.dateOfEntry);
    return entryDate.toISOString().slice(0, 7) === currentMonth;
  });

  // Calculate salary statistics
  const allNetSalaries = enhancedEmployees.map(e => e.netSalary).filter(s => s > 0);
  const totalPayroll = allNetSalaries.reduce((a, b) => a + b, 0);
  const highestSalary = Math.max(...allNetSalaries, 0);
  const lowestSalary = allNetSalaries.length > 0 ? Math.min(...allNetSalaries) : 0;
  const highestEarner = enhancedEmployees.find(e => e.netSalary === highestSalary);
  const lowestEarner = enhancedEmployees.find(e => e.netSalary === lowestSalary);

  // Department summary with salary calculations
  const departmentSummary = departments.map(dept => {
    const deptEmployees = enhancedEmployees.filter(emp => emp.department === dept.id);
    const deptSalaries = deptEmployees.map(e => e.netSalary).filter(s => s > 0);
    const avgSalary = deptSalaries.length > 0 ? deptSalaries.reduce((a, b) => a + b, 0) / deptSalaries.length : 0;
    
    // Calculate average experience (assuming current date - dateOfEntry)
    const currentDate = new Date();
    const avgExp = deptEmployees.length > 0 ? 
      deptEmployees.reduce((sum, emp) => {
        if (!emp.dateOfEntry) return sum;
        const entryDate = new Date(emp.dateOfEntry);
        const years = (currentDate - entryDate) / (1000 * 60 * 60 * 24 * 365.25);
        return sum + Math.max(0, years);
      }, 0) / deptEmployees.length : 0;

    return {
      department: dept.departmentName,
      id: dept.id,
      totalEmployees: deptEmployees.length,
      avgSalary: Math.round(avgSalary),
      avgExp: Math.round(avgExp * 10) / 10
    };
  });

  // Get unique genders for summary
  const genderCounts = enhancedEmployees.reduce((acc, emp) => {
    const gender = emp.gender || 'Unknown';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  // Prepare chart data
  const departmentChartData = departmentSummary.map(dept => ({
    name: dept.department.length > 10 ? dept.department.substring(0, 10) + '...' : dept.department,
    fullName: dept.department,
    employees: dept.totalEmployees,
    avgSalary: dept.avgSalary / 1000, // Convert to thousands for better display
    avgExp: dept.avgExp
  }));

  const genderChartData = Object.entries(genderCounts).map(([gender, count]) => ({
    name: gender,
    value: count
  }));

  // Salary range distribution
  const salaryRanges = [
    { range: '0-300K', min: 0, max: 300000 },
    { range: '300K-500K', min: 300000, max: 500000 },
    { range: '500K-700K', min: 500000, max: 700000 },
    { range: '700K-1M', min: 700000, max: 1000000 },
    { range: '1M+', min: 1000000, max: Infinity }
  ];

  const salaryDistribution = salaryRanges.map(range => ({
    range: range.range,
    count: allNetSalaries.filter(salary => salary >= range.min && salary < range.max).length
  }));

  // Monthly joining trend (last 12 months)
  const monthlyJoinData = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStr = date.toISOString().slice(0, 7);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    const joinersCount = enhancedEmployees.filter(emp => {
      if (!emp.dateOfEntry) return false;
      return new Date(emp.dateOfEntry).toISOString().slice(0, 7) === monthStr;
    }).length;

    monthlyJoinData.push({
      month: monthName,
      joiners: joinersCount
    });
  }

  // Salary components data for stacked chart
  const salaryComponents = salaries.length > 0 ? {
    baseSalary: Math.round(salaries.reduce((sum, s) => sum + (s.baseSalary || 0), 0) / salaries.length),
    totalAllowance: Math.round(salaries.reduce((sum, s) => sum + (s.totalAllowance || 0), 0) / salaries.length),
    totalDeduction: Math.round(salaries.reduce((sum, s) => sum + (s.totalDeduction || 0), 0) / salaries.length)
  } : { baseSalary: 0, totalAllowance: 0, totalDeduction: 0 };

  const salaryComponentsData = [
    { name: 'Base Salary', value: salaryComponents.baseSalary, color: '#3B82F6' },
    { name: 'Total Allowances', value: salaryComponents.totalAllowance, color: '#10B981' },
    { name: 'Total Deductions', value: salaryComponents.totalDeduction, color: '#EF4444' }
  ];

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-blue-800 mb-8">Reports & Analytics Dashboard</h1>

        {/* Employee Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <InfoCard title="Total Employees" value={enhancedEmployees.length} color="blue" />
          <InfoCard title="Departments" value={departments.length} color="green" />
          <InfoCard title="With Salary Data" value={Object.keys(salaryMap).length} color="purple" />
          <InfoCard title="New Joiners (Month)" value={joinersThisMonth.length} color="orange" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Department Employee Distribution */}
          <ChartSection title="Employee Distribution by Department">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, name]} />
                <Bar dataKey="employees" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* Gender Distribution */}
          <ChartSection title="Gender Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Salary Distribution */}
          <ChartSection title="Salary Range Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salaryDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* Monthly Joining Trend */}
          <ChartSection title="Monthly Joining Trend (Last 12 Months)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyJoinData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="joiners" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Department Average Salary */}
          <ChartSection title="Average Salary by Department (in Thousands ¥)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`¥${(value * 1000).toLocaleString()}`, 'Avg Salary']}
                  labelFormatter={(label) => departmentChartData.find(d => d.name === label)?.fullName || label}
                />
                <Bar dataKey="avgSalary" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </ChartSection>

          {/* Salary Components Breakdown */}
          <ChartSection title="Average Salary Components">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salaryComponentsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ¥${value.toLocaleString()}`}
                >
                  {salaryComponentsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`¥${value.toLocaleString()}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </ChartSection>
        </div>

        {/* New Joiners This Month */}
        <Section title="New Joiners This Month">
          {joinersThisMonth.length === 0 ? (
            <p className="text-gray-600">No new joiners this month.</p>
          ) : (
            <ul className="list-disc pl-8 space-y-2">
              {joinersThisMonth.map(emp => (
                <li key={emp.id} className="text-gray-800">
                  <span className="font-semibold">{emp.fullName}</span> - {emp.departmentName}
                  <span className="text-sm text-gray-600 ml-2">
                    (Joined: {new Date(emp.dateOfEntry).toLocaleDateString()})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        {/* Salary Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <InfoCard title="Total Payroll" value={`¥${totalPayroll.toLocaleString()}`} color="blue" />
          <InfoCard 
            title={`Highest Salary${highestEarner ? `\n${highestEarner.fullName}` : ''}`} 
            value={`¥${highestSalary.toLocaleString()}`} 
            color="green" 
          />
          <InfoCard 
            title={`Lowest Salary${lowestEarner ? `\n${lowestEarner.fullName}` : ''}`} 
            value={`¥${lowestSalary.toLocaleString()}`} 
            color="red" 
          />
          <InfoCard title="Avg Salary" value={`¥${Math.round(totalPayroll / allNetSalaries.length || 0).toLocaleString()}`} color="yellow" />
        </div>

        {/* Department-wise Summary Table */}
        <Section title="Department-wise Summary">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-600">
                <tr>
                  <TableHeader>Department</TableHeader>
                  <TableHeader>Total Employees</TableHeader>
                  <TableHeader>Avg Net Salary</TableHeader>
                  <TableHeader>Avg Experience</TableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentSummary.map(dept => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <TableCell>{dept.department}</TableCell>
                    <TableCell>{dept.totalEmployees}</TableCell>
                    <TableCell>¥{dept.avgSalary.toLocaleString()}</TableCell>
                    <TableCell>{dept.avgExp} yrs</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Salary Components Analysis */}
        <Section title="Detailed Salary Analysis">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">Average Allowances</h3>
              <div className="space-y-2">
                <p className="text-sm text-blue-700">
                  Housing: ¥{Math.round(salaries.reduce((sum, s) => sum + (s.housingAllowance || 0), 0) / salaries.length || 0).toLocaleString()}
                </p>
                <p className="text-sm text-blue-700">
                  Transport: ¥{Math.round(salaries.reduce((sum, s) => sum + (s.transportAllowance || 0), 0) / salaries.length || 0).toLocaleString()}
                </p>
                <p className="text-sm text-blue-700">
                  Meal: ¥{Math.round(salaries.reduce((sum, s) => sum + (s.mealAllowance || 0), 0) / salaries.length || 0).toLocaleString()}
                </p>
                <p className="text-sm text-blue-700">
                  Communication: ¥{Math.round(salaries.reduce((sum, s) => sum + (s.communicationAllowance || 0), 0) / salaries.length || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-3">Average Deductions</h3>
              <div className="space-y-2">
                <p className="text-sm text-green-700">
                  Income Tax: ¥{Math.round(salaries.reduce((sum, s) => sum + (s.incomeTax || 0), 0) / salaries.length || 0).toLocaleString()}
                </p>
                <p className="text-sm text-green-700">
                  Health Insurance: ¥{Math.round(salaries.reduce((sum, s) => sum + (s.healthInsurance || 0), 0) / salaries.length || 0).toLocaleString()}
                </p>
                <p className="text-sm text-green-700">
                  Pension: ¥{Math.round(salaries.reduce((sum, s) => sum + (s.pensionInsurance || 0), 0) / salaries.length || 0).toLocaleString()}
                </p>
                <p className="text-sm text-green-700">
                  Long-term Care: ¥{Math.round(salaries.reduce((sum, s) => sum + (s.longtermCare || 0), 0) / salaries.length || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-3">Payment Methods</h3>
              <div className="space-y-2">
                {Object.entries(salaries.reduce((acc, s) => {
                  const method = s.paymentMethod || 'Unknown';
                  acc[method] = (acc[method] || 0) + 1;
                  return acc;
                }, {})).map(([method, count]) => (
                  <p key={method} className="text-sm text-purple-700">
                    {method}: {count} employees
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Export Options */}
        <div className="flex gap-4 justify-end mt-8">
          <ExportButton label="Export Employee List" color="blue" />
          <ExportButton label="Export Salary Report" color="green" />
          <ExportButton label="Export Department Summary" color="purple" />
          <ExportButton label="Export Charts" color="orange" />
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const InfoCard = ({ title, value, color }) => (
  <div className={`bg-${color}-50 p-6 rounded-lg border border-${color}-200 text-center shadow-sm hover:shadow-md transition-shadow`}>
    <div className={`text-2xl font-bold text-${color}-800 mb-2`}>{value}</div>
    <div className={`text-sm font-semibold text-${color}-700 whitespace-pre-line`}>{title}</div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">{title}</h2>
    {children}
  </div>
);

const ChartSection = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">{children}</th>
);

const TableCell = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>
);

const ExportButton = ({ label, color }) => (
  <button className={`px-6 py-2 bg-${color}-600 text-white rounded-lg hover:bg-${color}-700 font-semibold shadow transition-colors`}>
    {label} (Excel)
  </button>
);

export default Reports;