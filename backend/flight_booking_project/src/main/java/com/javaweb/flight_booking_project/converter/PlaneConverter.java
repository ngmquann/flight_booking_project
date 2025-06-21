package com.javaweb.flight_booking_project.converter;

import com.javaweb.flight_booking_project.dto.response.PlaneResponse;
import com.javaweb.flight_booking_project.models.PlaneEntity;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class PlaneConverter {
    @Autowired
    private ModelMapper modelMapper;
    public PlaneResponse toPlaneResponse(PlaneEntity planeEntity) {
        PlaneResponse planeResponse = modelMapper.map(planeEntity, PlaneResponse.class);
        return planeResponse;
    }
}
