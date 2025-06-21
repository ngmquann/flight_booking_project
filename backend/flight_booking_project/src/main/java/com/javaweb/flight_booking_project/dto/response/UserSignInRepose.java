package com.javaweb.flight_booking_project.dto.response;

import lombok.Data;

@Data
public class UserSignInRepose {
    private String name;
    private String email;
    private String role;
}
