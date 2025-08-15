package com.yongyang.Emp_Project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.yongyang.Emp_Project.entity.EmpUser.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);
}
