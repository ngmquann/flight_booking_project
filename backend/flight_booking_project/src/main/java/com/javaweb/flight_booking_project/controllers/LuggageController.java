package com.javaweb.flight_booking_project.controllers;

import com.javaweb.flight_booking_project.dto.request.LuggageRequest;
import com.javaweb.flight_booking_project.services.LuggageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/luggage")
public class LuggageController {
    @Autowired
    private LuggageService luggageService;

    @PostMapping("/create")
    public ResponseEntity<?> createLuggage(@Valid @RequestBody LuggageRequest luggageRequest, BindingResult result){
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .collect(Collectors.toList());
                return ResponseEntity.badRequest().body(errorMessages);
            }
            luggageService.createLuggage(luggageRequest);
            return ResponseEntity.ok("Luggage created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
