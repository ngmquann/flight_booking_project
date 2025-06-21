package com.javaweb.flight_booking_project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class YearlyRevenueResponse {
    private Integer year;
    private BigDecimal totalRevenue;
    private List<MonthlyRevenueResponse> monthlyRevenues;
}
