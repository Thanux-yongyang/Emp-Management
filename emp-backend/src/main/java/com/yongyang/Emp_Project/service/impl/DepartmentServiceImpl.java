package com.yongyang.Emp_Project.service.impl;

import com.yongyang.Emp_Project.dto.DepartmentDto;
import com.yongyang.Emp_Project.entity.Department;
import com.yongyang.Emp_Project.mapper.DepartmentMapper;
import com.yongyang.Emp_Project.repository.DepartmentRepository;
import com.yongyang.Emp_Project.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = DepartmentMapper.toEntity(departmentDto);
        Department saved = departmentRepository.save(department);
        return DepartmentMapper.toDto(saved);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(DepartmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto updateDepartment(Long id, DepartmentDto departmentDto) {
        Optional<Department> optionalDepartment = departmentRepository.findById(id);
        if (optionalDepartment.isPresent()) {
            Department department = optionalDepartment.get();
            department.setDepartmentName(departmentDto.getDepartmentName());
            Department updated = departmentRepository.save(department);
            return DepartmentMapper.toDto(updated);
        }
        return null; // Or throw an exception
    }

    @Override
    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}
