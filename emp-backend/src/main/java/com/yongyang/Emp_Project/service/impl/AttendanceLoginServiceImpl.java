package com.yongyang.Emp_Project.service.impl;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yongyang.Emp_Project.dto.AttendanceLoginDto;
import com.yongyang.Emp_Project.dto.AttendanceLoginResponseDto;
import com.yongyang.Emp_Project.entity.AttendanceLogin;
import com.yongyang.Emp_Project.entity.Department;
import com.yongyang.Emp_Project.entity.Employee;
import com.yongyang.Emp_Project.entity.AttendanceDetail.AttendanceDetail;

import com.yongyang.Emp_Project.mapper.AttendanceLoginMapper;
import com.yongyang.Emp_Project.repository.AttendanceDetailRepository;
import com.yongyang.Emp_Project.repository.AttendanceLoginRepository;
import com.yongyang.Emp_Project.repository.DepartmentRepository;
import com.yongyang.Emp_Project.repository.EmployeeRepository;
import com.yongyang.Emp_Project.service.AttendanceLoginService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class AttendanceLoginServiceImpl implements AttendanceLoginService {
    @Autowired
    private final AttendanceLoginRepository attendanceLoginRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final EmployeeRepository employeeRepository;
    private final AttendanceDetailRepository attendanceDetailRepository;
    private final DepartmentRepository departmentRepository; 

    // Constants for time calculation
    private static final Double BREAK_HOUR = 1.0;
    private static final Double NORMAL_WORK_HOURS = 8.0; // Changed to hours for clarity
    private static final Double OVERTIME_THRESHOLD_MINUTES = 15.0; // Keep in minutes for precision

    @Override
    public AttendanceLoginResponseDto login(String loginName, String password) {
        // System.out.println("Test of Login");

        AttendanceLogin login = attendanceLoginRepository.findByLoginName(loginName)
            .filter(attendanceLogin -> passwordEncoder.matches(password, attendanceLogin.getPassword()))
            .orElseThrow(() -> new RuntimeException("Invalid loginName or password"));

        Employee employee = employeeRepository.findById(login.getEmployee().getId())
            .orElseThrow(() -> new RuntimeException("Employee Not Found"));

        Department department = departmentRepository.findById(login.getEmployee().getDepartment().getId())
            .orElseThrow(() -> new RuntimeException("Department Not Found"));

        // Get today's attendance record if exists
        Optional<AttendanceDetail> existingDetail = getTodaysAttendance(employee);
        AttendanceDetail detail;

        if (existingDetail.isPresent()) {
            detail = existingDetail.get();
        } else {
            detail = saveClockIn(login, employee);
        }

        String departmentName = department.getDepartmentName();

        AttendanceLoginResponseDto responseDto = new AttendanceLoginResponseDto();
        responseDto.setUsername(login.getLoginName());
        responseDto.setDepartname(departmentName);
        responseDto.setEmployeename(employee.getFirstName() + " " + employee.getLastName());
        responseDto.setAttendDate(detail.getAttendDate());
        responseDto.setClockIn(detail.getClockIn());
        responseDto.setClockOut(detail.getClockOut());
        responseDto.setTotalHour(detail.getTotalHour());
        responseDto.setBreakHour(detail.getBreakHour());
        responseDto.setOverTime(detail.getOverTime());

        return responseDto;
    }

    @Override
    public AttendanceLoginDto createUser(AttendanceLoginDto attendanceLoginDto) {
        String hashedPassword = passwordEncoder.encode(attendanceLoginDto.getPassword());
        attendanceLoginDto.setPassword(hashedPassword);
        AttendanceLogin attendanceLogin = AttendanceLoginMapper.toAttendanceLoginEntity(attendanceLoginDto);
    
         // Fetch full employee from DB with department
    Employee employee = employeeRepository.findById(attendanceLoginDto.getEmployeeId())
    .orElseThrow(() -> new RuntimeException("Employee not found"));

attendanceLogin.setEmployee(employee);  // Set full employee entity

AttendanceLogin savedUser = attendanceLoginRepository.save(attendanceLogin);
return AttendanceLoginMapper.toAttendanceLoginDto(savedUser);
    }

    @Override
    @Transactional
    public AttendanceDetail saveClockIn(AttendanceLogin login, Employee employee) {
        // Prevent duplicate clock-in
        if (getTodaysAttendance(employee).isPresent()) {
            throw new RuntimeException("Already clocked in today");
        }

        AttendanceDetail detail = new AttendanceDetail();
        detail.setEmployee(employee);
        Date now = new Date();
        detail.setClockIn(now);
        detail.setAttendDate(truncateToDay(now));
        detail.setClockOut(null);
        detail.setTotalHour(0.0);
        detail.setBreakHour(BREAK_HOUR); // Store break in hours
        detail.setOverTime(0.0);

        // System.out.println("Clock-in saved for employee: " + employee.getFirstName() + " " + employee.getLastName() + 
        //                   " at " + now);

        return attendanceDetailRepository.save(detail);
    }

    @Override
    @Transactional
    public AttendanceDetail saveClockOut(AttendanceLogin login, Employee employee) {
        // Get today's attendance record
        AttendanceDetail detail = getTodaysAttendance(employee)
            .orElseThrow(() -> new RuntimeException("No clock-in found for today"));

        // Prevent duplicate clock-out
        if (detail.getClockOut() != null) {
            throw new RuntimeException("Already clocked out today");
        }

        Date now = new Date();
        detail.setClockOut(now);

        // Calculate total time and overtime
        calculateWorkHours(detail);

        AttendanceDetail saved = attendanceDetailRepository.save(detail);
        // System.out.println("ClockOut saved with ID: " + saved.getId() + 
        //                   ", Total Hours: " + saved.getTotalHour() + 
        //                   ", Overtime: " + saved.getOverTime());
        return saved;
    }

    @Override
    public AttendanceLoginResponseDto clockOut(String loginName, String password) {
        // System.out.println("Test of ClockOut");

        AttendanceLogin login = attendanceLoginRepository.findByLoginName(loginName)
            .filter(attendanceLogin -> passwordEncoder.matches(password, attendanceLogin.getPassword()))
            .orElseThrow(() -> new RuntimeException("Invalid loginName or password"));

        Employee employee = employeeRepository.findById(login.getEmployee().getId())
            .orElseThrow(() -> new RuntimeException("Employee Not Found"));

        Department department = departmentRepository.findById(login.getEmployee().getDepartment().getId())
            .orElseThrow(() -> new RuntimeException("Department Not Found"));

        AttendanceDetail detail = saveClockOut(login, employee);

        AttendanceLoginResponseDto responseDto = new AttendanceLoginResponseDto();
        responseDto.setUsername(login.getLoginName());
        responseDto.setDepartname(department.getDepartmentName());
        responseDto.setEmployeename(employee.getFirstName() + " " + employee.getLastName());
        responseDto.setAttendDate(detail.getAttendDate());
        responseDto.setClockIn(detail.getClockIn());
        responseDto.setClockOut(detail.getClockOut());
        responseDto.setTotalHour(detail.getTotalHour());
        responseDto.setBreakHour(detail.getBreakHour());
        responseDto.setOverTime(detail.getOverTime());

        return responseDto;
    }

    private Optional<AttendanceDetail> getTodaysAttendance(Employee employee) {
        Date today = truncateToDay(new Date());

        return attendanceDetailRepository.findFirstByEmployeeAndAttendDateAndClockInNotNull(
            employee, today);
    }

    private Date truncateToDay(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    /**
     * Fixed calculation method for work hours
     */
    private void calculateWorkHours(AttendanceDetail detail) {
        if (detail.getClockIn() == null || detail.getClockOut() == null) {
            System.out.println("Cannot calculate work hours: missing clock-in or clock-out time");
            return;
        }

        long clockInMillis = detail.getClockIn().getTime();
        long clockOutMillis = detail.getClockOut().getTime();
        
        // System.out.println("Clock-in: " + detail.getClockIn());
        // System.out.println("Clock-out: " + detail.getClockOut());
        // System.out.println("Time difference in millis: " + (clockOutMillis - clockInMillis));

        // Calculate total time worked in hours (including break)
        double totalWorkedHours = (double)(clockOutMillis - clockInMillis) / (1000.0 * 60.0 * 60.0);
        
        // System.out.println("Total worked hours (including break): " + totalWorkedHours);

        // Get break time in hours (should be stored as hours in database)
        Double breakHours = detail.getBreakHour() != null ? detail.getBreakHour() : BREAK_HOUR;
        
        // Calculate net working hours (excluding break)
        double netWorkingHours = totalWorkedHours - breakHours;
        
        // System.out.println("Break hours: " + breakHours);
        // System.out.println("Net working hours: " + netWorkingHours);

        // Calculate overtime
        double overtimeHours = 0.0;
        if (netWorkingHours > NORMAL_WORK_HOURS) {
            double extraHours = netWorkingHours - NORMAL_WORK_HOURS;
            // Convert extra hours to minutes to check against threshold
            double extraMinutes = extraHours * 60;
            
            // Only count as overtime if extra time is more than threshold
            if (extraMinutes > OVERTIME_THRESHOLD_MINUTES) {
                overtimeHours = extraHours;
            }
        }

        // System.out.println("Calculated overtime hours: " + overtimeHours);

        // Round to 2 decimal places for cleaner storage
        double roundedNetHours = Math.round(netWorkingHours * 100.0) / 100.0;
        double roundedOvertimeHours = Math.round(overtimeHours * 100.0) / 100.0;

        // Update the entity
        detail.setTotalHour(roundedNetHours);
        detail.setOverTime(roundedOvertimeHours);
        
        // System.out.println("Final total hours: " + roundedNetHours);
        // System.out.println("Final overtime hours: " + roundedOvertimeHours);
    }

    public List<AttendanceLoginResponseDto>getAllAttendance(){
        List<AttendanceDetail> attendanceList = attendanceDetailRepository.findAll();

        return attendanceList.stream().map(attendance -> {
            AttendanceLoginResponseDto dto = new AttendanceLoginResponseDto();

            dto.setEmployeename(attendance.getEmployee().getFirstName()+" "+attendance.getEmployee().getLastName());
            dto.setDepartname(attendance.getEmployee().getDepartment().getDepartmentName());
            dto.setAttendDate(attendance.getAttendDate());
            dto.setClockIn(attendance.getClockIn());
            dto.setClockOut(attendance.getClockOut());
            dto.setTotalHour(attendance.getTotalHour());
            dto.setBreakHour(attendance.getBreakHour());
            dto.setOverTime(attendance.getOverTime());
            return dto;
        }).collect(Collectors.toList());
    }     
        
}