package com.javaweb.flight_booking_project.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class LoginRequest {
    @NotEmpty(message = "Email cannot empty")
    private String email;

    @NotEmpty(message = "Email cannot empty")
    private String password;
}
