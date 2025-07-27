package com.yongyang.Emp_Project.controller.AttendanceLogin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yongyang.Emp_Project.dto.AttendanceLoginRequestDto;
import com.yongyang.Emp_Project.entity.AttendanceLogin;
import com.yongyang.Emp_Project.service.AttendanceLoginService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/attendance/login")
@CrossOrigin(origins = "*")
public class AttendanceLoginController {
    @Autowired
    private AttendanceLoginService attendanceLoginService;

    @PostMapping
   public AttendanceLogin login(@RequestBody AttendanceLoginRequestDto attendanceLoginRequestDto) {
    return attendanceLoginService.login(attendanceLoginRequestDto.getUsername(),attendanceLoginRequestDto.getPassword());
   }
    
}
