package com.yongyang.Emp_Project.entity.Attendance;

import com.yongyang.Emp_Project.entity.Employee.Employee;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attendancelogin_tbl")
public class AttendanceLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, unique = true)
    private String loginName;
    @Column(nullable = false)
    private String password;
   
  
    @ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "emp_id", nullable = false)
private Employee employee;
   
    
    
}
