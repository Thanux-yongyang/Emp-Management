package com.yongyang.Emp_Project.repository.PaidLeave;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yongyang.Emp_Project.entity.Employee.Employee;
import com.yongyang.Emp_Project.entity.PaidLeave.PaidLeave;

public interface PaidLeaveRepository extends JpaRepository<PaidLeave, Long> {
    Optional<PaidLeave> findByEmployee(Employee employee);

    
}
