package com.yongyang.Emp_Project.service;

import java.time.LocalDate;
import java.util.List;

import com.yongyang.Emp_Project.dto.AttendanceDetailDto;
import com.yongyang.Emp_Project.dto.AttendanceLoginDto;
import com.yongyang.Emp_Project.dto.AttendanceLoginResponseDto;
import com.yongyang.Emp_Project.entity.Attendance.AttendanceDetail;
import com.yongyang.Emp_Project.entity.Attendance.AttendanceLogin;
import com.yongyang.Emp_Project.entity.Employee.Employee;

public interface AttendanceLoginService {
    AttendanceLoginResponseDto login(String loginName, String password);
    AttendanceLoginResponseDto clockOut(String loginName, String password);
    AttendanceLoginDto createUser(AttendanceLoginDto attendanceLoginDto); 
    AttendanceDetail saveClockIn(AttendanceLogin attendanceLogin, Employee employee);
    AttendanceDetail saveClockOut(AttendanceLogin attendanceLogin, Employee employee);
    List<AttendanceLoginResponseDto> getAllAttendance();
    
    // Single method for getting employee monthly attendance - returns clean DTOs
    List<AttendanceDetailDto> getEmployeeMonthlyAttendance(Long employeeId, int year, int month);
    AttendanceDetailDto updateAttendanceDetail(Long id, AttendanceDetailDto attendanceDetailDto);
    void applyPaidLeave(Long employeeId, LocalDate date);
    void cancelPaidLeave(Long employeeId, LocalDate date);
}