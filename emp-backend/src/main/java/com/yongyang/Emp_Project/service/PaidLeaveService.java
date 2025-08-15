package com.yongyang.Emp_Project.service;

import java.util.List;

import com.yongyang.Emp_Project.dto.PaidLeave.PaidLeaveDto;

public interface PaidLeaveService {
    PaidLeaveDto createPaidLeave(PaidLeaveDto paidLeaveDto);
    List<PaidLeaveDto> getAllPaidLeaves();
    PaidLeaveDto updatePaidLeave(Long id, PaidLeaveDto paidLeaveDto);
    void deletePaidLeave(Long id);
}
