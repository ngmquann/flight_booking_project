package com.javaweb.flight_booking_project.controllers;

import com.javaweb.flight_booking_project.dto.request.PlaneRequest;
import com.javaweb.flight_booking_project.dto.response.FlightResponse;
import com.javaweb.flight_booking_project.dto.response.PlaneResponse;
import com.javaweb.flight_booking_project.services.PlaneService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/plane")
public class PlaneController {
    @Autowired
    private PlaneService planeService;

    @PostMapping("/create")
    public ResponseEntity<?> createPlane(@RequestBody @Valid PlaneRequest planeRequest, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .collect(Collectors.toList());
                return ResponseEntity.badRequest().body(errorMessages);
            }
            planeService.createPlane(planeRequest);
            return ResponseEntity.ok("Plane created !");
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("")
    public ResponseEntity<?> getAllPlanes() {
        try {
            List<PlaneResponse> planeResponseList = planeService.getAllPlanes();
            return ResponseEntity.ok(planeResponseList);
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlaneById (@PathVariable Long id) {
        try {
            planeService.deletePlane(id);
            return  ResponseEntity.ok("Deleted plane successfully !");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body("it is dependent");
        }
    }
}
