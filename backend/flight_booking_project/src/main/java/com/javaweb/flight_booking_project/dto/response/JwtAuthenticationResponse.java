package com.javaweb.flight_booking_project.dto.response;

import lombok.Data;

@Data
public class JwtAuthenticationResponse {
    private String token;
    private UserSignInRepose user;
}
