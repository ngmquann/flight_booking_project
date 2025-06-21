package com.javaweb.flight_booking_project.repositories;

import com.javaweb.flight_booking_project.models.AirportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AirportRepository extends JpaRepository<AirportEntity, Long> {
}
