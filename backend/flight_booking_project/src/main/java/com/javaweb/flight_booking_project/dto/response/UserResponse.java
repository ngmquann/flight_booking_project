package com.javaweb.flight_booking_project.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class UserResponse {
    private String fullName;

    private String email;

    private String phoneNumber;

    private String address;

    private LocalDate dateOfBirth;

    private List<TicketBookedInfo> bookingList;
}
