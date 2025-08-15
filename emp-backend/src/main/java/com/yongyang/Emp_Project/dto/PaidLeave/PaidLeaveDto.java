package com.yongyang.Emp_Project.dto.PaidLeave;

import java.util.Date;

import com.yongyang.Emp_Project.entity.Employee.Employee;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaidLeaveDto {
    private Long id;
    private Long employeeId; 

    private int totalLeaveDays;
    private int usedLeaveDays;
    
}
