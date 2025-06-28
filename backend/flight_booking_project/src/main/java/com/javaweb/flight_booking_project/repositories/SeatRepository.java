package com.javaweb.flight_booking_project.repositories;

import com.javaweb.flight_booking_project.models.SeatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepository extends JpaRepository<SeatEntity, Long> {
    @Query("SELECT s.seatClass FROM SeatEntity s group by s.seatClass")
    List<String> getAllSeatClass();

    @Query("SELECT s FROM SeatEntity s WHERE s.flightEntity.id = :flightId AND s.seatClass = :seatClass AND s.available = true")
    List<SeatEntity> findByFlightId(long flightId, String seatClass);

    @Query("SELECT s FROM SeatEntity s WHERE s.flightEntity.id = :flightId AND s.seatClass = :seatClass AND s.id = :seatId AND s.available = true")
    List<SeatEntity> findSeatAvailable(long flightId, String seatClass, long seatId);
}
