package com.yongyang.Emp_Project.service.impl;

import com.yongyang.Emp_Project.dto.EmpSalaryDto;
import com.yongyang.Emp_Project.entity.EmpSalary;
import com.yongyang.Emp_Project.entity.Employee;
import com.yongyang.Emp_Project.mapper.EmpSalaryMapper;
import com.yongyang.Emp_Project.repository.EmpSalaryRepository;
import com.yongyang.Emp_Project.repository.EmployeeRepository;
import com.yongyang.Emp_Project.service.EmpSalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class EmpSalaryServiceImpl implements EmpSalaryService {
    @Autowired
    private EmpSalaryRepository empSalaryRepository;
    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public EmpSalaryDto createEmpSalary(EmpSalaryDto empSalaryDto) {
        // Only allow for next month
        LocalDate effectiveDate = empSalaryDto.getEffectiveDate()
            .toInstant()
            .atZone(ZoneId.systemDefault())
            .toLocalDate();
        LocalDate firstOfNextMonth = LocalDate.now().withDayOfMonth(1).plusMonths(1);
        if (effectiveDate.getYear() != firstOfNextMonth.getYear() ||
            effectiveDate.getMonth() != firstOfNextMonth.getMonth()) {
            throw new RuntimeException("Can only create or update salary for next month.");
        }
        EmpSalary empSalary = EmpSalaryMapper.toEntity(empSalaryDto);
        if (empSalaryDto.getEmpid() != null) {
            Employee employee = employeeRepository.findById(empSalaryDto.getEmpid())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + empSalaryDto.getEmpid()));
            empSalary.setEmployee(employee);
        } else {
            throw new RuntimeException("Employee ID must be provided");
        }
        EmpSalary saved = empSalaryRepository.save(empSalary);
        return EmpSalaryMapper.toDto(saved);
    }

    @Override
    public List<EmpSalaryDto> getAllEmpSalaries() {
        return empSalaryRepository.findAll().stream()
                .map(EmpSalaryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public EmpSalaryDto updateEmpSalary(Long id, EmpSalaryDto empSalaryDto) {
        // Only allow for next month
        LocalDate effectiveDate = empSalaryDto.getEffectiveDate()
            .toInstant()
            .atZone(ZoneId.systemDefault())
            .toLocalDate();
        LocalDate firstOfNextMonth = LocalDate.now().withDayOfMonth(1).plusMonths(1);
        if (effectiveDate.getYear() != firstOfNextMonth.getYear() ||
            effectiveDate.getMonth() != firstOfNextMonth.getMonth()) {
            throw new RuntimeException("Can only create or update salary for next month.");
        }
        Optional<EmpSalary> optionalEmpSalary = empSalaryRepository.findById(id);
        if (optionalEmpSalary.isPresent()) {
            EmpSalary empSalary = optionalEmpSalary.get();
            // Update all fields
            if (empSalaryDto.getEmpid() != null) {
                Employee employee = employeeRepository.findById(empSalaryDto.getEmpid())
                    .orElseThrow(() -> new RuntimeException("Employee not found with id: " + empSalaryDto.getEmpid()));
                empSalary.setEmployee(employee);
            }
            empSalary.setBaseSalary(empSalaryDto.getBaseSalary());
            empSalary.setSalaryType(empSalaryDto.getSalaryType());
            empSalary.setEffectiveDate(empSalaryDto.getEffectiveDate());
            empSalary.setHousingAllowance(empSalaryDto.getHousingAllowance());
            empSalary.setTransportAllowance(empSalaryDto.getTransportAllowance());
            empSalary.setMealAllowance(empSalaryDto.getMealAllowance());
            empSalary.setCommunicationAllowance(empSalaryDto.getCommunicationAllowance());
            empSalary.setOvertimeAllowance(empSalaryDto.getOvertimeAllowance());
            empSalary.setBonusAllowance(empSalaryDto.getBonusAllowance());
            empSalary.setTotalAllowance(empSalaryDto.getTotalAllowance());
            empSalary.setIncomeTax(empSalaryDto.getIncomeTax());
            empSalary.setHealthInsurance(empSalaryDto.getHealthInsurance());
            empSalary.setEmploymentInsurance(empSalaryDto.getEmploymentInsurance());
            empSalary.setPensionInsurance(empSalaryDto.getPensionInsurance());
            empSalary.setLongtermCare(empSalaryDto.getLongtermCare());
            empSalary.setOther(empSalaryDto.getOther());
            empSalary.setTotalDeduction(empSalaryDto.getTotalDeduction());
            empSalary.setNetSalary(empSalaryDto.getNetSalary());
            empSalary.setPaymentMethod(empSalaryDto.getPaymentMethod());
            empSalary.setBankName(empSalaryDto.getBankName());
            empSalary.setBranchName(empSalaryDto.getBranchName());
            empSalary.setAccountType(empSalaryDto.getAccountType());
            empSalary.setAccountNumber(empSalaryDto.getAccountNumber());
            EmpSalary updated = empSalaryRepository.save(empSalary);
            return EmpSalaryMapper.toDto(updated);
        }
        return null; // Or throw an exception
    }

    @Override
    public void deleteEmpSalary(Long id) {
        empSalaryRepository.deleteById(id);
    }

    @Override
    public EmpSalaryDto updateEmpSalaryByEmployeeId(Long employeeId, EmpSalaryDto empSalaryDto) {
        Optional<EmpSalary> optionalEmpSalary = empSalaryRepository.findByEmployee_Id(employeeId);
        if (optionalEmpSalary.isPresent()) {
            EmpSalary empSalary = optionalEmpSalary.get();

            empSalary.setBaseSalary(empSalaryDto.getBaseSalary());
            empSalary.setSalaryType(empSalaryDto.getSalaryType());
            empSalary.setEffectiveDate(empSalaryDto.getEffectiveDate());
            empSalary.setHousingAllowance(empSalaryDto.getHousingAllowance());
            empSalary.setTransportAllowance(empSalaryDto.getTransportAllowance());
            empSalary.setMealAllowance(empSalaryDto.getMealAllowance());
            empSalary.setCommunicationAllowance(empSalaryDto.getCommunicationAllowance());
            empSalary.setOvertimeAllowance(empSalaryDto.getOvertimeAllowance());
            empSalary.setBonusAllowance(empSalaryDto.getBonusAllowance());
            empSalary.setTotalAllowance(empSalaryDto.getTotalAllowance());
            empSalary.setIncomeTax(empSalaryDto.getIncomeTax());
            empSalary.setHealthInsurance(empSalaryDto.getHealthInsurance());
            empSalary.setEmploymentInsurance(empSalaryDto.getEmploymentInsurance());
            empSalary.setPensionInsurance(empSalaryDto.getPensionInsurance());
            empSalary.setLongtermCare(empSalaryDto.getLongtermCare());
            empSalary.setOther(empSalaryDto.getOther());
            empSalary.setTotalDeduction(empSalaryDto.getTotalDeduction());
            empSalary.setNetSalary(empSalaryDto.getNetSalary());
            empSalary.setPaymentMethod(empSalaryDto.getPaymentMethod());
            empSalary.setBankName(empSalaryDto.getBankName());
            empSalary.setBranchName(empSalaryDto.getBranchName());
            empSalary.setAccountType(empSalaryDto.getAccountType());
            empSalary.setAccountNumber(empSalaryDto.getAccountNumber());
            
            EmpSalary updated = empSalaryRepository.save(empSalary);
            return EmpSalaryMapper.toDto(updated);
        }
        return null;
    }

    @Override
    public List<EmpSalaryDto> getSalaryHistoryForEmployee(Long employeeId) {
        List<EmpSalary> salaries = empSalaryRepository.findAllByEmployee_Id(employeeId);
        return salaries.stream()
                       .map(EmpSalaryMapper::toDto)
                       .collect(Collectors.toList());
    }
}
