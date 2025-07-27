package com.yongyang.Emp_Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceLoginDto {
    private long id;
    private String username;
    private String password;
    private String email;
    private long department;
    private long employeeId;


    
}
