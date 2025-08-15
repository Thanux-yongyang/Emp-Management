package com.yongyang.Emp_Project.mapper;

import com.yongyang.Emp_Project.dto.AttendanceLoginDto;
import com.yongyang.Emp_Project.entity.Attendance.AttendanceLogin;
import com.yongyang.Emp_Project.entity.Employee.Employee;

public class AttendanceLoginMapper {
    public static AttendanceLoginDto toAttendanceLoginDto(AttendanceLogin attendanceLogin){
        return new AttendanceLoginDto(
            attendanceLogin.getId(),
            attendanceLogin.getLoginName(),
            attendanceLogin.getPassword(),
            attendanceLogin.getEmployee().getEmail(),
            attendanceLogin.getEmployee().getDepartment().getId(),
            attendanceLogin.getEmployee().getId() 
        );
    }
    public static AttendanceLogin toAttendanceLoginEntity(AttendanceLoginDto dto) {
        AttendanceLogin login = new AttendanceLogin();
        login.setId(dto.getId());
        login.setLoginName(dto.getUsername());
        login.setPassword(dto.getPassword());

        // Create minimal Employee object with only ID
        Employee emp = new Employee();
        emp.setId(dto.getEmployeeId());

        login.setEmployee(emp);

        return login;
    }
}
