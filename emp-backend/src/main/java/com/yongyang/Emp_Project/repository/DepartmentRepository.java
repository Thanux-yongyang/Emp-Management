package com.yongyang.Emp_Project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yongyang.Emp_Project.entity.Department.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // Additional query methods if needed
}
