package com.example.crm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/auth/test")
    public String publicEndpoint() {
        return "CRM Backend is up and running cleanly!";
    }
}