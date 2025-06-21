package com.javaweb.flight_booking_project.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class HomeResponse {
    List<AirportResponse> airportResponses;
    List<String> seatClasses;
}
