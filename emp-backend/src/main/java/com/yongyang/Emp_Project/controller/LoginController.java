package com.yongyang.Emp_Project.controller;


import com.yongyang.Emp_Project.entity.User;
import com.yongyang.Emp_Project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private UserService userService;

    public User login(@RequestBody LoginR)
}
