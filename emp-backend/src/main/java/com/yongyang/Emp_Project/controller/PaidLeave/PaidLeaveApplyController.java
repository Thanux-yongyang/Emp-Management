package com.yongyang.Emp_Project.controller.PaidLeave;

import com.yongyang.Emp_Project.service.AttendanceLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/paid-leave")
public class PaidLeaveApplyController {

    @Autowired
    private final AttendanceLoginService attendanceLoginService;

  
    public PaidLeaveApplyController(AttendanceLoginService attendanceLoginService) {
        this.attendanceLoginService = attendanceLoginService;
    }

    @PostMapping("/apply")
    public ResponseEntity<String> applyPaidLeave(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        attendanceLoginService.applyPaidLeave(employeeId, date);
        return ResponseEntity.ok("Paid leave applied successfully");
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelPaidLeave(
            @RequestParam Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        attendanceLoginService.cancelPaidLeave(employeeId, date);
        return ResponseEntity.ok("Paid leave canceled successfully");
    }
}


