package com.javaweb.flight_booking_project.dto.response;


import lombok.Data;

import java.util.List;

@Data
public class PlaneResponse {
    private Long id;
    private int ecoClass;
    private int busClass;
    private String name;
    private String nameAirline;
}
