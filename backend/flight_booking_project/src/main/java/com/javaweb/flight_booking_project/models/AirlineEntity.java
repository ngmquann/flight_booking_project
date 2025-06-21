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
@Table(name = "airline")
public class AirlineEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "logo",columnDefinition = "LONGTEXT")
    @Lob
    private String logo;

    //

    @OneToMany(mappedBy = "airlineEntity", fetch = FetchType.LAZY)
    private List<PlaneEntity> planeEntityList = new ArrayList<>();
}
