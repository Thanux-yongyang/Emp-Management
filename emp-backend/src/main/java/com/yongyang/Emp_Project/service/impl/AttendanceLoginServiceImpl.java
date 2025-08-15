package com.yongyang.Emp_Project.service.impl;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.yongyang.Emp_Project.dto.AttendanceDetailDto;
import com.yongyang.Emp_Project.dto.AttendanceLoginDto;
import com.yongyang.Emp_Project.dto.AttendanceLoginResponseDto;
import com.yongyang.Emp_Project.entity.Attendance.AttendanceDetail;
import com.yongyang.Emp_Project.entity.Attendance.AttendanceLogin;
import com.yongyang.Emp_Project.entity.Department.Department;
import com.yongyang.Emp_Project.entity.Employee.Employee;
import com.yongyang.Emp_Project.entity.PaidLeave.PaidLeave;
import com.yongyang.Emp_Project.mapper.AttendanceDetailMapper;
import com.yongyang.Emp_Project.mapper.AttendanceLoginMapper;
import com.yongyang.Emp_Project.repository.AttendanceDetailRepository;
import com.yongyang.Emp_Project.repository.AttendanceLoginRepository;
import com.yongyang.Emp_Project.repository.DepartmentRepository;
import com.yongyang.Emp_Project.repository.EmployeeRepository;
import com.yongyang.Emp_Project.repository.PaidLeave.PaidLeaveRepository;
import com.yongyang.Emp_Project.service.AttendanceLoginService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class AttendanceLoginServiceImpl implements AttendanceLoginService {

    @Autowired
    private final AttendanceLoginRepository attendanceLoginRepository;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final EmployeeRepository employeeRepository;

    private final AttendanceDetailRepository attendanceDetailRepository;

    private final DepartmentRepository departmentRepository; 
    
    @Autowired
    private PaidLeaveRepository paidLeaveRepository;

    // Constants for time calculation
    private static final Double BREAK_HOUR = 1.0;
    private static final Double NORMAL_WORK_HOURS = 8.0; // hours
    private static final Double OVERTIME_THRESHOLD_MINUTES = 15.0; // minutes

    @Override
    public AttendanceLoginResponseDto login(String loginName, String password) {
        AttendanceLogin login = attendanceLoginRepository.findByLoginName(loginName)
            .filter(attendanceLogin -> passwordEncoder.matches(password, attendanceLogin.getPassword()))
            .orElseThrow(() -> new RuntimeException("Invalid loginName or password"));

        Employee employee = employeeRepository.findById(login.getEmployee().getId())
            .orElseThrow(() -> new RuntimeException("Employee Not Found"));

        Department department = departmentRepository.findById(employee.getDepartment().getId())
            .orElseThrow(() -> new RuntimeException("Department Not Found"));

        // Get today's attendance record if exists
        Optional<AttendanceDetail> existingDetail = getTodaysAttendance(employee);
        AttendanceDetail detail;

        if (existingDetail.isPresent()) {
            detail = existingDetail.get();
        } else {
            detail = saveClockIn(login, employee);
        }

        AttendanceLoginResponseDto responseDto = new AttendanceLoginResponseDto();
        responseDto.setUsername(login.getLoginName());
        responseDto.setDepartname(department.getDepartmentName());
        responseDto.setEmployeename(employee.getFirstName() + " " + employee.getLastName());
        responseDto.setAttendDate(detail.getAttendDate());
        responseDto.setClockIn(detail.getClockIn());
        responseDto.setClockOut(detail.getClockOut());
        responseDto.setTotalHour(detail.getTotalHour());
        responseDto.setBreakHour(detail.getBreakHour());
        responseDto.setOverTime(detail.getOverTime());

        return responseDto;
    }

    @Override
    public AttendanceLoginDto createUser(AttendanceLoginDto attendanceLoginDto) {
        String hashedPassword = passwordEncoder.encode(attendanceLoginDto.getPassword());
        attendanceLoginDto.setPassword(hashedPassword);
        AttendanceLogin attendanceLogin = AttendanceLoginMapper.toAttendanceLoginEntity(attendanceLoginDto);

        Employee employee = employeeRepository.findById(attendanceLoginDto.getEmployeeId())
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        attendanceLogin.setEmployee(employee);

        AttendanceLogin savedUser = attendanceLoginRepository.save(attendanceLogin);
        return AttendanceLoginMapper.toAttendanceLoginDto(savedUser);
    }

    @Override
    @Transactional
    public AttendanceDetail saveClockIn(AttendanceLogin login, Employee employee) {
        if (getTodaysAttendance(employee).isPresent()) {
            throw new RuntimeException("Already clocked in today");
        }

        AttendanceDetail detail = new AttendanceDetail();
        detail.setEmployee(employee);

        LocalDateTime now = LocalDateTime.now();
        detail.setClockIn(now);
        detail.setAttendDate(now.toLocalDate());
        detail.setClockOut(null);
        detail.setTotalHour(0.0);
        detail.setBreakHour(BREAK_HOUR);
        detail.setOverTime(0.0);

        return attendanceDetailRepository.save(detail);
    }

    @Override
    @Transactional
    public AttendanceDetail saveClockOut(AttendanceLogin login, Employee employee) {
        AttendanceDetail detail = getTodaysAttendance(employee)
            .orElseThrow(() -> new RuntimeException("No clock-in found for today"));

        if (detail.getClockOut() != null) {
            throw new RuntimeException("Already clocked out today");
        }

        LocalDateTime now = LocalDateTime.now();
        detail.setClockOut(now);

        calculateWorkHours(detail);

        return attendanceDetailRepository.save(detail);
    }

    @Override
    public AttendanceLoginResponseDto clockOut(String loginName, String password) {
        AttendanceLogin login = attendanceLoginRepository.findByLoginName(loginName)
            .filter(attendanceLogin -> passwordEncoder.matches(password, attendanceLogin.getPassword()))
            .orElseThrow(() -> new RuntimeException("Invalid loginName or password"));

        Employee employee = employeeRepository.findById(login.getEmployee().getId())
            .orElseThrow(() -> new RuntimeException("Employee Not Found"));

        Department department = departmentRepository.findById(employee.getDepartment().getId())
            .orElseThrow(() -> new RuntimeException("Department Not Found"));

        AttendanceDetail detail = saveClockOut(login, employee);

        AttendanceLoginResponseDto responseDto = new AttendanceLoginResponseDto();
        responseDto.setUsername(login.getLoginName());
        responseDto.setDepartname(department.getDepartmentName());
        responseDto.setEmployeename(employee.getFirstName() + " " + employee.getLastName());
        responseDto.setAttendDate(detail.getAttendDate());
        responseDto.setClockIn(detail.getClockIn());
        responseDto.setClockOut(detail.getClockOut());
        responseDto.setTotalHour(detail.getTotalHour());
        responseDto.setBreakHour(detail.getBreakHour());
        responseDto.setOverTime(detail.getOverTime());

        return responseDto;
    }

    private Optional<AttendanceDetail> getTodaysAttendance(Employee employee) {
        LocalDate today = LocalDate.now();
        return attendanceDetailRepository.findFirstByEmployeeAndAttendDateAndClockInNotNull(employee, today);
    }

    /**
     * Calculate work hours and overtime using java.time.Duration
     */
    private void calculateWorkHours(AttendanceDetail detail) {
        if (detail.getClockIn() == null || detail.getClockOut() == null) {
            System.out.println("Cannot calculate work hours: missing clock-in or clock-out time");
            return;
        }

        Duration duration = Duration.between(detail.getClockIn(), detail.getClockOut());
        double totalWorkedHours = duration.toMinutes() / 60.0;

        Double breakHours = detail.getBreakHour() != null ? detail.getBreakHour() : BREAK_HOUR;
        double netWorkingHours = totalWorkedHours - breakHours;

        double overtimeHours = 0.0;
        if (netWorkingHours > NORMAL_WORK_HOURS) {
            double extraHours = netWorkingHours - NORMAL_WORK_HOURS;
            double extraMinutes = extraHours * 60;
            if (extraMinutes > OVERTIME_THRESHOLD_MINUTES) {
                overtimeHours = extraHours;
            }
        }

        double roundedNetHours = Math.round(netWorkingHours * 100.0) / 100.0;
        double roundedOvertimeHours = Math.round(overtimeHours * 100.0) / 100.0;

        detail.setTotalHour(roundedNetHours);
        detail.setOverTime(roundedOvertimeHours);
    }

    public List<AttendanceLoginResponseDto> getAllAttendance() {
        List<AttendanceDetail> attendanceList = attendanceDetailRepository.findAll();

        return attendanceList.stream().map(attendance -> {
            AttendanceLoginResponseDto dto = new AttendanceLoginResponseDto();
            dto.setEmployeename(attendance.getEmployee().getFirstName() + " " + attendance.getEmployee().getLastName());
            dto.setDepartname(attendance.getEmployee().getDepartment().getDepartmentName());
            dto.setAttendDate(attendance.getAttendDate());
            dto.setClockIn(attendance.getClockIn());
            dto.setClockOut(attendance.getClockOut());
            dto.setTotalHour(attendance.getTotalHour());
            dto.setBreakHour(attendance.getBreakHour());
            dto.setOverTime(attendance.getOverTime());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDetailDto> getEmployeeMonthlyAttendance(Long employeeId, int year, int month) {
        LocalDate firstDay = LocalDate.of(year, month, 1);
        LocalDate lastDay = firstDay.withDayOfMonth(firstDay.lengthOfMonth());

        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<AttendanceDetail> attendanceList = attendanceDetailRepository.findMonthlyAttendance(employee, firstDay, lastDay);

        return attendanceList.stream()
            .map(attendance -> new AttendanceDetailDto(
                attendance.getId(),
                attendance.getAttendDate(),
                attendance.getClockIn(),
                attendance.getClockOut(),
                attendance.getTotalHour(),
                attendance.getBreakHour(),
                attendance.getOverTime(),
                attendance.isPaidLeave()
            ))
            .collect(Collectors.toList());
    }

    @Override
    public AttendanceDetailDto updateAttendanceDetail(Long id, AttendanceDetailDto dto) {
        AttendanceDetail attendanceDetail = attendanceDetailRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Attendance detail not found"));

        attendanceDetail.setClockIn(dto.getClockIn());
        attendanceDetail.setClockOut(dto.getClockOut());
        attendanceDetail.setBreakHour(dto.getBreakHour());

        calculateWorkHours(attendanceDetail);

        AttendanceDetail saved = attendanceDetailRepository.save(attendanceDetail);

        return AttendanceDetailMapper.toAttendanceDetailDto(saved);
    }

 


    @Override
    @Transactional
    public void applyPaidLeave(Long employeeId, LocalDate date) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
    
        PaidLeave leave = paidLeaveRepository.findByEmployee(employee)
            .orElseThrow(() -> new RuntimeException("Paid leave record not found"));
    
        if (leave.getUsedLeaveDays() >= leave.getTotalLeaveDays()) {
            throw new RuntimeException("No leaves left to apply");
        }
    
        // If a record exists, that means they were present — skip applying leave
        if (attendanceDetailRepository.findByEmployeeAndAttendDate(employee, date).isPresent()) {
            throw new RuntimeException("Cannot apply paid leave — day already has attendance.");
        }
    
        // Create new paid leave record
        AttendanceDetail newRecord = new AttendanceDetail();
        newRecord.setEmployee(employee);
        newRecord.setAttendDate(date);
        newRecord.setClockIn(null);
        newRecord.setClockOut(null);
        newRecord.setTotalHour(0.0);
        newRecord.setOverTime(0.0);
        newRecord.setBreakHour(0.0);
        newRecord.setPaidLeave(true);
    
        attendanceDetailRepository.save(newRecord);
    
        // Increment leave usage
        leave.setUsedLeaveDays(leave.getUsedLeaveDays() + 1);
        paidLeaveRepository.save(leave);
    }
    
    @Override
@Transactional
public void cancelPaidLeave(Long employeeId, LocalDate date) {
    Employee employee = employeeRepository.findById(employeeId)
        .orElseThrow(() -> new RuntimeException("Employee not found"));

    AttendanceDetail detail = attendanceDetailRepository
        .findByEmployeeAndAttendDate(employee, date)
        .orElseThrow(() -> new RuntimeException("Attendance record not found"));

    if (!detail.isPaidLeave()) {
        throw new IllegalStateException("No paid leave record to cancel");
    }

    PaidLeave leave = paidLeaveRepository.findByEmployee(employee)
        .orElseThrow(() -> new RuntimeException("Paid leave record not found"));

    leave.setUsedLeaveDays(Math.max(0, leave.getUsedLeaveDays() - 1));
    paidLeaveRepository.save(leave);

    attendanceDetailRepository.delete(detail);
}

}
