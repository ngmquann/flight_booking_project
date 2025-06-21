package com.javaweb.flight_booking_project.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Date;

@Data
public class SignUpRequest {
    @NotEmpty(message = "Name cannot empty")
//    @JsonProperty("full_name")
    private String fullName;

    @NotEmpty(message = "Password cannot empty")
    private String password;

    @NotEmpty(message = "Email cannot empty")
    @Email(message = "Invalid email")
    private String email;

//    @JsonProperty("phone_number")
    @NotEmpty(message = "Phone number cannot empty")
    private String phoneNumber;

//    @JsonProperty("date_of_birth")
    private String dateOfBirth;

    private String address;
}
