package com.javaweb.flight_booking_project.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class RevenueResponse {
    private Long id;
    private LocalDate date;
    private BigDecimal totalRevenue;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
