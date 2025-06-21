package com.javaweb.flight_booking_project.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class InfoBookingResponse {
    List<SeatResponse> seatList;
    List<LuggageResponse> luggageList;
}
