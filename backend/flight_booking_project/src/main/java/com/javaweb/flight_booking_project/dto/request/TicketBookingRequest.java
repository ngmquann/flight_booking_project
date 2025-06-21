package com.javaweb.flight_booking_project.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketBookingRequest {
    @JsonProperty("seat_id")
    @NotNull(message = "Seat not null")
    private Long seatId;

    @JsonProperty("flight_id")
    @NotNull(message = "Flight not null")
    private Long flightId;

    @JsonProperty("luggage")
    private Long luggageId;

    public TicketBookingRequest(Long seatId, Long flightId, Long luggageId, String name, String phone, String email) {
        this.seatId = seatId;
        this.flightId = flightId;
        this.luggageId = luggageId;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    @JsonProperty("name")
    @NotNull(message = "Name not null")
    private String name;

    @JsonProperty("phone")
    @NotNull(message = "Phone not null")
    private String phone;

    @JsonProperty("email")
    @NotNull(message = "Email not null")
    private String email;
}
