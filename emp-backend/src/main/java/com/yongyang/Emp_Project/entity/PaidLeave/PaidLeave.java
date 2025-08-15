package com.yongyang.Emp_Project.entity.PaidLeave;

import java.util.Date;

import com.yongyang.Emp_Project.entity.Employee.Employee;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "paid_leave_tbl")
public class PaidLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "employee_id", nullable = false, unique = true)
    private Employee employee;
  
    @Column(name = "total_leave_days", nullable = false)
    private int totalLeaveDays;
    @Column(name = "used_leave_days", nullable = false)
    private int usedLeaveDays;
    
    
}
