package com.javaweb.flight_booking_project.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TicketRequest {
    @NotNull(message = "Seat class not null")
    private String seatCLass;

    @NotNull(message = "Seat not null")
    private Long seatId;

    @NotNull(message = "Flight not null")
    private Long flightId;

    private Long luggageId;

    @NotNull(message = "Name not null")
    private String name;

    @NotNull(message = "Phone not null")
    private String phone;

    @NotNull(message = "Email not null")
    private String email;

}
