package com.yongyang.Emp_Project.service.impl;

import com.yongyang.Emp_Project.dto.UserDto;
import com.yongyang.Emp_Project.entity.EmpUser.User;
import com.yongyang.Emp_Project.mapper.UserMapper;
import com.yongyang.Emp_Project.repository.UserRepository;
import com.yongyang.Emp_Project.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private final  PasswordEncoder passwordEncoder;

    @Override
    public User login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElseThrow(()->new RuntimeException("Invalid username or password"));
//                .filter(user -> user.getPassword().equals(password))
//                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
    }

    @Override
    public UserDto createUser(UserDto userDto) {
        String hashedPassword = passwordEncoder.encode(userDto.getPassword());
        userDto.setPassword((hashedPassword));
        User user = UserMapper.toUserEntity(userDto);
        User savedUser = userRepository.save(user);
        return UserMapper.toUserDTO(savedUser);
    }
}
