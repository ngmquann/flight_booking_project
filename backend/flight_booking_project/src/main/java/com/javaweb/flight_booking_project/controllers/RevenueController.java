package com.javaweb.flight_booking_project.controllers;

import com.javaweb.flight_booking_project.dto.DashboardSummary;
import com.javaweb.flight_booking_project.dto.response.RevenueResponse;
import com.javaweb.flight_booking_project.dto.response.YearlyRevenueResponse;
import com.javaweb.flight_booking_project.services.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/revenue")
public class RevenueController {
    @Autowired
    private RevenueService revenueService;
    @GetMapping("/today")
    public ResponseEntity<?> getRevenueToday() {
        try {
            List<RevenueResponse> result = revenueService.getRevenueByDate();
            return ResponseEntity.ok(result);
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/yearly/{year}")
    public ResponseEntity<?> getRevenueByYear(@PathVariable Integer year) {
        try {
            YearlyRevenueResponse revenue = revenueService.getRevenueByYear(year);
            return ResponseEntity.ok(revenue);
        } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardSummary() {
        try {
            DashboardSummary dashboard = revenueService.getDashboardSummary();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
