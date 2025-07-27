package com.yongyang.Emp_Project.mapper;

import com.yongyang.Emp_Project.dto.AttendanceLoginDto;

import com.yongyang.Emp_Project.entity.AttendanceLogin;

public class AttendanceLoginMapper {
    public static AttendanceLoginDto toAttendanceLoginDto(AttendanceLogin attendanceLogin){
        return new AttendanceLoginDto(
            attendanceLogin.getId(),
            attendanceLogin.getLoginName(),
            attendanceLogin.getPassword(),
            attendanceLogin.getEmail(),
            attendanceLogin.getDepartmentId(),
            attendanceLogin.getEmpId() 
        );
    }
    public static AttendanceLogin toAttendanceLoginEntity(AttendanceLoginDto attendanceLoginDto){
        return new AttendanceLogin(
            attendanceLoginDto.getId(),
            attendanceLoginDto.getUsername(),
            attendanceLoginDto.getPassword(),
            attendanceLoginDto.getEmail(),
            attendanceLoginDto.getDepartment(),
            attendanceLoginDto.getEmployeeId()
        );
    }
    
}
