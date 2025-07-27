package com.yongyang.Emp_Project.controller.AttendanceLogin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.yongyang.Emp_Project.dto.AttendanceLoginDto;
import com.yongyang.Emp_Project.service.AttendanceLoginService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/attendance/create-logins")
public class AttendanceUserController {
    private AttendanceLoginService attendanceLoginService;
    public AttendanceUserController(AttendanceLoginService attendanceLoginService){
        this.attendanceLoginService = attendanceLoginService;

    }

    @PostMapping
    public ResponseEntity<AttendanceLoginDto> createUser(@RequestBody AttendanceLoginDto attendanceLoginDto){
        AttendanceLoginDto savedUser = attendanceLoginService.createUser(attendanceLoginDto);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
}
