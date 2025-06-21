package com.javaweb.flight_booking_project.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Data
public class FlightRequest {
    @NotNull
//    @JsonProperty("departure_airport")
    private Long departureAirport;

    @NotNull
//    @JsonProperty("arrival_airport")
    private Long arrivalAirport;

    @NotNull
//    @JsonProperty("departure_time")
    private String departureTime;

    @NotNull
//    @JsonProperty("seat_class")
    private String seatClass;
}
