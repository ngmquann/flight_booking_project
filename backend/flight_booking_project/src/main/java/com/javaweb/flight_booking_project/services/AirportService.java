package com.javaweb.flight_booking_project.services;

import com.javaweb.flight_booking_project.dto.AirportDto;
import com.javaweb.flight_booking_project.dto.response.AirportResponse;

import java.util.List;

public interface AirportService {
    void createAirport(AirportDto airportDto);
    boolean deleteAirport(Long id);
    List<AirportResponse> getAllAirports();
    AirportResponse getAirportById(Long id) throws Exception;
}
