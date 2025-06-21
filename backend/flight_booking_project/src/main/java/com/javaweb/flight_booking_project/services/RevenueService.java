package com.javaweb.flight_booking_project.services;

import com.javaweb.flight_booking_project.dto.DashboardSummary;
import com.javaweb.flight_booking_project.dto.response.RevenueResponse;
import com.javaweb.flight_booking_project.dto.response.YearlyRevenueResponse;

import java.time.LocalDate;
import java.util.List;

public interface RevenueService {
     List<RevenueResponse> getRevenueByDate();
     YearlyRevenueResponse getRevenueByYear(Integer year);
     DashboardSummary getDashboardSummary();
}
