package com.yongyang.Emp_Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_tbl")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false , unique = true)
    private String username;

    @Column( nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false, unique =true)
    private String email;

    @Column(name = "employeeid", nullable = false, unique = true)
    private long employeeId;
}
