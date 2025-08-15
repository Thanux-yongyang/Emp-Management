package com.yongyang.Emp_Project.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceDetailDto {

    private Long id;
    private LocalDate attendDate;
    private LocalDateTime clockIn;
    private LocalDateTime clockOut;
    private Double totalHour;
    private Double breakHour;
    private Double overTime;
    private boolean isPaidLeave;


}
