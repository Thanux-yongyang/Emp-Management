package com.yongyang.Emp_Project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yongyang.Emp_Project.entity.AttendanceDetail.AttendanceDetail;

public interface AttendanceDetailRepository extends JpaRepository<AttendanceDetail, Long>{
    
}
