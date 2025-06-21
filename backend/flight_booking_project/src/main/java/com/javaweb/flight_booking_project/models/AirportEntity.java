package com.javaweb.flight_booking_project.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "airport")
public class AirportEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location")
    private String location;

    @Column(name = "name")
    private String name;

    @Column(name = "code")
    private String code;

    //
    @ManyToMany(mappedBy = "airportEntityList", fetch = FetchType.LAZY)
    private List<FlightEntity> flightEntityList = new ArrayList<>();
}
