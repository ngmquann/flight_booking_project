package com.javaweb.flight_booking_project.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfileRequest {
    @NotEmpty(message = "Name cannot empty")
    private String fullName;

    @NotEmpty(message = "Email cannot empty")
    private String email;

    @NotEmpty(message = "Phone cannot empty")
    private String phoneNumber;

    @NotEmpty(message = "Address cannot empty")
    private String address;

    private String dateOfBirth;
}
