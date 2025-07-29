package com.yongyang.Emp_Project.repository;

import com.yongyang.Emp_Project.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    List<Employee> findByFirstNameAndLastName(String firstName, String lastName);

}
