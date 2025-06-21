package com.javaweb.flight_booking_project.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "flight")
public class FlightEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "arrival_time")
    private Date arrivalTime;

    @Column(name = "departure_time")
    private Date departureTime;

    @Column(name = "arrival_id")
    private Long arrivalId;

    @Column(name = "departure_id")
    private Long departureId;

    @Column(name = "eco_price")
    private double ecoPrice;

    @Column(name = "bus_price")
    private double busPrice;

    @Column(name = "status")
    private Boolean status;


    @ManyToOne
    @JoinColumn(name = "plane_id")
    private PlaneEntity planeEntity;

    @OneToMany(mappedBy = "flightEntity", fetch = FetchType.LAZY)
    private List<TicketEntity> ticketEntityList = new ArrayList<>();

    //
    @ManyToMany
    @JoinTable(
            name = "flight_airport",
            joinColumns = @JoinColumn(name = "flight_id"),
            inverseJoinColumns = @JoinColumn(name = "airport_id")
    )
    private List<AirportEntity> airportEntityList = new ArrayList<>();

    @OneToMany(mappedBy = "flightEntity", fetch = FetchType.LAZY)
    private List<SeatEntity> seatEntityList = new ArrayList<>();

}
