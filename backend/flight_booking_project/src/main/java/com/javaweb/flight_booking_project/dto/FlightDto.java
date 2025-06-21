package com.javaweb.flight_booking_project.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlightDto {
    private Long id;

    @NotBlank(message = "Code flight cannot be blank! ")
    private String code;

    @NotNull(message = "Arrival time cannot be null")
    @JsonProperty("arrival_time")
    private String arrivalTime;

    @JsonProperty("departure_time")
    @NotNull(message = "Departure time cannot be null")
    private String departureTime;

    @JsonProperty("arrival_id")
    private Long arrivalId;

    @JsonProperty("departure_id")
    private Long departureId;

    @JsonProperty("plane_id")
    private Long planeId;

    @JsonProperty("eco_price")
    private double ecoPrice;

    @JsonProperty("bus_price")
    private double busPrice;

    @JsonProperty("airport_list")
    private List<AirportDto> airportDtoList;
}
