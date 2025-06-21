package com.javaweb.flight_booking_project.services.impl;

import com.javaweb.flight_booking_project.dto.request.LuggageRequest;
import com.javaweb.flight_booking_project.models.LuggageEntity;
import com.javaweb.flight_booking_project.repositories.LuggageRepository;
import com.javaweb.flight_booking_project.services.LuggageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LuggageServiceImpl implements LuggageService {
    @Autowired
    private LuggageRepository luggageRepository;

    @Override
    public void createLuggage(LuggageRequest luggageRequest) {
        LuggageEntity luggageEntity = LuggageEntity.builder()
                .luggageType(luggageRequest.getLuggageType())
                .weight(luggageRequest.getWeight())
                .price(luggageRequest.getPrice())
                .build();
        luggageRepository.save(luggageEntity);
    }

    @Override
    public List<LuggageEntity> getAllLuggages() {
        return luggageRepository.findAll();
    }
}
