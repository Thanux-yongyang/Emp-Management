package com.yongyang.Emp_Project.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private long id;
    private String firstName;
    private String lastName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateOfEntry;
    private String gender;
    private String postalCode;
    private String address;
    private String subAddress;
    private String department;
    private String email;
    private String phoneNo;
}
