package com.yongyang.Emp_Project.entity.Attendance;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.yongyang.Emp_Project.entity.Employee.Employee;

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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attendance_detail_tbl")
public class AttendanceDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    @Column(name = "attend_date", nullable = true)
    private LocalDate attendDate;

    @Column(name = "clockin_time", nullable = true)
    private LocalDateTime clockIn;

    @Column(name = "clockout_time", nullable = true)
    private LocalDateTime clockOut;

    @Column(name = "total_time", nullable = false)
    private Double totalHour;

    @Column(name = "break_time", nullable = false)
    private Double breakHour;

    @Column(name = "over_time", nullable = false)
    private Double overTime;

    @Column(name = "is_paid_leave", nullable = false)
    private boolean isPaidLeave;

}
