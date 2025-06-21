package com.javaweb.flight_booking_project.controllers;


import com.javaweb.flight_booking_project.dto.FlightDto;
import com.javaweb.flight_booking_project.dto.request.FlightRequest;
import com.javaweb.flight_booking_project.dto.response.FlightResponse;
import com.javaweb.flight_booking_project.services.FlightService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/flight")
public class FlightController {
    @Autowired
    private FlightService flightService;
    @PostMapping("/create")
    public ResponseEntity<?> createFlight (@Valid @RequestBody FlightDto flightDto, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .collect(Collectors.toList());
                return ResponseEntity.badRequest().body(errorMessages);
            }
            flightService.createFlight(flightDto);
            return ResponseEntity.ok("Flight created !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/search")
    public ResponseEntity<?> searchFlight (@Valid @RequestBody FlightRequest flightRequest, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .collect(Collectors.toList());
                return ResponseEntity.badRequest().body(errorMessages);
            }
            List<FlightResponse> flightResponses = flightService.searchFlights(flightRequest);
            return ResponseEntity.ok(flightResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getDetailFlight (@PathVariable Long id) {
        try {
            FlightResponse detailFlightResponse = flightService.getDetailFlight(id);
            return  ResponseEntity.ok(detailFlightResponse);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/status/{id}")
    public ResponseEntity<?> setStatusFlight(@PathVariable Long id) {
        try {
            flightService.setStatusFlight(id);
            return  ResponseEntity.ok("Set flight status successfully!");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/by-admin")
    public ResponseEntity<?> getAllFlightsAdmin() {
        try {
            List<FlightResponse> flightResponses = flightService.getAllFlightsByAdmin();
            return ResponseEntity.ok(flightResponses);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/by-user")
    public ResponseEntity<?> getAllFlightsUser() {
        try {
            List<FlightResponse> flightResponses = flightService.getAllFlightsByUser();
            System.out.println(flightResponses.get(6));
            return ResponseEntity.ok(flightResponses);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/search")
    public ResponseEntity<?> searchFlightByCode (@RequestParam String code) {
        try {
            List<FlightResponse> flightResponses = flightService.getAllFlightByCode(code);
            return ResponseEntity.ok(flightResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-info-flight/{flight_id}/{seat_class}")
    public ResponseEntity<?> getInfoFlight(@PathVariable String flight_id, @PathVariable String seat_class){
        try {
            return ResponseEntity.ok(flightService.getInfoFlight(flight_id, seat_class));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
