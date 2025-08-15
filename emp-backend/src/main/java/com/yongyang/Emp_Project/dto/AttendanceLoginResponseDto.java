package com.yongyang.Emp_Project.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceLoginResponseDto {
    private String username;
    private String employeename;
    private String departname;
    private LocalDate attendDate;
    private LocalDateTime clockIn;
    private LocalDateTime clockOut;
    private Double totalHour;
    private Double breakHour;
    private Double overTime;
    private boolean paidLeave;
    
}
