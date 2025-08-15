package com.yongyang.Emp_Project.repository;

import java.time.LocalDate;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.yongyang.Emp_Project.entity.Attendance.AttendanceDetail;
import com.yongyang.Emp_Project.entity.Employee.Employee;

public interface AttendanceDetailRepository extends JpaRepository<AttendanceDetail, Long>{
    Optional<AttendanceDetail> findFirstByEmployeeAndAttendDateAndClockInNotNull(Employee employee, LocalDate attendDate);

    @Query("SELECT a FROM AttendanceDetail a WHERE a.employee = :employee AND a.attendDate BETWEEN :startDate AND :endDate ORDER BY a.attendDate ASC")
    List<AttendanceDetail> findMonthlyAttendance(@Param("employee") Employee employee,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);
    Optional<AttendanceDetail> findByEmployeeAndAttendDate(Employee employee, LocalDate attenDate);
}
