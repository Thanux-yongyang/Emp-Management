package com.yongyang.Emp_Project.service.impl;

import java.util.Date;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yongyang.Emp_Project.dto.AttendanceLoginDto;
import com.yongyang.Emp_Project.dto.AttendanceLoginResponseDto;
import com.yongyang.Emp_Project.entity.AttendanceLogin;
import com.yongyang.Emp_Project.entity.Department;
import com.yongyang.Emp_Project.entity.Employee;
import com.yongyang.Emp_Project.entity.AttendanceDetail.AttendanceDetail;

import com.yongyang.Emp_Project.mapper.AttendanceLoginMapper;
import com.yongyang.Emp_Project.repository.AttendanceDetailRepository;
import com.yongyang.Emp_Project.repository.AttendanceLoginRepository;
import com.yongyang.Emp_Project.repository.DepartmentRepository;
import com.yongyang.Emp_Project.repository.EmployeeRepository;
import com.yongyang.Emp_Project.service.AttendanceLoginService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class AttendanceLoginServiceImpl implements AttendanceLoginService {
    private final AttendanceLoginRepository attendanceLoginRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeRepository employeeRepository;
    private final AttendanceDetailRepository attendanceDetailRepository;
    private final DepartmentRepository departmentRepository; 

    @Override
    public AttendanceLoginResponseDto login(String loginName, String password) {
        System.out.println("Test of Login");
       AttendanceLogin login =  attendanceLoginRepository.findByLoginName(loginName)
            .filter(attendanceLogin -> passwordEncoder.matches(password, attendanceLogin.getPassword()))
            .orElseThrow(()->new RuntimeException("Invalid loginName or password"));
           
            Employee employee = employeeRepository.findById(login.getEmpId())
            .orElseThrow(()->new RuntimeException("Employee Not Found"));
            Department department= departmentRepository.findById(login.getDepartmentId())
            .orElseThrow(()->new RuntimeException("Department Not Found"));

            AttendanceDetail detail = saveClockIn(login,employee);

            String departmentName = department.getDepartmentName();


            AttendanceLoginResponseDto responseDto = new AttendanceLoginResponseDto();
            responseDto.setUsername(login.getLoginName());
            responseDto.setDepartname(departmentName);
            responseDto.setEmployeename(employee.getFirstName() + " " + employee.getLastName());
            responseDto.setClockIn(detail.getClockIn());
            responseDto.setClockOut(detail.getClockOut());
            responseDto.setTotalHour(detail.getTotalHour());
            responseDto.setBreakHour(detail.getBreakHour());
            responseDto.setOverTime(detail.getOverTime());

            return responseDto;
    }

    @Override
    public AttendanceLoginDto createUser(AttendanceLoginDto attendanceLoginDto) {
        String hashedPassword = passwordEncoder.encode(attendanceLoginDto.getPassword());
        attendanceLoginDto.setPassword((hashedPassword));
        AttendanceLogin attendanceLogin = AttendanceLoginMapper.toAttendanceLoginEntity(attendanceLoginDto) ;
        AttendanceLogin savedUser = attendanceLoginRepository.save(attendanceLogin);
        return AttendanceLoginMapper.toAttendanceLoginDto(savedUser);
    }

    @Override
    @Transactional
    public AttendanceDetail saveClockIn(AttendanceLogin login, Employee employee) {
        
        // Employee employee = employeeRepository.findById(login.getEmpId())
            // .orElseThrow(() -> new RuntimeException("Employee not found"));
            System.out.println("Test of save");
        AttendanceDetail detail = new AttendanceDetail();
        detail.setEmployee(employee);
    
        Date now = new Date(); // current timestamp
        detail.setClockIn(now);
        detail.setAttendDate(new java.util.Date(now.getTime())); // only date
    
        detail.setClockOut(null);
        detail.setTotalHour(0L);
        detail.setBreakHour(1L);
        detail.setOverTime(0L);
    
        AttendanceDetail saved = attendanceDetailRepository.save(detail);
attendanceDetailRepository.flush();
System.out.println("Saved AttendanceDetail ID: " + saved.getId());
return saved;
    }
    
}
