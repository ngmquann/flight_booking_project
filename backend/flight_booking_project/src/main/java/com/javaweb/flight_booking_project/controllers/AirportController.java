package com.javaweb.flight_booking_project.controllers;


import com.javaweb.flight_booking_project.dto.AirportDto;
import com.javaweb.flight_booking_project.dto.response.AirportResponse;
import com.javaweb.flight_booking_project.services.AirportService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/airport")
public class AirportController {
    @Autowired
    private AirportService airportService;

    @PostMapping("/create")
    public ResponseEntity<?> createAirport(@Valid @RequestBody AirportDto airportDto,
                                           BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .collect(Collectors.toList());
                return ResponseEntity.badRequest().body(errorMessages);
            }
            airportService.createAirport(airportDto);
            return ResponseEntity.ok("Airport created !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAirport(@PathVariable("id") Long id) {
        try {
            boolean checkDelete = airportService.deleteAirport(id);
            if (checkDelete) {
                return ResponseEntity.ok("Airport deleted !");
            }
            return ResponseEntity.badRequest().body(" Error deleting airport !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("")
    public ResponseEntity<?> getAllAirports() {
        try {
            List<AirportResponse> airportResponseList = airportService.getAllAirports();
            return ResponseEntity.ok(airportResponseList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getAirportById(@PathVariable("id") Long id) {
        try {
            AirportResponse  airportResponse = airportService.getAirportById(id);
            return ResponseEntity.ok(airportResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}