package com.javaweb.flight_booking_project.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MonthlyRevenueResponse {
    private Integer month;
    private BigDecimal totalRevenue;
}
