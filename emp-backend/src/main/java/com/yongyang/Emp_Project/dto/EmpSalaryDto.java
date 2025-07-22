package com.yongyang.Emp_Project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmpSalaryDto {
    private Long salid;
    private Long empid;
    private Double baseSalary;
    private String salaryType;
    private Date effectiveDate;
    private Double housingAllowance;
    private Double transportAllowance;
    private Double mealAllowance;
    private Double communicationAllowance;
    private Double overtimeAllowance;
    private Double bonusAllowance;
    private Double totalAllowance;
    private Double incomeTax;
    private Double healthInsurance;
    private Double employmentInsurance;
    private Double pensionInsurance;
    private Double longtermCare;
    private Double other;
    private Double totalDeduction;
    private Double netSalary;
    private String paymentMethod;
    private String bankName;
    private String branchName;
    private String accountType;
    private String accountNumber;
}
