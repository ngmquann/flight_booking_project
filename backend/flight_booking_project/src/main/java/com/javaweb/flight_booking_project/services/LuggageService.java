package com.javaweb.flight_booking_project.services;


import com.javaweb.flight_booking_project.dto.request.LuggageRequest;
import com.javaweb.flight_booking_project.models.LuggageEntity;

import java.util.List;

public interface LuggageService {
    void createLuggage(LuggageRequest luggageRequest);
    List<LuggageEntity> getAllLuggages();
}
