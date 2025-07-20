package com.yongyang.Emp_Project.service;

import com.yongyang.Emp_Project.dto.DepartmentDto;

import java.util.List;

public interface DepartmentService {
    DepartmentDto createDepartment(DepartmentDto departmentDto);
    List<DepartmentDto> getAllDepartments();
    DepartmentDto updateDepartment(Long id , DepartmentDto departmentDto);
    void deleteDepartment(Long id);


}
