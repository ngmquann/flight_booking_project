package com.javaweb.flight_booking_project.services;

import com.javaweb.flight_booking_project.dto.request.AirlineRequest;
import com.javaweb.flight_booking_project.dto.response.AirlineResponse;

import java.io.IOException;
import java.util.List;

public interface AirlineService {
    void createAirline(AirlineRequest airlineRequest) throws IOException;
    boolean deleteAirline(Long id);
    List<AirlineResponse> getAllAirlines();
}
