package com.example.crm.controller;

import com.example.crm.security.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Hardcoded simulation for assessment login: pass any username/password, specify tenant & role
        List<String> roles = request.getRole() != null ? List.of(request.getRole()) : List.of("ROLE_MEMBER");
        String token = jwtUtil.generateToken(request.getUsername(), request.getTenantId(), roles);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthRequest {
        private String username;
        private String password;
        private String tenantId;
        private String role; // e.g., ROLE_ADMIN or ROLE_MEMBER
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
    }
}