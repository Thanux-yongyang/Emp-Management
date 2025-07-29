package com.yongyang.Emp_Project.mapper;

import com.yongyang.Emp_Project.dto.AttendanceDetailDto;
import com.yongyang.Emp_Project.entity.Employee;
import com.yongyang.Emp_Project.entity.AttendanceDetail.AttendanceDetail;



public class AttendanceDetailMapper {
    public static AttendanceDetailDto toAttendanceDetailDto(AttendanceDetail attendanceDetail){
        return new AttendanceDetailDto(
            attendanceDetail.getId(),
            attendanceDetail.getAttendDate(),
            attendanceDetail.getClockIn(),
            attendanceDetail.getClockOut(),
            attendanceDetail.getTotalHour(),
            attendanceDetail.getBreakHour(),
            attendanceDetail.getOverTime()

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
            attendanceDetailDto.getOverTime()
        );
    }
    
}
