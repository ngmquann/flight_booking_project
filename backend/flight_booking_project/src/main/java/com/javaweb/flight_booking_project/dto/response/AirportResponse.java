package com.javaweb.flight_booking_project.dto.response;

import lombok.Data;

@Data
public class AirportResponse {
    private Long id;
    private String name;
    private String location;
    private String code;
}
