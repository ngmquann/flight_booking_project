package com.javaweb.flight_booking_project.services.impl;

import com.javaweb.flight_booking_project.dto.request.PlaneRequest;
import com.javaweb.flight_booking_project.dto.response.AirlineResponse;
import com.javaweb.flight_booking_project.dto.response.PlaneResponse;
import com.javaweb.flight_booking_project.models.AirlineEntity;
import com.javaweb.flight_booking_project.models.PlaneEntity;
import com.javaweb.flight_booking_project.models.SeatEntity;
import com.javaweb.flight_booking_project.repositories.AirlineRepository;
import com.javaweb.flight_booking_project.repositories.PlaneRepository;
import com.javaweb.flight_booking_project.repositories.SeatRepository;
import com.javaweb.flight_booking_project.services.PlaneService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaneServiceImpl implements PlaneService {
    @Autowired
    private PlaneRepository planeRepository;

    @Autowired
    private AirlineRepository airlineRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Override
    public void createPlane(PlaneRequest planeRequest) {
        AirlineEntity airline = airlineRepository.findById(planeRequest.getAirlineId()).orElseThrow(() -> new RuntimeException("Airline not found"));
        PlaneEntity planeEntity = PlaneEntity.builder()
                .id(planeRequest.getId())
                .name(planeRequest.getName())
                .busClass(planeRequest.getBusClass())
                .ecoClass(planeRequest.getEcoClass())
                .airlineEntity(airline)
                .build();
        planeRepository.save(planeEntity);

    }

    @Override
    public List<PlaneResponse> getAllPlanes() {
       List<PlaneEntity> planeEntityList = planeRepository.findAll();
       List<PlaneResponse> planeResponseList = new ArrayList<>();
       for (PlaneEntity planeEntity : planeEntityList) {
           PlaneResponse planeResponse = modelMapper.map(planeEntity, PlaneResponse.class);
           planeResponse.setNameAirline(planeEntity.getAirlineEntity().getName());
           planeResponseList.add(planeResponse);
       }
       return planeResponseList;
    }

    @Override
    public void deletePlane(Long planeId) throws Exception {
        if (!planeRepository.existsById(planeId)) {
            throw new EntityNotFoundException("Plane with ID " + planeId + " does not exist.");
        }
        planeRepository.deleteById(planeId);
    }
}
