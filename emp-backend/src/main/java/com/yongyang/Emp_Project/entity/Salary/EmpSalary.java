package com.yongyang.Emp_Project.entity.Salary;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

import com.yongyang.Emp_Project.entity.Employee.Employee;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "empsalary_tbl")
public class EmpSalary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sal_id")
    private Long salid;

    @ManyToOne
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    @Column(name = "base_salary")
    private Double baseSalary;

    @Column(name = "salary_type")
    private String salaryType;

    @Temporal(TemporalType.DATE)
    @Column(name = "effective_date")
    private Date effectiveDate;

    @Column(name = "housing_allowance")
    private Double housingAllowance;

    @Column(name = "transport_allowance")
    private Double transportAllowance;

    @Column(name = "meal_allowance")
    private Double mealAllowance;

    @Column(name = "communication_allowance")
    private Double communicationAllowance;

    @Column(name = "overtime_allowance")
    private Double overtimeAllowance;

    @Column(name = "bonus_allowance")
    private Double bonusAllowance;

    @Column(name = "total_allowance")
    private Double totalAllowance;

    @Column(name = "income_tax")
    private Double incomeTax;

    @Column(name = "health_insurance")
    private Double healthInsurance;

    @Column(name = "employment_insurance")
    private Double employmentInsurance;

    @Column(name = "pension_insurance")
    private Double pensionInsurance;

    @Column(name = "longterm_care")
    private Double longtermCare;

    @Column(name = "other_deduction")
    private Double other;

    @Column(name = "total_deduction")
    private Double totalDeduction;

    @Column(name = "net_salary")
    private Double netSalary;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "account_type")
    private String accountType;

    @Column(name = "account_number")
    private String accountNumber;
}
