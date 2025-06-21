package com.javaweb.flight_booking_project.dto.response;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class LuggageResponse {
    private Long id;

    private String luggageType;

    private double weight;

    private double price;
}
