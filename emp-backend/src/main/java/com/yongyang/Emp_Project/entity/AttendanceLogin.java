package com.yongyang.Emp_Project.entity;

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
    @Column(nullable = false , unique = true)
    private String email;
    @Column(nullable = false)
    private long departmentId;
    @Column(nullable = false , unique = true)
    private long empId;
   
    
    
}
