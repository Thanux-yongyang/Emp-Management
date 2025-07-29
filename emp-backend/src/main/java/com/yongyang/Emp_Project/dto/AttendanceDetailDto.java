package com.yongyang.Emp_Project.dto;

import java.util.Date;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDetailDto {

    private long id;
    private Date attendDate;
    private Date clockIn;
    private Date clockOut;
    private long totalHour;
    private long breakHour;
    private long overTime;
    
    
}
