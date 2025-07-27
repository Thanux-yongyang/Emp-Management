package com.yongyang.Emp_Project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yongyang.Emp_Project.entity.EmpSalary;
import java.util.Optional;
import java.util.List;

@Repository
public interface EmpSalaryRepository extends JpaRepository<EmpSalary, Long> {
    Optional<EmpSalary> findByEmployee_Id(Long employeeId);
    List<EmpSalary> findAllByEmployee_Id(Long employeeId);
    boolean existsByEmployee_IdAndEffectiveDate(Long employeeId, java.util.Date effectiveDate);
}
