package com.javaweb.flight_booking_project.services.impl;

import com.javaweb.flight_booking_project.dto.response.AirportResponse;
import com.javaweb.flight_booking_project.dto.response.HomeResponse;
import com.javaweb.flight_booking_project.models.AirportEntity;
import com.javaweb.flight_booking_project.repositories.AirportRepository;
import com.javaweb.flight_booking_project.repositories.SeatRepository;
import com.javaweb.flight_booking_project.services.AirportService;
import com.javaweb.flight_booking_project.services.HomeService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HomeServiceImpl implements HomeService {
    @Autowired
    private AirportRepository airportRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public HomeResponse getHomeInfo() {
        List<AirportEntity> airportEntities = airportRepository.findAll();
        List<AirportResponse> airportResponses = new ArrayList<>();
        for (AirportEntity airportEntity : airportEntities) {
            AirportResponse airportResponse = modelMapper.map(airportEntity, AirportResponse.class);
            airportResponses.add(airportResponse);
        }
        HomeResponse homeResponse = new HomeResponse();
        homeResponse.setAirportResponses(airportResponses);
        homeResponse.setSeatClasses(seatRepository.getAllSeatClass());

        return homeResponse;
    }
}
