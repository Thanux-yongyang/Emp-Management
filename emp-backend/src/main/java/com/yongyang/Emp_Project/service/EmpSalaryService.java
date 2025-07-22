package com.yongyang.Emp_Project.service;

import com.yongyang.Emp_Project.dto.EmpSalaryDto;
import java.util.List;

public interface EmpSalaryService {
    EmpSalaryDto createEmpSalary(EmpSalaryDto empSalaryDto);
    List<EmpSalaryDto> getAllEmpSalaries();
    EmpSalaryDto updateEmpSalary(Long id, EmpSalaryDto empSalaryDto);
    void deleteEmpSalary(Long id);
    EmpSalaryDto updateEmpSalaryByEmployeeId(Long employeeId, EmpSalaryDto empSalaryDto);
    List<EmpSalaryDto> getSalaryHistoryForEmployee(Long employeeId);
}
