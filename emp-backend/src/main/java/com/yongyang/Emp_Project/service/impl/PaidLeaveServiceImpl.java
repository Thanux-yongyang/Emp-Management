package com.yongyang.Emp_Project.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.yongyang.Emp_Project.dto.PaidLeave.PaidLeaveDto;
import com.yongyang.Emp_Project.entity.Employee.Employee;
import com.yongyang.Emp_Project.entity.PaidLeave.PaidLeave;
import com.yongyang.Emp_Project.mapper.PaidLeave.PaidLeaveMapper;
import com.yongyang.Emp_Project.repository.EmployeeRepository;
import com.yongyang.Emp_Project.repository.PaidLeave.PaidLeaveRepository;
import com.yongyang.Emp_Project.service.PaidLeaveService;

@Service
public class PaidLeaveServiceImpl implements PaidLeaveService {

    @Autowired
    private PaidLeaveRepository paidLeaveRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public PaidLeaveDto createPaidLeave(PaidLeaveDto paidLeaveDto) {
        Employee employee = employeeRepository.findById(paidLeaveDto.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + paidLeaveDto.getEmployeeId()));
    
        if (paidLeaveRepository.findByEmployee(employee).isPresent()) {
            throw new RuntimeException("PaidLeave already exists for employee ID: " + employee.getId());
        }
    
        PaidLeave paidLeave = PaidLeaveMapper.toEntity(paidLeaveDto, employee);
        PaidLeave savedPaidLeave = paidLeaveRepository.save(paidLeave);
        return PaidLeaveMapper.toDto(savedPaidLeave);
    }
    

    @Override
    public List<PaidLeaveDto> getAllPaidLeaves() {
        List<PaidLeave> paidLeaves = paidLeaveRepository.findAll();

        return paidLeaves.stream()
                .map(PaidLeaveMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PaidLeaveDto updatePaidLeave(Long id, PaidLeaveDto paidLeaveDto) {
        PaidLeave existingPaidLeave = paidLeaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PaidLeave not found with ID: " + id));

        // Optional: You may update employee if needed, but usually it should not change
        // Just updating leave details:
       
        existingPaidLeave.setTotalLeaveDays(paidLeaveDto.getTotalLeaveDays());
        existingPaidLeave.setUsedLeaveDays(paidLeaveDto.getUsedLeaveDays());

        PaidLeave updatedPaidLeave = paidLeaveRepository.save(existingPaidLeave);

        return PaidLeaveMapper.toDto(updatedPaidLeave);
    }

    @Override
    public void deletePaidLeave(Long id) {
        paidLeaveRepository.deleteById(id);
    }
}
