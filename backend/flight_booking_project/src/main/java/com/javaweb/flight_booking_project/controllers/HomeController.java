package com.javaweb.flight_booking_project.controllers;

import com.javaweb.flight_booking_project.dto.response.HomeResponse;
import com.javaweb.flight_booking_project.services.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/home")
public class HomeController {
    @Autowired
    private HomeService homeService;

    @GetMapping
    public ResponseEntity<?> getHomeInfo(){
        try {
            HomeResponse response = homeService.getHomeInfo();
            return ResponseEntity.ok(response);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
