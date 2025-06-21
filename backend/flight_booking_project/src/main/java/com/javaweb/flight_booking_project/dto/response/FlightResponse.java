package com.javaweb.flight_booking_project.dto.response;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class FlightResponse {
    private Long id;
    private String codeFlight;
    private Date departureTime;
    private Date arrivalTime;
    private String departureAirport;
    private String departureLocation;
    private String arrivalLocation;
    private String arrivalAirport;
    private String codeDepartAirport;
    private String codeArriAirport;
    private String airline;
    private String logoAirline;
    private PlaneResponse plane;
    private int availableEco;
    private int availableBus;
    private double ecoPrice;
    private double busPrice;
    private Boolean status;
    private Long ticketId;
    List<SeatResponse> seats;
    List<LuggageResponse> luggages;

}
