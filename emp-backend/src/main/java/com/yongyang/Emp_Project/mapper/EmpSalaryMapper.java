package com.yongyang.Emp_Project.mapper;

import com.yongyang.Emp_Project.dto.EmpSalaryDto;
import com.yongyang.Emp_Project.entity.EmpSalary;
import com.yongyang.Emp_Project.entity.Employee;

public class EmpSalaryMapper {
    public static EmpSalaryDto toDto(EmpSalary empSalary) {
        if (empSalary == null) return null;
        return new EmpSalaryDto(
            empSalary.getSalid(),
            empSalary.getEmployee() != null ? empSalary.getEmployee().getId() : null,
            empSalary.getBaseSalary(),
            empSalary.getSalaryType(),
            empSalary.getEffectiveDate(),
            empSalary.getHousingAllowance(),
            empSalary.getTransportAllowance(),
            empSalary.getMealAllowance(),
            empSalary.getCommunicationAllowance(),
            empSalary.getOvertimeAllowance(),
            empSalary.getBonusAllowance(),
            empSalary.getTotalAllowance(),
            empSalary.getIncomeTax(),
            empSalary.getHealthInsurance(),
            empSalary.getEmploymentInsurance(),
            empSalary.getPensionInsurance(),
            empSalary.getLongtermCare(),
            empSalary.getOther(),
            empSalary.getTotalDeduction(),
            empSalary.getNetSalary(),
            empSalary.getPaymentMethod(),
            empSalary.getBankName(),
            empSalary.getBranchName(),
            empSalary.getAccountType(),
            empSalary.getAccountNumber()
        );
    }

    public static EmpSalary toEntity(EmpSalaryDto dto) {
        if (dto == null) return null;
        EmpSalary empSalary = new EmpSalary();
        empSalary.setSalid(dto.getSalid());

        if (dto.getEmpid() != null) {
            Employee employee = new Employee();
            employee.setId(dto.getEmpid());
            empSalary.setEmployee(employee);
        }

        empSalary.setBaseSalary(dto.getBaseSalary());
        empSalary.setSalaryType(dto.getSalaryType());
        empSalary.setEffectiveDate(dto.getEffectiveDate());
        empSalary.setHousingAllowance(dto.getHousingAllowance());
        empSalary.setTransportAllowance(dto.getTransportAllowance());
        empSalary.setMealAllowance(dto.getMealAllowance());
        empSalary.setCommunicationAllowance(dto.getCommunicationAllowance());
        empSalary.setOvertimeAllowance(dto.getOvertimeAllowance());
        empSalary.setBonusAllowance(dto.getBonusAllowance());
        empSalary.setTotalAllowance(dto.getTotalAllowance());
        empSalary.setIncomeTax(dto.getIncomeTax());
        empSalary.setHealthInsurance(dto.getHealthInsurance());
        empSalary.setEmploymentInsurance(dto.getEmploymentInsurance());
        empSalary.setPensionInsurance(dto.getPensionInsurance());
        empSalary.setLongtermCare(dto.getLongtermCare());
        empSalary.setOther(dto.getOther());
        empSalary.setTotalDeduction(dto.getTotalDeduction());
        empSalary.setNetSalary(dto.getNetSalary());
        empSalary.setPaymentMethod(dto.getPaymentMethod());
        empSalary.setBankName(dto.getBankName());
        empSalary.setBranchName(dto.getBranchName());
        empSalary.setAccountType(dto.getAccountType());
        empSalary.setAccountNumber(dto.getAccountNumber());
        return empSalary;
    }
}
