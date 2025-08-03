package com.yongyang.Emp_Project.service;

import java.util.List;

import com.yongyang.Emp_Project.dto.AttendanceLoginDto;
import com.yongyang.Emp_Project.dto.AttendanceLoginResponseDto;
import com.yongyang.Emp_Project.entity.AttendanceLogin;
import com.yongyang.Emp_Project.entity.Employee;
import com.yongyang.Emp_Project.entity.AttendanceDetail.AttendanceDetail;

public interface AttendanceLoginService {
    AttendanceLoginResponseDto login(String loginName , String password);
    AttendanceLoginResponseDto clockOut(String loginName , String password);
    AttendanceLoginDto createUser(AttendanceLoginDto attendanceLoginDto); 
    AttendanceDetail saveClockIn(AttendanceLogin attendanceLogin , Employee employee);
    AttendanceDetail saveClockOut(AttendanceLogin attendanceLogin, Employee employee);
    List<AttendanceLoginResponseDto> getAllAttendance();

}
