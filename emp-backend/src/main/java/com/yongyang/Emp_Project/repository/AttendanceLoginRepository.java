package com.yongyang.Emp_Project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yongyang.Emp_Project.entity.Attendance.AttendanceLogin;

public interface AttendanceLoginRepository extends JpaRepository<AttendanceLogin,Long> {
    Optional<AttendanceLogin> findByLoginName(String loginName);
}
