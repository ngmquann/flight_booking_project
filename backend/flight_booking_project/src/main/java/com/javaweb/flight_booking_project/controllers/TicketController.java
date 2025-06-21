package com.javaweb.flight_booking_project.controllers;

import com.javaweb.flight_booking_project.configuration.JWTHelper;
import com.javaweb.flight_booking_project.dto.FlightDto;
import com.javaweb.flight_booking_project.dto.request.TicketRequest;
import com.javaweb.flight_booking_project.dto.response.TicketBookedInfo;
import com.javaweb.flight_booking_project.dto.response.TicketBookedInfoAdmin;
import com.javaweb.flight_booking_project.models.UserEntity;
import com.javaweb.flight_booking_project.services.TicketService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ticket")
public class TicketController {
    @Autowired
    private JWTHelper jwtHelper;
    @Autowired
    private TicketService ticketService;

    @GetMapping("/by-user")
    public ResponseEntity<?> getAllTickedByUserId( HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long userId = jwtHelper.extractUserId(token);
            if(userId == null){
                return ResponseEntity.badRequest().body("You need to log in first!");
            }
            List<TicketBookedInfo> bookedInfoList = ticketService.getBookedTicketInfo(userId);
            return ResponseEntity.ok().body(bookedInfoList);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getDetailTicketById( @PathVariable Long id,HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long userId = jwtHelper.extractUserId(token);
            if(userId == null){
                return ResponseEntity.badRequest().body("You need to log in first!");
            }
            TicketBookedInfo bookedInfo = ticketService.getDetailTicketById(id);
            return ResponseEntity.ok().body(bookedInfo);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getTicketById( @PathVariable Long id) {
        try {
            TicketBookedInfoAdmin ticketInfo = ticketService.getTicketBookedById(id);
            return ResponseEntity.ok(ticketInfo);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
