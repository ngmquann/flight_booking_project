package com.javaweb.flight_booking_project.repositories;

import com.javaweb.flight_booking_project.models.LuggageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LuggageRepository extends JpaRepository<LuggageEntity, Long> {
}
