package com.yongyang.Emp_Project.mapper;

import com.yongyang.Emp_Project.dto.UserDto;
import com.yongyang.Emp_Project.entity.User;

public class UserMapper {
    public static UserDto toUserDTO(User user){
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getRole(),
                user.getEmail(),
                user.getEmployeeId()
        );
    }
    public static User toUserEntity(UserDto userDto){
        return new User(
                userDto.getId(),
                userDto.getUsername(),
                userDto.getPassword(),
                userDto.getRole(),
                userDto.getEmail(),
                userDto.getEmployeeId()
        );
    }
}
