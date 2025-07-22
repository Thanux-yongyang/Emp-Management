package com.yongyang.Emp_Project.controller;

import com.yongyang.Emp_Project.dto.EmpSalaryDto;
import com.yongyang.Emp_Project.service.EmpSalaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/empsalaries")
@CrossOrigin(origins = "*")
public class EmpSalaryController {
    @Autowired
    private EmpSalaryService empSalaryService;

    @PostMapping
    public ResponseEntity<EmpSalaryDto> createEmpSalary(@RequestBody EmpSalaryDto empSalaryDto) {
        EmpSalaryDto created = empSalaryService.createEmpSalary(empSalaryDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<EmpSalaryDto>> getAllEmpSalaries() {
        List<EmpSalaryDto> salaries = empSalaryService.getAllEmpSalaries();
        return ResponseEntity.ok(salaries);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmpSalaryDto> updateEmpSalary(@PathVariable Long id, @RequestBody EmpSalaryDto empSalaryDto) {
        EmpSalaryDto updated = empSalaryService.updateEmpSalary(id, empSalaryDto);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpSalary(@PathVariable Long id) {
        empSalaryService.deleteEmpSalary(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/employee/{employeeId}")
    public ResponseEntity<EmpSalaryDto> updateSalaryByEmployeeId(@PathVariable Long employeeId, @RequestBody EmpSalaryDto salaryDto) {
        EmpSalaryDto updatedSalary = empSalaryService.updateEmpSalaryByEmployeeId(employeeId, salaryDto);
        if (updatedSalary != null) {
            return ResponseEntity.ok(updatedSalary);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<EmpSalaryDto>> getSalaryHistory(@PathVariable Long employeeId) {
        List<EmpSalaryDto> history = empSalaryService.getSalaryHistoryForEmployee(employeeId);
        if (history.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(history);
    }
}
