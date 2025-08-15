package com.yongyang.Emp_Project.mapper.PaidLeave;

import com.yongyang.Emp_Project.dto.PaidLeave.PaidLeaveDto;
import com.yongyang.Emp_Project.entity.Employee.Employee;
import com.yongyang.Emp_Project.entity.PaidLeave.PaidLeave;

public class PaidLeaveMapper {
    public static PaidLeaveDto toDto(PaidLeave paidLeave){
        if(paidLeave == null) return null;
        return new PaidLeaveDto(
            paidLeave.getId(),
            paidLeave.getEmployee() != null ? paidLeave.getEmployee().getId() : null,
        
            paidLeave.getTotalLeaveDays(),
            paidLeave.getUsedLeaveDays()
        );
    }

    public static PaidLeave toEntity(PaidLeaveDto paidLeaveDto, Employee employee){
        if(paidLeaveDto == null) return null;
        return new PaidLeave(
            paidLeaveDto.getId(),
            employee,
          
            paidLeaveDto.getTotalLeaveDays(),
            paidLeaveDto.getUsedLeaveDays()
        );
    }
}
