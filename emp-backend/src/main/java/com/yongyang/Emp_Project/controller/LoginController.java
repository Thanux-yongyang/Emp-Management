package com.yongyang.Emp_Project.controller;


import com.yongyang.Emp_Project.dto.LoginRequestDto;
import com.yongyang.Emp_Project.entity.User;
import com.yongyang.Emp_Project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class LoginController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public User login(@RequestBody LoginRequestDto loginRequestDto){
        return userService.login(loginRequestDto.getUsername(),loginRequestDto.getPassword());
    }
}
