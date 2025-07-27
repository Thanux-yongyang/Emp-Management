package com.yongyang.Emp_Project.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yongyang.Emp_Project.dto.AttendanceLoginDto;
import com.yongyang.Emp_Project.entity.AttendanceLogin;
import com.yongyang.Emp_Project.mapper.AttendanceLoginMapper;
import com.yongyang.Emp_Project.repository.AttendanceLoginRepository;
import com.yongyang.Emp_Project.service.AttendanceLoginService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AttendanceLoginServiceImpl implements AttendanceLoginService {
    private final AttendanceLoginRepository attendanceLoginRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AttendanceLogin login(String loginName, String password) {
        return attendanceLoginRepository.findByLoginName(loginName)
            .filter(attendanceLogin -> passwordEncoder.matches(password, attendanceLogin.getPassword()))
            .orElseThrow(()->new RuntimeException("Invalid loginName or password"));
    }

    @Override
    public AttendanceLoginDto createUser(AttendanceLoginDto attendanceLoginDto) {
        String hashedPassword = passwordEncoder.encode(attendanceLoginDto.getPassword());
        attendanceLoginDto.setPassword((hashedPassword));
        AttendanceLogin attendanceLogin = AttendanceLoginMapper.toAttendanceLoginEntity(attendanceLoginDto) ;
        AttendanceLogin savedUser = attendanceLoginRepository.save(attendanceLogin);
        return AttendanceLoginMapper.toAttendanceLoginDto(savedUser);
    }
    
}
