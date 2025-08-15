package com.yongyang.Emp_Project.controller.PaidLeave;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yongyang.Emp_Project.dto.PaidLeave.PaidLeaveDto;
import com.yongyang.Emp_Project.service.PaidLeaveService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/paid-leave")
public class PaidLeaveController {

    @Autowired
    private PaidLeaveService paidLeaveService;

    @PostMapping
    public ResponseEntity<PaidLeaveDto> createPaidLeave(@RequestBody PaidLeaveDto paidLeaveDto){
        PaidLeaveDto createdPaidLeave = paidLeaveService.createPaidLeave(paidLeaveDto);
        return ResponseEntity.ok(createdPaidLeave);
    }

    @GetMapping
    public ResponseEntity<List<PaidLeaveDto>> getAllPaidLeaves(){
        List<PaidLeaveDto> paidLeaves = paidLeaveService.getAllPaidLeaves();
        return ResponseEntity.ok(paidLeaves);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaidLeaveDto> updatePaidLeave(@PathVariable Long id, @RequestBody PaidLeaveDto paidLeaveDto){
        PaidLeaveDto updatedPaidLeave = paidLeaveService.updatePaidLeave(id, paidLeaveDto);
        return ResponseEntity.ok(updatedPaidLeave);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaidLeave(@PathVariable Long id){
        paidLeaveService.deletePaidLeave(id);
        return ResponseEntity.noContent().build();
    }

    
}
