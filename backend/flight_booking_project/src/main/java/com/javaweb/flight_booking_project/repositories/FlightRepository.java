package com.javaweb.flight_booking_project.repositories;

import com.javaweb.flight_booking_project.models.FlightEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<FlightEntity,Long> {
    @Query("SELECT f FROM  FlightEntity f JOIN SeatEntity s ON s.flightEntity.id = f.id WHERE f.departureId = :departureAirport AND f.arrivalId = :arrivalAirport AND s.available = true AND f.status = true AND s.seatClass = :seatClass AND FUNCTION('DATE', f.departureTime) = :date AND f.departureTime > CURRENT_TIMESTAMP GROUP BY f.id")
    List<FlightEntity> searchFlight(Long departureAirport, Long arrivalAirport, Date date, String seatClass);
    List<FlightEntity> findAllByStatus(Boolean status);
    List<FlightEntity> findByCodeContainingIgnoreCase(String code);
 }
