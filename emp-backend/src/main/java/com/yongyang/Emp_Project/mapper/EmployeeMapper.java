package com.yongyang.Emp_Project.mapper;

import com.yongyang.Emp_Project.dto.EmployeeDto;
import com.yongyang.Emp_Project.entity.Department.Department;
import com.yongyang.Emp_Project.entity.Employee.Employee;

public class EmployeeMapper {
    public static EmployeeDto toDTO(Employee employee){
        return new EmployeeDto(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getDateOfBirth(),
                employee.getDateOfEntry(),
                employee.getGender(),
                employee.getPostalCode(),
                employee.getAddress(),
                employee.getSubAddress(),
                employee.getDepartment() != null ? employee.getDepartment().getId() : null,
                employee.getEmail(),
                employee.getPhoneNo()
        );
    }
    public static Employee toEntity(EmployeeDto dto){
        Department department = null;
        if (dto.getDepartment() != null) {
            department = new Department();
            department.setId(dto.getDepartment());
        }
        return new Employee(
                dto.getId(),
                dto.getFirstName(),
                dto.getLastName(),
                dto.getDateOfBirth(),
                dto.getDateOfEntry(),
                dto.getGender(),
                dto.getPostalCode(),
                dto.getAddress(),
                dto.getSubAddress(),
                department,
                dto.getEmail(),
                dto.getPhoneNo()
        );
    }
}
