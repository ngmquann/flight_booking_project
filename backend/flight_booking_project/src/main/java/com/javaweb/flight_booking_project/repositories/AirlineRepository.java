package com.javaweb.flight_booking_project.repositories;

import com.javaweb.flight_booking_project.models.AirlineEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AirlineRepository extends JpaRepository<AirlineEntity, Long> {
}
