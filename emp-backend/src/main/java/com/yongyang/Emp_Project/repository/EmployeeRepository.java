package com.yongyang.Emp_Project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.yongyang.Emp_Project.entity.Employee.Employee;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    List<Employee> findByFirstNameAndLastName(String firstName, String lastName);

}
