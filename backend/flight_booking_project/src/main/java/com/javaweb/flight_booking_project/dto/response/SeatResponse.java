package com.javaweb.flight_booking_project.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SeatResponse {
    private Long id;
    private String seatNumber;
    private String seatClass;
    private boolean available;
    private double price;
}
