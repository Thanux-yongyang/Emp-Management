package com.yongyang.Emp_Project.controller.AttendanceLogin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.yongyang.Emp_Project.dto.AttendanceLoginRequestDto;
import com.yongyang.Emp_Project.dto.AttendanceLoginResponseDto;
import com.yongyang.Emp_Project.service.AttendanceLoginService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/attendance")

public class AttendanceLoginController {
    @Autowired
    private AttendanceLoginService attendanceLoginService;



    @PostMapping("/clockin")
   public AttendanceLoginResponseDto login(@RequestBody AttendanceLoginRequestDto attendanceLoginRequestDto) {
    return attendanceLoginService.login(attendanceLoginRequestDto.getUsername(),attendanceLoginRequestDto.getPassword());
   }

   @PostMapping("/clockout")
    public AttendanceLoginResponseDto clockOut(@RequestBody AttendanceLoginRequestDto attendanceLoginRequestDto) {
        return attendanceLoginService.clockOut(attendanceLoginRequestDto.getUsername(), attendanceLoginRequestDto.getPassword());
    }
   
    
}
