package com.javaweb.flight_booking_project.dto;

import lombok.Data;

@Data
public class DashboardSummary {
    private long totalUsers;
    private long totalAirlines;
    private long totalAirports;
    private long totalPlanes;
    private long totalFlights;
    private long totalReservations;
}
