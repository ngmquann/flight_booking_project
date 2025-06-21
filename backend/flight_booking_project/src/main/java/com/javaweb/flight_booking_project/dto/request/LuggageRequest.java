package com.javaweb.flight_booking_project.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LuggageRequest {
    @JsonProperty("luggage_type")
    @NotNull(message = "Type not empty")
    private String luggageType;

    @JsonProperty("weight")
    @NotNull(message = "Weight not empty")
    private double weight;

    @JsonProperty("price")
    @NotNull(message = "Price not empty")
    private double price;
}
