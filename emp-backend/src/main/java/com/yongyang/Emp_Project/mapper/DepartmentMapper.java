package com.yongyang.Emp_Project.mapper;

import com.yongyang.Emp_Project.dto.DepartmentDto;
import com.yongyang.Emp_Project.entity.Department;

public class DepartmentMapper {
    public static DepartmentDto toDto(Department department) {
        if (department == null) return null;
        return new DepartmentDto(
            department.getId(),
            department.getDepartmentName()
        );
    }

    public static Department toEntity(DepartmentDto dto) {
        if (dto == null) return null;
        Department department = new Department();
        department.setId(dto.getId());
        department.setDepartmentName(dto.getDepartmentName());
        return department;
    }
}
