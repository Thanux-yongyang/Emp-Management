package com.yongyang.Emp_Project.service.impl;

import com.yongyang.Emp_Project.dto.EmployeeDto;
import com.yongyang.Emp_Project.entity.Employee;
import com.yongyang.Emp_Project.mapper.EmployeeMapper;
import com.yongyang.Emp_Project.repository.EmployeeRepository;
import com.yongyang.Emp_Project.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private EmployeeRepository employeeRepository;
    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = EmployeeMapper.toEntity(employeeDto);
        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.toDTO(savedEmployee);
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream().map(EmployeeMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public EmployeeDto updateEmployee(Long id, EmployeeDto employeeDto) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);

        if (optionalEmployee.isPresent()) {
            // Step 2: Get the existing employee
            Employee existingEmployee = optionalEmployee.get();

            // Step 3: Update the existing employee with new data from the DTO
            existingEmployee.setFirstName(employeeDto.getFirstName());
            existingEmployee.setLastName(employeeDto.getLastName());
            existingEmployee.setDateOfBirth(employeeDto.getDateOfBirth());
            existingEmployee.setDateOfEntry(employeeDto.getDateOfEntry());
            existingEmployee.setGender(employeeDto.getGender());
            existingEmployee.setAddress(employeeDto.getAddress());
            existingEmployee.setSubAddress(employeeDto.getSubAddress());
            existingEmployee.setPostalCode(employeeDto.getPostalCode());
            existingEmployee.setDepartment(employeeDto.getDepartment());
            existingEmployee.setEmail(employeeDto.getEmail());
            existingEmployee.setPhoneNo(employeeDto.getPhoneNo());

            // Step 4: Save the updated employee
            Employee updatedEmployee = employeeRepository.save(existingEmployee);

            // Step 5: Return the updated employee as a DTO
            return EmployeeMapper.toDTO(updatedEmployee);
        } else {
            // Step 6: Throw an exception if the employee is not found
            throw new RuntimeException("Employee not found with id: " + id);
        }
    }

    @Override
    public void deleteEmployee(Long id) {
        Optional<Employee> optionalEmployee= employeeRepository.findById(id);
        if(optionalEmployee.isPresent()){
            Employee employee = optionalEmployee.get();
            employeeRepository.deleteById(id);

        }
        else {
            throw new RuntimeException("Employee not found with id:"+id);
        }

    }
}
