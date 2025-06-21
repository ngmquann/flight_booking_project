package com.javaweb.flight_booking_project.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "seat")
public class SeatEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_number")
    private String seatNumber;

    @Column(name = "seat_class", length = 50)
    private String seatClass;

    @Column(name = "available")
    private boolean available = true;

    //
    @ManyToOne
    @JoinColumn(name = "flight_id")
    private FlightEntity flightEntity;

    @OneToOne(mappedBy = "seat", cascade = CascadeType.ALL)
    private TicketEntity ticketEntity;
}
