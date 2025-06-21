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
@Table(name = "plane")
public class PlaneEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "eco_class")
    private int ecoClass;

    @Column(name = "bus_class")
    private int busClass;

    @Column(name = "name")
    private String name;
    //

    @ManyToOne
    @JoinColumn(name = "airline_id")
    private AirlineEntity airlineEntity;

    @OneToMany(mappedBy = "planeEntity", fetch = FetchType.LAZY)
    private List<FlightEntity> flightEntityList = new ArrayList<>();
}
