package com.yongyang.Emp_Project.dto;

import java.util.Date;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceLoginResponseDto {
    private String username;
    private String employeename;
    private String departname;
    private Date attendDate;
    private Date clockIn;
    private Date clockOut;
    private long totalHour;
    private long breakHour;
    private long overTime;
    
}
