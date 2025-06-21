package com.javaweb.flight_booking_project.services;

import com.javaweb.flight_booking_project.dto.request.PlaneRequest;
import com.javaweb.flight_booking_project.dto.response.PlaneResponse;

import java.util.List;

public interface PlaneService {
    void createPlane(PlaneRequest planeRequest);
    List<PlaneResponse> getAllPlanes();
    void deletePlane(Long planeId) throws Exception;
}
