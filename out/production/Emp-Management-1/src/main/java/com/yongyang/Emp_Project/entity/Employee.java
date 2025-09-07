package com.yongyang.Emp_Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="employee_tbl")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "first_name", nullable = false)
    private String firstName;
    @Column(name = "last_name", nullable = false)
    private String lastName;
    @Temporal(TemporalType.DATE)
    @Column(name = "date_of_birth", nullable = false)
    private Date dateOfBirth;
    @Temporal(TemporalType.DATE)
    @Column(name = "date_of_entry", nullable = false)
    private Date dateOfEntry;
    @Column(name = "gender", nullable = false)
    private String gender;
    @Column(name="postal_code", nullable = false)
    private String postalCode;
    @Column(name = "address", nullable = false)
    private String address;
    @Column(name = "sub_address", nullable = false)
    private String subAddress;
    @Column(name = "department", nullable = false)
    private String department;
    @Column(name = "email", nullable = false)
    private  String email;
    @Column(name = "phone_No",nullable = false, unique = true)
    private String phoneNo;
}
