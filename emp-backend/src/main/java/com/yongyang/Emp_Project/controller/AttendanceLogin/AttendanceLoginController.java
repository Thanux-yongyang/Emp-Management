package com.yongyang.Emp_Project.controller.AttendanceLogin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yongyang.Emp_Project.dto.AttendanceLoginRequestDto;
import com.yongyang.Emp_Project.dto.AttendanceLoginResponseDto;
import com.yongyang.Emp_Project.dto.AttendanceDetailDto;
import com.yongyang.Emp_Project.service.AttendanceLoginService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/attendance")
public class AttendanceLoginController {
    
    @Autowired
    private AttendanceLoginService attendanceLoginService;

    @PostMapping("/clockin")
    public AttendanceLoginResponseDto login(@RequestBody AttendanceLoginRequestDto attendanceLoginRequestDto) {
        return attendanceLoginService.login(attendanceLoginRequestDto.getUsername(), attendanceLoginRequestDto.getPassword());
    }

    @PostMapping("/clockout")
    public AttendanceLoginResponseDto clockOut(@RequestBody AttendanceLoginRequestDto attendanceLoginRequestDto) {
        return attendanceLoginService.clockOut(attendanceLoginRequestDto.getUsername(), attendanceLoginRequestDto.getPassword());
    }

    @GetMapping("/getall")
    public List<AttendanceLoginResponseDto> getAllAttendance() {
        return attendanceLoginService.getAllAttendance();
    }
    
    // Returns DTOs instead of entities - proper layer separation
    @GetMapping("/{employeeId}")
    public ResponseEntity<List<AttendanceDetailDto>> getEmployeeAttendance(
            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month) {
        
        List<AttendanceDetailDto> attendance = attendanceLoginService.getEmployeeMonthlyAttendance(employeeId, year, month);
        return ResponseEntity.ok(attendance);
    }

    @PutMapping("details/{id}")
    public ResponseEntity<AttendanceDetailDto> updateAttendanceDetail(@PathVariable Long id, @RequestBody AttendanceDetailDto attendanceDetailDto){
        AttendanceDetailDto updatedAttendanceDetail = attendanceLoginService.updateAttendanceDetail(id, attendanceDetailDto);
        return new ResponseEntity<>(updatedAttendanceDetail, HttpStatus.OK);
    }
    
}