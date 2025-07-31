package com.yongyang.Emp_Project.repository;

import java.util.Date;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yongyang.Emp_Project.entity.Employee;
import com.yongyang.Emp_Project.entity.AttendanceDetail.AttendanceDetail;

public interface AttendanceDetailRepository extends JpaRepository<AttendanceDetail, Long>{
    Optional<AttendanceDetail> findFirstByEmployeeAndAttendDateAndClockInNotNull(Employee employee, Date attendDate);
}
