package com.yongyang.Emp_Project.service;

import com.yongyang.Emp_Project.dto.UserDto;
import com.yongyang.Emp_Project.entity.EmpUser.User;

public interface UserService {
    User login(String username, String password);
    UserDto createUser(UserDto userDto);
}
