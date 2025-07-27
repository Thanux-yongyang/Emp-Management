package com.yongyang.Emp_Project.service;

import com.yongyang.Emp_Project.dto.AttendanceLoginDto;
import com.yongyang.Emp_Project.entity.AttendanceLogin;

public interface AttendanceLoginService {
    AttendanceLogin login(String loginName , String password);
    AttendanceLoginDto createUser(AttendanceLoginDto attendanceLoginDto); 
}
