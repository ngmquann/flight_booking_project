package com.javaweb.flight_booking_project.repositories;

import com.javaweb.flight_booking_project.models.PlaneEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaneRepository extends JpaRepository<PlaneEntity, Long> {
}
