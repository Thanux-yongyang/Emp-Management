package com.yongyang.Emp_Project.repository;

import com.yongyang.Emp_Project.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // Additional query methods if needed
}
