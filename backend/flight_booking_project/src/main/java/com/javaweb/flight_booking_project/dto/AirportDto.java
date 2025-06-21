package com.javaweb.flight_booking_project.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AirportDto {
    private Long id;
    @NotBlank(message = "Airport name cannot be blank! ")
    private String name;

    @NotBlank(message = "Airport location cannot be blank! ")
    private String location;

    @NotBlank(message = "Airport code cannot be blank! ")
    private String code;
}
