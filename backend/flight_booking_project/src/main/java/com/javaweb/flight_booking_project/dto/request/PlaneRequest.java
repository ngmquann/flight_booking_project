package com.javaweb.flight_booking_project.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class PlaneRequest {
    private  Long id;
    @NotNull
    @JsonProperty("eco_class")
    private Integer ecoClass;

    @NotNull
    @JsonProperty("bus_class")
    private Integer busClass;

    @NotEmpty(message = "Name cannot empty")
    private String name;

    @NotNull(message = "Airline cannot empty")
    private Long airlineId;
}
