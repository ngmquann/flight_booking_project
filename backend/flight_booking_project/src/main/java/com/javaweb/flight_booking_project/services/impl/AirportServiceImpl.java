package com.javaweb.flight_booking_project.services.impl;


import com.javaweb.flight_booking_project.dto.AirportDto;
import com.javaweb.flight_booking_project.dto.response.AirportResponse;
import com.javaweb.flight_booking_project.models.AirportEntity;
import com.javaweb.flight_booking_project.repositories.AirportRepository;
import com.javaweb.flight_booking_project.services.AirportService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AirportServiceImpl implements AirportService {
    @Autowired
    private AirportRepository airportRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Override
    public void createAirport(AirportDto airportDto) {
        AirportEntity airportEntity = AirportEntity.builder()
                .id(airportDto.getId())
                .name(airportDto.getName())
                .location(airportDto.getLocation())
                .code(airportDto.getCode())
                .build();
        airportRepository.save(airportEntity);
    }

    @Override
    public boolean deleteAirport(Long id)   {
        try {
            AirportEntity airportEntity = airportRepository.findById(id).
                    orElseThrow(()-> new Exception("Airport not found"));
              airportRepository.delete(airportEntity);
              return  true;
        }catch (Exception e){
            return false;
        }
    }

    @Override
    public List<AirportResponse> getAllAirports() {
        List<AirportEntity> airportEntities = airportRepository.findAll();
        List<AirportResponse> airportResponses = new ArrayList<>();
        for (AirportEntity airportEntity : airportEntities) {
            AirportResponse airportResponse = modelMapper.map(airportEntity, AirportResponse.class);
            airportResponses.add(airportResponse);
        }
        return airportResponses;
    }

    @Override
    public AirportResponse getAirportById(Long id) throws Exception {
        AirportEntity airportEntity = airportRepository.findById(id).orElseThrow(()-> new Exception("Airport not found"));
        AirportResponse airportResponse = modelMapper.map(airportEntity, AirportResponse.class);
        return airportResponse;
    }

}
