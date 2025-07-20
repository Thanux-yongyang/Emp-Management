package com.yongyang.Emp_Project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // disable CSRF for APIs (especially when using Postman)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/createuser").permitAll()
                        .requestMatchers("/api/employees/**").permitAll()// 👈 Allow user creation without login
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/departments/**").permitAll()
                        .anyRequest().authenticated()                   // all other routes require login
                );
        return http.build();
    }
}
