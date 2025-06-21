package com.javaweb.flight_booking_project.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class TicketBookedInfo {
    private Long ticketId;
    private double price;
    private String seatNumber;
    private String flightCode;
    private Date arrivalTime;
    private Date departureTime;
    private String arrivalAirportName;
    private String departureAirportName;
    private String airlineName;
    private LocalDate createAt ;
    private String email;
    private String name;
    private String phone;
    private String nameSeat;
    private String seatClass;
    private String logo;
    private double luggage;

    public TicketBookedInfo() {}

    public TicketBookedInfo(Long ticketId, double price, String seatNumber, String flightCode, Date arrivalTime, Date departureTime, String arrivalAirportName, String departureAirportName, String airlineName) {
        this.ticketId = ticketId;
        this.price = price;
        this.seatNumber = seatNumber;
        this.flightCode = flightCode;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.arrivalAirportName = arrivalAirportName;
        this.departureAirportName = departureAirportName;
        this.airlineName = airlineName;
    }
}
