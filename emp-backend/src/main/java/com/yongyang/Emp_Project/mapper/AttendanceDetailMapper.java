package com.yongyang.Emp_Project.mapper;

import com.yongyang.Emp_Project.dto.AttendanceDetailDto;
import com.yongyang.Emp_Project.entity.Attendance.AttendanceDetail;
import com.yongyang.Emp_Project.entity.Employee.Employee;



public class AttendanceDetailMapper {
    public static AttendanceDetailDto toAttendanceDetailDto(AttendanceDetail attendanceDetail){
        return new AttendanceDetailDto(
            attendanceDetail.getId(),
            attendanceDetail.getAttendDate(),
            attendanceDetail.getClockIn(),
            attendanceDetail.getClockOut(),
            attendanceDetail.getTotalHour(),
            attendanceDetail.getBreakHour(),
            attendanceDetail.getOverTime(),
            attendanceDetail.isPaidLeave()
            

        );
    }
    public static AttendanceDetail toAttendanceDetailEntity(AttendanceDetailDto attendanceDetailDto, Employee employee){
        return new AttendanceDetail(
            attendanceDetailDto.getId(),
            employee,
            attendanceDetailDto.getAttendDate(),
            attendanceDetailDto.getClockIn(),
            attendanceDetailDto.getClockOut(),
            attendanceDetailDto.getTotalHour(),
            attendanceDetailDto.getBreakHour(),
            attendanceDetailDto.getOverTime(),
            attendanceDetailDto.isPaidLeave()
        );
    }
    
}
