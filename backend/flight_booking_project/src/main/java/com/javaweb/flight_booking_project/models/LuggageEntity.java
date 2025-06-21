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
@Table(name = "luggage")

public class LuggageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "luggage_type", length = 50)
    private String luggageType;

    @Column(name = "weight")
    private double weight;

    @Column(name = "price")
    private double price;

//
    @OneToMany(mappedBy = "luggageEntity", fetch = FetchType.LAZY)
    private List<TicketEntity> ticketEntities = new ArrayList<>();
}
