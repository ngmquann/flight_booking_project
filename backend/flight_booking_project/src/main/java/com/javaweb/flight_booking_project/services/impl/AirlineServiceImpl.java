package com.javaweb.flight_booking_project.services.impl;

import com.javaweb.flight_booking_project.dto.request.AirlineRequest;
import com.javaweb.flight_booking_project.dto.response.AirlineResponse;
import com.javaweb.flight_booking_project.models.AirlineEntity;
import com.javaweb.flight_booking_project.repositories.AirlineRepository;
import com.javaweb.flight_booking_project.services.AirlineService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class AirlineServiceImpl implements AirlineService {
    @Autowired
    private AirlineRepository airlineRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Override
    public void createAirline(AirlineRequest airlineRequest) throws IOException {
        AirlineEntity airlineEntity = AirlineEntity.builder()
                .logo(airlineRequest.getLogo())
                .name(airlineRequest.getAirlineName())
                .id(airlineRequest.getId())
                .build();
        airlineRepository.save(airlineEntity);
    }

    @Override
    public boolean deleteAirline(Long id) {
        if (airlineRepository.existsById(id)) {
            airlineRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<AirlineResponse> getAllAirlines() {
        List<AirlineResponse> airlineResponse = new ArrayList<>();
        List<AirlineEntity> airlines = airlineRepository.findAll();
        for (AirlineEntity airlineEntity : airlines) {
            AirlineResponse response = modelMapper.map(airlineEntity, AirlineResponse.class);
            airlineResponse.add(response);
        }
        return airlineResponse;
    }
}
