package com.javaweb.flight_booking_project.repositories;

import com.javaweb.flight_booking_project.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    UserEntity findByEmail(String email);
}
