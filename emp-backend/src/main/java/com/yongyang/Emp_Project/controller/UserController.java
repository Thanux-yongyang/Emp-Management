package com.yongyang.Emp_Project.controller;

import com.yongyang.Emp_Project.dto.UserDto;
import com.yongyang.Emp_Project.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/createuser")
public class UserController {
    private UserService userService;
     public UserController(UserService userService){this.userService = userService;}

    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto){
         UserDto savedUser = userService.createUser(userDto);
         return new ResponseEntity<>(savedUser , HttpStatus.CREATED);
    }
}
