package com.javaweb.flight_booking_project.repositories;

import com.javaweb.flight_booking_project.dto.response.TicketBookedInfo;
import com.javaweb.flight_booking_project.models.TicketEntity;
import com.javaweb.flight_booking_project.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import java.util.List;

public interface TicketRepository extends JpaRepository<TicketEntity, Long> {
    List<TicketEntity> findByUserEntity(UserEntity userEntity);
    @Query("SELECT new com.javaweb.flight_booking_project.dto.response.TicketBookedInfo" +
            "(e.id, e.price, e.seat.seatNumber, e.flightEntity.code, e.flightEntity.arrivalTime, e.flightEntity.departureTime, a.name, d.name, e.flightEntity.planeEntity.airlineEntity.name) " +
            "FROM TicketEntity e " +
            "JOIN AirportEntity a ON e.flightEntity.arrivalId = a.id " +
            "JOIN AirportEntity d ON e.flightEntity.departureId = d.id " +
            "WHERE e.userEntity.id = :userId " +
            "ORDER BY e.id DESC")
    List<TicketBookedInfo> findByUserId(Long userId);


}
