package com.yongyang.Emp_Project.entity.AttendanceDetail;

import java.sql.Date;

import com.yongyang.Emp_Project.entity.Employee;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "attendance_detail_tbl")
public class AttendanceDetail {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    @JoinColumn(name = "emp_id" , nullable = false)
    private Employee employee;
    @Column(name = "attend_date", nullable = false)
    private Date attendDate;
    @Column(name = "clockin_time" ,nullable = false)
    private Date clockIn;
    @Column(name = "clockout_time" ,nullable = false)
    private Date clockOut;
    @Column(name = "total_time" ,nullable = false)
    private long totalHour;
    @Column(name = "break_time" ,nullable = false)
    private long breakHour;
    @Column(name = "over_time" ,nullable = false)
    private long overTime;
    

    

}
